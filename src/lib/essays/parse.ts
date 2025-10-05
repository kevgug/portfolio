import { marked } from "$lib/util/marked";

export interface BlogFootnotesMap {
  [num: string]: string;
}

export type BlogSectionContent =
  | { type: "paragraph"; tokens: ParagraphToken[] }
  | { type: "code"; lang?: string; code: string }
  | { type: "list"; items: string[] }
  | { type: "blockquote"; text: string };

export interface BlogSection {
  heading: string;
  content: BlogSectionContent[];
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

  let inCodeBlock = false;
  let codeBlockLang = "";
  let codeBlockBuffer: string[] = [];

  let inList = false;
  let listBuffer: string[] = [];

  let inBlockquote = false;
  let blockquoteBuffer: string[] = [];

  // Track if we've seen any h2 sections
  let hasH2Sections = false;
  // Buffer for content before first h2
  let preH2Content: BlogSectionContent[] = [];

  const flushParagraph = () => {
    const text = paragraphBuffer.join(" ").trim();
    if (text) {
      const paragraphContent: BlogSectionContent = {
        type: "paragraph",
        tokens: tokenizeAndParseParagraph(text),
      };
      if (currentSection) {
        currentSection.content.push(paragraphContent);
      } else if (!hasH2Sections) {
        // Accumulate content before first h2
        preH2Content.push(paragraphContent);
      }
    }
    paragraphBuffer = [];
  };

  const flushList = () => {
    if (listBuffer.length > 0) {
      const listContent: BlogSectionContent = {
        type: "list",
        items: listBuffer.map((item) => marked.parseInline(item) as string),
      };
      if (currentSection) {
        currentSection.content.push(listContent);
      } else if (!hasH2Sections) {
        // Accumulate content before first h2
        preH2Content.push(listContent);
      }
    }
    listBuffer = [];
    inList = false;
  };

  const flushBlockquote = () => {
    if (blockquoteBuffer.length > 0) {
      const text = blockquoteBuffer.join(" ").trim();
      const blockquoteContent: BlogSectionContent = {
        type: "blockquote",
        text: marked.parseInline(text) as string,
      };
      if (currentSection) {
        currentSection.content.push(blockquoteContent);
      } else if (!hasH2Sections) {
        // Accumulate content before first h2
        preH2Content.push(blockquoteContent);
      }
    }
    blockquoteBuffer = [];
    inBlockquote = false;
  };

  for (; idx < lines.length; idx++) {
    const raw = lines[idx] ?? "";
    const line = raw.replace(/\t/g, "    ");

    if (inCodeBlock) {
      if (line.trim() === "```") {
        const codeContent: BlogSectionContent = {
          type: "code",
          lang: codeBlockLang,
          code: codeBlockBuffer.join("\n"),
        };
        if (currentSection) {
          currentSection.content.push(codeContent);
        } else if (!hasH2Sections) {
          // Accumulate content before first h2
          preH2Content.push(codeContent);
        }
        inCodeBlock = false;
        codeBlockBuffer = [];
        codeBlockLang = "";
      } else {
        codeBlockBuffer.push(raw);
      }
      continue;
    }

    const codeBlockMatch = line.match(/^```(\w*)/);
    if (codeBlockMatch) {
      flushParagraph();
      flushList();
      flushBlockquote();
      inCodeBlock = true;
      codeBlockLang = codeBlockMatch[1] || "";
      continue;
    }

    // Section heading
    const h2Match = line.match(/^##\s+(.*)$/);
    if (h2Match) {
      flushParagraph();
      flushList();
      flushBlockquote();
      const headingText = (h2Match[1] || "").trim();
      inNotes = /^notes$/i.test(headingText);
      if (!inNotes) {
        hasH2Sections = true;
        currentSection = { heading: headingText, content: [] };
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

    const listItemMatch = line.match(/^\s*(?:-|\*|\+)\s+(.*)/);
    if (listItemMatch) {
      if (!inList) {
        flushParagraph();
        inList = true;
      }
      listBuffer.push((listItemMatch[1] || "").trim());
      continue;
    }

    const indentedLineMatch = line.match(/^\s{2,}(.*)/);
    if (inList && indentedLineMatch && (indentedLineMatch[1] || "").trim()) {
      if (listBuffer.length > 0) {
        listBuffer[listBuffer.length - 1] +=
          " " + (indentedLineMatch[1] || "").trim();
        continue;
      }
    }

    if (inList) {
      flushList();
    }

    // Blockquote lines start with >
    const blockquoteMatch = line.match(/^>\s*(.*)$/);
    if (blockquoteMatch) {
      if (!inBlockquote) {
        flushParagraph();
        inBlockquote = true;
      }
      blockquoteBuffer.push((blockquoteMatch[1] || "").trim());
      continue;
    }

    if (inBlockquote) {
      flushBlockquote();
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
  flushList();
  flushBlockquote();

  // If there are no h2 sections found, create a single section with the title
  // using all the accumulated content
  if (!hasH2Sections && preH2Content.length > 0) {
    sections.push({
      heading: finalTitle,
      content: preH2Content,
    });
  }

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
