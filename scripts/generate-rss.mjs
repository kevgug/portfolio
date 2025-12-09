import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import {
  getFullImageUrl,
  removeTrailingBackslashesInBlockquotes,
  siteUrl,
} from "./utils.mjs";

const essaysDir = path.resolve(process.cwd(), "static/essays");
const outputDir = path.resolve(process.cwd(), "static");
const outputFile = path.join(outputDir, "rss.xml");

const files = fs.readdirSync(essaysDir).filter((file) => file.endsWith(".md"));

let essays = files.map((file) => {
  const filePath = path.join(essaysDir, file);
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug: file.replace(/\.md$/, ""),
    title: data.title ||
      file.replace(/\.md$/, "").replace(/-/g, " ").replace(
        /\b\w/g,
        (l) => l.toUpperCase(),
      ),
    date: data.date || new Date().toISOString().split("T")[0],
    publish: data.publish !== undefined ? data.publish : true,
    content: content,
  };
});

const isProduction = process.env.NODE_ENV === "production";

if (isProduction) {
  essays = essays.filter((essay) => essay.publish);
}

essays = essays.sort((a, b) => new Date(b.date) - new Date(a.date));

// Helper to convert relative image paths to full URLs in HTML
function processImagePaths(htmlContent, essaySlug) {
  return htmlContent.replace(
    /<img\s+([^>]*?)src="(?!https?:\/\/)([^"]+)"([^>]*)>/gi,
    (match, before, src, after) => {
      return `<img ${before}src="${getFullImageUrl(essaySlug, src)}"${after}>`;
    },
  );
}

// Helper to process footnotes in HTML content
function processFootnotes(htmlContent) {
  // Split content by the Notes section
  const notesRegex = /(<h2>Notes<\/h2>)/i;
  const parts = htmlContent.split(notesRegex);

  if (parts.length < 2) {
    // No Notes section found, just process footnote references
    return htmlContent.replace(
      /\[(\d+)\]/g,
      '<a href="#note-$1">[$1]</a>',
    );
  }

  // Process the main content (everything before Notes section)
  let mainContent = parts[0];
  mainContent = mainContent.replace(
    /\[(\d+)\]/g,
    '<a href="#note-$1">[$1]</a>',
  );

  // Process the Notes section (everything after the <h2>Notes</h2> header)
  let notesSection = parts.slice(2).join("");
  // Add IDs to paragraphs that start with footnote numbers
  notesSection = notesSection.replace(/<p>\[(\d+)\]/g, '<p id="note-$1">[$1]');

  return mainContent + parts[1] + notesSection;
}

const rss = `
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Kevin Gugelmann</title>
    <link>${siteUrl}/essays</link>
    <description>Official feed for Kevin Gugelmann's essays</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <dc:date>${new Date().toISOString()}</dc:date>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    ${
  essays
    .map((essay) => {
      const url = `${siteUrl}/essays/${essay.slug}`;
      const processedMarkdown = removeTrailingBackslashesInBlockquotes(
        essay.content,
      );
      let htmlContent = marked(processedMarkdown);
      htmlContent = processImagePaths(htmlContent, essay.slug);
      htmlContent = processFootnotes(htmlContent);
      const summary = htmlContent
        .replace(/<[^>]*>?/gm, " ") // Replace HTML tags with a space
        .replace(/\s+/g, " ") // Collapse multiple whitespace characters
        .trim() // Trim leading/trailing whitespace
        .substring(0, 280) + "..."; // Truncate and add ellipsis

      return `
          <item>
            <title>${escapeXml(essay.title)}</title>
            <link>${url}</link>
            <description>${escapeXml(summary)}</description>
            <content:encoded><![CDATA[${htmlContent}]]></content:encoded>
            <pubDate>${new Date(essay.date).toUTCString()}</pubDate>
            <dc:creator><![CDATA[Kevin Gugelmann]]></dc:creator>
            <dc:date>${new Date(essay.date).toISOString()}</dc:date>
            <guid>${url}</guid>
          </item>
        `;
    })
    .join("")
}
  </channel>
</rss>
`;

// Helper to escape XML special characters
function escapeXml(unsafe) {
  if (unsafe == null) return "";
  const str = String(unsafe);
  return str.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
    }
    return c;
  });
}

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputFile, rss.trim());

console.log("✅ Successfully generated rss.xml!");
