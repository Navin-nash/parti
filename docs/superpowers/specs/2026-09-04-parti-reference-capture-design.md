# Design — `reference`: capture design & motion from inspiration sites

**Date:** 2026-09-04
**Skill:** `parti` (this repo)
**Status:** implemented 2026-09-04 (plan: docs/superpowers/plans/2026-09-04-parti-reference-capture.md)

---

## 1. Problem

`parti` specifies motion in prose + code snippets (`references/motion.md` §12) and reviews it
with `scripts/motion.py`, but it has **no way to ingest motion or interaction from a running
page**. A screenshot — the only reference input it accepts today — freezes one frame. Scroll
choreography, page-load sequences, section-to-section hand-offs, stagger cadence, parallax
depth, and easing *feel* all live in time, not pixels. Users routinely ask for "make it work
like `siteX.com`" and the skill can only guess.

Two asks, one pipeline:

1. Let users share reference/inspiration URLs.
2. Have the skill **capture**, **explain**, and **make buildable** the specific design
   elements, transitions, and animations from those pages — in the user's own stack.

The same pipeline, pointed at the user's *own* build, closes the hand-wave in Build step B4
("fidelity on the real build") by making the motion check a measurement rather than an
eyeball.

---

## 2. Governing principle

Extends parti's core rule (*"style is derived, never selected"*):

> **A reference is captured per _element_, never per _site_.** Every borrowed element lands in
> a dated record stating what it is, why it works, and whether it was copied faithfully or
> re-derived. The skill will not reproduce a site's overall identity — layout system + type +
> color + motion together — from a single URL. If a request amounts to that, it is surfaced as
> a conflict (offer: name a specific element / run `explore` *informed by* the reference /
> proceed element-by-element), not executed.

Provenance **is** the anti-clone mechanism: nothing is borrowed silently.

---

## 3. Decisions locked in brainstorming

| # | Decision | Choice |
|---|---|---|
| 1 | Fidelity model | **Per element, faithful _or_ adapted, user picks each. Never a whole-site clone.** |
| 2 | Runtime assumption | **Ship a Playwright script + agent-driven snippet path + static-only fallback.** |
| 3 | Capture scope | **Motion + one named element's construction (DOM/CSS/states). Not a full token system.** |
| 4 | Workflow entry | **New `reference` command + auto-trigger when a URL appears in a `parti` invocation.** |
| 5 | Artifact lifecycle | **Persistent `captures/<domain>-<date>.md` + `.json`; one dated `DESIGN.md` Changelog line.** |

---

## 4. The `reference` command

Added to the **Direction** command group in `SKILL.md` and `references/commands.md`.

| Command | Input | Output | Cost |
|---|---|---|---|
| `reference` | one or more URLs + optional focus ("the nav", "the scroll reveals", "that pricing toggle") | capture report in `captures/`, per-element spec with **Faithful** and **Adapted** columns | M |

### 4.1 Invocation

- **Explicit:** `parti reference https://siteX.com/pricing — the plan toggle and the scroll reveals`
- **Auto-trigger:** any URL in a `parti` invocation (`redesign my hero like stripe.com`,
  `build this the way linear.app does it`) runs `reference` first, emitting exactly one line:
  `Capturing linear.app first (focus: hero motion). Say "skip capture" to work from description only.`
- **Multiple URLs:** `reference A.com B.com` → one report, each element attributed to its
  source. Still per-element; no cross-site identity merge.

### 4.2 Effort modifiers

Standard `quick` / `standard` / `deep` behavior, consistent with the rest of the skill:

| Level | Capture depth |
|---|---|
| `quick` | Tier 1 only (static). Fast, dependency-free, explicitly partial. |
| `standard` (default) | Tier 1 + Tier 2 (Playwright runtime) if available, else Tier 1 + note. |
| `deep` | + `prefers-reduced-motion` pass, scroll-through screencast for the feel pass, multi-viewport (mobile + desktop). |

