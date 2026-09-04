"use client";

/* ============================================================================
 * DIRECTION — "Shop Drawing"
 *
 * THESIS
 *   These buyers read the steel specification before the marketing, argue about
 *   0.14" stock on forums for weeks, and distrust anyone who leads with a
 *   sunset photo. So the page leads with the document they would ask for if
 *   they could: the maker's own dimensioned drawing. The specification is not
 *   support material below the sell — it IS the sell, and the persuasion is
 *   allowed to happen only after the numbers have been handed over.
 *
 * SIX AXES
 *   Density        measured — one considered purchase every few years, not a
 *                  daily tool. Wide measure, generous leading, one decision per
 *                  band. Dense would read as a spec sheet dump; sparse would
 *                  read as a brand with nothing to disclose.
 *   Structure      editorial-asymmetric, anchored to a title block. A drawing
 *                  sheet has a title block in one corner carrying part, rev and
 *                  sheet number, and the field is composed freely around it.
 *                  Bands alternate weight rather than sitting in an even grid.
 *   Type voice     editorial-serif + condensed annotation. Spectral carries all
 *                  prose (a maker who has shipped three products for eleven
 *                  years is writing, not announcing); Archivo Narrow carries
 *                  every dimension, label and callout, because that is what
 *                  single-stroke drawing lettering looks like.
 *   Chroma         achromatic-with-material — warm drawing paper and graphite,
 *                  with exactly one chromatic tone: an oxidised steel blue used
 *                  only for dimensions and the linked/active state. The only
 *                  other saturated colour on the page is the actual micarta
 *                  swatches, which are content, not decoration.
 *   Motion posture responsive-only, with one choreographed moment: the
 *                  dimension lines draw in on first view (500ms, 80ms stagger),
 *                  in the order a drafter would lay them down. Nothing else
 *                  moves except hover linking.
 *   Depth          flat — ink on paper. No shadow anywhere on the page. The
 *                  only physical cue is the drawing's own line-weight hierarchy
 *                  (1.75px object line, 1px dimension line, 0.75px extension
 *                  line), which is how a drawing has always encoded depth.
 *
 * SIGNATURE — the linked dimension drawing
 *   An inline orthographic side elevation of the Kestrel with real dimension
 *   lines, extension lines and leader callouts, cross-linked to the
 *   specification table: hover or focus a spec row and its dimension lights up
 *   on the drawing. It belongs to THIS subject and no other, because a fixed
 *   blade knife is fully described by a profile and four numbers, and the shop
 *   drawing is the exact artifact these buyers reconstruct by hand in forum
 *   threads when a maker refuses to publish one. A dashboard has no elevation.
 *
 * WHAT IT GIVES UP
 *   Aspiration. No photography of the object in a landscape, no lifestyle
 *   register, no urgency device, no social proof — and the page therefore has
 *   nothing to offer a browser who has not already decided to care about steel.
 *   It also gives up density: this is a long page for five facts.
 * ==========================================================================*/

import * as React from "react";
import { Check, ChevronRight, MapPin, Ruler } from "@/lib/icons";

const ROOT = {
  "--p-font-serif": "'Spectral'",
  "--p-font-note": "'Archivo Narrow'",

  "--p-paper": "#f2efe9",      "--p-paper-d": "#15140f",
  "--p-sheet": "#fbfaf7",      "--p-sheet-d": "#1d1b16",
  "--p-graphite": "#1c1a17",   "--p-graphite-d": "#ece7dc",
  "--p-graphite-2": "#57534a", "--p-graphite-2-d": "#b0a898",
  "--p-graphite-3": "#6f6a5f", "--p-graphite-3-d": "#8b8375",
  "--p-rule": "#cec8bb",       "--p-rule-d": "#35322a",
  "--p-edge": "#8a8272",       "--p-edge-d": "#79736a",
  "--p-blue": "#2b5f6b",       "--p-blue-d": "#7fc4d4",

  /* material, not chrome */
  "--p-mat-olive": "#6b705c", "--p-mat-black": "#25262b", "--p-mat-natural": "#c2a882",

  /* 8px base */
  "--p-s1": "4px", "--p-s2": "8px", "--p-s3": "16px",
  "--p-s4": "24px", "--p-s5": "40px", "--p-s6": "64px",

  /* 16px base, ratio 1.25 — 12 / 14 / 16 / 20 / 25 / 31 */
  "--p-t-xs": "12px", "--p-t-sm": "14px", "--p-t-md": "16px",
  "--p-t-lg": "20px", "--p-t-xl": "25px", "--p-t-2xl": "31px",

  /* line weights: object / dimension / extension / highlighted dimension */
  "--p-w-obj": "1.75", "--p-w-dim": "1", "--p-w-ext": "0.75", "--p-w-hi": "2",

  /* drawing roles, aliased so the SVG never hardcodes a paint */
  "--p-obj": "#1c1a17", "--p-dimline": "#2b5f6b", "--p-hi": "#1c1a17",

  "--p-r": "2px",
  "--p-d-fast": "140ms",
  "--p-d-draw": "500ms",
  "--p-ease": "cubic-bezier(0.33, 0, 0.1, 1)",
} as React.CSSProperties;

