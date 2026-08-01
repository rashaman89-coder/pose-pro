"use client";

import { useMemo, useState } from "react";
import PoseCard from "./PoseCard";
import PoseDetail from "./PoseDetail";
import { Chip, Empty, Input } from "./ui";
import { catalog, facets, label } from "@/lib/catalog";
import type { Difficulty, Framing, Moment, Pose, Subject } from "@/lib/types";

type FilterKey = "subject" | "framing" | "moment" | "difficulty";

interface Props {
  /** Pose ids currently in the shoot — renders ticks and enables toggling. */
  selectedIds?: string[];
  onToggle?: (pose: Pose) => void;
  /** Extra controls rendered in the detail dialog. */
  detailAction?: (pose: Pose) => React.ReactNode;
  /** Start with only the free-tier poses showing. */
  initialUnlockedOnly?: boolean;
}

export default function PoseBrowser({
  selectedIds,
  onToggle,
  detailAction,
  initialUnlockedOnly = false,
}: Props) {
  const [q, setQ] = useState("");
  const [subject, setSubject] = useState<Subject | null>(null);
  const [framing, setFraming] = useState<Framing | null>(null);
  const [moment, setMoment] = useState<Moment | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [unlockedOnly, setUnlockedOnly] = useState(initialUnlockedOnly);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const selected = useMemo(() => new Set(selectedIds ?? []), [selectedIds]);
  const all = facets();

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return catalog.filter((p) => {
      if (subject && p.subject !== subject) return false;
      if (framing && p.framing !== framing) return false;
      if (moment && p.moment !== moment) return false;
      if (difficulty && p.difficulty !== difficulty) return false;
      if (unlockedOnly && p.pro) return false;
      if (needle) {
        const hay = `${p.title} ${p.tags.join(" ")} ${p.direction}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [q, subject, framing, moment, difficulty, unlockedOnly]);

  const activeCount =
    (subject ? 1 : 0) + (framing ? 1 : 0) + (moment ? 1 : 0) +
    (difficulty ? 1 : 0) + (unlockedOnly ? 1 : 0);

  function clearAll() {
    setSubject(null);
    setFraming(null);
    setMoment(null);
    setDifficulty(null);
    setUnlockedOnly(false);
    setQ("");
  }

  const rails: { key: FilterKey; options: [string, number][]; value: string | null;
    set: (v: never) => void }[] = [
    { key: "subject", options: all.subject, value: subject, set: setSubject as never },
    { key: "framing", options: all.framing, value: framing, set: setFraming as never },
    { key: "moment", options: all.moment, value: moment, set: setMoment as never },
    { key: "difficulty", options: all.difficulty, value: difficulty, set: setDifficulty as never },
  ];

  const openPose = openIndex !== null ? results[openIndex] : null;

  return (
    <div>
      <div className="mb-5 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-56 flex-1">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search poses, moods, props…"
              aria-label="Search poses"
              className="pl-9"
            />
            <svg
              viewBox="0 0 24 24"
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-faint"
              fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.2-3.2" />
            </svg>
          </div>
          <p className="text-[0.82rem] text-ink-soft" aria-live="polite">
            {results.length} {results.length === 1 ? "pose" : "poses"}
          </p>
          {activeCount > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="cursor-pointer text-[0.8rem] text-accent underline underline-offset-4"
            >
              Clear filters
            </button>
          )}
        </div>

        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
          {rails.map((rail) =>
            rail.options.map(([value, count]) => (
              <Chip
                key={`${rail.key}-${value}`}
                active={rail.value === value}
                onClick={() => rail.set((rail.value === value ? null : value) as never)}
              >
                {label(rail.key, value)}
                <span className="text-ink-faint">{count}</span>
              </Chip>
            )),
          )}
          <Chip active={unlockedOnly} onClick={() => setUnlockedOnly((v) => !v)}>
            Free notes only
          </Chip>
        </div>
      </div>

      {results.length === 0 ? (
        <Empty
          title="Nothing matches that"
          hint="Try removing a filter, or search for a mood like “quiet” or a prop like “bouquet”."
        />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {results.map((pose, i) => (
            <PoseCard
              key={pose.id}
              pose={pose}
              priority={i < 4}
              selected={selected.has(pose.id)}
              onToggle={onToggle}
              onOpen={() => setOpenIndex(i)}
            />
          ))}
        </div>
      )}

      {openPose && (
        <PoseDetail
          pose={openPose}
          onClose={() => setOpenIndex(null)}
          onPrev={openIndex! > 0 ? () => setOpenIndex(openIndex! - 1) : undefined}
          onNext={
            openIndex! < results.length - 1 ? () => setOpenIndex(openIndex! + 1) : undefined
          }
          action={detailAction?.(openPose)}
        />
      )}
    </div>
  );
}
