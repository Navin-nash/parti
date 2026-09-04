"use client";

import { useState } from "react";
import { EXAMPLES } from "@/data/examples";
import { entry } from "@/lib/registry";
import { ComparisonViewer } from "@/components/comparison/comparison-viewer";
import { ProvenanceBadge } from "@/components/specimen/arm-badge";
import { cn } from "@/lib/utils";

/**
 * The full-page playground.
 *
 * Every example in one instrument, switched by a pill rail rather than a
 * route change - the reader stays inside one comparison session while moving
 * between subjects, which is closer to how someone actually evaluates five
 * benchmarks than five separate page loads would be.
 */
export function ShowcasePlayground() {
  const [slug, setSlug] = useState(EXAMPLES[0].slug);
  const example = EXAMPLES.find((e) => e.slug === slug)!;
  const b = entry(example.baseline.componentKey);
  const p = entry(example.parti.componentKey);

  return (
    <div className="flex min-h-[calc(100dvh-4rem)] flex-col">
      <div className="border-b border-rule/70 bg-plate-2">
        <div className="mx-auto max-w-[1400px] px-4 py-3 sm:px-6">
          <div
            role="tablist"
            aria-label="Example"
            className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1"
          >
            {EXAMPLES.map((e) => {
              const on = e.slug === slug;
              return (
                <button
                  key={e.slug}
                  role="tab"
                  type="button"
                  aria-selected={on}
                  onClick={() => setSlug(e.slug)}
                  className={cn(
                    "shrink-0 whitespace-nowrap rounded-full px-3.5 py-2 text-[0.8125rem] font-medium transition-colors duration-(--d-fast) ease-(--ease-specimen)",
                    on ? "bg-plate text-ink shadow-sm" : "text-ink-muted hover:text-ink",
                  )}
                >
                  {e.title}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex-1 bg-plate-2 p-4 sm:p-6">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <h1 className="text-[1.125rem] text-ink">{example.title}</h1>
            <ProvenanceBadge provenance={example.provenance} />
            <p className="ml-auto max-w-[42ch] text-right text-[0.8125rem] text-ink-muted">
              {example.tell}
            </p>
          </div>
          <ComparisonViewer
            key={slug}
            title={example.title}
            baseline={b.render()}
            parti={p.render()}
            bleed
          />
        </div>
      </div>
    </div>
  );
}
