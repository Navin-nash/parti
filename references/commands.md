# Commands

Sub-functions of this skill, direction and build both. Each is a narrow, repeatable operation with a defined input and output. Invoke by name — "run evaluate on ./src", "do a typeset pass", "build the pricing screen", "lint what you just built".

**When the user names no command,** infer from intent: a fresh brief → `explore`; an existing thing they dislike → `evaluate` then `redesign`; a chosen direction with nothing built yet → `build`; a specific complaint ("the spacing feels off", "this component looks generic") → the matching narrow pass.

Every command: read `DESIGN.md` first, sync it after. See `references/design-md.md`.

**Effort modifiers.** `quick` / `standard` / `deep` anywhere in the invocation set audit depth
for `evaluate`, `review`, `audit`, `deslop`, and `redesign` — coverage, how many parallel agents,
and how deep the finding list goes. Default is `standard`. Table in `references/audit-protocol.md` §2.
Whatever the level, say what was **not** covered.

---

## Index

**Direction**

| Command | Input | Output | Cost |
|---|---|---|---|
| `evaluate` | codebase or screenshot | measured + judged score, findings | S |
| `audit` | codebase | de-facto design system → DESIGN.md | S |
| `explore` | brief | 3 divergent directions, rendered | L |
| `redesign` | existing design | surgical or directional plan | M–L |
| `deslop` | codebase or design | tell list + specific replacements | S |
| `critique` | anything visual | evidence-based review, no changes | S |
| `typeset` | existing type system | type scale + pairing spec | S |
| `palette` | existing colors or a brief | color system, contrast-verified | S |
| `motion` | existing motion or a brief | motion spec + library decision | M |
| `review` | codebase or a diff | rule-id findings at `file:line` + summary table | S |
| `animate` | a component + a request for motion | the animation, built to the rule catalog | S–M |
| `reference` | one or more inspiration URLs + a focus | per-element capture (faithful + adapted columns) in `captures/` | M |
| `density` | a screen | density and rhythm correction | S |
| `states` | a component or flow | every missing state designed | M |
| `signature` | a direction or product | the one memorable element | S |
| `copy` | interface text | microcopy pass | S |
| `tokens` | a chosen direction | full token spec | S |

**Build**

| Command | Input | Output | Cost |
|---|---|---|---|
| `build` | spec/brief | working code, all named states, verified | L |
| `polish` | existing screen | craft pass, no new features or scope | M |
| `harden` | existing screen | every missing state + a11y completed | M |
| `lint` | any built code | scripted anti-slop + drift report | XS |
| `responsive` | one screen | breakpoint behavior, 320px up | S |
| `a11y` | any code | WCAG floor verification pass | S |
| `perf` | any code | animation/bundle cost pass | S |

**Shared**

| Command | Input | Output | Cost |
|---|---|---|---|
| `variants` | one component | N alternatives on one axis, at whichever fidelity is in play | M |
| `sync` | recent direction or build changes | DESIGN.md updated | XS |

**Handoff** — for work that goes to a different agent, a cheaper model, or next week.

| Command | Input | Output | Cost |
|---|---|---|---|
| `plan` | a finding, or a described change | one self-contained plan file in `plans/` | S |
| `execute` | a plan file | the change, built in isolation, diff reviewed | M |
| `reconcile` | an existing `plans/` directory | statuses refreshed, drifted refs fixed | XS |

---

## Direction

### evaluate

Score an existing design. **Never report one blended number** — the measured and judged halves have different epistemic status and blending them hides which is which.

1. `python scripts/audit.py <path> --json /tmp/audit.json`
2. `python scripts/score.py /tmp/audit.json`
3. Judge the six unmeasurable dimensions yourself, each with a written finding and specific evidence:
   - **Hierarchy** — does attention land in the intended order? Apply the squint and grayscale tests.
   - **Signature** — is there one memorable element, or only competent defaults?
   - **Content fit** — does the density match what the content actually demands?
   - **Copy** — does the writing carry weight, or is it lorem-shaped?
   - **State coverage** — empty, loading, error, overflow, offline.
   - **Concept** — is there a thesis, or an accumulation of defaults?

Report:

```
MEASURED   [n]/100  ([band])          — computed from source
JUDGED     [n]/60   ([band])          — my assessment, evidence below
  Hierarchy   [n]/10  — [specific finding with a referent]
  ...
TOP 3 FIXES BY LEVERAGE
  1. [fix] — [what it costs, what it buys]
```

