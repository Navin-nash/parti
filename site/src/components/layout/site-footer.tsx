import Link from "next/link";
import { ArrowUpRight } from "@/lib/icons";
import { NAV, GITHUB_URL } from "@/lib/nav";
import { Wordmark } from "./wordmark";

const RESOURCES = [
  { href: GITHUB_URL, label: "Repository", external: true },
  { href: `${GITHUB_URL}/blob/main/SKILL.md`, label: "SKILL.md", external: true },
  { href: `${GITHUB_URL}/tree/main/references`, label: "References", external: true },
  { href: `${GITHUB_URL}/tree/main/scripts`, label: "Scripts", external: true },
];

/**
 * The footer: what the product is, where to read it, and a small colophon.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-rule/70 bg-plate-2">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <div className="grid gap-10 py-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <Wordmark />
            <p className="mt-4 max-w-[42ch] text-[0.9375rem] leading-relaxed text-ink-muted">
              Design direction for AI-generated interfaces. A Claude Code skill
              that derives a position from the subject instead of picking one
              off a style menu.
            </p>
          </div>

          <nav aria-label="Product" className="md:col-span-3">
            <h2 className="plate-label">Product</h2>
            <ul className="mt-4 space-y-2">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[0.875rem] text-ink-muted transition-colors duration-(--d-fast) hover:text-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/about"
                  className="text-[0.875rem] text-ink-muted transition-colors duration-(--d-fast) hover:text-ink"
                >
                  About
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Resources" className="md:col-span-4">
            <h2 className="plate-label">Resources</h2>
            <ul className="mt-4 space-y-2">
              {RESOURCES.map((r) => (
                <li key={r.label}>
                  <a
                    href={r.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1 text-[0.875rem] text-ink-muted transition-colors duration-(--d-fast) hover:text-ink"
                  >
                    {r.label}
                    <ArrowUpRight className="size-3 opacity-60" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Colophon. Every figure here is checkable in the repo. */}
        <div className="flex flex-col gap-4 border-t border-rule/70 py-6 sm:flex-row sm:items-baseline sm:justify-between">
          <p className="display text-[1.0625rem] text-ink">
            Style is derived, never selected.
          </p>
          <dl className="flex flex-wrap gap-x-6 gap-y-1 text-[0.75rem] text-ink-dim">
            <div className="flex gap-1.5">
              <dt className="sr-only">Set in</dt>
              <dd>Set in Plus Jakarta Sans &amp; Geist</dd>
            </div>
            <div className="flex gap-1.5">
              <dt className="sr-only">Contrast</dt>
              <dd>Contrast verified by color.py</dd>
            </div>
          </dl>
        </div>
      </div>
    </footer>
  );
}
