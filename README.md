# parti

**A design skill, for any coding agent, that doesn't look generated.**

Written once as plain Markdown (`SKILL.md` + reference files), so it works anywhere that format is understood: natively in Claude Code and Antigravity, and via one `AGENTS.md` line in Codex, GitHub Copilot, Cursor, Gemini CLI, or anything else that reads that file.

*Parti*, from the French *prendre parti* — "to take a position." In architecture it names the single organizing idea a design commits to, the one every later decision has to answer to. That is the whole thesis here.

---

## The problem

Generated design converges. Not from lack of ability — because everything trained on the same portfolio sites and the same component libraries. The default output of any capable model is a warm-cream background with a serif display and a terracotta accent, or a bento grid of glass cards over a gradient mesh, with everything fading up 20px on scroll.

Those aren't bad looks. They're *unchosen* looks, and they arrive regardless of subject.

They also arrive **twice**:

1. **At direction time** — a style gets picked from a mental menu and a rationale reverse-engineered onto it.
2. **At build time** — a perfectly good direction gets implemented with the component library's untouched defaults, a copy-pasted shadow, a fourth unspec'd gray from a pasted component, and a display font that silently fell back to system-sans.

Most design tooling addresses the first and assumes the second away. `parti` covers both: it scores what exists, derives three genuinely divergent directions from the actual subject, builds the winner as real code, and then checks the shipped result against the spec it was handed.

## The one rule

**Style is derived, never selected.** Picking "let's do glassmorphism" and reverse-engineering a rationale is exactly how generic design gets made. The order is:

> understand the subject → derive constraints → find the direction the constraints demand → *then* name whatever movement it landed near

A choice you can't justify by pointing at something true about the audience, the content, or the job the interface does is decoration, and it goes.

Restated for code: **tokens are law, craft is where you're free.** Every color, size, radius, and duration comes from the spec, never invented mid-build. The latitude belongs to *how* a component gets constructed, not to whether it follows the tokens.

---

## Install

The skill itself is `skills/parti/SKILL.md` plus its `references/` — plain Markdown, nothing agent-specific in it. How you point an agent at it depends on whether that agent discovers `SKILL.md` files on its own (Claude Code, Antigravity) or reads a project-level `AGENTS.md` for instructions (Codex, GitHub Copilot, Cursor, Gemini CLI, and most others).

### Claude Code

`parti` follows Claude Code's plugin layout: a `.claude-plugin/plugin.json` manifest at the repo root, with the actual skill at `skills/parti/SKILL.md`. Two ways to install it, both official.

#### As a plugin (recommended)

Add this repo as a marketplace, then install from it:

```bash
claude plugin marketplace add Navin-nash/parti
claude plugin install parti@parti
```

Or drop the whole repo under a skills directory — any folder there containing a `.claude-plugin/plugin.json` loads automatically:

```bash
git clone https://github.com/Navin-nash/parti.git ~/.claude/skills/parti
```

#### As a standalone skill

Only want the skill, without the plugin machinery? Point a skills directory straight at the nested `skills/parti/` folder instead of the repo root:

```bash
git clone https://github.com/Navin-nash/parti.git /path/to/parti
ln -s /path/to/parti/skills/parti ~/.claude/skills/parti     # macOS/Linux
```

Windows, from PowerShell or `cmd` (a junction needs no admin rights):

```bash
mklink /J "%USERPROFILE%\.claude\skills\parti" "C:\path\to\parti\skills\parti"
```

From Git Bash the flag needs doubling — `cmd //c "mklink /J ..."` — because MSYS rewrites single-slash arguments as paths.

**Project-scoped instead of global?** Use `<your-project>/.claude/skills/parti` (pointing at `skills/parti/`, same as above). A project-scoped copy wins over a global one of the same name.

**Verify it loaded** by asking Claude Code to list its skills; `parti` should appear with its description.

### Antigravity

Antigravity discovers `SKILL.md` files the same way Claude Code does, from a `.agents/skills/` folder (legacy `.agent/skills/` still works). Clone once, then symlink the nested skill folder in — same pattern as the standalone Claude Code install above, different target directory:

```bash
git clone https://github.com/Navin-nash/parti.git /path/to/parti
ln -s /path/to/parti/skills/parti .agents/skills/parti              # this project only
ln -s /path/to/parti/skills/parti ~/.gemini/antigravity/skills/parti  # every project
```

