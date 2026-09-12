"use client";

import { Source_Serif_4, Public_Sans } from "next/font/google";
import { motion, useReducedMotion, type Transition, type TargetAndTransition } from "motion/react";

type RevealProps = {
  initial: TargetAndTransition;
  whileInView: TargetAndTransition;
  viewport: { once: boolean; margin?: string };
  transition: Transition;
};

const serif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-undertow-serif",
});

const sans = Public_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-undertow-sans",
});

const MOON_PHASES = [
  { label: "New", lit: 0 },
  { label: "Waxing crescent", lit: 0.25 },
  { label: "First quarter", lit: 0.5 },
  { label: "Waxing gibbous", lit: 0.75 },
  { label: "Full", lit: 1 },
  { label: "Waning gibbous", lit: 0.75 },
  { label: "Last quarter", lit: 0.5 },
  { label: "Waning crescent", lit: 0.25 },
];

/**
 * Decorative moon glyph built from two overlapping circles — no icon
 * library, matches the "signature element" constraint.
 */
function MoonGlyph({ lit, clipId }: { lit: number; clipId: string }) {
  const offset = 18 - lit * 36;
  return (
    <svg viewBox="0 0 36 36" width="22" height="22" aria-hidden="true">
      <circle cx="18" cy="18" r="15" fill="var(--ink)" opacity="0.12" />
      <circle cx={18 + offset} cy="18" r="15" fill="var(--ink)" />
      <clipPath id={clipId}>
        <circle cx="18" cy="18" r="15" />
      </clipPath>
      <circle
        cx="18"
        cy="18"
        r="15"
        fill="var(--bg)"
        clipPath={`url(#${clipId})`}
        opacity={lit === 0 || lit === 1 ? 0 : 1}
        transform={`translate(${lit < 0.5 ? -3 : 3} 0)`}
      />
    </svg>
  );
}

