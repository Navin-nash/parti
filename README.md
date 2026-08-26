# parti

**A Claude Code skill for design work that doesn't look generated.**

*Parti*, from the French *prendre parti* — "to take a position." In architecture it names the single organizing idea a design commits to, the one every later decision has to answer to. That is the whole thesis here.

Generated design converges. Not from lack of ability — because everything trained on the same portfolio sites and the same component libraries. The default output of any capable model is a warm-cream background with a serif display and a terracotta accent, or a bento grid of glass cards over a gradient mesh, with everything fading up 20px on scroll. Those aren't bad looks. They're *unchosen* looks, and they arrive regardless of subject.

They also arrive **twice**: once when a direction is picked, and again later when a perfectly good direction gets built with the component library's untouched defaults, a copy-pasted shadow, and a font that silently fell back to system-sans. `parti` covers both altitudes — it scores an existing design, derives three genuinely divergent directions from the actual subject, and then builds the winner as real, verified code, checking the shipped result against the spec it was handed.

---

## The one rule

**Style is derived, never selected.** Picking "let's do glassmorphism" and reverse-engineering a rationale is exactly how generic design gets made. The order is: understand the subject → derive constraints → find the direction the constraints demand → *then* name whatever movement it landed near. A choice you can't justify by pointing at something true about the audience, the content, or the job the interface does is decoration, and it goes.

Restated for code: **tokens are law, craft is where you're free.** Every color, size, radius, and duration comes from the spec, never invented mid-build. The latitude belongs to *how* a component gets constructed, not to whether it follows the tokens.

---

## Install

Clone straight into your skills directory:

```bash
git clone https://github.com/Navin-nash/parti.git ~/.claude/skills/parti
```

Or clone anywhere and link it. macOS/Linux:

```bash
ln -s "$(pwd)" ~/.claude/skills/parti
```

Windows (junction — no admin required):

```bash
cmd /c "mklink /J %USERPROFILE%\.claude\skills\parti <repo-path>"
```

Project-scoped instead of global? Use `<project>/.claude/skills/parti`.

Requires Python 3.8+ for the scripts. **Stdlib only** — no pip install, no `requirements.txt`, nothing to keep up to date.

---

## Using it

The skill fires on intent, so most of the time you just describe the problem:

> "this landing page looks AI-generated, fix it"
>
> "score this UI and tell me what's actually wrong"
>
> "give me three directions for a tax-filing tool for freelancers"
>
> "the motion feels off"
>
> "build direction 2"

You can also name a command directly. Each is defined in [`references/commands.md`](references/commands.md).

### Direction

| Command | What it does |
|---|---|
| `evaluate` | score an existing design |
| `audit` | extract the design system a codebase *actually* has |
| `explore` | three divergent directions from the brief |
| `redesign` | surgical or directional plan |
| `deslop` | find the tells, replace them |
| `critique` | evidence-based review, changes nothing |
| `typeset` | type scale and pairing |
| `palette` | color system, contrast-verified |
| `motion` | animation spec + library decision |
| `density` | rhythm and information density |
| `review` | rule-id findings at `file:line` |
| `animate` | build one animation, gated |
| `states` | empty / loading / error / overflow |
| `signature` | the one memorable element |
| `variants` | N alternatives along one axis |
| `copy` | microcopy pass |
| `tokens` | emit the token spec |

### Build

| Command | What it does |
|---|---|
| `build` | spec or brief → working, verified code |
| `harden` | complete every missing state + a11y |
| `polish` | craft pass, no new features |
| `lint` | scripted anti-slop + token-drift report |
| `responsive` | breakpoint behavior pass |
| `a11y` | WCAG floor verification |
| `perf` | animation / bundle cost pass |
| `sync` | update `DESIGN.md` |

### Handoff

| Command | What it does |
|---|---|
| `plan` | one self-contained plan file |
| `execute` | build a plan in isolation, review its diff |
| `reconcile` | refresh `plans/` against the code |

**Effort modifiers** — `quick` / `standard` / `deep`, anywhere in the invocation, set audit depth. Default `standard`. Whatever the level, the output says what it did *not* cover.

---

## How a direction pass runs

1. **Establish the brief** — subject, audience, job, content, constraints. One round of questions, not an interrogation; if the brief stays thin it gets pinned as a stated assumption rather than silently guessed. A priority ranking among modern / intuitive / interactive / intentional is forced into writing, because those four conflict.

2. **Derive constraints before style** — density the content demands, emotional register the job calls for, attention order in the first three seconds, frequency of use, and the subject's **native material** (its instruments, artifacts, vernacular). That last one is the well distinctive choices come from.

