# Evaluating this skill

**Design quality is not benchmarkable. Three of the four layers of this skill are.**

Any single number claiming to score "is this design good" is a rubric wearing a lab coat. But the skill decomposes into layers with genuinely different epistemic status, and most of them have real ground truth. Test them separately and never average them together — averaging is how a measured 4.54:1 contrast ratio and a subjective 7/10 for "hierarchy" become one meaningless 8.2.

| Layer | Ground truth | Instrument | Objective? |
|---|---|---|---|
| 1. Trigger accuracy | 56 labeled prompts | `run_eval.py` (skill-creator) | Yes, binary |
| 2. Script correctness | WCAG arithmetic + seeded fixtures | `run_script_evals.py` (50 checks) | Yes, deterministic |
| 3. Process compliance | 18 binary items, 5 gates | `rubric.md` | Yes, per-item binary |
| 4. Design quality | **none** | blind A/B against a baseline | **No** — preference only |

---

## The circularity trap — read before designing any metric

**Do not grade the skill's output with `score.py`.** The detector and the generator share a tell list. Optimizing against it produces designs that *evade the detector*, not designs that are good: swap the purple-to-blue gradient for purple-to-teal and the slop index goes to zero while the page stays exactly as generic. Goodhart's law applies here with unusual force because the metric is so cheap to satisfy.

Slop index is a valid **regression guard** — did we ship a tell we already know about — and an invalid **quality metric**. Put it in CI. Never use it to choose between two directions, and never report an improvement in it as evidence the design got better.

The only honest quality instrument is a human preferring one artifact over another without knowing which produced it. That is noisy, expensive, and still the best available. Layer 4 below is built around accepting that rather than papering over it.

---

## Layer 1 — Trigger accuracy

Does the skill fire when it should and stay quiet when it shouldn't? Fully binary, and the cheapest signal available.

```bash
cd /path/to/project          # needs a .claude/ dir and the Claude Code CLI
python -m scripts.run_eval \
  --skill-path ./parti \
  --eval-set ./parti/evals/trigger_cases.json \
  --runs-per-query 3 --verbose
```

56 labeled cases: 32 positive, 24 negative. The negatives are the ones that make this metric mean anything — four of them use the word "design" for non-visual work ("design a database schema", "design an API", "design a rate limiter", "design a retry strategy"). A description that fires on those is over-broad, and over-broad descriptions are worse than narrow ones because they burn context on every unrelated request.

**Thresholds:**

| Metric | Target | Interpretation |
|---|---|---|
| Recall (positives firing) | ≥ 0.90 | below this, the skill is invisible when needed |
| Precision (negatives staying quiet) | ≥ 0.95 | below this, it's noise on unrelated work |
| The four "design a \<system\>" negatives | 4/4 quiet | a hard gate — failing any one means the scope line in the description isn't holding |

`--runs-per-query 3` matters. Trigger behavior is stochastic; a single run tells you almost nothing. If a case flips across runs, it's genuinely ambiguous — either sharpen the description or move the case to the ambiguous list below.

**Deliberately excluded as ambiguous** (don't score these; they're judgment calls where either answer is defensible): "add a dark mode toggle", "implement this Figma file", "make the button bigger", "add a loading spinner". If you want the skill to take a firm position on these, add them and accept that you're now measuring a preference, not a fact.

---

## Layer 2 — Script correctness

```bash
python evals/run_script_evals.py            # exits 1 on any failure
python evals/run_script_evals.py --verbose  # per-assertion output
python evals/run_script_evals.py --keep     # leave fixtures on disk
```

29 assertions across six groups. Self-contained: it generates its own fixtures, so there's nothing to install and nothing to keep in sync.

**Contrast math** is checked against six published WCAG reference values — `#767676` on white is the canonical 4.54:1 AA-body boundary, `#595959` is the 7.00:1 AAA boundary, `#949494` is the 3.03:1 large-text boundary. These are external ground truth, not self-consistency: the script would have to be right about arithmetic that was specified elsewhere. Tolerance is ±0.02.

**Fixtures** are seeded with known answers:

