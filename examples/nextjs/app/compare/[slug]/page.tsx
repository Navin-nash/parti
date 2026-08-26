import Link from "next/link";
import { notFound } from "next/navigation";
import { ComparePane } from "@/components/docs/ComparePane";
import { PAIRS, pairBySlug } from "@/lib/compare";

export function generateStaticParams() {
  return PAIRS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pair = pairBySlug(slug);
  return { title: pair ? `${pair.name} — compare` : "Not found" };
}

export default async function ComparePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pair = pairBySlug(slug);
  if (!pair) notFound();

  const i = PAIRS.findIndex((p) => p.slug === slug);
  const prev = PAIRS[i - 1];
  const next = PAIRS[i + 1];

  return (
    <article className="docs__article">
      <div className="docs__body">
        <div className="label">{pair.group}</div>
        <h1 className="h1" style={{ marginTop: "var(--s-3)" }}>
          {pair.name}
        </h1>
        <p className="body muted measure" style={{ marginTop: "var(--s-3)" }}>
          {pair.blurb}
        </p>

        <ComparePane pair={pair} />

        <section style={{ marginTop: "var(--s-10)" }}>
          <h2 className="h3" id="what-to-look-at">
            What to look at
          </h2>
          <p className="small muted measure" style={{ marginTop: "var(--s-2)" }}>
            {pair.tell}
          </p>
        </section>

        <nav className="docs__pager" aria-label="Pagination">
          {prev ? (
            <Link href={`/compare/${prev.slug}`} className="label docs__pagerLink">
              ← {prev.name}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`/compare/${next.slug}`} className="label docs__pagerLink">
              {next.name} →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </div>

      <aside className="docs__rail" aria-label="On this page">
        <div className="label">On this page</div>
        <ul className="docs__railList">
          <li>
            <a href="#what-to-look-at" className="docs__railLink">
              What to look at
            </a>
          </li>
        </ul>

        <div className="docs__railCard">
          <div className="label">The controls</div>
          <p className="small muted" style={{ margin: "var(--s-2) 0 0" }}>
            Same prompt, verbatim. Same model. One run was required to use the skill, one was
            denied it. Neither was told a comparison was running.
          </p>
          <p className="small dim" style={{ margin: "var(--s-3) 0 0" }}>
            One caveat worth knowing: a skill&rsquo;s description is injected into every
            agent&rsquo;s skill listing, so the baseline could read the argument even though it
            could not read the files.
          </p>
        </div>
      </aside>
    </article>
  );
}