### Codex, GitHub Copilot, Cursor, Gemini CLI — anything that reads `AGENTS.md`

These agents don't have a `SKILL.md`-discovery mechanism, but nearly all of them now read a project's `AGENTS.md` for standing instructions (Copilot also reads `.github/copilot-instructions.md`). Clone the skill somewhere stable, then point your project's `AGENTS.md` at it:

```bash
git clone https://github.com/Navin-nash/parti.git ~/.local/share/parti
echo "For any UI/visual design work, read and follow ~/.local/share/parti/skills/parti/SKILL.md in full before starting." >> AGENTS.md
```

The agent loads `SKILL.md` and its `references/*.md` on demand from there, exactly as Claude Code would.

### Requirements

Python 3.8+ for the scripts. **Stdlib only** — no `pip install`, no `requirements.txt`, no lockfile, nothing to keep current. The skill itself is Markdown and needs nothing.

---

## Using it

The skill triggers on intent, so usually you just describe the problem:

> "this landing page looks AI-generated, fix it"
>
> "score this UI and tell me what's actually wrong"
>
> "give me three directions for a tax-filing tool for freelancers"
>
> "the motion feels off"
>
> "build direction 2"

You can also name a command. Full definitions, inputs, and outputs: [`skills/parti/references/commands.md`](skills/parti/references/commands.md).

**Cost** is the rough size of the run — `XS` is seconds, `L` is a full working session.

### Direction

| Command | Input | Output | Cost |
|---|---|---|---|
| `evaluate` | codebase or screenshot | measured + judged score, findings | S |
| `audit` | codebase | de-facto design system → `DESIGN.md` | S |
| `explore` | brief | 3 divergent directions, rendered | L |
| `redesign` | existing design | surgical or directional plan | M–L |
| `deslop` | codebase or design | tell list + specific replacements | S |
| `critique` | anything visual | evidence-based review, no changes | S |
| `typeset` | existing type system | type scale + pairing spec | S |
| `compose` | a screen | spatial/hierarchy correction | S |
| `palette` | existing colors or a brief | color system, contrast-verified | S |
| `motion` | existing motion or a brief | motion spec + library decision | M |
| `review` | codebase or a diff | rule-id findings at `file:line` | S |
| `animate` | a component + a motion request | the animation, built to the rule catalog | S–M |
| `density` | a screen | density and rhythm correction | S |
| `states` | a component or flow | every missing state designed | M |
| `signature` | a direction or product | the one memorable element | S |
| `copy` | interface text | microcopy pass | S |
| `tokens` | a chosen direction | full token spec | S |

### Build

| Command | Input | Output | Cost |
|---|---|---|---|
| `build` | spec/brief | working code, all named states, verified | L |
| `polish` | existing screen | ship-floor + composition, no new features | M |
| `live` | one component or screen | N HTML variants on one axis, in the browser | M |
| `harden` | existing screen | every missing state + a11y completed | M |
| `lint` | any built code | scripted anti-slop + drift report | XS |
| `responsive` | one screen | breakpoint behavior, 320px up | S |
| `a11y` | any code | WCAG floor verification pass | S |
| `perf` | any code | animation / bundle cost pass | S |

### Shared

| Command | Input | Output | Cost |
|---|---|---|---|
| `variants` | one component | N alternatives on one axis | M |
| `sync` | recent changes | `DESIGN.md` updated | XS |

### Handoff

For when work goes to a different agent, a cheaper model, or next week.

| Command | Input | Output | Cost |
|---|---|---|---|
| `plan` | a finding, or a described change | one self-contained plan file in `plans/` | S |
| `execute` | a plan file | the change, built in isolation, diff reviewed | M |
| `reconcile` | an existing `plans/` directory | statuses refreshed, drifted refs fixed | XS |

**Effort modifiers** — `quick` / `standard` / `deep`, anywhere in the invocation, set audit depth for `evaluate`, `review`, `audit`, `deslop`, and `redesign`. Default is `standard`. Whatever the level, the output states what it did *not* cover.

---

## How a direction pass runs

1. **Establish the brief** — subject, audience, job, content, constraints. One round of questions, not an interrogation; a thin brief gets pinned as a stated assumption rather than silently guessed. A priority ranking among modern / intuitive / interactive / intentional is forced into writing, because those four genuinely conflict.

