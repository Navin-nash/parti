"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useInView } from "motion/react";
import { Space_Mono, Hanken_Grotesk } from "next/font/google";

const mono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-torque-mono",
});

const grotesk = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-torque-sans",
});

/* ---------- signature motif: torque-curve line art ---------- */

function TorqueCurve({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const path =
    "M4 118 C 60 118, 70 30, 130 22 C 190 15, 230 60, 280 55 C 320 51, 340 30, 356 20";

  return (
    <svg
      ref={ref}
      viewBox="0 0 360 130"
      className={className}
      aria-hidden="true"
      fill="none"
    >
      <line x1="4" y1="118" x2="356" y2="118" stroke="var(--line-dim)" strokeWidth="1" />
      <line x1="4" y1="4" x2="4" y2="118" stroke="var(--line-dim)" strokeWidth="1" />
      {[0, 1, 2, 3].map((i) => (
        <line
          key={i}
          x1="4"
          x2="356"
          y1={4 + i * 28.5}
          y2={4 + i * 28.5}
          stroke="var(--line-dim)"
          strokeWidth="0.5"
          strokeDasharray="2 4"
        />
      ))}
      <motion.path
        d={path}
        stroke="var(--accent)"
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={reduce ? { opacity: 1 } : { pathLength: 0, opacity: 0 }}
        animate={
          inView
            ? reduce
              ? { opacity: 1 }
              : { pathLength: 1, opacity: 1 }
            : undefined
        }
        transition={{ duration: reduce ? 0.15 : 0.65, ease: [0.2, 0.8, 0.2, 1] }}
      />
      <motion.circle
        cx="130"
        cy="22"
        r="3.5"
        fill="var(--accent)"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : undefined}
        transition={{ delay: reduce ? 0 : 0.55, duration: 0.15 }}
      />
    </svg>
  );
}

/* ---------- ticking number ---------- */

