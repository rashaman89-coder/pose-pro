# Decisions

Why the stack looks the way it does. Written down so a future change is a
choice rather than an accident.

## No server

The core loop — photographer builds a deck, couple responds — is encoded into
the URL and a short reply code. That removes the database, the accounts, the
auth, the hosting bill and the outage surface all at once.

The costs of this are real and we accept them:

- Shoots live in one browser. No sync, and clearing site data clears them.
  This is stated plainly on the pricing page, not buried.
- We can't email a couple a reminder to finish their deck.
- We have no analytics on individual decks, so "did they open it" is invisible.

The benefit is that the product cannot go down, cannot leak a customer's data
(we hold none), and costs a domain to run. For a solo founder with no revenue
yet, that trade is correct. Revisit if customers start asking for sync — at
which point Supabase is the natural addition, and `lib/store.tsx` is the only
file that would need to change.

## Not Vercel

Vercel's Hobby tier is the default home for a Next.js app and it explicitly
prohibits commercial use — their Fair Use guidelines define that broadly enough
to include "a paid contractor writing the code." A SaaS with paying customers
on Hobby is a terms violation from the first sale.

Cloudflare Pages permits commercial use on the free tier and has no bandwidth
cap, which matters for an image-heavy gallery. Netlify's September 2025 credit
model works out to roughly 15 GB/month, which this would burn through.

## Polar for checkout

The seller is US-based and will sell to EU consumers. A non-EU seller owes EU
VAT from the first euro — the €10,000 threshold in Article 59c applies only to
sellers established inside the EU. DIY compliance runs $850–$2,100/year in
software and accountant time, so a merchant of record is cheaper than doing it
ourselves until roughly $6K MRR.

Among merchants of record, Polar is the only one whose licence-validation
endpoint is documented as safe to call from a public client. Every other option
(Creem, Gumroad, Lemon Squeezy) needs an API key, which means a server, which
would undo the decision above. Lemon Squeezy is additionally being folded into
Stripe Managed Payments and is not worth building on.

If Polar's endpoint turns out to be CORS-blocked from our origin, the fallback
is a ~30-line Cloudflare Worker proxy: set `NEXT_PUBLIC_LICENSE_PROVIDER=proxy`
and point `NEXT_PUBLIC_LICENSE_VERIFY_URL` at it. `lib/license.ts` already
handles both.

**Open question for an accountant:** Chicago's Personal Property Lease
Transaction Tax rose to 15% on 1 Jan 2026 and covers SaaS. It is imposed on the
customer but collected by the seller, and a Chicago business is also liable as
a *lessee* on its own cloud tools. Chicago's Small New Business Exemption
(under $25M revenue, under 60 months old, valid business licence) removes both
obligations — but it must be applied for and renewed every two years.

## System fonts

The interface uses Georgia for display and the system sans stack for body text.
A web font would look marginally better and introduces a build-time network
dependency and a flash of unstyled text. This app is opened on venue wifi.

## Direction text is the product

The images are reference. What a photographer pays for is knowing what to *say*
to get the frame, which is why every pose carries a spoken cue, a lighting
note, a focal length and its most common failure.

This is also why 35 poses are fully unlocked and Pro poses still publish their
opening sentence: the writing has to be judged before anyone will pay for it,
and a blank wall gives a search engine nothing to index.

## Offline grace on licences

A verified Pro licence keeps working for 30 days without a successful
re-check, and a failed check is silent. A photographer standing in a field with
one bar should never be told their shot list is locked. The provider explicitly
reporting a dead key is the only thing that downgrades someone.
