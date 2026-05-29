import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { Check, X, ChevronRight, ShieldCheck, Headphones, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "ELD Price & Subscription Cost — Plans",
  description:
    "Simple, month-to-month ELD pricing. AI ELD Basic from $20/truck/month including HOS, driver app, reporting and automated IFTA. Add 24/7 monitoring for $50/truck/month.",
};

const PLANS = [
  {
    name: "Basic",
    price: "$20",
    unit: "/ truck / month",
    tagline: "Everything you need to stay FMCSA-compliant.",
    featured: false,
    cta: "Start free trial",
    features: [
      { t: "Fleet compliance dashboard", in: true },
      { t: "Driver logbook app", in: true },
      { t: "HOS logging", in: true },
      { t: "Inspection (DOT) mode", in: true },
      { t: "Basic reporting", in: true },
      { t: "Automated IFTA", in: true },
      { t: "Active monitoring team", in: false },
    ],
  },
  {
    name: "Monitoring",
    price: "$50",
    unit: "/ truck / month",
    tagline: "Basic, plus a team watching the road with you.",
    featured: true,
    cta: "Book a demo",
    features: [
      { t: "Everything in Basic", in: true },
      { t: "24/7 active monitoring team", in: true },
      { t: "Disconnected-device alerts", in: true },
      { t: "Approaching-HOS-limit alerts", in: true },
      { t: "Real-time compliance-event watch", in: true },
      { t: "Critical-event response in minutes", in: true },
      { t: "Priority support", in: true },
    ],
  },
];

const FAQ = [
  {
    q: "Are there long-term contracts?",
    a: "No. AI ELD is billed month-to-month. As you add or remove trucks, your billing adjusts to match — scale up or down whenever you need.",
  },
  {
    q: "What about hardware costs?",
    a: "We support the Geometris WhereQube as a primary device, plus Pacific Track PT30 and PT40 for fleets with existing hardware. Hardware and any installation work are scoped and agreed upfront — no surprises.",
  },
  {
    q: "How does the free trial work?",
    a: "New customers start with a free 14-day trial that includes full access to the dashboard, logs, reports and driver apps. No commitment required.",
  },
  {
    q: "Is IFTA really included?",
    a: "Yes — automated IFTA reporting is included in the AI ELD Basic plan at no extra cost.",
  },
];

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title={
          <>
            Fair pricing. <span className="gradient-text">No surprises.</span>
          </>
        }
        sub="Transparent, month-to-month plans that scale with your fleet. Start free for 14 days — no contract, cancel anytime."
      />

      <section className="bg-slate-50 py-20">
        <div className="container-x">
          <div className="mx-auto grid max-w-4xl gap-7 md:grid-cols-2">
            {PLANS.map((p) => (
              <div
                key={p.name}
                className={`relative flex flex-col rounded-3xl p-8 ${
                  p.featured
                    ? "border-2 border-brand-500 bg-white shadow-glow"
                    : "border border-slate-200 bg-white shadow-soft"
                }`}
              >
                {p.featured && (
                  <span className="absolute -top-3 left-8 rounded-full bg-gradient-to-r from-brand-600 to-cyanx-500 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow">
                    Most popular
                  </span>
                )}
                <div className="flex items-center gap-2">
                  {p.featured ? (
                    <Headphones className="h-5 w-5 text-brand-600" />
                  ) : (
                    <ShieldCheck className="h-5 w-5 text-brand-600" />
                  )}
                  <h3 className="text-xl font-bold text-ink-800">{p.name}</h3>
                </div>
                <p className="mt-2 text-sm text-slate-500">{p.tagline}</p>
                <div className="mt-6 flex items-end gap-1.5">
                  <span className="text-5xl font-extrabold text-ink-800">{p.price}</span>
                  <span className="mb-2 text-sm text-slate-500">{p.unit}</span>
                </div>

                <ul className="mt-7 flex-1 space-y-3.5">
                  {p.features.map((f) => (
                    <li key={f.t} className="flex items-start gap-3 text-sm">
                      {f.in ? (
                        <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                      ) : (
                        <X className="mt-0.5 h-5 w-5 shrink-0 text-slate-300" />
                      )}
                      <span className={f.in ? "text-slate-700" : "text-slate-400"}>{f.t}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/contact"
                  className={`mt-8 ${p.featured ? "btn-primary" : "btn-ghost"} w-full`}
                >
                  {p.cta} <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>

          <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-slate-500">
            Billed per active truck. Need a quote for a large or mixed fleet?{" "}
            <Link href="/contact" className="font-semibold text-brand-600">
              Talk to our team
            </Link>
            .
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-20">
        <div className="container-x max-w-3xl">
          <h2 className="text-center text-3xl font-extrabold text-ink-800 sm:text-4xl">Pricing questions</h2>
          <div className="mt-10 space-y-4">
            {FAQ.map((f) => (
              <div key={f.q} className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6">
                <h3 className="flex items-start gap-3 text-lg font-bold text-ink-800">
                  <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                  {f.q}
                </h3>
                <p className="mt-2.5 pl-8 leading-relaxed text-slate-600">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
