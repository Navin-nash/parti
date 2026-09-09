# Where parti stands against the popular design skills

Researched 2026-09-08 by reading the actual installed artifacts, not their READMEs:
`impeccable`, `emil-design-eng`, `design-taste-frontend`, `ui-ux-pro-max`,
`frontend-design` (Anthropic), `high-end-visual-design`, `minimalist-ui`, `gpt-taste`.

Star counts were not verified — this compares capability surface, which is the thing
we can actually act on.

**Updated 2026-09-09**, after building against these findings. "Where parti was behind"
now records what closed and how, so the claims can be checked rather than believed.

## The field, in one table

| Skill | Size | Shape | Enforcement | Visual loop | Memory | Code artifacts |
|---|---|---|---|---|---|---|
| **parti** | SKILL + 31 references + 6 Python scripts + a zero-dep Node live runtime | Process (explore → converge → build → verify) with a ship gate | 3 scripts, rule-ids at `file:line`, token drift, go/no-go gate | **full live browser session** + measured contrast in-page | DESIGN.md | none by design (surface *directions*, no markup) |
| impeccable | 181-line SKILL + 27 refs (6.5k lines) + 35 Node scripts + 2 subagents | Command router (24 commands) | bundled detector (browser + node engines, rule registry, profiles) | **full live browser session**: element picker, in-browser variants, manual-edit capture/replay, screenshots | PRODUCT.md + DESIGN.md + **critique snapshots + context signals** | per-command references w/ code |
| design-taste-frontend | 1,206-line single file | Dial config (variance/motion/density) + block-library contract | pre-flight checklist (prose) | none | none | **canonical GSAP skeletons + design-system install matrix** |
| emil-design-eng | 679-line single file | Craft doctrine | review checklist (prose) | none | none | **~40 real animation/CSS patterns** |
| ui-ux-pro-max | 658-line SKILL + `search.py` corpus | Queryable knowledge base | checklist | none | persisted design system (master + overrides) | none |
| frontend-design | 42 lines | Taste prompt | none | none | none | none |
| high-end-visual-design | 98 lines | Persona + "variance engine" archetypes | ban list | none | none | inline Tailwind recipes |

Two clusters: **prompt-shaped taste skills** (frontend-design, high-end-visual-design,
emil, design-taste) and **tooled systems** (impeccable, parti, ui-ux-pro-max). Only
impeccable and parti are in the second cluster with real scripts. That is the fight.

---

## What parti already does that nobody else does

Keep these, and lead with them — they are the moat, and none are currently marketed.

1. **A real evaluation story.** `evals/` has 56 labeled trigger cases, 102 deterministic
   script checks, an 18-item binary process rubric with 5 hard gates, and — the part
   that matters — a written argument for *why design quality is not benchmarkable* and
   why optimizing against the slop detector is Goodhart bait. No competitor has any
   eval. Not one. This is the most defensible thing in the repo.
2. **Measured vs. judged, never blended.** `score.py` returns only the measurable half;
   hierarchy/signature/concept stay with the model, reported separately. Every other
   skill either hand-waves scoring or emits one fake number.
3. **Three divergent directions with an axis gate and a named cost.** Competitors
   generate *one* answer. parti forces choice architecture and refuses three palettes on
   one layout. That is a different product, not a better prompt.
4. **Token drift.** `lint.py` checks shipped code against *the spec parti itself emitted*.
   impeccable's detector finds known tells; nobody else checks the plan-to-code gap.
5. **Motion as an enforced rule catalog.** 812 lines of rule-ids + `motion.py` reporting
   at `file:line`. emil has comparable craft depth and zero enforcement.
6. **Reference capture with scoped ethics** (`capture.py`, static + Playwright runtime
   tiers, `--focus` element only). Nobody has inspiration ingestion at all.
7. **DESIGN.md as a two-way contract** with explicit conflict surfacing rather than
   silent override.

---

## Where parti was behind, and what changed

The eight gaps below were the findings of the original pass. Six are now closed; the
notes say how, so the claim can be checked rather than believed.

