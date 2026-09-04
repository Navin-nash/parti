"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "@/lib/icons";
import { cn } from "@/lib/utils";

/**
 * Copy confirmation is the one place a state change here is worth animating:
 * the action produces no visible result anywhere else on screen, so without
 * feedback the user cannot tell it worked. It reverts after 2s.
 */
export function CopyButton({
  value,
  label = "Copy",
  className,
}: {
  value: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
        } catch {
          setCopied(false);
        }
      }}
      className={cn(
        "inline-flex items-center gap-1.5 border border-rule bg-plate px-2 py-1 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-ink-muted transition-colors duration-(--d-fast) ease-(--ease-specimen) hover:border-rule-strong hover:text-ink",
        className,
      )}
    >
      {copied ? (
        <Check className="size-3 text-mark" aria-hidden />
      ) : (
        <Copy className="size-3" aria-hidden />
      )}
      <span aria-live="polite">{copied ? "Copied" : label}</span>
    </button>
  );
}
