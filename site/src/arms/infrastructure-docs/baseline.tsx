"use client";

import { useMemo, useState } from "react";
import {
  Check,
  ChevronRight,
  CircleAlert,
  Copy,
  ExternalLink,
  Hash,
  Search,
  Terminal,
} from "@/lib/icons";

const NAV_GROUPS = [
  {
    group: "Getting started",
    items: ["Introduction", "Quickstart", "Authentication", "Channels"],
  },
  {
    group: "Messages",
    items: [
      "Create a message",
      "Retrieve a message",
      "List messages",
      "Cancel a scheduled message",
    ],
  },
  {
    group: "Delivery",
    items: ["Idempotency", "Retry policies", "Webhooks", "Rate limits"],
  },
  { group: "Reference", items: ["Errors", "Changelog"] },
];

const PARAMETERS = [
  {
    name: "channel",
    type: "string",
    required: true,
    description:
      "ID of a verified channel to deliver through, e.g. ch_9f2ab. The channel determines transport and sender identity.",
  },
  {
    name: "payload",
    type: "object",
    required: false,
    description:
      "Body of the message. Max 256 KB serialized. Keys are passed to the channel template unmodified.",
  },
  {
    name: "idempotency_key",
    type: "string",
    required: false,
    description:
      "Client-generated key, max 128 chars. Replaying the same key within 24h returns the original message instead of sending again.",
  },
  {
    name: "deliver_at",
    type: "string (RFC 3339)",
    required: false,
    description:
      "Schedule delivery for a future timestamp, up to 30 days out. Omit to deliver immediately.",
  },
  {
    name: "retry_policy",
    type: "object",
    required: false,
    description:
      "Overrides the channel default. Fields: max_attempts (1-10), backoff (\"exponential\" | \"fixed\"), initial_delay_ms.",
  },
];

const ERRORS = [
  {
    status: "429",
    code: "rate_limited",
    description:
      "More than 100 requests/second on this channel. Back off using the Retry-After header; the request was not queued.",
  },
  {
    status: "409",
    code: "duplicate_idempotency_key",
    description:
      "The key was reused within 24h with a different request body. Change the key or send the identical body.",
  },
  {
    status: "422",
    code: "channel_unverified",
    description:
      "The channel exists but verification has not completed. Messages cannot be sent until DNS records propagate.",
  },
];

const SAMPLES: Record<"curl" | "typescript", string> = {
  curl: `curl https://api.relay.dev/v1/messages \\
  -H "Authorization: Bearer $RELAY_API_KEY" \\
  -H "Idempotency-Key: order-4471-shipped" \\
  -H "Content-Type: application/json" \\
  -d '{
    "channel": "ch_9f2ab",
    "payload": { "order_id": "4471", "eta": "2026-09-04" },
    "retry_policy": { "max_attempts": 5, "backoff": "exponential" }
  }'`,
  typescript: `import { Relay } from "@relay/node";

const relay = new Relay({ apiKey: process.env.RELAY_API_KEY! });

const message = await relay.messages.create({
  channel: "ch_9f2ab",
  payload: { order_id: "4471", eta: "2026-09-04" },
  idempotencyKey: "order-4471-shipped",
  retryPolicy: { maxAttempts: 5, backoff: "exponential" },
});

console.log(message.id, message.status); // msg_01J8... "queued"`,
};

const ON_THIS_PAGE = [
  "Request",
  "Parameters",
  "Response",
  "Errors",
  "Idempotency",
];

