#!/usr/bin/env node

import { readdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import matter from "gray-matter";
import {
  getFullImageUrl,
  removeTrailingBackslashesInBlockquotes,
  siteUrl,
} from "./utils.mjs";

// Read and parse projects.ts
const projectsFilePath = path.resolve(process.cwd(), "src/lib/projects.ts");
const projectsFileContent = readFileSync(projectsFilePath, "utf8");

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

  return {
    id: extractField("id"),
    year: extractNumber("year"),
    name: extractField("name"),
    outputMedium: extractField("outputMedium"),
    role: extractField("role"),
    description: extractDescription(),
    builtWith: extractArray("builtWith"),
    bgColor: extractField("bgColor"),
    imageAlt: extractImageAlt(),
    link: extractLink(),
  };
});

// Read essays
const essaysDir = path.resolve(process.cwd(), "static/essays");
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

// Helper to convert [1] footnotes to standard markdown [^1] format
function convertToStandardFootnotes(content) {
  const notesRegex = /^## Notes\s*$/m;
  const parts = content.split(notesRegex);

  if (parts.length < 2) {
    return content.replace(/\[(\d+)\]/g, "[^$1]");
  }

  let mainContent = parts[0].replace(/\[(\d+)\]/g, "[^$1]");
  let notesSection = parts[1].replace(/^\[(\d+)\]\s*/gm, "[^$1]: ");

  return mainContent + "## Notes\n\n" + notesSection;
}

// Helper to convert relative image paths to full URLs in markdown
function processImagePaths(content, essaySlug) {
  return content.replace(
    /!\[([^\]]*)\]\((?!https?:\/\/)([^)]+)\)/gi,
    (match, alt, src) => {
      return `![${alt}](${getFullImageUrl(essaySlug, src)})`;
    },
  );
}

// Helper to preprocess markdown content
function preprocessMarkdown(content, essaySlug) {
  let processed = content;
  processed = removeTrailingBackslashesInBlockquotes(processed);
  processed = processImagePaths(processed, essaySlug);
  processed = convertToStandardFootnotes(processed);
  return processed;
}

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

// ===== GENERATE llms.txt =====

// Generate project anchors
const projectAnchors = projects
  .map((p) => `  - /#${p.id} - ${p.name} (${p.year})`)
  .join("\n");

// Generate project summaries
const projectSummaries = projects
  .map((p) => {
    // Create a condensed summary (first sentence or up to 200 chars)
    const desc = p.description.split(".")[0] + ".";
    const condensed = desc.length > 200 ? desc.substring(0, 197) + "..." : desc;
    return `- ${p.name}: ${condensed}`;
  })
  .join("\n");

// Generate essay links
const essayLinks = essays
  .map((e) =>
    `- ${e.title} (${formatDate(e.date)}) → ${siteUrl}/essays/${e.slug}`
  )
  .join("\n");

const llmsContent = `## Site

- Title: Kevin Gugelmann | AI-native designer
- Tagline: Kevin Gugelmann. AI-native designer.
- Description: Kevin Gugelmann is a design engineer building cognitively sound AI software, studying Economics & Cognitive Science at the University of Chicago.
- Base URL: ${siteUrl}

## Sitemap

- / - Home
- /essays - Essays listing
- /#introduction - Intro headline and highlights
- /#projects - Projects overview
- /#contact - Contact CTA
- Project anchors:
${projectAnchors}

## Key CTAs

- Navigation: Book a call → https://cal.com/kevgug/intro
- Contact section: Connect on LinkedIn → https://linkedin.com/in/kevingugelmann; Email me → mailto:kevin@kevingugelmann.com
- Footer: Book a call → https://cal.com/kevgug/intro; Email → mailto:kevin@kevingugelmann.com; LinkedIn → https://www.linkedin.com/in/kevingugelmann; RSS → /rss.xml

## Section Summaries

- Introduction: Headshot; title transitions from "Hi, I'm Kevin. Welcome to my site." to "Kevin Gugelmann. AI-native designer."; highlights about building AI tool at JPMorganChase saving designers 300+ hours, winning 1st place at both UChicago designathon and hackathon, and designing and shipping 3 full-stack websites at Freestyle (YC S24). Company logos: JPMorganChase, Freestyle, Y Combinator, University of Chicago.
- Projects: Collection of case studies and shipped work across AI infra, fintech, EV SaaS, mobile and desktop apps.
- Contact: Headline "Cognitively sound design. For the AI era." with proof points about UChicago education, JPMorganChase AI tool, and trade finance site traffic doubling, plus primary CTAs.
- Footer: Copyright.

## Project Summaries

${projectSummaries}

## Social

- LinkedIn: https://www.linkedin.com/in/kevingugelmann
- RSS Feed: /rss.xml

## Essays

${essayLinks}
`;

