"use client";

import * as React from "react";
import {
  ArrowUpDown,
  ChevronDown,
  Download,
  Lightbulb,
  Minus,
  SlidersHorizontal,
  TrendingDown,
  TrendingUp,
  TriangleAlert,
} from "@/lib/icons";

type Campaign = {
  name: string;
  channel: "Search" | "Paid social" | "Newsletter" | "Podcast";
  spend: number;
  cac: number;
  signups: number;
  cacDelta: number;
  trend: number[];
  verdict: "scale" | "hold" | "cut" | "watch";
};

const CAMPAIGNS: Campaign[] = [
  {
    name: "Search — brand",
    channel: "Search",
    spend: 8400,
    cac: 41,
    signups: 205,
    cacDelta: -4.2,
    trend: [38, 40, 39, 42, 41, 40, 41, 39, 41, 42, 40, 41],
    verdict: "hold",
  },
  {
    name: "Search — category",
    channel: "Search",
    spend: 21600,
    cac: 118,
    signups: 183,
    cacDelta: -11.5,
    trend: [148, 142, 139, 136, 131, 129, 127, 124, 122, 120, 119, 118],
    verdict: "scale",
  },
  {
    name: "Paid social — retargeting",
    channel: "Paid social",
    spend: 9900,
    cac: 87,
    signups: 114,
    cacDelta: 2.1,
    trend: [82, 84, 83, 85, 84, 86, 85, 87, 86, 88, 87, 87],
    verdict: "hold",
  },
  {
    name: "Paid social — prospecting",
    channel: "Paid social",
    spend: 18200,
    cac: 264,
    signups: 69,
    cacDelta: 19.8,
    trend: [201, 209, 218, 224, 231, 238, 244, 249, 253, 258, 261, 264],
    verdict: "cut",
  },
  {
    name: "Newsletter sponsorships",
    channel: "Newsletter",
    spend: 6200,
    cac: 96,
    signups: 65,
    cacDelta: -6.8,
    trend: [110, 108, 107, 104, 103, 101, 100, 99, 98, 97, 96, 96],
    verdict: "scale",
  },
  {
    name: "Podcast — Q3 test",
    channel: "Podcast",
    spend: 4500,
    cac: 375,
    signups: 12,
    cacDelta: 0,
    trend: [0, 0, 410, 398, 402, 388, 391, 380, 377, 379, 374, 375],
    verdict: "watch",
  },
];