2. **Derive constraints before style** — information density the content demands, emotional register the job calls for, attention order in the first three seconds, frequency of use, and the subject's **native material**: its instruments, artifacts, vernacular, textures. That last one is the well distinctive choices come from, and the one that makes output differ between two briefs in the same category.

3. **Three divergent directions** — each pair must differ on at least two of six axes:

   | Axis | Range |
   |---|---|
   | Density | sparse / measured / dense |
   | Structure | grid-strict / editorial-asymmetric / modular-bento / canvas-freeform |
   | Type voice | neutral-utility / editorial-serif / display-eccentric / mono-technical |
   | Chroma | monochrome+accent / duotone / full-spectrum / achromatic-with-material |
   | Motion posture | still / responsive-only / choreographed / ambient |
   | Depth | flat / layered-shadow / material-translucent / spatial |

   Three directions differing only in palette are one direction, and there's an explicit gate against exactly that: each must land differently **even in grayscale**. Every direction states its thesis, nearest movement and where it departs from it, palette, type, structure, motion, signature, and **what it gives up** — a direction without a named cost is a compromise, not a choice.

4. **Render them** — real content, one screen (the one where the job gets done), same viewport across all three, motion included. Text descriptions let both sides imagine different things and agree anyway.

5. **Critique your own three** — Chanel's mirror (remove one accessory from each; name what you removed), spend boldness once, and the generic-prompt test: would this have come out roughly the same for a different subject in the same category? If yes, nothing in it came from *this* brief.

6. **Converge** — recommend one, name the specific condition that would flip the recommendation, and name the one you'd regret not building.

7. **Tokens, motion spec, `DESIGN.md`.**

Stop after 7 if you only wanted the direction. Build mode picks up from exactly there — the spec written in step 7 is build mode's step 0 input, with no separate handoff.

## Redesign mode

Audit before proposing; jumping to "here's a nicer version" throws away the reason the current thing exists. Findings are sorted into four buckets — **usability failure / system failure / dated convention / taste** — and only the first three are the skill's business unprompted. Taste gets labeled as taste when raised, because collapsing taste into usability is the fastest way to lose a client's trust.

Both scales are always offered: **surgical** (5–8 highest-leverage fixes inside the existing system; days; most of the perceived gain) and **directional** (the full explore process; weeks). Most people asking for a redesign want the surgical pass and don't know to ask for it — recommending the expensive one by default is a tell of its own. Every redesign ends with an explicit **keep list**, because users have muscle memory and relocating everything taxes the people who liked it most.

## Build mode

The failure here isn't a bad direction — it's a *good* direction quietly reverting to defaults on the way to code.

| Step | What happens |
|---|---|
| **B0** | Get the spec — from step 7, `DESIGN.md`, or an existing token file. Nothing to build from? Don't invent one under build authority; run the direction steps first and say plainly if they're compressed. |
| **B1** | Pick the stack by **detection, not question** — `components.json` → React + Tailwind + shadcn; Vue files → Vue; no framework signal → plain HTML/CSS. Playbooks in [`skills/parti/references/stacks.md`](skills/parti/references/stacks.md), including how to actually override shadcn's defaults rather than shipping them untouched. |
| **B2** | Build the job, with every state in the same pass — empty (first-run *and* cleared-by-user), loading, partial, ideal, error, overflow, offline, no-permission. Implementing only the ideal state is the most common way production quietly diverges from what was approved. |
| **B3** | Don't reintroduce what the direction removed — untouched library variants, `outline-none` with no focus replacement, a starter-template gradient. List: [`skills/parti/references/bans.md`](skills/parti/references/bans.md). |
| **B4** | Verify with three checks, none of which catches what the other two do: scripted lint + motion, every contrast pair verified with `color.py`, and a fidelity pass on the **real build** against the same floor the mockup had to clear. |
| **B5** | Report and sync — files touched, lint by severity, contrast table, states covered, a11y floor, and a **deviations list**. Deviation is a finding, not a shrug. |

A shipped build failing a floor the mockup already passed is a regression, not progress.

---

## The live session

Design against the page while it is running, in **your own browser** — not a headless one.

```bash
node skills/parti/live/boot.mjs --page src/index.html
```

