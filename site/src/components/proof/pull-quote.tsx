import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * A pull quote: the one line of a section worth stopping on, set at display
 * size against a spot-ink rule. It lifts a sentence out of the section it sits
 * in rather than quoting anyone, so the caption names the stage it came from,
 * not a speaker.
 *
 * Type: display face, balanced wrap, measure capped at 40ch so it reads as a
 * statement rather than a paragraph set in a larger size.
 */
export interface PullQuoteProps {
  children: ReactNode;
  /** Optional short attribution or source line, set in mono. */
  source?: string;
  className?: string;
}

export function PullQuote({ children, source, className }: PullQuoteProps) {
  return (
    <figure className={cn("border-l-2 border-l-mark py-1 pl-5 sm:pl-6", className)}>
      <p className="display max-w-[40ch] text-[clamp(1.375rem,2.4vw,1.875rem)] text-balance text-ink">
        {children}
      </p>
      {source ? (
        <figcaption className="plate-label mt-3">{source}</figcaption>
      ) : null}
    </figure>
  );
}
