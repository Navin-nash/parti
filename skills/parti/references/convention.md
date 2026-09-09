# Convention and its budget

An anti-slop objective has one dangerous failure mode: it rewards **difference**, and
difference is cheap. Rotate the cards three degrees, hide the scrollbar, put the nav
somewhere nobody expects, and the output is unmistakably not generic — and worse to use
than the generic thing it replaced.

This file is the counterweight. It is the rule that makes the goal *unique and usable*
rather than merely unique.

The distinction that resolves it:

> **Be unconventional in expression. Be conventional in mechanics.**

Expression is what the thing looks and feels like. Mechanics is how it works. A person
brings a lifetime of learned mechanics to your interface and roughly four seconds of
patience for relearning them. They bring no expectations at all about your palette.

---

## Mechanics: deviate only with evidence

These are learned across every other interface a person uses. Changing them spends the
user's attention on operating the interface instead of doing their task. **Each of these
is conventional unless you can name a concrete gain that outweighs the relearning cost,
and write that reason down.**

- **What is interactive, and what happens when it is pressed.** Buttons look pressable.
  Links look like links. Nothing that looks static is clickable.
- **Where the primary navigation lives**, and that it stays put.
- **Scrolling.** The page scrolls at the speed the OS says. No hijacking, no smoothing
  that outlives the gesture, no scroll-driven sequence a person cannot skip.
- **The browser's own affordances.** Back goes back. The scrollbar exists. Text is
  selectable. Zoom works. Find-in-page finds.
- **Form behaviour.** Labels above fields, errors next to what failed, autofill works,
  Enter submits, Escape dismisses.
- **Destructive actions are confirmed, and reversible where possible.**
- **Focus order follows reading order**, and focus is always visible.
- **The universal icon set** — close, search, menu, back — means what it always means.
- **Loading, empty and error semantics.** A spinner means working. An empty state means
  empty, not broken.
- **Where things are on a phone.** The primary action is in thumb reach.

## Expression: deviate freely

None of this is learned behaviour, so none of it costs the user anything to encounter for
the first time. This is where a design earns the right to be recognisable:

Palette and its strategy · type choices, scale and pairing · spacing rhythm and density ·
composition, asymmetry, tension · imagery, texture, material · motion character and
timing personality · voice and copy · the signature element · surface language, depth,
radius, borders.

**A design that is bold here and conventional in mechanics is the target.** It reads as
authored and operates without friction. That combination is rare, which is exactly why it
is worth aiming at.

## The departure ledger

Every deviation from a mechanic gets one line, written down, before it is built:

> Departing from *[the convention]* because *[what the user gains]*, accepting that
> *[what it costs them]*.

If the "gains" half is about how it looks, that is an expression argument being used to
justify a mechanics change, and the answer is no. Move the boldness to expression, where
it is free.

Three tests, in order:

1. **Can the gain be stated in terms of the user's task?** Not the brand, not the
   portfolio, not "it feels premium". If not, revert it.
2. **Would a first-time user succeed without being told?** If it needs a tooltip
   explaining how the interface works, the interface is the problem.
3. **Does the archetype tolerate it?** `use-case.md` decides. A creative canvas tool can
   spend far more of this budget than a clinic booking flow, which can spend almost none.
   The people who most need an interface to be predictable are the ones least able to
   absorb the surprise.

## The novelty trap, named

Uniqueness is a *by-product* of deriving from the subject, never a target in itself. The
tell that a design has aimed at it directly:

- The unusual thing cannot be explained by anything true about the subject.
- Removing it would cost nothing except distinctiveness.
- It appears in the layout's *mechanics* rather than its expression.
- It was chosen from a list of unusual options — a variance dial, an archetype menu, a
  roll of the dice. **A random pick from a catalogue of unconventional layouts is the
  same failure as a random pick from a catalogue of conventional ones**; the selection is
  still doing the work that derivation should do.

If a reviewer's praise is "it's interesting" or "it's different", that is a warning, not
a win. The praise you want names a property: *I can tell what to do first. The numbers
line up. It looks like it's for accountants.*

## Why this is not enforced by a script

There is no reliable detector here, and pretending otherwise would be worse than the gap.
Scroll hijacking, non-selectable text and custom cursors are all legitimate in some
contexts and defects in most, and a rule that fires on the pattern rather than the context
would be a false-positive machine that people learn to ignore. This one is judged, argued
in the report, and gated by `NG-NOVELTY-COST`.
