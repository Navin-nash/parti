"use client";

/* ============================================================================
 * DIRECTION — "Marginalia"
 *
 * THESIS
 *   An engineer reading a protocol spec does not read it like an article —
 *   they read the prose once to understand the shape of the thing, then they
 *   live in the margin: the exact constraint next to the exact term, jotted
 *   where the eye already is. The page is built as an annotated document, not
 *   as a scannable index. Compact facts stay compact; the explanation that
 *   makes them usable is pinned beside them, not folded into a busier row.
 *
 * SIX AXES  (measured against this arm's own prior build, which converged on
 * dense / mono-everything / grid-strict / three-track ledger rows)
 *   Density        measured, not dense. Real paragraphs, 1.7 line-height, a
 *                  68ch prose measure. The previous build treated every pixel
 *                  as owed to the terminal user; this treats comprehension on
 *                  first read as worth the same respect as scan speed on the
 *                  hundredth.
 *   Structure      editorial-asymmetric — one reading column with a narrow,
 *                  intermittent margin rail that only appears where there is
 *                  something to annotate, not a fixed two-column grid running
 *                  the length of the page. Nothing here is address-gutter
 *                  symmetric.
 *   Type voice     editorial-serif carries prose and headings (Newsreader,
 *                  built for long-form optical sizing); IBM Plex Mono is
 *                  reserved for identifiers only. The previous build put mono
 *                  everywhere it could; here mono is a marked, minority voice
 *                  that stands out precisely because it is rare on the page.
 *   Chroma         monochrome+accent, but the accent is cobalt ink, not the
 *                  amber/duotone family both prior builds on this site used.
 *                  Ground is a cool sage-paper, deliberately not the warm
 *                  cream-plus-terracotta pairing that is the most recognisable
 *                  generated-design tell there is.
 *   Motion posture responsive-only, one moment: a matched term's leader draws
 *                  in stroke-first, like a pen underlining a word before the
 *                  note beside it gets read. Different mechanism from the
 *                  previous build's opacity flash — it shows *arrival*, not a
 *                  binary found/not-found flag.
 *   Depth          layered-shadow, applied to exactly one thing: the margin
 *                  note is a physical index card pinned above the page with a
 *                  soft directional shadow. Everywhere else — table, prose,
 *                  code — stays flat. The previous build was flat-subtractive
 *                  everywhere; this build spends depth once, on purpose.
 *
 * SIGNATURE — the margin note
 *   Every parameter and every error carries its explanation as a pinned card
 *   in the margin, connected to its row by a short hand-drawn leader. It
 *   belongs to this subject because it's the literal behaviour of an engineer
 *   annotating a printed RFC while integrating against it — the compact fact
 *   (name, type, status code) stays a fact; the "why" gets written beside it,
 *   not squeezed into the same cell.
 *
 * WHAT IT GIVES UP
 *   Single-glance grep density — a reader who wants every parameter's full
 *   constraint in one eye-sweep across a compact grid gets slightly more
 *   travel here, because the note sits beside the row rather than folded into
 *   it. It trades some of that terminal-adjacent compression for prose that
 *   can actually be understood the first time, not just located.
 * ==========================================================================*/

import * as React from "react";
import { BookOpen, Check, Copy, PenLine, Search, X } from "@/lib/icons";

const ROOT = {
  "--p-font-serif": "'Newsreader'",
  "--p-font-mono": "'IBM Plex Mono'",

  "--p-ground": "#eaede8",       "--p-ground-d": "#11140f",
  "--p-card": "#fbfbf9",         "--p-card-d": "#181d17",
  "--p-ink": "#1b211d",          "--p-ink-d": "#e7ebe3",
  "--p-ink-2": "#4b564e",        "--p-ink-2-d": "#aab3a4",
  "--p-ink-3": "#626d65",        "--p-ink-3-d": "#7e897e",
  "--p-rule": "#d3d8ce",         "--p-rule-d": "#2a3128",
  "--p-accent": "#28457a",       "--p-accent-d": "#8fb0de",
  "--p-accent-bg": "#e4ebf5",    "--p-accent-bg-d": "#1b2a3f",
  "--p-error": "#8c3b2e",        "--p-error-d": "#d98a79",
  "--p-ok": "#2f5d40",           "--p-ok-d": "#7fb897",

  "--p-s1": "8px", "--p-s2": "12px", "--p-s3": "16px",
  "--p-s4": "24px", "--p-s5": "32px", "--p-s6": "48px", "--p-s7": "64px",

  "--p-t-xs": "12.5px", "--p-t-sm": "14px", "--p-t-md": "16px",
  "--p-t-lg": "19px", "--p-t-xl": "25px", "--p-t-2xl": "34px",

  "--p-r-sm": "4px", "--p-r-md": "10px", "--p-r-pill": "999px",
  "--p-note-shadow": "0 1px 2px rgba(17,20,15,.07), 0 10px 22px -10px rgba(17,20,15,.22)",

  "--p-d-fast": "120ms",
  "--p-d-draw": "420ms",
  "--p-ease": "cubic-bezier(0.2, 0, 0, 1)",
} as React.CSSProperties;

