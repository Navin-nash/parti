# Surface directions

Rules do not survive contact with a build. When it is time to write a table, the model
reaches for whatever table it has written a thousand times, and the direction quietly
reverts to defaults — the second failure mode this skill exists to prevent.

`surfaces/` is the counter-pressure, and it is **not a component library**. There is no
markup to paste, no stylesheet to import, no starter to fill in. A surface direction
carries the decisions that get skipped and the reasons behind them, so that the thing
you write is written knowingly. You still write it, in this project's stack, against
this project's tokens, shaped by this project's content.

**Why no code.** A reference implementation is a default with better manners. Paste it
and the surface stops answering to the direction and starts answering to whoever wrote
the template — which is the exact substitution this skill exists to prevent, arriving
one level deeper where it is harder to notice. The same argument that forbids picking a
style off a menu forbids picking a table off a shelf. Direction transfers; markup
ossifies.

**The boundary, stated once.** A curve, a duration, a ratio, a threshold is *direction* —
it cannot be conveyed in prose, and `motion-recipes.md` is right to give
`transition: transform 160ms var(--ease-out)` exactly. A component's markup is a
*template*: it decides structure, naming, and composition on your behalf. The test is
whether pasting it means a decision got made for you. A number does not decide anything;
a component does.

## What is covered, and why those

Surface directions cover the **product register** — tables, forms, empty states, the
dense surfaces where a wrong default costs a user real time every day. This is
deliberate. The other design skills in this space either ignore product UI or
explicitly declare it out of scope and hand it to Carbon, Polaris, or Atlaskit. That
leaves the most-built surfaces in software to whatever the model happens to remember.
Marketing surfaces are the ones models already overproduce; those need constraint, not
another template.

## What a surface direction contains

Seven parts, in this order. A direction missing any of them is unfinished.

1. **When it applies, and when it does not** — with the named alternative for the
   second case. A direction that claims every situation teaches nothing.
2. **The shape decisions** — each one stating what is settled, and the fact about the
   content or the job that settles it. Never a trend, never a preference.
3. **What the tokens have to carry** — which axes the spec must define for this surface
   to be buildable. Names of roles, not values. If the spec cannot express density,
   this surface cannot be built properly and that is a token problem to fix first.
4. **States that must exist** — every state, with what distinguishes it. Empty,
   loading, error, and overflow are part of the surface, not a `harden` follow-up.
5. **Responsive behaviour** — as a decision rule, not a breakpoint dump. Where the
   answer is genuinely "it depends", the direction says what it depends on.
6. **Motion** — by rule id from `motion-rules.md`, including where the answer is none.
7. **How it goes wrong** — the specific failures for this surface, each one a thing you
   can check for.

## Using one

Read the direction before building that surface, the same way the register reference is
read before choosing a direction. Then build it yourself:

1. Take the decisions. That is the part that was already settled, and re-deciding it
   from scratch is where the default creeps back in.
2. Check your token spec covers what part 3 names. Add what is missing before writing
   markup, not after.
3. Build every state in the same pass. Deleting the empty state because the demo data
   is full is how a surface ships without one.
4. Depart where the content demands it, and say in one line what demanded it. These are
   arguments, not authorities — but disagreeing silently is how defaults return.

## Index

| Surface | What it settles | File |
|---|---|---|
| Data table | alignment, density, sort, selection, overflow | [surfaces/data-table.md](../surfaces/data-table.md) |
| Form field | the label / help / error contract, and every input state | [surfaces/form-field.md](../surfaces/form-field.md) |
| Empty state | the four different empties and why one component cannot serve them | [surfaces/empty-state.md](../surfaces/empty-state.md) |

Deliberately short. A surface earns a file by having been built badly, often, for
reasons that generalise. Adding one speculatively is the same scaffolding reflex the
skill refuses everywhere else.
