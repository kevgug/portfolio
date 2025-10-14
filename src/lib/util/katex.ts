import katex from "katex";

/**
 * Renders an inline LaTeX expression to HTML
 */
export function renderInlineLatex(latex: string): string {
  try {
    return katex.renderToString(latex, {
      throwOnError: false,
      displayMode: false,
    });
  } catch (error) {
    console.error("KaTeX inline rendering error:", error);
    return `<span class="katex-error" style="color: red;">$${latex}$</span>`;
  }
}

/**
 * Renders a display (block) LaTeX expression to HTML
 */
export function renderDisplayLatex(latex: string): string {
  try {
    return katex.renderToString(latex, {
      throwOnError: false,
      displayMode: true,
    });
  } catch (error) {
    console.error("KaTeX display rendering error:", error);
    return `<span class="katex-error" style="color: red;">$$${latex}$$</span>`;
  }
}
