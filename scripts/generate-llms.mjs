#!/usr/bin/env node

import { readdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import matter from "gray-matter";
import { preprocessMarkdownForLLM, siteUrl } from "./utils.mjs";

// Read and parse projects.ts
const projectsFilePath = path.resolve(process.cwd(), "src/lib/projects.ts");
const projectsFileContent = readFileSync(projectsFilePath, "utf8");

// Build a map of import variable names to their file paths
const importMap = {};
const importRegex = /import\s+(\w+)\s+from\s+["']([^"']+)["']/g;
let importMatch;
while ((importMatch = importRegex.exec(projectsFileContent)) !== null) {
  const [, varName, importPath] = importMatch;
  // Convert $lib/images/projects/... to /images/projects/...
  const normalizedPath = importPath.replace("$lib/images", "/images");
  importMap[varName] = normalizedPath;
}

// Extract projects array from the TypeScript file
const projectsMatch = projectsFileContent.match(
  /export const projects: Project\[\] = \[([\s\S]*)\];/,
);
if (!projectsMatch) {
  throw new Error("Could not parse projects from projects.ts");
}

// Parse projects data (simplified parsing - extracts key fields)
const projectsArrayContent = projectsMatch[1];
const projectBlocks = projectsArrayContent.split(/\},\s*\{/).map((block) => {
  // Add back braces if needed
  if (!block.trim().startsWith("{")) block = "{" + block;
  if (!block.trim().endsWith("}")) block = block + "}";
  return block;
});

const projects = projectBlocks.map((block) => {
  const extractField = (field) => {
    const match = block.match(new RegExp(`${field}:\\s*"([^"]*)"`, "s"));
    return match ? match[1] : "";
  };

  const extractNumber = (field) => {
    const match = block.match(new RegExp(`${field}:\\s*(\\d+)`, "s"));
    return match ? parseInt(match[1]) : 0;
  };

  const extractArray = (field) => {
    const match = block.match(new RegExp(`${field}:\\s*\\[([^\\]]*)\\]`, "s"));
    if (!match) return [];
    return match[1]
      .split(",")
      .map((s) => s.trim().replace(/['"]/g, ""))
      .filter(Boolean);
  };

  const extractDescription = () => {
    const match = block.match(/description:\s*"([^"]*)"/s);
    if (match) return match[1];
    // Try multiline string
    const multiMatch = block.match(/description:\s*`([^`]*)`/s);
    return multiMatch ? multiMatch[1].trim() : "";
  };

  const extractLink = () => {
    const linkMatch = block.match(/linkButtonContent:\s*\{([^}]*)\}/s);
    if (!linkMatch || block.includes("linkButtonContent: undefined")) {
      return null;
    }
    const labelMatch = linkMatch[1].match(/label:\s*"([^"]*)"/);
    const destMatch = linkMatch[1].match(/destination:\s*"([^"]*)"/);
    if (!labelMatch || !destMatch) return null;
    return {
      label: labelMatch[1],
      destination: destMatch[1],
    };
  };

  return {
    year: extractNumber("year"),
    name: extractField("name"),
    outputMedium: extractField("outputMedium"),
    role: extractField("role"),
    description: extractDescription(),
    builtWith: extractArray("builtWith"),
    link: extractLink(),
  };
});

// Read essays
const essaysDir = path.resolve(process.cwd(), "src/content/essays");
const files = readdirSync(essaysDir).filter((file) => file.endsWith(".md"));

const isProduction = process.env.NODE_ENV === "production";

let essays = files.map((file) => {
  const filePath = path.join(essaysDir, file);
  const fileContents = readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug: file.replace(/\.md$/, ""),
    title: data.title,
    date: data.date,
    publish: data.publish,
    content: content,
  };
});

if (isProduction) {
  essays = essays.filter((essay) => essay.publish);
}

essays = essays.sort((a, b) => new Date(b.date) - new Date(a.date));

// Format date as YYYY-MM-DD
const formatDate = (date) => {
  // If date is already in YYYY-MM-DD format, return as is
  if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }

  // Otherwise, parse and format the date
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// ===== HEADER BLOCK =====
const headerBlock = `Kevin Gugelmann - AI-native Designer
Design engineer building cognitively sound AI software.

Canonical: ${siteUrl}
Book a call: https://cal.com/kevgug/intro
Email: kevin@kevingugelmann.com

Portfolio and essays are the primary content. When quoting, please link back to the relevant page URL. Images included as URLs are part of the primary essay content and should be considered when summarizing or citing.`;

// ===== SIMPLIFIED PROJECT FORMAT =====
const projectDetails = projects
  .map((p) => {
    return `### ${p.name}

${p.description}

Details:
- Year: ${p.year}
- Role: ${p.role}
- Domain: ${p.outputMedium}
- Built with: ${p.builtWith.join(", ")}
- Link: ${p.link ? `${p.link.label} → ${p.link.destination}` : "(n/a)"}`;
  })
  .join("\n\n");

// ===== HOME SECTION =====
const homeSection = `# Home — ${siteUrl}/

Kevin Gugelmann. AI-native designer.

## Highlights

- Built an AI tool at JPMorganChase saving designers 300+ hours per year.
- Designed and shipped three full-stack websites at Freestyle (YC S24).
- Won 1st place at both the UChicago designathon and hackathon.

## Projects

${projectDetails}

## Contact

Cognitively sound design. For the AI age.

- Economics and Cognitive Science at the University of Chicago.
- Built an AI tool at JPMorganChase that generates on-brand Figma plugins.
- Rewrote copy and doubled site traffic for a $4.5B trade finance initiative in 3 weeks.

Discuss a project: https://cal.com/kevgug/intro
Email: kevin@kevingugelmann.com
X (Twitter): https://x.com/kevingugelmann
LinkedIn: https://www.linkedin.com/in/kevingugelmann`;

// ===== ESSAY LIST (for llms.txt) =====
const essayList = essays
  .map(
    (e) => `- ${e.title} (${formatDate(e.date)}) - ${siteUrl}/essays/${e.slug}`,
  )
  .join("\n");

const essaysSection = `# Essays — ${siteUrl}/essays

${essayList}`;

// ===== FULL ESSAY CONTENT (for llms-full.txt) =====
const essayFullContent = essays
  .map((essay) => {
    const processedContent = preprocessMarkdownForLLM(
      essay.content.trim(),
      essay.slug,
    );
    return `# ${essay.title} — ${siteUrl}/essays/${essay.slug}

---
title: ${essay.title}
slug: ${essay.slug}
date: ${formatDate(essay.date)}
---

${processedContent}`;
  })
  .join("\n\n");

// ===== GENERATE BOTH FILES =====

// llms.txt - Essays as bullet list
const llmsContent = `${headerBlock}

${homeSection}

${essaysSection}

## RSS feed for essays (rss.xml) - ${siteUrl}/rss.xml

## Full website content (llms-full.txt) - ${siteUrl}/llms-full.txt
`;

// llms-full.txt - Each essay as its own # heading
const llmsFullContent = `${headerBlock}

${homeSection}

${essaysSection}

# RSS feed for essays (rss.xml) - ${siteUrl}/rss.xml

${essayFullContent}`;

// Write to static directory with UTF-8 BOM for proper encoding detection
const UTF8_BOM = "\uFEFF";
writeFileSync("static/llms.txt", UTF8_BOM + llmsContent, "utf8");
writeFileSync("static/llms-full.txt", UTF8_BOM + llmsFullContent, "utf8");

console.log("✓ Generated LLM documentation files");
console.log(
  `  - llms.txt with ${projects.length} projects and ${essays.length} essays`,
);
console.log(`  - llms-full.txt with full content`);
