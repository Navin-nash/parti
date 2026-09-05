# Evaluation — D:/portfolio

**Subject:** Navin Raj Govindan portfolio · Next.js 16 + Tailwind + framer-motion/GSAP
**Run:** `evaluate` · standard depth · 102 files scanned
**Step 0:** `DESIGN.md` exists (271 lines) and is treated as **binding**.

---

## Verdict

| | |
|---|---|
| **Measured score** | 69.6 / 100 — *Drifting* |
| **Corrected measured score** | **~78 / 100** — see [Instrument corrections](#instrument-corrections) |
| **Recommended scale** | **Surgical** — 5 fixes, most of the perceived gain, ~1 day |

The raw 69.6 is misleading in both directions. Two dimensions are penalised for things the project does *right* but the scripts can't see; one dimension is credited for two checks that are simply wrong. Corrected, this is a **Coherent** system with a small number of specific, cheap defects — not a system that needs rebuilding.

**Do not read the headline number.** Read the five findings.

---

## What is genuinely strong

Stated first because it is load-bearing, and because a redesign recommendation here would be wrong.

- **A real, written design system.** 271 lines specifying colour, type, spacing, radius, shadow, motion, and component patterns — with *rationale*, not just values. Most portfolios have no such document.
- **A distinctive type system.** Babylonica / Julius Sans One / Elms Sans / Diphylleia, with Korean text given its own face. This is a genuine, non-convergent choice.
- **An 8px base unit is actually detectable** in the shipped code (14.2/15 on spatial rhythm) — the scale is real, not aspirational.
- **OKLCH authoring** — 62 occurrences. Ahead of most production codebases.
- **The stated concept is honest.** *"Avoids the cliché purple-gradient dark portfolio aesthetic"* — and it does. The audit found no gradient tell, no glass-card tell, no bento tell.

---

## Findings

### 1 · `--text-tertiary` fails AA in both themes — 8 live sites

**Severity: P0 · usability failure · verified**

| | Value | On base | Ratio | AA body |
|---|---|---|---|---|
| Light | `#A3A3A0` | `#FAFAF9` | **2.42:1** | ✗ |
| Dark | `#505050` | `#0C0C0B` | **2.43:1** | ✗ |

`DESIGN.md` assigns this token to *"Placeholders, disabled, captions."* Captions and placeholders are text and must clear 4.5:1; only genuinely disabled controls are exempt. In the code it is applied as `color:` at **8 sites**, including `About.tsx:194`, where it styles the **inactive tab label** in a tab set — interactive navigation text, not disabled text.

**Fix — minimal, hue and chroma preserved:**

```
light   #A3A3A0  →  #737370   (4.55:1)   L 71.5% → 55.5%
dark    #505050  →  #7B7B7B   (4.62:1)   L 43.1% → 58.1%
```

Change two values in `app/globals.css` (lines 245 and 276). Nothing else moves.

### 2 · The signature accent does not survive the default theme

**Severity: P1 · concept failure · verified**

`DESIGN.md` names the memorable element explicitly: *"the crisp ice-blue accent on a white canvas."* Measured:

| Accent `#C7F6FE` on | Ratio |
|---|---|
| Dark base `#0C0C0B` | **16.81:1** — excellent |
| Light base `#FAFAF9` | **1.11:1** — invisible |

The accent is never used as text (0 sites — verified), so this is not a body-copy failure. But `DESIGN.md` assigns it to *"highlights, underlines, active states, tags, CTA borders."* An **active state** at 1.11:1 conveys nothing, and WCAG 1.4.11 requires 3:1 for UI components that carry meaning.

**The signature element was designed in dark mode and does not hold in the light mode the spec declares default.**

**Options, in order of preference:**

1. **Keep `#C7F6FE` as a fill, add a light-mode ink.** Accent-as-background with `--text-primary` on it already works. For strokes/underlines/active states in light mode, derive a deeper companion: `#7EDCEE` is also too light at 1.51:1 — you need roughly `oklch(62% 0.10 220)` to clear 3:1 on `#FAFAF9`.
2. **Make dark the default theme.** The system is measurably stronger there; the spec's own premise would need rewriting.

This is the one finding that touches the concept rather than the execution, which is why it is worth deciding deliberately rather than patching.

### 3 · No reduced-motion handling anywhere

**Severity: P0 · accessibility floor · verified**

Zero occurrences of `prefers-reduced-motion` **or** framer's `useReducedMotion` across `app/`, `components/`, `lib/`, `hooks/`.

The project ships framer-motion, GSAP, and three.js, and `DESIGN.md` specifies fade-up entrances with staggered delays, scroll-triggered reveals, and an accent glow pulse. That is a lot of motion with no opt-out.

`audit.py` reported *"reduced-motion handled: True"* — **that report is wrong**; see [Instrument corrections](#instrument-corrections). `motion.py` is correct.

**Fix:** one block in `globals.css`, plus `useReducedMotion()` guarding the framer sequences. Degrade per element — hold the pulse static, let entrances land instantly — rather than nuking all motion globally.

### 4 · `transition-all` and over-budget durations

**Severity: P1 · craft · verified at `file:line`**

`motion.py` reports `easing-transition-all` and `timing-over-300ms` clustered in `components/lets-work-section.tsx` (lines 31, 41, 51, 67, 80, 89) and `components/layout/Navbar.tsx` (94, 106).

`transition: all` animates properties nobody chose — including layout properties, off the GPU. The durations run 500–700ms on hover-scale surfaces; `DESIGN.md`'s own scale says *Standard: 300ms*, reserving 600ms for "slow". So this is drift from the project's own spec, not an outside opinion.

**Fix:** name the properties (`transition-[transform,opacity]`) and bring hover surfaces to `duration-300` or below.

### 5 · Off-scale spacing via arbitrary Tailwind values

**Severity: P2 · system erosion · verified**

**536 arbitrary Tailwind values.** The most frequent are sizing escapes that sit off the declared 8px scale:

```
[10px] ×16   [3px] ×8   [9px] ×7   [2px] ×5   [11px] ×5   [12px] ×4
```

`DESIGN.md` declares `4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128`. Values of 3, 9, 10, and 11px are not on it. Individually trivial; collectively this is how an 8px system stops being one.

Also: **20 custom properties defined but never referenced** (`--cell-radius`, `--cell-size`, `--color-accent`, `--color-accent-foreground`, `--color-background`, …), and a dead `--font-sans: 'Plus Jakarta Sans'` at `globals.css:184` — a font that appears nowhere in `DESIGN.md` and is referenced nowhere in the code.

**Fix:** delete the dead tokens; convert the recurring off-scale values to the nearest scale step or add them to the scale deliberately.

---

## Keep list

Things a redesign would be tempted to touch and should not:

- The four-font system. It is the distinctive asset.
- The 8px base unit — it is working (14.2/15).
- OKLCH authoring.
- The white-forward, non-gradient direction. The stated anti-reference is correct and the code honours it.

---

## Instrument corrections

Recorded because this run doubles as a test of the evaluator. Each was verified against source.

| # | Instrument claim | Reality | Effect |
|---|---|---|---|
| 1 | `reduced-motion handled: True` | **Zero** occurrences in the tree | False accessibility pass |
| 2 | `all sampled pairs clear 4.5:1` | `#A3A3A0` at 2.42:1 on 8 live text sites | False colour all-clear |
| 3 | `Type System 10.0/20 — no font-family declarations found` | Four families declared via CSS vars | ~10 pts under-credited |
| 4 | `Distinctiveness 6.0/15 — Inter/Geist/DM Sans as the only typeface` | Matched a **dead** `--font-sans` token; four real families exist | ~9 pts under-credited |
| 5 | 29 P0 token-drift findings | ~12 are third-party brand SVGs and library params | ~41% precision |

**Correction 1 — root cause found.** `RE_REDUCED_MOTION` in `audit.py:57` includes `matchMedia\(`. A single unrelated line — `hooks/use-mobile.ts:9`, `window.matchMedia("(max-width: 767px)")` — flips the check to true. `matchMedia(` appears in nearly every React app for mobile and theme detection, so **this false pass generalises well beyond this project**. `motion.py` disagreed and was right; the two instruments contradict each other on the same tree.

**Correction 5 — precision.** Eight of the drift findings are in `Skills.tsx` and are inline **brand logo SVGs** (`#004482`, `#659AD2` are the official C++ logo colours). Three more are third-party component parameters (`chart.tsx`, `cobe-globe.tsx`, `dotted-map.tsx`). You cannot recolour a vendor's logo to your accent. The meaningful drift is the ~11 findings in `tailwind.config.ts`, `globals.css`, `enhanced-button.tsx`, `layout.tsx`, and `theme-toggle-buttons.tsx`.

**Correction 4 caveat.** The tell was a *true match on the pattern* — `Plus Jakarta Sans` really is at `globals.css:184` — but its label, *"as the only typeface"*, is false, and the 9-point penalty it drives is unearned.

---

## What was not covered

Standard depth, static analysis only. Not assessed: rendered visual hierarchy, whether the copy carries its weight, responsive behaviour below 640px, keyboard traversal order, or the actual feel of the motion in a browser. The judged half above is derived from code and spec, not from looking at the running site.
