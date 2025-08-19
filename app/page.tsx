"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Category } from "@/lib/types";

const categories: Category[] = [
  "single","couple","wedding","portrait","family",
  "newborn","maternity","studio","outdoor","pets","fashion"
];

function labelize(cat: string) {
  return cat.slice(0,1).toUpperCase() + cat.slice(1);
}

type Hero = { cat: Category; url: string | null };

export default function HomePage() {
  const [heroes, setHeroes] = useState<Hero[]>([]);

  useEffect(() => {
    // za svaku kategoriju pokupi PRVU sliku iz foldera
    Promise.all(
      categories.map(async (cat) => {
        try {
          const r = await fetch(`/api/list-images?category=${cat}`);
          const data = await r.json();
          const first = (data.files && data.files[0]) || null;
          return { cat, url: first };
        } catch {
          return { cat, url: null };
        }
      })
    ).then(setHeroes);
  }, []);

  const heroFor = (cat: Category) => heroes.find(h => h.cat === cat)?.url || null;

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">Pose Pro</h1>
      <p className="text-sm text-neutral-600 mb-4">Browse categories and build your shot lists.</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {categories.map((c) => {
          const bg = heroFor(c);
          return (
            <Link
              key={c}
              href={`/auto?category=${c}`}
              className="relative rounded-2xl overflow-hidden border group"
              aria-label={`Open ${labelize(c)} gallery`}
            >
              <div
                className="h-36 sm:h-40 md:h-44 w-full bg-neutral-200"
                style={{
                  backgroundImage: bg
                    ? `linear-gradient(to top, rgba(0,0,0,.45), rgba(0,0,0,.05)), url(${bg})`
                    : "linear-gradient(to top, rgba(0,0,0,.05), rgba(0,0,0,.0))",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div className="absolute inset-0 flex items-end p-3">
                <div className="text-white text-sm font-semibold drop-shadow">
                  {labelize(c)}
                </div>
              </div>
              <div className="absolute inset-0 rounded-2xl ring-0 group-hover:ring-4 ring-blue-300/60 transition" />
            </Link>
          );
        })}
      </div>
    </main>
  );
}
