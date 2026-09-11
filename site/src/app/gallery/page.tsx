import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/proof/section";
import { Reveal } from "@/components/proof/reveal";
import { BrowserFrame } from "@/components/proof/browser-frame";
import { SHOWCASES } from "@/data/showcases";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Five landing pages, five derived directions. Open one to see it live - real scroll, real motion, nothing standing in for it.",
};

export default function GalleryPage() {
  return (
    <Section>
      <Reveal>
        <h1 className="display text-[clamp(2.25rem,5.5vw,3.75rem)] text-ink">
          Five briefs. Five directions.
        </h1>
        <p className="mt-4 max-w-[62ch] text-[1.0625rem] leading-[1.6] text-ink-muted">
          Every entry is a real landing page, live in the frame below - not a
          screenshot standing in for one. Open one to scroll it yourself.
        </p>
      </Reveal>

      <ul className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {SHOWCASES.map((s, i) => (
          <Reveal as="li" key={s.slug} delay={i * 0.05}>
            <Link href={`/gallery/${s.slug}`} className="group block">
              <BrowserFrame
                slug={s.slug}
                title={s.title}
                aspect="4 / 3"
                compact
                className="transition-colors duration-(--d-fast) group-hover:border-rule-strong"
              />
              <div className="mt-4 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-[1.0625rem] text-ink transition-colors duration-(--d-fast) group-hover:text-mark-text">
                    {s.title}
                  </h2>
                  <p className="mt-1 line-clamp-2 max-w-[40ch] text-[0.8125rem] leading-relaxed text-ink-muted">
                    {s.tagline}
                  </p>
                </div>
                <span className="mt-0.5 shrink-0 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-ink-dim">
                  {s.category}
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
