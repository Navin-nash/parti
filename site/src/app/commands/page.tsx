import type { Metadata } from "next";
import { Section } from "@/components/proof/section";
import { Reveal } from "@/components/proof/reveal";
import { COMMANDS, COMMAND_GROUPS } from "@/data/commands";
import { ChevronDown } from "@/lib/icons";

export const metadata: Metadata = {
  title: "Commands",
  description:
    "The command set. Each one states its input, its output and its cost, so a narrow complaint gets a narrow pass and only a fresh brief pays for the full loop.",
};

export default function CommandsPage() {
  return (
    <Section>
      <Reveal>
        <h1 className="display max-w-[26ch] text-[clamp(2.25rem,5vw,3.5rem)] text-ink">
          {COMMANDS.length} narrow operations, not one big button.
        </h1>
        <p className="mt-4 max-w-[64ch] text-pretty text-[1.0625rem] leading-[1.6] text-ink-muted">
          Each one states its input, its output and its cost on the
          skill&rsquo;s own XS&ndash;L scale, so you can see what a pass will
          take before you run it. Call a command by name, or describe what is
          wrong and let the skill pick. Open a row for what it actually does
          and a real, captured run.
        </p>
      </Reveal>

      <div className="mt-12 flex flex-col gap-14">
        {COMMAND_GROUPS.map((group) => {
          const rows = COMMANDS.filter((c) => c.group === group.id);
          return (
            <Reveal as="section" key={group.id}>
              <div className="flex items-baseline gap-3">
                <h2 className="text-[1.3125rem] font-medium text-ink">{group.id}</h2>
                <span className="plate-label tabular">
                  {rows.length} {rows.length === 1 ? "command" : "commands"}
                </span>
              </div>
              <p className="mt-1 max-w-[64ch] text-pretty text-[0.9375rem] leading-relaxed text-ink-muted">
                {group.blurb}
              </p>

              <ul className="mt-6 border-t border-rule">
                {rows.map((c) => (
                  <li key={c.name} className="border-b border-rule">
                    <details className="group">
                      <summary
                        className="grid cursor-pointer list-none gap-x-6 gap-y-1 py-4 transition-colors duration-(--d-fast) [&::-webkit-details-marker]:hidden hover:bg-plate-2 sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)_auto] sm:items-start"
                      >
                        <code className="font-mono text-[0.8125rem] text-ink">{c.name}</code>
                        <div className="min-w-0">
                          <p className="text-[0.875rem] leading-snug text-ink-muted">
                            {c.purpose}
                          </p>
                          <p className="mt-1 font-mono text-[0.6875rem] text-ink-dim">
                            {c.input} &rarr; {c.output}
                          </p>
                        </div>
                        <span className="flex items-center gap-2 sm:justify-self-end">
                          <span className="border border-rule bg-plate-2 px-2 py-0.5 font-mono text-[0.6875rem] text-ink-dim group-hover:bg-plate">
                            {c.cost}
                          </span>
                          <ChevronDown
                            aria-hidden
                            className="size-3.5 shrink-0 text-ink-dim transition-transform duration-(--d-base) ease-(--ease-out) group-open:rotate-180"
                          />
                        </span>
                      </summary>

                      <div className="border-l-2 border-l-rule pb-6 pl-4">
                        <p className="max-w-[64ch] text-pretty text-[0.875rem] leading-relaxed text-ink-muted">
                          {c.detail}
                        </p>

                        <p className="mt-3 font-mono text-[0.8125rem] text-ink">
                          <span className="text-ink-dim">$ </span>
                          {c.example}
                        </p>

                        {c.run ? (
                          <div className="mt-3 border border-rule bg-plate-2">
                            <div className="border-b border-rule px-3 py-1.5">
                              {c.run.kind === "executed" && c.run.cmd ? (
                                <code className="block truncate font-mono text-[0.6875rem] text-ink-muted">
                                  {c.run.cmd}
                                </code>
                              ) : (
                                <span className="plate-label">output shape</span>
                              )}
                            </div>
                            <pre className="overflow-x-auto px-3 py-3 text-[0.75rem] leading-relaxed text-ink-muted">
                              {c.run.out}
                            </pre>
                          </div>
                        ) : null}

                        {c.relatedComponents?.length ? (
                          <div className="mt-4 flex flex-wrap items-center gap-1.5">
                            <span className="plate-label">components</span>
                            {c.relatedComponents.map((rc) => (
                              <span
                                key={rc}
                                className="border border-rule px-2 py-0.5 font-mono text-[0.6875rem] text-ink-dim"
                              >
                                {rc}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </details>
                  </li>
                ))}
              </ul>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
