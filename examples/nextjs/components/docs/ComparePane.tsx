"use client";

import { useState } from "react";
import type { Pair } from "@/lib/compare";
import { MEASURED, DIMENSION_LABEL, DIMENSION_MAX } from "@/lib/compare";

type Tab = "parti" | "baseline" | "split" | "measured";

const TABS: { id: Tab; label: string; hint: string }[] = [
  { id: "parti", label: "With parti", hint: "the run that used the skill" },
  { id: "baseline", label: "Without", hint: "the run denied the skill" },
  { id: "split", label: "Split", hint: "both at once" },
  { id: "measured", label: "Measured", hint: "what the scripts report" },
];

const VIEWPORTS = [
  { id: "desktop", label: "Desktop", width: "100%" },
  { id: "tablet", label: "Tablet", width: "768px" },
  { id: "mobile", label: "Mobile", width: "390px" },
] as const;

function Frame({ src, title, width }: { src: string; title: string; width: string }) {
  return (
    <div className="pv__frameWrap">
      <iframe
        src={src}
        title={title}
        className="pv__frame"
        style={{ width }}
        loading="lazy"
        /* Each arm is a complete, competing design system. An iframe gives it
           the isolated document it was authored for — rendered inline, the two
           stylesheets would fight and the comparison would measure nothing. */
      />
    </div>
  );
}

function Bar({ value, max }: { value: number; max: number }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="pv__bar" role="img" aria-label={`${value} of ${max}`}>
      <div className="pv__barFill" style={{ width: `${pct}%` }} />
    </div>
  );
}

export function ComparePane({ pair }: { pair: Pair }) {
  const [tab, setTab] = useState<Tab>("parti");
  const [vp, setVp] = useState<(typeof VIEWPORTS)[number]["id"]>("desktop");
  const width = VIEWPORTS.find((v) => v.id === vp)!.width;

  const hasBoth = Boolean(pair.baseline && pair.parti);

  return (
    <div className="pv">
      <div className="pv__toolbar">
        <div className="pv__tabs" role="tablist" aria-label="Which run to preview">
          {TABS.map((t) => {
            const disabled = !hasBoth && (t.id === "baseline" || t.id === "split");
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                disabled={disabled}
                title={disabled ? "No baseline equivalent for this entry" : t.hint}
                className={`pv__tab${tab === t.id ? " pv__tab--on" : ""}`}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {tab !== "measured" && (
          <div className="pv__vps" role="group" aria-label="Viewport width">
            {VIEWPORTS.map((v) => (
              <button
                key={v.id}
                className={`pv__vp${vp === v.id ? " pv__vp--on" : ""}`}
                onClick={() => setVp(v.id)}
                aria-pressed={vp === v.id}
              >
                {v.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {tab === "parti" && pair.parti && (
        <Frame src={pair.parti} title={`${pair.name} — with parti`} width={width} />
      )}
      {tab === "baseline" && pair.baseline && (
        <Frame src={pair.baseline} title={`${pair.name} — without the skill`} width={width} />
      )}

      {tab === "split" && hasBoth && (
        <div className="pv__split">
          <div>
            <div className="label pv__splitLabel">Without the skill</div>
            <Frame src={pair.baseline!} title={`${pair.name} — baseline`} width="100%" />
          </div>
          <div>
            <div className="label pv__splitLabel" style={{ color: "var(--advisory)" }}>
              With parti
            </div>
            <Frame src={pair.parti!} title={`${pair.name} — parti`} width="100%" />
          </div>
        </div>
      )}

      {tab === "measured" && (
        <div className="pv__measured">
          <p className="small muted measure" style={{ marginTop: 0 }}>
            Figures are per <strong>arm</strong>, for the whole build — the design system lives in
            the shared stylesheet, so a single surface in isolation reports almost nothing.
            Regenerate with <span className="strip">python examples/shared/measure.py</span>.
          </p>

          <table className="pv__table">
            <thead>
              <tr>
                <th scope="col">Measure</th>
                <th scope="col" className="num">Without</th>
                <th scope="col" className="num">With parti</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Measured score</th>
                <td className="num">{MEASURED.baseline.score}</td>
                <td className="num">{MEASURED.parti.score}</td>
              </tr>
              <tr>
                <th scope="row">Band</th>
                <td className="num">{MEASURED.baseline.band}</td>
                <td className="num">{MEASURED.parti.band}</td>
              </tr>
              <tr>
                <th scope="row">Tells detected</th>
                <td className="num">{MEASURED.baseline.tells}</td>
                <td className="num">{MEASURED.parti.tells}</td>
              </tr>
              <tr>
                <th scope="row">Motion rules violated</th>
                <td className="num">{MEASURED.baseline.motionRules}</td>
                <td className="num">{MEASURED.parti.motionRules}</td>
              </tr>
              <tr>
                <th scope="row">box-shadow count</th>
                <td className="num">{MEASURED.baseline.shadows}</td>
                <td className="num">{MEASURED.parti.shadows}</td>
              </tr>
              <tr>
                <th scope="row">Raw hex literals</th>
                <td className="num">{MEASURED.baseline.hex}</td>
                <td className="num">{MEASURED.parti.hex}</td>
              </tr>
              <tr>
                <th scope="row">Token spec emitted</th>
                <td className="num">{MEASURED.baseline.tokenSpec ? "yes" : "no"}</td>
                <td className="num">{MEASURED.parti.tokenSpec ? "yes" : "no"}</td>
              </tr>
              <tr>
                <th scope="row">DESIGN.md written</th>
                <td className="num">{MEASURED.baseline.designMd ? "yes" : "no"}</td>
                <td className="num">{MEASURED.parti.designMd ? "yes" : "no"}</td>
              </tr>
            </tbody>
          </table>

          <div className="label" style={{ marginTop: "var(--s-8)" }}>
            Dimension breakdown
          </div>
          <div className="pv__dims">
            {(Object.keys(DIMENSION_LABEL) as (keyof typeof DIMENSION_LABEL)[]).map((k) => (
              <div key={k} className="pv__dim">
                <div className="small">{DIMENSION_LABEL[k]}</div>
                <div className="pv__dimRow">
                  <span className="strip dim">{MEASURED.baseline.dimensions[k]}</span>
                  <Bar value={MEASURED.baseline.dimensions[k]} max={DIMENSION_MAX[k]} />
                </div>
                <div className="pv__dimRow">
                  <span className="strip" style={{ color: "var(--advisory)" }}>
                    {MEASURED.parti.dimensions[k]}
                  </span>
                  <Bar value={MEASURED.parti.dimensions[k]} max={DIMENSION_MAX[k]} />
                </div>
              </div>
            ))}
          </div>

          <div className="pv__caveat">
            <div className="label" style={{ color: "var(--caution)" }}>
              Read this before quoting the numbers
            </div>
            <p className="small muted measure" style={{ marginBottom: 0 }}>
              These are <strong>regression guards, not design-quality verdicts</strong>. The
              detector and the generator share a tell list, so the parti arm is partly being
              graded by its own checklist. A higher score means fewer things from a list of known
              problems shipped — not that a dispatcher would rather use it. The baseline here is
              genuinely good work, and the numbers should not be read as saying otherwise.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
