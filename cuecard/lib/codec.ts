/**
 * Binary codec for shareable decks and client replies.
 *
 * Everything a shared link needs lives inside the URL itself, and everything a
 * couple sends back fits in a short code they can paste into a chat. That keeps
 * the whole sharing loop working with no database, no accounts and no server
 * cost — which is what lets the free tier stay free forever.
 */

const DECK_VERSION = 1;
const REPLY_VERSION = 1;

/** Verdict a client gives a pose while swiping. Two bits on the wire. */
export const VERDICT = {
  unseen: 0,
  no: 1,
  maybe: 2,
  love: 3,
} as const;

export type VerdictName = keyof typeof VERDICT;
export type VerdictValue = (typeof VERDICT)[VerdictName];

export const VERDICT_NAMES = ["unseen", "no", "maybe", "love"] as const;

export interface DeckPayload {
  /** Shoot name the photographer chose, e.g. "Ana & Marko — 12 Sep". */
  title: string;
  /** Studio/photographer name shown to the client. */
  studio: string;
  /** Catalog indexes, in the order the client will see them. */
  poses: number[];
  /** Optional free-text note shown on the deck's intro screen. */
  note?: string;
}

export interface ReplyPayload {
  /** Guards against a reply being pasted onto the wrong deck. */
  deckHash: number;
  verdicts: VerdictValue[];
}

/* ------------------------------------------------------------------ *
 * byte writer / reader
 * ------------------------------------------------------------------ */

class Writer {
  private bytes: number[] = [];

  u8(v: number) {
    this.bytes.push(v & 0xff);
    return this;
  }

  u16(v: number) {
    this.bytes.push((v >> 8) & 0xff, v & 0xff);
    return this;
  }

  /** LEB128-style varint — small numbers cost one byte. */
  varint(v: number) {
    let n = v >>> 0;
    while (n >= 0x80) {
      this.bytes.push((n & 0x7f) | 0x80);
      n >>>= 7;
    }
    this.bytes.push(n);
    return this;
  }

  str(s: string) {
    const utf8 = new TextEncoder().encode(s);
    this.varint(utf8.length);
    for (const b of utf8) this.bytes.push(b);
    return this;
  }

  raw(arr: number[] | Uint8Array) {
    for (const b of arr) this.bytes.push(b & 0xff);
    return this;
  }

  done(): Uint8Array {
    return Uint8Array.from(this.bytes);
  }
}

class Reader {
  private i = 0;
  constructor(private buf: Uint8Array) {}

  private need(n: number) {
    if (this.i + n > this.buf.length) throw new RangeError("truncated payload");
  }

  u8() {
    this.need(1);
    return this.buf[this.i++];
  }

  u16() {
    this.need(2);
    return (this.buf[this.i++] << 8) | this.buf[this.i++];
  }

  varint() {
    let result = 0;
    let shift = 0;
    for (;;) {
      this.need(1);
      const b = this.buf[this.i++];
      result |= (b & 0x7f) << shift;
      if ((b & 0x80) === 0) break;
      shift += 7;
      if (shift > 35) throw new RangeError("varint too long");
    }
    return result >>> 0;
  }

  str() {
    const len = this.varint();
    this.need(len);
    const slice = this.buf.subarray(this.i, this.i + len);
    this.i += len;
    return new TextDecoder().decode(slice);
  }

  rest() {
    return this.buf.subarray(this.i);
  }

  get remaining() {
    return this.buf.length - this.i;
  }
}

/* ------------------------------------------------------------------ *
 * base64url — URL and copy/paste safe, no padding
 * ------------------------------------------------------------------ */

