"use client";

import Link from "next/link";
import { ProBadge } from "./ui";
import { useStudio } from "@/lib/store";
import type { Pose } from "@/lib/types";

/**
 * The direction block on a pose page.
 *
 * Pro poses still publish their opening sentence rather than hiding behind a
 * blank wall. A search engine gets real text to index, and a photographer can
 * judge whether the writing is worth paying for before they pay for it — which
 * is the same reason 35 poses are fully unlocked.
 */
export default function PoseNotes({ pose }: { pose: Pose }) {
  const { isPro } = useStudio();
  const locked = pose.pro && !isPro;

  const firstSentence = pose.direction.split(/(?<=\.)\s+/)[0] ?? pose.direction;

  return (
    <div className="mt-7 space-y-6">
      <section>
        <h2 className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.11em] text-ink-faint">
          Say this
        </h2>
        <p className="text-[0.95rem] leading-relaxed">
          {locked ? firstSentence : pose.direction}
        </p>
      </section>

      {locked ? (
        <div className="rounded-xl border border-dashed border-border bg-paper-sunk p-5">
          <ProBadge />
          <p className="mt-2 text-[0.88rem] leading-relaxed text-ink-soft">
            The rest of this direction, the lighting setup and the mistake that
            ruins the shot are on Pro. 35 poses are fully unlocked on the free
            plan if you want to read the writing first.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/pricing/"
              className="inline-flex h-9 items-center rounded-full bg-accent px-4
                         text-[0.82rem] font-medium text-accent-ink hover:opacity-90"
            >
              See Pro
            </Link>
            <Link
              href="/poses/"
              className="inline-flex h-9 items-center rounded-full border border-border
                         px-4 text-[0.82rem] font-medium hover:bg-paper-sunk"
            >
              Read the free ones
            </Link>
          </div>
        </div>
      ) : (
        <>
          <section>
            <h2 className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.11em] text-ink-faint">
              Light
            </h2>
            <p className="text-[0.9rem] leading-relaxed text-ink-soft">{pose.lighting}</p>
          </section>

          <div className="grid gap-6 sm:grid-cols-2">
            <section>
              <h2 className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.11em] text-ink-faint">
                Lens
              </h2>
              <p className="text-[0.9rem] text-ink-soft">{pose.lens}</p>
            </section>
            <section>
              <h2 className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.11em] text-ink-faint">
                Watch for
              </h2>
              <p className="text-[0.9rem] leading-relaxed text-ink-soft">{pose.coaching}</p>
            </section>
          </div>
        </>
      )}
    </div>
  );
}