Whatever the level, the report states **what was not covered**.

### 4.3 Whole-site-clone refusal

If the focus is absent or amounts to "everything / the whole look", the command does not run a
capture. It responds with the three options in §2 and waits.

---

## 5. Capture pipeline — three tiers

`scripts/capture.py` orchestrates. Tiers run cheapest-first; stop once the stated focus is
answered. The report always records which tier ran and what it could not see.

### 5.1 Tier 1 — Static (always runs, standard-library only)

`urllib` fetches the HTML, every linked stylesheet (by URL — never `sheet.cssRules`, which
throws cross-origin), and referenced JS bundles. Extracts:

- **CSS motion:** `@keyframes` blocks, `transition` / `animation` shorthands and longhands,
  `cubic-bezier(...)` / `steps(...)`, `animation-timeline: scroll()` / `view()`,
  `@starting-style`, `transition-behavior: allow-discrete`, `@view-transition`,
  `view-transition-name`.
- **Library fingerprint** from `<script src>` and chunk names: GSAP / ScrollTrigger /
  SplitText, Motion (framer-motion), Lenis, Locomotive Scroll, Swiper, AOS, Lottie, Rive,
  Three / R3F.
- **Trigger hints** from markup: `data-scroll`, `data-aos`, `data-speed`, `data-lag`,
  `data-gsap`.

Answers well for plain-CSS sites. **Blind to:** minified-JS motion (most React sites),
canvas/WebGL, anything JS-triggered.

### 5.2 Tier 2 — Playwright runtime (`standard`+, if `playwright` importable)

Headless Chromium. The import is guarded; absence falls to Tier 1 with a note.

- **CDP `Animation` domain** enabled → animations captured as they are created, with resolved
  easing / keyframes / delay / duration.
- **`document.getAnimations()` dump** → every `CSSAnimation` / `CSSTransition` / WAAPI
  `Animation`; for each, `effect.getKeyframes()` + `effect.getTiming()`. Catches Motion, which
  runs through WAAPI.
- **Library introspection when a global is present:**
  - `ScrollTrigger.getAll()` → each trigger's `trigger`, `start`, `end`, `scrub`, `pin`,
    `animation.vars`.
  - `gsap.globalTimeline.getChildren()` for timeline structure.
  - `window.lenis` / Locomotive / Swiper instance options (easing, duration, lerp).
- **Scroll sampler:** step `scrollTo` 0 → 100 % in ~40 increments, `requestAnimationFrame`-wait
  each step, record `{ scrollY, transform, opacity, filter }` for elements matching the focus
  selector → the scroll→property curve (parallax, pin ranges, section entry points).
- **Observer log:** `MutationObserver` + `IntersectionObserver` → which class / inline-style
  flip is tied to which element crossing which threshold.
- **Focus element:** trimmed `outerHTML`, computed box model, and each state captured by
  synthetically toggling `:hover` / `:focus-visible` / `[aria-expanded]` / `[data-state]`.
- **`deep` only:** re-run under emulated `prefers-reduced-motion: reduce`; capture a
  scroll-through screencast (frames) for the qualitative "feel" pass.

### 5.3 Tier 3 — Agent-driven (harness has an MCP browser, no Playwright)

`references/motion-capture.md` carries copy-paste in-page JS snippets — the `getAnimations`
dump, the `ScrollTrigger.getAll` dump, the scroll sampler. The agent runs them through
whatever browser tool its harness provides (Claude Browser pane, claude-in-chrome, Playwright
MCP) and pastes the results back. Non-deterministic; the report is stamped `tier 3
(agent-captured)`.

### 5.4 Honesty requirements

The report's **"Not captured"** section names, every time it applies: minified-JS motion under
Tier 1, canvas / WebGL, Rive / Lottie assets, auth-walled content. No millisecond values are
ever invented — an un-measurable behavior is described qualitatively or flagged for the Tier 3
snippet path / a user description.

