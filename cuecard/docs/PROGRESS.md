# Progress log

Newest first. One entry per autonomous iteration — what shipped, why, and
anything the next iteration or the owner needs to know.

---

## 2026-08-01 — Twelve new poses, written before they were photographed

The catalog's worst problem was coverage, not count: 87 of 95 poses sat in
`portraits`, while `first-look` and `golden-hour` had literally none. The shot
list grouped into two sections instead of six, which undersells the feature
that sells the product.

Twelve new poses now exist in `content/pose-queue.json` covering exactly those
gaps, plus `bridal-party` and `family` — two subjects the type system has
always allowed and the library never had.

**The method changed, and it's better.** The first 95 were photographed and
then described. These were written first and the image prompt derived from the
finished direction, so the frame is made to match the words rather than the
words guessing at the frame. It also means the writing — the part people
actually pay for — doesn't wait on image generation.

**The constraint that shaped this run:** generation works and costs almost
nothing (0.12 credits for four 2K images), but this sandbox's egress allowlist
does not include the image CDN, so generated files cannot be pulled in here.
Higgsfield's own sandbox can reach them, which confirmed the images are real
and decode correctly — but there is no sanctioned path from there into this
repository. Rather than smuggle megabytes of base64 through a transcript, the
URLs are committed and `npm run fetch:generated` pulls them wherever there is
ordinary internet.

All twelve now have four generated frames each — 48 images, and every URL was
confirmed to return 200 before committing. That check earned its keep: one URL
404'd because the filename timestamp is **not** uniform across a batch. Three
siblings landed on one second and the fourth on the next. Anyone regenerating
should read each URL back individually rather than deriving it from a batch.

Cost for the whole run was under three credits.

The queue pipeline crosses three naming conventions (hand-written pose id →
fetch filename → image-build slug) and that join runs on the owner's machine
where a failure would be invisible to me. It has five tests.

**Unverified and worth an eye:** I could not see any generated image. The
prompts are detailed and the model is Higgsfield's editorial portrait model,
but nobody has confirmed the look matches the existing library. Check that
before culling the variants.

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
