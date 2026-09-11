import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * A page section: one centred content column with generous vertical rhythm.
 * No rail label - a stacked mono eyebrow in a narrow column read as decoration
 * and left the rail mostly empty. The heading alone carries the section.
 */
export interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  /** Drop the horizontal padding for full-bleed content. */
  bleed?: boolean;
}

export function Section({ children, className, id, bleed = false }: SectionProps) {
  return (
    <section
      id={id}
      className={cn("border-t border-rule first:border-t-0", className)}
    >
      <div
        className={cn(
          "mx-auto max-w-[1400px] py-14 sm:py-20",
          bleed ? "" : "px-4 sm:px-6 lg:px-8",
        )}
      >
        {children}
      </div>
    </section>
  );
}
