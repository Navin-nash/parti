# Script reference

Five stdlib-only Python scripts. They exist because measured findings survive disagreement and impressions don't — "the spacing feels inconsistent" loses an argument that `1 off-grid values: [17.0]` wins.

All output shown below is **real output** from the fixtures in `evals/`, not illustrative.

| Script | Reads | Emits | Exit code |
|---|---|---|---|
| [`audit.py`](../scripts/audit.py) | a codebase | de-facto design system + tell list | always `0` |
| [`score.py`](../scripts/score.py) | `audit.py` JSON | measured score, 6 dimensions | always `0` |
| [`color.py`](../scripts/color.py) | hex values / palette JSON | contrast, ramps, fixes | always `0` |
| [`lint.py`](../scripts/lint.py) | code you just built | build-time tells + token drift | `1` if any P0 |
| [`motion.py`](../scripts/motion.py) | code | motion rule violations | `1` if any P0 |

**Only `lint.py` and `motion.py` gate.** The other three always exit `0` — they are instruments, not judges, and a CI job that fails on a low score is a CI job that will be disabled within a month. See [CI integration](#ci-integration).

Requires Python 3.8+. No dependencies, no `requirements.txt`, no lockfile.

---

## audit.py

Extracts the design system a codebase *actually* has, as opposed to the one its README claims.

```
usage: audit.py [-h] [--json OUT] [--quiet] path
```

| Flag | Effect |
|---|---|
| `--json OUT` | write the full result as JSON to `OUT` |
| `--quiet` | suppress the human-readable report (use with `--json`) |

### What it measures

| Section | Contents |
|---|---|
| `COLOR` | unique colors, how many are chromatic, OKLCH/HSL usage, sampled contrast pairs below 4.5:1 |
| `TYPE` | font families, distinct sizes, derived step ratios |
| `SPACE` | distinct spacing values, inferred base unit, off-grid values |
| `SHAPE` | radius / shadow / z-index variance |
| `MOTION` | animation libraries, distinct durations, custom easing vs. browser defaults, reduced-motion handling |
| `SYSTEM` | custom properties defined vs. actually referenced, arbitrary Tailwind values, `!important` count |
| `A11Y` | `outline: none` sites, `backdrop-filter` sites |
| `TELLS` | the anti-slop tells visible in source, each with the files it appears in |

### Real output

```
$ python scripts/audit.py ./slop

Scanned 8 files under ...\slop

COLOR    7 unique · 4 chromatic · oklch:0 hsl:0
         #f4f1ea  ×2
         #d97757  ×1
         ...
         ⚠ 7 sampled pairs below 4.5:1 (worst #d97757 on #f4f1ea = 2.77:1)
TYPE     1 families: Inter
         0 distinct sizes: []
SPACE    1 values · base unit none detected · 1 off-grid
SHAPE    11 radii · 1 shadows · 0 z-index values (max None)
MOTION   libs: motion · 2 durations · custom easing 0 vs default 3
         reduced-motion handled: False
SYSTEM   2 vars defined / 0 used · 0 arbitrary TW values · 0 !important
A11Y     outline:none ×1 · backdrop-filter ×1

TELLS    11 detected
         • AI-cream palette (#F4F1EA-family bg + terracotta accent)  →  src\app.css
         • Purple-to-blue gradient  →  src\app.css, src\Hero.tsx, src\Sec1.jsx
         • Glassmorphic card (backdrop-blur + translucent bg)  →  src\app.css
         • Rounded-square gradient icon tile above headings  →  src\Hero.tsx
         • Cards nested inside cards  →  src\Hero.tsx
         ...
```

### JSON shape

```
{ "root", "files_scanned", "color", "type", "space", "shape",
  "motion", "system", "a11y", "libraries", "tells" }
```

`tells` is the array `score.py` reads for its distinctiveness dimension.

---

## score.py

Turns an `audit.py` JSON into a number — **the measured half only.**

```
usage: score.py [-h] [--json OUT] audit_json
```

### The six measured dimensions

| Dimension | Max | Driven by |
|---|---|---|
| `color_discipline` | 20 | unique count, chromatic ratio, contrast failures, OKLCH availability |
| `type_system` | 20 | family count, explicit sizes, derivable step ratios |
| `spatial_rhythm` | 15 | base unit detection, scale tightness, off-grid values |
| `tokenization` | 15 | custom properties defined *and referenced*, radius/shadow variance |
| `motion_craft` | 15 | custom curves vs. defaults, duration scale, over-budget durations, reduced motion |
| `distinctiveness` | 15 | tell count from `audit.py` — reaches 0 at 5 tells |

Total: 100.

### Bands

| Score | Band | Recommendation |
|---|---|---|
| 85+ | Systematic | A real design system. Refine, don't rebuild. |
| 70–84 | Coherent | Sound underneath; the gaps are specific and cheap to close. |
| 55–69 | Drifting | A system existed once. Enforcement lapsed. Surgical pass warranted. |
| 40–54 | Ad hoc | Decisions are being made per-component. Consolidate before adding surface. |
| < 40 | Unsystematic | No shared vocabulary. A directional pass is the honest recommendation. |

### Real output

```
$ python scripts/score.py audit.json

MEASURED SCORE  51.5 / 100   (Ad hoc)
                Decisions are being made per-component. Consolidate before adding surface.

Color Discipline    13.5/20  ██████████████······
    7 unique colors — within a systematic range
    4 chromatic of 7 (57%) — accents should be a minority
    ⚠ 7/10 sampled pairs below 4.5:1 (worst: #d97757 on #f4f1ea = 2.77:1)
    no OKLCH — perceptual lightness stepping unavailable

Spatial Rhythm       9.8/15  █████████████·······
    no base unit detected — spacing is arbitrary
    1 off-grid values: [17.0]

Motion Craft         5.6/15  ███████·············
    easing: 0 custom curves vs 3 CSS defaults — mostly browser defaults; the feel is unauthored
    ⚠ 1 durations over 400ms: [500] — UI transitions past ~300ms read as sluggish
    ⚠ prefers-reduced-motion NOT handled — accessibility failure, not a nicety
```

### What it deliberately refuses to score

The JSON carries a `judged_dimensions_not_scored_here` field, populated with:

> hierarchy — does attention land in the intended order · signature — is there one memorable element · content fit — does density match what the content demands · copy — does the writing carry its weight · state coverage — empty, loading, error, overflow · concept — is there a thesis, or only defaults

These are judged in prose with written evidence and **reported separately**. Averaging a measured 4.54:1 contrast ratio with a subjective 7/10 for "hierarchy" produces one meaningless 8.2. Never do it.

---

## color.py

Contrast is arithmetic with published reference values. A direction that fails it is wrong regardless of how it looks.

```
usage: color.py [-h] {contrast,check,ramp,convert,fix} ...
```

OKLCH throughout, because its lightness axis is perceptually uniform — a ramp built by stepping L actually looks evenly stepped, which is not true of HSL.

### `contrast` — one pair

```
$ python scripts/color.py contrast "#2B2620" "#FAF9F6"

#2B2620 on #FAF9F6   14.24:1   AA body ✓  AA large ✓  AAA ✓  UI/non-text ✓
  #2B2620 = oklch(27.2% 0.013 72.3)
  #FAF9F6 = oklch(98.2% 0.004 91.4)
```

### `check` — a whole palette

Input is a flat JSON object of role → hex:

```json
{ "bg": "#FAF9F6", "text": "#2B2620", "muted": "#8A8F98", "accent": "#B23A2E" }
```

```
$ python scripts/color.py check palette.json

foreground        background           ratio   verdict
--------------------------------------------------------------------------
text #2B2620      bg #FAF9F6          14.24:1   AA body ✓  AA large ✓  AAA ✓
muted #8A8F98     bg #FAF9F6           3.09:1   AA body ✗  AA large ✓  AAA ✗   ← below body floor
accent #B23A2E    bg #FAF9F6           5.64:1   AA body ✓  AA large ✓  AAA ✗
--------------------------------------------------------------------------
1 pair(s) below 4.5:1. Not every pair must pass — only the ones that actually
co-occur as text. Confirm which do.
```

That last line is the point: the script reports, you decide which pairs are real.

### `fix` — minimal correction, hue preserved

```
$ python scripts/color.py fix "#8A8F98" --on "#F7F7F8"

original  #8A8F98 on #F7F7F8 = 3.03:1   AA body ✗  AA large ✓  AAA ✗
adjusted  #6D717A on #F7F7F8 = 4.57:1   (L 64.9% → 54.9%, hue and chroma preserved)
          oklch(54.8% 0.015 266.6)
```

`--target` sets the ratio to reach (default 4.5).

### `ramp` — gamut-fit OKLCH scale

```
$ python scripts/color.py ramp "#B23A2E" --steps 5

base #B23A2E = oklch(52.1% 0.158 29.2)

step    hex       oklch                         on white  on black
--------------------------------------------------------------------
100     #FFF2EF   oklch(97.1% 0.015 33.1)          1.09     19.20
200     #FF8F7F   oklch(76.7% 0.138 29.2)          2.21      9.49
300     #C1483B   oklch(56.4% 0.158 29.1)          4.93      4.26
400     #790101   oklch(36.2% 0.148 29.1)         11.55      1.82
500     #230000   oklch(16.1% 0.066 29.2)         19.60      1.07
```

The `on white` / `on black` columns tell you which steps are usable as text before you ship them.

### `convert`

Hex → OKLCH, for putting a value into a token file in the space you're reasoning in.

---

## lint.py

The build-stage counterpart to `audit.py`. It catches what `audit.py` structurally cannot: tells that only exist **once there is code**, plus drift from the spec the build was handed.

```
usage: lint.py [-h] [--tokens TOKENS] [--json OUT] [--quiet] path
```

| Flag | Effect |
|---|---|
| `--tokens TOKENS` | a `tokens.json` to check color drift against |
| `--json OUT` | write findings as JSON |
| `--quiet` | suppress the report |

**Token drift is the reason this script exists.** Without `--tokens` it checks tells only and makes no drift claim — it will not pretend to have verified something it wasn't given the input for.

### Severities

| | Meaning |
|---|---|
| `P0` | exits `1`. A11y failure or an unambiguous tell. |
| `P1` | reported, does not gate. |
| `P2` | reported, does not gate. |

### Real output shape

```
$ python scripts/lint.py ./slop --json out.json
$ echo $?
1
```

```json
{
  "counts": { "P0": 9, "P1": 2, "P2": 1 },
  "pass": false,
  "findings": [
    {
      "id": "focus_killed",
      "severity": "P0",
      "label": "Focus outline removed with no replacement ring",
      "file": "src\\app.css"
    }
  ]
}
```

On the clean fixture: `rc=0`, `findings: []`. The false-positive guard in the eval suite exists specifically to keep it that way — a linter that cries wolf gets muted, and a muted linter catches nothing.

Full catalog of what it looks for: [`references/bans.md`](../references/bans.md).

---

## motion.py

Checks the machine-checkable half of [`references/motion-rules.md`](../references/motion-rules.md). Every finding carries the rule id, so a review can cite `physics-origin-center` rather than "the dropdown animation feels wrong."

```
usage: motion.py [-h] [--json OUT] [--census] [--quiet] path
```

### Rules it checks

`ease-in` on UI transitions · `transition: all` · `scale(0)` entrances · durations over budget · animated layout properties · trigger-anchored surfaces scaling from center · keyframes on rapidly-triggered components · missing `prefers-reduced-motion` · ungated hover · easing and duration sprawl.

### Real finding

```json
{
  "rule": "physics-origin-center",
  "severity": "P1",
  "scope": "line",
  "file": "components/dropdown.css",
  "line": 3,
  "message": "trigger-anchored surface scaling from center; use var(--transform-origin) so it looks like it came out of its trigger (modals are exempt)",
  "code": "transform-origin: center;"
}
```

`file` + `line` + `code` means a finding can be acted on without re-deriving where it came from.

### `--census` — inventory without judgment

```
$ python scripts/motion.py ./good --census

Scanned 3 files under ...\motion_good

CENSUS
  distinct durations : 3  [150, 160, 200]
  distinct curves    : 2
  reduced-motion     : 2 site(s)
  hover gated        : yes
```

Use this to see the motion vocabulary of a codebase before deciding whether it has one.

### What it cannot see

`motion.py` cannot tell whether an animation has a **purpose**, or how often its surface is actually used — which is the half of a motion review that decides most findings. A clean run means nothing on the known list is wrong. It does not mean the motion is good.

---

## CI integration

Two scripts gate. Wire those two:

```yaml
- name: Design lint
  run: |
    python scripts/lint.py ./src --tokens ./tokens.json
    python scripts/motion.py ./src
```

Both exit `1` on any P0, `0` otherwise. No install step — stdlib only.

Run the other three for reporting, not gating:

```yaml
- name: Design report (informational)
  run: |
    python scripts/audit.py ./src --json audit.json --quiet
    python scripts/score.py audit.json
```

### Do not gate on the score

`score.py` is a valid **trend line** and an invalid **gate**. The detector and the generator share a tell list, so optimizing against it produces code that *evades the detector* rather than code that is good — swap the purple-to-blue gradient for purple-to-teal and distinctiveness goes to 15/15 while the page stays exactly as generic.

Goodhart's law applies here with unusual force because the metric is so cheap to satisfy. Track the score across commits if you like. Never let it block one, and never report a rise in it as evidence the design improved.

See [`evals/README.md`](../evals/README.md) for the full argument and the four-layer testing model.
