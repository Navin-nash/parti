# `reference` / `capture` — capability report

**What an agent actually gets back when a user shares an inspiration URL, and which
UI/UX design elements it can then replicate.**

Scope of this doc: `skills/parti/scripts/capture.py` + the `reference` command as they stand on `main`
after issues [#2](https://github.com/Navin-nash/parti/issues/2) and the keyframe-body /
focus-state follow-up. Companion to `skills/parti/references/motion-capture.md` (the how-to); this is the
honest "what it can and can't do".

---

## 1. What it is

`reference https://siteX.com --focus "<element or behaviour>"` runs a three-tier pipeline that
measures how a page's motion and one named element are built, and emits:

- `captures/<domain>-<date>.json` — the machine record
- `captures/<domain>-<date>.md` — a per-finding skeleton with an empty **Faithful** and
  **Adapted** column the agent then fills

The skill's rule holds throughout: **captured per element, never a whole-site clone.** Every
borrowed element gets a dated record with a faithful-or-adapted verdict.

---

## 2. The three tiers and what each returns

| Tier | Runs | Returns |
|---|---|---|
| **1 — static** (always, stdlib) | `urllib` fetches HTML + every linked stylesheet | every `@keyframes` **with its from/to values**, every `transition:` / `animation:` shorthand (property, duration, easing, iteration, stagger), `scroll-timeline` / `@starting-style` / `@view-transition` presence, animation-library fingerprint, `data-scroll` / `data-aos` / `data-speed` trigger hints, reduced-motion status |
| **2 — Playwright runtime** (`--tier auto`/`runtime`) | headless Chromium; scrolls top→bottom in 14 steps | everything from Tier 1 **plus**: `document.getAnimations()` at load *and* re-read at each scroll step → reveals tagged `trigger: in-view / scroll` with measured duration + easing + keyframe stops; `ScrollTrigger.getAll()` → every GSAP trigger's `start`/`end`/`scrub`/`pin`/`vars`; the focus element's DOM, computed box, `transition`, and `:hover` / `:focus` computed-style deltas; a scroll→transform/opacity curve for the focus elements; the resolved focus selector when `--focus` was plain English |
| **3 — agent-driven** (harness has an MCP browser, no Playwright) | agent pastes the `skills/parti/references/motion-capture.md` §4 snippets into its browser tool | the same three dumps, non-deterministically; stamped `tier 3 (agent-captured)` |

Tier 2 runs even when Tier 1 got a 403 (many sites block non-browser requests). A site that
also bot-walls headless Chrome stays on Tier 1 and the report says so.

---

## 3. What one finding carries

```json
{
  "mechanism": "@keyframes legendSlideUp",
  "trigger":   "in-view / scroll" | "load-or-state" | "unknown",
  "properties": ["transform", "opacity"],
  "keyframes":  {"0%": {"transform": "translateY(100%)", "opacity": ".5"},
                "100%": {"transform": "translateY(0)", "opacity": "1"}},
  "timing":     {"durations_ms": [300], "easings": ["cubic-bezier(.32,.72,0,1)"]},
  "library":    "CSS" | "WAAPI",
  "reduced_motion": "declared" | "not handled by the reference"
}
```

Plus, per report: `focus_element` (html, box, computed style, per-state deltas),
`focus_resolved_selector`, `scroll_samples` (the transform/opacity curve),
`runtime_libraries.gsap_scrolltrigger`, `finding_counts`, and a `not_captured` list that is
never empty and never invents a value.

---

## 4. Capability matrix — UI/UX design elements

**Legend:** ✅ build-sufficient (agent has property + values + timing + trigger) ·
🟡 partial (idea + some values; agent infers the rest) · ⚪ out of reach (flagged, not measured)

### Motion & transitions

| Element | Rating | What the agent gets | Best tier |
|---|---|---|---|
| **Reveal on scroll** (fade / slide-up on viewport-enter) | ✅ | property, from/to, duration, easing, `trigger: in-view / scroll` | 2 |
| **Staggered list / grid entrance** | ✅ | the `@keyframes` body + per-item `animation-delay` from the shorthand (`fadeUp .8s .1s`, `.8s .2s`) — the stagger step is explicit | 1 (values) + 2 (confirm it fires) |
| **Parallax** (transform driven by scroll) | ✅ | the focus element's `transition`, and `scroll_samples` showing `transform` moving `translateY(0) → translateY(-44px)` across the scroll range | 2 |
| **Sticky / pinned section** | ✅ | `position: sticky` in the focus element's computed style; GSAP `pin: true` + `start`/`end` when ScrollTrigger drives it | 2 |
| **Hover micro-interactions** (colour, shadow, border, background) | ✅ | the `transition:` shorthand (`color .16s ease`, `box-shadow .4s ease, background .4s ease`) + the `:hover` computed-style delta on the focus element | 1 + 2 |
| **Press / `:active` feedback** | 🟡 | the `transition` is captured; the depressed state is not synthetically triggered — agent applies the standard `scale(.97)` | 1 |
| **Focus ring** | 🟡 | `:focus` computed `outline` / `box-shadow` delta on the focus element | 2 |
| **Accordion / disclosure** | ✅ | `max-height .2s ease-out` / `grid-template-rows` transitions surface with the layout-property flagged for the transform/opacity rewrite | 1 |
| **Tooltip / popover** (scale-from-origin) | 🟡 | duration + easing + `scale`/`opacity` keyframe if CSS-driven; `transform-origin` and the anchor relationship are not measured | 1–2 |
| **Modal / dialog enter–exit** | 🟡 | the enter transition/keyframe if it runs at load or is caught mid-scroll; a click-gated modal is behind `not_captured: interaction` | 2 |
| **Drawer / sheet / bottom-sheet** | 🟡 | same as modal — the transition values if reachable, not the gesture | 2 |
| **Toast / snackbar** | ⚪ | interaction-gated; not triggered. Flagged | — |
| **Tab indicator** (shared-element slide) | 🟡 | the CSS transition on the indicator if present; `layoutId`-style shared-element morphs are not reconstructed | 1 |
| **Page-load choreography** (sequenced hero reveal) | ✅ | every animation running at load with its keyframe body, duration, easing, delay — the sequence is reconstructable from the delays | 2 |
| **Marquee / infinite logo strip** | ✅ | `@keyframes marquee { 0% { translate(0) } → 100% { translate(-100%) } }` + `20s linear infinite` | 1 |
| **Ambient background** (drifting blobs) | ✅ | `@keyframes drift` body + `25s ease-in-out infinite` | 1 |
| **Counter / number count-up** | 🟡 | the `@keyframes counter` body + `2s linear` if CSS-driven; JS-incremented counters are invisible | 1 |
| **Typewriter text** | 🟡 | `steps()` easing + width keyframe if CSS `steps`-based; JS-driven typing is invisible | 1 |
| **SVG path / line-draw** | 🟡 | `stroke-dashoffset` keyframes if CSS-animated; captured as generic keyframe values, not recognised as a line-draw | 1 |
| **Scroll-scrubbed timeline** (ScrollTrigger `scrub`) | 🟡 | the trigger's `start`/`end`/`scrub` and the tween's `vars` keys via `ScrollTrigger.getAll()` — enough to know the mechanism; the tween's from/to lives in GSAP internals, partially exposed | 2 |
| **Scroll-jacking / pinned horizontal scroll** | 🟡 | `pin: true` + range from ScrollTrigger; the panel layout is not reconstructed | 2 |
| **View Transitions** (route/page) | 🟡 | `@view-transition` / `view-transition-name` presence flagged in `features`; the captured pseudo-element animations are not run | 1 |
| **Cursor-follow / magnetic buttons** | ⚪ | pointer-driven JS; not measured. Flagged | — |
| **Drag-to-dismiss / gesture** | ⚪ | not measured | — |
| **Lottie / Rive assets** | ⚪ | fingerprinted and named in `not_captured` — "flagged, not reproduced; rebuild the intent" | — |
| **Canvas / WebGL / shader** | ⚪ | `<canvas>` presence flagged; internals unreadable even at runtime | — |
| **3D / React-Three-Fiber** | ⚪ | library fingerprinted; scene not measured | — |

### Structure & system

| Element | Rating | Notes |
|---|---|---|
| **One named component's DOM anatomy** | ✅ | `focus_element.html` (trimmed to 1200 chars), computed box, `display` / `position` / `transition` |
| **That component's states** (`:hover`, `:focus`) | ✅ (interactive) / n/a (static) | computed-style delta per state; a non-interactive element reports "no difference observed" |
| **`:open` / `[data-state]` variants** | 🟡 | only `:hover` and `:focus` are synthetically toggled today |
| **Design tokens** (colour ramp, type scale, spacing system) | ⚪ | out of scope by decision — capture is motion + one element, not a token system. Use `parti audit` on your own codebase, not the reference |
| **Whole-page layout / identity** | ⚪ | refused by design — the command asks for a specific element instead |

---

## 5. Which tier you need

| You want… | Minimum tier |
|---|---|
| the *values* of a CSS animation or transition (duration, easing, keyframe from/to) | **1 — static**, instant, no deps |
| to know *when* something fires (load vs scroll vs hover) | **2 — runtime** |
| the parallax / scroll-scrub curve, or a GSAP ScrollTrigger config | **2 — runtime** |
| a focus element's hover/focus state deltas | **2 — runtime** |
| any of the above on a site that blocks headless Chrome (e.g. Stripe) | **3 — agent-driven**, or accept Tier 1 values without triggers |

`--tier auto` (default) does 1, then 2 if `playwright` imports.

---

## 6. What the agent still brings

The capture is **evidence, not finished code.** After it runs, the agent:

1. Fills the **Faithful** column — the measured values re-expressed in the user's stack (their
   easing token where one matches; the raw `cubic-bezier` where none does; a layout-property
   animation rewritten as `transform`/`opacity`).
