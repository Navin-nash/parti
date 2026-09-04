"use client";

/* ============================================================================
 * DIRECTION — "Field Report"
 *
 * THESIS
 *   This audience does not read landing pages, they read postmortems — the
 *   internal document written the morning after something broke, which is
 *   exactly what got them here. Cadence's whole pitch is "the log is the
 *   record," so the page borrows the document form this audience already
 *   trusts to carry that claim: a filed incident report, not a marketing
 *   surface, with the code and the trace quoted in as exhibits the way a
 *   real postmortem quotes its evidence.
 *
 * SIX AXES
 *   Density        measured — a report is read start to finish, once, by
 *                  someone who already has context. It paces in prose
 *                  paragraphs at a comfortable line-height, not packed
 *                  span-by-span; the technical weight lives in what the
 *                  exhibits say, not in how much fits per pixel.
 *   Structure      editorial-asymmetric — a single reading column carries the
 *                  narrative; exhibits and appendix material sit off-axis in
 *                  a narrower margin, the way a report's footnotes and
 *                  attachments sit apart from its body. No repeating grid
 *                  module, no card lattice.
 *   Type voice     editorial-serif — Source Serif 4 for both the report's
 *                  headings and its body prose, because a report is written
 *                  to be read, not scanned off a rack panel. IBM Plex Mono
 *                  is confined to the exhibits themselves: the one place a
 *                  monospace grid is the honest transcription of what a
 *                  machine actually emitted.
 *   Chroma         monochrome+accent — warm paper and ink, one ochre used
 *                  for exactly one thing: this is evidence, follow it. No
 *                  second or third status hue; a failed step is marked by
 *                  a label and an underline, not a competing red.
 *   Motion posture still — nothing in the document moves on its own and
 *                  nothing choreographs. Disclosures and toggles change
 *                  state instantly, the way turning a page or unclipping an
 *                  attachment does not animate. The one exception is a
 *                  120ms colour fade on hover/focus, feedback rather than
 *                  performance, and it is skipped entirely under
 *                  prefers-reduced-motion.
 *   Depth          layered-shadow — the report is a page lifted off a desk:
 *                  one soft directional shadow under the page, a smaller one
 *                  under each exhibit tab, and nothing elevated anywhere
 *                  else. Two magnitudes, one grammar, never a border and a
 *                  shadow stacked on the same edge.
 *
 * SIGNATURE — the exhibit tab
 *   Evidence is not laid out in a log grid; it is quoted mid-paragraph as a
 *   labelled exhibit — EXHIBIT A, B, C — set in the mono transcript face,
 *   lifted slightly off the page with its own small shadow and a rotated
 *   corner, exactly the way a photocopied attachment gets taped into a
 *   printed report. It belongs to this subject because Cadence's entire
 *   claim is that a run is quotable, admissible evidence rather than a
 *   vibe — and a postmortem is the one document format this audience
 *   already reads that treats a log line as evidence rather than noise.
 *
 * WHAT IT GIVES UP
 *   Scale as spectacle. There is no full-bleed dashboard, no scrubbable
 *   timeline, no dark rack-panel drama — someone looking for a product
 *   screenshot to compare against a competitor's landing page will not find
 *   one. The page reads like something you would print and highlight, and
 *   that register will look under-designed to anyone judging it by SaaS
 *   landing-page conventions rather than by whether the claim is credible.
 * ==========================================================================*/

import * as React from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Copy,
  FileText,
  Terminal,
  TriangleAlert,
} from "@/lib/icons";

const SERIF = "'Source Serif 4', ui-serif, Georgia, serif";
const MONO = "'IBM Plex Mono', ui-monospace, 'SF Mono', Menlo, monospace";

const LABEL =
  "text-[length:var(--p-t-label)] tracking-[0.14em] uppercase text-[var(--p-ink-3)]";
const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--p-accent)]";

const FULL_TRACE = [
  { seq: "001", at: "+0.00s", type: "run.started", body: 'runId "run_8f2c41" · orderId "ord_44913"' },
  { seq: "002", at: "+0.31s", type: "tool.call", body: 'lookupOrder({ orderId: "ord_44913" })' },
  { seq: "003", at: "+0.94s", type: "tool.result", body: '{ total: 128.40, currency: "GBP", status: "shipped" }' },
  { seq: "004", at: "+2.15s", type: "model.decision", body: '"refund in full — item arrived damaged"' },
  { seq: "005", at: "+2.20s", type: "tool.call", body: 'issueRefund({ orderId: "ord_44913", amount: 128.40 })' },
  { seq: "006", at: "+7.20s", type: "tool.error", body: "PaymentsTimeout: upstream silent 5000ms · attempt 1/5" },
  { seq: "007", at: "+7.21s", type: "retry.scheduled", body: "backoff 2.00s · attempt 2/5 · no model call re-issued" },
  { seq: "008", at: "+9.86s", type: "tool.result", body: '{ refundId: "rfd_2b70e1", state: "settled" }' },
  { seq: "009", at: "+10.02s", type: "run.completed", body: "{ refunded: 128.40 } · 9 events, 0 divergences on replay" },
];

