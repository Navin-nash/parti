import Link from "next/link";
import { Hero } from "@/components/proof/hero";
import { SubjectsFlip } from "@/components/proof/subjects-flip";
import { RuleKinetic } from "@/components/proof/rule-kinetic";
import { Section } from "@/components/proof/section";
import { Plate } from "@/components/proof/plate";
import { Reveal } from "@/components/proof/reveal";
import { PullQuote } from "@/components/proof/pull-quote";
import { Button } from "@/components/proof/button";
import { ShowcaseStill } from "@/components/proof/showcase-still";
import { SHOWCASES } from "@/data/showcases";
import { PROCESS } from "@/data/process";
import { ArrowRight } from "@/lib/icons";

/** The four looks that arrive when nothing in the process required a choice. */
const CONVERGENCE = [
  "Warm-cream ground, serif display, terracotta accent",
  "Bento grid of glass cards over a gradient mesh",
  "Everything fading up twenty pixels on scroll",
  "Inter — or Space Grotesk, as the “safe” pick",
];

export default function Home() {
  return (
    <>
      <Hero />

      <SubjectsFlip />

      {/* The problem the skill exists for. */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,30rem)_minmax(0,1fr)] lg:gap-16">
          <Reveal>
            <h2 className="display max-w-[18ch] text-[clamp(1.75rem,3.5vw,2.375rem)] text-ink">
              Everything converges on the same few decisions.
            </h2>
            <p className="mt-4 max-w-[58ch] text-pretty text-[0.9375rem] leading-relaxed text-ink-muted">
              Ask any capable model for an interface and add no further
              constraint, and you get one of a handful of looks whatever the
              subject. They are not bad looks. They are{" "}
              <span className="text-ink">unchosen</span> ones, and they arrive
              because nothing in the process ever required a choice.
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <ul className="grid gap-px border border-rule bg-rule">
              {CONVERGENCE.map((c) => (
                <li key={c} className="bg-plate px-4 py-3 text-[0.875rem] text-ink-muted">
                  {c}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      {/* How it works. */}
      <Section>
        <Reveal>
          <h2 className="display max-w-[22ch] text-[clamp(1.75rem,3.5vw,2.375rem)] text-ink">
            Seven stages, and one of them gets skipped.
          </h2>
          <p className="mt-4 max-w-[62ch] text-pretty text-[1.0625rem] leading-[1.6] text-ink-muted">
            Stage three is the one that quietly goes missing, because skipping
            it is invisible in the output. Every pair of directions has to
            differ on at least two of six axes &mdash; in grayscale, not just
            in palette.
          </p>
        </Reveal>

        <Reveal delay={0.06} className="mt-8">
          <PullQuote source="">
            Three directions that differ only in palette are one direction
            wearing three names.
          </PullQuote>
        </Reveal>

        <ol className="mt-10 border-t border-rule">
          {PROCESS.map((stage, i) => (
            <Reveal
              as="li"
              key={stage.index}
              delay={i * 0.04}
              className={`grid gap-x-4 gap-y-1 border-b border-rule py-4 sm:grid-cols-[3rem_minmax(0,1fr)] ${
                stage.pivotal ? "border-l-2 border-l-mark-text pl-4 sm:pl-3" : ""
              }`}
            >
              <span className="font-mono text-[0.8125rem] text-ink-dim tabular">
                {stage.index}
              </span>
              <div className="min-w-0">
                <h3 className="text-[1.0625rem] font-medium text-ink">
                  {stage.title}
                  {stage.pivotal ? (
                    <span className="ml-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-mark-text">
                      the gate
                    </span>
                  ) : null}
                </h3>
                <p className="mt-0.5 max-w-[64ch] text-[0.875rem] leading-relaxed text-ink-muted">
                  {stage.short}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>

        <div className="mt-6">
          <Button href="/method" variant="ghost" size="sm" icon={<ArrowRight className="size-3.5" />}>
            Read all seven stages
          </Button>
        </div>
      </Section>

      {/* The output, five real directions. */}
      <section className="border-t border-rule bg-paper">
        <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <Reveal>
            <h2 className="display max-w-[20ch] text-[clamp(1.75rem,3.5vw,2.5rem)] text-ink">
              Five briefs. Five interfaces that could not swap places.
            </h2>
            <p className="mt-4 max-w-[60ch] text-pretty text-[1.0625rem] leading-[1.6] text-ink-muted">
              Each preview below opens onto the real, running page &mdash;
              scroll and motion included, not just the still shown here.
            </p>
          </Reveal>

          <ul className="mt-12 flex flex-col gap-12">
            {SHOWCASES.map((s, i) => (
              <Reveal as="li" key={s.slug} delay={i * 0.04}>
                <Link
                  href={`/gallery/${s.slug}`}
                  className="group grid items-center gap-x-10 gap-y-5 sm:grid-cols-[minmax(0,17rem)_minmax(0,1fr)]"
                >
                  <ShowcaseStill
                    slug={s.slug}
                    title={s.title}
                    className="transition-colors duration-(--d-fast) group-hover:border-rule-strong"
                  />
                  <div className="min-w-0">
                    <span className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-ink-dim">
                      {s.category}
                    </span>
                    <h3 className="mt-1.5 flex items-center gap-2 text-[1.3125rem] font-medium text-ink transition-colors duration-(--d-fast) group-hover:text-mark-text">
                      {s.title}
                      <ArrowRight className="size-4 shrink-0 text-ink-dim transition-transform duration-(--d-base) ease-(--ease-out) group-hover:translate-x-0.5 group-hover:text-mark-text" />
                    </h3>
                    <p className="mt-2 max-w-[48ch] text-pretty text-[0.9375rem] leading-relaxed text-ink-muted">
                      {s.tagline}
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </ul>

          <div className="mt-10">
            <Button
              href="/gallery"
              variant="ghost"
              size="sm"
              icon={<ArrowRight className="size-3.5" />}
            >
              See the full gallery
            </Button>
          </div>
        </div>
      </section>

      {/* Honesty. */}
      <Section>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,30rem)_minmax(0,1fr)] lg:gap-16">
          <Reveal>
            <h2 className="display mb-5 max-w-[18ch] text-[clamp(1.75rem,3.5vw,2.375rem)] text-ink">
              The scripts measure half of it. At most.
            </h2>
            <p className="max-w-[58ch] text-pretty text-[0.9375rem] leading-relaxed text-ink-muted">
              The skill ships scripts that audit a codebase, score six
              dimensions, verify contrast, and lint shipped code against its own
              token spec. Those numbers are real and reproducible. They are not
              a design-quality score, and nothing here will present them as one.
            </p>
          </Reveal>

          <Reveal delay={0.06}>
            <Plate label="Standing caveats" recessed bodyClassName="divide-y divide-rule p-0">
              {[
                [
                  "A clean lint run is not a good design.",
                  "It means nothing on the known list is wrong. Hierarchy, signature, content fit, copy and concept are judged by a person, not measured by a script.",
                ],
                [
                  "The gallery is finished work, not a pitch deck.",
                  "Every entry ships as a real, responsive page. Open one and scroll it — nothing in it is staged for a screenshot.",
                ],
                [
                  "The process is not free.",
                  "Three rendered directions cost more than one. The claim is that the extra work buys something you can name, not that it is free.",
                ],
              ].map(([h, b]) => (
                <div key={h} className="p-4">
                  <h3 className="mb-1.5 text-[0.9375rem] text-ink">{h}</h3>
                  <p className="text-[0.875rem] leading-relaxed text-ink-muted">{b}</p>
                </div>
              ))}
            </Plate>
          </Reveal>
        </div>
      </Section>

      {/* Closing: the kinetic rule. */}
      <RuleKinetic />
    </>
  );
}
