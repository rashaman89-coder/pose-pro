import type { Metadata } from "next";
import Link from "next/link";
import { Card, Shell } from "@/components/ui";
import CheckoutButtons from "@/components/CheckoutButtons";
import { PLANS, brand, yearlySavingPercent } from "@/lib/brand";
import { catalog } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Pricing",
  description: `${brand.name} is free to run a whole wedding. Pro is $${PLANS.pro.monthly}/month.`,
};

const FAQ = [
  {
    q: "Do my couples need an account?",
    a: "No. They tap the link, swipe through the photos and send you a short code. Nothing to install, nothing to sign up for, and their picks stay between the two of you.",
  },
  {
    q: "Where is my work stored?",
    a: "In your browser, on your device. We don't run a database, so there's no account to lose access to and nothing of yours sitting on our servers. The trade-off is honest: your shoots don't sync between devices, and clearing your browser data clears them.",
  },
  {
    q: "What happens to my shoots if I stop paying?",
    a: "They stay exactly where they are. You keep the full pose library and everything you've planned; you just go back to the free plan's limits for anything new.",
  },
  {
    q: "Will this work at a venue with no signal?",
    a: "Yes. Once the page has loaded, the shot list and every pose note work offline. A verified Pro licence keeps working for 30 days without a connection.",
  },
  {
    q: "Can I use the photos in my own marketing?",
    a: "The library is reference for you and your couples — planning what to shoot. They aren't stock photos to publish as your own work.",
  },
];

export default function PricingPage() {
  const { free, pro } = PLANS;

  return (
    <Shell className="py-12 sm:py-16">
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-4xl sm:text-5xl">
          Free until it earns its keep.
        </h1>
        <p className="mt-4 text-[1rem] leading-relaxed text-ink-soft">
          The free plan runs a whole wedding end to end. Pro is for the point
          where you&apos;re doing this every weekend.
        </p>
      </header>

      <div className="mx-auto mt-12 grid max-w-4xl gap-5 md:grid-cols-2">
        <Card className="flex flex-col p-7">
          <h2 className="font-display text-2xl">{free.name}</h2>
          <p className="mt-1.5 text-[0.88rem] text-ink-soft">{free.blurb}</p>
          <p className="mt-6 font-display text-4xl">$0</p>
          <p className="mt-1 text-[0.8rem] text-ink-faint">No card, no trial clock</p>

          <ul className="mt-7 flex-1 space-y-2.5">
            {free.features.map((f) => (
              <Feature key={f}>{f}</Feature>
            ))}
          </ul>

          <Link
            href="/studio/"
            className="mt-8 inline-flex h-12 items-center justify-center rounded-full
                       border border-border text-[0.92rem] font-medium hover:bg-paper-sunk"
          >
            Start planning
          </Link>
        </Card>

        <Card className="relative flex flex-col border-accent/45 p-7">
          <span className="absolute -top-3 left-7 rounded-full bg-accent px-3 py-1
                           text-[0.68rem] font-semibold uppercase tracking-wider text-accent-ink">
            Pro
          </span>

          <h2 className="font-display text-2xl">{pro.name}</h2>
          <p className="mt-1.5 text-[0.88rem] text-ink-soft">{pro.blurb}</p>

          <div className="mt-6 flex items-baseline gap-2">
            <p className="font-display text-4xl">${pro.monthly}</p>
            <span className="text-[0.85rem] text-ink-soft">/ month</span>
          </div>
          <p className="mt-1 text-[0.8rem] text-ink-faint">
            or ${pro.yearly} a year — {yearlySavingPercent}% off
          </p>

          <ul className="mt-7 flex-1 space-y-2.5">
            {pro.features.map((f) => (
              <Feature key={f} accent>
                {f}
              </Feature>
            ))}
          </ul>

          <CheckoutButtons />
        </Card>
      </div>

      <p className="mx-auto mt-8 max-w-2xl text-center text-[0.82rem] text-ink-faint">
        {catalog.length} poses today, and the library grows every month. Pro
        subscribers get everything added while they&apos;re subscribed.
      </p>

      <section className="mx-auto mt-20 max-w-2xl">
        <h2 className="font-display text-2xl">Questions people actually ask</h2>
        <dl className="mt-7 space-y-7">
          {FAQ.map((item) => (
            <div key={item.q}>
              <dt className="text-[0.98rem] font-semibold">{item.q}</dt>
              <dd className="mt-1.5 text-[0.9rem] leading-relaxed text-ink-soft">
                {item.a}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </Shell>
  );
}

function Feature({
  children,
  accent = false,
}: {
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <li className="flex gap-2.5 text-[0.89rem] leading-relaxed">
      <svg
        viewBox="0 0 24 24"
        className={`mt-0.5 size-4 shrink-0 ${accent ? "text-accent" : "text-ink-faint"}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m5 12 5 5L20 7" />
      </svg>
      <span>{children}</span>
    </li>
  );
}
