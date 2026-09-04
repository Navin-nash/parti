import "server-only";

import { cache } from "react";
import { createHighlighter, type Highlighter } from "shiki";

/**
 * One highlighter instance, created lazily, reused across the build.
 *
 * Both themes are loaded and both are rendered into the markup; CSS picks
 * which set of custom properties applies. Highlighting a code block on the
 * client to follow a theme toggle would ship a tokenizer to the browser for
 * something that never changes after build.
 */
let instance: Promise<Highlighter> | null = null;

function highlighter(): Promise<Highlighter> {
  instance ??= createHighlighter({
    themes: ["github-light", "github-dark"],
    langs: [
      "tsx", "ts", "jsx", "js", "css", "json",
      "markdown", "python", "html", "bash", "text",
    ],
  });
  return instance;
}

export const highlight = cache(
  async (code: string, lang: string): Promise<string> => {
    const hl = await highlighter();
    const langs = hl.getLoadedLanguages();
    const safe = langs.includes(lang) ? lang : "text";
    return hl.codeToHtml(code.replace(/\s+$/, ""), {
      lang: safe,
      themes: { light: "github-light", dark: "github-dark" },
      defaultColor: false,
      cssVariablePrefix: "--sh-",
    });
  },
);
