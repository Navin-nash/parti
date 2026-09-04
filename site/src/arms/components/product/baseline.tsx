"use client";

/*
 * Ledgerline - product component group, BASELINE arm.
 * A research workspace for independent investors. Not a broker.
 * Conventional Tailwind + shadcn-shaped markup, reimplemented inline.
 * All custom properties are prefixed --b- and declared on each component root.
 */

import * as React from "react";
import {
  AlertCircle,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  BookMarked,
  Calendar,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  Command,
  Download,
  ExternalLink,
  Eye,
  FileText,
  Filter,
  Inbox,
  LayoutDashboard,
  Loader2,
  MoreHorizontal,
  PenLine,
  Plus,
  RefreshCw,
  Search,
  Settings,
  SlidersHorizontal,
  TrendingDown,
  TrendingUp,
  Wallet,
  X,
} from "@/lib/icons";

/* ------------------------------------------------------------------ */
/* tokens                                                              */
/* ------------------------------------------------------------------ */

const bVars = {
  "--b-brand": "#4f46e5",
  "--b-brand-hover": "#4338ca",
  "--b-brand-fg": "#ffffff",
  "--b-brand-soft": "#eef2ff",
  "--b-brand-soft-dark": "#312e81",
  "--b-brand-dark": "#818cf8",
  "--b-pos": "#15803d",
  "--b-pos-dark": "#4ade80",
  "--b-neg": "#b91c1c",
  "--b-neg-dark": "#f87171",
  "--b-warn": "#b45309",
  "--b-warn-dark": "#fbbf24",
  "--b-ring": "#6366f1",
  "--b-radius": "0.5rem",
} as React.CSSProperties;

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
};

const POSITIONS: Position[] = [
  { ticker: "SSNC", name: "SS&C Technologies", shares: 420, cost: 61.4, last: 78.42, day: 0.42, weight: 12.2 },
  { ticker: "WCC", name: "Wesco International", shares: 210, cost: 142.1, last: 186.35, day: -1.87, weight: 14.5 },
  { ticker: "EVR", name: "Evercore Inc.", shares: 95, cost: 171.8, last: 268.1, day: 0.94, weight: 9.4 },
  { ticker: "TPL", name: "Texas Pacific Land", shares: 24, cost: 640.0, last: 1042.6, day: -0.31, weight: 9.3 },
  { ticker: "AMBP", name: "Ardagh Metal Packaging", shares: 6400, cost: 3.12, last: 3.94, day: 2.08, weight: 9.3 },
  { ticker: "IESC", name: "IES Holdings", shares: 180, cost: 88.5, last: 214.3, day: -0.64, weight: 14.3 },
];

const WCC_SERIES = [
  148.2, 152.6, 149.8, 158.4, 163.1, 159.7, 166.2, 171.5, 168.9, 174.3, 179.6,
  176.2, 182.4, 188.1, 184.7, 190.6, 186.35,
];

const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const money2 = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

const pct = (n: number) => `${n > 0 ? "+" : ""}${n.toFixed(2)}%`;

/* ------------------------------------------------------------------ */
/* 1. Dashboard header                                                 */
/* ------------------------------------------------------------------ */

