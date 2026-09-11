"use client";

import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Check, Copy, Terminal } from "@/lib/icons";

/**
 * How to actually install the skill, per agent. `SKILL.md` is a shared,
 * agent-neutral format - Claude Code and Antigravity both discover it
 * natively, and anything that reads `AGENTS.md` (Codex, Copilot, Cursor,
 * Gemini CLI) just needs one line pointing at it. Each tab is a real,
 * copyable set of commands, not a translated one.
 */
type Method = {
  id: string;
  label: string;
  logo: { src: string; darkSrc?: string; alt: string } | { Icon: typeof Terminal };
  blurb: string;
  steps: { cmd: string; note?: string }[];
};

const CLONE_STEP = {
  cmd: "git clone https://github.com/Navin-nash/parti ~/.local/share/parti",
  note: "clone once",
};

const METHODS: Method[] = [
  {
    id: "skills",
    label: "skills.sh",
    logo: { Icon: Terminal },
    blurb: "One command. Fetches the skill and drops it in ~/.claude/skills/.",
    steps: [{ cmd: "npx skills add Navin-nash/parti" }],
  },
  {
    id: "plugin",
    label: "Claude Code",
    logo: { src: "/logos/claude.svg", alt: "Claude" },
    blurb: "Install as a plugin from the marketplace, inside Claude Code.",
    steps: [
      { cmd: "/plugin marketplace add Navin-nash/parti", note: "add the marketplace" },
      { cmd: "/plugin install parti", note: "then install" },
    ],
  },
  {
    id: "antigravity",
    label: "Antigravity",
    logo: { src: "/logos/antigravity.svg", alt: "Antigravity" },
    blurb: "Antigravity reads SKILL.md natively - clone once, symlink it in.",
    steps: [
      CLONE_STEP,
      {
        cmd: "ln -s ~/.local/share/parti/skills/parti .agents/skills/parti",
        note: "per project, or ~/.gemini/antigravity/skills/parti for every project",
      },
    ],
  },
  {
    id: "codex",
    label: "Codex",
    logo: { src: "/logos/openai.svg", darkSrc: "/logos/openai_dark.svg", alt: "Codex" },
    blurb: "Codex, Cursor, Gemini CLI, and anything else reading a project's AGENTS.md.",
    steps: [
      CLONE_STEP,
      {
        cmd: 'echo "For any UI/visual design work, read and follow ~/.local/share/parti/skills/parti/SKILL.md in full." >> AGENTS.md',
        note: "per project",
      },
    ],
  },
  {
    id: "copilot",
    label: "Copilot",
    logo: { src: "/logos/copilot.svg", darkSrc: "/logos/copilot_dark.svg", alt: "GitHub Copilot" },
    blurb: "Copilot Chat, Code Review, and the coding agent all read this file.",
    steps: [
      CLONE_STEP,
      {
        cmd: 'mkdir -p .github && echo "For any UI/visual design work, read and follow ~/.local/share/parti/skills/parti/SKILL.md in full." >> .github/copilot-instructions.md',
        note: "per project",
      },
    ],
  },
  {
    id: "git",
    label: "Manual",
    logo: {
      src: "/logos/github-light.svg",
      darkSrc: "/logos/github-dark.svg",
      alt: "GitHub",
    },
    blurb: "Clone it straight into your skills directory.",
    steps: [
      { cmd: "git clone https://github.com/Navin-nash/parti ~/.claude/skills/parti" },
    ],
  },
];

function CmdRow({ cmd, note }: { cmd: string; note?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(cmd);
      setCopied(true);
      toast.success("Command copied");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy", { description: "Select the command and copy it manually." });
    }
  }

  return (
    <div className="flex items-stretch border border-rule bg-plate">
      <code className="flex min-w-0 flex-1 items-center overflow-x-auto whitespace-nowrap px-3 py-2.5 font-mono text-[0.8125rem] text-ink-muted">
        <span className="mr-2 select-none text-ink-dim">$</span>
        {cmd}
      </code>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy: ${cmd}`}
        className="flex min-h-11 w-11 shrink-0 items-center justify-center border-l border-rule text-ink-muted transition-colors duration-(--d-fast) hover:bg-plate-2 hover:text-ink"
      >
        {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
      </button>
      {note ? <span className="sr-only">{note}</span> : null}
    </div>
  );
}

export function InstallCommand({ className, hint }: { className?: string; hint?: string }) {
  const [active, setActive] = useState(METHODS[0].id);
  const method = METHODS.find((m) => m.id === active)!;

  return (
    <div className={cn("w-full max-w-xl border border-rule bg-plate-2", className)}>
      <div role="tablist" aria-label="Install method" className="flex border-b border-rule">
        {METHODS.map((m) => {
          const on = m.id === active;
          return (
            <button
              key={m.id}
              role="tab"
              aria-selected={on}
              type="button"
              onClick={() => setActive(m.id)}
              className={cn(
                "flex items-center gap-1.5 border-r border-rule px-3 py-2 text-[0.75rem] font-medium transition-colors duration-(--d-fast) last:border-r-0",
                on ? "bg-plate text-ink" : "text-ink-muted hover:text-ink",
              )}
            >
              {"Icon" in m.logo ? (
                <m.logo.Icon className="size-3.5" aria-hidden />
              ) : (
                <>
                  <Image
                    src={m.logo.src}
                    alt=""
                    width={14}
                    height={14}
                    className={cn("size-3.5", m.logo.darkSrc && "dark:hidden")}
                  />
                  {m.logo.darkSrc ? (
                    <Image
                      src={m.logo.darkSrc}
                      alt=""
                      width={14}
                      height={14}
                      className="hidden size-3.5 dark:block"
                    />
                  ) : null}
                </>
              )}
              {m.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-2 p-3">
        <p className="text-[0.8125rem] text-ink-muted">{method.blurb}</p>
        {method.steps.map((s) => (
          <CmdRow key={s.cmd} cmd={s.cmd} note={s.note} />
        ))}
        {hint ? <p className="mt-1 text-[0.75rem] text-ink-dim">{hint}</p> : null}
      </div>
    </div>
  );
}