function WaveGlyph() {
  return (
    <svg viewBox="0 0 28 16" width="28" height="16" aria-hidden="true">
      <path
        d="M1 8c2.5-4 5.5-4 8 0s5.5 4 8 0 5.5-4 8 0"
        stroke="var(--accent)"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function ArrowGlyph() {
  return (
    <svg viewBox="0 0 20 12" width="18" height="11" aria-hidden="true">
      <path
        d="M1 6h17M12 1l6 5-6 5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

const NAV_LINKS = [
  { label: "The practice", href: "#practice" },
  { label: "A sample session", href: "#session" },
];

const FOOTER_LINKS = [
  { label: "Privacy", href: "#" },
  { label: "The tide almanac", href: "#" },
  { label: "Support", href: "#" },
  { label: "For clinicians", href: "#" },
];

export default function UndertowShowcase() {
  const reduceMotion = useReducedMotion();

  const fadeUp = (distance = 16, duration = 0.6): RevealProps =>
    reduceMotion
      ? { initial: { opacity: 0 }, whileInView: { opacity: 1 }, viewport: { once: true }, transition: { duration: 0.3 } }
      : {
          initial: { opacity: 0, y: distance },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-80px" },
          transition: { duration, ease: [0.22, 0.61, 0.36, 1] },
        };

  const fadeOnly = (duration = 0.7): RevealProps =>
    reduceMotion
      ? { initial: { opacity: 0 }, whileInView: { opacity: 1 }, viewport: { once: true }, transition: { duration: 0.3 } }
      : {
          initial: { opacity: 0 },
          whileInView: { opacity: 1 },
          viewport: { once: true, margin: "-80px" },
          transition: { duration, ease: "easeOut" },
        };

  return (
    <div data-showcase="undertow" className={`${serif.variable} ${sans.variable} undertow-root`}>
      <style>{`
        [data-showcase="undertow"] {
          --bg: #FAF8F3;
          --bg-tint: #F1EFE7;
          --ink: #1B1B1D;
          --ink-soft: #4B4B4E;
          --ink-faint: #86858A;
          --accent: #48548C;
          --accent-soft: #48548C1A;
          --line: #DEDAD0;
          font-family: var(--font-undertow-sans), ui-sans-serif, system-ui, sans-serif;
          background: var(--bg);
          color: var(--ink);
        }
        [data-showcase="undertow"] h1,
        [data-showcase="undertow"] h2,
        [data-showcase="undertow"] h3,
        [data-showcase="undertow"] .u-serif {
          font-family: var(--font-undertow-serif), Georgia, serif;
          font-weight: 500;
          letter-spacing: -0.01em;
        }
        [data-showcase="undertow"] a:focus-visible,
        [data-showcase="undertow"] button:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 3px;
          border-radius: 2px;
        }
        [data-showcase="undertow"] .u-container {
          max-width: 40rem;
          margin: 0 auto;
          padding: 0 1.5rem;
        }
      `}</style>

      {/* NAV */}
      <header className="w-full border-b" style={{ borderColor: "var(--line)" }}>
        <div className="u-container flex items-center justify-between py-5">
          <a
            href="#"
            className="u-serif text-lg tracking-tight"
            style={{ color: "var(--ink)" }}
          >
            Undertow
          </a>
          <nav className="hidden items-center gap-8 sm:flex" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm"
                style={{ color: "var(--ink-soft)" }}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <a
            href="#start"
            className="inline-flex min-h-[44px] items-center rounded-full px-5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ background: "var(--accent)" }}
          >
            Begin
          </a>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="u-container pb-16 pt-16 sm:pb-24 sm:pt-24">
          <motion.p
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="mb-6 text-sm uppercase tracking-[0.18em]"
            style={{ color: "var(--accent)" }}
          >
            An app for the last hour of the day
          </motion.p>

          <motion.h1
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="text-4xl leading-[1.1] sm:text-5xl"
          >
            Some nights don&apos;t need fixing. They need a shoreline.
          </motion.h1>

          <motion.p
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.25 }}
            className="mt-6 max-w-md text-base leading-relaxed sm:text-lg"
            style={{ color: "var(--ink-soft)" }}
          >
            Undertow is a wind-down practice for people who&apos;d rather read a tide
            chart than count sheep. Short readings, slow breathing, and a nightly
            record of where the water stood.
          </motion.p>

          <motion.div
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            className="mt-9"
          >
            <motion.a
              href="#start"
              id="start"
              whileTap={reduceMotion ? undefined : { scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full px-6 text-base font-medium text-white"
              style={{ background: "var(--accent)" }}
            >
              Start winding down
              <ArrowGlyph />
            </motion.a>
          </motion.div>

          {/* Signature moment: a tide line drawing itself, slowly. */}
          <div className="mt-16 sm:mt-20" aria-hidden="true">
            <svg viewBox="0 0 640 120" width="100%" height="90" preserveAspectRatio="none">
              <motion.path
                d="M0 70 C 40 30, 90 30, 130 60 S 210 100, 260 70 S 340 30, 390 55 S 470 95, 520 65 S 600 35, 640 55"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="1.5"
                strokeLinecap="round"
                initial={reduceMotion ? { opacity: 1 } : { pathLength: 0, opacity: 0.8 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={reduceMotion ? { duration: 0 } : { duration: 2.6, ease: [0.34, 0.02, 0.16, 1], delay: 0.6 }}
              />
              <line x1="0" y1="96" x2="640" y2="96" stroke="var(--line)" strokeWidth="1" />
            </svg>
            <p className="mt-2 text-xs" style={{ color: "var(--ink-faint)" }}>
              High water, Tuesday — read at 10:47pm
            </p>
          </div>
        </section>

        {/* APPROACH */}
        <section id="practice" className="border-t" style={{ borderColor: "var(--line)" }}>
          <div className="u-container grid gap-10 py-16 sm:py-20 md:grid-cols-[1.1fr_0.9fr] md:gap-16">
            <motion.div {...fadeUp(18, 0.6)}>
              <h2 className="text-2xl sm:text-3xl">Not a countdown. A place to arrive.</h2>
              <p className="mt-5 leading-relaxed" style={{ color: "var(--ink-soft)" }}>
                Most sleep apps race you toward unconsciousness — timers, scores,
                streaks. Undertow works the other way. Each night opens with a short
                piece of writing about tides, weather, or the moon, then eases into
                breath. Nothing is timed against you. Nothing is gamified. The goal
                isn&apos;t to fall asleep fast — it&apos;s to stop needing to.
              </p>
            </motion.div>
            <motion.div
              {...fadeOnly(0.8)}
              className="flex flex-col justify-center gap-4 rounded-2xl p-6 sm:p-8"
              style={{ background: "var(--bg-tint)" }}
            >
              <div className="flex items-center gap-3">
                <WaveGlyph />
                <span className="text-sm" style={{ color: "var(--ink-soft)" }}>
                  Average session
                </span>
              </div>
              <p className="u-serif text-3xl">11 minutes</p>
              <p className="text-sm" style={{ color: "var(--ink-faint)" }}>
                Reading, then breath, then quiet — no clock on screen.
              </p>
            </motion.div>
          </div>
        </section>

        {/* SAMPLE SESSION */}
        <section id="session" className="border-t" style={{ borderColor: "var(--line)" }}>
          <div className="u-container py-16 sm:py-20">
            <motion.h2 {...fadeUp(0, 0.5)} className="text-2xl sm:text-3xl">
              What tonight looks like
            </motion.h2>

            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "A short reading",
                  body: "Two or three minutes on slack water, a lighthouse keeper’s log, or how ice forms on a still lake.",
                },
                {
                  step: "02",
                  title: "Guided breath",
                  body: "A pace modeled on wave sets — longer exhale than inhale, nothing counted aloud.",
                },
                {
                  step: "03",
                  title: "The tide log",
                  body: "One line, written or spoken, about where you are tonight. Tomorrow you can read the week back.",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.step}
                  {...fadeUp(14, 0.5)}
                  transition={reduceMotion ? { duration: 0.3 } : { duration: 0.5, ease: "easeOut", delay: i * 0.12 }}
                  className="rounded-xl border p-6"
                  style={{ borderColor: "var(--line)" }}
                >
                  <span className="text-xs" style={{ color: "var(--accent)" }}>
                    {item.step}
                  </span>
                  <h3 className="mt-2 text-lg">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--ink-soft)" }}>
                    {item.body}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Breathing motif — the one restrained ambient loop on the page */}
            <div className="mt-14 flex items-center justify-center">
              <div className="relative flex h-36 w-36 items-center justify-center">
                <motion.div
                  className="absolute rounded-full"
                  style={{ width: "100%", height: "100%", background: "var(--accent-soft)" }}
                  animate={reduceMotion ? undefined : { scale: [1, 1.08, 1] }}
                  transition={reduceMotion ? undefined : { duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
                  aria-hidden="true"
                />
                <div
                  className="relative rounded-full"
                  style={{ width: "58%", height: "58%", background: "var(--accent)" }}
                  role="img"
                  aria-label="Breathing pace indicator, expanding and contracting slowly"
                />
              </div>
            </div>
          </div>
        </section>

        {/* MOON PHASES */}
        <section className="border-t" style={{ borderColor: "var(--line)" }}>
          <div className="u-container py-16 sm:py-20">
            <motion.div {...fadeOnly(0.6)} className="max-w-md">
              <h2 className="text-2xl sm:text-3xl">A rhythm longer than a week</h2>
              <p className="mt-4 leading-relaxed" style={{ color: "var(--ink-soft)" }}>
                Undertow quietly tracks the moon alongside your nights. Not as
                astrology — as a slower clock to notice by, underneath the one on
                your phone.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              variants={
                reduceMotion
                  ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.3 } } }
                  : { hidden: {}, show: { transition: { staggerChildren: 0.09 } } }
              }
              className="mt-10 flex flex-wrap items-center gap-6 sm:gap-8"
            >
              {MOON_PHASES.map((phase, i) => (
                <motion.div
                  key={`${phase.label}-${i}`}
                  variants={
                    reduceMotion
                      ? { hidden: { opacity: 0 }, show: { opacity: 1 } }
                      : { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.5, ease: "easeOut" } } }
                  }
                  className="flex flex-col items-center gap-2"
                >
                  <MoonGlyph lit={phase.lit} clipId={`moon-clip-${i}`} />
                  <span className="text-center text-[11px]" style={{ color: "var(--ink-faint)" }}>
                    {phase.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* TESTIMONIAL — breaks the container width */}
        <section className="border-t" style={{ borderColor: "var(--line)", background: "var(--bg-tint)" }}>
          <motion.div
            {...fadeOnly(0.8)}
            className="mx-auto max-w-3xl px-6 py-20 text-center sm:py-28"
          >
            <p className="u-serif text-xl leading-relaxed sm:text-2xl">
              &ldquo;I stopped dreading eleven o&apos;clock. I look forward to the
              reading now more than the sleep.&rdquo;
            </p>
            <p className="mt-6 text-sm" style={{ color: "var(--ink-faint)" }}>
              A person who used to keep the news on until 1am
            </p>
          </motion.div>
        </section>

        {/* SECOND CTA */}
        <section className="border-t" style={{ borderColor: "var(--line)" }}>
          <div className="u-container flex flex-col items-center gap-6 py-20 text-center sm:py-24">
            <motion.h2 {...fadeUp(20, 0.6)} className="max-w-sm text-3xl sm:text-4xl">
              Put the phone down at the same place, every night.
            </motion.h2>
            <motion.div {...fadeOnly(0.6)}>
              <motion.a
                href="#start"
                whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full px-6 text-base font-medium text-white"
                style={{ background: "var(--accent)" }}
              >
                Start winding down
                <ArrowGlyph />
              </motion.a>
            </motion.div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t" style={{ borderColor: "var(--line)" }}>
        <div className="u-container flex flex-col gap-4 py-10 text-sm sm:flex-row sm:items-center sm:justify-between">
          <span style={{ color: "var(--ink-faint)" }}>&copy; Undertow. Read gently.</span>
          <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Footer">
            {FOOTER_LINKS.map((link) => (
              <a key={link.label} href={link.href} style={{ color: "var(--ink-soft)" }}>
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}
