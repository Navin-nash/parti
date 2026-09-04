"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * The convergence grid.
 *
 * Six decisions that arrive pre-made, drawn rather than described - a swatch
 * of the exact gradient, the actual type pairing, the real card stack -
 * because a written list of tells reads as opinion and a drawn one can be
 * checked against whatever the reader last generated.
 *
 * One switch drives all six tiles at once, rather than relying on a reader
 * finding and hovering each one individually - the difference has to be
 * legible even in a static screenshot, not just live under a cursor.
 */
const TELLS: {
  id: string;
  tell: string;
  replacement: string;
  swatch: (on: boolean) => React.ReactNode;
}[] = [
  {
    id: "gradient",
    tell: "Violet-to-blue gradient mesh",
    replacement: "One flat ground, and interest from the content",
    swatch: (on) => (
      <div
        className="h-full w-full"
        style={
          on
            ? { background: "var(--plate-2)" }
            : {
                background:
                  "radial-gradient(120% 120% at 20% 0%, #7c3aed 0%, #4f46e5 45%, #0f172a 100%)",
              }
        }
      />
    ),
  },
  {
    id: "type",
    tell: "The same grotesque at three sizes",
    replacement: "Roles assigned: argument, interface, evidence",
    swatch: (on) => (
      <div className="flex h-full w-full flex-col justify-center gap-1 px-3">
        {on ? (
          <>
            <span className="display text-[0.9375rem] leading-none text-ink">Argument</span>
            <span className="text-[0.6875rem] leading-none text-ink-muted">Interface</span>
            <span className="font-mono text-[0.625rem] leading-none text-ink-dim">EVIDENCE</span>
          </>
        ) : (
          <>
            <span className="text-[0.9375rem] font-semibold leading-none text-ink">Heading</span>
            <span className="text-[0.75rem] leading-none text-ink-muted">Subheading</span>
            <span className="text-[0.625rem] leading-none text-ink-dim">Caption</span>
          </>
        )}
      </div>
    ),
  },
  {
    id: "cards",
    tell: "Three equal rounded cards with a shadow",
    replacement: "Records sized by what each has to say",
    swatch: (on) => (
      <div className="flex h-full w-full items-center gap-1.5 px-3">
        {on ? (
          <div className="flex h-[70%] w-full flex-col gap-px bg-rule">
            <div className="h-[46%] bg-plate" />
            <div className="h-[28%] bg-plate" />
            <div className="flex-1 bg-plate" />
          </div>
        ) : (
          [0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-[70%] flex-1 rounded-lg bg-plate"
              style={{ boxShadow: "0 2px 8px rgb(0 0 0 / 0.18)" }}
            />
          ))
        )}
      </div>
    ),
  },
  {
    id: "icons",
    tell: "Rounded-square gradient icon tiles",
    replacement: "A mark drawn from the subject's own artifacts",
    swatch: (on) => (
      <div className="flex h-full w-full items-center gap-2 px-3">
        {[0, 1, 2].map((i) =>
          on ? (
            <span key={i} className="font-mono text-[0.625rem] tabular text-ink-dim">
              T+{i}:{i === 0 ? "00" : i === 1 ? "40" : "12"}
            </span>
          ) : (
            <span
              key={i}
              className="size-7 rounded-lg"
              style={{
                background: "linear-gradient(140deg, #818cf8 0%, #6366f1 100%)",
              }}
            />
          ),
        )}
      </div>
    ),
  },
  {
    id: "motion",
    tell: "Everything fades up 20px on scroll",
    replacement: "One choreographed moment; the rest responds",
    swatch: (on) => (
      <div className="flex h-full w-full items-end gap-1.5 px-3 pb-4">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className={cn("w-full rounded-t-sm bg-rule-strong", on && i === 2 && "bg-mark")}
            style={{ height: on ? (i === 2 ? "72%" : "22%") : "44%" }}
          />
        ))}
      </div>
    ),
  },
  {
    id: "copy",
    tell: "Ship faster. Build better. Scale infinitely.",
    replacement: "A sentence only this product could write",
    swatch: (on) => (
      <div className="flex h-full w-full items-center px-3">
        <span
          className={cn(
            "text-[0.75rem] leading-snug",
            on ? "text-ink" : "text-ink-dim italic",
          )}
        >
          {on
            ? "Replay a run that died mid-refund."
            : "Ship faster. Build better."}
        </span>
      </div>
    ),
  },
];

export function ConvergenceGrid() {
  const [on, setOn] = useState(false);

  return (
    <div>
      <div
        role="tablist"
        aria-label="Show generic default or derived choice"
        className="mb-4 inline-flex items-center gap-0.5 rounded-full bg-plate-2 p-1"
      >
        <button
          type="button"
          role="tab"
          aria-selected={!on}
          onClick={() => setOn(false)}
          className={cn(
            "rounded-full px-3.5 py-1.5 text-[0.8125rem] font-medium transition-colors duration-(--d-fast)",
            !on ? "bg-plate text-ink shadow-sm" : "text-ink-muted hover:text-ink",
          )}
        >
          Generic default
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={on}
          onClick={() => setOn(true)}
          className={cn(
            "rounded-full px-3.5 py-1.5 text-[0.8125rem] font-medium transition-colors duration-(--d-fast)",
            on ? "bg-plate text-ink shadow-sm" : "text-ink-muted hover:text-ink",
          )}
        >
          Derived choice
        </button>
      </div>

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {TELLS.map((t) => (
          <li
            key={t.id}
            className={cn(
              "overflow-hidden rounded-2xl border bg-plate transition-colors duration-(--d-base)",
              on ? "border-mark/40" : "border-rule",
            )}
          >
            <div
              className={cn(
                "flex items-center justify-between px-3 py-1.5 text-[0.5625rem] font-semibold uppercase tracking-[0.08em] transition-colors duration-(--d-fast)",
                on ? "bg-mark text-on-mark" : "bg-plate-2 text-ink-dim",
              )}
            >
              <span>{on ? "Derived" : "Default"}</span>
            </div>
            <div className="h-16 w-full overflow-hidden bg-plate-2">
              {t.swatch(on)}
            </div>
            <div className="flex min-h-[3.5rem] items-start gap-2 p-3">
              <span
                aria-hidden
                className={cn(
                  "mt-1 size-1.5 shrink-0 rounded-full transition-colors duration-(--d-fast)",
                  on ? "bg-mark" : "bg-ink-dim",
                )}
              />
              <span
                className={cn(
                  "text-[0.8125rem] leading-snug transition-colors duration-(--d-fast)",
                  on ? "text-ink" : "text-ink-muted",
                )}
              >
                {on ? t.replacement : t.tell}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