**Screenshot-only input:** skip the scripts, say so explicitly, and score the judged half only. Don't estimate the measured half from a picture — contrast ratios sampled by eye are guesses wearing the costume of measurement.

### audit

Extract what the design system actually is. Run `scripts/audit.py`, then write or update `DESIGN.md` per `references/design-md.md`. Report the three largest gaps between the system as documented and as implemented. This is `evaluate` without the scoring, and it's the right first command on any unfamiliar codebase.

### explore

The core loop. Full process in SKILL.md: brief → constraints → three divergent directions → render → critique → converge → tokens. If the brief includes an inspiration URL, run `reference` on it first (step 2); its findings are constraints and its Adapted column feeds steps 3–4. The one command that produces something new rather than correcting something existing. Render fidelity — the step where a good concept most often still comes out generic — has its own craft rules in `references/render.md`. If the user wants it shipped, continue straight into `build` afterward; the token spec `explore` emits is `build`'s required input.

### redesign

Audit first, propose second. A 'like siteX' request runs `reference` on siteX during the audit; every borrowed element goes on the keep/change list explicitly. Always offer both scales — surgical (5–8 highest-leverage fixes inside the existing system, days) and directional (the full `explore` process, weeks) — and say which you'd pick. Protocol and severity rubric in `references/critique.md`. End with an explicit keep list.

### deslop

The narrowest, highest-value command, and the skill's core purpose.

1. Run `scripts/audit.py`; collect the detected tells.
2. Add tells the script can't see — layout symmetry, empty hero thesis, uniform density, generic copy, motion applied evenly. Full list in `references/critique.md`.
3. For each: **replace, don't just delete.** A tell removed leaves a hole; the replacement must come from the subject's own world.
4. Rank by how visible the tell is to a first-time viewer, not by how easy it is to fix.

Output format per tell:

```
TELL      Rounded-square gradient icon tiles above the three feature headings
WHERE     src/components/Features.tsx:24
WHY IT'S A TELL   Appears identically across generated product pages; carries no
                  information about these specific features.
REPLACE WITH      The actual form glyphs from the documents this product parses,
                  drawn as 1px line marks at 20px, in --text-muted. The icon now
                  says which document type each feature handles.
COST      ~2h including drawing three marks.
```

### critique

Review without changing anything. Evidence, not adjectives. Sort findings into usability failure / system failure / dated convention / taste, and label which is which — collapsing taste into usability is the fastest way to lose the reader's trust. Severity rubric in `references/critique.md`.

### typeset

Typography only. Report current families, sizes, and derived step ratios from the audit. Then: pick a ratio (1.2 dense UI, 1.25–1.333 general, 1.414–1.618 editorial), rebuild the scale on it, assign families to display/body/utility roles, set measure (45–75ch), tracking (negative on large display, positive on small caps), and numeral behavior (tabular anywhere values align). Name the specific faces and their source; a pairing recommendation without named faces isn't actionable.

### palette

Color only. Verify everything with `scripts/color.py`:

```bash
python scripts/color.py check palette.json          # every pair, AA verdicts
python scripts/color.py fix "#8A8F98" --on "#F7F7F8" --target 4.5
python scripts/color.py ramp "#B23A2E" --steps 9    # gamut-fit OKLCH ramp
```

Deliver in OKLCH with hex alongside, every text pair's ratio stated inline, and a rule for how the accent may be used. Contrast ratios go **in** the spec — if a builder can't see the number, they'll assume it passes.

### motion

Read `references/motion.md`. Decide first whether each thing should animate at all, then specify: posture, the one choreographed moment, what animates (with duration + easing), what never animates, the library decision including the option of none, and per-item reduced-motion degradation. If the audit shows two general-purpose animation libraries, that's a finding — say so. If a reference URL is given, run `reference` first and write the spec as a diff from the captured findings.

Auditing existing motion rather than specifying new motion is `review`. Building one specific animation is `animate`. Values come from `references/motion-rules.md` §12 — copied, never approximated.

### review

Rule-based review against the catalog, reported at `file:line`. The scripted half plus the judged half, in one pass — `critique` is the prose-and-evidence version of this for concept-level work, `lint` is the scripted half alone.

```bash
python scripts/motion.py <path> --json /tmp/motion.json
python scripts/lint.py <path> --tokens tokens.json
```

Then read for what the scripts structurally can't see — `purpose-*` (does this animate for a reason, and how often is it seen), `cohesion-personality-mismatch`, `staging-competing-focal`, and the missed-opportunity list. A clean script run is not a clean review; say so explicitly rather than reporting PASS and stopping.