const SHEET = `@import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,500&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
[data-parti="marginalia"]{font-family:var(--p-font-serif),Georgia,serif;-webkit-font-smoothing:antialiased}
[data-parti="marginalia"] .rd-mono{font-family:var(--p-font-mono),ui-monospace,"SF Mono",Menlo,monospace;font-variant-numeric:tabular-nums}
[data-parti="marginalia"] :focus-visible{outline:2px solid var(--p-accent);outline-offset:2px;border-radius:var(--p-r-sm)}
[data-parti="marginalia"].dark :focus-visible,.dark [data-parti="marginalia"] :focus-visible{outline-color:var(--p-accent-d)}
[data-parti="marginalia"] .rd-leader{stroke-dasharray:24;stroke-dashoffset:0}
[data-parti="marginalia"] .rd-leader.rd-draw{stroke-dashoffset:24;animation:rd-draw var(--p-d-draw) var(--p-ease) forwards}
[data-parti="marginalia"] .rd-underline{transform:scaleX(0);transform-origin:left}
[data-parti="marginalia"] .rd-underline.rd-draw{animation:rd-scale var(--p-d-draw) var(--p-ease) forwards}
@keyframes rd-draw{to{stroke-dashoffset:0}}
@keyframes rd-scale{to{transform:scaleX(1)}}
@media (prefers-reduced-motion:reduce){[data-parti="marginalia"] *{animation:none!important;transition:none!important}
[data-parti="marginalia"] .rd-leader.rd-draw{stroke-dashoffset:0}[data-parti="marginalia"] .rd-underline.rd-draw{transform:scaleX(1)}}`;

/* ------------------------------------------------------------------ data */

const NAV = [
  { group: "Delivery", items: [
    { id: "send", label: "Send a message", path: "POST /v1/messages", here: true },
    { id: "get", label: "Retrieve a message", path: "GET /v1/messages/:id" },
    { id: "cancel", label: "Cancel a scheduled send", path: "POST /v1/messages/:id/cancel" },
  ]},
  { group: "Channels", items: [
    { id: "ch-list", label: "List channels", path: "GET /v1/channels" },
    { id: "ch-verify", label: "Verify a channel", path: "POST /v1/channels/:id/verify" },
  ]},
  { group: "Reference", items: [
    { id: "idem", label: "Idempotency", path: "Concept" },
    { id: "retries", label: "Retry and backoff", path: "Concept" },
    { id: "errors", label: "Error codes", path: "Concept" },
  ]},
];

type Param = { name: string; type: string; required?: boolean; desc: string; constraint: string; default?: string };

const PARAMS: Param[] = [
  { name: "channel", type: "string", required: true,
    desc: "Verified channel to deliver through. Accepts the channel id or its slug.",
    constraint: "Must be in state verified. Sending to an unverified channel returns 422." },
  { name: "payload", type: "object", required: true,
    desc: "Channel-shaped body. Relay does not transform it — whatever you put here is what the provider receives.",
    constraint: "≤ 256 KiB serialised. Keys are not validated against the channel schema until dispatch." },
  { name: "idempotency_key", type: "string",
    desc: "Client-generated key that collapses duplicate submissions of the same message.",
    constraint: "1–255 chars. Retained 24h. Reuse with a different payload returns 409, not a silent overwrite." },
  { name: "deliver_at", type: "timestamp", default: "now",
    desc: "Schedules the send. Omit for immediate dispatch.",
    constraint: "RFC 3339, UTC only. Must be ≤ 30 days ahead. Past timestamps dispatch immediately rather than erroring." },
  { name: "retry_policy", type: "object", default: "exponential, 6 attempts",
    desc: "Overrides the channel's retry policy for this message only.",
    constraint: "max_attempts ≤ 12. backoff one of exponential | linear | none." },
];

