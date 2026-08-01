"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import PoseImage from "./PoseImage";
import { Button } from "./ui";
import { posesByIndexes } from "@/lib/catalog";
import {
  VERDICT,
  deckHash,
  encodeReply,
  type DeckPayload,
  type VerdictValue,
} from "@/lib/codec";
import { brand } from "@/lib/brand";

/**
 * The couple's screen. Runs on a phone, with no account and no network beyond
 * loading the page — every pose in the deck came down inside the link itself.
 *
 * Progress is saved locally against the deck's hash, so closing the tab
 * halfway through (which most people do) resumes instead of restarting.
 */

const VERDICT_BUTTONS = [
  { value: VERDICT.no, label: "Not for us", tone: "text-ink-soft", icon: "cross" },
  { value: VERDICT.maybe, label: "Maybe", tone: "text-maybe", icon: "tilde" },
  { value: VERDICT.love, label: "Love it", tone: "text-love", icon: "heart" },
] as const;

const SWIPE_THRESHOLD = 90;

export default function DeckExperience({ deck }: { deck: DeckPayload }) {
  const poses = useMemo(() => posesByIndexes(deck.poses), [deck.poses]);
  const hash = useMemo(() => deckHash(deck.poses), [deck.poses]);
  const storageKey = `cuecard.deck.${hash}.v1`;

  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [verdicts, setVerdicts] = useState<VerdictValue[]>(() =>
    new Array(poses.length).fill(VERDICT.unseen),
  );
  const [drag, setDrag] = useState(0);
  const dragStart = useRef<number | null>(null);

  // Resume where they left off.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return;
      const saved = JSON.parse(raw) as { verdicts: VerdictValue[]; index: number };
      if (Array.isArray(saved.verdicts) && saved.verdicts.length === poses.length) {
        setVerdicts(saved.verdicts);
        setIndex(Math.min(saved.index ?? 0, poses.length));
        if (saved.index > 0) setStarted(true);
      }
    } catch {
      /* Nothing saved, or storage is off — start from the top. */
    }
  }, [storageKey, poses.length]);

  useEffect(() => {
    if (!started) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify({ verdicts, index }));
    } catch {
      /* Storage full or blocked; the deck still works, it just won't resume. */
    }
  }, [started, storageKey, verdicts, index]);

  const answer = useCallback(
    (value: VerdictValue) => {
      setVerdicts((prev) => {
        const next = [...prev];
        next[index] = value;
        return next;
      });
      setDrag(0);
      setIndex((i) => i + 1);
    },
    [index],
  );

  const undo = useCallback(() => {
    if (index === 0) return;
    setIndex((i) => i - 1);
    setVerdicts((prev) => {
      const next = [...prev];
      next[index - 1] = VERDICT.unseen;
      return next;
    });
  }, [index]);

  // Keyboard works too — some couples do this together on a laptop.
  useEffect(() => {
    if (!started || index >= poses.length) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") answer(VERDICT.no);
      else if (e.key === "ArrowUp") answer(VERDICT.maybe);
      else if (e.key === "ArrowRight") answer(VERDICT.love);
      else if (e.key === "Backspace") undo();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [started, index, poses.length, answer, undo]);

  if (poses.length === 0) {
    return (
      <Centered>
        <h1 className="font-display text-2xl">This link looks incomplete</h1>
        <p className="mt-3 text-[0.92rem] text-ink-soft">
          Ask your photographer to send it again — a character probably went
          missing when it was copied.
        </p>
      </Centered>
    );
  }

  if (!started) {
    return (
      <Intro
        deck={deck}
        count={poses.length}
        cover={poses[0]}
        onStart={() => setStarted(true)}
      />
    );
  }

  if (index >= poses.length) {
    return <Finish deck={deck} poses={poses} verdicts={verdicts} onBack={undo} />;
  }

  const pose = poses[index];
  const progress = Math.round((index / poses.length) * 100);
  const tilt = drag / 18;

  return (
    <div className="flex min-h-dvh flex-col bg-paper">
      <header className="px-4 pt-4">
        <div className="mx-auto w-full max-w-md">
          <div className="flex items-center justify-between text-[0.76rem] text-ink-soft">
            <span className="truncate font-medium text-ink">{deck.title}</span>
            <span className="tabular-nums">
              {index + 1} / {poses.length}
            </span>
          </div>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-accent transition-[width] duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      <div className="flex flex-1 items-center justify-center px-4 py-4">
        <div
          className="relative w-full max-w-md touch-pan-y select-none"
          onPointerDown={(e) => {
            dragStart.current = e.clientX;
            e.currentTarget.setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => {
            if (dragStart.current === null) return;
            setDrag(e.clientX - dragStart.current);
          }}
          onPointerUp={() => {
            if (drag > SWIPE_THRESHOLD) answer(VERDICT.love);
            else if (drag < -SWIPE_THRESHOLD) answer(VERDICT.no);
            else setDrag(0);
            dragStart.current = null;
          }}
          onPointerCancel={() => {
            setDrag(0);
            dragStart.current = null;
          }}
        >
          <div
            className="overflow-hidden rounded-3xl border border-border bg-paper-raised shadow-[0_20px_60px_-24px_rgba(0,0,0,0.4)]"
            style={{
              transform: `translateX(${drag}px) rotate(${tilt}deg)`,
              transition: dragStart.current === null ? "transform 0.25s ease-out" : "none",
            }}
          >
            <PoseImage
              key={pose.id}
              pose={pose}
              size="card"
              priority
              className="aspect-[3/4] w-full"
              sizes="(min-width: 640px) 448px, 100vw"
            />
          </div>

          {/* Verdict hints that fade in as the card is dragged. */}
          <Hint side="left" active={drag < -40} label="Not for us" />
          <Hint side="right" active={drag > 40} label="Love it" />
        </div>
      </div>

      <footer className="px-4 pb-8">
        <div className="mx-auto w-full max-w-md">
          <div className="flex items-center justify-center gap-3">
            {VERDICT_BUTTONS.map((b) => (
              <button
                key={b.value}
                type="button"
                onClick={() => answer(b.value)}
                aria-label={b.label}
                className={`flex h-16 flex-1 cursor-pointer flex-col items-center justify-center
                            gap-1 rounded-2xl border border-border bg-paper-raised
                            transition-all active:scale-95 hover:bg-paper-sunk ${b.tone}`}
              >
                <VerdictIcon name={b.icon} />
                <span className="text-[0.68rem] font-medium">{b.label}</span>
              </button>
            ))}
          </div>

          <div className="mt-3 flex justify-center">
            <button
              type="button"
              onClick={undo}
              disabled={index === 0}
              className="cursor-pointer text-[0.78rem] text-ink-faint underline
                         underline-offset-4 disabled:opacity-40 disabled:no-underline"
            >
              Undo last
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Intro({
  deck,
  count,
  cover,
  onStart,
}: {
  deck: DeckPayload;
  count: number;
  cover: ReturnType<typeof posesByIndexes>[number];
  onStart: () => void;
}) {
  const minutes = Math.max(2, Math.round(count / 9));
  return (
    <div className="relative flex min-h-dvh flex-col justify-end">
      <div className="absolute inset-0">
        <PoseImage pose={cover} size="full" priority className="h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/60 to-black/25" />
      </div>

      <div className="relative mx-auto w-full max-w-md px-6 pb-14 pt-24 text-white">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-white/65">
          {deck.studio || "Your photographer"}
        </p>
        <h1 className="mt-3 font-display text-[2.1rem] leading-tight">{deck.title}</h1>
        <p className="mt-4 text-[0.95rem] leading-relaxed text-white/85">
          {deck.note ||
            "Have a look through these and tell me which ones feel like you. " +
              "There are no wrong answers — this just means we shoot the day you " +
              "actually want."}
        </p>
        <p className="mt-5 text-[0.82rem] text-white/60">
          {count} photos · about {minutes} minutes · nothing to sign up for
        </p>

        <Button
          onClick={onStart}
          size="lg"
          className="mt-7 w-full bg-white text-black hover:bg-white/90"
        >
          Start
        </Button>
      </div>
    </div>
  );
}

function Finish({
  deck,
  poses,
  verdicts,
  onBack,
}: {
  deck: DeckPayload;
  poses: ReturnType<typeof posesByIndexes>;
  verdicts: VerdictValue[];
  onBack: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const code = useMemo(
    () => encodeReply({ deckHash: deckHash(deck.poses), verdicts }),
    [deck.poses, verdicts],
  );

  const loved = poses.filter((_, i) => verdicts[i] === VERDICT.love);
  const maybe = poses.filter((_, i) => verdicts[i] === VERDICT.maybe);

  const message =
    `Here are our picks for ${deck.title} — ` +
    `${loved.length} we love, ${maybe.length} maybes.\n\n${code}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      /* Clipboard denied — the code is on screen and selectable anyway. */
    }
  }

  return (
    <div className="min-h-dvh bg-paper px-4 py-12">
      <div className="mx-auto w-full max-w-md">
        <h1 className="font-display text-3xl">That&apos;s everything.</h1>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-soft">
          You loved <strong className="text-love">{loved.length}</strong> and
          marked <strong className="text-maybe">{maybe.length}</strong> as maybes.
          Send the code below to{" "}
          {deck.studio || "your photographer"} and you&apos;re done.
        </p>

        <div className="mt-7 rounded-2xl border border-border bg-paper-raised p-5">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.11em] text-ink-faint">
            Your code
          </p>
          <p className="mt-2 break-all font-mono text-[0.85rem] leading-relaxed text-ink">
            {code}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={copy} variant={copied ? "outline" : "primary"} size="sm">
              {copied ? "Copied" : "Copy code"}
            </Button>
            <a
              href={`sms:?&body=${encodeURIComponent(message)}`}
              className="inline-flex h-9 items-center rounded-full border border-border
                         px-4 text-[0.82rem] font-medium hover:bg-paper-sunk"
            >
              Text it
            </a>
            <a
              href={`mailto:?subject=${encodeURIComponent(
                `Our picks — ${deck.title}`,
              )}&body=${encodeURIComponent(message)}`}
              className="inline-flex h-9 items-center rounded-full border border-border
                         px-4 text-[0.82rem] font-medium hover:bg-paper-sunk"
            >
              Email it
            </a>
          </div>
        </div>

        {loved.length > 0 && (
          <section className="mt-9">
            <h2 className="text-[0.68rem] font-semibold uppercase tracking-[0.11em] text-ink-faint">
              The ones you loved
            </h2>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {loved.map((pose) => (
                <PoseImage
                  key={pose.id}
                  pose={pose}
                  size="thumb"
                  className="aspect-[3/4] w-full rounded-xl"
                  sizes="30vw"
                />
              ))}
            </div>
          </section>
        )}

        <div className="mt-9 flex items-center justify-between border-t border-border pt-5">
          <button
            type="button"
            onClick={onBack}
            className="cursor-pointer text-[0.8rem] text-ink-faint underline underline-offset-4"
          >
            Change the last one
          </button>
          <p className="text-[0.72rem] text-ink-faint">
            Made with {brand.name}
          </p>
        </div>
      </div>
    </div>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh items-center justify-center px-6 text-center">
      <div className="max-w-sm">{children}</div>
    </div>
  );
}

function Hint({
  side,
  active,
  label,
}: {
  side: "left" | "right";
  active: boolean;
  label: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute top-8 rounded-full border-2 px-3 py-1
                  text-[0.72rem] font-bold uppercase tracking-wider transition-opacity
                  ${side === "left" ? "left-6 -rotate-12 border-white text-white" : "right-6 rotate-12 border-love text-love"}
                  ${active ? "opacity-100" : "opacity-0"}`}
    >
      {label}
    </span>
  );
}

function VerdictIcon({ name }: { name: "cross" | "tilde" | "heart" }) {
  const common = {
    viewBox: "0 0 24 24",
    className: "size-5",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.9,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (name === "cross") return <svg {...common}><path d="m6 6 12 12M18 6 6 18" /></svg>;
  if (name === "tilde") return <svg {...common}><path d="M3 13c2.5-4 5.5-4 8 0s5.5 4 8 0" /></svg>;
  return (
    <svg {...common} fill="currentColor" stroke="none">
      <path d="M12 20.5 4.2 13a4.6 4.6 0 0 1 6.5-6.5l1.3 1.3 1.3-1.3A4.6 4.6 0 0 1 19.8 13Z" />
    </svg>
  );
}
