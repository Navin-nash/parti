import { highlight } from "@/lib/highlight";
import { CopyButton } from "./copy-button";
import { cn } from "@/lib/utils";

/**
 * Server-rendered. Both themes are baked into the markup as CSS custom
 * properties and the theme picks one, so switching ground does not re-tokenize
 * anything and no highlighter ships to the browser.
 */
export async function CodeBlock({
  code,
  lang = "tsx",
  path,
  lineNumbers = false,
  maxHeight = "26rem",
  className,
  wrap = false,
}: {
  code: string;
  lang?: string;
  path?: string;
  lineNumbers?: boolean;
  maxHeight?: string | null;
  className?: string;
  wrap?: boolean;
}) {
  const html = await highlight(code, lang);
  const lines = code.replace(/\s+$/, "").split("\n").length;

  return (
    <figure className={cn("border border-rule bg-plate-2", className)}>
      <figcaption className="flex items-center gap-3 border-b border-rule px-3 py-1.5">
        {path ? (
          <code className="truncate font-mono text-[0.6875rem] text-ink-muted">
            {path}
          </code>
        ) : (
          <span className="plate-label">{lang}</span>
        )}
        <span className="ml-auto flex shrink-0 items-center gap-2">
          <span className="font-mono text-[0.625rem] tabular text-ink-dim">
            {lines} {lines === 1 ? "line" : "lines"}
          </span>
          <CopyButton value={code} />
        </span>
      </figcaption>
      <div
        className={cn(
          "overflow-auto text-[0.8125rem] leading-[1.65]",
          lineNumbers && "shiki-numbered",
          wrap && "shiki-wrap",
        )}
        style={maxHeight ? { maxHeight } : undefined}
        tabIndex={0}
        role="region"
        aria-label={path ? `Source of ${path}` : `${lang} code`}
      >
        <div
          className="shiki-host"
          // Shiki output, generated at build time from a file we read off disk.
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </figure>
  );
}
