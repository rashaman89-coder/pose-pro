"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, Card, Empty, Input, Label, Shell } from "../ui";
import LicencePanel from "./LicencePanel";
import { useStudio } from "@/lib/store";
import { PLANS } from "@/lib/brand";

export default function StudioDashboard() {
  const { ready, projects, createProject, deleteProject, isPro, limits } = useStudio();
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");

  const atLimit = projects.length >= limits.projects;

  function create() {
    if (!name.trim()) return;
    createProject({
      name,
      dateTimeISO: date || undefined,
      location: location.trim() || undefined,
    });
    setName("");
    setDate("");
    setLocation("");
    setCreating(false);
  }

  if (!ready) {
    return (
      <Shell className="py-16">
        <div className="h-6 w-40 animate-pulse rounded bg-paper-sunk" />
      </Shell>
    );
  }

  return (
    <Shell className="py-10 sm:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl">Studio</h1>
          <p className="mt-2 text-[0.92rem] text-ink-soft">
            {projects.length === 0
              ? "Start with the wedding you're shooting next."
              : `${projects.length} ${projects.length === 1 ? "shoot" : "shoots"}`}
            {!isPro && ` · Free plan (${PLANS.free.limits.projects} shoot)`}
          </p>
        </div>

        {!creating && (
          <Button
            onClick={() => setCreating(true)}
            disabled={atLimit}
            title={atLimit ? "The free plan keeps one shoot at a time" : undefined}
          >
            New shoot
          </Button>
        )}
      </div>

      {atLimit && !creating && (
        <Card className="mt-6 p-4">
          <p className="text-[0.88rem] text-ink-soft">
            The free plan holds one shoot at a time. Delete this one when
            it&apos;s done, or{" "}
            <Link href="/pricing/" className="text-accent underline underline-offset-4">
              go Pro
            </Link>{" "}
            to keep every wedding you&apos;ve planned.
          </p>
        </Card>
      )}

      {creating && (
        <Card className="mt-6 p-5">
          <h2 className="font-display text-lg">New shoot</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-3">
              <Label htmlFor="shoot-name">Couple or shoot name</Label>
              <Input
                id="shoot-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && create()}
                placeholder="Ana &amp; Marko"
                autoFocus
              />
            </div>
            <div>
              <Label htmlFor="shoot-date">Date</Label>
              <Input
                id="shoot-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="shoot-loc">Venue</Label>
              <Input
                id="shoot-loc"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Optional"
              />
            </div>
          </div>
          <div className="mt-5 flex gap-2">
            <Button onClick={create} disabled={!name.trim()}>
              Create
            </Button>
            <Button variant="ghost" onClick={() => setCreating(false)}>
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {projects.length === 0 && !creating ? (
        <div className="mt-8">
          <Empty
            title="No shoots yet"
            hint="A shoot holds your pose picks, the link you send the couple, and the list you shoot from on the day."
            action={<Button onClick={() => setCreating(true)}>Create your first</Button>}
          />
        </div>
      ) : (
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => {
            const replies = p.responses?.length ?? 0;
            return (
              <Card key={p.id} className="p-5 transition-shadow hover:shadow-[0_10px_30px_-16px_rgba(0,0,0,0.3)]">
                <Link href={`/studio/shoot/?id=${p.id}`} className="block">
                  <h3 className="font-display text-lg leading-tight">{p.name}</h3>
                  <p className="mt-1 text-[0.78rem] text-ink-soft">
                    {p.dateTimeISO
                      ? new Date(p.dateTimeISO).toLocaleDateString(undefined, {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "No date set"}
                    {p.location ? ` · ${p.location}` : ""}
                  </p>
                  <div className="mt-4 flex gap-4 text-[0.78rem] text-ink-soft">
                    <span>
                      <strong className="text-ink">{p.poseIds.length}</strong> poses
                    </span>
                    <span>
                      <strong className={replies ? "text-accent" : "text-ink"}>
                        {replies}
                      </strong>{" "}
                      {replies === 1 ? "reply" : "replies"}
                    </span>
                  </div>
                </Link>
                <div className="mt-4 border-t border-border pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Delete "${p.name}"? This can't be undone.`)) {
                        deleteProject(p.id);
                      }
                    }}
                    className="cursor-pointer text-[0.76rem] text-ink-faint hover:text-danger"
                  >
                    Delete
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <div className="mt-14">
        <LicencePanel />
      </div>
    </Shell>
  );
}
