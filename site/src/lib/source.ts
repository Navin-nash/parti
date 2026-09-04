import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";

const ROOT = process.cwd();

/**
 * Read a source file off disk so the code viewer shows what actually renders.
 *
 * The alternative - a hand-written snippet stored beside the component - drifts
 * from the implementation within about a week and then quietly lies to the
 * reader. On a site whose whole argument is "look at the real output", a stale
 * snippet is the worst possible bug.
 */
export const readSource = cache(async (sourcePath: string): Promise<string> => {
  // Every caller passes a registry-declared path of the form "src/arms/...".
  // Splitting off that fixed prefix and joining the rest under one literal
  // base (per Next's own guidance) keeps Turbopack's file trace scoped to
  // src/arms instead of tracing the whole project as a dynamic access.
  const ARMS_PREFIX = "src/arms/";
  if (!sourcePath.startsWith(ARMS_PREFIX) || sourcePath.includes("..")) {
    throw new Error(`Refusing to read outside ${ARMS_PREFIX}: ${sourcePath}`);
  }
  const resolved = path.join(ROOT, "src", "arms", sourcePath.slice(ARMS_PREFIX.length));
  try {
    return await readFile(resolved, "utf8");
  } catch {
    return `// Source not found: ${sourcePath}\n// The registry entry points at a file that does not exist.`;
  }
});

export function languageOf(sourcePath: string): string {
  const ext = path.extname(sourcePath).slice(1);
  const map: Record<string, string> = {
    tsx: "tsx",
    ts: "ts",
    jsx: "jsx",
    js: "js",
    css: "css",
    json: "json",
    md: "markdown",
    py: "python",
    html: "html",
  };
  return map[ext] ?? "text";
}
