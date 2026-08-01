"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { brand } from "@/lib/brand";

export default function SiteFooter() {
  const pathname = usePathname() ?? "/";
  if (pathname.startsWith("/deck")) return null;

  return (
    <footer className="border-t border-border py-10 no-print">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 text-[0.82rem]
                      text-ink-soft sm:flex-row sm:items-center sm:px-6">
        <p>
          © {new Date().getFullYear()} {brand.name}
        </p>
        <nav className="flex flex-wrap gap-x-5 gap-y-2 sm:ml-auto">
          <Link href="/poses/" className="hover:text-ink">
            Pose library
          </Link>
          <Link href="/pricing/" className="hover:text-ink">
            Pricing
          </Link>
          <Link href="/studio/" className="hover:text-ink">
            Studio
          </Link>
          <a href={`mailto:${brand.supportEmail}`} className="hover:text-ink">
            Contact
          </a>
        </nav>
      </div>
    </footer>
  );
}