const SHEET = `@import url('https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,400;0,500;0,600;1,400&family=Archivo+Narrow:wght@400;500;600&display=swap');
[data-parti="kestrel"]{font-family:var(--p-font-serif),Georgia,serif;-webkit-font-smoothing:antialiased}
[data-parti="kestrel"] .kx-note{font-family:var(--p-font-note),'Arial Narrow',system-ui,sans-serif;font-variant-numeric:tabular-nums;letter-spacing:.04em}
[data-parti="kestrel"] :focus-visible{outline:2px solid var(--p-blue);outline-offset:3px;border-radius:var(--p-r)}
[data-parti="kestrel"].dark :focus-visible,.dark [data-parti="kestrel"] :focus-visible{outline-color:var(--p-blue-d)}
@keyframes kx-draw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
[data-parti="kestrel"] .kx-dim{stroke-dasharray:1;stroke-dashoffset:1;animation:kx-draw var(--p-d-draw) var(--p-ease) forwards}
[data-parti="kestrel"] .kx-label{opacity:0;animation:kx-fade var(--p-d-draw) var(--p-ease) forwards}
@keyframes kx-fade{to{opacity:1}}
@media (prefers-reduced-motion:reduce){[data-parti="kestrel"] .kx-dim{stroke-dashoffset:0;animation:none}[data-parti="kestrel"] .kx-label{opacity:1;animation:none}[data-parti="kestrel"] *{transition:none!important}}`;

/* ------------------------------------------------------------------ data */

type DimId = "overall" | "blade" | "stock" | "tang" | "balance";

const VIEWS = [
  { id: "elevation", label: "Side elevation", note: "Profile, overall and blade length" },
  { id: "grind", label: "Grind geometry", note: "Full flat, 0.015 in behind the edge" },
  { id: "tang", label: "Tang and scales", note: "Full tang, exposed pommel, brass pins" },
  { id: "section", label: "Section at spine", note: "Stock thickness taken 1 in forward of the plunge" },
] as const;
type ViewId = (typeof VIEWS)[number]["id"];

const SPECS: { label: string; value: string; dim?: DimId; note?: string }[] = [
  { label: "Blade steel", value: "CPM-3V, 58–60 HRC", note: "Cryo-treated, tempered twice. Tough before it is stainless — it will patina." },
  { label: "Blade length", value: "4.1 in · 104 mm", dim: "blade", note: "Measured from the plunge, not the handle." },
  { label: "Stock thickness", value: "0.14 in · 3.6 mm", dim: "stock", note: "Constant to within 0.004 in along the spine." },
  { label: "Grind", value: "Full flat, 0.015 in behind the edge" },
  { label: "Overall length", value: "8.9 in · 226 mm", dim: "overall" },
  { label: "Construction", value: "Full tang, exposed pommel", dim: "tang", note: "Two 3/16 in brass pins and one lanyard tube." },
  { label: "Handle", value: "Canvas micarta, hand-contoured" },
  { label: "Weight", value: "8.7 oz · 247 g", dim: "balance", note: "Heavy for the length. Balance sits 0.4 in behind the plunge, which is the trade." },
  { label: "Made in", value: "Marquette, Michigan" },
];

