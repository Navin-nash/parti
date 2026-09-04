"use client";

/* ============================================================================
 * DIRECTION — "Displacement"
 *
 * THESIS
 *   A weekly budget review is not monitoring, it is a zero-sum trade: the pot
 *   is fixed, so every pound argued into one line has to be argued out of
 *   another. A dashboard that reports performance leaves the hard half of the
 *   job on the table. This screen is an allocation instrument first and a
 *   report second — you move the money here, and the interface makes you feel
 *   what the move costs.
 *
 * SIX AXES
 *   Density        measured, with extreme scale contrast — six campaigns is
 *                  not much data. The screen spends its scale on the four
 *                  numbers that decide (spend, CAC, qualified signups, sample)
 *                  and refuses to show the forty that GA4 already shows.
 *   Structure      modular-parallel — six identical channel strips racked in a
 *                  column under one master bus. Every strip is the same shape
 *                  so a difference between campaigns is read by comparison,
 *                  never by layout. Nothing is a card.
 *   Type voice     single-family utility, numeral-led (Chivo, tabular figures
 *                  everywhere). No display face at all: this replaces a
 *                  spreadsheet, and a second typeface would be decorating a
 *                  worksheet. Hierarchy is size, weight, and column alignment.
 *   Chroma         duotone where saturation is a VARIABLE, not a category —
 *                  graphite ink carries every quantity; one violet carries
 *                  statistical confidence, and its saturation *is* the sample
 *                  size. Podcast Q3 renders palest because n=11. There is no
 *                  green/red good-bad axis, because "good" is not a property
 *                  of a campaign, only of the next pound.
 *   Motion posture responsive-only — nothing animates on load, on scroll, or
 *                  on its own. Bars resize in 140ms because your hand moved a
 *                  fader, and that is the only motion in the interface.
 *   Depth          flat, except the fader slot. The single recessed element is
 *                  the track you physically touch. Everything else separates
 *                  by rule weight and ink density — a printed media-plan
 *                  convention. Zero shadow.
 *
 * SIGNATURE — the balance beam
 *   A fixed-width master bus above the rack: the £48,000 pot as one segmented
 *   bar, a live allocated/unallocated readout, and a hatched overflow segment
 *   that runs past the end of the bar when you over-commit. It never silently
 *   rebalances — it tells you the number and makes you find it. It belongs to
 *   THIS subject because a media budget is genuinely a fixed bus and the job
 *   in the brief is reallocation; a portfolio, a docs page or a product page
 *   has nothing to balance.
 *
 * WHAT IT GIVES UP
 *   Trend archaeology — there is no date-range picker and no cohort view, so
 *   the "why did last Tuesday spike" question has to be asked elsewhere. Also
 *   any sense of celebration: nothing here ever turns green.
 * ==========================================================================*/

import * as React from "react";
import { AlertTriangle, Check, Filter, Minus, Plus } from "@/lib/icons";

const UI = "'Chivo', ui-sans-serif, system-ui, sans-serif";

type Campaign = {
  id: string; name: string; group: "Search" | "Paid social" | "Sponsorship" | "Test";
  spend: number; cac: number; signups: number; trend: number | null;
  conf: number; series: number[]; staleHours?: number;
};

const POT = 48000;

const CAMPAIGNS: Campaign[] = [
  { id: "sb", name: "Search — brand", group: "Search", spend: 6400, cac: 41, signups: 156, trend: -4, conf: 0.95, series: [43, 44, 42, 43, 41, 42, 40, 41] },
  { id: "sc", name: "Search — category", group: "Search", spend: 13200, cac: 96, signups: 138, trend: -9, conf: 0.92, series: [106, 104, 101, 99, 100, 97, 95, 96] },
  { id: "pr", name: "Paid social — retargeting", group: "Paid social", spend: 5900, cac: 58, signups: 102, trend: 6, conf: 0.84, series: [55, 54, 56, 55, 57, 56, 58, 58] },
  { id: "pp", name: "Paid social — prospecting", group: "Paid social", spend: 14800, cac: 188, signups: 79, trend: 22, conf: 0.78, series: [154, 161, 159, 168, 172, 177, 183, 188] },
  { id: "nl", name: "Newsletter sponsorships", group: "Sponsorship", spend: 4900, cac: 71, signups: 69, trend: -14, conf: 0.71, series: [83, 81, 79, 77, 76, 74, 72, 71], staleHours: 6 },
  { id: "pc", name: "Podcast — Q3 test", group: "Test", spend: 2800, cac: 255, signups: 11, trend: null, conf: 0.18, series: [] },
];

