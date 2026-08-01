/**
 * Turns raw exports (Midjourney PNGs, camera JPEGs) into web-ready WebP variants.
 *
 * Source images are never shipped — only the generated variants under
 * public/gallery/ are served. On the current library this cuts 119 MB down to
 * about 11 MB, which is the difference between a gallery that opens instantly
 * on a phone and one that doesn't.
 *
 *   npm run build:images                       # reads ./source-images
 *   POSE_SOURCE=/path/to/exports npm run build:images
 *
 * Drop new images into <source>/<category>/ and re-run. Then `npm run build:catalog`.
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const SRC_ROOT = path.resolve(ROOT, process.env.POSE_SOURCE ?? "source-images");
const OUT_ROOT = path.join(ROOT, "public", "gallery");

// Three sizes cover every surface: grid thumbnails, the swipe deck, and the lightbox.
const VARIANTS = [
  { name: "thumb", width: 420, quality: 72 },
  { name: "card", width: 900, quality: 78 },
  { name: "full", width: 1800, quality: 82 },
];

const SOURCE_EXT = new Set([".png", ".jpg", ".jpeg", ".webp"]);

/** Stable, URL-safe id derived from the original filename. */
export function slugify(category, filename) {
  const base = filename.replace(/\.[^.]+$/, "");
  const cleaned = base
    // Midjourney prefixes the account id on every export...
    .replace(/^u\d+_/, "")
    // ...and suffixes a job uuid plus the grid index.
    .replace(/_[0-9a-f]{8}-[0-9a-f-]{27,}_\d$/i, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
  return `${category}-${cleaned}`.slice(0, 72);
}

/** Disambiguates ids when several crops came from one prompt. */
function uniqueId(base, taken) {
  if (!taken.has(base)) {
    taken.add(base);
    return base;
  }
  let n = 2;
  while (taken.has(`${base}-${n}`)) n += 1;
  const id = `${base}-${n}`;
  taken.add(id);
  return id;
}

async function processOne(category, filename, id) {
  const srcPath = path.join(SRC_ROOT, category, filename);
  const outDir = path.join(OUT_ROOT, category);
  await fs.mkdir(outDir, { recursive: true });

  const meta = await sharp(srcPath, { failOn: "none" }).metadata();
  const results = {};

  for (const v of VARIANTS) {
    const outPath = path.join(outDir, `${id}-${v.name}.webp`);
    const info = await sharp(srcPath, { failOn: "none" })
      .rotate()
      // Never upscale — a source narrower than the target keeps its own width.
      .resize({ width: Math.min(v.width, meta.width ?? v.width), withoutEnlargement: true })
      .webp({ quality: v.quality, effort: 5 })
      .toFile(outPath);
    results[v.name] = {
      src: `/gallery/${category}/${id}-${v.name}.webp`,
      width: info.width,
      height: info.height,
      bytes: info.size,
    };
  }

  // A 20px preview inlined as a data URI gives every card an instant blur-up
  // placeholder without a second network request.
  const blurBuf = await sharp(srcPath, { failOn: "none" })
    .rotate()
    .resize({ width: 20 })
    .webp({ quality: 40 })
    .toBuffer();

  return {
    id,
    category,
    source: filename,
    aspect: +((meta.height ?? 1) / (meta.width ?? 1)).toFixed(4),
    blur: `data:image/webp;base64,${blurBuf.toString("base64")}`,
    variants: results,
  };
}

async function main() {
  let categories;
  try {
    const entries = await fs.readdir(SRC_ROOT, { withFileTypes: true });
    categories = entries.filter((e) => e.isDirectory()).map((e) => e.name);
  } catch {
    console.error(
      `No source folder at ${SRC_ROOT}.\n` +
        `Create it with a subfolder per category (e.g. source-images/wedding/),\n` +
        `or point POSE_SOURCE at where your exports already live.`,
    );
    process.exit(1);
  }

  if (categories.length === 0) {
    console.error(`${SRC_ROOT} has no category subfolders — nothing to do.`);
    process.exit(1);
  }

  await fs.rm(OUT_ROOT, { recursive: true, force: true });
  await fs.mkdir(OUT_ROOT, { recursive: true });

  const manifest = [];
  let srcBytes = 0;
  let outBytes = 0;

  for (const category of categories) {
    const dir = path.join(SRC_ROOT, category);
    const files = (await fs.readdir(dir, { withFileTypes: true }))
      .filter((e) => e.isFile() && SOURCE_EXT.has(path.extname(e.name).toLowerCase()))
      .map((e) => e.name)
      .sort();

    const taken = new Set();
    console.log(`\n${category}: ${files.length} source images`);

    for (const filename of files) {
      const id = uniqueId(slugify(category, filename), taken);
      srcBytes += (await fs.stat(path.join(dir, filename))).size;
      try {
        const entry = await processOne(category, filename, id);
        outBytes += Object.values(entry.variants).reduce((a, v) => a + v.bytes, 0);
        manifest.push(entry);
        process.stdout.write(".");
      } catch (err) {
        console.error(`\n  skipped ${filename}: ${err.message}`);
      }
    }
  }

  const manifestPath = path.join(ROOT, "lib", "generated", "images.json");
  await fs.mkdir(path.dirname(manifestPath), { recursive: true });
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));

  const mb = (b) => (b / 1024 / 1024).toFixed(1);
  console.log(`\n\n${manifest.length} images processed`);
  console.log(
    `source ${mb(srcBytes)} MB -> web ${mb(outBytes)} MB ` +
      `(${(100 - (outBytes / srcBytes) * 100).toFixed(1)}% smaller)`,
  );
  console.log(`Next: npm run build:catalog`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