---

## 6. Capture schema

`scripts/capture.py --json` writes `/tmp/capture.json` (machine); the agent renders
`captures/<domain>-<date>.md` (human). Two parts.

### 6.1 Motion findings — one row per distinct behavior

```
element         focus selector / description
trigger         load | scroll(range) | hover | press | in-view(threshold) | route-change
mechanism       what visibly happens, one sentence
properties      transform / opacity / filter / clip-path — measured from → to
timing          duration, easing (as cubic-bezier), delay, stagger, iterations
library         CSS | WAAPI | GSAP+ScrollTrigger | Motion | Lenis | View Transitions | ...
scrubbed?       yes(lag=N) | no
reduced-motion  what the site does under `reduce` (or "nothing — a11y gap")
```

### 6.2 Focus element anatomy (scope B — one named element)

```
structure       trimmed DOM + the CSS rules that carry the mechanism (layout, spacing, motion)
states          default / hover / focus-visible / active / open — each as observed
why it works    the design rationale, in parti's voice
```

### 6.3 Two columns per element (decision 1)

- **Faithful** — exact measured values, re-expressed in the user's stack: their easing token
  where one already matches, the raw `cubic-bezier` where none does. Perf mistakes are *not*
  propagated — a finding that animates `height` / `top` / `width` is re-expressed with the
  `transform` / `opacity` equivalent and the substitution is noted.
- **Adapted** — the mechanism and intent only; values re-derived from the user's own tokens,
  density, and motion posture (from `DESIGN.md` / the token spec).

---

## 7. The capture artifact

New top-level `captures/` directory, modeled on `plans/`. Per capture:
`captures/<domain>-<date>.md` + `captures/<domain>-<date>.json`.

Example skeleton:

```markdown
# Capture — stripe.com/pricing   (2026-09-04, tier 2, full + reduced)
Focus: plan toggle, section reveals
Not captured: hero gradient (WebGL — noted, not reproduced)

## Motion findings
### nav collapse
trigger      scroll, scrollY > 64
mechanism    height 80→64px, border-bottom fades in
properties   height (layout — flagged), border-color 0→1
timing       200ms cubic-bezier(.25,.1,.25,1), no stagger
library      CSS transition
reduced      unchanged (feedback, not decoration)
FAITHFUL →   same behavior, animate box-shadow opacity not height (perf); map to --ease-out
ADAPTED  →   your dashboard nav is already 56px; not enough travel to be worth motion — skip

### section reveal
...

## Focus element — plan toggle
structure    <fieldset role=radiogroup> ... 2 labels, sliding pill via ::before translateX
states       default / hover (pill bg +4%) / focus-visible (2px ring) / checked (translateX 100%)
why it works one element moves, not two crossfading — reads as a single physical control
FAITHFUL →   [code in user's stack]
ADAPTED  →   [same mechanism, user's radius + accent + 120ms]

## Adopted
- nav collapse → ADAPTED → skipped (rationale above)
- plan toggle  → FAITHFUL → [build path filled in at build time]
```

`DESIGN.md` Changelog gets one line:
`2026-09-04 — captured plan-toggle mechanism from stripe.com/pricing (faithful); see captures/stripe-com-2026-09-04.md`

`captures/` entries are **evidence**: pruned when stale, not deleted; superseded captures kept.

---

## 8. Wiring into existing flow

One sentence added to each definition; all delegate to the single `reference` definition
rather than restating the pipeline.

| Location | Addition |
|---|---|
| `explore` step 2 (derive constraints) | "If a reference URL was given, run `reference` first; its findings are constraints and its Adapted column feeds steps 3–4." |
| `motion` command | "Reference URL present → `reference`, then write the spec as a diff from the captured findings, in `motion.md` §12 format." |
| `redesign` mode | "A 'like siteX' request → `reference` on siteX during the audit; put every borrowed element on the keep/change list explicitly." |
| `build` step B4 (verify) | "If motion was captured, run `capture.py` on the shipped build and diff its `getAnimations` dump against the spec — a measured fidelity check, not an eyeball one." |
| `sync` command | "Fill in the build path for each Adopted row in the relevant `captures/*.md`." |

