# Commands in action

**A visual retrospective of what `parti` does, one command at a time, with the
real output each one produced when it was run — on this repo's own site and on
five production sites that were never written for it.**

Companion to [`references/commands.md`](../references/commands.md) (the spec) and
[`docs/reference-capture-capability.md`](./reference-capture-capability.md) (the
`reference`/`capture` deep-dive). This doc is the *evidence*: every transcript
below is a literal run, dated, not a mock-up.

- `▶ real run` — copied from a terminal on the date shown. Reproducible: the
  command line is above it.
- `▷ output shape` — this command has **no script**. Its output is a document the
  agent writes during an engagement; the block shows the fixed structure that
  document always has, with one worked fragment.

---

## 1. What the skill does, in one picture

```
                         a complaint, a brief, or a URL
                                      │
                        ┌─────────────┴─────────────┐
                        ▼                           ▼
                 ┌─────────────┐             ┌─────────────┐
                 │  MEASURED   │             │   JUDGED    │
                 │  6 scripts  │             │  the agent  │
                 │ deterministic│            │ w/ evidence │
                 └──────┬──────┘             └──────┬──────┘
      audit.py score.py │                          │ hierarchy, signature,
      color.py motion.py│                          │ content fit, copy,
      lint.py  capture.py│                         │ state coverage, concept
                        └───────────┬──────────────┘
                                    ▼
                    one report — the two halves never blended,
                    because they have different epistemic status
```

`parti`'s governing rule: **style is derived, never selected.** No command picks a
look off a menu. `explore` derives three directions from the *subject* — its
instruments, its data, its vernacular. `reference` will not clone a site; it
captures one named element with a provenance record. `evaluate` never emits one
blended number, because a contrast ratio is a fact and "is there a thesis" is a
judgement, and averaging them hides which is which.

### The command map

| Group | What it decides | Commands |
|---|---|---|
| **Direction** | what the thing should be — specs, findings, directions, not code | `evaluate` `audit` `explore` `redesign` `deslop` `critique` `typeset` `palette` `motion` `review` `animate` `reference` `density` `states` `signature` `copy` `tokens` |
| **Build** | a decided direction → code that still matches it | `build` `polish` `harden` `lint` `responsive` `a11y` `perf` |
| **Shared** | useful at either altitude | `variants` `sync` |
| **Handoff** | work that goes to another agent / a cheaper model / next week | `plan` `execute` `reconcile` |

### Which commands actually run code

Six scripts back the measured half. Everything else is the agent working to a
written method.

| Script | Commands it serves | Emits |
|---|---|---|
| `scripts/audit.py` | `audit`, `evaluate` (measured half), `redesign` (step 0) | de-facto design system: colour census, type families, spacing base unit, radii/shadows, motion libs, tells |
| `scripts/score.py` | `evaluate` | 6 measured dimensions scored 0–20/0–15 with a band, plus the "not measured — judge yourself" list |
| `scripts/color.py` | `palette`, `tokens`, `build`/`a11y` verification | contrast ratios, OKLCH ramps, minimum-shift AA fixes, hex↔OKLCH |
| `scripts/motion.py` | `motion`, `review` (`--motion`) | motion census + rule-id findings against `references/motion-rules.md` |
| `scripts/lint.py` | `lint`, `deslop` (scripted half), `review` | build-time tells + token drift, by severity |
| `scripts/capture.py` | `reference`, `capture` | 3-tier motion capture from a live URL |

Script eval suite at time of writing: **86/86 green** (`python evals/run_script_evals.py`).

---

## 2. Direction commands

### `evaluate` — score an existing design

`▶ real run` · `2026-09-04`

```
$ python scripts/audit.py site/src --json /tmp/audit.json
$ python scripts/score.py /tmp/audit.json
```

```
Scanned 95 files under D:\design-direction\site\src

COLOR    213 unique · 27 chromatic · oklch:0 hsl:0
         #4f46e5  ×8   #ffffff  ×8   #2a2318  ×8   #6366f1  ×6
         ⚠ 3 sampled pairs below 4.5:1 (worst #6366f1 on #edebe6 = 3.75:1)
TYPE     3 families: Geist, Geist Mono, Plus Jakarta Sans
SPACE    13 values · base unit 8 · 3 off-grid
SHAPE    3 radii · 0 shadows
MOTION   libs: none · 2 durations · custom easing 13 vs default 115 · reduced-motion: True

                Sound underneath; the gaps are specific and cheap to close.

Color Discipline    12.0/20  ████████████········
Type System         17.5/20  ██████████████████··
Spatial Rhythm      12.5/15  █████████████████···
Tokenization        12.0/15  ████████████████····
Motion Craft        11.0/15  ███████████████·····   easing mostly browser defaults; the feel is unauthored
Distinctiveness      9.0/15  ████████████········   ⚠ Inter/Geist/DM Sans as the only typeface
                                                    ⚠ Fade-up-on-scroll applied uniformly

NOT MEASURED — judge these yourself, with evidence, and report separately:
    hierarchy · signature · content fit · copy · state coverage · concept
```

