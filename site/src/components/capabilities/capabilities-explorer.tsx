"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { COMMANDS, COMMAND_GROUPS, type Command } from "@/data/commands";
import { CopyButton } from "@/components/code/copy-button";
import { Search } from "@/lib/icons";
import { cn } from "@/lib/utils";

/**
 * The full command explorer.
 *
 * A text filter over the same grouped-index layout the landing page's command
 * board uses, so the reader who arrives here from the home page finds the same
 * shape rather than a different pattern for what is the same data.
 */
export function CapabilitiesExplorer() {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<Command>(COMMANDS[0]);

  const query = q.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!query) return COMMANDS;
    return COMMANDS.filter(
      (c) =>
        c.name.includes(query) ||
        c.purpose.toLowerCase().includes(query) ||
        c.detail.toLowerCase().includes(query),
    );
  }, [query]);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div>
        <label className="relative mb-4 block">
          <span className="sr-only">Filter commands</span>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-dim"
            aria-hidden
          />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Filter by name or purpose - e.g. “state”, “tokens”, “motion”"
            className="w-full rounded-full border border-rule bg-plate py-2.5 pl-9 pr-3 text-[0.875rem] text-ink outline-none placeholder:text-ink-dim focus-visible:border-mark"
          />
        </label>

        <div className="space-y-4">
          {COMMAND_GROUPS.map((g) => {
            const items = filtered.filter((c) => c.group === g.id);
            if (items.length === 0) return null;
            return (
              <section key={g.id} className="overflow-hidden rounded-2xl border border-rule bg-plate">
                <div className="border-b border-rule/70 bg-plate-2 px-4 py-2.5">
                  <h2 className="plate-label text-ink">{g.id}</h2>
                  <p className="mt-0.5 text-[0.75rem] leading-snug text-ink-dim">
                    {g.blurb}
                  </p>
                </div>
                <ul className="divide-y divide-rule/60">
                  {items.map((c) => {
                    const on = sel.name === c.name;
                    return (
                      <li key={c.name}>
                        <button
                          type="button"
                          id={c.name}
                          onClick={() => setSel(c)}
                          aria-pressed={on}
                          className={cn(
                            "flex w-full items-baseline gap-3 px-3 py-2.5 text-left transition-colors duration-(--d-fast)",
                            on ? "bg-plate-2" : "hover:bg-plate-2/60",
                          )}
                        >
                          <code
                            className={cn(
                              "font-mono text-[0.8125rem]",
                              on ? "text-mark" : "text-ink",
                            )}
                          >
                            {c.name}
                          </code>
                          <span className="min-w-0 flex-1 truncate text-[0.8125rem] text-ink-muted">
                            {c.purpose}
                          </span>
                          <span className="shrink-0 font-mono text-[0.625rem] tabular text-ink-dim">
                            {c.cost}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
          {filtered.length === 0 ? (
            <p className="rounded-2xl border border-rule bg-plate p-6 text-center text-[0.875rem] text-ink-muted">
              No command matches &ldquo;{q}&rdquo;.
            </p>
          ) : null}
        </div>
      </div>

      {/* Detail rail. Sticky so it stays paired with the list while scrolling. */}
      <aside className="lg:sticky lg:top-20 lg:self-start">
        <div className="overflow-hidden rounded-2xl border border-rule bg-plate">
          <div className="flex items-baseline gap-3 border-b border-rule/70 bg-plate-2 px-4 py-3">
            <code className="font-mono text-[1.0625rem] text-mark">{sel.name}</code>
            <span className="ml-auto font-mono text-[0.625rem] uppercase tracking-[0.1em] text-ink-dim">
              {sel.group} · {sel.cost}
            </span>
          </div>
          <div className="space-y-4 p-4">
            <p className="text-[0.9375rem] leading-snug text-ink">{sel.purpose}</p>
            <p className="text-[0.8125rem] leading-relaxed text-ink-muted">
              {sel.detail}
            </p>

            <dl className="grid grid-cols-2 gap-3 rounded-xl bg-plate-2 p-3 text-[0.8125rem]">
              <div>
                <dt className="plate-label mb-1">Input</dt>
                <dd className="text-ink-muted">{sel.input}</dd>
              </div>
              <div>
                <dt className="plate-label mb-1">Output</dt>
                <dd className="text-ink-muted">{sel.output}</dd>
              </div>
            </dl>

            <div>
              <p className="plate-label mb-1.5">Example invocation</p>
              <div className="flex items-center gap-2 rounded-xl bg-plate-2 px-3 py-2.5">
                <code className="min-w-0 flex-1 truncate font-mono text-[0.75rem] text-ink">
                  {sel.example}
                </code>
                <CopyButton value={sel.example} label="Copy" />
              </div>
            </div>

            {sel.run ? (
              <div>
                <p className="plate-label mb-1">
                  {sel.run.kind === "executed" ? "Real run" : "Output shape"}
                </p>
                <p className="mb-1.5 text-[0.75rem] leading-snug text-ink-dim">
                  {sel.run.kind === "executed"
                    ? "Captured 2026-09-04 — literal terminal output."
                    : "No script behind this — the fixed shape the agent writes."}
                </p>
                {sel.run.cmd ? (
                  <code className="mb-1.5 block overflow-x-auto rounded-t-xl border-b border-rule/60 bg-plate-2 px-3 py-2 font-mono text-[0.6875rem] text-ink-muted">
                    $ {sel.run.cmd}
                  </code>
                ) : null}
                <pre
                  className={cn(
                    "overflow-x-auto bg-plate-2 px-3 py-2.5 font-mono text-[0.6875rem] leading-[1.6] text-ink-muted",
                    sel.run.cmd ? "rounded-b-xl" : "rounded-xl",
                  )}
                >
                  {sel.run.out}
                </pre>
              </div>
            ) : null}

            {sel.relatedExamples?.length ? (
              <div>
                <p className="plate-label mb-2">Seen in this build</p>
                <ul className="flex flex-wrap gap-1.5">
                  {sel.relatedExamples.map((slug) => (
                    <li key={slug}>
                      <Link
                        href={`/examples/${slug}`}
                        className="inline-block rounded-full bg-plate-2 px-2.5 py-1 text-[0.6875rem] text-ink-muted transition-colors duration-(--d-fast) hover:text-ink"
                      >
                        {slug}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </aside>
    </div>
  );
}
