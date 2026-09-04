"use client";

/* ==================================================================
 * CADENCE — marketing group, parti arm
 *
 * DIRECTION — "Append-Only"
 *
 * THESIS
 * The audience already lived the failure this product fixes: a deploy
 * landed mid-run and left a customer half-refunded. They will not be
 * persuaded by a claim; they will be persuaded by the artifact — the
 * run record that shows the interruption, the retry ladder, the
 * resume, and the commit. So the page is not a page about a runtime.
 * The page IS a run journal: ten append-only records, each with a
 * sequence number, an offset from t0, and a committed status. The
 * marketing surface and the product surface are the same surface.
 *
 * SIX AXES
 *   Density        dense — this audience reads psql output and span
 *                  waterfalls all day; sparse marketing reads as
 *                  something being withheld.
 *   Structure      grid-strict — a fixed 92px seq gutter and a 4px
 *                  baseline across every record. No bento, no cards.
 *   Type voice     mono-technical — JetBrains Mono carries all
 *                  structure (seq, offsets, status, data, labels);
 *                  IBM Plex Sans carries prose only. Not Inter, not
 *                  Geist: those are this category's house style.
 *   Chroma         achromatic-with-material — a graphite/paper ramp
 *                  and NO brand accent. The only three chromatic
 *                  values on the page are run statuses (committed /
 *                  retrying / failed). Color means state or nothing.
 *   Motion posture responsive-only, with one choreographed moment.
 *   Depth          flat — elevation is a ground step plus a 1px rule.
 *                  Zero box-shadows in this file. Zero.
 *
 * SIGNATURE
 * The seq gutter. Every component on the page opens with the same
 * left rail — record number, +offset, status glyph — so scrolling the
 * page reads as scrolling one continuous run. Its fullest expression
 * is the hero's span waterfall + replay scrubber: step through a real
 * failed-then-resumed run and watch the playhead and step detail
 * follow. That is the product demonstrated, not described.
 *
 * WHAT IT GIVES UP
 * Warmth, and any chance with a non-technical buyer. There is no hero
 * image, no gradient, no lift. It is legible at a glance only to
 * someone who has read a trace viewer, and it puts the entire load on
 * the copy — with no accent color and no illustration, a weak
 * sentence has nothing covering it. It also forfeits the logo cloud:
 * a logo is not evidence, so the social-proof slot carries a
 * deployment ledger instead, which converts worse and lies less.
 *
 * TOKENS
 *   type ratio 1.2 from 11px — 11 / 13 / 16 / 19 / 23 / 27 / 39
 *   space base 4px — 4 8 12 16 24 32 48 64
 *   radius 0 everywhere structural; 2px on chips and inputs only
 *   elevation --p-e0 ground · --p-e1 record+rule · --p-e2 record+rule-2
 *   motion 120ms state / 180ms scrub / 240ms disclose,
 *          cubic-bezier(0.2, 0, 0, 1); all gated on motion-safe
 *
 * CONTRAST (measured, scripts/color.py — all AA body or better)
 *   ink/record 18.04 · ink/ground 16.39 · ink-2/record 8.78
 *   ink-3/gutter 4.52 · ok/record 6.15 · retry/record 5.93
 *   fail/record 7.19 · inv-fg/inv-bg 16.39
 *   dark: ink/record 15.18 · ink-2/record 7.59 · ink-3/gutter 5.44
 *   dark: ok 7.93 · retry 7.70 · fail 5.89
 * ================================================================== */

import * as React from "react";

/* ---------------------------------------------------------------- */
/* Token set — declared inline on every component root               */
/* ---------------------------------------------------------------- */

const T = {
  "--p-sans": "'IBM Plex Sans', 'Segoe UI', system-ui, sans-serif",
  "--p-mono":
    "'JetBrains Mono', ui-monospace, 'Cascadia Mono', 'SF Mono', Menlo, monospace",

  "--p-ground": "#f4f4f2",
  "--p-ground-d": "#101012",
  "--p-record": "#ffffff",
  "--p-record-d": "#17171a",
  "--p-gutter": "#ececea",
  "--p-gutter-d": "#131315",
  "--p-rule": "#d6d6d2",
  "--p-rule-d": "#2a2a30",
  "--p-rule-2": "#b4b4ae",
  "--p-rule-2-d": "#3c3c46",

  "--p-ink": "#16161a",
  "--p-ink-d": "#ececf0",
  "--p-ink-2": "#4a4a52",
  "--p-ink-2-d": "#a8a8b2",
  "--p-ink-3": "#6a6a74",
  "--p-ink-3-d": "#8a8a96",

  "--p-ok": "#1f6f43",
  "--p-ok-d": "#57c08a",
  "--p-retry": "#8a5a00",
  "--p-retry-d": "#d9a03c",
  "--p-fail": "#a32b1e",
  "--p-fail-d": "#e8705f",

  "--p-inv-bg": "#16161a",
  "--p-inv-bg-d": "#ececf0",
  "--p-inv-fg": "#f4f4f2",
  "--p-inv-fg-d": "#16161a",

  "--p-ease": "cubic-bezier(0.2, 0, 0, 1)",
} as React.CSSProperties;

const SHEET = `@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap');
[data-arm="parti"]{font-family:var(--p-sans);-webkit-font-smoothing:antialiased}
[data-arm="parti"] .p-mono{font-family:var(--p-mono);font-variant-numeric:tabular-nums}
[data-arm="parti"] .p-num{font-variant-numeric:tabular-nums}
@keyframes p-attempt{0%,100%{opacity:1}50%{opacity:.42}}
@keyframes p-commit{from{transform:scaleX(0)}to{transform:scaleX(1)}}`;

function Sheet() {
  return <style dangerouslySetInnerHTML={{ __html: SHEET }} />;
}

/* ---------------------------------------------------------------- */
/* Shared primitives                                                 */
/* ---------------------------------------------------------------- */

type Tone = "ok" | "retry" | "fail" | "idle";

const GLYPH: Record<Tone, string> = {
  ok: "●",
  retry: "▲",
  fail: "✕",
  idle: "·",
};

const TONE_TEXT: Record<Tone, string> = {
  ok: "text-[var(--p-ok)] dark:text-[var(--p-ok-d)]",
  retry: "text-[var(--p-retry)] dark:text-[var(--p-retry-d)]",
  fail: "text-[var(--p-fail)] dark:text-[var(--p-fail-d)]",
  idle: "text-[var(--p-ink-3)] dark:text-[var(--p-ink-3-d)]",
};

interface RecordProps {
  seq: string;
  offset: string;
  tone?: Tone;
  state: string;
  children: React.ReactNode;
  inverted?: boolean;
}

/** The signature: seq gutter + record body. Every section uses it. */
function Rec({ seq, offset, tone = "ok", state, children, inverted }: RecordProps) {
  const body = inverted
    ? "bg-[var(--p-inv-bg)] text-[var(--p-inv-fg)] dark:bg-[var(--p-inv-bg-d)] dark:text-[var(--p-inv-fg-d)]"
    : "bg-[var(--p-record)] text-[var(--p-ink)] dark:bg-[var(--p-record-d)] dark:text-[var(--p-ink-d)]";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-[92px_1fr] border-y border-[var(--p-rule)] dark:border-[var(--p-rule-d)]">
      <div className="p-mono flex flex-row sm:flex-col gap-3 sm:gap-1 items-center sm:items-end px-4 sm:px-3 py-3 sm:py-6 text-[11px] leading-[16px] bg-[var(--p-gutter)] dark:bg-[var(--p-gutter-d)] text-[var(--p-ink-3)] dark:text-[var(--p-ink-3-d)] sm:border-r border-[var(--p-rule)] dark:border-[var(--p-rule-d)]">
        <span className="tracking-[0.08em]">{seq}</span>
        <span>{offset}</span>
        <span className={`${TONE_TEXT[tone]} whitespace-nowrap`}>
          {GLYPH[tone]} {state}
        </span>
      </div>
      <div className={body}>{children}</div>
    </div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="p-mono text-[11px] uppercase tracking-[0.14em] text-[var(--p-ink-3)] dark:text-[var(--p-ink-3-d)]">
      {children}
    </p>
  );
}

/* ================================================================== */
/* 01 — Navigation                                                     */
/* ================================================================== */

