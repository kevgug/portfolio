import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import matter from "gray-matter";

// Load environment variables
dotenv.config();

// Parse command line arguments for changed slugs
// Usage: node scripts/sync-essays.mjs --changed-slugs=slug1,slug2
const args = process.argv.slice(2);
const changedSlugsArg = args.find((arg) => arg.startsWith("--changed-slugs="));
const changedSlugs = changedSlugsArg
  ? new Set(changedSlugsArg.split("=")[1].split(",").filter(Boolean))
  : null;

// If specific slugs were provided, we only need to reload those essays
const isPartialReload = changedSlugs && changedSlugs.size > 0;
if (isPartialReload) {
  console.log(`Partial reload for essays: ${[...changedSlugs].join(", ")}`);
}

const essaysDir = process.env.ESSAYS_DIR;
if (!essaysDir) {
  throw new Error(
    "ESSAYS_DIR environment variable is not set. Please create a .env file with ESSAYS_DIR=/path/to/essays",
  );
}
const contentEssaysDir = path.resolve(process.cwd(), "src/content/essays");
const staticEssaysDir = path.resolve(process.cwd(), "static/essays");
const staticAssetsEssaysDir = path.resolve(
  process.cwd(),
  "static/assets/essays",
);

// Ensure directories exist (don't delete - sync incrementally instead)
if (!fs.existsSync(contentEssaysDir)) {
  fs.mkdirSync(contentEssaysDir, { recursive: true });
}
if (!fs.existsSync(staticEssaysDir)) {
  fs.mkdirSync(staticEssaysDir, { recursive: true });
}
if (!fs.existsSync(staticAssetsEssaysDir)) {
  fs.mkdirSync(staticAssetsEssaysDir, { recursive: true });
}

// Copy markdown files
const isProduction = process.env.NODE_ENV === "production";
const mdFiles = fs.readdirSync(essaysDir).filter((file) =>
  file.endsWith(".md")
);

console.log(`Copying essay markdown files...`);
let copiedCount = 0;
let skippedCount = 0;

mdFiles.forEach((file) => {
  const srcPath = path.join(essaysDir, file);

  // Check frontmatter for publish status
  const fileContents = fs.readFileSync(srcPath, "utf8");
  const { data } = matter(fileContents);

  // Skip unpublished essays in production
  if (isProduction && data.publish === false) {
    console.log(`  ⊗ ${file} (unpublished, skipped)`);
    skippedCount++;
    return;
  }

  // Copy to src/content/essays/ (not static, so routes can handle .md URLs)
  const destPath = path.join(contentEssaysDir, file);
  fs.copyFileSync(srcPath, destPath);
  console.log(`  ✓ ${file}`);
  copiedCount++;
});

console.log(`\nCopied ${copiedCount} essays, skipped ${skippedCount}`);

// Clean up stale markdown files (files in content that no longer exist in source)
const expectedMdFiles = new Set(
  mdFiles.filter((file) => {
    if (!isProduction) return true;
    const srcPath = path.join(essaysDir, file);
    const fileContents = fs.readFileSync(srcPath, "utf8");
    const { data } = matter(fileContents);
    return data.publish !== false;
  }),
);

const existingContentMdFiles = fs
  .readdirSync(contentEssaysDir)
  .filter((file) => file.endsWith(".md"));

let removedCount = 0;
for (const file of existingContentMdFiles) {
  if (!expectedMdFiles.has(file)) {
    fs.unlinkSync(path.join(contentEssaysDir, file));
    console.log(`  ✗ Removed stale: ${file}`);
    removedCount++;
  }
}
if (removedCount > 0) {
  console.log(`Removed ${removedCount} stale essay(s)`);
}

