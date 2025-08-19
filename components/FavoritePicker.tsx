"use client";
import { useState, useEffect } from "react";
import { useApp, SavedPose } from "@/context/AppContext";

export default function FavoritePicker({
  pose,
  onClose,
}: {
  pose: SavedPose;
  onClose: () => void;
}) {
  const { favoriteCollections, addPoseToFavoriteCollection, createFavoriteCollection } = useApp();
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleAdd = (collectionId: string) => {
    addPoseToFavoriteCollection(pose, collectionId);
    onClose();
  };

  const handleCreate = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const id = createFavoriteCollection(trimmed);
    addPoseToFavoriteCollection(pose, id);
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
        <div className="text-sm font-semibold mb-2">Save to collection</div>

        <div className="max-h-56 overflow-auto space-y-2 mb-3">
          {favoriteCollections.map((c) => (
            <button
              key={c.id}
              className="w-full text-left px-3 py-2 rounded-lg border hover:bg-blue-50 flex items-center justify-between"
              onClick={() => handleAdd(c.id)}
            >
              <span>{c.name}</span>
              <span className="text-xs text-neutral-500">{c.poses.length}</span>
            </button>
          ))}
        </div>

        {!creating ? (
          <button
            className="w-full px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => setCreating(true)}
          >
            + New collection
          </button>
        ) : (
          <div className="space-y-2">
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Collection name (e.g., City)"
              className="w-full px-3 py-2 rounded-lg border"
            />
            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 rounded-lg border" onClick={() => setCreating(false)}>
                Cancel
              </button>
              <button
                className="flex-1 px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                onClick={handleCreate}
              >
                Create & save
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