export function RelayDocsBaseline() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("Create a message");
  const [tab, setTab] = useState<"curl" | "typescript">("curl");
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return NAV_GROUPS;
    return NAV_GROUPS.map((g) => ({
      ...g,
      items: g.items.filter((i) => i.toLowerCase().includes(q)),
    })).filter((g) => g.items.length > 0);
  }, [query]);

  const copy = () => {
    void navigator.clipboard?.writeText(SAMPLES[tab]);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      data-arm="baseline"
      style={
        {
          "--b-accent": "#4f46e5",
          "--b-accent-dark": "#a5b4fc",
          "--b-accent-soft": "#eef2ff",
          "--b-accent-soft-dark": "rgba(99,102,241,0.16)",
          "--b-code-bg": "#0f172a",
          "--b-code-fg": "#e2e8f0",
          "--b-sidebar-w": "252px",
          "--b-content-max": "780px",
        } as React.CSSProperties
      }
      className="flex min-h-[720px] w-full bg-white font-sans text-[15px] leading-relaxed text-slate-700 antialiased dark:bg-slate-950 dark:text-slate-300"
    >
      {/* Sidebar */}
      <aside
        className="hidden shrink-0 border-r border-slate-200 bg-slate-50/60 px-4 py-6 lg:block dark:border-slate-800 dark:bg-slate-900/40"
        style={{ width: "var(--b-sidebar-w)" }}
      >
        <div className="mb-6 flex items-center gap-2 px-2">
          <span
            className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold text-white"
            style={{ background: "var(--b-accent)" }}
          >
            R
          </span>
          <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Relay API
          </span>
          <span className="ml-auto rounded-md bg-slate-200 px-1.5 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
            v1
          </span>
        </div>

        <label className="relative mb-5 block">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search docs"
            aria-label="Search documentation"
            className="w-full rounded-lg border border-slate-200 bg-white py-1.5 pr-10 pl-8 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-[var(--b-accent)] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-[var(--b-accent-dark)]"
          />
          <kbd className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 rounded border border-slate-200 px-1 text-[10px] text-slate-400 dark:border-slate-700">
            /
          </kbd>
        </label>

        <nav className="space-y-5">
          {filtered.map((group) => (
            <div key={group.group}>
              <p className="mb-1.5 px-2 text-[11px] font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-500">
                {group.group}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = item === active;
                  return (
                    <li key={item}>
                      <button
                        onClick={() => setActive(item)}
                        aria-current={isActive ? "page" : undefined}
                        className="w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors"
                        style={
                          isActive
                            ? { background: "var(--b-accent-soft)", color: "var(--b-accent)", fontWeight: 500 }
                            : undefined
                        }
                      >
                        <span className={isActive ? "dark:text-[var(--b-accent-dark)]" : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"}>
                          {item}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="px-2 text-sm text-slate-500">
              No pages match “{query}”.
            </p>
          )}
        </nav>
      </aside>

      {/* Main */}
      <div className="min-w-0 flex-1 px-6 py-8 sm:px-10">
        <div className="mx-auto flex gap-10" style={{ maxWidth: "1040px" }}>
          <main className="min-w-0 flex-1" style={{ maxWidth: "var(--b-content-max)" }}>
            <nav className="mb-4 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-500">
              <span>Messages</span>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-slate-700 dark:text-slate-300">Create a message</span>
            </nav>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Create a message
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-emerald-100 px-2 py-0.5 font-mono text-xs font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                POST
              </span>
              <code className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-sm text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                /v1/messages
              </code>
              <a
                href="#"
                className="ml-auto inline-flex items-center gap-1 text-sm text-[var(--b-accent)] hover:underline dark:text-[var(--b-accent-dark)]"
              >
                Open in API playground <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            <p className="mt-5 text-slate-600 dark:text-slate-400">
              Queues a message for delivery on a verified channel. The call returns as
              soon as the message is durably accepted — delivery happens asynchronously,
              and every attempt is reported on the <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[13px] dark:bg-slate-800">message.attempted</code> webhook.
            </p>

            {/* Request */}
            <h2 id="request" className="group mt-10 flex items-center gap-2 text-xl font-semibold text-slate-900 dark:text-slate-100">
              Request
              <Hash className="h-4 w-4 text-slate-300 opacity-0 group-hover:opacity-100 dark:text-slate-600" />
            </h2>

            <div className="mt-4 overflow-hidden rounded-lg border border-slate-200 shadow-sm dark:border-slate-800">
              <div className="flex items-center gap-1 border-b border-slate-200 bg-slate-50 px-2 py-1.5 dark:border-slate-800 dark:bg-slate-900">
                <Terminal className="mr-1 ml-1 h-3.5 w-3.5 text-slate-400" />
                {(["curl", "typescript"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className="rounded-md px-2.5 py-1 text-xs font-medium transition-colors"
                    style={
                      tab === t
                        ? { background: "var(--b-accent-soft)", color: "var(--b-accent)" }
                        : undefined
                    }
                  >
                    <span className={tab === t ? "dark:text-[var(--b-accent-dark)]" : "text-slate-500 dark:text-slate-400"}>
                      {t === "curl" ? "cURL" : "TypeScript"}
                    </span>
                  </button>
                ))}
                <button
                  onClick={copy}
                  className="ml-auto inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <pre
                className="overflow-x-auto p-4 font-mono text-[13px] leading-6"
                style={{ background: "var(--b-code-bg)", color: "var(--b-code-fg)" }}
              >
                <code>{SAMPLES[tab]}</code>
              </pre>
            </div>

            {/* Parameters */}
            <h2 id="parameters" className="mt-10 text-xl font-semibold text-slate-900 dark:text-slate-100">
              Parameters
            </h2>
            <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200 shadow-sm dark:border-slate-800">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-900">
                  <tr>
                    <th className="px-4 py-2.5 font-semibold text-slate-700 dark:text-slate-300">Name</th>
                    <th className="px-4 py-2.5 font-semibold text-slate-700 dark:text-slate-300">Type</th>
                    <th className="px-4 py-2.5 font-semibold text-slate-700 dark:text-slate-300">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {PARAMETERS.map((p) => (
                    <tr
                      key={p.name}
                      className="border-t border-slate-200 align-top dark:border-slate-800"
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <code className="font-mono text-[13px] font-medium text-slate-900 dark:text-slate-100">
                          {p.name}
                        </code>
                        {p.required && (
                          <span className="ml-2 rounded bg-rose-50 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-rose-600 uppercase dark:bg-rose-500/15 dark:text-rose-400">
                            required
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-mono text-[13px] whitespace-nowrap text-slate-500 dark:text-slate-400">
                        {p.type}
                      </td>
                      <td className="max-w-md px-4 py-3 text-slate-600 dark:text-slate-400">
                        {p.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Response */}
            <h2 id="response" className="mt-10 text-xl font-semibold text-slate-900 dark:text-slate-100">
              Response
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Returns <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[13px] dark:bg-slate-800">202 Accepted</code> with the message object.
            </p>
            <pre
              className="mt-4 overflow-x-auto rounded-lg p-4 font-mono text-[13px] leading-6 shadow-sm"
              style={{ background: "var(--b-code-bg)", color: "var(--b-code-fg)" }}
            >
              <code>{`{
  "id": "msg_01J8ZK4Q2R",
  "status": "queued",
  "channel": "ch_9f2ab",
  "attempts": 0,
  "deliver_at": null,
  "created_at": "2026-09-01T14:22:08Z"
}`}</code>
            </pre>

            {/* Errors */}
            <h2 id="errors" className="mt-10 text-xl font-semibold text-slate-900 dark:text-slate-100">
              Errors
            </h2>
            <div className="mt-4 space-y-3">
              {ERRORS.map((e) => (
                <div
                  key={e.code}
                  className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-amber-100 px-2 py-0.5 font-mono text-xs font-semibold text-amber-800 dark:bg-amber-500/15 dark:text-amber-400">
                      {e.status}
                    </span>
                    <code className="font-mono text-sm font-medium text-slate-900 dark:text-slate-100">
                      {e.code}
                    </code>
                  </div>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{e.description}</p>
                </div>
              ))}
            </div>

            {/* Idempotency callout */}
            <h2 id="idempotency" className="mt-10 text-xl font-semibold text-slate-900 dark:text-slate-100">
              Idempotency
            </h2>
            <div
              className="mt-4 flex gap-3 rounded-lg border border-slate-200 p-4 dark:border-slate-800"
              style={{ background: "var(--b-accent-soft)" }}
            >
              <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--b-accent)" }} />
              <p className="text-sm text-slate-700">
                Send <code className="rounded bg-white/70 px-1 py-0.5 font-mono text-[13px]">idempotency_key</code> on
                every retryable write. Keys are scoped per API key and expire after 24 hours;
                a replay returns the original <code className="rounded bg-white/70 px-1 py-0.5 font-mono text-[13px]">msg_</code> id
                with the same status it had when first accepted.
              </p>
            </div>

            <div className="mt-12 flex items-center justify-between border-t border-slate-200 pt-6 text-sm dark:border-slate-800">
              <span className="text-slate-500">Last updated 12 August 2026</span>
              <a href="#" className="text-[var(--b-accent)] hover:underline dark:text-[var(--b-accent-dark)]">
                Next: Retrieve a message →
              </a>
            </div>
          </main>

          <aside className="hidden w-48 shrink-0 xl:block">
            <p className="mb-2 text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
              On this page
            </p>
            <ul className="space-y-1.5 border-l border-slate-200 text-sm dark:border-slate-800">
              {ON_THIS_PAGE.map((h, i) => (
                <li key={h}>
                  <a
                    href={`#${h.toLowerCase()}`}
                    className="-ml-px block border-l-2 border-transparent pl-3 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                    style={i === 0 ? { borderColor: "var(--b-accent)", color: "var(--b-accent)" } : undefined}
                  >
                    {h}
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </div>
  );
}
