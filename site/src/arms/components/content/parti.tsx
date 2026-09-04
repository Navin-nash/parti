"use client";

import * as React from "react";

/* ==========================================================================
   DIRECTION — "Dispatch Ledger"                    Relay · POST /v1/messages
   Same direction as src/arms/components/forms/parti.tsx. Forms and content
   are one system: a form field is a ledger record whose value has not been
   written yet; a log event is a ledger record that can no longer be edited.

   THESIS
   An engineer mid-integration is not reading a page, they are scanning a log.
   Relay's own artifacts are ledger lines — timestamp, key, value, status — so
   the documentation is set as the ledger itself rather than as an article
   about one.

   AXES
     Density         dense — 13px mono body, 4px base, records ruled not boxed.
     Structure       grid-strict — three tracks everywhere, no exceptions:
                     [status rail 3px] [key gutter 148px] [value 1fr]. You find
                     one parameter or one error code by scanning one column.
     Type voice      mono-technical — JetBrains Mono, loaded; the face of the
                     terminal in the next window. Prose is the exception and is
                     set in the system grotesque at lower presence than the keys.
     Chroma          achromatic + status ink only. Amber / green / red mean
                     queued / delivered / failed and nothing else, so a 429 is
                     the loudest thing on the screen it appears on.
     Motion posture  responsive-only, one ambient exception: an in-flight
                     record's rail marches, because work really is in progress.
     Depth           flat — zero shadows. Elevation is rule weight (1px hairline
                     → 2px rule → 3px rail) and ground value.

   SIGNATURE
     The gutter rail. Every record — nav item, table row, log event, error code
     — carries a 3px left rail whose *pattern* as well as its colour states the
     record's condition: hollow = idle, solid ink = current, marching dash =
     in flight, static dash = inactive, solid amber/green/red = queued /
     delivered / failed. The pattern carries the state without hue, so the
     signature element doubles as the grayscale-safe state channel.

   GIVES UP
     Warmth, imagery, cards, and comfortable long-form reading. A conceptual
     tutorial would read worse here than in the baseline; a parameter lookup
     reads better. That is the trade this subject asks for.

   MEASURED CONTRAST (scripts/color.py, not asserted)
     light  ink/ground 16.01 · ink-2/ground 7.68 · ink-3/ground 5.14
            fail/ground 6.84 · fail/field 7.74 · queued/ground 6.12
            ok/ground 6.21 · edge/ground 4.18 · inverted ink 16.01
     dark   ink/ground 15.95 · ink-2/ground 8.69 · ink-3/ground 6.13
            fail/field 7.89 · queued/field 9.11 · ok/field 8.32 · edge 4.42
   ========================================================================== */

const P = {
  "--p-ground": "#F1F1EE",
  "--p-ground-d": "#0E1013",
  "--p-field": "#FFFFFF",
  "--p-field-d": "#171A1E",
  "--p-ink": "#14161A",
  "--p-ink-d": "#E9EBEE",
  "--p-ink-2": "#454C54",
  "--p-ink-2-d": "#A8B0B9",
  "--p-ink-3": "#5F666E",
  "--p-ink-3-d": "#8B939C",
  "--p-rule": "#D9D9D2",
  "--p-rule-d": "#262A2F",
  "--p-edge": "#6E747A",
  "--p-edge-d": "#79818A",
  "--p-queued": "#7A5200",
  "--p-queued-d": "#E5B44A",
  "--p-ok": "#0B6640",
  "--p-ok-d": "#58C793",
  "--p-fail": "#A02016",
  "--p-fail-d": "#FF8F80",
  "--p-s-1": "4px",
  "--p-s-2": "8px",
  "--p-s-3": "12px",
  "--p-s-4": "16px",
  "--p-s-5": "24px",
  "--p-s-6": "32px",
  "--p-gutter": "148px",
  "--p-rail": "3px",
  "--p-t-key": "11px",
  "--p-t-caption": "12px",
  "--p-t-body": "13px",
  "--p-t-h2": "18px",
  "--p-t-h1": "26px",
  "--p-d-1": "90ms",
  "--p-d-2": "160ms",
  "--p-ease": "cubic-bezier(0.2, 0, 0, 1)",
  "--p-mono":
    "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
  "--p-sans": "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif",
  fontFamily: "var(--p-mono)",
} as React.CSSProperties;

