"use client";
import Link from "next/link";
import { useApp } from "@/context/AppContext";

export default function FavoritesPage() {
  const { favoriteCollections, deleteFavoriteCollection } = useApp();

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Favorite Collections</h1>
      </div>

      {favoriteCollections.length === 0 && (
        <div className="text-neutral-500">No collections yet.</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {favoriteCollections.map((c) => (
          <div key={c.id} className="rounded-xl border p-4">
            <div className="flex items-start justify-between">
              <Link href={`/favorites/${c.id}`} className="font-medium hover:underline">
                {c.name}
              </Link>
              <button
                className="text-xs px-2 py-1 rounded-lg border hover:bg-blue-50"
                onClick={() => deleteFavoriteCollection(c.id)}
                title="Delete collection"
              >
                Delete
              </button>
            </div>
            <div className="text-xs text-neutral-500">{c.poses.length} saved</div>
          </div>
        ))}
      </div>
    </main>
  );
}