const SCALES = [
  { id: "olive", label: "Olive", swatch: "var(--p-mat-olive)", note: "Green canvas micarta. Darkens with oil.", slow: false },
  { id: "black", label: "Black", swatch: "var(--p-mat-black)", note: "Black canvas micarta. Hides everything.", slow: false },
  { id: "natural", label: "Natural", swatch: "var(--p-mat-natural)", note: "Undyed linen micarta. Stains, and that is the point.", slow: true },
] as const;

const SHEATHS = [
  { id: "leather", label: "Leather", extra: 0, note: "Vegetable-tanned, dangler loop, made two blocks from the shop." },
  { id: "kydex", label: "Kydex", extra: 12, note: "0.080 in, ambidextrous belt clip, formed over the blade it ships with." },
] as const;

const REVISIONS = [
  { rev: "REV 11", year: "2024", text: "Plunge line moved 2 mm forward. Sharpening jigs from 2015 still fit." },
  { rev: "REV 07", year: "2019", text: "Switched from A2 to CPM-3V after four seasons of edge-retention complaints." },
  { rev: "REV 01", year: "2015", text: "First run of 40. Profile unchanged since." },
];

const TITLE_BLOCK: [string, string][] = [
  ["Maker", "FIELD NOTES CO."], ["Part", "KESTREL · FIXED BLADE"],
  ["Revision", "REV 11 · 2024"], ["In production", "SINCE 2015"],
];

const TRUST: [typeof MapPin, string][] = [
  [MapPin, "Ground, heat treated and assembled in Marquette, Michigan. Nothing is sourced finished."],
  [Ruler, "Lifetime sharpening. Send it back with postage and we regrind to the original geometry, once a year, forever."],
  [ChevronRight, "Thirty days to return it used. We resell those as seconds and say so."],
];

const LINE = [
  { name: "Plover", blurb: "2.9 in neck knife, same steel, 3.1 oz", price: 119 },
  { name: "Ridgeline", blurb: "6.5 in camp knife, 0.19 in stock, 12.4 oz", price: 265 },
];

/* ------------------------------------------------------------ primitives */

const INK = "text-[var(--p-graphite)] dark:text-[var(--p-graphite-d)]";
const INK2 = "text-[var(--p-graphite-2)] dark:text-[var(--p-graphite-2-d)]";
const INK3 = "text-[var(--p-graphite-3)] dark:text-[var(--p-graphite-3-d)]";
const RULE = "border-[var(--p-rule)] dark:border-[var(--p-rule-d)]";
const BLUE = "text-[var(--p-blue)] dark:text-[var(--p-blue-d)]";
const edge = (on: boolean) =>
  on ? "border-[var(--p-blue)] dark:border-[var(--p-blue-d)]" : "border-[var(--p-edge)] dark:border-[var(--p-edge-d)]";

function Label({ children }: { children: React.ReactNode }) {
  return <p className={`kx-note text-[length:var(--p-t-xs)] uppercase tracking-[0.14em] ${INK3}`}>{children}</p>;
}

/* ---- SIGNATURE: the drawing. Object line, dimension line, extension line. */

