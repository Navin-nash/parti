"use client";

import type { CSSProperties } from "react";
import { Archivo, Space_Grotesk } from "next/font/google";
import { motion, useReducedMotion } from "motion/react";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["500", "700", "800", "900"],
  variable: "--font-datum-display",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-datum-sans",
});

interface Project {
  index: string;
  name: string;
  typology: string;
  location: string;
  year: string;
}

const PROJECTS: Project[] = [
  { index: "01", name: "Two Rivers Institute", typology: "Cultural", location: "Lowell, MA", year: "2024" },
  { index: "02", name: "Stanhope Yard", typology: "Mixed-Use", location: "Glasgow, UK", year: "2023" },
  { index: "03", name: "Quarry Line Pavilion", typology: "Civic", location: "Bloomington, IN", year: "2022" },
  { index: "04", name: "Meridian Works", typology: "Adaptive Reuse", location: "Chicago, IL", year: "2021" },
  { index: "05", name: "North Slip Housing", typology: "Residential", location: "Portland, OR", year: "2020" },
];

interface Frame {
  name: string;
  note: string;
  tone: string;
}

const FRAMES: Frame[] = [
  { name: "Two Rivers Institute", note: "Board-formed concrete, north light", tone: "linear-gradient(155deg, #E7E5E0 0%, #9A968C 60%, #2A2926 100%)" },
  { name: "Stanhope Yard", note: "Reclaimed brick over a steel frame", tone: "linear-gradient(155deg, #D8D3C8 0%, #6B655A 55%, #17140F 100%)" },
  { name: "Quarry Line Pavilion", note: "Local limestone, dry-stacked", tone: "linear-gradient(155deg, #EDEAE3 0%, #B7AE9C 55%, #4A443A 100%)" },
  { name: "North Slip Housing", note: "Cedar rainscreen, weathered silver", tone: "linear-gradient(155deg, #E2DED5 0%, #8B8378 55%, #211F1B 100%)" },
];

interface ApproachStep {
  index: string;
  title: string;
  body: string;
}

const APPROACH: ApproachStep[] = [
  { index: "01", title: "Survey the site first.", body: "Topography, sun angle, and the neighbors already there decide more than the brief does." },
  { index: "02", title: "Section before elevation.", body: "We draw how a building sits in the ground before we draw how it looks from the street." },
  { index: "03", title: "One material, honestly used.", body: "A building should read its structure. We choose one primary material and let it carry the load, visibly." },
  { index: "04", title: "Daylight is structural.", body: "Openings are sized from a daylight model, not a window schedule. Light is load-bearing here." },
];

const PRESS: string[] = ["Site & Section", "The Plan Review", "Drawn Quarterly", "Fabric Journal", "Ground Truth"];

const CLIENTS: string[] = [
  "Overlook Land Trust",
  "Cedar Fork Development",
  "Bellwether Housing Partners",
  "Innes County Parks Department",
];

/** Arrow used on CTAs — a drafting-style leader, not a stock chevron. */
function LeaderArrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden="true">
      <path d="M3 10h13" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M11 4l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** North-point mark, the kind stamped in the corner of a site plan. */
function NorthPoint({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 40 40" className={className} style={style} aria-hidden="true">
      <circle cx="20" cy="20" r="17" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <path d="M20 6l5 14-5-3.5-5 3.5z" fill="currentColor" />
    </svg>
  );
}

/**
 * The signature drawing: a building footprint on its site, drawn in a single
 * stroke like a hand tracing a plan. The property line and dimension ticks
 * are static context; the footprint itself is the line that draws in.
 */
function SitePlan({ animate }: { animate: boolean }) {
  return (
    <svg viewBox="0 0 400 340" className="h-full w-full" aria-hidden="true">
      {/* property boundary */}
      <rect x="24" y="20" width="352" height="260" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5 5" opacity="0.45" />

      {/* footprint — the line that draws itself in */}
      <motion.path
        d="M70 240 L70 90 L190 90 L190 150 L330 150 L330 240 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="miter"
        initial={animate ? { pathLength: 0 } : undefined}
        animate={animate ? { pathLength: 1 } : undefined}
        transition={{ duration: 1.8, ease: [0.65, 0, 0.35, 1] }}
      />

      {/* courtyard trees */}
      <circle cx="240" cy="205" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
      <circle cx="262" cy="218" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />

      {/* dimension line */}
      <path d="M70 262v10M330 262v10M70 267h260" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6" />

      {/* red-line annotation — the one mark of color on the whole drawing */}
      <circle cx="190" cy="90" r="4.5" fill="none" stroke="#C81E2C" strokeWidth="2" />
      <path d="M194 86l14-12" stroke="#C81E2C" strokeWidth="1.5" />
      <text x="210" y="72" fontSize="11" fill="#C81E2C" fontFamily="var(--font-datum-sans), sans-serif" fontWeight="700">
        A — revised setback
      </text>
    </svg>
  );
}

