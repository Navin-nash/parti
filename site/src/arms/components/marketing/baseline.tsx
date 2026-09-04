"use client";

import * as React from "react";
import {
  Activity,
  ArrowRight,
  Check,
  ChevronDown,
  Clock,
  GitBranch,
  Layers,
  Menu,
  Minus,
  Quote,
  Repeat,
  Server,
  Shield,
  Star,
  Terminal,
  X,
  Zap,
} from "@/lib/icons";

/**
 * Cadence — marketing component group, baseline arm.
 * A runtime for building production AI agents: durable execution,
 * replayable runs, typed tool boundaries.
 *
 * Custom properties are prefixed --b-* and declared inline on each root.
 */

const BRAND = {
  "--b-brand": "#4f46e5",
  "--b-brand-hover": "#4338ca",
  "--b-brand-soft": "#eef2ff",
  "--b-brand-soft-dark": "#1e1b4b",
  "--b-ring": "#818cf8",
} as React.CSSProperties;

const NAV_LINKS = [
  { label: "Docs", href: "#docs" },
  { label: "Runtime", href: "#runtime" },
  { label: "Pricing", href: "#pricing" },
  { label: "Changelog", href: "#changelog" },
];

/* ------------------------------------------------------------------ */
/* Navigation                                                          */
/* ------------------------------------------------------------------ */

