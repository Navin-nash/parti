"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ArrowUpRight } from "@/lib/icons";
import { NAV, GITHUB_URL } from "@/lib/nav";
import { Wordmark } from "./wordmark";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-40 border-b border-rule/70 bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-6 px-4 sm:px-6">
        <Wordmark />

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "rounded-full px-3.5 py-2 text-[0.875rem] transition-colors duration-(--d-fast) ease-(--ease-specimen)",
                      active
                        ? "bg-plate-2 text-ink"
                        : "text-ink-muted hover:bg-plate-2 hover:text-ink",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="hidden items-center gap-1.5 rounded-full border border-rule bg-plate px-3.5 py-2 text-[0.8125rem] text-ink-muted transition-colors duration-(--d-fast) ease-(--ease-specimen) hover:border-rule-strong hover:text-ink sm:inline-flex"
          >
            GitHub
            <ArrowUpRight className="size-3.5" aria-hidden />
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex size-9 items-center justify-center rounded-full border border-rule bg-plate text-ink-muted transition-colors duration-(--d-fast) hover:text-ink lg:hidden"
          >
            {open ? <X className="size-4" aria-hidden /> : <Menu className="size-4" aria-hidden />}
          </button>
        </div>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          aria-label="Primary, mobile"
          className="border-t border-rule/70 bg-plate lg:hidden"
        >
          <ul className="mx-auto max-w-[1400px] px-4 py-2 sm:px-6">
            {NAV.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href} className="border-b border-rule/50 last:border-0">
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "block py-3 text-[0.9375rem]",
                      active ? "text-mark" : "text-ink",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
            <li className="py-3">
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1.5 text-[0.875rem] text-ink-muted"
              >
                GitHub
                <ArrowUpRight className="size-3.5" aria-hidden />
              </a>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
