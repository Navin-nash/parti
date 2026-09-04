import { ComparisonViewer } from "@/components/comparison/comparison-viewer";
import { entry } from "@/lib/registry";
import { EXAMPLES } from "@/data/examples";
import { ProvenanceBadge } from "@/components/specimen/arm-badge";
import Link from "next/link";
import { ArrowRight } from "@/lib/icons";

const EX = EXAMPLES.find((e) => e.slug === "finance-research-platform")!;

/**
 * The landing page's own comparison, using the finance pair because it is the
 * one where the difference is a claim about the user rather than a claim about
 * taste - the baseline colours every price move, the parti arm colours only
 * the unresolved question.
 */
export function HomeComparison() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-baseline gap-3">
        <span className="text-[0.9375rem] font-medium text-ink">{EX.title}</span>
        <ProvenanceBadge provenance={EX.provenance} className="ml-auto" />
      </div>

      <ComparisonViewer
        title={EX.title}
        baseline={entry(EX.baseline.componentKey).render()}
        parti={entry(EX.parti.componentKey).render()}
        bleed
      />

      <div className="flex flex-wrap items-center gap-3 rounded-xl bg-plate-2 p-4">
        <p className="text-[0.875rem] leading-relaxed text-ink-muted">
          <span className="mr-2 font-medium text-ink">Look here first —</span>
          {EX.tell}
        </p>
        <Link
          href={`/examples/${EX.slug}`}
          className="group ml-auto inline-flex shrink-0 items-center gap-1.5 text-[0.8125rem] font-medium text-ink transition-colors duration-(--d-fast) hover:text-mark"
        >
          Open the full comparison
          <ArrowRight
            className="size-3.5 transition-transform duration-(--d-base) ease-(--ease-specimen) group-hover:translate-x-0.5 motion-reduce:transition-none"
            aria-hidden
          />
        </Link>
      </div>
    </div>
  );
}