**Read:** measured total ≈ **74/100 · "Sound underneath"**. The script stops there
on purpose — the last six lines are the agent's job. A worked example of that
judged half, run against a real portfolio, lives at
[`evals/portfolio-evaluation.md`](../evals/portfolio-evaluation.md): it corrects a
misleading 69.6 up to ~78 by naming two dimensions the scripts penalised for
things the project does *right*, and one they credited on checks that were wrong.
That correction is the point of keeping the halves separate.

---

### `audit` — extract the real design system

`▶ real run` · `2026-09-04` · same `audit.py` pass as above, without scoring.

```
SYSTEM   150 vars defined / 232 used · 2504 arbitrary TW values · 14 !important
A11Y     outline:none ×1 · backdrop-filter ×8

TELLS    2 detected
         • Inter/Geist/DM Sans as the only typeface  →  app\layout.tsx, arms\...\parti.tsx
         • Fade-up-on-scroll applied uniformly        →  arms\finance-research-platform\parti.tsx
```

The three largest gaps this surfaces on its own codebase: `2504` arbitrary
Tailwind values against `150` defined tokens (the system is being escaped),
`0` shadow variants (either intentional or a hole), and the two tells. `audit` is
`evaluate` minus the score, and the right first command on any unfamiliar repo.
Real-world behaviour across six outside codebases — including how it silently
mis-reads a Tailwind repo's spacing as "arbitrary", and scores an unreadable
React Native stack *higher* — is documented in
[`evals/real-world-report.md`](../evals/real-world-report.md).

---

### `explore` — three divergent directions

`▷ output shape` · no script. Cost **L**. The one command that produces something
new rather than correcting something existing.

```
## Brief            <one sentence, the agent's, back to the user for confirmation>
## Constraints      stack, must-keeps, non-negotiables

## Direction A — <name>     differs from B and C on ≥2 of the 6 axes
   thesis      one line
   type        named faces + source
   colour      OKLCH, accent rule
   space       density posture
   motion      posture + the one moment
   signature   the memorable element, from the subject's world
   [rendered at one viewport, real content]
## Direction B — <name>     …
## Direction C — <name>     …

## Anti-slop pass   each direction checked against references/bans.md
## Recommendation   one direction, stated, with why — not "pick your favourite"
```

The six axes: type, colour, density, motion, layout system, signature. Two
directions that differ on only one axis are one direction with a variant, and the
command rejects that.

---

### `redesign` — surgical or directional plan

`▷ output shape` · no script (runs `audit.py` at step 0). Always offers **both**
scales so the user chooses the cost:

```
## Audit summary        (from audit.py) — what the system actually is
## Surgical  ~1 day      5–8 highest-leverage fixes INSIDE the existing system
   1. …  file:line  ·  before → after  ·  why it's leverage
## Directional ~weeks    the full explore process, new direction
## Keep list             what does NOT move, and why — muscle memory is real
```

`evals/portfolio-evaluation.md` ends on exactly this shape: it recommends
**surgical — 5 fixes, most of the perceived gain, ~1 day** over a rebuild, and
lists what to keep (the written 271-line design system, the type system, the
OKLCH authoring).

---

### `deslop` — find and replace the tells

`▶ real run` · `2026-09-04` · scripted half via `lint.py`.

```
$ python scripts/lint.py site/src
```

```
P1  Emoji standing in for a UI icon            arms\components\marketing\parti.tsx
P1  Emoji standing in for a UI icon            arms\product-page\parti.tsx
P2  `rounded-2xl` reached for indiscriminately  app\page.tsx  (+13 more files)
P2  Default shadow utility reused 11x with no override  arms\components\marketing\baseline.tsx

{'P2': 19, 'P1': 2, 'P0': 5}  ->  FAIL (P0 present)
```

The script finds *where* and *what kind*. The agent then does the half a regex
can't: for each tell, **what to put there instead**, drawn from the subject's own
world — never just deletion, because a tell removed leaves a hole. Ranked by how
visible the tell is to a first-time viewer, not by how easy it is to fix.

