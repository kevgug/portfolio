import { marked } from "$lib/util/marked";

export interface BlogFootnotesMap {
  [num: string]: BlogSectionContent[];
}

export type BlogSectionContent =
  | { type: "paragraph"; tokens: ParagraphToken[] }
  | { type: "code"; lang?: string; code: string }
  | { type: "list"; ordered: boolean; items: ParagraphToken[][] }
  | {
      type: "blockquote";
      tokens: ParagraphToken[];
      multiline?: boolean;
      endsWithBreak?: boolean;
      citation?: string;
    }
  | { type: "latex"; latex: string; footnoteRef?: string }
  | { type: "image"; path: string; alt: string; caption?: string }
  | { type: "table"; headers: string[]; rows: string[][] };

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
  audioConfig?: { [code: string]: string };
}

const FOOTNOTE_REF_REGEX = /\[(\d+)\]/g;

export function parseMarkdown(
  md: string,
  title?: string,
  date?: string,
  audioConfig?: { [code: string]: string }
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

  // For multiline footnote support
  let currentFootnoteNum: string | null = null;
  let currentFootnoteBuffer: string[] = [];
  let inContributionNote = false;

  let inCodeBlock = false;
  let codeBlockLang = "";
  let codeBlockBuffer: string[] = [];

  let inLatexBlock = false;
  let latexBlockBuffer: string[] = [];

  let inList = false;
  let listBuffer: string[] = [];
  let isOrderedList = false;

  let inBlockquote = false;
  let blockquoteBuffer: string[] = [];

  let inTable = false;
  let tableBuffer: string[] = [];

  // Track if we've seen any h2 sections
  let hasH2Sections = false;
  // Buffer for content before first h2
  let preH2Content: BlogSectionContent[] = [];

  const flushParagraph = () => {
    if (paragraphBuffer.length > 0) {
      // Check if any line ends with backslash (line break indicator)
      const hasLineBreaks = paragraphBuffer.some((line) => line.endsWith("\\"));

      let text: string;

      if (hasLineBreaks) {
        // Preserve line breaks: join with <br> tag
        text = paragraphBuffer
          .map((line) => {
            // Remove trailing backslash if present
            const cleanLine = line.endsWith("\\")
              ? line.slice(0, -1).trim()
              : line.trim();
            return cleanLine;
          })
          .join("<br>")
          .trim();
      } else {
        // Join into single line with spaces
        text = paragraphBuffer.join(" ").trim();
      }

      if (text) {
        const paragraphContent: BlogSectionContent = {
          type: "paragraph",
          tokens: tokenizeAndParseParagraph(text, audioConfig),
        };
        if (currentSection) {
          currentSection.content.push(paragraphContent);
        } else if (!hasH2Sections) {
          // Accumulate content before first h2
          preH2Content.push(paragraphContent);
        }
      }
    }
    paragraphBuffer = [];
  };

  const flushList = () => {
    if (listBuffer.length > 0) {
      const listContent: BlogSectionContent = {
        type: "list",
        ordered: isOrderedList,
        items: listBuffer.map((item) =>
          tokenizeAndParseParagraph(item, audioConfig)
        ),
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
    isOrderedList = false;
  };

  const flushBlockquote = () => {
    if (blockquoteBuffer.length > 0) {
      // Check for citation: look for lines starting with "- "
      let citation: string | undefined;
      let contentLines = [...blockquoteBuffer];

      // Find the last non-empty line
      for (let i = contentLines.length - 1; i >= 0; i--) {
        const line = contentLines[i].trim();
        if (line) {
          // Check if this line starts with "- " (citation pattern)
          if (line.startsWith("- ")) {
            citation = marked.parseInline(line.substring(2).trim()) as string; // Remove the "- " prefix and parse markdown
            contentLines = contentLines.slice(0, i); // Remove citation line from content
          }
          break; // Only check the last non-empty line
        }
      }

      // If all lines were citation, treat the whole thing as citation
      if (contentLines.length === 0 && citation) {
        contentLines = [""]; // Add an empty line so we have something to render
      }

      // Check if any line ends with backslash (line break indicator)
      const hasLineBreaks = contentLines.some((line) => line.endsWith("\\"));

      let text: string;
      let isMultiline: boolean;
      let endsWithBreak = false;

      if (hasLineBreaks) {
        // Check if the last line ends with backslash
        const lastLine = contentLines[contentLines.length - 1];
        endsWithBreak = lastLine ? lastLine.endsWith("\\") : false;

        // Preserve line breaks: join with <br> tag
        text = contentLines
          .map((line) => {
            // Remove trailing backslash if present
            const cleanLine = line.endsWith("\\")
              ? line.slice(0, -1).trim()
              : line.trim();
            return cleanLine;
          })
          .join("<br>")
          .trim();
        isMultiline = true;
      } else {
        // Join into single line with spaces
        text = contentLines.join(" ").trim();
        isMultiline = false;
      }

      // Tokenize the blockquote text to handle footnote references
      const tokens = tokenizeAndParseParagraph(text, audioConfig);

      const blockquoteContent: BlogSectionContent = {
        type: "blockquote",
        tokens: tokens,
        multiline: isMultiline,
        endsWithBreak: endsWithBreak,
        ...(citation && { citation }),
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

  const flushTable = () => {
    if (tableBuffer.length >= 3) {
      // Need at least header, separator, and one row
      const parseCells = (line: string): string[] => {
        const cells = line.split("|").map((cell) => cell.trim());
        // Remove leading and trailing empty strings from pipes at start/end
        if (cells[0] === "") cells.shift();
        if (cells.length > 0 && cells[cells.length - 1] === "") cells.pop();
        return cells;
      };

      const headers = parseCells(tableBuffer[0]);

      // Skip the separator line (index 1)
      const rows = tableBuffer.slice(2).map((row) => parseCells(row));

      const tableContent: BlogSectionContent = {
        type: "table",
        headers: headers,
        rows: rows,
      };

      if (currentSection) {
        currentSection.content.push(tableContent);
      } else if (!hasH2Sections) {
        preH2Content.push(tableContent);
      }
    }
    tableBuffer = [];
    inTable = false;
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

    if (inLatexBlock) {
      // Check for closing $$ with optional footnote reference [number]
      const latexEndMatch = line.trim().match(/^\$\$(?:\s*\[(\d+)\])?$/);
      if (latexEndMatch) {
        const footnoteRef = latexEndMatch[1]; // May be undefined
        // Unescape underscores in LaTeX blocks (markdown escaping shouldn't apply in LaTeX)
        const latexText = latexBlockBuffer.join("\n").replace(/\\_/g, "_");
        const latexContent: BlogSectionContent = {
          type: "latex",
          latex: latexText,
          ...(footnoteRef && { footnoteRef }),
        };
        if (currentSection) {
          currentSection.content.push(latexContent);
        } else if (!hasH2Sections) {
          // Accumulate content before first h2
          preH2Content.push(latexContent);
        }
        inLatexBlock = false;
        latexBlockBuffer = [];
      } else {
        latexBlockBuffer.push(line);
      }
      continue;
    }

    const codeBlockMatch = line.match(/^```(\w*)/);
    if (codeBlockMatch) {
      flushParagraph();
      flushList();
      flushBlockquote();
      flushTable();
      inCodeBlock = true;
      codeBlockLang = codeBlockMatch[1] || "";
      continue;
    }

    if (line.trim() === "$$") {
      flushParagraph();
      flushList();
      flushBlockquote();
      flushTable();
      inLatexBlock = true;
      continue;
    }

    // Standard markdown image syntax: ![alt text](path)
    // Match standalone image on its own line
    const imageMatch = line.match(/^\s*!\[([^\]]*)\]\(([^)]+)\)\s*$/);
    if (imageMatch) {
      flushParagraph();
      flushList();
      flushBlockquote();
      flushTable();

      const altText = (imageMatch[1] || "").trim();
      const path = (imageMatch[2] || "").trim();

      // Look ahead to next line for caption (emphasized text)
      let caption: string | undefined = undefined;
      if (idx + 1 < lines.length) {
        const nextLine = lines[idx + 1] ?? "";
        const captionMatch = nextLine.match(/^\s*[*_](.+)[*_]\s*$/);
        if (captionMatch) {
          // Remove the emphasis markers and use as caption
          caption = (captionMatch[1] || "").trim();
          idx++; // Skip the caption line
        }
      }

      const imageContent: BlogSectionContent = {
        type: "image",
        path: path,
        alt: altText || path,
        caption: caption,
      };

      if (currentSection) {
        currentSection.content.push(imageContent);
      } else if (!hasH2Sections) {
        preH2Content.push(imageContent);
      }

      continue;
    }

    // Section heading
    const h2Match = line.match(/^##\s+(.*)$/);
    if (h2Match) {
      flushParagraph();
      flushList();
      flushBlockquote();
      flushTable();
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

    // Inside notes: lines like [1] text (with support for multiline)
    if (inNotes) {
      // Check for --- separator (start of contribution note)
      if (line.trim() === "---") {
        // Flush any existing footnote buffer
        if (currentFootnoteNum && currentFootnoteBuffer.length > 0) {
          footnotes[currentFootnoteNum] = parseFootnoteContent(
            currentFootnoteBuffer,
            audioConfig
          );
          currentFootnoteBuffer = [];
          currentFootnoteNum = null;
        }
        inContributionNote = true;
        continue;
      }

      // If in contribution note mode, accumulate all text
      if (inContributionNote) {
        if (contributionNote) contributionNote += "\n";
        contributionNote += line;
        continue;
      }

      // Parse footnotes
      const noteMatch = line.match(/^\[(\d+)\]\s*(.*)$/);
      if (noteMatch) {
        // New footnote starts - flush any existing footnote buffer
        if (currentFootnoteNum && currentFootnoteBuffer.length > 0) {
          footnotes[currentFootnoteNum] = parseFootnoteContent(
            currentFootnoteBuffer,
            audioConfig
          );
          currentFootnoteBuffer = [];
        }

        currentFootnoteNum = noteMatch[1];
        const text = (noteMatch[2] || "").trim();
        if (text) {
          currentFootnoteBuffer.push(text);
        }
      } else if (currentFootnoteNum && line.trim()) {
        // Continue accumulating footnote content
        currentFootnoteBuffer.push(line.trim());
      } else if (line.trim() === "" && currentFootnoteNum) {
        // Blank line within a footnote - preserve it for paragraph separation
        currentFootnoteBuffer.push("");
      }
      continue;
    }

    // Unordered list items (-, *, +)
    const unorderedListItemMatch = line.match(/^\s*(?:-|\*|\+)\s+(.*)/);
    if (unorderedListItemMatch) {
      if (!inList) {
        flushParagraph();
        inList = true;
        isOrderedList = false;
      }
      listBuffer.push((unorderedListItemMatch[1] || "").trim());
      continue;
    }

    // Ordered list items (1., 2., etc.)
    const orderedListItemMatch = line.match(/^\s*\d+\.\s+(.*)/);
    if (orderedListItemMatch) {
      if (!inList) {
        flushParagraph();
        inList = true;
        isOrderedList = true;
      }
      listBuffer.push((orderedListItemMatch[1] || "").trim());
      continue;
    }

    const indentedLineMatch = line.match(/^\s{2,}(.*)/);
    if (inList && indentedLineMatch && (indentedLineMatch[1] || "").trim()) {
      if (listBuffer.length > 0) {
        const lastItem = listBuffer[listBuffer.length - 1];
        // Check if the last item ends with backslash for line break
        if (lastItem.endsWith("\\")) {
          listBuffer[listBuffer.length - 1] =
            lastItem.slice(0, -1).trim() +
            "<br>" +
            (indentedLineMatch[1] || "").trim();
        } else {
          listBuffer[listBuffer.length - 1] +=
            " " + (indentedLineMatch[1] || "").trim();
        }
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

    // Table detection: line with pipes and next line is separator
    const tableLineMatch = line.match(/^\s*\|.*\|\s*$/);
    if (tableLineMatch && idx + 1 < lines.length) {
      const nextLine = lines[idx + 1] ?? "";
      // Check if next line is a separator (contains only |, -, and whitespace)
      const isSeparator = /^\s*\|[\s\-:|]+\|\s*$/.test(nextLine);

      if (isSeparator) {
        if (!inTable) {
          flushParagraph();
          flushList();
          inTable = true;
        }
        tableBuffer.push(line.trim());
        continue;
      }
    }

    // Continue accumulating table rows
    if (inTable && tableLineMatch) {
      tableBuffer.push(line.trim());
      continue;
    }

    // End of table
    if (inTable) {
      flushTable();
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
  flushTable();

  // Flush any remaining footnote
  if (currentFootnoteNum && currentFootnoteBuffer.length > 0) {
    footnotes[currentFootnoteNum] = parseFootnoteContent(
      currentFootnoteBuffer,
      audioConfig
    );
  }

  // If there are no h2 sections found, create a single section with the title
  // using all the accumulated content
  if (!hasH2Sections && preH2Content.length > 0) {
    sections.push({
      heading: finalTitle,
      content: preH2Content,
    });
  } else if (hasH2Sections && preH2Content.length > 0) {
    // If there are H2 sections, but also content before the first one,
    // treat it as a Foreword section
    sections.unshift({
      heading: "Foreword",
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
    audioConfig,
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

export interface ParagraphTokenLatex {
  type: "latex";
  latex: string;
}

export interface ParagraphTokenCode {
  type: "code";
  code: string;
  audio?: string;
}

export type ParagraphToken =
  | ParagraphTokenText
  | ParagraphTokenRef
  | ParagraphTokenLatex
  | ParagraphTokenCode;

function tokenizeAndParseParagraph(
  text: string,
  audioConfig?: { [code: string]: string }
): ParagraphToken[] {
  const tokens: ParagraphToken[] = [];

  // Regex to match inline code blocks (backticks)
  // Matches `code` but not `` (empty) or ``` (code block start)
  const codeRegex = /`([^`\n]+)`/g;

  // Extract all code blocks with their positions
  const codeMatches: Array<{ start: number; end: number; code: string }> = [];
  let codeMatch: RegExpExecArray | null;

  // eslint-disable-next-line no-cond-assign
  while ((codeMatch = codeRegex.exec(text))) {
    codeMatches.push({
      start: codeMatch.index,
      end: codeMatch.index + codeMatch[0].length,
      code: codeMatch[1],
    });
  }

  // Process text segments between code blocks
  let lastIndex = 0;
  for (const codeMatch of codeMatches) {
    // Add text before this code block
    if (codeMatch.start > lastIndex) {
      const textSegment = text.slice(lastIndex, codeMatch.start);
      tokens.push(...processTextSegment(textSegment));
    }

    // Process the code block
    const codeText = codeMatch.code;
    const audioFile = audioConfig?.[codeText];
    if (audioFile) {
      // Create code token with audio
      tokens.push({
        type: "code",
        code: codeText,
        audio: audioFile,
      });
    } else {
      // No audio match, include as regular text (marked will handle it)
      tokens.push({
        type: "text",
        text: marked.parseInline(`\`${codeText}\``) as string,
      });
    }

    lastIndex = codeMatch.end;
  }

  // Add any remaining text after the last code block
  if (lastIndex < text.length) {
    const textSegment = text.slice(lastIndex);
    tokens.push(...processTextSegment(textSegment));
  }

  return tokens;
}