Output: findings ordered by severity as `file:line — [rule-id] one sentence`, the summary table, then missed opportunities **separately** from the corrective findings. Rules, severities, and the fail/pass pair for every id: `references/motion-rules.md`. Protocol for anything bigger than a handful of files — recon, fan-out, vetting: `references/audit-protocol.md`.

### animate

Build one animation, through the seven-step sequence in `references/motion.md` §13. Steps 1 and 2 are gates and they exist to produce **zero lines of code** sometimes: an action performed 100+ times a day, or initiated by keyboard, does not animate — say so plainly and offer the non-motion alternative instead of building it anyway.

Start from `references/motion-recipes.md` if the request matches a component it covers. Never present motion options as a menu — make the call, state the reasoning in one line, write the code. Reduced motion and pointer gating ship in the same edit, not as a follow-up. Finish by naming what needs a **feel-check** — anything whose correctness can't be read off the code.

### reference

Capture a specific element, transition, or animation from an inspiration URL and make it
buildable in the user's own stack. Alias: `capture`.

**Input:** one or more URLs, plus a focus — an element or a named behavior ("the nav",
"the scroll reveals", "that pricing toggle"). **A focus is required.** Absent, or "the whole
look", is not a capture: respond with the three options — name a specific element / run
`explore` *informed by* the reference / proceed element-by-element — and wait.

**Auto-trigger:** any URL in a `parti` invocation ("redesign my hero like stripe.com",
"build this the way linear.app does it") runs `reference` first, emitting one line:
`Capturing linear.app first (focus: hero motion). Say "skip capture" to work from description only.`

**Run:**

```bash
python scripts/capture.py --url <url> --focus "<element>" --tier auto \
    --json /tmp/capture.json --md captures/<domain>-<date>.md
```

`--tier static` for the fast, dependency-free pass; `--tier runtime` (needs Playwright) adds
live `getAnimations()` / `ScrollTrigger` data, a scroll sampler, and the focus element's
anatomy. `--url` repeats for multiple references — their findings are **unioned into one
list** (the script adds no per-source tag); the agent attributes each finding to its source
when rendering the capture markdown. Still per-element; no cross-site identity merge.

