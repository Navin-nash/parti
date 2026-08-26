# Build Verification

Skipping this because the build "looks right" is not a small risk: independent measurement puts the defect rate of AI-generated frontend code at **40–62%** for security or design flaws — non-responsive buttons, forms that silently fail to submit, checkout flows that crash, especially on mobile — even in current-generation models. A build that hasn't been run through all three checks below hasn't been verified; it's been glanced at.

Three checks, every build, in this order. Each catches something the other two structurally can't — running only one and calling it verified is how a build passes review and ships slop anyway.

## 1. Scripted lint

```bash
python scripts/lint.py <path> --tokens tokens.json --json /tmp/lint.json
python scripts/motion.py <path> --json /tmp/motion.json
```

Deterministic. Catches:
- Build-time tells (`references/bans.md`) — untouched defaults, ghost cards, missing alt text, focus killed with no replacement, placeholder copy left in.
- **Token drift** — any hex color in the shipped code that isn't in `tokens.json`. This is the check unique to the build phase: a build can pass a visual review and still have three unspec'd colors nobody chose. Deterministic detection catches it every time; a human scan catches it when they happen to notice.
- **Motion rule violations** (`references/motion-rules.md`) — `ease-in` on UI, `transition: all`, `scale(0)` entrances, durations over budget, animated layout properties, keyframes on rapidly-triggered components, missing `prefers-reduced-motion`, ungated hover, easing and duration sprawl. Each at `file:line` with its rule id, so a finding can be fixed without re-deriving it. What it *can't* see — whether an animation has a purpose, and how often its surface is actually used — is the half that decides most motion findings, and it stays with you.

Exit code is 1 if any P0 finding exists — wire it into CI if the project has one; treat it as a regression guard the same way `score.py` is one, not as the whole quality bar. A lint pass means "nothing on the known list is wrong." It doesn't mean the build is good — that's checks 2 and 3.

`--tokens` is optional but do the drift check whenever a token spec exists; skipping it because "the colors look right" is exactly the kind of eyeballed claim this whole skill exists to replace with a number.

## 2. Contrast

Every stated text/background pair, verified by tool:

```bash
python scripts/color.py check palette.json
```

"This passes AA" without a stated ratio is the measurement's costume, not the measurement — in a build report the same way it is in a critique finding.

## 3. Fidelity, on the real build

Render what actually shipped — not a mockup, the built component in the built app — and run it against the fidelity floor a second time (`references/render.md`):

- Real font loaded, not a silent system fallback.
- Elevation from the spec's `--e-` scale, not a copy-pasted shadow value.
- No placeholder image left where real content was supposed to go.
- The signature interaction actually happens — click it, don't just describe that it would work.
- Keyboard-only pass: tab through the screen, confirm every interactive element gets a visible focus state in the order a sighted mouse user would expect.

A build that fails checks here that a rough mockup would also have failed is a regression relative to the plan it was built from, not progress toward it — flag it as a deviation (see the report format below), don't quietly ship it and hope no one looks closely.

---

## Build report format

Emit this after all three checks pass (or after they fail, so the failure is visible rather than silently retried until it happens to pass):

```markdown
## Build report — [screen/component name]

**Files:** [list, or a count + path if large]

**Lint:** [PASS/FAIL] — P0: [n] · P1: [n] · P2: [n]
**Motion:** [PASS/FAIL] — P0: [n] · P1: [n] · P2: [n] · judged: [purpose/cohesion/staging verdict in one line]
[if any P0/P1: list each with file + one-line reason it's staying or getting fixed before this report is final]

**Contrast:**
| Pair | Ratio | Verdict |
|---|---|---|
| [fg] on [bg] | [x.x]:1 | [AA/AAA/fail] |

**States covered:** [empty / loading / partial / ideal / error / overflow / offline / no-permission — mark each present/absent]

**A11y floor:** focus visible [Y/N] · keyboard path complete [Y/N] · 44px targets [Y/N] · reduced-motion honored [Y/N]

**Deviations from spec:** [none, or each one named with its reason — never silent]

**DESIGN.md synced:** [Y/N + one-line summary of what changed]
```

A report with an empty deviations section and a lint PASS is the only combination that means "built as specified, verified, done." Anything else needs the next pass before it does.
