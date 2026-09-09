# Empty state

What a surface shows when it has nothing to show. Almost always built last, from the
full state with the data deleted, which is why so many products greet a new person with
a blank rectangle and the words "No items".

This is direction, not markup. Build it in your stack, against your tokens.

## When it applies

Any surface whose content can legitimately be absent: lists, tables, search results,
dashboards, inboxes, feeds.

**When it does not:** a surface that is empty because something failed. That is an error
state. Dressing a failure as emptiness tells a person nothing is there when in fact the
request never completed, and they will act on that.

## The shape decisions

**There are four different empties, and one component cannot serve them.** This is the
whole surface:

| Kind | The person's situation | What it owes them |
|---|---|---|
| **First run** | Nothing exists yet, because they just arrived | What this surface will hold, and the one action that creates the first thing |
| **Cleared** | They finished everything | Acknowledgement, not an action. An inbox at zero is a success, not a gap to fill |
| **No matches** | Their query or filter excluded everything | What was searched, and the way back out |
| **No access** | Data exists; they cannot see it | Who to ask. Never a create button they will be refused |

A shared "Nothing here" component that renders in all four is wrong in at least three.

**The heading names the surface, not the void.** "No invoices" describes absence;
"Invoices will appear here" describes what this place is for. Only one of those teaches
a person who has just arrived.

**One action, and it is the thing they came to do.** Two equally weighted buttons means
the design has not decided what the surface is for.

**No illustration unless the product has a real illustration system.** A generic empty
box drawing is the visual equivalent of "N/A", and improvised sketchy SVG is worse — it
reads as amateur, and this is the first thing a new person sees.

**It is not boxed.** An empty state inside a bordered card is a container drawing
attention to its own emptiness. It sits in the space the content would have filled and
lets that space be the frame.

**Centred copy stays short.** Past roughly fifty characters a line, centred text is hard
to track back from the end of one line to the start of the next.

## What the tokens have to carry

- **A muted text role** at full body contrast — this copy is load-bearing, not
  decorative.
- **A narrow measure token** for the body, distinct from the page's prose measure.
- **A generous spacing step** for the surrounding room. If the scale tops out too early,
  the empty state ends up cramped inside a large space.
- **An accent with a contrast-checked foreground** for the single action.
- No border or background role is needed. If you reach for one, re-read the shape
  decisions.

## States that must exist

The empty state *is* a state; this is how it behaves inside the surface that owns it.

| Situation | What it does |
|---|---|
| **Inside a table** | Spans the body, header row kept, so the columns still teach what the table holds. |
| **Inside a filtered list** | The no-matches form, echoing the query back as text, never as raw markup. |
| **While loading** | Does not render at all. "Nothing here" during a fetch is a lie that corrects itself, and it flashes on every slow connection. |
| **After a failed fetch** | Does not render. That is the error state. |
| **Narrow column** | Copy wraps, the action becomes full-width, the surrounding room drops one step. |

## Responsive

Padding drops one step and the action goes full-width, because a centred button narrower
than the thumb aiming at it is the same mistake as any other small target. **The copy
does not shorten.** A person meeting a surface for the first time on a phone needs the
explanation more, not less.

## Motion

None. This is the first thing a person reads on the surface, and content that fades or
slides in delays the sentence explaining where they are. The action still needs hover and press
feedback — `physics-no-press-feedback` names its absence, and `timing-over-300ms` bounds
how long it may take. That is feedback, not entrance.

If the surface animates content in when data arrives, the empty state is not part of
that sequence. It was already there.

With no transform and no entrance, there is nothing spatial for a reduced-motion path to
reduce. That exemption ends the moment this surface animates its own appearance, which
the rule above says it must not — at which point `a11y-no-reduced-motion` applies.

## How it goes wrong

- One component for all four empties: wrong in three.
- "No data" as the heading: describes the void instead of the surface.
- Rendering during loading: flashes on every slow connection and reads as broken.
- Rendering instead of an error: tells a person nothing exists when the request failed.
- A create button in the no-access case: offers an action that will be refused.
- Two equal actions: the surface has not decided what it is for.
- A generic illustration, spending the first impression on nothing.
- A card around it, framing absence.
- Cheerful copy over a real problem. "Nothing to see here!" when someone expected their
  data is a product being playful about the user's confusion.
- Echoing an unescaped query back into the page.
