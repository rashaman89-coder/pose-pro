import Link from "next/link";
import { Truck, Phone, Mail, MapPin, Linkedin, Facebook } from "lucide-react";

const COLS = [
  {
    title: "Platform",
    links: [
      { label: "Fleet dashboard", href: "/#platform" },
      { label: "Driver apps", href: "/#platform" },
      { label: "Diagnostic AI", href: "/#platform" },
      { label: "Hardware", href: "/hardware" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Pricing", href: "/pricing" },
      { label: "Support", href: "/support" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Compliance",
    links: [
      { label: "HOS logging", href: "/#features" },
      { label: "IFTA reporting", href: "/#features" },
      { label: "DVIR inspections", href: "/#features" },
      { label: "FMCSA resources", href: "/support" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink-900 text-slate-300">
      <div className="glow-blob h-72 w-72 bg-brand-600/30" style={{ top: "-60px", left: "10%" }} />
      <div className="glow-blob h-72 w-72 bg-cyanx-500/20" style={{ bottom: "-80px", right: "8%" }} />

      <div className="container-x relative z-10 py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-cyanx-500">
                <Truck className="h-5 w-5 text-white" strokeWidth={2.4} />
              </span>
              <span className="text-lg font-extrabold tracking-tight text-white">
                AI<span className="gradient-text"> ELD</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
              An FMCSA-compliant ELD platform built around intuitive dashboards, diagnostic AI and
              24/7 monitoring — for owner-operators and fleets of every size.
            </p>
            <div className="mt-6 space-y-2.5 text-sm">
              <a href="tel:+13074520669" className="flex items-center gap-2.5 text-slate-300 hover:text-white">
                <Phone className="h-4 w-4 text-cyanx-400" /> (307) 452-0669
              </a>
              <a href="mailto:sales@ai-eld.com" className="flex items-center gap-2.5 text-slate-300 hover:text-white">
                <Mail className="h-4 w-4 text-cyanx-400" /> sales@ai-eld.com
              </a>
              <span className="flex items-center gap-2.5 text-slate-400">
                <MapPin className="h-4 w-4 text-cyanx-400" /> Countryside, IL
              </span>
            </div>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white">{col.title}</h4>
              <ul className="mt-4 space-y-3 text-sm">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-slate-400 transition hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} AI ELD. All rights reserved. FMCSA-compliant electronic logging.
          </p>
          <div className="flex items-center gap-3">
            <a
              href="https://www.linkedin.com/company/aield"
              aria-label="LinkedIn"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition hover:border-white/30 hover:text-white"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              href="https://www.facebook.com/people/AI-ELD/61588182027663/"
              aria-label="Facebook"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition hover:border-white/30 hover:text-white"
            >
              <Facebook className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
