"use client";

import { useState } from "react";
import Link from "next/link";
import { COMMANDS, COMMAND_GROUPS, type Command } from "@/data/commands";
import { cn } from "@/lib/utils";

/**
 * The command board.
 *
 * Thirty commands laid out as a dense index rather than thirty
 * cards. A card grid at this count is a wall, and the reader's actual question
 * is "which one do I reach for", which an index answers and a wall does not.
 *
 * Selecting a command fills a fixed detail strip below rather than expanding
 * the tile in place. Expanding in place reflows the whole board and the
 * reader loses the item they were comparing against.
 */
export function CommandBoard() {
  const [sel, setSel] = useState<Command>(COMMANDS[0]);

  return (
    <div className="overflow-hidden rounded-2xl border border-rule">
      {COMMAND_GROUPS.map((g) => {
        const cmds = COMMANDS.filter((c) => c.group === g.id);
        return (
          <section key={g.id} className="border-b border-rule/70 last:border-0">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 bg-plate-2 px-4 py-2.5">
              <h3 className="plate-label text-ink">{g.id}</h3>
              <p className="max-w-[72ch] text-[0.75rem] leading-snug text-ink-dim">
                {g.blurb}
              </p>
            </div>
            <ul className="flex flex-wrap gap-1.5 bg-plate p-3">
              {cmds.map((c) => {
                const on = sel.name === c.name;
                return (
                  <li key={c.name}>
                    <button
                      type="button"
                      onClick={() => setSel(c)}
                      onFocus={() => setSel(c)}
                      aria-pressed={on}
                      className={cn(
                        "flex items-baseline gap-2 rounded-full px-3 py-1.5 text-[0.8125rem] font-medium transition-colors duration-(--d-fast) ease-(--ease-specimen)",
                        on
                          ? "bg-mark text-on-mark"
                          : "bg-plate-2 text-ink-muted hover:bg-plate-2/70 hover:text-ink",
                      )}
                    >
                      {c.name}
                      <span
                        className={cn(
                          "text-[0.5625rem] tabular",
                          on ? "text-on-mark/70" : "text-ink-dim",
                        )}
                      >
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

      {/* Fixed-height detail strip. min-h stops the board jumping when the
          selected command has a shorter description than the last one. */}
      <div className="grid min-h-[9rem] gap-px border-t border-rule/70 bg-rule/70 md:grid-cols-[minmax(0,1fr)_minmax(0,20rem)]">
        <div className="bg-plate-2 p-4">
          <p className="mb-2 flex flex-wrap items-baseline gap-x-3">
            <code className="font-mono text-[1.0625rem] text-mark">{sel.name}</code>
            <span className="text-[0.9375rem] text-ink">{sel.purpose}</span>
          </p>
          <p className="max-w-[74ch] text-[0.875rem] leading-relaxed text-ink-muted">
            {sel.detail}
          </p>
          <Link
            href={`/capabilities#${sel.name}`}
            className="mt-3 inline-block font-mono text-[0.625rem] uppercase tracking-[0.12em] text-ink-dim underline decoration-rule-strong underline-offset-4 transition-colors duration-(--d-fast) hover:text-mark"
          >
            Full definition
          </Link>
        </div>
        <dl className="bg-plate-2 p-4 text-[0.8125rem]">
          {[
            ["Input", sel.input],
            ["Output", sel.output],
            ["Cost", sel.cost],
          ].map(([k, v]) => (
            <div key={k} className="mb-2.5 last:mb-0">
              <dt className="plate-label">{k}</dt>
              <dd className="mt-0.5 leading-snug text-ink-muted">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
