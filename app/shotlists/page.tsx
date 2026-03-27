"use client";
import { useState, useRef } from "react";
import { Sparkles, X } from "lucide-react";
import type { Category } from "@/lib/types";

const categories: Category[] = [
  "single", "couple", "wedding", "portrait", "family",
  "newborn", "maternity", "studio", "outdoor", "pets", "fashion",
];

function labelize(cat: string) {
  return cat.slice(0, 1).toUpperCase() + cat.slice(1);
}

export default function ShotlistsPage() {
  const [category, setCategory] = useState<Category>("wedding");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const abortRef = useRef<AbortController | null>(null);

  const toggleCheck = (i: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const onGenerate = async () => {
    if (loading) {
      abortRef.current?.abort();
      return;
    }
    setItems([]);
    setChecked(new Set());
    setLoading(true);
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    let buffer = "";
    try {
      const res = await fetch("/api/ai/shotlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, notes }),
        signal: ctrl.signal,
      });
      if (!res.ok || !res.body) throw new Error("Request failed");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        // Parse completed lines starting with "- "
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        const parsed = lines
          .map((l) => l.trim())
          .filter((l) => l.startsWith("- "))
          .map((l) => l.slice(2).trim());
        if (parsed.length) {
          setItems((prev) => [...prev, ...parsed]);
        }
      }
      // Flush remaining buffer
      if (buffer.trim().startsWith("- ")) {
        setItems((prev) => [...prev, buffer.trim().slice(2).trim()]);
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setItems(["Error: Could not generate shot list. Make sure ANTHROPIC_API_KEY is set."]);
      }
    } finally {
      setLoading(false);
    }
  };

  const done = checked.size;
  const total = items.length;

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">Shot Lists</h1>
      <p className="text-sm text-neutral-500 mb-6">
        Generate an AI-powered shot list for any photography session.
      </p>

      {/* Controls */}
      <div className="bg-white border rounded-2xl p-4 mb-6 space-y-4 shadow-sm">
        <div>
          <label className="text-xs font-semibold text-neutral-600 mb-1.5 block">Category</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-3 py-1 rounded-full text-sm border transition ${
                  c === category
                    ? "bg-violet-600 text-white border-violet-600"
                    : "hover:bg-violet-50 border-neutral-200"
                }`}
              >
                {labelize(c)}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-neutral-600 mb-1.5 block">
            Notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. outdoor sunset session, 2 kids, bring drone"
            rows={2}
            className="w-full border rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-300"
          />
        </div>
        <button
          onClick={onGenerate}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
            loading
              ? "bg-red-100 text-red-600 hover:bg-red-200"
              : "bg-violet-600 text-white hover:bg-violet-700"
          }`}
        >
          <Sparkles size={15} />
          {loading ? "Stop generating" : "Generate with AI"}
        </button>
      </div>

      {/* Generated list */}
      {(items.length > 0 || loading) && (
        <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <span className="text-sm font-semibold">
              {labelize(category)} Shot List
              {total > 0 && (
                <span className="ml-2 text-xs font-normal text-neutral-400">
                  {done}/{total} done
                </span>
              )}
            </span>
            {items.length > 0 && (
              <button
                onClick={() => { setItems([]); setChecked(new Set()); }}
                className="text-neutral-400 hover:text-neutral-600 transition"
                aria-label="Clear list"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {total > 0 && (
            <div className="px-4 py-1">
              <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-violet-500 rounded-full transition-all"
                  style={{ width: total ? `${(done / total) * 100}%` : "0%" }}
                />
              </div>
            </div>
          )}

          <ul className="divide-y">
            {items.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-neutral-50 transition"
                onClick={() => toggleCheck(i)}
              >
                <div
                  className={`mt-0.5 w-4 h-4 shrink-0 rounded border-2 flex items-center justify-center transition ${
                    checked.has(i)
                      ? "bg-violet-600 border-violet-600"
                      : "border-neutral-300"
                  }`}
                >
                  {checked.has(i) && (
                    <svg viewBox="0 0 10 8" className="w-2.5 h-2.5 fill-white">
                      <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className={`text-sm leading-snug ${checked.has(i) ? "line-through text-neutral-400" : ""}`}>
                  {item}
                </span>
              </li>
            ))}
            {loading && (
              <li className="px-4 py-3 text-sm text-neutral-400 flex items-center gap-2">
                <Sparkles size={13} className="text-violet-400 animate-pulse" />
                Generating…
              </li>
            )}
          </ul>
        </div>
      )}
    </main>
  );
}
