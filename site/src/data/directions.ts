import type { DirectionAxes } from "@/lib/schema";

/**
 * The directions the parti arms actually derived, transcribed from the header
 * comment at the top of each arm file. They are recorded here so the site can
 * print them; the file is the source of truth, and if the two disagree the
 * file wins.
 */
export interface GroupDirection {
  name: string;
  subject: string;
  thesis: string;
  axes: DirectionAxes;
  signature: string;
  givesUp: string;
  /** Where the direction is implemented. */
  files: string[];
}

export const DIRECTIONS: Record<string, GroupDirection> = {
  "append-only": {
    name: "Append-Only",
    subject: "Cadence - a runtime for production AI agents",
    thesis:
      "This audience already lived the failure the product fixes: a deploy landed mid-run and left a customer half-refunded. They will not be persuaded by a claim, only by the artifact - so the marketing page is not a page about a runtime, it is a run journal.",
    axes: {
      density: "dense",
      structure: "grid-strict",
      typeVoice: "mono-technical",
      chroma: "achromatic-with-material",
      motionPosture: "responsive-only",
      depth: "flat",
    },
    signature:
      "The sequence gutter. Every section opens with the same left rail - record number, offset from t0, status glyph - so scrolling the page reads as scrolling one continuous run. Its fullest form is the hero's span waterfall with a replay scrubber: the product demonstrated rather than described.",
    givesUp:
      "Warmth, and any chance of appealing to a non-technical buyer. There is no hero image and no emotional register beyond competence.",
    files: ["src/arms/components/marketing/parti.tsx"],
  },

  "dispatch-ledger": {
    name: "Dispatch Ledger",
    subject: "Relay - message delivery infrastructure",
    thesis:
      "An engineer mid-integration is not reading a page, they are scanning a log. Relay's own artifacts are ledger lines - timestamp, key, value, status - so the interface is set as the ledger itself, and a form field is simply a record whose value has not been written yet.",
    axes: {
      density: "dense",
      structure: "grid-strict",
      typeVoice: "mono-technical",
      chroma: "monochrome+accent",
      motionPosture: "responsive-only",
      depth: "flat",
    },
    signature:
      "The gutter rail. Every record - field, option, row, error code - carries a 3px left rail whose pattern as well as its colour states the record's condition: hollow idle, solid current, marching dash in flight, static dash inactive. The pattern carries state without hue, so the signature doubles as the grayscale-safe state channel.",
    givesUp:
      "Warmth, imagery, cards, and comfortable long-form reading. A conceptual overview page would have to be built differently.",
    files: [
      "src/arms/components/forms/parti.tsx",
      "src/arms/components/content/parti.tsx",
    ],
  },

  marginalia: {
    name: "Marginalia",
    subject: "Ledgerline - a research workspace for independent investors",
    thesis:
      "A long-term investor's real artifact is a printed filing with their own marks in the margin. The workspace should be that document, and its job is re-entry after two weeks away - not monitoring.",
    axes: {
      density: "dense",
      structure: "grid-strict",
      typeVoice: "mono-technical",
      chroma: "monochrome+accent",
      motionPosture: "responsive-only",
      depth: "flat",
    },
    signature:
      "The margin rail. A 56px ruled margin down the left of every block carrying date stamps, footnote numerals tying thesis claims to filings, and a drawn redline for anything unresolved. On mount the rules draw top-down like a pen moving down a page - the one choreographed moment, encoding what changed since you left.",
    givesUp:
      "The at-a-glance emotional read of profit and loss, deliberately. Screenshot appeal. Any hospitality toward a novice.",
    files: ["src/arms/finance-research-platform/parti.tsx"],
  },
};

export function direction(key: string): GroupDirection {
  const d = DIRECTIONS[key];
  if (!d) throw new Error(`Unknown direction "${key}"`);
  return d;
}
