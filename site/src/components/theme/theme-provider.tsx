"use client";

import { ThemeProvider as NextThemes } from "next-themes";
import type { ReactNode } from "react";

/**
 * Dark is not an inversion here. The two grounds are separately authored in
 * design/palette.py and separately contrast-verified: light is paper on a
 * bench, dark is graphite. The mark colour shifts hue and lightness between
 * them so it reads as the same annotation weight on both.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemes
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemes>
  );
}