3. **Three divergent directions** — each pair must differ on at least two of six axes: density, structure, type voice, chroma, motion posture, depth. Three directions differing only in palette are one direction, and there's an explicit gate against exactly that. Each states its thesis, nearest movement and where it departs, palette, type, structure, motion, signature, and **what it gives up** — a direction without a named cost is a compromise, not a choice.

4. **Render them** — real content, one screen, same viewport across all three, motion included. Text descriptions let both sides imagine different things and agree anyway.

5. **Critique your own three** — Chanel's mirror (remove one accessory from each, name it), spend boldness once, and the generic-prompt test: would this have come out roughly the same for a different subject in the same category?

6. **Converge** — recommend one, name the condition that would flip it, and name the one you'd regret not building.

7. **Tokens, motion spec, `DESIGN.md`.**

Stop after 7 for direction only; Build mode picks up from exactly there, with no separate handoff.

---

## `DESIGN.md` is binding memory

Step 0 of every run, before anything else. If `DESIGN.md` exists it's read in full and it's **binding** — it outranks the model's taste, though not the user's current instruction. A request that conflicts with it surfaces the conflict with three options (exception / amend the file / another route to the same effect) rather than silently overriding, because silent overrides are how the file stops being trusted. If it doesn't exist, it gets created — from an honest audit of the de-facto system if there's a codebase, mess included. On the way out it's synced with a dated changelog line.

Protocol and template: [`references/design-md.md`](references/design-md.md).

---

## Scripts

Measured findings survive disagreement; impressions don't. All stdlib, all scriptable in CI.

```bash
python scripts/audit.py <path> --json audit.json      # de-facto system + tell detection
python scripts/score.py audit.json                    # measured score, 6 dimensions
python scripts/color.py check palette.json            # every pair, AA verdicts
python scripts/color.py contrast "#2B2620" "#FAF9F6"  # one ratio
python scripts/color.py fix "#8A8F98" --on "#F7F7F8"  # minimal lightness fix, hue preserved
python scripts/color.py ramp "#B23A2E" --steps 9      # gamut-fit OKLCH ramp
python scripts/lint.py <path> --tokens tokens.json    # built code vs. its spec: tells + drift
python scripts/motion.py <path> --json motion.json    # motion rule violations at file:line
```

| Script | Reads | Reports |
|---|---|---|
| `audit.py` | a codebase | palette sprawl, typeface/size counts, spacing base unit and off-grid values, radius/shadow/z-index variance, durations and easing (custom vs. browser default), tokenization ratio, reduced-motion handling, visible tells |
| `score.py` | `audit.py` JSON | the **measured** half only, across six dimensions |
| `color.py` | hex / palette JSON | WCAG contrast ratios, AA verdicts, OKLCH ramps, minimal fixes that preserve hue |
| `lint.py` | code you just built | build-time tells `audit.py` can't see at plan time, plus **token drift** — any color in shipped code that isn't in the spec it was handed |
| `motion.py` | code | the machine-checkable half of the motion catalog: `ease-in` on UI, `transition: all`, `scale(0)` entrances, over-budget durations, animated layout properties, center-scaling on trigger-anchored surfaces, missing reduced motion, ungated hover, easing sprawl |

`color.py` uses OKLCH because its lightness axis is perceptually uniform — a ramp built by stepping L actually looks evenly stepped, which is not true of HSL.

### Never report one blended number

`score.py` returns the measured half **only**. Hierarchy, signature, content fit, copy, state coverage, and concept are judged in prose with written evidence and reported separately. `lint.py` and `motion.py` are regression guards, not quality verdicts — a clean run means nothing on the known list is wrong, not that the build is good. `motion.py` in particular can't see whether an animation has a *purpose*, which is the half of a motion review that decides most findings.

Given a screenshot rather than a codebase, the skill says so and scores the judged half only. Contrast ratios estimated by eye are guesses in the costume of measurement.

---

## Build mode

The failure here isn't a bad direction — it's a *good* direction quietly reverting to defaults on the way to code. A spec names a display face and the build ships system-sans. A palette is agreed and a fourth, unspec'd gray creeps in from a copy-pasted component. "No nested cards" is written down and the third screen nests one because that's what the library does by default.

