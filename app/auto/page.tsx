"use client";
import { useEffect, useMemo, useState } from "react";
import PoseCard from "@/components/PoseCard";
import type { Pose, Category } from "@/lib/types";
import Link from "next/link";

const categories: Category[] = [
  "single","couple","wedding","portrait","family",
  "newborn","maternity","studio","outdoor","pets","fashion"
];

function labelize(cat: string) {
  return cat.slice(0,1).toUpperCase() + cat.slice(1);
}

export default function AutoPage({ searchParams }: { searchParams: { category?: string } }) {
  const cat = (searchParams?.category || "wedding") as Category;
  const [poses, setPoses] = useState<Pose[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/list-images?category=${cat}`)
      .then((r) => r.json())
      .then((data: { files: string[] }) => {
        const mapped: Pose[] = (data.files || []).map((url, idx) => ({
          id: `${cat}-${idx}-${url}`,
          title: url.split("/").pop()!.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
          category: cat,
          imageUrl: url,
          instructions: "",
          tags: []
        }));
        setPoses(mapped);
      })
      .finally(() => setLoading(false));
  }, [cat]);

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
        Gallery — {labelize(cat)}
      </h1>
      <p className="text-sm text-neutral-600 mb-4">
        Click a photo for fullscreen. Use ❤ to save to favorites, ＋ to add to a project.
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((c) => (
          <Link
            key={c}
            href={`/auto?category=${c}`}
            className={`px-3 py-1.5 rounded-xl border text-sm transition ${
              c === cat ? "bg-blue-600 text-white border-blue-600" : "hover:bg-blue-50"
            }`}
          >
            {labelize(c)}
          </Link>
        ))}
      </div>

      {loading && <div className="text-neutral-500">Loading…</div>}
      {!loading && poses.length === 0 && (
        <div className="text-neutral-500">
          No images found in <code>public/images/{cat}</code>.
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {poses.map((p) => (
          <PoseCard key={p.id} pose={p} />
        ))}
      </div>
    </main>
  );
}