Press `p` and click an element; the overlay reports its size, its padding box, its
ancestry, and its **measured contrast** — the same WCAG math `color.py` uses, run on the
pixels the browser actually painted, so an overlay or a gradient behind text cannot hide
a failure the way a source-level check does. Then pick an action and get variants written
into source and hot-swapped.

The part no other tool does: **every variant is linted against the token spec before it is
offered**, and a variant that introduced an off-spec colour carries its drift count in the
picker. You see that it is off-spec while you are choosing, not after you commit.

`i` inserts something new at a gap. `n` drops notes that anchor to elements, so marking a
row sends the agent the selectors it crossed rather than a rectangle. Knobs tune a variant
without another round trip, and the values you settle on are written to source. Accept
collapses to your pick with no residue; discard and undo are byte-for-byte restores.
Nothing is written into build output or a generated file — that refusal is a hard stop,
because a variant accepted there is erased by the next build with no error anywhere.

## No templates, on purpose

Every other design skill in this space hands you markup to paste. `parti` does not, and
that is the point.

`surfaces/` covers the surfaces that get built most and botched most — tables, form
fields, empty states — and carries the decisions, what the token spec must define, every
state that has to exist, and the specific ways each one goes wrong. **No implementations.**
A reference implementation is a default with better manners: paste one and the surface
stops answering to your direction and starts answering to whoever wrote the template,
which is the same substitution this skill exists to prevent, arriving one level deeper
where it is harder to notice.

The rule is enforced mechanically — `check_surfaces.py` fails on any code fence — because
"just show them the code" is exactly the reflex being resisted.

## Not the indigo one

Every model reaches for the same accent when nothing in the brief points anywhere:
Tailwind's `indigo-500`/`600`, `violet-500`, and the purple-to-blue gradient. `lint.py`
flags it as `default_violet` **by hue rather than by a list of hex values**, so nudging
`#6366F1` to `#6165EE` does not evade it — evading a tell is not the same as choosing a
colour. A real violet brand clears the finding by being declared in `DESIGN.md` with its
reason, which is the whole exemption.

The rest of the floor lives in
[`foundations.md`](skills/parti/references/foundations.md) as numbers rather than
adjectives: the structural sentence and a named role for every block, so a page is an
argument instead of a stack of identical sections; measure at 45–75 characters, body at
16px or more, a heading scale of at least 1.25, contrast measured rather than assumed;
one primary action per view, press feedback inside 100ms, targets at 24px minimum and
44px for anything primary on touch.

## Go or no-go

Nothing leaves without a verdict. Ten unconditional no-gos (measured contrast below the
floor, focus removed, a state that can occur but was never built, values that do not trace
to the spec, a claim that something was verified when it was not), eight conditions that
must all hold, and an exception protocol that requires writing the waiver down with its
reason.

The gate refuses defects, not taste. Unconventional is never a no-go, sparse is never a
no-go, and a low slop-index score is a regression guard rather than a blocker — see
[`go-no-go.md`](skills/parti/references/go-no-go.md).

## `DESIGN.md` is binding memory

Step 0 of every run, before anything else.

**If it exists** it's read in full and treated as **binding** — it outranks the model's taste, though not your current instruction. A request that conflicts with it surfaces the conflict with three options (grant an exception / amend the file / find another route to the same effect) rather than silently overriding, because silent overrides are how the file stops being trusted.

**If it doesn't exist** it gets created — from an honest audit of the de-facto system if there's a codebase, mess included.

**On the way out** it's synced, with a dated changelog line naming what changed.

Protocol and template: [`skills/parti/references/design-md.md`](skills/parti/references/design-md.md).

---

## Scripts

Measured findings survive disagreement; impressions don't.

```bash
python skills/parti/scripts/audit.py <path> --json audit.json      # de-facto system + tell detection
python skills/parti/scripts/score.py audit.json                    # measured score, 6 dimensions
python skills/parti/scripts/color.py check palette.json            # every pair, AA verdicts
python skills/parti/scripts/lint.py <path> --tokens tokens.json    # built code vs. its spec: tells + drift
python skills/parti/scripts/motion.py <path>                       # motion rule violations at file:line
python skills/parti/scripts/capture.py --url <url> --focus "<el>"  # one element's motion from a reference site
```

And the live session, in Node, no dependencies:

```bash
node skills/parti/live/boot.mjs --page src/index.html   # helper + overlay into your own browser
node skills/parti/live/poll.mjs --port P --token T      # the agent waits for what you do
```

