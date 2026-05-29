import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { Compass, BrainCircuit, Headphones, HandCoins, ChevronRight, Target, Eye } from "lucide-react";

export const metadata: Metadata = {
  title: "About — Premium Electronic Logging Device Company",
  description:
    "AI ELD is a premium FMCSA-compliant ELD company built on intuitive design, an AI diagnostic assistant, 24/7 support and fair month-to-month subscriptions for modern fleets.",
};

const PILLARS = [
  {
    icon: Compass,
    title: "Intuitive by design",
    body: "A map-driven dashboard and driver apps that mirror real-world workflows — so people actually want to use them.",
  },
  {
    icon: BrainCircuit,
    title: "Diagnostic AI",
    body: "An AI assistant focused on vehicle codes and compliance risk, surfacing problems earlier and pointing to the fix.",
  },
  {
    icon: Headphones,
    title: "24/7 support & monitoring",
    body: "Round-the-clock help, plus optional monitoring that resolves critical events within minutes.",
  },
  {
    icon: HandCoins,
    title: "Fair subscriptions",
    body: "Month-to-month pricing instead of long-term contracts. Scale up or down as your fleet changes.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About AI ELD"
        title={
          <>
            A premium ELD, built for <span className="gradient-text">modern trucking.</span>
          </>
        }
        sub="We pair an FMCSA-compliant logging device with intuitive software, diagnostic AI and 24/7 support — and we price it fairly. The result: fleets that average a 96% FMCSA safety score."
      />

      {/* story */}
      <section className="bg-white py-20">
        <div className="container-x grid gap-12 lg:grid-cols-[1.3fr_1fr]">
          <div className="space-y-5 text-lg leading-relaxed text-slate-600">
            <p>
              AI ELD exists because compliance shouldn't mean clunky software, surprise fees and contracts you
              can't get out of. We set out to build the ELD we'd want to run our own fleet on.
            </p>
            <p>
              That means a platform that combines ELD logs, a real-time dashboard, reports and diagnostic
              insights in one place — so your team spends less time firefighting and more time running the
              business. It means apps that stay reliable over long duty cycles and inconsistent network
              conditions. And it means support that's actually there when you need it.
            </p>
            <p>
              Whether you're an owner-operator, a growing fleet or a large multi-location carrier, you get the
              same core platform, the same visibility and the same support — priced month to month.
            </p>
          </div>

          <div className="space-y-5">
            <div className="rounded-3xl border border-slate-200 bg-slate-50/60 p-7">
              <Target className="h-7 w-7 text-brand-600" />
              <h3 className="mt-4 text-lg font-bold text-ink-800">Our mission</h3>
              <p className="mt-2 text-slate-600">
                Make compliance the easy part of running a fleet — through smarter software and honest pricing.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50/60 p-7">
              <Eye className="h-7 w-7 text-brand-600" />
              <h3 className="mt-4 text-lg font-bold text-ink-800">Our promise</h3>
              <p className="mt-2 text-slate-600">
                No long-term contracts, no hidden fees — just a platform that earns its place in your cab every
                day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* pillars */}
      <section className="bg-slate-50 py-20">
        <div className="container-x">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold text-ink-800 sm:text-4xl">What sets us apart</h2>
            <p className="mt-4 text-lg text-slate-600">Four principles behind every release.</p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map((p) => (
              <div key={p.title} className="card-lift p-7">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-cyanx-500 text-white shadow-glow">
                  <p.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-ink-800">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* stat band */}
      <section className="relative overflow-hidden bg-ink-900 py-20">
        <div className="glow-blob h-80 w-80 bg-brand-600/25" style={{ top: "0", left: "10%" }} />
        <div className="container-x relative z-10 grid gap-8 text-center sm:grid-cols-3">
          {[
            { v: "96%", l: "Average FMCSA safety score" },
            { v: "24/7", l: "Support & monitoring" },
            { v: "$20/mo", l: "Starting price per truck" },
          ].map((s) => (
            <div key={s.l}>
              <p className="text-5xl font-extrabold text-white">
                <span className="gradient-text">{s.v}</span>
              </p>
              <p className="mt-2 text-slate-400">{s.l}</p>
            </div>
          ))}
        </div>
        <div className="container-x relative z-10 mt-12 text-center">
          <Link href="/contact" className="btn-primary text-base">
            Start your free trial <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
