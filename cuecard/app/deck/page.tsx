import type { Metadata } from "next";
import { Suspense } from "react";
import DeckLoader from "@/components/DeckLoader";

export const metadata: Metadata = {
  title: "Your photographer sent you these",
  // A couple's private picks should never turn up in a search result.
  robots: { index: false, follow: false },
};

export default function DeckPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-paper" />}>
      <DeckLoader />
    </Suspense>
  );
}
