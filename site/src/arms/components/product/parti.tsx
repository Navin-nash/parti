"use client";

/* ============================================================================
 * DIRECTION — "As Restated"
 *
 * THESIS
 *   A serious investor's discipline is not knowing today's number; it is being
 *   able to answer "what did I record, when, and what has been corrected since."
 *   So no value in this workspace is allowed to simply change. It is superseded
 *   in public — the prior figure stays on the page, ruled off and dated, the way
 *   a ledger never erases and a 10-K/A prints "as previously reported" beside
 *   "as restated." The interface is the audit trail, not the quote.
 *
 * SIX AXES
 *   Density        dense — 6 positions, filings, thesis, revisions and figures
 *                  on one screen. 30px rows, 13px body, 11px labels. These are
 *                  experts opening this daily-to-weekly; whitespace that helps a
 *                  first-timer costs a returning reader a scroll every session.
 *   Structure      ruled bands, not cards. Horizontal hairlines run edge to
 *                  edge and vertical hairlines cut the columns; nothing is a
 *                  box floating on a ground. Reason: an accounting page has no
 *                  cards. Its hierarchy is entirely which rule is heavier, and
 *                  a grand total is marked by a double rule, not a chip.
 *   Type voice     three faces, three jobs. Prose is serif (Georgia stack) —
 *                  a thesis is something you wrote and will re-read, and its
 *                  oldstyle figures deliberately refuse to look like data.
 *                  Labels are sans, 11px, uppercase, tracked — the caption
 *                  voice of a statement schedule. Every figure is tabular mono.
 *                  No display face: this subject has no announcing voice.
 *   Chroma         achromatic ground, two marks, and no P&L colour at all.
 *                  Ink blue = current and reconciled. Ochre = revised, stale,
 *                  or awaiting your judgement. Losses are set in parentheses,
 *                  the actual accounting convention, so direction survives
 *                  greyscale and colour-blindness with no legend. Green/red
 *                  would make a −1.87% afternoon shout louder than an open
 *                  question in a five-year thesis; that is a broker's ranking,
 *                  and this executes no trades.
 *   Motion posture still, with exactly one moment — the rule-off (below).
 *                  A document does not animate. Posting a correction is a real
 *                  event and earns the only movement in the system.
 *   Depth          flat, zero shadow, zero radius. The whole elevation scale is
 *                  three rule weights: hairline (--p-rule), boundary
 *                  (--p-rule2), heavy 2px (ink). Overlays separate from the page
 *                  with a scrim plus a 2px top rule instead of a drop shadow,
 *                  so the layering language is the same one the tables use.
 *
 * SIGNATURE — the restatement pair
 *   Any figure that has moved carries its superseded value directly above it,
 *   dimmed, dated, and ruled off by a 1px line that draws left-to-right on
 *   mount (260ms, --p-ease, motion-reduce honoured). The label reads AS
 *   PREVIOUSLY RECORDED, in words, so the meaning never depends on the line.
 *   It belongs to THIS subject because restatement is a literal artifact of the
 *   filings these people read, and because the only question a multi-year
 *   holder actually asks on re-entry is "what changed, and when." A broker UI
 *   cannot have this element: it has no memory of what you believed before.
 *
 * WHAT IT GIVES UP
 *   The at-a-glance emotional read of P&L, on purpose. Screenshot appeal — this
 *   photographs as a tax form. Any hospitality toward a novice: parentheses,
 *   double rules and "as previously recorded" are conventions you either know
 *   or have to learn. Card boundaries, which means components composed on a busy
 *   page have no containment to lean on and must be spaced by rule alone. And
 *   the paired-column reading breaks below ~480px, where the ledger has to
 *   linearise and the direction is at its weakest.
 * ==========================================================================*/

import * as React from "react";
import {
  AlertTriangle,
  Check,
  ChevronDown,
  Copy,
  Filter,
  Minus,
  PenLine,
  Search,
  X,
} from "@/lib/icons";

/* ------------------------------------------------------------------ */
/* tokens — declared inline on every component root                    */
/* ------------------------------------------------------------------ */

const pVars = {
  /* ground + surface */
  "--p-ground": "#EDEFEE",
  "--p-ground-d": "#131513",
  "--p-surf": "#F7F8F7",
  "--p-surf-d": "#1A1D1B",
  /* ink — verified 15.58 / 6.48 / 4.51 on ground */
  "--p-ink": "#14171A",
  "--p-ink-d": "#E9EBE7",
  "--p-ink2": "#4E565B",
  "--p-ink2-d": "#A9B1AB",
  "--p-ink3": "#656E73",
  "--p-ink3-d": "#8B948E",
  /* rules — the entire elevation scale */
  "--p-rule": "#C6CCC8",
  "--p-rule-d": "#2E332F",
  "--p-rule2": "#7E8780",
  "--p-rule2-d": "#636B64",
  /* two marks, no P&L colour */
  "--p-mark": "#1F4E79",
  "--p-mark-d": "#8CB6DC",
  "--p-mark-on": "#FFFFFF",
  "--p-mark-on-d": "#131513",
  "--p-rev": "#8A5A12",
  "--p-rev-d": "#D6A64A",
  "--p-rev-bg": "#F3EAD8",
  "--p-rev-bg-d": "#2B2313",
  "--p-scrim": "rgba(20,23,26,0.46)",
  /* type — 13px base, ratio 1.2, rounded to whole px */
  "--p-t-micro": "10px",
  "--p-t-label": "11px",
  "--p-t-body": "13px",
  "--p-t-lg": "16px",
  "--p-t-fig": "19px",
  "--p-t-disp": "22px",
  /* space — 4px base */
  "--p-s1": "4px",
  "--p-s2": "8px",
  "--p-s3": "12px",
  "--p-s4": "16px",
  "--p-s5": "24px",
  "--p-s6": "32px",
  "--p-row": "30px",
  /* motion — one moment only */
  "--p-dur": "180ms",
  "--p-dur-rule": "260ms",
  "--p-ease": "cubic-bezier(0.2,0,0,1)",
  /* faces */
  "--p-serif": 'Georgia, "Iowan Old Style", "Times New Roman", serif',
  "--p-sans": 'ui-sans-serif, system-ui, "Segoe UI", Roboto, sans-serif',
  "--p-mono": 'ui-monospace, "SF Mono", Menlo, Consolas, monospace',
  fontFamily: "var(--p-sans)",
} as React.CSSProperties;

const TX = "text-[var(--p-ink)] dark:text-[var(--p-ink-d)]";
const TX2 = "text-[var(--p-ink2)] dark:text-[var(--p-ink2-d)]";
const TX3 = "text-[var(--p-ink3)] dark:text-[var(--p-ink3-d)]";
const RV = "text-[var(--p-rev)] dark:text-[var(--p-rev-d)]";
const RULE = "border-[var(--p-rule)] dark:border-[var(--p-rule-d)]";
const RULE2 = "border-[var(--p-rule2)] dark:border-[var(--p-rule2-d)]";
const SURF = "bg-[var(--p-surf)] dark:bg-[var(--p-surf-d)]";
const GROUND = "bg-[var(--p-ground)] dark:bg-[var(--p-ground-d)]";
/** Fields and panels: focus ring only — a text field must not shift under a drag-select. */
const FOCUS_FIELD =
  "outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--p-mark)] dark:focus-visible:outline-[var(--p-mark-d)]";
/** Anything pressable also acknowledges the press: one pixel down, like a key. */
const FOCUS = `${FOCUS_FIELD} [&:active]:translate-y-[1px]`;
const LBL = `text-[length:var(--p-t-label)] uppercase tracking-[0.09em] ${TX3}`;

const mono: React.CSSProperties = {
  fontFamily: "var(--p-mono)",
  fontVariantNumeric: "tabular-nums",
};
const serif: React.CSSProperties = { fontFamily: "var(--p-serif)" };

/* ------------------------------------------------------------------ */
/* data                                                                */
/* ------------------------------------------------------------------ */

type Position = {
  ticker: string;
  name: string;
  shares: number;
  cost: number;
  last: number;
  day: number;
  weight: number;
  held: string;
  /** prior recorded cost basis, kept visible where it was restated */
  priorCost?: { value: number; on: string; why: string };
};

const POSITIONS: Position[] = [
  { ticker: "SSNC", name: "SS&C Technologies", shares: 420, cost: 61.4, last: 78.42, day: 0.42, weight: 12.2, held: "4y 2m" },
  { ticker: "WCC", name: "Wesco International", shares: 210, cost: 142.1, last: 186.35, day: -1.87, weight: 14.5, held: "2y 7m", priorCost: { value: 138.4, on: "19 Mar 2024", why: "added 40 sh at 161.55" } },
  { ticker: "EVR", name: "Evercore Inc.", shares: 95, cost: 171.8, last: 268.1, day: 0.94, weight: 9.4, held: "3y 1m" },
  { ticker: "TPL", name: "Texas Pacific Land", shares: 24, cost: 640.0, last: 1042.6, day: -0.31, weight: 9.3, held: "3y 10m" },
  { ticker: "AMBP", name: "Ardagh Metal Packaging", shares: 6400, cost: 3.12, last: 3.94, day: 2.08, weight: 9.3, held: "1y 11m" },
  { ticker: "IESC", name: "IES Holdings", shares: 180, cost: 88.5, last: 214.3, day: -0.64, weight: 14.3, held: "2y 4m", priorCost: { value: 74.2, on: "08 Nov 2023", why: "averaged up, 60 sh at 131.10" } },
];

const WCC_SERIES = [
  148.2, 152.6, 149.8, 158.4, 163.1, 159.7, 166.2, 171.5, 168.9, 174.3, 179.6,
  176.2, 182.4, 188.1, 184.7, 190.6, 186.35,
];