function Drawing({ view, active }: { view: ViewId; active: DimId | null }) {
  /* var() is not valid in an SVG presentation attribute, so every paint and
     weight below goes through inline style, where it is. */
  const obj = { stroke: "var(--p-obj)", fill: "none" } as const;
  const OBJ = { ...obj, strokeWidth: "var(--p-w-obj)", strokeLinejoin: "round" as const };
  const THIN = { ...obj, strokeWidth: "var(--p-w-ext)" };
  const EXT = { stroke: "var(--p-dimline)", strokeWidth: "var(--p-w-ext)", opacity: 0.55 };

  const paint = (d: DimId) => (active === d ? "var(--p-hi)" : "var(--p-dimline)");
  const dim = (d: DimId, delay: number) => ({
    stroke: paint(d), fill: "none", animationDelay: `${delay}ms`,
    strokeWidth: active === d ? "var(--p-w-hi)" : "var(--p-w-dim)",
  });
  const mark = (d: DimId, delay: number) => ({ fill: paint(d), animationDelay: `${delay}ms` });

  const showLen = view === "elevation" || view === "tang";
  const showSection = view === "section" || view === "grind";

  return (
    <svg
      viewBox="0 0 720 300" className="block w-full" role="img"
      aria-label={`Kestrel field knife, ${VIEWS.find((v) => v.id === view)!.label.toLowerCase()}. Overall 8.9 inches, blade 4.1 inches, stock 0.14 inches, 8.7 ounces.`}
    >
      {/* object line — the profile. Heaviest weight on the page. */}
      <path d="M 58 100 L 386 96 C 470 96 560 104 664 130 C 560 146 470 154 386 152 C 300 166 140 168 62 154 C 54 148 54 106 58 100 Z" style={OBJ} />
      <path d="M 390 96 L 390 153" style={{ ...obj, strokeWidth: "var(--p-w-dim)" }} />
      <path d="M 398 114 C 480 116 560 124 652 132" strokeDasharray={view === "grind" ? undefined : "4 3"}
        style={{ ...THIN, opacity: view === "grind" ? 1 : 0.55 }} />
      {[150, 250].map((cx) => <circle key={cx} cx={cx} cy={128} r="6" style={THIN} />)}
      <circle cx="92" cy="127" r="8" style={THIN} />

      {/* full tang, drawn the way a drawing shows concealed material */}
      {view === "tang" ? (
        <path d="M 70 108 L 380 104 L 380 146 L 72 150 Z" strokeDasharray="7 4"
          style={{ ...dim("tang", 0), animationDelay: undefined }} />
      ) : null}

      {showLen ? (
        <g>
          {/* overall */}
          <path d="M 58 172 L 58 240 M 666 138 L 666 240" style={EXT} />
          <path d="M 58 232 L 666 232" className="kx-dim" pathLength={1} style={dim("overall", 160)} />
          <path d="M 58 232 l 9 -4 v 8 z M 666 232 l -9 -4 v 8 z" className="kx-label" style={mark("overall", 560)} />
          <text x="362" y="226" textAnchor="middle" fontSize="13" className="kx-note kx-label" style={mark("overall", 560)}>8.9 in · 226 mm OVERALL</text>
          {/* blade */}
          <path d="M 390 160 L 390 208 M 666 138 L 666 208" style={EXT} />
          <path d="M 390 200 L 666 200" className="kx-dim" pathLength={1} style={dim("blade", 80)} />
          <path d="M 390 200 l 9 -4 v 8 z M 666 200 l -9 -4 v 8 z" className="kx-label" style={mark("blade", 480)} />
          <text x="528" y="194" textAnchor="middle" fontSize="13" className="kx-note kx-label" style={mark("blade", 480)}>4.1 in · 104 mm BLADE</text>
        </g>
      ) : null}

      {/* leader callout — balance, the number that explains the weight */}
      {view === "elevation" ? (
        <g>
          <path d="M 372 150 L 320 74 L 236 74" className="kx-dim" pathLength={1} style={dim("balance", 240)} />
          <circle cx="372" cy="150" r="3.5" className="kx-label" style={mark("balance", 640)} />
          <text x="230" y="78" textAnchor="end" fontSize="13" className="kx-note kx-label" style={mark("balance", 640)}>BALANCE · 8.7 oz total</text>
        </g>
      ) : null}

      {/* section A–A: the stock thickness argument, in section */}
      {showSection ? (
        <g>
          <path d="M 556 30 L 578 30 L 569 104 Z" style={OBJ} />
          <path d="M 556 24 L 556 12 M 578 24 L 578 12" style={EXT} />
          <path d="M 516 16 L 618 16" className="kx-dim" pathLength={1} style={dim("stock", 0)} />
          <path d="M 556 16 l -9 -4 v 8 z M 578 16 l 9 -4 v 8 z" className="kx-label" style={mark("stock", 400)} />
          <text x="624" y="20" fontSize="13" className="kx-note kx-label" style={mark("stock", 400)}>0.14 in · 3.6 mm STOCK</text>
          <text x="506" y="104" textAnchor="end" fontSize="12" className="kx-note kx-label" style={mark("stock", 400)}>SECTION A–A</text>
        </g>) : null}</svg>
  );
}

/* ----------------------------------------------------------------- screen */