---

### `critique` — evidence-based review, no changes

`▷ output shape` · no script. Sorts every finding into one of four kinds and
**labels which is which**:

```
## Usability failure   measurable: contrast, target size, keyboard trap
## System failure      inconsistent with the design's own rules
## Dated convention    was fine in 2019, reads as old now
## Taste               the reviewer's opinion, flagged as opinion
```

Collapsing taste into usability is the fastest way to lose the reader's trust, so
the command refuses to.

---

### `typeset` — type scale and pairing

`▷ output shape` · no script.

```
## Content read      dense UI | general | editorial  → picks the ratio
## Ratio             1.2 / 1.25 / 1.333 / 1.414 / 1.618  (chosen, with why)
## Scale             every step, rebuilt on that ratio
## Roles             display / body / utility → named faces + where to get them
## Measure           ch target per role
## Tracking          per size
## Numerals          lining / oldstyle, tabular where
```

A pairing recommendation without named faces and their source is not actionable,
so the command won't emit one.

---

### `palette` — color system, contrast-verified

`▶ real run` · `2026-09-04` · every number below is `color.py` output, not asserted.

```
$ python scripts/color.py contrast "#6366f1" "#edebe6"
#6366f1 on #edebe6   3.75:1   AA body ✗  AA large ✓  AAA ✗  UI/non-text ✓

$ python scripts/color.py fix "#6366f1" --on "#edebe6" --target 4.5
adjusted  #5757E1 on #edebe6 = 4.57:1   (L 58.5% → 54.0%, hue and chroma preserved)
          oklch(53.9% 0.204 277.1)

$ python scripts/color.py ramp "#B23A2E" --steps 9
step  hex       oklch                     on white  on black
400   #E3695A   oklch(66.5% 0.155 29.0)      3.26      6.43
500   #C1483B   oklch(56.4% 0.158 29.1)      4.93      4.26
600   #9D281F   oklch(46.3% 0.155 28.9)      7.62      2.76
```

Delivered in OKLCH with hex alongside, every text pair's contrast printed *in the
spec*, and a stated rule for how the accent may be used. `fix` moves only
lightness and only as far as the target needs — the hue that carries the brand is
untouched.

---

### `motion` — animation spec and library decision

`▶ real run` · `2026-09-04` · `motion.py` census over this repo's example builds.

```
$ python scripts/motion.py site/src --census
CENSUS
  distinct durations : 9  [0, 1, 100, 120, 140, 180, 200, 240, 900]
  distinct curves    : 2
  reduced-motion     : 8 site(s)
  hover gated        : NO
```

Two distinct curves against nine durations says the *timing* is scaled but the
*feel* is unauthored — mostly browser defaults. `hover gated: NO` is a finding on
its own. The command then decides, per element, whether it should animate at all,
names the single choreographed moment, and makes the library call — including
"none". Two general-purpose animation libraries in one audit is itself a finding.

---

### `review` — rule-id findings at file:line

`▶ real run` · `2026-09-04` · `motion.py` + `lint.py`, scripted half.

```
$ python scripts/motion.py site/src/arms
FINDINGS
  agent-platform-landing/baseline.tsx  [physics-no-press-feedback]  pressable elements
     styled for :hover with no :active/whileTap — no acknowledgement that the interface
     heard the press
  … 12 files total

  | Rule | Count | Severity |
  |---|---|---|
  | `physics-no-press-feedback` | 12 | P1 |
  {'P1': 12}  ->  PASS

  Still to judge by hand: purpose & frequency, cohesion, staging, missed opportunities.
```

`PASS` on the script is **not** a clean review, and the report says so rather than
stopping. The agent then reads for what a script structurally can't: whether an
animation has a purpose, how often its surface is actually used, personality
mismatch, competing focal points.

---

### `animate` — build one animation, gated

`▷ output shape` · no script. Two of its seven steps are **gates that produce zero
lines of code** when they trip:

```
1. What is the moment?
2. GATE — frequency:  performed 100+×/day?           → refuse, offer non-motion alternative
3. GATE — input:      initiated by keyboard?          → refuse, offer non-motion alternative
4. Property + trigger
5. Duration + easing   (from DESIGN.md tokens)
6. prefers-reduced-motion + pointer gating   — SAME edit, never a follow-up
7. The code
```

Output is either the animation, or a reasoned refusal naming which gate stopped it.

---

### `reference` — capture design and motion from an inspiration URL

