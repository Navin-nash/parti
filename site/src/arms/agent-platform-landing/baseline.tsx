"use client";

import * as React from "react";
import {
  ArrowRight,
  BookOpen,
  Braces,
  Check,
  Copy,
  Database,
  Gauge,
  Repeat,
  Server,
  Shield,
  Terminal,
} from "@/lib/icons";

const SAMPLES: Record<"typescript" | "python", { file: string; code: string }> = {
  typescript: {
    file: "agents/refund.ts",
    code: `import { agent, tool, retry } from "@cadence/runtime";
import { z } from "zod";

const lookupOrder = tool({
  name: "lookupOrder",
  input: z.object({ orderId: z.string() }),
  output: z.object({ total: z.number(), status: z.string() }),
  run: async ({ orderId }) => db.orders.get(orderId),
});

const issueRefund = tool({
  name: "issueRefund",
  input: z.object({ orderId: z.string(), amountCents: z.number().int() }),
  output: z.object({ refundId: z.string() }),
  run: async (a) => payments.refund(a.orderId, a.amountCents),
});

export const refund = agent({
  name: "refund",
  tools: [lookupOrder, issueRefund],
  retry: retry.exponential({ attempts: 5, base: "2s", max: "5m" }),
});

// every run is durable and addressable
const run = await refund.start({ orderId: "ord_9f2ac1" });
const replay = await run.replay({ from: "step:3" });`,
  },
  python: {
    file: "agents/refund.py",
    code: `from cadence import agent, tool, retry
from pydantic import BaseModel

class OrderRef(BaseModel):
    order_id: str

@tool(input=OrderRef)
async def lookup_order(order_id: str) -> dict:
    return await db.orders.get(order_id)

@tool
async def issue_refund(order_id: str, amount_cents: int) -> dict:
    return await payments.refund(order_id, amount_cents)

refund = agent(
    name="refund",
    tools=[lookup_order, issue_refund],
    retry=retry.exponential(attempts=5, base="2s", max="5m"),
)

run = await refund.start(order_id="ord_9f2ac1")
replay = await run.replay(start="step:3")`,
  },
};

const CAPABILITIES = [
  {
    icon: Shield,
    title: "Durable execution",
    body: "Every step is checkpointed before it runs. A worker crash mid-tool-call resumes on another worker from the last committed step, not from the top of the conversation.",
  },
  {
    icon: Repeat,
    title: "Deterministic replay",
    body: "Runs are backed by an append-only event log. Replay a production failure locally against the exact tool responses it saw, with your new prompt or your new code.",
  },
  {
    icon: Braces,
    title: "Typed tool boundaries",
    body: "Tools declare input and output schemas. Malformed model output is rejected at the boundary and retried with the validation error, before it reaches your payment API.",
  },
  {
    icon: Gauge,
    title: "Per-step observability",
    body: "Token counts, latency, retry attempts and the exact arguments for each step. Filter runs by tool, error class, or duration without wiring a tracing backend.",
  },
];

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="max-h-[420px] overflow-auto p-4 text-[13px] leading-6 text-slate-100">
      <code className="font-mono">
        {code.split("\n").map((line, i) => (
          <div key={i} className="flex">
            <span className="w-8 shrink-0 pr-3 text-right text-slate-600 select-none tabular-nums">{i + 1}</span>
            <span className="whitespace-pre">{line}</span>
          </div>
        ))}
      </code>
    </pre>
  );
}

