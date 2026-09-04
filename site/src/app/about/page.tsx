import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/specimen/section";
import { Plate } from "@/components/specimen/plate";
import { Display, Prose } from "@/components/specimen/prose";
import { SquareLink } from "@/components/specimen/square-link";

export const metadata: Metadata = {
  title: "About",
  description: "Why Parti exists, and what it deliberately does not claim.",
};

export default function AboutPage() {
  return (
    <>
      <Section eyebrow="Philosophy">
        <Display level={1} className="mb-6 max-w-[22ch]">
          Style is derived, never selected.
        </Display>
        <Prose>
          <p>
            Ask a capable model for an interface with no further constraint and
            it will produce something competent, modern, and indistinguishable
            from the last thing it produced. Not because it cannot design - the
            baseline arms throughout this site are frequently good - but because
            nothing in the process required a decision. Every gap a decision
            would have filled gets filled by the nearest convention instead.
          </p>
          <p>
            Parti is a Claude Code skill that closes that gap. It does not add a
            style menu. It adds a sequence: understand the subject before
            touching anything visual, derive constraints from the audience, the
            content, and the job the interface does, generate directions that
            are genuinely different from one another rather than palette
            variations of one idea, render them with real content so the
            comparison is honest, critique the result against its own subject
            rather than against taste, converge on one, bind it in a token spec,
            and only then build - with every named state, not only the ideal
            one.
          </p>
          <p>
            The name comes from architecture, where a <em>parti</em> is the
            central, organizing idea a building is built around - the thing you
            could describe in one sentence before a single wall goes up. An
            interface without one is not wrong, exactly. It is just a floor
            plan with nothing holding it together, which is the most common
            shape a generated interface takes.
          </p>
        </Prose>
      </Section>

      <Section eyebrow="What this site does not claim">
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            [
              "A design-quality score",
              "The skill's own scripts measure roughly half of what makes a design good - color discipline, tokenization, spatial rhythm. Hierarchy, signature, content fit, copy, and concept are judged, not measured, and this site never averages the two into one number.",
            ],
            [
              "That the baseline is bad",
              "Every baseline arm here was built by a capable agent in good faith, denied the skill, and never told a comparison was happening. Several made calls we would ship. The finding is that competent one-shot work still converges - not that the alternative is incompetent.",
            ],
            [
              "That this process is free",
              "Explore is the most expensive command in the taxonomy for a reason - three real directions, rendered, is more work than one. The claim is that the work buys something specific and nameable, not that it is costless.",
            ],
          ].map(([h, b]) => (
            <Plate key={h} label={h} bodyClassName="p-4">
              <p className="text-[0.875rem] leading-relaxed text-ink-muted">{b}</p>
            </Plate>
          ))}
        </div>
      </Section>

      <Section eyebrow="This site, as an example of itself">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-16">
          <Prose>
            <p>
              The showcase you are reading was built to its own direction: a
              calm, rounded, professional surface where the only job of the
              chrome is to get out of the way of the comparison. It was
              derived the same way every example on it was - subject,
              audience, constraints, then a position on six axes, tokens
              emitted before the CSS, states shipped in the same pass as the
              ideal one.
            </p>
            <p>
              Read the <Link href="/methodology" className="text-mark underline decoration-mark/40 underline-offset-2 hover:decoration-mark">
                methodology
              </Link>{" "}
              for the process, or open any{" "}
              <Link href="/examples" className="text-mark underline decoration-mark/40 underline-offset-2 hover:decoration-mark">
                example
              </Link>{" "}
              to see the token spec this site itself is built from.
            </p>
          </Prose>

          <div className="flex flex-col gap-3">
            <SquareLink href="/examples" variant="mark">
              Explore the examples
            </SquareLink>
            <SquareLink href="/methodology">Read the methodology</SquareLink>
            <SquareLink href="https://github.com/Navin-nash/parti" external>
              Read the skill
            </SquareLink>
          </div>
        </div>
      </Section>
    </>
  );
}
