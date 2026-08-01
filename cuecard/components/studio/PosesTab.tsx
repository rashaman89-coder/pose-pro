"use client";

import { useState } from "react";
import PoseBrowser from "../PoseBrowser";
import PoseImage from "../PoseImage";
import { Button, Card } from "../ui";
import { useStudio } from "@/lib/store";
import { posesByIds, suggestDeck } from "@/lib/catalog";
import type { Pose, Project } from "@/lib/types";

export default function PosesTab({ project }: { project: Project }) {
  const { togglePose, setPoses, isPro, limits } = useStudio();
  const [showPicked, setShowPicked] = useState(false);

  const picked = posesByIds(project.poseIds);
  const overLimit = project.poseIds.length > limits.deckSize;

  function autoBuild() {
    const size = isPro ? 24 : Math.min(20, limits.deckSize);
    setPoses(project.id, suggestDeck({ size }).map((p) => p.id));
  }

  return (
    <div>
      <Card className="mb-6 flex flex-wrap items-center gap-4 p-4">
        <div className="flex-1">
          <p className="text-[0.9rem] font-medium">
            {project.poseIds.length === 0
              ? "No poses picked yet"
              : `${project.poseIds.length} in this shoot`}
          </p>
          <p className="mt-0.5 text-[0.78rem] text-ink-soft">
            {project.poseIds.length === 0
              ? "Add the frames you want, or let us build a balanced set to edit down."
              : overLimit
                ? `The free plan sends up to ${limits.deckSize} — the rest won't go in the link.`
                : "Tap the + on any pose to add it."}
          </p>
        </div>
        <div className="flex gap-2">
          {project.poseIds.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => setShowPicked((v) => !v)}>
              {showPicked ? "Browse all" : "Show picked"}
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={autoBuild}>
            Build me a set
          </Button>
        </div>
      </Card>

      {showPicked ? (
        <PickedGrid
          poses={picked}
          limit={limits.deckSize}
          onRemove={(pose) => togglePose(project.id, pose.id)}
        />
      ) : (
        <PoseBrowser
          selectedIds={project.poseIds}
          onToggle={(pose) => togglePose(project.id, pose.id)}
          detailAction={(pose) => (
            <Button
              onClick={() => togglePose(project.id, pose.id)}
              variant={project.poseIds.includes(pose.id) ? "outline" : "primary"}
              className="w-full"
            >
              {project.poseIds.includes(pose.id)
                ? "Remove from this shoot"
                : "Add to this shoot"}
            </Button>
          )}
        />
      )}
    </div>
  );
}

function PickedGrid({
  poses,
  limit,
  onRemove,
}: {
  poses: Pose[];
  limit: number;
  onRemove: (pose: Pose) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
      {poses.map((pose, i) => {
        const excluded = i >= limit;
        return (
          <div
            key={pose.id}
            className={`group relative overflow-hidden rounded-2xl border border-border
                        ${excluded ? "opacity-40" : ""}`}
          >
            <PoseImage
              pose={pose}
              size="thumb"
              className="aspect-[3/4] w-full"
              sizes="(min-width: 1024px) 25vw, 50vw"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t
                            from-black/70 to-transparent px-2.5 pb-2.5 pt-8">
              <p className="text-[0.76rem] font-medium text-white">{pose.title}</p>
            </div>
            <span className="absolute left-2 top-2 rounded-full bg-black/50 px-2 py-0.5
                             text-[0.68rem] font-semibold text-white backdrop-blur-sm">
              {i + 1}
            </span>
            <button
              type="button"
              onClick={() => onRemove(pose)}
              aria-label={`Remove ${pose.title}`}
              className="absolute right-2 top-2 grid size-7 cursor-pointer place-items-center
                         rounded-full bg-black/50 text-white opacity-0 backdrop-blur-sm
                         transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
            >
              <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
        );
      })}
    </div>
  );
}