---

## 9. Guardrails & failure modes

| Case | Behavior |
|---|---|
| Focus absent / "the whole look" | No capture. Offer the three §2 options, wait. |
| Distinctive signature element, faithful mode | Report header carries a one-line note that faithfully reproducing a signature element is a design-originality question for the user to weigh. Flagged, not policed. |
| Tier 1 on a minified React site / canvas / WebGL / Rive / Lottie / auth wall | Named in "Not captured". Offer the Tier 3 snippet path or ask the user to describe it. No invented values. |
| Cross-origin stylesheet | Fetched by URL directly. |
| Reference has no reduced-motion handling | Recorded as a gap the user's build must **not** inherit. |
| Finding animates a layout property | Faithful column substitutes the `transform` / `opacity` form and notes it. |
| Playwright absent | Auto-fall to Tier 1 + note. `deep` without Playwright warns that feel / scroll capture is unavailable. |
| Same URL captured before | New dated file; prior kept. Report notes the prior capture exists. |

---

## 10. Files

### New

| Path | Purpose |
|---|---|
| `scripts/capture.py` | Three-tier orchestrator. Flags: `--url` (repeatable), `--focus`, `--tier auto\|static\|runtime`, `--json <path>`, `--out captures/`. Playwright import guarded; Tier 1 pure stdlib. Emits JSON on the schema in §6. |
| `references/motion-capture.md` | Pipeline reference: the three tiers, the Tier 3 in-page JS snippets, the §6 schema, the §9 guardrails, and the Faithful-vs-Adapted method with a worked example. |
| `captures/README.md` | What the directory is, the `<domain>-<date>` naming, that entries are evidence (pruned, not deleted). |

### Edited

| Path | Change |
|---|---|
| `SKILL.md` | `reference` row in the Direction command table; `capture.py` in the Scripts block; one line in the Step 0 "on the way out" note about `captures/`. |
| `references/commands.md` | Full `reference` entry — input / output / cost, auto-trigger line, effort-modifier table, whole-site refusal. |
| `references/motion.md` | Pointer from §12: "specifying motion from a captured reference → `references/motion-capture.md`". |
| `references/design-md.md` | The Changelog-line format for a capture (§7). |

---

## 11. Testing

Follows the repo's existing `evals/` + `scripts/` pattern.

| Test | Asserts |
|---|---|
| `scripts/capture.py` unit — saved HTML/CSS fixtures: a GSAP page, a Motion page, a plain-CSS page, a canvas page | Library fingerprint correct; `@keyframes` / `transition` extraction correct; the "Not captured" list is right for the canvas and Motion fixtures. |
| Playwright smoke — against a fixture served from `examples/nextjs` (already has motion) | `getAnimations` dump is non-empty; the scroll sampler produces a monotonic scrollY series with at least one element whose `transform` changes across the range. |
| `evals/trigger_cases.json` additions | A bare URL in a `parti` invocation triggers `reference`; "make it look exactly like X.com" triggers the whole-site refusal, not a capture. |

Tier 3 is not unit-tested (non-deterministic by nature); its snippets are exercised by the
Playwright smoke test running the same JS.

---

## 12. Out of scope

- Full design-token capture from a reference (type scale + spacing + color + radius/shadow as
  a system). Decision 3 caps capture at one named element.
- Capturing / reproducing Rive, Lottie, or WebGL/shader assets. Flagged, never reproduced.
- Cross-site identity merge ("nav from A + type from B + motion from C").
- A general web-scraping / cloning tool. This is scoped to design-and-motion learning for an
  existing `parti` engagement.
