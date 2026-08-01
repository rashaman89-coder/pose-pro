"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { brand } from "@/lib/brand";
import ThemeToggle from "./ThemeToggle";

const NAV = [
  { href: "/poses/", label: "Poses" },
  { href: "/studio/", label: "Studio" },
  { href: "/pricing/", label: "Pricing" },
];

export default function SiteHeader() {
  const pathname = usePathname() ?? "/";

  // The deck is the couple's screen. It carries the photographer's studio name,
  // not ours, so our chrome stays out of it entirely.
  if (pathname.startsWith("/deck")) return null;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-15 w-full max-w-6xl items-center gap-6 px-4 sm:px-6">
        <Link href="/" className="font-display text-lg font-semibold tracking-tight">
          {brand.name}
        </Link>

        <nav className="flex items-center gap-1 text-[0.88rem]">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-3 py-1.5 transition-colors ${
                  active
                    ? "bg-paper-sunk font-medium text-ink"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/studio/"
            className="hidden rounded-full bg-ink px-4 py-2 text-[0.82rem] font-medium
                       text-paper transition-opacity hover:opacity-88 sm:inline-flex"
          >
            Open studio
          </Link>
        </div>
      </div>
    </header>
  );
}
