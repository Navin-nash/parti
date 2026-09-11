# Foundations

The floor every output stands on, whether it is a fresh build or a redesign, brand or
product. Numbers, not adjectives — a rule you cannot check is a rule that gets skipped.

`go-no-go.md` decides whether work ships. This is what "good" means underneath it.

---

## 1. Structure before surface

**Most generated interfaces fail here, not at the pixel level.** They look plausible in a
screenshot and fall apart as a page, because they were assembled section by section with
no argument about what the page *is*.

**The structural sentence.** Before any layout, write one sentence: what this page is
for, in what order a person needs things, and what they do at the end. If the sentence
does not force an order, the page has no structure and no amount of styling will give it
one.

**Every block declares its role.** Each region is one of: **orient** (where am I),
**convince** (why this), **explain** (how it works), **prove** (evidence), **act** (do
the thing), **navigate** (go elsewhere). A block that cannot be named is cut. Two
adjacent blocks with the same role are merged or differentiated.

**The uniform-stack failure.** A page of full-width sections, each with the same vertical
padding, the same centred heading, and the same one-or-three-column body, is the most
common shape of generated work. It reads as a list of unrelated cards rather than an
argument. Concretely, on any page of four or more sections:

- No more than **two consecutive** sections share the same vertical rhythm.
- No more than **two consecutive** sections share the same content alignment.
- At least one section breaks the dominant container width — full-bleed, offset, or
  narrower — and it is the one that matters most.
- Vertical spacing between sections varies by role. A tight coupling between two related
  blocks and a wide gap before an unrelated one is what tells a reader they are related.

**Hierarchy is decided, not emergent.** Per view, name the first, second, and third thing
a person should see, in that order, before building. Then verify it survives squint and
grayscale. If everything is the same weight, the design has made no decisions; if three
things compete, it has made three.

**Alignment is a system, not a per-element choice.** One grid, stated. Optical alignment
beats mathematical where they disagree, and where they disagree is usually icons, quotes,
and anything with a visual overhang.

## 2. Readability

Text is the interface in most software. These are floors, not targets.

| Rule | Value |
|---|---|
| Body text contrast | ≥ 4.5:1, measured |
| Large text (≥24px, or ≥18.66px bold) | ≥ 3:1, measured |
| Non-text: focus rings, borders carrying meaning, icons | ≥ 3:1 |
| Body size | ≥ 16px on any surface a person reads; never below 14px for interactive text |
| Measure (line length) | 45–75 characters for prose; 60–70 is the working target |
| Body line-height | 1.4–1.6. Tighter is for display only |
| Display line-height | 0.95–1.15, and it moves *down* as size goes up |
| Heading scale ratio | ≥ 1.25 between adjacent steps. A flat scale reads as no hierarchy |
| Paragraph spacing | ≥ 0.75× line-height, so paragraphs separate without floating apart |
| Letter-spacing on display | ≥ -0.04em. Tighter and the letters touch |
| All-caps | labels of ≤ 4 words only, with positive tracking. Never body copy |

**Centred text stops working past about three lines.** The reader loses the return path
to the next line's start. Centre a heading, a short subtitle, an empty state — not a
paragraph.

**Never rely on colour alone** to carry state, category, or severity. Add a label, an
icon, a weight change, or a position.

**Text over an image needs a measured floor**, not a guessed scrim. Sample the actual
composite; an overlay that looks safe on the designer's crop fails on the user's.

## 3. Pull and interaction

"User pull" is not decoration. It is whether a person can tell what to do, believes the
interface heard them, and is not made to think about the mechanism.

- **One primary action per view.** Two things styled as primary means the design has not
  decided. Everything else is secondary or quiet.
- **The action says what happens.** Verb plus object. "Save changes", not "OK". "Delete
  project", not "Yes".
- **Affordance before hover.** If a control is only discoverable by hovering, it does not
  exist on touch and is invisible to everyone else.
- **Acknowledge within 100ms.** Press feedback is not optional; below ~100ms an interface
  feels direct, and past ~300ms a person starts to wonder whether the click registered.