`▶ real run` · `2026-09-04` · `capture.py --tier runtime` against five production
sites and this repo's own dev server. Full capability analysis:
[`docs/reference-capture-capability.md`](./reference-capture-capability.md).

```
$ python scripts/capture.py --url https://hyperswitch.io \
    --focus "the hero and the scroll reveals" --tier runtime \
    --json /tmp/cap.json --md captures/hyperswitch-io-2026-09-04.md
```

| Site | Build | Tier reached | Findings | What came back |
|---|---|---|---|---|
| **hyperswitch.io** | Astro + hand CSS | runtime | 37 | 3 scroll reveals measured at `1s cubic-bezier(.4,0,.2,1)` and `.8s`; 13 `@keyframes` with full from/to bodies; hero parallax as a `scroll_samples` curve |
| **vercel.com** | Next.js | runtime (past a 403 on direct fetch) | 129 | `@starting-style` flagged; 3 WAAPI scroll reveals; `var(--animate-*)` indirection filtered out |
| **gsap.com** | GSAP + ScrollTrigger | runtime | 21 + **44 ScrollTriggers** | `## ScrollTrigger` section from `getAll()`; honest note that GSAP motion isn't in the WAAPI so it won't appear in Motion findings |
| **linear.app** | React + CSS-in-JS | runtime | 296 | genuine hashed keyframes (`SjJXIW_fadeIn`); density note fires: "start from the in-view/scroll and load-or-state subset, not the full list" |
| **stripe.com** | React, bot-walled | **static only** | 0 | degrades honestly — headless Chrome is blocked, `not_captured` says so, exit 0 |
| **localhost:3000** (this site) | Next.js 16 | runtime | 8 | `load-or-state` reveal at `420ms cubic-bezier(.22,1,.36,1)`; no inflation — a small site produces a small capture |

One real finding, verbatim from the hyperswitch JSON:

```json
{
  "trigger": "in-view / scroll",
  "mechanism": "CSSTransition transform",
  "properties": ["transform"],
  "keyframes": { "0%": {"transform": "translateY(100px)"},
                 "100%": {"transform": "translateY(0px)"} },
  "timing": { "durations_ms": [1000], "easings": ["cubic-bezier(.4,0,.2,1)"] },
  "library": "WAAPI"
}
```

And the honest gap on the same run:

```
Not captured: content behind authentication/interaction/geo gating; canvas / WebGL
  internals; Rive / Lottie asset animation (flagged, not reproduced); a
  prefers-reduced-motion pass was not run this capture
```

The rule holds throughout: **captured per element, never a whole-site clone.** A
focus is required; "the whole look" is refused with three narrower options.

---

### `density` — rhythm and information density

`▷ output shape` · no script.

```
## Content demand    sparse | measured | dense   (the call, with why)
## Base unit         corrected value
## Spacing scale     rebuilt
## Line height       per role
## Row height        for tabular surfaces
## Container width    measure target
```

Density is the most under-decided axis in generated design — everything defaults
to a comfortable medium. A daily tool and a marketing page cannot share a rhythm.

---

### `states` — empty, loading, error, overflow

`▷ output shape` · no script.

```
## Empty — first run       different from…
## Empty — cleared by user  …this
## Loading                  skeleton | spinner | progress — by expected duration
## Error                    what happened · why · the next step, in the UI's voice
## Overflow / long content  what wraps, truncates, scrolls
## Partial / stale          if data can be incomplete
```

Most designs that fall apart in production only ever had the ideal state designed.

---

### `signature` — the one memorable element

`▷ output shape` · no script.

```
## The element        from the subject's instruments / artifacts / data / vernacular
                      — NOT a catalogue of effects
## Where it appears
## How it degrades     mobile · reduced-motion
## What goes quiet     around it — boldness is spent once
```

---

### `copy` — microcopy pass

`▷ output shape` · no script.

```
## Controls      name = what happens when used, not how the system is built
## Errors        what happened · why · next step — never apologising, never vague
## Empty states  what this is · how to fill it
## Labels / headings   in the interface's voice
```

---

### `tokens` — emit the token spec

`▷ output shape` · no script. Fixed format so `build` or an engineer consumes it
directly:

```
colour   — every token, OKLCH + hex, contrast pairs stated
type     — families, scale, roles, measure, tracking
space    — base unit, scale
shape    — radii, borders
shadow   — elevation set
motion   — durations, easings, what never animates
```

If a design system already exists, the output is a **diff** — changed / added /
deprecated — not a fresh spec someone has to reconcile.

---

## 3. Build commands

### `build` — spec to working, verified code