function processTextSegment(text: string): ParagraphToken[] {
  const tokens: ParagraphToken[] = [];

  // Combined regex to match both footnotes and inline LaTeX
  // Matches [digit] for footnotes or $$...$$ for inline LaTeX (non-greedy, not preceded by \)
  const combinedRegex = /(\[\d+\])|(?<!\\)\$\$([^\n]+?)\$\$/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  // eslint-disable-next-line no-cond-assign
  while ((match = combinedRegex.exec(text))) {
    const start = match.index;
    const end = start + match[0].length;

    // Add any text before this match
    if (start > lastIndex) {
      const textContent = text.slice(lastIndex, start);
      tokens.push({
        type: "text",
        text: marked.parseInline(textContent) as string,
      });
    }

    // Check if it's a footnote reference [digit]
    if (match[1]) {
      const numMatch = match[1].match(/\[(\d+)\]/);
      if (numMatch) {
        tokens.push({ type: "ref", num: numMatch[1] });
      }
    }
    // Otherwise it's inline LaTeX $...$
    else if (match[2]) {
      tokens.push({ type: "latex", latex: match[2] });
    }

    lastIndex = end;
  }

  // Add any remaining text
  if (lastIndex < text.length) {
    tokens.push({
      type: "text",
      text: marked.parseInline(text.slice(lastIndex)) as string,
    });
  }

  return tokens;
}

