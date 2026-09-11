import { Hero } from "@/components/proof/hero";
import { SubjectsFlip } from "@/components/proof/subjects-flip";
import { RuleKinetic } from "@/components/proof/rule-kinetic";
import { Section } from "@/components/proof/section";
import { Plate } from "@/components/proof/plate";
import { Reveal } from "@/components/proof/reveal";
import { Button } from "@/components/proof/button";
import { InstallCommand } from "@/components/site/install-command";
import { FolderGallery } from "@/components/proof/folder-gallery";
import { SHOWCASES } from "@/data/showcases";
import { PROCESS } from "@/data/process";
import { ArrowRight } from "@/lib/icons";

const CONVERGENCE = [
  "Warm-cream background, serif display, terracotta accent",
  "Bento grid of glass cards over a gradient mesh",
  "Everything fading up twenty pixels on scroll",
  "Inter, or Space Grotesk as the 'safe' pick",
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
            <p className="mt-4 max-w-[58ch] text-[0.9375rem] leading-relaxed text-ink-muted">
              Ask any capable model for an interface with no further constraint
              and you get one of a handful of looks, regardless of subject. They
              are not bad looks. They are{" "}
              <span className="text-ink">unchosen</span> looks, and they arrive
              because nothing in the process required a decision.
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
          <p className="mt-4 max-w-[62ch] text-[1.0625rem] leading-[1.6] text-ink-muted">
            Three directions differing only in palette are one direction. Each
            pair has to differ on at least two of the six axes, or the
            exploration was theatre.
          </p>
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
            The full method
          </Button>
        </div>
      </Section>

      {/* The output, five real directions. */}
      <section className="border-t border-rule bg-paper">
        <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <Reveal>
            <h2 className="display max-w-[20ch] text-[clamp(1.75rem,3.5vw,2.5rem)] text-ink">
              Five briefs, five real interfaces.
            </h2>
            <p className="mt-4 max-w-[60ch] text-[1.0625rem] leading-[1.6] text-ink-muted">
              Not screenshots standing in for the work. Open the folder, then
              open one - it runs live, scroll and all.
            </p>
          </Reveal>

          <Reveal className="mt-10">
            <FolderGallery items={SHOWCASES} folderName="Gallery.showcase" />
          </Reveal>

          <div className="mt-4">
            <Button href="/gallery" icon={<ArrowRight className="size-3.5" />}>
              See all five
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
            <p className="max-w-[58ch] text-[0.9375rem] leading-relaxed text-ink-muted">
              The skill ships scripts that audit a codebase, score six
              dimensions, verify contrast, and lint shipped code against its own
              token spec. Those numbers are real and reproducible. They are also
              not a design-quality score, and this site will not present them as
              one.
            </p>
          </Reveal>

          <Reveal delay={0.06}>
            <Plate label="Standing caveats" recessed bodyClassName="divide-y divide-rule p-0">
              {[
                [
                  "A clean lint run is not a good design.",
                  "It means nothing on the known list is wrong. Hierarchy, signature, content fit, copy and concept are judged, not measured.",
                ],
                [
                  "The gallery is finished work, not a pitch deck.",
                  "Every entry ships as a real, responsive page. Open one and scroll it - nothing in it is staged for a screenshot.",
                ],
                [
                  "The process is not free.",
                  "Three real directions, rendered, is more work than one. The claim is that the work buys something nameable, not that it is costless.",
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

      {/* Closing: the kinetic rule, then the CTA. */}
      <RuleKinetic />

      <section className="border-t border-rule bg-plate-2">
        <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <Reveal>
              <p className="display text-[clamp(1.875rem,5vw,3rem)] leading-[1.12] text-ink">
                Stop asking AI to make it pretty.
                <br />
                <span className="text-ink-muted">
                  Give it something worth designing.
                </span>
              </p>
            </Reveal>
            <Reveal delay={0.06} className="flex flex-col gap-5">
              <div className="flex flex-wrap gap-3">
                <Button href="/gallery" size="lg" icon={<ArrowRight className="size-3.5" />}>
                  See the gallery
                </Button>
                <Button href="/method" variant="outline" size="lg">
                  Read the method
                </Button>
              </div>
              <InstallCommand hint="Requires Claude Code. No build step, no dependencies." />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
