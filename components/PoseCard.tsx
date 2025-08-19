"use client";
import { Heart, Plus } from "lucide-react";
import Image from "next/image";
import { useApp, SavedPose } from "@/context/AppContext";
import type { Pose } from "@/lib/types";
import { useMemo, useState } from "react";
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
      // remove from ALL collections immediately
      removePoseFromAllFavoriteCollections(saved.id);
    } else {
      // add to a collection
      setFavPickerOpen(true);
    }
  };

  const onPlusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPickerOpen(true);
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
        <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
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
          <div className="relative max-w-[95vw] max-h-[95vh]" onClick={(e) => e.stopPropagation()}>
            <div className="absolute top-3 right-3 flex gap-2 z-10">
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
              className="max-h-[90vh] max-w-[90vw] object-contain"
              priority
            />
          </div>
        </div>
      )}
    </>
  );
}