function TickNumber({
  to,
  suffix = "",
  decimals = 0,
  className,
}: {
  to: number;
  suffix?: string;
  decimals?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const [display, setDisplay] = useState(reduce ? to : 0);

  useEffect(() => {
    if (!inView || reduce) return;
    const duration = 420;
    const start = performance.now();
    let frame: number;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(to * eased);
      if (t < 1) frame = requestAnimationFrame(tick);
      else setDisplay(to);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduce, to]);

  return (
    <span ref={ref} className={className}>
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/* ---------- icons (inline, 2-3 paths max) ---------- */

function IconBolt() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none">
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}
function IconShield() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none">
      <path d="M12 3 4 6v6c0 5 3.5 7.8 8 9 4.5-1.2 8-4 8-9V6l-8-3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="m9 12 2 2 4-4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconArrow() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" fill="none">
      <path d="M2 8h11M8 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconDrop() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none">
      <path d="M12 3c3.5 4.2 6 7.8 6 10.8a6 6 0 1 1-12 0C6 10.8 8.5 7.2 12 3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

/* ---------- primitives ---------- */

function SectionLabel({ index, name }: { index: string; name: string }) {
  return (
    <div className="flex items-center gap-3 font-[family-name:var(--font-torque-mono)] text-[11px] uppercase tracking-[0.22em]" style={{ color: "var(--ink-dim)" }}>
      <span style={{ color: "var(--accent)" }}>{index}</span>
      <span aria-hidden="true" className="h-px w-8" style={{ background: "var(--line-dim)" }} />
      {name}
    </div>
  );
}

interface SpecRow {
  label: string;
  value: string;
  detail: string;
}

const SPECS: SpecRow[] = [
  { label: "Range", value: "45 mi", detail: "city mode, 165 lb rider, 60°F" },
  { label: "Top speed", value: "28 mph", detail: "Class 3, pedal-assist limited" },
  { label: "Motor torque", value: "85 Nm", detail: "rear hub, peak, 750 W nominal" },
  { label: "Battery", value: "614 Wh", detail: "48V 12.8Ah, LG MJ1 cells" },
  { label: "Charge time", value: "3.1 hr", detail: "0–80%, 4A fast charger" },
  { label: "Weight", value: "54 lb", detail: "no rack, no fenders" },
  { label: "IP rating", value: "IP65", detail: "dust-tight, low-pressure jets" },
  { label: "Brake torque sensor", value: "0.4 s", detail: "cutoff response, front + rear" },
];

const COMPARISON = [
  { metric: "Cost per mile", torque: "$0.014", car: "$0.68", note: "electricity vs. fuel + maintenance, 5-yr avg" },
  { metric: "0–60 min commute range", torque: "3 charges", car: "1 tank", note: "45 mi range vs. 380 mi tank, refuel time" },
  { metric: "Annual energy cost", torque: "$41", car: "$2,150", note: "12 mi/day, 240 days, local utility + gas rates" },
];

export default function TorqueShowcase() {
  const reduce = useReducedMotion();

  return (
    <div data-showcase="torque" className={`torque-root ${mono.variable} ${grotesk.variable}`}>
      <style>{`
        [data-showcase="torque"] {
          --bg: #0A0A0B;
          --bg-raised: #121214;
          --bg-strip: #141416;
          --ink: #F5F5F3;
          --ink-dim: #A8A8A4;
          --ink-faint: #6E6E6C;
          --accent: #FF7A1A;
          --accent-ink: #14100B;
          --line: #2A2A2C;
          --line-dim: #1E1E20;
          --focus: #FFB374;
          font-family: var(--font-torque-sans), system-ui, sans-serif;
          background: var(--bg);
          color: var(--ink);
        }
        [data-showcase="torque"] .num {
          font-family: var(--font-torque-mono), ui-monospace, monospace;
        }
        [data-showcase="torque"] a:focus-visible,
        [data-showcase="torque"] button:focus-visible {
          outline: 2px solid var(--focus);
          outline-offset: 3px;
        }
        [data-showcase="torque"] ::selection {
          background: var(--accent);
          color: var(--accent-ink);
        }
      `}</style>

      {/* NAV */}
      <header className="sticky top-0 z-40 border-b" style={{ borderColor: "var(--line)", background: "color-mix(in srgb, var(--bg) 92%, transparent)", backdropFilter: "blur(6px)" }}>
        <div className="mx-auto flex max-w-[1180px] items-center justify-between px-5 py-4 sm:px-8">
          <a href="#" className="flex items-center gap-2 font-[family-name:var(--font-torque-mono)] text-sm font-bold tracking-[0.08em]">
            <span aria-hidden="true" style={{ color: "var(--accent)" }}>◆</span>
            TORQUE
          </a>
          <nav className="hidden items-center gap-7 text-sm sm:flex" style={{ color: "var(--ink-dim)" }}>
            <a href="#specs" className="min-h-[44px] flex items-center hover:text-[var(--ink)] transition-colors" style={{ transitionDuration: "150ms" }}>
              Specifications
            </a>
            <a href="#build" className="min-h-[44px] flex items-center hover:text-[var(--ink)] transition-colors" style={{ transitionDuration: "150ms" }}>
              Build
            </a>
          </nav>
          <motion.a
            href="#configure"
            whileTap={reduce ? undefined : { scale: 0.97 }}
            transition={{ duration: 0.12 }}
            className="flex min-h-[44px] items-center rounded-sm px-4 text-sm font-semibold"
            style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
          >
            Configure yours
          </motion.a>
        </div>
      </header>

      {/* HERO */}
      <section className="mx-auto max-w-[1180px] px-5 pb-16 pt-14 sm:px-8 sm:pb-24 sm:pt-20">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-6">
          <div>
            <div className="mb-6 flex items-center gap-2 font-[family-name:var(--font-torque-mono)] text-[11px] uppercase tracking-[0.22em]" style={{ color: "var(--ink-faint)" }}>
              <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: "var(--accent)" }} aria-hidden="true" />
              Model T1 &middot; production spec
            </div>
            <h1 className="text-[42px] font-extrabold leading-[1.02] tracking-[-0.02em] sm:text-[64px] lg:text-[74px]">
              85 Nm of torque.
              <br />
              <span style={{ color: "var(--ink-dim)" }}>Zero softened claims.</span>
            </h1>
            <p className="mt-6 max-w-[46ch] text-[17px] leading-[1.55]" style={{ color: "var(--ink-dim)" }}>
              Torque is a Class 3 e-bike built for the commute you already do the math on.
              85 Nm of hub-motor torque, a 45-mile range, and a spec sheet that doesn&apos;t
              round up. Every number below is measured, not modeled.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <motion.a
                href="#configure"
                whileTap={reduce ? undefined : { scale: 0.97 }}
                transition={{ duration: 0.12 }}
                className="flex min-h-[48px] items-center gap-2 rounded-sm px-6 text-[15px] font-semibold"
                style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
              >
                Configure yours
                <IconArrow />
              </motion.a>
              <a href="#specs" className="flex min-h-[48px] items-center border px-6 text-[15px] font-semibold transition-colors" style={{ borderColor: "var(--line)", color: "var(--ink)", transitionDuration: "150ms" }}>
                Read the spec sheet
              </a>
            </div>
          </div>

          <motion.div
            initial={reduce ? undefined : { opacity: 0, x: 16 }}
            animate={reduce ? undefined : { opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="border p-5"
            style={{ borderColor: "var(--line)", background: "var(--bg-raised)" }}
          >
            <div className="mb-1 font-[family-name:var(--font-torque-mono)] text-[11px] uppercase tracking-[0.18em]" style={{ color: "var(--ink-faint)" }}>
              Torque curve — rear hub motor
            </div>
            <TorqueCurve className="mt-3 w-full" />
            <div className="mt-2 flex justify-between font-[family-name:var(--font-torque-mono)] text-[10px]" style={{ color: "var(--ink-faint)" }}>
              <span>0 RPM</span>
              <span>peak 85 Nm @ 180 RPM</span>
              <span>500 RPM</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FULL-BLEED SPEC STRIP */}
      <section id="specs" className="border-y" style={{ borderColor: "var(--line)", background: "var(--bg-strip)" }}>
        <div className="px-5 py-3 sm:px-8">
          <SectionLabel index="01" name="Full specification" />
        </div>
        <div className="w-full overflow-x-auto">
          <div className="grid min-w-[760px] grid-cols-4 border-t sm:grid-cols-8" style={{ borderColor: "var(--line)" }}>
            {SPECS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={reduce ? undefined : { opacity: 0 }}
                whileInView={reduce ? undefined : { opacity: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.25, delay: reduce ? 0 : i * 0.03 }}
                className="border-b border-r px-4 py-6"
                style={{ borderColor: "var(--line)" }}
              >
                <div className="text-[11px] uppercase tracking-[0.1em]" style={{ color: "var(--ink-faint)" }}>
                  {s.label}
                </div>
                <div className="num mt-2 text-[22px] font-bold" style={{ color: "var(--ink)" }}>
                  {s.value}
                </div>
                <div className="mt-1 text-[11px] leading-snug" style={{ color: "var(--ink-faint)" }}>
                  {s.detail}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* THREE METRIC CALLOUTS */}
      <section className="mx-auto max-w-[1180px] px-5 py-16 sm:px-8 sm:py-24">
        <SectionLabel index="02" name="What that means on your commute" />
        <div className="mt-8 grid gap-px sm:grid-cols-3" style={{ background: "var(--line)" }}>
          {[
            { icon: <IconBolt />, to: 85, suffix: " Nm", label: "Peak torque", body: "Enough to pull a fully loaded pannier set off the line at 0 mph without motor lag." },
            { icon: <IconShield />, to: 0.4, decimals: 1, suffix: " s", label: "Brake cutoff", body: "Torque-sensing brake levers cut motor power in under half a second — no coasting into a stop." },
            { icon: <IconDrop />, to: 65, suffix: "%", label: "Regen recovery", body: "Descents and braking feed back into the 614 Wh pack, recovering roughly two miles per steep mile down." },
          ].map((m) => (
            <div key={m.label} className="p-7" style={{ background: "var(--bg)" }}>
              <div className="flex h-9 w-9 items-center justify-center" style={{ color: "var(--accent)" }}>
                {m.icon}
              </div>
              <div className="num mt-4 text-[36px] font-bold leading-none">
                <TickNumber to={m.to} suffix={m.suffix} decimals={m.decimals ?? 0} />
              </div>
              <div className="mt-2 text-[13px] font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--ink-dim)" }}>
                {m.label}
              </div>
              <p className="mt-3 text-[14px] leading-[1.55]" style={{ color: "var(--ink-dim)" }}>
                {m.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* COMPARISON TABLE — car vs torque */}
      <section className="mx-auto max-w-[1180px] px-5 pb-16 sm:px-8 sm:pb-24">
        <SectionLabel index="03" name="Versus the car you’re not selling yet" />
        <motion.div
          initial={reduce ? undefined : { opacity: 0, scaleX: 0.98 }}
          whileInView={reduce ? undefined : { opacity: 1, scaleX: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          style={{ transformOrigin: "left" }}
          className="mt-8 overflow-x-auto border"
        >
          <table className="w-full min-w-[560px] border-collapse text-left text-sm" style={{ borderColor: "var(--line)" }}>
            <thead>
              <tr>
                <th className="border-b px-5 py-4 font-[family-name:var(--font-torque-mono)] text-[11px] uppercase tracking-[0.1em]" style={{ borderColor: "var(--line)", color: "var(--ink-faint)" }}>
                  Metric
                </th>
                <th className="border-b px-5 py-4 font-[family-name:var(--font-torque-mono)] text-[11px] uppercase tracking-[0.1em]" style={{ borderColor: "var(--line)", color: "var(--accent)" }}>
                  Torque
                </th>
                <th className="border-b px-5 py-4 font-[family-name:var(--font-torque-mono)] text-[11px] uppercase tracking-[0.1em]" style={{ borderColor: "var(--line)", color: "var(--ink-faint)" }}>
                  Average car
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row) => (
                <tr key={row.metric}>
                  <td className="border-b px-5 py-5 align-top" style={{ borderColor: "var(--line)" }}>
                    <div className="font-semibold" style={{ color: "var(--ink)" }}>{row.metric}</div>
                    <div className="mt-1 text-[12px] leading-snug" style={{ color: "var(--ink-faint)" }}>{row.note}</div>
                  </td>
                  <td className="num border-b px-5 py-5 align-top text-[17px] font-bold" style={{ borderColor: "var(--line)", color: "var(--accent)" }}>
                    {row.torque}
                  </td>
                  <td className="num border-b px-5 py-5 align-top text-[17px]" style={{ borderColor: "var(--line)", color: "var(--ink-dim)" }}>
                    {row.car}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </section>

      {/* BUILD / MATERIALS */}
      <section id="build" className="border-t" style={{ borderColor: "var(--line)" }}>
        <div className="mx-auto grid max-w-[1180px] gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionLabel index="04" name="Frame and drivetrain" />
            <h2 className="mt-5 text-[30px] font-extrabold leading-[1.1] tracking-[-0.01em] sm:text-[38px]">
              6061 aluminum, not marketing aluminum.
            </h2>
            <p className="mt-4 max-w-[52ch] text-[15px] leading-[1.65]" style={{ color: "var(--ink-dim)" }}>
              The frame is hydroformed 6061-T6, internally routed, rated to a 300 lb
              total system weight. The torque sensor sits at the bottom bracket —
              not the wheel — so power delivery tracks your actual pedal force,
              not a proxy for it. Belt drive is standard: a carbon-reinforced
              Gates CDX rated to 30,000 miles before replacement, versus roughly
              2,000–3,000 for a chain under equivalent load.
            </p>
            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t pt-6" style={{ borderColor: "var(--line)" }}>
              {[
                ["Drive", "Gates CDX belt"],
                ["Frame", "6061-T6 aluminum"],
                ["Fork travel", "50 mm, coil"],
                ["Brakes", "Hydraulic, 180 mm rotors"],
              ].map(([dt, dd]) => (
                <div key={dt}>
                  <dt className="text-[11px] uppercase tracking-[0.1em]" style={{ color: "var(--ink-faint)" }}>{dt}</dt>
                  <dd className="num mt-1 text-[15px] font-semibold">{dd}</dd>
                </div>
              ))}
            </dl>
          </div>
          <motion.div
            initial={reduce ? undefined : { opacity: 0, y: 12 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.4 }}
            role="img"
            aria-label="Placeholder rendering of the Torque T1 drivetrain, showing the belt-drive path from bottom-bracket torque sensor to rear hub motor"
            className="flex min-h-[280px] items-center justify-center border"
            style={{
              borderColor: "var(--line)",
              background: "linear-gradient(155deg, #17171A 0%, #0A0A0B 60%, #1A1108 100%)",
            }}
          >
            <TorqueCurve className="w-[85%] opacity-90" />
          </motion.div>
        </div>
      </section>

      {/* SECOND CTA */}
      <section id="configure" className="border-t" style={{ borderColor: "var(--line)" }}>
        <div className="mx-auto max-w-[1180px] px-5 py-16 text-center sm:px-8 sm:py-24">
          <div className="mx-auto mb-5 flex items-center justify-center gap-2 font-[family-name:var(--font-torque-mono)] text-[11px] uppercase tracking-[0.22em]" style={{ color: "var(--ink-faint)" }}>
            <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: "var(--accent)" }} aria-hidden="true" />
            Built to order &middot; ships in 3 weeks
          </div>
          <h2 className="mx-auto max-w-[26ch] text-[32px] font-extrabold leading-[1.1] tracking-[-0.01em] sm:text-[44px]">
            Spec it to your commute, not the showroom floor.
          </h2>
          <p className="mx-auto mt-4 max-w-[48ch] text-[15px] leading-[1.6]" style={{ color: "var(--ink-dim)" }}>
            Choose frame size, gear ratio, and battery capacity — 614 Wh standard
            or 820 Wh extended for a 61-mile range. Starts at $2,899.
          </p>
          <motion.a
            href="#"
            whileTap={reduce ? undefined : { scale: 0.97 }}
            transition={{ duration: 0.12 }}
            className="mt-8 inline-flex min-h-[48px] items-center gap-2 rounded-sm px-7 text-[15px] font-semibold"
            style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
          >
            Configure yours
            <IconArrow />
          </motion.a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t" style={{ borderColor: "var(--line)" }}>
        <div className="mx-auto flex max-w-[1180px] flex-col gap-4 px-5 py-8 text-[13px] sm:flex-row sm:items-center sm:justify-between sm:px-8" style={{ color: "var(--ink-faint)" }}>
          <div className="font-[family-name:var(--font-torque-mono)] tracking-[0.05em]">TORQUE — T1</div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            <a href="#specs" className="min-h-[44px] flex items-center hover:text-[var(--ink)] transition-colors" style={{ transitionDuration: "150ms" }}>Specifications</a>
            <a href="#build" className="min-h-[44px] flex items-center hover:text-[var(--ink)] transition-colors" style={{ transitionDuration: "150ms" }}>Build</a>
            <a href="#" className="min-h-[44px] flex items-center hover:text-[var(--ink)] transition-colors" style={{ transitionDuration: "150ms" }}>Warranty</a>
            <a href="#" className="min-h-[44px] flex items-center hover:text-[var(--ink)] transition-colors" style={{ transitionDuration: "150ms" }}>Support</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
