"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Product" },
  { href: "/pricing", label: "Pricing" },
  { href: "/dashboard", label: "Board" },
  { href: "/gallery", label: "Components" },
  { href: "/compare", label: "Compare" },
];

/**
 * Wordmark plus a mono context sub-label naming the surface. No icon library
 * anywhere in this build — status and navigation are carried by words, which
 * survive grayscale where a 16px glyph does not.
 */
export function Nav() {
  const pathname = usePathname();
  return (
    <header className="wrap">
      <nav className="nav" aria-label="Primary">
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "baseline", gap: "var(--s-3)" }}>
          <span style={{ font: "700 15px/1 var(--f-mono)", letterSpacing: "0.14em" }}>MERIDIAN</span>
          <span className="label">Dispatch</span>
        </Link>
        <div className="nav__links">
          {LINKS.map((l) => {
            const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className="nav__link"
                aria-current={active ? "page" : undefined}
              >
                {l.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
