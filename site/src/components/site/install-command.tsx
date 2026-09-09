"use client";

import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "@/lib/icons";

/**
 * The install line.
 *
 * The site argued for the skill on six screens and never once said how to get
 * it. This is the primary action of the whole page, so it is a real control
 * rather than prose: the command is selectable, the copy is one press, and the
 * confirmation is a toast rather than a label swap that a screen reader misses.
 *
 * `aria-live` on the status text and a `sonner` toast say the same thing twice
 * on purpose - one for people watching the button, one for people who are not.
 */
export function InstallCommand({
  command = "git clone https://github.com/Navin-nash/parti",
  hint,
  className,
}: {
  command?: string;
  hint?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      toast.success("Command copied", {
        description: "Clone it, then point Claude Code at the skills directory.",
      });
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard is permission-gated and blocked in some embeds. Say so rather
      // than failing silently, and leave the text selectable as the fallback.
      toast.error("Could not copy", {
        description: "Select the command and copy it manually.",
      });
    }
  }

  return (
    <div className={cn("w-full max-w-xl", className)}>
      <div className="flex items-stretch gap-2 rounded-xl border border-rule bg-plate-2 p-2">
        <code className="flex min-w-0 flex-1 items-center overflow-x-auto whitespace-nowrap px-3 font-mono text-[0.8125rem] text-ink-muted">
          <span className="mr-2 select-none text-ink-subtle">$</span>
          {command}
        </code>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={copy}
          // The primary action of the page. shadcn's sm size lands at 28px, under
          // the 44px touch floor, so the height is set explicitly rather than
          // inherited from a size token tuned for dense toolbars.
          className="min-h-11 shrink-0 gap-2 px-4"
          aria-label={`Copy install command: ${command}`}
        >
          {copied ? (
            <Check className="size-4" aria-hidden />
          ) : (
            <Copy className="size-4" aria-hidden />
          )}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>

      <p className="mt-2 text-[0.8125rem] text-ink-muted" aria-live="polite">
        {copied ? "Copied to clipboard." : hint}
      </p>
    </div>
  );
}