// Sync assets directory if it exists (copy new/changed, remove stale)
const assetsDir = path.join(essaysDir, "assets");
if (fs.existsSync(assetsDir)) {
  console.log("Syncing essay assets...");

  // Get list of published essays for production mode
  const publishedEssays = new Set();
  if (isProduction) {
    mdFiles.forEach((file) => {
      const srcPath = path.join(essaysDir, file);
      const fileContents = fs.readFileSync(srcPath, "utf8");
      const { data } = matter(fileContents);
      if (data.publish === true) {
        const slug = file.replace(/\.md$/, "");
        publishedEssays.add(slug);
      }
    });
  }

  // Copy files from source to destination
  // `isRootLevel = true` means we're at the top level where essay slug folders are
  const copyRecursive = (src, dest, isRootLevel = true) => {
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      // In production, only copy assets for published essays (check only at root level)
      if (isProduction && isRootLevel && entry.isDirectory()) {
        const essaySlug = entry.name;
        if (!publishedEssays.has(essaySlug)) {
          console.log(`  ⊗ Skipping assets for ${essaySlug} (unpublished)`);
          continue;
        }
      }

      if (entry.isDirectory()) {
        if (!fs.existsSync(destPath)) {
          fs.mkdirSync(destPath, { recursive: true });
        }
        copyRecursive(srcPath, destPath, false);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  };

  // Remove stale files/directories from destination
  // isRootLevel = true means we're at the top level where essay slug folders are
  const removeStale = (srcDir, destDir, basePath = "", isRootLevel = true) => {
    if (!fs.existsSync(destDir)) return;

    const destEntries = fs.readdirSync(destDir, { withFileTypes: true });
    for (const entry of destEntries) {
      const srcPath = path.join(srcDir, entry.name);
      const destPath = path.join(destDir, entry.name);

      // In production, remove assets for unpublished essays (check only at root level)
      if (isProduction && isRootLevel && entry.isDirectory()) {
        const essaySlug = entry.name;
        if (!publishedEssays.has(essaySlug)) {
          fs.rmSync(destPath, { recursive: true, force: true });
          console.log(`  ✗ Removed assets for unpublished essay: ${essaySlug}`);
          continue;
        }
      }

      if (!fs.existsSync(srcPath)) {
        // File/dir doesn't exist in source, remove it
        if (entry.isDirectory()) {
          fs.rmSync(destPath, { recursive: true, force: true });
        } else {
          fs.unlinkSync(destPath);
        }
        console.log(
          `  ✗ Removed stale asset: ${path.join(basePath, entry.name)}`,
        );
      } else if (entry.isDirectory()) {
        // Recurse into subdirectories
        removeStale(srcPath, destPath, path.join(basePath, entry.name), false);
      }
    }
  };

  // First remove stale files, then copy new/updated files
  removeStale(assetsDir, staticAssetsEssaysDir);
  copyRecursive(assetsDir, staticAssetsEssaysDir);
  console.log("  ✓ Assets synced");
}

console.log("\n✅ Essays copied to src/content/essays");

// Generate index.json in content dir (for Vite imports)
console.log("Generating content/essays/index.json...");
const mdFilesForIndex = fs
  .readdirSync(contentEssaysDir)
  .filter((file) => file.endsWith(".md"));

let essays = mdFilesForIndex.map((file) => {
  const filePath = path.join(contentEssaysDir, file);
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data } = matter(fileContents);
  const slug = file.replace(/\.md$/, "");

  // Check if essay has a config file
  const configPath = path.join(staticAssetsEssaysDir, slug, "config.json");
  const hasConfig = fs.existsSync(configPath);

  return {
    slug,
    title: data.title,
    date: data.date,
    publish: data.publish,
    hasConfig,
  };
});

if (isProduction) {
  essays = essays.filter((essay) => essay.publish);
}

essays = essays.sort((a, b) => new Date(b.date) - new Date(a.date));

// Write to content dir for Vite imports
const indexPath = path.join(contentEssaysDir, "index.json");
fs.writeFileSync(indexPath, JSON.stringify(essays, null, 2));
console.log("  ✓ Generated index.json");

// Also write to static for backwards compatibility with any direct fetches
const staticIndexPath = path.join(staticEssaysDir, "index.json");
fs.writeFileSync(staticIndexPath, JSON.stringify(essays, null, 2));
console.log("  ✓ Generated static/essays/index.json (for backwards compatibility)");

// Trigger browser reload by updating a TypeScript file that Vite watches
const reloadTriggerPath = path.resolve(
  process.cwd(),
  "src/lib/essays-reload.ts",
);
const changedSlugsArray = changedSlugs ? [...changedSlugs] : [];
const reloadContent =
  `// This file is auto-generated by sync-essays.mjs
// It triggers Vite HMR when essays are updated
export const ESSAYS_LAST_UPDATE = ${Date.now()};
export const ESSAYS_CHANGED_SLUGS: string[] = ${
    JSON.stringify(changedSlugsArray)
  };
`;
fs.writeFileSync(reloadTriggerPath, reloadContent, "utf8");
console.log(
  "  ✓ Triggered reload" +
    (changedSlugsArray.length ? ` for: ${changedSlugsArray.join(", ")}` : ""),
);
