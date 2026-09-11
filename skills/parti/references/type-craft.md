# Type craft

Loaded by `typeset`, `explore` §3–4, and `build`. Naming a font in the spec and shipping Inter is the same failure as not naming one.

## Procedure (every project, never skip)

1. Write **three voice words** that are physical, not vibe: "warm mechanical opinionated" — not "modern elegant premium."
2. List the three faces you'd reach for by reflex. If any sit on the reflex-reject list, they are out unless DESIGN.md already committed to them (identity-preservation wins).
3. Pick from a real catalog with the voice words and the **subject as an object** (a 1099, a hotel keycard, a warehouse stencil, a lab notebook). Reject the first face that merely "looks designy."
4. If the final pick equals the original reflex, start over.
5. Pair on a **contrast axis** (serif/sans, grotesque/humanist, display/text) or use **one family** in multiple weights. Two similar geometric sans faces is indecision.

Register (`references/register.md`) then decides scale behavior: brand may clamp display; product uses a fixed rem scale and often a single family.

## Reflex-reject (unchosen defaults)

Do not reach for these unless the brand already ships them or the brief names them:

Inter · Geist · Roboto · Arial · Open Sans · Plus Jakarta Sans · DM Sans · Outfit · Space Grotesk · Fraunces · Instrument Serif · Instrument Sans · Playfair Display · Cormorant · Newsreader · Lora · IBM Plex Sans/Serif/Mono as the *whole* system · Syne

Using IBM Plex Mono for **figures only** in a product UI is allowed. Using Fraunces display + IBM Plex UI for a tax landing is the 2026 ledger reflex (see register second-order slop).

## Optical rules

| Size | Tracking | Leading |
|---|---|---|
| Display / H1 large | −0.02 to −0.04em (floor −0.04; tighter = touching) | ~0.9–1.1; italic descenders (`y g j p q`) need ≥1.1 and a little padding or they clip |
| Body | 0 to +0.01em | 1.4–1.6; measure 45–75ch |
| Small caps / labels | +0.02 to +0.08em | 1.2–1.4 |
| Product UI labels | slight positive or zero | fixed rem; do not clamp in a sidebar |

- Hero clamp max ≤ 6rem. Larger is shouting.
- Cap families at 3 (display + body + optional mono). One well-tuned family beats three timid ones.
- No all-caps body. Uppercase only for short labels (≤4 words), and not on every section (ship-floor eyebrow ration).
- `text-wrap: balance` on h1–h3; `pretty` on long prose.
- Numerals: lining tabular where columns align; old-style only when the direction's voice actually wants them in running text.

## Product vs brand

**Product:** headings, buttons, labels, body, data can share one sans. Display serif on a Settings title is a register error. Don't use fluid hero type in an app chrome.

**Brand:** a distinctive display + a refined text face is the usual pair. Emphasis inside a headline uses italic or weight of the *same* family — don't inject a random serif word into a sans headline.

## Implementation

Where the spec meets CSS. Naming the right face and shipping it wrong is the same
failure as naming the wrong face.

- **Properties over raw feature tags.** `font-weight: 650` instead of
  `font-variation-settings: "wght" 650`; `font-optical-sizing: auto` instead of `"opsz"`;
  `font-variant-numeric: tabular-nums` instead of `font-feature-settings: "tnum" 1`.
  Properties keep working when a non-variable fallback renders; reserve raw tags for
  custom axes (`"GRAD" 80`) and niche features with no property of their own.
- **Load the weights and styles the design uses.** A browser synthesizes a missing bold
  or italic, distorting the real face. `font-synthesis: none` turns that off — but it
  erases the emphasis rather than reporting it, so set it only after checking every
  required bold, italic, and small-cap form stays distinct across the fallback stack.
- **Underlines from the font, not the browser's guess.** Pull position and thickness from
  the font's own metrics: `text-underline-position: from-font`,
  `text-decoration-thickness: from-font`, tuned by hand with `text-underline-offset` and
  `text-decoration-skip-ink: auto` so descenders don't get cut.
- **Inputs at 16px on mobile.** iOS Safari zooms the whole page when an input's text
  renders under 16px. Either size the input up on mobile (`text-base sm:text-sm`, which
  changes how it looks at small widths) or hold `font-size: 16px` and render the intended
  size with `transform: scale()`, compensating width and line-height — identical at every
  viewport, more code to maintain. Pick one; don't mix them across a form.
- **Font smoothing on the root, once.** macOS renders text heavier than intended.
  `-webkit-font-smoothing: antialiased` and `-moz-osx-font-smoothing: grayscale` on the
  root layout — never per component, which is how a design ends up with two smoothing
  regimes on one screen.
- **`lang` and `dir` for mixed-direction content.** Set `lang` so assistive tech picks the
  right pronunciation and hyphenation; set `dir` at the document or the boundary where
  direction changes; isolate a mixed-direction value (an English product name inside
  Arabic prose) with `<bdi>` so digit and punctuation order survives.

## Typeset command

Report current families and ratios first. Then rebuild. A pairing without named faces, sources, and tracking-per-size is not a typeset pass.