const CSS = `
[data-arm="parti-content"] [data-p-rail="queued"]{background-color:transparent;background-image:repeating-linear-gradient(to bottom,currentColor 0 4px,transparent 4px 8px);animation:p-march 900ms linear infinite}
[data-arm="parti-content"] [data-p-rail="off"]{background-color:transparent;background-image:repeating-linear-gradient(to bottom,currentColor 0 2px,transparent 2px 6px)}
@keyframes p-march{to{background-position:0 -8px}}
@media (prefers-reduced-motion: reduce){
  [data-arm="parti-content"] *{animation-duration:1ms!important;animation-iteration-count:1!important;transition-duration:1ms!important}
}`;

type RailState = "idle" | "active" | "queued" | "ok" | "error" | "off";

const RAIL_TONE: Record<RailState, string> = {
  idle: "text-[var(--p-rule)] dark:text-[var(--p-rule-d)]",
  active: "text-[var(--p-ink)] dark:text-[var(--p-ink-d)]",
  queued: "text-[var(--p-queued)] dark:text-[var(--p-queued-d)]",
  ok: "text-[var(--p-ok)] dark:text-[var(--p-ok-d)]",
  error: "text-[var(--p-fail)] dark:text-[var(--p-fail-d)]",
  off: "text-[var(--p-edge)] dark:text-[var(--p-edge-d)]",
};

const inkC = "text-[var(--p-ink)] dark:text-[var(--p-ink-d)]";
const ink2C = "text-[var(--p-ink-2)] dark:text-[var(--p-ink-2-d)]";
const ink3C = "text-[var(--p-ink-3)] dark:text-[var(--p-ink-3-d)]";
const failC = "text-[var(--p-fail)] dark:text-[var(--p-fail-d)]";
const okC = "text-[var(--p-ok)] dark:text-[var(--p-ok-d)]";
const queuedC = "text-[var(--p-queued)] dark:text-[var(--p-queued-d)]";
const ruleB = "border-[var(--p-rule)] dark:border-[var(--p-rule-d)]";
const edgeB = "border-[var(--p-edge)] dark:border-[var(--p-edge-d)]";
const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--p-ink)] dark:focus-visible:outline-[var(--p-ink-d)]";

const keyCls = `text-[length:var(--p-t-key)] uppercase tracking-[0.09em] ${ink2C}`;
const noteCls = `text-[length:var(--p-t-caption)] leading-[1.5] ${ink3C}`;

function Sheet({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-arm="parti-content"
      style={P}
      className={`w-full border-t-2 border-[var(--p-ink)] bg-[var(--p-ground)] px-[var(--p-s-5)] pb-[var(--p-s-5)] pt-[var(--p-s-4)] dark:border-[var(--p-ink-d)] dark:bg-[var(--p-ground-d)] ${inkC}`}
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap"
      />
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      {children}
    </div>
  );
}

