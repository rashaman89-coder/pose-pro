import type { Metadata } from "next";
import PoseBrowser from "@/components/PoseBrowser";
import { Shell } from "@/components/ui";
import { catalog } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Wedding pose library",
  description:
    `${catalog.length} wedding poses, each with the words to say out loud, the ` +
    "light that makes it work, a lens, and the mistake that ruins it.",
};

export default function PosesPage() {
  return (
    <Shell className="py-10 sm:py-14">
      <header className="mb-8 max-w-2xl">
        <h1 className="font-display text-3xl sm:text-4xl">Pose library</h1>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-soft">
          {catalog.length} wedding poses. Every one carries the direction to say out
          loud, the light that makes it work, a lens, and the thing that usually goes
          wrong. Built to be read one-handed between frames.
        </p>
      </header>

      <PoseBrowser />
    </Shell>
  );
}