2. Fills the **Adapted** column — the *mechanism* only, with values re-derived from the user's
   own tokens, density, and motion posture.
3. Chooses, per element, which column to build — and refuses a straight identity copy.
4. Closes the reference's gaps that the user's build should **not** inherit — most commonly a
   missing `prefers-reduced-motion` path.

A capture with 37 findings is not "build 37 animations." It's the menu; the agent picks the
two or three that serve the user's brief.

---

## 7. Known limits & failure modes

| Limit | Effect | Mitigation |
|---|---|---|
| **Headless-Chrome bot walls** (Stripe, some Cloudflare configs) | Tier 2 can't load the page → falls to Tier 1 values with no triggers | run the Tier-3 snippets in a real browser; the report says when this happened |
| **CSS-in-JS with hashed names** (Linear) | hundreds of findings with identifiers like `sx-1vt4tmj-B` | `finding_counts` + a note; start from the `in-view / scroll` and `load-or-state` subset |
| **GSAP / JS animating via direct style writes** | not in `document.getAnimations()`, so absent from Motion findings | `ScrollTrigger.getAll()` data is surfaced in its own `## ScrollTrigger` section; a note fires when no WAAPI reveal was seen |
| **`trigger: unknown` at Tier 1** | static gives values but not when they fire | run Tier 2 |
| **Interaction-gated motion** (click-to-open modal, toast) | not triggered | listed in `not_captured`; describe it to the agent or use Tier 3 |
| **Reduced-motion pass is not automatic** | the reference's `reduce` variant isn't captured unless the CSS declares it inline | `--tier deep` (planned) re-runs under emulated `prefers-reduced-motion` |
| **Single viewport** | mobile-specific motion not captured | `--tier deep` (planned) adds mobile + desktop |
| **`transform-origin` / anchor relationships** | not measured | agent applies the standard origin-at-trigger rule |
| **Multi-`--url`** | findings union into one list with no per-source tag | the agent attributes each to its URL when rendering the markdown |