**Only `lint.py` and `motion.py` exit non-zero** (`1` on any P0). The other three always exit `0` — they're instruments, not judges.

📖 **[Full script reference →](docs/scripts.md)** — every flag, real output, JSON schemas, exit codes, and CI wiring.

### Never report one blended number

`score.py` returns the measured half **only**: color discipline, type system, spatial rhythm, tokenization, motion craft, distinctiveness. Hierarchy, signature, content fit, copy, state coverage, and concept are judged in prose with written evidence and reported separately.

`lint.py` and `motion.py` are regression guards, not quality verdicts. A clean run means nothing on the known list is wrong — not that the build is good. `motion.py` in particular cannot see whether an animation has a *purpose*, which is the half of a motion review that decides most findings.

Given a screenshot rather than a codebase, the skill says so and scores the judged half only. Contrast ratios estimated by eye are guesses in the costume of measurement.

---

## Repository layout

```
.claude-plugin/       plugin.json + marketplace.json — the plugin manifest
skills/parti/
  SKILL.md             the skill itself — frontmatter + full process
  references/          loaded on demand rather than up front
  surfaces/            per-surface build direction — decisions, not markup
  scripts/             audit.py  capture.py  color.py  lint.py  motion.py  score.py  — stdlib only
  live/                the live browser session — Node, no dependencies
evals/                 run_script_evals.py  check_surfaces.py  rubric.md  trigger_cases.json
docs/                  scripts.md  CONTRIBUTING.md  RUNBOOK.md
```

| Doc | Contents |
|---|---|
| [`docs/scripts.md`](docs/scripts.md) | every flag, real captured output, JSON schemas, exit codes, CI wiring |
| [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md) | setup, the four testing layers, what each kind of change requires, PR checklist |
| [`docs/RUNBOOK.md`](docs/RUNBOOK.md) | install verification, diagnosing a skill that won't fire, script failures, release and rollback |
| [`docs/anti-slop-comparison.md`](docs/anti-slop-comparison.md) | how every design skill implements anti-slop, by mechanism type, and where each one fails |
| [`docs/competitive-analysis.md`](docs/competitive-analysis.md) | capability comparison against the other design skills, with what closed and what is still open |
| [`docs/suite-roadmap.md`](docs/suite-roadmap.md) | the staged plan for the suite, and the constraints that govern it |
| [`evals/ab-results.md`](evals/ab-results.md) | the blind A/B: measured results, and why the preference number is not yet collected |

References are split out because SKILL.md loads on every match while a reference loads only when the run actually needs it.

| Reference | Contents |
|---|---|
| [`commands.md`](skills/parti/references/commands.md) | every sub-command, its inputs, outputs, and cost |
| [`design-md.md`](skills/parti/references/design-md.md) | `DESIGN.md` protocol, template, writing one from an existing codebase |
| [`style-vocabulary.md`](skills/parti/references/style-vocabulary.md) | 25+ movements: what each is good at, its failure mode, when to avoid it |
| [`motion.md`](skills/parti/references/motion.md) | animation decisions, library choice, scroll, View Transitions, reduced motion |
| [`motion-rules.md`](skills/parti/references/motion-rules.md) | the rule catalog — every rule id, severity, and a fail/pass code pair |
| [`motion-recipes.md`](skills/parti/references/motion-recipes.md) | correct implementations: button, dropdown, tooltip, modal, drawer, toast, accordion, stagger, tab indicator, shared element, drag-to-dismiss |
| [`audit-protocol.md`](skills/parti/references/audit-protocol.md) | surveying an interface: recon, effort levels, finding format, leverage rubric |
| [`plan-template.md`](skills/parti/references/plan-template.md) | the self-contained plan format for handing work to another agent |
| [`render.md`](skills/parti/references/render.md) | the fidelity floor and component-by-component construction rules |
| [`critique.md`](skills/parti/references/critique.md) | concept-level tell list, redesign protocol, severity rubric |
| [`bans.md`](skills/parti/references/bans.md) | build-time tell list: CSS-specificity pitfalls, untouched library defaults |
| [`stacks.md`](skills/parti/references/stacks.md) | build playbooks per stack |
| [`verify.md`](skills/parti/references/verify.md) | the build verification loop and report format |
| [`remediation.md`](skills/parti/references/remediation.md) | finding → change: triage, which level to fix at, conflict precedence, re-verification, forbidden repairs |
| [`ux-methods.md`](skills/parti/references/ux-methods.md) | UX laws, heuristics, IA, states, cognitive load, accessibility |
| [`tokens.md`](skills/parti/references/tokens.md) | token spec format and a worked example |
| [`convention.md`](skills/parti/references/convention.md) | unconventional in expression, conventional in mechanics — the counterweight that keeps unique from costing usable |
| [`use-case.md`](skills/parti/references/use-case.md) | ten product archetypes → density, motion budget, type, colour, and each category's signature failure |
| [`elements.md`](skills/parti/references/elements.md) | the material system: icons, elevation, radius, borders, data display, ornament |
| [`foundations.md`](skills/parti/references/foundations.md) | the floor in numbers: page structure, readability, interaction, the colour defaults to refuse |
| [`go-no-go.md`](skills/parti/references/go-no-go.md) | the ship gate: unconditional no-gos, conditions that must all hold, the exception protocol |
| [`live.md`](skills/parti/references/live.md) | the live-session protocol: events, variants, knobs, annotations, recovery |
| [`surfaces.md`](skills/parti/references/surfaces.md) | what a surface direction contains, and why it ships no markup |
| [`systems.md`](skills/parti/references/systems.md) | working inside Material, Carbon, Fluent, Polaris, Primer, GOV.UK or Radix |

