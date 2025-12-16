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

  const extractImageAlt = () => {
    const match = block.match(/alt:\s*"([^"]*)"/);
    return match ? match[1] : "";
  };

  const extractImageOptions = () => {
    const match = block.match(/imgOptions:\s*\{([^}]*)\}/s);
    if (!match) return {};
    const content = match[1];

    // Extract variable names for src, avifSrc, webpSrc and resolve them via importMap
    const srcVar = content.match(/src:\s*(\w+)/)?.[1];
    const avifSrcVar = content.match(/avifSrc:\s*(\w+)/)?.[1];
    const webpSrcVar = content.match(/webpSrc:\s*(\w+)/)?.[1];

    const src = srcVar ? (siteUrl + (importMap[srcVar] || "")) : "";
    const avifSrc = avifSrcVar ? (siteUrl + (importMap[avifSrcVar] || "")) : "";
    const webpSrc = webpSrcVar ? (siteUrl + (importMap[webpSrcVar] || "")) : "";

    // alt is still a string literal
    const alt = content.match(/alt:\s*"([^"]*)"/)?.[1] ?? "";

    return { src, avifSrc, webpSrc, alt };
  };

  return {
    id: extractField("id"),
    year: extractNumber("year"),
    name: extractField("name"),
    outputMedium: extractField("outputMedium"),
    role: extractField("role"),
    description: extractDescription(),
    builtWith: extractArray("builtWith"),
    bgColor: extractField("bgColor"),
    link: extractLink(),
    imgOptions: extractImageOptions(),
    imageAlt: extractImageAlt(),
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

// ===== SHARED CONTENT =====

// Generate full project details
const projectDetails = projects
  .map((p) => {
    const linkLine = p.link
      ? `- Link: ${p.link.label} → ${p.link.destination}`
      : `- Link: (n/a)`;

    return `#### ${p.name} (id: ${p.id})

- Year: ${p.year}
- Domain: ${p.outputMedium}
- Role: ${p.role}
- Description: ${p.description}
- Built with: ${p.builtWith.join(", ")}
${linkLine}
- Image alt: ${p.imageAlt}
- Background color: ${p.bgColor}`;
  })
  .join("\n\n");

// Generate essay links (for llms.txt)
const essayLinks = essays
  .map((e) =>
    `- ${e.title}\n  - Date: ${
      formatDate(e.date)
    }\n  - Link: ${siteUrl}/essays/${e.slug}\n  - Markdown: ${siteUrl}/essays/${e.slug}.txt`
  )
  .join("\n");

// Generate full essay content (for llms-full.txt)
const essayFullContent = essays
  .map((essay) => {
    const processedContent = preprocessMarkdownForLLM(
      essay.content.trim(),
      essay.slug,
    );
    return `<Essay title="${essay.title}" date="${
      formatDate(essay.date)
    }">\n# ${essay.title}\n\n${processedContent}\n</Essay>`;
  })
  .join("\n\n");

// Generate the shared content with a placeholder for essays
const generateContent = (essaysSection) =>
  `## Site Metadata

- Title: Kevin Gugelmann | AI-native designer
- Description: Kevin Gugelmann is a design engineer building cognitively sound AI software, studying Economics & Cognitive Science at the University of Chicago.
- Domain: kevingugelmann.com
- Canonical: ${siteUrl}

## Navigation

- Top navigation bar:
  - Left: Hamburger menu (opens menu overlay)
  - Right: Home | Essays tabs
- Book a call → https://cal.com/kevgug/intro

## Home

### Introduction (id: introduction)

- Title (initial): "Hi, I'm Kevin. Welcome to my site."
- Title (final, animated transition): "Kevin Gugelmann. AI-native designer."
- Highlights:
  - Built an AI tool at JPMorganChase saving designers 300+ hours per year.
  - Designed and shipped three full-stack websites at Freestyle (YC S24).
  - Won 1st place at both the UChicago designathon and hackathon.
- CTAs:
  - View portfolio → scrolls to #projects
  - Email me → mailto:kevin@kevingugelmann.com
- Company logos (linked, with alt text):
  - JPMorganChase logo → https://jpmorganchase.com
  - Freestyle logo → https://www.freestyle.sh
  - Y Combinator logo → https://www.ycombinator.com
  - University of Chicago logo → https://www.uchicago.edu

### Projects (id: projects)

${projectDetails}

### Contact (id: contact)

- Headshot alt: "Kevin Gugelmann's headshot"
- Heading: "Cognitively sound design. For the AI age."
- Proof points:
  - Economics and Cognitive Science at the University of Chicago.
  - Built an AI tool at JPMorganChase that generates on-brand Figma plugins.
  - Rewrote copy and doubled site traffic for a $4.5B trade finance initiative in 3 weeks.
- CTAs:
  - Connect on LinkedIn → https://linkedin.com/in/kevingugelmann
  - Email me → mailto:kevin@kevingugelmann.com

### Footer

- Social links:
  - Book a call: https://cal.com/kevgug/intro
  - Email: mailto:kevin@kevingugelmann.com
  - X (Twitter): https://x.com/kevingugelmann
  - LinkedIn: https://www.linkedin.com/in/kevingugelmann
  - RSS Feed: ${siteUrl}/rss.xml
- Copyright © 2025 Kevin Gugelmann. All rights reserved.

### Error Page

- Displays the HTTP status code and error message for the current route.
- CTA: Return home → ${siteUrl}/

## Essays
${essaysSection}
`;

// Generate both versions
const llmsContent = generateContent(essayLinks) + `
## llms-full.txt

- Read full website content: ${siteUrl}/llms-full.txt
`;

const llmsFullContent = generateContent(
  `\nIn reverse chronological order:\n\n${essayFullContent}`,
);

// Write to static directory with UTF-8 BOM for proper encoding detection
const UTF8_BOM = "\uFEFF";
writeFileSync("static/llms.txt", UTF8_BOM + llmsContent, "utf8");
writeFileSync("static/llms-full.txt", UTF8_BOM + llmsFullContent, "utf8");

console.log("✓ Generated LLM documentation files");
console.log(
  `  - llms.txt with ${projects.length} projects and ${essays.length} essays`,
);
console.log(`  - llms-full.txt with full content`);
