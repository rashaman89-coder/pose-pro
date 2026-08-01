"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, Card, Input, Label } from "../ui";
import { useStudio } from "@/lib/store";
import { verifyKey } from "@/lib/license";

export default function LicencePanel() {
  const { entitlement, isPro, applyEntitlement, deactivate, studioName, setStudioName } =
    useStudio();
  const [key, setKey] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function activate() {
    setBusy(true);
    setMessage(null);
    const result = await verifyKey(key);
    setBusy(false);
    if (result.ok) {
      applyEntitlement(result.entitlement);
      setKey("");
      setMessage(null);
    } else {
      setMessage(result.message ?? "That didn't work.");
    }
  }

  return (
    <Card className="p-5">
      <h2 className="font-display text-lg">Your studio</h2>

      <div className="mt-4 max-w-sm">
        <Label htmlFor="studio-name">Studio name</Label>
        <Input
          id="studio-name"
          value={studioName}
          onChange={(e) => setStudioName(e.target.value)}
          placeholder="Nikola Photography"
        />
        <p className="mt-1.5 text-[0.76rem] text-ink-faint">
          {isPro
            ? "Shown to your couples on the deck you send them."
            : "Pro replaces our name with yours on the couple's screen."}
        </p>
      </div>

      <div className="mt-7 border-t border-border pt-5">
        {isPro ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[0.88rem] font-medium">Pro is active</p>
              <p className="mt-0.5 text-[0.78rem] text-ink-soft">
                {entitlement.email ?? "Licence verified"}
                {entitlement.expiresISO &&
                  ` · renews ${new Date(entitlement.expiresISO).toLocaleDateString()}`}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={deactivate}>
              Sign out of Pro
            </Button>
          </div>
        ) : (
          <>
            <Label htmlFor="licence">Licence key</Label>
            <div className="flex max-w-md flex-wrap gap-2">
              <Input
                id="licence"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && activate()}
                placeholder="Paste the key from your receipt"
                className="min-w-52 flex-1"
              />
              <Button onClick={activate} disabled={busy || !key.trim()}>
                {busy ? "Checking…" : "Activate"}
              </Button>
            </div>
            {message && (
              <p className="mt-2 max-w-md text-[0.8rem] leading-relaxed text-ink-soft">
                {message}
              </p>
            )}
            <p className="mt-3 text-[0.78rem] text-ink-faint">
              Don&apos;t have one?{" "}
              <Link href="/pricing/" className="text-accent underline underline-offset-4">
                See what Pro adds
              </Link>
            </p>
          </>
        )}
      </div>
    </Card>
  );
}
