"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { AXIS_LABEL, type DirectionAxes } from "@/lib/schema";

type Stage = 0 | 1 | 2;

const STAGES: { id: Stage; label: string; caption: string }[] = [
  {
    id: 0,
    label: "Output",
    caption:
      "What a capable agent produces from the brief with no design skill loaded. Competent, conventional, and indistinguishable from the next one.",
  },
  {
    id: 1,
    label: "Direction",
    caption:
      "The step that usually does not happen. Constraints derived from the subject, then a position taken on six axes - each one a decision that could have gone another way.",
  },
  {
    id: 2,
    label: "Build",
    caption:
      "The same brief, built to that direction, with the tokens binding and every state shipped in the same pass.",
  },
];

/**
 * The hero interaction.
 *
 * Three positions, and the middle one is the argument: the derivation is shown
 * as a stage rather than as a transition between two pictures. A crossfade
 * between a before and an after would say the difference is visual taste. The
 * middle stage says it is a sequence of decisions, which is the actual claim.
 *
 * The two outer stages render the real arm components, cropped - not
 * screenshots. On a site arguing that generated UI should be looked at rather
 * than described, a picture of the output would be the wrong material.
 */
export function DerivationHero({
  baseline,
  parti,
  axes,
  directionName,
  thesis,
  signature,
  constraints,
}: {
  baseline: ReactNode;
  parti: ReactNode;
  axes: DirectionAxes;
  directionName: string;
  thesis: string;
  signature: string;
  constraints: { label: string; value: string }[];
}) {
  const [stage, setStage] = useState<Stage>(0);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      setStage((s) => (Math.min(2, s + 1) as Stage));
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      setStage((s) => (Math.max(0, s - 1) as Stage));
    } else if (e.key === "Home") {
      e.preventDefault();
      setStage(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setStage(2);
    }
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-rule bg-plate shadow-sm">
      <div
        role="tablist"
        aria-label="Derivation stage"
        onKeyDown={onKeyDown}
        className="flex gap-1 border-b border-rule/70 bg-plate-2 p-2"
      >
        {STAGES.map((s) => {
          const on = stage === s.id;
          return (
            <button
              key={s.id}
              role="tab"
              type="button"
              aria-selected={on}
              tabIndex={on ? 0 : -1}
              onClick={() => setStage(s.id)}
              className={cn(
                "flex-1 rounded-full px-4 py-2 text-[0.8125rem] font-medium transition-colors duration-(--d-fast) ease-(--ease-specimen)",
                on ? "bg-plate text-ink shadow-sm" : "text-ink-muted hover:text-ink",
              )}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      <p
        className="border-b border-rule/70 bg-plate-2 px-4 py-3 text-[0.875rem] leading-relaxed text-ink-muted sm:px-6"
        aria-live="polite"
      >
        <span className="max-w-[76ch]">{STAGES[stage].caption}</span>
      </p>

      {/* The specimen field. One fixed height so the three stages are directly
          comparable - a stage that resized would make the comparison a
          measurement of layout height instead of design. */}
      <div className="relative h-[clamp(22rem,52vh,34rem)] overflow-hidden bg-plate">
        <StageLayer active={stage === 0} label="Without Parti">
          <div className="pointer-events-none h-full overflow-hidden">{baseline}</div>
        </StageLayer>

        <StageLayer active={stage === 1} label="The derivation">
          <DerivationPanel
            axes={axes}
            directionName={directionName}
            thesis={thesis}
            signature={signature}
            constraints={constraints}
          />
        </StageLayer>

        <StageLayer active={stage === 2} label="With Parti">
          <div className="pointer-events-none h-full overflow-hidden">{parti}</div>
        </StageLayer>
      </div>
    </div>
  );
}

function StageLayer({
  active, label, children,
}: { active: boolean; label: string; children: ReactNode }) {
  return (
    <div
      aria-hidden={!active}
      aria-label={label}
      className={cn(
        "absolute inset-0 transition-opacity duration-(--d-slow) ease-(--ease-specimen) motion-reduce:transition-none",
        active ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      {children}
    </div>
  );
}

function DerivationPanel({
  axes, directionName, thesis, signature, constraints,
}: {
  axes: DirectionAxes;
  directionName: string;
  thesis: string;
  signature: string;
  constraints: { label: string; value: string }[];
}) {
  return (
    <div className="h-full overflow-auto bg-plate-2">
      <div className="grid gap-4 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="rounded-2xl bg-plate p-4 sm:p-6">
          <p className="plate-label mb-3">Derived constraints</p>
          <dl className="space-y-2.5">
            {constraints.map((c) => (
              <div key={c.label} className="flex gap-3 border-b border-rule/50 pb-2.5 last:border-0">
                <dt className="w-[10rem] shrink-0 text-[0.75rem] font-medium text-ink-dim">
                  {c.label}
                </dt>
                <dd className="min-w-0 flex-1 text-[0.8125rem] leading-snug text-ink-muted">
                  {c.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="rounded-2xl bg-plate p-4 sm:p-6">
          <p className="plate-label mb-1">Direction</p>
          <p className="display mb-3 text-[1.5rem] text-ink">{directionName}</p>
          <p className="mb-5 max-w-[52ch] text-[0.875rem] leading-relaxed text-ink-muted">
            {thesis}
          </p>

          <p className="plate-label mb-2">Position on six axes</p>
          <ul className="mb-5 grid grid-cols-2 gap-2">
            {(Object.keys(AXIS_LABEL) as (keyof DirectionAxes)[]).map((k) => (
              <li key={k} className="rounded-xl bg-plate-2 px-3 py-2">
                <span className="block text-[0.625rem] font-medium uppercase tracking-[0.08em] text-ink-dim">
                  {AXIS_LABEL[k]}
                </span>
                <span className="block truncate text-[0.75rem] text-ink">
                  {axes[k]}
                </span>
              </li>
            ))}
          </ul>

          <p className="plate-label mb-2 text-mark">Signature</p>
          <p className="max-w-[52ch] rounded-xl bg-plate-2 p-3 text-[0.8125rem] leading-relaxed text-ink-muted">
            {signature}
          </p>
        </div>
      </div>
    </div>
  );
}
