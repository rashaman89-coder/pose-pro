import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://ai-eld.com"),
  title: {
    default: "AI ELD — FMCSA-Compliant ELD System for Trucks & Fleets",
    template: "%s — AI ELD",
  },
  description:
    "AI ELD pairs an FMCSA-compliant electronic logging device with a map-driven fleet dashboard, driver apps and 24/7 monitoring. Fleets average a 96% FMCSA safety score. Start a free 14-day trial.",
  keywords: [
    "ELD",
    "electronic logging device",
    "FMCSA compliant ELD",
    "fleet management",
    "HOS",
    "IFTA",
    "DVIR",
    "trucking compliance",
  ],
  openGraph: {
    title: "AI ELD — FMCSA-Compliant ELD System for Trucks & Fleets",
    description:
      "Intuitive dashboards, diagnostic AI, 24/7 monitoring and fair, month-to-month subscriptions for modern trucking fleets.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
