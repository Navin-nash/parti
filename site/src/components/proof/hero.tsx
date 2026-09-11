"use client";

import Cloudscape from "@/components/ui/cloudscape";
import { DiaTextReveal } from "@/components/ui/dia-text-reveal";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { Button } from "@/components/proof/button";
import { InstallCommand } from "@/components/site/install-command";
import { useProofHex } from "@/components/proof/theme-hex";
import { ArrowRight } from "@/lib/icons";

/**
 * The masthead: a live sky with the thesis over it. The rotating tail of the
 * headline is a text-loop; the sky blurs into the page at the bottom edge.
 * Fits the first viewport - CTAs and install visible without scrolling.
 */
export function Hero() {
  const hex = useProofHex();

  return (
    <section className="relative isolate overflow-hidden border-b border-rule">
      <Cloudscape
        className="absolute inset-0 -z-10 !bg-transparent"
        height="100%"
        speed={0.55}
        colorBottom={hex.skyBottom}
        colorMid={hex.skyMid}
        colorTop={hex.skyTop}
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-paper from-25% via-paper/55 to-paper/10"
      />

      <div className="relative z-10 mx-auto flex min-h-[86vh] max-w-[1400px] flex-col justify-end px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <div className="min-w-0 max-w-[48rem]">
          <h1 className="display text-[clamp(2.25rem,5.5vw,4.25rem)] text-ink">
            AI can generate interfaces. Parti makes them{" "}
            <span className="relative inline-block whitespace-nowrap">
              <span
                aria-hidden
                className="absolute inset-x-[-0.12em] bottom-[0.08em] top-[0.32em] -z-10 bg-mark-tint"
              />
              <DiaTextReveal
                repeat
                fixedWidth
                startOnView={false}
                holdDuration={1.4}
                text={["Take a position.", "Hold an opinion.", "Commit to a shape.", "Mean something."]}
                colors={[hex.mark, hex.skyBottom]}
                textColor={hex.mark}
              />
            </span>
          </h1>

          <p className="mt-6 max-w-[52ch] text-[1.0625rem] leading-[1.6] text-ink-muted">
            Generated design converges, not from a lack of ability, but because
            everything trained on the same portfolio sites and component
            libraries. Parti is the skill that forces a decision where a default
            would otherwise fill the gap.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button href="/gallery" icon={<ArrowRight className="size-3.5" />}>
              See the gallery
            </Button>
            <Button href="/method" variant="outline">
              How it works
            </Button>
          </div>

          <InstallCommand
            className="mt-6"
            hint="Requires Claude Code. No build step, no dependencies."
          />
        </div>
      </div>

      <ProgressiveBlur
        direction="bottom"
        blurIntensity={1.6}
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-24"
      />
    </section>
  );
}
