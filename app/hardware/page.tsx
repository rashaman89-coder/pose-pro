import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { Cpu, Bluetooth, Satellite, Wrench, ChevronRight, CheckCircle2, Plug, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "ELD Hardware & Devices",
  description:
    "AI ELD supports the Geometris WhereQube and Pacific Track PT30/PT40. Rugged, plug-and-play devices with onboard GPS, J1939/J1708/OBD-II support and Bluetooth.",
};

const DEVICES = [
  {
    name: "Geometris WhereQube",
    role: "Primary device",
    body: "Our recommended primary ELD — a rugged, reliable unit purpose-built for AI ELD's logging, GPS and diagnostics.",
    specs: ["Onboard GPS", "Local event storage", "Bluetooth to driver app", "Plug-and-play install"],
    featured: true,
  },
  {
    name: "Pacific Track PT30",
    role: "Bring-your-own hardware",
    body: "A rugged, FMCSA-compliant ELD that ensures hours-of-service tracking and pairs cleanly with the AI ELD app.",
    specs: ["J1939 / J1708 / OBD-II", "Onboard GPS", "Local event storage", "Wireless via Bluetooth"],
    featured: false,
  },
  {
    name: "Pacific Track PT40",
    role: "Bring-your-own hardware",
    body: "For fleets with existing PT40 hardware — connect it to AI ELD and keep your investment working.",
    specs: ["J1939 / J1708 / OBD-II", "Onboard GPS", "Fleet telematics ready", "Wireless via Bluetooth"],
    featured: false,
  },
];

const HIGHLIGHTS = [
  { icon: Plug, title: "Plug-and-play", body: "Connects to the diagnostic port in minutes — no tools, no downtime, no technician required." },
  { icon: Satellite, title: "Onboard GPS", body: "Accurate, real-time positioning with local event storage so nothing is lost off-network." },
  { icon: Bluetooth, title: "Reliable pairing", body: "Devices connect wirelessly to the driver app over Bluetooth and stay connected on the road." },
  { icon: ShieldCheck, title: "FMCSA-compliant", body: "Certified hardware-and-software pairing that keeps your fleet fully compliant." },
];

export default function HardwarePage() {
  return (
    <>
      <PageHero
        eyebrow="Hardware"
        title={
          <>
            Rugged devices, <span className="gradient-text">simple setup.</span>
          </>
        }
        sub="AI ELD pairs certified, plug-and-play hardware with our software. Use our recommended device or bring the Pacific Track units you already own."
      />

      {/* highlights */}
      <section className="bg-white py-20">
        <div className="container-x">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {HIGHLIGHTS.map((h) => (
              <div key={h.title} className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-cyanx-500 text-white">
                  <h.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-ink-800">{h.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{h.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* devices */}
      <section className="bg-slate-50 py-20">
        <div className="container-x">
          <div className="max-w-2xl">
            <span className="eyebrow">
              <Cpu className="h-3.5 w-3.5" /> Supported devices
            </span>
            <h2 className="mt-5 text-3xl font-extrabold text-ink-800 sm:text-4xl">Choose your device</h2>
            <p className="mt-4 text-lg text-slate-600">
              One recommended primary device, plus support for existing Pacific Track hardware so you never pay
              twice.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {DEVICES.map((d) => (
              <div
                key={d.name}
                className={`relative flex flex-col overflow-hidden rounded-3xl p-7 ${
                  d.featured ? "border-2 border-brand-500 bg-white shadow-glow" : "border border-slate-200 bg-white shadow-soft"
                }`}
              >
                {/* device illustration */}
                <div className="relative mb-5 flex h-32 items-center justify-center rounded-2xl bg-gradient-to-br from-ink-800 to-ink-900">
                  <div className="absolute inset-0 bg-grid-dark [background-size:20px_20px] opacity-40" />
                  <div className="relative flex h-16 w-24 items-center justify-center rounded-lg border border-white/15 bg-ink-700 shadow-lg">
                    <Cpu className="h-7 w-7 text-cyanx-400" />
                    <span className="absolute -right-1 -top-1 h-2.5 w-2.5 animate-pulseSoft rounded-full bg-emerald-400" />
                  </div>
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">{d.role}</span>
                <h3 className="mt-1 text-xl font-bold text-ink-800">{d.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{d.body}</p>
                <ul className="mt-5 flex-1 space-y-2.5">
                  {d.specs.map((s) => (
                    <li key={s} className="flex items-center gap-2.5 text-sm text-slate-700">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" /> {s}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-10 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-6">
            <Wrench className="h-6 w-6 shrink-0 text-brand-600" />
            <p className="text-sm text-slate-600">
              Hardware costs and any required installation are scoped and agreed upfront — so you always know
              what you're paying before you commit.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ink-900 py-16">
        <div className="container-x flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
          <div>
            <h2 className="text-2xl font-extrabold text-white sm:text-3xl">Not sure which device fits?</h2>
            <p className="mt-2 text-slate-300">Tell us your trucks and equipment mix — we'll recommend the right setup.</p>
          </div>
          <Link href="/contact" className="btn-primary shrink-0 text-base">
            Talk to a specialist <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
