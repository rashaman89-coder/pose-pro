"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import DeckExperience from "./DeckExperience";
import { decodeDeck, type DeckPayload } from "@/lib/codec";

/**
 * Reads the deck out of the query string. The link the photographer sends
 * carries the entire deck, so this page needs no lookup and no database — it
 * works the moment the HTML lands.
 */
export default function DeckLoader() {
  const params = useSearchParams();
  const raw = params.get("d");

  const result = useMemo((): { deck: DeckPayload } | { error: string } => {
    if (!raw) return { error: "This link is missing its deck." };
    try {
      return { deck: decodeDeck(raw) };
    } catch {
      return {
        error:
          "We couldn't read this link. It was probably shortened or cut off " +
          "when it was pasted.",
      };
    }
  }, [raw]);

  if ("error" in result) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-6 text-center">
        <div className="max-w-sm">
          <h1 className="font-display text-2xl">Something&apos;s off with this link</h1>
          <p className="mt-3 text-[0.92rem] leading-relaxed text-ink-soft">
            {result.error} Ask your photographer to send the whole thing again.
          </p>
        </div>
      </div>
    );
  }

  return <DeckExperience deck={result.deck} />;
}