| # | Gap | Status |
|---|---|---|
| 1 | **It never looks at what it made.** Everything was source-text analysis; "squint, grayscale" was asserted in prose and never performed. | **Closed.** A full live session: element picking with depth navigation, in-browser variants, insert mode, per-variant knobs, steer/abort, manual-edit replay, element-anchored annotations. Contrast is now measured from painted pixels in the page. |
| 2 | **No project memory beyond DESIGN.md.** No scored history, no backlog, no signals. | **Open.** Stage 2 of the roadmap. |
| 3 | **Principles without artifacts** at build time. | **Closed, but not the way the original pass proposed.** It recommended a block library of reference implementations. That was built, then removed: a reference implementation is a default with better manners, and pasting one substitutes the template author's decisions for the direction's — the same failure the skill exists to prevent, one level deeper. `surfaces/` now carries decisions, token requirements, states, and failure modes, with **no markup**, enforced by a checker that fails on any code fence. |
| 4 | **No design-system interop.** | **Closed.** `references/systems.md`: which of four layers the direction lands in, what each costs to own, how the token spec maps, and the derived-state trap that breaks most themed systems. |
| 5 | **No asset pipeline.** | **Open.** Stage 5. |
| 6 | **Python in a JavaScript audience.** | **Partly closed.** Everything touching a browser or dev server is now zero-dependency Node. The analysis scripts stay Python, which is a live cost. |
| 7 | **Ergonomics and reach** — no shortcuts, no onboarding command, Claude-only. | **Open.** Stage 5. |
| 8 | **Screenshot and design-file input degrade rather than work.** | **Open.** Stage 5. |

Seven things were added that the original pass did not identify, because they only became
visible while building:

- **A ship gate.** `references/go-no-go.md` — thirteen unconditional no-gos, eight
  conditions that must all hold, an exception protocol that requires writing the waiver
  down, and an explicit list of what is *not* a blocker so the gate refuses defects
  rather than taste. The material existed, scattered across three files; nothing owned
  the verdict.
- **A foundations floor, in numbers.** `references/foundations.md` — the structural
  sentence and a named role per block (the unstructured-stack failure, which is where
  generated pages actually fall apart), readability floors as values rather than
  adjectives, and interaction minimums. The original pass measured *tooling* and missed
  that the skill had no stated floor for structure at all.
- **The default palette, caught mechanically.** `lint.py` gained `default_violet`, which
  flags the indigo-violet band by hue, saturation and lightness rather than by a hex
  list — so nudging `#6366F1` to `#6165EE` does not evade it. A declared brand colour
  clears it. Every competitor forbids this palette in prose; none of them can detect it.
- **Use case under register.** `references/use-case.md` — ten archetypes, because "product"
  is one bit of information and a trading terminal and a meditation app are both product.
  Each sets density, motion budget, type, colour strategy, and names the failure everyone
  makes in that category. Competitors have a register split at best; none go below it.
- **A material system.** `references/elements.md` — icons, elevation, radius, borders,
  data display, ornament, and the rule that one screen gets one language per property.
  This is where generated work actually reads as assembled rather than designed, and no
  competitor covers it as a system.
- **A greenfield path.** Building from nothing is the *strongest* case for the skill, not
  a degraded one: with nothing anchoring the work the default fills the gap. The process
  substitutes subject interrogation for the audit and puts structure before surface.
- **Checks on the skill's own material.** `check_surfaces.py` verifies the directions
  ship no implementations, carry every required part, and cite motion rule ids that
  actually resolve — it caught five invented ids on its first run.

## What nobody has — the moves that make parti "far better"

Unclaimed, buildable, and each extends parti's existing doctrine rather than bolting on a
competitor's feature.

**A. Perceptual verification — turn the squint test into an instrument.**
Screenshot the build at 3 viewports, then programmatically grayscale + downsample + blur it
and check that the region parti declared as "attention lands here first" in Step 2 is still
the highest-salience region. Same for grayscale hierarchy survival, and contrast sampled
from rendered pixels rather than from source. This converts part of the "judged" half into
the measured half — exactly the axis parti already claims as its identity, and the most
differentiated thing available. `scripts/squint.py`.

**B. Design review in CI.**
`parti review` over a diff, emitting rule-id findings at `file:line` — already the output
format — wired as a GitHub Action that comments on PRs. Teams adopt infrastructure, and
adoption by a team beats a star from an individual. The anti-circularity doctrine in
`evals/README.md` already licenses exactly this use: regression guard, not quality metric.

**C. Design-system entropy over time.**
`audit.py` already computes palette sprawl, off-grid spacing, radius variance, tokenization
ratio. Run it across commit history and you have a design-debt trend line. Nobody has a
longitudinal view of a design system.

**D. Published blind A/B results.**
Layer 4 of the eval plan is described and never run. Build the harness, generate paired
artifacts against impeccable / frontend-design / a bare model, collect blind preferences,
publish the win rate. No design skill in this field has published a single number. Going
first — including where parti loses — is the strongest credibility asset available.

