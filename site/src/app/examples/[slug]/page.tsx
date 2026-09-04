import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Section } from "@/components/specimen/section";
import { Plate } from "@/components/specimen/plate";
import { Display } from "@/components/specimen/prose";
import { ArmBadge, ProvenanceBadge } from "@/components/specimen/arm-badge";
import { TokenInspector } from "@/components/tokens/token-inspector";
import { PairWorkbench } from "@/components/comparison/pair-workbench";
import { AXIS_LABEL, type DirectionAxes } from "@/lib/schema";
import { EXAMPLES, exampleBySlug, exampleSlugs } from "@/data/examples";
import { ArrowLeft, ArrowRight } from "@/lib/icons";

export function generateStaticParams() {
  return exampleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/examples/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const e = exampleBySlug(slug);
  if (!e) return {};
  return { title: e.title, description: e.brief };
}

export default async function ExamplePage({ params }: PageProps<"/examples/[slug]">) {
  const { slug } = await params;
  const example = exampleBySlug(slug);
  if (!example) notFound();

  const i = EXAMPLES.findIndex((e) => e.slug === example.slug);
  const prev = EXAMPLES[(i - 1 + EXAMPLES.length) % EXAMPLES.length];
  const next = EXAMPLES[(i + 1) % EXAMPLES.length];

  return (
    <>
      <Section eyebrow={example.category}>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-12">
          <div>
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <ProvenanceBadge provenance={example.provenance} />
              <span className="rounded-full bg-plate-2 px-2.5 py-1 text-[0.75rem] font-medium text-mark">
                {example.parti.direction.name}
              </span>
            </div>

            <Display level={1} className="mb-4 max-w-[26ch]">
              {example.title}
            </Display>
            <p className="mb-6 max-w-[62ch] text-[1.0625rem] leading-relaxed text-ink-muted">
              {example.brief}
            </p>

            <div className="flex flex-wrap gap-1.5">
              {example.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-plate-2 px-2.5 py-1 text-[0.75rem] text-ink-muted"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-mark/30 bg-mark-tint p-5">
            <span className="mb-2 inline-block rounded-full bg-mark px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-on-mark">
              Look here first
            </span>
            <p className="text-[0.9375rem] leading-relaxed text-ink">{example.tell}</p>
          </div>
        </div>
      </Section>

      <Section eyebrow="Workbench" bleed>
        <div className="px-4 sm:px-6 lg:px-8">
          <PairWorkbench
            title={example.title}
            baselineKey={example.baseline.componentKey}
            partiKey={example.parti.componentKey}
            prompt={example.sharedBrief}
            promptNote={`Both arms received this brief verbatim. The baseline agent was denied the Parti skill; the parti agent was required to invoke and follow it. Neither run was told a comparison was happening.`}
            baselineRationale={example.baseline.rationale}
            partiRationale={example.parti.rationale}
            matrix={example.matrix}
            findings={example.parti.findings}
            baselineStates={example.parti.states.map((s) => ({
              ...s,
              implemented: s.name === "default" || s.name === "hover",
            }))}
            partiStates={example.parti.states}
          />
        </div>
      </Section>

      <Section eyebrow="The derived direction">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-12">
          <div>
            <Display level={2} className="mb-2 max-w-[20ch]">
              {example.parti.direction.name}
            </Display>
            <p className="mb-6 max-w-[62ch] text-[0.9375rem] leading-relaxed text-ink-muted">
              {example.parti.direction.thesis}
            </p>

            <dl className="mb-6 grid gap-3 sm:grid-cols-2">
              <div>
                <dt className="plate-label mb-1">Nearest movement</dt>
                <dd className="text-[0.875rem] text-ink">
                  {example.parti.direction.nearestMovement}
                </dd>
              </div>
              <div>
                <dt className="plate-label mb-1">Departure</dt>
                <dd className="text-[0.875rem] leading-snug text-ink-muted">
                  {example.parti.direction.departure}
                </dd>
              </div>
            </dl>

            <p className="plate-label mb-2 text-mark">Signature</p>
            <p className="mb-6 max-w-[62ch] rounded-xl bg-plate-2 p-4 text-[0.875rem] leading-relaxed text-ink-muted">
              {example.parti.direction.signature}
            </p>

            <p className="plate-label mb-2">What it gives up</p>
            <p className="max-w-[62ch] text-[0.875rem] leading-relaxed text-ink-muted">
              {example.parti.direction.cost}
            </p>
          </div>

          <Plate label="Position on six axes" recessed bodyClassName="divide-y divide-rule/60">
            {(Object.keys(AXIS_LABEL) as (keyof DirectionAxes)[]).map((k) => (
              <div key={k} className="p-3">
                <span className="plate-label mb-1 block">{AXIS_LABEL[k]}</span>
                <span className="text-[0.8125rem] text-ink">
                  {example.parti.direction.axes[k]}
                </span>
              </div>
            ))}
          </Plate>
        </div>
      </Section>

      <Section eyebrow="Design tokens">
        <div className="mb-6 flex items-baseline gap-3">
          <Display level={2} className="max-w-[20ch]">
            The binding spec
          </Display>
          <ArmBadge arm="parti" variant="plate" />
        </div>
        <TokenInspector tokens={example.parti.tokens} />
      </Section>

      <nav
        aria-label="More examples"
        className="mx-auto grid max-w-[1400px] grid-cols-2 gap-4 px-4 py-10 sm:px-6 lg:px-8"
      >
        <Link
          href={`/examples/${prev.slug}`}
          className="group flex items-center gap-3 rounded-2xl border border-rule p-5 transition-colors duration-(--d-fast) hover:bg-plate-2"
        >
          <ArrowLeft className="size-4 shrink-0 text-ink-dim transition-transform duration-(--d-base) ease-(--ease-specimen) group-hover:-translate-x-0.5" aria-hidden />
          <span className="min-w-0">
            <span className="block text-[0.75rem] text-ink-dim">Previous</span>
            <span className="block truncate text-[0.9375rem] text-ink">{prev.title}</span>
          </span>
        </Link>
        <Link
          href={`/examples/${next.slug}`}
          className="group flex items-center justify-end gap-3 rounded-2xl border border-rule p-5 text-right transition-colors duration-(--d-fast) hover:bg-plate-2"
        >
          <span className="min-w-0">
            <span className="block text-[0.75rem] text-ink-dim">Next</span>
            <span className="block truncate text-[0.9375rem] text-ink">{next.title}</span>
          </span>
          <ArrowRight className="size-4 shrink-0 text-ink-dim transition-transform duration-(--d-base) ease-(--ease-specimen) group-hover:translate-x-0.5" aria-hidden />
        </Link>
      </nav>
    </>
  );
}
