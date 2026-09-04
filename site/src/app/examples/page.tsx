import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/specimen/section";
import { Display, Lede } from "@/components/specimen/prose";
import { ArmBadge, ProvenanceBadge } from "@/components/specimen/arm-badge";
import { EXAMPLES } from "@/data/examples";
import { ArrowRight } from "@/lib/icons";

export const metadata: Metadata = {
  title: "Examples",
  description: "Five briefs, each run twice - once with the Parti skill loaded, once without.",
};

export default function ExamplesPage() {
  return (
    <Section eyebrow="The benchmark">
      <Display level={1} className="mb-4 max-w-[24ch]">
        Five briefs. Each one run twice.
      </Display>
      <Lede className="mb-12">
        A finance workspace, a developer-tool landing page, an analytics
        dashboard, API documentation, and a product page. Every pair shares one
        brief, given identically to both arms.
      </Lede>

      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {EXAMPLES.map((e) => (
          <li key={e.slug}>
            <Link
              href={`/examples/${e.slug}`}
              className="group flex h-full flex-col rounded-2xl border border-rule bg-plate p-5 transition-colors duration-(--d-fast) ease-(--ease-specimen) hover:bg-plate/70 sm:p-6"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <span className="text-[0.8125rem] font-medium text-ink-dim">
                  {e.category}
                </span>
                <ProvenanceBadge provenance={e.provenance} />
              </div>

              <h2 className="mb-2 text-[1.375rem] leading-tight text-ink">
                {e.title}
              </h2>
              <p className="mb-5 max-w-[52ch] text-[0.9375rem] leading-relaxed text-ink-muted">
                {e.brief}
              </p>

              <div className="mb-5 flex flex-wrap gap-1.5">
                <ArmBadge arm="baseline" variant="plate" />
                <ArmBadge arm="parti" variant="plate" />
              </div>

              <p className="mb-5 rounded-xl bg-plate-2 p-3 text-[0.8125rem] leading-relaxed text-ink-dim">
                {e.tell}
              </p>

              <span className="mt-auto inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-ink transition-colors duration-(--d-fast) group-hover:text-mark">
                Open comparison
                <ArrowRight
                  className="size-3.5 transition-transform duration-(--d-base) ease-(--ease-specimen) group-hover:translate-x-0.5 motion-reduce:transition-none"
                  aria-hidden
                />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
