"use client";

import Link from "next/link";
import { useMemo } from "react";
import PoseImage from "../PoseImage";
import { Button, Card, ProBadge } from "../ui";
import { useStudio } from "@/lib/store";
import { label, posesByIds } from "@/lib/catalog";
import { brand } from "@/lib/brand";
import type { Moment, Pose, Project } from "@/lib/types";

/** Wedding-day order. Anything unmapped sorts to the end. */
const MOMENT_ORDER: Moment[] = [
  "getting-ready",
  "first-look",
  "ceremony",
  "portraits",
  "golden-hour",
  "reception",
];

type Priority = "loved" | "maybe" | "extra";

export default function ShotListTab({ project }: { project: Project }) {
  const { isPro, studioName } = useStudio();

  const latest = project.responses?.[0];

  const grouped = useMemo(() => {
    const poses = posesByIds(project.poseIds);

    const priorityOf = (pose: Pose): Priority => {
      if (!latest) return "extra";
      if (latest.loved.includes(pose.id)) return "loved";
      if (latest.maybe.includes(pose.id)) return "maybe";
      return "extra";
    };

    // A pose the couple passed on is dead weight on the day — drop it once
    // there's a reply to go on.
    const kept = latest
      ? poses.filter((p) => !latest.no.includes(p.id))
      : poses;

    const buckets = new Map<Moment, { pose: Pose; priority: Priority }[]>();
    for (const pose of kept) {
      if (!buckets.has(pose.moment)) buckets.set(pose.moment, []);
      buckets.get(pose.moment)!.push({ pose, priority: priorityOf(pose) });
    }

    const rank: Record<Priority, number> = { loved: 0, maybe: 1, extra: 2 };
    for (const list of buckets.values()) {
      list.sort((a, b) => rank[a.priority] - rank[b.priority]);
    }

    return MOMENT_ORDER.filter((m) => buckets.has(m)).map((m) => ({
      moment: m,
      items: buckets.get(m)!,
    }));
  }, [project.poseIds, latest]);

  const total = grouped.reduce((n, g) => n + g.items.length, 0);
  const lovedCount = latest?.loved.length ?? 0;

  if (total === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="font-display text-lg">Nothing to shoot yet</p>
        <p className="mx-auto mt-2 max-w-sm text-[0.88rem] text-ink-soft">
          Add poses on the Poses tab and this becomes the list you carry on
          the day.
        </p>
      </Card>
    );
  }

  return (
    <div>
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[0.9rem] font-medium">
            {total} frames across {grouped.length}{" "}
            {grouped.length === 1 ? "part" : "parts"} of the day
          </p>
          <p className="mt-0.5 text-[0.8rem] text-ink-soft">
            {latest
              ? `Ordered by what your couple picked — ${lovedCount} must-haves first, passes removed.`
              : "Once their reply lands, this reorders around what they actually want."}
          </p>
        </div>
        <Button variant="outline" onClick={() => window.print()}>
          Print / save as PDF
        </Button>
      </div>

      <header className="hidden print:mb-6 print:block">
        <h1 className="font-display text-2xl">{project.name}</h1>
        <p className="mt-1 text-sm">
          {project.dateTimeISO
            ? new Date(project.dateTimeISO).toLocaleDateString(undefined, {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : ""}
          {project.location ? ` · ${project.location}` : ""}
          {isPro && studioName ? ` · ${studioName}` : ""}
        </p>
      </header>

      <div className="space-y-9">
        {grouped.map((group) => (
          <section key={group.moment}>
            <h2 className="border-b border-border pb-2 font-display text-xl">
              {label("moment", group.moment)}
              <span className="ml-2 text-[0.8rem] font-normal text-ink-soft">
                {group.items.length}
              </span>
            </h2>

            <ol className="mt-4 space-y-3">
              {group.items.map(({ pose, priority }) => (
                <ShotRow
                  key={pose.id}
                  pose={pose}
                  priority={priority}
                  locked={pose.pro && !isPro}
                  showPriority={Boolean(latest)}
                />
              ))}
            </ol>
          </section>
        ))}
      </div>

      {!isPro && (
        <Card className="no-print mt-10 p-5">
          <ProBadge />
          <p className="mt-2 max-w-lg text-[0.88rem] leading-relaxed text-ink-soft">
            Some rows are missing their direction because those poses are on Pro.
            Pro also unlocks a clean PDF export with your studio name on it,
            instead of a browser print header.
          </p>
          <Link
            href="/pricing/"
            className="mt-3 inline-flex h-9 items-center rounded-full bg-accent px-4
                       text-[0.82rem] font-medium text-accent-ink hover:opacity-90"
          >
            See Pro
          </Link>
        </Card>
      )}

      <p className="mt-10 hidden text-[0.7rem] text-ink-faint print:block">
        {brand.name}
      </p>
    </div>
  );
}

function ShotRow({
  pose,
  priority,
  locked,
  showPriority,
}: {
  pose: Pose;
  priority: Priority;
  locked: boolean;
  showPriority: boolean;
}) {
  const tone =
    priority === "loved"
      ? "border-love/40 bg-love/5"
      : priority === "maybe"
        ? "border-maybe/35 bg-maybe/5"
        : "border-border";

  return (
    <li
      className={`print-clean flex gap-4 rounded-xl border p-3.5 ${
        showPriority ? tone : "border-border"
      }`}
    >
      <PoseImage
        pose={pose}
        size="thumb"
        className="h-24 w-18 shrink-0 rounded-lg"
        sizes="72px"
      />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
          <h3 className="text-[0.95rem] font-semibold">{pose.title}</h3>
          {showPriority && priority === "loved" && (
            <span className="text-[0.68rem] font-semibold uppercase tracking-wider text-love">
              Must have
            </span>
          )}
          {showPriority && priority === "maybe" && (
            <span className="text-[0.68rem] font-semibold uppercase tracking-wider text-maybe">
              If time
            </span>
          )}
          <span className="text-[0.72rem] text-ink-faint">{pose.lens}</span>
        </div>

        {locked ? (
          <p className="mt-1.5 text-[0.82rem] italic text-ink-faint">
            Direction for this pose is on Pro.
          </p>
        ) : (
          <>
            <p className="mt-1.5 text-[0.85rem] leading-relaxed text-ink-soft">
              {pose.direction}
            </p>
            {pose.coaching && (
              <p className="mt-1.5 text-[0.78rem] leading-relaxed text-ink-faint">
                Watch for: {pose.coaching}
              </p>
            )}
          </>
        )}
      </div>
    </li>
  );
}
