"use client";

import * as React from "react";
import {
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Copy,
  GitBranch,
  Home,
  Search,
  X,
} from "@/lib/icons";

/* Relay docs - POST /v1/messages reference page. Baseline arm. */

const B = {
  "--b-accent": "#4f46e5",
  "--b-accent-hover": "#4338ca",
  "--b-accent-fg": "#ffffff",
  "--b-ring": "#6366f1",
  "--b-danger": "#dc2626",
  "--b-danger-d": "#f87171",
  "--b-radius": "0.5rem",
} as React.CSSProperties;

const shell =
  "w-full rounded-lg border border-slate-200 bg-white p-6 text-slate-900 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100";

const chip =
  "inline-flex items-center rounded-md px-2 py-0.5 font-mono text-xs font-semibold";

export function ArticleHeaderBaseline() {
  return (
    <div data-arm="baseline" style={B} className={shell}>
      <div className="mb-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <span>API reference</span>
        <ChevronRight className="size-3" aria-hidden />
        <span>Messages</span>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <span className={`${chip} bg-[var(--b-accent)] text-[var(--b-accent-fg)]`}>POST</span>
        <h1 className="font-mono text-2xl font-semibold tracking-tight">/v1/messages</h1>
      </div>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300">
        Enqueue a message for delivery on a verified channel. The call returns as soon as the
        message is accepted into the queue — delivery itself is reported through webhooks and the
        receipts endpoint.
      </p>
      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-slate-200 pt-4 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
        <span className="flex items-center gap-1.5">
          <Clock className="size-3.5" aria-hidden />
          Updated 12 Aug 2026
        </span>
        <span className="flex items-center gap-1.5">
          <GitBranch className="size-3.5" aria-hidden />
          API version 2026-05-14
        </span>
        <span>Idempotent · Rate limited at 100 req/s</span>
        <a
          href="#"
          className="ml-auto font-medium text-[var(--b-accent)] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--b-ring)]"
        >
          Edit this page
        </a>
      </div>
    </div>
  );
}

const NAV: { group: string; items: { label: string; href: string; active?: boolean }[] }[] = [
  {
    group: "Getting started",
    items: [
      { label: "Quickstart", href: "#" },
      { label: "Authentication", href: "#" },
      { label: "Channels & verification", href: "#" },
    ],
  },
  {
    group: "Messages",
    items: [
      { label: "POST /v1/messages", href: "#", active: true },
      { label: "GET /v1/messages/:id", href: "#" },
      { label: "GET /v1/messages/:id/receipts", href: "#" },
      { label: "POST /v1/messages/:id/cancel", href: "#" },
    ],
  },
  {
    group: "Reliability",
    items: [
      { label: "Idempotency", href: "#" },
      { label: "Retry policies", href: "#" },
      { label: "Rate limits", href: "#" },
      { label: "Error codes", href: "#" },
    ],
  },
];

