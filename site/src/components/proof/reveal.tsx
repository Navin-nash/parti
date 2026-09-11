"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";
import type { ElementType, ReactNode } from "react";

// Precomputed once at module scope, not per-render - motion.create() builds a
// new component whose state resets on every call, so it can't be called from
// inside the render body (react-hooks/static-components). These are the only
// tags Reveal is asked for anywhere in the site. Typed as ElementType (same
// erasure the old useMemo cast did) since RevealProps is fixed to div's prop
// shape regardless of which tag is picked.
const REVEAL_TAGS: Record<"div" | "li" | "section", ElementType> = {
  div: motion.create("div"),
  li: motion.create("li"),
  section: motion.create("section"),
};

type RevealTag = keyof typeof REVEAL_TAGS;

/**
 * The one scroll-reveal primitive. Every section and plate enters through this
 * and nothing else - no per-component observers (DESIGN.md, Motion).
 *
 * Entrance-only, fires once: a short rise as the element crosses into view. The
 * content is fully opaque at rest and in SSR - it is never parked at opacity 0
 * behind an observer - so first paint, no-JS and a slow device all show the
 * page. Under reduced motion the transform is dropped too.
 */
export interface RevealProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  /** Stagger offset in seconds when several Reveals sit in a row. */
  delay?: number;
  /** Render as a different element (e.g. "li", "section"). */
  as?: RevealTag;
}

export function Reveal({ children, delay = 0, as = "div", className, ...rest }: RevealProps) {
  const reduce = useReducedMotion();
  const Comp = REVEAL_TAGS[as];

  return (
    <Comp
      className={className}
      initial={reduce ? false : { y: 14 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      {...rest}
    >
      {children}
    </Comp>
  );
}
