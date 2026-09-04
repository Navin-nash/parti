"use client";

import { useState } from "react";
import {
  Check,
  ChevronRight,
  MapPin,
  Package,
  Ruler,
  ShieldCheck,
  Truck,
  Wrench,
} from "@/lib/icons";

const VIEWS = [
  { label: "Full profile", detail: "Kestrel, olive micarta, leather sheath", tone: "#6b705c" },
  { label: "Grind and spine", detail: "Flat grind, 0.14\" stock at the spine", tone: "#8a8577" },
  { label: "Handle detail", detail: "Full tang, exposed pommel, brass pins", tone: "#5c5a4e" },
  { label: "In hand", detail: "4.1\" blade, 8.7 oz total", tone: "#7d7561" },
];

const SCALES = [
  { id: "olive", label: "Olive", swatch: "#6b705c" },
  { id: "black", label: "Black", swatch: "#25262b" },
  { id: "natural", label: "Natural", swatch: "#c2a882" },
];

const SHEATHS = [
  { id: "leather", label: "Leather", note: "Vegetable-tanned, dangler loop", extra: 0 },
  { id: "kydex", label: "Kydex", note: "0.08\", ambidextrous belt clip", extra: 12 },
];

const SPECS = [
  { label: "Blade steel", value: "CPM-3V, 58-60 HRC" },
  { label: "Blade length", value: "4.1 in (104 mm)" },
  { label: "Stock thickness", value: "0.14 in (3.6 mm)" },
  { label: "Grind", value: "Full flat, 0.015 in behind the edge" },
  { label: "Construction", value: "Full tang, exposed pommel" },
  { label: "Handle", value: "Canvas micarta, brass pins" },
  { label: "Overall length", value: "8.9 in (226 mm)" },
  { label: "Weight", value: "8.7 oz (247 g) knife only" },
  { label: "Origin", value: "Marquette, Michigan" },
];

const TABS = ["Steel", "Heat treat", "Care"] as const;

const TAB_COPY: Record<(typeof TABS)[number], string[]> = {
  Steel: [
    "CPM-3V is a particle-metallurgy tool steel chosen for toughness rather than edge-holding records. It takes impact — batoning, prying at the tip, frozen wood — without chipping, which is the failure mode that ends most field knives.",
    "It is not stainless. At 7.5% chromium it will patina and, left wet, it will spot. The blade ships with a light oil coat; wipe it dry and it stays cosmetic.",
  ],
  "Heat treat": [
    "Cryo-quenched and double-tempered in small batches to 58-60 HRC. We run 3V a point softer than most makers so the edge rolls before it chips — a rolled edge comes back on a strop in the field, a chipped one does not.",
    "Every blade is hardness-tested and the reading is recorded against the serial number stamped on the ricasso.",
  ],
  Care: [
    "Strop on loaded leather every few uses; a full sharpening on diamond stones once or twice a season. 3V is abrasion-resistant, so ceramic rods do little.",
    "Wipe dry after use and oil before long storage. Leather sheaths hold moisture — store the knife out of the sheath.",
  ],
};

const SIBLINGS = [
  { name: "Harrier", desc: "Folding pocket knife, 3.0 in CPM-154", price: 164 },
  { name: "Plover", desc: "Kitchen utility, 5.5 in AEB-L", price: 142 },
];

const fmt = (n: number) => `$${n}`;