export function DocsNavBaseline() {
  const [open, setOpen] = React.useState<Record<string, boolean>>({
    "Getting started": true,
    Messages: true,
    Reliability: true,
  });
  const [q, setQ] = React.useState("");
  const id = React.useId();

  const groups = NAV.map((g) => ({
    ...g,
    items: g.items.filter((i) => i.label.toLowerCase().includes(q.toLowerCase())),
  })).filter((g) => g.items.length > 0);

  return (
    <div data-arm="baseline" style={B} className={shell}>
      <div className="max-w-xs">
        <label htmlFor={`${id}-q`} className="sr-only">
          Search the docs
        </label>
        <div className="relative mb-5">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
            aria-hidden
          />
          <input
            id={`${id}-q`}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search endpoints"
            className="w-full rounded-[var(--b-radius)] border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm shadow-sm placeholder:text-slate-400 focus:border-[var(--b-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--b-ring)] dark:border-slate-700 dark:bg-slate-900"
          />
        </div>

        <nav aria-label="Docs">
          {groups.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No pages match &ldquo;{q}&rdquo;.
            </p>
          ) : null}
          {groups.map((g) => (
            <div key={g.group} className="mb-4">
              <button
                type="button"
                aria-expanded={open[g.group] !== false}
                onClick={() => setOpen((s) => ({ ...s, [g.group]: s[g.group] === false }))}
                className="mb-1.5 flex w-full items-center justify-between rounded px-2 py-1 text-xs font-semibold uppercase tracking-wider text-slate-500 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--b-ring)] dark:text-slate-400 dark:hover:bg-slate-900"
              >
                {g.group}
                <ChevronDown
                  className={`size-3.5 transition-transform ${open[g.group] === false ? "-rotate-90" : ""}`}
                  aria-hidden
                />
              </button>
              {open[g.group] !== false ? (
                <ul className="space-y-0.5 border-l border-slate-200 dark:border-slate-800">
                  {g.items.map((i) => (
                    <li key={i.label}>
                      <a
                        href={i.href}
                        aria-current={i.active ? "page" : undefined}
                        className={[
                          "-ml-px block border-l-2 py-1.5 pl-3 pr-2 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--b-ring)]",
                          i.active
                            ? "border-[var(--b-accent)] font-medium text-[var(--b-accent)]"
                            : "border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100",
                        ].join(" ")}
                      >
                        {i.label}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}

const SAMPLES: Record<string, string> = {
  cURL: `curl https://api.relay.dev/v1/messages \\
  -H "Authorization: Bearer $RELAY_KEY" \\
  -H "Idempotency-Key: evt_9f31c0_retry" \\
  -d channel=ch_live_sms_us \\
  -d deliver_at=2026-09-04T09:30:00Z \\
  -d retry_policy=exponential \\
  --data-urlencode 'payload={"to":"+15125550142","body":"Your code is 481920"}'`,
  Node: `const message = await relay.messages.create({
  channel: "ch_live_sms_us",
  payload: { to: "+15125550142", body: "Your code is 481920" },
  idempotency_key: "evt_9f31c0_retry",
  deliver_at: "2026-09-04T09:30:00Z",
  retry_policy: "exponential",
});

console.log(message.id, message.status); // msg_01J7QP  queued`,
  Python: `message = relay.messages.create(
    channel="ch_live_sms_us",
    payload={"to": "+15125550142", "body": "Your code is 481920"},
    idempotency_key="evt_9f31c0_retry",
    deliver_at="2026-09-04T09:30:00Z",
    retry_policy="exponential",
)

print(message.id, message.status)  # msg_01J7QP  queued`,
};

export function CodeBlockBaseline() {
  const [tab, setTab] = React.useState<keyof typeof SAMPLES>("cURL");
  const [copied, setCopied] = React.useState(false);

  return (
    <div data-arm="baseline" style={B} className={shell}>
      <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-2 dark:border-slate-800 dark:bg-slate-900">
          <div role="tablist" aria-label="Language" className="flex">
            {Object.keys(SAMPLES).map((k) => (
              <button
                key={k}
                role="tab"
                aria-selected={tab === k}
                onClick={() => setTab(k as keyof typeof SAMPLES)}
                className={[
                  "border-b-2 px-3 py-2 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--b-ring)]",
                  tab === k
                    ? "border-[var(--b-accent)] text-[var(--b-accent)]"
                    : "border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100",
                ].join(" ")}
              >
                {k}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              setCopied(true);
              window.setTimeout(() => setCopied(false), 1200);
            }}
            className="mr-1 flex items-center gap-1.5 rounded px-2 py-1 text-xs text-slate-500 hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--b-ring)] dark:text-slate-400 dark:hover:bg-slate-800"
          >
            {copied ? <Check className="size-3.5" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <pre className="overflow-x-auto bg-slate-900 p-4 text-xs leading-relaxed text-slate-100">
          <code>{SAMPLES[tab]}</code>
        </pre>
      </div>
      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
        Returns <code className="font-mono">202 Accepted</code> with the message in{" "}
        <code className="font-mono">queued</code> status.
      </p>
    </div>
  );
}

const EVENTS = [
  {
    t: "09:30:00.104Z",
    status: "queued",
    detail: "Accepted with idempotency_key evt_9f31c0_retry",
    tone: "neutral" as const,
  },
  {
    t: "09:30:00.812Z",
    status: "dispatched",
    detail: "Attempt 1 handed to carrier gateway us-east",
    tone: "neutral" as const,
  },
  {
    t: "09:30:02.005Z",
    status: "rate_limited",
    detail: "429 rate_limited from carrier — retry scheduled in 4s",
    tone: "warn" as const,
  },
  {
    t: "09:30:06.118Z",
    status: "dispatched",
    detail: "Attempt 2 handed to carrier gateway us-west",
    tone: "neutral" as const,
  },
  {
    t: "09:30:07.440Z",
    status: "delivered",
    detail: "Receipt rcpt_4b02de recorded",
    tone: "good" as const,
  },
];

export function TimelineBaseline() {
  return (
    <div data-arm="baseline" style={B} className={shell}>
      <h2 className="mb-1 text-base font-semibold tracking-tight">Delivery timeline</h2>
      <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">
        msg_01J7QPZ4W8 · channel ch_live_sms_us
      </p>
      <ol className="relative border-l border-slate-200 dark:border-slate-800">
        {EVENTS.map((e) => (
          <li key={e.t} className="mb-5 ml-5 last:mb-0">
            <span
              className={[
                "absolute -left-[5px] mt-1.5 size-2.5 rounded-full ring-4 ring-white dark:ring-slate-950",
                e.tone === "good"
                  ? "bg-emerald-500"
                  : e.tone === "warn"
                    ? "bg-amber-500"
                    : "bg-slate-400",
              ].join(" ")}
              aria-hidden
            />
            <div className="flex flex-wrap items-baseline gap-x-3">
              <span className="font-mono text-xs text-slate-500 dark:text-slate-400">{e.t}</span>
              <span className="text-sm font-medium">{e.status}</span>
            </div>
            <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-300">{e.detail}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

const ROWS = [
  {
    p: "channel",
    type: "string",
    req: true,
    note: "Verified channel ID. 422 channel_unverified if the sender is not verified.",
  },
  { p: "payload", type: "object", req: true, note: "Channel-specific body. Max 64 KB." },
  {
    p: "idempotency_key",
    type: "string",
    req: false,
    note: "Replays the original response for 24h. 409 duplicate_idempotency_key on conflict.",
  },
  {
    p: "deliver_at",
    type: "timestamp",
    req: false,
    note: "RFC 3339. Up to 30 days out. Omit to deliver now.",
  },
  {
    p: "retry_policy",
    type: "enum",
    req: false,
    note: "exponential | linear | none. Defaults to exponential.",
  },
];

export function ComparisonTableBaseline() {
  return (
    <div data-arm="baseline" style={B} className={shell}>
      <h2 className="mb-4 text-base font-semibold tracking-tight">Body parameters</h2>
      <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 text-left dark:bg-slate-900">
              <th className="px-4 py-2.5 font-medium text-slate-600 dark:text-slate-300">
                Parameter
              </th>
              <th className="px-4 py-2.5 font-medium text-slate-600 dark:text-slate-300">Type</th>
              <th className="px-4 py-2.5 font-medium text-slate-600 dark:text-slate-300">
                Required
              </th>
              <th className="px-4 py-2.5 font-medium text-slate-600 dark:text-slate-300">Notes</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr
                key={r.p}
                className="border-t border-slate-200 align-top dark:border-slate-800"
              >
                <td className="px-4 py-3 font-mono text-xs font-medium">{r.p}</td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{r.type}</td>
                <td className="px-4 py-3">
                  {r.req ? (
                    <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-[var(--b-accent)] dark:bg-indigo-950/50">
                      <Check className="size-3" aria-hidden /> yes
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                      <X className="size-3" aria-hidden /> no
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const ERRORS = [
  { code: "429", slug: "rate_limited", note: "Over 100 req/s. Retry after the Retry-After header." },
  {
    code: "409",
    slug: "duplicate_idempotency_key",
    note: "Same key, different body, within 24h.",
  },
  { code: "422", slug: "channel_unverified", note: "Channel exists but the sender is unverified." },
];

export function MetadataBaseline() {
  return (
    <div data-arm="baseline" style={B} className={shell}>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <dl className="space-y-3 text-sm sm:col-span-1">
          <div>
            <dt className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Method
            </dt>
            <dd className="mt-0.5 font-mono">POST</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Path
            </dt>
            <dd className="mt-0.5 font-mono text-xs">/v1/messages</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Rate limit
            </dt>
            <dd className="mt-0.5">100 req/s per key</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Idempotent
            </dt>
            <dd className="mt-0.5">Yes — 24h window</dd>
          </div>
        </dl>
        <div className="sm:col-span-2">
          <h3 className="mb-3 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Errors
          </h3>
          <ul className="space-y-2">
            {ERRORS.map((e) => (
              <li
                key={e.code}
                className="flex items-start gap-3 rounded-lg border border-slate-200 p-3 dark:border-slate-800"
              >
                <span
                  className={`${chip} bg-red-50 text-[var(--b-danger)] dark:bg-red-950/50 dark:text-[var(--b-danger-d)]`}
                >
                  {e.code}
                </span>
                <div className="min-w-0">
                  <p className="font-mono text-xs font-medium">{e.slug}</p>
                  <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-300">{e.note}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function BreadcrumbsBaseline() {
  const crumbs = [
    { label: "Docs", href: "#", icon: true },
    { label: "API reference", href: "#" },
    { label: "Messages", href: "#" },
    { label: "POST /v1/messages", href: "#", current: true },
  ];
  return (
    <div data-arm="baseline" style={B} className={shell}>
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm">
          {crumbs.map((c, i) => (
            <li key={c.label} className="flex items-center gap-1.5">
              {i > 0 ? (
                <ChevronRight className="size-3.5 text-slate-300 dark:text-slate-600" aria-hidden />
              ) : null}
              {c.current ? (
                <span aria-current="page" className="font-mono text-xs font-medium">
                  {c.label}
                </span>
              ) : (
                <a
                  href={c.href}
                  className="flex items-center gap-1.5 rounded text-slate-500 transition-colors hover:text-[var(--b-accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--b-ring)] dark:text-slate-400"
                >
                  {c.icon ? <Home className="size-3.5" aria-hidden /> : null}
                  {c.label}
                </a>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