export function CadenceBaseline() {
  const [lang, setLang] = React.useState<"typescript" | "python">("typescript");
  const [copied, setCopied] = React.useState(false);

  const copy = () => {
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div
      data-arm="baseline"
      style={
        {
          "--b-accent": "#4f46e5",
          "--b-accent-hover": "#4338ca",
          "--b-accent-soft": "#e0e7ff",
          "--b-accent-ink": "#3730a3",
          "--b-code-bg": "#0f172a",
        } as React.CSSProperties
      }
      className="w-full bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100"
    >
      {/* Nav */}
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-3.5">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--b-accent)] text-sm font-bold text-white">
              C
            </div>
            <span className="font-semibold">Cadence</span>
          </div>
          <nav className="hidden gap-5 text-sm text-slate-600 md:flex dark:text-slate-400">
            {["Docs", "Runtime", "Pricing", "Changelog"].map((l) => (
              <a key={l} href="#" className="hover:text-slate-900 dark:hover:text-slate-100">
                {l}
              </a>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <a href="#" className="hidden text-sm text-slate-600 sm:block dark:text-slate-400">
              Sign in
            </a>
            <a
              href="#"
              className="rounded-lg bg-[var(--b-accent)] px-3 py-1.5 text-sm font-medium text-white hover:bg-[var(--b-accent-hover)]"
            >
              Start free
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-12">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--b-accent-soft)] px-3 py-1 text-xs font-medium text-[var(--b-accent-ink)]">
              v1.4 — replay from any step
            </span>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              A runtime for agents that have to stay up
            </h1>
            <p className="mt-4 max-w-lg text-lg text-slate-600 dark:text-slate-400">
              Cadence gives your agent durable execution, replayable runs, and typed tool boundaries. Your prototype
              already works; this is the part you would otherwise write twice.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-lg bg-[var(--b-accent)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--b-accent-hover)]"
              >
                Read the quickstart <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900"
              >
                <BookOpen className="h-4 w-4" /> Architecture docs
              </a>
            </div>
            <div className="mt-6 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-sm dark:border-slate-800 dark:bg-slate-900">
              <Terminal className="h-4 w-4 text-slate-400" />
              npm i @cadence/runtime
            </div>
          </div>

          {/* Code example */}
          <div className="overflow-hidden rounded-lg border border-slate-800 bg-[var(--b-code-bg)] shadow-sm">
            <div className="flex items-center gap-1 border-b border-slate-800 px-3 py-2">
              {(["typescript", "python"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium ${
                    lang === l ? "bg-slate-800 text-slate-100" : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {l === "typescript" ? "TypeScript" : "Python"}
                </button>
              ))}
              <span className="ml-2 font-mono text-xs text-slate-500">{SAMPLES[lang].file}</span>
              <button
                onClick={copy}
                className="ml-auto inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <CodeBlock code={SAMPLES[lang].code} />
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="border-t border-slate-200 bg-slate-50 py-16 dark:border-slate-800 dark:bg-slate-900/40">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-bold tracking-tight">What the runtime actually does</h2>
          <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-400">
            Four guarantees. Each one maps to a failure you have already hit: a timeout mid-tool-call, a bug you could
            not reproduce, a model returning a string where you needed cents, an incident with no per-step trace.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {CAPABILITIES.map((c) => (
              <div
                key={c.title}
                className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--b-accent-soft)] text-[var(--b-accent-ink)]">
                  <c.icon className="h-4.5 w-4.5" />
                </div>
                <h3 className="mt-3 font-semibold">{c.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-400">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-2xl font-bold tracking-tight">Architecture</h2>
        <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-400">
          Three components. The control plane schedules, workers execute your code in your VPC, and the event log is
          the source of truth for both.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            {
              icon: Server,
              title: "Control plane",
              body: "Schedules steps, enforces retry policy, and holds the run registry. Stateless — it never sees your tool payloads if you self-host workers.",
              meta: "Managed or self-hosted",
            },
            {
              icon: Terminal,
              title: "Worker pool",
              body: "Long-lived processes that pull steps, run your tool functions, and commit results. Scale horizontally; a worker dying is a normal event, not an incident.",
              meta: "Your VPC, your secrets",
            },
            {
              icon: Database,
              title: "Event log",
              body: "Append-only record of every step input, output, and retry. Replays read from here, so a replay is byte-identical to the original run.",
              meta: "Postgres-backed",
            },
          ].map((n, i) => (
            <div key={n.title} className="relative">
              <div className="h-full rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center gap-2.5">
                  <n.icon className="h-4.5 w-4.5 text-[var(--b-accent)]" />
                  <h3 className="font-semibold">{n.title}</h3>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{n.body}</p>
                <div className="mt-3 inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                  {n.meta}
                </div>
              </div>
              {i < 2 && (
                <ArrowRight className="absolute top-1/2 -right-3 hidden h-5 w-5 -translate-y-1/2 text-slate-300 md:block dark:text-slate-700" />
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4 font-mono text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          start → control plane assigns step:1 → worker runs lookupOrder → commit to event log → step:2 →
          worker crashes → control plane reassigns step:2 → commit → done
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center">
          <h2 className="text-2xl font-bold tracking-tight">Try it against the run that broke</h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-600 dark:text-slate-400">
            Import an existing agent, point it at a local worker, and replay a failed trace. If Cadence does not
            reproduce it deterministically, it is not the right tool and you have lost an afternoon.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--b-accent)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--b-accent-hover)]"
            >
              Start free <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#"
              className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900"
            >
              Read the migration guide
            </a>
          </div>
          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
            Apache-2.0 core · self-host the workers · no data leaves your VPC
          </p>
        </div>
      </section>
    </div>
  );
}
