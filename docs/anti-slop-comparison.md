# Anti-slop mechanisms, compared

Read from the installed skills on 2026-09-09, not from their descriptions. The question
is not who has the longest ban list. It is **what kind of mechanism each one uses**, and
whether that mechanism can fail quietly.

---

## The five mechanism types

| Type | What it does | Fails when |
|---|---|---|
| **Ban list** | Enumerates known-bad patterns in prose | The list ages; the model complies in letter and violates in spirit; nothing checks |
| **Variance engine** | Randomises among unusual options to avoid repetition | Produces variety without fit; the selection replaces the derivation |
| **Dial config** | Parameterises intensity — variance, motion, density | Dials are set from vibe rather than from the subject |
| **Derivation rule** | Requires every choice to trace to something true about the subject | Hard to verify; can be claimed without being done |
| **Deterministic detection** | A script that finds the tell in the code | Only sees what is on its list; invites Goodharting |

## Who uses what

| Skill | Primary mechanism | Enforcement | Usability counterweight |
|---|---|---|---|
| **parti** | Derivation rule + deterministic detection + ship gate | 3 scripts, rule ids at `file:line`, 13 no-gos | Accessibility no-gos, foundations floors, use-case archetypes, `NG-NOVELTY-COST` |
| impeccable | Ban list ("match-and-refuse") + category-reflex test | bundled detector, browser + node engines | Register split, per-command references |
| design-taste-frontend | Dial config + tell list + pre-flight checklist | prose checklist | Hard layout rules, dark-mode and a11y sections |
| high-end-visual-design | **Variance engine** + ban list | none | mobile collapse notes |
| emil-design-eng | Craft doctrine | prose review checklist | strongest on interaction feel |
| frontend-design | Taste prompt | none | none |

## The two ideas worth taking seriously

**impeccable's second-order category reflex.** Its slop test runs at two altitudes: if you
could guess the palette from the category, that is the first reflex; if you could guess it
from *category-plus-anti-reference* ("AI tool that isn't SaaS-cream, therefore
editorial-typographic"), that is the trap one level deeper. This is the sharpest single
idea in any of these skills, because it catches the move a model makes when it is *trying*
to avoid the obvious answer. parti's derivation rule addresses the same failure from the
other side, by requiring a positive trace rather than detecting a negative pattern.

**design-taste-frontend's production-test tells.** Things only visible once the code runs
rather than in a screenshot. Correct instinct, and the same one behind parti's split
between `audit.py` at plan time and `lint.py` at build time.

## The mechanism that actively backfires

`high-end-visual-design` instructs the model to "silently roll the dice" and pick one of
three vibe archetypes and one of three layout archetypes. This is style selected from a
menu, with randomisation standing in for judgement. It produces variety across runs and
has no relationship to the subject: the same dice decide the aesthetic for a hospice
service and a crypto exchange.

It also mandates several patterns that other skills in the same ecosystem classify as
tells — an eyebrow pill above every major heading, glass cards with heavy backdrop blur,
`py-24` to `py-40` on every section. impeccable bans the eyebrow reflex outright. Two
installed skills, opposite instructions, and no way for either to notice.

And its bans are aesthetic rather than functional: Inter is banned, `ease-in-out` is
banned, "generic 1px borders" are banned. None of those is a usability defect. Meanwhile
it instructs that instant state changes without interpolation are failures, which
contradicts the frequency rule that a control used a hundred times a day should not
animate at all.

## Where parti is genuinely ahead

1. **It is the only one where a slop tell can be detected rather than merely forbidden.**
   `default_violet` catches the indigo default by hue, saturation and lightness, so a
   nudged hex does not evade it. In the A/B run it fired on all three baseline arms —
   the same colour chosen for a bank tool, a health clinic and a kiln manufacturer.
2. **Prevention rather than prohibition.** The other skills mostly tell the model what
   not to do. Derivation, the register, and the use-case archetype constrain what it
   reaches for in the first place, which is a different and earlier intervention.
3. **A verdict layer.** Thirteen unconditional no-gos and a written exception protocol.
   No competitor separates "this is a finding" from "this does not ship".
4. **Written anti-circularity doctrine.** parti says in its own eval docs that optimising
   against its detector produces evasion rather than quality, and forbids using the score
   to choose between directions. No competitor acknowledges that its ban list can be
   gamed by the model reading it.

## Where parti was behind, and what changed today

**No counterweight to the novelty pressure.** Every anti-slop mechanism rewards
difference, and parti's ban list plus detector plus "make it distinctive" is no exception.
Nothing in the skill stopped uniqueness being bought with usability, and the variance
engine above is the pure form of that failure.

Added: [`convention.md`](../skills/parti/references/convention.md) and the
`NG-NOVELTY-COST` gate. The rule is a split rather than a limit —

> **Unconventional in expression. Conventional in mechanics.**

Palette, type, composition, motion character and voice cost a user nothing to encounter
for the first time, so that is where distinctiveness is free. What is clickable, where
navigation lives, how scrolling behaves, what Back does, how a form errors — these are
learned across every other interface a person uses, and changing them spends their
attention on operating the interface instead of doing their task.

Every departure from a mechanic now needs a written line naming what the user gains, and
a departure justified by how it looks is refused, because that is an expression argument
being spent on a mechanics change.

The archetype sets the budget: a creative canvas tool can spend a lot of it, a clinic
booking flow almost none, because the people who most need an interface to be predictable
are the ones least able to absorb a surprise.

## What none of them can do, including parti

None of these skills, parti included, has evidence that its output is preferred by
anybody. Every mechanism above is an argument about how to avoid a known failure, not a
measurement of whether the result is good. parti has the harness built and the pairs
generated for a blind preference test ([`evals/ab-results.md`](../evals/ab-results.md)),
and the rater panel is still the missing input.

Until that exists, the honest ranking is on mechanism quality and enforcement, not on
outcomes.
