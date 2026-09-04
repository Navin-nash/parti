"use client";

import { useState } from "react";
import { Plus } from "@/lib/icons";
import type { Finding } from "@/lib/schema";
import { cn } from "@/lib/utils";

/**
 * "Why this is different". Four fields in a fixed order: what was found, why
 * a capable agent lands there, what the parti arm decided instead, and what
 * that bought. The order matters - stating the decision before the cause
 * reads as a preference rather than a diagnosis.
 */
export function FindingsPanel({ findings }: { findings: Finding[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <ul className="space-y-2">
      {findings.map((f, i) => {
        const isOpen = open === i;
        return (
          <li key={f.finding} className="overflow-hidden rounded-2xl bg-plate-2">
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                aria-controls={`finding-${i}`}
                className="group flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors duration-(--d-fast) hover:bg-plate"
              >
                <span className="flex-1 text-[0.9375rem] text-ink">{f.finding}</span>
                <span
                  className={cn(
                    "shrink-0 text-ink-dim transition-transform duration-(--d-base) ease-(--ease-specimen) motion-reduce:transition-none",
                    isOpen && "rotate-45",
                  )}
                >
                  <Plus className="size-4" aria-hidden />
                </span>
              </button>
            </h3>
            <div
              id={`finding-${i}`}
              className={cn(
                "grid transition-[grid-template-rows] duration-(--d-base) ease-(--ease-specimen) motion-reduce:transition-none",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <dl className="grid gap-2 px-4 pb-4 sm:grid-cols-3">
                  <Cell term="Why it happens" desc={f.whyItHappens} />
                  <Cell term="Parti decision" desc={f.partiDecision} mark />
                  <Cell term="Result" desc={f.result} />
                </dl>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function Cell({
  term, desc, mark = false,
}: { term: string; desc: string; mark?: boolean }) {
  return (
    <div className="rounded-xl bg-plate p-3.5">
      <dt className={cn("mb-1.5 text-[0.75rem] font-medium", mark ? "text-mark" : "text-ink-dim")}>{term}</dt>
      <dd className="text-[0.8125rem] leading-relaxed text-ink-muted">{desc}</dd>
    </div>
  );
}
