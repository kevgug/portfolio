import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import matter from "gray-matter";

// Load environment variables
dotenv.config();

const essaysDir = process.env.ESSAYS_DIR;
if (!essaysDir) {
  throw new Error(
    "ESSAYS_DIR environment variable is not set. Please create a .env file with ESSAYS_DIR=/path/to/essays",
  );
}
const staticEssaysDir = path.resolve(process.cwd(), "static/essays");
const staticAssetsEssaysDir = path.resolve(
  process.cwd(),
  "static/assets/essays",
);

// Ensure directories exist (don't delete - sync incrementally instead)
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

  const destPath = path.join(staticEssaysDir, file);
  fs.copyFileSync(srcPath, destPath);
  console.log(`  ✓ ${file}`);
  copiedCount++;
});

console.log(`\nCopied ${copiedCount} essays, skipped ${skippedCount}`);

// Clean up stale markdown files (files in static that no longer exist in source)
const expectedMdFiles = new Set(
  mdFiles.filter((file) => {
    if (!isProduction) return true;
    const srcPath = path.join(essaysDir, file);
    const fileContents = fs.readFileSync(srcPath, "utf8");
    const { data } = matter(fileContents);
    return data.publish !== false;
  })
);

const existingStaticMdFiles = fs
  .readdirSync(staticEssaysDir)
  .filter((file) => file.endsWith(".md"));

let removedCount = 0;
for (const file of existingStaticMdFiles) {
  if (!expectedMdFiles.has(file)) {
    fs.unlinkSync(path.join(staticEssaysDir, file));
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

  // Copy files from source to destination
  const copyRecursive = (src, dest) => {
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        if (!fs.existsSync(destPath)) {
          fs.mkdirSync(destPath, { recursive: true });
        }
        copyRecursive(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  };

  // Remove stale files/directories from destination
  const removeStale = (srcDir, destDir, basePath = "") => {
    if (!fs.existsSync(destDir)) return;
    
    const destEntries = fs.readdirSync(destDir, { withFileTypes: true });
    for (const entry of destEntries) {
      const srcPath = path.join(srcDir, entry.name);
      const destPath = path.join(destDir, entry.name);
      
      if (!fs.existsSync(srcPath)) {
        // File/dir doesn't exist in source, remove it
        if (entry.isDirectory()) {
          fs.rmSync(destPath, { recursive: true, force: true });
        } else {
          fs.unlinkSync(destPath);
        }
        console.log(`  ✗ Removed stale asset: ${path.join(basePath, entry.name)}`);
      } else if (entry.isDirectory()) {
        // Recurse into subdirectories
        removeStale(srcPath, destPath, path.join(basePath, entry.name));
      }
    }
  };

  // First remove stale files, then copy new/updated files
  removeStale(assetsDir, staticAssetsEssaysDir);
  copyRecursive(assetsDir, staticAssetsEssaysDir);
  console.log("  ✓ Assets synced");
}

console.log("\n✅ Essays copied to static/essays");

// Generate index.json
console.log("Generating essays/index.json...");
const mdFilesForIndex = fs
  .readdirSync(staticEssaysDir)
  .filter((file) => file.endsWith(".md"));

let essays = mdFilesForIndex.map((file) => {
  const filePath = path.join(staticEssaysDir, file);
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

const indexPath = path.join(staticEssaysDir, "index.json");
fs.writeFileSync(indexPath, JSON.stringify(essays, null, 2));
console.log("  ✓ Generated index.json");

// Trigger browser reload by updating a TypeScript file that Vite watches
const reloadTriggerPath = path.resolve(
  process.cwd(),
  "src/lib/essays-reload.ts",
);
const reloadContent =
  `// This file is auto-generated by copy-essays-to-static.mjs
// It triggers Vite HMR when essays are updated
export const ESSAYS_LAST_UPDATE = ${Date.now()};
`;
fs.writeFileSync(reloadTriggerPath, reloadContent, "utf8");
console.log("  ✓ Triggered reload");
