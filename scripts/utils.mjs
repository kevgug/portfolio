export const siteUrl = "https://kevingugelmann.com";

/**
 * Build full image URL for an essay image
 */
export function getFullImageUrl(essaySlug, imageSrc) {
  return `${siteUrl}/assets/essays/${essaySlug}/images/${imageSrc}`;
}

/**
 * Remove trailing backslashes inside blockquotes only
 */
export function removeTrailingBackslashesInBlockquotes(content) {
  return content.replace(/^(>.*)\\\s*$/gm, "$1");
}

/**
 * Convert [1] footnotes to standard markdown [^1] format
 */
export function convertToStandardFootnotes(content) {
  const notesRegex = /^## Notes\s*$/m;
  const parts = content.split(notesRegex);

  if (parts.length < 2) {
    return content.replace(/\[(\d+)\]/g, "[^$1]");
  }

  let mainContent = parts[0].replace(/\[(\d+)\]/g, "[^$1]");
  let notesSection = parts[1].replace(/^\[(\d+)\]\s*/gm, "[^$1]: ");

  return mainContent + "## Notes\n\n" + notesSection;
}

/**
 * Convert relative image paths to full URLs in markdown
 */
export function processImagePaths(content, essaySlug) {
  return content.replace(
    /!\[([^\]]*)\]\((?!https?:\/\/)([^)]+)\)/gi,
    (match, alt, src) => {
      return `![${alt}](${getFullImageUrl(essaySlug, src)})`;
    },
  );
}

/**
 * Preprocess markdown content for LLM consumption
 * Shared between llms-full.txt and individual essay .md files
 */
export function preprocessMarkdownForLLM(content, essaySlug) {
  let processed = content;
  processed = removeTrailingBackslashesInBlockquotes(processed);
  processed = processImagePaths(processed, essaySlug);
  processed = convertToStandardFootnotes(processed);
  return processed;
}
