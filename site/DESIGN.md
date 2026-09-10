# DESIGN.md

> Binding design constraints for the Parti site. Read before changing anything visual.
> Conflicts with a request must be surfaced, not silently resolved.
> Last updated: 2026-09-10 · Direction: Specimen · Measured score: 77.4/100 (site chrome, `scripts/score.py`)
>
> The measured score covers `src/app`, `src/components` and `src/lib`. Scored across the whole
> of `src/` it reads 71.6 — the difference is `src/arms/`, which is exhibit material, not chrome.

## Premise

A showcase for a design skill is judged by whether it survives its own critique. This one presents
every claim as a labelled specimen on a bench: two arms, same brief, measured, annotated. The
comparison **is** the visual identity, so the chrome must never compete with what it is displaying.

## Brief

- **Register:** brand — the site is the product here, and its craft is the argument.
- **Scene:** a lab bench under even overhead light; two samples side by side, labelled, with the
  measurement written on the card. Neutral light ground, because a specimen is not lit dramatically.
- **Strategy:** restrained — one chromatic mark against a full achromatic field.
- **Users:** developers and designers who already live in Linear, Vercel, GitHub and shadcn docs.
  That is their baseline for "normal", and it is a high one.
- **Frequency:** one-shot to occasional → it earns explanation and a signature moment; it does not
  earn density or shortcuts.
- **Priority order:** intentional > intuitive > modern > interactive.
- **Anti-references:** the gradient-mesh AI-tool landing page; the glass-card bento grid. The site
  argues against those, so resembling one would refute it.
- **Second-order lane rejected:** warm-cream editorial with a serif display. That is the reflex
  counter-move to SaaS-dashboard, and it is exactly what `references/register.md` calls second-order
  slop.

## Color

Authored in OKLCH (`design/palette.py`, round-tripped through `scripts/color.py`). Hex below is the
exact sRGB round-trip, for tooling only. Every ratio was measured, not asserted.

| Token | Light | Dark | Role | Contrast on `paper` (light / dark) |
|---|---|---|---|---|
| `paper` | `#F1F2F4` | `#0B0D0F` | page ground | — |
| `plate` | `#FCFDFD` | `#131518` | the specimen pane | — |
| `plate-2` | `#E8EAEC` | `#070809` | recessed pane, code, wells | — |
| `rule` | `#D7D9DC` | `#272A2E` | hairline division | — |
| `rule-strong` | `#878A8E` | `#606469` | emphatic rule, non-text | 3.10:1 / 3.27:1 (UI floor) |
| `ink` | `#111315` | `#EBEDEF` | primary text | 16.62:1 / 16.59:1 |
| `ink-muted` | `#565A5E` | `#A1A5A9` | secondary text | 6.21:1 / 7.85:1 |
| `ink-dim` | `#65696D` | `#7E8287` | labels, measurements | 4.94:1 / 5.03:1 |
| `mark` | `#B82F2B` | `#F17262` | the one accent | 5.39:1 / 6.79:1 |
| `mark-tint` | `#FAEAE8` | `#361C18` | mark ground | — |
| `on-mark` | `#FCFCFC` | `#100C0C` | text on mark | — |

Every in-theme text pair clears AA body. `rule-strong` sits below 4.5:1 by design and is never used
for text — it is a rule, and 3.0:1 is its floor.

**Rules:** `mark` identifies the parti arm and nothing else. It never carries a whole surface, never
appears twice on one screen without a reason written down, and is never used to mean "primary
button" generically.

## Typography

| Role | Family | Source | Used for |
|---|---|---|---|
| Display | Instrument Serif | Google Fonts | the argument — thesis lines and plate titles only |
| Body | Geist | Google Fonts | the interface — navigation, prose, controls |
| Utility | Geist Mono | Google Fonts | the evidence — labels, plate numbers, measurements, code |

Three kinds of content live here — an argument, an interface, and evidence — so there are three
faces and each owns exactly one. A reader can tell what kind of thing they are looking at without
reading it.