- **Anything over ~400ms shows progress**, and progress that can be specific ("3 of 12")
  beats a spinner that could mean anything.
- **Targets** ≥ 24×24px minimum with spacing, ≥ 44×44px for anything primary or
  frequently hit on touch.
- **Focus is visible on every interactive element**, at ≥ 3:1 against its surroundings,
  and never removed without a replacement.
- **Errors say what happened, why, and what to do next**, next to the thing that failed
  rather than in a banner far from it.
- **Nothing moves under the cursor.** Content that shifts after load moves the target a
  person is already reaching for.
- **Reduced motion is respected** wherever something moves in space.

## 4. Colour, without the default

**The indigo-violet band is the saturated default of generated interfaces.** Tailwind's
`indigo-500` / `indigo-600` / `violet-500`, the purple-to-blue gradient, and every hand-
nudged neighbour of them. `lint.py` flags this deterministically as `default_violet`,
by hue rather than by a list of hex values, so nudging `#6366F1` to `#6165EE` does not
evade it — evading a tell is not the same as choosing a colour.

If violet is genuinely right for the subject, declare it in `DESIGN.md` with the reason
and the finding stops firing. That is the whole exemption: say why, once, in writing.

The other saturated defaults, which no script catches and you have to refuse yourself:

- **Warm cream, sand, or paper backgrounds** with a serif display and a terracotta accent.
- **Glass cards over a gradient mesh**, in any hue.
- **Neon-on-near-black** as a stand-in for "technical".
- **Any palette you could have guessed from the category alone.** If "fintech" produced
  navy and gold, or "AI tool" produced violet, the subject did nothing and the category
  chose.

Derive instead: a colour has to be traceable to something true about the subject, its
materials, its environment, or its history. Then check every pair with `color.py` before
committing.

## 5. Responsive and internationalization floor

Loaded by `responsive`, `build` B2, and `harden`. A layout that only exists at the
viewport it was designed at is a mockup that happens to run in a browser.

- **Breakpoints come from the content, not device presets.** Hold the expanded layout as
  long as it genuinely fits and collapse late; test the smallest and largest supported
  widths first, not the middle. Prefer container queries for component-level adaptation
  over a page-level breakpoint reused everywhere.
- **Logical properties for anything direction-dependent** — `padding-inline-start`,
  `margin-inline-end`, `text-align: start`. Reserve physical `left`/`right` for genuinely
  physical geometry (a map, a drag handle). Think leading/trailing, not left/right, and
  mirror-check any product that ships RTL.
- **No fixed width or height on a text container.** Translated strings grow — short ones
  grow proportionally more, so a one-word button label is the riskiest string on the
  screen. Let rows wrap; test with pseudo-localization or one representative long locale
  rather than budgeting a percentage.
- **Never park a critical action where resizing or scrolling clips it.** Keep it in
  normal flow, or in stable chrome with safe-area padding (`env(safe-area-inset-*)`) —
  not floating at a fixed offset that a notch or a keyboard can cover.
- **Content bleeds, controls float.** Backgrounds and media may extend to the viewport
  edge; text and controls stay inside the layout margins and safe areas. In content
  layouts, inset full-width buttons from the edge (≈16px inline on mobile) rather than
  running them flush, unless the product's established chrome does that deliberately.
- **Breathing room between adjacent targets** — without an established density system,
  start at 12px between bordered or filled controls and 24px around borderless
  text/icon-only ones, and never let an extended hit area (§3) overlap a neighbor's.
- **Hint at hidden content.** Progressive disclosure needs a visible affordance: the
  product's own cue, or the next item peeking 16–32px past a scroll edge, or a disclosure
  control. Content reachable only past an edge with no cue is `NG-HIDDEN-CUE`
  (`go-no-go.md`).

## 6. Applying this

- **New work** — read this before the first layout decision. Section 1 is the part
  that has to happen before anything visual.
- **Redesign** — read it as a diagnostic. Sections 1 and 2 explain most of what feels
  wrong about an interface people describe as "cluttered" or "cheap".
- **Review** — every rule here is checkable. A finding that cites one of these numbers
  survives an argument that "it feels cramped" does not.
