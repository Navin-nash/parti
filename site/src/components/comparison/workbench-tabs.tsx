"use client";

import { useId, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type TabId = "preview" | "code" | "prompt" | "design";

const TABS: { id: TabId; label: string }[] = [
  { id: "preview", label: "Preview" },
  { id: "code", label: "Code" },
  { id: "prompt", label: "Prompt" },
  { id: "design", label: "Design" },
];

/**
 * Preview / Code / Prompt / Design.
 *
 * All four panels are rendered on the server and handed here as props, so the
 * Code panel's syntax highlighting costs nothing on the client and switching
 * tabs is instant rather than a fetch. The cost is that all four are in the
 * document at once; at this page size that is the right trade.
 *
 * Hidden panels use `hidden` rather than being unmounted, so a preview keeps
 * whatever state the reader put it in when they go and read the code and come
 * back. Losing an open disclosure on a tab switch is the kind of small
 * betrayal that makes a tool feel careless.
 */
export function WorkbenchTabs({
  preview,
  code,
  prompt,
  design,
  defaultTab = "preview",
}: {
  preview: ReactNode;
  code: ReactNode;
  prompt: ReactNode;
  design: ReactNode;
  defaultTab?: TabId;
}) {
  const [active, setActive] = useState<TabId>(defaultTab);
  const base = useId();
  const panels: Record<TabId, ReactNode> = { preview, code, prompt, design };

  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const next = TABS[(i + d + TABS.length) % TABS.length];
    setActive(next.id);
    document.getElementById(`${base}-tab-${next.id}`)?.focus();
  };

  return (
    <div>
      <div
        role="tablist"
        aria-label="Comparison views"
        className="flex items-center gap-px border-b border-rule bg-rule"
      >
        {TABS.map((t, i) => {
          const on = active === t.id;
          return (
            <button
              key={t.id}
              id={`${base}-tab-${t.id}`}
              role="tab"
              type="button"
              aria-selected={on}
              aria-controls={`${base}-panel-${t.id}`}
              tabIndex={on ? 0 : -1}
              onClick={() => setActive(t.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={cn(
                "relative -mb-px px-4 py-2 font-mono text-[0.6875rem] uppercase tracking-[0.12em] transition-colors duration-(--d-fast) ease-(--ease-specimen)",
                on
                  ? "bg-plate text-ink"
                  : "bg-plate-2 text-ink-dim hover:text-ink",
              )}
            >
              {t.label}
              <span
                aria-hidden
                className={cn(
                  "absolute inset-x-0 bottom-0 h-px transition-colors duration-(--d-fast)",
                  on ? "bg-mark" : "bg-transparent",
                )}
              />
            </button>
          );
        })}
      </div>

      {TABS.map((t) => (
        <div
          key={t.id}
          id={`${base}-panel-${t.id}`}
          role="tabpanel"
          aria-labelledby={`${base}-tab-${t.id}`}
          hidden={active !== t.id}
          tabIndex={0}
          className="focus-visible:outline-2 focus-visible:outline-mark"
        >
          {panels[t.id]}
        </div>
      ))}
    </div>
  );
}