**E. A dated, versioned tell registry.**
Tells rot: the purple gradient was 2024, cream-and-serif is 2026. `bans.md` is 59 lines and
undated. Make the tell list a versioned artifact with a first-seen date, a saturation
estimate, and a deprecation path, and it becomes something people cite and contribute to.

**F. Cross-harness packaging.**
An `AGENTS.md` projection so the skill runs in Codex, Cursor, and Gemini CLI. The content is
already harness-neutral; only the invocation and script paths are not.

---

## What is left

Done since the original pass: the live session in full, surface directions, design-system
interop, the ship gate, and the checks on the skill's own material.

**Next, in order**

1. **Perceptual verification** (`squint.py`). Screenshot at three viewports, then grayscale,
   downsample and blur to check that the region declared as the first stop still is one.
   The live session already produces the screenshots. Still the single most differentiated
   thing available, and still not built.
2. **Memory and signals.** A no-argument invocation that recommends the next two or three
   commands from git state, the last score, and open findings — and design-system entropy
   as a trend rather than a point.
3. **`parti review` in CI.** Rule-id findings on a diff, posted to a pull request. Teams
   adopt infrastructure; adoption by a team beats a star from an individual.
4. **Reach.** Asset production, screenshot and Figma frames as brief input, cross-harness
   packaging, discovery keywords.
5. **Publish the blind A/B.** Paired artifacts against impeccable and a bare model, blind
   votes, the win rate published including the losses. No design skill in this field has
   published a single number.

**Dropped:** the Node port of the analysis scripts. The browser and dev-server code is Node
already, which is where the zero-install argument actually bit; porting 2.6k lines of tested
Python to save the agent a runtime it usually has is not worth the regression risk.

## The positioning line

impeccable has the widest command surface. emil has the deepest craft doctrine.
design-taste has the most copy-ready implementation. None of them can tell you whether they
worked.

**parti's claim: the only design skill that verifies its own output — against the spec it
wrote, in the rendered pixels, behind a gate that says go or no-go, with an eval suite that
says out loud what it cannot measure.** Everything above serves that sentence. Anything
that does not, defer.

It is also the only one that refuses to hand you a template. Every competitor ships markup
to paste; parti ships the decisions and makes you write it, because a reference
implementation is a default with better manners and pasting one is how a good direction
quietly becomes somebody else's.


---

## Live-session parity, measured (2026-09-09)

Checked feature by feature against impeccable's `reference/live.md`, not by impression.

| Capability | impeccable | parti |
|---|---|---|
| Element picking | yes | yes, plus depth navigation and an ancestor breadcrumb |
| In-browser variants | yes | yes |
| Accept / discard / undo | accept, discard | accept, discard, **undo** |
| Manual edit replay | yes | yes, with whitespace- and entity-tolerant matching and refusals |
| Insert mode | yes | yes, with an orientation-aware caret |
| Per-variant parameter knobs | yes | yes |
| Steer / abort in flight | yes | yes, and an aborted event is never replayed after a restart |
| Source-file protection | yes | yes |
| Journal recovery | yes | yes |
| Annotations (pins + strokes) | yes, over a screenshot | yes, **anchored to elements** |
| Rasterized page screenshot | yes (bundled screenshot lib) | no, deliberately — see below |
| Prefetch | yes | no, deliberately |
| Per-variant token-drift flags | no | **yes** |
| Measured contrast on selection | no | **yes** |
| Real narrow-viewport window | no | **yes** |

One entry is a deliberate trade rather than a gap. impeccable bundles a screenshot
library and sends a raster; parti sends **element-anchored** marks — a pin carries the
element under it, a stroke carries every element it crossed, so "this whole row" arrives
as a list of selectors instead of a rectangle. Rasterizing the DOM without a dependency
means an SVG foreignObject serialization that drops cross-origin images, taints the
canvas, and substitutes fallback fonts; a picture that lies about the design is worse
for judging it than none. Where the harness has a browser tool, the agent takes its own
screenshot at the recorded viewport and reads the annotation overlay against it.

**Prefetch** is speculative work and remains skipped on purpose.

The three parti-only rows are the argument for the whole suite: a variant that drifts
off the token spec is flagged in the rail *while the user is choosing*, contrast is
measured from painted pixels rather than from source, and the narrow view is a real
window where media queries actually run rather than a scaled-down fake.
