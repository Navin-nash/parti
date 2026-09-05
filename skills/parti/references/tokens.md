# Token Handoff

The final artifact. A direction that isn't specified this far is admired and then ignored — the token spec is what makes it buildable by someone who wasn't in the conversation.

Write it as a fenced block. If the user wants it shipped, Build mode consumes it directly and verifies the result against these exact values (`references/verify.md`); otherwise hand it to another build skill (`frontend-design`, `impeccable`, `emil-design-eng`) or an engineer. Then write the same constraints into `DESIGN.md` (`references/design-md.md`) — the token spec is the handoff, DESIGN.md is the memory, and only the second one is still there in three weeks.

For the Motion section, specify at the level described in `references/motion.md` §12: posture, the one choreographed moment, what animates with duration and easing, what never animates, the library decision including the option of none, and per-item reduced-motion degradation.

---

## Format

```markdown
# Design Tokens — [Direction name]

## Premise
[One sentence: what this design believes about the user. Every rule below serves it.]

## Color
Base scale (OKLCH; hex in parentheses for tooling that needs it):
- `--bg`            oklch(...) (#......)  page background
- `--surface`       ...                   raised surfaces
- `--surface-alt`   ...                   secondary surfaces / hover
- `--border`        ...                   hairlines and dividers
- `--text`          ...                   primary text        — X.X:1 on --bg
- `--text-muted`    ...                   secondary text      — X.X:1 on --bg
- `--accent`        ...                   the one loud color
- `--accent-fg`     ...                   text on accent      — X.X:1
Semantic: `--success` / `--warning` / `--danger` / `--info` + `-bg` and `-fg` pairs.

Rules: [how the accent is allowed to be used — e.g. "accent appears at most 3× per
screen and never on a surface larger than a button"]

## Typography
- Display: [Family], [weights], [source]. Used for [what only].
- Body:    [Family], [weights], [source].
- Utility: [Family], [weights]. Used for [labels/data/code].

Scale (ratio [X], base [Y]px):
| Token | Size / Line height | Weight | Tracking | Use |
|---|---|---|---|---|
| `--t-display` | .. | .. | .. | .. |
| `--t-h1` … `--t-h3` | .. | .. | .. | .. |
| `--t-body` | .. | .. | .. | .. |
| `--t-small` / `--t-caption` | .. | .. | .. | .. |

Measure: [45–75ch]. Numerals: [tabular where aligned].

## Spacing
Base unit [4 or 8]px. Scale: `--s-1` … `--s-12`.
Section rhythm: [values]. Component padding: [values]. Grid: [columns, gutter, max-width].

## Radius / Elevation
- `--r-sm/md/lg/full`: [values]. Rule: [when each applies; what stays square].
- `--e-0/1/2/3`: [shadow or lightness values]. Rule: [what elevation means here].

## Logo & iconography
- **Marks:** [primary / horizontal / stacked / submark] — when each is used. Submark for favicon/app-icon and anywhere under ~24px; horizontal where vertical space is tight (headers); primary everywhere else.
- **Clear space:** [proportional to a feature of the mark itself, e.g. "the cap-height of the wordmark," not a fixed px value] on all sides, minimum.
- **Minimum size:** [N]px digital, [N]mm print.
- **Icon library:** [Lucide / Phosphor / Tabler / custom] — see `references/stacks.md` §4 for the decision table. One library for the whole build; the `signature` element stays custom regardless.

## Motion
- Durations: `--d-instant` 100ms, `--d-fast` 150ms, `--d-base` 200ms, `--d-slow` 300ms
- Easing: `--ease-out` cubic-bezier(0.16, 1, 0.3, 1) — entrances
          `--ease-in-out` cubic-bezier(0.65, 0, 0.35, 1) — movement
          `--ease-spring` [if used] — [where]
- What animates: [specific list]. What never animates: [specific list].
- `prefers-reduced-motion`: [what degrades to what].

## Discipline
Three to five rules that define this direction. These are what a builder violates first.
1. …
2. …

## Anti-rules
Explicitly banned for this direction, with reasons.
- …
```

---

## Worked example

