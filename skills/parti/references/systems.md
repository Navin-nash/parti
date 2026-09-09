# Design-system interop

Most professional frontend work happens inside a design system somebody else owns:
Material, Fluent, Carbon, Polaris, Primer, GOV.UK, Radix, shadcn. A design skill that
can only work on greenfield is a skill that cannot be used at work.

The default failure here has two forms, and they are opposites. Either the direction is
abandoned the moment a system is present, and the product looks like every other product
built on that system. Or the system is overridden component by component until it is a
liability: the upgrade breaks, the accessibility guarantees quietly lapse, and nobody
can say which parts are still standard.

**Neither is the answer. Derive the direction *into* the system's own extension points.**

## The one rule

**A design system is a set of decisions someone already made and now maintains. Every
one you override, you own — forever, including its accessibility, its dark mode, its
next major version.**

So the question is never "how do I make this look like my direction". It is *which of
this system's decisions is the direction actually in tension with, and is that tension
worth taking ownership of?* Usually two or three are. Rarely more. A direction that
needs to override twenty is a direction that picked the wrong system, and saying so
early is worth more than a heroic theming effort.

## Where the direction lands

Every mature system exposes the same four layers, at different depths. Work at the
shallowest layer that carries the direction.

| Layer | What it is | Cost to own |
|---|---|---|
| **1. Token values** | Colour, type scale, spacing, radius, elevation, motion duration, bound through the system's own theming mechanism | None. This is the supported path and where most of a direction belongs |
| **2. Component variants** | New variants added through the system's documented extension API | Low. Maintained with the system |
| **3. Component composition** | Assembling the system's primitives into a shape it does not ship | Moderate. You own the composition, the system still owns the parts |
| **4. Component override** | Replacing a component's internals or fighting its styles | High. You own it forever, accessibility included |

**A direction that cannot be expressed in layers 1 to 3 is a signal about the system
choice, not a licence for layer 4.** Say that out loud rather than quietly reaching for
the override.

## Reading a system before theming it

Do this before mapping a single token. Ten minutes here prevents most of the damage:

1. **Find the theming mechanism the system actually supports** and confirm it is current.
   Systems change these between majors, and the widely-copied recipe is often two
   versions stale.
2. **Find what the theme cannot reach.** Every system has values baked into component
   internals. Those are your real constraints, and finding them after the palette is
   signed off is expensive.
3. **Find the density or size scale**, if any. Whether it can carry the direction's
   density decides whether product surfaces can be built as specified.
4. **Find the accessibility guarantees.** Focus behaviour, contrast floors, motion
   handling. These are the most valuable thing the system gives you, and the easiest to
   break by accident with a palette change.
5. **Check what the system's own components do with a custom accent** at the contrast
   ratio you intend. Many systems assume a mid-tone brand colour and compute hover,
   pressed, and disabled states from it. A very light or very dark accent can push those
   derived states below the floor without warning.

## Mapping the token spec

parti's spec names roles: background, surface, ink, muted, accent, danger, border,
focus, spacing steps, radius steps, durations. Every system names its own. Map role to
role, and record the mapping in `DESIGN.md` so the next person can follow it back.

Three things go wrong in this mapping, every time:

**Role mismatch.** The system's role and yours share a name and mean different things —
its "surface" may be your "background", or it may carry an elevation meaning yours does
not. Map by *what the value does in a layout*, never by name.

**Derived states.** Many systems compute hover, pressed, selected, and disabled from a
base colour with a fixed formula tuned to their own palette. Your accent goes through
that formula too. Check the derived states, not just the base — this is the single most
common way a themed system ends up with a hover state below contrast.

**Missing roles.** Your spec will name roles the system has no slot for. Add them as
your own custom properties alongside the system's, in one place, and never inline in a
component. That file becomes the honest record of where you left the system.

Where the spec and the system genuinely conflict, `DESIGN.md` records the conflict and
the resolution. Silent divergence is how a themed system rots.

## Surfaces the system already solves

The `surfaces/` directions describe how a table, a field, and an empty state should
behave. When the system ships those components, **use them** — do not rebuild a table to
match the direction's description of one. The direction becomes a review checklist
instead:

- Does the system's table let density be a token, or is row height fixed?
- Does its field put help above the input, and can that be changed if not?
- Does its empty state distinguish first-run from no-matches, or is it one component?

Where the system's answer differs from the direction, the direction usually loses on
product surfaces — consistency with the rest of the product beats one better table.
Where it loses, note it and move on. Where the system has *no* answer, the direction
governs and you build it. **Where the system's answer is a genuine accessibility or
usability defect, that is worth escalating rather than quietly styling around.**

## When there is no system yet

Choosing one is a design decision with the same weight as choosing a direction, and it
is made *before* the token work, not after. The honest inputs: what the team already
maintains, what the product's density actually demands, whether the direction needs
identity or just competence, and how much of the system's shape the direction contends
with. A system chosen for its looks is chosen for the layer you should be replacing
anyway, and against the layers you cannot.

Adopting no system is a legitimate answer for identity-driven marketing surfaces and
rarely the right one for dense product UI, where the accessibility and interaction work
a mature system has already done is worth more than the identity a bespoke set buys.

## How it goes wrong

- **Overriding component internals to match a mockup.** The mockup should have been
  drawn against the system.
- **A palette swap called a theme.** Type scale, density, radius, and motion carry as
  much identity as colour, and a system's defaults for those are recognisable.
- **Theming the base colours and not the derived states.** Hover and disabled quietly
  fail contrast.
- **Leaving the system's motion defaults untouched** while claiming a motion direction.
- **Mixing two systems on one surface.** Focus behaviour and z-index stacking will
  disagree, and the seams show exactly where a user is trying to work.
- **Assuming a system's components are accessible as composed.** They are accessible as
  *documented*. Composition can still break the guarantee.
- **Recording none of it.** A themed system with no written mapping is indistinguishable
  from a system somebody vandalised.
