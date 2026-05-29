"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Truck, ChevronRight } from "lucide-react";

const NAV = [
  { label: "Platform", href: "/#platform" },
  { label: "Hardware", href: "/hardware" },
  { label: "Pricing", href: "/pricing" },
  { label: "Support", href: "/support" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-slate-200/70 bg-white/85 backdrop-blur-xl"
          : "border-b border-transparent bg-white/0"
      }`}
    >
      <nav className="container-x flex h-16 items-center justify-between">
        <Link href="/" className="group flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-cyanx-500 shadow-glow">
            <Truck className="h-5 w-5 text-white" strokeWidth={2.4} />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-ink-800">
            AI<span className="gradient-text"> ELD</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-ink-800"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/contact" className="text-sm font-semibold text-slate-600 transition hover:text-ink-800">
            Sign in
          </Link>
          <Link href="/contact" className="btn-primary">
            Start free trial <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <button
          aria-label="Toggle menu"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-ink-800 lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="lg:hidden">
          <div className="container-x flex flex-col gap-1 border-t border-slate-200 bg-white py-4">
            {NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-base font-medium text-slate-700 hover:bg-slate-100"
              >
                {item.label}
              </Link>
            ))}
            <Link href="/contact" onClick={() => setOpen(false)} className="btn-primary mt-2 w-full">
              Start free 14-day trial
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
