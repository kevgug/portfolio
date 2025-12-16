#!/usr/bin/env node

import { existsSync, mkdirSync, readdirSync, unlinkSync } from "fs";
import path from "path";
import { writeFileSync } from "fs";

// Create CNAME file
writeFileSync("build/CNAME", "kevingugelmann.com\n");

// Create sitemap.xml
const today = new Date().toISOString().split("T")[0];
const sitemapContent = `<?xml version='1.0' encoding='UTF-8'?>

<url>
  <loc>https://kevingugelmann.com/</loc>
  <lastmod>${today}</lastmod>
</url>

</urlset>`;

writeFileSync("build/sitemap.xml", sitemapContent);

console.log("✓ Post-build files created");
console.log("  - CNAME");
console.log("  - sitemap.xml");

// Delete all .md files from build/essays/ (they're internal-only)
const buildEssaysDir = path.resolve(process.cwd(), "build/essays");

if (existsSync(buildEssaysDir)) {
  const mdFiles = readdirSync(buildEssaysDir).filter((file) =>
    file.endsWith(".md")
  );
  mdFiles.forEach((file) => {
    unlinkSync(path.join(buildEssaysDir, file));
  });

  if (mdFiles.length > 0) {
    console.log(`✓ Removed ${mdFiles.length} .md files from build/essays/`);
  }
}
