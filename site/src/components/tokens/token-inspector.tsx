"use client";

import { useState } from "react";
import type { TokenSet, ColorToken, ScaleToken } from "@/lib/schema";
import { CopyButton } from "@/components/code/copy-button";
import { cn } from "@/lib/utils";

type View = "semantic" | "raw";

/**
 * The token inspector, §16.
 *
 * Two views, because the two audiences want different things: a designer reads
 * roles, an engineer reads values. Neither view is a subset of the other, so a
 * single table with a value column would serve one of them badly.
 *
 * Contrast ratios are printed in the table rather than kept in a doc. A
 * builder who cannot see the number will assume it passes.
 */
export function TokenInspector({ tokens }: { tokens: TokenSet }) {
  const [view, setView] = useState<View>("semantic");

  const asCss = [
    ...tokens.color.map((t) => `  --${t.name}: ${t.value};`),
    "",
    ...tokens.type.map((t) => `  --${t.name}: ${t.value};`),
    "",
    ...tokens.space.map((t) => `  --${t.name}: ${t.value};`),
    "",
    ...tokens.shape.map((t) => `  --${t.name}: ${t.value};`),
    "",
    ...tokens.motion.map((t) => `  --${t.name}: ${t.value};`),
  ].join("\n");

  return (
    <div className="overflow-hidden rounded-2xl border border-rule bg-plate">
      <div className="flex flex-wrap items-center gap-2 border-b border-rule/70 bg-plate-2 px-3 py-2">
        <div className="flex items-center gap-0.5 rounded-full bg-plate p-1" role="group" aria-label="Token view">
          {(["semantic", "raw"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              aria-pressed={view === v}
              className={cn(
                "rounded-full px-3 py-1.5 text-[0.75rem] font-medium transition-colors duration-(--d-fast)",
                view === v
                  ? "bg-plate-2 text-ink"
                  : "text-ink-dim hover:text-ink",
              )}
            >
              {v === "semantic" ? "Semantic tokens" : "Raw values"}
            </button>
          ))}
        </div>
        <div className="ml-auto">
          <CopyButton value={`:root {\n${asCss}\n}`} label="Copy as CSS" />
        </div>
      </div>

      <TokenGroup title="Color">
        <ul className="grid gap-2 p-3 sm:grid-cols-2 lg:grid-cols-3">
          {tokens.color.map((t) => (
            <ColorRow key={t.name} token={t} view={view} />
          ))}
        </ul>
      </TokenGroup>

      <TokenGroup title="Typography">
        <ScaleRows rows={tokens.type} view={view} sample="type" />
      </TokenGroup>

      <TokenGroup title="Spacing">
        <ScaleRows rows={tokens.space} view={view} sample="space" />
      </TokenGroup>

      <TokenGroup title="Shape">
        <ScaleRows rows={tokens.shape} view={view} />
      </TokenGroup>

      <TokenGroup title="Motion">
        <ScaleRows rows={tokens.motion} view={view} />
      </TokenGroup>
    </div>
  );
}

function TokenGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-b border-rule/70 last:border-0">
      <h3 className="plate-label px-4 pt-4">
        {title}
      </h3>
      {children}
    </section>
  );
}

function ColorRow({ token, view }: { token: ColorToken; view: View }) {
  return (
    <li className="flex items-start gap-3 rounded-xl bg-plate-2 p-3">
      <span
        aria-hidden
        className="mt-0.5 size-8 shrink-0 rounded-lg border border-rule"
        style={{ background: token.value }}
      />
      <div className="min-w-0 flex-1">
        <code className="block truncate font-mono text-[0.75rem] text-ink">
          {view === "semantic" ? `--${token.name}` : token.value}
        </code>
        <p className="mt-0.5 text-[0.75rem] leading-snug text-ink-muted">
          {token.role}
        </p>
        {view === "raw" && token.oklch ? (
          <code className="mt-1 block truncate font-mono text-[0.6875rem] text-ink-dim">
            {token.oklch}
          </code>
        ) : null}
        {token.contrast ? (
          <p className="mt-1 font-mono text-[0.625rem] tabular text-ink-dim">
            {token.contrast}
          </p>
        ) : null}
      </div>
    </li>
  );
}

function ScaleRows({
  rows, view, sample,
}: { rows: ScaleToken[]; view: View; sample?: "type" | "space" }) {
  return (
    <ul className="space-y-1 px-3 pb-3">
      {rows.map((t) => (
        <li key={t.name} className="flex items-center gap-4 rounded-xl bg-plate-2 px-3 py-2">
          <code className="w-[13ch] shrink-0 truncate font-mono text-[0.75rem] text-ink">
            {view === "semantic" ? `--${t.name}` : t.value}
          </code>
          <span className="min-w-0 flex-1 truncate text-[0.8125rem] text-ink-muted">
            {t.role}
          </span>
          {sample === "space" ? (
            <span
              aria-hidden
              className="h-2.5 shrink-0 rounded-full bg-mark"
              style={{ width: t.value, maxWidth: "8rem" }}
            />
          ) : null}
          {sample === "type" ? (
            <span
              aria-hidden
              className="shrink-0 overflow-hidden text-ink leading-none"
              style={{ fontSize: `min(${t.value}, 1.75rem)` }}
            >
              Ag
            </span>
          ) : null}
          <code className="w-[9ch] shrink-0 text-right font-mono text-[0.6875rem] tabular text-ink-dim">
            {view === "semantic" ? t.value : `--${t.name}`}
          </code>
        </li>
      ))}
    </ul>
  );
}