export default function DatumShowcase() {
  const reduceMotion = useReducedMotion();
  const animateLine = !reduceMotion;

  return (
    <div
      data-showcase="datum"
      className={`datum-root ${archivo.variable} ${spaceGrotesk.variable} min-h-screen w-full overflow-x-hidden`}
      style={{ background: "var(--bg)", color: "var(--ink)" }}
    >
      <style>{`
        /* Brutalism: raw hazard-yellow ground, ink-navy structure, no white or
           black anywhere - the "paper" is mustard, the "black" is a real navy. */
        [data-showcase="datum"] {
          --bg: #E8B923;
          --bg-alt: #D8CBAE;
          --ink: #1B2A4A;
          --ink-soft: #3E4D6F;
          --ink-invert: #E8B923;
          --ink-invert-soft: #A8B3C9;
          --line: #1B2A4A;
          --line-invert: #E8B923;
          --accent: #C81E2C;
          --shadow: 6px 6px 0 0 var(--ink);
          --shadow-invert: 6px 6px 0 0 var(--ink-invert);
          font-family: var(--font-datum-sans), sans-serif;
        }
        [data-showcase="datum"] .datum-display {
          font-family: var(--font-datum-display), sans-serif;
          font-weight: 800;
          letter-spacing: -0.01em;
        }
        [data-showcase="datum"] .datum-label {
          font-family: var(--font-datum-sans), sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.16em;
        }
        [data-showcase="datum"] a,
        [data-showcase="datum"] button {
          transition: color 120ms ease, background-color 120ms ease, border-color 120ms ease, transform 120ms ease, box-shadow 120ms ease;
        }
        [data-showcase="datum"] a:focus-visible,
        [data-showcase="datum"] button:focus-visible {
          outline: 3px solid var(--accent);
          outline-offset: 3px;
        }
        /* The one interaction motif: a block sits offset from its own hard
           shadow, and presses flat into it - the shadow doesn't move, the
           block does. Raw and mechanical, not a soft scale-down. */
        [data-showcase="datum"] .datum-block {
          box-shadow: var(--shadow);
        }
        [data-showcase="datum"] .datum-block:active {
          transform: translate(6px, 6px);
          box-shadow: 0 0 0 0 var(--ink);
        }
      `}</style>

      {/* NAV */}
      <header className="border-b-2" style={{ borderColor: "var(--line)" }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
          <a href="#" className="datum-display text-xl sm:text-2xl" style={{ color: "var(--ink)" }}>
            DATUM
          </a>
          <nav className="hidden items-center gap-8 datum-label text-xs sm:flex" style={{ color: "var(--ink-soft)" }}>
            <a href="#work" className="hover:opacity-70">Work</a>
            <a href="#studio" className="hover:opacity-70">Studio</a>
          </nav>
          <a
            href="#contact"
            className="datum-block inline-flex min-h-11 items-center justify-center border-2 px-4 py-2.5 datum-label text-xs"
            style={{ borderColor: "var(--ink)", color: "var(--ink)", background: "var(--bg-alt)" }}
          >
            Start a project
          </a>
        </div>
      </header>

      {/* HERO — asymmetric, drawing sheet on the right */}
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-14 sm:px-8 sm:pb-24 sm:pt-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <motion.div
            className="lg:col-span-7"
            initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="mb-5 datum-label text-xs" style={{ color: "var(--accent)" }}>
              Spatial design &amp; architecture — est. 2011
            </p>
            <h1 className="datum-display text-[clamp(2.5rem,6vw+1rem,5.75rem)] leading-[0.98]">
              The site draws the plan.
            </h1>
            <p className="mt-7 max-w-md text-base leading-relaxed sm:text-lg" style={{ color: "var(--ink-soft)" }}>
              Datum is a sixteen-person studio working from competition stage
              through construction administration — for institutions and
              developers who read a section before they read a rendering.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-6">
              <motion.a
                href="#work"
                className="datum-block inline-flex min-h-12 items-center gap-2 border-2 px-6 py-3 datum-label text-xs"
                style={{ background: "var(--ink)", color: "var(--ink-invert)", borderColor: "var(--ink)" }}
                whileTap={{ scale: 1 }}
                transition={{ duration: 0.12 }}
              >
                View the work
                <LeaderArrow className="h-4 w-4" />
              </motion.a>
              <span className="datum-label text-[11px]" style={{ color: "var(--ink-soft)" }}>
                41.8240° N, 71.4128° W
              </span>
            </div>
          </motion.div>

          <motion.div
            className="lg:col-span-5"
            initial={reduceMotion ? undefined : { opacity: 0 }}
            animate={reduceMotion ? undefined : { opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.1 }}
          >
            <div className="datum-block border-2 p-4" style={{ borderColor: "var(--line)", background: "var(--bg-alt)" }}>
              <div className="flex items-center justify-between">
                <span className="datum-label text-[10px]" style={{ color: "var(--ink-soft)" }}>Site plan — north courtyard</span>
                <NorthPoint className="h-6 w-6" style={{ color: "var(--ink-soft)" }} />
              </div>
              <div className="mt-3 aspect-[10/8.5] w-full" style={{ color: "var(--ink)" }}>
                <SitePlan animate={animateLine} />
              </div>
              <div className="mt-3 flex items-center justify-between border-t-2 pt-3 datum-label text-[10px]" style={{ borderColor: "var(--line)", color: "var(--ink-soft)" }}>
                <span>SHEET A-101</span>
                <span>SCALE 1:200</span>
                <span>REV 03</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PROJECT INDEX — a schedule, not a card grid */}
      <section id="work" className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="flex flex-col gap-3 border-b-2 pb-6 sm:flex-row sm:items-end sm:justify-between" style={{ borderColor: "var(--line)" }}>
          <h2 className="datum-display text-3xl sm:text-4xl">Project index</h2>
          <p className="max-w-xs text-sm" style={{ color: "var(--ink-soft)" }}>
            Selected work, 2020 to present. Full portfolio available on request.
          </p>
        </div>

        <ul>
          {PROJECTS.map((project, i) => (
            <motion.li
              key={project.name}
              initial={reduceMotion ? undefined : { opacity: 0, x: -12 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="border-b-2"
              style={{ borderColor: "var(--line)" }}
            >
              <a
                href="#"
                className="group flex min-h-[44px] flex-col gap-1 py-5 pl-4 sm:flex-row sm:items-baseline sm:gap-6"
                style={{ borderLeft: "4px solid transparent" }}
              >
                <span className="datum-label text-xs" style={{ color: "var(--accent)" }}>{project.index}</span>
                <span className="datum-display flex-1 text-xl group-hover:opacity-70 sm:text-2xl">{project.name}</span>
                <span className="datum-label text-xs" style={{ color: "var(--ink-soft)" }}>{project.typology}</span>
                <span className="datum-label text-xs" style={{ color: "var(--ink-soft)" }}>{project.location}</span>
                <span className="datum-label text-xs" style={{ color: "var(--ink-soft)" }}>{project.year}</span>
              </a>
            </motion.li>
          ))}
        </ul>
      </section>

      {/* FULL-BLEED FRAME STRIP — breaks the container width */}
      <section className="w-full py-12 sm:py-16" style={{ background: "var(--bg-alt)" }}>
        <p className="mx-auto max-w-6xl px-5 datum-label text-xs sm:px-8" style={{ color: "var(--ink-soft)" }}>
          Material studies
        </p>
        <div className="relative left-1/2 mt-6 w-screen -translate-x-1/2 overflow-x-auto">
          <div className="flex gap-2 px-5 sm:px-8" style={{ background: "var(--bg-alt)" }}>
            {FRAMES.map((frame, i) => (
              <motion.figure
                key={frame.name}
                className="w-[72vw] shrink-0 border-2 sm:w-[34vw] lg:w-[24vw]"
                style={{ background: "var(--bg-alt)", borderColor: "var(--line)" }}
                initial={reduceMotion ? undefined : { opacity: 0 }}
                whileInView={reduceMotion ? undefined : { opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.06 }}
              >
                <div
                  role="img"
                  aria-label={`Photograph documenting the primary material of ${frame.name}: ${frame.note}`}
                  className="aspect-[4/5] w-full"
                  style={{ background: frame.tone }}
                />
                <figcaption className="p-3">
                  <p className="text-sm font-medium">{frame.name}</p>
                  <p className="mt-0.5 text-xs" style={{ color: "var(--ink-soft)" }}>{frame.note}</p>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      {/* APPROACH — ink-ground section, numbered marginal notes */}
      <section id="studio" className="w-full py-16 sm:py-24" style={{ background: "var(--ink)", color: "var(--ink-invert)" }}>
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <h2 className="datum-display max-w-md text-3xl leading-tight sm:text-4xl">
            Four things that don&apos;t change between projects.
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2">
            {APPROACH.map((step, i) => (
              <motion.div
                key={step.index}
                className="border-t-2 pt-5"
                style={{ borderColor: "var(--line-invert)" }}
                initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <span className="datum-label text-xs" style={{ color: "var(--accent)" }}>{step.index}</span>
                <h3 className="datum-display mt-3 text-xl sm:text-2xl">{step.title}</h3>
                <p className="mt-2 max-w-sm text-sm leading-relaxed" style={{ color: "var(--ink-invert-soft)" }}>{step.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRESS + CLIENTS */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <motion.blockquote
          className="max-w-2xl"
          initial={reduceMotion ? undefined : { opacity: 0 }}
          whileInView={reduceMotion ? undefined : { opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="datum-display text-2xl leading-snug sm:text-3xl">
            <span style={{ color: "var(--accent)" }}>&ldquo;</span>
            A rare practice that still draws sections by hand before anything
            reaches a screen — and it shows in how the light lands.
            <span style={{ color: "var(--accent)" }}>&rdquo;</span>
          </p>
          <footer className="mt-4 datum-label text-xs" style={{ color: "var(--ink-soft)" }}>
            Site &amp; Section, on Two Rivers Institute
          </footer>
        </motion.blockquote>

        <div className="mt-16 grid grid-cols-1 gap-10 border-t-2 pt-10 sm:grid-cols-2" style={{ borderColor: "var(--line)" }}>
          <div>
            <p className="datum-label text-xs" style={{ color: "var(--ink-soft)" }}>As referenced by</p>
            <ul className="mt-4 space-y-2">
              {PRESS.map((name) => (
                <li key={name} className="datum-display text-lg sm:text-xl">{name}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="datum-label text-xs" style={{ color: "var(--ink-soft)" }}>Clients &amp; partners</p>
            <ul className="mt-4 space-y-2">
              {CLIENTS.map((name) => (
                <li key={name} className="text-sm" style={{ color: "var(--ink-soft)" }}>{name}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* SECOND CTA */}
      <section id="contact" className="w-full py-16 sm:py-24" style={{ background: "var(--ink)", color: "var(--ink-invert)" }}>
        <motion.div
          className="mx-auto max-w-6xl px-5 sm:px-8"
          initial={reduceMotion ? undefined : { opacity: 0, y: 12 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="datum-display max-w-lg text-[clamp(2rem,4.5vw+1rem,3.5rem)] leading-[1.02]">
            Bring us the site before the brief.
          </h2>
          <p className="mt-5 max-w-sm text-sm leading-relaxed" style={{ color: "var(--ink-invert-soft)" }}>
            We take on six to eight projects a year, from feasibility studies
            through construction. Write to us with a site, not a mood board.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <motion.a
              href="#"
              className="datum-block inline-flex min-h-12 items-center gap-2 border-2 px-6 py-3 datum-label text-xs"
              style={{ background: "var(--ink-invert)", color: "var(--ink)", borderColor: "var(--ink-invert)" }}
              whileTap={{ scale: 1 }}
              transition={{ duration: 0.12 }}
            >
              Start a project
              <LeaderArrow className="h-4 w-4" />
            </motion.a>
            <a href="mailto:projects@datum.studio" className="text-sm" style={{ color: "var(--ink-invert)" }}>
              projects@datum.studio<span style={{ color: "var(--accent)" }}>*</span>
            </a>
          </div>
        </motion.div>
      </section>

      {/* FOOTER — address block */}
      <footer className="border-t-2" style={{ borderColor: "var(--line)" }}>
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-10 sm:flex-row sm:items-start sm:justify-between sm:px-8">
          <div className="text-sm" style={{ color: "var(--ink-soft)" }}>
            <p className="datum-display text-lg" style={{ color: "var(--ink)" }}>DATUM</p>
            <p className="mt-2">118 Foundry Street, Suite 4</p>
            <p>Providence, RI 02903</p>
          </div>
          <div className="flex flex-wrap gap-6 datum-label text-xs" style={{ color: "var(--ink-soft)" }}>
            <a href="#work" className="hover:opacity-70">Work</a>
            <a href="#studio" className="hover:opacity-70">Studio</a>
            <a href="#" className="hover:opacity-70">Journal</a>
            <a href="#contact" className="hover:opacity-70">Contact</a>
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-5 pb-8 datum-label text-[11px] sm:px-8" style={{ color: "var(--ink-soft)" }}>
          &copy; {new Date().getFullYear()} Datum Architecture Studio
        </div>
      </footer>
    </div>
  );
}
