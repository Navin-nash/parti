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
  },
  {
    name: "audit", group: "Direction", cost: "S",
    purpose: "Extract the real design system",
    input: "codebase",
    output: "de-facto design system, written to DESIGN.md",
    detail:
      "Reads what the design system actually is rather than what the docs claim, then reports the three largest gaps between the two. This is evaluate without the scoring, and it is the right first command on any unfamiliar codebase.",
    example: "audit . deep",
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
  },
  {
    name: "redesign", group: "Direction", cost: "M-L",
    purpose: "Surgical or directional plan",
    input: "an existing design",
    output: "a plan at one of two scales, plus a keep list",
    detail:
      "Audits before proposing, then always offers both scales: surgical (5-8 highest-leverage fixes inside the existing system, days) and directional (the full explore process, weeks). Ends with an explicit keep list, because users have muscle memory and relocating everything taxes the people who liked it most.",
    example: "redesign the pricing page, surgical",
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
  },
  {
    name: "critique", group: "Direction", cost: "S",
    purpose: "Evidence-based review, no changes",
    input: "anything visual",
    output: "findings sorted by kind",
    detail:
      "Review without touching anything. Sorts findings into usability failure, system failure, dated convention, and taste - and labels which is which, because collapsing taste into usability is the fastest way to lose the reader's trust.",
    example: "critique this dashboard",
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
  },
  {
    name: "motion", group: "Direction", cost: "M",
    purpose: "Animation spec and library decision",
    input: "existing motion, or a brief",
    output: "posture, the one moment, durations, easings, reduced-motion",
    detail:
      "Decides first whether each thing should animate at all, then specifies posture, the single choreographed moment, what animates with duration and easing, what never animates, and the library decision - including the option of none. If the audit shows two general-purpose animation libraries, that is itself a finding.",
    example: "motion - the comparison viewer",
  },
  {
    name: "review", group: "Direction", cost: "S",
    purpose: "Rule-id findings at file:line",
    input: "codebase or a diff",
    output: "findings by severity, plus missed opportunities separately",
    detail:
      "Runs motion.py and lint.py for the scripted half, then reads for what a script structurally cannot see: whether an animation has a purpose, how often its surface is actually used, personality mismatch, competing focal points. A clean script run is not a clean review, and the report says so rather than reporting PASS and stopping.",
    example: "review src/ --motion",
  },
  {
    name: "animate", group: "Direction", cost: "S-M",
    purpose: "Build one animation, gated",
    input: "a component and a request for motion",
    output: "the animation, or a reasoned refusal",
    detail:
      "Two of the seven steps are gates, and they exist to produce zero lines of code sometimes: an action performed 100+ times a day, or initiated by keyboard, does not animate - say so plainly and offer the non-motion alternative. Reduced motion and pointer gating ship in the same edit, never as a follow-up.",
    example: "animate the disclosure panel",
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
  },
  {
    name: "copy", group: "Direction", cost: "S",
    purpose: "Microcopy pass",
    input: "interface text",
    output: "rewritten controls, errors, empty states",
    detail:
      "Names come from what the user controls, not how the system is built. A control says what happens when it is used. Errors state what happened, why, and the next step, in the interface's voice - never apologising, never vague. Generic copy templates a design as fast as generic layout.",
    example: "copy - the whole checkout flow",
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
  },
  {
    name: "polish", group: "Build", cost: "M",
    purpose: "Craft pass, no new features",
    input: "an existing screen",
    output: "the same screen, better made",
    detail:
      "No new scope. Padding math, optical alignment, transition timing, and the difference between reaching for a card and reaching for a divider.",
    example: "polish this component",
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
  },
  {
    name: "lint", group: "Build", cost: "XS",
    purpose: "Scripted anti-slop and drift report",
    input: "any built code",
    output: "tells and token drift, by severity",
    detail:
      "The one that catches a good direction reverting to defaults. Reports build-time tells an audit at plan time could not see, plus token drift - any colour in the shipped code that is not in the spec it was handed. A clean run means nothing on the known list is wrong, not that the build is good.",
    example: "lint src --tokens tokens.json",
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
  },
  {
    name: "a11y", group: "Build", cost: "S",
    purpose: "WCAG floor verification",
    input: "any code",
    output: "a pass, or the specific failures",
    detail:
      "AA contrast, visible focus, 44px targets, reduced motion honoured, hierarchy that survives grayscale, full keyboard operability. A floor rather than a direction, and built to silently.",
    example: "a11y",
  },
  {
    name: "perf", group: "Build", cost: "S",
    purpose: "Animation and bundle cost pass",
    input: "any code",
    output: "what costs what, and what to cut",
    detail:
      "Scoped to animation and bundle cost. Broader performance engineering is explicitly outside the skill's scope, and it says so rather than pretending otherwise.",
    example: "perf - the landing page",
  },

  {
    name: "variants", group: "Shared", cost: "M",
    purpose: "N alternatives on one axis",
    input: "one component",
    output: "N versions differing on exactly one thing",
    detail:
      "One axis at a time, at whichever fidelity is already in play. Varying three things at once produces three options nobody can reason about.",
    example: "variants - the CTA, on density",
  },
  {
    name: "sync", group: "Shared", cost: "XS",
    purpose: "Update DESIGN.md",
    input: "recent direction or build changes",
    output: "the file, updated, with a dated changelog line",
    detail:
      "Any change to colour, type, space, shape, motion or a rule gets written back. Silent overrides are how the file stops being trusted.",
    example: "sync",
  },

  {
    name: "plan", group: "Handoff", cost: "S",
    purpose: "One self-contained plan file",
    input: "a finding, or a described change",
    output: "a plan file another agent can execute cold",
    detail:
      "Self-contained is the requirement: the executing agent has none of this conversation. A plan that says 'as discussed' is not a plan.",
    example: "plan the empty-state fix",
  },
  {
    name: "execute", group: "Handoff", cost: "M",
    purpose: "Build a plan in isolation, review its diff",
    input: "a plan file",
    output: "the change, plus a reviewed diff",
    detail:
      "Built in isolation, so the plan is genuinely tested as a plan, then the diff is reviewed against it before it lands.",
    example: "execute plans/003-empty-states.md",
  },
  {
    name: "reconcile", group: "Handoff", cost: "XS",
    purpose: "Refresh plans/ against the code",
    input: "an existing plans directory",
    output: "statuses refreshed, drifted references fixed",
    detail:
      "Plans go stale the moment someone edits the code by hand. This is the cheap sweep that keeps the directory honest.",
    example: "reconcile",
  },
];

export function commandsByGroup(group: CommandGroup): Command[] {
  return COMMANDS.filter((c) => c.group === group);
}

export function commandByName(name: string): Command | undefined {
  return COMMANDS.find((c) => c.name === name);
}
