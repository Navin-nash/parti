"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "@/lib/icons";
import { cn } from "@/lib/utils";

/**
 * A single icon button. It swaps glyph on click rather than exposing a
 * three-way menu or a segmented light/dark switch - the control does one
 * thing, so it looks like it does one thing.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  // Standard next-themes hydration guard: the server has no theme to read,
  // so the first client render must match it before switching to the real
  // value. There is no external system to subscribe to here instead.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const isDark = mounted ? resolvedTheme === "dark" : true;

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-full border border-rule text-ink-muted transition-colors duration-(--d-fast) ease-(--ease-specimen) hover:border-rule-strong hover:text-ink",
        className,
      )}
    >
      {isDark ? <Moon className="size-4" /> : <Sun className="size-4" />}
    </button>
  );
}