- `slop/` — 11 deliberately planted tells. Measures **detection recall** (target ≥ 0.80).
- `clean/` — a disciplined tokenized system. Measures **false-positive rate** (target ≤ 1 tell) and that a good system actually scores well (target ≥ 70).
- `sparse/` — a near-empty repo. Measures graceful degradation: reports nothing rather than guessing.

Plus a **determinism** check — two runs must produce byte-identical output. A non-deterministic auditor can't be used as a regression guard.

**These fixtures are the regression suite.** Every time you add a tell detector, plant an instance in `slop/`, add its id to `SLOP_TELLS`, and plant a near-miss in `clean/` that must *not* fire. A detector added without a false-positive case is how an auditor becomes useless — it starts flagging everything and people stop reading it.

**Current status: 29/29.** Both bugs this harness caught on first run were real: `icon_tile` required Tailwind classes in a fixed order when class order is arbitrary, and `base_unit` missed spacing defined as tokens, which silently under-scored exactly the well-tokenized systems it should have rewarded.

---

## Layer 3 — Process compliance

Did the skill do what it says it does? Every item is binary and checkable by reading the transcript, which makes it objective even though the *subject* is a judgment task. See `rubric.md` for the 18-item checklist.

**Threshold: ≥ 16/18, with all five gate items passing.** The gates are the ones where failure means the skill didn't actually run: DESIGN.md read or created, three directions genuinely divergent, every direction states its cost, contrast verified by tool rather than asserted, tokens emitted.

Score this on 5 representative briefs — one greenfield, one redesign of an existing codebase, one narrow command (`typeset` or `motion`), one screenshot-only input, one where the request conflicts with DESIGN.md.

The conflict case is the most informative single test in the whole suite. It's the only one that checks the skill surfaces a disagreement instead of silently overriding a file the user is relying on, and silent override is the failure mode that makes design memory worthless.

---

## Layer 4 — Design quality (the honest part)

There is no automated instrument. What follows is the least-bad protocol.

**Blind A/B against a baseline.**

1. Pick 6–8 briefs from real work.
2. For each, generate two artifacts: one with the skill, one without (same model, same prompt, skill disabled). Save both as rendered HTML.
3. Strip anything identifying. Randomize left/right per pair.
4. Show each pair to 5+ people who didn't build the skill and don't know which is which. One question only: **"Which of these would you rather ship?"** Not "which is better designed" — that invites theorizing. Shipping is a decision with consequences and people answer it more honestly.
5. Record preference rate and the free-text reason.

**Threshold: > 65% preference across pairs, with the reasons naming design properties rather than novelty.** Below 60%, the skill isn't earning its context. Above 80%, check that your baseline isn't a straw man.

**Why 5+ raters:** with 3 raters a single strong opinion swings the result. Design preference has high inter-rater variance and small samples produce numbers that look definitive and aren't.

**What to watch for in the free text.** If people say "the second one is more interesting" or "more unusual", the skill has learned novelty rather than fit — the exact failure mode of an anti-slop objective. You want reasons like "I can tell what to do first", "the numbers line up", "it looks like it's for accountants". Novelty praise on a utility product is a warning, not a win.

**Longitudinal signal, if you can afford it.** Ship one direction and instrument the critical moment the brief named — completion rate on the key task, time-to-first-action, or support tickets about finding things. This is the only true outcome measure in the whole document, and it takes weeks. Everything above is a proxy for it.

---

## What a full run looks like

```bash
# Layer 2 — seconds, run on every change
python evals/run_script_evals.py

# Layer 1 — minutes, run after any description edit
python -m scripts.run_eval --skill-path ./parti \
  --eval-set ./parti/evals/trigger_cases.json --runs-per-query 3

# Layer 3 — an hour, run after any process change to SKILL.md
# 5 briefs, score each against rubric.md

# Layer 4 — days, run before claiming the skill works
# 8 briefs × 2 conditions × 5 raters
```

Layers 1–3 tell you the skill is **functioning**. Only layer 4 tells you it's **working**. Do not report the first as if it were the second — a suite of 29 green assertions says the contrast math is right, not that anyone wants to look at the result.
