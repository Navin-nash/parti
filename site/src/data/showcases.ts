/**
 * The gallery data model.
 *
 * Deliberately thin: a showcase is a finished landing page and the minimum
 * that lets a reader find and open it. No baseline arm, no prompt, no
 * process narrative, no measured/judged split - just the work. The gallery's
 * whole argument is the live preview, not a case study about how it was made.
 */

export interface Showcase {
  slug: string;
  title: string;
  /** One line, for the gallery card and the detail page. */
  tagline: string;
  category: string;
  /** The one accent color this direction is built on - used only by the
   *  site's own chrome (card border glow, category tag), never injected
   *  into the showcase itself. */
  accent: string;
}

export const SHOWCASES: Showcase[] = [
  {
    slug: "kiln",
    title: "Kiln",
    tagline: "Small-batch stoneware, sold like a gallery catalogue rather than a storefront.",
    category: "E-commerce",
    accent: "#B5502E",
  },
  {
    slug: "torque",
    title: "Torque",
    tagline: "An electric bike sold like an instrument panel — every spec stated, nothing softened.",
    category: "Hardware",
    accent: "#FF7A1A",
  },
  {
    slug: "undertow",
    title: "Undertow",
    tagline: "A wind-down app for people who fix their sleep by reading about tides.",
    category: "Wellness",
    accent: "#48548C",
  },
  {
    slug: "datum",
    title: "Datum",
    tagline: "A spatial-design studio that writes about buildings the way it draws them.",
    category: "Studio",
    accent: "#E8B923",
  },
  {
    slug: "tandem",
    title: "Tandem",
    tagline: "Language practice with a real stranger, twenty minutes at a time.",
    category: "Product",
    accent: "#FF8F6B",
  },
];

export function showcaseBySlug(slug: string): Showcase | undefined {
  return SHOWCASES.find((s) => s.slug === slug);
}

export function showcaseSlugs(): string[] {
  return SHOWCASES.map((s) => s.slug);
}
