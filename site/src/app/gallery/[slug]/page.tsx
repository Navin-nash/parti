import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Section } from "@/components/proof/section";
import { Reveal } from "@/components/proof/reveal";
import { BrowserFrame } from "@/components/proof/browser-frame";
import { SHOWCASES, showcaseBySlug, showcaseSlugs } from "@/data/showcases";
import { ArrowLeft, ArrowRight, ExternalLink } from "@/lib/icons";

export function generateStaticParams() {
  return showcaseSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/gallery/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const s = showcaseBySlug(slug);
  if (!s) return {};
  return { title: s.title, description: s.tagline };
}

export default async function GalleryEntryPage({ params }: PageProps<"/gallery/[slug]">) {
  const { slug } = await params;
  const showcase = showcaseBySlug(slug);
  if (!showcase) notFound();

  const i = SHOWCASES.findIndex((s) => s.slug === showcase.slug);
  const prev = SHOWCASES[(i - 1 + SHOWCASES.length) % SHOWCASES.length];
  const next = SHOWCASES[(i + 1) % SHOWCASES.length];

  return (
    <>
      <Section>
        <Reveal>
          <div className="mb-4 flex items-center justify-between gap-3">
            <span className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-mark-text">
              {showcase.category}
            </span>
            <a
              href={`/preview/${showcase.slug}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-[0.8125rem] text-ink-muted transition-colors duration-(--d-fast) hover:text-ink"
            >
              Open full screen
              <ExternalLink className="size-3.5" aria-hidden />
            </a>
          </div>
          <h1 className="display max-w-[24ch] text-[clamp(2rem,4.5vw,3.25rem)] text-ink">
            {showcase.title}
          </h1>
          <p className="mt-3 max-w-[62ch] text-[1.0625rem] leading-[1.6] text-ink-muted">
            {showcase.tagline}
          </p>
        </Reveal>
      </Section>

      <Section bleed>
        <div className="px-4 sm:px-6 lg:px-8">
          <Reveal>
            <BrowserFrame slug={showcase.slug} title={showcase.title} />
          </Reveal>
        </div>
      </Section>

      <nav
        aria-label="More from the gallery"
        className="mx-auto grid max-w-[1400px] grid-cols-2 gap-4 px-4 py-10 sm:px-6 lg:px-8"
      >
        <Link
          href={`/gallery/${prev.slug}`}
          className="group flex items-center gap-3 border border-rule p-5 transition-colors duration-(--d-fast) hover:bg-plate-2"
        >
          <ArrowLeft className="size-4 shrink-0 text-ink-dim transition-transform duration-(--d-base) group-hover:-translate-x-0.5" aria-hidden />
          <span className="min-w-0">
            <span className="block text-[0.75rem] text-ink-dim">Previous</span>
            <span className="block truncate text-[0.9375rem] text-ink">{prev.title}</span>
          </span>
        </Link>
        <Link
          href={`/gallery/${next.slug}`}
          className="group flex items-center justify-end gap-3 border border-rule p-5 text-right transition-colors duration-(--d-fast) hover:bg-plate-2"
        >
          <span className="min-w-0">
            <span className="block text-[0.75rem] text-ink-dim">Next</span>
            <span className="block truncate text-[0.9375rem] text-ink">{next.title}</span>
          </span>
          <ArrowRight className="size-4 shrink-0 text-ink-dim transition-transform duration-(--d-base) group-hover:translate-x-0.5" aria-hidden />
        </Link>
      </nav>
    </>
  );
}