**Output:** `captures/<domain>-<date>.md` (+ `.json`). Per motion finding and for the focus
element, two columns: **Faithful** (measured values re-expressed in the user's stack; a
layout-property animation re-expressed as transform/opacity) and **Adapted** (mechanism and
intent only, values re-derived from the user's tokens, density, and motion posture). The
report always states which tier ran and what it could not see — it never invents a duration
or easing.

**Effort modifiers:** `quick` = Tier 1 only. `standard` = Tier 1 + Tier 2 if available.
`deep` = + a `prefers-reduced-motion` pass, a scroll-through screencast for the feel pass,
and multiple viewports. Whatever the level, say what was not covered.

**Then:** fold the adopted rows into the motion spec (`references/motion.md` §12 format) or
the target component, add the DESIGN.md Changelog line, and — at build time — fill each
Adopted row's build path. Full protocol: `references/motion-capture.md`.

### density

Density is the most under-decided axis in generated design; everything defaults to a comfortable medium. Establish what the content demands (sparse / measured / dense), then correct: base unit, spacing scale, section rhythm, line height, row height, container width, and the ratio of content to whitespace. A daily-use tool and a marketing page cannot share a rhythm.

### states

For each component or flow, design every state: empty (first-run *and* cleared-by-user — they're different), loading (skeleton vs. spinner vs. progress by expected duration), partial, ideal, error (what happened, why, next action), overflow (10× the expected content), offline, no-permission. Most designs that "fall apart in production" only ever had the ideal state designed. Guidance in `references/ux-methods.md` §5. `harden` is this same discipline applied to code that already exists.

### signature

Invent the one element the design is remembered by. It must come from the subject's own world — its instruments, artifacts, vernacular, or data — not from a catalog of effects. Deliver: what it is, where it appears, why it belongs to *this* subject and no other, how it degrades on mobile and under reduced motion, and what goes quiet around it. Boldness is spent once; if two things are shouting, one is noise.

### copy

Microcopy pass. Names come from what the user controls, not how the system is built. Active voice; a control says what happens when used ("Save changes", not "Submit"); an action keeps its name through the whole flow. Errors state what happened, why, and the next step, in the interface's voice, never apologizing and never vague. Empty screens are invitations to act. Generic copy makes a design feel templated as fast as generic layout.

### tokens

Emit the full spec per `references/tokens.md`. Format is fixed so it can be consumed directly, by `build` or by an engineer. If a design system already exists, express the direction as a **diff** against it — changed, added, deprecated — rather than a fresh spec someone has to reconcile.

---

## Build

### build

The core build loop. Full process in SKILL.md's Build mode: read the spec → pick the stack → build the job screen with every state → self-review against `references/bans.md` → verify (`references/verify.md`) → report → sync. If motion was captured via `reference`, re-run `scripts/capture.py --tier runtime` against the shipped build and diff its `getAnimations` dump against the spec — a measured fidelity check, not an eyeball one. The one command that produces new shippable code rather than adjusting existing code.

### polish

Craft only, scope frozen. Tighten spacing rhythm, optical alignment, hover/focus/active states, transition timing against the spec's motion durations — no new components, no new states, no new copy. If the polish pass surfaces a missing state, that's a `harden` finding, not a `polish` deliverable; name it and stop.

### harden

Take a screen built to its ideal state only and complete it: every state from the `states` list, plus the a11y floor. Most screens that "fall apart in production" only ever had the happy path built — this is the command that closes that gap deliberately instead of it surfacing as a bug report.

### lint

Run `scripts/lint.py` against any built path, with `--tokens` if a spec exists. Report findings by severity; a P0 finding blocks calling the work done. See `references/verify.md` §1 for what it does and doesn't catch — it's a regression guard, not a design-quality judgment, the same relationship `score.py` has to a full `evaluate`.

### responsive

Verify and fix breakpoint behavior from 320px up: what reflows, what collapses to a drawer or a stack, what stays hidden until a wider viewport, and where a fixed pixel value was used where a fluid one belonged. State the breakpoints checked explicitly.

### a11y

Keyboard-only pass (tab order matches visual order, every interactive element reachable and operable), screen-reader labels on icon-only controls, contrast re-verified, `prefers-reduced-motion` honored, touch targets ≥44px. Report as pass/fail per item, not a paragraph of impressions.

### perf

Animation cost (are transforms/opacity used instead of layout-triggering properties, is anything animating that shouldn't per the motion spec's "never animates" list) and a rough bundle-weight sanity check (a new dependency added for one component that a few lines would have covered). Not a full performance audit — that's out of scope; this is the craft-adjacent slice of it.

---

## Shared

### variants

N alternatives of one component, differing on **one named axis** (weight, density, warmth, formality, motion intensity). Variants that differ on everything aren't variants — they're unrelated attempts and can't be compared. Render or build them — whichever fidelity the conversation is currently at — side by side with identical content, at the fidelity floor in `references/render.md`, and state which you'd pick and under what condition you'd switch.

### sync

Write recent decisions back into `DESIGN.md`: changed values, new rules, new anti-rules, what a build decided that the spec left open, the build path for each Adopted row in the relevant `captures/*.md`, a dated Changelog line. Run after `explore`, `redesign`, `build`, `harden`, or any command that changed something real. Cheap, and the reason the file stays worth reading.

---

## Handoff

Use these when the work is going somewhere else — a different agent, a cheaper model, a teammate on Monday. When you're going to build it yourself in this session, skip straight to `build`; a plan you immediately execute yourself is ceremony.

### plan

Turn one confirmed finding — or one change the user describes — into a self-contained plan file in `plans/`, using `references/plan-template.md`. Write for the weakest plausible executor: every value inlined, current-state excerpts from **your own reads**, the repo's conventions with a real exemplar, ordered steps each with its own verification command, hard scope boundaries, machine-checkable done criteria, and an escape hatch for the surprise you didn't anticipate.

Stamp the commit (`git rev-parse --short HEAD`). Keep numbering monotonic against any existing `plans/README.md`, and never write plans nobody selected.

Given a description rather than a finding, skip the audit: recon just enough to specify it honestly, resolve every ambiguity you can from the codebase itself, and ask about only what's left — one at a time, each with a recommended answer.

### execute

Take one plan, build it in an isolated worktree, then review the resulting diff like a tech lead rather than accepting it: re-run the done criteria yourself, confirm every hunk traces to a numbered step, and reject anything out of scope however plausible it looks. An executor that also "tidied the spacing while it was in there" produced an unreviewed change.

Then run the full `references/verify.md` loop on the result — a plan's done criteria are a subset of it, not a replacement — and update the plan's status in the index.

### reconcile

Re-check `plans/` against the current code: mark landed plans `DONE`, investigate `BLOCKED` ones, refresh `file:line` references that drifted since the stamped commit, retire findings someone fixed another way, and mark superseded plans `STALE` rather than deleting them. Then `sync` whatever the executed plans decided that the spec left open.
