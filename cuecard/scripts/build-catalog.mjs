/**
 * Merges the generated image manifest with the hand-authored editorial layer
 * into the single catalog the app imports.
 *
 * Run: npm run build:catalog   (or npm run content to redo images first)
 */
import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const IMAGES = path.join(ROOT, "lib", "generated", "images.json");
const META = path.join(ROOT, "content", "pose-meta.json");
const OUT = path.join(ROOT, "lib", "generated", "catalog.json");

const FRAMINGS = new Set(["full-length", "half-body", "close-up"]);
const SUBJECTS = new Set(["couple", "bride", "groom", "bridal-party", "family"]);
const MOMENTS = new Set([
  "getting-ready", "first-look", "ceremony",
  "portraits", "golden-hour", "reception",
]);
const DIFFICULTIES = new Set(["easy", "medium", "advanced"]);

/**
 * How many poses per (subject, framing) bucket keep their direction text on the
 * free tier. Enough that a free user can run a whole wedding and judge whether
 * the writing is worth paying for; not so many that Pro has nothing left.
 */
const FREE_PER_BUCKET = 5;

function inferFromId(id) {
  const framing = id.includes("half-body") ? "half-body" : "full-length";
  const subject = /couple/.test(id)
    ? "couple"
    : /bridal|bride/.test(id)
      ? "bride"
      : /groom/.test(id)
        ? "groom"
        : "couple";
  return { framing, subject };
}

function titleFromId(id) {
  const cleaned = id
    .replace(/^wedding-/, "")
    .replace(/-(same|consistent|waist-up|photography|portrait|pose)\b/g, " ")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

function oneOf(value, allowed, fallback) {
  return allowed.has(value) ? value : fallback;
}

function cleanTags(tags) {
  if (!Array.isArray(tags)) return [];
  // Words that describe every pose in the library carry no filtering value.
  const banned = new Set(["wedding", "photo", "photography", "pose", "beautiful", "nice"]);
  return [
    ...new Set(
      tags
        .map((t) => String(t).toLowerCase().trim().replace(/\s+/g, "-"))
        .filter((t) => t && t.length <= 24 && !banned.has(t)),
    ),
  ].slice(0, 6);
}

async function readJson(file, fallback) {
  try {
    return JSON.parse(await fs.readFile(file, "utf8"));
  } catch (err) {
    if (fallback !== undefined) return fallback;
    throw new Error(`Cannot read ${path.relative(ROOT, file)}: ${err.message}`);
  }
}

async function main() {
  const images = await readJson(IMAGES);
  const metaList = await readJson(META, []);
  const metaById = new Map(metaList.map((m) => [m.id, m]));

  const missing = [];
  const poses = images.map((img, index) => {
    const meta = metaById.get(img.id);
    if (!meta) missing.push(img.id);
    const inferred = inferFromId(img.id);

    return {
      id: img.id,
      index,
      category: img.category,
      title: (meta?.title || titleFromId(img.id)).slice(0, 70),
      framing: oneOf(meta?.framing, FRAMINGS, inferred.framing),
      subject: oneOf(meta?.subject, SUBJECTS, inferred.subject),
      moment: oneOf(meta?.moment, MOMENTS, "portraits"),
      difficulty: oneOf(meta?.difficulty, DIFFICULTIES, "easy"),
      direction: meta?.direction || "",
      lighting: meta?.lighting || "",
      lens: meta?.lens || "",
      coaching: meta?.coaching || "",
      tags: cleanTags(meta?.tags),
      image: {
        thumb: img.variants.thumb.src,
        card: img.variants.card.src,
        full: img.variants.full.src,
        blur: img.blur,
        aspect: img.aspect,
        width: img.variants.full.width,
        height: img.variants.full.height,
      },
      pro: true,
    };
  });

  // Unlock a spread across every subject and framing, so the free tier is
  // genuinely usable rather than a teaser wall.
  const quota = new Map();
  for (const pose of poses) {
    const key = `${pose.subject}:${pose.framing}`;
    const used = quota.get(key) ?? 0;
    if (used < FREE_PER_BUCKET && pose.direction) {
      pose.pro = false;
      quota.set(key, used + 1);
    }
  }

  await fs.mkdir(path.dirname(OUT), { recursive: true });
  await fs.writeFile(OUT, JSON.stringify(poses, null, 2));

  const withText = poses.filter((p) => p.direction).length;
  const free = poses.filter((p) => !p.pro).length;
  console.log(`catalog: ${poses.length} poses -> ${path.relative(ROOT, OUT)}`);
  console.log(`  with direction text: ${withText}/${poses.length}`);
  console.log(`  free tier unlocked:  ${free}`);
  if (missing.length) {
    console.warn(`  MISSING metadata for ${missing.length}:`);
    for (const id of missing.slice(0, 10)) console.warn(`    - ${id}`);
    if (missing.length > 10) console.warn(`    ... and ${missing.length - 10} more`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