export function KestrelParti() {
  const [view, setView] = React.useState<ViewId>("elevation");
  const [scale, setScale] = React.useState<(typeof SCALES)[number]["id"]>("olive");
  const [sheath, setSheath] = React.useState<(typeof SHEATHS)[number]["id"]>("leather");
  const [active, setActive] = React.useState<DimId | null>(null);
  const [added, setAdded] = React.useState(false);

  const scaleOpt = SCALES.find((s) => s.id === scale)!;
  const sheathOpt = SHEATHS.find((s) => s.id === sheath)!;
  const price = 189 + sheathOpt.extra;
  const weeks = scaleOpt.slow ? 4 : 2;

  return (
    <div
      data-parti="kestrel"
      style={ROOT}
      className="bg-[var(--p-paper)] text-[length:var(--p-t-md)] leading-[1.65] dark:bg-[var(--p-paper-d)] dark:[--p-dimline:#7fc4d4] dark:[--p-hi:#ece7dc] dark:[--p-obj:#ece7dc]"
    >
      <style dangerouslySetInnerHTML={{ __html: SHEET }} />

      <div className="mx-auto max-w-[1100px] px-[var(--p-s3)] py-[var(--p-s5)] sm:px-[var(--p-s4)]">
        {/* title block — the drawing sheet's, not a nav bar */}
        <header className={`grid grid-cols-2 gap-[var(--p-s3)] border-y ${RULE} py-[var(--p-s3)] sm:grid-cols-4`}>
          {TITLE_BLOCK.map(([k, v]) => (
            <div key={k}>
              <Label>{k}</Label>
              <p className={`kx-note text-[length:var(--p-t-sm)] ${INK}`}>{v}</p>
            </div>))}
        </header>

        {/* the drawing, then the numbers, then the purchase. In that order. */}
        <section className="mt-[var(--p-s5)] grid grid-cols-1 gap-[var(--p-s5)] lg:grid-cols-[1fr_330px]">
          <div>
            <h1 className={`text-[length:var(--p-t-2xl)] font-medium leading-[1.15] ${INK}`}>The Kestrel</h1>
            <p className={`mt-[var(--p-s2)] max-w-[54ch] text-[length:var(--p-t-lg)] italic ${INK2}`}>
              A 4.1&nbsp;inch flat-ground field knife in CPM-3V. One of three things we make,
              and the drawing has moved twice in eleven years.
            </p>

            <div className={`mt-[var(--p-s4)] border ${RULE} bg-[var(--p-sheet)] p-[var(--p-s3)] dark:bg-[var(--p-sheet-d)]`}>
              <Drawing view={view} active={active} />
              <div className={`mt-[var(--p-s3)] flex flex-wrap gap-[var(--p-s1)] border-t ${RULE} pt-[var(--p-s3)]`}>
                {VIEWS.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setView(v.id)}
                    aria-pressed={view === v.id}
                    className={`kx-note min-h-[34px] rounded-[var(--p-r)] border px-[var(--p-s2)] text-[length:var(--p-t-xs)] uppercase tracking-[0.1em] transition-colors duration-[var(--p-d-fast)] ${edge(view === v.id)} ${view === v.id ? BLUE : INK3}`}
                  >{v.label}</button>))}</div>
              <p className={`kx-note mt-[var(--p-s2)] text-[length:var(--p-t-xs)] ${INK3}`}>
                {VIEWS.find((v) => v.id === view)!.note} · dimensions in inches, millimetres in
                parentheses · not to scale
              </p>
            </div>

            {/* spec table, cross-linked to the drawing */}
            <h2 className={`mt-[var(--p-s5)] flex items-center gap-[var(--p-s2)] text-[length:var(--p-t-lg)] font-medium ${INK}`}>
              <Ruler className="size-4" aria-hidden /> Specification
            </h2>
            <p className={`kx-note mt-[var(--p-s1)] text-[length:var(--p-t-xs)] uppercase tracking-[0.12em] ${INK3}`}>Rows marked with a rule are dimensioned on the drawing above</p>
            <dl className={`mt-[var(--p-s3)] border-t ${RULE}`}>
              {SPECS.map((s) => {
                const linked = !!s.dim;
                const isOn = linked && active === s.dim;
                return (
                  <div
                    key={s.label}
                    tabIndex={linked ? 0 : -1}
                    onMouseEnter={() => linked && setActive(s.dim!)}
                    onMouseLeave={() => linked && setActive(null)}
                    onFocus={() => linked && setActive(s.dim!)}
                    onBlur={() => linked && setActive(null)}
                    className={`grid grid-cols-1 gap-x-[var(--p-s3)] border-b ${RULE} py-[var(--p-s2)] sm:grid-cols-[190px_1fr] ${linked ? "cursor-help" : ""} ${isOn ? "bg-[var(--p-sheet)] dark:bg-[var(--p-sheet-d)]" : ""}`}
                  >
                    <dt className={`kx-note text-[length:var(--p-t-sm)] uppercase tracking-[0.08em] ${isOn ? BLUE : INK3}`}>{linked ? "— " : ""}{s.label}</dt>
                    <dd className={INK}>
                      <span className="kx-note text-[length:var(--p-t-md)]">{s.value}</span>
                      {s.note ? <p className={`text-[length:var(--p-t-sm)] ${INK2}`}>{s.note}</p> : null}
                    </dd>
                  </div>
                );
              })}
            </dl>

            <div className={`mt-[var(--p-s5)] max-w-[62ch] space-y-[var(--p-s3)] ${INK2}`}>
              <h2 className={`text-[length:var(--p-t-lg)] font-medium ${INK}`}>What 3V is, and is not</h2>
              <p>
                CPM-3V is a tool steel chosen for toughness, not for stainlessness. At 58–60 HRC it
                will take a lateral load that snaps a harder blade, and it will hold a working edge
                through a season of batoning. It will also develop a grey patina within weeks and
                will rust if you sheath it wet. If you want a knife you can neglect, buy something
                in MagnaCut and pay more for it.
              </p>
              <p>
                At 8.7&nbsp;oz the Kestrel is heavy for a 4.1&nbsp;inch blade. That is a consequence
                of 0.14&nbsp;inch stock carried full width to the plunge, and it is deliberate: the
                mass sits behind the edge where it does work. It is the wrong knife for an ounce
                counter.
              </p>
            </div>
          </div>

          {/* purchase — configuration first, price last */}
          <aside className={`h-fit border ${RULE} bg-[var(--p-sheet)] p-[var(--p-s3)] lg:sticky lg:top-[var(--p-s3)] dark:bg-[var(--p-sheet-d)]`}>
            <fieldset className="border-0 p-0">
              <legend className={`kx-note text-[length:var(--p-t-xs)] uppercase tracking-[0.14em] ${INK3}`}>Scale material</legend>
              <div className="mt-[var(--p-s2)] flex gap-[var(--p-s2)]">
                {SCALES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setScale(s.id)}
                    aria-pressed={scale === s.id}
                    className={`flex min-h-[44px] flex-1 flex-col items-center justify-center gap-[var(--p-s1)] rounded-[var(--p-r)] border px-[var(--p-s1)] py-[var(--p-s2)] transition-colors duration-[var(--p-d-fast)] ${edge(scale === s.id)}`}
                  >
                    <span aria-hidden className="size-5 rounded-full ring-1 ring-[var(--p-edge)] dark:ring-[var(--p-edge-d)]" style={{ background: s.swatch }} />
                    <span className={`kx-note text-[length:var(--p-t-xs)] uppercase ${scale === s.id ? BLUE : INK3}`}>{scale === s.id ? "✓ " : ""}{s.label}</span>
                  </button>))}</div>
              <p className={`mt-[var(--p-s2)] text-[length:var(--p-t-sm)] ${INK2}`}>{scaleOpt.note}</p>
            </fieldset>

            <fieldset className={`mt-[var(--p-s3)] border-0 border-t ${RULE} p-0 pt-[var(--p-s3)]`}>
              <legend className={`kx-note text-[length:var(--p-t-xs)] uppercase tracking-[0.14em] ${INK3}`}>Sheath</legend>
              <div className="mt-[var(--p-s2)] space-y-[var(--p-s1)]">
                {SHEATHS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSheath(s.id)}
                    aria-pressed={sheath === s.id}
                    className={`flex min-h-[44px] w-full items-baseline gap-[var(--p-s2)] rounded-[var(--p-r)] border px-[var(--p-s2)] py-[var(--p-s2)] text-left transition-colors duration-[var(--p-d-fast)] ${edge(sheath === s.id)}`}
                  >
                    <span className={`kx-note text-[length:var(--p-t-sm)] uppercase tracking-[0.08em] ${sheath === s.id ? BLUE : INK3}`}>{sheath === s.id ? "✓ " : ""}{s.label}</span>
                    <span className={`kx-note ml-auto text-[length:var(--p-t-sm)] ${INK3}`}>{s.extra ? `+ $${s.extra}` : "included"}</span>
                  </button>))}</div>
              <p className={`mt-[var(--p-s2)] text-[length:var(--p-t-sm)] ${INK2}`}>{sheathOpt.note}</p>
            </fieldset>

            <div className={`mt-[var(--p-s3)] flex items-baseline justify-between border-t ${RULE} pt-[var(--p-s3)]`}>
              <span className={`kx-note text-[length:var(--p-t-xs)] uppercase tracking-[0.14em] ${INK3}`}>Total</span>
              <span className={`kx-note text-[length:var(--p-t-xl)] ${INK}`}>${price}</span>
            </div>

            <button
              type="button"
              onClick={() => setAdded(true)}
              className={`kx-note mt-[var(--p-s3)] flex min-h-[48px] w-full items-center justify-center gap-[var(--p-s2)] rounded-[var(--p-r)] border-2 px-[var(--p-s3)] text-[length:var(--p-t-sm)] uppercase tracking-[0.14em] transition-colors duration-[var(--p-d-fast)] ${added ? `${INK} ${edge(true)}` : "border-[var(--p-graphite)] bg-[var(--p-graphite)] text-[var(--p-sheet)] dark:border-[var(--p-graphite-d)] dark:bg-[var(--p-graphite-d)] dark:text-[var(--p-sheet-d)]"}`}
            >
              {added ? <Check className="size-4" aria-hidden /> : null}
              {added ? "In your order" : `Order — $${price}`}
            </button>

            <p className={`kx-note mt-[var(--p-s2)] text-[length:var(--p-t-xs)] uppercase tracking-[0.08em] ${INK3}`}>
              {weeks} week lead time · built to order
              {scaleOpt.slow ? " · natural micarta is on a four week backorder" : ""}
            </p>

            <ul className={`mt-[var(--p-s3)] space-y-[var(--p-s2)] border-t ${RULE} pt-[var(--p-s3)] text-[length:var(--p-t-sm)] ${INK2}`}>
              {TRUST.map(([Icon, text]) => (
                <li key={text} className="flex gap-[var(--p-s2)]">
                  <Icon className={`mt-1 size-3.5 shrink-0 ${INK3}`} aria-hidden />
                  {text}
                </li>))}
            </ul>
          </aside>
        </section>

        {/* revision log — the trust signal a maker of eleven years actually has */}
        <section className={`mt-[var(--p-s6)] border-t ${RULE} pt-[var(--p-s4)]`}>
          <Label>Revision history</Label>
          <ul className="mt-[var(--p-s3)] grid grid-cols-1 gap-[var(--p-s3)] sm:grid-cols-3">
            {REVISIONS.map((r) => (
              <li key={r.rev} className={`border-l-2 ${RULE} pl-[var(--p-s3)]`}>
                <p className={`kx-note text-[length:var(--p-t-xs)] uppercase tracking-[0.12em] ${INK3}`}>{r.rev} · {r.year}</p>
                <p className={`mt-[var(--p-s1)] text-[length:var(--p-t-sm)] ${INK2}`}>{r.text}</p>
              </li>))}</ul>
        </section>

        {/* the rest of the line — all of it, because there are only two more */}
        <section className={`mt-[var(--p-s5)] border-t ${RULE} pt-[var(--p-s4)]`}>
          <Label>The other two things we make</Label>
          <ul className="mt-[var(--p-s3)] grid grid-cols-1 gap-[var(--p-s3)] sm:grid-cols-2">
            {LINE.map((p) => (
              <li key={p.name} className={`flex items-baseline gap-[var(--p-s3)] border-b ${RULE} pb-[var(--p-s2)]`}>
                <span className={`text-[length:var(--p-t-lg)] ${INK}`}>{p.name}</span>
                <span className={`text-[length:var(--p-t-sm)] ${INK2}`}>{p.blurb}</span>
                <span className={`kx-note ml-auto text-[length:var(--p-t-sm)] ${INK3}`}>${p.price}</span>
              </li>))}</ul>
        </section>
      </div>
    </div>
  );
}