export function NavigationBarBaseline() {
  const [open, setOpen] = React.useState(false);

  return (
    <header
      data-arm="baseline"
      style={BRAND}
      className="w-full border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <a href="#top" className="flex items-center gap-2">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white"
              style={{ backgroundColor: "var(--b-brand)" }}
            >
              <Activity className="h-4 w-4" strokeWidth={2.5} />
            </span>
            <span className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              Cadence
            </span>
          </a>
          <nav className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href="#github"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
          >
            <GitBranch className="h-4 w-4" />
            <span className="tabular-nums">4.2k</span>
            <Star className="h-3.5 w-3.5 text-amber-500" fill="currentColor" />
          </a>
          <a
            href="#signin"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
          >
            Sign in
          </a>
          <a
            href="#start"
            className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium text-white shadow-sm transition-colors"
            style={{ backgroundColor: "var(--b-brand)" }}
          >
            Start building
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle navigation menu"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-700 md:hidden dark:border-slate-800 dark:text-slate-300"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-slate-200 px-6 py-4 md:hidden dark:border-slate-800">
          <nav className="flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#start"
              className="mt-2 inline-flex items-center justify-center rounded-lg px-3.5 py-2 text-sm font-medium text-white"
              style={{ backgroundColor: "var(--b-brand)" }}
            >
              Start building
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Announcement bar                                                    */
/* ------------------------------------------------------------------ */

export function AnnouncementBarBaseline() {
  const [visible, setVisible] = React.useState(true);
  if (!visible) return null;

  return (
    <div
      data-arm="baseline"
      style={BRAND}
      className="w-full text-white"
    >
      <div
        className="w-full"
        style={{ backgroundColor: "var(--b-brand)" }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-3 px-6 py-2.5 text-sm">
          <span className="rounded-md bg-white/15 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide">
            v0.9
          </span>
          <p className="text-center text-indigo-50">
            Deterministic replay is now generally available — replay any run
            against new code.
          </p>
          <a
            href="#changelog"
            className="inline-flex shrink-0 items-center gap-1 font-medium text-white underline underline-offset-4"
          >
            Read the notes
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
          <button
            type="button"
            onClick={() => setVisible(false)}
            aria-label="Dismiss announcement"
            className="ml-2 rounded-md p-1 text-indigo-100 transition-colors hover:bg-white/15"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

const HERO_CODE = `import { agent, tool, retry } from "@cadence/runtime";
import { z } from "zod";

const lookupOrder = tool({
  name: "lookupOrder",
  input: z.object({ orderId: z.string() }),
  output: z.object({ totalCents: z.number(), status: z.string() }),
  run: ({ orderId }) => db.orders.get(orderId),
});

const issueRefund = tool({
  name: "issueRefund",
  input: z.object({ orderId: z.string(), amountCents: z.number().int() }),
  output: z.object({ refundId: z.string() }),
  retry: retry.exponential({ attempts: 5, base: "2s", max: "1m" }),
  run: ({ orderId, amountCents }) =>
    payments.refund(orderId, amountCents, { idempotencyKey: orderId }),
});

export const refundAgent = agent({
  name: "refund",
  tools: [lookupOrder, issueRefund],
  policy: { maxSteps: 12, timeout: "10m" },
});

// Every step is journaled. Replay a failed run against new code.
const run = await refundAgent.start({ orderId: "ord_8123" });
const replay = await cadence.replay(run.id, { from: "issueRefund" });`;

export function HeroBaseline() {
  return (
    <section
      data-arm="baseline"
      style={BRAND}
      className="w-full bg-white dark:bg-slate-950"
    >
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <span
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium"
            style={{
              backgroundColor: "var(--b-brand-soft)",
              color: "var(--b-brand-hover)",
            }}
          >
            <Zap className="h-3.5 w-3.5" />
            Durable execution for agents
          </span>

          <h1 className="mt-6 text-5xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Your agent already works. It just
            <span style={{ color: "var(--b-brand)" }}> doesn&apos;t survive </span>
            production.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            Cadence is a runtime for long-running agents. Every step is
            journaled, so a process restart resumes where it stopped, a failed
            run can be replayed against fixed code, and every tool call crosses
            a typed boundary you control.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#start"
              className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors"
              style={{ backgroundColor: "var(--b-brand)" }}
            >
              Start building
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#docs"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
            >
              <Terminal className="h-4 w-4" />
              Read the docs
            </a>
          </div>

          <p className="mt-4 font-mono text-xs text-slate-500 dark:text-slate-500">
            npm i @cadence/runtime
          </p>
        </div>

        <div className="mt-14 overflow-hidden rounded-xl border border-slate-200 bg-slate-950 shadow-sm dark:border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
              <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
              <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
              <span className="ml-2 font-mono text-xs text-slate-400">
                agents/refund.ts
              </span>
            </div>
            <span className="rounded-md bg-slate-800 px-2 py-0.5 font-mono text-[11px] text-slate-400">
              TypeScript
            </span>
          </div>
          <pre className="overflow-x-auto px-5 py-4 font-mono text-[13px] leading-relaxed text-slate-300">
            <code>{HERO_CODE}</code>
          </pre>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Feature grid                                                        */
/* ------------------------------------------------------------------ */

const FEATURES = [
  {
    icon: Shield,
    title: "Durable execution",
    body: "Each step commits to the event log before the next one starts. A deploy, an OOM kill, or a node reschedule resumes from the last committed step instead of restarting the conversation.",
  },
  {
    icon: Repeat,
    title: "Deterministic replay",
    body: "Model output, tool results, and clock reads are all recorded. Replay a production run locally against a patched prompt and see exactly where the behaviour diverges.",
  },
  {
    icon: Layers,
    title: "Typed tool boundaries",
    body: "Tools declare input and output schemas. Malformed model arguments are rejected at the boundary and returned to the model as a typed error, not thrown into your handler.",
  },
  {
    icon: Clock,
    title: "Per-step observability",
    body: "Every step emits a span with token counts, latency, retry attempts, and the exact arguments the model produced. Export to OTLP or read it from the run API.",
  },
];

export function FeatureGridBaseline() {
  return (
    <section
      data-arm="baseline"
      style={BRAND}
      className="w-full bg-slate-50 dark:bg-slate-900"
    >
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Four guarantees, not a framework
          </h2>
          <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-400">
            Cadence does not own your prompts, your model choice, or your
            control flow. It owns what happens when a step fails.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950"
            >
              <span
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg"
                style={{
                  backgroundColor: "var(--b-brand-soft)",
                  color: "var(--b-brand)",
                }}
              >
                <feature.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-50">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {feature.body}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Architecture
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: Server,
                name: "Control plane",
                detail: "Schedules runs, holds policy, exposes the run API.",
              },
              {
                icon: Activity,
                name: "Worker pool",
                detail: "Executes steps. Stateless, horizontally scaled.",
              },
              {
                icon: Terminal,
                name: "Event log",
                detail: "Append-only journal. The source of truth for replay.",
              },
            ].map((node) => (
              <div
                key={node.name}
                className="rounded-lg border border-slate-200 p-4 dark:border-slate-800"
              >
                <node.icon
                  className="h-4 w-4"
                  style={{ color: "var(--b-brand)" }}
                />
                <p className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-100">
                  {node.name}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  {node.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Logo cloud                                                          */
/* ------------------------------------------------------------------ */

const ADOPTERS = [
  "Kettle",
  "Northsound",
  "Palisade Health",
  "Vantis",
  "Orbital Freight",
  "Meridian Labs",
];

export function LogoCloudBaseline() {
  return (
    <section
      data-arm="baseline"
      style={BRAND}
      className="w-full bg-white dark:bg-slate-950"
    >
      <div className="mx-auto max-w-6xl px-6 py-14">
        <p className="text-center text-sm font-medium text-slate-500 dark:text-slate-400">
          Teams running agents on Cadence
        </p>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {ADOPTERS.map((name) => (
            <div
              key={name}
              className="flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-4 py-5 dark:border-slate-800 dark:bg-slate-900"
            >
              <span className="text-sm font-semibold tracking-tight text-slate-500 dark:text-slate-400">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Testimonial                                                         */
/* ------------------------------------------------------------------ */

export function TestimonialBaseline() {
  return (
    <section
      data-arm="baseline"
      style={BRAND}
      className="w-full bg-slate-50 dark:bg-slate-900"
    >
      <div className="mx-auto max-w-3xl px-6 py-20">
        <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <Quote
            className="h-6 w-6"
            style={{ color: "var(--b-brand)" }}
            fill="currentColor"
          />
          <blockquote className="mt-5 text-xl leading-relaxed text-slate-800 dark:text-slate-200">
            &ldquo;We had a refund agent that worked fine until a deploy landed
            mid-run and left three customers in a half-refunded state. The part
            of Cadence we actually adopted it for is the event log — being able
            to replay the exact run that went wrong is worth more to us than
            anything on the model side.&rdquo;
          </blockquote>
          <figcaption className="mt-6 border-t border-slate-200 pt-5 text-sm dark:border-slate-800">
            <span className="font-medium text-slate-900 dark:text-slate-100">
              Staff engineer, payments infrastructure
            </span>
            <span className="block text-slate-500 dark:text-slate-400">
              Mid-size marketplace, ~40 engineers
            </span>
          </figcaption>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Pricing                                                             */
/* ------------------------------------------------------------------ */

const TIERS = [
  {
    name: "Developer",
    monthly: 0,
    annual: 0,
    tagline: "Local development and small side projects.",
    features: [
      "10,000 steps / month",
      "7-day event log retention",
      "Local replay CLI",
      "Community Discord",
    ],
    cta: "Start free",
    featured: false,
  },
  {
    name: "Team",
    monthly: 90,
    annual: 75,
    tagline: "Production agents with an on-call rotation behind them.",
    features: [
      "2M steps / month, then $0.40 per 1k",
      "90-day event log retention",
      "Hosted replay + run diffing",
      "OTLP export, SSO, audit log",
      "Email support, 1 business day",
    ],
    cta: "Start 14-day trial",
    featured: true,
  },
  {
    name: "Enterprise",
    monthly: null,
    annual: null,
    tagline: "Self-hosted control plane in your own VPC.",
    features: [
      "Unlimited steps",
      "Custom retention, BYO object store",
      "Self-hosted workers and control plane",
      "SOC 2 report, DPA, custom terms",
      "Shared Slack channel",
    ],
    cta: "Talk to us",
    featured: false,
  },
];

export function PricingBaseline() {
  const [annual, setAnnual] = React.useState(true);

  return (
    <section
      data-arm="baseline"
      style={BRAND}
      className="w-full bg-white dark:bg-slate-950"
    >
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Priced per step, not per seat
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-slate-600 dark:text-slate-400">
            A step is one journaled unit of work: a model call, a tool call, or
            a timer. Retries of the same step are not billed twice.
          </p>

          <div className="mt-8 inline-flex items-center gap-1 rounded-lg border border-slate-200 p-1 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setAnnual(false)}
              aria-pressed={!annual}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                !annual
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setAnnual(true)}
              aria-pressed={annual}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                annual
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              Annual
              <span className="ml-1.5 text-xs font-normal opacity-70">
                −17%
              </span>
            </button>
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {TIERS.map((tier) => {
            const price = annual ? tier.annual : tier.monthly;
            return (
              <div
                key={tier.name}
                className={`flex flex-col rounded-lg border bg-white p-6 shadow-sm dark:bg-slate-950 ${
                  tier.featured
                    ? "border-transparent ring-2"
                    : "border-slate-200 dark:border-slate-800"
                }`}
                style={
                  tier.featured
                    ? ({ ...BRAND, boxShadow: "0 0 0 2px var(--b-brand)" } as React.CSSProperties)
                    : undefined
                }
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
                    {tier.name}
                  </h3>
                  {tier.featured ? (
                    <span
                      className="rounded-full px-2 py-0.5 text-xs font-medium"
                      style={{
                        backgroundColor: "var(--b-brand-soft)",
                        color: "var(--b-brand-hover)",
                      }}
                    >
                      Most adopted
                    </span>
                  ) : null}
                </div>

                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  {tier.tagline}
                </p>

                <p className="mt-6 flex items-baseline gap-1">
                  {price === null ? (
                    <span className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                      Custom
                    </span>
                  ) : (
                    <>
                      <span className="text-4xl font-semibold tracking-tight tabular-nums text-slate-900 dark:text-slate-50">
                        ${price}
                      </span>
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        /month
                      </span>
                    </>
                  )}
                </p>

                <ul className="mt-6 flex-1 space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-2 text-sm">
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0"
                        style={{ color: "var(--b-brand)" }}
                      />
                      <span className="text-slate-700 dark:text-slate-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#start"
                  className={`mt-8 inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                    tier.featured
                      ? "text-white shadow-sm"
                      : "border border-slate-300 text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
                  }`}
                  style={
                    tier.featured
                      ? { backgroundColor: "var(--b-brand)" }
                      : undefined
                  }
                >
                  {tier.cta}
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* FAQ                                                                 */
/* ------------------------------------------------------------------ */

const FAQS = [
  {
    q: "Does Cadence lock me into a model provider?",
    a: "No. Cadence never calls a model for you — you pass a completion function and it journals the request and response. Swap providers between replays; the log records what was actually returned, not who returned it.",
  },
  {
    q: "How is this different from a workflow engine?",
    a: "The execution model is close to one, deliberately. What a general workflow engine does not give you is a typed tool boundary or a replay that reconciles non-deterministic model output against a recorded transcript.",
  },
  {
    q: "What happens when a tool is genuinely broken?",
    a: "The retry policy runs to exhaustion, then the step is marked failed and the run parks. It stays in the log indefinitely. When you have shipped a fix you resume from that step; earlier steps are not re-executed and side effects are not duplicated.",
  },
  {
    q: "Can I self-host?",
    a: "The worker pool is open source and self-hostable today. A self-hosted control plane is available on the Enterprise plan; it needs Postgres 14+ and any S3-compatible object store for the log.",
  },
  {
    q: "What is the overhead per step?",
    a: "One append to the event log and one commit. In practice the cost is dominated by whatever your model or tool call already costs — but you should measure it against your own workload rather than trust a number on a landing page.",
  },
];

export function FaqBaseline() {
  const [open, setOpen] = React.useState<number | null>(0);

  return (
    <section
      data-arm="baseline"
      style={BRAND}
      className="w-full bg-slate-50 dark:bg-slate-900"
    >
      <div className="mx-auto max-w-3xl px-6 py-20">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
          Questions engineers actually ask
        </h2>

        <div className="mt-10 divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white shadow-sm dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-950">
          {FAQS.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div key={faq.q}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="text-base font-medium text-slate-900 dark:text-slate-100">
                    {faq.q}
                  </span>
                  {isOpen ? (
                    <Minus className="h-4 w-4 shrink-0 text-slate-500" />
                  ) : (
                    <ChevronDown className="h-4 w-4 shrink-0 text-slate-500" />
                  )}
                </button>
                {isOpen ? (
                  <div className="px-6 pb-5">
                    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                      {faq.a}
                    </p>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Closing CTA                                                         */
/* ------------------------------------------------------------------ */

export function CtaBaseline() {
  return (
    <section
      data-arm="baseline"
      style={BRAND}
      className="w-full bg-white dark:bg-slate-950"
    >
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div
          className="rounded-xl px-8 py-14 text-center shadow-sm"
          style={{ backgroundColor: "var(--b-brand)" }}
        >
          <h2 className="text-3xl font-semibold tracking-tight text-white">
            Port one agent. Keep the rest hand-rolled.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-indigo-100">
            Wrap a single flaky agent in the runtime, run it alongside what you
            already have, and compare the failure modes for a week before you
            commit to anything.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#start"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-medium shadow-sm"
              style={{ color: "var(--b-brand-hover)" }}
            >
              Start building
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#docs"
              className="inline-flex items-center gap-2 rounded-lg border border-white/40 px-5 py-2.5 text-sm font-medium text-white"
            >
              <Terminal className="h-4 w-4" />
              Migration guide
            </a>
          </div>
          <p className="mt-6 font-mono text-xs text-indigo-200">
            npx @cadence/cli init --adopt ./agents/refund.ts
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

const FOOTER_COLUMNS = [
  {
    heading: "Product",
    links: ["Runtime", "Replay", "Observability", "Pricing", "Changelog"],
  },
  {
    heading: "Developers",
    links: ["Documentation", "Quickstart", "TypeScript SDK", "Python SDK", "Status"],
  },
  {
    heading: "Company",
    links: ["About", "Security", "Careers", "Contact"],
  },
];

export function FooterBaseline() {
  return (
    <footer
      data-arm="baseline"
      style={BRAND}
      className="w-full border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white"
                style={{ backgroundColor: "var(--b-brand)" }}
              >
                <Activity className="h-4 w-4" strokeWidth={2.5} />
              </span>
              <span className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                Cadence
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              A runtime for production AI agents. Durable execution, replayable
              runs, typed tool boundaries.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs text-slate-600 dark:text-slate-400">
                All systems operational
              </span>
            </div>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div key={column.heading}>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {column.heading}
              </h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#footer"
                      className="text-sm text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            © 2026 Cadence Systems, Inc.
          </p>
          <div className="flex items-center gap-5">
            <a
              href="#privacy"
              className="text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
            >
              Privacy
            </a>
            <a
              href="#terms"
              className="text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
            >
              Terms
            </a>
            <a
              href="#github"
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
            >
              <GitBranch className="h-3.5 w-3.5" />
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
