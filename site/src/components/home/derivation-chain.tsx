import { Plate } from "@/components/specimen/plate";

/**
 * The derivation chain.
 *
 * Nine links in one continuous list: this is one derivation, and any row
 * that cannot point at the row above it is decoration.
 *
 * The right column is not a label - it is what that link would have been if
 * the step had been skipped. That is the whole argument in the shape of a
 * table.
 */
const CHAIN: { step: string; here: string; skipped: string }[] = [
  { step: "Subject", here: "An agent runtime", skipped: "“a SaaS product”" },
  { step: "Audience", here: "Engineers who got paged", skipped: "“developers”" },
  { step: "Constraints", here: "Dense, sceptical, evidentiary", skipped: "not derived" },
  { step: "Information", here: "Spans, retries, commits", skipped: "features and benefits" },
  { step: "Material", here: "The event log", skipped: "a component library" },
  { step: "Direction", here: "Append-Only", skipped: "“modern and clean”" },
  { step: "Tokens", here: "Binding, emitted first", skipped: "chosen while building" },
  { step: "Components", here: "Constructed", skipped: "library defaults, untouched" },
  { step: "Verified build", here: "Linted against its own spec", skipped: "looks right" },
];

export function DerivationChain() {
  return (
    <Plate label="One derivation, nine links" recessed bodyClassName="divide-y divide-rule/50">
      {CHAIN.map((c) => (
        <div key={c.step} className="px-4 py-3">
          <span className="flex flex-wrap items-baseline gap-x-2">
            <span className="text-[0.75rem] font-medium uppercase tracking-[0.06em] text-ink-dim">
              {c.step}
            </span>
            <span className="text-[0.875rem] text-ink">{c.here}</span>
          </span>
          <span className="mt-0.5 block text-[0.75rem] leading-snug text-ink-dim">
            <span className="font-medium text-mark">without the step:</span> {c.skipped}
          </span>
        </div>
      ))}
    </Plate>
  );
}