const ERRORS = [
  { status: 429, slug: "rate_limited", body: `{
  "error": "rate_limited",
  "message": "Channel ch_2Rk9 exceeded 500 msg/s.",
  "retry_after_ms": 4000
}`, fix: "Back off for retry_after_ms and resubmit with the same idempotency_key. Relay does not queue on your behalf at the edge." },
  { status: 409, slug: "duplicate_idempotency_key", body: `{
  "error": "duplicate_idempotency_key",
  "message": "Key 'order-8841-refund' was used with a different payload.",
  "original_message_id": "msg_01JQ8Y4T2"
}`, fix: "The key is bound to the first payload it saw. Fetch original_message_id to see what was actually sent, or use a new key." },
  { status: 422, slug: "channel_unverified", body: `{
  "error": "channel_unverified",
  "message": "Channel ch_7Fp1 is in state 'pending_dns'.",
  "channel_id": "ch_7Fp1"
}`, fix: "Verification is asynchronous. Poll GET /v1/channels/ch_7Fp1 until state is verified — DNS propagation is the usual delay." },
];

const SAMPLES = {
  curl: { label: "cURL", code: `curl https://api.relay.dev/v1/messages \\
  -H "Authorization: Bearer $RELAY_KEY" \\
  -H "Idempotency-Key: order-8841-refund" \\
  -H "Content-Type: application/json" \\
  -d '{
    "channel": "ch_2Rk9",
    "payload": { "template": "refund_issued", "amount_cents": 4200 },
    "deliver_at": "2026-09-02T14:00:00Z",
    "retry_policy": { "max_attempts": 8, "backoff": "exponential" }
  }'` },
  ts: { label: "TypeScript", code: `import { Relay } from "@relay/sdk";

const relay = new Relay(process.env.RELAY_KEY!);

const message = await relay.messages.send({
  channel: "ch_2Rk9",
  payload: { template: "refund_issued", amount_cents: 4200 },
  idempotencyKey: "order-8841-refund",
  deliverAt: new Date("2026-09-02T14:00:00Z"),
  retryPolicy: { maxAttempts: 8, backoff: "exponential" },
});

message.id;     // "msg_01JQ8Y4T2"
message.state;  // "queued" | "dispatched" | "delivered" | "dead_lettered"` },
} as const;

type SampleId = keyof typeof SAMPLES;

/* ------------------------------------------------------------ primitives */

const INK = "text-[var(--p-ink)] dark:text-[var(--p-ink-d)]";
const INK2 = "text-[var(--p-ink-2)] dark:text-[var(--p-ink-2-d)]";
const INK3 = "text-[var(--p-ink-3)] dark:text-[var(--p-ink-3-d)]";
const RULE = "border-[var(--p-rule)] dark:border-[var(--p-rule-d)]";

function CopyButton({ value, label }: { value: string; label: string }) {
  const [done, setDone] = React.useState(false);
  React.useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setDone(false), 1400);
    return () => clearTimeout(t);
  }, [done]);
  return (
    <button
      type="button"
      onClick={() => { navigator.clipboard?.writeText(value).catch(() => {}); setDone(true); }}
      aria-label={done ? `${label} copied` : `Copy ${label}`}
      className={`rd-mono inline-flex min-h-[28px] items-center gap-[var(--p-s1)] rounded-[var(--p-r-sm)] border ${RULE} px-[var(--p-s2)] text-[length:var(--p-t-xs)] ${INK2} transition-colors duration-[var(--p-d-fast)] hover:${INK}`}
    >
      {done ? <Check className="size-3" aria-hidden /> : <Copy className="size-3" aria-hidden />}
      {done ? "Copied" : "Copy"}
    </button>
  );
}

