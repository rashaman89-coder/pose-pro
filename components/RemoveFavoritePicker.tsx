"use client";
import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";

export default function RemoveFavoritePicker({
  poseId,
  onClose,
}: {
  poseId: string;
  onClose: () => void;
}) {
  const { getCollectionsContaining, removePoseFromFavoriteCollection } = useApp();
  const collections = getCollectionsContaining(poseId);
  const [selected, setSelected] = useState<string[]>(collections.map((c) => c.id));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const remove = () => {
    selected.forEach((id) => removePoseFromFavoriteCollection(poseId, id));
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-4 shadow"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-sm font-semibold mb-2">Remove from collection</div>

        {collections.length === 0 ? (
          <div className="text-sm text-neutral-600 mb-4">
            This photo is not in any collection.
          </div>
        ) : (
          <div className="max-h-56 overflow-auto space-y-2 mb-3">
            {collections.map((c) => (
              <label
                key={c.id}
                className="flex items-center justify-between px-3 py-2 rounded-lg border hover:bg-black/5 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selected.includes(c.id)}
                    onChange={() => toggle(c.id)}
                  />
                  <span>{c.name}</span>
                </div>
                <span className="text-xs text-neutral-500">{c.poses.length}</span>
              </label>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <button className="flex-1 px-3 py-2 rounded-lg border" onClick={onClose}>
            Cancel
          </button>
          <button
            className="flex-1 px-3 py-2 rounded-lg border bg-black text-white disabled:opacity-50"
            onClick={remove}
            disabled={selected.length === 0}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
