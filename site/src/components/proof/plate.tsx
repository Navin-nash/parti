"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * A specimen plate: a hard-edged pane with four persimmon crop marks at the
 * corners. The crop marks are the signature motif (DESIGN.md) - the only
 * ornament in the system, and literally a printing artifact. On reveal they
 * draw in from each corner; under reduced motion they are simply present.
 */
export interface PlateProps {
  children: ReactNode;
  /** Mono uppercase label, sits above the pane. */
  label?: string;
  /** Recessed variant: sits on plate-2 rather than plate. */
  recessed?: boolean;
  className?: string;
  bodyClassName?: string;
}

const CORNERS = [
  { pos: "left-[-6px] top-[-6px]", border: "border-l border-t", origin: "top left" },
  { pos: "right-[-6px] top-[-6px]", border: "border-r border-t", origin: "top right" },
  { pos: "left-[-6px] bottom-[-6px]", border: "border-b border-l", origin: "bottom left" },
  { pos: "right-[-6px] bottom-[-6px]", border: "border-r border-b", origin: "bottom right" },
] as const;

export function Plate({ children, label, recessed, className, bodyClassName }: PlateProps) {
  const reduce = useReducedMotion();

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label ? <span className="plate-label">{label}</span> : null}
      <div
        className={cn(
          "relative border border-rule",
          recessed ? "bg-plate-2" : "bg-plate",
        )}
      >
        {CORNERS.map((c, i) => (
          <motion.span
            key={c.origin}
            aria-hidden
            className={cn("pointer-events-none absolute size-[10px] border-mark", c.pos, c.border)}
            style={{ transformOrigin: c.origin }}
            initial={reduce ? false : { scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.32, delay: 0.1 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
          />
        ))}
        <div className={cn("p-5 sm:p-6", bodyClassName)}>{children}</div>
      </div>
    </div>
  );
}
