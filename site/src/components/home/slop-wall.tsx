import Link from "next/link";

/**
 * The slop wall.
 *
 * Eight tells, each drawn as a small labelled fragment rather than described
 * in prose - a callout tag naming the exact pattern, with the replacement
 * underneath. Every fragment and every line of copy here is quoted verbatim
 * from an actual finding in the benchmark; none of it is invented for this
 * section. Each links to the example comparison where the tell shows up.
 */
const TELLS: {
  tag: string;
  replacement: string;
  href: string;
  swatch: React.ReactNode;
}[] = [
  {
    tag: "Gradient mesh hero",
    replacement: "No background treatment - the artifact is the interest",
    href: "/examples/agent-platform-landing",
    swatch: (
      <div
        className="h-full w-full"
        style={{
          background:
            "radial-gradient(120% 120% at 20% 0%, #7c3aed 0%, #4f46e5 45%, #0f172a 100%)",
        }}
      />
    ),
  },
  {
    tag: "Rounded-square icon tiles",
    replacement: "The sequence marker each capability applies at",
    href: "/examples/agent-platform-landing",
    swatch: (
      <div className="flex h-full w-full items-center justify-center gap-2.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-6 rounded-lg"
            style={{ background: "linear-gradient(140deg, #818cf8 0%, #6366f1 100%)" }}
          />
        ))}
      </div>
    ),
  },
  {
    tag: "KPI tiles, coloured delta",
    replacement: "Ruled figures, colour reserved for one meaning",
    href: "/examples/campaign-analytics",
    swatch: (
      <div className="flex h-full w-full items-center justify-center gap-2 px-3">
        {["+1.8%", "-3.1%", "+4.6%"].map((v, i) => (
          <span
            key={v}
            className={
              "rounded-md px-2 py-1 text-[0.625rem] font-semibold " +
              (i === 1 ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600")
            }
          >
            {v}
          </span>
        ))}
      </div>
    ),
  },
  {
    tag: "Shadow-lifted pricing tier",
    replacement: "One ground step and a printed reason",
    href: "/examples/product-page",
    swatch: (
      <div className="flex h-full w-full items-end justify-center gap-2 pb-3">
        <div className="h-8 w-12 rounded-lg bg-plate" />
        <div
          className="h-11 w-12 rounded-lg bg-plate"
          style={{ boxShadow: "0 4px 14px rgb(0 0 0 / 0.22)" }}
        />
        <div className="h-8 w-12 rounded-lg bg-plate" />
      </div>
    ),
  },
  {
    tag: "Avatar + name testimonial",
    replacement: "Attributed by role and system, not a fabricated name",
    href: "/examples/product-page",
    swatch: (
      <div className="flex h-full w-full items-center gap-2 px-3">
        <span className="size-7 shrink-0 rounded-full bg-ink-dim/40" />
        <div className="space-y-1">
          <span className="block h-1.5 w-16 rounded-full bg-ink-dim/50" />
          <span className="block h-1.5 w-10 rounded-full bg-ink-dim/30" />
        </div>
      </div>
    ),
  },
  {
    tag: "Generic FAQ copy",
    replacement: "The actual objections this audience raises",
    href: "/examples/product-page",
    swatch: (
      <div className="flex h-full w-full flex-col justify-center gap-1.5 px-3">
        <span className="text-[0.6875rem] text-ink-muted">Is there a free trial?</span>
        <span className="text-[0.6875rem] text-ink-muted">Can I cancel anytime?</span>
      </div>
    ),
  },
  {
    tag: "Fade-up on scroll, everywhere",
    replacement: "One choreographed moment; the rest just responds",
    href: "/examples/product-page",
    swatch: (
      <div className="flex h-full w-full items-end gap-1.5 px-3 pb-4">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="w-full rounded-t-sm bg-rule-strong"
            style={{ height: "44%" }}
          />
        ))}
      </div>
    ),
  },
  {
    tag: "Four-column link farm footer",
    replacement: "As many columns as there are real destinations",
    href: "/examples/infrastructure-docs",
    swatch: (
      <div className="flex h-full w-full items-center justify-center gap-3 px-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="space-y-1">
            <span className="block h-1 w-6 rounded-full bg-ink-dim/40" />
            <span className="block h-1 w-6 rounded-full bg-ink-dim/25" />
          </div>
        ))}
      </div>
    ),
  },
];

export function SlopWall() {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {TELLS.map((t) => (
        <li key={t.tag}>
          <Link
            href={t.href}
            className="group block overflow-hidden rounded-2xl border border-rule bg-plate transition-colors duration-(--d-fast) hover:border-mark/40"
          >
            <div className="truncate bg-plate-2 px-2.5 py-1.5 text-[0.5625rem] font-semibold uppercase tracking-[0.04em] text-ink-dim">
              {t.tag}
            </div>
            <div className="h-14 w-full overflow-hidden bg-plate-2">{t.swatch}</div>
            <p className="p-2.5 text-[0.6875rem] leading-snug text-ink-muted transition-colors duration-(--d-fast) group-hover:text-ink">
              <span className="font-medium text-mark">Parti: </span>
              {t.replacement}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
