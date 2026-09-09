# Composition

Spatial craft. Loaded by `explore` (render), `critique`, `density`, `compose`, and `polish`. Hierarchy that only exists in the writeup has not been designed.

## Required checks (not slogans)

Run these on every render and every critique, and **say that you ran them**:

1. **Squint** — blur it. Reading order must still be obvious from mass and position.
2. **Grayscale** — if order collapses, hierarchy was carried only by color. Fix weight, size, or position; don't add a louder accent.
3. **One exceptional thing** — Von Restorff. Two exceptional things cancel. The signature from the direction is that one thing; everything else is quieter.

## Tension over default symmetry

Centered hero + three equal columns is not a composition; it's the absence of one. Tension is a decision: offset mass, overlap, a leftover column of air, a crop that isn't polite. Product register still uses tension — a dense table against a sparse inspector — it just doesn't use marketing asymmetry for its own sake.

**Proximity before boxes.** If two things are related, move them closer. A card around a group is the last grouping tool, not the first. Nested cards are always a composition failure.

## Optical, not mathematical

- Align to a shared baseline or a shared edge, then nudge by eye (1–2px) so it *looks* aligned. Icon + label optical-center, not bounding-box center.
- Display type: tracking tighter as size grows. Floor −0.04em on large grotesques; if letters touch, you went past the floor.
- Body measure 45–75ch. Hero subtext that wraps past ~20 words is a copy problem or a type-size problem, not "more atmosphere."
- Numbers in columns: tabular figures. Align decimal or flush-right; never optically rag a column of money.

## Scale relationships

Hierarchy is a *ratio*, not a list of sizes. Between adjacent steps, ≥1.25 on brand surfaces; 1.125–1.2 on product surfaces. A page with H1 72px and body 16px and nothing in between is shouting, not ranking.

Section padding is rhythm, not a brand of luxury. `py-32` on every section is as unchosen as `p-6` on every card. Vary: after a dense tool band, a quieter band; after a hero, not another hero-sized gap.

## Layout families (brand, and only once each)

On a marketing page, a layout family (3-col feature cards, split image/text, full-bleed quote, bento, numbered steps) appears **at most once**. The third consecutive zigzag split is a fail — see `references/ship-floor.md`. Product screens may repeat the same row pattern; that's a system, not a tell.

## What not to do

- Do not pick "asymmetric bento" from a menu to look senior. Derive structure from content volume and the job.
- Do not add hairline grids, rotated index labels, or scroll cues to "complete" a composition.
- Do not confuse whitespace with emptiness. Empty that doesn't encode rest is just unfinished.
