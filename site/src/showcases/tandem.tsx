"use client";

import type { CSSProperties } from "react";
import { Onest, Inter } from "next/font/google";
import { motion, useReducedMotion } from "motion/react";

const onest = Onest({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-tandem-head",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-tandem-body",
});

interface Step {
  n: string;
  title: string;
  body: string;
}

const STEPS: Step[] = [
  {
    n: "01",
    title: "Say what you're learning, and how far along you are",
    body: "Not a placement test — just your own honest guess. Beginner, can-order-food, or can-argue-about-films. It's how we find someone at a workable level, not a perfect one.",
  },
  {
    n: "02",
    title: "We match you with someone learning your language back",
    body: "They're learning what you speak natively, and you're learning what they speak natively. You each get to be the expert for half the conversation.",
  },
  {
    n: "03",
    title: "You talk for 20 minutes, on video, audio, or text",
    body: "Your camera stays off if you want it off. A quiet topic prompt sits in the corner the whole time, in case it goes silent.",
  },
  {
    n: "04",
    title: "Rate the session in ten seconds, then you're done",
    body: "One tap: easy, about right, or tough. That's the only thing we use to match you closer to your level next time.",
  },
];

interface Moment {
  speaker: "you" | "partner";
  text: string;
}

const MOMENTS: Moment[] = [
  { speaker: "you", text: "How do you say ‘I'm starving’ — like actually starving, not just polite-hungry?" },
  { speaker: "partner", text: "Ha — we'd say ‘me muero de hambre.’ I'm dying of hunger. Dramatic, but that's how everyone says it." },
  { speaker: "partner", text: "You can switch to English for a second if you need to. Happens almost every session." },
  { speaker: "you", text: "Okay wait, say that last sentence again but slower" },
];

interface IconProps {
  className?: string;
  style?: CSSProperties;
}

function TandemMark({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 48 32" className={className} style={style} aria-hidden="true">
      <circle cx="18" cy="16" r="13" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="30" cy="16" r="13" fill="var(--accent)" fillOpacity="0.92" />
    </svg>
  );
}