function Rec({
  rail,
  name,
  meta,
  children,
}: {
  rail: RailState;
  name: string;
  meta?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`grid items-stretch gap-x-[var(--p-s-4)] border-b py-[var(--p-s-3)] ${ruleB}`}
      style={{ gridTemplateColumns: "var(--p-rail) var(--p-gutter) minmax(0,1fr)" }}
    >
      <span aria-hidden data-p-rail={rail} className={`bg-current ${RAIL_TONE[rail]}`} />
      <div className="pt-[2px]">
        <p className={keyCls}>{name}</p>
        {meta ? (
          <p className={`mt-[var(--p-s-1)] text-[length:var(--p-t-key)] ${ink3C}`}>{meta}</p>
        ) : null}
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

export function ArticleHeaderParti() {
  return (
    <Sheet>
      <div
        className={`grid gap-x-[var(--p-s-4)] border-b pb-[var(--p-s-4)] ${ruleB}`}
        style={{ gridTemplateColumns: "var(--p-rail) var(--p-gutter) minmax(0,1fr)" }}
      >
        <span aria-hidden data-p-rail="ok" className={`bg-current ${RAIL_TONE.ok}`} />
        <p className={`${keyCls} pt-[10px]`}>method · post</p>
        <div className="min-w-0">
          <h1 className="text-[length:var(--p-t-h1)] font-medium leading-[1.15] tracking-[-0.01em]">
            /v1/messages
          </h1>
          <p
            className={`mt-[var(--p-s-3)] max-w-[62ch] text-[length:var(--p-t-body)] leading-[1.65] ${ink2C}`}
            style={{ fontFamily: "var(--p-sans)" }}
          >
            Enqueues a message for delivery on a verified channel. The call returns as soon as the
            message is accepted into the queue — delivery is reported afterwards through webhooks
            and the receipts endpoint, never in this response.
          </p>
        </div>
      </div>

      <Rec rail="idle" name="returns">
        <p className="text-[length:var(--p-t-body)]">
          <span className={okC}>202 accepted</span> · message.status = queued
        </p>
      </Rec>
      <Rec rail="idle" name="rate limit">
        <p className="text-[length:var(--p-t-body)]">100 req/s per key · burst 200</p>
      </Rec>
      <Rec rail="idle" name="idempotent">
        <p className="text-[length:var(--p-t-body)]">yes — 24h replay window on idempotency_key</p>
      </Rec>
      <Rec rail="idle" name="revised" meta="api 2026-05-14">
        <div className="flex flex-wrap items-baseline justify-between gap-[var(--p-s-3)]">
          <p className="text-[length:var(--p-t-body)]">2026-08-12 · retry_policy=linear added</p>
          <a
            href="#"
            className={`text-[length:var(--p-t-key)] uppercase tracking-[0.09em] underline underline-offset-4 ${ink2C} ${focusRing}`}
          >
            edit this page
          </a>
        </div>
      </Rec>
    </Sheet>
  );
}

const NAV: { group: string; items: { label: string; state: RailState; note?: string }[] }[] = [
  {
    group: "start",
    items: [
      { label: "quickstart", state: "idle" },
      { label: "authentication", state: "idle" },
      { label: "channels & verification", state: "idle" },
    ],
  },
  {
    group: "messages",
    items: [
      { label: "POST /v1/messages", state: "active", note: "you are here" },
      { label: "GET /v1/messages/:id", state: "idle" },
      { label: "GET /v1/messages/:id/receipts", state: "idle" },
      { label: "POST /v1/messages/:id/cancel", state: "off", note: "beta · allowlist only" },
    ],
  },
  {
    group: "reliability",
    items: [
      { label: "idempotency", state: "idle" },
      { label: "retry policies", state: "idle" },
      { label: "rate limits", state: "idle" },
      { label: "error codes", state: "idle" },
    ],
  },
];

export function DocsNavParti() {
  const [q, setQ] = React.useState("");
  const id = React.useId();
  const groups = NAV.map((g) => ({
    ...g,
    items: g.items.filter((i) => i.label.toLowerCase().includes(q.trim().toLowerCase())),
  })).filter((g) => g.items.length > 0);
  const count = groups.reduce((n, g) => n + g.items.length, 0);

  return (
    <Sheet>
      <div className={`mb-[var(--p-s-3)] border-b pb-[var(--p-s-2)] ${ruleB}`}>
        <label htmlFor={`${id}-q`} className={keyCls}>
          filter · {count} of 11 records
        </label>
        <input
          id={`${id}-q`}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="messages"
          className={`mt-[var(--p-s-1)] w-full max-w-[320px] appearance-none rounded-none border-0 border-b bg-transparent px-0 pb-[5px] text-[length:var(--p-t-body)] outline-none ${inkC} ${edgeB} placeholder:text-[var(--p-ink-3)] dark:placeholder:text-[var(--p-ink-3-d)] focus:border-b-2 focus:pb-[4px] focus:border-[var(--p-ink)] dark:focus:border-[var(--p-ink-d)]`}
        />
      </div>

      <nav aria-label="Relay documentation" className="max-w-[420px]">
        {count === 0 ? (
          <p className={`py-[var(--p-s-4)] text-[length:var(--p-t-body)] ${ink3C}`}>
            no records match &ldquo;{q}&rdquo; — 11 pages indexed
          </p>
        ) : null}
        {groups.map((g) => (
          <div key={g.group} className="mb-[var(--p-s-4)]">
            <p className={`${keyCls} mb-[var(--p-s-2)]`}>{g.group}</p>
            <ul>
              {g.items.map((i) => (
                <li key={i.label} className="flex items-stretch gap-[var(--p-s-3)]">
                  <span
                    aria-hidden
                    data-p-rail={i.state}
                    className={`w-[var(--p-rail)] shrink-0 bg-current ${RAIL_TONE[i.state]}`}
                  />
                  <a
                    href="#"
                    aria-current={i.state === "active" ? "page" : undefined}
                    className={`flex w-full flex-wrap items-baseline justify-between gap-[var(--p-s-2)] border-b py-[var(--p-s-2)] text-[length:var(--p-t-body)] ${ruleB} ${
                      i.state === "active" ? `font-medium ${inkC}` : i.state === "off" ? ink3C : ink2C
                    } transition-colors duration-[var(--p-d-1)] ease-[var(--p-ease)] hover:text-[var(--p-ink)] dark:hover:text-[var(--p-ink-d)] ${focusRing}`}
                  >
                    <span className="truncate">{i.label}</span>
                    {i.note ? (
                      <span className={`shrink-0 text-[length:var(--p-t-key)] ${ink3C}`}>
                        {i.note}
                      </span>
                    ) : null}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </Sheet>
  );
}

const REQ: Record<string, string> = {
  curl: `curl https://api.relay.dev/v1/messages \\
  -H "Authorization: Bearer $RELAY_KEY" \\
  -H "Idempotency-Key: evt_9f31c0_retry" \\
  -d channel=ch_live_sms_us \\
  -d deliver_at=2026-09-04T09:30:00Z \\
  -d retry_policy=exponential \\
  --data-urlencode 'payload={"to":"+15125550142","body":"Your code is 481920"}'`,
  node: `const message = await relay.messages.create({
  channel: "ch_live_sms_us",
  payload: { to: "+15125550142", body: "Your code is 481920" },
  idempotency_key: "evt_9f31c0_retry",
  deliver_at: "2026-09-04T09:30:00Z",
  retry_policy: "exponential",
});`,
  python: `message = relay.messages.create(
    channel="ch_live_sms_us",
    payload={"to": "+15125550142", "body": "Your code is 481920"},
    idempotency_key="evt_9f31c0_retry",
    deliver_at="2026-09-04T09:30:00Z",
    retry_policy="exponential",
)`,
};

const RES = `202 Accepted
{
  "id": "msg_01J7QPZ4W8",
  "status": "queued",
  "channel": "ch_live_sms_us",
  "deliver_at": "2026-09-04T09:30:00Z",
  "attempts": 0
}`;

function Listing({ code, rail }: { code: string; rail: RailState }) {
  const lines = code.split("\n");
  return (
    <div className="flex items-stretch gap-[var(--p-s-3)]">
      <span aria-hidden data-p-rail={rail} className={`w-[var(--p-rail)] shrink-0 bg-current ${RAIL_TONE[rail]}`} />
      <pre aria-hidden className={`select-none text-[length:var(--p-t-caption)] leading-[1.7] ${ink3C}`}>
        {lines.map((_, i) => `${i + 1}`.padStart(2, "0")).join("\n")}
      </pre>
      <pre className="min-w-0 flex-1 overflow-x-auto text-[length:var(--p-t-caption)] leading-[1.7]">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function CodeBlockParti() {
  const [lang, setLang] = React.useState<keyof typeof REQ>("curl");
  const [copied, setCopied] = React.useState(false);
  const timer = React.useRef<number | undefined>(undefined);
  React.useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <Sheet>
      <div
        className={`mb-[var(--p-s-3)] flex flex-wrap items-center justify-between gap-[var(--p-s-3)] border-b pb-[var(--p-s-2)] ${ruleB}`}
      >
        <div role="tablist" aria-label="Language" className="flex gap-[var(--p-s-4)]">
          {(Object.keys(REQ) as (keyof typeof REQ)[]).map((k) => (
            <button
              key={k}
              role="tab"
              aria-selected={lang === k}
              onClick={() => setLang(k)}
              className={`border-b-2 pb-[4px] text-[length:var(--p-t-key)] uppercase tracking-[0.09em] transition-colors duration-[var(--p-d-1)] ease-[var(--p-ease)] ${focusRing} ${
                lang === k
                  ? `border-[var(--p-ink)] dark:border-[var(--p-ink-d)] ${inkC}`
                  : `border-transparent ${ink3C} hover:text-[var(--p-ink)] dark:hover:text-[var(--p-ink-d)]`
              }`}
            >
              {k}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => {
            window.clearTimeout(timer.current);
            setCopied(true);
            timer.current = window.setTimeout(() => setCopied(false), 1200);
          }}
          className={`text-[length:var(--p-t-key)] uppercase tracking-[0.09em] ${copied ? okC : ink2C} ${focusRing}`}
        >
          {copied ? "copied ✓" : "copy"}
        </button>
      </div>

      <Rec rail="active" name="request" meta={lang}>
        <Listing code={REQ[lang]} rail="active" />
      </Rec>
      <Rec rail="ok" name="response" meta="1.32s">
        <Listing code={RES} rail="ok" />
      </Rec>
      <p className={`mt-[var(--p-s-3)] ${noteCls}`}>
        The response is the accept receipt, not the delivery receipt. Poll
        /v1/messages/msg_01J7QPZ4W8/receipts or wait for the webhook.
      </p>
    </Sheet>
  );
}

const EVENTS: { t: string; status: string; rail: RailState; detail: string }[] = [
  {
    t: "09:30:00.104",
    status: "queued",
    rail: "idle",
    detail: "accepted · idempotency_key evt_9f31c0_retry · attempt 0/6",
  },
  {
    t: "09:30:00.812",
    status: "dispatched",
    rail: "idle",
    detail: "attempt 1/6 · gateway us-east-2",
  },
  {
    t: "09:30:02.005",
    status: "rate_limited",
    rail: "error",
    detail: "429 from carrier · rung 2 of the ladder scheduled at +4s",
  },
  {
    t: "09:30:06.118",
    status: "dispatched",
    rail: "queued",
    detail: "attempt 2/6 · gateway us-west-1 · in flight",
  },
  {
    t: "09:30:07.440",
    status: "delivered",
    rail: "ok",
    detail: "receipt rcpt_4b02de · carrier ref 8812-AC",
  },
];

export function TimelineParti() {
  const [step, setStep] = React.useState(EVENTS.length);
  const timer = React.useRef<number | undefined>(undefined);

  React.useEffect(() => () => window.clearTimeout(timer.current), []);

  React.useEffect(() => {
    if (step >= EVENTS.length) return;
    timer.current = window.setTimeout(() => setStep((s) => s + 1), 700);
    return () => window.clearTimeout(timer.current);
  }, [step]);

  const shown = EVENTS.slice(0, Math.max(step, 1));

  return (
    <Sheet>
      <div
        className={`mb-[var(--p-s-3)] flex flex-wrap items-baseline justify-between gap-[var(--p-s-3)] border-b pb-[var(--p-s-2)] ${ruleB}`}
      >
        <h2 className="text-[length:var(--p-t-body)] font-medium">msg_01J7QPZ4W8</h2>
        <div className="flex items-baseline gap-[var(--p-s-4)]">
          <p className={keyCls}>
            {shown.length} of {EVENTS.length} events
          </p>
          <button
            type="button"
            onClick={() => setStep(1)}
            className={`text-[length:var(--p-t-key)] uppercase tracking-[0.09em] underline underline-offset-4 ${ink2C} ${focusRing}`}
          >
            replay ladder
          </button>
        </div>
      </div>

      <ol>
        {shown.map((e) => (
          <li
            key={e.t}
            className={`grid items-stretch gap-x-[var(--p-s-4)] border-b py-[var(--p-s-3)] ${ruleB}`}
            style={{ gridTemplateColumns: "var(--p-rail) var(--p-gutter) minmax(0,1fr)" }}
          >
            <span aria-hidden data-p-rail={e.rail} className={`bg-current ${RAIL_TONE[e.rail]}`} />
            <p className={`pt-[2px] text-[length:var(--p-t-caption)] tabular-nums ${ink3C}`}>
              {e.t}
            </p>
            <div className="min-w-0">
              <p
                className={`text-[length:var(--p-t-body)] ${
                  e.rail === "ok" ? okC : e.rail === "error" ? failC : e.rail === "queued" ? queuedC : inkC
                }`}
              >
                {e.status}
              </p>
              <p className={`mt-[var(--p-s-1)] ${noteCls}`}>{e.detail}</p>
            </div>
          </li>
        ))}
      </ol>
      {shown.length < EVENTS.length ? (
        <p className={`mt-[var(--p-s-3)] ${noteCls} ${queuedC}`}>waiting on the carrier…</p>
      ) : (
        <p className={`mt-[var(--p-s-3)] ${noteCls}`}>
          total 1.32s across 2 attempts · 1 rung of the retry ladder consumed
        </p>
      )}
    </Sheet>
  );
}

const ROWS: { p: string; type: string; req: boolean; def: string; note: string }[] = [
  {
    p: "channel",
    type: "string",
    req: true,
    def: "—",
    note: "Verified channel ID. 422 channel_unverified if the sender is not verified.",
  },
  { p: "payload", type: "object", req: true, def: "—", note: "Channel-specific body. Max 64 KB." },
  {
    p: "idempotency_key",
    type: "string",
    req: false,
    def: "null",
    note: "Replays the first response for 24h. 409 duplicate_idempotency_key on a body mismatch.",
  },
  {
    p: "deliver_at",
    type: "timestamp",
    req: false,
    def: "now",
    note: "RFC 3339, up to 30 days out.",
  },
  {
    p: "retry_policy",
    type: "enum",
    req: false,
    def: "exponential",
    note: "exponential · linear · none. none is rejected above 100 msg/s.",
  },
];

export function ComparisonTableParti() {
  return (
    <Sheet>
      <p className={`mb-[var(--p-s-3)] border-b pb-[var(--p-s-2)] ${ruleB} ${keyCls}`}>
        body parameters · 2 required of 5
      </p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px] border-collapse text-left text-[length:var(--p-t-body)]">
          <caption className="sr-only">Body parameters for POST /v1/messages</caption>
          <thead>
            <tr className={`border-b ${edgeB}`}>
              <th scope="col" className={`w-[3px] p-0`}>
                <span className="sr-only">state</span>
              </th>
              <th scope="col" className={`py-[var(--p-s-2)] pl-[var(--p-s-3)] ${keyCls}`}>
                parameter
              </th>
              <th scope="col" className={`py-[var(--p-s-2)] ${keyCls}`}>
                type
              </th>
              <th scope="col" className={`py-[var(--p-s-2)] ${keyCls}`}>
                default
              </th>
              <th scope="col" className={`py-[var(--p-s-2)] ${keyCls}`}>
                notes
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.p} className={`border-b align-top ${ruleB}`}>
                <td className="p-0">
                  <span
                    aria-hidden
                    data-p-rail={r.req ? "active" : "idle"}
                    className={`block h-full w-[var(--p-rail)] bg-current ${
                      r.req ? RAIL_TONE.active : RAIL_TONE.idle
                    }`}
                  />
                </td>
                <td className="py-[var(--p-s-3)] pl-[var(--p-s-3)] pr-[var(--p-s-4)] whitespace-nowrap">
                  {r.p}
                  {r.req ? (
                    <span className={`ml-[var(--p-s-2)] text-[length:var(--p-t-key)] ${failC}`}>
                      required
                    </span>
                  ) : null}
                </td>
                <td className={`py-[var(--p-s-3)] pr-[var(--p-s-4)] ${ink2C}`}>{r.type}</td>
                <td className={`py-[var(--p-s-3)] pr-[var(--p-s-4)] ${ink2C}`}>{r.def}</td>
                <td className={`py-[var(--p-s-3)] ${ink2C}`}>{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className={`mt-[var(--p-s-3)] ${noteCls}`}>
        A solid rail marks a required parameter; the requirement is also written in the row, so the
        table survives grayscale.
      </p>
    </Sheet>
  );
}

const ERRORS = [
  {
    code: "429",
    slug: "rate_limited",
    when: "Sustained above 100 req/s on this key.",
    fix: "Back off for the seconds in Retry-After, then resend the same idempotency_key.",
  },
  {
    code: "409",
    slug: "duplicate_idempotency_key",
    when: "Same key inside 24h with a different body.",
    fix: "Change the key, or resend the identical body to get the original response back.",
  },
  {
    code: "422",
    slug: "channel_unverified",
    when: "The channel exists but its sender is not verified.",
    fix: "Verify the sender in Channels, then resend. Verification is not retried automatically.",
  },
];

export function MetadataParti() {
  const [open, setOpen] = React.useState<string | null>("429");
  return (
    <Sheet>
      <p className={`mb-[var(--p-s-3)] border-b pb-[var(--p-s-2)] ${ruleB} ${keyCls}`}>
        error codes · 3 documented
      </p>
      {ERRORS.map((e) => {
        const isOpen = open === e.code;
        return (
          <div
            key={e.code}
            className={`grid items-stretch gap-x-[var(--p-s-4)] border-b ${ruleB}`}
            style={{ gridTemplateColumns: "var(--p-rail) var(--p-gutter) minmax(0,1fr)" }}
          >
            <span aria-hidden data-p-rail="error" className={`bg-current ${RAIL_TONE.error}`} />
            <p className={`py-[var(--p-s-3)] text-[length:var(--p-t-body)] ${failC}`}>{e.code}</p>
            <div className="min-w-0">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : e.code)}
                className={`flex w-full items-baseline justify-between gap-[var(--p-s-3)] py-[var(--p-s-3)] text-left text-[length:var(--p-t-body)] ${focusRing}`}
              >
                <span>{e.slug}</span>
                <span className={`text-[length:var(--p-t-key)] uppercase ${ink3C}`}>
                  {isOpen ? "hide" : "how to fix"}
                </span>
              </button>
              {isOpen ? (
                <div className="pb-[var(--p-s-3)]">
                  <p className={noteCls}>
                    <span className={ink2C}>when: </span>
                    {e.when}
                  </p>
                  <p className={`mt-[var(--p-s-1)] ${noteCls}`}>
                    <span className={ink2C}>fix: </span>
                    {e.fix}
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
      <div className="mt-[var(--p-s-4)] grid grid-cols-2 gap-[var(--p-s-4)] sm:grid-cols-4">
        {[
          ["method", "POST"],
          ["auth", "Bearer key"],
          ["rate limit", "100 req/s"],
          ["idempotent", "24h window"],
        ].map(([k, v]) => (
          <div key={k} className={`border-t pt-[var(--p-s-2)] ${edgeB}`}>
            <p className={keyCls}>{k}</p>
            <p className="mt-[var(--p-s-1)] text-[length:var(--p-t-body)]">{v}</p>
          </div>
        ))}
      </div>
    </Sheet>
  );
}

export function BreadcrumbsParti() {
  const trail = [
    { label: "relay", href: "#" },
    { label: "api", href: "#" },
    { label: "messages", href: "#" },
    { label: "POST /v1/messages", href: "#", current: true },
  ];
  return (
    <Sheet>
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-stretch">
          {trail.map((c, i) => (
            <li key={c.label} className="flex items-stretch">
              {i > 0 ? (
                <span aria-hidden className={`self-center px-[var(--p-s-2)] ${ink3C}`}>
                  /
                </span>
              ) : null}
              <span
                aria-hidden
                data-p-rail={c.current ? "active" : "idle"}
                className={`w-[var(--p-rail)] bg-current ${
                  c.current ? RAIL_TONE.active : RAIL_TONE.idle
                }`}
              />
              {c.current ? (
                <span
                  aria-current="page"
                  className={`pl-[var(--p-s-2)] text-[length:var(--p-t-body)] font-medium ${inkC}`}
                >
                  {c.label}
                </span>
              ) : (
                <a
                  href={c.href}
                  className={`pl-[var(--p-s-2)] text-[length:var(--p-t-body)] ${ink2C} transition-colors duration-[var(--p-d-1)] ease-[var(--p-ease)] hover:text-[var(--p-ink)] dark:hover:text-[var(--p-ink-d)] ${focusRing}`}
                >
                  {c.label}
                </a>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <p className={`mt-[var(--p-s-3)] border-t pt-[var(--p-s-2)] ${ruleB} ${noteCls}`}>
        4 of 11 records · reached from search for &ldquo;idempotency_key&rdquo;
      </p>
    </Sheet>
  );
}