---

## 8. Real-world validation

`--tier runtime` against five live sites of different build, plus this repo's own
dev server. Run `2026-09-04`; per-command transcripts and the `evaluate` / `audit`
/ `palette` / `lint` / `motion` runs alongside them are in
[`docs/commands-in-action.md`](./commands-in-action.md).

| Site | Build | Tier reached | Findings | Result |
|---|---|---|---|---|
| **hyperswitch.io** | Astro + hand-rolled CSS | runtime | 37 | **3 scroll reveals** measured at `1s cubic-bezier(.4,0,.2,1)` and `.8s`; hero parallax via `focus_element` + a `scroll_samples` curve (`matrix(…0)` → `matrix(…-45)`); 13 `@keyframes` with full from/to bodies (`marquee`, `legendSlideUp`, `bounce`, `l3`…) |
| **vercel.com** | Next.js | runtime (past a 403 on direct fetch) | 129 | `@starting-style` flagged in `features`; 3 WAAPI `in-view / scroll` reveals; `var(--animate-*)` indirection filtered out |
| **gsap.com** | GSAP + ScrollTrigger | runtime | 21 + **44 ScrollTriggers** | `## ScrollTrigger` section populated from `getAll()`; honest `not_captured` note that no WAAPI reveal surfaced because GSAP animates off direct style writes |
| **linear.app** | React + CSS-in-JS | runtime | 296 | genuine hashed keyframes (`SjJXIW_fadeIn`) with 0 bare-token noise; density note fires + `finding_counts` breakdown (`CSS 213, WAAPI 83, load-or-state 80, in-view / scroll 3`) |
| **stripe.com** | React, aggressive bot detection | **static only** | 0 | degrades honestly — bot-walls headless Chrome, `not_captured` says so, exits 0 |
| **localhost:3000** (this site) | Next.js 16 | runtime | 8 | `load-or-state` reveal at `420ms cubic-bezier(.22,1,.36,1)`; `focus_element` DOM + computed box captured; no inflation — a small site produces a small capture |

Script eval suite: **86/86**, green with Playwright present and import-masked.

---

## 9. Running it

```bash
# fast, no dependencies — values only
python skills/parti/scripts/capture.py --url https://siteX.com --focus ".hero-section" --tier static \
  --json /tmp/cap.json --md captures/sitex-com-2026-09-04.md

# full — adds triggers, scroll curve, ScrollTrigger config, focus states
python skills/parti/scripts/capture.py --url https://siteX.com --focus ".hero-section" --tier runtime \
  --json /tmp/cap.json --md captures/sitex-com-2026-09-04.md
```

`--focus` is required. A plain-English focus ("the hero", "the scroll reveals") resolves
through a heuristic selector list at Tier 2 and the chosen selector is reported; pass a real
CSS selector for a precise lock. `--url` repeats for multiple references (still per element).

Output belongs in `captures/`; `DESIGN.md` gets a one-line dated Changelog entry per adopted
element.
