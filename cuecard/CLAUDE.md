# Cuecard — project notes

Shot-planning SaaS for wedding photographers. The photographer builds a pose
plan, sends the couple a link, and gets back the shot list they actually want.

## Boundary — read this first

**This project lives entirely in `cuecard/`. The repository root is a separate,
pre-existing app belonging to the owner and must not be modified.**

The shell's working directory persists between tool calls and has silently
reverted to the repo root before — a `next build` run from there overwrote the
owner's committed `.next/` cache. Always prefix commands:

```bash
cd /home/user/pose-pro/cuecard && npm run build
```

Before every commit, confirm nothing leaked:

```bash
cd /home/user/pose-pro && git status --short --untracked-files=all -- . ':!cuecard'
```

That must print nothing.

## Stack

Next.js 16 App Router · React 19 · TypeScript · Tailwind v4 · **static export**.
No database, no auth, no server. `output: "export"` is load-bearing, not a
convenience — see `docs/DECISIONS.md`.

## Conventions

- **`lib/brand.ts` owns every name, price and plan limit.** Renaming the
  product or moving a price is a one-file change. Nothing else hardcodes them.
- **`components/ui.tsx`** holds the primitives (Button, Card, Input, Chip…).
  Reach for those before writing new chrome.
- Colours are CSS custom properties surfaced through `@theme inline` —
  `paper`, `paper-raised`, `paper-sunk`, `ink`, `ink-soft`, `ink-faint`,
  `accent`, `gold`, `love`, `maybe`. Never a raw hex in a component.
- Display type is `.font-display` (Georgia). No web fonts — this app gets
  opened on venue wifi.
- Comments explain **why**, not what. Load-bearing decisions get a sentence;
  obvious code gets nothing.
- Dynamic routes use query params (`/studio/shoot?id=…`, `/deck?d=…`) because a
  static export can't prerender client-generated ids. `/poses/[id]` is the
  exception — those come from the catalog, so `generateStaticParams` covers them.

## The codec is the risky part

`lib/codec.ts` encodes a deck into a URL and a reply into a short code. If it
breaks subtly, a photographer loses their couple's answers with no error. It
has 14 tests (`npm test`) and any change to the wire format needs a version
bump in `DECK_VERSION` / `REPLY_VERSION` plus a test for the old shape.

Wire format facts worth not rediscovering:
- Deck indexes are delta-coded zigzag varints — 24 poses fit in 93 characters.
- Replies are 2 bits per pose plus a one-byte checksum.
- `decodeReply` tries both readings of the `PP` prefix and lets the checksum
  decide, because chat apps eat the dashes and people paste inconsistently.

## Content pipeline

Source images never ship. `npm run content` regenerates both stages:

1. `scripts/build-images.mjs` — three WebP variants + inline blur placeholder.
   Reads `source-images/<category>/`, or `POSE_SOURCE=/path`.
2. `scripts/build-catalog.mjs` — merges the manifest with
   `content/pose-meta.json` into `lib/generated/catalog.json`.

`content/pose-meta.json` is the hand-authored layer and the actual product
value: what to say out loud, the light, the lens, and what goes wrong.
`lib/generated/` is derived — never edit it by hand.

Free-tier unlocking is computed in `build-catalog.mjs`: five poses per
(subject, framing) bucket keep their direction text on the free plan.

## Before any commit

```bash
cd /home/user/pose-pro/cuecard && npm test && npx tsc --noEmit && npx next build
```

For anything user-visible, also run `scripts/smoke.mjs` **and look at the
screenshots**. A green build proves the code compiles, not that it renders —
every image once sat invisible behind its blur placeholder with the build
perfectly clean.

## Autonomous work

`.claude/skills/ship/SKILL.md` is the iteration loop: read `docs/ROADMAP.md`,
ship the top item, verify, commit, log it in `docs/PROGRESS.md`, stop.
One thing per iteration, finished properly.

## Not wired up yet

Checkout (Polar), the domain, and analytics. All three need an account the
owner has to create. Until then the pricing page says checkout isn't open
rather than dead-ending, and the entire free tier works.
