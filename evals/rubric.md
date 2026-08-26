# Process compliance rubric

18 binary items. Read the transcript and mark each Y/N — no partial credit, because partial credit is where objectivity leaks out. **Pass: ≥ 16/18 with all five gates.**

Gates are marked **[G]**. A gate failure means the skill didn't run, regardless of total score.

## Brief and framing

1. Missing brief elements were either asked for in **one** round or explicitly pinned as stated assumptions — not silently guessed.
2. A priority ranking among modern / intuitive / interactive / intentional appears in writing.
3. Constraints were derived (density, register, attention order, frequency, native material) **before** any style name appears in the output.

## DESIGN.md

4. **[G]** `DESIGN.md` was read if present, or created if absent.
5. If the request conflicted with `DESIGN.md`, the conflict was surfaced with options — not silently overridden.
6. `DESIGN.md` was updated on the way out, with a dated changelog line.

## Directions

7. **[G]** Exactly three directions were presented before any recommendation.
8. **[G]** Each pair differs on **at least two** of the six axes (density, structure, type voice, chroma, motion posture, depth). Check this explicitly — three palettes on one layout fails.
9. **[G]** Every direction states what it **gives up**. A direction without a named cost is a compromise, not a choice.
10. Each direction names its nearest movement *and* where it departs from it.
11. Each direction identifies one signature element — and only one.

## Rendering

12. Rendered output uses plausible real copy, not lorem or "Feature One".
13. All three renders show the same screen, same content, same viewport.
14. The signature motion moment is shown or specified, not just described in prose.

## Rigor

15. **[G]** Contrast was verified with `color.py`, with ratios stated — not asserted from intuition.
16. The anti-slop pass ran and the output says **what changed and why**, naming at least one replacement drawn from the subject's own material.
17. On a redesign: findings are separated into usability / system / dated / **taste**, with taste labeled as taste; both surgical and directional scales are offered; a keep list is included.
18. On screenshot-only input: the skill said it could not measure and scored the judged half only.

---

## Scoring the five test briefs

Run each and record the score:

| Brief | Tests |
|---|---|
| Greenfield, thin brief | assumption-pinning (1), divergence (8), cost (9) |
| Redesign of a real codebase | scripts ran, four-bucket diagnosis (17), keep list |
| Narrow command (`typeset` / `motion`) | stays narrow; doesn't balloon into a full `explore` |
| Screenshot only | (18) — no fabricated measurement |
| Request conflicting with `DESIGN.md` | (5) — the single most informative test in the suite |

## Common failure patterns

- **Three palettes, one layout.** The most frequent divergence failure. Item 8 exists to catch it and it needs checking deliberately, not by impression.
- **Cost sentences that aren't costs.** "This direction gives up some visual excitement" is a hedge. "This gives up scannability for anyone under 30 rows of data" is a cost.
- **Silent DESIGN.md override.** Fails item 5 and quietly destroys the file's value.
- **Narrow command scope creep.** A `typeset` request answered with three full directions is a failure even though the output looks impressive.
- **Asserted contrast.** "This passes AA" without a ratio is the measurement costume without the measurement.
