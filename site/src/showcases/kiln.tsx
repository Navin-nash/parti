"use client";

import { Newsreader, Archivo } from "next/font/google";
import { motion, useReducedMotion } from "motion/react";

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-kiln-serif",
});

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-kiln-sans",
});

interface Piece {
  name: string;
  detail: string;
  price: string;
  tone: string;
}

const PIECES: Piece[] = [
  {
    name: "The Kettle Mug",
    detail: "Ash White over reclaimed stoneware, 12 oz",
    price: "$38",
    tone: "#E7E2D8",
  },
  {
    name: "Low Ochre Bowl",
    detail: "Iron-speckled clay, Chalk glaze, 6\" dia.",
    price: "$54",
    tone: "#C9B79A",
  },
  {
    name: "Umber Dinner Plate",
    detail: "Smoked Umber glaze, cone 6 stoneware",
    price: "$46",
    tone: "#6B4A3A",
  },
  {
    name: "Tenmoku Pitcher",
    detail: "Iron-saturated glaze, 1.5 qt capacity",
    price: "$72",
    tone: "#2A2320",
  },
];

/** Concentric throwing-rings mark — the page's one recurring motif. */
function ThrowingRings({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      aria-hidden="true"
    >
      <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.9" />
      <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.7" />
      <circle cx="100" cy="100" r="46" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <circle cx="100" cy="100" r="20" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.35" />
    </svg>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden="true">
      <path d="M3 10h13" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M11 4l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function KilnShowcase() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      data-showcase="kiln"
      className={`kiln-root ${newsreader.variable} ${archivo.variable} min-h-screen w-full overflow-x-hidden`}
      style={{ background: "var(--bg)", color: "var(--ink)" }}
    >
      <style>{`
        [data-showcase="kiln"] {
          --bg: #FAFAF8;
          --bg-tint: #F1EAE2;
          --ink: #17140F;
          --ink-soft: #4A443C;
          --line: #D9D2C6;
          --accent: #B5502E;
          --accent-ink: #FAF6F0;
          font-family: var(--font-kiln-sans), sans-serif;
        }
        [data-showcase="kiln"] .kiln-serif {
          font-family: var(--font-kiln-serif), serif;
        }
        [data-showcase="kiln"] a,
        [data-showcase="kiln"] button {
          transition: color 200ms ease, background-color 200ms ease, border-color 200ms ease;
        }
        [data-showcase="kiln"] a:focus-visible,
        [data-showcase="kiln"] button:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 3px;
          border-radius: 2px;
        }
      `}</style>

      {/* NAV */}
      <header className="border-b" style={{ borderColor: "var(--line)" }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
          <a
            href="#"
            className="kiln-serif text-xl tracking-tight sm:text-2xl"
            style={{ color: "var(--ink)" }}
          >
            Kiln
          </a>
          <nav className="hidden items-center gap-8 text-sm sm:flex" style={{ color: "var(--ink-soft)" }}>
            <a href="#collection" className="hover:opacity-70">Collection</a>
            <a href="#process" className="hover:opacity-70">Process</a>
          </nav>
          <a
            href="#collection"
            className="inline-flex min-h-11 items-center justify-center rounded-sm px-4 py-2.5 text-sm font-medium"
            style={{ background: "var(--ink)", color: "var(--bg)" }}
          >
            Shop the collection
          </a>
        </div>
      </header>

      {/* HERO — asymmetric split */}
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-14 sm:px-8 sm:pb-24 sm:pt-20">
        <div className="grid grid-cols-1 items-end gap-12 lg:grid-cols-12">
          <motion.div
            className="lg:col-span-7"
            initial={reduceMotion ? undefined : { opacity: 0, y: 14 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="mb-5 text-xs uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>
              Fired in small batches, no two alike
            </p>
            <h1 className="kiln-serif text-[2.6rem] leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Tableware thrown one piece at a time.
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed sm:text-lg" style={{ color: "var(--ink-soft)" }}>
              Kiln is a one-room studio making mugs, bowls, and plates from
              reclaimed stoneware — each piece pulled, trimmed, and glazed
              by hand before it ever sees a cone-6 firing.
            </p>
            <motion.a
              href="#collection"
              className="mt-9 inline-flex min-h-12 items-center gap-2 rounded-sm px-6 py-3 text-sm font-medium"
              style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.12 }}
            >
              Shop the collection
              <ArrowIcon className="h-4 w-4" />
            </motion.a>
          </motion.div>

          <div className="relative lg:col-span-5">
            <motion.div
              initial={reduceMotion ? undefined : { opacity: 0, scale: 0.85, rotate: -18 }}
              animate={reduceMotion ? undefined : { opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
              className="mx-auto aspect-square w-full max-w-sm"
              style={{ color: "var(--accent)" }}
            >
              <ThrowingRings className="h-full w-full" />
            </motion.div>
            <div
              role="img"
              aria-label="Photograph of a stack of unglazed stoneware bowls resting on a wooden studio table"
              className="mx-auto -mt-16 aspect-[4/5] w-[70%] rounded-sm"
              style={{
                background: "linear-gradient(160deg, #C9B79A 0%, #8A7458 55%, #4A3B2C 100%)",
              }}
            />
          </div>
        </div>
      </section>

      {/* FEATURED PIECES — left-aligned header, contained grid */}
      <section id="collection" className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="kiln-serif text-3xl sm:text-4xl">The current firing</h2>
          <p className="max-w-xs text-sm" style={{ color: "var(--ink-soft)" }}>
            Forty pieces per batch. When a glaze sells out, it doesn&apos;t
            come back the same way twice.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {PIECES.map((piece, i) => (
            <motion.div
              key={piece.name}
              initial={reduceMotion ? undefined : { opacity: 0 }}
              whileInView={reduceMotion ? undefined : { opacity: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
            >
              <div
                role="img"
                aria-label={`Photograph of the ${piece.name}, glazed stoneware`}
                className="aspect-[4/5] w-full rounded-sm"
                style={{ background: piece.tone }}
              />
              <h3 className="mt-4 text-base font-medium">{piece.name}</h3>
              <p className="mt-1 text-sm" style={{ color: "var(--ink-soft)" }}>{piece.detail}</p>
              <p className="mt-2 text-sm" style={{ color: "var(--accent)" }}>{piece.price}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PROCESS — full-bleed breakout, reversed split, tint background */}
      <section id="process" className="w-full py-16 sm:py-24" style={{ background: "var(--bg-tint)" }}>
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-5 sm:px-8 lg:grid-cols-12 lg:gap-6">
          <motion.div
            className="order-2 lg:order-1 lg:col-span-5"
            initial={reduceMotion ? undefined : { opacity: 0 }}
            whileInView={reduceMotion ? undefined : { opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
          >
            <div
              role="img"
              aria-label="Photograph of a potter's hands centering clay on a wheel, mid-throw"
              className="aspect-[5/6] w-full rounded-sm"
              style={{ background: "linear-gradient(200deg, #B5502E 0%, #6B4A3A 60%, #2A2320 100%)" }}
            />
          </motion.div>
          <motion.div
            className="order-1 lg:order-2 lg:col-span-6 lg:col-start-7"
            initial={reduceMotion ? undefined : { opacity: 0, x: 24 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-xs uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>
              How a piece gets made
            </p>
            <h2 className="kiln-serif mt-4 text-3xl leading-tight sm:text-4xl">
              Every piece passes through the same six hands, twice.
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed" style={{ color: "var(--ink-soft)" }}>
              We wedge and throw a reclaimed stoneware body, trim once
              leather-hard, bisque at 1830°F, then glaze and fire to cone 6 —
              2232°F — in a single top-loading kiln. Nothing is slip-cast.
              Nothing is poured from a mold.
            </p>
            <dl className="mt-8 grid grid-cols-2 gap-6 text-sm sm:max-w-sm">
              <div>
                <dt style={{ color: "var(--ink-soft)" }}>Clay body</dt>
                <dd className="mt-1 font-medium">Reclaimed stoneware</dd>
              </div>
              <div>
                <dt style={{ color: "var(--ink-soft)" }}>Firing temp</dt>
                <dd className="mt-1 font-medium">2232°F, cone 6</dd>
              </div>
            </dl>
          </motion.div>
        </div>
      </section>

      {/* PRESS / TESTIMONIAL — centered narrow column */}
      <section className="mx-auto max-w-3xl px-5 py-16 text-center sm:px-8 sm:py-24">
        <motion.blockquote
          initial={reduceMotion ? undefined : { opacity: 0 }}
          whileInView={reduceMotion ? undefined : { opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9 }}
        >
          <p className="kiln-serif text-2xl italic leading-snug sm:text-3xl">
            &ldquo;The kind of stoneware you buy expecting to use once, and
            then use every single day instead.&rdquo;
          </p>
          <footer className="mt-5 text-sm" style={{ color: "var(--ink-soft)" }}>
            Kinfolk Table Notes
          </footer>
        </motion.blockquote>
      </section>

      {/* SECOND CTA — centered, accent band */}
      <section className="w-full py-16 text-center sm:py-20" style={{ background: "var(--ink)" }}>
        <motion.div
          className="mx-auto max-w-xl px-5 sm:px-8"
          initial={reduceMotion ? undefined : { opacity: 0, scale: 0.97 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="kiln-serif text-3xl sm:text-4xl" style={{ color: "var(--bg)" }}>
            The next firing opens Thursday.
          </h2>
          <p className="mx-auto mt-4 max-w-sm text-sm" style={{ color: "#C9C2B4" }}>
            Batches sell out within a day. Join the notice list and we&apos;ll
            write once, the morning the kiln opens.
          </p>
          <motion.a
            href="#collection"
            className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-sm px-6 py-3 text-sm font-medium"
            style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.12 }}
          >
            Shop the collection
            <ArrowIcon className="h-4 w-4" />
          </motion.a>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="border-t" style={{ borderColor: "var(--line)" }}>
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-8" style={{ color: "var(--ink-soft)" }}>
          <span className="kiln-serif" style={{ color: "var(--ink)" }}>Kiln Stoneware Co.</span>
          <div className="flex flex-wrap gap-6">
            <a href="#collection" className="hover:opacity-70">Collection</a>
            <a href="#process" className="hover:opacity-70">Process</a>
            <a href="#" className="hover:opacity-70">Care Guide</a>
            <a href="#" className="hover:opacity-70">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
