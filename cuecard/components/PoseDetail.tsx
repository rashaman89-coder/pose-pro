"use client";

import { useEffect } from "react";
import Link from "next/link";
import PoseImage from "./PoseImage";
import { Button, ProBadge } from "./ui";
import { label } from "@/lib/catalog";
import { useStudio } from "@/lib/store";
import type { Pose } from "@/lib/types";

interface Props {
  pose: Pose;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  /** Rendered under the notes — used to add the pose to a shoot. */
  action?: React.ReactNode;
}

export default function PoseDetail({ pose, onClose, onPrev, onNext, action }: Props) {
  const { isPro } = useStudio();
  const locked = pose.pro && !isPro;

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev?.();
      if (e.key === "ArrowRight") onNext?.();
    }
    window.addEventListener("keydown", onKey);
    // Freeze the page behind the dialog so a trackpad flick doesn't scroll it.
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose, onPrev, onNext]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={pose.title}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <div
        className="grid max-h-[94dvh] w-full max-w-5xl overflow-hidden rounded-2xl
                   bg-paper-raised md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-paper-sunk">
          <PoseImage
            pose={pose}
            size="full"
            priority
            className="h-56 w-full sm:h-72 md:h-full md:max-h-[94dvh]"
            sizes="(min-width: 768px) 52vw, 100vw"
          />

          {(onPrev || onNext) && (
            <div className="absolute inset-x-3 top-1/2 flex -translate-y-1/2 justify-between">
              <NavButton dir="prev" onClick={onPrev} />
              <NavButton dir="next" onClick={onNext} />
            </div>
          )}
        </div>

        <div className="quiet-scroll overflow-y-auto p-5 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-xl leading-tight sm:text-2xl">
                {pose.title}
              </h2>
              <p className="mt-1.5 text-[0.8rem] text-ink-soft">
                {label("subject", pose.subject)} · {label("framing", pose.framing)} ·{" "}
                {label("moment", pose.moment)} · {label("difficulty", pose.difficulty)}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-full
                         border border-border text-ink-soft transition-colors hover:bg-paper-sunk"
            >
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>
          </div>

          {locked ? (
            <LockedNotes />
          ) : (
            <div className="mt-6 space-y-5">
              <Section title="Say this">
                <p className="text-[0.92rem] leading-relaxed text-ink">{pose.direction}</p>
              </Section>
              <Section title="Light">
                <p className="text-[0.88rem] leading-relaxed text-ink-soft">{pose.lighting}</p>
              </Section>
              <div className="grid gap-5 sm:grid-cols-2">
                <Section title="Lens">
                  <p className="text-[0.88rem] text-ink-soft">{pose.lens}</p>
                </Section>
                <Section title="Watch for">
                  <p className="text-[0.88rem] leading-relaxed text-ink-soft">{pose.coaching}</p>
                </Section>
              </div>
            </div>
          )}

          {pose.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-1.5">
              {pose.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-paper-sunk px-2.5 py-1 text-[0.7rem] text-ink-soft"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {action && <div className="mt-7">{action}</div>}
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.11em] text-ink-faint">
        {title}
      </h3>
      {children}
    </div>
  );
}

function LockedNotes() {
  return (
    <div className="mt-6 rounded-xl border border-dashed border-border bg-paper-sunk p-5">
      <div className="flex items-center gap-2">
        <ProBadge />
        <p className="text-[0.85rem] font-medium">Direction for this pose is on Pro</p>
      </div>
      <p className="mt-2.5 text-[0.85rem] leading-relaxed text-ink-soft">
        Every pose carries the words to say out loud, the light that makes it work,
        a lens, and the mistake that ruins it. 35 poses are unlocked on the free
        plan so you can judge the writing before paying for the rest.
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
          href="/poses/?unlocked=1"
          className="inline-flex h-9 items-center rounded-full border border-border
                     px-4 text-[0.82rem] font-medium hover:bg-paper"
        >
          Show me the free ones
        </Link>
      </div>
    </div>
  );
}

function NavButton({ dir, onClick }: { dir: "prev" | "next"; onClick?: () => void }) {
  if (!onClick) return <span />;
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      aria-label={dir === "prev" ? "Previous pose" : "Next pose"}
      className="size-9 !p-0 bg-black/40 text-white backdrop-blur-sm hover:bg-black/55"
    >
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d={dir === "prev" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
      </svg>
    </Button>
  );
}