/** A leader: a short hand-drawn tick connecting a row to its margin note. */
function Leader({ matched }: { matched: boolean | null }) {
  return (
    <svg width="28" height="100%" viewBox="0 0 28 24" className="hidden shrink-0 self-stretch md:block" aria-hidden>
      <line x1="0" y1="12" x2="18" y2="12" strokeWidth="1.5"
        className={`rd-leader ${matched ? "rd-draw" : ""} ${matched ? "stroke-[var(--p-accent)] dark:stroke-[var(--p-accent-d)]" : "stroke-[var(--p-rule)] dark:stroke-[var(--p-rule-d)]"}`} />
      <circle cx="21" cy="12" r="2.5" className={matched ? "fill-[var(--p-accent)] dark:fill-[var(--p-accent-d)]" : "fill-[var(--p-rule)] dark:fill-[var(--p-rule-d)]"} />
    </svg>
  );
}

/** SIGNATURE: the margin note. A pinned index card, elevated once on purpose. */
function Note({ children, matched }: { children: React.ReactNode; matched?: boolean | null }) {
  return (
    <div className="flex md:w-[248px] md:shrink-0">
      <Leader matched={matched ?? null} />
      <div
        className={`min-w-0 flex-1 rounded-[var(--p-r-md)] border bg-[var(--p-card)] p-[var(--p-s3)] transition-colors duration-[var(--p-d-fast)] dark:bg-[var(--p-card-d)] ${
          matched ? "border-[var(--p-accent)] dark:border-[var(--p-accent-d)]" : `${RULE}`}`}
        style={{ boxShadow: "var(--p-note-shadow)" }}
      >
        <PenLine className={`mb-[var(--p-s1)] size-3.5 ${INK3}`} aria-hidden />
        {children}
      </div>
    </div>
  );
}

/** One row of the reference: compact fact on the left, its note pinned beside it. */
function ParamRow({ p, matched }: { p: Param; matched: boolean | null }) {
  return (
    <div id={p.name} className={`flex flex-col gap-[var(--p-s3)] border-t ${RULE} py-[var(--p-s4)] transition-opacity duration-[var(--p-d-fast)] md:flex-row md:items-start ${matched === false ? "opacity-45" : "opacity-100"}`}>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-[var(--p-s2)] gap-y-[var(--p-s1)]">
          <code className={`rd-mono text-[length:var(--p-t-md)] font-medium ${matched ? "text-[var(--p-accent)] dark:text-[var(--p-accent-d)]" : INK}`}>
            <span className={matched ? "rd-underline rd-draw" : ""} style={{ display: "inline-block" }}>{p.name}</span>
          </code>
          <span className={`rd-mono text-[length:var(--p-t-xs)] ${INK3}`}>{p.type}</span>
          {p.required ? (
            <span className="rd-mono rounded-[var(--p-r-pill)] bg-[var(--p-error)] px-[var(--p-s2)] py-[1px] text-[length:var(--p-t-xs)] font-medium text-white dark:bg-[var(--p-error-d)] dark:text-[var(--p-ink-d)]">required</span>
          ) : (
            <span className={`rd-mono text-[length:var(--p-t-xs)] ${INK3}`}>default: {p.default}</span>
          )}
        </div>
      </div>
      <Note matched={matched}>
        <p className={`text-[length:var(--p-t-sm)] leading-[1.55] ${INK}`}>{p.desc}</p>
        <p className={`rd-mono mt-[var(--p-s2)] text-[length:var(--p-t-xs)] leading-[1.5] ${INK2}`}>{p.constraint}</p>
      </Note>
    </div>
  );
}

/* ----------------------------------------------------------------- screen */

