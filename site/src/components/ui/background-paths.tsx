"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Background Paths - after kokonutd's component on 21st.dev
 * (https://21st.dev/@kokonutd/components/background-paths).
 *
 * Thirty-six generated strokes per direction, breathing on staggered loops.
 * The original draws each stroke on with pathLength; that leaves the field
 * near-empty for the first seconds and pulsing thereafter, which reads as
 * scratches in a footer band - so the strokes stay drawn and only their
 * opacity moves. Strokes are currentColor, so the band inherits the ink of
 * whichever ground it is laid over and needs no per-theme variant. Static
 * under reduced motion (DESIGN.md, Motion).
 */
function FloatingPaths({ position }: { position: number }) {
  const reduce = useReducedMotion();

  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${380 - i * 5 * position} -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${152 - i * 5 * position} ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${684 - i * 5 * position} ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.03,
  }));

  return (
    <svg
      className="size-full"
      viewBox="-500 -250 1300 700"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden
    >
      {paths.map((path) => (
        <motion.path
          key={path.id}
          d={path.d}
          stroke="currentColor"
          strokeWidth={path.width}
          strokeOpacity={0.1 + path.id * 0.03}
          initial={{ opacity: 0.45 }}
          animate={reduce ? { opacity: 0.45 } : { opacity: [0.25, 0.6, 0.25] }}
          transition={
            reduce
              ? { duration: 0 }
              : {
                  duration: 14 + (path.id % 7) * 2,
                  delay: (path.id % 5) * 0.8,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }
          }
        />
      ))}
    </svg>
  );
}

/** The full backdrop: two mirrored sets of paths, pinned behind its parent. */
export function BackgroundPaths({ className }: { className?: string }) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden
    >
      <FloatingPaths position={1} />
      <div className="absolute inset-0">
        <FloatingPaths position={-1} />
      </div>
    </div>
  );
}
