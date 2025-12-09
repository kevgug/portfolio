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