function parseFootnoteContent(
  lines: string[],
  audioConfig?: { [code: string]: string }
): BlogSectionContent[] {
  const content: BlogSectionContent[] = [];
  let paragraphBuffer: string[] = [];
  let inList = false;
  let listBuffer: string[] = [];
  let isOrderedList = false;

  const flushParagraph = () => {
    if (paragraphBuffer.length > 0) {
      // Check if any line ends with backslash (line break indicator)
      const hasLineBreaks = paragraphBuffer.some((line) => line.endsWith("\\"));

      let text: string;

      if (hasLineBreaks) {
        // Preserve line breaks: join with <br> tag
        text = paragraphBuffer
          .map((line) => {
            // Remove trailing backslash if present
            const cleanLine = line.endsWith("\\")
              ? line.slice(0, -1).trim()
              : line.trim();
            return cleanLine;
          })
          .join("<br>")
          .trim();
      } else {
        // Join into single line with spaces
        text = paragraphBuffer.join(" ").trim();
      }

      if (text) {
        content.push({
          type: "paragraph",
          tokens: tokenizeAndParseParagraph(text, audioConfig),
        });
      }
    }
    paragraphBuffer = [];
  };

  const flushList = () => {
    if (listBuffer.length > 0) {
      content.push({
        type: "list",
        ordered: isOrderedList,
        items: listBuffer.map((item) =>
          tokenizeAndParseParagraph(item, audioConfig)
        ),
      });
    }
    listBuffer = [];
    inList = false;
    isOrderedList = false;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Unordered list items (-, *, +)
    const unorderedListItemMatch = line.match(/^\s*(?:-|\*|\+)\s+(.*)/);
    if (unorderedListItemMatch) {
      if (!inList) {
        flushParagraph();
        inList = true;
        isOrderedList = false;
      }
      listBuffer.push((unorderedListItemMatch[1] || "").trim());
      continue;
    }

    // Ordered list items (1., 2., etc.)
    const orderedListItemMatch = line.match(/^\s*\d+\.\s+(.*)/);
    if (orderedListItemMatch) {
      if (!inList) {
        flushParagraph();
        inList = true;
        isOrderedList = true;
      }
      listBuffer.push((orderedListItemMatch[1] || "").trim());
      continue;
    }

    // Handle indented lines (continuation of list items)
    const indentedLineMatch = line.match(/^\s{2,}(.*)/);
    if (inList && indentedLineMatch && (indentedLineMatch[1] || "").trim()) {
      if (listBuffer.length > 0) {
        const lastItem = listBuffer[listBuffer.length - 1];
        // Check if the last item ends with backslash for line break
        if (lastItem.endsWith("\\")) {
          listBuffer[listBuffer.length - 1] =
            lastItem.slice(0, -1).trim() +
            "<br>" +
            (indentedLineMatch[1] || "").trim();
        } else {
          listBuffer[listBuffer.length - 1] +=
            " " + (indentedLineMatch[1] || "").trim();
        }
        continue;
      }
    }

    if (inList) {
      flushList();
    }

    // Blank line separates paragraphs
    if (line.trim() === "") {
      flushParagraph();
      continue;
    }

    // Accumulate paragraph text
    paragraphBuffer.push(line);
  }

  flushParagraph();
  flushList();

  return content;
}
