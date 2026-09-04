import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * A page section: a centred content column with generous vertical rhythm.
 * `index` is accepted for backward compatibility with existing call sites but
 * is no longer rendered - sequence numbers read as decoration once there is
 * no measurement device they're actually part of.
 */
export interface SectionProps {
  /** @deprecated no longer rendered */
  index?: string;
  eyebrow?: string;
  children: ReactNode;
  className?: string;
  id?: string;
  /** Removes the horizontal padding for full-bleed content. */
  bleed?: boolean;
}

export function Section({
  eyebrow,
  children,
  className,
  id,
  bleed = false,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(className)}
      aria-labelledby={id ? `${id}-eyebrow` : undefined}
    >
      <div className="mx-auto max-w-[1400px]">
        <div className={cn(bleed ? "" : "px-4 py-14 sm:px-6 sm:py-20 lg:px-8")}>
          {eyebrow ? (
            <p
              id={id ? `${id}-eyebrow` : undefined}
              className="plate-label mb-5"
            >
              {eyebrow}
            </p>
          ) : null}
          {children}
        </div>
      </div>
    </section>
  );
}
