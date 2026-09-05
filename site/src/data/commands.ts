/**
 * The command taxonomy, transcribed from references/commands.md in the skill
 * repo. Groups, inputs, outputs and costs are the skill's, not ours.
 *
 * Cost is the skill's own XS/S/M/L scale - a sense of how much work the
 * command is, not a price. It is printed because knowing that `lint` is XS and
 * `explore` is L is most of what you need in order to decide which to reach
 * for on a given afternoon.
 */

export type CommandGroup = "Direction" | "Build" | "Shared" | "Handoff";
export type Cost = "XS" | "S" | "M" | "L" | "S-M" | "M-L";

export interface Command {
  name: string;
  group: CommandGroup;
  purpose: string;
  input: string;
  output: string;
  cost: Cost;
  /** What it actually does, in the skill's own terms. */
  detail: string;
  /** An invocation you could paste. */
  example: string;
  relatedExamples?: string[];
  relatedComponents?: string[];
  /**
   * A real, dated run of the script(s) behind this command, or the fixed shape
   * of the document the agent writes when there is no script. `executed` blocks
   * are literal terminal output captured 2026-09-04; `artifact` blocks are the
   * structure, not a mock of specific values. See docs/commands-in-action.md.
   */
  run?: {
    kind: "executed" | "artifact";
    /** The command line, for `executed`. */
    cmd?: string;
    /** Trimmed output / structure. */
    out: string;
  };
}

export const COMMAND_GROUPS: { id: CommandGroup; blurb: string }[] = [
  {
    id: "Direction",
    blurb:
      "Deciding what the thing should be. These produce specs, findings and directions - not code.",
  },
  {
    id: "Build",
    blurb:
      "Turning a decided direction into code that still matches it. The failure mode here is not a bad direction, it is a good direction quietly reverting to defaults on the way to production.",
  },
  { id: "Shared", blurb: "Useful at either altitude." },
  {
    id: "Handoff",
    blurb:
      "For work that goes to a different agent, a cheaper model, or next week rather than getting built now.",
  },
];

