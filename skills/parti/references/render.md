# Render Fidelity

A perfect token spec still produces a generic-looking mockup if the *construction* defaults to the same choices every model reaches for. Concept-level anti-slop work (a real thesis, a derived palette, a signature element) is invisible until it survives contact with actual markup — and that's usually where it dies: system-font fallbacks, copy-pasted shadow values, placeholder gray boxes, a card grid reached for out of habit. This step is where "considered direction" and "generated interface" either stay separate or collapse back into the same thing.

Read this when doing Step 4 of `explore`, rendering a `variants` set, or producing any visual for `critique`.

---

## 1. The fidelity floor

Non-negotiable regardless of which direction you're rendering. A render that fails these reads as unbuilt or generic no matter how good the thinking behind it was.

| Skip this... | ...and it reads as |
|---|---|
| Loading the real display face | A wireframe in Arial, not a direction |
| Gray placeholder rectangle for imagery | An unfinished mockup, not a faithful one |
| The default `0 4px 6px rgba(0,0,0,.1)` shadow on every surface | The same elevation regardless of what your `--e-` scale says |
| Lorem ipsum or "Feature One / Feature Two" | Every hierarchy problem hidden |
| A static screenshot standing in for a "choreographed" posture | Claiming motion you never showed |
| Browser-default focus ring and cursor | Unbuilt, not an aesthetic choice |

## 2. Load real type, not a description of type

Name a display face in the direction, then actually import it in the render — Google Fonts `<link>` or a documented local face. Don't let the render silently fall back to the system stack while the writeup names something else; that gap is exactly how a render and its own spec drift apart, and it's the single fastest way for a "considered" direction to look like every other one on screen.

## 3. Build the component, not the category

"A nav," "a button," "a card" are categories with one boring default each. Construct from what the direction actually decided:

- **Navigation** — don't reach for logo-left/links-center/CTA-right at a fixed 64px unless the structure axis actually calls for it. A dense daily tool might want a persistent sidebar in the utility face; an editorial direction might have no persistent chrome above the fold at all.
- **Buttons / CTAs** — pad proportionally to the type size (`0.75em` vertical / `1.25em` horizontal reads as authored; a flat `12px 24px` ignores whatever scale the rest of the screen uses). One visual weight of primary action per screen — a second button that's just as loud is competing with it, not supporting it.
- **Forms & inputs** — label placement follows the density decision (inline = dense, stacked = spacious), placeholder copy in the subject's own vocabulary, not "Enter your email." If the pass is `states`, show at least one field in error.
- **Cards** — only when the structure axis is actually modular-bento or similar. A grid-strict or editorial-asymmetric direction that reaches for cards anyway has quietly reverted to the default mid-render. If you do use them: vary elevation with intent (`references/tokens.md` `--e-` scale), never nest one inside another.
- **Icons** — one coherent set with a stroke weight matched to the chosen typeface, not Lucide-plus-emoji-plus-a-gradient-tile. If nothing off-the-shelf fits the subject, draw the mark from `signature` or `deslop` as inline SVG instead of reaching for a stock glyph.
- **Data display** — real numbers, right precision and locale for the subject (currency, dates, units), tabular figures where columns align — pulled straight from the numeral rule in `references/tokens.md`.

## 4. Show the interaction, not just the rest state

The signature moment from the direction's thesis has to be visible: a live inline widget, or two captioned frames (rest → triggered) with the duration and easing pulled from the motion spec. A still image standing in for a choreographed posture misrepresents the direction — the viewer is being asked to approve motion they haven't seen.

## 5. Build it so it doubles as proof

Use the actual token names as CSS custom properties in the render (`--bg`, `--accent`, `--t-h1`, `--e-1`...) instead of hardcoded values sprinkled through the markup. Two payoffs: the render becomes executable evidence the token spec actually works together, not just an illustration of it, and Step 7 can lift values straight out instead of re-deriving them by eyeballing the picture.

## 6. Keep the three comparable

Same content, same stated viewport (`1440×900 desktop` or `390×844 mobile` — say which), same screen across all three directions. If one direction is genuinely mobile-first and another desktop-first, that has to trace back to the brief, not to whichever was faster to mock.

## 7. Re-run the floor on the render, not just the plan

A direction can pass the concept-level anti-slop check in `references/critique.md` and still fail here — real thesis, real signature, and then a default shadow and a default nav underneath it. Before showing the three, walk the tell list in `references/critique.md` a second time against what you actually built, not what you planned to build.

---

## Quick reference

| Element | Generic default | Do instead |
|---|---|---|
| Font | System stack quietly substituting for the named face | Load the real face; if you truly can't yet, pick a fallback that shares its character, never Arial |
| Shadow | `0 4px 6px rgba(0,0,0,.1)` on everything elevated | Elevation from the `--e-` scale, meaning something specific per level |
| Icon tile | 48px gradient rounded square, stock icon centered | A drawn mark from the subject's own vocabulary, or nothing |
| Nav | Logo-left / links-center / CTA-right, 64px header | Whatever density + structure actually demand |
| Card padding | 24px, always, on every card everywhere | Derived from the type scale and the spacing base in the token spec |
| Empty image slot | Gray placeholder rectangle | Real content-appropriate image or texture, or omit the element entirely |
| Motion proof | One static screenshot | Two-frame before/after or a live widget, duration + easing captioned |
