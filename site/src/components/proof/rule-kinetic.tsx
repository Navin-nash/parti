"use client";

import PixelTextFill from "@/components/ui/pixel-text-fill";
import { useProofHex } from "@/components/proof/theme-hex";

/**
 * "The rule" - the one choreographed scroll moment for type. PixelTextFill
 * scrubs the headline in as the section passes; its own sticky section handles
 * the pin. Persimmon is the resolving-pixel colour, spent here on the single
 * most load-bearing sentence on the site.
 */
export function RuleKinetic() {
  const hex = useProofHex();

  return (
    <PixelTextFill
      text={"Style is derived,\nnever selected."}
      backgroundColor={hex.paper}
      textColor={hex.ink}
      primaryColor={hex.mark}
      dimColor={hex.rule}
      fontSize={5}
      maxWidth={74}
      sectionHeight={170}
      className="border-y border-rule"
    />
  );
}