Scale — ratio 1.2 for UI, with a deliberate break to editorial sizes for display:

`mono-xs` 0.6875 · `xs` 0.75 · `sm` 0.8125 · `base` 0.9375 · `md` 1.0625 · `lg` 1.3125 ·
`xl` 1.75 · `2xl` 2.375 · `3xl` 3.25 (rem)

**Rules:** display is never used for UI chrome or for more than one line at a time. Measurements and
token names are always mono, so evidence stays visually distinct from claims about it.

## Space

Base unit 4px. Scale: 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 80 · 96 · 128.

**Rules:** off-grid values need a reason in the diff. Optical alignment of a rule or a baseline is a
reason; "it looked better" is not.

## Shape and elevation

Radius `2px`, everywhere. A specimen card and a lab plate have square corners; 2px is a printing
tolerance, not a style. It also makes the build visibly not-shadcn-default, which for this subject
is load-bearing.

Elevation: **no shadows**. Depth is a hairline rule plus one lightness step. A drop shadow on one
pane of a two-pane comparison adds visual weight to that pane, and the instrument must not put its
thumb on the scale.

## Motion

- **Posture:** responsive-only.
- **Library:** none — CSS transitions only.
- Durations: fast `120ms` · base `180ms` · slow `260ms`. Easing: `cubic-bezier(0.32, 0.72, 0, 1)`.
- **The one moment:** the comparison slider. It tracks the pointer 1:1 with no easing, because a
  lagging divider makes the two arms look misaligned when they are not.
- **Never animates:** page entry, section reveal on scroll, anything that repeats on every scroll.
- **Reduced motion:** transitions collapse to `0ms`; the slider keeps tracking, since it is a
  direct-manipulation response rather than an animation.

## Discipline

1. **The chrome never out-designs the specimen.** If a site component is more interesting than what
   it frames, it is wrong.
2. **Evidence is set in mono and quoted verbatim.** Numbers on this site come from the scripts,
   never from an author's memory.
3. **One mark per screen.** See the Color rules.
4. **Square corners, no shadows.** These two carry the whole material language; a single rounded
   card breaks it.

## Anti-rules

- **No shadow utilities.** Depth is rule plus lightness. `shadow-*` is banned outright.
- **No indigo or violet as a site colour.** It appears only inside `slop-wall.tsx` and
  `convergence-grid.tsx`, where the generated-design default palette is the exhibit. Those two files
  are excluded from the token-drift gate for that reason, and for no other.
- **No fade-up on scroll.** The site argues against it by name.
- **No lorem, no "Feature One".** Placeholder copy hides the hierarchy problems this site exists to
  show. Where those strings appear in `src/data/*.ts` they are prose *about* the tell, which is why
  that directory is excluded from the content rules rather than rewritten.

## Accessibility floor

Contrast AA (4.5 body, 3.0 large and UI) · visible focus on every interactive element · 44px touch
targets · keyboard-complete · reduced-motion honored · hierarchy survives grayscale.

## Open questions

- [ ] `rounded-2xl` appears in 18 components against a `2px` radius rule. Either the rule has a
      documented exception for one class of container, or these are drift. Currently unresolved.
- [ ] 15 `!important` declarations and a very high arbitrary-value count (`audit.py`) say the system
      is being escaped in places. Locate them and either tokenize or justify.

## Changelog

- 2026-09-10 — Forked seven vendored primitives off `transition-all` onto an explicit
  `color, background-color, border-color, box-shadow, transform` list. Those five are the properties
  actually in play; `transition-all` additionally swept in layout properties nobody chose. Clears
  the last `motion.py` P0.
- 2026-09-10 — First written. The site had a complete `tokens.json` and no DESIGN.md, so this
  records the de-facto system: values from `tokens.json`, contrast measured with `scripts/color.py`,
  score from `scripts/score.py`, open questions from `scripts/lint.py`. Nothing here is
  aspirational; the three unresolved items above are real and stay visible until decided.