`▷ output shape` · no dedicated script, but **verifies three ways** and two of
those are scripts:

```
1. Detect stack        (before asking)
2. Build the screen the spec's job names FIRST
3. Every named state in the SAME pass
4. Verify:
   · lint.py            scripted anti-slop + token drift
   · color.py           every shipped text pair re-measured
   · fidelity re-check   against the same floor the mockup was held to
```

Tokens are law; craft is where the freedom is.

### `polish` — craft pass, no new features

`▷ output shape` · no script. Padding math, optical alignment, transition timing,
the difference between reaching for a card and reaching for a divider. No new
scope — that's the whole discipline.

### `harden` — complete every missing state and a11y

`▷ output shape` · no script. The `states` discipline applied to code that already
exists. Usually the largest single gap between a build that demos well and one
that survives production.

### `lint` — scripted anti-slop and drift report

`▶ real run` · `2026-09-04`

```
$ python scripts/lint.py site/src --tokens tokens.json
{'P2': 19, 'P1': 2, 'P0': 5}  ->  FAIL (P0 present)
```

Token-drift eval, from the suite:

```
✓ exits 1 with an unspec'd color present
✓ flags the unspec'd gray as drift        #8a8f98 used but not in the token spec
✓ colors that ARE in the spec are not flagged
✓ without --tokens, drift isn't checked (no false claim)
```

The one that catches a good direction reverting to defaults on the way to
production. A clean run means nothing on the known list is wrong — not that the
build is good.

### `responsive` — breakpoint behavior, 320px up

`▷ output shape` · no script.

```
## 320  ## 375  ## 768  ## 1024  ## 1440
   per width: what each component BECOMES — a decision, not a scale factor
## The table       what it turns into at 375 (often: not a table)
```

### `a11y` — WCAG floor verification

`▷ output shape` · no script (uses `color.py` for the contrast checks).

```
AA contrast          every text pair — color.py
Visible focus        every interactive element
44px targets         touch
Reduced motion       honoured
Grayscale hierarchy  survives
Keyboard             full operability
```

A floor, not a direction — built to silently.

### `perf` — animation and bundle cost pass

`▷ output shape` · no script.

```
## Animation cost    what animates a layout property · what runs off main thread
## Bundle            what each animation library costs · what to cut
## Out of scope      broader perf engineering — stated, not pretended
```

---

## 4. Shared and Handoff

### `variants` — N alternatives on one axis

`▷ output shape` · no script. N versions of one component differing on **exactly
one thing** (density, or weight, or radius — not all three), at whatever fidelity
is already in play.

### `sync` — update DESIGN.md

`▷ output shape` · no script. Any change to colour / type / space / shape / motion
/ a rule gets written back with a dated changelog line. Silent overrides are how
the file stops being trusted. See [`references/design-md.md`](../references/design-md.md).

### `plan` — one self-contained plan file

`▷ output shape` · no script. Template at
[`references/plan-template.md`](../references/plan-template.md). The requirement is
**self-contained**: the executing agent has none of the current conversation. A
plan that says "as discussed" is not a plan.

### `execute` — build a plan in isolation, review its diff

`▷ output shape` · no script. Built in isolation so the plan is genuinely tested
*as a plan*, then the diff is reviewed against it before it lands.

### `reconcile` — refresh plans/ against the code

`▷ output shape` · no script. The cheap sweep that keeps `plans/` honest after
someone edits code by hand: statuses refreshed, drifted `file:line` references
fixed.

---

## 5. Reproduce this doc

```bash
# measured half — every transcript in §2–3 marked "real run"
python scripts/audit.py site/src --json /tmp/audit.json && python scripts/score.py /tmp/audit.json
python scripts/lint.py  site/src
python scripts/motion.py site/src --census
python scripts/motion.py site/src/arms
python scripts/color.py contrast "#6366f1" "#edebe6"
python scripts/color.py ramp "#B23A2E" --steps 9
python scripts/color.py fix "#6366f1" --on "#edebe6" --target 4.5

# capture — five live sites + this repo's dev server
for u in hyperswitch.io vercel.com gsap.com linear.app stripe.com; do
  python scripts/capture.py --url "https://$u" --focus "the hero and the scroll reveals" \
    --tier runtime --json "/tmp/$u.json" --md "captures/$u-$(date +%F).md"
done

# the eval suite behind the "86/86 green" claim
python evals/run_script_evals.py
```

The `▷ output shape` blocks are not reproducible by script — they are produced by
the agent during an engagement, and the block is the fixed structure that output
always takes.
