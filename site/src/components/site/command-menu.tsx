"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { NAV, GITHUB_URL } from "@/lib/nav";
import { COMMANDS } from "@/data/commands";
import { SHOWCASES } from "@/data/showcases";
import { Copy, FileText, Search, Terminal } from "@/lib/icons";

/**
 * Wayfinding for a page that is nearly ten thousand pixels tall.
 *
 * The home page is a long argument, and a long argument with no way to jump is
 * a document you scroll past rather than read. This is the conventional
 * mechanic for that problem on a developer-facing site, so it costs a visitor
 * nothing to learn: the palette opens on the key they already try.
 *
 * It is deliberately not a novelty. Every entry goes somewhere that already
 * existed; nothing here is reachable only through the palette.
 */

const SECTIONS: { id: string; label: string }[] = [
  { id: "problem", label: "The problem: everything converges" },
  { id: "slop", label: "Eight tells, and what replaces each" },
  { id: "difference", label: "Same brief, two runs" },
  { id: "thesis", label: "The rule that matters most" },
  { id: "process", label: "The process, seven stages" },
  { id: "capabilities", label: "Capabilities" },
  { id: "caveats", label: "What this is not" },
];

export function CommandMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Every action closes first, so focus returns to the page before anything
  // moves. Scrolling underneath an open dialog leaves the user somewhere they
  // did not choose when it closes.
  const run = useCallback((fn: () => void) => {
    setOpen(false);
    window.setTimeout(fn, 0);
  }, []);

  const jump = (id: string) =>
    run(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        // Move focus as well as the viewport: a jump that only scrolls leaves a
        // keyboard user's tab order where it was.
        el.setAttribute("tabindex", "-1");
        (el as HTMLElement).focus({ preventScroll: true });
      } else {
        router.push(`/#${id}`);
      }
    });

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Search Parti"
      description="Jump to a section, a capability, or an example."
    >
      {/* This project's CommandDialog renders children straight into DialogContent
          rather than wrapping them, so the Command context has to be supplied here.
          Without it cmdk's Input has no store to subscribe to and the tree crashes. */}
      <Command>
        <CommandInput placeholder="Jump to a section, capability, or example..." />
        <CommandList>
        <CommandEmpty>Nothing matches that.</CommandEmpty>

        <CommandGroup heading="Get started">
          <CommandItem
            value="install clone git copy"
            onSelect={() =>
              run(async () => {
                try {
                  await navigator.clipboard.writeText(
                    "git clone https://github.com/Navin-nash/parti",
                  );
                  toast.success("Command copied");
                } catch {
                  toast.error("Could not copy", {
                    description: "Copy it from the install box instead.",
                  });
                }
              })
            }
          >
            <Copy className="size-4" aria-hidden />
            Copy the install command
            <CommandShortcut>clone</CommandShortcut>
          </CommandItem>
          <CommandItem
            value="github repository source"
            onSelect={() => run(() => window.open(GITHUB_URL, "_blank", "noopener"))}
          >
            <Terminal className="size-4" aria-hidden />
            Open the repository
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="On this page">
          {SECTIONS.map((s) => (
            <CommandItem key={s.id} value={`${s.label} ${s.id}`} onSelect={() => jump(s.id)}>
              <Search className="size-4" aria-hidden />
              {s.label}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Pages">
          {NAV.map((n) => (
            <CommandItem
              key={n.href}
              value={`${n.label} ${n.href}`}
              onSelect={() => run(() => router.push(n.href))}
            >
              <FileText className="size-4" aria-hidden />
              {n.label}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Gallery">
          {SHOWCASES.map((s) => (
            <CommandItem
              key={s.slug}
              value={`${s.title} ${s.slug} gallery`}
              onSelect={() => run(() => router.push(`/gallery/${s.slug}`))}
            >
              <FileText className="size-4" aria-hidden />
              {s.title}
              <CommandShortcut>{s.category}</CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Capabilities">
          {COMMANDS.map((c) => (
            <CommandItem
              key={c.name}
              value={`${c.name} ${c.purpose} ${c.group}`}
              onSelect={() => run(() => router.push(`/capabilities#${c.name}`))}
            >
              <Terminal className="size-4" aria-hidden />
              <span className="font-mono">{c.name}</span>
              <span className="truncate text-ink-muted">{c.purpose}</span>
              <CommandShortcut>{c.group}</CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