const CODE = [
  'import { agent, retry, tool } from "@cadence/runtime";',
  "",
  "const lookupOrder = tool({",
  '  name: "lookupOrder",',
  "  input: z.object({ orderId: z.string() }),",
  "  run: ({ orderId }) => payments.orders.get(orderId),",
  "});",
  "",
  "const issueRefund = tool({",
  '  name: "issueRefund",',
  "  input: z.object({ orderId: z.string(), amount: z.number() }),",
  '  retry: retry.exponential({ attempts: 5, base: "2s", on: [PaymentsTimeout] }),',
  "  run: ({ orderId, amount }) => payments.refunds.create(orderId, amount),",
  "});",
  "",
  "export const refund = agent({",
  '  name: "refund",',
  "  tools: [lookupOrder, issueRefund],",
  "  durable: true,",
  "});",
];

const FINDINGS = [
  {
    n: "F1", head: "Durable execution",
    body: "A worker process was SIGKILLed by a routine deploy while attempt 2/5 was in flight. The next worker to pick up the lease resumed at seq 007 — not from scratch, because nothing the run needed was held in that process's memory.",
    without: "Without it: a deploy during a long-running agent loses the run silently, and you find out from the customer.",
  },
  {
    n: "F2", head: "Deterministic replay",
    body: "cadence.replay(\"run_8f2c41\") re-serves the same model calls, the same tool results and the same clock reads from the log rather than re-executing anything. This report's Exhibit B is that replay, not a fresh run — it reproduces byte-for-byte.",
    without: "Without it: reproducing a production failure means hoping the model samples the same token twice.",
  },
  {
    n: "F3", head: "Typed tool boundaries",
    body: "issueRefund declares its input and output as schemas, checked where the model hands off to real code. A malformed argument fails at that boundary with a typed error the retry policy can read, before it reaches the payments API.",
    without: "Without it: a hallucinated argument reaches production and the stack trace starts three services away from the cause.",
  },
  {
    n: "F4", head: "Per-step observability",
    body: "Every event in Exhibit B carries a sequence number, an offset from t0, and — once the run settles — a cost and duration. The trace is the log; there is no parallel telemetry system to keep in sync with it.",
    without: "Without it: you know the run took 10.02s and what it cost, and nothing about which step spent it.",
  },
];

const WORKERS = [
  { id: "wkr-1a", status: "leased", detail: "run_8f2c41 · seq 009 · lag 4ms" },
  { id: "wkr-2c", status: "draining", detail: "finishing 2 runs · no new leases" },
  { id: "wkr-3e", status: "unreachable", detail: "no heartbeat 38s · leases reclaimed" },
  { id: "wkr-4f", status: "leased", detail: "run_2a9d07 · seq 014 · lag 2ms" },
  { id: "wkr-5b", status: "leased", detail: "run_c1e850 · seq 003 · lag 6ms" },
];