const NAV = [
  { label: "docs", note: "quickstart, SDK, recipes" },
  { label: "runtime", note: "execution model" },
  { label: "replay", note: "run diffing" },
  { label: "pricing", note: "per step" },
  { label: "changelog", note: "v0.9.4" },
];

export function NavigationBarParti() {
  const [open, setOpen] = React.useState(false);
  const [degraded, setDegraded] = React.useState(false);

  return (
    <header
      data-arm="parti"
      style={T}
      className="w-full bg-[var(--p-record)] dark:bg-[var(--p-record-d)]"
    >
      <Sheet />
      <div className="flex items-center gap-6 px-5 h-14 border-b border-[var(--p-rule)] dark:border-[var(--p-rule-d)]">
        <a
          href="#top"
          className="p-mono flex items-center gap-2 text-[15px] font-bold tracking-[-0.01em] text-[var(--p-ink)] dark:text-[var(--p-ink-d)] focus:outline-2 focus:outline-offset-2 focus:outline-[var(--p-ink)] dark:focus:outline-[var(--p-ink-d)]"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <rect x="0" y="1.5" width="8" height="2" fill="currentColor" />
            <rect x="3" y="6" width="9" height="2" fill="currentColor" />
            <rect x="6" y="10.5" width="8" height="2" fill="currentColor" />
          </svg>
          cadence
        </a>

        <nav className="hidden md:flex items-center" aria-label="Primary">
          {NAV.map((item, i) => (
            <React.Fragment key={item.label}>
              {i > 0 && (
                <span
                  aria-hidden="true"
                  className="p-mono px-2 text-[13px] text-[var(--p-rule-2)] dark:text-[var(--p-rule-2-d)]"
                >
                  /
                </span>
              )}
              <a
                href={`#${item.label}`}
                title={item.note}
                className="p-mono text-[13px] text-[var(--p-ink-2)] dark:text-[var(--p-ink-2-d)] hover:text-[var(--p-ink)] dark:hover:text-[var(--p-ink-d)] underline-offset-4 hover:underline decoration-[var(--p-rule-2)] focus:outline-2 focus:outline-offset-2 focus:outline-[var(--p-ink)] dark:focus:outline-[var(--p-ink-d)]"
              >
                {item.label}
              </a>
            </React.Fragment>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <kbd className="p-mono hidden lg:inline-block rounded-[2px] border border-[var(--p-rule)] dark:border-[var(--p-rule-d)] px-1.5 py-0.5 text-[11px] text-[var(--p-ink-3)] dark:text-[var(--p-ink-3-d)]">
            ⌘K
          </kbd>
          <a
            href="#signin"
            className="p-mono hidden sm:inline text-[13px] text-[var(--p-ink-2)] dark:text-[var(--p-ink-2-d)] hover:text-[var(--p-ink)] dark:hover:text-[var(--p-ink-d)] focus:outline-2 focus:outline-offset-2 focus:outline-[var(--p-ink)] dark:focus:outline-[var(--p-ink-d)]"
          >
            sign in
          </a>
          <a
            href="#start"
            className="p-mono text-[13px] px-3 py-1.5 bg-[var(--p-inv-bg)] text-[var(--p-inv-fg)] dark:bg-[var(--p-inv-bg-d)] dark:text-[var(--p-inv-fg-d)] focus:outline-2 focus:outline-offset-2 focus:outline-[var(--p-ink)] dark:focus:outline-[var(--p-ink-d)]"
          >
            start a run
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="p-mono md:hidden h-8 w-8 border border-[var(--p-rule)] dark:border-[var(--p-rule-d)] text-[13px] text-[var(--p-ink)] dark:text-[var(--p-ink-d)] focus:outline-2 focus:outline-offset-2 focus:outline-[var(--p-ink)] dark:focus:outline-[var(--p-ink-d)]"
          >
            {open ? "✕" : "≡"}
            <span className="sr-only">Toggle navigation</span>
          </button>
        </div>
      </div>

      {/* Status strip — the second row a trace tool always has. */}
      <div className="p-mono flex flex-wrap items-center gap-x-5 gap-y-1 px-5 py-2 text-[11px] bg-[var(--p-gutter)] dark:bg-[var(--p-gutter-d)] border-b border-[var(--p-rule)] dark:border-[var(--p-rule-d)] text-[var(--p-ink-3)] dark:text-[var(--p-ink-3-d)]">
        <button
          type="button"
          onClick={() => setDegraded((v) => !v)}
          className={`${degraded ? TONE_TEXT.retry : TONE_TEXT.ok} focus:outline-2 focus:outline-offset-2 focus:outline-[var(--p-ink)] dark:focus:outline-[var(--p-ink-d)]`}
        >
          {degraded ? "▲ control plane degraded" : "● control plane nominal"}
        </button>
        <span>region us-east-1</span>
        <span>workers {degraded ? "18/24" : "24/24"}</span>
        <span>
          journal lag{" "}
          <span className={degraded ? TONE_TEXT.retry : ""}>
            {degraded ? "1.9s" : "41ms"}
          </span>
        </span>
        <a href="#status" className="ml-auto underline underline-offset-4">
          status.cadence.dev
        </a>
      </div>

      {open && (
        <nav
          aria-label="Primary, small screens"
          className="md:hidden border-b border-[var(--p-rule)] dark:border-[var(--p-rule-d)]"
        >
          {NAV.map((item) => (
            <a
              key={item.label}
              href={`#${item.label}`}
              className="p-mono flex items-baseline gap-3 px-5 py-2.5 text-[13px] border-b border-[var(--p-rule)] dark:border-[var(--p-rule-d)] last:border-b-0 text-[var(--p-ink)] dark:text-[var(--p-ink-d)]"
            >
              <span className="w-24">{item.label}</span>
              <span className="text-[11px] text-[var(--p-ink-3)] dark:text-[var(--p-ink-3-d)]">
                {item.note}
              </span>
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}

/* ================================================================== */
/* 02 — Announcement                                                   */
/* ================================================================== */

export function AnnouncementBarParti() {
  const [dismissed, setDismissed] = React.useState(false);

  return (
    <div
      data-arm="parti"
      style={T}
      className="w-full bg-[var(--p-ground)] dark:bg-[var(--p-ground-d)]"
    >
      <Sheet />
      {dismissed ? (
        <div className="p-mono flex items-center gap-3 px-5 py-2 text-[11px] border-y border-[var(--p-rule)] dark:border-[var(--p-rule-d)] bg-[var(--p-gutter)] dark:bg-[var(--p-gutter-d)] text-[var(--p-ink-3)] dark:text-[var(--p-ink-3-d)]">
          <span>0001</span>
          <span>record dismissed — nothing is deleted from a log</span>
          <button
            type="button"
            onClick={() => setDismissed(false)}
            className="ml-auto underline underline-offset-4 text-[var(--p-ink-2)] dark:text-[var(--p-ink-2-d)] focus:outline-2 focus:outline-offset-2 focus:outline-[var(--p-ink)] dark:focus:outline-[var(--p-ink-d)]"
          >
            restore
          </button>
        </div>
      ) : (
        <Rec seq="0001" offset="+00:00.0" tone="ok" state="commit">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 px-5 py-3">
            <span className="p-mono text-[11px] px-1.5 py-0.5 rounded-[2px] border border-[var(--p-rule-2)] dark:border-[var(--p-rule-2-d)] text-[var(--p-ink-2)] dark:text-[var(--p-ink-2-d)]">
              v0.9.4
            </span>
            <p className="text-[15px] leading-[24px] text-[var(--p-ink)] dark:text-[var(--p-ink-d)]">
              Deterministic replay left preview. Any run in the journal can now
              be re-executed against a changed prompt or a patched tool.
            </p>
            <a
              href="#changelog"
              className="p-mono text-[13px] underline underline-offset-4 text-[var(--p-ink-2)] dark:text-[var(--p-ink-2-d)] focus:outline-2 focus:outline-offset-2 focus:outline-[var(--p-ink)] dark:focus:outline-[var(--p-ink-d)]"
            >
              read the notes
            </a>
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="p-mono ml-auto text-[13px] text-[var(--p-ink-3)] dark:text-[var(--p-ink-3-d)] hover:text-[var(--p-ink)] dark:hover:text-[var(--p-ink-d)] focus:outline-2 focus:outline-offset-2 focus:outline-[var(--p-ink)] dark:focus:outline-[var(--p-ink-d)]"
            >
              dismiss
              <span className="sr-only"> announcement</span>
            </button>
          </div>
        </Rec>
      )}
    </div>
  );
}

/* ================================================================== */
/* 03 — Hero: the span waterfall + replay scrubber (signature)          */
/* ================================================================== */

interface Step {
  seq: string;
  at: string;
  name: string;
  kind: string;
  dur: string;
  tone: Tone;
  start: number;
  span: number;
  headline: string;
  detail: [string, string][];
}

const RUN: Step[] = [
  {
    seq: "01",
    at: "+00.000",
    name: "plan",
    kind: "model",
    dur: "412ms",
    tone: "ok",
    start: 0,
    span: 3.2,
    headline: "Model chose lookupOrder, then issueRefund.",
    detail: [
      ["input", '{ orderId: "ord_8123", reason: "damaged" }'],
      ["tokens", "1,204 in / 96 out"],
      ["committed", "journal offset 0x00a1"],
    ],
  },
  {
    seq: "02",
    at: "+00.412",
    name: "lookupOrder",
    kind: "tool",
    dur: "88ms",
    tone: "ok",
    start: 3.2,
    span: 0.7,
    headline: "Read-only. Result typed and recorded.",
    detail: [
      ["args", '{ orderId: "ord_8123" }'],
      ["result", '{ totalCents: 4850, status: "shipped" }'],
      ["committed", "journal offset 0x00c4"],
    ],
  },
  {
    seq: "03",
    at: "+00.500",
    name: "issueRefund",
    kind: "tool",
    dur: "3.00s",
    tone: "retry",
    start: 3.9,
    span: 23.1,
    headline: "Attempt 1 of 5 — upstream timeout.",
    detail: [
      ["args", '{ orderId: "ord_8123", amountCents: 4850 }'],
      ["outcome", "timeout after 3.00s, no response body"],
      ["side effect", "none recorded — step not committed"],
      ["next", "retry in 2s (exponential, base 2s, max 1m)"],
    ],
  },
  {
    seq: "04",
    at: "+03.500",
    name: "issueRefund",
    kind: "tool",
    dur: "6.00s",
    tone: "retry",
    start: 27.0,
    span: 46.2,
    headline: "Attempt 2 of 5 — 502 from the payments gateway.",
    detail: [
      ["outcome", "HTTP 502, gateway upstream_unavailable"],
      ["idempotency", 'key "ord_8123" reused — safe to re-send'],
      ["next", "retry in 4s"],
    ],
  },
  {
    seq: "05",
    at: "+09.500",
    name: "issueRefund",
    kind: "tool",
    dur: "2.70s",
    tone: "fail",
    start: 73.2,
    span: 20.8,
    headline: "Attempt 3 of 5 — the worker process died mid-call.",
    detail: [
      ["cause", "SIGTERM, rolling deploy of worker image :a41f0c"],
      ["journal", "step 05 never committed — the log has no result"],
      ["blast radius", "0 duplicate refunds; the side effect never landed"],
      ["recovery", "run rescheduled on worker w-07"],
    ],
  },
  {
    seq: "06",
    at: "+00.020",
    name: "issueRefund",
    kind: "tool",
    dur: "240ms",
    tone: "ok",
    start: 94.0,
    span: 1.8,
    headline: "Resumed on a new worker. Steps 01–04 were not re-run.",
    detail: [
      ["worker", "w-07, cold start 20ms"],
      ["restored from", "journal — 4 committed steps replayed, 0 re-executed"],
      ["result", '{ refundId: "rf_31c9" }'],
      ["committed", "journal offset 0x4f1c"],
    ],
  },
  {
    seq: "07",
    at: "+00.260",
    name: "respond",
    kind: "model",
    dur: "301ms",
    tone: "ok",
    start: 95.8,
    span: 2.3,
    headline: "Run closed. 7 records, 1 interruption, 1 side effect.",
    detail: [
      ["output", '"Refunded $48.50 to the original card."'],
      ["run", "run_9f2a41 — terminal, committed"],
      ["replayable", "yes — cadence replay run_9f2a41 --from 03"],
    ],
  },
];

export function HeroParti() {
  const [cursor, setCursor] = React.useState(4);
  const step = RUN[cursor];

  return (
    <section
      data-arm="parti"
      style={T}
      className="w-full bg-[var(--p-ground)] dark:bg-[var(--p-ground-d)]"
    >
      <Sheet />
      <Rec seq="0002" offset="+00:00.4" tone="ok" state="commit">
        <div className="px-5 sm:px-7 py-8">
          <Eyebrow>runtime · durable execution · typed tools</Eyebrow>
          <h1 className="mt-4 max-w-[19ch] text-[39px] leading-[44px] font-semibold tracking-[-0.02em] text-[var(--p-ink)] dark:text-[var(--p-ink-d)]">
            The prototype was fine. The deploy is what broke it.
          </h1>
          <p className="mt-4 max-w-[62ch] text-[16px] leading-[26px] text-[var(--p-ink-2)] dark:text-[var(--p-ink-2-d)]">
            Cadence journals every step an agent takes before the next one
            starts. A restart resumes from the last committed step instead of
            the first prompt, a failed run replays against fixed code, and every
            tool call crosses a schema you own. Below is a real shape of run —
            two retries, a worker killed mid-call, and no duplicate refund.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href="#start"
              className="p-mono text-[13px] px-4 py-2 bg-[var(--p-inv-bg)] text-[var(--p-inv-fg)] dark:bg-[var(--p-inv-bg-d)] dark:text-[var(--p-inv-fg-d)] focus:outline-2 focus:outline-offset-2 focus:outline-[var(--p-ink)] dark:focus:outline-[var(--p-ink-d)]"
            >
              npm i @cadence/runtime
            </a>
            <a
              href="#execution-model"
              className="p-mono text-[13px] px-4 py-2 border border-[var(--p-rule-2)] dark:border-[var(--p-rule-2-d)] text-[var(--p-ink)] dark:text-[var(--p-ink-d)] focus:outline-2 focus:outline-offset-2 focus:outline-[var(--p-ink)] dark:focus:outline-[var(--p-ink-d)]"
            >
              read the execution model
            </a>
          </div>
        </div>

        {/* ---- the span waterfall ---- */}
        <div className="border-t border-[var(--p-rule)] dark:border-[var(--p-rule-d)]">
          <div className="p-mono flex flex-wrap items-center gap-x-4 gap-y-1 px-5 sm:px-7 py-2.5 text-[11px] bg-[var(--p-gutter)] dark:bg-[var(--p-gutter-d)] border-b border-[var(--p-rule)] dark:border-[var(--p-rule-d)] text-[var(--p-ink-3)] dark:text-[var(--p-ink-3-d)]">
            <span className="text-[var(--p-ink-2)] dark:text-[var(--p-ink-2-d)]">
              run_9f2a41
            </span>
            <span>agent refund</span>
            <span>7 steps</span>
            <span>wall 12.76s</span>
            <span className={TONE_TEXT.ok}>{GLYPH.ok} terminal · committed</span>
          </div>

          <ol className="divide-y divide-[var(--p-rule)] dark:divide-[var(--p-rule-d)]">
            {RUN.map((s, i) => {
              const active = i === cursor;
              const reached = i <= cursor;
              return (
                <li key={s.seq}>
                  <button
                    type="button"
                    onClick={() => setCursor(i)}
                    aria-current={active ? "step" : undefined}
                    className={`w-full grid grid-cols-[34px_128px_1fr_58px] items-center gap-3 px-5 sm:px-7 py-2 text-left focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--p-ink)] dark:focus:outline-[var(--p-ink-d)] ${
                      active
                        ? "bg-[var(--p-gutter)] dark:bg-[var(--p-gutter-d)]"
                        : "bg-transparent"
                    }`}
                  >
                    <span className="p-mono text-[11px] text-[var(--p-ink-3)] dark:text-[var(--p-ink-3-d)]">
                      {s.seq}
                    </span>
                    <span className="p-mono text-[13px] truncate text-[var(--p-ink)] dark:text-[var(--p-ink-d)]">
                      <span className={`${TONE_TEXT[s.tone]} mr-1.5`}>
                        {GLYPH[s.tone]}
                      </span>
                      {s.name}
                    </span>
                    <span className="relative block h-3">
                      <span
                        aria-hidden="true"
                        className="absolute inset-y-0 block h-full origin-left border-l border-[var(--p-rule-2)] dark:border-[var(--p-rule-2-d)]"
                        style={{ left: `${s.start}%` }}
                      />
                      <span
                        aria-hidden="true"
                        className={`absolute top-[3px] block h-1.5 origin-left transition-opacity duration-[180ms] ease-[var(--p-ease)] motion-reduce:transition-none motion-safe:animate-[p-commit_180ms_var(--p-ease)_both] ${
                          s.tone === "ok"
                            ? "bg-[var(--p-ok)] dark:bg-[var(--p-ok-d)]"
                            : s.tone === "retry"
                              ? "bg-[var(--p-retry)] dark:bg-[var(--p-retry-d)]"
                              : "bg-[var(--p-fail)] dark:bg-[var(--p-fail-d)]"
                        } ${reached ? "opacity-100" : "opacity-25"}`}
                        style={{
                          left: `${s.start}%`,
                          width: `max(${s.span}%, 7px)`,
                        }}
                      />
                    </span>
                    <span className="p-mono text-[11px] text-right text-[var(--p-ink-3)] dark:text-[var(--p-ink-3-d)]">
                      {s.dur}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          {/* ---- the replay scrubber: the one choreographed moment ---- */}
          <div className="px-5 sm:px-7 py-4 border-t border-[var(--p-rule)] dark:border-[var(--p-rule-d)] bg-[var(--p-gutter)] dark:bg-[var(--p-gutter-d)]">
            <label
              htmlFor="cadence-scrub"
              className="p-mono block text-[11px] uppercase tracking-[0.14em] text-[var(--p-ink-3)] dark:text-[var(--p-ink-3-d)]"
            >
              replay scrubber — drag or use ← →
            </label>
            <input
              id="cadence-scrub"
              type="range"
              min={0}
              max={RUN.length - 1}
              step={1}
              value={cursor}
              onChange={(e) => setCursor(Number(e.target.value))}
              className="mt-2 w-full accent-[var(--p-ink)] dark:accent-[var(--p-ink-d)]"
            />
            <div className="p-mono mt-1 flex justify-between text-[11px] text-[var(--p-ink-3)] dark:text-[var(--p-ink-3-d)]">
              <span>seq 01</span>
              <span>seq 07 · terminal</span>
            </div>
          </div>

          {/* ---- step detail ---- */}
          <div className="px-5 sm:px-7 py-5 border-t border-[var(--p-rule)] dark:border-[var(--p-rule-d)]">
            <div className="p-mono flex flex-wrap items-baseline gap-x-4 gap-y-1 text-[13px]">
              <span className={TONE_TEXT[step.tone]}>
                {GLYPH[step.tone]} step {step.seq}
              </span>
              <span className="text-[var(--p-ink)] dark:text-[var(--p-ink-d)]">
                {step.name}
              </span>
              <span className="text-[11px] text-[var(--p-ink-3)] dark:text-[var(--p-ink-3-d)]">
                {step.kind} · {step.at} · {step.dur}
              </span>
            </div>
            <p className="mt-2 text-[16px] leading-[26px] text-[var(--p-ink)] dark:text-[var(--p-ink-d)]">
              {step.headline}
            </p>
            <dl className="mt-3 grid grid-cols-1 sm:grid-cols-[124px_1fr] gap-x-4">
              {step.detail.map(([k, v]) => (
                <React.Fragment key={k}>
                  <dt className="p-mono text-[11px] pt-1.5 text-[var(--p-ink-3)] dark:text-[var(--p-ink-3-d)]">
                    {k}
                  </dt>
                  <dd className="p-mono text-[13px] leading-[20px] pt-1 pb-1.5 break-words border-b border-[var(--p-rule)] dark:border-[var(--p-rule-d)] sm:border-b-0 text-[var(--p-ink-2)] dark:text-[var(--p-ink-2-d)]">
                    {v}
                  </dd>
                </React.Fragment>
              ))}
            </dl>
          </div>
        </div>
      </Rec>
    </section>
  );
}

/* ================================================================== */
/* 04 — Capabilities ledger + architecture + source                    */
/* ================================================================== */

const GUARANTEES: {
  id: string;
  title: string;
  body: string;
  evidence: string;
  tone: Tone;
}[] = [
  {
    id: "G1",
    title: "Durable execution",
    body: "A step commits to the log before the next one begins. A rollout, an OOM kill, or a node drain resumes from the last commit — not from the first prompt, and not from a half-applied side effect.",
    evidence: "resume run_9f2a41 → restored 4 committed steps, re-executed 0",
    tone: "ok",
  },
  {
    id: "G2",
    title: "Deterministic replay",
    body: "Model responses, tool results, and clock reads are all recorded. Replay a production run against a patched prompt and diff the two transcripts step by step, locally, with no traffic.",
    evidence: "cadence replay run_9f2a41 --from 03 --prompt ./v2.md → diverged at 04",
    tone: "ok",
  },
  {
    id: "G3",
    title: "Typed tool boundaries",
    body: "Tools declare input and output schemas. A malformed argument is rejected at the boundary and returned to the model as a typed error it can correct, instead of thrown into a handler that assumed the field was a number.",
    evidence: 'rejected: amountCents expected int, received "48.50" → returned to model',
    tone: "retry",
  },
  {
    id: "G4",
    title: "Per-step observability",
    body: "Every step emits a span carrying attempt number, latency, token counts, worker id, and the exact arguments the model produced. Read it from the run API or ship it to any OTLP collector.",
    evidence: "span step=03 attempt=1/5 worker=w-02 outcome=timeout dur=3.00s",
    tone: "fail",
  },
];

const SOURCE = `import { agent, tool, retry } from "@cadence/runtime";
import { z } from "zod";

const lookupOrder = tool({
  name: "lookupOrder",
  input:  z.object({ orderId: z.string() }),
  output: z.object({ totalCents: z.number().int(), status: z.string() }),
  run: ({ orderId }) => db.orders.get(orderId),
});

const issueRefund = tool({
  name: "issueRefund",
  input:  z.object({ orderId: z.string(), amountCents: z.number().int() }),
  output: z.object({ refundId: z.string() }),
  retry: retry.exponential({ attempts: 5, base: "2s", max: "1m" }),
  run: ({ orderId, amountCents }) =>
    payments.refund(orderId, amountCents, { idempotencyKey: orderId }),
});

export const refund = agent({
  name: "refund",
  tools: [lookupOrder, issueRefund],
  policy: { maxSteps: 12, timeout: "10m" },
});

// The run in record 0002 came from these 24 lines.
const handle = await refund.start({ orderId: "ord_8123" });
await cadence.replay(handle.runId, { from: "03" });`;

export function FeatureGridParti() {
  return (
    <section
      data-arm="parti"
      style={T}
      className="w-full bg-[var(--p-ground)] dark:bg-[var(--p-ground-d)]"
    >
      <Sheet />
      <Rec seq="0003" offset="+00:13.2" tone="ok" state="commit">
        <div className="px-5 sm:px-7 pt-8 pb-6">
          <Eyebrow>four guarantees</Eyebrow>
          <h2 className="mt-3 max-w-[26ch] text-[27px] leading-[34px] font-semibold tracking-[-0.015em] text-[var(--p-ink)] dark:text-[var(--p-ink-d)]">
            It does not own your prompts. It owns what happens when a step
            fails.
          </h2>
        </div>

        <dl className="border-t border-[var(--p-rule)] dark:border-[var(--p-rule-d)] divide-y divide-[var(--p-rule)] dark:divide-[var(--p-rule-d)]">
          {GUARANTEES.map((g) => (
            <div
              key={g.id}
              className="grid grid-cols-1 sm:grid-cols-[52px_1fr] gap-x-4 px-5 sm:px-7 py-5"
            >
              <dt className="p-mono text-[11px] pt-1 text-[var(--p-ink-3)] dark:text-[var(--p-ink-3-d)]">
                {g.id}
              </dt>
              <dd>
                <p className="text-[19px] leading-[26px] font-semibold tracking-[-0.01em] text-[var(--p-ink)] dark:text-[var(--p-ink-d)]">
                  {g.title}
                </p>
                <p className="mt-1.5 max-w-[68ch] text-[16px] leading-[26px] text-[var(--p-ink-2)] dark:text-[var(--p-ink-2-d)]">
                  {g.body}
                </p>
                <p className="p-mono mt-3 text-[11px] leading-[18px] pl-3 border-l-2 border-[var(--p-rule-2)] dark:border-[var(--p-rule-2-d)] text-[var(--p-ink-3)] dark:text-[var(--p-ink-3-d)] break-words">
                  <span className={`${TONE_TEXT[g.tone]} mr-1.5`}>
                    {GLYPH[g.tone]}
                  </span>
                  {g.evidence}
                </p>
              </dd>
            </div>
          ))}
        </dl>

        {/* Architecture — three lanes, drawn with rules, not boxes. */}
        <div className="border-t border-[var(--p-rule)] dark:border-[var(--p-rule-d)] px-5 sm:px-7 py-6">
          <Eyebrow>architecture · one write path</Eyebrow>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3">
            {[
              {
                lane: "control plane",
                role: "schedules runs, holds policy, serves the run API",
                io: "stateless reads · writes only intent",
              },
              {
                lane: "worker pool",
                role: "executes one step, then commits, then asks for the next",
                io: "horizontally scaled · safely killable",
              },
              {
                lane: "event log",
                role: "append-only journal; the only source of truth",
                io: "Postgres or S3-compatible · replay reads from here",
              },
            ].map((n, i) => (
              <div
                key={n.lane}
                className={`px-4 py-4 border-[var(--p-rule)] dark:border-[var(--p-rule-d)] border-t sm:border-t-0 sm:border-l ${i === 0 ? "sm:border-l-0 sm:pl-0" : ""}`}
              >
                <p className="p-mono text-[13px] text-[var(--p-ink)] dark:text-[var(--p-ink-d)]">
                  {i + 1} / {n.lane}
                </p>
                <p className="mt-2 text-[16px] leading-[24px] text-[var(--p-ink-2)] dark:text-[var(--p-ink-2-d)]">
                  {n.role}
                </p>
                <p className="p-mono mt-2 text-[11px] text-[var(--p-ink-3)] dark:text-[var(--p-ink-3-d)]">
                  {n.io}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Source of the run above. */}
        <div className="border-t border-[var(--p-rule)] dark:border-[var(--p-rule-d)]">
          <div className="p-mono flex items-center gap-4 px-5 sm:px-7 py-2 text-[11px] bg-[var(--p-gutter)] dark:bg-[var(--p-gutter-d)] border-b border-[var(--p-rule)] dark:border-[var(--p-rule-d)] text-[var(--p-ink-3)] dark:text-[var(--p-ink-3-d)]">
            <span className="text-[var(--p-ink-2)] dark:text-[var(--p-ink-2-d)]">
              agents/refund.ts
            </span>
            <span>typescript</span>
            <span className="ml-auto">24 sloc</span>
          </div>
          <pre className="p-mono overflow-x-auto px-5 sm:px-7 py-4 text-[13px] leading-[21px] text-[var(--p-ink-2)] dark:text-[var(--p-ink-2-d)]">
            <code>{SOURCE}</code>
          </pre>
        </div>
      </Rec>
    </section>
  );
}

/* ================================================================== */
/* 05 — Deployment ledger (the social-proof slot, without logos)        */
/* ================================================================== */

interface Deployment {
  workload: string;
  sector: string;
  team: string;
  steps: string;
  longest: string;
  reason: string;
}

const DEPLOYMENTS: Deployment[] = [
  {
    workload: "Refunds & disputes",
    sector: "Marketplace",
    team: "~40 eng",
    steps: "6–14",
    longest: "4m 12s",
    reason: "money moves; a duplicate side effect is a chargeback",
  },
  {
    workload: "Document intake",
    sector: "Insurance",
    team: "~120 eng",
    steps: "30–90",
    longest: "51m",
    reason: "runs outlive a deploy window",
  },
  {
    workload: "Onboarding checks",
    sector: "Fintech",
    team: "~25 eng",
    steps: "8–20",
    longest: "6h 04m",
    reason: "parked for hours waiting on a human decision",
  },
  {
    workload: "Incident triage",
    sector: "Infrastructure",
    team: "~15 eng",
    steps: "12–40",
    longest: "22m",
    reason: "must be replayable in the postmortem",
  },
  {
    workload: "Catalog enrichment",
    sector: "Retail",
    team: "~60 eng",
    steps: "4–9",
    longest: "1m 47s",
    reason: "high volume; per-step cost is the budget",
  },
];

const SECTORS = ["all", "Marketplace", "Insurance", "Fintech", "Infrastructure", "Retail", "Healthcare"];

export function LogoCloudParti() {
  const [sector, setSector] = React.useState("all");
  const rows =
    sector === "all"
      ? DEPLOYMENTS
      : DEPLOYMENTS.filter((d) => d.sector === sector);

  return (
    <section
      data-arm="parti"
      style={T}
      className="w-full bg-[var(--p-ground)] dark:bg-[var(--p-ground-d)]"
    >
      <Sheet />
      <Rec seq="0004" offset="+00:31.8" tone="ok" state="commit">
        <div className="px-5 sm:px-7 pt-8 pb-5">
          <Eyebrow>deployment ledger</Eyebrow>
          <h2 className="mt-3 max-w-[34ch] text-[27px] leading-[34px] font-semibold tracking-[-0.015em] text-[var(--p-ink)] dark:text-[var(--p-ink-d)]">
            No logo wall. A logo is not evidence that anything survived a
            deploy.
          </h2>
          <p className="mt-3 max-w-[66ch] text-[16px] leading-[26px] text-[var(--p-ink-2)] dark:text-[var(--p-ink-2-d)]">
            What follows is the shape of the workloads teams have opted into
            listing publicly — described by what the agent does and how long it
            runs, which is the only part of someone else&apos;s adoption that
            tells you anything about yours.
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {SECTORS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSector(s)}
                aria-pressed={sector === s}
                className={`p-mono text-[11px] px-2 py-1 rounded-[2px] border transition-colors duration-[120ms] motion-reduce:transition-none focus:outline-2 focus:outline-offset-2 focus:outline-[var(--p-ink)] dark:focus:outline-[var(--p-ink-d)] ${
                  sector === s
                    ? "border-[var(--p-ink)] dark:border-[var(--p-ink-d)] bg-[var(--p-inv-bg)] text-[var(--p-inv-fg)] dark:bg-[var(--p-inv-bg-d)] dark:text-[var(--p-inv-fg-d)]"
                    : "border-[var(--p-rule)] dark:border-[var(--p-rule-d)] text-[var(--p-ink-2)] dark:text-[var(--p-ink-2-d)]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto border-t border-[var(--p-rule)] dark:border-[var(--p-rule-d)]">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="p-mono text-[11px] uppercase tracking-[0.1em] bg-[var(--p-gutter)] dark:bg-[var(--p-gutter-d)] text-[var(--p-ink-3)] dark:text-[var(--p-ink-3-d)]">
                <th scope="col" className="font-normal px-5 sm:px-7 py-2">workload</th>
                <th scope="col" className="font-normal px-3 py-2">sector</th>
                <th scope="col" className="font-normal px-3 py-2">team</th>
                <th scope="col" className="font-normal px-3 py-2 text-right">steps/run</th>
                <th scope="col" className="font-normal px-3 py-2 text-right">longest run</th>
                <th scope="col" className="font-normal px-3 sm:pr-7 py-2">why durable</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--p-rule)] dark:divide-[var(--p-rule-d)]">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 sm:px-7 py-8">
                    <p className="p-mono text-[13px] text-[var(--p-ink-2)] dark:text-[var(--p-ink-2-d)]">
                      <span className={`${TONE_TEXT.idle} mr-1.5`}>{GLYPH.idle}</span>
                      0 rows for sector &ldquo;{sector}&rdquo;
                    </p>
                    <p className="mt-1.5 text-[16px] leading-[24px] text-[var(--p-ink-3)] dark:text-[var(--p-ink-3-d)]">
                      Nobody in that sector has opted into the public list yet.
                      That is the honest answer; the alternative is a logo we
                      did not earn.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSector("all")}
                      className="p-mono mt-3 text-[13px] underline underline-offset-4 text-[var(--p-ink-2)] dark:text-[var(--p-ink-2-d)] focus:outline-2 focus:outline-offset-2 focus:outline-[var(--p-ink)] dark:focus:outline-[var(--p-ink-d)]"
                    >
                      clear filter
                    </button>
                  </td>
                </tr>
              ) : (
                rows.map((d) => (
                  <tr key={d.workload}>
                    <th
                      scope="row"
                      className="px-5 sm:px-7 py-3 text-[16px] font-medium text-left align-top text-[var(--p-ink)] dark:text-[var(--p-ink-d)]"
                    >
                      {d.workload}
                    </th>
                    <td className="p-mono px-3 py-3 text-[13px] align-top text-[var(--p-ink-2)] dark:text-[var(--p-ink-2-d)]">
                      {d.sector}
                    </td>
                    <td className="p-mono px-3 py-3 text-[13px] align-top text-[var(--p-ink-3)] dark:text-[var(--p-ink-3-d)]">
                      {d.team}
                    </td>
                    <td className="p-mono px-3 py-3 text-[13px] text-right align-top text-[var(--p-ink-2)] dark:text-[var(--p-ink-2-d)]">
                      {d.steps}
                    </td>
                    <td className="p-mono px-3 py-3 text-[13px] text-right align-top text-[var(--p-ink-2)] dark:text-[var(--p-ink-2-d)]">
                      {d.longest}
                    </td>
                    <td className="px-3 sm:pr-7 py-3 text-[16px] leading-[24px] align-top text-[var(--p-ink-2)] dark:text-[var(--p-ink-2-d)]">
                      {d.reason}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <p className="p-mono px-5 sm:px-7 py-2.5 text-[11px] border-t border-[var(--p-rule)] dark:border-[var(--p-rule-d)] text-[var(--p-ink-3)] dark:text-[var(--p-ink-3-d)]">
          self-reported by teams who opted in · run lengths are their numbers,
          not ours · measure your own workload before you trust either
        </p>
      </Rec>
    </section>
  );
}

/* ================================================================== */
/* 06 — Testimonial, shaped as a post-incident note                    */
/* ================================================================== */

export function TestimonialParti() {
  return (
    <section
      data-arm="parti"
      style={T}
      className="w-full bg-[var(--p-ground)] dark:bg-[var(--p-ground-d)]"
    >
      <Sheet />
      <Rec seq="0005" offset="+00:47.1" tone="retry" state="incident">
        <div className="p-mono flex flex-wrap items-center gap-x-4 gap-y-1 px-5 sm:px-7 py-2.5 text-[11px] bg-[var(--p-gutter)] dark:bg-[var(--p-gutter-d)] border-b border-[var(--p-rule)] dark:border-[var(--p-rule-d)] text-[var(--p-ink-3)] dark:text-[var(--p-ink-3-d)]">
          <span>INC-2291</span>
          <span>3 customers affected</span>
          <span>partial refunds, no reconciliation path</span>
          <span className={`${TONE_TEXT.ok} ml-auto`}>
            {GLYPH.ok} resolved — root cause identified from the journal
          </span>
        </div>

        <figure className="px-5 sm:px-7 py-8">
          <blockquote className="max-w-[58ch] text-[23px] leading-[34px] tracking-[-0.01em] text-[var(--p-ink)] dark:text-[var(--p-ink-d)]">
            <p>
              We shipped mid-run and left three people half-refunded. Nobody
              could tell me which of them had actually been charged back,
              because our only record was a log line we happened to write.
            </p>
            <p className="mt-4">
              The thing we adopted Cadence for is not the agent part. It is that
              the run is a record I can re-open six weeks later and step
              through.
            </p>
          </blockquote>
          <figcaption className="p-mono mt-6 pt-4 border-t border-[var(--p-rule)] dark:border-[var(--p-rule-d)] text-[13px] leading-[20px]">
            <span className="text-[var(--p-ink)] dark:text-[var(--p-ink-d)]">
              Staff engineer, payments infrastructure
            </span>
            <span className="block text-[11px] mt-1 text-[var(--p-ink-3)] dark:text-[var(--p-ink-3-d)]">
              marketplace · ~40 engineers · attributed by role at the
              speaker&apos;s request
            </span>
          </figcaption>
        </figure>
      </Rec>
    </section>
  );
}

/* ================================================================== */
/* 07 — Pricing: a step meter, not three cards                         */
/* ================================================================== */

interface Plan {
  key: string;
  name: string;
  monthly: number | null;
  annual: number | null;
  included: number | null;
  overage: number | null;
  note: string;
  cta: string;
}

const PLANS: Plan[] = [
  {
    key: "dev",
    name: "Developer",
    monthly: 0,
    annual: 0,
    included: 10_000,
    overage: null,
    note: "hard cap, no card",
    cta: "start free",
  },
  {
    key: "team",
    name: "Team",
    monthly: 90,
    annual: 75,
    included: 2_000_000,
    overage: 0.4,
    note: "per 1k steps over",
    cta: "14-day trial",
  },
  {
    key: "self",
    name: "Self-hosted",
    monthly: null,
    annual: null,
    included: null,
    overage: null,
    note: "your VPC, your log",
    cta: "talk to an engineer",
  },
];

const MATRIX: { row: string; cells: [string, string, string] }[] = [
  { row: "journal retention", cells: ["7 days", "90 days", "your storage"] },
  { row: "replay", cells: ["local CLI", "hosted + run diffing", "hosted + run diffing"] },
  { row: "workers", cells: ["1 local", "managed pool", "your nodes"] },
  { row: "OTLP export", cells: ["—", "included", "included"] },
  { row: "SSO + audit log", cells: ["—", "included", "included"] },
  { row: "support", cells: ["community", "1 business day", "shared channel"] },
];

const STEP_MARKS = [50_000, 250_000, 1_000_000, 2_000_000, 5_000_000, 10_000_000];

export function PricingParti() {
  const [annual, setAnnual] = React.useState(true);
  const [markIndex, setMarkIndex] = React.useState(3);
  const steps = STEP_MARKS[markIndex];

  const team = PLANS[1];
  const base = annual ? (team.annual ?? 0) : (team.monthly ?? 0);
  const over = Math.max(0, steps - (team.included ?? 0));
  const overCost = (over / 1000) * (team.overage ?? 0);
  const total = base + overCost;
  const capped = steps > 10_000 ? "over the free cap" : "within the free cap";

  const money = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD" });

  return (
    <section
      data-arm="parti"
      style={T}
      className="w-full bg-[var(--p-ground)] dark:bg-[var(--p-ground-d)]"
    >
      <Sheet />
      <Rec seq="0006" offset="+01:02.5" tone="ok" state="commit">
        <div className="px-5 sm:px-7 pt-8 pb-5">
          <Eyebrow>metered on committed steps</Eyebrow>
          <h2 className="mt-3 max-w-[30ch] text-[27px] leading-[34px] font-semibold tracking-[-0.015em] text-[var(--p-ink)] dark:text-[var(--p-ink-d)]">
            A step is one journal commit. Retries of the same step are billed
            once.
          </h2>
          <p className="mt-3 max-w-[64ch] text-[16px] leading-[26px] text-[var(--p-ink-2)] dark:text-[var(--p-ink-2-d)]">
            Not per seat, not per agent, not per token — you already pay a model
            provider for those. The five attempts in record 0002 count as two
            billable steps, because two of them committed.
          </p>

          <div
            role="group"
            aria-label="Billing period"
            className="mt-5 inline-flex border border-[var(--p-rule-2)] dark:border-[var(--p-rule-2-d)]"
          >
            {(["monthly", "annual"] as const).map((mode) => {
              const on = (mode === "annual") === annual;
              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setAnnual(mode === "annual")}
                  aria-pressed={on}
                  className={`p-mono text-[13px] px-3 py-1.5 transition-colors duration-[120ms] motion-reduce:transition-none focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--p-ink)] dark:focus:outline-[var(--p-ink-d)] ${
                    on
                      ? "bg-[var(--p-inv-bg)] text-[var(--p-inv-fg)] dark:bg-[var(--p-inv-bg-d)] dark:text-[var(--p-inv-fg-d)]"
                      : "text-[var(--p-ink-2)] dark:text-[var(--p-ink-2-d)]"
                  }`}
                >
                  {mode}
                  {mode === "annual" && " −17%"}
                </button>
              );
            })}
          </div>
        </div>

        <div className="overflow-x-auto border-t border-[var(--p-rule)] dark:border-[var(--p-rule-d)]">
          <table className="w-full min-w-[680px] border-collapse text-left">
            <thead>
              <tr>
                <th scope="col" className="p-mono w-[190px] px-5 sm:px-7 py-4 align-bottom text-[11px] uppercase tracking-[0.1em] font-normal text-[var(--p-ink-3)] dark:text-[var(--p-ink-3-d)]">
                  plan
                </th>
                {PLANS.map((p) => {
                  const price = annual ? p.annual : p.monthly;
                  return (
                    <th key={p.key} scope="col" className="px-4 py-4 align-bottom border-l border-[var(--p-rule)] dark:border-[var(--p-rule-d)]">
                      <span className="p-mono block text-[13px] text-[var(--p-ink)] dark:text-[var(--p-ink-d)]">
                        {p.name}
                      </span>
                      <span className="p-num block mt-1 text-[27px] leading-[32px] font-semibold tracking-[-0.02em] text-[var(--p-ink)] dark:text-[var(--p-ink-d)]">
                        {price === null ? "custom" : price === 0 ? "$0" : `$${price}`}
                      </span>
                      <span className="p-mono block mt-0.5 text-[11px] font-normal text-[var(--p-ink-3)] dark:text-[var(--p-ink-3-d)]">
                        {price === null ? p.note : `per month · ${p.note}`}
                      </span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--p-rule)] dark:divide-[var(--p-rule-d)] border-t border-[var(--p-rule)] dark:border-[var(--p-rule-d)]">
              <tr>
                <th scope="row" className="p-mono px-5 sm:px-7 py-2.5 text-[13px] font-normal text-left text-[var(--p-ink-2)] dark:text-[var(--p-ink-2-d)]">
                  included steps
                </th>
                {PLANS.map((p) => (
                  <td key={p.key} className="p-mono px-4 py-2.5 text-[13px] border-l border-[var(--p-rule)] dark:border-[var(--p-rule-d)] text-[var(--p-ink)] dark:text-[var(--p-ink-d)]">
                    {p.included === null
                      ? "unmetered"
                      : p.included.toLocaleString("en-US")}
                  </td>
                ))}
              </tr>
              {MATRIX.map((m) => (
                <tr key={m.row}>
                  <th scope="row" className="p-mono px-5 sm:px-7 py-2.5 text-[13px] font-normal text-left text-[var(--p-ink-2)] dark:text-[var(--p-ink-2-d)]">
                    {m.row}
                  </th>
                  {m.cells.map((c, i) => (
                    <td
                      key={`${m.row}-${i}`}
                      className="p-mono px-4 py-2.5 text-[13px] border-l border-[var(--p-rule)] dark:border-[var(--p-rule-d)] text-[var(--p-ink)] dark:text-[var(--p-ink-d)]"
                    >
                      {c === "—" ? (
                        <span className="text-[var(--p-ink-3)] dark:text-[var(--p-ink-3-d)]">
                          not included
                        </span>
                      ) : (
                        c
                      )}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="px-5 sm:px-7 py-4" />
                {PLANS.map((p) => (
                  <td key={p.key} className="px-4 py-4 border-l border-[var(--p-rule)] dark:border-[var(--p-rule-d)]">
                    <a
                      href="#start"
                      className={`p-mono inline-block text-[13px] px-3 py-1.5 focus:outline-2 focus:outline-offset-2 focus:outline-[var(--p-ink)] dark:focus:outline-[var(--p-ink-d)] ${
                        p.key === "team"
                          ? "bg-[var(--p-inv-bg)] text-[var(--p-inv-fg)] dark:bg-[var(--p-inv-bg-d)] dark:text-[var(--p-inv-fg-d)]"
                          : "border border-[var(--p-rule-2)] dark:border-[var(--p-rule-2-d)] text-[var(--p-ink)] dark:text-[var(--p-ink-d)]"
                      }`}
                    >
                      {p.cta}
                    </a>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Estimator — the meter, in the product's own units. */}
        <div className="border-t border-[var(--p-rule)] dark:border-[var(--p-rule-d)] bg-[var(--p-gutter)] dark:bg-[var(--p-gutter-d)] px-5 sm:px-7 py-5">
          <label
            htmlFor="cadence-steps"
            className="p-mono block text-[11px] uppercase tracking-[0.14em] text-[var(--p-ink-3)] dark:text-[var(--p-ink-3-d)]"
          >
            estimate — committed steps per month
          </label>
          <input
            id="cadence-steps"
            type="range"
            min={0}
            max={STEP_MARKS.length - 1}
            step={1}
            value={markIndex}
            onChange={(e) => setMarkIndex(Number(e.target.value))}
            className="mt-2 w-full max-w-[440px] accent-[var(--p-ink)] dark:accent-[var(--p-ink-d)]"
          />
          <div className="p-mono mt-3 grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-x-6 gap-y-1 text-[13px]">
            <span className="text-[var(--p-ink-3)] dark:text-[var(--p-ink-3-d)]">
              steps / month
            </span>
            <span className="p-num text-[var(--p-ink)] dark:text-[var(--p-ink-d)]">
              {steps.toLocaleString("en-US")}
            </span>

            <span className="text-[var(--p-ink-3)] dark:text-[var(--p-ink-3-d)]">
              Team, {annual ? "annual" : "monthly"}
            </span>
            <span className="p-num text-[var(--p-ink)] dark:text-[var(--p-ink-d)]">
              {money(base)} base
              {over > 0 ? (
                <>
                  {" + "}
                  <span className={TONE_TEXT.retry}>
                    {money(overCost)} overage
                  </span>
                  <span className="text-[11px] text-[var(--p-ink-3)] dark:text-[var(--p-ink-3-d)]">
                    {" "}
                    ({over.toLocaleString("en-US")} steps × $0.40/1k)
                  </span>
                </>
              ) : (
                <span className="text-[11px] text-[var(--p-ink-3)] dark:text-[var(--p-ink-3-d)]">
                  {" "}
                  (no overage at this volume)
                </span>
              )}
            </span>

            <span className="text-[var(--p-ink-3)] dark:text-[var(--p-ink-3-d)]">
              estimated total
            </span>
            <span className="p-num text-[19px] leading-[26px] text-[var(--p-ink)] dark:text-[var(--p-ink-d)]">
              {money(total)}
              <span className="p-mono text-[11px] text-[var(--p-ink-3)] dark:text-[var(--p-ink-3-d)]">
                {" "}
                / month · Developer plan is {capped}
              </span>
            </span>
          </div>
        </div>
      </Rec>
    </section>
  );
}

/* ================================================================== */
/* 08 — FAQ                                                            */
/* ================================================================== */

const FAQ: { q: string; a: string }[] = [
  {
    q: "Does this lock me to a model provider?",
    a: "No. Cadence never calls a model on your behalf — you hand it a completion function and it journals the request and the response. Swap providers between replays; the log records what was actually returned, not who returned it.",
  },
  {
    q: "How is this different from a general workflow engine?",
    a: "The execution model is deliberately close to one — that part is not novel and we would rather not pretend it is. What a general engine does not give you is a typed tool boundary, or a replay that reconciles non-deterministic model output against a recorded transcript and tells you which step diverged.",
  },
  {
    q: "What happens when a tool is genuinely, permanently broken?",
    a: "The retry policy runs to exhaustion, then the step is marked failed and the run parks. It stays in the journal indefinitely with its arguments intact. When you have shipped a fix you resume from that step — earlier steps are restored from the log, not re-executed, so no side effect fires twice.",
  },
  {
    q: "Can I self-host?",
    a: "The worker pool is open source and self-hostable today. A self-hosted control plane ships on the Self-hosted plan and needs Postgres 14+ plus any S3-compatible object store for the journal. There is no phone-home requirement.",
  },
  {
    q: "What does a journal commit cost me in latency?",
    a: "One append and one fsync per step. For almost every agent workload that is dominated by the model or tool call the step is wrapping — but that ratio depends entirely on your steps, so measure it on your own workload rather than trusting a number on a landing page. The benchmark harness is in the repo.",
  },
];

export function FaqParti() {
  const [open, setOpen] = React.useState<number | null>(null);

  return (
    <section
      data-arm="parti"
      style={T}
      className="w-full bg-[var(--p-ground)] dark:bg-[var(--p-ground-d)]"
    >
      <Sheet />
      <Rec seq="0007" offset="+01:24.0" tone="idle" state="open">
        <div className="px-5 sm:px-7 pt-8 pb-5">
          <Eyebrow>
            unresolved · {open === null ? `${FAQ.length} collapsed` : `1 of ${FAQ.length} open`}
          </Eyebrow>
          <h2 className="mt-3 text-[27px] leading-[34px] font-semibold tracking-[-0.015em] text-[var(--p-ink)] dark:text-[var(--p-ink-d)]">
            The five questions that actually come up in evaluation
          </h2>
        </div>

        <div className="border-t border-[var(--p-rule)] dark:border-[var(--p-rule-d)] divide-y divide-[var(--p-rule)] dark:divide-[var(--p-rule-d)]">
          {FAQ.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q}>
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="w-full grid grid-cols-[36px_1fr_20px] items-baseline gap-3 px-5 sm:px-7 py-4 text-left focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--p-ink)] dark:focus:outline-[var(--p-ink-d)]"
                  >
                    <span className="p-mono text-[11px] text-[var(--p-ink-3)] dark:text-[var(--p-ink-3-d)]">
                      Q{String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[19px] leading-[27px] tracking-[-0.01em] text-[var(--p-ink)] dark:text-[var(--p-ink-d)]">
                      {item.q}
                    </span>
                    <span
                      aria-hidden="true"
                      className="p-mono text-[13px] text-right text-[var(--p-ink-3)] dark:text-[var(--p-ink-3-d)]"
                    >
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                </h3>
                <div
                  className="grid transition-[grid-template-rows] duration-[240ms] ease-[var(--p-ease)] motion-reduce:transition-none"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-[70ch] px-5 sm:px-7 pb-5 sm:pl-[76px] text-[16px] leading-[26px] text-[var(--p-ink-2)] dark:text-[var(--p-ink-2-d)]">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Rec>
    </section>
  );
}

/* ================================================================== */
/* 09 — Closing call                                                   */
/* ================================================================== */

const ADOPT_CMD = "npx @cadence/cli adopt ./agents/refund.ts --shadow";

export function CtaParti() {
  const [copied, setCopied] = React.useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(ADOPT_CMD);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section
      data-arm="parti"
      style={T}
      className="w-full bg-[var(--p-ground)] dark:bg-[var(--p-ground-d)]"
    >
      <Sheet />
      <Rec seq="0008" offset="+01:51.7" tone="retry" state="pending">
        <div className="px-5 sm:px-7 py-9">
          <Eyebrow>
            <span className="text-[var(--p-inv-fg)] dark:text-[var(--p-inv-fg-d)] opacity-70">
              next step · not yet committed
            </span>
          </Eyebrow>
          <h2 className="mt-4 max-w-[24ch] text-[27px] leading-[36px] font-semibold tracking-[-0.015em]">
            Adopt one agent in shadow mode. Keep the rest hand-rolled.
          </h2>
          <p className="mt-4 max-w-[62ch] text-[16px] leading-[26px] opacity-80">
            The CLI wraps a single existing agent, runs it alongside what you
            already have, and journals both. After a week you have two logs of
            the same traffic and a real answer about whether the failure modes
            you are worried about actually show up.
          </p>

          <div className="mt-6 flex flex-wrap items-stretch gap-2">
            <code className="p-mono flex items-center px-3 py-2.5 text-[13px] border border-current/25 break-all">
              {ADOPT_CMD}
            </code>
            <button
              type="button"
              onClick={copy}
              className="p-mono px-3 py-2.5 text-[13px] bg-[var(--p-inv-fg)] text-[var(--p-inv-bg)] dark:bg-[var(--p-inv-fg-d)] dark:text-[var(--p-inv-bg-d)] focus:outline-2 focus:outline-offset-2 focus:outline-current"
            >
              {copied ? "● copied" : "copy"}
            </button>
          </div>

          <ul className="p-mono mt-6 grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-2 text-[13px] leading-[20px] opacity-80">
            {[
              "no code change to your agent",
              "journals to your Postgres, not ours",
              "delete the wrapper and nothing breaks",
            ].map((line) => (
              <li key={line} className="pl-4 -indent-4">
                <span aria-hidden="true">{"→ "}</span>
                {line}
              </li>
            ))}
          </ul>

          <p className="p-mono mt-7 pt-4 border-t border-current/20 text-[11px] opacity-70">
            already running a workflow engine? there is a migration note for
            that, and it is honest about where Cadence is the wrong tool —{" "}
            <a href="#migration" className="underline underline-offset-4">
              read it first
            </a>
          </p>
        </div>
      </Rec>
    </section>
  );
}

/* ================================================================== */
/* 10 — Footer: end of log                                             */
/* ================================================================== */

const FOOTER: { heading: string; links: string[] }[] = [
  {
    heading: "runtime",
    links: ["execution model", "retry policies", "typed tools", "parked runs"],
  },
  {
    heading: "replay",
    links: ["run diffing", "local replay", "transcript export", "journal schema"],
  },
  {
    heading: "operate",
    links: ["self-hosting", "OTLP export", "retention", "status"],
  },
  {
    heading: "company",
    links: ["changelog", "security", "careers", "contact"],
  },
];

export function FooterParti() {
  return (
    <footer
      data-arm="parti"
      style={T}
      className="w-full bg-[var(--p-ground)] dark:bg-[var(--p-ground-d)]"
    >
      <Sheet />
      <Rec seq="0009" offset="+02:04.3" tone="ok" state="eof">
        <div className="px-5 sm:px-7 pt-8 pb-6 grid grid-cols-2 sm:grid-cols-5 gap-x-6 gap-y-8">
          <div className="col-span-2 sm:col-span-1">
            <p className="p-mono flex items-center gap-2 text-[15px] font-bold text-[var(--p-ink)] dark:text-[var(--p-ink-d)]">
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                <rect x="0" y="1.5" width="8" height="2" fill="currentColor" />
                <rect x="3" y="6" width="9" height="2" fill="currentColor" />
                <rect x="6" y="10.5" width="8" height="2" fill="currentColor" />
              </svg>
              cadence
            </p>
            <p className="mt-3 max-w-[30ch] text-[16px] leading-[24px] text-[var(--p-ink-2)] dark:text-[var(--p-ink-2-d)]">
              A runtime for agents that have to survive a deploy.
            </p>
            <p className={`p-mono mt-4 text-[11px] ${TONE_TEXT.ok}`}>
              {GLYPH.ok} all systems nominal
            </p>
          </div>

          {FOOTER.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <p className="p-mono text-[11px] uppercase tracking-[0.14em] text-[var(--p-ink-3)] dark:text-[var(--p-ink-3-d)]">
                {col.heading}
              </p>
              <ul className="mt-3 space-y-1.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#footer"
                      className="p-mono text-[13px] text-[var(--p-ink-2)] dark:text-[var(--p-ink-2-d)] hover:text-[var(--p-ink)] dark:hover:text-[var(--p-ink-d)] underline-offset-4 hover:underline focus:outline-2 focus:outline-offset-2 focus:outline-[var(--p-ink)] dark:focus:outline-[var(--p-ink-d)]"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="p-mono flex flex-wrap items-center gap-x-5 gap-y-1 px-5 sm:px-7 py-2.5 text-[11px] border-t border-[var(--p-rule)] dark:border-[var(--p-rule-d)] bg-[var(--p-gutter)] dark:bg-[var(--p-gutter-d)] text-[var(--p-ink-3)] dark:text-[var(--p-ink-3-d)]">
          <span>log closed · 9 records · 0 uncommitted</span>
          <span>© 2026 Cadence Systems, Inc.</span>
          <a href="#privacy" className="underline underline-offset-4">privacy</a>
          <a href="#terms" className="underline underline-offset-4">terms</a>
          <a href="#repo" className="ml-auto underline underline-offset-4">
            github.com/cadence-dev/runtime
          </a>
        </div>
      </Rec>
    </footer>
  );
}
