# With the skill vs. without it

Two agents. **The same prompt, verbatim.** The same model. One was required to invoke `parti` and follow it; the other was denied it. Neither was told a comparison was happening.

Everything below is measured output from `scripts/`, reproducible with one command. Where the result is unflattering to the skill, it is reported unflattering.

```bash
python examples/shared/measure.py
```

---

## Headline

| | baseline | parti | delta |
|---|---|---|---|
| Measured score | **59.9** / 100 | **80.6** / 100 | +20.7 |
| Band | Drifting | Coherent | — |
| Tells detected | 1 | 0 | −1 |
| Distinct motion rules violated | 2 | 0 | −2 |
| `lint.py` P0 | 0 | 0 | 0 |
| Token drift | *no spec to check against* | none | — |
| `box-shadow` count | 8 | 0 | −8 |
| Raw hex literals in shipped code | 97 | 0 | −97 |
| Token spec emitted | ✗ | ✓ `tokens.json` | — |
| `DESIGN.md` written | ✗ | ✓ | — |

**Read the caveats before quoting the 59.9 → 80.6.** It is not proof one design is better. See [What these numbers are not](#what-these-numbers-are-not).

---

## The most important finding

**The baseline is good.** I expected it to produce the convergent default the skill exists to prevent — warm cream, serif display, terracotta accent, glass cards on a gradient mesh. It produced none of that.

Unprompted, the baseline agent reasoned its way to: a dark ground because dispatchers sit ten hours in a dimmed ops room; amber/red/green reserved as an *operational vocabulary* so no chrome element could ever be misread as a flight status, pushing the brand accent to cyan; monospace with `tabular-nums` on every operational figure so columns don't jitter on a 10-second refresh; real content throughout (`N612CR`, `HZ2214` diverted to `PSC` on hydraulics, FAR 117 duty clocks); near-zero motion, all of it killed under `prefers-reduced-motion`.

That is thoughtful work. Any showcase claiming otherwise would be selling something.

So the honest question is not *"generic vs. distinctive"* — both arms reached for the real subject. It is **what a strong one-shot build still doesn't produce**, which turns out to be the measurable part.

---

## Where the difference actually is

### 1. Spatial rhythm — 2.6/15 → 11.8/15

The single largest gap, and the least glamorous. `audit.py` could detect **no base unit** in the baseline's spacing: values were chosen per-component, each individually reasonable, collectively arbitrary. The parti arm declared a 4px base with 11 steps in `tokens.json` *before* writing CSS, so the rhythm is a decision rather than a residue.

This is the difference a token spec makes, and it is invisible in a screenshot.

### 2. Color authoring — 97 hex literals → 0

The baseline authored in hex, scattered across five files. The parti arm authored in `oklch()` with hex retained in `tokens.json` for tooling — which is what `references/tokens.md` prescribes, and which makes lightness steps perceptually even rather than nominally even.

### 3. Elevation — 8 shadows → 0

The parti arm banned `box-shadow` outright on a real argument: at the ground luminance the design operates at, a drop shadow is invisible, so elevation is carried by a lightness step instead. The rule then *survived contact with code* — verified 0 occurrences across all four shipped surfaces.

### 4. The one tell

`audit.py` found exactly one in the baseline: **glassmorphic card** (`backdrop-filter` + translucent background), in all four surfaces plus the stylesheet. It is the one place the baseline reached for a current convention rather than the subject. The parti arm: zero.

### 5. Motion

| | baseline | parti |
|---|---|---|
| Distinct rules violated | 2 | 0 |
| Rules | `a11y-ungated-hover`, `perf-layout-property` | — |
| Exit code | 1 | 0 |

The baseline animated a layout property and left a hover effect ungated on touch. Neither is visible in review; both are what `motion.py` exists to find.

### 6. The artifacts that have no baseline equivalent

The parti arm produced a **`tokens.json`** and a **`DESIGN.md`** binding all four surfaces to one system. The baseline produced four good pages and no way to keep a fifth consistent with them. That is the capability that doesn't show up in any single screenshot and is the entire point of the skill on a real project.

---

## What these numbers are not

**They are regression guards, not design-quality verdicts.** The skill's own [`evals/README.md`](../evals/README.md) is explicit about the circularity trap: the detector and the generator share a tell list, so an arm that follows the skill is being graded by the skill's own checklist. Swap a purple-to-blue gradient for purple-to-teal and `distinctiveness` goes to 15/15 while the page stays exactly as generic.

The +20.7 means **the parti arm ships fewer things from a list of known problems.** It does not mean a dispatcher would rather use it. Only a human preferring one artifact over another, without knowing which produced which, measures that — and this repository does not contain that experiment.

### Four specific caveats

1. **The baseline could read the skill's description.** A skill's `description` is injected into every agent's available-skills listing, and `parti`'s contains its thesis verbatim. The baseline was denied the *files*; it could not be denied the *description*. It may have been primed by the very argument it was meant to lack.

2. **Raw motion counts are inflated by inlining.** Every page is self-contained, so the shared stylesheet is duplicated into each — and a single CSS violation is then counted once per page. The baseline's raw `P0: 5` is **2 distinct rule violations** counted across files. The table above reports distinct rules for this reason.

3. **`parti`'s clean motion run is partly an inlining artifact.** Before inlining it carried one P2 (`a11y-reduced-motion-nuked`, which fires when only one file handles reduced motion). Duplicating the stylesheet across pages made more files handle it, and the finding cleared. That is bookkeeping, not a design improvement.

4. **"Token drift: none" is weaker than it looks.** `lint.py`'s drift check only understands hex. The parti arm authored in `oklch()`, so there were no hex literals for the check to examine. It passed by having nothing to scan, not by being audited and cleared.

---

## A bug this comparison found

The parti agent hit `lint.py --tokens` reporting **every** color in the codebase as drift and reported it. On investigation there were **two** defects stacked in `load_tokens()`:

1. `RE_HEX.fullmatch(v.lstrip("#"))` — the pattern requires a leading `#` that `lstrip` had just removed, so the match could never succeed.
2. `norm_hex(v)` was passed the `#`-prefixed value while the scanner passes it bare digits, producing keys like `##faf9f` that could never match anything.

Either one silently empties the allowed set, so every color reads as unspecified. The agent proposed a one-character fix for the first; it would not have worked, because the second was underneath it.

**Why the eval suite missed it:** all three existing drift tests passed the whole time. They asserted that an unspec'd color *is* flagged — which stays true when everything is flagged. What was missing is the **false-positive guard**: *colors that ARE in the spec must not be flagged*. That is exactly the rule [`docs/CONTRIBUTING.md`](../docs/CONTRIBUTING.md) states for every detector, and the drift check was the one place it wasn't applied.

Both defects are fixed, the missing guard is added, and the suite is **51/51**. The guard was verified to fail RED with the bug reintroduced before being accepted.

---

## Layout

Every file is **self-contained** — open any one directly in a browser, no server, no shared stylesheet, no build step.

```
examples/
├─ shared/
│  ├─ PROMPT.md              the identical prompt + the controls
│  ├─ DESIGN.md              parti arm only — the binding design memory
│  ├─ tokens.json            parti arm only — the token spec
│  ├─ baseline.css           readable source of the baseline system
│  ├─ parti.css              readable source of the parti system
│  ├─ measure.py             runs all instruments over both arms
│  ├─ inline.py              makes every page standalone
│  └─ split_components.py    splits states into individual files
├─ 01-landing-page/{baseline,parti}/index.html
├─ 02-pricing-page/{baseline,parti}/pricing.html
├─ 03-dashboard/{baseline,parti}/dashboard.html
├─ 04-components/{baseline,parti}/
│  ├─ components.html        all four states on one page
│  └─ states/                each state, previewable alone
│     ├─ populated.html
│     ├─ empty.html
│     ├─ loading.html
│     └─ error.html
└─ results/                  measured output, regenerated by measure.py
```

**16 previewable artifacts** — 8 pages and 8 component states.

### Also here: a Next.js build of the same direction

[`nextjs/`](nextjs/) rebuilds the parti arm as a real component library — one app,
16 components, each previewable in isolation at `/gallery/[slug]`. Same token spec,
different stack, which is the thing a single-file example cannot show:
`DESIGN.md` holding across a change of framework. See [`nextjs/README.md`](nextjs/README.md).

### Suggested viewing order

| Look at | To see |
|---|---|
| `01-landing-page/` both arms | how each handles a marketing surface with no style brief |
| `04-components/*/states/empty.html` | the clearest single contrast: what an empty state is *for* |
| `03-dashboard/` both arms | density decisions under real data |
| `shared/tokens.json` + `shared/DESIGN.md` | the artifacts with no baseline equivalent |

---

## Reproducing

```bash
python examples/shared/measure.py                  # the table above
python scripts/audit.py examples/03-dashboard/parti # audit one surface
python scripts/color.py check examples/shared/tokens.json
```

The prompt and the controls are in [`shared/PROMPT.md`](shared/PROMPT.md). Re-running with a different subject is the useful experiment — one paired sample is an anecdote, not evidence, and this is one paired sample.
