import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

const ALLOWED = new Set([".jpg", ".jpeg", ".png", ".webp"]);

export async function GET(req: Request) {
  const url = new URL(req.url);
  const category = (url.searchParams.get("category") || "wedding").toLowerCase();
  const dir = path.join(process.cwd(), "public", "images", category);

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
