import type { Metadata } from "next";
import "./globals.css";
import AppProvider from "@/context/AppContext";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pose Pro — Poses & Projects",
  description: "Browse poses, save favorites, and build shot lists.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b">
            <nav className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-6">
              <Link className="font-semibold" href="/">Pose Pro</Link>
              {/* Poses link vodi na AUTO galeriju */}
              <Link href="/auto">Poses</Link>
              <Link href="/projects">My Projects</Link>
              <Link href="/favorites">Favorites</Link>
              <Link href="/shotlists">Shotlists</Link>
              <Link href="/tutorials">Tutorials</Link>
            </nav>
          </header>
          <main className="min-h-[calc(100vh-3.5rem)]">{children}</main>
          <footer className="border-t py-6 text-center text-sm text-neutral-500">
            © {new Date().getFullYear()} Pose Pro
          </footer>
        </AppProvider>
      </body>
    </html>
  );
}
