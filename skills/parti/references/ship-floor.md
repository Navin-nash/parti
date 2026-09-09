# Ship floor

Mechanical pre-flight. Countable fails. A mockup and a shipped build share this floor — "it's just a render" is not an exemption (baseline rationalization).

Load on `explore` Step 4, `build` B4, `polish`, and `live`. If any box fails, the output is not done. Contrast still goes through `color.py`; this list does not replace it.

Register-specific: **product** screens skip marketing-hero rules but still hit theme lock, contrast, copy audit, CTA wrap, and motion-frequency. **Brand** screens hit all of it.

## Brand / marketing screens

- [ ] Hero fits the first viewport: headline ≤2 lines desktop, subtext ≤20 words, primary CTA visible without scroll. Top padding not so large the block floats mid-viewport.
- [ ] Hero stack ≤4 text elements (optional eyebrow *or* brand strip, headline, subtext, CTAs). No trust logos, feature bullets, or version pills inside the hero.
- [ ] Every primary CTA label fits **one line** at desktop. Verb + object.
- [ ] No two CTAs with the same intent under different labels ("Get in touch" + "Let's talk").
- [ ] Eyebrows (`uppercase` + wide tracking above a heading): **at most 1 per 3 sections**. Hero counts. If you cannot count them, you used too many.
- [ ] No 3-column equal icon+heading+blurb feature row unless the brief's content *is* three peers and you said so. Prefer a structure the content demanded.
- [ ] No 3+ consecutive image/text zigzag splits.
- [ ] One page theme (light, dark, or auto). Sections don't invert mid-scroll unless the direction named a single deliberate color-block.
- [ ] One accent, used the same way everywhere. One radius system with a written rule.
- [ ] Logo wall sits under the hero, marks only.

## All registers

- [ ] Full viewport heroes use `min-h-[100dvh]` / `min-height: 100dvh`, never `h-screen` / `100vh` alone.
- [ ] No `transition: all`. Named properties only.
- [ ] No em dash (`—`) as a design or copy crutch. Hyphen or two sentences.
- [ ] Inter / Geist / Fraunces are not the only loaded family unless DESIGN.md declared them.
- [ ] Copy self-audit: every visible string read once. No "Feature One", no lorem, no empower/seamless/unleash, no cute-broken grammar.
- [ ] Real typeface file loaded in the render. Real images or explicit TODOs — `references/art-direction.md`.
- [ ] Composition checks claimed: squint + grayscale + one signature — `references/composition.md`.
- [ ] Product register: every control has default / hover / focus / active / disabled; loading and error where data is involved — `references/interaction.md`.

## Scripted half

`scripts/lint.py` flags the source-visible subset (`h-screen`, `transition: all`, em dashes, Inter/Geist-only, eyebrow clustering, cloned feature cards). A clean lint is not a passed ship-floor. Hierarchy and "does this hero fit" stay judged.

Do **not** report a `score.py` number as evidence the design got better. Slop index is a regression guard.
