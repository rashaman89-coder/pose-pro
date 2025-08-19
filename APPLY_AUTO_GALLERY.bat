@echo off
setlocal enableextensions
title Patch: Auto Gallery + API

REM 1) Prelaz u folder projekta (ovaj .bat stavi u root projekta npr. pose-app-starter\)
cd /d "%~dp0"

REM 2) Sredi next.config.mjs (ukloni experimental appDir warning)
echo /** @type {import('next').NextConfig} */> next.config.mjs
echo const nextConfig = {};>> next.config.mjs
echo export default nextConfig;>> next.config.mjs

REM 3) Napravi foldere
mkdir app\api\list-images 2>nul
mkdir app\auto 2>nul
mkdir public\images\wedding 2>nul

REM 4) Upisi route.ts (API koji cita slike iz public/images/<category>)
powershell -NoProfile -Command ^
  "$code = @'
import fs from \"node:fs\";
import path from \"node:path\";
import { NextResponse } from \"next/server\";

const ALLOWED = new Set([\".jpg\", \".jpeg\", \".png\", \".webp\"]);

export async function GET(req: Request) {
  const url = new URL(req.url);
  const category = (url.searchParams.get(\"category\") || \"wedding\").toLowerCase();
  const dir = path.join(process.cwd(), \"public\", \"images\", category);

  try {
    const files = fs
      .readdirSync(dir, { withFileTypes: true })
      .filter((d) => d.isFile())
      .map((d) => d.name)
      .filter((name) => ALLOWED.has(path.extname(name).toLowerCase()))
      .map((name) => `/images/${category}/${name}`);

    return NextResponse.json({ category, files });
  } catch {
    return NextResponse.json({ category, files: [] });
  }
}
'@; Set-Content -Path 'app/api/list-images/route.ts' -Value $code -Encoding UTF8"

REM 5) Upisi page.tsx (stranica koja automatski prikazuje slike kao kartice)
powershell -NoProfile -Command ^
  "$code = @'
\"use client\";
import { useEffect, useState } from \"react\";
import PoseCard from \"@/components/PoseCard\";
import type { Pose, Category } from \"@/lib/types\";
import Link from \"next/link\";

const categories: Category[] = [
  \"single\",\"couple\",\"wedding\",\"portrait\",\"family\",
  \"newborn\",\"maternity\",\"studio\",\"outdoor\",\"pets\",\"fashion\"
];

export default function AutoPage({ searchParams }: { searchParams: { category?: string } }) {
  const cat = (searchParams?.category || \"wedding\") as Category;
  const [poses, setPoses] = useState<Pose[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/list-images?category=${cat}`)
      .then((r) => r.json())
      .then((data: { files: string[] }) => {
        const mapped: Pose[] = (data.files || []).map((url, idx) => ({
          id: `${cat}-${idx}-${url}`,
          title: url.split(\"/\").pop()!.replace(/\.[^.]+$/, \"\").replace(/[-_]/g, \" \"),
          category: cat,
          imageUrl: url,
          instructions: \"\",
          tags: []
        }));
        setPoses(mapped);
        setLoading(false);
      })
      .catch(() => setPoses([]));
  }, [cat]);

  return (
    <main className=\"p-6 max-w-6xl mx-auto\">
      <h1 className=\"text-xl font-bold mb-4\">Auto Gallery — {cat}</h1>

      <div className=\"flex flex-wrap gap-2 mb-4\">
        {categories.map((c) => (
          <Link
            key={c}
            href={`/auto?category=${c}`}
            className={`px-3 py-1.5 rounded-xl border text-sm ${c === cat ? \"bg-black text-white\" : \"bg-white\"}`}
          >
            {c}
          </Link>
        ))}
      </div>

      {loading && <div className=\"text-neutral-500\">Loading…</div>}

      {!loading && poses.length === 0 && (
        <div className=\"text-neutral-500\">
          Nema pronađenih slika u <code>public/images/{cat}</code>.
        </div>
      )}

      <div className=\"grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4\">
        {poses.map((p) => (
          <PoseCard key={p.id} pose={p} />
        ))}
      </div>
    </main>
  );
}
'@; Set-Content -Path 'app/auto/page.tsx' -Value $code -Encoding UTF8"

echo.
echo ==========================================
echo  Patch zavrsen. Slede koraci:
echo  1) U ovaj projekat stavi slike u:
echo     public\images\wedding  (ili couple, portrait itd.)
echo  2) Pokreni: npm run dev
echo  3) Otvori:  http://localhost:3000/auto?category=wedding
echo ==========================================
echo.
pause
