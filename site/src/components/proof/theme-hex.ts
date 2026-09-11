"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

/**
 * The three vendored 21st components (Cloudscape, PixelTextFill, DepthFlipText)
 * take hex strings, not CSS custom properties, so the Proof tokens have to be
 * resolved per theme in JS. These mirror DESIGN.md "Color" and the Hero notes.
 */
export const HEX = {
  light: {
    paper: "#FCFCFD",
    ink: "#121316",
    rule: "#E4E4E7",
    // The accent at text/mark size on white - the deep form, not #87CEEB
    // (which is invisible as small marks on a white ground).
    mark: "#277796",
    skyBottom: "#87CEEB",
    skyMid: "#F4F6F7",
    skyTop: "#FFFFFF",
  },
  dark: {
    paper: "#050506",
    ink: "#EBECEE",
    rule: "#232427",
    mark: "#87CEEB",
    skyBottom: "#1C4D66",
    skyMid: "#0C2531",
    skyTop: "#050506",
  },
} as const;

/** Resolved Proof hex set for the current theme. Defaults to dark before mount
 *  (matches ThemeProvider's defaultTheme) to avoid a first-paint flash. */
export function useProofHex() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);
  const key = mounted && resolvedTheme === "light" ? "light" : "dark";
  return HEX[key];
}
