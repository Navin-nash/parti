"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * A still frame: the same hairline-and-crop-mark chrome as `BrowserFrame`,
 * but the pane holds a captured screenshot (`public/gallery/<slug>.png`)
 * instead of a live iframe. For a teaser context where five concurrent live
 * pages read as noise at a small size - the real page is one click away, at
 * `BrowserFrame` size, on the gallery.
 */
export interface ShowcaseStillProps {
  slug: string;
  title: string;
  aspect?: string;
  className?: string;
}

const CORNERS = [
  { pos: "left-[-6px] top-[-6px]", border: "border-l border-t", origin: "top left" },
  { pos: "right-[-6px] top-[-6px]", border: "border-r border-t", origin: "top right" },
  { pos: "left-[-6px] bottom-[-6px]", border: "border-b border-l", origin: "bottom left" },
  { pos: "right-[-6px] bottom-[-6px]", border: "border-r border-b", origin: "bottom right" },
] as const;

export function ShowcaseStill({ slug, title, aspect = "7 / 5", className }: ShowcaseStillProps) {
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

      <div className="relative w-full overflow-hidden bg-white" style={{ aspectRatio: aspect }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- a captured
            still of the real page, cropped from the top, not an <Image>
            that needs breakpoint-specific sizes for a fixed teaser thumb */}
        <img
          src={`/gallery/${slug}.png`}
          alt={`${title}, a preview`}
          loading="lazy"
          className="size-full object-cover object-top"
        />
      </div>
    </div>
  );
}
