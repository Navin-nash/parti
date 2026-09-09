"use client";

import { useEffect, useState } from "react";
import { Search } from "@/lib/icons";

/**
 * The visible half of the command palette.
 *
 * A keyboard shortcut nobody can see is a feature for the person who built it.
 * This is the affordance: it says the palette exists, says which key opens it,
 * and is itself a real button so the shortcut is not the only way in.
 *
 * The modifier is resolved on the client because rendering the wrong one is
 * worse than rendering none - a Mac user told to press Ctrl assumes it is
 * broken.
 */
export function SearchTrigger() {
  const [mac, setMac] = useState<boolean | null>(null);

  useEffect(() => {
    setMac(/Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent));
  }, []);

  const open = () =>
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true }),
    );

  return (
    <button
      type="button"
      onClick={open}
      aria-label="Search sections, capabilities and examples"
      aria-keyshortcuts="Meta+K Control+K"
      className="hidden items-center gap-2 rounded-full border border-rule bg-plate py-2 pl-3.5 pr-2 text-[0.8125rem] text-ink-muted transition-colors duration-(--d-fast) ease-(--ease-specimen) hover:border-rule-strong hover:text-ink sm:inline-flex"
    >
      <Search className="size-3.5" aria-hidden />
      <span>Search</span>
      <kbd className="rounded border border-rule bg-plate-2 px-1.5 py-0.5 font-mono text-[0.6875rem] text-ink-subtle">
        {mac === null ? "   " : mac ? "⌘K" : "Ctrl K"}
      </kbd>
    </button>
  );
}
