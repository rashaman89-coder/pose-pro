/**
 * Downloads the images listed in content/generated-manifest.json into
 * source-images/wedding/, ready for `npm run content`.
 *
 *   npm run fetch:generated
 *
 * Why this exists as a separate step: the sandbox that authored the poses and
 * ran the generations cannot reach the image CDN — outbound HTTPS there is on
 * an allowlist that the CDN is not on. Rather than smuggle a few megabytes of
 * base64 through a chat transcript, the URLs are committed and the fetch runs
 * wherever there is ordinary internet.
 *
 * Every file is verified as a real, decodable image before it is kept. A
 * truncated download or an error page saved with a .png extension would
 * otherwise sail through and only fail later inside the build.
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const MANIFEST = path.join(ROOT, "content", "generated-manifest.json");
const OUT_DIR = path.join(ROOT, "source-images", "wedding");

/** Anything smaller than this is an error page, not a 2K photograph. */
const MIN_BYTES = 50_000;

async function fetchOne(url, dest) {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < MIN_BYTES) {
    throw new Error(`only ${buf.length} bytes — looks like an error page`);
  }

  // Decode it before trusting it. sharp throws on anything that isn't a real
  // image, which covers truncated transfers and HTML served with a .png name.
  const meta = await sharp(buf).metadata();
  if (!meta.width || !meta.height) throw new Error("not a decodable image");
  if (meta.width < 800) throw new Error(`only ${meta.width}px wide`);

  await fs.writeFile(dest, buf);
  return { bytes: buf.length, size: `${meta.width}x${meta.height}`, format: meta.format };
}

async function main() {
  let manifest;
  try {
    manifest = JSON.parse(await fs.readFile(MANIFEST, "utf8"));
  } catch (err) {
    console.error(`Cannot read ${path.relative(ROOT, MANIFEST)}: ${err.message}`);
    process.exit(1);
  }

  await fs.mkdir(OUT_DIR, { recursive: true });

  const entries = Object.entries(manifest.poses ?? {});
  if (entries.length === 0) {
    console.log("Manifest has no poses. Nothing to fetch.");
    return;
  }

  let ok = 0;
  let failed = 0;
  let skipped = 0;

  for (const [poseId, urls] of entries) {
    console.log(`\n${poseId}`);
    for (const [i, url] of urls.entries()) {
      // Variants are numbered so you can keep the best and delete the rest;
      // build-images.mjs derives its ids from these filenames.
      const name = `${poseId}-v${i + 1}.png`;
      const dest = path.join(OUT_DIR, name);

      try {
        await fs.access(dest);
        console.log(`  v${i + 1}  already here, skipping`);
        skipped += 1;
        continue;
      } catch {
        /* Not downloaded yet — carry on. */
      }

      try {
        const info = await fetchOne(url, dest);
        console.log(
          `  v${i + 1}  ${info.size} ${info.format}, ${(info.bytes / 1024 / 1024).toFixed(1)} MB`,
        );
        ok += 1;
      } catch (err) {
        console.error(`  v${i + 1}  FAILED — ${err.message}`);
        failed += 1;
      }
    }
  }

  console.log(`\n${ok} downloaded, ${skipped} already present, ${failed} failed`);
  if (ok + skipped > 0) {
    console.log(
      `\nNext:\n` +
        `  1. Look through source-images/wedding/ and delete the variants you don't want.\n` +
        `     Keep one per pose id unless a second is genuinely a different frame.\n` +
        `  2. npm run content     (rebuilds the WebP variants and the catalog)\n` +
        `  3. npm run dev         (check them in the library)`,
    );
  }
  if (failed > 0) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
