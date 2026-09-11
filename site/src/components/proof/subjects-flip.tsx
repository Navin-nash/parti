"use client";

import DepthFlipText from "@/components/ui/depth-flip-text";
import { DiaTextReveal } from "@/components/ui/dia-text-reveal";
import { useProofHex } from "@/components/proof/theme-hex";

/**
 * What the skill actually does. Not a style menu - a sequence, flipped one
 * step to the next. The heading resolves through a gradient sweep; the steps
 * cycle on a 3D hinge.
 */
export function SubjectsFlip() {
  const hex = useProofHex();

  return (
    <div className="border-b border-rule bg-paper">
      <div className="mx-auto max-w-[1400px] px-4 pt-20 sm:px-6 lg:px-8">
        <h2 className="display max-w-[24ch] text-[clamp(1.75rem,3.5vw,2.5rem)] text-ink">
          Parti does not add a style menu. It adds a sequence that makes design{" "}
          <DiaTextReveal
            repeat
            fixedWidth
            text={["Deliberate.", "Checkable.", "Yours."]}
            colors={[hex.mark, hex.skyBottom]}
            textColor={hex.mark}
          />
        </h2>
        <p className="mt-4 max-w-[62ch] text-[1.0625rem] leading-[1.6] text-ink-muted">
          Every step below runs before a single line of CSS. Skip the third and
          the output still looks designed, it just stops being about the
          subject.
        </p>
      </div>

      <DepthFlipText
        phrases={[
          "Understand the subject",
          "Derive the constraints",
          "Explore three real directions",
          "Render them with real content",
          "Critique your own work",
          "Bind the winner in tokens",
        ]}
        textColor={hex.ink}
        backgroundColor="transparent"
        loop
        holdDuration={1.0}
        transitionDuration={1.0}
        className="!min-h-[20vh] py-6 [&>div]:!min-h-0"
      />
    </div>
  );
}
