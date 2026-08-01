# Cuecard

A shot-planning tool for wedding photographers. Build a pose plan, send the
couple a link, and get back the shot list they actually want.

The pitch in one line: **stop guessing what your couple wants.**

## Running it

```bash
npm install
npm run dev            # http://localhost:3200
npm test               # codec round-trip tests
npm run typecheck
npm run build          # static export to ./out
```

## What's here

| Surface | Path | Notes |
| --- | --- | --- |
| Marketing site | `/` | Landing, pricing, FAQ |
| Pose library | `/poses` | 95 poses, filterable |
| One pose | `/poses/[id]` | Indexable — this is the SEO surface |
| Studio | `/studio` | The photographer's shoots |
| A shoot | `/studio/shoot?id=…` | Poses, share link, replies, shot list |
| The couple's deck | `/deck?d=…` | Swipe screen. No account, no chrome of ours |

## The idea

Every wedding photographer has the same three weeks of Pinterest links and
screenshots before a shoot, and on the day nobody remembers what was agreed.

1. The photographer picks frames from the library into a shoot.
2. They send one link. The couple opens it on a phone and swipes — love, maybe,
   not for us.
3. The couple gets a short code. The photographer pastes it in, and the shot
   list reorders around what was chosen. Poses the couple passed on disappear.

The library is the other half of the product. A reference photo tells you what
the frame looks like; it doesn't help at minute forty of family formals. Every
pose here carries the sentence you say out loud, the light that makes it work,
a focal length, and the mistake that ruins it.

## Architecture

**There is no server, and that is the design, not a shortcut.**

- **Share links carry their own payload.** A deck is encoded into the URL with
  delta-coded varints over catalog indexes — 24 poses fit in 93 characters. The
  couple's reply is a 2-bits-per-pose bitmap with a checksum, which comes back
  as a ~20-character code they can text. See `lib/codec.ts`.
- **Everything else is `localStorage`** (`lib/store.tsx`). No accounts, no
  database, nothing of the customer's on anyone's server.
- **So the whole thing is a static export** and runs on any free static host.
  Note that Vercel's Hobby tier forbids commercial use, so it is not an option
  for a paid product — Cloudflare Pages allows it and has no bandwidth cap.
- **Licences** verify against Polar's unauthenticated `customer-portal`
  endpoint, the only one of the major merchants of record that a browser can
  call with nothing secret in the bundle. A verified licence keeps working for
  30 days offline, because photographers work in fields and barns.

What this costs to run: a domain. That's the whole list.

The honest trade-off, stated on the pricing page rather than buried: shoots
live in one browser, so they don't sync across devices and clearing site data
clears them.

## Content pipeline

Source exports never ship. `scripts/build-images.mjs` turns them into three
WebP variants plus an inline blur placeholder (119 MB → 11.5 MB on the current
library), and `scripts/build-catalog.mjs` merges that manifest with the
editorial layer in `content/pose-meta.json`.

```bash
# Drop new exports into source-images/<category>/ then:
npm run content        # images + catalog
```

New poses are written **before** they are photographed. A pose goes into
`content/pose-queue.json` with its direction, lighting, lens and coaching
notes, plus the `prompt` that generates a matching frame — so the image is made
to fit the words rather than the words guessing at the image.

Once the frames have been generated, their URLs land in
`content/generated-manifest.json` and:

```bash
npm run fetch:generated   # downloads four variants per pose, verifies each decodes
# delete the variants you don't want, keeping the best frame per pose
npm run content
```

The fetch is a separate step because the environment that authors the poses
cannot reach the image CDN. It runs anywhere with ordinary internet.

`content/pose-meta.json` is where the value lives — the direction, lighting,
lens and coaching notes for each pose. `lib/generated/` is derived and safe to
delete.

## Free vs Pro

The free plan runs a whole wedding: the full library at full resolution, 35
poses with complete direction, one shoot, and a 20-pose deck. Pro ($12/mo,
$89/yr) unlocks direction on every pose, unlimited shoots and deck size, the
photographer's own name on the couple's screen, and PDF export.

Prices and plan limits live in `lib/brand.ts`. Nothing else hardcodes them.

## Testing

`npm test` covers the codec — the piece that would silently corrupt a
photographer's shoot if it broke. `scripts/smoke.mjs` drives the real product
end to end in Chromium: plan a shoot, generate the link, swipe the deck on a
phone viewport, paste the reply code, and confirm the shot list reorders.

```bash
npm run dev &
CHROMIUM_PATH=/path/to/chrome node scripts/smoke.mjs
```

## Going live

1. Point `NEXT_PUBLIC_SITE_URL` at the real domain.
2. Create the Pro products in Polar, then set `NEXT_PUBLIC_LICENSE_PROVIDER=polar`,
   `NEXT_PUBLIC_POLAR_ORG_ID`, `NEXT_PUBLIC_CHECKOUT_MONTHLY` and
   `NEXT_PUBLIC_CHECKOUT_YEARLY`.
3. `npm run build` and deploy `out/` to Cloudflare Pages.

Until step 2 is done the pricing page says checkout isn't open yet rather than
dead-ending on a broken link, and the whole free tier works.

See `docs/ROADMAP.md` for what's next and `docs/DECISIONS.md` for why the
stack looks like this.
