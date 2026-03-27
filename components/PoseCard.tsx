"use client";
import { Heart, Plus, Sparkles } from "lucide-react";
import Image from "next/image";
import { useApp, SavedPose } from "@/context/AppContext";
import type { Pose } from "@/lib/types";
import { useMemo, useState, useRef } from "react";
import ProjectPicker from "./ProjectPicker";
import FavoritePicker from "./FavoritePicker";

export default function PoseCard({ pose }: { pose: Pose }) {
  const {
    isInAnyFavoriteCollection,
    removePoseFromAllFavoriteCollections,
  } = useApp();

  const [pickerOpen, setPickerOpen] = useState(false);
  const [favPickerOpen, setFavPickerOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [aiTips, setAiTips] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const isFav = useMemo(
    () => isInAnyFavoriteCollection(pose.id),
    [pose.id, isInAnyFavoriteCollection]
  );

  const saved: SavedPose = {
    id: pose.id,
    title: pose.title || pose.imageUrl.split("/").pop()!.replace(/\.[^.]+$/, ""),
    category: pose.category as any,
    imageUrl: pose.imageUrl,
  };

  const onHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFav) {
      removePoseFromAllFavoriteCollections(saved.id);
    } else {
      setFavPickerOpen(true);
    }
  };

  const onPlusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPickerOpen(true);
  };

  const onAiTipsClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (aiLoading) {
      abortRef.current?.abort();
      return;
    }
    setAiTips("");
    setAiLoading(true);
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    try {
      const res = await fetch("/api/ai/pose-tips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ poseTitle: saved.title, category: pose.category }),
        signal: ctrl.signal,
      });
      if (!res.ok || !res.body) throw new Error("Request failed");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setAiTips((prev) => prev + decoder.decode(value, { stream: true }));
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setAiTips("Could not load tips. Make sure ANTHROPIC_API_KEY is set.");
      }
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <>
      <div className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition bg-white">
        {/* Thumbnail with overlay + title */}
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="relative block w-full"
          aria-label={`Open ${saved.title}`}
        >
          <Image
            src={pose.imageUrl}
            alt={saved.title}
            width={1200}
            height={1600}
            className="w-full h-72 object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            priority={false}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition" />
          <div className="pointer-events-none absolute bottom-2 left-2 text-white text-sm font-medium drop-shadow">
            {saved.title}
          </div>
        </button>

        {(pose.instructions || (pose.tags && pose.tags.length > 0)) && (
          <div className="p-3">
            {pose.instructions && (
              <div className="text-xs text-neutral-500 line-clamp-2">{pose.instructions}</div>
            )}
            {!!pose.tags?.length && (
              <div className="mt-2 flex flex-wrap gap-1">
                {pose.tags.map((t) => (
                  <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ❤ and ＋ on the card */}
        <div className="absolute bottom-2 right-2 flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition">
          <button
            onClick={onHeartClick}
            className={`p-2 rounded-full bg-white/80 backdrop-blur shadow border ${
              isFav ? "text-pink-600 border-pink-200" : "text-neutral-700 border-black/5"
            } hover:bg-blue-50`}
            title={isFav ? "Remove from favorites" : "Save to favorites"}
            aria-label={isFav ? "Remove from favorites" : "Save to favorites"}
          >
            <Heart size={18} fill={isFav ? "currentColor" : "none"} />
          </button>
          <button
            onClick={onPlusClick}
            className="p-2 rounded-full bg-white/80 backdrop-blur shadow text-neutral-700 border border-black/5 hover:bg-blue-50"
            title="Add to project"
            aria-label="Add to project"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      {/* Modals */}
      {favPickerOpen && <FavoritePicker pose={saved} onClose={() => setFavPickerOpen(false)} />}
      {pickerOpen && <ProjectPicker poseId={pose.id} onClose={() => setPickerOpen(false)} />}

      {/* LIGHTBOX */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative flex flex-col md:flex-row gap-4 max-w-[95vw] max-h-[95vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image */}
            <div className="relative shrink-0">
              <div className="absolute top-3 right-3 flex gap-2 z-10">
                <button
                  onClick={onAiTipsClick}
                  className={`p-2 rounded-full backdrop-blur border border-white/20 transition ${
                    aiLoading
                      ? "bg-violet-500/70 text-white"
                      : "bg-white/25 hover:bg-white/35 text-white"
                  }`}
                  title={aiLoading ? "Stop generating" : "Get AI shooting tips"}
                  aria-label="Get AI shooting tips"
                >
                  <Sparkles size={18} />
                </button>
                <button
                  onClick={onHeartClick}
                  className={`p-2 rounded-full bg-white/25 hover:bg-white/35 text-white backdrop-blur border border-white/20 ${
                    isFav ? "text-pink-300" : "text-white"
                  }`}
                  title={isFav ? "Remove from favorites" : "Save to favorites"}
                  aria-label={isFav ? "Remove from favorites" : "Save to favorites"}
                >
                  <Heart size={18} fill={isFav ? "currentColor" : "none"} />
                </button>
                <button
                  onClick={onPlusClick}
                  className="p-2 rounded-full bg-white/25 hover:bg-white/35 text-white backdrop-blur border border-white/20"
                  title="Add to project"
                  aria-label="Add to project"
                >
                  <Plus size={18} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxOpen(false);
                  }}
                  className="p-2 rounded-full bg-white/25 hover:bg-white/35 text-white backdrop-blur border border-white/20"
                  title="Close"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              <Image
                src={pose.imageUrl}
                alt={saved.title}
                width={2000}
                height={2000}
                className="max-h-[60vh] md:max-h-[90vh] max-w-[90vw] md:max-w-[70vw] object-contain"
                priority
              />
            </div>

            {/* AI Tips panel */}
            {(aiLoading || aiTips) && (
              <div className="w-full md:w-72 shrink-0 bg-white/10 backdrop-blur rounded-2xl p-4 overflow-y-auto max-h-[40vh] md:max-h-[90vh] border border-white/20">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={15} className="text-violet-300" />
                  <span className="text-white text-sm font-semibold">AI Shooting Tips</span>
                  {aiLoading && (
                    <span className="ml-auto text-[10px] text-violet-300 animate-pulse">generating…</span>
                  )}
                </div>
                <p className="text-white/90 text-xs leading-relaxed whitespace-pre-wrap">
                  {aiTips}
                  {aiLoading && <span className="animate-pulse">▌</span>}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
