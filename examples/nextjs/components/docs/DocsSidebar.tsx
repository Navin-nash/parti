"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PAIRS } from "@/lib/compare";
import { REGISTRY, GROUPS, byGroup } from "@/lib/registry";

function Section({
  title,
  items,
}: {
  title: string;
  items: { href: string; label: string; paired?: boolean }[];
}) {
  const pathname = usePathname();
  return (
    <div className="docs__section">
      <div className="label docs__sectionTitle">{title}</div>
      <ul className="docs__list">
        {items.map((it) => {
          const active = pathname === it.href;
          return (
            <li key={it.href}>
              <Link href={it.href} className="docs__link" aria-current={active ? "page" : undefined}>
                <span>{it.label}</span>
                {it.paired === false && (
                  <span className="docs__soloTag" title="parti only — no baseline equivalent">
                    solo
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function DocsSidebar() {
  const pages = PAIRS.filter((p) => p.group === "Pages").map((p) => ({
    href: `/compare/${p.slug}`,
    label: p.name,
  }));
  const states = PAIRS.filter((p) => p.group === "States").map((p) => ({
    href: `/compare/${p.slug}`,
    label: p.name,
  }));

  return (
    <aside className="docs__side" aria-label="Preview navigation">
      <nav>
        <Section title="Overview" items={[{ href: "/compare", label: "How this works" }]} />
        <Section title="Pages · A/B" items={pages} />
        <Section title="States · A/B" items={states} />
        {GROUPS.map((g) => (
          <Section
            key={g}
            title={`${g} · parti only`}
            items={byGroup(g).map((e) => ({
              href: `/gallery/${e.slug}`,
              label: e.name,
              paired: false,
            }))}
          />
        ))}
      </nav>
      <p className="docs__footnote small dim">
        {PAIRS.length} paired previews · {REGISTRY.length} components
      </p>
    </aside>
  );
}