---

## Testing

```bash
python evals/run_script_evals.py            # 99 script assertions, exits 1 on any failure
python evals/check_surfaces.py              # surface directions: no markup, all parts, real rule ids
node skills/parti/live/selftest.mjs         # live protocol, annotations, abort semantics
node skills/parti/live/wraptest.mjs         # source surgery: nesting, CRLF, JSX, insert, undo
python evals/run_script_evals.py --verbose  # per-assertion output
python evals/run_script_evals.py --keep     # leave fixtures on disk to inspect
```

86 deterministic checks: WCAG contrast arithmetic against published reference values, and fixtures seeded with a known number of known tells so detection recall and false-positive rate are both countable. Stdlib only, so it drops into CI unmodified.

Every detector has a matching **false-positive guard** on a clean fixture. A linter that cries wolf gets muted, and a muted linter catches nothing.

**This covers one layer of four.** The layers have genuinely different epistemic status and must never be averaged together — averaging is how a measured 4.54:1 contrast ratio and a subjective 7/10 for "hierarchy" become one meaningless 8.2.

| Layer | Ground truth | Instrument | Objective? |
|---|---|---|---|
| 1. Trigger accuracy | 56 labeled prompts | `evals/trigger_cases.json` | yes, binary |
| 2. Script correctness | WCAG arithmetic + seeded fixtures | `evals/run_script_evals.py` | yes, deterministic |
| 3. Process compliance | 18 binary items, 5 of them gates | `evals/rubric.md` | yes, per-item binary |
| 4. **Design quality** | **none** | blind A/B against a baseline | **no** — preference only |

### The circularity trap

**Don't grade the skill's output with `score.py`.** The detector and the generator share a tell list. Optimizing against it produces designs that *evade the detector*, not designs that are good — swap the purple-to-blue gradient for purple-to-teal and distinctiveness goes to 15/15 while the page stays exactly as generic. Goodhart's law applies with unusual force because the metric is so cheap to satisfy.

Slop index is a valid **regression guard** and an invalid **quality metric**. Put it in CI. Never use it to choose between two directions, and never report an improvement in it as evidence the design got better.

Read [`evals/README.md`](evals/README.md) before adding any metric.

---

## Scope

**In scope:** visual direction, aesthetic strategy, typography, color, layout, hierarchy, motion and transitions, interaction design, information architecture, UX critique, design tokens, design-system auditing, and building the resulting UI as real, verified component code (React/Tailwind/shadcn, Vue, or plain HTML/CSS).

**Out of scope:** backend, state/data management, APIs, auth, deployment, non-visual architecture, performance engineering beyond animation cost. Asked about one of those, it answers the design question and notes that the engineering one is separate.

The trigger eval deliberately includes `design a database schema`, `design an API`, `design a rate limiter`, and `design a retry strategy` as **negatives**. A description that fires on those is over-broad, and over-broad is worse than narrow, because it burns context on every unrelated request.
