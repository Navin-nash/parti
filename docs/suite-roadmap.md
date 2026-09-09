# parti as a full design suite — architecture and staging

Goal: rival every competitor in every segment — audit, design, build, memory, eval — and add a
live browser session (element picking, in-browser variants, manual-edit capture, snapshots,
replay) that no skill except impeccable has.

This is the plan of record. Written 2026-09-08, **status updated 2026-09-09**.

**Where it stands.** Stage 1 shipped in full, plus five things this plan did not
anticipate — a ship gate, a foundations floor, use-case archetypes, a material system, and
the convention rule that keeps unique from costing usable. Stage 3 shipped in a form this
plan got wrong: it specified a block library of reference implementations, and that turned
out to be the failure the skill exists to prevent, one level deeper. Stages 1b, 2 and 5
are untouched. Stage 4 is half done: the A/B harness exists and the rater panel does not.

## Design constraints for the whole suite

1. **One state directory, `.parti/`.** Journals, snapshots, scores, critique history, live
   sessions. Append-only JSONL where possible so recovery is reading a file, not restoring
   a process. Gitignored by default; `DESIGN.md` stays the only tracked artifact.
2. **Two runtimes, one boundary.** Node for anything touching a browser or a dev server
   (zero install in a frontend repo). Python stays for the analysis scripts — they are
   agent-invoked, already tested by 99 eval checks, and porting them buys nothing today.
   The boundary is: *browser and server → Node; static analysis → Python.* Do not blur it.
3. **The helper serves the user's own browser.** Not a headless agent browser. That is what
   makes element picking and manual edits possible at all, and it works on every harness
   including ones with no browser tool. Harness browser tools (Claude Browser pane, Chrome
   MCP, Playwright) are used *in addition*, for screenshots and automated verification.
4. **Every new capability emits findings in the existing format** — rule id, `file:line`,
   severity. One vocabulary across audit, lint, motion, live, and CI.
5. **Nothing new gets a quality score.** The measured/judged split holds everywhere. Live
   mode and perceptual checks are instruments, not verdicts.

---

## Target module layout

```
skills/parti/
  SKILL.md
  references/            (existing 22, plus below)
    live.md              live-session protocol and agent contract
    memory.md            .parti/ state, signals, recommendation logic
    surfaces.md          what a surface direction contains, and how to use one
    systems.md           design-system interop (Material, Carbon, Fluent, ...)
  surfaces/              build direction per surface, no markup (Stage 3)
    data-table.md  form-field.md  empty-state.md  ...
  scripts/               Python: analysis (existing)
    audit.py score.py color.py lint.py motion.py capture.py
    squint.py            NEW - perceptual verification from screenshots
  live/                  Node: runtime (Stage 1)
    boot.mjs             detect dev server, inject, print session JSON
    server.mjs           helper: /live.js, SSE, /poll, /snapshot, journal
    overlay.js           injected: picker, variant strip, annotations, edits
    inject.mjs           source-file injection + cleanup
    wrap.mjs             wrap target element into a variant block in source
    accept.mjs           keep chosen variant, delete the rest, unwrap
    poll.mjs             one-shot / stream long-poll for the agent
    status.mjs resume.mjs   recovery from the journal
    snapshot.mjs         DOM + computed-style + screenshot capture
  memory/                Node: state (Stage 2)
    signals.mjs          git, dev server, last score, open findings
    history.mjs          critique/score snapshots over time
```

---

## Stage 1 — Live session (the flagship)

The capability, ranked by what a user feels:

| Feature | How |
|---|---|
| Element picking | overlay hover outline + click → stable selector, rect, computed styles, source guess |
| In-browser variants | wrap target in source as a variant block; agent writes N variants in one edit; HMR reloads; overlay toggles `data-parti-variant` |
| Accept / discard | `accept.mjs` keeps one block, deletes the others, removes the wrapper |
| Manual edits | overlay `contenteditable` + style tweaks captured as a diff intent, replayed into source by the agent |
| Snapshots | DOM + computed styles + client-side screenshot per event, written to `.parti/live/<session>/` |
| Replay | append-only journal; `resume.mjs` prints the exact next safe action after any interruption |
| Annotations | comment pins and freehand strokes on the screenshot, sent with the generate event |