export function CadenceParti() {
  const [openFinding, setOpenFinding] = React.useState<string | null>("F1");
  const [traceOpen, setTraceOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const copy = () =>
    navigator.clipboard?.writeText("npm i @cadence/runtime").then(
      () => { setCopied(true); window.setTimeout(() => setCopied(false), 1600); },
      () => setCopied(false),
    );

  return (
    <div
      data-arm="parti"
      style={{
        "--p-paper": "#F3EFE5", "--p-desk": "#E4DCC8", "--p-mono-bg": "#E9E2CF",
        "--p-ink": "#221D15", "--p-ink-2": "#55503F", "--p-ink-3": "#8A8471",
        "--p-rule": "#D8D0BC", "--p-accent": "#9A5A1F", "--p-accent-ink": "#FBF7EE",
        "--p-t-label": "11px", "--p-t-xs": "12.5px", "--p-t-sm": "14px",
        "--p-t-body": "16.5px", "--p-t-md": "20px", "--p-t-lg": "26px",
        "--p-t-xl": "clamp(30px,4.2vw,44px)",
        "--p-s1": "4px", "--p-s2": "8px", "--p-s3": "12px", "--p-s4": "16px",
        "--p-s5": "24px", "--p-s6": "32px", "--p-s7": "48px", "--p-s8": "72px",
        "--p-e-1": "0 18px 40px -22px rgba(34,25,12,0.45)",
        "--p-e-2": "0 10px 18px -10px rgba(34,25,12,0.4)",
        "--p-d-1": "120ms",
        fontFamily: SERIF,
      } as React.CSSProperties}
      className="bg-[var(--p-desk)] text-[var(--p-ink)] dark:[--p-paper:#1C1812] dark:[--p-desk:#131110] dark:[--p-mono-bg:#241F16] dark:[--p-ink:#F1EAD9] dark:[--p-ink-2:#C4BBA4] dark:[--p-ink-3:#8F8975] dark:[--p-rule:#3A3428] dark:[--p-accent:#D98A3D] dark:[--p-accent-ink:#1C1812]"
    >
      <link rel="stylesheet" precedence="default" href="https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,300..700&family=IBM+Plex+Mono:wght@400;500&display=swap" />

      <div className="mx-auto max-w-[840px] px-[var(--p-s4)] py-[var(--p-s6)] sm:px-[var(--p-s6)]">
        <div className="bg-[var(--p-paper)]" style={{ boxShadow: "var(--p-e-1)" }}>

          {/* doc header ---------------------------------------------------- */}
          <header className="flex flex-wrap items-center gap-[var(--p-s3)] border-b border-[var(--p-rule)] px-[var(--p-s5)] py-[var(--p-s4)] sm:px-[var(--p-s7)]">
            <span className="text-[length:var(--p-t-sm)] font-semibold tracking-[0.06em]">Cadence</span>
            <nav aria-label="Primary" className="ml-[var(--p-s4)] hidden gap-[var(--p-s4)] sm:flex">
              {["Runtime", "Docs", "Changelog", "Source"].map((s) => (
                <a key={s} href="#appendix" className={`text-[length:var(--p-t-xs)] text-[var(--p-ink-2)] underline-offset-4 transition-colors duration-[var(--p-d-1)] hover:text-[var(--p-accent)] hover:underline motion-reduce:transition-none ${FOCUS}`}>{s}</a>
              ))}
            </nav>
            <span className={`ml-auto ${LABEL}`}>Field report · RFD-2024-0114</span>
          </header>

          {/* hero / cover ---------------------------------------------------- */}
          <section className="px-[var(--p-s5)] pt-[var(--p-s7)] pb-[var(--p-s6)] sm:px-[var(--p-s7)]">
            <p className={LABEL}>Incident review — filed after a production refund run</p>
            <h1 className="mt-[var(--p-s3)] max-w-[20ch] text-[length:var(--p-t-xl)] leading-[1.08] font-semibold">
              Every step your agent takes is on the record.
            </h1>
            <dl className="mt-[var(--p-s5)] grid grid-cols-2 gap-x-[var(--p-s5)] gap-y-[var(--p-s2)] border-y border-[var(--p-rule)] py-[var(--p-s3)] sm:grid-cols-4" style={{ fontFamily: MONO }}>
              {[["Status", "Resolved"], ["Runtime", "Cadence"], ["Filed by", "Platform team"], ["Read time", "~3 min"]].map(([k, v]) => (
                <div key={k}>
                  <dt className={LABEL}>{k}</dt>
                  <dd className="text-[length:var(--p-t-sm)] text-[var(--p-ink)]">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-[var(--p-s5)] max-w-[58ch] text-[length:var(--p-t-body)] leading-[1.7] text-[var(--p-ink-2)]">
              Cadence is a runtime for agents that have to survive production: durable
              execution, byte-identical replay, and tool boundaries the type checker
              enforces before a malformed call reaches your systems. It is not a prompt
              framework and it does not host your model — it keeps an append-only log of
              what your agent actually did, so a failure can be read back instead of
              guessed at. What follows is one run that used it.
            </p>
            <div className="mt-[var(--p-s5)] flex flex-wrap items-stretch gap-[var(--p-s3)]">
              <div className="flex items-stretch border border-[var(--p-rule)] bg-[var(--p-mono-bg)]">
                <code className="flex items-center gap-[var(--p-s2)] px-[var(--p-s3)] py-[0.65em] text-[length:var(--p-t-xs)]" style={{ fontFamily: MONO }}>
                  <Terminal aria-hidden className="size-3.5 text-[var(--p-ink-3)]" />
                  npm i @cadence/runtime
                </code>
                <button type="button" onClick={copy} className={`flex items-center gap-[var(--p-s1)] border-l border-[var(--p-rule)] px-[var(--p-s3)] text-[length:var(--p-t-label)] tracking-[0.1em] uppercase text-[var(--p-ink-2)] transition-colors duration-[var(--p-d-1)] hover:text-[var(--p-accent)] motion-reduce:transition-none ${FOCUS}`}>
                  {copied ? <Check aria-hidden className="size-3.5" /> : <Copy aria-hidden className="size-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
          </section>

          {/* narrative with exhibits ------------------------------------------ */}
          <section className="border-t border-[var(--p-rule)] px-[var(--p-s5)] py-[var(--p-s6)] sm:px-[var(--p-s7)]">
            <h2 className="text-[length:var(--p-t-md)] font-semibold">What happened</h2>
            <p className="mt-[var(--p-s4)] max-w-[58ch] text-[length:var(--p-t-body)] leading-[1.7] text-[var(--p-ink-2)]">
              A customer reported a damaged item. The refund agent looked the order up,
              decided to refund it in full, and called <code style={{ fontFamily: MONO }} className="text-[length:var(--p-t-sm)] text-[var(--p-ink)]">issueRefund</code> — the tool
              definitions below, quoted as they were deployed.
            </p>

            {/* EXHIBIT A — the source ------------------------------------------ */}
            <figure className="relative mt-[var(--p-s6)] ml-0 max-w-[64ch] -rotate-[0.4deg] border border-[var(--p-rule)] bg-[var(--p-mono-bg)] sm:ml-[var(--p-s4)]" style={{ boxShadow: "var(--p-e-2)" }}>
              <figcaption className="flex items-center gap-[var(--p-s2)] border-b border-[var(--p-rule)] px-[var(--p-s4)] py-[var(--p-s2)]" style={{ fontFamily: MONO }}>
                <FileText aria-hidden className="size-3.5 text-[var(--p-accent)]" />
                <span className={LABEL}>Exhibit A — refund.ts, as deployed</span>
              </figcaption>
              <div className="overflow-x-auto p-[var(--p-s4)]" style={{ fontFamily: MONO }}>
                {CODE.map((l, i) => (
                  <div key={i} className="flex whitespace-pre text-[length:var(--p-t-xs)] leading-[1.65] text-[var(--p-ink)]">
                    <span className="w-6 shrink-0 pr-[var(--p-s2)] text-right text-[var(--p-ink-3)]">{l ? i + 1 : ""}</span>
                    <span>{l || " "}</span>
                  </div>
                ))}
              </div>
            </figure>

            <p className="mt-[var(--p-s6)] max-w-[58ch] text-[length:var(--p-t-body)] leading-[1.7] text-[var(--p-ink-2)]">
              The refund reached <code style={{ fontFamily: MONO }} className="text-[length:var(--p-t-sm)] text-[var(--p-ink)]">issueRefund</code> at t+2.20s. The payments API then went
              silent for five seconds — long enough to time out. The retry policy declared in
              Exhibit A woke on schedule, and the run settled 2.66 seconds later with no model
              call re-issued and no customer-facing error. This is the log, quoted directly.
            </p>

            {/* EXHIBIT B — the log --------------------------------------------- */}
            <figure className="relative mt-[var(--p-s6)] ml-0 max-w-[64ch] rotate-[0.3deg] border border-[var(--p-rule)] bg-[var(--p-mono-bg)] sm:ml-[var(--p-s6)]" style={{ boxShadow: "var(--p-e-2)" }}>
              <figcaption className="flex flex-wrap items-center gap-[var(--p-s2)] border-b border-[var(--p-rule)] px-[var(--p-s4)] py-[var(--p-s2)]">
                <FileText aria-hidden className="size-3.5 text-[var(--p-accent)]" style={{ fontFamily: MONO }} />
                <span className={LABEL}>Exhibit B — replay of run_8f2c41</span>
                <span className={`ml-auto ${LABEL}`} style={{ fontFamily: MONO }}>0 divergences</span>
              </figcaption>
              <div className={`p-[var(--p-s4)] ${traceOpen ? "max-h-[220px] overflow-y-auto" : ""}`} style={{ fontFamily: MONO }}>
                {(traceOpen ? FULL_TRACE : FULL_TRACE.filter((e) => ["006", "007", "008"].includes(e.seq))).map((e) => (
                  <div key={e.seq} className="flex flex-wrap gap-x-[var(--p-s3)] gap-y-0 whitespace-pre text-[length:var(--p-t-xs)] leading-[1.75]">
                    <span className="text-[var(--p-ink-3)]">{e.seq}</span>
                    <span className="text-[var(--p-ink-3)]">{e.at.padStart(7)}</span>
                    <span className="min-w-[9rem] text-[var(--p-ink)]" style={{ color: e.type === "tool.error" ? "var(--p-accent)" : undefined, textDecoration: e.type === "tool.error" ? "underline" : "none", textDecorationColor: "var(--p-accent)" }}>
                      {e.type === "tool.error" && <TriangleAlert aria-hidden className="mr-1 inline size-3 -translate-y-[1px]" />}
                      {e.type}
                    </span>
                    <span className="text-[var(--p-ink-2)]">{e.body}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-[var(--p-rule)] px-[var(--p-s4)] py-[var(--p-s2)]">
                <button
                  type="button" aria-expanded={traceOpen} onClick={() => setTraceOpen((v) => !v)}
                  className={`text-[length:var(--p-t-label)] tracking-[0.1em] uppercase text-[var(--p-ink-2)] transition-colors duration-[var(--p-d-1)] hover:text-[var(--p-accent)] motion-reduce:transition-none ${FOCUS}`}
                >
                  {traceOpen ? "Show excerpt only" : "Show full trace — 9 events"}
                </button>
              </div>
            </figure>
          </section>

          {/* findings ---------------------------------------------------------- */}
          <section id="findings" className="border-t border-[var(--p-rule)] px-[var(--p-s5)] py-[var(--p-s6)] sm:px-[var(--p-s7)]">
            <h2 className="text-[length:var(--p-t-md)] font-semibold">Findings</h2>
            <p className="mt-[var(--p-s2)] max-w-[58ch] text-[length:var(--p-t-sm)] leading-[1.7] text-[var(--p-ink-3)]">
              Four things Exhibit A and B depended on. Read what breaks without each.
            </p>
            <div className="mt-[var(--p-s4)] border-t border-[var(--p-rule)]">
              {FINDINGS.map((f) => {
                const on = openFinding === f.n;
                return (
                  <div key={f.n} className="border-b border-[var(--p-rule)]">
                    <button
                      type="button" aria-expanded={on} onClick={() => setOpenFinding(on ? null : f.n)}
                      className={`flex w-full items-baseline gap-[var(--p-s4)] py-[var(--p-s4)] text-left transition-colors duration-[var(--p-d-1)] hover:text-[var(--p-accent)] motion-reduce:transition-none ${FOCUS}`}
                    >
                      <span className="text-[length:var(--p-t-xs)] text-[var(--p-ink-3)]" style={{ fontFamily: MONO }}>{f.n}</span>
                      <span className="text-[length:var(--p-t-body)] font-semibold">{f.head}</span>
                      <ChevronDown aria-hidden className="ml-auto size-4 shrink-0 text-[var(--p-ink-3)]" style={{ transform: on ? "rotate(180deg)" : "none" }} />
                    </button>
                    {on && (
                      <div className="grid gap-[var(--p-s4)] pb-[var(--p-s5)] pl-[var(--p-s6)] md:grid-cols-[1.3fr_1fr]">
                        <p className="max-w-[52ch] text-[length:var(--p-t-sm)] leading-[1.7] text-[var(--p-ink-2)]">{f.body}</p>
                        <p className="max-w-[46ch] border-l-2 border-[var(--p-accent)] pl-[var(--p-s3)] text-[length:var(--p-t-xs)] leading-[1.7] text-[var(--p-ink-2)]" style={{ fontFamily: MONO }}>{f.without}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* appendix — architecture ------------------------------------------- */}
          <section id="appendix" className="border-t border-[var(--p-rule)] bg-[var(--p-mono-bg)] px-[var(--p-s5)] py-[var(--p-s6)] sm:px-[var(--p-s7)]">
            <p className={LABEL}>Appendix — system of record</p>
            <h2 className="mt-[var(--p-s2)] text-[length:var(--p-t-md)] font-semibold">
              Fig. 1 — three pieces, one source of truth
            </h2>
            <div className="mt-[var(--p-s5)] grid gap-[var(--p-s5)] lg:grid-cols-[1.1fr_1fr]">
              <ul className="space-y-[var(--p-s4)]">
                <li>
                  <p className={LABEL}>Control plane</p>
                  <p className="mt-[var(--p-s1)] max-w-[48ch] text-[length:var(--p-t-sm)] leading-[1.65] text-[var(--p-ink-2)]">
                    Holds schedules, leases and retry policy. Never executes your code and
                    never sees a model token — one Postgres table is a valid deployment.
                  </p>
                </li>
                <li>
                  <p className={LABEL}>Worker pool</p>
                  <p className="mt-[var(--p-s1)] max-w-[48ch] text-[length:var(--p-t-sm)] leading-[1.65] text-[var(--p-ink-2)]">
                    Disposable by design — nothing a worker holds in memory is authoritative,
                    so a lost worker just means a reclaimed lease. Live pool, filed at t+10.02s:
                  </p>
                  <ul className="mt-[var(--p-s2)] max-h-[128px] overflow-y-auto border border-[var(--p-rule)] bg-[var(--p-paper)]" style={{ fontFamily: MONO }}>
                    {WORKERS.map((w) => {
                      const emphasis = w.status === "unreachable" || w.status === "draining";
                      return (
                        <li key={w.id} className="flex flex-wrap items-baseline gap-x-[var(--p-s3)] gap-y-0 border-b border-[var(--p-rule)] px-[var(--p-s3)] py-[var(--p-s2)] text-[length:var(--p-t-label)] last:border-b-0">
                          <span className="text-[var(--p-ink)]">{w.id}</span>
                          <span className="uppercase tracking-[0.08em]" style={{ color: emphasis ? "var(--p-accent)" : "var(--p-ink-3)", textDecoration: emphasis ? "underline" : "none" }}>{w.status}</span>
                          <span className="text-[var(--p-ink-3)]">{w.detail}</span>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              </ul>
              <div className="border border-[var(--p-rule)] bg-[var(--p-paper)] p-[var(--p-s4)]">
                <p className={LABEL}>Event log — append-only</p>
                <p className="mt-[var(--p-s2)] text-[length:var(--p-t-sm)] leading-[1.65] text-[var(--p-ink-2)]">
                  Every lease, tool call, model response and clock read lands here before it
                  is observable anywhere else. Replay reads this file forward; it does not
                  re-run side effects, which is why Exhibit B is trustworthy as evidence
                  rather than a re-enactment.
                </p>
                <p className="mt-[var(--p-s3)] text-[length:var(--p-t-xs)] leading-[1.7] text-[var(--p-ink-3)]" style={{ fontFamily: MONO }}>
                  postgres · sqlite · s3+wal — retained 90d default<br />
                  replay(run_8f2c41) → 9/9 events matched
                </p>
              </div>
            </div>
          </section>

          {/* closing / action items --------------------------------------------- */}
          <section className="border-t border-[var(--p-rule)] px-[var(--p-s5)] py-[var(--p-s7)] sm:px-[var(--p-s7)]">
            <p className={LABEL}>Action items</p>
            <h2 className="mt-[var(--p-s2)] max-w-[26ch] text-[length:var(--p-t-lg)] leading-[1.15] font-semibold">
              Keep hand-rolling if it is working. Adopt this when it stops.
            </h2>
            <p className="mt-[var(--p-s4)] max-w-[58ch] text-[length:var(--p-t-body)] leading-[1.7] text-[var(--p-ink-2)]">
              Cadence wraps the tool functions you already have — no DSL, no prompt
              migration. Node 20+, one Postgres or SQLite database for the log, and your
              workers run wherever they already run.
            </p>
            <div className="mt-[var(--p-s5)] flex flex-wrap items-center gap-[var(--p-s4)]">
              <a href="#appendix" className={`inline-flex items-center gap-[var(--p-s2)] bg-[var(--p-accent)] px-[var(--p-s5)] py-[0.7em] text-[length:var(--p-t-sm)] font-semibold text-[var(--p-accent-ink)] transition-opacity duration-[var(--p-d-1)] hover:opacity-90 active:opacity-80 motion-reduce:transition-none ${FOCUS}`}>
                Read the execution model
                <ArrowRight aria-hidden className="size-4" />
              </a>
              <span className={LABEL}>no signup · the log format is documented and stable</span>
            </div>
            <p className="mt-[var(--p-s7)] border-t border-[var(--p-rule)] pt-[var(--p-s3)] text-[length:var(--p-t-label)] tracking-[0.1em] uppercase text-[var(--p-ink-3)]">
              Filed · RFD-2024-0114 · status resolved
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
