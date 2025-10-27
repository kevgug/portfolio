import { marked } from "marked";
import hljs from "highlight.js";

// Use hooks to post-process HTML and add target="_blank" to external links
marked.use({
  hooks: {
    postprocess(html: string): string {
      // Add target="_blank" and rel="noopener noreferrer" to external links
      return html.replace(
        /<a href="(https?:\/\/[^"]+)"/g,
        '<a href="$1" target="_blank" rel="noopener noreferrer"'
      );
    },
  },
});

// Configure highlight.js for code blocks
marked.setOptions({
  // @ts-expect-error - highlight option exists but is not in the types
  highlight: (code: string, lang: string) => {
    const language = hljs.getLanguage(lang) ? lang : "plaintext";
    return hljs.highlight(code, { language }).value;
  },
});

export { marked };
