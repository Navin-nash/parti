# Design elements

The material system: icons, depth, surfaces and borders, data display, ornament. These
are what separate an interface that reads as considered from one that reads as assembled,
and they are where "professional" is actually won or lost — not in the palette, which
everyone gets roughly right, but in whether the twelve small decisions underneath agree
with each other.

Imagery, photography and texture are `art-direction.md`. Motion is `motion.md` and its
rule catalog. This is everything else.

**One rule governs all of it: pick one language per property and hold it.** An interface
that separates with borders in one place, shadows in another, and background steps in a
third has three elevation systems and therefore none. Inconsistency in these elements is
the most reliable signal of generated work, because a person building by hand accumulates
consistency and a model assembles each region independently.

---

## Icons

**One set, one weight, one grid.** Mixing sets is visible even to people who cannot say
why: stroke widths differ, corner radii differ, optical weights differ, and the toolbar
looks subtly broken.

- **Size to the text they sit with**, usually 1em to 1.25em of the adjacent label, aligned
  optically rather than by bounding box. An icon centred by its box sits high next to text
  more often than not.
- **Stroke width tracks the type weight.** A 1px icon next to a 600-weight label is a
  mismatch; a 2px icon in a light interface shouts.
- **An icon alone is not a label.** Icon-only controls need an accessible name always, and
  a visible label wherever the meaning is not universal. The universal set is smaller than
  people think: close, search, menu, back. Almost everything else is learned convention,
  and a learned convention is a guess about your specific user.
- **Never an emoji as a UI icon.** Different metrics, different rendering per platform,
  and it dates the interface immediately.
- **Icons carry meaning or they go.** A decorative icon at the top of every card is the
  icon-tile tell.

## Depth and elevation

**Choose one language: borders, shadows, or background steps.** Then use it for every
level, and define the levels — usually three is enough (flat, raised, overlay).

- **Borders** suit dense, information-heavy interfaces. They cost nothing in rendering,
  they read at any zoom, and they keep alignment legible.
- **Shadows** suit interfaces with real layering, where things genuinely float above other
  things. If you use them, they need a consistent light source: same direction, same
  spread ratio, blur scaling with distance. Shadows in different directions on one screen
  is the single most common construction error.
- **Background steps** suit dark interfaces, where shadows do not read.

**Never a hairline border and a wide diffuse shadow on the same element.** That is the
ghost card, one of the most reliable current tells, and it happens because the two
languages got stacked instead of chosen between.

Elevation encodes *meaning*, not importance. A dropdown is elevated because it is
temporarily above the page, not because it matters more.

## Surfaces, borders and radius

- **Radius is a system with a stated rule**, not a value applied everywhere. The rule
  usually keys to size and role: controls one value, containers another, pills for tags
  only, and some things stay square because squareness is correct — table cells, data
  regions, anything that tiles.
- **Radius scales with the element.** The same 8px on a 32px button and a 600px panel
  reads as two different intentions. Nested radii need the inner smaller than the outer by
  roughly the padding between them, or the curves fight.
- **Above about 24px on a container, radius stops reading as refinement and starts reading
  as a toy.** `lint.py` flags 32px and above.
- **Border colour is a role, not a grey.** One border token used consistently beats four
  greys chosen per component, and the difference is visible immediately at low zoom.

## Data display

Where product interfaces are most often let down, because it takes real care and nothing
about it is visible in a screenshot.

- **Tabular figures for anything compared vertically.** Prices, counts, durations, ids.
  Proportional digits shift position between rows and comparison quietly stops working.
- **Align numbers right, text left, and match every header to its column.**
- **Units and symbols are set once, consistently** — currency position, thousands
  separators, date format, and whether time is absolute or relative. Mixing "3 days ago"
  and "12 Sep" in one column is a decision nobody made.
- **Precision is a decision.** Show the digits that matter and no more; a figure carrying
  six decimals implies a confidence the data does not have.
- **Charts follow the same colour discipline as the interface.** A hue that means nothing
  is noise; a hue that means one thing must mean it everywhere. Never encode by colour
  alone.
- **Empty and zero are different.** No data, zero, and not-applicable are three states,
  and rendering them identically is a bug people act on.

## Ornament

Everything that is not content, control, or structure. **The default budget is zero**, and
each addition must survive one question: what does a person understand because this is
here.

Dividers earn their place only where proximity has already failed to group. Background
patterns, decorative gradients, floating shapes, rotated labels, hairline grids and scroll
hints are the standard set of things added to make a composition feel finished, and each
one makes it less finished, because they signal that the structure underneath was not
carrying its own weight.

The exception is the **signature** — the one element the design is remembered by, named
in the direction, drawn from the subject. One. Two competing signatures cancel.

## Fine detail

The values below are exact, not ranges to approximate — the difference between a screen
that reads as tuned and one that reads as close-enough usually lives here.

- **Concentric radius.** Outer radius = inner radius + the padding between them. A 12px
  card padding around a 6px button radius wants an 18px card radius, not a round number
  that happens to be nearby — mismatched nested radii is one of the most common things
  that makes an interface feel subtly off even to someone who can't say why.
- **Image outlines.** A 1px outline at low opacity gives an image consistent depth
  against any background: pure black in light mode (`oklch(0 0 0 / 0.1)`), pure white in
  dark (`oklch(1 0 0 / 0.1)`) — never a tinted neutral, which picks up whatever surface
  sits under the image and reads as dirt on the edge.
- **One SVG per icon, recolored by state.** Icons take hover, selected, and disabled
  states from `currentColor` and CSS opacity, never from separate icon assets per state.
  Outline is the default variant; a filled version marks the active state where the set
  has one.
- **Suppress transitions on a theme switch.** A light/dark toggle changes color,
  background, border, and shadow on nearly every element at once; if each has its own
  transition they all fire together and the switch smears instead of snapping. Inject
  `*,*::before,*::after{transition:none!important}` for one frame, force a reflow, then
  remove it — the same discipline as `motion-rules.md`'s `interrupt-*` rules, applied to
  a change that touches the whole screen instead of one component.
- **`will-change` only for what the GPU composites** — `transform`, `opacity`, `filter` —
  and only just before the animation runs, removed after. Applied permanently across many
  elements it exhausts GPU memory and makes everything slower; `motion.py`'s
  `perf-will-change-permanent` catches the on-source version of this.

## Making them agree

Before a build is done, check across the whole screen rather than per component:

- One icon set, one stroke weight.
- One elevation language, one light direction.
- One radius rule, stated, applied by role.
- One border token.
- One date format, one currency treatment, one precision rule.
- Ornament budget spent once, on the signature.

Any of these that has two answers on one screen is a finding, and usually the reason an
interface someone describes as "not quite professional" feels that way.
