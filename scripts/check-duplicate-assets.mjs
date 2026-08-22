/**
 * Fails the build when two assets under src/ hold byte-identical content.
 *
 * Rollup deduplicates emitted assets by content hash alone (see `finalizeAsset`
 * in rollup/dist/shared/rollup.js): the first file emitted for a given hash wins
 * the output filename, and every later file with that content is rewritten to
 * point at it. The client bundle and the SSR bundle emit independently, so when
 * they happen to reach the two copies in a different order they disagree about
 * the winner — and prerendering 404s on an asset that plainly exists in the
 * source tree. It surfaces at random, on some runs and not others, because the
 * order depends on nothing more than which module finished loading first.
 *
 * That failure is unreadable when it happens. This turns it into a named error
 * at the point the duplicate is introduced.
 */
import { createHash } from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);
const searchDir = path.join(projectRoot, "src");

// Extensions Vite treats as assets rather than source.
const ASSET_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".svg",
  ".webp",
  ".avif",
  ".ico",
  ".bmp",
  ".tif",
  ".tiff",
  ".mp4",
  ".webm",
  ".ogg",
  ".mp3",
  ".wav",
  ".flac",
  ".aac",
  ".woff",
  ".woff2",
  ".eot",
  ".ttf",
  ".otf",
]);

// Vite's default `build.assetsInlineLimit`. Anything smaller becomes a data URI
// instead of an emitted file, so it never reaches the deduplicating code path.
// SVG is exempt from inlining and is always emitted.
const INLINE_LIMIT = 4096;
const ALWAYS_EMITTED = new Set([".svg"]);

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return ASSET_EXTENSIONS.has(path.extname(entry.name).toLowerCase())
      ? [full]
      : [];
  });

const byHash = new Map();
for (const file of walk(searchDir)) {
  const content = fs.readFileSync(file);
  const ext = path.extname(file).toLowerCase();
  if (content.length < INLINE_LIMIT && !ALWAYS_EMITTED.has(ext)) continue;

  const hash = createHash("sha256").update(content).digest("hex");
  const group = byHash.get(hash) ?? [];
  group.push(path.relative(projectRoot, file));
  byHash.set(hash, group);
}

const duplicates = [...byHash.values()].filter((group) => group.length > 1);

if (duplicates.length === 0) {
  process.exit(0);
}

console.error("\nDuplicate asset content found under src/:\n");
for (const group of duplicates) {
  for (const file of group.sort()) console.error(`  ${file}`);
  console.error("");
}
console.error(
  "These files are byte-identical, so Rollup emits only one of them and picks\n" +
    "the winning filename by emit order. The client and server bundles can pick\n" +
    "differently, which makes prerendering 404 at random on one of them.\n\n" +
    "Give each file distinct content or delete the redundant copy. If one is a\n" +
    "mislabelled re-encode, `file <path>` will tell you what it actually is.\n"
);
process.exit(1);
