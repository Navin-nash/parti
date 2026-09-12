# Contributing

`parti` is a Claude Code skill: Markdown instructions plus five stdlib-only Python scripts. There is no build step, no package manifest, and no dependency tree to install.

---

## Setup

```bash
git clone https://github.com/Navin-nash/parti.git
cd parti
python skills/parti/scripts/audit.py --help
```

If that prints usage rather than an error, you have a working Python. That is the whole setup.

**Prerequisites:** Python 3.8+ and git. Nothing else — no `pip install`, no virtualenv, no lockfile. This is deliberate: a skill that needs a dependency tree is a skill people won't install.

To use your working copy as a live skill while developing, link it rather than copying, so edits take effect without a re-sync:

```bash
ln -s "$(pwd)" ~/.claude/skills/parti                                    # macOS/Linux
mklink /J "%USERPROFILE%\.claude\skills\parti" "C:\path\to\parti"        # Windows
```

---

## Commands

<!-- AUTO-GENERATED: from argparse in skills/parti/scripts/*.py, plus the Node checks under skills/parti/live/. Regenerate rather than hand-edit. -->

| Command | Purpose |
|---|---|
| `node skills/parti/live/selftest.mjs` | Live protocol: events, annotations, abort semantics. |
| `node skills/parti/live/wraptest.mjs` | Source surgery: nesting, CRLF, JSX, insert, undo. |
| `python skills/parti/scripts/audit.py [-h] [--json OUT] [--quiet] path` | Extract the de-facto design system from a codebase. |
| `python skills/parti/scripts/color.py [-h] {contrast,check,ramp,convert,fix} ...` | Palette math: contrast, ramps, minimal fixes. |
| `python skills/parti/scripts/lint.py [-h] [--tokens TOKENS] [--json OUT] [--quiet] path` | Build-time tells + token drift. Exits `1` on any P0. |
| `python skills/parti/scripts/motion.py [-h] [--json OUT] [--census] [--quiet] path` | Motion rule violations at `file:line`. Exits `1` on any P0. |
| `python skills/parti/scripts/score.py [-h] [--json OUT] audit_json` | Measured score across six dimensions. |
| `python skills/parti/scripts/capture.py [-h] --url URL [--focus SEL] [--tier TIER] [--json OUT]` | Capture one reference site's motion and one element's anatomy. |

<!-- END AUTO-GENERATED -->

Full flag semantics, real output, and JSON schemas: [`scripts.md`](scripts.md).

## Environment variables

**None.** The scripts read no environment variables and no config files — every input is an argument or a path. There is deliberately no `.env.example` to keep in sync.

---

## Testing

**There is no standalone eval suite in this repo.** One existed — 56 labeled trigger cases, 102 deterministic script assertions, an 18-item process rubric, a blind-A/B harness — and was removed on 2026-09-12 as overhead nobody was running day to day. `docs/suite-roadmap.md` has the history if you're deciding whether to rebuild any of it.

What's left is what CI actually checks (`.github/workflows/ci.yml`): `ruff` over the scripts, and the site's own typecheck/lint/build. Beyond that, testing a change here means running it and reading the output — there is no automated pass/fail beyond what's below.

| What changed | How to check it |
|---|---|
| A script (`audit.py`, `lint.py`, `motion.py`, `color.py`, `score.py`, `capture.py`) | Run it against a fixture that should trip the new behavior, and one that shouldn't. Read both reports — a detector you haven't seen stay quiet on a clean case is a detector you haven't tested. |
| The live runtime (`skills/parti/live/`) | `node skills/parti/live/selftest.mjs` and `node skills/parti/live/wraptest.mjs` — both still exist and both must pass. |
| `SKILL.md`'s `description` | Behavioral, not documentation — it decides when the skill loads at all. Try it in a real Claude Code session against a few queries that should trigger and a few that shouldn't; there is no automated recall/precision check to run instead. |
| `SKILL.md`'s process guidance | Read a real transcript against the process the guidance describes. There is no automated rubric grader. |

### Changing a script

Verify a new or changed detector by hand against two cases: one that should fire, one that shouldn't. The second matters more than the first — a linter that cries wolf gets muted, and a muted linter catches nothing.

### Changing the SKILL.md description

**This is a behavioral change, not a documentation change.** Editing it can make the skill fire on unrelated work or go silent on work it should handle. Two constraints from the [skill specification](https://agentskills.io/specification):

- Frontmatter is capped at **1024 characters total**.
- The description should carry **triggering conditions only**. A description that summarizes the workflow creates a shortcut Claude takes *instead of* reading the skill body.

---

## Code style

- **Stdlib only.** A new import that isn't in the standard library needs a strong argument; it costs every user an install step.
- **Scripts stay independently runnable.** No shared package, no `__init__.py`, no cross-imports between scripts — each one's real CLI surface is what a user actually invokes.
- **Windows console encoding.** Every script that prints typography opens with the `sys.stdout.reconfigure(encoding="utf-8")` guard. Keep it — a Windows console defaults to cp1252 and will crash on the output otherwise.
- **Exit codes are contract.** `lint.py` and `motion.py` exit `1` on any P0; `audit.py`, `score.py`, and `color.py` always exit `0`. Changing an exit code changes CI behavior for every consumer.

## Documentation

- `README.md` is the front door: what, why, install, command index. It **links to** `skills/parti/SKILL.md` and `skills/parti/references/` rather than restating them — two copies of the same process is how docs drift from behavior.
- Sections wrapped in `<!-- AUTO-GENERATED -->` are derived from source. Change the source, regenerate the section; don't hand-edit inside the markers.
- Sample output in [`scripts.md`](scripts.md) is **real captured output** from an actual run, not illustrative. If you change a script's output format, re-capture it rather than editing the sample by hand.

## Pull request checklist

- [ ] `ruff check` passes
- [ ] New or changed detector verified by hand against a firing case and a clean one
- [ ] Touched the live runtime? `selftest.mjs` and `wraptest.mjs` both pass
- [ ] Touched `description`? Tried against real queries in a session; frontmatter still under 1024 chars
- [ ] Touched script output? Samples in `docs/scripts.md` re-captured, not hand-edited
- [ ] Relative links resolve
- [ ] No new dependencies
