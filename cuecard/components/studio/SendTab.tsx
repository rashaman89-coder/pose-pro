"use client";

import { useMemo, useState } from "react";
import { Button, Card, Label, ProBadge, Textarea } from "../ui";
import { useStudio } from "@/lib/store";
import { posesByIds } from "@/lib/catalog";
import { encodeDeck } from "@/lib/codec";
import { brand } from "@/lib/brand";
import type { Project } from "@/lib/types";

export default function SendTab({ project }: { project: Project }) {
  const { studioName, isPro, limits } = useStudio();
  const [note, setNote] = useState("");
  const [copied, setCopied] = useState(false);

  const poses = posesByIds(project.poseIds);
  const included = poses.slice(0, limits.deckSize);
  const trimmed = poses.length - included.length;

  const link = useMemo(() => {
    if (included.length === 0) return "";
    const payload = encodeDeck({
      title: project.name,
      studio: isPro && studioName.trim() ? studioName.trim() : brand.name,
      poses: included.map((p) => p.index),
      note: note.trim() || undefined,
    });
    // Built from the live origin so it works identically on localhost and in
    // production without a configured base URL.
    const origin =
      typeof window !== "undefined" ? window.location.origin : brand.url;
    return `${origin}/deck/?d=${payload}`;
  }, [included, project.name, studioName, isPro, note]);

  const message =
    `Hey! Before ${project.name}, have a look through these and tell me which ` +
    `ones feel like you — takes a few minutes on your phone:\n\n${link}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      /* Clipboard blocked — the field below is selectable. */
    }
  }

  if (included.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="font-display text-lg">Pick some poses first</p>
        <p className="mx-auto mt-2 max-w-sm text-[0.88rem] text-ink-soft">
          The link you send carries the poses inside it. Add a few on the Poses
          tab and this fills in.
        </p>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-6">
        <Card className="p-5">
          <h2 className="font-display text-lg">The link</h2>
          <p className="mt-1.5 text-[0.85rem] text-ink-soft">
            {included.length} poses, wrapped inside the address itself. Nothing
            expires, nothing needs an account, and it keeps working if we ever
            go offline.
          </p>

          <div className="mt-4 rounded-xl border border-border bg-paper-sunk p-3">
            <p className="break-all font-mono text-[0.72rem] leading-relaxed text-ink-soft">
              {link}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={copy} variant={copied ? "outline" : "primary"}>
              {copied ? "Copied" : "Copy link"}
            </Button>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(message)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center rounded-full border border-border
                         px-5 text-[0.9rem] font-medium hover:bg-paper-sunk"
            >
              WhatsApp
            </a>
            <a
              href={`sms:?&body=${encodeURIComponent(message)}`}
              className="inline-flex h-11 items-center rounded-full border border-border
                         px-5 text-[0.9rem] font-medium hover:bg-paper-sunk"
            >
              Text
            </a>
            <a
              href={`mailto:?subject=${encodeURIComponent(
                `A few photos before ${project.name}`,
              )}&body=${encodeURIComponent(message)}`}
              className="inline-flex h-11 items-center rounded-full border border-border
                         px-5 text-[0.9rem] font-medium hover:bg-paper-sunk"
            >
              Email
            </a>
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center rounded-full px-4 text-[0.9rem]
                         font-medium text-accent underline underline-offset-4"
            >
              Preview it
            </a>
          </div>

          {trimmed > 0 && (
            <p className="mt-4 rounded-lg bg-paper-sunk px-3 py-2 text-[0.8rem] text-ink-soft">
              {trimmed} {trimmed === 1 ? "pose is" : "poses are"} not in this link —
              the free plan sends up to {limits.deckSize}.
            </p>
          )}
        </Card>

        <Card className="p-5">
          <Label htmlFor="deck-note">A line for them (optional)</Label>
          <Textarea
            id="deck-note"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value.slice(0, 400))}
            placeholder="Shown on the first screen. Something like: don't overthink it, just tap the ones that feel like you."
          />
          <p className="mt-1.5 text-[0.74rem] text-ink-faint">
            {note.length}/400
          </p>
        </Card>
      </div>

      <Card className="h-fit p-5">
        <h3 className="text-[0.68rem] font-semibold uppercase tracking-[0.11em] text-ink-faint">
          What they&apos;ll see
        </h3>
        <div className="mt-3 space-y-2.5 text-[0.85rem]">
          <Row label="From" value={isPro && studioName.trim() ? studioName : brand.name} />
          <Row label="Shoot" value={project.name} />
          <Row label="Photos" value={`${included.length}`} />
          <Row
            label="Takes"
            value={`about ${Math.max(2, Math.round(included.length / 9))} min`}
          />
        </div>

        {!isPro && (
          <div className="mt-5 rounded-xl border border-dashed border-border p-4">
            <ProBadge />
            <p className="mt-2 text-[0.82rem] leading-relaxed text-ink-soft">
              Pro puts your studio name at the top of their screen instead of
              ours, and lifts the {limits.deckSize}-pose cap.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 border-b border-border pb-2 last:border-0">
      <span className="text-ink-soft">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}
