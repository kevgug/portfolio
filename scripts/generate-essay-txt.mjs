#!/usr/bin/env node

import { readdirSync, readFileSync, writeFileSync, unlinkSync } from "fs";
import path from "path";
import matter from "gray-matter";
import { preprocessMarkdownForLLM } from "./utils.mjs";

// Read from content directory, write .txt to static directory
const contentEssaysDir = path.resolve(process.cwd(), "src/content/essays");
const staticEssaysDir = path.resolve(process.cwd(), "static/essays");

// Clear all existing .txt files before generating
const existingTxtFiles = readdirSync(staticEssaysDir).filter((file) =>
  file.endsWith(".txt")
);
for (const file of existingTxtFiles) {
  unlinkSync(path.join(staticEssaysDir, file));
}

const files = readdirSync(contentEssaysDir).filter((file) => file.endsWith(".md"));

const isProduction = process.env.NODE_ENV === "production";

// Format date as YYYY-MM-DD
const formatDate = (date) => {
  if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

let generatedCount = 0;
let skippedCount = 0;

for (const file of files) {
  const slug = file.replace(/\.md$/, "");
  const filePath = path.join(contentEssaysDir, file);
  const fileContents = readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  // In production, only generate .txt for published essays
  if (isProduction && !data.publish) {
    skippedCount++;
    continue;
  }

  const processedContent = preprocessMarkdownForLLM(content.trim(), slug);

  const llmMarkdown = `---
title: ${data.title}
slug: ${slug}
date: ${formatDate(data.date)}
---

# ${data.title}

${processedContent}
`;

  // Write .txt files to static directory for direct access
  const outputPath = path.join(staticEssaysDir, `${slug}.txt`);
  writeFileSync(outputPath, llmMarkdown);
  generatedCount++;
}

console.log(`✅ Generated ${generatedCount} essay .txt files`);
if (skippedCount > 0) {
  console.log(`   Skipped ${skippedCount} unpublished essays`);
}

