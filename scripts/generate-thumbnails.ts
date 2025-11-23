import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import satori from "satori";
import { html } from "satori-html";
import { Resvg } from "@resvg/resvg-js";
import { parseMarkdown } from "../src/lib/essays/parse";
import matter from "gray-matter";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

const essaysDir = path.join(projectRoot, "static/essays");
const fontsDir = path.join(projectRoot, "static/fonts");
const outputDir = path.join(projectRoot, "static/assets/thumbnails");

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Clear existing thumbnails
const existingThumbnails = fs
  .readdirSync(outputDir)
  .filter((f) => f.endsWith(".png"));
for (const thumbnail of existingThumbnails) {
  fs.unlinkSync(path.join(outputDir, thumbnail));
}
if (existingThumbnails.length > 0) {
  console.log(`Cleared ${existingThumbnails.length} existing thumbnail(s)\n`);
}

// Load Fonts
const fontEuclidBold = fs.readFileSync(
  path.join(fontsDir, "euclid-square/EuclidSquare-Bold-WebXL.ttf")
);
const fontSangBleuRegular = fs.readFileSync(
  path.join(fontsDir, "sangbleu-sunrise/SangBleuSunrise-Regular-WebXL.ttf")
);
const fontSangBleuMediumItalic = fs.readFileSync(
  path.join(fontsDir, "sangbleu-sunrise/SangBleuSunrise-MediumItalic-WebXL.ttf")
);
const fontSangBleuBold = fs.readFileSync(
  path.join(fontsDir, "sangbleu-sunrise/SangBleuSunrise-Bold-WebXL.ttf")
);
const fontSangBleuBoldItalic = fs.readFileSync(
  path.join(fontsDir, "sangbleu-sunrise/SangBleuSunrise-BoldItalic-WebXL.ttf")
);

// Simple entity decoder for common symbols (excluding < and > to preserve HTML structure/escaping)
function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&#x27;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"')
    .replace(/&ndash;/g, "–")
    .replace(/&mdash;/g, "—");
}

function parseAndSplitHtml(htmlStr: string): string {
  // Split by tags
  const parts = htmlStr.split(/(<[^>]+>)/);
  let isItalic = false;
  let isBold = false; // Not strictly used but good for completeness
  let result = "";

  for (const part of parts) {
    if (part.startsWith("<")) {
      // Tag
      if (part.startsWith("<em")) isItalic = true;
      else if (part.startsWith("</em")) isItalic = false;
      else if (part.startsWith("<strong")) isBold = true;
      else if (part.startsWith("</strong")) isBold = false;
      // Ignore other tags or attributes for now
    } else {
      // Text content
      if (!part) continue;
      const decoded = decodeHtmlEntities(part);
      // Split by spaces, preserving them attached to words if possible, or just add space
      // Simple approach: split by space, then render each word with a trailing space
      const words = decoded.split(" ");

      words.forEach((word, index) => {
        // Construct style
        let style = "";
        if (isBold && isItalic) {
          style += "font-style: italic; font-weight: 700;";
        } else if (isBold) {
          style += "font-weight: 700;";
        } else if (isItalic) {
          style += "font-style: italic; font-weight: 500;";
        }

        // Render word
        result += `<div style="display: flex; ${style}">${word}</div>`;

        // Add spacer if not the last word
        if (index < words.length - 1) {
          result += `<div style="display: flex; width: 4px; min-width: 4px;"></div>`; // spacer
        }
      });
    }
  }
  return result;
}

// Helper to render tokens to HTML string
function renderTokensToHtml(tokens: any[], slug: string): string {
  return tokens
    .map((t) => {
      if (t.type === "text") {
        // Parse text and split into word spans
        return parseAndSplitHtml(t.text);
      } else if (t.type === "ref") {
        return `<div style="display: flex; color: #C1C1C1; font-size: 0.9rem;">[<span style="text-decoration: underline; text-decoration-color: rgba(169, 244, 233, 0.6);">${t.num}</span>]</div>`;
      } else if (t.type === "code") {
        return `<div style="display: flex; background-color: rgba(203, 213, 225, 0.05); color: #A9F4E9; padding: 0.2rem 0.4rem; border-radius: 0.5rem; font-size: 0.9em;">${decodeHtmlEntities(
          t.code
        )}</div>`;
      } else if (t.type === "latex") {
        // Show plain LaTeX text instead of rendering
        return `<div style="display: flex;">${t.latex}</div>`;
      }
      return "";
    })
    .join("");
}

