#!/usr/bin/env node

import { readdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import matter from "gray-matter";

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

// ===== GENERATE llms.txt =====

const siteUrl = "https://kevingugelmann.com";

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
  .map((e) => `- ${e.title} (${e.date}) → ${siteUrl}/essays/${e.slug}`)
  .join("\n");

const llmsContent = `## Site

- Title: Kevin Gugelmann | Product Designer. AI-Native Engineer.
- Tagline: Product Designer. AI-Native Engineer.
- Description: Kevin Gugelmann is an AI-native Product Designer and UX Engineer with a Cognitive Science background, designing and shipping human-centered products end to end.
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
- Contact section: Schedule a call → https://cal.com/kevgug/intro; Email me → mailto:kevin@kevingugelmann.com
- Footer: Book a call → https://cal.com/kevgug/intro; Email → mailto:kevin@kevingugelmann.com; LinkedIn → https://www.linkedin.com/in/kevingugelmann; RSS → /rss.xml

## Section Summaries

- Introduction: Headshot; title transitions from "Hi, I'm Kevin. Welcome to my site." to "Product Designer. AI-Native Engineer."; highlights about JPMC AI-native tool, Freestyle pixel-perfect sites, UChicago designathon and hackathon wins. Company logos: JPMorganChase, Freestyle, Y Combinator, University of Chicago.
- Projects: Collection of case studies and shipped work across AI infra, fintech, EV SaaS, mobile and desktop apps.
- Contact: Headline "YC to Fortune 50. I'm Kevin Gugelmann." with conversion-focused proof points and primary CTAs.
- Footer: "Product Designer. AI-Native Engineer." and copyright.

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
    return `<Essay title="${essay.title}" date="${essay.date}">\n# ${essay.title}\n\n${essay.content.trim()}\n</Essay>`;
  })
  .join("\n\n");

const llmsFullContent = `## Site Metadata

- Title: Kevin Gugelmann | Product Designer. AI-Native Engineer.
- Description: Kevin Gugelmann is an AI-native Product Designer and UX Engineer with a Cognitive Science background, designing and shipping human-centered products end to end.
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
- Title (final, animated transition): "Product Designer. AI-Native Engineer."
- Headshot alt: "Kevin Gugelmann's headshot"
- Highlights:
  - Built an AI-native tool at JPMorganChase so designers can collaboratively build Figma plugins.
  - Shipped pixel-perfect sites at AI infra startup Freestyle (YC S24) with full-stack code.
  - Won the designathon and hackathon at UChicago, majoring in Economics and Cognitive Science.
- Company logos (linked, with alt text):
  - JPMorganChase logo → https://jpmorganchase.com
  - Freestyle logo → https://www.freestyle.sh
  - Y Combinator logo → https://www.ycombinator.com
  - University of Chicago logo → https://www.uchicago.edu

### Projects (id: projects)

${projectDetails}

### Contact (id: contact)

- Heading: "YC to Fortune 50. I'm Kevin Gugelmann."
- Proof points:
  - Drove 2x traffic increase for $30MM+ fintech and AI startups by strategically optimizing sitemaps, design, and copy.
  - Built an AI app builder toolkit for Figma plugins at JPMorganChase that generates, runs, and git-manages production code through natural language prompts.
  - Secured 1st place at Hyrox U24 and won three national gold medals in UK school rowing, driven by an obsession with marginal gains.
- CTAs:
  - Schedule a call → https://cal.com/kevgug/intro
  - Email me → mailto:kevin@kevingugelmann.com

### Footer

- Social links:
  - Book a call → https://cal.com/kevgug/intro
  - Email → mailto:kevin@kevingugelmann.com
  - LinkedIn → https://www.linkedin.com/in/kevingugelmann
  - RSS → /rss.xml
- Text: Product Designer. AI-Native Engineer.
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
