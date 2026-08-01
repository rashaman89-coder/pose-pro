import type { PlanId } from "./brand";

/**
 * Entitlement checking for a site with no backend.
 *
 * The checkout provider issues a license key on purchase and emails it to the
 * buyer; the buyer pastes it in once. We verify it against the provider's API,
 * then cache the result locally.
 *
 * Two decisions worth keeping:
 *
 * 1. **Offline grace.** A photographer at a barn venue with no signal must
 *    still open their shot list. A verified licence keeps working for
 *    GRACE_DAYS without a successful re-check, so a dead connection never
 *    locks someone out of the tool they are standing in a field to use.
 *
 * 2. **Provider-agnostic.** The verify call is one function. Switching from
 *    one merchant of record to another is a change to `VERIFY` and nothing
 *    else in the app.
 */

const STORAGE_KEY = "cuecard.entitlement.v1";
const RECHECK_DAYS = 7;
const GRACE_DAYS = 30;

export type LicenseProvider = "polar" | "proxy" | "none";

export interface Entitlement {
  plan: PlanId;
  key?: string;
  email?: string;
  /** ISO date the entitlement was last confirmed against the provider. */
  checkedISO?: string;
  /** ISO date the subscription lapses, when the provider reports one. */
  expiresISO?: string;
  provider?: LicenseProvider;
}

export const FREE: Entitlement = { plan: "free" };

const PROVIDER = (process.env.NEXT_PUBLIC_LICENSE_PROVIDER ??
  "none") as LicenseProvider;

/**
 * Polar's customer-portal validate endpoint takes no API credential, so a
 * static site can call it directly with nothing secret in the bundle.
 *
 * If that call ever turns out to be blocked by CORS from our origin, set
 * NEXT_PUBLIC_LICENSE_PROVIDER=proxy and point NEXT_PUBLIC_LICENSE_VERIFY_URL
 * at a Cloudflare Worker that forwards the same JSON. Nothing else changes.
 */
const POLAR_VALIDATE_URL =
  "https://api.polar.sh/v1/customer-portal/license-keys/validate";
const POLAR_ORG_ID = process.env.NEXT_PUBLIC_POLAR_ORG_ID ?? "";
const PROXY_URL = process.env.NEXT_PUBLIC_LICENSE_VERIFY_URL ?? "";

function endpoint(): string {
  if (PROVIDER === "polar") return POLAR_ORG_ID ? POLAR_VALIDATE_URL : "";
  if (PROVIDER === "proxy") return PROXY_URL;
  return "";
}

function daysBetween(a: Date, b: Date) {
  return Math.abs(a.getTime() - b.getTime()) / 86_400_000;
}

/* ------------------------------------------------------------------ *
 * local cache
 * ------------------------------------------------------------------ */

export function readCached(): Entitlement {
  if (typeof localStorage === "undefined") return FREE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return FREE;
    const parsed = JSON.parse(raw) as Entitlement;
    if (parsed.plan !== "pro") return FREE;

    // An expiry the provider gave us is authoritative and needs no network.
    if (parsed.expiresISO && new Date(parsed.expiresISO) < new Date()) {
      return FREE;
    }
    // Past the grace window an unverifiable licence stops counting.
    if (parsed.checkedISO) {
      const age = daysBetween(new Date(parsed.checkedISO), new Date());
      if (age > GRACE_DAYS) return FREE;
    }
    return parsed;
  } catch {
    return FREE;
  }
}

function writeCached(entitlement: Entitlement) {
  if (typeof localStorage === "undefined") return;
  try {
    if (entitlement.plan === "free") localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, JSON.stringify(entitlement));
  } catch {
    /* Private browsing with storage disabled — the session simply stays free. */
  }
}

export function needsRecheck(entitlement: Entitlement): boolean {
  if (entitlement.plan !== "pro" || !entitlement.checkedISO) return false;
  return daysBetween(new Date(entitlement.checkedISO), new Date()) > RECHECK_DAYS;
}

/* ------------------------------------------------------------------ *
 * provider verification
 * ------------------------------------------------------------------ */

export interface VerifyResult {
  ok: boolean;
  entitlement: Entitlement;
  /** Human-readable reason, shown verbatim when activation fails. */
  message?: string;
}

interface ProviderResponse {
  /** Polar returns the key record itself; `status` is the authority. */
  status?: string;
  expires_at?: string | null;
  customer?: { email?: string | null } | null;
  /** A proxy may answer in its own shape instead. */
  valid?: boolean;
  expiresAt?: string | null;
  email?: string | null;
  error?: string;
  detail?: string;
}

/**
 * Normalises Polar's response and the simpler shape a proxy would return.
 * Both answer the same two questions — is this key live, and when does it
 * lapse — they just disagree on field names.
 */
function readProviderResponse(data: ProviderResponse): {
  valid: boolean;
  expiresISO?: string;
  email?: string;
  error?: string;
} {
  const valid =
    data.status !== undefined ? data.status === "granted" : Boolean(data.valid);
  return {
    valid,
    expiresISO: data.expires_at ?? data.expiresAt ?? undefined,
    email: data.customer?.email ?? data.email ?? undefined,
    error: data.error ?? data.detail,
  };
}

export async function verifyKey(rawKey: string): Promise<VerifyResult> {
  const key = rawKey.trim();
  const url = endpoint();

  if (!key) {
    return { ok: false, entitlement: FREE, message: "Enter your licence key." };
  }

  if (!url) {
    return {
      ok: false,
      entitlement: FREE,
      message:
        "Checkout is not connected yet. Everything on the free tier works — " +
        "licence keys start working the day the store goes live.",
    };
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(
        PROVIDER === "polar"
          ? { key, organization_id: POLAR_ORG_ID }
          : { key },
      ),
    });

    if (!res.ok) {
      return {
        ok: false,
        entitlement: FREE,
        message:
          res.status === 404
            ? "We don't recognise that key. Check it against your receipt email."
            : "Couldn't reach the licence server. Try again in a moment.",
      };
    }

    const parsed = readProviderResponse((await res.json()) as ProviderResponse);

    if (!parsed.valid) {
      return {
        ok: false,
        entitlement: FREE,
        message: parsed.error ?? "That key isn't active any more.",
      };
    }

    const entitlement: Entitlement = {
      plan: "pro",
      key,
      email: parsed.email,
      expiresISO: parsed.expiresISO,
      checkedISO: new Date().toISOString(),
      provider: PROVIDER,
    };
    writeCached(entitlement);
    return { ok: true, entitlement };
  } catch {
    return {
      ok: false,
      entitlement: FREE,
      message: "No connection. Activation needs the internet just this once.",
    };
  }
}

/**
 * Re-checks a cached key in the background. A failure here is deliberately
 * silent: the cached entitlement stands until the grace window runs out, so a
 * flaky venue wifi never downgrades someone mid-shoot.
 */
export async function refreshInBackground(current: Entitlement): Promise<Entitlement> {
  if (current.plan !== "pro" || !current.key || !endpoint()) return current;

  const result = await verifyKey(current.key);
  if (result.ok) return result.entitlement;

  // Provider said the key is dead (as opposed to unreachable) — honour that.
  if (result.message?.includes("isn't active")) {
    writeCached(FREE);
    return FREE;
  }
  return current;
}

export function deactivate(): Entitlement {
  writeCached(FREE);
  return FREE;
}
