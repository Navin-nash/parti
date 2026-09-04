"use client";

import { useState, type ReactNode } from "react";
import { Maximize2, RotateCw } from "@/lib/icons";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

/**
 * The reusable preview shell: a rounded card with a light toolbar (remount,
 * fullscreen) and an isolated scroll region for the arm underneath.
 *
 * Arms render inline rather than in an iframe, so they stay in the page's tab
 * order and React tree. Isolation is a convention, not a sandbox: every arm
 * declares its own tokens on its own root and reads nothing from the host
 * page, which is what keeps one arm from picking up another's styling.
 */
export function PreviewFrame({
  children,
  onFullscreen,
  bleed = false,
  label,
  className,
  toolbarExtra,
}: {
  children: ReactNode;
  onFullscreen?: () => void;
  bleed?: boolean;
  label?: ReactNode;
  className?: string;
  toolbarExtra?: ReactNode;
}) {
  const [nonce, setNonce] = useState(0);

  return (
    <div className={cn("flex min-h-0 flex-col overflow-hidden rounded-2xl border border-rule bg-plate shadow-sm", className)}>
      <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-rule/70 px-3 py-2">
        {label}
        <div className="ml-auto flex items-center gap-1">
          {toolbarExtra}
          <ToolbarButton label="Remount this preview" onClick={() => setNonce((n) => n + 1)}>
            <RotateCw className="size-4" />
          </ToolbarButton>
          {onFullscreen ? (
            <ToolbarButton label="Open full screen" onClick={onFullscreen}>
              <Maximize2 className="size-4" />
            </ToolbarButton>
          ) : null}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto" tabIndex={0} role="group" aria-label="Interactive preview">
        <div key={nonce} className={cn("min-h-full", bleed ? "" : "p-4")}>
          {children}
        </div>
      </div>
    </div>
  );
}

function ToolbarButton({
  label, onClick, children,
}: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={onClick}
          aria-label={label}
          className="inline-flex size-8 items-center justify-center rounded-full text-ink-dim transition-colors duration-(--d-fast) ease-(--ease-specimen) hover:bg-plate-2 hover:text-ink"
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent side="top">{label}</TooltipContent>
    </Tooltip>
  );
}