export function DashboardHeaderBaseline() {
  return (
    <header
      style={bVars}
      className="flex w-full items-center gap-4 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-950"
    >
      <div className="flex items-center gap-2">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-[var(--b-brand-fg)]"
          style={{ backgroundColor: "var(--b-brand)" }}
          aria-hidden="true"
        >
          L
        </div>
        <span className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-50">
          Ledgerline
        </span>
      </div>

      <nav aria-label="Workspace" className="ml-4 hidden items-center gap-1 md:flex">
        {["Portfolio", "Research", "Filings", "Watchlist"].map((item, i) => (
          <a
            key={item}
            href="#"
            aria-current={i === 0 ? "page" : undefined}
            className={
              i === 0
                ? "rounded-md bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-900 dark:bg-slate-800 dark:text-slate-50"
                : "rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            }
          >
            {item}
          </a>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-2">
        <div className="relative hidden sm:block">
          <Search
            className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            type="search"
            aria-label="Search companies and filings"
            placeholder="Search WCC, 10-Q, notes..."
            className="h-9 w-56 rounded-lg border border-slate-200 bg-white pl-8 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--b-ring)] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>
        <button
          type="button"
          aria-label="Notifications, 2 unread"
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[var(--b-ring)] dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900"
        >
          <Bell className="h-4 w-4" aria-hidden="true" />
          <span
            className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full"
            style={{ backgroundColor: "var(--b-brand)" }}
          />
        </button>
        <button
          type="button"
          aria-label="Settings"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[var(--b-ring)] dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900"
        >
          <Settings className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          className="inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium text-[var(--b-brand-fg)] shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--b-ring)]"
          style={{ backgroundColor: "var(--b-brand)" }}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          New thesis
        </button>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Sidebar                                                          */
/* ------------------------------------------------------------------ */

export function SidebarBaseline() {
  const [open, setOpen] = React.useState(true);
  const [active, setActive] = React.useState("WCC");

  return (
    <aside
      style={bVars}
      aria-label="Workspace navigation"
      className="w-64 rounded-lg border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-950"
    >
      <nav className="space-y-1">
        {[
          { icon: LayoutDashboard, label: "Overview" },
          { icon: Wallet, label: "Portfolio" },
          { icon: Eye, label: "Watchlist" },
          { icon: FileText, label: "Filings" },
        ].map(({ icon: Icon, label }, i) => (
          <button
            key={label}
            type="button"
            className={
              "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--b-ring)] " +
              (i === 1
                ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100")
            }
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {label}
          </button>
        ))}
      </nav>

      <div className="mt-4 border-t border-slate-200 pt-3 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex w-full items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-[var(--b-ring)] dark:text-slate-500 dark:hover:text-slate-300"
        >
          {open ? (
            <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          Open theses
        </button>
        {open && (
          <ul className="mt-1 space-y-0.5">
            {[
              { t: "WCC", s: "draft - 14d" },
              { t: "IESC", s: "reviewed" },
              { t: "AMBP", s: "draft - 41d" },
            ].map((it) => (
              <li key={it.t}>
                <button
                  type="button"
                  onClick={() => setActive(it.t)}
                  aria-current={active === it.t ? "true" : undefined}
                  className={
                    "flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--b-ring)] " +
                    (active === it.t
                      ? "bg-[var(--b-brand-soft)] font-medium text-slate-900 dark:bg-[var(--b-brand-soft-dark)] dark:text-slate-50"
                      : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-900")
                  }
                >
                  <span className="font-mono">{it.t}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-500">{it.s}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900">
        <p className="text-xs font-medium text-slate-900 dark:text-slate-100">6 positions</p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">31% cash - last synced 4m ago</p>
      </div>
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Stat cards                                                       */
/* ------------------------------------------------------------------ */

export function StatCardsBaseline() {
  const stats = [
    { label: "Portfolio value", value: money(270075), delta: -0.42, sub: "vs. yesterday" },
    { label: "Equities", value: money(186352), delta: 51.2, sub: "unrealized, since cost" },
    { label: "Cash", value: money(83723), delta: 0, sub: "31.0% of portfolio" },
    { label: "Positions", value: "6", delta: 0, sub: "held 2.7 yrs median" },
  ];

  return (
    <div style={bVars} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950"
        >
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{s.label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            {s.value}
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-xs">
            {s.delta !== 0 && (
              <span
                className={
                  "inline-flex items-center gap-0.5 font-medium " +
                  (s.delta > 0
                    ? "text-[var(--b-pos)] dark:text-[var(--b-pos-dark)]"
                    : "text-[var(--b-neg)] dark:text-[var(--b-neg-dark)]")
                }
              >
                {s.delta > 0 ? (
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <ArrowDownRight className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                {pct(s.delta)}
              </span>
            )}
            <span className="text-slate-500 dark:text-slate-400">{s.sub}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Data table                                                       */
/* ------------------------------------------------------------------ */

export function DataTableBaseline() {
  const [sort, setSort] = React.useState<{ key: keyof Position; dir: 1 | -1 }>({
    key: "weight",
    dir: -1,
  });

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

  const cols: { key: keyof Position; label: string; numeric?: boolean }[] = [
    { key: "ticker", label: "Ticker" },
    { key: "shares", label: "Shares", numeric: true },
    { key: "cost", label: "Cost", numeric: true },
    { key: "last", label: "Last", numeric: true },
    { key: "day", label: "Day", numeric: true },
    { key: "weight", label: "Weight", numeric: true },
  ];

  return (
    <div
      style={bVars}
      className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950"
    >
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">Positions</h3>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[var(--b-ring)] dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900"
        >
          <Download className="h-3.5 w-3.5" aria-hidden="true" />
          Export
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
              {cols.map((c) => (
                <th
                  key={c.key}
                  scope="col"
                  aria-sort={
                    sort.key === c.key ? (sort.dir === 1 ? "ascending" : "descending") : "none"
                  }
                  className={c.numeric ? "px-4 py-2 text-right" : "px-4 py-2 text-left"}
                >
                  <button
                    type="button"
                    onClick={() => toggle(c.key)}
                    className={
                      "inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-[var(--b-ring)] dark:text-slate-400 dark:hover:text-slate-100 " +
                      (c.numeric ? "flex-row-reverse" : "")
                    }
                  >
                    <ChevronsUpDown className="h-3 w-3" aria-hidden="true" />
                    {c.label}
                  </button>
                </th>
              ))}
              <th scope="col" className="px-4 py-2 text-right">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr
                key={p.ticker}
                className="border-b border-slate-100 last:border-0 hover:bg-slate-50 dark:border-slate-900 dark:hover:bg-slate-900"
              >
                <td className="px-4 py-2.5">
                  <div className="font-mono font-medium text-slate-900 dark:text-slate-50">
                    {p.ticker}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{p.name}</div>
                </td>
                <td className="px-4 py-2.5 text-right tabular-nums text-slate-700 dark:text-slate-300">
                  {p.shares.toLocaleString("en-US")}
                </td>
                <td className="px-4 py-2.5 text-right tabular-nums text-slate-700 dark:text-slate-300">
                  {money2(p.cost)}
                </td>
                <td className="px-4 py-2.5 text-right tabular-nums font-medium text-slate-900 dark:text-slate-50">
                  {money2(p.last)}
                </td>
                <td
                  className={
                    "px-4 py-2.5 text-right tabular-nums font-medium " +
                    (p.day >= 0
                      ? "text-[var(--b-pos)] dark:text-[var(--b-pos-dark)]"
                      : "text-[var(--b-neg)] dark:text-[var(--b-neg-dark)]")
                  }
                >
                  {pct(p.day)}
                </td>
                <td className="px-4 py-2.5 text-right tabular-nums text-slate-700 dark:text-slate-300">
                  {p.weight.toFixed(1)}%
                </td>
                <td className="px-4 py-2.5 text-right">
                  <button
                    type="button"
                    aria-label={`Actions for ${p.ticker}`}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-[var(--b-ring)] dark:hover:bg-slate-800"
                  >
                    <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-slate-200 px-4 py-2.5 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
        <span>6 of 6 positions - 31.0% cash not shown</span>
        <span>Prices delayed 15 minutes</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 5. Chart panel                                                      */
/* ------------------------------------------------------------------ */

export function ChartPanelBaseline() {
  const [range, setRange] = React.useState("6M");
  const w = 820;
  const h = 220;
  const min = Math.min(...WCC_SERIES) - 4;
  const max = Math.max(...WCC_SERIES) + 4;
  const pts = WCC_SERIES.map((v, i) => {
    const x = (i / (WCC_SERIES.length - 1)) * w;
    const y = h - ((v - min) / (max - min)) * h;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  const area = `0,${h} ${pts} ${w},${h}`;

  return (
    <section
      style={bVars}
      aria-label="WCC price history"
      className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-baseline gap-2">
            <h3 className="font-mono text-sm font-semibold text-slate-900 dark:text-slate-50">WCC</h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">Wesco International</span>
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-semibold tabular-nums tracking-tight text-slate-900 dark:text-slate-50">
              $186.35
            </span>
            <span className="inline-flex items-center gap-0.5 text-sm font-medium text-[var(--b-neg)] dark:text-[var(--b-neg-dark)]">
              <TrendingDown className="h-4 w-4" aria-hidden="true" />
              -1.87%
            </span>
          </div>
        </div>
        <div
          role="group"
          aria-label="Chart range"
          className="inline-flex rounded-lg border border-slate-200 p-0.5 dark:border-slate-800"
        >
          {["1M", "6M", "1Y", "5Y"].map((r) => (
            <button
              key={r}
              type="button"
              aria-pressed={range === r}
              onClick={() => setRange(r)}
              className={
                "rounded-md px-2.5 py-1 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[var(--b-ring)] " +
                (range === r
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                  : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-900")
              }
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <svg
          viewBox={`0 0 ${w} ${h}`}
          className="h-52 w-full"
          role="img"
          aria-label="WCC closed at $186.35, up from $148.20 six months ago"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="b-chart-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--b-brand)" stopOpacity="0.22" />
              <stop offset="100%" stopColor="var(--b-brand)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0.25, 0.5, 0.75].map((f) => (
            <line
              key={f}
              x1="0"
              x2={w}
              y1={h * f}
              y2={h * f}
              className="stroke-slate-200 dark:stroke-slate-800"
              strokeWidth="1"
            />
          ))}
          <polygon points={area} fill="url(#b-chart-fill)" />
          <polyline
            points={pts}
            fill="none"
            stroke="var(--b-brand)"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
        <div className="mt-2 flex justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Mar</span>
          <span>Apr</span>
          <span>May</span>
          <span>Jun</span>
          <span>Jul</span>
          <span>Aug</span>
        </div>
      </div>
      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
        Range {range} - cost basis $142.10, marked on 12 Feb 2023.
      </p>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 6. Filter bar                                                       */
/* ------------------------------------------------------------------ */

export function FilterBarBaseline() {
  const [chips, setChips] = React.useState(["Held positions", "Last 90 days"]);

  return (
    <div
      style={bVars}
      className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-950"
    >
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400">
        <Filter className="h-4 w-4" aria-hidden="true" />
        Filters
      </span>

      <label className="sr-only" htmlFor="b-filter-type">
        Filing type
      </label>
      <select
        id="b-filter-type"
        defaultValue="all"
        className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[var(--b-ring)] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
      >
        <option value="all">All filing types</option>
        <option value="10q">10-Q</option>
        <option value="10k">10-K</option>
        <option value="8k">8-K</option>
        <option value="def14a">DEF 14A</option>
      </select>

      <label className="sr-only" htmlFor="b-filter-conv">
        Conviction
      </label>
      <select
        id="b-filter-conv"
        defaultValue="any"
        className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[var(--b-ring)] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
      >
        <option value="any">Any conviction</option>
        <option value="high">High</option>
        <option value="mh">Medium-high</option>
        <option value="med">Medium</option>
      </select>

      <button
        type="button"
        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-600 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[var(--b-ring)] dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900"
      >
        <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
        More
      </button>

      <div className="ml-auto flex flex-wrap items-center gap-1.5">
        {chips.map((c) => (
          <span
            key={c}
            className="inline-flex items-center gap-1 rounded-full bg-[var(--b-brand-soft)] px-2.5 py-1 text-xs font-medium text-slate-800 dark:bg-[var(--b-brand-soft-dark)] dark:text-slate-100"
          >
            {c}
            <button
              type="button"
              aria-label={`Remove filter ${c}`}
              onClick={() => setChips((prev) => prev.filter((x) => x !== c))}
              className="rounded-full p-0.5 hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-[var(--b-ring)] dark:hover:bg-white/10"
            >
              <X className="h-3 w-3" aria-hidden="true" />
            </button>
          </span>
        ))}
        {chips.length > 0 && (
          <button
            type="button"
            onClick={() => setChips([])}
            className="rounded-md px-2 py-1 text-xs font-medium text-slate-500 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-[var(--b-ring)] dark:text-slate-400 dark:hover:text-slate-100"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 7. Search                                                           */
/* ------------------------------------------------------------------ */

export function SearchBaseline() {
  const [q, setQ] = React.useState("wcc");
  const results = [
    { title: "Wesco International (WCC)", meta: "Position - 210 sh", icon: Wallet },
    { title: "WCC 10-Q - Q2 2025", meta: "Filed 3 days ago", icon: FileText },
    { title: "WCC thesis - backlog conversion", meta: "Draft, edited 14 days ago", icon: PenLine },
    { title: "WCC 8-K - segment reorganisation", meta: "Filed 6 May 2025", icon: FileText },
  ].filter((r) => r.title.toLowerCase().includes(q.toLowerCase()));

  return (
    <div style={bVars} className="w-full max-w-xl">
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search Ledgerline"
          placeholder="Search companies, filings, notes"
          className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--b-ring)] dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
        />
      </div>
      <div className="mt-2 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
        {results.length === 0 ? (
          <p className="px-3 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
            No results for &ldquo;{q}&rdquo;
          </p>
        ) : (
          <ul>
            {results.map((r) => (
              <li key={r.title}>
                <button
                  type="button"
                  className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--b-ring)] dark:hover:bg-slate-900"
                >
                  <r.icon className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm text-slate-900 dark:text-slate-100">
                      {r.title}
                    </span>
                    <span className="block truncate text-xs text-slate-500 dark:text-slate-400">
                      {r.meta}
                    </span>
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 8. Tabs                                                             */
/* ------------------------------------------------------------------ */

export function TabsBaseline() {
  const tabs = ["Thesis", "Filings", "Numbers", "Notes"] as const;
  const [active, setActive] = React.useState<(typeof tabs)[number]>("Thesis");

  return (
    <div
      style={bVars}
      className="rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950"
    >
      <div role="tablist" aria-label="WCC research" className="flex border-b border-slate-200 px-2 dark:border-slate-800">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            id={`b-tab-${t}`}
            aria-selected={active === t}
            aria-controls={`b-panel-${t}`}
            tabIndex={active === t ? 0 : -1}
            onClick={() => setActive(t)}
            className={
              "-mb-px border-b-2 px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--b-ring)] " +
              (active === t
                ? "border-[var(--b-brand)] text-slate-900 dark:text-slate-50"
                : "border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100")
            }
          >
            {t}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`b-panel-${active}`}
        aria-labelledby={`b-tab-${active}`}
        className="p-4 text-sm text-slate-700 dark:text-slate-300"
      >
        {active === "Thesis" && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Conviction: medium-high
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Edited 14 days ago
              </span>
            </div>
            <p>
              Bought WCC at $142.10 on the view that the Anixter integration was under-credited:
              distribution scale plus a datacentre and utility mix that the market was still pricing
              as cyclical electrical wholesale.
            </p>
            <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-[var(--b-warn)] dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-[var(--b-warn-dark)]">
              <span className="font-medium">Unresolved:</span> backlog conversion. Backlog is up 9%
              y/y but revenue recognition has slipped two quarters running. Check the Q2 10-Q cash
              conversion cycle before adding.
            </p>
          </div>
        )}
        {active === "Filings" && (
          <ul className="space-y-2">
            {[
              ["10-Q", "Q2 2025", "3 days ago"],
              ["8-K", "Segment reorganisation", "6 May 2025"],
              ["10-K", "FY2024", "21 Feb 2025"],
            ].map(([type, title, when]) => (
              <li key={title} className="flex items-center gap-3">
                <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {type}
                </span>
                <span className="flex-1">{title}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">{when}</span>
              </li>
            ))}
          </ul>
        )}
        {active === "Numbers" && (
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["Revenue TTM", "$21.8B"],
              ["EBITDA margin", "7.4%"],
              ["Net debt / EBITDA", "2.9x"],
              ["FCF yield", "6.1%"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs text-slate-500 dark:text-slate-400">{k}</dt>
                <dd className="mt-0.5 tabular-nums font-medium text-slate-900 dark:text-slate-50">
                  {v}
                </dd>
              </div>
            ))}
          </dl>
        )}
        {active === "Notes" && (
          <p className="text-slate-500 dark:text-slate-400">
            2 notes, most recent 14 days ago. &ldquo;Ask IR whether the datacentre backlog is booked
            at segment or corporate.&rdquo;
          </p>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 9. Modal (rendered open, inline)                                    */
/* ------------------------------------------------------------------ */

export function ModalBaseline() {
  const [conviction, setConviction] = React.useState("medium-high");

  return (
    <div
      style={bVars}
      className="relative h-[26rem] overflow-hidden rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="p-4 text-sm text-slate-400 dark:text-slate-600">Workspace behind the dialog</div>
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px]" />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="b-modal-title"
          aria-describedby="b-modal-desc"
          className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-5 shadow-lg dark:border-slate-800 dark:bg-slate-950"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2
                id="b-modal-title"
                className="text-base font-semibold text-slate-900 dark:text-slate-50"
              >
                Update conviction on WCC
              </h2>
              <p id="b-modal-desc" className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Recorded against the thesis you last edited 14 days ago.
              </p>
            </div>
            <button
              type="button"
              aria-label="Close dialog"
              className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-[var(--b-ring)] dark:hover:bg-slate-800"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <fieldset className="mt-4">
            <legend className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Conviction
            </legend>
            <div className="mt-2 space-y-1.5">
              {["high", "medium-high", "medium", "watch only"].map((c) => (
                <label
                  key={c}
                  className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
                >
                  <input
                    type="radio"
                    name="b-conviction"
                    value={c}
                    checked={conviction === c}
                    onChange={() => setConviction(c)}
                    className="h-4 w-4 accent-[var(--b-brand)]"
                  />
                  <span className="capitalize text-slate-800 dark:text-slate-200">{c}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <label
            htmlFor="b-modal-why"
            className="mt-4 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Why now
          </label>
          <textarea
            id="b-modal-why"
            rows={3}
            defaultValue="Q2 10-Q shows backlog conversion still slipping. Holding, not adding."
            className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white p-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[var(--b-ring)] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
          />

          <div className="mt-5 flex justify-end gap-2">
            <button
              type="button"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[var(--b-ring)] dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--b-brand-fg)] shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--b-ring)]"
              style={{ backgroundColor: "var(--b-brand)" }}
            >
              Save entry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 10. Drawer (rendered open, inline)                                  */
/* ------------------------------------------------------------------ */

export function DrawerBaseline() {
  return (
    <div
      style={bVars}
      className="relative h-[26rem] overflow-hidden rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="p-4 text-sm text-slate-400 dark:text-slate-600">Positions table behind</div>
      <div className="absolute inset-0 bg-slate-900/30" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="b-drawer-title"
        className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col border-l border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-950"
      >
        <div className="flex items-start justify-between border-b border-slate-200 p-4 dark:border-slate-800">
          <div>
            <h2
              id="b-drawer-title"
              className="font-mono text-sm font-semibold text-slate-900 dark:text-slate-50"
            >
              TPL
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Texas Pacific Land - 24 sh @ $640.00
            </p>
          </div>
          <button
            type="button"
            aria-label="Close panel"
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-[var(--b-ring)] dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400">Market value</p>
            <p className="mt-1 text-xl font-semibold tabular-nums text-slate-900 dark:text-slate-50">
              $25,022
            </p>
            <p className="mt-1 text-xs font-medium text-[var(--b-pos)] dark:text-[var(--b-pos-dark)]">
              +$9,662 (+62.9%) since 4 Nov 2021
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Since you last looked
            </h3>
            <ul className="mt-2 space-y-2 text-sm text-slate-700 dark:text-slate-300">
              <li className="flex gap-2">
                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
                <span>
                  8-K filed yesterday - water services segment disclosure.
                </span>
              </li>
              <li className="flex gap-2">
                <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
                <span>Price moved -0.31% today, +4.2% over 14 days.</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Thesis
            </h3>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
              Royalty acreage with no capex obligation. Held for the land, not the oil price. No open
              questions.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-200 p-4 dark:border-slate-800">
          <button
            type="button"
            className="w-full rounded-lg px-3 py-2 text-sm font-medium text-[var(--b-brand-fg)] shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--b-ring)]"
            style={{ backgroundColor: "var(--b-brand)" }}
          >
            Open full research view
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 11. Dropdown (rendered open, inline)                                */
/* ------------------------------------------------------------------ */

export function DropdownBaseline() {
  const [open, setOpen] = React.useState(true);

  return (
    <div style={bVars} className="relative h-64">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[var(--b-ring)] dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900"
      >
        WCC actions
        <ChevronDown className="h-4 w-4" aria-hidden="true" />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="WCC actions"
          className="absolute left-0 top-12 z-10 w-60 rounded-lg border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-800 dark:bg-slate-950"
        >
          {[
            { icon: PenLine, label: "Continue thesis", meta: "14d" },
            { icon: FileText, label: "Open Q2 10-Q", meta: "3d" },
            { icon: BookMarked, label: "Add to watchlist" },
            { icon: Calendar, label: "Set review date" },
          ].map((it) => (
            <button
              key={it.label}
              type="button"
              role="menuitem"
              className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[var(--b-ring)] dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <it.icon className="h-4 w-4 text-slate-400" aria-hidden="true" />
              <span className="flex-1 text-left">{it.label}</span>
              {it.meta && (
                <span className="text-xs text-slate-400">{it.meta}</span>
              )}
            </button>
          ))}
          <div className="my-1 h-px bg-slate-200 dark:bg-slate-800" />
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-[var(--b-neg)] hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-[var(--b-ring)] dark:text-[var(--b-neg-dark)] dark:hover:bg-red-950/40"
          >
            <X className="h-4 w-4" aria-hidden="true" />
            Remove from portfolio
          </button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 12. Command menu (rendered open, inline)                            */
/* ------------------------------------------------------------------ */

export function CommandMenuBaseline() {
  const items = [
    { group: "Jump to", label: "WCC - Wesco International", icon: Wallet },
    { group: "Jump to", label: "TPL - Texas Pacific Land", icon: Wallet },
    { group: "Jump to", label: "IESC - IES Holdings", icon: Wallet },
    { group: "Actions", label: "New thesis entry", icon: PenLine },
    { group: "Actions", label: "Open filings feed", icon: FileText },
    { group: "Actions", label: "Rebalance calculator", icon: SlidersHorizontal },
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
    <div
      style={bVars}
      className="relative h-[24rem] overflow-hidden rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="p-4 text-sm text-slate-400 dark:text-slate-600">Workspace behind</div>
      <div className="absolute inset-0 bg-slate-900/40" />
      <div className="absolute inset-x-0 top-10 flex justify-center px-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Command menu"
          className="w-full max-w-lg overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-950"
        >
          <div className="flex items-center gap-2 border-b border-slate-200 px-3 dark:border-slate-800">
            <Search className="h-4 w-4 text-slate-400" aria-hidden="true" />
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setIdx(0);
              }}
              onKeyDown={onKeyDown}
              aria-label="Type a command or search"
              aria-activedescendant={filtered[idx] ? `b-cmd-${idx}` : undefined}
              placeholder="Type a command or search..."
              className="h-11 flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-100"
            />
            <kbd className="rounded border border-slate-200 px-1.5 py-0.5 text-[10px] font-medium text-slate-500 dark:border-slate-700 dark:text-slate-400">
              ESC
            </kbd>
          </div>
          <div role="listbox" aria-label="Results" className="max-h-64 overflow-y-auto p-1.5">
            {groups.map((g) => (
              <div key={g} className="mb-1">
                <p className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  {g}
                </p>
                {filtered.map((it, i) =>
                  it.group === g ? (
                    <div
                      key={it.label}
                      id={`b-cmd-${i}`}
                      role="option"
                      aria-selected={i === idx}
                      onMouseEnter={() => setIdx(i)}
                      className={
                        "flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-sm " +
                        (i === idx
                          ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50"
                          : "text-slate-700 dark:text-slate-300")
                      }
                    >
                      <it.icon className="h-4 w-4 text-slate-400" aria-hidden="true" />
                      {it.label}
                    </div>
                  ) : null,
                )}
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="px-3 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                No commands found.
              </p>
            )}
          </div>
          <div className="flex items-center gap-3 border-t border-slate-200 px-3 py-2 text-[11px] text-slate-500 dark:border-slate-800 dark:text-slate-400">
            <span className="inline-flex items-center gap-1">
              <Command className="h-3 w-3" aria-hidden="true" />K to open
            </span>
            <span>Enter to select</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 13. Toast (rendered visible, inline)                                */
/* ------------------------------------------------------------------ */

export function ToastBaseline() {
  return (
    <div
      style={bVars}
      className="relative h-64 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="p-4 text-sm text-slate-400 dark:text-slate-600">Workspace</div>
      <div
        role="region"
        aria-label="Notifications"
        className="absolute bottom-4 right-4 flex w-80 flex-col gap-2"
      >
        <div
          role="status"
          className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-800 dark:bg-slate-950"
        >
          <Check
            className="mt-0.5 h-4 w-4 shrink-0 text-[var(--b-pos)] dark:text-[var(--b-pos-dark)]"
            aria-hidden="true"
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-50">Thesis saved</p>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              WCC conviction set to medium-high.
            </p>
          </div>
          <button
            type="button"
            aria-label="Dismiss notification"
            className="rounded p-0.5 text-slate-400 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-[var(--b-ring)]"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>

        <div
          role="alert"
          className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 shadow-lg dark:border-amber-900/50 dark:bg-amber-950/40"
        >
          <AlertTriangle
            className="mt-0.5 h-4 w-4 shrink-0 text-[var(--b-warn)] dark:text-[var(--b-warn-dark)]"
            aria-hidden="true"
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
              TPL filed an 8-K yesterday
            </p>
            <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
              You have an open position and no review scheduled.
            </p>
          </div>
          <button
            type="button"
            aria-label="Dismiss notification"
            className="rounded p-0.5 text-slate-400 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-[var(--b-ring)]"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 14. Empty state                                                     */
/* ------------------------------------------------------------------ */

export function EmptyStateBaseline() {
  return (
    <div
      style={bVars}
      className="rounded-lg border border-slate-200 bg-white p-12 text-center shadow-sm dark:border-slate-800 dark:bg-slate-950"
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
        <Inbox className="h-6 w-6 text-slate-400" aria-hidden="true" />
      </div>
      <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-slate-50">
        No data
      </h3>
      <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
        There is nothing to show here yet. Get started by adding your first item.
      </p>
      <button
        type="button"
        className="mt-5 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[var(--b-brand-fg)] shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--b-ring)]"
        style={{ backgroundColor: "var(--b-brand)" }}
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        Add item
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 15. Loading state                                                   */
/* ------------------------------------------------------------------ */

export function LoadingStateBaseline() {
  return (
    <div
      style={bVars}
      className="rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950"
    >
      <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
        <Loader2 className="h-4 w-4 animate-spin text-slate-400" aria-hidden="true" />
        <span className="text-sm text-slate-500 dark:text-slate-400">Loading...</span>
      </div>
      <div className="space-y-3 p-4" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="h-4 w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 flex-1 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 w-14 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          </div>
        ))}
      </div>
      <span className="sr-only" role="status">
        Loading
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 16. Error state                                                     */
/* ------------------------------------------------------------------ */

export function ErrorStateBaseline() {
  return (
    <div
      style={bVars}
      role="alert"
      className="rounded-lg border border-slate-200 bg-white p-12 text-center shadow-sm dark:border-slate-800 dark:bg-slate-950"
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/40">
        <AlertCircle
          className="h-6 w-6 text-[var(--b-neg)] dark:text-[var(--b-neg-dark)]"
          aria-hidden="true"
        />
      </div>
      <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-slate-50">
        Something went wrong
      </h3>
      <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
        We could not load your data. Please try again.
      </p>
      <div className="mt-5 flex items-center justify-center gap-2">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[var(--b-ring)] dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Retry
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[var(--b-brand-fg)] shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--b-ring)]"
          style={{ backgroundColor: "var(--b-brand)" }}
        >
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
          Contact support
        </button>
      </div>
      <p className="mt-4 text-xs text-slate-400">Error code: 500</p>
    </div>
  );
}
