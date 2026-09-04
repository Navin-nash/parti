"use client";

import * as React from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  ChevronRight,
  CircleAlert,
  Clock,
  FileText,
  LayoutDashboard,
  NotebookPen,
  Plus,
  Search,
  Settings,
  Star,
} from "@/lib/icons";

type Position = {
  ticker: string;
  name: string;
  weight: number;
  cost: number;
  last: number;
  since: number;
};

const POSITIONS: Position[] = [
  { ticker: "SSNC", name: "SS&C Technologies", weight: 16.4, cost: 58.2, last: 74.11, since: 1.8 },
  { ticker: "WCC", name: "Wesco International", weight: 14.9, cost: 141.05, last: 168.42, since: -3.1 },
  { ticker: "EVR", name: "Evercore", weight: 12.1, cost: 186.4, last: 241.9, since: 4.6 },
  { ticker: "TPL", name: "Texas Pacific Land", weight: 11.3, cost: 902.5, last: 1043.7, since: -0.4 },
  { ticker: "AMBP", name: "Ardagh Metal Packaging", weight: 8.2, cost: 3.44, last: 3.11, since: -6.2 },
  { ticker: "IESC", name: "IES Holdings", weight: 6.1, cost: 148.9, last: 212.35, since: 9.4 },
];

const CHART: number[] = [
  151.2, 149.8, 152.4, 155.1, 154.0, 158.6, 161.2, 159.4, 163.8, 166.1, 164.5, 168.9,
  172.3, 170.1, 174.6, 173.2, 176.8, 179.4, 177.0, 174.2, 171.5, 173.9, 170.4, 168.42,
];

const TIMELINE = [
  { when: "3 days ago", kind: "Filing", text: "WCC filed 10-Q for Q3 2025", detail: "Backlog $4.9B, up 2.1% QoQ", accent: true },
  { when: "Yesterday", kind: "Filing", text: "TPL filed 8-K", detail: "Announced $0.55 special dividend", accent: true },
  { when: "9 days ago", kind: "Note", text: "Added valuation note to EVR", detail: "Advisory fee run-rate vs 2021 peak" },
  { when: "14 days ago", kind: "Thesis", text: "Edited WCC thesis", detail: "Left open question on backlog conversion" },
  { when: "22 days ago", kind: "Trade", text: "Trimmed AMBP by 40 shares", detail: "Position sizing, not a thesis change" },
];

function Card({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={`rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 ${className}`}
    >
      {children}
    </div>
  );
}

function Badge({ tone = "neutral", children }: { tone?: "neutral" | "brand" | "warn"; children: React.ReactNode }) {
  const tones = {
    neutral: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    brand: "bg-[var(--b-accent-soft)] text-[var(--b-accent-ink)]",
    warn: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  };
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}

