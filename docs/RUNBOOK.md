# Runbook

**There is no deployed service.** `parti` is a set of files Claude Code reads from disk. Nothing listens on a port, nothing has a health endpoint, and there is no alerting path — so this runbook covers what can actually go wrong: installing it, diagnosing it not firing, releasing a change, and backing one out.

---

## Install verification

After installing (see [README](../README.md#install)), confirm all three layers:

| Check | Command | Expected |
|---|---|---|
| Files in place | `ls ~/.claude/skills/parti/SKILL.md` | the file exists |
| Scripts run | `python evals/run_script_evals.py` | `TOTAL 86/86 passed` |
| Skill loaded | ask Claude Code to list its skills | `parti` appears with its description |

The third is the one that matters — the first two can pass while Claude Code never loads the skill.

---

## The skill doesn't fire

Work down in order; each step rules out the layer below it.

### 1. Is it loaded at all?

Ask Claude Code to list available skills. If `parti` is absent, it's an installation problem, not a triggering problem.

- **Wrong location.** As a standalone skill it must be `<skills-dir>/parti/SKILL.md` — a directory named for the skill, with `SKILL.md` directly inside, so the link/clone target is this repo's `skills/parti/` subfolder, not its root. As a plugin, the whole repo (root, with `.claude-plugin/plugin.json`) goes under `<skills-dir>/` instead — either shape works, but don't mix them (e.g. root cloned to `~/.claude/skills/parti-main/`, GitHub's default zip name, will not load either way).
- **Broken link.** If you linked instead of cloning, confirm the link resolves: `ls ~/.claude/skills/parti/SKILL.md`. On Windows a junction created against a since-renamed target silently resolves to nothing.
- **Session started before install.** Skills are enumerated at session start. Restart the session.

### 2. Is it loaded but staying quiet?

If it appears in the list but doesn't engage on a design request, the `description` is the cause — it alone decides when the skill loads.

Reproduce it against the eval set before changing anything:

```bash
# from a project with .claude/ and the Claude Code CLI available
python -m scripts.run_eval --skill-path ./parti/skills/parti \
  --eval-set ./parti/evals/trigger_cases.json --runs-per-query 3 --verbose
```

Targets: recall ≥ 0.90, precision ≥ 0.95. **Run at least 3 times per query** — trigger behavior is stochastic and a single run tells you almost nothing.

If your query genuinely should trigger and doesn't, add it to `trigger_cases.json` as a positive before touching the description, so the fix has a test.

### 3. Is it firing on the wrong things?

The opposite failure, and the more expensive one — an over-broad description burns context on every unrelated request. The four `design a <system>` negatives in the eval set exist to catch exactly this. If any of them now trigger, the scope line in the description has stopped holding.

---

## Script failures

| Symptom | Cause | Fix |
|---|---|---|
| `UnicodeEncodeError` on Windows | console is cp1252; script output uses real typography | the scripts self-guard with `sys.stdout.reconfigure(encoding="utf-8")` — if you hit this, that guard was removed from the script |
| `FileNotFoundError` on a path that exists | passing an MSYS path (`/c/Users/...`) to Python from Git Bash | use a Windows path (`C:\Users\...`); Python does not resolve MSYS prefixes |
| `lint.py` reports no drift on code you know drifted | `--tokens` was omitted | pass `--tokens tokens.json`; without it the script checks tells only and makes no drift claim |
| Exit `1` from `lint.py` / `motion.py` in CI | a P0 finding — working as designed | read the findings; these two are the only scripts that gate |
| Score looks wrong after a codebase change | `score.py` reads a stale `audit.json` | re-run `audit.py --json` first; `score.py` never re-scans source |

---

## Releasing a change

```bash
python evals/run_script_evals.py          # must be 86/86
git add -A
git commit -m "type: description"
git push origin main
```

**Before pushing, by change type:**

| Changed | Also required |
|---|---|
| A script | Layer 2 (86/86) + a false-positive guard for any new detector |
| `SKILL.md` description | Layer 1 re-run, all 56 cases, `--runs-per-query 3`; frontmatter ≤ 1024 chars |
| `SKILL.md` process guidance | a transcript scored against `evals/rubric.md` — ≥ 16/18 with all 5 gates |
| Script output format | re-capture the samples in `docs/scripts.md`; don't hand-edit them |

There is no release artifact, no version tag, and no publish step. Consumers track `main` — a push is the release, which means an untested push is a broken install for anyone who clones next.

---

## Rollback

The blast radius is one repository; there is no running system to drain or migrate.

**A bad commit that's already pushed** — revert rather than force-push, so anyone who already pulled converges cleanly:

```bash
git revert <sha>
git push origin main
```

**A bad local install** — remove the link or directory and re-clone:

```bash
rm ~/.claude/skills/parti          # a symlink
cmd /c "rmdir %USERPROFILE%\.claude\skills\parti"    # a Windows junction
```

Use `rmdir` for a Windows junction, not `rm -rf` — Git Bash treats a junction as a file and `rmdir` on it fails with `Not a directory`, while a recursive delete aimed through it risks the link target.

**A user reports the skill misbehaving after an update** — have them check out the previous commit locally while you reproduce it:

```bash
git -C ~/.claude/skills/parti checkout HEAD~1
```

Restart the Claude Code session afterward; skills are read at session start.

---

## What has no runbook entry, and why

No deployment procedure, health check, monitoring, alerting path, escalation, on-call rotation, backup, or restore. None of those have a referent in a repository of Markdown files and six stdlib scripts. If this ever grows a hosted component, that is when those sections earn their place — writing them now would be documenting a system that doesn't exist.