function ArrowIcon({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" className={className} style={style} aria-hidden="true">
      <path d="M3 10h13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M11 4l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ClockIcon({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" className={className} style={style} aria-hidden="true">
      <circle cx="10" cy="10" r="7.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10 6v4.3l3 2" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ExitIcon({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" className={className} style={style} aria-hidden="true">
      <path d="M8 3.5H4.5v13H8" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 10h8m0 0-3-3m3 3-3 3" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ShieldIcon({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" className={className} style={style} aria-hidden="true">
      <path d="M10 2.5 16 5v5c0 4-2.7 6.4-6 7.5C6.7 16.4 4 14 4 10V5l6-2.5Z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

/** Three-dot arrival motif — plays once when it enters view, then holds. */
function TypingDots({ dark = false }: { dark?: boolean }) {
  const reduceMotion = useReducedMotion();
  return (
    <span className="inline-flex items-center gap-1" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="inline-block h-2 w-2 rounded-full"
          style={{ background: dark ? "var(--ink-soft-inverse)" : "var(--ink-soft)" }}
          initial={reduceMotion ? undefined : { opacity: 0.25, y: 0 }}
          animate={reduceMotion ? undefined : { opacity: [0.25, 1, 0.4], y: [0, -3, 0] }}
          transition={{ duration: 0.9, delay: 0.15 * i, times: [0, 0.5, 1] }}
        />
      ))}
    </span>
  );
}

export default function TandemShowcase() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      data-showcase="tandem"
      className={`tandem-root ${onest.variable} ${inter.variable} min-h-screen w-full overflow-x-hidden`}
      style={{ background: "var(--bg)", color: "var(--ink)" }}
    >
      <style>{`
        /* Bright: a vivid coral ground and a real plum ink - no white, no
           black anywhere. Cyan carries the CTA pop; yellow tints panels. */
        [data-showcase="tandem"] {
          --bg: #FF8F6B;
          --bg-tint: #FFD666;
          --ink: #3D1B4E;
          --ink-soft: #543461;
          --ink-inverse: #FF8F6B;
          --ink-soft-inverse: #C9AFD6;
          --line: #894466;
          --accent: #5EEAD4;
          --accent-ink: #3D1B4E;
          font-family: var(--font-tandem-body), sans-serif;
        }
        [data-showcase="tandem"] .tandem-head {
          font-family: var(--font-tandem-head), sans-serif;
        }
        [data-showcase="tandem"] a,
        [data-showcase="tandem"] button {
          transition: color 200ms ease, background-color 200ms ease, border-color 200ms ease, opacity 200ms ease;
        }
        [data-showcase="tandem"] a:focus-visible,
        [data-showcase="tandem"] button:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 3px;
          border-radius: 4px;
        }
        @media (hover: hover) {
          [data-showcase="tandem"] .tandem-hover-fade:hover { opacity: 0.72; }
          [data-showcase="tandem"] .tandem-hover-lift:hover { transform: translateY(-2px); }
        }
        [data-showcase="tandem"] .tandem-scroll {
          scroll-snap-type: x proximity;
          -webkit-overflow-scrolling: touch;
        }
        [data-showcase="tandem"] .tandem-scroll::-webkit-scrollbar { display: none; }
        [data-showcase="tandem"] .tandem-scroll { scrollbar-width: none; }
        [data-showcase="tandem"] .tandem-snap { scroll-snap-align: start; }
      `}</style>

      {/* NAV */}
      <header className="border-b" style={{ borderColor: "var(--line)" }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <a href="#" className="flex items-center gap-2">
            <TandemMark className="h-6 w-9" style={{ color: "var(--ink)" }} />
            <span className="tandem-head text-lg font-semibold tracking-tight">Tandem</span>
          </a>
          <nav className="hidden items-center gap-8 text-sm sm:flex" style={{ color: "var(--ink-soft)" }}>
            <a href="#how-it-works" className="tandem-hover-fade">How it works</a>
            <a href="#safety" className="tandem-hover-fade">Safety</a>
          </nav>
          <a
            href="#start"
            className="inline-flex min-h-11 items-center justify-center rounded-full px-4 text-sm font-medium sm:px-5"
            style={{ background: "var(--ink)", color: "var(--bg)" }}
          >
            Find a conversation
          </a>
        </div>
      </header>

      {/* HERO — asymmetric split, signature "two people meeting" moment */}
      <section className="mx-auto max-w-6xl px-5 pb-14 pt-12 sm:px-8 sm:pb-20 sm:pt-16">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <motion.div
            className="lg:col-span-7"
            initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="mb-5 text-xs font-medium uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>
              One real person. Twenty real minutes.
            </p>
            <h1 className="tandem-head text-[2.5rem] leading-[1.08] tracking-tight sm:text-6xl lg:text-[4rem]">
              Practice the conversation, not the flashcards.
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed sm:text-lg" style={{ color: "var(--ink-soft)" }}>
              Tandem pairs you with a real stranger for one real 20-minute
              conversation in the language you&apos;re learning. No script,
              no AI voice on the other end &mdash; just two people figuring
              it out together.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <motion.a
                href="#start"
                className="inline-flex min-h-12 items-center gap-2 rounded-full px-6 py-3 text-sm font-medium"
                style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.12 }}
              >
                Find a conversation
                <ArrowIcon className="h-4 w-4" />
              </motion.a>
              <span className="text-sm" style={{ color: "var(--ink-soft)" }}>
                First session&apos;s free. Camera stays off if you want.
              </span>
            </div>
          </motion.div>

          {/* Signature moment: two marks meeting, then a message arrives */}
          <motion.div
            className="lg:col-span-5"
            initial={reduceMotion ? undefined : { opacity: 0 }}
            animate={reduceMotion ? undefined : { opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="rounded-2xl p-7 sm:p-8"
              style={{ background: "var(--bg-tint)", border: "1px solid var(--line)" }}
            >
              <div className="relative flex h-20 items-center justify-center">
                <motion.div
                  className="absolute h-14 w-14 rounded-full"
                  style={{ background: "var(--ink)" }}
                  initial={reduceMotion ? undefined : { x: -46 }}
                  animate={reduceMotion ? undefined : { x: -12 }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                />
                <motion.div
                  className="absolute h-14 w-14 rounded-full"
                  style={{ background: "var(--accent)" }}
                  initial={reduceMotion ? undefined : { x: 46 }}
                  animate={reduceMotion ? undefined : { x: 12 }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
              <motion.p
                className="mt-2 text-center text-xs font-medium uppercase tracking-[0.15em]"
                style={{ color: "var(--ink-soft)" }}
                initial={reduceMotion ? undefined : { opacity: 0 }}
                animate={reduceMotion ? undefined : { opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                Matched in under a minute
              </motion.p>
              <motion.div
                className="mt-5 rounded-xl rounded-bl-sm px-4 py-3"
                style={{ background: "var(--bg)", border: "1px solid var(--line)" }}
                initial={reduceMotion ? undefined : { opacity: 0, y: 8 }}
                animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.1 }}
              >
                <TypingDots />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS — left-indented numbered list, distinct rhythm from hero */}
      <section id="how-it-works" className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
        <h2 className="tandem-head text-3xl sm:text-4xl">How a session actually works</h2>
        <ol className="mt-12 flex flex-col gap-10 sm:mt-16 sm:gap-12">
          {STEPS.map((step, i) => (
            <motion.li
              key={step.n}
              className="grid grid-cols-[3rem_1fr] gap-5 sm:grid-cols-[4rem_1fr] sm:gap-8"
              initial={reduceMotion ? undefined : { opacity: 0, y: 12 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.06 }}
            >
              <span className="tandem-head text-2xl sm:text-3xl" style={{ color: "var(--line)" }}>
                {step.n}
              </span>
              <div>
                <h3 className="text-lg font-semibold sm:text-xl">{step.title}</h3>
                <p className="mt-2 max-w-xl text-base leading-relaxed" style={{ color: "var(--ink-soft)" }}>
                  {step.body}
                </p>
              </div>
            </motion.li>
          ))}
        </ol>
      </section>

      {/* MOMENTS — full-bleed tinted band with a horizontally scrolling row (breaks the container) */}
      <section className="w-full py-16 sm:py-24" style={{ background: "var(--bg-tint)" }}>
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <h2 className="tandem-head text-3xl sm:text-4xl">A few real conversation moments</h2>
          <p className="mt-3 max-w-md text-sm" style={{ color: "var(--ink-soft)" }}>
            Pulled from actual sessions, with names left out. Drag or scroll sideways.
          </p>
        </div>
        <div className="tandem-scroll mt-10 flex gap-4 overflow-x-auto px-5 pb-4 sm:px-8">
          <div className="w-[5vw] shrink-0 sm:w-[calc((100vw-72rem)/2)]" aria-hidden="true" />
          {MOMENTS.map((m, i) => (
            <motion.div
              key={i}
              className="tandem-snap w-[78vw] max-w-xs shrink-0 rounded-2xl px-5 py-4 sm:w-72"
              style={
                m.speaker === "you"
                  ? { background: "var(--ink)", color: "var(--bg)", borderRadius: "18px 18px 4px 18px" }
                  : { background: "var(--bg)", color: "var(--ink)", border: "1px solid var(--line)", borderRadius: "18px 18px 18px 4px" }
              }
              initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <p
                className="text-xs font-medium uppercase tracking-[0.1em]"
                style={{ color: m.speaker === "you" ? "var(--ink-soft-inverse)" : "var(--accent)" }}
              >
                {m.speaker === "you" ? "You, minute 4" : "Your partner, minute 5"}
              </p>
              <p className="mt-2 text-[0.95rem] leading-relaxed">{m.text}</p>
            </motion.div>
          ))}
          <div className="w-[5vw] shrink-0 sm:w-[calc((100vw-72rem)/2)]" aria-hidden="true" />
        </div>
      </section>

      {/* SAFETY / MATCH QUALITY — full-bleed dark band, centered content (new alignment) */}
      <section id="safety" className="w-full py-16 sm:py-24" style={{ background: "var(--ink)", color: "var(--ink-inverse)" }}>
        <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>
            If a conversation goes badly
          </p>
          <h2 className="tandem-head mt-4 text-3xl leading-tight sm:text-4xl">
            You can leave with one tap. No explanation owed.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed" style={{ color: "var(--ink-soft-inverse)" }}>
            Every session ends the moment either person wants it to. Report a
            partner and we review it within 24 hours &mdash; you&apos;re
            rematched right away, no wait. Nothing is recorded, and matches
            are made by the level and goals you set, not at random.
          </p>
          <div className="mx-auto mt-12 grid max-w-2xl grid-cols-1 gap-8 text-left sm:grid-cols-3">
            <motion.div
              initial={reduceMotion ? undefined : { opacity: 0 }}
              whileInView={reduceMotion ? undefined : { opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <ClockIcon className="h-5 w-5" style={{ color: "var(--accent)" }} />
              <p className="mt-3 text-sm font-medium">20 minutes, timed</p>
              <p className="mt-1 text-sm" style={{ color: "var(--ink-soft-inverse)" }}>
                Long enough to get past hello, short enough that leaving never feels rude.
              </p>
            </motion.div>
            <motion.div
              initial={reduceMotion ? undefined : { opacity: 0 }}
              whileInView={reduceMotion ? undefined : { opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.08 }}
            >
              <ExitIcon className="h-5 w-5" style={{ color: "var(--accent)" }} />
              <p className="mt-3 text-sm font-medium">Leave anytime</p>
              <p className="mt-1 text-sm" style={{ color: "var(--ink-soft-inverse)" }}>
                One button. No prompt asking you to explain why.
              </p>
            </motion.div>
            <motion.div
              initial={reduceMotion ? undefined : { opacity: 0 }}
              whileInView={reduceMotion ? undefined : { opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.16 }}
            >
              <ShieldIcon className="h-5 w-5" style={{ color: "var(--accent)" }} />
              <p className="mt-3 text-sm font-medium">Reviewed in 24 hours</p>
              <p className="mt-1 text-sm" style={{ color: "var(--ink-soft-inverse)" }}>
                Reports go to a person, not a queue you never hear back from.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECOND CTA — centered, light, coral used only as a soft glow + button fill */}
      <section id="start" className="relative w-full overflow-hidden py-20 text-center sm:py-28">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-96 sm:w-96"
          style={{ background: "var(--accent)", opacity: 0.35, filter: "blur(60px)" }}
          aria-hidden="true"
        />
        <motion.div
          className="relative mx-auto max-w-xl px-5 sm:px-8"
          initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="tandem-head text-3xl sm:text-4xl">
            Someone&apos;s learning your language right now.
          </h2>
          <p className="mx-auto mt-4 max-w-sm text-sm" style={{ color: "var(--ink-soft)" }}>
            It takes under a minute to get matched. Worst case, it&apos;s an
            awkward twenty minutes. Best case, it&apos;s the first real
            conversation you&apos;ve had in the language.
          </p>
          <motion.a
            href="#"
            className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full px-6 py-3 text-sm font-medium"
            style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.12 }}
          >
            Find a conversation
            <ArrowIcon className="h-4 w-4" />
          </motion.a>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="border-t" style={{ borderColor: "var(--line)" }}>
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-8 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-8" style={{ color: "var(--ink-soft)" }}>
          <a href="#" className="flex items-center gap-2">
            <TandemMark className="h-5 w-7" style={{ color: "var(--ink)" }} />
            <span className="tandem-head font-semibold" style={{ color: "var(--ink)" }}>Tandem</span>
          </a>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <a href="#how-it-works" className="tandem-hover-fade">How it works</a>
            <a href="#safety" className="tandem-hover-fade">Safety</a>
            <a href="#" className="tandem-hover-fade">Privacy</a>
            <a href="#" className="tandem-hover-fade">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
