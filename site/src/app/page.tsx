import Link from "next/link";
import { Section } from "@/components/specimen/section";
import { Plate } from "@/components/specimen/plate";
import { Display, Lede } from "@/components/specimen/prose";
import { DerivationHero } from "@/components/home/derivation-hero";
import { ConvergenceGrid } from "@/components/home/convergence-grid";
import { SlopWall } from "@/components/home/slop-wall";
import { DerivationChain } from "@/components/home/derivation-chain";
import { CommandBoard } from "@/components/home/command-board";
import { ProcessRail } from "@/components/home/process-rail";
import { HomeComparison } from "@/components/home/home-comparison";
import { SquareLink } from "@/components/specimen/square-link";
import { entry } from "@/lib/registry";
import { EXAMPLES } from "@/data/examples";
import { ArrowRight } from "@/lib/icons";

const CADENCE = EXAMPLES.find((e) => e.slug === "agent-platform-landing")!;

export default function Home() {
  const baseline = entry("example/agent-platform-landing/baseline");
  const parti = entry("example/agent-platform-landing/parti");

  return (
    <>
      {/* ------------------------------------------------------------ hero */}
      <section aria-labelledby="hero-title">
        <div className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <p className="plate-label mb-6">A Claude Code design skill</p>

          <h1 id="hero-title">
            <span className="display block text-[clamp(2.5rem,7vw,4.75rem)] text-ink-muted">
              AI can generate
            </span>
            <span className="display block text-[clamp(2.5rem,7vw,4.75rem)] text-ink">
              interfaces. Parti makes
            </span>
            <span className="display block text-[clamp(2.5rem,7vw,4.75rem)] text-ink">
              them take a position.
            </span>
          </h1>

          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,34rem)_minmax(0,1fr)] lg:gap-12">
            <Lede>
              Generated design converges - not from lack of ability, but
              because everything trained on the same portfolio sites and the
              same component libraries. Parti exists to force a decision
              where a default would otherwise fill the gap.
            </Lede>

            <div className="flex flex-wrap items-start gap-3 lg:justify-end">
              <SquareLink href="/examples" variant="mark">
                Explore the examples
              </SquareLink>
              <SquareLink href="/methodology">See how it works</SquareLink>
            </div>
          </div>

          <div className="mt-12">
            <DerivationHero
              baseline={baseline.render()}
              parti={parti.render()}
              axes={CADENCE.parti.direction.axes}
              directionName={CADENCE.parti.direction.name}
              thesis={CADENCE.parti.direction.thesis}
              signature={CADENCE.parti.direction.signature}
              constraints={[
                {
                  label: "Subject",
                  value: "A runtime for production AI agents - durable execution, replayable runs, typed tool boundaries.",
                },
                {
                  label: "Audience",
                  value: "Backend engineers whose agent prototype already broke in production. They read psql output and span waterfalls all day.",
                },
                {
                  label: "Job",
                  value: "Decide whether to adopt a runtime or keep hand-rolling, in one sitting, while skeptical.",
                },
                {
                  label: "Emotional register",
                  value: "Competence. Not excitement - this audience discounts enthusiasm as a sales signal.",
                },
                {
                  label: "Native material",
                  value: "The filed incident postmortem - the document this audience already trusts, with code and log data quoted as labelled exhibits rather than laid out as a dashboard.",
                },
                {
                  label: "Priority order",
                  value: "intuitive > intentional > modern > interactive. Every trade goes that way.",
                },
              ]}
            />
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- problem */}
      <Section eyebrow="The problem" id="problem">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,30rem)_minmax(0,1fr)] lg:gap-16">
          <div>
            <Display level={2} className="mb-5 max-w-[16ch]">
              Everything converges on the same six decisions.
            </Display>
            <Lede className="mb-4">
              Ask any capable model for an interface and you get a warm-cream
              background with a serif display and a terracotta accent, or a
              bento grid of glass cards over a gradient mesh, with everything
              fading up twenty pixels on scroll.
            </Lede>
            <p className="max-w-[62ch] text-[0.9375rem] leading-relaxed text-ink-muted">
              Those are not bad looks. They are{" "}
              <em className="not-italic text-ink">unchosen</em> looks, and they
              arrive regardless of subject. The convergence is not a capability
              failure - it is what happens when nothing in the process requires
              a decision.
            </p>
          </div>

          <ConvergenceGrid />
        </div>
      </Section>

      {/* ------------------------------------------------------- slop wall */}
      <Section eyebrow="Named, not vibes" id="slop">
        <Display level={2} className="mb-4 max-w-[22ch]">
          Eight tells, and what replaces each one.
        </Display>
        <Lede className="mb-8">
          Every tag here and every line under it is quoted from an actual
          finding elsewhere on this site - nothing on this wall was written
          for the wall. Click through to see it in the comparison it came
          from.
        </Lede>
        <SlopWall />
      </Section>

      {/* ------------------------------------------------- see the difference */}
      <Section eyebrow="Same brief, two runs" id="difference">
        <Display level={2} className="mb-4 max-w-[20ch]">
          Both are competent. One has a point of view.
        </Display>
        <Lede className="mb-8">
          The same brief, run twice: once with the skill loaded and once
          denied it. Neither run was told a comparison was happening. Toggle
          between the two arms below.
        </Lede>
        <HomeComparison />
      </Section>

      {/* ---------------------------------------------------------- thesis */}
      <Section eyebrow="The rule that matters most" id="thesis">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-16">
          <div>
            <p className="display text-[clamp(2rem,5.5vw,3.5rem)] leading-[1.1] text-ink">
              Style is derived,
              <br />
              never{" "}
              <span className="relative inline-block">
                selected.
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-[0.18em] h-[3px] rounded-full bg-mark"
                />
              </span>
            </p>
            <p className="mt-6 max-w-[58ch] text-[0.9375rem] leading-relaxed text-ink-muted">
              Choosing &ldquo;let&rsquo;s do glassmorphism&rdquo; and
              reverse-engineering a rationale is exactly how generic design gets
              made. Understand the subject, derive the constraints, find the
              direction the constraints demand - and only then name whatever
              movement it landed near. If a choice cannot be explained by
              pointing at something true about the audience, the content, or the
              job the interface does, it is decoration and it goes.
            </p>

            <dl className="mt-8 grid grid-cols-3 gap-3">
              {[
                ["3", "directions minimum, or nothing was explored"],
                ["6", "axes a direction must actually differ on"],
                ["1", "signature element, spent once"],
              ].map(([n, d]) => (
                <div key={d} className="rounded-2xl border border-rule bg-plate p-4">
                  <dt className="display text-[1.75rem] text-mark">{n}</dt>
                  <dd className="mt-1 text-[0.8125rem] leading-snug text-ink-muted">{d}</dd>
                </div>
              ))}
            </dl>
          </div>

          <DerivationChain />
        </div>
      </Section>

      {/* ------------------------------------------------------------ process */}
      <Section eyebrow="The process" id="process">
        <Display level={2} className="mb-4 max-w-[22ch]">
          Seven stages, and one of them gets skipped.
        </Display>
        <Lede className="mb-10">
          Three directions differing only in palette are one direction. Each
          pair has to differ on at least two of the six axes, or the exploration
          was theatre.
        </Lede>
        <ProcessRail />
      </Section>

      {/* ------------------------------------------------------- capabilities */}
      <Section eyebrow="Capabilities" id="capabilities">
        <div className="mb-10 grid gap-6 lg:grid-cols-[minmax(0,32rem)_minmax(0,1fr)] lg:items-end lg:gap-16">
          <Display level={2} className="max-w-[18ch]">
            Twenty-nine narrow operations, not one big button.
          </Display>
          <Lede className="lg:pb-2">
            Each has a defined input, a defined output, and a cost. A narrow
            complaint gets a narrow pass; a fresh brief gets the full loop; a
            shared inspiration URL gets captured, per element, before anything
            is built.
          </Lede>
        </div>
        <CommandBoard />
        <div className="mt-6">
          <SquareLink href="/capabilities">
            Open the command explorer
          </SquareLink>
        </div>
      </Section>

      {/* -------------------------------------------------------- honesty */}
      <Section eyebrow="What this is not" id="caveats">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,32rem)_minmax(0,1fr)] lg:gap-16">
          <div>
            <Display level={2} className="mb-5 max-w-[18ch]">
              The scripts measure half of it. At most.
            </Display>
            <p className="max-w-[60ch] text-[0.9375rem] leading-relaxed text-ink-muted">
              The skill ships scripts that audit a codebase, score six
              dimensions, verify contrast, and lint shipped code against its own
              token spec. Those numbers are real and they are reproducible. They
              are also not a design-quality score, and this site will not
              present them as one.
            </p>
          </div>

          <Plate label="Standing caveats" recessed bodyClassName="divide-y divide-rule/60">
            {[
              [
                "A clean lint run is not a good design.",
                "It means nothing on the known list is wrong. Hierarchy, signature, content fit, copy and concept are judged, not measured, and they are where most of the quality lives.",
              ],
              [
                "The baseline is not a strawman.",
                "Every baseline arm here was built by a capable agent given the same brief in good faith and denied the skill. Several made calls we would have been happy to ship.",
              ],
              [
                "One blended number would be the wrong output.",
                "The measured and judged halves have different epistemic status. Averaging them hides which is which, so they are never averaged here.",
              ],
            ].map(([h, b]) => (
              <div key={h} className="p-4">
                <h3 className="mb-1.5 text-[0.9375rem] text-ink">{h}</h3>
                <p className="text-[0.875rem] leading-relaxed text-ink-muted">{b}</p>
              </div>
            ))}
          </Plate>
        </div>
      </Section>

      {/* -------------------------------------------------------- final CTA */}
      <section className="bg-plate-2" aria-labelledby="cta-title">
        <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <p id="cta-title" className="display text-[clamp(1.875rem,5vw,3.25rem)] leading-[1.12] text-ink">
              Stop asking AI to make it pretty.
              <br />
              <span className="text-ink-muted">
                Give it something worth designing.
              </span>
            </p>
            <div className="flex flex-wrap gap-3">
              <SquareLink href="/examples" variant="mark" size="lg">
                Explore the benchmark
              </SquareLink>
              <SquareLink href="/about" size="lg">
                Read the philosophy
              </SquareLink>
            </div>
          </div>

          <ul className="mt-14 grid gap-4 sm:grid-cols-3">
            {EXAMPLES.slice(0, 3).map((e) => (
              <li key={e.slug}>
                <Link
                  href={`/examples/${e.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-rule bg-plate p-5 transition-colors duration-(--d-fast) hover:bg-plate/70"
                >
                  <span className="mb-2 text-[0.75rem] font-medium text-mark">{e.category}</span>
                  <span className="mb-1.5 text-[1.0625rem] text-ink">{e.title}</span>
                  <span className="mb-4 text-[0.875rem] leading-snug text-ink-muted">
                    {e.brief}
                  </span>
                  <span className="mt-auto inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-ink-dim transition-colors duration-(--d-fast) group-hover:text-mark">
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
        </div>
      </section>
    </>
  );
}
