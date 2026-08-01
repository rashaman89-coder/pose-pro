"use client";

import Link from "next/link";
import { Button } from "./ui";
import { useStudio } from "@/lib/store";
import { PLANS } from "@/lib/brand";

/**
 * Checkout URLs come from the merchant of record. Until they're configured the
 * buttons explain that honestly rather than dead-ending on a broken link — a
 * half-wired checkout costs more trust than a missing one.
 */
const MONTHLY_URL = process.env.NEXT_PUBLIC_CHECKOUT_MONTHLY ?? "";
const YEARLY_URL = process.env.NEXT_PUBLIC_CHECKOUT_YEARLY ?? "";

export default function CheckoutButtons() {
  const { isPro } = useStudio();
  const pro = PLANS.pro;

  if (isPro) {
    return (
      <div className="mt-8 rounded-full border border-accent/40 bg-accent-wash px-5 py-3 text-center">
        <p className="text-[0.88rem] font-medium text-ink">Pro is active on this device</p>
      </div>
    );
  }

  if (!MONTHLY_URL && !YEARLY_URL) {
    return (
      <div className="mt-8">
        <Button disabled className="w-full" size="lg">
          Checkout opens soon
        </Button>
        <p className="mt-2.5 text-center text-[0.78rem] leading-relaxed text-ink-faint">
          Everything on the free plan works today. Already have a key?{" "}
          <Link href="/studio/" className="text-accent underline underline-offset-4">
            Activate it in the studio
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-2.5">
      {YEARLY_URL && (
        <a
          href={YEARLY_URL}
          className="inline-flex h-12 w-full items-center justify-center rounded-full
                     bg-accent text-[0.92rem] font-medium text-accent-ink hover:opacity-90"
        >
          Get Pro — ${pro.yearly}/year
        </a>
      )}
      {MONTHLY_URL && (
        <a
          href={MONTHLY_URL}
          className="inline-flex h-12 w-full items-center justify-center rounded-full
                     border border-border text-[0.92rem] font-medium hover:bg-paper-sunk"
        >
          Monthly — ${pro.monthly}
        </a>
      )}
      <p className="text-center text-[0.76rem] text-ink-faint">
        Cancel any time. Your key arrives by email straight after checkout.
      </p>
    </div>
  );
}
