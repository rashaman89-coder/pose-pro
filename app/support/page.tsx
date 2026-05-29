import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { Phone, Mail, Smartphone, Clock, AlertTriangle, Activity, ShieldCheck, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "24/7 ELD Support & Monitoring",
  description:
    "Reach AI ELD any time for help with log issues, device problems and access questions. Optional active monitoring resolves disconnected events, violations and technical issues within minutes.",
};

const CHANNELS = [
  { icon: Phone, title: "Call us", value: "(307) 452-0669", href: "tel:+13074520669", note: "Drivers & dispatch, 24/7" },
  { icon: Mail, title: "Email support", value: "support@ai-eld.com", href: "mailto:support@ai-eld.com", note: "We reply fast" },
  { icon: Smartphone, title: "In-app help", value: "Open the driver app", href: "/contact", note: "Help built into every screen" },
];

const MONITORING = [
  { icon: AlertTriangle, title: "Disconnected devices", body: "We catch a device that drops offline and get it back before it becomes a compliance gap." },
  { icon: Clock, title: "Approaching HOS limits", body: "Drivers and dispatch get a heads-up before an hours-of-service limit turns into a violation." },
  { icon: Activity, title: "Compliance events", body: "Real-time watch on violations and technical issues, with resolution in minutes — not days." },
];

export default function SupportPage() {
  return (
    <>
      <PageHero
        eyebrow="Support & Monitoring"
        title={
          <>
            Help whenever the wheels are <span className="gradient-text">turning.</span>
          </>
        }
        sub="Fleets, drivers and dispatchers can reach our team at any time. Add optional monitoring and we'll watch the road with you, around the clock."
      />

      {/* contact channels */}
      <section className="bg-white py-20">
        <div className="container-x">
          <div className="grid gap-6 md:grid-cols-3">
            {CHANNELS.map((c) => (
              <a
                key={c.title}
                href={c.href}
                className="card-lift group flex flex-col p-7"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                  <c.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-ink-800">{c.title}</h3>
                <p className="mt-1 text-lg font-semibold text-brand-600">{c.value}</p>
                <p className="mt-1 text-sm text-slate-500">{c.note}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 24/7 band */}
      <section className="bg-slate-50 py-20">
        <div className="container-x">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="eyebrow">
                <ShieldCheck className="h-3.5 w-3.5" /> 24/7 coverage
              </span>
              <h2 className="mt-5 text-3xl font-extrabold text-ink-800 sm:text-4xl">
                Support that never clocks out
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-slate-600">
                Trucking doesn't keep business hours, and neither do we. Whether it's a log issue at 2 a.m., a
                device that won't connect, or an access question mid-route, our team is one call, email or tap
                away — any day, any time.
              </p>
              <Link href="/contact" className="btn-primary mt-7">
                Contact support <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
              <h3 className="text-lg font-bold text-ink-800">Optional active monitoring</h3>
              <p className="mt-2 text-sm text-slate-600">
                A dedicated team watching your fleet in real time and stepping in within minutes.
              </p>
              <div className="mt-6 space-y-5">
                {MONITORING.map((m) => (
                  <div key={m.title} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink-800 text-cyanx-400">
                      <m.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-ink-800">{m.title}</h4>
                      <p className="mt-0.5 text-sm leading-relaxed text-slate-600">{m.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
