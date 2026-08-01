/**
 * Everything name- and price-shaped lives here so renaming the product or
 * moving a price is a one-file change, not a search-and-replace across the app.
 */

export const brand = {
  name: "Cuecard",
  tagline: "The shot plan your couple actually helped build",
  /** Used in <title> and OG tags. */
  description:
    "Wedding photographers: build a pose plan, send your couple a link, " +
    "get back the shot list you'll actually shoot. 95 directed poses included.",
  /** Set this once the domain is live — used for canonical URLs and sitemaps. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://cuecard.app",
  supportEmail: "hello@cuecard.app",
} as const;

export type PlanId = "free" | "pro";

export interface Plan {
  id: PlanId;
  name: string;
  /** Price in USD. The owner is US-based, so USD is the native currency. */
  monthly: number;
  yearly: number;
  blurb: string;
  features: string[];
  limits: {
    projects: number;
    deckSize: number;
    /** Direction text is the paid content; free sees a curated subset. */
    unlockedDirections: "sample" | "all";
    pdfExport: boolean;
    ownBranding: boolean;
  };
}

export const PLANS: Record<PlanId, Plan> = {
  free: {
    id: "free",
    name: "Free",
    monthly: 0,
    yearly: 0,
    blurb: "Enough to run a real wedding before you decide.",
    features: [
      "All 95 poses, full resolution",
      "35 poses with full direction, lighting and lens notes",
      "1 shoot at a time",
      "Send your couple a deck of up to 20 poses",
      "Printable shot list",
    ],
    limits: {
      projects: 1,
      deckSize: 20,
      unlockedDirections: "sample",
      pdfExport: false,
      ownBranding: false,
    },
  },
  pro: {
    id: "pro",
    name: "Pro",
    monthly: 12,
    yearly: 89,
    blurb: "For photographers shooting more than a couple of weddings a year.",
    features: [
      "Direction, lighting, lens and coaching notes on every pose",
      "Unlimited shoots",
      "Unlimited deck size",
      "Your studio name on the couple's deck, not ours",
      "PDF shot list and day timeline",
      "New poses added every month",
    ],
    limits: {
      projects: Infinity,
      deckSize: Infinity,
      unlockedDirections: "all",
      pdfExport: true,
      ownBranding: true,
    },
  },
};

/** Shown on the pricing page as the headline saving. */
export const yearlySavingPercent = Math.round(
  (1 - PLANS.pro.yearly / (PLANS.pro.monthly * 12)) * 100,
);
