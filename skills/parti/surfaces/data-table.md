# Data table

Dense records a person scans, compares, and acts on. The most-built surface in product
software and the one where defaults cost the most: a table that wraps, twitches on
sort, or hides its selection wastes real minutes every day.

This is direction, not markup. Build it in your stack, against your tokens.

## When it applies

Records sharing a schema, compared against each other — invoices, runs, users,
transactions. Three or more fields per record, or any field a person sorts by.

**When it does not:** fewer than three fields, or records read one at a time rather than
compared. That is a description list or a stack of rows. Forcing it into columns adds
alignment chrome around content that never needed aligning. A one-column table is a
list that has been made harder to read.

## The shape decisions

**Numbers right-aligned and tabular; text left; every header matching its column.** A
person scanning money compares digit positions. Proportional figures shift those
positions between rows and comparison silently stops working. This is not a preference
to weigh — it follows from how the column is read.

**Row height comes from a density token, not from the markup.** The same table serves a
manager glancing at ten rows and an analyst working four hundred. Those are different
jobs on the same data, and a table that can only do one has hidden a decision inside its
structure.

**Cells do not wrap; long values truncate and keep their full text available.** Rows of
differing height cannot be scanned, and scanning is the entire purpose. If a column
genuinely needs its full text visible, it is not a table column — it is the record's
detail view.

**Column widths are fixed, not content-derived.** With auto layout, every re-render can
re-measure, so columns move as data streams in and a sorted table twitches under the
eye. Fixed layout is what keeps a sorted table still. This is the single most common
technical cause of a table feeling cheap.

**The header stays visible while the body scrolls, and the container owns the
overflow.** A table that sets its own overflow cannot keep a sticky header, and one wide
table that makes the whole page scroll sideways is a bug that reaches every other
element on it. Note that a sticky header's bottom border tends to scroll away with the
cell in some engines — the separator has to belong to the sticky element itself.

**Selection is a first column that never scrolls away. Row actions sit at the end,
visible without hover.** The eye lands at the end of the row after reading. Hover-only
actions do not exist on touch at all, and a person who cannot find an action concludes
the product cannot do it.

**Sorting is a real control in the header with its state announced.** A header that is
secretly clickable, or that shows sort direction only as a colour, is a control a person
has to discover by accident.

## What the tokens have to carry

The spec must define, or this surface cannot be built properly:

- **Two row densities** as named tokens, not two stylesheets.
- **A surface colour distinct from page background**, or the table has no edge.
- **A border role** used for both the row rule and the container edge, so they agree.
- **A muted text role** that still passes 4.5:1 — headers and secondary columns use it,
  and this is the most common place a spec's muted grey turns out to be decorative.
- **A selection tint** derived from the accent, distinct from the hover tint. Two states
  that look the same are one state.
- **Tabular figures available in the type stack.** If the chosen face has no tabular
  variant, that is a typography decision to settle before the table gets built.

## States that must exist

| State | What distinguishes it |
|---|---|
| **Empty, first run** | Keep the header row: the columns teach what this table will hold. Copy says what will be here, not that nothing is. |
| **Empty, filter matched nothing** | Different copy, and the primary action is escaping the filter. Merging this with first-run empty is the most common table bug — it tells a person nothing exists when they have simply over-filtered. |
| **Loading** | Skeleton rows at the real row height and real column count. A spinner over an empty area collapses the layout, so the table jumps when data lands. |
| **Error** | Header kept, body replaced by the failure and a retry. Never an empty table, which reads as "no records". |
| **Overflow, too many columns** | Container scrolls horizontally; the key and selection columns pin. |
| **Overflow, long value** | Truncate, full value still reachable. Never wrap. |
| **Partial** | Loaded rows readable while more arrive. Do not block the whole table on the last page. |

## Responsive

Below the point where the columns no longer fit, a table does **not** automatically
become cards — that throws away the alignment that made it a table. Choose by what the
person is doing:

- **Still comparing records** → keep the table, scroll horizontally, pin the key column.
  Alignment survives; width does not have to.
- **No longer comparing, just finding one record** → become a list of rows, each showing
  the key plus the one field they searched by. That is a different surface over the same
  data, chosen deliberately.

Deciding this per table is the work. Defaulting every table to cards is how dense tools
become useless on phones.

## Motion

Hover and the sort indicator only, short and out-eased. The rule ids below name the
*defects* — check the surface against each:

- `timing-over-300ms` — a table's feedback is acknowledgement, not an event.
- `easing-ease-in-on-ui` — an in-curve makes a control feel like it hesitated.
- `a11y-ungated-hover` — ungated, hover sticks to the last row tapped on touch and reads
  as a selection nobody made.
- `physics-no-press-feedback` — without a pressed state a slow action gets clicked twice.

Rows do not animate in. A table is read, and content that moves while being read is read
twice.

**Sorting does not animate row positions.** Reordering four hundred rows with a
transition looks impressive and destroys the only reason a person sorted: following
where one specific record went.

If a loading shimmer is used it must have a reduced-motion path (`a11y-no-reduced-motion`).
The honest reduced-motion form of a pulse is a still skeleton, not a slower loop — a
gentler loop is still a loop. Loading stays legible through the busy state and the row
count, so nothing is lost by stopping it.

## How it goes wrong

- Wrapping cells, so rows differ in height and scanning stops working.
- Content-derived column widths with async data: columns resize as rows arrive.
- Hover-only row actions: invisible on touch, undiscoverable everywhere else.
- A header aligned opposite to its column.
- Proportional figures in money columns.
- A spinner replacing the whole table: loses the header, collapses the height, jumps.
- One empty state serving both "no data" and "no matches".
- Zebra striping as decoration. It is a tool for wide tables with no strong row anchor;
  on a table with a strong key column it is noise. Never stripes and hover tint both.
- A scrolling table inside a scrolling panel: the wheel gets trapped.
- Sort state shown only by colour.
