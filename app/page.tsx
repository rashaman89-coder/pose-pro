import Link from "next/link";
import DashboardMockup from "@/components/DashboardMockup";
import {
  ChevronRight,
  ShieldCheck,
  Smartphone,
  Map,
  BrainCircuit,
  Headphones,
  Clock,
  FileText,
  ScanLine,
  Fuel,
  Navigation,
  CheckCircle2,
  User,
  Building2,
  Network,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const STATS = [
  { value: "96%", label: "Average FMCSA safety score across fleets" },
  { value: "14-day", label: "Free trial with full dashboard access" },
  { value: "24/7", label: "Support & optional active monitoring" },
  { value: "$20", label: "Per truck / month — no long-term contract" },
];

const PLATFORM = [
  {
    icon: Map,
    title: "Map-driven fleet dashboard",
    body: "See every truck in real time. ELD logs, locations, HOS clocks and alerts live in one map-first view, so dispatch spends less time firefighting.",
  },
  {
    icon: Smartphone,
    title: "Driver-friendly mobile apps",
    body: "Apps built to mirror real-world workflows and stay reliable over long duty cycles and spotty networks — logs, inspections and status changes in a tap.",
  },
  {
    icon: BrainCircuit,
    title: "Diagnostic AI assistant",
    body: "An AI assistant focused on vehicle codes and compliance risk surfaces issues earlier and points your team straight to the resolution.",
  },
  {
    icon: Headphones,
    title: "24/7 monitoring & support",
    body: "An optional monitoring team watches for disconnected devices, approaching HOS limits and violations — resolving critical events within minutes.",
  },
];

const FEATURES = [
  { icon: Clock, title: "HOS logging", body: "Automatic hours-of-service tracking that keeps drivers within FMCSA limits." },
  { icon: ScanLine, title: "Roadside inspection mode", body: "A clean, secure inspection view ready for DOT officers in seconds." },
  { icon: FileText, title: "DVIR inspections", body: "Pre- and post-trip inspection reports captured straight from the app." },
  { icon: Fuel, title: "Automated IFTA", body: "Mileage and fuel data compiled into IFTA-ready reports — included." },
  { icon: Navigation, title: "Real-time GPS", body: "Onboard GPS with local event storage and live fleet visibility." },
  { icon: FileText, title: "Logs & exports", body: "Generate, review and export driver logs with automated tooling." },
];

const SEGMENTS = [
  {
    icon: User,
    title: "Owner-operators",
    body: "Everything you need to stay compliant solo — simple pricing, a driver app that just works, and support whenever you need it.",
  },
  {
    icon: Building2,
    title: "Small & midsize fleets",
    body: "Scale up or down month to month. Add monitoring when you want a team watching the road with you.",
  },
  {
    icon: Network,
    title: "Large multi-location carriers",
    body: "The same core platform, visibility and support across every terminal and division — enforced at the system level.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Plug in the device",
    body: "Plug-and-play hardware connects to the diagnostic port in minutes — no tools, no downtime. Bring your own Pacific Track PT30/PT40 or start fresh.",
  },
  {
    n: "02",
    title: "Drivers go live",
    body: "Drivers install the app and start logging immediately. Logs, inspections and statuses sync automatically to the fleet dashboard.",
  },
  {
    n: "03",
    title: "Stay ahead of compliance",
    body: "Diagnostic AI and optional 24/7 monitoring flag risk early, so you fix small issues before they become violations.",
  },
];

function SectionHead({
  eyebrow,
  title,
  sub,
  light,
  center,
}: {
  eyebrow: string;
  title: React.ReactNode;
  sub?: string;
  light?: boolean;
  center?: boolean;
}) {
  return (
    <div className={`${center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}`}>
      <span className={light ? "eyebrow-dark" : "eyebrow"}>
        <Sparkles className="h-3.5 w-3.5" /> {eyebrow}
      </span>
      <h2
        className={`mt-5 text-3xl font-extrabold leading-[1.1] sm:text-4xl md:text-[2.7rem] ${
          light ? "text-white" : "text-ink-800"
        }`}
      >
        {title}
      </h2>
      {sub && <p className={`mt-4 text-lg leading-relaxed ${light ? "text-slate-300" : "text-slate-600"}`}>{sub}</p>}
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      {/* ---------------- HERO ---------------- */}
      <section className="relative overflow-hidden bg-ink-900 pb-20 pt-14 sm:pt-20">
        <div className="absolute inset-0 bg-grid-dark [background-size:38px_38px] opacity-50" />
        <div className="glow-blob h-[420px] w-[420px] bg-brand-600/35" style={{ top: "-120px", left: "-60px" }} />
        <div className="glow-blob h-[380px] w-[380px] bg-cyanx-500/25" style={{ top: "40px", right: "-80px" }} />

        <div className="container-x relative z-10 grid items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
          <div className="animate-riseIn">
            <span className="eyebrow-dark">
              <ShieldCheck className="h-3.5 w-3.5" /> FMCSA-compliant ELD platform
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] text-white sm:text-5xl md:text-6xl">
              The ELD that thinks <span className="gradient-text">like your best dispatcher.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
              AI ELD combines an FMCSA-compliant logging device with a map-driven fleet dashboard, reliable
              driver apps and diagnostic AI — so your team spends less time firefighting and more time
              running the business.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className="btn-primary text-base">
                Start free 14-day trial <ChevronRight className="h-4 w-4" />
              </Link>
              <Link href="/pricing" className="btn-dark text-base">
                View pricing
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-400">
              {["No long-term contracts", "Setup in minutes", "Cancel anytime"].map((t) => (
                <span key={t} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-cyanx-400" /> {t}
                </span>
              ))}
            </div>
          </div>

          <div className="relative animate-riseIn lg:animate-float [animation-delay:120ms]">
            <DashboardMockup />
          </div>
        </div>
      </section>

      {/* ---------------- STATS BAR ---------------- */}
      <section className="relative z-10 border-b border-slate-200 bg-white">
        <div className="container-x grid grid-cols-2 gap-px overflow-hidden lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="px-2 py-8 text-center sm:px-6">
              <p className="text-3xl font-extrabold text-ink-800 sm:text-4xl">
                <span className="gradient-text">{s.value}</span>
              </p>
              <p className="mx-auto mt-2 max-w-[16rem] text-sm leading-snug text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- PLATFORM ---------------- */}
      <section id="platform" className="bg-slate-50 py-24">
        <div className="container-x">
          <SectionHead
            eyebrow="One connected platform"
            title={
              <>
                Compliance, visibility and intelligence — <span className="gradient-text">in one place.</span>
              </>
            }
            sub="ELD logs, a real-time dashboard, reports and diagnostic insights work together so nothing slips through the cracks."
          />

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {PLATFORM.map((f) => (
              <div key={f.title} className="card-lift group p-7">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-cyanx-500 text-white shadow-glow transition-transform group-hover:scale-105">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-ink-800">{f.title}</h3>
                <p className="mt-2.5 leading-relaxed text-slate-600">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- FEATURES GRID ---------------- */}
      <section id="features" className="bg-white py-24">
        <div className="container-x">
          <SectionHead
            center
            eyebrow="Everything compliance needs"
            title={<>Built around the way fleets actually work</>}
            sub="The day-to-day tools drivers, dispatchers and safety managers rely on — without the clutter."
          />

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-slate-200 bg-slate-50/60 p-6 transition-all hover:border-brand-200 hover:bg-white hover:shadow-card"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-ink-800">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- SEGMENTS ---------------- */}
      <section className="bg-slate-50 py-24">
        <div className="container-x">
          <SectionHead
            eyebrow="Built for every operation"
            title={<>One platform. Every size of fleet.</>}
            sub="From a single truck to a national carrier, everyone gets the same core platform, visibility and support."
          />
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {SEGMENTS.map((s) => (
              <div key={s.title} className="card-lift p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink-800 text-cyanx-400">
                  <s.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-ink-800">{s.title}</h3>
                <p className="mt-2.5 leading-relaxed text-slate-600">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- HOW IT WORKS ---------------- */}
      <section className="relative overflow-hidden bg-ink-900 py-24">
        <div className="glow-blob h-80 w-80 bg-brand-600/25" style={{ top: "10%", right: "-60px" }} />
        <div className="container-x relative z-10">
          <SectionHead
            light
            eyebrow="Up and running fast"
            title={<>From box to compliant in three steps</>}
            sub="Plug-and-play hardware and apps that install in minutes mean you start logging the same day."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {STEPS.map((s) => (
              <div
                key={s.n}
                className="relative rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur"
              >
                <span className="text-5xl font-extrabold text-white/10">{s.n}</span>
                <h3 className="mt-3 text-xl font-bold text-white">{s.title}</h3>
                <p className="mt-2.5 leading-relaxed text-slate-300">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- RESULT BAND ---------------- */}
      <section className="bg-white py-24">
        <div className="container-x">
          <div className="relative overflow-hidden rounded-[34px] border border-slate-200 bg-gradient-to-br from-brand-50 via-white to-cyanx-300/10 p-10 sm:p-14">
            <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
              <div>
                <span className="eyebrow">
                  <ShieldCheck className="h-3.5 w-3.5" /> Proven results
                </span>
                <h2 className="mt-5 text-3xl font-extrabold leading-tight text-ink-800 sm:text-4xl">
                  Fleets on AI ELD average a <span className="gradient-text">96% FMCSA safety score.</span>
                </h2>
                <p className="mt-4 max-w-xl text-lg leading-relaxed text-slate-600">
                  Stronger compliance over time, driven by system-level enforcement, cleaner log data and
                  earlier detection of risk — not extra paperwork.
                </p>
                <Link href="/about" className="btn-primary mt-7">
                  See how it works <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { v: "96%", l: "Avg. safety score" },
                  { v: "< min", l: "Critical event response" },
                  { v: "0", l: "Long-term contracts" },
                  { v: "100%", l: "FMCSA compliant" },
                ].map((b) => (
                  <div key={b.l} className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-soft">
                    <p className="text-3xl font-extrabold text-ink-800">
                      <span className="gradient-text">{b.v}</span>
                    </p>
                    <p className="mt-1 text-sm text-slate-500">{b.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- FINAL CTA ---------------- */}
      <section className="relative overflow-hidden bg-ink-950 py-24">
        <div className="absolute inset-0 bg-grid-dark [background-size:38px_38px] opacity-40" />
        <div className="glow-blob h-96 w-96 bg-brand-600/30" style={{ bottom: "-120px", left: "20%" }} />
        <div className="glow-blob h-80 w-80 bg-cyanx-500/20" style={{ top: "-80px", right: "15%" }} />
        <div className="container-x relative z-10 text-center">
          <h2 className="mx-auto max-w-3xl text-4xl font-extrabold leading-[1.1] text-white sm:text-5xl">
            Ready to make compliance the easy part?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-slate-300">
            Start a free 14-day trial with full access to the dashboard, logs, reports and driver apps. No
            contract, no risk.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/contact" className="btn-primary text-base">
              Start free trial <ChevronRight className="h-4 w-4" />
            </Link>
            <Link href="/contact" className="btn-dark text-base">
              Talk to an ELD specialist
            </Link>
          </div>
          <p className="mt-6 text-sm text-slate-500">
            Questions? Call <a href="tel:+13074520669" className="font-semibold text-cyanx-400">(307) 452-0669</a>
          </p>
        </div>
      </section>
    </>
  );
}