const STALE = CAMPAIGNS.find((c) => c.staleHours);

const BLENDED = [79, 80, 78, 81, 80, 82, 83, 81, 84, 85, 84, 86, 87, 86];
const GROUPS = ["All", "Search", "Paid social", "Sponsorship", "Test"] as const;
const SORTS = [
  { id: "cac", label: "CAC" },
  { id: "spend", label: "Spend" },
  { id: "trend", label: "28d trend" },
] as const;

const gbp = (n: number) => "£" + n.toLocaleString("en-GB");
const signed = (n: number) => (n > 0 ? "+" : n < 0 ? "−" : "±") + Math.abs(n);

/** ink line, shared vertical scale inside its own series. Non-text, so it is
 *  always paired with the numeric CAC beside it — never the only signal. */
function Spark({ data, stroke }: { data: number[]; stroke: string }) {
  if (!data.length) return null;
  const lo = Math.min(...data), hi = Math.max(...data);
  const d = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * 56;
      const y = 18 - ((v - lo) / (hi - lo || 1)) * 16;
      return `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg viewBox="0 0 56 20" width={56} height={20} aria-hidden className="shrink-0 overflow-visible">
      <path d={d} fill="none" stroke={stroke} strokeWidth={1.25} />
    </svg>
  );
}

/** A plate the same shape as the number it stands in for. No shimmer, no
 *  fade — the motion posture is responsive-only, so the swap from plate to
 *  figure on first load is instant, not animated. */
function Plate({ w, h = 10 }: { w: number | string; h?: number }) {
  return <span aria-hidden className="block bg-[var(--p-rule)]" style={{ width: w, height: h }} />;
}

export function NorthboundParti() {
  const [plan, setPlan] = React.useState<Record<string, number>>(
    () => Object.fromEntries(CAMPAIGNS.map((c) => [c.id, c.spend])),
  );
  const [group, setGroup] = React.useState<(typeof GROUPS)[number]>("All");
  const [sort, setSort] = React.useState<(typeof SORTS)[number]["id"]>("cac");
  const [thin, setThin] = React.useState(false);
  const [ready, setReady] = React.useState(false);

  // First load only: the plan is fetched, not shipped with the page. A
  // static plate stands in — no pulse, because nothing here animates on
  // its own, only in response to a hand on a fader.
  React.useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 420);
    return () => window.clearTimeout(t);
  }, []);

  const allocated = CAMPAIGNS.reduce((s, c) => s + plan[c.id], 0);
  const diff = allocated - POT;

  const rows = CAMPAIGNS
    .filter((c) => (group === "All" || c.group === group) && (!thin || c.signups >= 50))
    .sort((a, b) =>
      sort === "cac" ? b.cac - a.cac
        : sort === "spend" ? plan[b.id] - plan[a.id]
          : (b.trend ?? -999) - (a.trend ?? -999),
    );

  const set = (id: string, v: number) =>
    setPlan((p) => ({ ...p, [id]: Math.max(0, Math.min(24000, v)) }));

  const blendedPath = BLENDED.map((v, i) => {
    const lo = Math.min(...BLENDED), hi = Math.max(...BLENDED);
    return `${i ? "L" : "M"}${((i / (BLENDED.length - 1)) * 180).toFixed(1)} ${(28 - ((v - lo) / (hi - lo)) * 24).toFixed(1)}`;
  }).join(" ");

  return (
    <div
      data-arm="parti"
      style={
        {
          "--p-bg": "#EDEBE6", "--p-ink": "#191814", "--p-ink-2": "#4E4A42",
          "--p-ink-3": "#6E695F", "--p-rule": "#CFCAC0", "--p-edge": "#847F70",
          "--p-conf": "#5B21B6", "--p-fill": "#191814", "--p-on-fill": "#EDEBE6",
          "--p-t-2xs": "10px", "--p-t-xs": "11.5px", "--p-t-sm": "13px",
          "--p-t-base": "15px", "--p-t-md": "19px", "--p-t-lg": "24px",
          "--p-t-num": "31px", "--p-t-pot": "clamp(34px,5.2vw,54px)",
          "--p-s1": "4px", "--p-s2": "8px", "--p-s3": "12px", "--p-s4": "16px",
          "--p-s5": "24px", "--p-s6": "32px", "--p-s7": "48px",
          "--p-d": "140ms", "--p-ease": "cubic-bezier(0.3,0,0,1)",
          fontFamily: UI,
          fontVariantNumeric: "tabular-nums",
        } as React.CSSProperties
      }
      className="bg-[var(--p-bg)] text-[var(--p-ink)] dark:[--p-bg:#191815] dark:[--p-ink:#EDEBE5] dark:[--p-ink-2:#A29C90] dark:[--p-ink-3:#8A8478] dark:[--p-rule:#332F29] dark:[--p-edge:#736E63] dark:[--p-conf:#BCA4F7] dark:[--p-fill:#EDEBE5] dark:[--p-on-fill:#191815]"
    >
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Chivo:wght@300..700&display=swap"
      />

      {/* plan header ------------------------------------------------------ */}
      <header className="flex flex-wrap items-baseline gap-x-[var(--p-s4)] gap-y-[var(--p-s2)] border-b-2 border-[var(--p-ink)] px-[var(--p-s5)] py-[var(--p-s3)]">
        <span className="text-[length:var(--p-t-sm)] font-bold tracking-[0.26em] uppercase">Northbound</span>
        <span className="text-[length:var(--p-t-xs)] tracking-[0.1em] uppercase text-[var(--p-ink-3)]">
          October plan · drafted by 2 · locks Friday 17:00
        </span>
        <span className="ml-auto text-[length:var(--p-t-xs)] text-[var(--p-ink-3)]">
          Figures are last 28 days. Down is cheaper.
        </span>
      </header>

      <span role="status" className="sr-only">{ready ? "Plan loaded." : "Loading October plan…"}</span>

      {ready && STALE && (
        <div
          role="alert"
          className="flex items-start gap-[var(--p-s2)] border-b border-[var(--p-rule)] px-[var(--p-s5)] py-[var(--p-s2)]"
          style={{ background: "color-mix(in oklab, var(--p-conf) 7%, var(--p-bg))" }}
        >
          <AlertTriangle aria-hidden className="mt-[1px] size-3.5 shrink-0" style={{ color: "var(--p-conf)" }} />
          <p className="text-[length:var(--p-t-xs)] leading-[1.5] text-[var(--p-ink-2)]">
            <span className="font-medium text-[var(--p-ink)]">Attribution feed stale.</span>{" "}
            {STALE.name} last synced {STALE.staleHours}h ago, usually hourly — its signups and CAC
            below may undercount until it catches up. No other line is affected.
          </p>
        </div>
      )}

      {/* THE BALANCE BEAM — signature ------------------------------------- */}
      <section aria-label="Budget balance" className="border-b border-[var(--p-rule)] px-[var(--p-s5)] py-[var(--p-s5)]">
        {!ready ? (
          <div aria-hidden className="space-y-[var(--p-s4)]">
            <div className="flex flex-wrap items-end gap-x-[var(--p-s7)] gap-y-[var(--p-s4)]">
              <div className="space-y-[var(--p-s2)]"><Plate w={140} h={9} /><Plate w={190} h={40} /></div>
              <div className="space-y-[var(--p-s2)]"><Plate w={90} h={9} /><Plate w={70} h={26} /></div>
              <div className="space-y-[var(--p-s2)]"><Plate w={120} h={9} /><Plate w={180} h={26} /></div>
              <div className="ml-auto space-y-[var(--p-s2)]"><Plate w={90} h={9} /><Plate w={80} h={26} /></div>
            </div>
            <Plate w="100%" h={22} />
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-end gap-x-[var(--p-s7)] gap-y-[var(--p-s4)]">
              <div>
                <p className="text-[length:var(--p-t-2xs)] tracking-[0.18em] uppercase text-[var(--p-ink-3)]">
                  Next month, to allocate
                </p>
                <p className="text-[length:var(--p-t-pot)] leading-[1] font-bold">{gbp(POT)}</p>
              </div>
              <div>
                <p className="text-[length:var(--p-t-2xs)] tracking-[0.18em] uppercase text-[var(--p-ink-3)]">
                  Blended CAC
                </p>
                <p className="text-[length:var(--p-t-num)] leading-[1.05] font-medium">
                  £{(allocated / CAMPAIGNS.reduce((s, c) => s + c.signups, 0)).toFixed(0)}
                </p>
                <p className="text-[length:var(--p-t-2xs)] text-[var(--p-ink-3)]">555 qualified signups</p>
              </div>
              <div>
                <p className="text-[length:var(--p-t-2xs)] tracking-[0.18em] uppercase text-[var(--p-ink-3)]">
                  Blended CAC, 28 days
                </p>
                <svg viewBox="0 0 180 32" width={180} height={32} aria-hidden className="mt-[var(--p-s1)] block max-w-full">
                  <path d={blendedPath} fill="none" stroke="var(--p-ink-2)" strokeWidth={1.5} />
                </svg>
                <p className="text-[length:var(--p-t-2xs)] text-[var(--p-ink-3)]">£79 → £86 · rising 9%</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-[length:var(--p-t-2xs)] tracking-[0.18em] uppercase text-[var(--p-ink-3)]">
                  {diff === 0 ? "Balanced" : diff > 0 ? "Over the pot" : "Unallocated"}
                </p>
                <p
                  className="text-[length:var(--p-t-num)] leading-[1.05] font-bold"
                  style={{ color: diff > 0 ? "var(--p-conf)" : "var(--p-ink)" }}
                >
                  {diff === 0 ? gbp(0) : `${diff > 0 ? "+" : "−"}${gbp(Math.abs(diff))}`}
                </p>
                <p className="text-[length:var(--p-t-2xs)] text-[var(--p-ink-3)]">
                  {diff > 0 ? "Take it out of a line below" : diff < 0 ? "Still to place" : "Plan sums to the pot"}
                </p>
              </div>
            </div>

            {/* the bus bar */}
            <div className="mt-[var(--p-s4)] flex h-[22px] w-full border border-[var(--p-edge)]" role="img"
              aria-label={`Allocation: ${gbp(allocated)} of ${gbp(POT)}`}>
              {CAMPAIGNS.map((c) => (
                <span
                  key={c.id}
                  className="block border-r border-[var(--p-bg)] transition-[flex-grow] duration-[var(--p-d)] ease-[var(--p-ease)] last:border-r-0 motion-reduce:transition-none"
                  style={{
                    flexGrow: Math.max(plan[c.id], 1),
                    flexBasis: 0,
                    background: `color-mix(in oklab, var(--p-fill) ${Math.round(30 + c.conf * 70)}%, var(--p-bg))`,
                  }}
                />
              ))}
              {diff > 0 && (
                <span
                  className="block border-l-2 border-[var(--p-conf)]"
                  style={{
                    flexGrow: diff, flexBasis: 0,
                    backgroundImage:
                      "repeating-linear-gradient(45deg, var(--p-conf) 0 1.5px, transparent 1.5px 6px)",
                  }}
                />
              )}
            </div>
            <p className="mt-[var(--p-s1)] text-[length:var(--p-t-2xs)] text-[var(--p-ink-3)]">
              Segment darkness is sample confidence, not performance. The hatched run past the
              end is over-commitment.
            </p>
          </>
        )}
      </section>

      {/* the two conclusions ---------------------------------------------- */}
      {ready && (
      <>
      <section aria-label="Read of the week" className="grid gap-px border-b border-[var(--p-rule)] bg-[var(--p-rule)] md:grid-cols-2">
        <div className="bg-[var(--p-bg)] px-[var(--p-s5)] py-[var(--p-s4)]">
          <p className="text-[length:var(--p-t-2xs)] tracking-[0.18em] uppercase text-[var(--p-ink-3)]">
            Where the money comes from
          </p>
          <p className="mt-[var(--p-s2)] max-w-[54ch] text-[length:var(--p-t-base)] leading-[1.55] text-[var(--p-ink-2)]">
            <span className="font-medium text-[var(--p-ink)]">Paid social — prospecting</span> takes
            31% of spend and returns 14% of qualified signups, and its CAC has risen 22% in 28
            days. It is the only line where a cut funds everything else. Halving it releases{" "}
            <span className="font-medium text-[var(--p-ink)]">£7,400</span>.
          </p>
        </div>
        <div className="bg-[var(--p-bg)] px-[var(--p-s5)] py-[var(--p-s4)]">
          <p className="text-[length:var(--p-t-2xs)] tracking-[0.18em] uppercase" style={{ color: "var(--p-conf)" }}>
            Not enough evidence to move on
          </p>
          <p className="mt-[var(--p-s2)] max-w-[54ch] text-[length:var(--p-t-base)] leading-[1.55] text-[var(--p-ink-2)]">
            <span className="font-medium text-[var(--p-ink)]">Podcast — Q3 test</span> reports a £255
            CAC from 11 signups. At n=11 the true CAC sits somewhere between £150 and £690. That
            is a coin, not a result — fund one more month at £2,800 to reach n≈30, or cut it, but
            do not size a decision off that number.
          </p>
        </div>
      </section>

      {/* filters ---------------------------------------------------------- */}
      <div className="flex flex-wrap items-center gap-x-[var(--p-s5)] gap-y-[var(--p-s2)] border-b border-[var(--p-rule)] px-[var(--p-s5)] py-[var(--p-s3)]">
        <span className="flex items-center gap-[var(--p-s2)] text-[length:var(--p-t-2xs)] tracking-[0.16em] uppercase text-[var(--p-ink-3)]">
          <Filter aria-hidden className="size-3.5" /> Show
        </span>
        <div role="group" aria-label="Channel group" className="flex flex-wrap">
          {GROUPS.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGroup(g)}
              aria-pressed={group === g}
              className="border border-[var(--p-edge)] px-[var(--p-s3)] py-[var(--p-s1)] text-[length:var(--p-t-xs)] tracking-[0.08em] not-first:border-l-0 focus-visible:relative focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--p-conf)]"
              style={{
                background: group === g ? "var(--p-fill)" : "transparent",
                color: group === g ? "var(--p-on-fill)" : "var(--p-ink-2)",
              }}
            >
              {g}
            </button>
          ))}
        </div>
        <label className="flex cursor-pointer items-center gap-[var(--p-s2)] text-[length:var(--p-t-xs)] text-[var(--p-ink-2)]">
          <input
            type="checkbox"
            checked={thin}
            onChange={(e) => setThin(e.target.checked)}
            className="size-4 border border-[var(--p-edge)]"
            style={{ accentColor: "var(--p-conf)" }}
          />
          Hide lines under 50 signups
        </label>
        <div role="group" aria-label="Sort by" className="ml-auto flex items-center gap-[var(--p-s2)]">
          <span className="text-[length:var(--p-t-2xs)] tracking-[0.16em] uppercase text-[var(--p-ink-3)]">Sort</span>
          {SORTS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSort(s.id)}
              aria-pressed={sort === s.id}
              className="text-[length:var(--p-t-xs)] underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--p-conf)]"
              style={{
                color: sort === s.id ? "var(--p-ink)" : "var(--p-ink-3)",
                textDecoration: sort === s.id ? "underline" : "none",
                textDecorationThickness: 2,
                fontWeight: sort === s.id ? 600 : 400,
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* THE RACK --------------------------------------------------------- */}
      <div className="px-[var(--p-s5)] pb-[var(--p-s6)]">
        <div className="hidden grid-cols-[minmax(11rem,1.4fr)_5rem_5rem_4rem_5.5rem_minmax(9rem,1fr)] gap-[var(--p-s3)] border-b border-[var(--p-rule)] py-[var(--p-s2)] text-[length:var(--p-t-2xs)] tracking-[0.16em] uppercase text-[var(--p-ink-3)] lg:grid">
          <span>Campaign</span>
          <span className="text-right">CAC</span>
          <span className="text-right">28d</span>
          <span className="text-right">Signups</span>
          <span className="text-right">Sample</span>
          <span>Next month</span>
        </div>

        {rows.length === 0 ? (
          <p className="border-b border-[var(--p-rule)] py-[var(--p-s6)] text-[length:var(--p-t-base)] text-[var(--p-ink-2)]">
            No lines in <span className="font-medium text-[var(--p-ink)]">{group}</span> clear 50
            qualified signups. That is the finding: this group has not been funded long enough to
            read.{" "}
            <button
              type="button"
              onClick={() => setThin(false)}
              className="underline decoration-2 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--p-conf)]"
            >
              Show thin lines anyway
            </button>
          </p>
        ) : (
          rows.map((c) => {
            const p = plan[c.id];
            const d = p - c.spend;
            const conf = Math.round(30 + c.conf * 70);
            return (
              <div key={c.id} className="grid grid-cols-2 gap-x-[var(--p-s3)] gap-y-[var(--p-s2)] border-b border-[var(--p-rule)] py-[var(--p-s3)] lg:grid-cols-[minmax(11rem,1.4fr)_5rem_5rem_4rem_5.5rem_minmax(9rem,1fr)] lg:items-center">
                <div className="col-span-2 lg:col-span-1">
                  <p className="text-[length:var(--p-t-base)] leading-[1.3] font-medium">{c.name}</p>
                  <p className="text-[length:var(--p-t-2xs)] tracking-[0.1em] uppercase text-[var(--p-ink-3)]">
                    {c.group} · now {gbp(c.spend)}
                  </p>
                </div>

                <div className="flex items-baseline justify-between gap-[var(--p-s2)] lg:block lg:text-right">
                  <span className="text-[length:var(--p-t-2xs)] tracking-[0.14em] uppercase text-[var(--p-ink-3)] lg:hidden">CAC</span>
                  <span className="text-[length:var(--p-t-md)] font-medium">£{c.cac}</span>
                </div>

                <div className="flex items-baseline justify-between gap-[var(--p-s2)] lg:block lg:text-right">
                  <span className="text-[length:var(--p-t-2xs)] tracking-[0.14em] uppercase text-[var(--p-ink-3)] lg:hidden">28d</span>
                  {c.trend === null ? (
                    <span className="text-[length:var(--p-t-xs)] text-[var(--p-ink-3)]">no read</span>
                  ) : (
                    <span className="text-[length:var(--p-t-sm)]">
                      {signed(c.trend)}%{" "}
                      <span aria-hidden className="text-[var(--p-ink-3)]">{c.trend > 0 ? "↑" : "↓"}</span>
                    </span>
                  )}
                </div>

                <div className="flex items-baseline justify-between gap-[var(--p-s2)] lg:block lg:text-right">
                  <span className="text-[length:var(--p-t-2xs)] tracking-[0.14em] uppercase text-[var(--p-ink-3)] lg:hidden">Signups</span>
                  <span className="text-[length:var(--p-t-sm)]">{c.signups}</span>
                </div>

                <div className="flex items-center justify-between gap-[var(--p-s2)] lg:flex-col lg:items-end lg:gap-[2px]">
                  <span className="text-[length:var(--p-t-2xs)] tracking-[0.14em] uppercase text-[var(--p-ink-3)] lg:hidden">Sample</span>
                  <span className="flex items-center gap-[var(--p-s2)]">
                    {c.series.length ? (
                      <Spark data={c.series} stroke="var(--p-ink-2)" />
                    ) : (
                      <span className="text-[length:var(--p-t-2xs)] text-[var(--p-ink-3)]">n too small to plot</span>
                    )}
                  </span>
                  <span
                    className="text-[length:var(--p-t-2xs)] tracking-[0.1em] uppercase"
                    style={{ color: c.conf < 0.5 ? "var(--p-conf)" : "var(--p-ink-3)" }}
                  >
                    n={c.signups} · {c.conf < 0.5 ? "thin" : c.conf < 0.8 ? "usable" : "solid"}
                  </span>
                </div>

                {/* the fader — the only recessed control in the interface */}
                <div className="col-span-2 lg:col-span-1">
                  <div className="flex items-center gap-[var(--p-s2)]">
                    <button
                      type="button"
                      aria-label={`Cut ${c.name} by £200`}
                      onClick={() => set(c.id, p - 200)}
                      className="flex size-6 shrink-0 items-center justify-center border border-[var(--p-edge)] text-[var(--p-ink-2)] hover:bg-[var(--p-rule)] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--p-conf)]"
                    >
                      <Minus aria-hidden className="size-3" />
                    </button>
                    <span className="flex-1 border border-[var(--p-edge)] bg-[color-mix(in_oklab,var(--p-ink)_10%,var(--p-bg))] px-[6px] py-[3px]">
                      <input
                        type="range"
                        min={0}
                        max={24000}
                        step={200}
                        value={p}
                        onChange={(e) => set(c.id, Number(e.target.value))}
                        aria-label={`Next month budget for ${c.name}`}
                        className="block w-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--p-conf)]"
                        style={{ accentColor: "var(--p-fill)" }}
                      />
                    </span>
                    <button
                      type="button"
                      aria-label={`Fund ${c.name} by another £200`}
                      onClick={() => set(c.id, p + 200)}
                      className="flex size-6 shrink-0 items-center justify-center border border-[var(--p-edge)] text-[var(--p-ink-2)] hover:bg-[var(--p-rule)] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--p-conf)]"
                    >
                      <Plus aria-hidden className="size-3" />
                    </button>
                  </div>
                  <p className="mt-[2px] flex items-baseline gap-[var(--p-s2)]">
                    <span className="text-[length:var(--p-t-md)] font-bold">{gbp(p)}</span>
                    <span className="text-[length:var(--p-t-xs)] text-[var(--p-ink-2)]">
                      {d === 0 ? "unchanged" : `${d > 0 ? "+" : "−"}${gbp(Math.abs(d))} vs. now`}
                    </span>
                  </p>
                  <span
                    aria-hidden
                    className="mt-[2px] block h-[3px] transition-[width] duration-[var(--p-d)] ease-[var(--p-ease)] motion-reduce:transition-none"
                    style={{
                      width: `${(p / 24000) * 100}%`,
                      background: `color-mix(in oklab, var(--p-fill) ${conf}%, var(--p-bg))`,
                    }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
      </>
      )}

      {!ready && (
        <div aria-hidden className="space-y-[var(--p-s3)] px-[var(--p-s5)] pb-[var(--p-s6)] pt-[var(--p-s3)]">
          {CAMPAIGNS.map((c) => (
            <div key={c.id} className="flex flex-wrap items-center gap-[var(--p-s4)] border-b border-[var(--p-rule)] pb-[var(--p-s3)]">
              <Plate w="34%" h={14} />
              <Plate w={56} h={14} />
              <Plate w={40} h={14} />
              <Plate w={40} h={14} />
              <Plate w={64} h={14} />
              <Plate w="20%" h={14} />
            </div>
          ))}
        </div>
      )}

      {/* commit ----------------------------------------------------------- */}
      <div className="flex flex-wrap items-center gap-[var(--p-s4)] border-t-2 border-[var(--p-ink)] px-[var(--p-s5)] py-[var(--p-s4)]">
        <button
          type="button"
          disabled={!ready || diff !== 0}
          className="flex items-center gap-[var(--p-s2)] px-[var(--p-s5)] py-[0.6em] text-[length:var(--p-t-sm)] tracking-[0.14em] uppercase disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--p-conf)]"
          style={{
            background: ready && diff === 0 ? "var(--p-fill)" : "transparent",
            color: ready && diff === 0 ? "var(--p-on-fill)" : "var(--p-ink-3)",
            border: `2px solid ${ready && diff === 0 ? "var(--p-fill)" : "var(--p-edge)"}`,
          }}
        >
          <Check aria-hidden className="size-4" />
          {!ready ? "Loading plan…" : diff === 0 ? "Lock October plan" : "Plan does not balance"}
        </button>
        <p className="text-[length:var(--p-t-xs)] leading-[1.5] text-[var(--p-ink-2)]">
          {!ready
            ? "Figures are fetching from the ad platforms and GA4."
            : diff === 0
              ? "Both of you have to sign it off before Friday. Nothing is sent to the ad accounts from here."
              : `${diff > 0 ? "Over" : "Under"} by ${gbp(Math.abs(diff))}. The plan will not lock until it sums to ${gbp(POT)}.`}
        </p>
        <button
          type="button"
          disabled={!ready}
          onClick={() => setPlan(Object.fromEntries(CAMPAIGNS.map((c) => [c.id, c.spend])))}
          className="ml-auto text-[length:var(--p-t-xs)] tracking-[0.1em] uppercase text-[var(--p-ink-3)] underline underline-offset-4 hover:text-[var(--p-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--p-conf)] disabled:cursor-not-allowed disabled:no-underline disabled:opacity-60"
        >
          Reset to current spend
        </button>
      </div>
    </div>
  );
}
