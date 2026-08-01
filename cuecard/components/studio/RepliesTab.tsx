"use client";

import { useState } from "react";
import PoseImage from "../PoseImage";
import { Button, Card, Input, Label } from "../ui";
import { useStudio } from "@/lib/store";
import { posesByIds } from "@/lib/catalog";
import { VERDICT, deckHash, decodeReply, summarizeReply } from "@/lib/codec";
import type { ClientResponse, Project } from "@/lib/types";

export default function RepliesTab({ project }: { project: Project }) {
  const { recordResponse, limits } = useStudio();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const poses = posesByIds(project.poseIds);
  const sent = poses.slice(0, limits.deckSize);
  const responses = project.responses ?? [];

  function paste() {
    setError(null);
    let reply;
    try {
      reply = decodeReply(code);
    } catch (err) {
      setError(err instanceof Error ? err.message : "That code didn't read.");
      return;
    }

    // Guard against a code from a different shoot's deck.
    if (reply.deckHash !== deckHash(sent.map((p) => p.index))) {
      setError(
        "This code is from a different deck. If you changed the poses after " +
          "sending, send the link again and ask for a fresh code.",
      );
      return;
    }

    const summary = summarizeReply(reply.verdicts);
    const response: ClientResponse = {
      receivedISO: new Date().toISOString(),
      loved: sent.filter((_, i) => reply.verdicts[i] === VERDICT.love).map((p) => p.id),
      maybe: sent.filter((_, i) => reply.verdicts[i] === VERDICT.maybe).map((p) => p.id),
      no: sent.filter((_, i) => reply.verdicts[i] === VERDICT.no).map((p) => p.id),
      completion: summary.completion,
    };

    recordResponse(project.id, response);
    setCode("");
  }

  return (
    <div className="space-y-6">
      <Card className="p-5">
        <h2 className="font-display text-lg">Paste their code</h2>
        <p className="mt-1.5 max-w-lg text-[0.85rem] text-ink-soft">
          When your couple finishes, they get a short code. Paste it here and
          their picks land in this shoot.
        </p>
        <div className="mt-4 flex max-w-lg flex-wrap gap-2">
          <Label htmlFor="reply-code" className="sr-only">
            Reply code
          </Label>
          <Input
            id="reply-code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && paste()}
            placeholder="PP-XXXX-XXXX-XXXX"
            className="min-w-52 flex-1 font-mono"
          />
          <Button onClick={paste} disabled={!code.trim()}>
            Add
          </Button>
        </div>
        {error && (
          <p className="mt-2.5 max-w-lg text-[0.82rem] leading-relaxed text-danger">
            {error}
          </p>
        )}
      </Card>

      {responses.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="font-display text-lg">Nothing back yet</p>
          <p className="mx-auto mt-2 max-w-sm text-[0.88rem] text-ink-soft">
            Once they send their code, you&apos;ll see exactly which frames they
            want — and which to quietly drop.
          </p>
        </Card>
      ) : (
        responses.map((response, i) => (
          <ResponseCard
            key={response.receivedISO}
            response={response}
            isLatest={i === 0}
          />
        ))
      )}
    </div>
  );
}

function ResponseCard({
  response,
  isLatest,
}: {
  response: ClientResponse;
  isLatest: boolean;
}) {
  const loved = posesByIds(response.loved);
  const maybe = posesByIds(response.maybe);

  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-lg">
            {isLatest ? "Their picks" : "Earlier reply"}
          </h3>
          <p className="mt-0.5 text-[0.78rem] text-ink-soft">
            {new Date(response.receivedISO).toLocaleString(undefined, {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            })}
            {response.completion < 100 && ` · they got through ${response.completion}%`}
          </p>
        </div>
        <div className="flex gap-4 text-[0.82rem]">
          <span>
            <strong className="text-love">{response.loved.length}</strong> loved
          </span>
          <span>
            <strong className="text-maybe">{response.maybe.length}</strong> maybe
          </span>
          <span className="text-ink-soft">
            <strong>{response.no.length}</strong> passed
          </span>
        </div>
      </div>

      {loved.length > 0 && (
        <Group title="Shoot these" tone="text-love" poses={loved} />
      )}
      {maybe.length > 0 && (
        <Group title="If there's time" tone="text-maybe" poses={maybe} />
      )}
    </Card>
  );
}

function Group({
  title,
  tone,
  poses,
}: {
  title: string;
  tone: string;
  poses: ReturnType<typeof posesByIds>;
}) {
  return (
    <section className="mt-6">
      <h4 className={`text-[0.68rem] font-semibold uppercase tracking-[0.11em] ${tone}`}>
        {title} · {poses.length}
      </h4>
      <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-8">
        {poses.map((pose) => (
          <figure key={pose.id}>
            <PoseImage
              pose={pose}
              size="thumb"
              className="aspect-[3/4] w-full rounded-lg"
              sizes="(min-width: 1024px) 12vw, 30vw"
            />
            <figcaption className="mt-1 line-clamp-2 text-[0.68rem] leading-snug text-ink-soft">
              {pose.title}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
