import type { Metadata } from "next";
import { Section } from "@/components/proof/section";
import { Reveal } from "@/components/proof/reveal";
import { PROCESS } from "@/data/process";

export const metadata: Metadata = {
  title: "Method",
  description:
    "The seven-stage process Parti runs: establish the brief, derive constraints, explore three directions, render them, critique your own work, converge, then bind the decision in tokens and build.",
};

export default function MethodPage() {
  return (
    <Section>
      <Reveal>
        <h1 className="display max-w-[24ch] text-[clamp(2.25rem,5vw,3.5rem)] text-ink">
          Seven stages. One is a gate.
        </h1>
        <p className="mt-4 max-w-[64ch] text-[1.0625rem] leading-[1.6] text-ink-muted">
          Establish the brief, derive constraints, explore three directions,
          render them with real content, critique your own work, converge, then
          bind the decision in tokens and build. Skip stage three and the rest
          still runs, it just produces one direction wearing three names.
        </p>
      </Reveal>

      <ol className="mt-12 border-t border-rule">
        {PROCESS.map((stage, i) => (
          <Reveal
            as="li"
            key={stage.index}
            delay={i * 0.03}
            className={`grid gap-x-6 gap-y-2 border-b border-rule py-8 lg:grid-cols-[4rem_minmax(0,1fr)] ${
              stage.pivotal ? "border-l-2 border-l-mark-text pl-5 lg:pl-4" : ""
            }`}
          >
            <span className="font-mono text-[0.8125rem] text-ink-dim tabular">
              {stage.index}
            </span>
            <div className="min-w-0">
              <h2 className="text-[1.3125rem] font-medium text-ink">
                {stage.title}
                {stage.pivotal ? (
                  <span className="ml-3 border border-mark-text bg-mark-tint px-2 py-0.5 align-middle font-mono text-[0.625rem] uppercase tracking-[0.14em] text-mark-text">
                    the gate
                  </span>
                ) : null}
              </h2>
              <p className="mt-1 text-[0.9375rem] text-ink-muted">{stage.short}</p>

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

              <p className="mt-4 max-w-[68ch] text-[0.875rem] leading-relaxed text-ink-muted">
                {stage.detail}
              </p>
              <p className="mt-3 max-w-[68ch] text-[0.8125rem] leading-relaxed text-ink-dim">
                <span className="text-mark-text">If skipped &mdash; </span>
                {stage.skipped}
              </p>
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
