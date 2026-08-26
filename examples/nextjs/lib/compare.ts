/**
 * The A/B manifest.
 *
 * Every entry that has BOTH arms is a genuine paired sample: the same prompt,
 * the same model, one run required to use the skill and one denied it. Entries
 * with only a parti arm say so — an honest "no baseline equivalent" is more
 * useful than a fabricated opposite.
 */

export interface Pair {
  slug: string;
  name: string;
  group: "Pages" | "States";
  blurb: string;
  /** what to look at first — the specific, checkable difference */
  tell: string;
  baseline?: string;
  parti?: string;
  /** measured, from examples/results — per-arm whole-build figures */
  notes?: string[];
}

export const PAIRS: Pair[] = [
  {
    slug: "landing",
    name: "Landing page",
    group: "Pages",
    blurb: "Marketing home — hero, capability section, social proof, call to action.",
    tell:
      "Both arms show the product rather than a stock illustration. The difference is underneath: the baseline sets spacing per section, the parti arm sets it from an 11-step scale declared before any CSS was written.",
    baseline: "/arms/baseline/landing.html",
    parti: "/arms/parti/landing.html",
  },
  {
    slug: "pricing",
    name: "Pricing page",
    group: "Pages",
    blurb: "Three tiers, comparison, FAQ — the single most tell-prone SaaS surface.",
    tell:
      "Look at how the recommended tier is marked. The baseline lifts it with a shadow; the parti arm steps it one level lighter and prints a word, because at this ground luminance a shadow is invisible.",
    baseline: "/arms/baseline/pricing.html",
    parti: "/arms/parti/pricing.html",
  },
  {
    slug: "dashboard",
    name: "Dashboard",
    group: "Pages",
    blurb: "The dispatcher board — live status, the day's disruptions, desk log.",
    tell:
      "Count the KPI tiles. The parti arm has none: board state is one line of monospace in the ribbon, which is how ops status is actually transmitted between desks. Four big numbers in rounded cards is a consumer-analytics convention.",
    baseline: "/arms/baseline/dashboard.html",
    parti: "/arms/parti/dashboard.html",
  },
  {
    slug: "components",
    name: "Component set",
    group: "Pages",
    blurb: "All four table states on one page.",
    tell:
      "Both arms designed all four states rather than only the ideal one. Compare the wording — a state that says what broke and what to do next versus one that reports that something happened.",
    baseline: "/arms/baseline/components.html",
    parti: "/arms/parti/components.html",
  },
  {
    slug: "state-populated",
    name: "Rack · populated",
    group: "States",
    blurb: "The ideal state — the one most builds implement first and alone.",
    tell:
      "Both use monospace with tabular figures so columns hold still on refresh. Check the row tint: the parti arm carries status in three redundant channels — word, colour, and signed delta — so the board survives grayscale.",
    baseline: "/arms/baseline/state-populated.html",
    parti: "/arms/parti/state-populated.html",
  },
  {
    slug: "state-empty",
    name: "Rack · empty",
    group: "States",
    blurb: "Nothing to show — and why.",
    tell:
      "The clearest single contrast in the set. An empty state either names the filter that caused it and offers to clear it, or it makes the dispatcher guess whether the board is broken.",
    baseline: "/arms/baseline/state-empty.html",
    parti: "/arms/parti/state-empty.html",
  },
  {
    slug: "state-loading",
    name: "Rack · loading",
    group: "States",
    blurb: "First load only — never a background refresh.",
    tell:
      "Shape-matched skeletons in both. The decision that matters is invisible here and stated in the code: a background refresh keeps stale rows on screen, because a dispatcher must not lose the board mid-decision.",
    baseline: "/arms/baseline/state-loading.html",
    parti: "/arms/parti/state-loading.html",
  },
  {
    slug: "state-error",
    name: "Rack · error",
    group: "States",
    blurb: "A feed died. Now what?",
    tell:
      "Look for four things: which feed failed, when the data was last good, what to do instead, and a reference to quote. 'Something went wrong' is not a state, it is an apology.",
    baseline: "/arms/baseline/state-error.html",
    parti: "/arms/parti/state-error.html",
  },
];

/** Measured per-arm figures for the whole build. Regenerate with examples/shared/measure.py. */
export const MEASURED = {
  baseline: {
    score: 59.9,
    band: "Drifting",
    tells: 1,
    motionRules: 2,
    lintP0: 0,
    shadows: 8,
    hex: 97,
    tokenSpec: false,
    designMd: false,
    dimensions: {
      color_discipline: 12.3,
      type_system: 10.4,
      spatial_rhythm: 2.6,
      tokenization: 12.1,
      motion_craft: 10.5,
      distinctiveness: 12.0,
    },
  },
  parti: {
    score: 80.6,
    band: "Coherent",
    tells: 0,
    motionRules: 0,
    lintP0: 0,
    shadows: 0,
    hex: 0,
    tokenSpec: true,
    designMd: true,
    dimensions: {
      color_discipline: 15.4,
      type_system: 12.4,
      spatial_rhythm: 11.8,
      tokenization: 15.0,
      motion_craft: 11.0,
      distinctiveness: 15.0,
    },
  },
} as const;

export const DIMENSION_MAX = {
  color_discipline: 20,
  type_system: 20,
  spatial_rhythm: 15,
  tokenization: 15,
  motion_craft: 15,
  distinctiveness: 15,
} as const;

export const DIMENSION_LABEL = {
  color_discipline: "Color discipline",
  type_system: "Type system",
  spatial_rhythm: "Spatial rhythm",
  tokenization: "Tokenization",
  motion_craft: "Motion craft",
  distinctiveness: "Distinctiveness",
} as const;

export function pairBySlug(slug: string) {
  return PAIRS.find((p) => p.slug === slug);
}
