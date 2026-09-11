import Link from "next/link";
import { ArrowUpRight } from "@/lib/icons";
import { NAV, GITHUB_URL } from "@/lib/nav";
import { Wordmark } from "./wordmark";

const RESOURCES = [
  { href: GITHUB_URL, label: "Repository" },
  { href: `${GITHUB_URL}/blob/main/SKILL.md`, label: "SKILL.md" },
  { href: `${GITHUB_URL}/tree/main/references`, label: "References" },
  { href: `${GITHUB_URL}/tree/main/scripts`, label: "Scripts" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-rule bg-plate-2">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 py-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <Wordmark />
            <p className="mt-4 max-w-[42ch] text-[0.9375rem] leading-relaxed text-ink-muted">
              A Claude Code skill that derives a design direction from the
              subject instead of picking one off a style menu.
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

        <div className="flex flex-col gap-4 border-t border-rule py-6 sm:flex-row sm:items-baseline sm:justify-between">
          <p className="display text-[1.0625rem] text-ink">
            Style is derived, never selected.
          </p>
          <dl className="flex flex-wrap gap-x-6 gap-y-1 font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-ink-dim">
            <div>
              <dt className="sr-only">Set in</dt>
              <dd>Set in Geist &amp; Geist Mono</dd>
            </div>
            <div>
              <dt className="sr-only">Contrast</dt>
              <dd>Contrast verified by color.py</dd>
            </div>
          </dl>
        </div>
      </div>
    </footer>
  );
}