const VERDICT = {
  scale: { label: "Scale", cls: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" },
  hold: { label: "Hold", cls: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300" },
  cut: { label: "Cut", cls: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300" },
  watch: { label: "Low sample", cls: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300" },
} as const;

function Card({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 ${className}`}>
      {children}
    </div>
  );
}

function Sparkline({ data, negativeIsGood = true }: { data: number[]; negativeIsGood?: boolean }) {
  const pts = data.filter((v) => v > 0);
  const min = Math.min(...pts);
  const max = Math.max(...pts);
  const rising = pts[pts.length - 1] > pts[0];
  const good = negativeIsGood ? !rising : rising;
  const path = pts
    .map((v, i) => `${(i / (pts.length - 1)) * 64},${16 - ((v - min) / Math.max(max - min, 1)) * 14}`)
    .join(" ");
  return (
    <svg viewBox="0 0 64 16" className="h-4 w-16 overflow-visible" aria-hidden="true">
      <polyline
        points={path}
        fill="none"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
        className={good ? "stroke-emerald-500" : "stroke-rose-500"}
      />
    </svg>
  );
}

function SpendChart({ metric }: { metric: "spend" | "signups" }) {
  const max = Math.max(...CAMPAIGNS.map((c) => (metric === "spend" ? c.spend : c.signups)));
  return (
    <div className="space-y-2.5">
      {CAMPAIGNS.map((c) => {
        const v = metric === "spend" ? c.spend : c.signups;
        return (
          <div key={c.name} className="flex items-center gap-3">
            <div className="w-44 shrink-0 truncate text-xs text-slate-600 dark:text-slate-400">{c.name}</div>
            <div className="h-5 flex-1 rounded bg-slate-100 dark:bg-slate-800">
              <div
                className={`h-5 rounded ${c.verdict === "cut" ? "bg-rose-400" : "bg-[var(--b-accent)]"}`}
                style={{ width: `${Math.max((v / max) * 100, 2)}%` }}
              />
            </div>
            <div className="w-20 shrink-0 text-right text-xs tabular-nums">
              {metric === "spend" ? `$${v.toLocaleString()}` : v}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function NorthboundBaseline() {
  const [channel, setChannel] = React.useState<string>("All channels");
  const [range, setRange] = React.useState("Last 28 days");
  const [sort, setSort] = React.useState<"cac" | "spend" | "signups">("cac");
  const [metric, setMetric] = React.useState<"spend" | "signups">("spend");

  const rows = React.useMemo(() => {
    const filtered =
      channel === "All channels" ? CAMPAIGNS : CAMPAIGNS.filter((c) => c.channel === channel);
    return [...filtered].sort((a, b) => (sort === "cac" ? a.cac - b.cac : b[sort] - a[sort]));
  }, [channel, sort]);

  const totalSpend = rows.reduce((s, c) => s + c.spend, 0);
  const totalSignups = rows.reduce((s, c) => s + c.signups, 0);

  return (
    <div
      data-arm="baseline"
      style={
        {
          "--b-accent": "#0d9488",
          "--b-accent-hover": "#0f766e",
          "--b-accent-soft": "#ccfbf1",
          "--b-accent-ink": "#115e59",
        } as React.CSSProperties
      }
      className="min-h-[720px] w-full bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100"
    >
      <header className="border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <h1 className="text-lg font-semibold">Campaign performance</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Northbound · budget review for December · $68,800 committed of $75,000
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
              <Download className="h-4 w-4" /> Export
            </button>
            <button className="rounded-lg bg-[var(--b-accent)] px-3 py-1.5 text-sm font-medium text-white hover:bg-[var(--b-accent-hover)]">
              Reallocate budget
            </button>
          </div>
        </div>
      </header>

      <main className="space-y-5 p-6">
        {/* KPI summary */}
        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: "Spend (28d)", value: `$${totalSpend.toLocaleString()}`, delta: 6.2, invert: false, sub: "vs prior 28 days" },
            { label: "Qualified signups", value: totalSignups.toLocaleString(), delta: 11.4, invert: false, sub: "vs prior 28 days" },
            { label: "Blended CAC", value: `$${Math.round(totalSpend / Math.max(totalSignups, 1))}`, delta: -4.7, invert: true, sub: "target $110" },
            { label: "Unallocated", value: "$6,200", delta: 0, invert: false, sub: "decide by Friday" },
          ].map((k) => {
            const good = k.invert ? k.delta < 0 : k.delta > 0;
            return (
              <Card key={k.label} className="p-4">
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400">{k.label}</div>
                <div className="mt-1 text-2xl font-semibold tabular-nums">{k.value}</div>
                <div className="mt-1 flex items-center gap-1.5 text-xs">
                  {k.delta === 0 ? (
                    <Minus className="h-3.5 w-3.5 text-slate-400" />
                  ) : good ? (
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
                  )}
                  <span className={good && k.delta !== 0 ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400"}>
                    {k.delta !== 0 && `${k.delta > 0 ? "+" : ""}${k.delta}% · `}
                    {k.sub}
                  </span>
                </div>
              </Card>
            );
          })}
        </section>

        <div className="grid gap-5 lg:grid-cols-3">
          {/* Chart */}
          <Card className="p-4 lg:col-span-2">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-semibold">By campaign</h2>
              <div className="inline-flex rounded-lg border border-slate-200 p-0.5 dark:border-slate-700">
                {(["spend", "signups"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMetric(m)}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium capitalize ${
                      metric === m
                        ? "bg-[var(--b-accent-soft)] text-[var(--b-accent-ink)]"
                        : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                    }`}
                  >
                    {m === "spend" ? "Spend" : "Signups"}
                  </button>
                ))}
              </div>
            </div>
            <SpendChart metric={metric} />
          </Card>

          {/* Insight panel */}
          <Card className="p-4">
            <div className="mb-3 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-[var(--b-accent)]" />
              <h2 className="text-sm font-semibold">What to do with $6,200</h2>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-900 dark:bg-emerald-950/40">
                <div className="font-medium text-emerald-900 dark:text-emerald-200">Move it to Search — category</div>
                <p className="mt-1 text-emerald-900/80 dark:text-emerald-200/80">
                  CAC fell 11.5% over 28 days at rising spend, and impression share is still 61%. Headroom exists.
                </p>
              </li>
              <li className="rounded-lg border border-rose-200 bg-rose-50 p-3 dark:border-rose-900 dark:bg-rose-950/40">
                <div className="font-medium text-rose-900 dark:text-rose-200">Cut Paid social — prospecting</div>
                <p className="mt-1 text-rose-900/80 dark:text-rose-200/80">
                  $18,200 for 69 signups at $264 CAC, up 19.8% and still climbing. It is the largest line item and the
                  worst one.
                </p>
              </li>
              <li className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950/40">
                <div className="flex items-center gap-1.5 font-medium text-amber-900 dark:text-amber-200">
                  <TriangleAlert className="h-3.5 w-3.5" /> Podcast — Q3 test is not decidable yet
                </div>
                <p className="mt-1 text-amber-900/80 dark:text-amber-200/80">
                  12 signups on $4,500. At n=12 the $375 CAC has a confidence interval wide enough to include $150.
                  Run one more flight or stop, but do not read the number as a result.
                </p>
              </li>
            </ul>
          </Card>
        </div>

        {/* Filters + table */}
        <Card>
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
            <SlidersHorizontal className="h-4 w-4 text-slate-400" />
            {[
              { value: channel, set: setChannel, options: ["All channels", "Search", "Paid social", "Newsletter", "Podcast"], label: "Channel" },
              { value: range, set: setRange, options: ["Last 28 days", "Last 14 days", "Quarter to date"], label: "Range" },
            ].map((f) => (
              <div key={f.label} className="relative">
                <select
                  aria-label={f.label}
                  value={f.value}
                  onChange={(e) => f.set(e.target.value)}
                  className="appearance-none rounded-lg border border-slate-200 bg-white py-1.5 pr-8 pl-3 text-sm dark:border-slate-700 dark:bg-slate-900"
                >
                  {f.options.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            ))}
            <span className="ml-auto text-xs text-slate-500 dark:text-slate-400">
              {rows.length} campaigns · sorted by {sort === "cac" ? "CAC, lowest first" : sort}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
                  <th className="px-4 py-2.5 font-medium">Campaign</th>
                  {(["spend", "cac", "signups"] as const).map((col) => (
                    <th key={col} className="px-4 py-2.5 text-right font-medium">
                      <button onClick={() => setSort(col)} className="inline-flex items-center gap-1 hover:text-slate-800 dark:hover:text-slate-200">
                        {col === "cac" ? "CAC" : col === "spend" ? "Spend" : "Signups"}
                        <ArrowUpDown className={`h-3 w-3 ${sort === col ? "text-[var(--b-accent)]" : ""}`} />
                      </button>
                    </th>
                  ))}
                  <th className="px-4 py-2.5 font-medium">28-day CAC trend</th>
                  <th className="px-4 py-2.5 font-medium">Call</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((c) => (
                  <tr key={c.name} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50">
                    <td className="px-4 py-3">
                      <div className="font-medium">{c.name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{c.channel}</div>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">${c.spend.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      <div>${c.cac}</div>
                      {c.cacDelta !== 0 && (
                        <div className={`text-xs ${c.cacDelta < 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                          {c.cacDelta > 0 ? "+" : ""}
                          {c.cacDelta}%
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {c.signups}
                      {c.signups < 20 && <span className="ml-1 text-xs text-amber-600 dark:text-amber-400">n low</span>}
                    </td>
                    <td className="px-4 py-3">
                      <Sparkline data={c.trend} />
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ${VERDICT[c.verdict].cls}`}>
                        {VERDICT[c.verdict].label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-50 text-xs font-medium dark:bg-slate-800/50">
                  <td className="px-4 py-2.5">Total</td>
                  <td className="px-4 py-2.5 text-right tabular-nums">${totalSpend.toLocaleString()}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums">${Math.round(totalSpend / Math.max(totalSignups, 1))}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums">{totalSignups}</td>
                  <td colSpan={2} />
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
}