- **B0 — Get the spec.** From Step 7, `DESIGN.md`, or an existing token file. Nothing to build from? Don't invent one; run the direction steps first and say plainly if they're compressed.
- **B1 — Pick the stack.** Detected, not asked: `components.json` → React + Tailwind + shadcn; `.vue` files → Vue; no framework signal → plain HTML/CSS. Playbooks — including how to actually override shadcn's defaults instead of shipping them untouched — in [`references/stacks.md`](references/stacks.md).
- **B2 — Build the job, with every state.** Empty (first-run *and* cleared-by-user), loading, partial, ideal, error, overflow, offline, no-permission — in the same pass. Implementing only the ideal state is the most common way production quietly diverges from what got approved.
- **B3 — Don't reintroduce what the direction removed.** Build-time tells invisible in a mockup: untouched component variants, `outline-none` with no focus replacement, a starter-template gradient. List: [`references/bans.md`](references/bans.md).
- **B4 — Verify.** Three checks, none of which catches what the other two do: scripted lint + motion, every contrast pair verified with `color.py`, and a fidelity pass on the **real build** against the same floor the mockup had to clear. A shipped build failing a floor the mockup passed is a regression.
- **B5 — Report and sync.** Files touched, lint by severity, contrast table, states covered, a11y floor, and a **deviations list** — anything differing from the spec, each justified. Deviation is a finding, not a shrug.

---

## Repository layout

```
SKILL.md       the skill itself — frontmatter + full process
references/    loaded on demand, not up front
scripts/       audit.py  color.py  lint.py  motion.py  score.py  — stdlib only
evals/         run_script_evals.py  rubric.md  trigger_cases.json
```

| Reference | Contents |
|---|---|
| `commands.md` | every sub-command, its inputs, outputs, and cost |
| `design-md.md` | `DESIGN.md` protocol and template |
| `style-vocabulary.md` | 25+ movements: what each is good at, its failure mode, when to avoid it |
| `motion.md` | animation decisions, library choice, scroll, View Transitions, reduced motion |
| `motion-rules.md` | the rule catalog — every rule id, severity, and a fail/pass code pair |
| `motion-recipes.md` | correct implementations: button, dropdown, tooltip, modal, drawer, toast, accordion, stagger, tab indicator, shared element, drag-to-dismiss |
| `audit-protocol.md` | how to survey an interface: recon, effort levels, finding format, leverage rubric |
| `plan-template.md` | the self-contained plan format for handing work to another agent |
| `render.md` | the fidelity floor and component-by-component construction rules |
| `critique.md` | concept-level tell list, redesign protocol, severity rubric |
| `bans.md` | build-time tell list: CSS-specificity pitfalls, untouched library defaults |
| `stacks.md` | build playbooks per stack |
| `verify.md` | the build verification loop and report format |
| `ux-methods.md` | UX laws, heuristics, IA, states, cognitive load, accessibility |
| `tokens.md` | token spec format and a worked example |

---

## Testing

```bash
python evals/run_script_evals.py            # exits 1 on any failure
python evals/run_script_evals.py --verbose  # per-assertion output
python evals/run_script_evals.py --keep     # leave fixtures on disk to inspect
```

50 deterministic checks over WCAG contrast arithmetic with published reference values, and fixtures seeded with a known number of known tells so detection recall and false-positive rate are countable. Stdlib only, so it drops into CI unmodified.

**This covers one layer of four.** The skill decomposes into layers with genuinely different epistemic status, and they must never be averaged together — averaging is how a measured 4.54:1 contrast ratio and a subjective 7/10 for "hierarchy" become one meaningless 8.2.

| Layer | Ground truth | Instrument | Objective? |
|---|---|---|---|
| Trigger accuracy | 52 labeled prompts | `evals/trigger_cases.json` | yes, binary |
| Script correctness | WCAG arithmetic + seeded fixtures | `evals/run_script_evals.py` | yes, deterministic |
| Process compliance | 18 binary items, 5 of them gates | `evals/rubric.md` | yes, per-item binary |
| **Design quality** | **none** | blind A/B against a baseline | **no** — preference only |

### The circularity trap

**Don't grade the skill's output with `score.py`.** The detector and the generator share a tell list. Optimizing against it produces designs that *evade the detector*, not designs that are good — swap the purple-to-blue gradient for purple-to-teal and the slop index goes to zero while the page stays exactly as generic. Goodhart's law applies here with unusual force because the metric is so cheap to satisfy.

Slop index is a valid **regression guard** and an invalid **quality metric**. Put it in CI. Never use it to choose between two directions, and never report an improvement in it as evidence the design got better.

Read [`evals/README.md`](evals/README.md) before adding any metric.

---

## Scope

**In scope:** visual direction, aesthetic strategy, typography, color, layout, hierarchy, motion and transitions, interaction design, information architecture, UX critique, design tokens, design-system auditing, and building the resulting UI as real, verified component code.

**Out of scope:** backend, state/data management, APIs, auth, deployment, non-visual architecture, performance engineering beyond animation cost. Asked about one of those, it answers the design question and notes that the engineering one is separate. The trigger eval deliberately includes "design a database schema", "design an API", "design a rate limiter", and "design a retry strategy" as negatives — a description that fires on those is over-broad, and over-broad is worse than narrow because it burns context on every unrelated request.
