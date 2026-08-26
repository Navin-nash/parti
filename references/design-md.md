# DESIGN.md

`DESIGN.md` is the project's design memory. It is the difference between a direction that survives three weeks and one that dissolves the first time someone adds a component in a hurry.

Every invocation of this skill starts by reading it and ends by updating it.

---

## The protocol

### On every invocation

1. **Look for it.** Check `DESIGN.md`, `docs/DESIGN.md`, `.design/DESIGN.md`, `design/DESIGN.md`, and any path the user names. Look for `PRODUCT.md` too — if `impeccable` has been used here, it wrote one, and its audience/voice content is useful input.
2. **If it exists, read it fully and treat it as binding.** It outranks your taste. It does not outrank the user's current instruction.
3. **If a request conflicts with it, surface the conflict before acting:**
   > DESIGN.md pins body type to Söhne at 15/24 and bans gradients. You're asking for a gradient hero. Three options: (a) treat this as an exception and note it, (b) amend DESIGN.md because the constraint has stopped serving you, (c) find a non-gradient way to get the same effect. Which?

   Silently overriding it is the worst outcome — the file stops being trustworthy and everyone ignores it within a month.
4. **If it doesn't exist, create one.** Two paths:
   - **Existing codebase** → run `scripts/audit.py`, and write DESIGN.md from what's actually there. Document the de-facto system honestly, including the parts that are a mess. Mark inferred values `[inferred]` and contested ones `[unresolved]`. A DESIGN.md that pretends the codebase is more systematic than it is will be quietly abandoned.
   - **Greenfield** → write it from the direction the user picked, after the token handoff.
5. **On the way out, sync it.** Any change to color, type, spacing, radius, elevation, motion, or a rule gets written back, with a dated line in the Changelog. Tell the user in one line what changed.

### What it is and isn't

**Is:** the binding constraints. Values, rules, bans, and the reasons for them.
**Isn't:** a style guide, a component library doc, a brand book, or a place for aspirational prose. Anything that isn't enforceable on a pull request doesn't belong.

Keep it under ~200 lines. When it grows past that, split the component inventory into a separate file and keep DESIGN.md as the constitution.

### Relationship to the wider DESIGN.md convention

`DESIGN.md` as a filename is now a semi-standard beyond this skill — Google's `design.md` format spec (YAML frontmatter tokens + ordered markdown sections: Overview, Colors, Typography, Layout, Elevation & Depth, Shapes, Components, Do's and Don'ts) and a public library of 70+ real examples modeled on Stripe, Linear, Vercel, and others exist and are worth skimming for calibration on a greenfield brief. This skill's template below is deliberately not identical to that spec — it adds Audience & posture, Motion, Discipline, and an Accessibility floor as first-class sections, and it deliberately omits a Components inventory (see "What it is and isn't" above) — but if a project already has a `DESIGN.md` written to the other convention, read it as the "de-facto system" input the same way an audited codebase would be, rather than treating the format mismatch as a blocker.

### Why the reasons matter more than the values

Anyone can copy hex codes. The `Why` column is what stops a future contributor — human or agent — from "improving" a constraint they don't understand. `--r-none for tables` is a rule someone will break; `tables stay square because the direction treats documents as paper` is one they'll defend.

---

## Template

```markdown
# DESIGN.md

> Binding design constraints for [project]. Read before changing anything visual.
> Conflicts with a request must be surfaced, not silently resolved.
> Last updated: YYYY-MM-DD · Direction: [name] · Measured score: [n]/100

## Premise
[One or two sentences: what this design believes about its user, and the one job
the interface does. Every rule below serves this.]

## Audience & posture
- **Users:** [who, and what software they already use daily]
- **Frequency:** [daily tool / occasional / one-shot] → [what that licenses]
- **Priority order:** [e.g. intuitive > intentional > modern > interactive]
- **Anti-references:** [products this must NOT resemble, and why]

## Color
| Token | Value (OKLCH / hex) | Role | Contrast |
|---|---|---|---|
| `--bg` | | | — |
| `--surface` | | | |
| `--border` | | | |
| `--text` | | | X.X:1 on --bg |
| `--text-muted` | | | X.X:1 on --bg |
| `--accent` | | | |
Semantic: success / warning / danger / info + `-bg` / `-fg` pairs.
**Rules:** [how the accent may be used; what it may never be used for]

## Typography
| Role | Family | Weights | Source | Used for |
|---|---|---|---|---|
| Display | | | | |
| Body | | | | |
| Utility | | | | |

Scale — ratio [X], base [Y]px:
| Token | Size/LH | Weight | Tracking | Use |
|---|---|---|---|---|

**Rules:** [measure, numerals, casing, where display is and isn't allowed]

## Space
Base unit [N]px. Scale: [values].
Section rhythm [desktop / mobile]. Container [max-width, columns, gutter].
**Rules:** [what may deviate, if anything]

## Shape & elevation
Radii: [tokens + values]. **What stays square, and why:** [ ]
Elevation: [tokens]. **What elevation means here:** [ ]
Z-index layers: [named scale, not arbitrary numbers]

## Logo & iconography
Marks: [primary/horizontal/stacked/submark, when each applies]. Clear space: [proportional rule]. Min size: [px digital / mm print]. Icon library: [name] — no mixing.

## Motion
- **Posture:** [still / responsive-only / choreographed / ambient]
- **Library:** [name + why, or "none — CSS only"]
- Durations: [tokens]  Easing: [named curves]
- **Animates:** [explicit list with duration + easing]
- **Never animates:** [explicit list]
- **Reduced motion:** [per-item degradation]

## Discipline
Three to five rules that define this direction — the ones a builder violates first.
1.
2.

## Anti-rules
Explicitly banned, with reasons. This section prevents more damage than any other.
- **No [thing]** — [why]

## Accessibility floor
Contrast AA (4.5 body / 3.0 large + UI) · visible focus · 44px touch targets ·
keyboard-complete · reduced-motion honored · hierarchy survives grayscale.
[Any project-specific commitment, e.g. WCAG AAA on X, RTL support, 200% zoom.]

## Open questions
- [ ] [unresolved decisions, with who decides and by when]

## Changelog
- YYYY-MM-DD — [what changed, and why]
```

---

## Writing DESIGN.md from an existing codebase

After running `scripts/audit.py` and `scripts/score.py`:

- **Report the de-facto system, not the intended one.** If there are six typefaces, write six and flag it. The file's credibility comes from being accurate on day one.
- **Consolidate where the intent is obvious.** Four radii of 9, 12, 14, and 16px are one radius token with drift; record `--r-md: 12px [consolidated from 9/12/14/16]` and list the outliers under Open questions.
- **Mark provenance.** `[inferred]` for values derived from usage frequency, `[declared]` for values found in a config or token file, `[unresolved]` where the codebase contradicts itself.
- **Anti-rules come from the tell list.** Every tell `audit.py` found becomes either a documented deliberate choice or an entry under Anti-rules.
- **Record the measured score and date** in the header. It makes the next audit a comparison instead of a fresh opinion.
- **Don't invent a premise.** If the codebase has no discernible thesis, say so: `## Premise — [unresolved] No coherent premise is discernible from the current implementation. Proposed: ...` and let the user confirm.

## Writing DESIGN.md for a greenfield project

Write it from the token handoff of the chosen direction, plus the brief's audience and priority order. Fill Open questions with what the brief left undecided rather than guessing and recording the guess as fact.