export function KestrelBaseline() {
  const [view, setView] = useState(0);
  const [scale, setScale] = useState("olive");
  const [sheath, setSheath] = useState("leather");
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<(typeof TABS)[number]>("Steel");
  const [added, setAdded] = useState(false);

  const sheathOpt = SHEATHS.find((s) => s.id === sheath)!;
  const unit = 189 + sheathOpt.extra;
  const activeScale = SCALES.find((s) => s.id === scale)!;

  return (
    <div
      data-arm="baseline"
      style={
        {
          "--b-brand": "#3f4a3c",
          "--b-brand-hover": "#333d31",
          "--b-brand-dark": "#a8bda2",
          "--b-accent-soft": "#f1f4ef",
          "--b-accent-soft-dark": "rgba(168,189,162,0.12)",
          "--b-page-max": "1120px",
          "--b-radius": "0.5rem",
        } as React.CSSProperties
      }
      className="w-full bg-white font-sans text-[15px] text-slate-700 antialiased dark:bg-zinc-950 dark:text-zinc-300"
    >
      <div className="mx-auto px-6 py-8" style={{ maxWidth: "var(--b-page-max)" }}>
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-1.5 text-sm text-slate-500 dark:text-zinc-500">
          <span>Field Notes Co.</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span>Fixed blades</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-slate-800 dark:text-zinc-200">Kestrel</span>
        </nav>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Gallery */}
          <div>
            <div
              className="flex aspect-[4/3] w-full items-end overflow-hidden rounded-lg border border-slate-200 shadow-sm dark:border-zinc-800"
              style={{
                background: `linear-gradient(135deg, ${VIEWS[view].tone} 0%, #d8d4cb 100%)`,
              }}
            >
              <p className="m-4 rounded-md bg-black/45 px-3 py-1.5 text-sm text-white backdrop-blur-sm">
                {VIEWS[view].detail}
              </p>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-3">
              {VIEWS.map((v, i) => (
                <button
                  key={v.label}
                  onClick={() => setView(i)}
                  aria-label={`View ${v.label}`}
                  aria-pressed={i === view}
                  className="aspect-square rounded-lg border-2 transition-colors"
                  style={{
                    background: `linear-gradient(135deg, ${v.tone} 0%, #d8d4cb 100%)`,
                    borderColor: i === view ? "var(--b-brand)" : "transparent",
                  }}
                />
              ))}
            </div>
            <p className="mt-3 text-xs text-slate-500 dark:text-zinc-500">
              {view + 1} of {VIEWS.length} — {VIEWS[view].label}
            </p>
          </div>

          {/* Purchase area */}
          <div>
            <p className="text-sm font-medium tracking-wide text-slate-500 uppercase dark:text-zinc-500">
              Field Notes Co.
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-zinc-50">
              The Kestrel
            </h1>
            <p className="mt-2 text-slate-600 dark:text-zinc-400">
              A 4.1-inch CPM-3V field knife. One model, unchanged in eleven years apart
              from the handle pins.
            </p>

            <div className="mt-5 flex items-baseline gap-3">
              <span className="text-2xl font-semibold text-slate-900 dark:text-zinc-50">
                {fmt(unit)}
              </span>
              {sheathOpt.extra > 0 && (
                <span className="text-sm text-slate-500 dark:text-zinc-500">
                  {fmt(189)} + {fmt(sheathOpt.extra)} kydex
                </span>
              )}
            </div>

            {/* Scale colour */}
            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-900 dark:text-zinc-100">
                  Scale colour
                </span>
                <span className="text-sm text-slate-500 dark:text-zinc-500">
                  {activeScale.label}
                </span>
              </div>
              <div className="flex gap-2">
                {SCALES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setScale(s.id)}
                    aria-pressed={scale === s.id}
                    className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors"
                    style={{
                      borderColor: scale === s.id ? "var(--b-brand)" : "#e2e8f0",
                      background: scale === s.id ? "var(--b-accent-soft)" : "transparent",
                    }}
                  >
                    <span
                      className="h-4 w-4 rounded-full ring-1 ring-black/10"
                      style={{ background: s.swatch }}
                    />
                    <span className="text-slate-700 dark:text-zinc-300">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sheath */}
            <div className="mt-5">
              <span className="mb-2 block text-sm font-medium text-slate-900 dark:text-zinc-100">
                Sheath
              </span>
              <div className="grid grid-cols-2 gap-2">
                {SHEATHS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSheath(s.id)}
                    aria-pressed={sheath === s.id}
                    className="rounded-lg border p-3 text-left transition-colors"
                    style={{
                      borderColor: sheath === s.id ? "var(--b-brand)" : "#e2e8f0",
                      background: sheath === s.id ? "var(--b-accent-soft)" : "transparent",
                    }}
                  >
                    <span className="flex items-center justify-between text-sm font-medium text-slate-900 dark:text-zinc-100">
                      {s.label}
                      {s.extra > 0 && (
                        <span className="text-xs font-normal text-slate-500">+{fmt(s.extra)}</span>
                      )}
                    </span>
                    <span className="mt-0.5 block text-xs text-slate-500 dark:text-zinc-500">
                      {s.note}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity + CTA */}
            <div className="mt-6 flex items-center gap-3">
              <div className="flex items-center rounded-lg border border-slate-200 dark:border-zinc-800">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="px-3 py-2 text-slate-600 hover:text-slate-900 disabled:opacity-40 dark:text-zinc-400"
                  disabled={qty === 1}
                >
                  −
                </button>
                <span className="w-8 text-center text-sm tabular-nums">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(4, q + 1))}
                  aria-label="Increase quantity"
                  className="px-3 py-2 text-slate-600 hover:text-slate-900 disabled:opacity-40 dark:text-zinc-400"
                  disabled={qty === 4}
                >
                  +
                </button>
              </div>
              <button
                onClick={() => {
                  setAdded(true);
                  window.setTimeout(() => setAdded(false), 1800);
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors"
                style={{ background: added ? "var(--b-brand-hover)" : "var(--b-brand)" }}
              >
                {added ? <Check className="h-4 w-4" /> : null}
                {added ? "Added to cart" : `Add to cart — ${fmt(unit * qty)}`}
              </button>
            </div>

            <p className="mt-3 flex items-center gap-2 text-sm text-slate-600 dark:text-zinc-400">
              <Package className="h-4 w-4 text-slate-400" />
              Made to order. Ships in about 2 weeks — every Kestrel is ground and
              sharpened after you order it.
            </p>

            {/* Trust signals */}
            <ul className="mt-6 grid grid-cols-1 gap-3 border-t border-slate-200 pt-6 sm:grid-cols-2 dark:border-zinc-800">
              {[
                { icon: Wrench, title: "Lifetime sharpening", body: "Send it back any time; you pay shipping one way." },
                { icon: MapPin, title: "Marquette, Michigan", body: "Ground, heat treated and finished in one shop." },
                { icon: ShieldCheck, title: "30-day returns", body: "Unused and unsharpened, full refund." },
                { icon: Truck, title: "Free US shipping", body: "Tracked, signature on delivery." },
              ].map((t) => (
                <li key={t.title} className="flex gap-2.5">
                  <t.icon className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--b-brand)" }} />
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-zinc-100">{t.title}</p>
                    <p className="text-sm text-slate-500 dark:text-zinc-500">{t.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Specifications */}
        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-slate-900 dark:text-zinc-50">
              <Ruler className="h-5 w-5 text-slate-400" />
              Specifications
            </h2>
            <div className="mt-4 overflow-hidden rounded-lg border border-slate-200 shadow-sm dark:border-zinc-800">
              <table className="w-full text-left text-sm">
                <tbody>
                  {SPECS.map((s, i) => (
                    <tr
                      key={s.label}
                      className={
                        i % 2 === 1
                          ? "bg-slate-50 dark:bg-zinc-900/50"
                          : "bg-white dark:bg-transparent"
                      }
                    >
                      <th
                        scope="row"
                        className="w-2/5 px-4 py-2.5 font-medium text-slate-600 dark:text-zinc-400"
                      >
                        {s.label}
                      </th>
                      <td className="px-4 py-2.5 text-slate-900 tabular-nums dark:text-zinc-100">
                        {s.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tabs */}
          <div>
            <div className="flex gap-1 border-b border-slate-200 dark:border-zinc-800">
              {TABS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className="-mb-px border-b-2 px-3 py-2 text-sm font-medium transition-colors"
                  style={{
                    borderColor: tab === t ? "var(--b-brand)" : "transparent",
                    color: tab === t ? "var(--b-brand)" : undefined,
                  }}
                >
                  <span className={tab === t ? "dark:text-[var(--b-brand-dark)]" : "text-slate-500 dark:text-zinc-500"}>
                    {t}
                  </span>
                </button>
              ))}
            </div>
            <div className="mt-4 space-y-3">
              {TAB_COPY[tab].map((p) => (
                <p key={p.slice(0, 24)} className="text-sm text-slate-600 dark:text-zinc-400">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-14 border-t border-slate-200 pt-8 dark:border-zinc-800">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-zinc-50">
            The other two
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-zinc-500">
            Field Notes Co. has made three products since 2015. These are the other two.
          </p>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {SIBLINGS.map((s) => (
              <a
                key={s.name}
                href="#"
                className="flex items-center gap-4 rounded-lg border border-slate-200 p-4 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800"
              >
                <span
                  className="h-16 w-16 shrink-0 rounded-lg"
                  style={{ background: "linear-gradient(135deg, #8a8577 0%, #d8d4cb 100%)" }}
                />
                <span className="min-w-0 flex-1">
                  <span className="block font-medium text-slate-900 dark:text-zinc-100">
                    {s.name}
                  </span>
                  <span className="block truncate text-sm text-slate-500 dark:text-zinc-500">
                    {s.desc}
                  </span>
                </span>
                <span className="text-sm font-semibold text-slate-900 dark:text-zinc-100">
                  {fmt(s.price)}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
