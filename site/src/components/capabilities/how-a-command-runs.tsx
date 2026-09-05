/**
 * The visual definition of the skill, above the command list.
 *
 * Two facts the reader needs before the taxonomy makes sense: (1) every command
 * splits into a measured half that scripts produce and a judged half the agent
 * produces, and the report never blends them; (2) the one command that reads a
 * live URL — `reference` — runs a three-tier pipeline that stops as soon as the
 * stated focus is answered.
 *
 * Static. No client JS — it is a diagram, not a control.
 */

function Half({
  label,
  by,
  items,
  accent,
}: {
  label: string;
  by: string;
  items: string[];
  accent?: boolean;
}) {
  return (
    <div className="flex-1 rounded-xl border border-rule bg-plate p-3">
      <p className="plate-label mb-0.5 text-ink">{label}</p>
      <p className="mb-2 text-[0.75rem] text-ink-dim">{by}</p>
      <ul className="flex flex-wrap gap-1">
        {items.map((it) => (
          <li
            key={it}
            className={
              "rounded-full px-2 py-0.5 font-mono text-[0.625rem] " +
              (accent
                ? "bg-mark-tint text-mark"
                : "bg-plate-2 text-ink-muted")
            }
          >
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Tier({
  n,
  name,
  runs,
  sees,
}: {
  n: string;
  name: string;
  runs: string;
  sees: string;
}) {
  return (
    <div className="grid grid-cols-[2.5rem_1fr] gap-x-3 gap-y-0.5 border-t border-rule/60 py-2.5 first:border-0">
      <span className="row-span-2 font-mono text-[1.0625rem] text-rule-strong tabular">
        {n}
      </span>
      <p className="text-[0.8125rem] text-ink">
        <span className="font-medium">{name}</span>
        <span className="text-ink-dim"> — {runs}</span>
      </p>
      <p className="text-[0.75rem] leading-snug text-ink-muted">{sees}</p>
    </div>
  );
}

export function HowACommandRuns() {
  return (
    <div className="mb-12 grid gap-4 md:grid-cols-2">
      <section className="rounded-2xl border border-rule bg-plate-2 p-4">
        <p className="plate-label mb-1">Every command has two halves</p>
        <p className="mb-3 max-w-[46ch] text-[0.8125rem] leading-snug text-ink-muted">
          A contrast ratio is a fact; &ldquo;is there a thesis&rdquo; is a
          judgement. The report states both and never averages them — averaging
          hides which is which.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Half
            label="Measured"
            by="6 scripts · deterministic · reproducible"
            items={[
              "audit.py",
              "score.py",
              "color.py",
              "motion.py",
              "lint.py",
              "capture.py",
            ]}
          />
          <Half
            label="Judged"
            by="the agent · with written evidence"
            accent
            items={[
              "hierarchy",
              "signature",
              "content fit",
              "copy",
              "state coverage",
              "concept",
            ]}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-rule bg-plate-2 p-4">
        <p className="plate-label mb-1">
          <code className="font-mono text-mark">reference</code> — three tiers,
          cheapest first
        </p>
        <p className="mb-2 max-w-[46ch] text-[0.8125rem] leading-snug text-ink-muted">
          Reads a live URL for motion. Stops as soon as the stated focus is
          answered; the report always records which tier ran and what it could
          not see.
        </p>
        <div className="rounded-xl border border-rule bg-plate px-3 py-1">
          <Tier
            n="1"
            name="static"
            runs="stdlib, always"
            sees="@keyframes with from/to values, transition / animation shorthand, library fingerprint. Blind to JS-driven motion."
          />
          <Tier
            n="2"
            name="runtime"
            runs="headless Chromium"
            sees="getAnimations() re-read at 14 scroll steps → reveals tagged in-view / scroll with measured duration + easing; ScrollTrigger.getAll(); the focus element's DOM + states."
          />
          <Tier
            n="3"
            name="agent"
            runs="MCP browser, no Playwright"
            sees="the same dumps, pasted through whatever browser tool the harness has. Stamped tier 3 (agent-captured)."
          />
        </div>
      </section>
    </div>
  );
}
