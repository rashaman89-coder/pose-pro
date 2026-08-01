"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Empty, Shell } from "../ui";
import { useStudio } from "@/lib/store";
import PosesTab from "./PosesTab";
import SendTab from "./SendTab";
import RepliesTab from "./RepliesTab";
import ShotListTab from "./ShotListTab";

const TABS = [
  { id: "poses", label: "Poses" },
  { id: "send", label: "Send to couple" },
  { id: "replies", label: "Replies" },
  { id: "list", label: "Shot list" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function ShootEditor() {
  const params = useSearchParams();
  const id = params.get("id") ?? "";
  const { ready, projects } = useStudio();
  const [tab, setTab] = useState<TabId>("poses");

  const project = projects.find((p) => p.id === id);

  if (!ready) {
    return (
      <Shell className="py-16">
        <div className="h-6 w-40 animate-pulse rounded bg-paper-sunk" />
      </Shell>
    );
  }

  if (!project) {
    return (
      <Shell className="py-16">
        <Empty
          title="That shoot isn't here"
          hint="Shoots live in this browser only. If you opened this link on another device or cleared your data, it won't be found."
          action={
            <Link
              href="/studio/"
              className="inline-flex h-11 items-center rounded-full bg-ink px-5
                         text-[0.9rem] font-medium text-paper hover:opacity-88"
            >
              Back to studio
            </Link>
          }
        />
      </Shell>
    );
  }

  const replyCount = project.responses?.length ?? 0;

  return (
    <Shell className="py-8 sm:py-12">
      <div className="no-print">
        <Link
          href="/studio/"
          className="text-[0.8rem] text-ink-soft hover:text-ink"
        >
          ← Studio
        </Link>

        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl">{project.name}</h1>
            <p className="mt-1.5 text-[0.84rem] text-ink-soft">
              {project.dateTimeISO
                ? new Date(project.dateTimeISO).toLocaleDateString(undefined, {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "No date set"}
              {project.location ? ` · ${project.location}` : ""}
              {" · "}
              {project.poseIds.length} poses
            </p>
          </div>
        </div>

        <nav className="no-scrollbar mt-7 -mx-4 flex gap-1 overflow-x-auto border-b border-border px-4 sm:mx-0 sm:px-0">
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                aria-current={active ? "page" : undefined}
                className={`relative shrink-0 cursor-pointer px-4 py-2.5 text-[0.86rem]
                            transition-colors ${
                              active
                                ? "font-medium text-ink"
                                : "text-ink-soft hover:text-ink"
                            }`}
              >
                {t.label}
                {t.id === "replies" && replyCount > 0 && (
                  <span className="ml-1.5 rounded-full bg-accent px-1.5 py-0.5 text-[0.62rem] font-semibold text-accent-ink">
                    {replyCount}
                  </span>
                )}
                {active && (
                  <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-ink" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-8">
        {tab === "poses" && <PosesTab project={project} />}
        {tab === "send" && <SendTab project={project} />}
        {tab === "replies" && <RepliesTab project={project} />}
        {tab === "list" && <ShotListTab project={project} />}
      </div>
    </Shell>
  );
}
