"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * A live showcase inside something that reads as a real browser window, in
 * this site's own material language rather than a borrowed macOS chrome -
 * hairline border, crop marks, mono address row - matching `Plate`. The
 * content is a genuine iframe pointed at `/preview/[slug]`: real scroll, real
 * animation, no site nav bleeding in (see ChromeGate). This is not a
 * screenshot standing in for one.
 */
export interface BrowserFrameProps {
  slug: string;
  title: string;
  /** Fixed aspect box (gallery cards); omit for a tall, natural-scroll pane
   *  (detail page). */
  aspect?: string;
  /** Card context: no interaction, deferred load, shorter reveal. */
  compact?: boolean;
  className?: string;
}

const CORNERS = [
  { pos: "left-[-6px] top-[-6px]", border: "border-l border-t", origin: "top left" },
  { pos: "right-[-6px] top-[-6px]", border: "border-r border-t", origin: "top right" },
  { pos: "left-[-6px] bottom-[-6px]", border: "border-b border-l", origin: "bottom left" },
  { pos: "right-[-6px] bottom-[-6px]", border: "border-r border-b", origin: "bottom right" },
] as const;

export function BrowserFrame({ slug, title, aspect, compact, className }: BrowserFrameProps) {
  const reduce = useReducedMotion();
  const url = `${slug}.site`;

  return (
    <div className={cn("relative border border-rule bg-plate", className)}>
      {CORNERS.map((c, i) => (
        <motion.span
          key={c.origin}
          aria-hidden
          className={cn("pointer-events-none absolute z-10 size-[10px] border-mark", c.pos, c.border)}
          style={{ transformOrigin: c.origin }}
          initial={reduce ? false : { scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.32, delay: 0.1 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}

      <div className="flex items-center gap-2 border-b border-rule bg-plate-2 px-3 py-2">
        <div className="flex shrink-0 items-center gap-1" aria-hidden>
          <span className="size-[6px] border border-rule-strong" />
          <span className="size-[6px] border border-rule-strong" />
          <span className="size-[6px] border border-rule-strong" />
        </div>
        <div className="min-w-0 flex-1 truncate border border-rule bg-plate px-2.5 py-1 text-center font-mono text-[0.6875rem] text-ink-dim">
          {url}
        </div>
      </div>

      <div
        className={cn("relative w-full overflow-hidden bg-white", !aspect && "h-[70vh] max-h-[820px]")}
        style={aspect ? { aspectRatio: aspect } : undefined}
      >
        <iframe
          src={`/preview/${slug}`}
          title={title}
          loading={compact ? "lazy" : "eager"}
          tabIndex={compact ? -1 : 0}
          aria-hidden={compact || undefined}
          scrolling={compact ? "no" : undefined}
          className={cn("size-full border-0", compact && "pointer-events-none")}
        />
      </div>
    </div>
  );
}