```markdown
# Design Tokens — Ledger

## Premise
Grant deadlines are the user's real adversary; the interface is a working document
that never hides the state of the paperwork.

## Color
- `--bg`          oklch(98.5% 0.004 95)  (#FAF9F6)  paper
- `--surface`     oklch(100% 0 0)        (#FFFFFF)  cards, sheets
- `--surface-alt` oklch(96% 0.005 95)    (#F3F1EC)  hover, table stripe
- `--border`      oklch(88% 0.006 95)    (#DEDAD1)  hairlines
- `--text`        oklch(22% 0.012 60)    (#2B2620)  primary — 13.9:1
- `--text-muted`  oklch(48% 0.010 60)    (#6E675E)  secondary — 5.2:1
- `--accent`      oklch(48% 0.17 25)     (#B23A2E)  redline
- `--accent-fg`   oklch(99% 0 0)         (#FFFFFF)  — 6.1:1
Semantic: success oklch(52% 0.11 150); warning oklch(70% 0.14 75);
danger = accent; info oklch(50% 0.09 250).

Rules: accent is the redline — it marks only what needs the user's action. Never
decorative, never a background fill larger than a badge, at most 3× per screen.

## Typography
- Display: Instrument Serif, 400. Google Fonts. Section titles and page headers only.
- Body:    Söhne / Inter fallback, 400 / 500. Interface and running text.
- Utility: JetBrains Mono, 400 / 500. Deadlines, amounts, IDs, status codes.

Scale (ratio 1.25, base 15px):
| Token | Size / LH | Weight | Tracking | Use |
|---|---|---|---|---|
| `--t-display` | 44/48 | 400 | -0.02em | page title |
| `--t-h1` | 29/36 | 400 | -0.01em | section |
| `--t-h2` | 23/30 | 500 | 0 | subsection |
| `--t-body` | 15/24 | 400 | 0 | interface, prose |
| `--t-small` | 13/20 | 400 | 0 | secondary |
| `--t-caption` | 11/16 | 500 | 0.06em uppercase | eyebrow labels |

Measure 68ch for prose. Tabular figures in every table and every deadline.

## Spacing
Base 4px. `--s-1` 4 · `--s-2` 8 · `--s-3` 12 · `--s-4` 16 · `--s-6` 24 · `--s-8` 32
· `--s-12` 48 · `--s-16` 64 · `--s-24` 96.
Section rhythm 96px desktop / 56px mobile. Card padding 24px. Table row 40px.
Grid 12 col, 24px gutter, 1180px max.

## Radius / Elevation
- `--r-sm` 3px (inputs, badges) · `--r-md` 5px (cards, buttons) · `--r-full` (avatars only).
  Tables, dividers, and document previews stay square — they're paper.
- `--e-0` none (default; borders do the work)
- `--e-1` 0 1px 2px oklch(22% 0.012 60 / 0.06) — cards
- `--e-2` 0 8px 24px oklch(22% 0.012 60 / 0.10) — popovers, sheets
  Elevation means "temporary." Anything permanent sits flat with a border.

## Logo & iconography
- **Marks:** wordmark primary; submark (the redline glyph alone) for favicon and the mobile header only.
- **Clear space:** one wordmark cap-height on all sides, minimum.
- **Minimum size:** 96px digital, 15mm print.
- **Icon library:** Tabler — the document-status vocabulary (stamped, filed, overdue) needed coverage Lucide didn't have.

## Motion
- `--d-instant` 100ms · `--d-fast` 150ms · `--d-base` 200ms · `--d-slow` 280ms
- `--ease-out` cubic-bezier(0.16, 1, 0.3, 1) — entrances, popovers, toasts
- `--ease-in-out` cubic-bezier(0.65, 0, 0.35, 1) — sheets, layout shifts
- Animates: popover/sheet entry (scale from origin + opacity, 150ms), status changes
  (200ms color), deadline countdown (opacity pulse at <48h), row hover (100ms).
- Never animates: table rendering, page transitions, numbers on load, section entry.
- Reduced motion: all transforms → opacity-only at 100ms; countdown pulse off.

## Discipline
1. Borders before shadows. Elevation is reserved for things that will disappear.
2. Every deadline is monospace and right-aligned so columns of dates scan vertically.
3. One accent use per screen region; if two things are red, one of them isn't urgent.
4. Serif appears only at h1 and above — it's the letterhead, not the body.
5. No empty state without a next action and a plain-language explanation.

## Anti-rules
- No gradients. Paper doesn't gradient, and the accent must stay unmistakable.
- No icon-only buttons in the document workspace — every action carries its verb.
- No skeleton loaders under 300ms; the flash reads slower than the wait.
- No card nested inside another card. Use a divider and a caption label.
```

---

## Notes

- **Contrast ratios are part of the spec.** State them next to the color. If a builder can't see the number, they'll assume it passes.
- **Color in OKLCH.** Perceptually uniform lightness means a scale generated by stepping `L` actually looks evenly stepped, which HSL does not. Provide hex alongside for tooling.
- **This spec is already semantic tokens, not primitives — keep it that way.** `--bg`/`--accent`/`--text` name a *role*, not a raw value; that's the layer a builder should ever reference. If the direction needs a second theme (dark mode, a white-label variant), add a primitive scale underneath (`--color-red-600: #B23A2E`) and have the semantic tokens point at primitives per-theme — the component code never changes, only which primitive a semantic name resolves to. This two-layer model is now a published standard (W3C Design Tokens Community Group, stable spec 2025.10), not just this skill's convention — naming it this way keeps the spec portable to other tools that read it.
- **The discipline and anti-rules sections do more work than the values.** Anyone can copy hex codes; the rules are what prevent the direction dissolving in week three.
- **Name the direction.** A named direction gets referred to and defended in review; "option 2" gets overridden.
- **Verify the palette before shipping it.** `python scripts/color.py check palette.json` prints every pair with AA verdicts; `color.py fix` finds the minimal lightness change that clears a threshold while preserving hue and chroma; `color.py ramp` builds a gamut-fitted OKLCH scale that doesn't drift in hue at the ends.
- If the user has an existing design system, express the direction as a **diff against it** — changed tokens, added tokens, deprecated tokens — rather than a fresh spec they'd have to reconcile.
