import { marked } from "marked";

export interface BlogFootnotesMap {
  [num: string]: string;
}

export interface BlogSection {
  heading: string;
  paragraphs: ParagraphToken[][];
}

export interface ParsedBlogPost {
  title: string;
  date: string;
  sections: BlogSection[];
  footnotes: BlogFootnotesMap;
  contributionNote?: string;
}

const FOOTNOTE_REF_REGEX = /\[(\d+)\]/g;

export function parseMarkdown(
  md: string,
  title?: string,
  date?: string
): ParsedBlogPost {
  const lines = md.split(/\r?\n/);

  // Skip frontmatter if present
  let idx = 0;
  if (lines[idx]?.trim() === "---") {
    idx++;
    while (idx < lines.length && lines[idx]?.trim() !== "---") idx++;
    idx++; // Skip the closing ---
  }

  // Skip empty lines to find content
  while (idx < lines.length && lines[idx].trim() === "") idx++;

  // If title/date not provided, parse from content (fallback)
  const parsedTitle =
    title ||
    (() => {
      const titleLine = lines[idx] || "";
      idx++;
      return titleLine.replace(/^#\s*/, "").trim();
    })();

  const parsedDate =
    date ||
    (() => {
      while (idx < lines.length && lines[idx].trim() === "") idx++;
      return (lines[idx] || "").trim();
    })();

  const finalTitle = parsedTitle;
  const finalDate = parsedDate;

  // Skip the title and date lines if they were parsed from content
  if (!title) idx++;
  if (!date) {
    while (idx < lines.length && lines[idx].trim() === "") idx++;
    idx++;
  }

  // Parse sections and footnotes
  const sections: BlogSection[] = [];
  const footnotes: BlogFootnotesMap = {};
  let contributionNote = "";

  let currentSection: BlogSection | null = null;
  let inNotes = false;
  let paragraphBuffer: string[] = [];

  const flushParagraph = () => {
    const text = paragraphBuffer.join(" ").trim();
    if (text && currentSection) {
      currentSection.paragraphs.push(tokenizeAndParseParagraph(text));
    }
    paragraphBuffer = [];
  };

  for (; idx < lines.length; idx++) {
    const raw = lines[idx] ?? "";
    const line = raw.replace(/\t/g, "    ");

    // Section heading
    const h2Match = line.match(/^##\s+(.*)$/);
    if (h2Match) {
      flushParagraph();
      const headingText = (h2Match[1] || "").trim();
      inNotes = /^notes$/i.test(headingText);
      if (!inNotes) {
        currentSection = { heading: headingText, paragraphs: [] };
        sections.push(currentSection);
      } else {
        currentSection = null;
      }
      continue;
    }

    // Inside notes: lines like [1] text
    if (inNotes) {
      const noteMatch = line.match(/^\[(\d+)\]\s*(.*)$/);
      if (noteMatch) {
        const num = noteMatch[1];
        const text = (noteMatch[2] || "").trim();
        if (num) footnotes[num] = marked.parseInline(text) as string;
      } else if (line.trim()) {
        if (contributionNote) contributionNote += "\n";
        contributionNote += line;
      }
      continue;
    }

    // Blank line separates paragraphs
    if (line.trim() === "") {
      flushParagraph();
      continue;
    }

    // Accumulate paragraph text; collapse inline whitespace a bit
    paragraphBuffer.push(line.trim());
  }

  flushParagraph();

  return {
    title: finalTitle,
    date: finalDate,
    sections,
    footnotes,
    contributionNote: contributionNote
      ? (marked.parse(contributionNote) as string)
      : undefined,
  };
}

export interface ParagraphTokenText {
  type: "text";
  text: string;
}

export interface ParagraphTokenRef {
  type: "ref";
  num: string;
}

export type ParagraphToken = ParagraphTokenText | ParagraphTokenRef;

function tokenizeAndParseParagraph(text: string): ParagraphToken[] {
  const tokens: ParagraphToken[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  FOOTNOTE_REF_REGEX.lastIndex = 0;
  // eslint-disable-next-line no-cond-assign
  while ((match = FOOTNOTE_REF_REGEX.exec(text))) {
    const start = match.index;
    const end = start + match[0].length;
    if (start > lastIndex) {
      tokens.push({
        type: "text",
        text: marked.parseInline(text.slice(lastIndex, start)) as string,
      });
    }
    tokens.push({ type: "ref", num: match[1] });
    lastIndex = end;
  }
  if (lastIndex < text.length) {
    tokens.push({
      type: "text",
      text: marked.parseInline(text.slice(lastIndex)) as string,
    });
  }
  return tokens;
}
