"use client";

import { useState } from "react";
import { PROCESS } from "@/data/process";
import { cn } from "@/lib/utils";

/**
 * The vertical timeline. A rule runs down the left edge with a dot at every
 * stage. Each stage opens to its full field list on click; only one is open
 * at a time, so the reader compares stages rather than losing position in
 * nine open panels.
 */
export function MethodologyTimeline() {
  const [open, setOpen] = useState(PROCESS[2].index);

  return (
    <ol className="relative">
      <span
        aria-hidden
        className="absolute bottom-0 left-[7px] top-2 w-px bg-rule"
      />
      {PROCESS.map((s) => {
        const isOpen = open === s.index;
        return (
          <li key={s.index} className="relative pl-8">
            <span
              aria-hidden
              className={cn(
                "absolute left-0 top-2 size-3.5 rounded-full border-2 transition-colors duration-(--d-fast)",
                isOpen ? "border-mark bg-mark" : "border-rule-strong bg-plate",
              )}
            />

            <button
              type="button"
              onClick={() => setOpen(isOpen ? "" : s.index)}
              aria-expanded={isOpen}
              aria-controls={`stage-${s.index}`}
              className="mb-8 flex w-full flex-col items-start gap-1 pb-2 text-left sm:flex-row sm:items-baseline sm:gap-4"
            >
              <h2 className="text-[1.125rem] text-ink">{s.title}</h2>
              {s.pivotal ? (
                <span className="rounded-full bg-mark-tint px-2 py-0.5 text-[0.6875rem] font-medium text-mark">
                  the gate
                </span>
              ) : null}
              <span className="text-[0.875rem] text-ink-muted sm:ml-auto sm:text-right">
                {s.short}
              </span>
            </button>

            <div
              id={`stage-${s.index}`}
              className={cn(
                "grid transition-[grid-template-rows] duration-(--d-slow) ease-(--ease-specimen) motion-reduce:transition-none",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <div className="mb-8 grid gap-4 rounded-2xl bg-plate-2 p-4 sm:grid-cols-[10rem_minmax(0,1fr)]">
                  <ul>
                    {s.fields.map((f) => (
                      <li
                        key={f}
                        className="mb-2 text-[0.75rem] font-medium uppercase tracking-[0.06em] text-ink-dim last:mb-0"
                      >
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div>
                    <p className="mb-4 max-w-[68ch] text-[0.875rem] leading-relaxed text-ink-muted">
                      {s.detail}
                    </p>
                    <p className="rounded-xl bg-plate p-3 text-[0.8125rem] leading-relaxed text-ink-dim">
                      <span className="font-medium text-mark">If skipped:</span> {s.skipped}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