export function RelayDocsParti() {
  const [tab, setTab] = React.useState<SampleId>("curl");
  const [q, setQ] = React.useState("");

  const query = q.trim().toLowerCase();
  const searching = query.length > 0;
  const hit = (...fields: string[]) => (searching ? fields.some((f) => f.toLowerCase().includes(query)) : null);

  const navHits = NAV.map((g) => ({ ...g, items: g.items.filter((i) => !searching || `${i.label} ${i.path}`.toLowerCase().includes(query)) })).filter((g) => g.items.length > 0);
  const paramHits = PARAMS.filter((p) => hit(p.name, p.desc, p.type));
  const errorHits = ERRORS.filter((e) => hit(String(e.status), e.slug, e.fix));
  const total = navHits.reduce((n, g) => n + g.items.length, 0) + paramHits.length + errorHits.length;

  return (
    <div data-parti="marginalia" style={ROOT} className="bg-[var(--p-ground)] text-[length:var(--p-t-md)] leading-[1.7] dark:bg-[var(--p-ground-d)]">
      <style dangerouslySetInnerHTML={{ __html: SHEET }} />

      <div className="mx-auto grid max-w-[1240px] grid-cols-1 lg:grid-cols-[240px_1fr]">
        {/* ---------------------------- sidebar ---------------------------- */}
        <aside className={`border-b ${RULE} lg:border-b-0 lg:border-r`}>
          <div className="p-[var(--p-s4)]">
            <div className="mb-[var(--p-s4)] flex items-center gap-[var(--p-s2)]">
              <BookOpen className={`size-4 ${INK2}`} aria-hidden />
              <span className={`text-[length:var(--p-t-md)] font-medium ${INK}`}>Relay reference</span>
            </div>
            <div className="relative">
              <Search className={`pointer-events-none absolute left-[var(--p-s2)] top-1/2 size-3.5 -translate-y-1/2 ${INK3}`} aria-hidden />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="429, idempotency_key…"
                aria-label="Search the Relay API reference"
                className={`rd-mono min-h-[36px] w-full rounded-[var(--p-r-sm)] border ${RULE} bg-[var(--p-card)] pl-[28px] pr-[28px] text-[length:var(--p-t-sm)] ${INK} placeholder:${INK3} dark:bg-[var(--p-card-d)]`}
              />
              {searching ? (
                <button type="button" onClick={() => setQ("")} aria-label="Clear search"
                  className={`absolute right-[var(--p-s1)] top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-[var(--p-r-sm)] ${INK3}`}>
                  <X className="size-3.5" aria-hidden />
                </button>
              ) : null}
            </div>
            {searching ? <p className={`mt-[var(--p-s2)] text-[length:var(--p-t-xs)] ${INK3}`}>{total} match{total === 1 ? "" : "es"} on this page</p> : null}
          </div>

          <nav className="px-[var(--p-s4)] pb-[var(--p-s5)]">
            {navHits.length === 0 ? (
              <p className={`text-[length:var(--p-t-sm)] ${INK2}`}>No endpoint matches “{q.trim()}.” Try Errors, or clear the search.</p>
            ) : (
              navHits.map((g) => (
                <div key={g.group} className="mb-[var(--p-s4)]">
                  <p className={`mb-[var(--p-s2)] text-[length:var(--p-t-xs)] uppercase tracking-[0.08em] ${INK3}`}>{g.group}</p>
                  <ul className={`border-l ${RULE}`}>
                    {g.items.map((i) => (
                      <li key={i.id}>
                        <a href={`#${i.id}`} aria-current={i.here ? "page" : undefined}
                          className={`-ml-px block border-l-2 py-[var(--p-s1)] pl-[var(--p-s3)] ${i.here ? `border-[var(--p-accent)] font-medium ${INK} dark:border-[var(--p-accent-d)]` : `border-transparent ${INK2} hover:border-[var(--p-rule)] dark:hover:border-[var(--p-rule-d)]`}`}>
                          {i.label}
                          <span className={`rd-mono block text-[length:var(--p-t-xs)] ${INK3}`}>{i.path}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </nav>
        </aside>

        {/* ---------------------------- content --------------------------- */}
        <main className="min-w-0 px-[var(--p-s4)] pb-[var(--p-s7)] sm:px-[var(--p-s5)]">
          <header className={`max-w-[68ch] border-b ${RULE} py-[var(--p-s5)]`}>
            <p className={`text-[length:var(--p-t-xs)] uppercase tracking-[0.08em] ${INK3}`}>Delivery / Messages</p>
            <h1 className={`mt-[var(--p-s2)] flex flex-wrap items-baseline gap-[var(--p-s2)] text-[length:var(--p-t-2xl)] font-medium ${INK}`}>
              <span className="rd-mono rounded-[var(--p-r-pill)] bg-[var(--p-ok)] px-[var(--p-s2)] py-[2px] text-[length:var(--p-t-sm)] font-semibold text-white dark:bg-[var(--p-ok-d)] dark:text-[var(--p-ground-d)]">POST</span>
              <span className="rd-mono">/v1/messages</span>
            </h1>
            <p className={`mt-[var(--p-s3)] text-[length:var(--p-t-lg)] leading-[1.65] ${INK2}`}>
              Accepts a message for delivery on a verified channel. Relay returns{" "}
              <code className={`rd-mono ${INK}`}>202 Accepted</code> with a message id — delivery itself is
              asynchronous, and the parameters below are what shape it once it leaves this response.
            </p>
          </header>

          {searching && total === 0 ? (
            <p className={`border-b ${RULE} py-[var(--p-s5)] text-[length:var(--p-t-md)] ${INK2}`}>
              Nothing on this page matches “{q.trim()}.” Try a bare status code (429) or a parameter name (deliver_at).
            </p>
          ) : null}

          {/* request sample */}
          <section className="py-[var(--p-s5)]">
            <div className="mb-[var(--p-s3)] flex items-center gap-[var(--p-s1)]">
              {(Object.keys(SAMPLES) as SampleId[]).map((id) => (
                <button key={id} type="button" onClick={() => setTab(id)} aria-pressed={tab === id}
                  className={`rd-mono min-h-[30px] rounded-[var(--p-r-sm)] border px-[var(--p-s3)] text-[length:var(--p-t-sm)] transition-colors duration-[var(--p-d-fast)] ${tab === id ? `${RULE} ${INK}` : `border-transparent ${INK3} hover:${INK2}`}`}>
                  {SAMPLES[id].label}
                </button>
              ))}
            </div>
            <div className={`overflow-hidden rounded-[var(--p-r-md)] border bg-[var(--p-card)] dark:bg-[var(--p-card-d)] ${RULE}`}>
              <div className={`flex items-center justify-between border-b ${RULE} px-[var(--p-s3)] py-[var(--p-s2)]`}>
                <span className={`text-[length:var(--p-t-xs)] italic ${INK3}`}>Figure — request, {SAMPLES[tab].label}</span>
                <CopyButton value={SAMPLES[tab].code} label={`${SAMPLES[tab].label} sample`} />
              </div>
              <pre className="overflow-x-auto px-[var(--p-s4)] py-[var(--p-s3)]">
                <code className={`rd-mono block text-[length:var(--p-t-sm)] leading-[1.6] ${INK}`}>{SAMPLES[tab].code}</code>
              </pre>
            </div>
          </section>

          {/* parameters — the literal reference table, annotated in the margin */}
          <section className="pb-[var(--p-s5)]">
            <h2 className={`pb-[var(--p-s2)] text-[length:var(--p-t-lg)] font-medium ${INK}`}>Body parameters</h2>
            <div className={`max-h-[560px] overflow-y-auto`}>
              {PARAMS.map((p) => <ParamRow key={p.name} p={p} matched={hit(p.name, p.desc, p.type)} />)}
            </div>
          </section>

          {/* errors — real responses, fix annotated beside each */}
          <section id="errors" className="pb-[var(--p-s6)]">
            <h2 className={`border-t ${RULE} pb-[var(--p-s2)] pt-[var(--p-s5)] text-[length:var(--p-t-lg)] font-medium ${INK}`}>Errors you will actually see</h2>
            {ERRORS.map((e) => {
              const matched = hit(String(e.status), e.slug, e.fix);
              return (
                <div key={e.slug} className={`flex flex-col gap-[var(--p-s3)] border-t ${RULE} py-[var(--p-s4)] transition-opacity duration-[var(--p-d-fast)] md:flex-row md:items-start ${matched === false ? "opacity-45" : "opacity-100"}`}>
                  <div className="min-w-0 flex-1">
                    <div className="mb-[var(--p-s2)] flex flex-wrap items-baseline gap-x-[var(--p-s3)]">
                      <code className="rd-mono text-[length:var(--p-t-lg)] font-medium text-[var(--p-error)] dark:text-[var(--p-error-d)]">{e.status}</code>
                      <code className={`rd-mono text-[length:var(--p-t-sm)] ${INK2}`}>{e.slug}</code>
                    </div>
                    <div className={`overflow-hidden rounded-[var(--p-r-md)] border bg-[var(--p-card)] dark:bg-[var(--p-card-d)] ${RULE}`}>
                      <pre className="overflow-x-auto px-[var(--p-s3)] py-[var(--p-s2)]">
                        <code className={`rd-mono block text-[length:var(--p-t-xs)] leading-[1.6] ${INK}`}>{e.body}</code>
                      </pre>
                    </div>
                  </div>
                  <Note matched={matched}>
                    <p className={`text-[length:var(--p-t-sm)] leading-[1.55] ${INK}`}>{e.fix}</p>
                  </Note>
                </div>
              );
            })}
          </section>
        </main>
      </div>
    </div>
  );
}