export function toBase64Url(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  const b64 =
    typeof btoa === "function"
      ? btoa(bin)
      : Buffer.from(bytes).toString("base64");
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function fromBase64Url(s: string): Uint8Array {
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/");
  const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
  if (typeof atob === "function") {
    const bin = atob(padded);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }
  return new Uint8Array(Buffer.from(padded, "base64"));
}

/* ------------------------------------------------------------------ *
 * hashing / checksums
 * ------------------------------------------------------------------ */

/** FNV-1a. Not cryptographic — it only needs to catch mismatched pastes. */
export function hash16(input: string | number[]): number {
  const data =
    typeof input === "string" ? new TextEncoder().encode(input) : Uint8Array.from(input);
  let h = 0x811c9dc5;
  for (const b of data) {
    h ^= b;
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h & 0xffff;
}

export function deckHash(poses: number[]): number {
  return hash16(poses.join(","));
}

/* ------------------------------------------------------------------ *
 * deck: photographer -> client (lives in the URL)
 * ------------------------------------------------------------------ */

export function encodeDeck(deck: DeckPayload): string {
  const w = new Writer();
  w.u8(DECK_VERSION);
  w.str(deck.title.slice(0, 120));
  w.str(deck.studio.slice(0, 80));
  w.str((deck.note ?? "").slice(0, 400));
  w.varint(deck.poses.length);
  // Indexes are sorted-agnostic but usually near each other, so delta encoding
  // keeps most of them down to a single byte.
  let prev = 0;
  for (const idx of deck.poses) {
    w.varint(zigzag(idx - prev));
    prev = idx;
  }
  return toBase64Url(w.done());
}

export function decodeDeck(encoded: string): DeckPayload {
  const r = new Reader(fromBase64Url(encoded));
  const version = r.u8();
  if (version !== DECK_VERSION) {
    throw new Error(`Unsupported deck version ${version}`);
  }
  const title = r.str();
  const studio = r.str();
  const note = r.str();
  const count = r.varint();
  if (count > 2000) throw new RangeError("deck too large");
  const poses: number[] = [];
  let prev = 0;
  for (let i = 0; i < count; i++) {
    const idx = prev + unzigzag(r.varint());
    if (idx < 0) throw new RangeError("negative pose index");
    poses.push(idx);
    prev = idx;
  }
  return { title, studio, poses, note: note || undefined };
}

/** Maps signed deltas onto unsigned varints without wasting the high bits. */
function zigzag(n: number): number {
  return n < 0 ? -n * 2 - 1 : n * 2;
}

function unzigzag(n: number): number {
  return n % 2 === 1 ? -(n + 1) / 2 : n / 2;
}

/* ------------------------------------------------------------------ *
 * reply: client -> photographer (short pasteable code)
 * ------------------------------------------------------------------ */

export function encodeReply(reply: ReplyPayload): string {
  const w = new Writer();
  w.u8(REPLY_VERSION);
  w.u16(reply.deckHash);
  w.varint(reply.verdicts.length);

  // Four verdicts per byte.
  for (let i = 0; i < reply.verdicts.length; i += 4) {
    let packed = 0;
    for (let j = 0; j < 4; j++) {
      const v = reply.verdicts[i + j] ?? VERDICT.unseen;
      packed |= (v & 0b11) << (j * 2);
    }
    w.u8(packed);
  }

  const body = w.done();
  const check = hash16(Array.from(body)) & 0xff;
  const full = new Uint8Array(body.length + 1);
  full.set(body);
  full[body.length] = check;

  return groupCode(toBase64Url(full));
}

export function decodeReply(code: string): ReplyPayload {
  const compact = code.trim().replace(/[\s-]/g, "");

  // The "PP" is branding, not data — but a real payload can legitimately begin
  // with those two characters too. Rather than guess, try both readings and let
  // the checksum decide. That way the code survives being pasted with dashes,
  // without them, or with the prefix already stripped by a chat app.
  const candidates = /^PP/i.test(compact) ? [compact.slice(2), compact] : [compact];

  let lastError: unknown;
  for (const candidate of candidates) {
    try {
      return parseReply(candidate);
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError instanceof Error ? lastError : new Error("Code is unreadable");
}

function parseReply(cleaned: string): ReplyPayload {
  let full: Uint8Array;
  try {
    full = fromBase64Url(cleaned);
  } catch {
    // atob throws its own opaque error on a stray character. The person
    // reading this is a photographer holding a phone, not a developer.
    throw new Error("This code looks mistyped — check for a missing character");
  }
  if (full.length < 5) throw new Error("Code is too short");

  const body = full.subarray(0, full.length - 1);
  const check = full[full.length - 1];
  if ((hash16(Array.from(body)) & 0xff) !== check) {
    throw new Error("This code looks mistyped — check for a missing character");
  }

  const r = new Reader(body);
  const version = r.u8();
  if (version !== REPLY_VERSION) {
    throw new Error(`Unsupported reply version ${version}`);
  }
  const hashValue = r.u16();
  const count = r.varint();
  if (count > 4000) throw new RangeError("reply too large");

  const packedBytes = r.rest();
  const verdicts: VerdictValue[] = [];
  for (let i = 0; i < count; i++) {
    const byte = packedBytes[Math.floor(i / 4)] ?? 0;
    verdicts.push(((byte >> ((i % 4) * 2)) & 0b11) as VerdictValue);
  }

  return { deckHash: hashValue, verdicts };
}

/** `PP-XXXX-XXXX-XXXX` reads back over the phone without mistakes. */
function groupCode(raw: string): string {
  const chunks = raw.match(/.{1,4}/g) ?? [raw];
  return `PP-${chunks.join("-")}`;
}

/* ------------------------------------------------------------------ *
 * helpers used by the UI
 * ------------------------------------------------------------------ */

export function summarizeReply(verdicts: VerdictValue[]) {
  const counts = { unseen: 0, no: 0, maybe: 0, love: 0 };
  for (const v of verdicts) counts[VERDICT_NAMES[v]] += 1;
  const answered = verdicts.length - counts.unseen;
  return {
    ...counts,
    answered,
    total: verdicts.length,
    completion: verdicts.length ? Math.round((answered / verdicts.length) * 100) : 0,
  };
}
