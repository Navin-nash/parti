# Contributing

`parti` is a Claude Code skill: Markdown instructions plus five stdlib-only Python scripts. There is no build step, no package manifest, and no dependency tree to install.

---

## Setup

```bash
git clone https://github.com/Navin-nash/parti.git
cd parti
python evals/run_script_evals.py
```

If that prints `TOTAL 50/50 passed`, you have a working environment. That is the whole setup.

**Prerequisites:** Python 3.8+ and git. Nothing else — no `pip install`, no virtualenv, no lockfile. This is deliberate: a skill that needs a dependency tree is a skill people won't install.

To use your working copy as a live skill while developing, link it rather than copying, so edits take effect without a re-sync:

```bash
ln -s "$(pwd)" ~/.claude/skills/parti                                    # macOS/Linux
mklink /J "%USERPROFILE%\.claude\skills\parti" "C:\path\to\parti"        # Windows
```

---

## Commands

<!-- AUTO-GENERATED: from argparse in scripts/*.py and evals/run_script_evals.py. Regenerate rather than hand-edit. -->

| Command | Purpose |
|---|---|
| `python evals/run_script_evals.py [-h] [--verbose] [--keep]` | Run the 50-check script suite. Exits `1` on any failure. |
| `python scripts/audit.py [-h] [--json OUT] [--quiet] path` | Extract the de-facto design system from a codebase. |
| `python scripts/color.py [-h] {contrast,check,ramp,convert,fix} ...` | Palette math: contrast, ramps, minimal fixes. |
| `python scripts/lint.py [-h] [--tokens TOKENS] [--json OUT] [--quiet] path` | Build-time tells + token drift. Exits `1` on any P0. |
| `python scripts/motion.py [-h] [--json OUT] [--census] [--quiet] path` | Motion rule violations at `file:line`. Exits `1` on any P0. |
| `python scripts/score.py [-h] [--json OUT] audit_json` | Measured score across six dimensions. |

<!-- END AUTO-GENERATED -->

Full flag semantics, real output, and JSON schemas: [`scripts.md`](scripts.md).

## Environment variables

**None.** The scripts read no environment variables and no config files — every input is an argument or a path. There is deliberately no `.env.example` to keep in sync.

---

## Testing

The skill decomposes into four layers with genuinely different epistemic status. They are tested separately and **never averaged** — see [`../evals/README.md`](../evals/README.md) for why that matters more here than it sounds.

| Layer | How to run it | Gate |
|---|---|---|
| 1. Trigger accuracy | `run_eval.py` from skill-creator, against `evals/trigger_cases.json` | recall ≥ 0.90, precision ≥ 0.95 |
| 2. Script correctness | `python evals/run_script_evals.py` | 50/50 |
| 3. Process compliance | read a transcript against `evals/rubric.md` | ≥ 16/18 **with all 5 gates** |
| 4. Design quality | blind A/B against a baseline | no threshold — preference only |

### Changing a script

Layer 2 is the gate. Every detector needs **two** tests, not one:

1. A **detection** test on a fixture seeded with a known count of the thing.
2. A **false-positive guard** on the clean fixture.

The second is not optional. A linter that cries wolf gets muted, and a muted linter catches nothing — which is why the suite asserts `findings == []` on `clean/` for every detector, not just an overall pass.

```bash
python evals/run_script_evals.py --keep    # leaves fixtures on disk; the path is printed
```

Inspect the kept fixtures to see what your rule fires on before you trust it.

### Changing the SKILL.md description

**This is a behavioral change, not a documentation change.** The `description` field decides when the skill loads at all, so editing it can make the skill fire on unrelated work or go silent on work it should handle. Re-run Layer 1 against all 52 cases at `--runs-per-query 3` before pushing — trigger behavior is stochastic, and a single run tells you almost nothing.

Two constraints from the [skill specification](https://agentskills.io/specification):

- Frontmatter is capped at **1024 characters total**.
- The description should carry **triggering conditions only**. A description that summarizes the workflow creates a shortcut Claude takes *instead of* reading the skill body.

### Adding a trigger case

Append to `evals/trigger_cases.json`:

```json
{ "query": "the spacing on this feels random", "should_trigger": true }
```

Negatives matter more than positives. Four existing negatives use the word "design" for non-visual work — `design a database schema`, `design an API`, `design a rate limiter`, `design a retry strategy` — and all four must stay quiet. That's a hard gate: failing any one means the scope line in the description isn't holding.

If a case flips across runs, it's genuinely ambiguous. Either sharpen the description or move it to the excluded list in `evals/README.md` — don't score it and pretend the result is a fact.

### Changing process guidance in SKILL.md

Layer 3, the rubric, is the instrument. Editing prose without running a transcript against `evals/rubric.md` is how a skill accumulates rules nobody follows. The five **[G]** gates are the ones that mean the skill didn't run at all, as opposed to ran imperfectly.

---

## Code style

- **Stdlib only.** A new import that isn't in the standard library needs a strong argument; it costs every user an install step.
- **Scripts stay independently runnable.** No shared package, no `__init__.py`, no cross-imports between scripts. `evals/run_script_evals.py` invokes them as subprocesses precisely so their real CLI surface is what gets tested.
- **Windows console encoding.** Every script that prints typography opens with the `sys.stdout.reconfigure(encoding="utf-8")` guard. Keep it — a Windows console defaults to cp1252 and will crash on the output otherwise.
- **Exit codes are contract.** `lint.py` and `motion.py` exit `1` on any P0; `audit.py`, `score.py`, and `color.py` always exit `0`. Changing an exit code changes CI behavior for every consumer.

## Documentation

- `README.md` is the front door: what, why, install, command index. It **links to** `SKILL.md` and `references/` rather than restating them — two copies of the same process is how docs drift from behavior.
- Sections wrapped in `<!-- AUTO-GENERATED -->` are derived from source. Change the source, regenerate the section; don't hand-edit inside the markers.
- Sample output in [`scripts.md`](scripts.md) is **real captured output** from the `evals/` fixtures. If you change a script's output format, re-capture it rather than editing the sample by hand.

## Pull request checklist

- [ ] `python evals/run_script_evals.py` → 50/50
- [ ] New detector has both a detection test **and** a false-positive guard
- [ ] Touched `description`? Layer 1 re-run, and frontmatter still under 1024 chars
- [ ] Touched process guidance? A transcript scored against `evals/rubric.md`
- [ ] Touched script output? Samples in `docs/scripts.md` re-captured, not hand-edited
- [ ] Relative links resolve
- [ ] No new dependencies