async function generateThumbnail(slug: string, content: string) {
  // Extract title and date from frontmatter
  const { data } = matter(content);
  const title = data.title;
  const date = data.date;

  const parsedPost = parseMarkdown(content, title, date);
  const { sections } = parsedPost;

  // Extract content for thumbnail
  // Limit by total word count to prevent Resvg crashes
  const maxWords = 150;
  const maxHeadings = 4; // Avoid stacking too many headings if paragraphs are skipped
  let totalWords = 0;
  let headingCount = 0;
  const renderContent: { type: "h2" | "paragraph"; html: string }[] = [];

  for (const section of sections) {
    // Don't render h2 for the main title or for foreword sections (content before first h2)
    if (section.heading !== title && section.heading !== "Foreword") {
      if (headingCount >= maxHeadings) break;

      const headingWords = section.heading
        .trim()
        .split(/\s+/)
        .filter((w) => w.length > 0).length;
      if (totalWords + headingWords > maxWords) break;

      renderContent.push({
        type: "h2",
        html: decodeHtmlEntities(section.heading),
      });
      totalWords += headingWords;
      headingCount++;
    }

    for (const item of section.content) {
      if (item.type === "paragraph") {
        // Count words in this paragraph's tokens
        let paragraphWords = 0;
        for (const token of item.tokens) {
          if (token.type === "text") {
            // Strip HTML tags and count words
            const textOnly = token.text.replace(/<[^>]*>/g, " ");
            paragraphWords += textOnly
              .trim()
              .split(/\s+/)
              .filter((w) => w.length > 0).length;
          } else if (token.type === "code") {
            paragraphWords += token.code
              .trim()
              .split(/\s+/)
              .filter((w) => w.length > 0).length;
          } else if (token.type === "latex") {
            paragraphWords += token.latex
              .trim()
              .split(/\s+/)
              .filter((w) => w.length > 0).length;
          }
          // refs don't count as words
        }

        // Stop if adding this paragraph would exceed word limit
        if (totalWords + paragraphWords > maxWords) break;

        renderContent.push({
          type: "paragraph",
          html: renderTokensToHtml(item.tokens, slug),
        });
        totalWords += paragraphWords;
      }
    }
    if (totalWords >= maxWords) break;
  }

  const contentHtml = renderContent
    .map((item, index) => {
      if (item.type === "h2") {
        // Add top margin if this is not the first item (i.e., there's content before it)
        const topMargin = index > 0 ? "32px" : "0";
        return `<div style="display: flex; font-family: 'Euclid Square'; font-weight: bold; color: #fffffe; font-size: 31px; margin: ${topMargin} 0 10px 0;">${item.html}</div>`;
      } else {
        // Use flex-wrap container for words
        return `<div style="display: flex; flex-wrap: wrap; font-family: 'SangBleu Sunrise'; color: #f2f2f2; font-size: 17px; line-height: 1.5; margin: 0 0 4px 0;">${item.html}</div>`;
      }
    })
    .join("");

  const markup = html(
    `<div style="display: flex; width: 1200px; height: 675px; background-color: #141517; position: relative; overflow: hidden;"><div style="display: flex; position: absolute; top: 120px; left: 56px; width: 1088px; height: 721px; background-color: #2a2a2e; border: 2px solid #353842; border-radius: 64px;"></div><div style="display: flex; flex-direction: column; position: absolute; top: 210px; left: 120px; width: 960px;"><div style="display: flex; color: #aaf4e9; font-family: 'Euclid Square'; font-weight: bold; font-size: 85px; line-height: 95px; margin-bottom: 64px;">${decodeHtmlEntities(
      title
    )}</div><div style="display: flex; width: 100%; height: 2px; background-color: #464646; border-radius: 1px; margin-bottom: 64px;"></div><div style="display: flex; flex-direction: column; gap: 12px;">${contentHtml}</div></div><div style="display: flex; position: absolute; top: 528px; left: 83px; width: 1033px; height: 182px; background: linear-gradient(to bottom, rgba(42, 42, 46, 0) 0%, #2a2a2e 100%); pointer-events: none;"></div></div>`
  );

  const svg = await satori(markup, {
    width: 1200,
    height: 675,
    fonts: [
      {
        name: "Euclid Square",
        data: fontEuclidBold,
        weight: 700,
        style: "normal",
      },
      {
        name: "SangBleu Sunrise",
        data: fontSangBleuRegular,
        weight: 400,
        style: "normal",
      },
      {
        name: "SangBleu Sunrise",
        data: fontSangBleuMediumItalic,
        weight: 500, // Mapped to 500
        style: "italic",
      },
      {
        name: "SangBleu Sunrise",
        data: fontSangBleuBold,
        weight: 700,
        style: "normal",
      },
      {
        name: "SangBleu Sunrise",
        data: fontSangBleuBoldItalic,
        weight: 700,
        style: "italic",
      },
    ],
  });

  const resvg = new Resvg(svg, {
    fitTo: {
      mode: "width",
      value: 1200,
    },
  });

  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  const outputFile = path.join(outputDir, `${slug}.png`);
  fs.writeFileSync(outputFile, new Uint8Array(pngBuffer));
  console.log(`Generated thumbnail for ${slug}`);
}

async function main() {
  const files = fs.readdirSync(essaysDir).filter((f) => f.endsWith(".md"));
  const isDev = process.env.NODE_ENV === "development";
  const isBuild = process.env.NODE_ENV === "production";

  console.log(
    `\nGenerating thumbnails in ${
      isDev ? "DEVELOPMENT" : isBuild ? "PRODUCTION" : "UNKNOWN"
    } mode...`
  );

  for (const file of files) {
    const slug = file.replace(".md", "");
    const content = fs.readFileSync(path.join(essaysDir, file), "utf-8");

    // Parse frontmatter to check publish status
    const { data } = matter(content);

    // In build mode, only generate thumbnails for published essays
    if (isBuild && !data.publish) {
      console.log(`Skipping ${slug} (not published)`);
      continue;
    }

    await generateThumbnail(slug, content);
  }

  console.log("\nThumbnail generation complete!\n");
}

main().catch(console.error);
