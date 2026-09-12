import type { Metadata } from "next";
import { Section } from "@/components/proof/section";
import { Reveal } from "@/components/proof/reveal";
import { PullQuote } from "@/components/proof/pull-quote";
import { Plate } from "@/components/proof/plate";
import { PROCESS } from "@/data/process";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Method",
  description:
    "The seven stages Parti runs before any CSS: establish the brief, derive constraints, explore three directions, render them with real content, critique your own work, converge on one, then bind the decision in tokens.",
};

export default function MethodPage() {
  return (
    <Section>
      <Reveal>
        <h1 className="display max-w-[24ch] text-[clamp(2.25rem,5vw,3.5rem)] text-ink">
          Seven stages. One is a gate.
        </h1>
        <p className="mt-4 max-w-[64ch] text-pretty text-[1.0625rem] leading-[1.6] text-ink-muted">
          Establish the brief, derive constraints, explore three directions,
          render them with real content, critique your own work, converge on
          one, then bind the decision in tokens and build. Stage three is the
          gate: skip it and the rest of the process still runs &mdash; it just
          runs on one direction wearing three names.
        </p>

        <PullQuote className="mt-10" source="Stage 06 — converge">
          Presenting three options without a recommendation is not neutrality.
          It defers the decision to the person who hired you to make it.
        </PullQuote>
      </Reveal>

      <Reveal delay={0.08}>
        <nav aria-label="Jump to a stage" className="mt-10 flex gap-1">
          {PROCESS.map((stage) => (
            <a
              key={stage.index}
              href={`#stage-${stage.index}`}
              title={stage.title}
              aria-label={`Jump to stage ${stage.index}: ${stage.title}${
                stage.pivotal ? " — the gate" : ""
              }`}
              className={cn(
                "h-1.5 flex-1 bg-rule transition-colors duration-(--d-fast) hover:bg-rule-strong",
                stage.pivotal && "bg-mark-text hover:bg-mark-text",
              )}
            />
          ))}
        </nav>
      </Reveal>

      <ol className="mt-8 border-t border-rule">
        {PROCESS.map((stage, i) => {
          const fieldChips = (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {stage.fields.map((f) => (
                <span
                  key={f}
                  className="border border-rule bg-plate-2 px-2 py-0.5 font-mono text-[0.6875rem] text-ink-dim"
                >
                  {f}
                </span>
              ))}
            </div>
          );
          const skippedLine = (
            <p className="mt-3 max-w-[68ch] text-pretty text-[0.8125rem] leading-relaxed text-ink-dim">
              <span className="text-mark-text">If skipped &mdash; </span>
              {stage.skipped}
            </p>
          );

          return (
            <Reveal
              as="li"
              key={stage.index}
              id={`stage-${stage.index}`}
              delay={i * 0.03}
              className="scroll-mt-20 grid gap-x-6 gap-y-2 border-b border-rule py-8 lg:grid-cols-[4rem_minmax(0,1fr)]"
            >
              <span className="font-mono text-[0.8125rem] text-ink-dim tabular">
                {stage.index}
              </span>

              {stage.pivotal ? (
                <Plate label={`Stage ${stage.index} — the gate`} recessed>
                  <h2 className="text-[1.3125rem] font-medium text-ink">{stage.title}</h2>
                  <p className="mt-1 text-[0.9375rem] text-ink-muted">{stage.short}</p>
                  {fieldChips}
                  <p className="mt-4 max-w-[68ch] text-pretty text-[0.875rem] leading-relaxed text-ink-muted">
                    {stage.detail}
                  </p>
                  {skippedLine}
                </Plate>
              ) : (
                <div className="min-w-0">
                  <h2 className="text-[1.3125rem] font-medium text-ink">{stage.title}</h2>
                  <p className="mt-1 text-[0.9375rem] text-ink-muted">{stage.short}</p>
                  {fieldChips}
                  <p className="mt-4 max-w-[68ch] text-pretty text-[0.875rem] leading-relaxed text-ink-muted">
                    {stage.detail}
                  </p>
                  {skippedLine}
                </div>
              )}
            </Reveal>
          );
        })}
      </ol>
    </Section>
  );
}
