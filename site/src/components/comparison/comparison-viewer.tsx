"use client";

import { useState, type ReactNode } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { PreviewFrame } from "@/components/preview/preview-frame";
import type { ArmKind } from "@/lib/schema";
import { cn } from "@/lib/utils";

/**
 * The comparison instrument: a single pill toggle between the two arms.
 *
 * One arm renders at a time, full width, exactly as it renders anywhere else
 * on the site - there is no forced light/dark override and no split or
 * slider mode. A reader compares by switching, the way they'd compare two
 * takes of anything else: look, switch, look again.
 */
export function ComparisonViewer({
  baseline,
  parti,
  bleed = false,
  defaultArm = "parti",
  title,
}: {
  baseline: ReactNode;
  parti: ReactNode;
  bleed?: boolean;
  defaultArm?: ArmKind;
  title: string;
}) {
  const [arm, setArm] = useState<ArmKind>(defaultArm);
  const [full, setFull] = useState(false);

  const toggle = (
    <div
      role="tablist"
      aria-label="Which arm"
      className="inline-flex items-center gap-0.5 rounded-full bg-plate-2 p-1"
    >
      {(["baseline", "parti"] as const).map((a) => (
        <button
          key={a}
          type="button"
          role="tab"
          aria-selected={arm === a}
          onClick={() => setArm(a)}
          className={cn(
            "rounded-full px-3.5 py-1.5 text-[0.8125rem] font-medium transition-colors duration-(--d-fast) ease-(--ease-specimen)",
            arm === a ? "bg-plate text-ink shadow-sm" : "text-ink-muted hover:text-ink",
          )}
        >
          {a === "baseline" ? "Without Parti" : "With Parti"}
        </button>
      ))}
    </div>
  );

  const body = arm === "baseline" ? baseline : parti;

  return (
    <>
      <PreviewFrame
        onFullscreen={() => setFull(true)}
        bleed
        className="h-[min(75vh,860px)]"
        label={toggle}
      >
        <div className={bleed ? "" : "p-0"}>{body}</div>
      </PreviewFrame>

      <Dialog open={full} onOpenChange={setFull}>
        <DialogContent
          showCloseButton
          className="h-[95vh] w-[98vw] max-w-none gap-0 overflow-hidden rounded-2xl border-rule bg-plate p-0 sm:max-w-none"
        >
          <DialogTitle className="sr-only">{title} - full screen</DialogTitle>
          <PreviewFrame bleed className="h-full border-0 rounded-none" label={toggle}>
            {body}
          </PreviewFrame>
        </DialogContent>
      </Dialog>
    </>
  );
}
