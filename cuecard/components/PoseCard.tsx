"use client";

import PoseImage from "./PoseImage";
import { ProBadge } from "./ui";
import { label } from "@/lib/catalog";
import type { Pose } from "@/lib/types";

interface Props {
  pose: Pose;
  onOpen?: (pose: Pose) => void;
  /** Renders a selection tick and dims unselected cards. */
  selected?: boolean;
  onToggle?: (pose: Pose) => void;
  priority?: boolean;
}

export default function PoseCard({
  pose,
  onOpen,
  selected,
  onToggle,
  priority,
}: Props) {
  const selectable = typeof onToggle === "function";

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border transition-all
                  duration-200 ${
                    selected
                      ? "border-accent ring-2 ring-accent/30"
                      : "border-border hover:shadow-[0_10px_36px_-12px_rgba(0,0,0,0.22)]"
                  }`}
    >
      <button
        type="button"
        onClick={() => onOpen?.(pose)}
        className="block w-full cursor-pointer text-left"
        aria-label={`Open ${pose.title}`}
      >
        <PoseImage
          pose={pose}
          size="card"
          priority={priority}
          className="aspect-[3/4] w-full"
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
        />

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t
                     from-black/72 via-black/22 to-transparent px-3 pb-3 pt-10"
        >
          <p className="text-[0.85rem] font-medium leading-snug text-white drop-shadow-sm">
            {pose.title}
          </p>
          <p className="mt-0.5 text-[0.7rem] text-white/72">
            {label("subject", pose.subject)} · {label("framing", pose.framing)}
          </p>
        </div>
      </button>

      {pose.pro && (
        <div className="pointer-events-none absolute left-2.5 top-2.5">
          <ProBadge className="bg-black/45 text-white backdrop-blur-sm" />
        </div>
      )}

      {selectable && (
        <button
          type="button"
          onClick={() => onToggle?.(pose)}
          aria-pressed={selected}
          aria-label={selected ? `Remove ${pose.title}` : `Add ${pose.title}`}
          className={`absolute right-2.5 top-2.5 grid size-8 cursor-pointer place-items-center
                      rounded-full border transition-all ${
                        selected
                          ? "border-accent bg-accent text-accent-ink"
                          : "border-white/45 bg-black/35 text-white backdrop-blur-sm " +
                            "opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
                      }`}
        >
          <svg
            viewBox="0 0 24 24"
            className="size-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {selected ? <path d="m5 12 5 5L20 7" /> : <path d="M12 5v14M5 12h14" />}
          </svg>
        </button>
      )}
    </article>
  );
}
