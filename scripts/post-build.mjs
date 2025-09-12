#!/usr/bin/env node

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

console.log("Post-build files created successfully");
