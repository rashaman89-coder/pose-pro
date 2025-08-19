"use client";
import { useParams, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import PoseCard from "@/components/PoseCard";

export default function FavoriteCollectionPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { favoriteCollections, deleteFavoriteCollection } = useApp();
  const col = favoriteCollections.find((c) => c.id === params.id);

  if (!col) {
    return (
      <main className="p-6 max-w-6xl mx-auto">
        <h1 className="text-xl font-bold mb-3">Collection not found</h1>
      </main>
    );
  }

  const list = col.poses.map((p) => ({
    id: p.id,
    title: p.title,
    category: p.category,
    imageUrl: p.imageUrl,
    instructions: "",
    tags: [],
  }));

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-xl font-bold">{col.name}</h1>
        <button
          className="text-xs px-3 py-2 rounded-lg border hover:bg-blue-50"
          onClick={() => { deleteFavoriteCollection(col.id); router.push("/favorites"); }}
        >
          Delete collection
        </button>
      </div>

      {list.length === 0 && (
        <div className="text-neutral-500">No images in this collection yet.</div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {list.map((p) => (
          <PoseCard key={p.id} pose={p as any} />
        ))}
      </div>
    </main>
  );
}