**Why this can be ~2.5k lines instead of 17.6k.** impeccable's size comes from breadth of
framework edge cases, a full in-page UI, and a carbonize/copy-edit agent path. We ship:
one overlay UI at ~800 lines, one server at ~450 (SSE + long-poll + JSONL journal, no
separate session store), source wrapping at ~350, accept at ~250, and thin recovery
scripts. Scope discipline is the feature, not a compromise: Vite/Next/Bun HMR and static
files only, one variant block at a time, no nested sessions.

**The parti-specific twist competitors do not have:** every live variant is checked against
the token spec before it is offered. Generate three variants, run `lint.py --tokens` on the
written block, and any variant that introduced an off-spec color is flagged *in the overlay
strip* before the user picks. Live mode becomes the drift guard at the moment of choice,
not after the commit.

**Gate:** a variant round-trip (pick → generate 3 → accept) works on a Vite app and a static
HTML file, survives a helper restart mid-event, and leaves no `data-parti-*` residue.

## Stage 1b — Perceptual verification (`squint.py`)

Reuses Stage 1's screenshot pipeline. Screenshot at 3 viewports, then:

- grayscale + downsample + blur → is the region declared as "attention lands here first"
  still the highest-salience region?
- hierarchy survival: do the top 3 elements stay separable in grayscale?
- contrast sampled from rendered pixels, not source — catches what `color.py` cannot see
  (overlays, gradients, images behind text).

This is the one instrument no competitor has, and it turns part of the judged half into the
measured half. Wired in as B4 check #4.

## Stage 2 — Memory and signals

`.parti/` gains `history.jsonl` (every score and critique with a commit sha) and
`findings/` (open items by rule id). Then:

- **No-arg invocation** recommends 2–3 next commands from real signals: last score, open
  P0/P1, git changed files, dev server up, lint hits on the dirty tree. Never auto-runs.
- **Entropy trend**: `audit.py` metrics across commit history → palette sprawl and
  tokenization ratio as a line, not a point. Design debt over time; nobody has this.
- `DESIGN.md` stays the human contract; `.parti/` is the machine's.

## Stage 3 — Build library and system interop

The largest remaining *quality* gap.

- `surfaces/` — per-surface build direction: the decisions that get skipped, what the
  token spec must carry, every state, responsive rule, motion by rule id, failure modes.
  **No markup.** A reference implementation is a default with better manners, and pasting
  one substitutes the template author's decisions for the direction's — the same failure
  this skill exists to prevent, one level deeper. Enforced by `check_surfaces.py`.
- `systems.md`: how to derive parti tokens *into* Material 3, Fluent, Carbon, Polaris,
  Primer, GOV.UK, Radix — mapping, not replacing. Opens the enterprise audience that parti
  currently cannot serve at all.

## Stage 4 — Eval expansion

- Automate the 18-item process rubric as a transcript grader.
- Blind A/B harness: paired artifacts vs impeccable / frontend-design / bare model, blind
  votes, published win rate including losses. First published numbers in this field.
- `parti review` as a GitHub Action on changed files, posting rule-id findings. Regression
  guard only — the anti-circularity doctrine in `evals/README.md` governs.

## Stage 5 — Reach

Asset production path (semantic-vs-raster classification, then generation); screenshot and
Figma frames as first-class brief input; `AGENTS.md` projection for Codex/Cursor/Gemini;
shortcut generation; keyword-rich discovery.

---

## Sequence and gates

| Stage | Gate | Status |
|---|---|---|
| 1 Live | round-trip works on static + framework source, survives restart, no residue | **done** — plus insert mode, knobs, steer/abort, annotations, source guard |
| 1b Squint | catches a seeded hierarchy inversion the source-level lint misses | open |
| 2 Memory | no-arg recommendation cites a real signal, never auto-runs | open |
| 3 Surfaces | every direction ships no markup, all parts present, rule ids resolve | **done** — 3 surfaces, enforced by `check_surfaces.py` |
| 4 Eval | rubric grader agrees with a hand-graded transcript; A/B numbers published | **half** — harness and pairs built, panel not run |
| 5 Reach | skill runs unmodified in one non-Claude harness | open |

Unplanned and shipped: `go-no-go.md` (the ship gate), `foundations.md` (structure,
readability and interaction floors), `use-case.md` (ten archetypes), `elements.md` (the
material system), `convention.md` (unconventional in expression, conventional in
mechanics), `remediation.md` (finding → change), and the `default_violet` detector.

## What this does not become

Not a component marketplace, not a Figma plugin, not a hosted service, not a design-quality
score. The suite is wide across *phases of one job* — evaluate, direct, build, verify,
remember — not wide across products.
