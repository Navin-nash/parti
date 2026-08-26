import Link from "next/link";
import { notFound } from "next/navigation";
import { REGISTRY, bySlug } from "@/lib/registry";

export function generateStaticParams() {
  return REGISTRY.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = bySlug(slug);
  return { title: entry ? `${entry.name} — Meridian components` : "Not found" };
}

/**
 * One component, previewed in isolation.
 *
 * The preview surface is the real page ground, not a white card — a component
 * shown on a background it will never sit on tells you nothing about whether it
 * works. Same reason the contrast figures hold: they were verified against this
 * exact ground.
 */
export default async function ComponentPreview({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = bySlug(slug);
  if (!entry) notFound();

  const index = REGISTRY.findIndex((e) => e.slug === slug);
  const prev = REGISTRY[index - 1];
  const next = REGISTRY[index + 1];

  return (
    <div style={{ paddingBottom: "var(--s-16)" }}>
      <div className="wrap" style={{ paddingTop: "var(--s-8)" }}>
        <Link href="/gallery" className="label" style={{ textDecoration: "none" }}>
          ← All components
        </Link>
        <div className="row-between" style={{ marginTop: "var(--s-4)" }}>
          <h1 className="h1">{entry.name}</h1>
          <span className="label">{entry.group}</span>
        </div>
        <p className="small muted measure" style={{ marginTop: "var(--s-3)" }}>
          {entry.note}
        </p>
        <div className="label" style={{ marginTop: "var(--s-3)" }}>
          {entry.file}
        </div>
      </div>

      <div
        style={{
          marginTop: "var(--s-8)",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        {entry.bleed ? (
          entry.render()
        ) : (
          <div className="wrap" style={{ paddingTop: "var(--s-10)", paddingBottom: "var(--s-10)" }}>
            {entry.render()}
          </div>
        )}
      </div>

      <div className="wrap" style={{ marginTop: "var(--s-6)" }}>
        <nav className="row-between" aria-label="Component pagination">
          {prev ? (
            <Link href={`/gallery/${prev.slug}`} className="label" style={{ textDecoration: "none" }}>
              ← {prev.name}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`/gallery/${next.slug}`} className="label" style={{ textDecoration: "none" }}>
              {next.name} →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </div>
    </div>
  );
}
