# parti

*Parti*, from the French *prendre parti* — "to take a position." In architecture
it names the single organizing idea a building commits to, the one every later
decision has to answer to.

A Claude Code skill for anti-slop design work: score an existing UI, derive
divergent directions from the actual subject rather than a style menu, and build
the winner as verified production code. `SKILL.md` is the entry point;
everything else supports it.

```
SKILL.md       skill definition + frontmatter
references/    loaded on demand by SKILL.md (audit protocol, tokens, motion, bans, ...)
scripts/       audit.py  color.py  lint.py  motion.py  score.py   — stdlib only
evals/         run_script_evals.py, rubric.md, trigger_cases.json
```

## Install

```bash
git clone <this-repo> ~/.claude/skills/parti
```

Or clone anywhere and link it (Windows, no admin required):

```bash
cmd //c "mklink /J %USERPROFILE%\.claude\skills\parti <repo-path>"
```

## Test

```bash
python evals/run_script_evals.py
```

Covers the script layer only — 50 deterministic checks over WCAG contrast
arithmetic and seeded slop fixtures. Trigger accuracy and process compliance are
separate layers; design quality is not benchmarkable at all. See
[evals/README.md](evals/README.md) before adding a metric.
