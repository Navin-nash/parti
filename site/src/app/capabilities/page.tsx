import type { Metadata } from "next";
import { Section } from "@/components/specimen/section";
import { Display, Lede } from "@/components/specimen/prose";
import { CapabilitiesExplorer } from "@/components/capabilities/capabilities-explorer";
import { HowACommandRuns } from "@/components/capabilities/how-a-command-runs";

export const metadata: Metadata = {
  title: "Capabilities",
  description: "The command taxonomy - direction, build, shared, and handoff.",
};

export default function CapabilitiesPage() {
  return (
    <Section eyebrow="Command explorer">
      <Display level={1} className="mb-4 max-w-[26ch]">
        Thirty narrow operations.
      </Display>
      <Lede className="mb-12">
        Each command has a defined input, a defined output, and a cost. Invoke
        by name - &ldquo;run evaluate on ./src&rdquo;, &ldquo;do a typeset
        pass&rdquo;, &ldquo;reference stripe.com/pricing&rdquo; - or state a
        complaint and let it infer which one applies. Select a command below to
        see a real run of it, or the shape of what it writes.
      </Lede>

      <HowACommandRuns />

      <CapabilitiesExplorer />
    </Section>
  );
}
