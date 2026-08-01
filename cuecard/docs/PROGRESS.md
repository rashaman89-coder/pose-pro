# Progress log

Newest first. One entry per autonomous iteration — what shipped, why, and
anything the next iteration or the owner needs to know.

---

## 2026-08-01 — Foundation: the whole loop, working end to end

Built Cuecard from nothing to a product a photographer could actually use
today. The bet: the valuable thing isn't a pose gallery (Pinterest is free and
better at that) but the *collaboration loop* — plan, send, get an answer back,
shoot the list they helped write.

Shipped: the image pipeline (119 MB → 11.5 MB), 95 poses with real posing
direction, the zero-backend share codec, the pose library, the studio, the
couple's swipe deck, the pricing page and licence layer, and 95 indexable pose
pages with sitemap and robots.

**The architectural call worth remembering:** encoding the deck into the URL and
the reply into a short code removes the database, accounts and hosting bill from
the core loop. A 24-pose deck is 93 characters; a 20-pose reply is 20. This is
what lets the free tier be genuinely free and the product be unable to go down.

Two bugs caught by actually looking at browser screenshots rather than trusting
a green build: every image was stuck invisible behind its blur placeholder
(cached `<img>` fires `load` before React attaches the handler), and a reply
code pasted without its dashes was unreadable. Both are now covered — the
second by a test.

**Known content gap:** the catalog is 87 `portraits` against 1 `ceremony` and 2
`reception`, because the source images are all studio work. The shot list
groups into two sections instead of six, which undersells the feature. Growing
the thin moments is the highest-value library work and it's on the roadmap.

**Needs the owner:** a domain, a Polar account, and the CORS check in
`DECISIONS.md` before the licence path can be trusted. Everything on the free
tier works without any of that.