function Delta({ value }: { value: number }) {
  const up = value >= 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-sm font-medium tabular-nums ${
        up ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
      }`}
    >
      {up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
      {up ? "+" : ""}
      {value.toFixed(1)}%
    </span>
  );
}

function PriceChart() {
  const w = 640;
  const h = 180;
  const min = Math.min(...CHART) - 2;
  const max = Math.max(...CHART) + 2;
  const pts = CHART.map((v, i) => {
    const x = (i / (CHART.length - 1)) * w;
    const y = h - ((v - min) / (max - min)) * h;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-44 w-full" preserveAspectRatio="none" role="img" aria-label="WCC price, last 24 months">
      <defs>
        <linearGradient id="b-fin-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--b-accent)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="var(--b-accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={f} x1="0" x2={w} y1={h * f} y2={h * f} stroke="currentColor" strokeWidth="1" className="text-slate-200 dark:text-slate-800" />
      ))}
      <polygon points={`0,${h} ${pts.join(" ")} ${w},${h}`} fill="url(#b-fin-fill)" />
      <polyline points={pts.join(" ")} fill="none" stroke="var(--b-accent)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function LedgerlineBaseline() {
  const [tab, setTab] = React.useState<"thesis" | "filings" | "notes">("thesis");
  const [openQuestion, setOpenQuestion] = React.useState(true);
  const [selected, setSelected] = React.useState("WCC");

  return (
    <div
      data-arm="baseline"
      style={
        {
          "--b-accent": "#2563eb",
          "--b-accent-hover": "#1d4ed8",
          "--b-accent-soft": "#dbeafe",
          "--b-accent-ink": "#1e40af",
        } as React.CSSProperties
      }
      className="flex min-h-[720px] w-full bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100"
    >
      {/* Sidebar */}
      <aside className="hidden w-56 shrink-0 flex-col border-r border-slate-200 bg-white p-4 md:flex dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-6 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--b-accent)] text-sm font-bold text-white">L</div>
          <span className="text-sm font-semibold">Ledgerline</span>
        </div>
        <nav className="flex flex-col gap-1">
          {[
            { icon: LayoutDashboard, label: "Workspace", active: true },
            { icon: NotebookPen, label: "Theses", badge: "3" },
            { icon: Star, label: "Watchlist" },
            { icon: FileText, label: "Filings", badge: "2" },
            { icon: Activity, label: "Activity" },
          ].map((item) => (
            <button
              key={item.label}
              className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm ${
                item.active
                  ? "bg-[var(--b-accent-soft)] font-medium text-[var(--b-accent-ink)]"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
              {item.badge && <span className="ml-auto text-xs text-slate-400">{item.badge}</span>}
            </button>
          ))}
        </nav>
        <button className="mt-auto flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
          <Settings className="h-4 w-4" />
          Settings
        </button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="flex items-center gap-3 border-b border-slate-200 bg-white px-5 py-3 dark:border-slate-800 dark:bg-slate-900">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Search tickers, filings, notes"
              aria-label="Search"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pr-3 pl-8 text-sm placeholder:text-slate-400 focus:border-[var(--b-accent)] focus:ring-2 focus:ring-[var(--b-accent-soft)] focus:outline-none dark:border-slate-700 dark:bg-slate-800"
            />
          </div>
          <button className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Notifications">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[var(--b-accent)]" />
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--b-accent)] px-3 py-1.5 text-sm font-medium text-white hover:bg-[var(--b-accent-hover)]">
            <Plus className="h-4 w-4" /> New thesis
          </button>
        </header>

        <main className="flex-1 space-y-5 overflow-auto p-5">
          {/* Portfolio summary */}
          <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { label: "Portfolio value", value: "$418,204", sub: "6 positions" },
              { label: "Cash", value: "31%", sub: "$129,643 uninvested" },
              { label: "Since last visit", value: "+1.2%", sub: "14 days ago" },
              { label: "Open questions", value: "1", sub: "WCC backlog conversion" },
            ].map((k) => (
              <Card key={k.label} className="p-4">
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400">{k.label}</div>
                <div className="mt-1 text-2xl font-semibold tabular-nums">{k.value}</div>
                <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{k.sub}</div>
              </Card>
            ))}
          </section>

          <div className="grid gap-5 lg:grid-cols-3">
            {/* Watchlist / positions */}
            <Card className="lg:col-span-1">
              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
                <h2 className="text-sm font-semibold">Positions &amp; watchlist</h2>
                <Badge tone="neutral">6 held</Badge>
              </div>
              <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                {POSITIONS.map((p) => (
                  <li key={p.ticker}>
                    <button
                      onClick={() => setSelected(p.ticker)}
                      className={`flex w-full items-center justify-between px-4 py-2.5 text-left hover:bg-slate-50 dark:hover:bg-slate-800/60 ${
                        selected === p.ticker ? "bg-[var(--b-accent-soft)]/40" : ""
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">{p.ticker}</span>
                          <span className="text-xs text-slate-400">{p.weight}%</span>
                        </div>
                        <div className="truncate text-xs text-slate-500 dark:text-slate-400">{p.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm tabular-nums">${p.last.toFixed(2)}</div>
                        <Delta value={p.since} />
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Research panel */}
            <Card className="lg:col-span-2">
              <div className="border-b border-slate-200 px-4 pt-4 dark:border-slate-800">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h2 className="text-base font-semibold">WCC — Wesco International</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Thesis last edited 14 days ago · conviction medium-high
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge tone="brand">Medium-high</Badge>
                    <Badge tone="warn">1 open question</Badge>
                  </div>
                </div>
                <div className="mt-3 flex gap-4" role="tablist">
                  {(["thesis", "filings", "notes"] as const).map((t) => (
                    <button
                      key={t}
                      role="tab"
                      aria-selected={tab === t}
                      onClick={() => setTab(t)}
                      className={`-mb-px border-b-2 pb-2 text-sm capitalize ${
                        tab === t
                          ? "border-[var(--b-accent)] font-medium text-[var(--b-accent-ink)] dark:text-[var(--b-accent)]"
                          : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4">
                {tab === "thesis" && (
                  <div className="space-y-4">
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950/40">
                      <button
                        onClick={() => setOpenQuestion((v) => !v)}
                        className="flex w-full items-center gap-2 text-left text-sm font-medium text-amber-900 dark:text-amber-200"
                        aria-expanded={openQuestion}
                      >
                        <CircleAlert className="h-4 w-4 shrink-0" />
                        Unresolved: does backlog convert at 2023 margins?
                        <ChevronRight className={`ml-auto h-4 w-4 transition-transform ${openQuestion ? "rotate-90" : ""}`} />
                      </button>
                      {openQuestion && (
                        <p className="mt-2 text-sm text-amber-900/90 dark:text-amber-200/80">
                          Backlog is $4.9B and growing, but data-center project mix carries lower gross margin than the
                          2023 utility work. Need two more quarters of segment margin before sizing up.
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
                      <p>
                        <strong className="text-slate-900 dark:text-slate-100">Why I own it.</strong> Electrical
                        distribution is a consolidating, low-multiple industry where scale compounds. Wesco bought
                        Anixter at a distressed price and has been de-levering ever since; net leverage is down to 2.6x
                        from 4.5x at close.
                      </p>
                      <p>
                        <strong className="text-slate-900 dark:text-slate-100">What would change my mind.</strong> Two
                        consecutive quarters of negative organic growth in CSS, or leverage rising back above 3.5x
                        without an acquisition to explain it.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                      <button className="rounded-lg bg-[var(--b-accent)] px-3 py-1.5 text-sm font-medium text-white hover:bg-[var(--b-accent-hover)]">
                        Resume editing
                      </button>
                      <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
                        Resolve question
                      </button>
                    </div>
                  </div>
                )}

                {tab === "filings" && (
                  <ul className="divide-y divide-slate-100 text-sm dark:divide-slate-800">
                    {[
                      { form: "10-Q", date: "Nov 4, 2025", note: "Q3 2025 · filed 3 days ago", fresh: true },
                      { form: "8-K", date: "Sep 18, 2025", note: "Senior notes refinancing" },
                      { form: "10-K", date: "Feb 25, 2025", note: "FY2024 annual report" },
                      { form: "DEF 14A", date: "Apr 3, 2025", note: "Proxy statement" },
                    ].map((f) => (
                      <li key={f.date} className="flex items-center gap-3 py-2.5">
                        <FileText className="h-4 w-4 text-slate-400" />
                        <span className="w-16 font-medium">{f.form}</span>
                        <span className="text-slate-500 dark:text-slate-400">{f.note}</span>
                        {f.fresh && <Badge tone="brand">New</Badge>}
                        <span className="ml-auto text-xs text-slate-400 tabular-nums">{f.date}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {tab === "notes" &&
                  [
                    { date: "Oct 24, 2025", body: "Called IR about the Q3 backlog disclosure. They will keep reporting it quarterly but will not split it by end market." },
                    { date: "Aug 11, 2025", body: "Cost basis $141.05 across three purchases. Average holding period target: 5 years." },
                  ].map((n) => (
                    <div key={n.date} className="mb-3 rounded-lg border border-slate-200 p-3 text-sm last:mb-0 dark:border-slate-800">
                      <div className="mb-1 text-xs text-slate-500 dark:text-slate-400">{n.date}</div>
                      {n.body}
                    </div>
                  ))}
              </div>

              <div className="border-t border-slate-200 p-4 dark:border-slate-800">
                <div className="mb-2 flex items-baseline justify-between">
                  <h3 className="text-sm font-semibold">Price — 24 months</h3>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    $168.42 <span className="ml-1 text-xs">cost $141.05</span>
                  </div>
                </div>
                <PriceChart />
              </div>
            </Card>
          </div>

          {/* Activity timeline */}
          <Card>
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
              <h2 className="text-sm font-semibold">Since you were last here</h2>
              <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                <Clock className="h-3.5 w-3.5" /> 14 days
              </span>
            </div>
            <ol className="p-4">
              {TIMELINE.map((e, i) => (
                <li key={e.text} className="flex gap-3 pb-4 last:pb-0">
                  <div className="flex flex-col items-center">
                    <span
                      className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                        e.accent ? "bg-[var(--b-accent)]" : "bg-slate-300 dark:bg-slate-600"
                      }`}
                    />
                    {i < TIMELINE.length - 1 && <span className="w-px flex-1 bg-slate-200 dark:bg-slate-800" />}
                  </div>
                  <div className="min-w-0 pb-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium">{e.text}</span>
                      <Badge tone="neutral">{e.kind}</Badge>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {e.detail} · {e.when}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </Card>
        </main>
      </div>
    </div>
  );
}
