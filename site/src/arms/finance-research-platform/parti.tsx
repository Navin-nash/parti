"use client";

/* ============================================================================
 * DIRECTION — "Fair Copy"
 * THESIS   A long-term investor's real artifact isn't the marked-up filing —
 *   it's the fair copy: the clean memo they'd hand their future self once the
 *   thinking is done. The job is a slow re-read after two weeks away, not a
 *   fast scan, so the workspace should read like that memo, not a terminal.
 * SIX AXES (vs. the prior "Marginalia" build — differs on five of six)
 *   Density        measured, not dense — one reading column at prose
 *                  line-height, the same six facts given room to be read once.
 *   Structure      editorial-asymmetric — a wide memo column carries the
 *                  argument, a narrow appendix carries the numbers. No
 *                  repeating margin rail, no equal grid.
 *   Type voice     editorial-serif (Source Serif 4) for argument and
 *                  headings, a plain grotesque for numbers and labels. No mono.
 *   Chroma         duotone — warm paper + ink, brass as the one drawn colour,
 *                  used only where the memo makes a claim.
 *   Motion posture choreographed — the memo settles on load, and switching
 *                  Thesis/Question/Filings turns a page, not a panel swap.
 *   Depth          layered-shadow — paper stacked on a desk, not flat.
 * SIGNATURE — the footnote. Claims carry a small brass footnote number; click
 *   one and a footnote strip rises from the foot of the memo with the
 *   citation, then settles back. A real memo already works this way — the
 *   claim stays put and the source comes to it. No dashboard has a footnote.
 * WHAT IT GIVES UP — Marginalia's forty-position scan density; this wants six
 *   positions read carefully, not a whole book scanned at a glance.
 * ==========================================================================*/