// ===== GENERATE llms-full.txt =====

// Generate full project details
const projectDetails = projects
  .map((p) => {
    const linkLine = p.link
      ? `- Link: ${p.link.label} → ${p.link.destination}`
      : `- Link: (n/a)`;

    return `#### Project: ${p.name} (id: ${p.id}, year: ${p.year})

- Output medium: ${p.outputMedium}
- Role: ${p.role}
- Description: ${p.description}
- Built with: ${p.builtWith.join(", ")}
${linkLine}
- Image alt: ${p.imageAlt}
- Background color: ${p.bgColor}`;
  })
  .join("\n\n");

// Generate essay content
const essayContent = essays
  .map((essay) => {
    const processedContent = preprocessMarkdown(
      essay.content.trim(),
      essay.slug,
    );
    return `<Essay title="${essay.title}" date="${
      formatDate(essay.date)
    }">\n# ${essay.title}\n\n${processedContent}\n</Essay>`;
  })
  .join("\n\n");

const llmsFullContent = `## Site Metadata

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
  - Built an AI tool at JPMorganChase saving designers 300+ hours.
  - Won 1st place at both the UChicago designathon and hackathon.
  - Designed and shipped 3 full-stack websites at Freestyle (YC S24).
- Company logos (linked, with alt text):
  - JPMorganChase logo → https://jpmorganchase.com
  - Freestyle logo → https://www.freestyle.sh
  - Y Combinator logo → https://www.ycombinator.com
  - University of Chicago logo → https://www.uchicago.edu

### Projects (id: projects)

${projectDetails}

### Contact (id: contact)

- Headshot alt: "Kevin Gugelmann's headshot"
- Heading: "Cognitively sound design. For the AI era."
- Proof points:
  - Economics and Cognitive Science at the University of Chicago.
  - Built an AI tool at JPMorganChase that generates on-brand Figma plugins.
  - Rewrote copy and doubled site traffic for a $4.5B trade finance initiative in 3 weeks.
- CTAs:
  - Connect on LinkedIn → https://linkedin.com/in/kevingugelmann
  - Email me → mailto:kevin@kevingugelmann.com

### Footer

- Social links:
  - Book a call → https://cal.com/kevgug/intro
  - Email → mailto:kevin@kevingugelmann.com
  - LinkedIn → https://www.linkedin.com/in/kevingugelmann
  - RSS → /rss.xml
- Copyright © 2025 Kevin Gugelmann. All rights reserved.

### Menu Overlay (hamburger menu navigation)

- On home page:
  - Introduction (with wave icon)
  - Contact info (with profile icon)
  - [separator]
  - Projects:
${projects.map((p) => `    - ${p.name}`).join("\n")}
- On essays page: Lists individual essays with titles

### Project Marquee (image alt text)

- Sport Video Analysis project preview
- Arc for iOS project preview
- Pizza Screens project preview
- GridLink project preview
- Task Timer project preview

### Error Page

- Displays the HTTP status code and error message for the current route.
- CTA: Return home → /

## Essays
In reverse chronological order:
${essayContent}
`;

// Write to static directory
writeFileSync("static/llms.txt", llmsContent);
writeFileSync("static/llms-full.txt", llmsFullContent);

console.log("✓ Generated LLM documentation files");
console.log(
  `  - llms.txt with ${projects.length} projects and ${essays.length} essays`,
);
console.log(`  - llms-full.txt with full content`);
