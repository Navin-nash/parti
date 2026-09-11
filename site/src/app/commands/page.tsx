import type { Metadata } from "next";
import { Section } from "@/components/proof/section";
import { Reveal } from "@/components/proof/reveal";
import { COMMANDS, COMMAND_GROUPS } from "@/data/commands";

export const metadata: Metadata = {
  title: "Commands",
  description:
    "The command set. Each has a defined input, a defined output, and a cost. A narrow complaint gets a narrow pass; a fresh brief gets the full loop.",
};

export default function CommandsPage() {
  return (
    <Section>
      <Reveal>
        <h1 className="display max-w-[26ch] text-[clamp(2.25rem,5vw,3.5rem)] text-ink">
          {COMMANDS.length} narrow operations, not one big button.
        </h1>
        <p className="mt-4 max-w-[64ch] text-[1.0625rem] leading-[1.6] text-ink-muted">
          Each has a defined input, a defined output, and a cost on the skill&rsquo;s
          own XS to L scale. Invoke by name, or state a complaint and let it
          infer which one applies.
        </p>
      </Reveal>

      <div className="mt-12 flex flex-col gap-14">
        {COMMAND_GROUPS.map((group) => {
          const rows = COMMANDS.filter((c) => c.group === group.id);
          return (
            <Reveal as="section" key={group.id}>
              <h2 className="text-[1.3125rem] font-medium text-ink">{group.id}</h2>
              <p className="mt-1 max-w-[64ch] text-[0.9375rem] leading-relaxed text-ink-muted">
                {group.blurb}
              </p>

              <ul className="mt-6 border-t border-rule">
                {rows.map((c) => (
                  <li
                    key={c.name}
                    className="grid gap-x-6 gap-y-1 border-b border-rule py-4 sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)_auto]"
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
                    <span className="border border-rule bg-plate-2 px-2 py-0.5 font-mono text-[0.6875rem] text-ink-dim sm:justify-self-end">
                      {c.cost}
                    </span>
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