export const COMMANDS: Command[] = [
  {
    name: "evaluate", group: "Direction", cost: "S",
    purpose: "Score an existing design",
    input: "codebase or screenshot",
    output: "measured + judged score, findings",
    detail:
      "Runs audit.py and score.py for the measured half, then judges hierarchy, signature, content fit, copy, state coverage and concept by hand with written evidence. Never reports one blended number: the two halves have different epistemic status and blending them hides which is which. Screenshot input scores the judged half only, and says so.",
    example: "evaluate ./src",
    relatedExamples: ["finance-research-platform", "campaign-analytics"],
    run: {
      kind: "executed",
      cmd: "python skills/parti/scripts/audit.py site/src --json a.json && python skills/parti/scripts/score.py a.json",
      out: `Scanned 95 files under site/src

Color Discipline    12.0/20  ████████████········
Type System         17.5/20  ██████████████████··
Spatial Rhythm      12.5/15  █████████████████···
Tokenization        12.0/15  ████████████████····
Motion Craft        11.0/15  ███████████████·····
Distinctiveness      9.0/15  ████████████········
                 ≈ 74/100 · "Sound underneath; the gaps are cheap to close."

NOT MEASURED — judge these yourself, with evidence, separately:
    hierarchy · signature · content fit · copy · state coverage · concept`,
    },
  },
  {
    name: "audit", group: "Direction", cost: "S",
    purpose: "Extract the real design system",
    input: "codebase",
    output: "de-facto design system, written to DESIGN.md",
    detail:
      "Reads what the design system actually is rather than what the docs claim, then reports the three largest gaps between the two. This is evaluate without the scoring, and it is the right first command on any unfamiliar codebase.",
    example: "audit . deep",
    run: {
      kind: "executed",
      cmd: "python skills/parti/scripts/audit.py site/src",
      out: `COLOR    213 unique · 27 chromatic · oklch:0 hsl:0
         ⚠ 3 sampled pairs below 4.5:1 (worst #6366f1 on #edebe6 = 3.75:1)
TYPE     3 families: Geist, Geist Mono, Plus Jakarta Sans
SPACE    13 values · base unit 8 · 3 off-grid
SHAPE    3 radii · 0 shadows
SYSTEM   150 vars defined · 2504 arbitrary TW values · 14 !important

TELLS    2 detected
         • Inter/Geist/DM Sans as the only typeface  →  app/layout.tsx
         • Fade-up-on-scroll applied uniformly        →  arms/finance-research-platform/parti.tsx`,
    },
  },
  {
    name: "explore", group: "Direction", cost: "L",
    purpose: "Three divergent directions",
    input: "a brief",
    output: "3 directions, rendered, with a recommendation",
    detail:
      "The core loop, and the one command that produces something new rather than correcting something existing. Brief, constraints, three directions that differ on at least two of the six axes, rendered with real content at one viewport, critiqued against the skill's own anti-slop pass, then converged with a stated recommendation.",
    example: "explore - a research workspace for independent investors",
    relatedExamples: ["finance-research-platform", "agent-platform-landing", "product-page"],
    run: {
      kind: "artifact",
      out: `## Brief         one sentence, back to you for confirmation
## Constraints   stack · must-keeps · non-negotiables

## Direction A — <name>   differs from B and C on ≥2 of the 6 axes
   thesis · type (named faces + source) · colour (OKLCH, accent rule)
   space · motion (posture + the one moment) · signature
   [rendered at one viewport, real content]
## Direction B — <name>   …
## Direction C — <name>   …

## Anti-slop pass    each direction vs references/bans.md
## Recommendation    one direction, stated, with why`,
    },
  },
  {
    name: "redesign", group: "Direction", cost: "M-L",
    purpose: "Surgical or directional plan",
    input: "an existing design",
    output: "a plan at one of two scales, plus a keep list",
    detail:
      "Audits before proposing, then always offers both scales: surgical (5-8 highest-leverage fixes inside the existing system, days) and directional (the full explore process, weeks). Ends with an explicit keep list, because users have muscle memory and relocating everything taxes the people who liked it most.",
    example: "redesign the pricing page, surgical",
    run: {
      kind: "artifact",
      out: `## Audit summary     (from audit.py) — what the system actually is
## Surgical  ~1 day  5–8 highest-leverage fixes INSIDE the existing system
   1. …  file:line  ·  before → after  ·  why it's leverage
## Directional ~weeks  the full explore process, new direction
## Keep list         what does NOT move, and why — muscle memory is real

# real example: evals/portfolio-evaluation.md recommends
# "surgical — 5 fixes, most of the perceived gain, ~1 day" over a rebuild`,
    },
  },
  {
    name: "deslop", group: "Direction", cost: "S",
    purpose: "Find and replace the tells",
    input: "codebase or design",
    output: "tell list with a specific replacement for each",
    detail:
      "The narrowest, highest-value command. For each tell it reports where it is, why it reads as generated, and what to put there instead - drawn from the subject's own world. Replace, never merely delete: a tell removed leaves a hole, and ranked by how visible the tell is to a first-time viewer rather than by how easy it is to fix.",
    example: "deslop src/components",
    relatedComponents: ["hero", "feature-grid", "testimonial"],
    run: {
      kind: "executed",
      cmd: "python skills/parti/scripts/lint.py site/src",
      out: `P1  Emoji standing in for a UI icon            arms/components/marketing/parti.tsx
P1  Emoji standing in for a UI icon            arms/product-page/parti.tsx
P2  \`rounded-2xl\` reached for indiscriminately  app/page.tsx  (+13 files)
P2  Default shadow utility reused 11x, no override  arms/components/marketing/baseline.tsx

{'P2': 19, 'P1': 2, 'P0': 5}  ->  FAIL (P0 present)

# the script finds WHERE + WHAT KIND. the agent supplies the replacement,
# from the subject's own world — never just deletion.`,
    },
  },
  {
    name: "critique", group: "Direction", cost: "S",
    purpose: "Evidence-based review, no changes",
    input: "anything visual",
    output: "findings sorted by kind",
    detail:
      "Review without touching anything. Sorts findings into usability failure, system failure, dated convention, and taste - and labels which is which, because collapsing taste into usability is the fastest way to lose the reader's trust.",
    example: "critique this dashboard",
    run: {
      kind: "artifact",
      out: `## Usability failure   measurable: contrast, target size, keyboard trap
## System failure      inconsistent with the design's own rules
## Dated convention    was fine in 2019, reads as old now
## Taste               the reviewer's opinion, flagged as opinion

# each finding is labelled which of the four it is. collapsing taste
# into usability is the fastest way to lose the reader's trust.`,
    },
  },
  {
    name: "typeset", group: "Direction", cost: "S",
    purpose: "Type scale and pairing",
    input: "an existing type system",
    output: "scale, ratio, roles, measure, tracking, numerals",
    detail:
      "Picks a ratio from what the content is (1.2 dense UI, 1.25-1.333 general, 1.414-1.618 editorial), rebuilds the scale on it, and assigns families to display, body and utility roles. Names the specific faces and their source - a pairing recommendation without named faces is not actionable.",
    example: "typeset - the docs site",
    relatedComponents: ["article-header", "code-block"],
    relatedExamples: ["infrastructure-docs"],
    run: {
      kind: "artifact",
      out: `## Content read   dense UI | general | editorial  → picks the ratio
## Ratio          1.2 / 1.25 / 1.333 / 1.414 / 1.618  (chosen, with why)
## Scale          every step, rebuilt on that ratio
## Roles          display / body / utility → named faces + where to get them
## Measure        ch target per role
## Tracking       per size
## Numerals       lining / oldstyle · tabular where

# a pairing without named faces + source is not actionable — the command won't emit one`,
    },
  },
  {
    name: "palette", group: "Direction", cost: "S",
    purpose: "Color system, contrast-verified",
    input: "existing colors, or a brief",
    output: "OKLCH palette with every pair's ratio stated inline",
    detail:
      "Delivered in OKLCH with hex alongside, every text pair's contrast printed in the spec, and a stated rule for how the accent may be used. Verified with color.py rather than asserted - a builder who cannot see the number will assume it passes.",
    example: "palette - derive from the subject, verify at AA",
    relatedExamples: ["finance-research-platform"],
    run: {
      kind: "executed",
      cmd: 'python skills/parti/scripts/color.py contrast "#6366f1" "#edebe6"  /  fix  /  ramp',
      out: `contrast  #6366f1 on #edebe6   3.75:1   AA body ✗  AA large ✓

fix       #6366f1 → #5757E1 on #edebe6 = 4.57:1
          (L 58.5% → 54.0%, hue and chroma preserved)

ramp "#B23A2E" --steps 9
   400  #E3695A  oklch(66.5% 0.155 29.0)   3.26 on white
   500  #C1483B  oklch(56.4% 0.158 29.1)   4.93 on white
   600  #9D281F  oklch(46.3% 0.155 28.9)   7.62 on white

# every number is measured, not asserted. fix moves lightness only,
# only as far as the target needs.`,
    },
  },
  {
    name: "motion", group: "Direction", cost: "M",
    purpose: "Animation spec and library decision",
    input: "existing motion, or a brief",
    output: "posture, the one moment, durations, easings, reduced-motion",
    detail:
      "Decides first whether each thing should animate at all, then specifies posture, the single choreographed moment, what animates with duration and easing, what never animates, and the library decision - including the option of none. If the audit shows two general-purpose animation libraries, that is itself a finding.",
    example: "motion - the comparison viewer",
    run: {
      kind: "executed",
      cmd: "python skills/parti/scripts/motion.py site/src --census",
      out: `CENSUS
  distinct durations : 9  [0, 1, 100, 120, 140, 180, 200, 240, 900]
  distinct curves    : 2
  reduced-motion     : 8 site(s)
  hover gated        : NO

# 2 curves against 9 durations: the timing is scaled but the feel is
# unauthored — mostly browser defaults. "hover gated: NO" is a finding on its own.`,
    },
  },
  {
    name: "review", group: "Direction", cost: "S",
    purpose: "Rule-id findings at file:line",
    input: "codebase or a diff",
    output: "findings by severity, plus missed opportunities separately",
    detail:
      "Runs motion.py and lint.py for the scripted half, then reads for what a script structurally cannot see: whether an animation has a purpose, how often its surface is actually used, personality mismatch, competing focal points. A clean script run is not a clean review, and the report says so rather than reporting PASS and stopping.",
    example: "review src/ --motion",
    run: {
      kind: "executed",
      cmd: "python skills/parti/scripts/motion.py site/src/arms",
      out: `FINDINGS
  agent-platform-landing/baseline.tsx  [physics-no-press-feedback]
     pressable elements styled for :hover with no :active/whileTap
  … 12 files total

  | Rule | Count | Severity |
  | physics-no-press-feedback | 12 | P1 |
  {'P1': 12}  ->  PASS

  Still to judge by hand: purpose & frequency, cohesion, staging, missed opportunities.

# PASS on the script is NOT a clean review, and the report says so.`,
    },
  },
  {
    name: "animate", group: "Direction", cost: "S-M",
    purpose: "Build one animation, gated",
    input: "a component and a request for motion",
    output: "the animation, or a reasoned refusal",
    detail:
      "Two of the seven steps are gates, and they exist to produce zero lines of code sometimes: an action performed 100+ times a day, or initiated by keyboard, does not animate - say so plainly and offer the non-motion alternative. Reduced motion and pointer gating ship in the same edit, never as a follow-up.",
    example: "animate the disclosure panel",
    run: {
      kind: "artifact",
      out: `1. What is the moment?
2. GATE — frequency:  performed 100+×/day?    → refuse, offer non-motion alternative
3. GATE — input:      keyboard-initiated?      → refuse, offer non-motion alternative
4. Property + trigger
5. Duration + easing   (from DESIGN.md tokens)
6. prefers-reduced-motion + pointer gating   — SAME edit, never a follow-up
7. The code

# output is the animation, OR a reasoned refusal naming which gate stopped it`,
    },
  },
  {
    name: "reference", group: "Direction", cost: "M",
    purpose: "Capture design and motion from an inspiration URL",
    input: "one or more URLs, plus a focus",
    output: "per-element capture with faithful and adapted columns, in captures/",
    detail:
      "A user shares a reference site; the skill runs a three-tier pipeline - static CSS read, then a headless-Chromium pass that scrolls the page and re-reads getAnimations() so scroll-triggered reveals surface, then an agent-driven snippet path - and returns the mechanism, the from/to keyframe values, the duration and easing, and when each thing fires. Captured per element, never a whole-site clone: a focus is required, and a request for the whole look is refused. The report always states which tier ran and what it could not see, and never invents a value.",
    example: "reference https://siteX.com/pricing - the plan toggle and the scroll reveals",
    relatedExamples: ["agent-platform-landing", "product-page"],
    run: {
      kind: "executed",
      cmd: 'python skills/parti/scripts/capture.py --url https://hyperswitch.io --focus "the hero and the scroll reveals" --tier runtime',
      out: `site           build              tier      findings   note
hyperswitch.io Astro + hand CSS   runtime   37         3 scroll reveals @ 1s cubic-bezier(.4,0,.2,1)
vercel.com     Next.js            runtime   129        ran past a 403; @starting-style flagged
gsap.com       GSAP+ScrollTrigger runtime   21 + 44 ST honest note: GSAP motion not in the WAAPI
linear.app     React + CSS-in-JS  runtime   296        density note fires; start from the subset
stripe.com     React, bot-walled  static    0          degrades honestly, exit 0
localhost:3000 this site          runtime   8          load-or-state reveal @ 420ms; no inflation

one real finding (hyperswitch JSON):
{ "trigger": "in-view / scroll", "mechanism": "CSSTransition transform",
  "keyframes": {"0%":{"transform":"translateY(100px)"},"100%":{"transform":"translateY(0px)"}},
  "timing": {"durations_ms":[1000],"easings":["cubic-bezier(.4,0,.2,1)"]} }`,
    },
  },
  {
    name: "density", group: "Direction", cost: "S",
    purpose: "Rhythm and information density",
    input: "a screen",
    output: "base unit, scale, section rhythm, row height, measure",
    detail:
      "Density is the most under-decided axis in generated design - everything defaults to a comfortable medium. Establishes what the content actually demands (sparse, measured, dense), then corrects the base unit, spacing scale, line height, row height and container width. A daily-use tool and a marketing page cannot share a rhythm.",
    example: "density - this is a daily tool, not a brochure",
    relatedComponents: ["data-table", "stat-cards"],
    relatedExamples: ["campaign-analytics"],
    run: {
      kind: "artifact",
      out: `## Content demand   sparse | measured | dense   (the call, with why)
## Base unit        corrected value
## Spacing scale    rebuilt
## Line height      per role
## Row height       for tabular surfaces
## Container width   measure target

# everything in generated design defaults to a comfortable medium. a daily
# tool and a marketing page cannot share a rhythm.`,
    },
  },
  {
    name: "states", group: "Direction", cost: "M",
    purpose: "Empty, loading, error, overflow",
    input: "a component or flow",
    output: "every state designed, not only the ideal one",
    detail:
      "Empty first-run and empty cleared-by-user are different states. Loading is a skeleton, a spinner or a progress bar depending on expected duration. Errors state what happened, why, and the next step. Most designs that fall apart in production only ever had the ideal state designed.",
    example: "states - the watchlist table",
    relatedComponents: ["empty-state", "error-state", "loading-state"],
    run: {
      kind: "artifact",
      out: `## Empty — first run        different from…
## Empty — cleared by user   …this
## Loading                   skeleton | spinner | progress — by expected duration
## Error                     what happened · why · the next step, in the UI's voice
## Overflow / long content   what wraps, truncates, scrolls
## Partial / stale           if data can be incomplete

# most designs that fall apart in production only ever had the ideal state designed`,
    },
  },
  {
    name: "signature", group: "Direction", cost: "S",
    purpose: "The one memorable element",
    input: "a direction or product",
    output: "the element, where it appears, how it degrades",
    detail:
      "Must come from the subject's own world - its instruments, artifacts, vernacular or data - not from a catalog of effects. Delivered with how it degrades on mobile and under reduced motion, and what goes quiet around it. Boldness is spent once: if two things are shouting, one is noise.",
    example: "signature - what is this remembered by?",
    relatedExamples: ["product-page"],
    run: {
      kind: "artifact",
      out: `## The element      from the subject's instruments / artifacts / data / vernacular
                   — NOT a catalogue of effects
## Where it appears
## How it degrades   mobile · reduced-motion
## What goes quiet   around it — boldness is spent once`,
    },
  },
  {
    name: "copy", group: "Direction", cost: "S",
    purpose: "Microcopy pass",
    input: "interface text",
    output: "rewritten controls, errors, empty states",
    detail:
      "Names come from what the user controls, not how the system is built. A control says what happens when it is used. Errors state what happened, why, and the next step, in the interface's voice - never apologising, never vague. Generic copy templates a design as fast as generic layout.",
    example: "copy - the whole checkout flow",
    run: {
      kind: "artifact",
      out: `## Controls      name = what happens when used, not how the system is built
## Errors        what happened · why · next step — never apologising, never vague
## Empty states  what this is · how to fill it
## Labels / headings   in the interface's voice`,
    },
  },
  {
    name: "tokens", group: "Direction", cost: "S",
    purpose: "Emit the token spec",
    input: "a chosen direction",
    output: "the full spec, in a fixed consumable format",
    detail:
      "Format is fixed so it can be consumed directly by build or by an engineer. If a design system already exists, the direction is expressed as a diff against it - changed, added, deprecated - rather than a fresh spec someone has to reconcile.",
    example: "tokens",
    relatedExamples: ["finance-research-platform"],
    run: {
      kind: "artifact",
      out: `colour   — every token, OKLCH + hex, contrast pairs stated
type     — families, scale, roles, measure, tracking
space    — base unit, scale
shape    — radii, borders
shadow   — elevation set
motion   — durations, easings, what never animates

# if a design system already exists, output is a DIFF —
# changed / added / deprecated — not a fresh spec to reconcile`,
    },
  },

  {
    name: "build", group: "Build", cost: "L",
    purpose: "Spec to working, verified code",
    input: "a spec or brief",
    output: "working code, every named state, verified",
    detail:
      "Detects the existing stack before asking, builds the screen the spec's job names first, designs every state in the same pass, then verifies three ways: scripted lint, contrast measurement, and a fidelity re-check against the same floor the mockup was held to. Tokens are law; craft is where the freedom is.",
    example: "build the watchlist screen",
    relatedExamples: ["finance-research-platform", "agent-platform-landing", "infrastructure-docs"],
    run: {
      kind: "artifact",
      out: `1. Detect stack        (before asking)
2. Build the screen the spec's job names FIRST
3. Every named state in the SAME pass
4. Verify three ways:
   · lint.py            scripted anti-slop + token drift
   · color.py           every shipped text pair re-measured
   · fidelity re-check   against the floor the mockup was held to

# tokens are law; craft is where the freedom is`,
    },
  },
  {
    name: "polish", group: "Build", cost: "M",
    purpose: "Craft pass, no new features",
    input: "an existing screen",
    output: "the same screen, better made",
    detail:
      "No new scope. Padding math, optical alignment, transition timing, and the difference between reaching for a card and reaching for a divider.",
    example: "polish this component",
    run: {
      kind: "artifact",
      out: `## Padding math        every box re-checked against the scale
## Optical alignment   where mathematical centre reads as off
## Transition timing   durations and curves against the token set
## Card vs divider     the difference between reaching for each

# no new scope — that's the whole discipline`,
    },
  },
  {
    name: "harden", group: "Build", cost: "M",
    purpose: "Complete every missing state and a11y",
    input: "an existing screen",
    output: "the missing states, built",
    detail:
      "The states discipline applied to code that already exists. Usually the largest single gap between a build that demos well and one that survives production.",
    example: "harden the settings page",
    relatedComponents: ["empty-state", "error-state", "loading-state"],
    run: {
      kind: "artifact",
      out: `# the states discipline applied to code that already exists
## Missing states     built — empty (both kinds), loading, error, overflow
## a11y floor         focus, targets, keyboard, reduced-motion
## What was ideal-only  named, then filled

# usually the largest single gap between a build that demos well
# and one that survives production`,
    },
  },
  {
    name: "lint", group: "Build", cost: "XS",
    purpose: "Scripted anti-slop and drift report",
    input: "any built code",
    output: "tells and token drift, by severity",
    detail:
      "The one that catches a good direction reverting to defaults. Reports build-time tells an audit at plan time could not see, plus token drift - any colour in the shipped code that is not in the spec it was handed. A clean run means nothing on the known list is wrong, not that the build is good.",
    example: "lint src --tokens tokens.json",
    run: {
      kind: "executed",
      cmd: "python skills/parti/scripts/lint.py site/src --tokens tokens.json",
      out: `{'P2': 19, 'P1': 2, 'P0': 5}  ->  FAIL (P0 present)

token-drift check (from the eval suite):
  ✓ exits 1 with an unspec'd color present
  ✓ flags the unspec'd gray as drift    #8a8f98 used but not in the token spec
  ✓ colors that ARE in the spec are not flagged
  ✓ without --tokens, drift isn't checked (no false claim)

# catches a good direction reverting to defaults on the way to production.
# a clean run means nothing on the known list is wrong — not that the build is good.`,
    },
  },
  {
    name: "responsive", group: "Build", cost: "S",
    purpose: "Breakpoint behavior, 320px up",
    input: "one screen",
    output: "intentional behavior at each width",
    detail:
      "Not a shrunk desktop layout. What a table becomes at 375px is a design decision, and the honest answer is often that it stops being a table.",
    example: "responsive - check from 320",
    relatedComponents: ["data-table", "comparison-table"],
    run: {
      kind: "artifact",
      out: `## 320   ## 375   ## 768   ## 1024   ## 1440
   per width: what each component BECOMES — a decision, not a scale factor
## The table    what it turns into at 375 (often: not a table)

# not a shrunk desktop layout`,
    },
  },
  {
    name: "a11y", group: "Build", cost: "S",
    purpose: "WCAG floor verification",
    input: "any code",
    output: "a pass, or the specific failures",
    detail:
      "AA contrast, visible focus, 44px targets, reduced motion honoured, hierarchy that survives grayscale, full keyboard operability. A floor rather than a direction, and built to silently.",
    example: "a11y",
    run: {
      kind: "artifact",
      out: `AA contrast          every text pair — verified with color.py
visible focus        every interactive element
44px targets         touch
reduced motion       honoured
grayscale hierarchy  survives
keyboard             full operability

# a floor, not a direction — built to silently`,
    },
  },
  {
    name: "perf", group: "Build", cost: "S",
    purpose: "Animation and bundle cost pass",
    input: "any code",
    output: "what costs what, and what to cut",
    detail:
      "Scoped to animation and bundle cost. Broader performance engineering is explicitly outside the skill's scope, and it says so rather than pretending otherwise.",
    example: "perf - the landing page",
    run: {
      kind: "artifact",
      out: `## Animation cost   what animates a layout property · what runs off main thread
## Bundle           what each animation library costs · what to cut
## Out of scope     broader perf engineering — stated, not pretended`,
    },
  },

  {
    name: "variants", group: "Shared", cost: "M",
    purpose: "N alternatives on one axis",
    input: "one component",
    output: "N versions differing on exactly one thing",
    detail:
      "One axis at a time, at whichever fidelity is already in play. Varying three things at once produces three options nobody can reason about.",
    example: "variants - the CTA, on density",
    run: {
      kind: "artifact",
      out: `## Axis            the ONE thing that varies (density | weight | radius | …)
## v1 … vN         each version, at whatever fidelity is already in play
## Held constant   everything else, listed

# varying three things at once produces three options nobody can reason about`,
    },
  },
  {
    name: "sync", group: "Shared", cost: "XS",
    purpose: "Update DESIGN.md",
    input: "recent direction or build changes",
    output: "the file, updated, with a dated changelog line",
    detail:
      "Any change to colour, type, space, shape, motion or a rule gets written back. Silent overrides are how the file stops being trusted.",
    example: "sync",
    run: {
      kind: "artifact",
      out: `## DESIGN.md diff    colour / type / space / shape / motion / a rule
## Changelog line    dated, one line per change

# silent overrides are how the file stops being trusted`,
    },
  },

  {
    name: "plan", group: "Handoff", cost: "S",
    purpose: "One self-contained plan file",
    input: "a finding, or a described change",
    output: "a plan file another agent can execute cold",
    detail:
      "Self-contained is the requirement: the executing agent has none of this conversation. A plan that says 'as discussed' is not a plan.",
    example: "plan the empty-state fix",
    run: {
      kind: "artifact",
      out: `## Context       everything the executing agent needs — it has none of this chat
## Change        file:line · before → after
## Verify        how to confirm it worked
## Out of scope  what NOT to touch

# a plan that says "as discussed" is not a plan`,
    },
  },
  {
    name: "execute", group: "Handoff", cost: "M",
    purpose: "Build a plan in isolation, review its diff",
    input: "a plan file",
    output: "the change, plus a reviewed diff",
    detail:
      "Built in isolation, so the plan is genuinely tested as a plan, then the diff is reviewed against it before it lands.",
    example: "execute plans/003-empty-states.md",
    run: {
      kind: "artifact",
      out: `## Built in isolation   the plan is genuinely tested AS a plan
## Diff                 the change
## Review               diff read against the plan before it lands`,
    },
  },
  {
    name: "reconcile", group: "Handoff", cost: "XS",
    purpose: "Refresh plans/ against the code",
    input: "an existing plans directory",
    output: "statuses refreshed, drifted references fixed",
    detail:
      "Plans go stale the moment someone edits the code by hand. This is the cheap sweep that keeps the directory honest.",
    example: "reconcile",
    run: {
      kind: "artifact",
      out: `## Statuses         each plan: done | in progress | stale | superseded
## Drifted refs     file:line pointers fixed against the current code

# the cheap sweep that keeps plans/ honest after someone edits code by hand`,
    },
  },
];

export function commandsByGroup(group: CommandGroup): Command[] {
  return COMMANDS.filter((c) => c.group === group);
}

export function commandByName(name: string): Command | undefined {
  return COMMANDS.find((c) => c.name === name);
}
