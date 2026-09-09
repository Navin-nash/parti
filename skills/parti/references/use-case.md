# Use case

`register.md` decides brand or product. That is one bit of information, and two products
in the same register can demand opposite designs: a trading terminal and a meditation app
are both "product", and a design that suits one is a failure in the other.

This file is the layer underneath. **Name the archetype after the register and before any
visual decision.** Write it in the output. It sets density, motion budget, type,
colour strategy, and the failure everyone makes in that category.

If the product spans two archetypes, name both and say which surface is which. Do not
average them; averaging is how a dashboard ends up with a consumer app's animations and a
consumer app ends up with a dashboard's density.

---

## The archetypes

### Dashboard / analytics
**Doing:** scanning for the number that changed, then explaining it.
**Must be true:** the important number is legible at a glance from across a desk, and it
is possible to tell what changed since last time.
Density high, motion near zero (`purpose-high-frequency` applies to almost everything
here), one family, tabular figures mandatory, colour strictly encoding — a hue that means
nothing on a chart is noise on every chart.
**Category failure:** decorating the numbers. Gradient fills, animated counters, and
sparklines with no axis are the three most common, and each one costs comprehension.

### Data tool / admin
**Doing:** working through records, often for hours, often the same task repeatedly.
**Must be true:** keyboard reachable end to end, and the row a person was on survives
whatever they just did.
Density high with a real compact mode, motion only for state change, type one family at
one size with weight carrying hierarchy, colour restrained with a single strong selection
state.
**Category failure:** building for the demo of ten rows rather than the reality of four
thousand. See `surfaces/data-table.md`.

### Developer tool
**Doing:** reading output, correlating it with their own code, moving fast.
**Must be true:** monospace where alignment carries meaning, and copyable everything.
Density high, motion effectively zero, dark and light both first-class because the
surrounding editor is one or the other, colour semantic and consistent with the
conventions developers already read (diff green and red, log severity).
**Category failure:** a marketing aesthetic applied to a tool. Rounded gradient cards
around a terminal output read as untrustworthy to this audience specifically.

### Consumer app with a feed
**Doing:** short, frequent, one-handed sessions, often distracted.
**Must be true:** the primary action is reachable by thumb, and the first screen makes
sense with zero explanation.
Density low to medium, motion moderate and always tied to gesture or state, type larger
than feels necessary on desktop, colour identity-carrying.
**Category failure:** desktop density shrunk down. Also infinite motion loops that look
alive in a demo and drain attention in daily use.

### Content and editorial
**Doing:** reading, for minutes rather than seconds.
**Must be true:** the measure is right and nothing competes with the text.
Density low, motion almost none (`purpose-decorative-on-data` and scroll-jacking are the
usual sins), type is the entire design — a real pairing, a real scale, real hanging
punctuation, colour minimal with one accent for links and marks.
**Category failure:** treating an article like a landing page. Every reveal-on-scroll
interrupts the one activity the page exists for.

### Commerce
**Doing:** comparing, then deciding, often anxious about the decision.
**Must be true:** price, availability and the return promise are legible without
hunting, and product images are the design.
Density medium, motion restrained and never on the price, type clear over expressive,
colour supporting the product photography rather than competing with it.
**Category failure:** the interface competing with the merchandise. Second: urgency
theatre — countdowns and stock counters that erode trust faster than they convert.

### Booking and scheduling
**Doing:** fitting something into a constrained set of real-world options.
**Must be true:** what is available and what is not is unmistakable, and the cost of
being wrong is visible before confirming.
Density medium, motion only for transitions between steps, type clear at small sizes
because dates and times are small, colour encoding availability with a non-colour
reinforcement.
**Category failure:** hiding the constraint. A calendar that shows everything as
selectable and errors afterwards is the category's signature bug.

### Regulated: health, finance, government
**Doing:** something with real consequences, often stressed, often not by choice.
**Must be true:** plain language, no ambiguity about what happens next, and every
destructive or binding action is confirmable and reversible where the law allows.
Density medium, motion minimal, type generously sized because the audience is
everyone, colour conservative with accessibility above the legal floor rather than at it.
**Category failure:** designing for the confident user. The person who needs this
interface most is the one having the worst day with it.

### Creative and canvas tools
**Doing:** manipulating an artifact directly, for long stretches, in flow.
**Must be true:** the chrome recedes, the artifact is the brightest thing on screen, and
every action is undoable.
Density high but peripheral, motion tied to direct manipulation and nothing else, type
small and neutral, colour near-neutral so the user's work is the only saturated thing.
**Category failure:** a colourful UI around a colour-critical canvas.

### Marketing and landing
**Doing:** deciding in seconds whether this is for them.
**Must be true:** what it is, who it is for, and what to do next, above the fold, in
words rather than implication.
Density low, motion cinematic and rare — one moment, not one per section — type
expressive, colour committed.
**Category failure:** the everything-page. Also the hero that describes a feeling and
never says what the product does.

---

## Using it

State it once, in this shape, before designing:

> Register: product. Archetype: data tool. The person is a claims adjuster working
> ~200 records a shift, keyboard-first, on a 1080p laptop in an office.

Then let it decide. When a choice conflicts with the archetype, the archetype wins unless
the brief overrides it explicitly — and if the brief does override it, say so once and
write it in `DESIGN.md`.

**The archetype is not a style.** It constrains density, motion, and hierarchy; it never
supplies a palette or a layout. Two dev tools should still look nothing alike, because
`GO-DERIVED` still applies: every choice traces to *this* subject. The archetype rules
out what would be wrong. What is right still has to be derived.
