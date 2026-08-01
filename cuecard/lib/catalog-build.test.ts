import test from "node:test";
import assert from "node:assert/strict";
import { candidateKeys } from "../scripts/build-catalog.mjs";

/**
 * The queue pipeline crosses three naming conventions: a pose id written by
 * hand, a filename the fetch script derives from it, and a slug the image
 * build derives from that. If they stop lining up, poses silently lose their
 * direction text and land in the catalog blank — with a green build.
 *
 * That join runs on the owner's machine, not in CI, so it gets a test.
 */

test("a generated variant finds the pose it was written from", () => {
  // pose-queue id       → wedding-first-look-shoulder-tap
  // fetch-generated.mjs → wedding-first-look-shoulder-tap-v2.png
  // build-images.mjs    → wedding-wedding-first-look-shoulder-tap-v2
  const keys = candidateKeys(
    "wedding-wedding-first-look-shoulder-tap-v2",
    "wedding",
  );
  assert.ok(
    keys.includes("wedding-first-look-shoulder-tap"),
    `no candidate matched the pose id — got ${JSON.stringify(keys)}`,
  );
});

test("every variant number resolves to the same pose", () => {
  const resolved = [1, 2, 3, 4].map((n) => {
    const keys = candidateKeys(`wedding-wedding-golden-hour-lift-laugh-v${n}`, "wedding");
    return keys.find((k) => k === "wedding-golden-hour-lift-laugh");
  });
  assert.deepEqual(resolved, new Array(4).fill("wedding-golden-hour-lift-laugh"));
});

test("the original hand-named library still matches itself", () => {
  // These have no variant suffix and no doubled prefix — the first candidate
  // must be the id itself, or 95 existing poses would lose their notes.
  assert.equal(candidateKeys("wedding-1-t1", "wedding")[0], "wedding-1-t1");
  assert.ok(candidateKeys("wedding-1-t1", "wedding").includes("wedding-1-t1"));
});

test("a pose id that is not versioned is left intact", () => {
  const keys = candidateKeys("wedding-ceremony-ring-exchange", "wedding");
  assert.ok(keys.includes("wedding-ceremony-ring-exchange"));
});

test("a trailing v-number in the pose name itself is not mistaken for a variant", () => {
  // "wedding-2" ends in a digit but has no -v prefix, so it must survive whole.
  assert.equal(candidateKeys("wedding-2", "wedding")[0], "wedding-2");
  assert.ok(candidateKeys("wedding-2", "wedding").includes("wedding-2"));
});