/** Accounting convention: negatives in parentheses, never in red. */
const fig = (n: number, d = 2) =>
  n < 0
    ? `(${Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d })})`
    : n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });

const figPct = (n: number) => (n < 0 ? `(${Math.abs(n).toFixed(2)})%` : `${n.toFixed(2)}%`);

/* ------------------------------------------------------------------ */
/* signature — the restatement pair                                    */
/* ------------------------------------------------------------------ */

/** Honoured in JS as well as in the `motion-reduce:` variants, so the rule-off
 *  arrives already drawn rather than drawing, for anyone who asked for that. */
function useReducedMotion() {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return reduced;
}

/**
 * The one moment of motion in the system: a 1px rule draws left-to-right
 * across a superseded figure, the way an entry is ruled off rather than
 * erased. The meaning is carried by the visible AS PREVIOUSLY RECORDED
 * label, never by the line alone.
 */
function RuledOff({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const reduced = useReducedMotion();
  const [drawn, setDrawn] = React.useState(false);
  React.useEffect(() => {
    // Reduced motion arrives already drawn; a 0ms timeout keeps the setState
    // in a callback either way, rather than one branch calling it inline.
    const t = window.setTimeout(() => setDrawn(true), reduced ? 0 : 140 + delay);
    return () => window.clearTimeout(t);
  }, [delay, reduced]);
  return (
    <span className="relative inline-block">
      <span className={TX3} style={mono}>
        {children}
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-1/2 h-px w-full origin-left bg-[var(--p-ink3)] transition-transform motion-reduce:transition-none dark:bg-[var(--p-ink3-d)]"
        style={{
          transform: `scaleX(${drawn ? 1 : 0})`,
          transitionDuration: reduced ? "0ms" : "var(--p-dur-rule)",
          transitionTimingFunction: "var(--p-ease)",
        }}
      />
    </span>
  );
}

function Restated({
  now,
  prior,
  on,
  align = "left",
  delay = 0,
}: {
  now: React.ReactNode;
  prior: React.ReactNode;
  on: string;
  align?: "left" | "right";
  delay?: number;
}) {
  return (
    <div className={align === "right" ? "text-right" : ""}>
      <p className={`${LBL} text-[length:var(--p-t-micro)]`}>As previously recorded</p>
      <p className="mt-[2px] text-[length:var(--p-t-body)]">
        <RuledOff delay={delay}>{prior}</RuledOff>
        <span className={`ml-[var(--p-s2)] text-[length:var(--p-t-micro)] ${TX3}`}>{on}</span>
      </p>
      <p className={`mt-[var(--p-s1)] text-[length:var(--p-t-fig)] ${TX}`} style={mono}>
        {now}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 1. Dashboard header                                                 */
/* ------------------------------------------------------------------ */

export function DashboardHeaderParti() {
  const [tab, setTab] = React.useState("Ledger");
  return (
    <header
      style={pVars}
      className={`w-full border ${RULE2} ${SURF} ${TX}`}
    >
      <div className={`flex flex-wrap items-baseline gap-x-[var(--p-s5)] gap-y-[var(--p-s2)] border-b ${RULE} px-[var(--p-s4)] py-[var(--p-s3)]`}>
        <span className="text-[length:var(--p-t-lg)] uppercase tracking-[0.16em]">Ledgerline</span>
        <span className={`${LBL}`}>Personal book · no execution</span>
        <span className={`ml-auto ${LBL}`} style={mono}>
          As of 14:22:06 ET · Mon 01 Sep 2025
        </span>
      </div>

      <div className={`flex flex-wrap items-end justify-between gap-[var(--p-s4)] border-b ${RULE} px-[var(--p-s4)] py-[var(--p-s3)]`}>
        <Restated
          now="$270,075.42"
          prior="$271,215.08"
          on="close 29 Aug"
          delay={0}
        />
        <dl className={`flex gap-[var(--p-s5)] border-l ${RULE} pl-[var(--p-s4)]`}>
          {[
            ["Cash", "$83,723.11", "31.0% of book"],
            ["Positions", "6", "median hold 2y 7m"],
            ["Unreconciled", "1", "IESC lot split"],
          ].map(([k, v, s]) => (
            <div key={k}>
              <dt className={LBL}>{k}</dt>
              <dd className={`mt-[var(--p-s1)] text-[length:var(--p-t-lg)] ${TX}`} style={mono}>
                {v}
              </dd>
              <dd className={`text-[length:var(--p-t-micro)] ${TX3}`}>{s}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="flex flex-wrap items-stretch">
        <nav aria-label="Workspace" className="flex">
          {["Ledger", "Theses", "Filings", "Watchlist"].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              aria-current={tab === t ? "page" : undefined}
              className={`${FOCUS} border-r ${RULE} px-[var(--p-s4)] py-[var(--p-s3)] text-[length:var(--p-t-body)] ${
                tab === t
                  ? `border-b-2 border-b-[var(--p-ink)] dark:border-b-[var(--p-ink-d)] ${TX}`
                  : `${TX2} hover:bg-[var(--p-ground)] dark:hover:bg-[var(--p-ground-d)]`
              }`}
            >
              {t}
            </button>
          ))}
        </nav>
        <div className={`ml-auto flex items-center gap-[var(--p-s2)] border-l ${RULE} px-[var(--p-s3)] py-[var(--p-s2)]`}>
          <label htmlFor="p-hdr-q" className="sr-only">
            Search companies, filings and notes
          </label>
          <Search className={`h-4 w-4 ${TX3}`} aria-hidden="true" />
          <input
            id="p-hdr-q"
            type="search"
            placeholder="WCC 10-Q, backlog…"
            className={`${FOCUS_FIELD} h-8 w-44 border ${RULE2} ${GROUND} px-[var(--p-s2)] text-[length:var(--p-t-body)] ${TX} placeholder:text-[var(--p-ink3)] dark:placeholder:text-[var(--p-ink3-d)]`}
            style={mono}
          />
          <button
            type="button"
            className={`${FOCUS} h-8 border border-[var(--p-mark)] bg-[var(--p-mark)] px-[var(--p-s3)] text-[length:var(--p-t-body)] text-[var(--p-mark-on)] hover:bg-[var(--p-ink)] hover:border-[var(--p-ink)] dark:border-[var(--p-mark-d)] dark:bg-[var(--p-mark-d)] dark:text-[var(--p-mark-on-d)] dark:hover:bg-[var(--p-ink-d)] dark:hover:border-[var(--p-ink-d)]`}
          >
            Post entry
          </button>
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Sidebar — a ruled index, figures right-aligned                   */
/* ------------------------------------------------------------------ */

export function SidebarParti() {
  const [open, setOpen] = React.useState(true);
  const [active, setActive] = React.useState("WCC");

  const index: [string, { label: string; fig: string; rev?: boolean }[]][] = [
    ["Book", [
      { label: "Positions", fig: "6" },
      { label: "Watchlist", fig: "11" },
      { label: "Cash", fig: "31.0%" },
    ]],
    ["Unread", [
      { label: "Filings", fig: "4", rev: true },
      { label: "Transcripts", fig: "1" },
    ]],
  ];

  return (
    <aside
      style={pVars}
      aria-label="Workspace index"
      className={`w-64 border ${RULE2} ${SURF} ${TX}`}
    >
      {index.map(([group, rows]) => (
        <section key={group}>
          <h2 className={`${LBL} border-b ${RULE} px-[var(--p-s3)] py-[var(--p-s2)]`}>{group}</h2>
          <ul>
            {rows.map((r) => (
              <li key={r.label}>
                <button
                  type="button"
                  className={`${FOCUS} flex w-full items-baseline justify-between border-b ${RULE} px-[var(--p-s3)] py-[var(--p-s2)] text-left text-[length:var(--p-t-body)] ${TX2} hover:bg-[var(--p-ground)] dark:hover:bg-[var(--p-ground-d)]`}
                >
                  <span>{r.label}</span>
                  <span className={r.rev ? RV : TX} style={mono}>
                    {r.fig}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="p-side-theses"
        className={`${FOCUS} flex w-full items-center justify-between border-b ${RULE} px-[var(--p-s3)] py-[var(--p-s2)] ${LBL}`}
      >
        <span>Open theses</span>
        <ChevronDown
          className={`h-3 w-3 transition-transform motion-reduce:transition-none ${open ? "" : "-rotate-90"}`}
          style={{ transitionDuration: "var(--p-dur)", transitionTimingFunction: "var(--p-ease)" }}
          aria-hidden="true"
        />
      </button>
      {open && (
        <ul id="p-side-theses">
          {[
            { t: "WCC", rev: "rev. 3", age: "14d", stale: false },
            { t: "IESC", rev: "rev. 5", age: "6d", stale: false },
            { t: "AMBP", rev: "rev. 1", age: "41d", stale: true },
          ].map((it) => (
            <li key={it.t}>
              <button
                type="button"
                onClick={() => setActive(it.t)}
                aria-current={active === it.t ? "true" : undefined}
                className={`${FOCUS} flex w-full items-baseline gap-[var(--p-s2)] border-b ${RULE} px-[var(--p-s3)] py-[var(--p-s2)] text-left text-[length:var(--p-t-body)] ${
                  active === it.t
                    ? `border-l-2 border-l-[var(--p-ink)] ${TX} dark:border-l-[var(--p-ink-d)]`
                    : `${TX2} hover:bg-[var(--p-ground)] dark:hover:bg-[var(--p-ground-d)]`
                }`}
              >
                <span style={mono}>{it.t}</span>
                <span className={`text-[length:var(--p-t-micro)] ${TX3}`}>{it.rev}</span>
                <span
                  className={`ml-auto text-[length:var(--p-t-micro)] ${it.stale ? RV : TX3}`}
                  style={mono}
                >
                  {it.stale ? `${it.age} stale` : it.age}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className={`px-[var(--p-s3)] py-[var(--p-s2)] text-[length:var(--p-t-micro)] ${TX3}`} style={mono}>
        Reconciled 14:22 · quotes delayed 15m
      </p>
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Stat band — four ruled columns, not four cards                   */
/* ------------------------------------------------------------------ */

export function StatCardsParti() {
  const cols = [
    { label: "Book value", now: "$270,075.42", prior: "$271,215.08", on: "29 Aug close" },
    { label: "Equities at mark", now: "$186,352.31", prior: "$187,491.97", on: "29 Aug close" },
    { label: "Unrealised", now: "$61,209.44", prior: "$62,349.10", on: "29 Aug close" },
    { label: "Cost basis posted", now: "$125,142.87", prior: "$120,908.12", on: "19 Mar 2024" },
  ];

  return (
    <section
      style={pVars}
      aria-label="Book summary, restated against the last reconciled close"
      className={`border ${RULE2} ${SURF} ${TX}`}
    >
      <div className={`flex items-baseline justify-between border-b ${RULE} px-[var(--p-s4)] py-[var(--p-s2)]`}>
        <h2 className={LBL}>Summary of book</h2>
        <span className={`${LBL}`} style={mono}>
          Restated 01 Sep 14:22 ET
        </span>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4">
        {cols.map((c, i) => (
          <div
            key={c.label}
            className={`border-b ${RULE} px-[var(--p-s4)] py-[var(--p-s3)] lg:border-b-0 ${
              i % 2 === 1 ? `border-l ${RULE}` : ""
            } ${i > 0 ? `lg:border-l ${RULE}` : ""}`}
          >
            <p className={LBL}>{c.label}</p>
            <div className="mt-[var(--p-s2)]">
              <Restated now={c.now} prior={c.prior} on={c.on} delay={i * 70} />
            </div>
          </div>
        ))}
      </div>
      <p className={`border-t-2 border-[var(--p-ink)] px-[var(--p-s4)] py-[var(--p-s2)] text-[length:var(--p-t-micro)] ${TX2} dark:border-[var(--p-ink-d)]`}>
        Figures are marks, not proceeds. Nothing here is an order.
      </p>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Data table — ledger rules, parenthesised negatives, double-rule  */
/*    total                                                            */
/* ------------------------------------------------------------------ */

export function DataTableParti() {
  const [sort, setSort] = React.useState<{ key: keyof Position; dir: 1 | -1 }>({
    key: "weight",
    dir: -1,
  });
  const [showRestated, setShowRestated] = React.useState(true);

  const rows = React.useMemo(() => {
    const copy = [...POSITIONS];
    copy.sort((a, b) => {
      const x = a[sort.key];
      const y = b[sort.key];
      if (typeof x === "number" && typeof y === "number") return (x - y) * sort.dir;
      return String(x).localeCompare(String(y)) * sort.dir;
    });
    return copy;
  }, [sort]);

  const toggle = (key: keyof Position) =>
    setSort((s) => (s.key === key ? { key, dir: (s.dir * -1) as 1 | -1 } : { key, dir: -1 }));

  const cols: { key: keyof Position; label: string; num?: boolean }[] = [
    { key: "ticker", label: "Entry" },
    { key: "shares", label: "Shares", num: true },
    { key: "cost", label: "Cost basis", num: true },
    { key: "last", label: "Mark", num: true },
    { key: "day", label: "Session", num: true },
    { key: "weight", label: "Weight", num: true },
  ];

  const total = POSITIONS.reduce((a, p) => a + p.shares * p.last, 0);

  return (
    <section style={pVars} className={`border ${RULE2} ${SURF} ${TX}`}>
      <div className={`flex flex-wrap items-baseline justify-between gap-[var(--p-s3)] border-b ${RULE} px-[var(--p-s4)] py-[var(--p-s2)]`}>
        <h2 className={LBL}>Schedule of positions · 6 entries</h2>
        <label className={`flex items-center gap-[var(--p-s2)] text-[length:var(--p-t-body)] ${TX2}`}>
          <input
            type="checkbox"
            checked={showRestated}
            onChange={(e) => setShowRestated(e.target.checked)}
            className={`${FOCUS} h-3.5 w-3.5 rounded-none accent-[var(--p-mark)] dark:accent-[var(--p-mark-d)]`}
          />
          Show restated cost basis
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[length:var(--p-t-body)]">
          <caption className="sr-only">
            Positions with cost basis, mark, session move and weight. Negative figures are shown in
            parentheses.
          </caption>
          <thead>
            <tr className={`border-b-2 border-[var(--p-ink)] dark:border-[var(--p-ink-d)]`}>
              {cols.map((c) => (
                <th
                  key={c.key}
                  scope="col"
                  aria-sort={sort.key === c.key ? (sort.dir === 1 ? "ascending" : "descending") : "none"}
                  className={`border-r ${RULE} px-[var(--p-s3)] py-[var(--p-s2)] last:border-r-0 ${
                    c.num ? "text-right" : "text-left"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggle(c.key)}
                    className={`${FOCUS} ${LBL} ${sort.key === c.key ? `${TX} underline underline-offset-2` : ""}`}
                  >
                    {c.label}
                    {sort.key === c.key ? (sort.dir === 1 ? " ↑" : " ↓") : ""}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr
                key={p.ticker}
                className={`border-b ${RULE} hover:bg-[var(--p-ground)] dark:hover:bg-[var(--p-ground-d)]`}
              >
                <th scope="row" className={`border-r ${RULE} px-[var(--p-s3)] py-[var(--p-s2)] text-left font-normal`}>
                  <span className={TX} style={mono}>
                    {p.ticker}
                  </span>
                  <span className={`ml-[var(--p-s2)] text-[length:var(--p-t-micro)] ${TX3}`}>
                    {p.name} · held {p.held}
                  </span>
                </th>
                <td className={`border-r ${RULE} px-[var(--p-s3)] py-[var(--p-s2)] text-right ${TX2}`} style={mono}>
                  {p.shares.toLocaleString("en-US")}
                </td>
                <td className={`border-r ${RULE} px-[var(--p-s3)] py-[var(--p-s2)] text-right ${TX2}`} style={mono}>
                  {showRestated && p.priorCost ? (
                    <span className="flex flex-col items-end">
                      <RuledOff>{fig(p.priorCost.value)}</RuledOff>
                      <span className={`text-[length:var(--p-t-micro)] ${TX3}`}>
                        prev. rec. {p.priorCost.on}
                      </span>
                      <span className={TX}>{fig(p.cost)}</span>
                    </span>
                  ) : (
                    fig(p.cost)
                  )}
                </td>
                <td className={`border-r ${RULE} px-[var(--p-s3)] py-[var(--p-s2)] text-right ${TX}`} style={mono}>
                  {fig(p.last)}
                </td>
                <td className={`border-r ${RULE} px-[var(--p-s3)] py-[var(--p-s2)] text-right ${TX2}`} style={mono}>
                  {figPct(p.day)}
                </td>
                <td className={`px-[var(--p-s3)] py-[var(--p-s2)] text-right ${TX2}`} style={mono}>
                  {p.weight.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            {/* single rule above a total, double rule below — the accounting convention */}
            <tr className="border-t-2 border-[var(--p-ink)] dark:border-[var(--p-ink-d)]">
              <th scope="row" className={`px-[var(--p-s3)] py-[var(--p-s2)] text-left ${LBL} ${TX}`}>
                Marked value of entries
              </th>
              <td colSpan={4} />
              <td
                className={`border-b-4 border-double border-[var(--p-ink)] px-[var(--p-s3)] py-[var(--p-s2)] text-right ${TX} dark:border-[var(--p-ink-d)]`}
                style={mono}
              >
                ${fig(total, 0)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <p className={`px-[var(--p-s4)] py-[var(--p-s2)] text-[length:var(--p-t-micro)] ${TX3}`}>
        Negatives in parentheses. Cash of $83,723.11 excluded from this schedule. Marks delayed 15
        minutes; cost basis is your posted entry, not the broker&rsquo;s.
      </p>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 5. Chart panel — 1px stroke, dashed cost rule, no gradient fill     */
/* ------------------------------------------------------------------ */

export function ChartPanelParti() {
  const [range, setRange] = React.useState("6M");
  const w = 820;
  const h = 200;
  const min = Math.min(...WCC_SERIES) - 6;
  const max = Math.max(...WCC_SERIES) + 6;
  const y = (v: number) => h - ((v - min) / (max - min)) * h;
  const pts = WCC_SERIES.map((v, i) => `${((i / (WCC_SERIES.length - 1)) * w).toFixed(1)},${y(v).toFixed(1)}`).join(" ");

  return (
    <section style={pVars} className={`border ${RULE2} ${SURF} ${TX}`}>
      <div className={`flex flex-wrap items-end justify-between gap-[var(--p-s3)] border-b ${RULE} px-[var(--p-s4)] py-[var(--p-s3)]`}>
        <div>
          <p className={LBL}>Wesco International · mark history</p>
          <p className="mt-[var(--p-s1)] flex items-baseline gap-[var(--p-s2)]">
            <span className="text-[length:var(--p-t-disp)]" style={mono}>
              WCC
            </span>
            <span className={`text-[length:var(--p-t-fig)] ${TX}`} style={mono}>
              186.35
            </span>
            <span className={`text-[length:var(--p-t-body)] ${TX2}`} style={mono}>
              {figPct(-1.87)} session
            </span>
          </p>
        </div>
        <div role="group" aria-label="Range" className={`flex border ${RULE2}`}>
          {["1M", "6M", "1Y", "5Y", "Since entry"].map((r) => (
            <button
              key={r}
              type="button"
              aria-pressed={range === r}
              onClick={() => setRange(r)}
              className={`${FOCUS} border-r ${RULE} px-[var(--p-s3)] py-[var(--p-s1)] text-[length:var(--p-t-label)] last:border-r-0 ${
                range === r
                  ? "bg-[var(--p-ink)] text-[var(--p-surf)] dark:bg-[var(--p-ink-d)] dark:text-[var(--p-surf-d)]"
                  : `${TX2} hover:bg-[var(--p-ground)] dark:hover:bg-[var(--p-ground-d)]`
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="px-[var(--p-s4)] py-[var(--p-s3)]">
        <svg
          viewBox={`0 0 ${w} ${h}`}
          className="h-48 w-full"
          role="img"
          aria-label="WCC marked at 186.35, against a posted cost basis of 142.10. Range six months, from 148.20 in March."
          preserveAspectRatio="none"
        >
          {[0, 0.5, 1].map((f) => (
            <line
              key={f}
              x1="0"
              x2={w}
              y1={h * f}
              y2={h * f}
              stroke="var(--p-rule)"
              className="dark:[stroke:var(--p-rule-d)]"
              strokeWidth="1"
            />
          ))}
          <line
            x1="0"
            x2={w}
            y1={y(142.1)}
            y2={y(142.1)}
            stroke="var(--p-rev)"
            className="dark:[stroke:var(--p-rev-d)]"
            strokeWidth="1"
            strokeDasharray="5 4"
          />
          <polyline
            points={pts}
            fill="none"
            stroke="var(--p-ink)"
            className="dark:[stroke:var(--p-ink-d)]"
            strokeWidth="1.25"
            strokeLinejoin="miter"
          />
        </svg>
        <div className={`mt-[var(--p-s2)] flex justify-between border-t ${RULE} pt-[var(--p-s1)] text-[length:var(--p-t-micro)] ${TX3}`} style={mono}>
          {["Mar", "Apr", "May", "Jun", "Jul", "Aug"].map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
      </div>

      <dl className={`grid grid-cols-3 border-t ${RULE}`}>
        {[
          ["Posted cost", "142.10", "dashed rule above"],
          ["Entered", "12 Feb 2023", "210 sh across 2 lots"],
          ["Thesis revised", "18 Aug 2025", "rev. 3, backlog"],
        ].map(([k, v, s], i) => (
          <div key={k} className={`px-[var(--p-s4)] py-[var(--p-s2)] ${i > 0 ? `border-l ${RULE}` : ""}`}>
            <dt className={LBL}>{k}</dt>
            <dd className={`mt-[2px] text-[length:var(--p-t-body)] ${TX}`} style={mono}>
              {v}
            </dd>
            <dd className={`text-[length:var(--p-t-micro)] ${TX3}`}>{s}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 6. Filter bar — a query line that states what it withheld           */
/* ------------------------------------------------------------------ */

export function FilterBarParti() {
  const [chips, setChips] = React.useState([
    { field: "type", op: "=", value: "10-Q, 8-K" },
    { field: "filed", op: "≥", value: "01 Jun 2025" },
    { field: "held", op: "=", value: "true" },
  ]);

  return (
    <div style={pVars} className={`border ${RULE2} ${SURF} ${TX}`}>
      <div className={`flex flex-wrap items-center gap-[var(--p-s2)] border-b ${RULE} px-[var(--p-s3)] py-[var(--p-s2)]`}>
        <Filter className={`h-3.5 w-3.5 ${TX3}`} aria-hidden="true" />
        <span className={LBL}>Showing rows where</span>
        {chips.map((c, i) => (
          <span
            key={c.field}
            className={`flex items-center border ${RULE2} ${GROUND} text-[length:var(--p-t-body)]`}
          >
            <span className={`px-[var(--p-s2)] py-[2px] ${TX}`} style={mono}>
              {c.field} {c.op} {c.value}
            </span>
            <button
              type="button"
              aria-label={`Remove condition ${c.field} ${c.op} ${c.value}`}
              onClick={() => setChips((prev) => prev.filter((x) => x.field !== c.field))}
              className={`${FOCUS} border-l ${RULE2} px-[var(--p-s1)] py-[var(--p-s1)] ${TX2} hover:bg-[var(--p-rev-bg)] dark:hover:bg-[var(--p-rev-bg-d)]`}
            >
              <X className="h-3 w-3" aria-hidden="true" />
            </button>
            {i < chips.length - 1 && (
              <span className={`sr-only`}>and</span>
            )}
          </span>
        ))}
        {chips.length === 0 && (
          <span className={`text-[length:var(--p-t-body)] ${TX2}`} style={mono}>
            (no conditions — all 41 filings shown)
          </span>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-[var(--p-s2)] px-[var(--p-s3)] py-[var(--p-s2)]">
        <p className={`text-[length:var(--p-t-micro)] ${TX3}`} style={mono}>
          {chips.length === 0
            ? "41 of 41 filings · nothing withheld"
            : `9 of 41 filings shown · 32 withheld by ${chips.length} condition${chips.length > 1 ? "s" : ""}`}
        </p>
        {chips.length > 0 && (
          <button
            type="button"
            onClick={() => setChips([])}
            className={`${FOCUS} border ${RULE2} px-[var(--p-s2)] py-[2px] text-[length:var(--p-t-label)] ${TX2} hover:bg-[var(--p-ground)] dark:hover:bg-[var(--p-ground-d)]`}
          >
            Clear all conditions
          </button>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 7. Search                                                           */
/* ------------------------------------------------------------------ */

export function SearchParti() {
  const [q, setQ] = React.useState("wcc backlog");
  const all = [
    { kind: "POS", title: "Wesco International", meta: "210 sh · cost 142.10 · held 2y 7m" },
    { kind: "10-Q", title: "WCC Q2 2025 — cash conversion cycle", meta: "Filed 29 Aug 2025 · 3 days ago" },
    { kind: "NOTE", title: "WCC backlog conversion still slipping", meta: "Thesis rev. 3 · 18 Aug 2025" },
    { kind: "8-K", title: "WCC segment reorganisation", meta: "Filed 06 May 2025" },
    { kind: "NOTE", title: "Ask IR: is datacentre backlog booked at segment?", meta: "Open question · 14 Aug 2025" },
  ];
  const hits = all.filter((r) =>
    q
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean)
      .every((t) => (r.title + r.kind + r.meta).toLowerCase().includes(t)),
  );

  return (
    <div style={pVars} className={`w-full max-w-2xl border ${RULE2} ${SURF} ${TX}`}>
      <div className={`flex items-center gap-[var(--p-s2)] border-b-2 border-[var(--p-ink)] px-[var(--p-s3)] py-[var(--p-s2)] dark:border-[var(--p-ink-d)]`}>
        <Search className={`h-4 w-4 ${TX3}`} aria-hidden="true" />
        <label htmlFor="p-search" className="sr-only">
          Search the book — companies, filings, notes
        </label>
        <input
          id="p-search"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="ticker, filing type, or words from a note"
          className={`${FOCUS_FIELD} h-8 flex-1 bg-transparent text-[length:var(--p-t-body)] ${TX} placeholder:text-[var(--p-ink3)] dark:placeholder:text-[var(--p-ink3-d)]`}
          style={mono}
        />
        <span className={LBL} style={mono}>
          {hits.length}/{all.length}
        </span>
      </div>
      {hits.length === 0 ? (
        <div className="px-[var(--p-s3)] py-[var(--p-s4)]">
          <p className={`text-[length:var(--p-t-body)] ${TX}`}>
            No entry in the book matches all of{" "}
            <span style={mono} className={RV}>
              {q}
            </span>
            .
          </p>
          <button
            type="button"
            onClick={() => setQ(q.split(/\s+/)[0] ?? "")}
            className={`${FOCUS} mt-[var(--p-s2)] border ${RULE2} px-[var(--p-s2)] py-[2px] text-[length:var(--p-t-label)] ${TX2} hover:bg-[var(--p-ground)] dark:hover:bg-[var(--p-ground-d)]`}
          >
            Search “{q.split(/\s+/)[0]}” alone instead
          </button>
        </div>
      ) : (
        <ul>
          {hits.map((r) => (
            <li key={r.title}>
              <button
                type="button"
                className={`${FOCUS} flex w-full items-baseline gap-[var(--p-s3)] border-b ${RULE} px-[var(--p-s3)] py-[var(--p-s2)] text-left last:border-b-0 hover:bg-[var(--p-ground)] dark:hover:bg-[var(--p-ground-d)]`}
              >
                <span
                  className={`w-14 shrink-0 border ${RULE2} px-[var(--p-s1)] text-center text-[length:var(--p-t-micro)] ${TX2}`}
                  style={mono}
                >
                  {r.kind}
                </span>
                <span className="min-w-0 flex-1">
                  <span className={`block truncate text-[length:var(--p-t-body)] ${TX}`}>
                    {r.title}
                  </span>
                  <span className={`block truncate text-[length:var(--p-t-micro)] ${TX3}`} style={mono}>
                    {r.meta}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 8. Tabs — the Revisions panel is the direction stated outright      */
/* ------------------------------------------------------------------ */

export function TabsParti() {
  const tabs = ["Thesis", "Revisions", "Filings", "Numbers"] as const;
  const [active, setActive] = React.useState<(typeof tabs)[number]>("Thesis");
  const refs = React.useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length;
    setActive(tabs[next]);
    refs.current[next]?.focus();
  };

  return (
    <section style={pVars} className={`border ${RULE2} ${SURF} ${TX}`}>
      <div className={`flex items-baseline justify-between border-b ${RULE} px-[var(--p-s4)] py-[var(--p-s2)]`}>
        <h2 className={LBL} style={mono}>
          WCC · Wesco International
        </h2>
        <span className={LBL}>Thesis rev. 3 · 18 Aug 2025</span>
      </div>

      <div role="tablist" aria-label="WCC research" className={`flex border-b-2 border-[var(--p-ink)] dark:border-[var(--p-ink-d)]`}>
        {tabs.map((t, i) => (
          <button
            key={t}
            type="button"
            role="tab"
            ref={(el) => {
              refs.current[i] = el;
            }}
            id={`p-tab-${t}`}
            aria-selected={active === t}
            aria-controls={`p-panel-${t}`}
            tabIndex={active === t ? 0 : -1}
            onClick={() => setActive(t)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={`${FOCUS} border-r ${RULE} px-[var(--p-s4)] py-[var(--p-s2)] text-[length:var(--p-t-body)] ${
              active === t
                ? `bg-[var(--p-ink)] text-[var(--p-surf)] dark:bg-[var(--p-ink-d)] dark:text-[var(--p-surf-d)]`
                : `${TX2} hover:bg-[var(--p-ground)] dark:hover:bg-[var(--p-ground-d)]`
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`p-panel-${active}`}
        aria-labelledby={`p-tab-${active}`}
        tabIndex={0}
        className={`${FOCUS_FIELD} px-[var(--p-s4)] py-[var(--p-s3)]`}
      >
        {active === "Thesis" && (
          <div className="max-w-prose">
            <p className={`text-[length:var(--p-t-lg)] leading-relaxed ${TX}`} style={serif}>
              Bought at 142.10 on the view that the Anixter integration was under-credited:
              distribution scale plus a datacentre and utility mix the market was still pricing as
              cyclical electrical wholesale.
            </p>
            <p
              className={`mt-[var(--p-s3)] border-l-2 border-[var(--p-rev)] bg-[var(--p-rev-bg)] px-[var(--p-s3)] py-[var(--p-s2)] text-[length:var(--p-t-body)] leading-relaxed dark:border-[var(--p-rev-d)] dark:bg-[var(--p-rev-bg-d)]`}
              style={serif}
            >
              <span className={`${LBL} block ${RV}`}>Unresolved — carried since rev. 2</span>
              <span className={TX}>
                Backlog is up 9% year on year but revenue recognition has slipped two quarters
                running. Read the Q2 cash conversion cycle before adding to this.
              </span>
            </p>
          </div>
        )}

        {active === "Revisions" && (
          <ol className="text-[length:var(--p-t-body)]">
            {[
              { r: "rev. 3", d: "18 Aug 2025", was: "conviction: high", now: "conviction: medium-high", why: "second quarter of slipped recognition" },
              { r: "rev. 2", d: "04 Mar 2025", was: "cost basis 138.40", now: "cost basis 142.10", why: "added 40 sh at 161.55" },
              { r: "rev. 1", d: "12 Feb 2023", was: "—", now: "entry posted, 170 sh", why: "opening entry" },
            ].map((v, i) => (
              <li key={v.r} className={`border-b ${RULE} py-[var(--p-s2)] last:border-b-0`}>
                <div className="flex flex-wrap items-baseline gap-[var(--p-s2)]">
                  <span className={TX} style={mono}>
                    {v.r}
                  </span>
                  <span className={`text-[length:var(--p-t-micro)] ${TX3}`} style={mono}>
                    {v.d}
                  </span>
                </div>
                <p className="mt-[2px]">
                  <RuledOff delay={i * 70}>{v.was}</RuledOff>
                  <span className={`mx-[var(--p-s2)] ${TX3}`}>→</span>
                  <span className={TX} style={mono}>
                    {v.now}
                  </span>
                </p>
                <p className={`text-[length:var(--p-t-micro)] ${TX2}`} style={serif}>
                  {v.why}
                </p>
              </li>
            ))}
          </ol>
        )}

        {active === "Filings" && (
          <ul className="text-[length:var(--p-t-body)]">
            {[
              ["10-Q", "Q2 2025", "29 Aug 2025", "unread"],
              ["8-K", "Segment reorganisation", "06 May 2025", "read 07 May"],
              ["10-K", "FY2024", "21 Feb 2025", "read, 4 notes"],
            ].map(([k, t, d, s]) => (
              <li key={t} className={`flex flex-wrap items-baseline gap-[var(--p-s3)] border-b ${RULE} py-[var(--p-s2)] last:border-b-0`}>
                <span className={`w-14 border ${RULE2} px-[var(--p-s1)] text-center text-[length:var(--p-t-micro)] ${TX2}`} style={mono}>
                  {k}
                </span>
                <span className={`flex-1 ${TX}`}>{t}</span>
                <span className={`text-[length:var(--p-t-micro)] ${TX3}`} style={mono}>
                  {d}
                </span>
                <span className={`w-24 text-right text-[length:var(--p-t-micro)] ${s === "unread" ? RV : TX3}`} style={mono}>
                  {s}
                </span>
              </li>
            ))}
          </ul>
        )}

        {active === "Numbers" && (
          <dl className="grid grid-cols-2 sm:grid-cols-4">
            {[
              ["Revenue TTM", "21.80B", "FY24 20.05B"],
              ["EBITDA margin", "7.40%", "FY24 7.90%"],
              ["Net debt / EBITDA", "2.90x", "FY24 3.20x"],
              ["FCF yield", "6.10%", "FY24 4.80%"],
            ].map(([k, v, s], i) => (
              <div key={k} className={`py-[var(--p-s2)] ${i > 0 ? `border-l ${RULE} pl-[var(--p-s3)]` : ""} ${i < 3 ? "pr-[var(--p-s3)]" : ""}`}>
                <dt className={LBL}>{k}</dt>
                <dd className={`mt-[2px] text-[length:var(--p-t-fig)] ${TX}`} style={mono}>
                  {v}
                </dd>
                <dd className={`text-[length:var(--p-t-micro)] ${TX3}`} style={mono}>
                  {s}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 9. Modal — open, inline, bounded                                    */
/* ------------------------------------------------------------------ */

export function ModalParti() {
  const [conviction, setConviction] = React.useState("medium-high");

  return (
    <div style={pVars} className={`relative h-[28rem] overflow-hidden border ${RULE2} ${GROUND} ${TX}`}>
      <p className={`px-[var(--p-s4)] py-[var(--p-s3)] text-[length:var(--p-t-body)] ${TX3}`}>
        Schedule of positions, behind the dialog
      </p>
      <div className="absolute inset-0 bg-[var(--p-scrim)]" aria-hidden="true" />
      <div className="absolute inset-0 flex items-center justify-center p-[var(--p-s4)]">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="p-modal-title"
          aria-describedby="p-modal-desc"
          className={`w-full max-w-md border ${RULE2} border-t-2 border-t-[var(--p-ink)] ${SURF} dark:border-t-[var(--p-ink-d)]`}
        >
          <div className={`flex items-start justify-between gap-[var(--p-s3)] border-b ${RULE} px-[var(--p-s4)] py-[var(--p-s3)]`}>
            <div>
              <p className={LBL}>Post revision 4</p>
              <h2 id="p-modal-title" className={`mt-[2px] text-[length:var(--p-t-lg)] ${TX}`}>
                WCC — conviction
              </h2>
              <p id="p-modal-desc" className={`mt-[var(--p-s1)] text-[length:var(--p-t-body)] ${TX2}`} style={serif}>
                Revision 3 was posted 18 Aug 2025. It stays in the record; this adds to it.
              </p>
            </div>
            <button
              type="button"
              aria-label="Close dialog without posting"
              className={`${FOCUS} border ${RULE2} p-[var(--p-s1)] ${TX2} hover:bg-[var(--p-ground)] dark:hover:bg-[var(--p-ground-d)]`}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <fieldset className={`border-b ${RULE} px-[var(--p-s4)] py-[var(--p-s3)]`}>
            <legend className={LBL}>Conviction, as restated</legend>
            <p className="mt-[var(--p-s1)] text-[length:var(--p-t-body)]">
              <RuledOff>high</RuledOff>
              <span className={`ml-[var(--p-s2)] text-[length:var(--p-t-micro)] ${TX3}`}>
                as previously recorded, 12 Feb 2023
              </span>
            </p>
            <div className={`mt-[var(--p-s2)] border ${RULE2}`}>
              {["high", "medium-high", "medium", "watch only"].map((c, i) => (
                <label
                  key={c}
                  className={`flex cursor-pointer items-center gap-[var(--p-s2)] px-[var(--p-s3)] py-[var(--p-s2)] text-[length:var(--p-t-body)] ${
                    i > 0 ? `border-t ${RULE}` : ""
                  } ${conviction === c ? GROUND : ""}`}
                >
                  <input
                    type="radio"
                    name="p-conviction"
                    value={c}
                    checked={conviction === c}
                    onChange={() => setConviction(c)}
                    className={`${FOCUS} h-3.5 w-3.5 accent-[var(--p-mark)] dark:accent-[var(--p-mark-d)]`}
                  />
                  <span className={TX}>{c}</span>
                  {conviction === c && (
                    <span className={`ml-auto text-[length:var(--p-t-micro)] ${TX2}`}>
                      to be recorded
                    </span>
                  )}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="px-[var(--p-s4)] py-[var(--p-s3)]">
            <label htmlFor="p-modal-why" className={LBL}>
              Reason for the revision — required
            </label>
            <textarea
              id="p-modal-why"
              rows={3}
              defaultValue="Q2 10-Q shows backlog conversion slipping a second quarter. Holding 210 sh; not adding until cash conversion turns."
              className={`${FOCUS_FIELD} mt-[var(--p-s2)] w-full border ${RULE2} ${GROUND} p-[var(--p-s2)] text-[length:var(--p-t-body)] leading-relaxed ${TX}`}
              style={serif}
            />
          </div>

          <div className={`flex items-center justify-between gap-[var(--p-s2)] border-t ${RULE} px-[var(--p-s4)] py-[var(--p-s3)]`}>
            <span className={`text-[length:var(--p-t-micro)] ${TX3}`} style={mono}>
              Posts as rev. 4 · 01 Sep 2025
            </span>
            <span className="flex gap-[var(--p-s2)]">
              <button
                type="button"
                className={`${FOCUS} border ${RULE2} px-[var(--p-s3)] py-[var(--p-s1)] text-[length:var(--p-t-body)] ${TX2} hover:bg-[var(--p-ground)] dark:hover:bg-[var(--p-ground-d)]`}
              >
                Discard
              </button>
              <button
                type="button"
                className={`${FOCUS} border border-[var(--p-mark)] bg-[var(--p-mark)] px-[var(--p-s3)] py-[var(--p-s1)] text-[length:var(--p-t-body)] text-[var(--p-mark-on)] hover:border-[var(--p-ink)] hover:bg-[var(--p-ink)] dark:border-[var(--p-mark-d)] dark:bg-[var(--p-mark-d)] dark:text-[var(--p-mark-on-d)] dark:hover:border-[var(--p-ink-d)] dark:hover:bg-[var(--p-ink-d)]`}
              >
                Post revision
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 10. Drawer — open, inline, bounded                                  */
/* ------------------------------------------------------------------ */

export function DrawerParti() {
  return (
    <div style={pVars} className={`relative h-[28rem] overflow-hidden border ${RULE2} ${GROUND} ${TX}`}>
      <p className={`px-[var(--p-s4)] py-[var(--p-s3)] text-[length:var(--p-t-body)] ${TX3}`}>
        Schedule of positions, behind the panel
      </p>
      <div className="absolute inset-0 bg-[var(--p-scrim)]" aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="p-drawer-title"
        className={`absolute inset-y-0 right-0 flex w-full max-w-sm flex-col border-l-2 border-[var(--p-ink)] ${SURF} dark:border-[var(--p-ink-d)]`}
      >
        <div className={`flex items-start justify-between border-b ${RULE} px-[var(--p-s4)] py-[var(--p-s3)]`}>
          <div>
            <h2 id="p-drawer-title" className="text-[length:var(--p-t-lg)]" style={mono}>
              TPL
            </h2>
            <p className={`text-[length:var(--p-t-micro)] ${TX3}`}>
              Texas Pacific Land · 24 sh · entered 04 Nov 2021
            </p>
          </div>
          <button
            type="button"
            aria-label="Close panel"
            className={`${FOCUS} border ${RULE2} p-[var(--p-s1)] ${TX2} hover:bg-[var(--p-ground)] dark:hover:bg-[var(--p-ground-d)]`}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className={`border-b ${RULE} px-[var(--p-s4)] py-[var(--p-s3)]`}>
            <p className={LBL}>Marked value</p>
            <div className="mt-[var(--p-s2)]">
              <Restated now="$25,022.40" prior="$25,100.20" on="29 Aug close" />
            </div>
            <p className={`mt-[var(--p-s2)] text-[length:var(--p-t-body)] ${TX2}`} style={mono}>
              Cost 15,360.00 · unrealised 9,662.40
            </p>
          </div>

          <div className={`border-b ${RULE} px-[var(--p-s4)] py-[var(--p-s3)]`}>
            <p className={LBL}>Since you last opened this — 26 Aug</p>
            <ul className={`mt-[var(--p-s2)] text-[length:var(--p-t-body)]`}>
              <li className={`flex gap-[var(--p-s2)] border-b ${RULE} pb-[var(--p-s2)]`}>
                <span className={`w-14 shrink-0 border ${RULE2} px-[var(--p-s1)] text-center text-[length:var(--p-t-micro)] ${RV}`} style={mono}>
                  8-K
                </span>
                <span className={TX}>Water services segment disclosure, filed 31 Aug. Unread.</span>
              </li>
              <li className="flex gap-[var(--p-s2)] pt-[var(--p-s2)]">
                <span className={`w-14 shrink-0 border ${RULE2} px-[var(--p-s1)] text-center text-[length:var(--p-t-micro)] ${TX2}`} style={mono}>
                  MARK
                </span>
                <span className={TX2} style={mono}>
                  {figPct(-0.31)} session · +4.20% over 14 sessions
                </span>
              </li>
            </ul>
          </div>

          <div className="px-[var(--p-s4)] py-[var(--p-s3)]">
            <p className={LBL}>Thesis · rev. 1, never revised</p>
            <p className={`mt-[var(--p-s2)] text-[length:var(--p-t-body)] leading-relaxed ${TX}`} style={serif}>
              Royalty acreage with no capital obligation. Held for the land, not the oil price. No
              open questions carried.
            </p>
          </div>
        </div>

        <div className={`border-t ${RULE} px-[var(--p-s4)] py-[var(--p-s3)]`}>
          <button
            type="button"
            className={`${FOCUS} w-full border border-[var(--p-mark)] bg-[var(--p-mark)] px-[var(--p-s3)] py-[var(--p-s2)] text-[length:var(--p-t-body)] text-[var(--p-mark-on)] hover:border-[var(--p-ink)] hover:bg-[var(--p-ink)] dark:border-[var(--p-mark-d)] dark:bg-[var(--p-mark-d)] dark:text-[var(--p-mark-on-d)] dark:hover:border-[var(--p-ink-d)] dark:hover:bg-[var(--p-ink-d)]`}
          >
            Read the 8-K against this thesis
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 11. Dropdown — open, inline, bounded                                */
/* ------------------------------------------------------------------ */

export function DropdownParti() {
  const [open, setOpen] = React.useState(true);
  const items = [
    { label: "Continue thesis", meta: "rev. 3 · 14d" },
    { label: "Open Q2 10-Q", meta: "unread · 3d" },
    { label: "Post cost-basis correction", meta: "" },
    { label: "Set review date", meta: "none set" },
  ];

  return (
    <div style={pVars} className={`relative h-64 ${TX}`}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`${FOCUS} inline-flex items-center gap-[var(--p-s2)] border ${RULE2} ${SURF} px-[var(--p-s3)] py-[var(--p-s1)] text-[length:var(--p-t-body)] ${TX}`}
      >
        <span style={mono}>WCC</span>
        <span className={TX2}>entry actions</span>
        <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="WCC entry actions"
          className={`absolute left-0 top-10 z-10 w-72 border ${RULE2} border-t-2 border-t-[var(--p-ink)] ${SURF} dark:border-t-[var(--p-ink-d)]`}
        >
          {items.map((it) => (
            <button
              key={it.label}
              type="button"
              role="menuitem"
              className={`${FOCUS} flex w-full items-baseline justify-between gap-[var(--p-s3)] border-b ${RULE} px-[var(--p-s3)] py-[var(--p-s2)] text-left text-[length:var(--p-t-body)] ${TX} hover:bg-[var(--p-ground)] dark:hover:bg-[var(--p-ground-d)]`}
            >
              <span>{it.label}</span>
              <span className={`text-[length:var(--p-t-micro)] ${TX3}`} style={mono}>
                {it.meta}
              </span>
            </button>
          ))}
          <button
            type="button"
            role="menuitem"
            className={`${FOCUS} flex w-full items-baseline gap-[var(--p-s2)] px-[var(--p-s3)] py-[var(--p-s2)] text-left text-[length:var(--p-t-body)] ${RV} hover:bg-[var(--p-rev-bg)] dark:hover:bg-[var(--p-rev-bg-d)]`}
          >
            <Minus className="h-3.5 w-3.5 shrink-0 translate-y-[2px]" aria-hidden="true" />
            <span>
              Close entry
              <span className={`block text-[length:var(--p-t-micro)] ${TX3}`}>
                keeps all 3 revisions in the record
              </span>
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 12. Command menu — open, inline, bounded                            */
/* ------------------------------------------------------------------ */

export function CommandMenuParti() {
  const items = [
    { group: "Entries", label: "WCC · Wesco International", meta: "210 sh" },
    { group: "Entries", label: "TPL · Texas Pacific Land", meta: "24 sh" },
    { group: "Entries", label: "IESC · IES Holdings", meta: "180 sh" },
    { group: "Post", label: "Post a thesis revision", meta: "⌘R" },
    { group: "Post", label: "Post a cost-basis correction", meta: "⌘B" },
    { group: "Read", label: "Unread filings", meta: "4" },
  ];
  const [q, setQ] = React.useState("");
  const [idx, setIdx] = React.useState(0);
  const filtered = items.filter((i) => i.label.toLowerCase().includes(q.toLowerCase()));
  const groups = Array.from(new Set(filtered.map((i) => i.group)));

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIdx((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIdx((i) => Math.max(i - 1, 0));
    }
  };

  return (
    <div style={pVars} className={`relative h-[26rem] overflow-hidden border ${RULE2} ${GROUND} ${TX}`}>
      <p className={`px-[var(--p-s4)] py-[var(--p-s3)] text-[length:var(--p-t-body)] ${TX3}`}>
        Workspace, behind the command line
      </p>
      <div className="absolute inset-0 bg-[var(--p-scrim)]" aria-hidden="true" />
      <div className="absolute inset-x-0 top-8 flex justify-center px-[var(--p-s4)]">
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Command line"
          className={`w-full max-w-lg border ${RULE2} border-t-2 border-t-[var(--p-ink)] ${SURF} dark:border-t-[var(--p-ink-d)]`}
        >
          <div className={`flex items-center gap-[var(--p-s2)] border-b ${RULE} px-[var(--p-s3)]`}>
            <span className={`${TX3}`} style={mono} aria-hidden="true">
              &gt;
            </span>
            <label htmlFor="p-cmd" className="sr-only">
              Type a command or an entry name
            </label>
            <input
              id="p-cmd"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setIdx(0);
              }}
              onKeyDown={onKeyDown}
              aria-activedescendant={filtered[idx] ? `p-cmd-opt-${idx}` : undefined}
              aria-controls="p-cmd-list"
              placeholder="ticker, or “post”"
              className={`${FOCUS_FIELD} h-10 flex-1 bg-transparent text-[length:var(--p-t-body)] ${TX} placeholder:text-[var(--p-ink3)] dark:placeholder:text-[var(--p-ink3-d)]`}
              style={mono}
            />
            <span className={`border ${RULE2} px-[var(--p-s1)] text-[length:var(--p-t-micro)] ${TX2}`} style={mono}>
              ESC
            </span>
          </div>
          <div id="p-cmd-list" role="listbox" aria-label="Results" className="max-h-64 overflow-y-auto">
            {groups.map((g) => (
              <div key={g}>
                <p className={`${LBL} border-b ${RULE} ${GROUND} px-[var(--p-s3)] py-[2px]`}>{g}</p>
                {filtered.map((it, i) =>
                  it.group === g ? (
                    <div
                      key={it.label}
                      id={`p-cmd-opt-${i}`}
                      role="option"
                      aria-selected={i === idx}
                      onMouseEnter={() => setIdx(i)}
                      className={`flex cursor-pointer items-baseline justify-between gap-[var(--p-s3)] border-b ${RULE} px-[var(--p-s3)] py-[var(--p-s2)] text-[length:var(--p-t-body)] ${
                        i === idx
                          ? `border-l-2 border-l-[var(--p-ink)] ${GROUND} ${TX} dark:border-l-[var(--p-ink-d)]`
                          : TX2
                      }`}
                    >
                      <span style={it.group === "Entries" ? mono : undefined}>{it.label}</span>
                      <span className={`text-[length:var(--p-t-micro)] ${TX3}`} style={mono}>
                        {it.meta}
                      </span>
                    </div>
                  ) : null,
                )}
              </div>
            ))}
            {filtered.length === 0 && (
              <p className={`px-[var(--p-s3)] py-[var(--p-s4)] text-[length:var(--p-t-body)] ${TX2}`}>
                Nothing in the book matches{" "}
                <span style={mono} className={RV}>
                  {q}
                </span>
                . Six entries and 11 watchlist names are searchable here.
              </p>
            )}
          </div>
          <p className={`px-[var(--p-s3)] py-[var(--p-s1)] text-[length:var(--p-t-micro)] ${TX3}`} style={mono}>
            ↑↓ move · ⏎ open · ⌘K from anywhere
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 13. Toast — ruled slips, no shadow                                  */
/* ------------------------------------------------------------------ */

export function ToastParti() {
  const [slips, setSlips] = React.useState(["posted", "filing"]);

  return (
    <div style={pVars} className={`relative h-64 overflow-hidden border ${RULE2} ${GROUND} ${TX}`}>
      <p className={`px-[var(--p-s4)] py-[var(--p-s3)] text-[length:var(--p-t-body)] ${TX3}`}>
        Workspace
      </p>
      <div
        role="region"
        aria-label="Recent entries and alerts"
        className="absolute bottom-[var(--p-s4)] right-[var(--p-s4)] flex w-80 flex-col gap-[var(--p-s2)]"
      >
        {slips.includes("posted") && (
          <div
            role="status"
            className={`border ${RULE2} border-t-2 border-t-[var(--p-ink)] ${SURF} dark:border-t-[var(--p-ink-d)]`}
          >
            <div className={`flex items-baseline justify-between border-b ${RULE} px-[var(--p-s3)] py-[2px]`}>
              <span className={LBL}>Posted · rev. 4</span>
              <span className={`text-[length:var(--p-t-micro)] ${TX3}`} style={mono}>
                14:22:06
              </span>
            </div>
            <div className="flex items-start gap-[var(--p-s2)] px-[var(--p-s3)] py-[var(--p-s2)]">
              <Check className={`mt-[2px] h-3.5 w-3.5 shrink-0 ${TX2}`} aria-hidden="true" />
              <p className="flex-1 text-[length:var(--p-t-body)]">
                WCC conviction <RuledOff>high</RuledOff>{" "}
                <span className={TX} style={mono}>
                  medium-high
                </span>
              </p>
              <button
                type="button"
                aria-label="Dismiss the posted-revision notice"
                onClick={() => setSlips((s) => s.filter((x) => x !== "posted"))}
                className={`${FOCUS} border ${RULE2} p-[2px] ${TX2}`}
              >
                <X className="h-3 w-3" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {slips.includes("filing") && (
          <div
            role="alert"
            className={`border ${RULE2} border-t-2 border-t-[var(--p-rev)] bg-[var(--p-rev-bg)] dark:border-t-[var(--p-rev-d)] dark:bg-[var(--p-rev-bg-d)]`}
          >
            <div className={`flex items-baseline justify-between border-b ${RULE} px-[var(--p-s3)] py-[2px]`}>
              <span className={`${LBL} ${RV}`}>Needs your judgement</span>
              <span className={`text-[length:var(--p-t-micro)] ${TX3}`} style={mono}>
                31 Aug
              </span>
            </div>
            <div className="flex items-start gap-[var(--p-s2)] px-[var(--p-s3)] py-[var(--p-s2)]">
              <AlertTriangle className={`mt-[2px] h-3.5 w-3.5 shrink-0 ${RV}`} aria-hidden="true" />
              <p className={`flex-1 text-[length:var(--p-t-body)] ${TX}`}>
                TPL filed an 8-K. You hold 24 sh and the thesis has never been revised.
              </p>
              <button
                type="button"
                aria-label="Dismiss the TPL filing alert"
                onClick={() => setSlips((s) => s.filter((x) => x !== "filing"))}
                className={`${FOCUS} border ${RULE2} p-[2px] ${TX2}`}
              >
                <X className="h-3 w-3" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {slips.length === 0 && (
          <p className={`text-right text-[length:var(--p-t-micro)] ${TX3}`} style={mono}>
            No open notices
          </p>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 14. Empty state — names the condition, offers to lift it            */
/* ------------------------------------------------------------------ */

export function EmptyStateParti() {
  const [conds, setConds] = React.useState([
    { id: "sector", text: "sector = Energy", returns: 4 },
    { id: "held", text: "held ≥ 3 years", returns: 2 },
  ]);

  const empty = conds.length === 2;

  return (
    <section
      style={pVars}
      aria-live="polite"
      className={`border ${RULE2} ${SURF} ${TX}`}
    >
      <div className={`flex items-baseline justify-between border-b ${RULE} px-[var(--p-s4)] py-[var(--p-s2)]`}>
        <h2 className={LBL}>Schedule of positions</h2>
        <span className={LBL} style={mono}>
          {empty ? "0 of 6 entries" : "4 of 6 entries"}
        </span>
      </div>

      <div className="px-[var(--p-s4)] py-[var(--p-s5)]">
        <p className={`text-[length:var(--p-t-lg)] ${TX}`}>
          {empty
            ? "All 6 entries are withheld by the conditions you set."
            : "4 entries shown; 2 withheld by the remaining condition."}
        </p>
        <p className={`mt-[var(--p-s2)] max-w-prose text-[length:var(--p-t-body)] leading-relaxed ${TX2}`} style={serif}>
          The book is not empty. Nothing has been deleted, and no data failed to load — the schedule
          below is filtered, and every entry is one condition away from returning.
        </p>

        <ul className={`mt-[var(--p-s4)] max-w-lg border ${RULE2}`}>
          <li className={`${LBL} border-b ${RULE} ${GROUND} px-[var(--p-s3)] py-[2px]`}>
            Conditions in force
          </li>
          {conds.map((c) => (
            <li
              key={c.id}
              className={`flex flex-wrap items-center justify-between gap-[var(--p-s2)] border-b ${RULE} px-[var(--p-s3)] py-[var(--p-s2)] last:border-b-0`}
            >
              <span className={`text-[length:var(--p-t-body)] ${TX}`} style={mono}>
                {c.text}
              </span>
              <span className="flex items-center gap-[var(--p-s3)]">
                <span className={`text-[length:var(--p-t-micro)] ${TX3}`}>
                  removing this returns {c.returns} entries
                </span>
                <button
                  type="button"
                  onClick={() => setConds((prev) => prev.filter((x) => x.id !== c.id))}
                  className={`${FOCUS} border ${RULE2} px-[var(--p-s2)] py-[2px] text-[length:var(--p-t-label)] ${TX} hover:bg-[var(--p-ground)] dark:hover:bg-[var(--p-ground-d)]`}
                >
                  Remove
                </button>
              </span>
            </li>
          ))}
          {conds.length === 0 && (
            <li className={`px-[var(--p-s3)] py-[var(--p-s2)] text-[length:var(--p-t-body)] ${TX2}`} style={mono}>
              none — all 6 entries shown
            </li>
          )}
        </ul>

        <div className="mt-[var(--p-s4)] flex flex-wrap gap-[var(--p-s2)]">
          <button
            type="button"
            onClick={() => setConds([])}
            disabled={conds.length === 0}
            className={`${FOCUS} border border-[var(--p-mark)] bg-[var(--p-mark)] px-[var(--p-s3)] py-[var(--p-s1)] text-[length:var(--p-t-body)] text-[var(--p-mark-on)] hover:border-[var(--p-ink)] hover:bg-[var(--p-ink)] disabled:border-[var(--p-rule2)] disabled:bg-transparent disabled:text-[var(--p-ink3)] dark:border-[var(--p-mark-d)] dark:bg-[var(--p-mark-d)] dark:text-[var(--p-mark-on-d)] dark:hover:border-[var(--p-ink-d)] dark:hover:bg-[var(--p-ink-d)] dark:disabled:border-[var(--p-rule2-d)] dark:disabled:text-[var(--p-ink3-d)]`}
          >
            Clear all conditions — show 6
          </button>
          <button
            type="button"
            className={`${FOCUS} border ${RULE2} px-[var(--p-s3)] py-[var(--p-s1)] text-[length:var(--p-t-body)] ${TX2} hover:bg-[var(--p-ground)] dark:hover:bg-[var(--p-ground-d)]`}
          >
            Save this filter as a saved view
          </button>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 15. Loading state — shape-matched skeleton, first load only         */
/* ------------------------------------------------------------------ */

export function LoadingStateParti() {
  /* Widths mirror the real Schedule of positions columns exactly, so nothing
     shifts when the rows arrive. Rules, headers and totals are real markup —
     only the figures are unknown, so only the figures are bars. */
  const bar = "h-3 animate-pulse bg-[var(--p-rule)] motion-reduce:animate-none dark:bg-[var(--p-rule-d)]";

  return (
    <section style={pVars} className={`border ${RULE2} ${SURF} ${TX}`}>
      <div className={`flex items-baseline justify-between border-b ${RULE} px-[var(--p-s4)] py-[var(--p-s2)]`}>
        <h2 className={LBL}>Schedule of positions · 6 entries</h2>
        <span className={LBL} style={mono} role="status">
          First load — reconciling against 14:22 marks
        </span>
      </div>

      <table className="w-full border-collapse text-[length:var(--p-t-body)]">
        <thead>
          <tr className="border-b-2 border-[var(--p-ink)] dark:border-[var(--p-ink-d)]">
            {["Entry", "Shares", "Cost basis", "Mark", "Session", "Weight"].map((c, i) => (
              <th
                key={c}
                scope="col"
                className={`${LBL} border-r ${RULE} px-[var(--p-s3)] py-[var(--p-s2)] last:border-r-0 ${
                  i === 0 ? "text-left" : "text-right"
                }`}
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody aria-hidden="true">
          {POSITIONS.map((p) => (
            <tr key={p.ticker} className={`border-b ${RULE}`}>
              <td className={`border-r ${RULE} px-[var(--p-s3)] py-[var(--p-s2)]`}>
                <div className="flex items-center gap-[var(--p-s2)]">
                  <span className={`${bar} w-10`} />
                  <span className={`${bar} w-32 opacity-60`} />
                </div>
              </td>
              <td className={`border-r ${RULE} px-[var(--p-s3)] py-[var(--p-s2)]`}>
                <span className={`${bar} ml-auto block w-12`} />
              </td>
              <td className={`border-r ${RULE} px-[var(--p-s3)] py-[var(--p-s2)]`}>
                <span className={`${bar} ml-auto block w-16`} />
              </td>
              <td className={`border-r ${RULE} px-[var(--p-s3)] py-[var(--p-s2)]`}>
                <span className={`${bar} ml-auto block w-16`} />
              </td>
              <td className={`border-r ${RULE} px-[var(--p-s3)] py-[var(--p-s2)]`}>
                <span className={`${bar} ml-auto block w-14`} />
              </td>
              <td className={`px-[var(--p-s3)] py-[var(--p-s2)]`}>
                <span className={`${bar} ml-auto block w-10`} />
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-[var(--p-ink)] dark:border-[var(--p-ink-d)]">
            <th scope="row" className={`px-[var(--p-s3)] py-[var(--p-s2)] text-left ${LBL} ${TX}`}>
              Marked value of entries
            </th>
            <td colSpan={4} />
            <td className={`border-b-4 border-double border-[var(--p-ink)] px-[var(--p-s3)] py-[var(--p-s2)] dark:border-[var(--p-ink-d)]`}>
              <span className={`${bar} ml-auto block w-20`} aria-hidden="true" />
            </td>
          </tr>
        </tfoot>
      </table>

      <p className={`px-[var(--p-s4)] py-[var(--p-s2)] text-[length:var(--p-t-micro)] ${TX3}`}>
        Shown once, on first load. Later reconciles replace figures in place and rule off the prior
        value; the schedule is never blanked out again.
      </p>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 16. Error state — what broke, when it was last good, what to do,    */
/*     and a reference to quote                                        */
/* ------------------------------------------------------------------ */

export function ErrorStateParti() {
  const [copied, setCopied] = React.useState(false);
  const ref = "LGL-QF-2f81c4";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(ref);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section
      style={pVars}
      role="alert"
      className={`border ${RULE2} border-t-2 border-t-[var(--p-rev)] ${SURF} ${TX} dark:border-t-[var(--p-rev-d)]`}
    >
      <div className={`flex items-baseline justify-between gap-[var(--p-s3)] border-b ${RULE} px-[var(--p-s4)] py-[var(--p-s2)]`}>
        <span className={`${LBL} ${RV}`}>Quote feed unavailable</span>
        <span className={`${LBL}`} style={mono}>
          01 Sep 14:22 ET
        </span>
      </div>

      <dl className={`grid grid-cols-1 sm:grid-cols-3`}>
        <div className={`border-b ${RULE} px-[var(--p-s4)] py-[var(--p-s3)] sm:border-b-0`}>
          <dt className={LBL}>What broke</dt>
          <dd className={`mt-[var(--p-s1)] text-[length:var(--p-t-body)] leading-relaxed ${TX}`} style={serif}>
            The market-data provider stopped responding after four retries. Your entries, cost bases
            and theses are stored locally and were not touched.
          </dd>
        </div>
        <div className={`border-b ${RULE} px-[var(--p-s4)] py-[var(--p-s3)] sm:border-b-0 sm:border-l ${RULE}`}>
          <dt className={LBL}>Last good marks</dt>
          <dd className={`mt-[var(--p-s1)] text-[length:var(--p-t-fig)] ${TX}`} style={mono}>
            14:07:31 ET
          </dd>
          <dd className={`text-[length:var(--p-t-micro)] ${TX3}`}>
            15 minutes ago · complete for all 6 entries
          </dd>
        </div>
        <div className={`px-[var(--p-s4)] py-[var(--p-s3)] sm:border-l ${RULE}`}>
          <dt className={LBL}>What still works</dt>
          <dd className={`mt-[var(--p-s1)] text-[length:var(--p-t-body)] leading-relaxed ${TX}`} style={serif}>
            Filings, notes, theses and revision history are unaffected. Reading and posting
            revisions is the useful thing to do for the next few minutes.
          </dd>
        </div>
      </dl>

      <div className={`border-t ${RULE} bg-[var(--p-rev-bg)] px-[var(--p-s4)] py-[var(--p-s2)] dark:bg-[var(--p-rev-bg-d)]`}>
        <p className={`text-[length:var(--p-t-body)] ${TX}`} style={mono}>
          Every figure on screen is stamped{" "}
          <span className={RV}>14:07</span>, not 14:22. Nothing is being extrapolated.
        </p>
      </div>

      <div className={`flex flex-wrap items-center justify-between gap-[var(--p-s3)] border-t ${RULE} px-[var(--p-s4)] py-[var(--p-s3)]`}>
        <span className="flex flex-wrap items-center gap-[var(--p-s2)]">
          <button
            type="button"
            className={`${FOCUS} border border-[var(--p-mark)] bg-[var(--p-mark)] px-[var(--p-s3)] py-[var(--p-s1)] text-[length:var(--p-t-body)] text-[var(--p-mark-on)] hover:border-[var(--p-ink)] hover:bg-[var(--p-ink)] dark:border-[var(--p-mark-d)] dark:bg-[var(--p-mark-d)] dark:text-[var(--p-mark-on-d)] dark:hover:border-[var(--p-ink-d)] dark:hover:bg-[var(--p-ink-d)]`}
          >
            Keep the 14:07 marks and carry on
          </button>
          <button
            type="button"
            className={`${FOCUS} border ${RULE2} px-[var(--p-s3)] py-[var(--p-s1)] text-[length:var(--p-t-body)] ${TX2} hover:bg-[var(--p-ground)] dark:hover:bg-[var(--p-ground-d)]`}
          >
            Retry the feed
          </button>
        </span>

        <span className="flex items-center gap-[var(--p-s2)]">
          <span className={LBL}>Quote this reference</span>
          <span className={`border ${RULE2} px-[var(--p-s2)] py-[2px] text-[length:var(--p-t-body)] ${TX}`} style={mono}>
            {ref}
          </span>
          <button
            type="button"
            onClick={copy}
            className={`${FOCUS} flex items-center gap-[var(--p-s1)] border ${RULE2} px-[var(--p-s2)] py-[2px] text-[length:var(--p-t-label)] ${TX2} hover:bg-[var(--p-ground)] dark:hover:bg-[var(--p-ground-d)]`}
          >
            {copied ? (
              <Check className="h-3 w-3" aria-hidden="true" />
            ) : (
              <Copy className="h-3 w-3" aria-hidden="true" />
            )}
            {copied ? "Copied" : "Copy"}
          </button>
        </span>
      </div>

      <p className={`border-t ${RULE} px-[var(--p-s4)] py-[var(--p-s2)] text-[length:var(--p-t-micro)] ${TX3}`}>
        <PenLine className="mr-[var(--p-s1)] inline h-3 w-3 align-[-1px]" aria-hidden="true" />
        Logged as a gap in the record at 14:22. It will appear in the reconciliation history whether
        or not the feed comes back.
      </p>
    </section>
  );
}