import * as React from "react";
import { Search, CircleAlert, ChevronDown } from "@/lib/icons";
const SERIF = 'var(--p-font-serif), Georgia, "Times New Roman", serif';
const SANS = 'var(--p-font-sans), ui-sans-serif, system-ui, sans-serif';
type Position = { ticker: string; name: string; weight: number; cost: number; last: number; since: number; note?: "stale" };
const POSITIONS: Position[] = [
  { ticker: "SSNC", name: "SS&C Technologies Holdings", weight: 16.4, cost: 58.2, last: 74.11, since: 1.8 },
  { ticker: "WCC", name: "Wesco International", weight: 14.9, cost: 141.05, last: 168.42, since: -3.1 },
  { ticker: "EVR", name: "Evercore", weight: 12.1, cost: 186.4, last: 241.9, since: 4.6 },
  { ticker: "TPL", name: "Texas Pacific Land", weight: 11.3, cost: 902.5, last: 1043.7, since: -0.4 },
  { ticker: "AMBP", name: "Ardagh Metal Packaging", weight: 8.2, cost: 3.44, last: 3.11, since: -6.2, note: "stale" },
  { ticker: "IESC", name: "IES Holdings", weight: 6.1, cost: 148.9, last: 212.35, since: 9.4 },
];
const WATCH = [
  { ticker: "MLI", name: "Mueller Industries", why: "Copper tube pricing vs. WCC read-through." },
  { ticker: "DXPE", name: "DXP Enterprises", why: "Same distribution model, a quarter of the float." },
  { ticker: "ATKR", name: "Atkore", why: "Waiting for conduit destock to finish." },
];
const SERIES = [
  118.4, 121.0, 119.8, 124.6, 127.2, 125.1, 130.4, 133.9, 131.2, 136.8, 140.1, 138.4, 142.9, 146.2, 144.0,
  149.7, 152.3, 150.1, 155.8, 158.4, 156.0, 161.2, 164.9, 162.1, 167.8, 171.2, 168.9, 173.4, 176.0, 174.2,
  179.6, 182.1, 178.8, 183.4, 186.9, 184.0, 188.6, 191.2, 187.4, 192.8, 189.1, 193.6, 190.2, 194.8, 191.0,
  187.6, 184.2, 188.9, 185.1, 181.4, 178.0, 181.6, 177.2, 180.8, 176.4, 179.0, 175.6, 172.2, 170.4, 168.42,
];
const RANGES = [
  { id: "3m", label: "3M", n: 12 }, { id: "1y", label: "1Y", n: 24 },
  { id: "5y", label: "5Y", n: 60 }, { id: "cost", label: "Since cost", n: 40 },
] as const;
const TIMELINE = [
  { stamp: "29 Aug", kind: "Filing", head: "WCC filed its 10-Q for Q3 FY2026.", body: "Backlog $4.91B, +2.1% QoQ. Book-to-bill 1.02. Data-centre demand called out separately for the first time.", mark: true },
  { stamp: "31 Aug", kind: "Filing", head: "TPL filed an 8-K.", body: "A $0.55 special dividend, payable 24 Sep. No change to the royalty acreage disclosure." },
  { stamp: "23 Aug", kind: "Note", head: "Added a valuation note to EVR.", body: "Advisory fee run-rate is now 71% of the 2021 peak against a 19% smaller headcount." },
  { stamp: "18 Aug", kind: "Thesis", head: "Edited the WCC thesis — left one question open.", body: "Couldn't resolve how much of the backlog converts inside twelve months. Parked it." },
  { stamp: "10 Aug", kind: "Trade", head: "Trimmed AMBP by 40 shares.", body: "Position sizing back to 8%. Not a thesis change." },
];
const FILINGS = [
  { form: "10-Q", period: "Q3 FY2026", filed: "29 Aug 2026", acc: "0000929008-26-000114" },
  { form: "8-K", period: "Item 2.02", filed: "12 Aug 2026", acc: "0000929008-26-000101" },
  { form: "10-K", period: "FY2025", filed: "21 Feb 2026", acc: "0000929008-26-000019" },
  { form: "DEF 14A", period: "2026 proxy", filed: "04 Apr 2026", acc: "0000929008-26-000044" },
];
const FOOTNOTES: Record<number, string> = {
  1: "WCC 10-Q, filed 29 Aug 2026 — Item 2, Backlog and Book-to-bill, p. 34.",
  2: "WCC Q2 FY2026 earnings call transcript, 24 Jul 2026 — management remarks on backlog composition.",
};
const num = (v: number, d = 2) => v.toFixed(d);
const signed = (v: number) => `${v >= 0 ? "+" : "−"}${Math.abs(v).toFixed(1)}%`;
function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[length:var(--p-t-xs)] uppercase tracking-[0.14em] text-[var(--p-ink-3)]" style={{ fontFamily: SANS }}>
      {children}
    </p>
  );
}
function Card({ children, level = 1, className = "" }: { children: React.ReactNode; level?: 1 | 2; className?: string }) {
  const shadow = level === 2 ? "var(--p-e2)" : "var(--p-e1)";
  return (
    <section className={`bg-[var(--p-surface)] border border-[var(--p-rule)] ${className}`} style={{ borderRadius: "var(--p-r)", boxShadow: shadow }}>
      {children}
    </section>
  );
}
function Foot({ num: n }: { num: 1 | 2 }) {
  return (
    <sup>
      <button
        data-foot={n}
        aria-describedby={`fn-${n}`}
        className="ml-px cursor-pointer text-[var(--p-accent)] underline decoration-dotted underline-offset-2 hover:decoration-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--p-accent)]"
        style={{ fontFamily: SANS, fontSize: "10px" }}
      >
        {n}
      </button>
    </sup>
  );
}
export function LedgerlineParti() {
  const [settled, setSettled] = React.useState(false);
  const [tab, setTab] = React.useState<"thesis" | "question" | "filings">("thesis");
  const [range, setRange] = React.useState<(typeof RANGES)[number]["id"]>("1y");
  const [filter, setFilter] = React.useState("");
  const [openEvent, setOpenEvent] = React.useState<string | null>("29 Aug");
  const [footnote, setFootnote] = React.useState<1 | 2 | null>(null);
  const [filingsReady, setFilingsReady] = React.useState(false);
  React.useEffect(() => {
    const t = window.setTimeout(() => setSettled(true), 40);
    return () => window.clearTimeout(t);
  }, []);
  const filingsLoading = tab === "filings" && !filingsReady;
  React.useEffect(() => {
    if (!filingsLoading) return;
    const t = window.setTimeout(() => setFilingsReady(true), 700);
    return () => window.clearTimeout(t);
  }, [filingsLoading]);
  // A footnote click is caught here rather than wired to each <Foot>, so the
  // memo prose only ever declares "this is footnote 1" — the toggle logic
  // (and any future footnote) lives in one place.
  const onMemoClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const n = (e.target as HTMLElement).closest("[data-foot]")?.getAttribute("data-foot");
    if (n) setFootnote((cur) => (cur === Number(n) ? null : (Number(n) as 1 | 2)));
  };
  const data = React.useMemo(() => {
    const n = RANGES.find((r) => r.id === range)!.n;
    return SERIES.slice(SERIES.length - n);
  }, [range]);
  const path = React.useMemo(() => {
    const lo = Math.min(...data), hi = Math.max(...data);
    return data.map((v, i) => `${i ? "L" : "M"}${((i / (data.length - 1)) * 560).toFixed(1)} ${(108 - ((v - lo) / (hi - lo || 1)) * 92).toFixed(1)}`).join(" ");
  }, [data]);
  const costY = React.useMemo(() => {
    const lo = Math.min(...data), hi = Math.max(...data);
    return 108 - ((141.05 - lo) / (hi - lo || 1)) * 92;
  }, [data]);
  const watch = WATCH.filter((w) => (w.ticker + " " + w.name).toLowerCase().includes(filter.trim().toLowerCase()));
  return (
    <div
      data-arm="parti"
      style={
        {
          "--p-font-serif": "'Source Serif 4'",
          "--p-font-sans": "'Inter'",
          "--p-bg": "#F7F3EA", "--p-surface": "#FFFDF8", "--p-tint": "#EFE8D8",
          "--p-rule": "#E0D6C0", "--p-rule-ctl": "#7D6E4B",
          "--p-ink": "#2A2318", "--p-ink-2": "#5C4F3B", "--p-ink-3": "#7A6D55",
          "--p-accent": "#966517", "--p-accent-fg": "#FFFDF8",
          "--p-t-xs": "11px", "--p-t-sm": "13px", "--p-t-base": "15.5px",
          "--p-t-md": "17px", "--p-t-lg": "23px", "--p-t-xl": "29px",
          "--p-s1": "4px", "--p-s2": "8px", "--p-s3": "12px", "--p-s4": "16px",
          "--p-s5": "20px", "--p-s6": "28px", "--p-s8": "40px",
          "--p-r": "3px", "--p-r-chip": "999px",
          "--p-e1": "0 1px 2px rgba(42,35,24,0.07), 0 1px 1px rgba(42,35,24,0.05)",
          "--p-e2": "0 10px 24px rgba(42,35,24,0.12), 0 3px 8px rgba(42,35,24,0.08)",
          "--p-d-fast": "140ms", "--p-d-base": "220ms", "--p-d-slow": "420ms",
          "--p-ease-out": "cubic-bezier(0.22,1,0.36,1)",
          fontFamily: SANS,
        } as React.CSSProperties
      }
      className="bg-[var(--p-bg)] text-[var(--p-ink)] dark:[--p-bg:#1C1712] dark:[--p-surface:#221C15] dark:[--p-tint:#2B241B] dark:[--p-rule:#3D3426] dark:[--p-rule-ctl:#6E6459] dark:[--p-ink:#F3ECDC] dark:[--p-ink-2:#C9BB9C] dark:[--p-ink-3:#A69878] dark:[--p-accent:#D9A441] dark:[--p-accent-fg:#1C1712] dark:[--p-e1:0_1px_2px_rgba(0,0,0,0.35)] dark:[--p-e2:0_12px_28px_rgba(0,0,0,0.5),0_4px_10px_rgba(0,0,0,0.35)]"
    >
      <link rel="stylesheet" precedence="default" href="https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,500;8..60,600&family=Inter:wght@400;500;600&display=swap" />
      <style>{`
        @keyframes p-turn { from { opacity: 0; transform: translateY(7px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: no-preference) {
          [data-arm="parti"] .p-turn { animation: p-turn var(--p-d-slow) var(--p-ease-out); }
        }
      `}</style>
      {/* letterhead --------------------------------------------------------- */}
      <header className="flex flex-wrap items-baseline gap-x-[var(--p-s6)] gap-y-[var(--p-s2)] border-b border-[var(--p-rule)] px-[var(--p-s8)] py-[var(--p-s4)]">
        <span className="text-[length:var(--p-t-md)] italic text-[var(--p-ink)]" style={{ fontFamily: SERIF }}>Ledgerline</span>
        <nav className="flex gap-[var(--p-s4)] text-[length:var(--p-t-sm)]" aria-label="Workspace" style={{ fontFamily: SANS }}>
          {["Workspace", "Positions", "Filings", "Notes"].map((s, i) => (
            <span key={s} className={i === 0 ? "text-[var(--p-ink)] underline decoration-[var(--p-accent)] underline-offset-4" : "text-[var(--p-ink-3)]"}>
              {s}
            </span>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-[var(--p-s5)]">
          <span className="text-[length:var(--p-t-xs)] italic text-[var(--p-ink-3)]" style={{ fontFamily: SERIF }}>
            last opened 18 Aug — fourteen days ago
          </span>
          <label className="flex items-center gap-[var(--p-s2)] border-b border-[var(--p-rule-ctl)] pb-[3px]">
            <Search aria-hidden className="size-3.5 text-[var(--p-ink-3)]" strokeWidth={1.5} />
            <input
              placeholder="ticker, filing, note"
              className="w-40 bg-transparent text-[length:var(--p-t-sm)] text-[var(--p-ink)] outline-none placeholder:text-[var(--p-ink-3)]"
              style={{ fontFamily: SANS }}
            />
          </label>
        </div>
      </header>
      {/* the return ---------------------------------------------------------- */}
      <section className="border-b border-[var(--p-rule)] bg-[var(--p-tint)] px-[var(--p-s8)] py-[var(--p-s6)]">
        <p className="max-w-[46ch] text-[length:var(--p-t-xl)] leading-[1.25]" style={{ fontFamily: SERIF }}>
          Three things moved while you were away.
        </p>
        <div className="mt-[var(--p-s5)] grid gap-x-[var(--p-s8)] gap-y-[var(--p-s3)] sm:grid-cols-3">
          {[
            { s: "29 Aug", t: "WCC filed its 10-Q.", d: "Backlog $4.91B, +2.1% QoQ — the number your open question turns on.", m: true },
            { s: "31 Aug", t: "TPL filed an 8-K.", d: "A $0.55 special dividend declared. No change to the royalty acreage." },
            { s: "Since 26 Aug", t: "AMBP drifted to −6.2%.", d: "Below your 8% band, and the quote feed is running stale." },
          ].map((x) => (
            <div key={x.t}>
              <p className="text-[length:var(--p-t-xs)] uppercase tracking-[0.1em]" style={{ fontFamily: SANS, color: x.m ? "var(--p-accent)" : "var(--p-ink-3)" }}>
                {x.s}
              </p>
              <p className="mt-[2px] text-[length:var(--p-t-base)]">{x.t}</p>
              <p className="text-[length:var(--p-t-sm)] leading-[1.5] text-[var(--p-ink-2)]">{x.d}</p>
            </div>
          ))}
        </div>
      </section>
      <div className="grid gap-[var(--p-s8)] px-[var(--p-s8)] py-[var(--p-s6)] lg:grid-cols-[1.65fr_1fr]">
        {/* the memo — the wide reading column ------------------------------- */}
        <div
          className="transition-[opacity,transform] duration-[var(--p-d-slow)] ease-[var(--p-ease-out)] motion-reduce:transition-none"
          style={{ opacity: settled ? 1 : 0, transform: settled ? "none" : "translateY(10px)" }}
        >
          <Card level={2} className="p-[var(--p-s6)]">
            <div className="flex flex-wrap items-baseline justify-between gap-[var(--p-s3)] border-b border-[var(--p-rule)] pb-[var(--p-s3)]">
              <div>
                <Kicker>Research memo · WCC</Kicker>
                <h1 className="text-[length:var(--p-t-lg)]" style={{ fontFamily: SERIF }}>Wesco International</h1>
              </div>
              <span
                className="border px-[var(--p-s3)] py-[3px] text-[length:var(--p-t-xs)] tracking-[0.04em]"
                style={{ fontFamily: SANS, borderRadius: "var(--p-r-chip)", borderColor: "var(--p-accent)", color: "var(--p-accent)" }}
              >conviction medium-high</span>
            </div>
            <div role="tablist" aria-label="Research" className="mt-[var(--p-s4)] flex gap-[var(--p-s6)] text-[length:var(--p-t-sm)]" style={{ fontFamily: SANS }}>
              {([["thesis", "Thesis"], ["question", "Open question"], ["filings", "Filings"]] as const).map(([id, label]) => (
                <button
                  key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)}
                  className="border-b-2 pb-[6px] transition-colors duration-[var(--p-d-fast)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--p-accent)]"
                  style={{ borderColor: tab === id ? "var(--p-accent)" : "transparent", color: tab === id ? "var(--p-ink)" : "var(--p-ink-3)" }}
                >{label}</button>
              ))}
            </div>
            <div key={tab} className="p-turn mt-[var(--p-s5)] min-h-[150px]" onClick={onMemoClick}>
              {tab === "thesis" ? (
                <div className="max-w-[62ch] text-[length:var(--p-t-base)] leading-[1.65]" style={{ fontFamily: SERIF }}>
                  <p>Bought 14 Mar 2024 at $141.05. Electrical distribution is a scale business the market keeps pricing as a cyclical.</p>
                  <p className="mt-[var(--p-s3)]">
                    Wesco absorbed Anixter without losing the branch network, which is the only durable asset here. Utility and
                    data-centre demand are both structurally short of qualified distribution capacity, and the working-capital
                    release from the integration funds the buyback without leverage going the wrong way.<Foot num={1} />
                  </p>
                  <p className="mt-[var(--p-s3)]">
                    What would change my mind: two consecutive quarters of book-to-bill under 0.95 with no destocking
                    explanation, or gross margin under 20.5% while volume grows.<Foot num={2} />
                  </p>
                </div>
              ) : null}
              {tab === "question" ? (
                <div className="max-w-[62ch] border-l-2 pl-[var(--p-s4)]" style={{ borderColor: "var(--p-accent)" }}>
                  <p className="text-[length:var(--p-t-xs)] uppercase tracking-[0.1em]" style={{ fontFamily: SANS, color: "var(--p-accent)" }}>
                    unresolved · parked 18 Aug 2026
                  </p>
                  <p className="mt-[var(--p-s2)] text-[length:var(--p-t-base)] leading-[1.65]" style={{ fontFamily: SERIF }}>
                    How much of the $4.91B backlog converts to revenue inside twelve months? The 10-Q gives the total and the
                    book-to-bill but not the ageing. Management has called it &ldquo;largely near-term&rdquo; on two calls
                    without quantifying it.
                  </p>
                  <p className="mt-[var(--p-s3)] text-[length:var(--p-t-sm)] text-[var(--p-ink-3)]">
                    Next: read the Q3 call transcript, then DXPE&rsquo;s 10-Q for a comparable disclosure.
                  </p>
                </div>
              ) : null}
              {filingsLoading ? (
                <p aria-live="polite" className="text-[length:var(--p-t-sm)] italic text-[var(--p-ink-3)]" style={{ fontFamily: SERIF }}>
                  Fetching the EDGAR index…
                </p>
              ) : null}
              {tab === "filings" && filingsReady ? (
                <table className="w-full text-[length:var(--p-t-sm)]" style={{ fontFamily: SANS }}>
                  <thead>
                    <tr className="border-b border-[var(--p-rule)] text-left text-[length:var(--p-t-xs)] uppercase tracking-[0.08em] text-[var(--p-ink-3)]">
                      <th className="py-[var(--p-s2)] font-normal">Form</th><th className="font-normal">Period</th><th className="font-normal">Filed</th><th className="font-normal">Accession</th>
                    </tr>
                  </thead>
                  <tbody>
                    {FILINGS.map((f, i) => (
                      <tr key={f.acc} className="border-b border-[var(--p-rule)] last:border-0">
                        <td className="py-[var(--p-s2)]">
                          {f.form}
                          {i === 0 ? <span className="ml-[var(--p-s2)] text-[var(--p-accent)]">new</span> : null}
                        </td>
                        <td className="text-[var(--p-ink-2)]">{f.period}</td>
                        <td className="tabular-nums text-[var(--p-ink-2)]">{f.filed}</td>
                        <td className="tabular-nums text-[var(--p-ink-3)]">{f.acc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : null}
            </div>
            {/* the footnote — signature ------------------------------------ */}
            <div
              id={footnote ? `fn-${footnote}` : undefined}
              role="note"
              className="overflow-hidden border-t transition-[max-height,opacity,margin-top] duration-[var(--p-d-base)] ease-[var(--p-ease-out)] motion-reduce:transition-none"
              style={{ borderColor: footnote ? "var(--p-rule)" : "transparent", maxHeight: footnote ? "80px" : "0px", opacity: footnote ? 1 : 0, marginTop: footnote ? "var(--p-s4)" : "0px" }}
            >
              <p className="pt-[var(--p-s3)] text-[length:var(--p-t-sm)] leading-[1.5] text-[var(--p-ink-2)]">
                <span className="mr-[var(--p-s1)] text-[var(--p-accent)]" style={{ fontFamily: SANS }}>{footnote}.</span>
                {footnote ? FOOTNOTES[footnote] : ""}
              </p>
            </div>
            {/* exhibit — price ------------------------------------------------ */}
            <div className="mt-[var(--p-s6)] border-t border-[var(--p-rule)] pt-[var(--p-s5)]">
              <div className="flex flex-wrap items-baseline justify-between gap-[var(--p-s2)]">
                <p className="text-[length:var(--p-t-sm)] italic text-[var(--p-ink-2)]" style={{ fontFamily: SERIF }}>
                  Exhibit — WCC close, last {num(POSITIONS[1].last)} against a 141.05 cost basis
                </p>
                <div className="flex gap-[var(--p-s1)]" style={{ fontFamily: SANS }}>
                  {RANGES.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setRange(r.id)}
                      aria-pressed={range === r.id}
                      className="px-[var(--p-s2)] py-[2px] text-[length:var(--p-t-xs)] transition-colors duration-[var(--p-d-fast)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--p-accent)]"
                      style={{ borderRadius: "var(--p-r-chip)", background: range === r.id ? "var(--p-accent)" : "transparent", color: range === r.id ? "var(--p-accent-fg)" : "var(--p-ink-3)" }}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
              <svg viewBox="0 0 560 116" className="mt-[var(--p-s3)] h-28 w-full" role="img" aria-label={`WCC close, ${range} range, last 168.42 against a 141.05 cost basis`}>
                <line x1="0" y1={costY} x2="560" y2={costY} stroke="var(--p-accent)" strokeWidth="1" strokeDasharray="3 4" />
                <path d={path} fill="none" stroke="var(--p-ink)" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
              <p className="mt-[var(--p-s1)] text-[length:var(--p-t-xs)] text-[var(--p-ink-3)]">
                Dashed line is your cost basis. No fill, no red or green — only direction.
              </p>
            </div>
          </Card>
        </div>
        {/* the appendix — narrow numbers column ------------------------------ */}
        <div className="flex flex-col gap-[var(--p-s6)]">
          <Card className="p-[var(--p-s5)]">
            <div className="mb-[var(--p-s3)] flex items-baseline justify-between">
              <Kicker>Portfolio · 31.0% cash</Kicker>
              <span className="text-[length:var(--p-t-xs)] text-[var(--p-ink-3)]">6 positions</span>
            </div>
            <table className="w-full text-[length:var(--p-t-sm)]" style={{ fontFamily: SANS }}>
              <thead>
                <tr className="text-left text-[length:var(--p-t-xs)] uppercase tracking-[0.06em] text-[var(--p-ink-3)]">
                  <th className="pb-[var(--p-s1)] font-normal">Ticker</th><th className="pb-[var(--p-s1)] text-right font-normal">Wt</th><th className="pb-[var(--p-s1)] text-right font-normal">Last</th><th className="pb-[var(--p-s1)] text-right font-normal">14d</th>
                </tr>
              </thead>
              <tbody>
                {POSITIONS.map((p) => (
                  <tr key={p.ticker} className="border-t border-[var(--p-rule)] align-top">
                    <td className="py-[var(--p-s2)]">
                      <span>{p.ticker}</span>
                      <span className="block max-w-[13ch] truncate text-[length:var(--p-t-xs)] text-[var(--p-ink-3)]">{p.name}</span>
                    </td>
                    <td className="py-[var(--p-s2)] text-right tabular-nums text-[var(--p-ink-2)]">{num(p.weight, 1)}</td>
                    <td className="py-[var(--p-s2)] text-right tabular-nums">
                      {num(p.last)}
                      {p.note === "stale" ? (
                        <span className="mt-[2px] flex items-center justify-end gap-[3px] text-[length:var(--p-t-xs)]" style={{ color: "var(--p-accent)" }}>
                          <CircleAlert aria-hidden className="size-3" strokeWidth={1.75} /> stale 4h
                        </span>
                      ) : null}
                    </td>
                    <td className="py-[var(--p-s2)] text-right tabular-nums text-[var(--p-ink-2)]">{signed(p.since)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-[var(--p-s2)] text-[length:var(--p-t-xs)] leading-[1.5] text-[var(--p-ink-3)]">
              Moves aren&rsquo;t coloured red or green here. Brass means one thing only: this needs your judgement.
            </p>
          </Card>
          <Card className="p-[var(--p-s5)]">
            <Kicker>Watchlist · {watch.length} of {WATCH.length}</Kicker>
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="filter watchlist"
              aria-label="Filter watchlist"
              className="mt-[var(--p-s3)] mb-[var(--p-s3)] w-full border-b border-[var(--p-rule-ctl)] bg-transparent pb-[var(--p-s1)] text-[length:var(--p-t-sm)] outline-none placeholder:text-[var(--p-ink-3)] focus-visible:border-[var(--p-accent)]"
              style={{ fontFamily: SANS }} />
            {watch.length === 0 ? (
              <div className="border border-dashed border-[var(--p-rule-ctl)] p-[var(--p-s4)]" style={{ borderRadius: "var(--p-r)" }}>
                <p className="text-[length:var(--p-t-sm)] text-[var(--p-ink-2)]">Nothing matches &ldquo;{filter}&rdquo;.</p>
                <button
                  onClick={() => setFilter("")}
                  className="mt-[var(--p-s2)] text-[length:var(--p-t-xs)] underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--p-accent)]"
                  style={{ color: "var(--p-accent)" }}
                >clear filter</button>
              </div>
            ) : (
              <ul>
                {watch.map((w) => (
                  <li key={w.ticker} className="border-t border-[var(--p-rule)] py-[var(--p-s2)] first:border-0">
                    <span style={{ fontFamily: SANS }}>{w.ticker}</span>
                    <span className="ml-[var(--p-s2)] text-[length:var(--p-t-xs)] text-[var(--p-ink-3)]">{w.name}</span>
                    <p className="text-[length:var(--p-t-sm)] leading-[1.5] text-[var(--p-ink-2)]">{w.why}</p>
                  </li>
                ))}
              </ul>
            )}
          </Card>
          <Card className="p-[var(--p-s5)]">
            <Kicker>Activity · 5 of 22</Kicker>
            <ul className="mt-[var(--p-s2)]">
              {TIMELINE.map((t) => {
                const isOpen = openEvent === t.stamp;
                return (
                  <li key={t.stamp} className="border-t border-[var(--p-rule)] first:border-0">
                    <button
                      onClick={() => setOpenEvent(isOpen ? null : t.stamp)} aria-expanded={isOpen}
                      className="flex w-full items-start gap-[var(--p-s2)] py-[var(--p-s2)] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--p-accent)]"
                    >
                      <ChevronDown aria-hidden strokeWidth={1.75}
                        className="mt-[3px] size-3 shrink-0 text-[var(--p-ink-3)] transition-transform duration-[var(--p-d-fast)] motion-reduce:transition-none"
                        style={{ transform: isOpen ? "rotate(180deg)" : "none" }} />
                      <span className="flex-1">
                        <span className="text-[length:var(--p-t-xs)] text-[var(--p-ink-3)]">{t.stamp} · {t.kind}</span>
                        <span className="block text-[length:var(--p-t-sm)]">{t.head}</span>
                      </span>
                    </button>
                    {isOpen ? (
                      <p className="pb-[var(--p-s3)] pl-[var(--p-s5)] text-[length:var(--p-t-sm)] leading-[1.55] text-[var(--p-ink-2)]">{t.body}</p>
                    ) : null}
                  </li>
                );
              })}
            </ul>
            <p className="border-t border-[var(--p-rule)] pt-[var(--p-s2)] text-[length:var(--p-t-xs)] text-[var(--p-ink-3)]">
              17 earlier entries — open the full log to read them.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
