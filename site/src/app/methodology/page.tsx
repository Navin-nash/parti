import type { Metadata } from "next";
import { Section } from "@/components/specimen/section";
import { Display, Lede } from "@/components/specimen/prose";
import { MethodologyTimeline } from "@/components/methodology/methodology-timeline";

export const metadata: Metadata = {
  title: "Methodology",
  description: "The seven-stage direction process, from brief to verified build.",
};

export default function MethodologyPage() {
  return (
    <Section eyebrow="How it works">
      <Display level={1} className="mb-4 max-w-[26ch]">
        Seven stages. One is a gate.
      </Display>
      <Lede className="mb-12">
        Establish the brief, derive constraints, explore three directions,
        render them with real content, critique your own work, converge, then
        bind the decision in tokens and build. Skip stage three and the rest
        still runs - it just produces one direction wearing three names.
      </Lede>

      <MethodologyTimeline />
    </Section>
  );
}
