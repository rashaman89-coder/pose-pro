# Roadmap

The working backlog. The autonomous loop (`.claude/skills/ship/SKILL.md`) reads
this file, takes the top unchecked item it can finish in one sitting, ships it,
and ticks the box.

Ordering rule: anything that makes the product **sellable** beats anything that
makes it **bigger**. A feature nobody can pay for is a hobby.

---

## Now — blocks launch

- [ ] **Category landing pages.** `/poses/bride/`, `/poses/groom/`,
      `/poses/couple/`, plus one per moment. Right now 95 pose pages have no
      hub between them and the library index, which is the shape search engines
      reward. Each needs 150+ words of real copy, not a filtered grid.
- [ ] **Timeline builder.** `ShotItem.minutes` exists in the types and nothing
      uses it. A photographer needs to hand a couple "portraits take 45
      minutes" before the wedding, not discover it on the day. Sum per moment,
      show a running total, print it with the shot list.
- [ ] **Proper PDF export.** Browser print works but carries the browser's
      header and can't be branded. Generate a clean A4 layout client-side.
      Pro-gated — it's on the pricing page as a Pro feature.
- [ ] **Empty-state onboarding.** A photographer who lands on `/studio` with no
      shoots sees a form. They should see the three-step loop with a one-click
      demo shoot they can send to themselves.

## Next — makes it grow

- [ ] **QR code for the deck link.** Photographers meet couples in person. A
      QR on a phone screen beats reading out a URL. Pure-JS generation, no
      dependency that needs a CDN.
- [ ] **Per-pose notes from the couple.** One optional line of text per loved
      pose ("but outdoors?"). Costs a variable-length field in the reply codec
      and is the single most useful thing the couple could tell you.
- [ ] **Shoot templates.** "Full wedding day", "Elopement", "Engagement". A
      new user's first shoot should not start empty.
- [ ] **Duplicate a shoot.** Photographers reuse their own plan constantly.
- [ ] **Comparison page** — `/vs/pinterest/`. The real competitor is a Pinterest
      board, and that comparison is the honest sales argument.

## Library — the moat

- [ ] **Finish the queued poses.** `content/pose-queue.json` holds 12 poses
      written direction-first, covering the moments the catalog is missing
      entirely (`first-look`, `golden-hour`) and the ones it barely has
      (`ceremony`, `reception`, `bridal-party`, `family`). Three of the twelve
      have images generated and listed in `content/generated-manifest.json`.
      The rest need a generation run — **this needs the Higgsfield MCP, which
      scheduled sessions do not carry**, so it happens in an interactive
      session, not the autonomous loop.
- [ ] **Then run the fetch.** `npm run fetch:generated` on a machine with
      ordinary internet, cull the four variants down to the best one each, then
      `npm run content`. The sandbox cannot do this — see PROGRESS.
- [ ] **Keep growing past 107.** Even with the queue landed, `reception` and
      `ceremony` stay thin. Aim for at least eight poses in every moment so the
      shot list groups into six sections rather than two.
- [ ] **Second category.** Engagement or elopement. Proves the pipeline handles
      more than one, and doubles the SEO surface.
- [ ] **Re-read the direction text.** It was written per batch; a second pass
      should catch repeated phrasings across near-identical frames.

## Health

- [ ] **Accessibility pass.** Keyboard path through the deck, focus traps in
      the dialog, contrast on the gradient captions, screen-reader labels on the
      swipe buttons.
- [ ] **Performance budget.** Measure the library page on a throttled phone.
      95 cards is a lot of DOM; virtualise if it doesn't hold up.
- [ ] **Analytics.** Cloudflare Web Analytics — free, cookieless, no consent
      banner. Needed before any marketing spend to know what converts.
- [ ] **Error boundary.** A corrupt `localStorage` payload currently starts the
      studio empty, which is right, but a React error anywhere else shows the
      default overlay.

## Blocked on the owner

These need an account or a decision only a human can make.

- [ ] Domain, then `NEXT_PUBLIC_SITE_URL`.
- [ ] Polar account + products, then the four checkout env vars. **Run the CORS
      check in `docs/DECISIONS.md` before assuming the browser call works.**
- [ ] Apply for Chicago's Small New Business Exemption.
- [ ] Decide whether the name stays "Cuecard" — it lives in `lib/brand.ts` and
      changing it is a one-file edit.

---

## Done

- [x] Image pipeline: 119 MB of source PNGs to 11.5 MB of responsive WebP.
- [x] 95 poses with direction, lighting, lens and coaching notes.
- [x] Zero-backend share codec, 14 tests, links under 100 characters.
- [x] Pose library with faceted filtering.
- [x] Studio: shoots, pose picking, share link, reply decoding, shot list.
- [x] The couple's deck: swipe, resume, reply code, share sheet.
- [x] Pricing page and provider-agnostic licence layer with offline grace.
- [x] 95 indexable pose pages, sitemap, robots, structured data.
- [x] End-to-end smoke test in a real browser.
