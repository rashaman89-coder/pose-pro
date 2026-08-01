import test from "node:test";
import assert from "node:assert/strict";
import {
  VERDICT,
  decodeDeck,
  decodeReply,
  deckHash,
  encodeDeck,
  encodeReply,
  fromBase64Url,
  summarizeReply,
  toBase64Url,
  type VerdictValue,
} from "./codec";

test("base64url survives a round trip and stays URL-safe", () => {
  const bytes = Uint8Array.from({ length: 256 }, (_, i) => i);
  const encoded = toBase64Url(bytes);
  assert.match(encoded, /^[A-Za-z0-9_-]+$/, "must not contain +, / or =");
  assert.deepEqual(Array.from(fromBase64Url(encoded)), Array.from(bytes));
});

test("a deck round-trips exactly", () => {
  const deck = {
    title: "Ana & Marko — 12 Sep",
    studio: "Nikola Photography",
    poses: [0, 3, 4, 5, 12, 40, 94],
    note: "Don't overthink it.",
  };
  assert.deepEqual(decodeDeck(encodeDeck(deck)), deck);
});

test("a deck with no note comes back without one", () => {
  const deck = { title: "Test", studio: "Studio", poses: [1, 2, 3] };
  const back = decodeDeck(encodeDeck(deck));
  assert.equal(back.note, undefined);
  assert.deepEqual(back.poses, [1, 2, 3]);
});

test("non-ASCII names survive the trip", () => {
  const deck = {
    title: "Đorđe & Милица — Дан венчања",
    studio: "Фото Студио „Светлост\"",
    poses: [7, 8],
  };
  assert.deepEqual(decodeDeck(encodeDeck(deck)), { ...deck, note: undefined });
});

test("a 40-pose deck link stays short enough to paste anywhere", () => {
  const encoded = encodeDeck({
    title: "Ana & Marko",
    studio: "Nikola Photography",
    poses: Array.from({ length: 40 }, (_, i) => i * 2),
  });
  // SMS bodies and QR codes both get uncomfortable past a few hundred chars.
  assert.ok(encoded.length < 200, `deck payload was ${encoded.length} chars`);
});

test("unsorted and repeated indexes are preserved in order", () => {
  const poses = [50, 2, 2, 94, 0];
  assert.deepEqual(decodeDeck(encodeDeck({ title: "t", studio: "s", poses })).poses, poses);
});

test("a corrupt deck payload throws rather than returning nonsense", () => {
  assert.throws(() => decodeDeck("not-a-real-payload"));
  assert.throws(() => decodeDeck(""));
});

test("a reply round-trips every verdict", () => {
  const verdicts: VerdictValue[] = [
    VERDICT.love, VERDICT.no, VERDICT.maybe, VERDICT.unseen,
    VERDICT.love, VERDICT.love, VERDICT.no,
  ];
  const back = decodeReply(encodeReply({ deckHash: 1234, verdicts }));
  assert.equal(back.deckHash, 1234);
  assert.deepEqual(back.verdicts, verdicts);
});

test("a reply code is short enough for someone to text", () => {
  const verdicts: VerdictValue[] = new Array(40).fill(VERDICT.love);
  const code = encodeReply({ deckHash: 999, verdicts });
  assert.ok(code.startsWith("PP-"));
  assert.ok(code.length < 60, `reply code was ${code.length} chars`);
});

test("a reply decodes however the couple managed to paste it", () => {
  const verdicts: VerdictValue[] = [VERDICT.love, VERDICT.maybe, VERDICT.no];
  const code = encodeReply({ deckHash: 77, verdicts });

  // Dashes and the PP prefix are presentation. Chat apps eat both, and people
  // paste with stray whitespace around the edges.
  assert.deepEqual(decodeReply(code).verdicts, verdicts);
  assert.deepEqual(decodeReply(code.replace(/-/g, "")).verdicts, verdicts);
  assert.deepEqual(
    decodeReply(code.replace(/-/g, "").replace(/^PP/, "")).verdicts,
    verdicts,
  );
  assert.deepEqual(decodeReply(`  ${code}\n`).verdicts, verdicts);
});

test("a mistyped reply code is rejected instead of silently misread", () => {
  const code = encodeReply({
    deckHash: 42,
    verdicts: [VERDICT.love, VERDICT.no, VERDICT.maybe, VERDICT.love],
  });
  // Drop a character from the middle, the way a bad copy/paste would.
  const broken = code.slice(0, 8) + code.slice(9);
  assert.throws(() => decodeReply(broken), /mistyped|short|Unsupported/);
});

test("deck hash distinguishes different pose sets", () => {
  assert.notEqual(deckHash([1, 2, 3]), deckHash([1, 2, 4]));
  assert.notEqual(deckHash([1, 2, 3]), deckHash([3, 2, 1]));
  assert.equal(deckHash([1, 2, 3]), deckHash([1, 2, 3]));
});

test("summary counts verdicts and reports completion", () => {
  const summary = summarizeReply([
    VERDICT.love, VERDICT.love, VERDICT.maybe,
    VERDICT.no, VERDICT.unseen, VERDICT.unseen,
  ]);
  assert.equal(summary.love, 2);
  assert.equal(summary.maybe, 1);
  assert.equal(summary.no, 1);
  assert.equal(summary.unseen, 2);
  assert.equal(summary.answered, 4);
  assert.equal(summary.completion, 67);
});

test("an empty reply reports zero completion rather than dividing by zero", () => {
  const summary = summarizeReply([]);
  assert.equal(summary.completion, 0);
  assert.equal(summary.total, 0);
});
