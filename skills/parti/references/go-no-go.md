# Go / no-go

The verdict layer. `ship-floor.md` is the long mechanical checklist, `bans.md` catalogs
build-time tells, `critique.md` catalogs design-time ones. This file answers the only
question those lists do not: **may this leave, or not.**

Run it before any deliverable reaches the user — a direction, a render, a build, an
accepted live variant. Every rule is binary and checkable by someone who was not in the
conversation. If you cannot decide a rule in one pass, it is written wrong; say so
rather than guessing.

Two failure modes this replaces. Shipping something with a defect nobody named because
no single list owned the decision. And blocking on taste, where "I would have done it
differently" quietly acquires the authority of a rule.

---

## No-go — unconditional

If any of these is true, the work does not leave. Not with a caveat, not with "it is
only a mock", not with "the user can fix it later". **Baseline rationalization is the
tell that one of these is about to be waived.**

| id | Condition |
|---|---|
| `NG-CONTRAST` | Text below its contrast floor, **measured** — 4.5:1 body, 3:1 large. Not estimated by eye, not assumed from a token name. |
| `NG-FOCUS` | Focus indication removed and nothing put back. |
| `NG-KEYBOARD` | An interactive element that cannot be reached or operated from the keyboard. |
| `NG-MEANING-BY-COLOR` | Colour is the only carrier of a meaning — state, validity, category, severity. |
| `NG-OVERFLOW` | Content clipped, overlapping, or forcing horizontal page scroll at any tested width. |
| `NG-MISSING-STATE` | A state that can occur in this surface was not built: empty, loading, error, overflow, no-permission. |
| `NG-FAKE-CONTENT` | Placeholder standing in for real content with no explicit TODO — lorem, "Feature One", a grey rectangle where an image belongs. |
| `NG-DRIFT` | A colour, size, radius, or duration that does not trace to the spec, and the spec was not amended to include it. |
| `NG-MOTION-TRAP` | Something moves in space with no reduced-motion path. |
| `NG-UNCHECKED-CLAIM` | The report says something was verified that was not actually run. |
| `NG-DEFAULT-PALETTE` | The indigo/violet default, undeclared. `lint.py` flags it as `default_violet`; declaring it in `DESIGN.md` with a reason clears it, nudging the hex does not. |
| `NG-NO-STRUCTURE` | The page has no structural sentence and no named role per block — the uniform stack. `foundations.md` §1. |
| `NG-NOVELTY-COST` | A departure from a learned mechanic — what is clickable, where nav lives, scrolling, back, focus order, form behaviour — with no written gain to the user's task. Being distinctive is not a gain. `convention.md`. |
| `NG-UNREADABLE` | A readability floor breached: body under 16px, measure outside 45–75ch, a flat heading scale, or centred prose past three lines. `foundations.md` §2. |

`NG-NO-STRUCTURE`, `NG-NOVELTY-COST`, and `NG-UNREADABLE` are where generated work fails
most often and where a screenshot hides it best: a page can look plausible cropped and
still be an unstructured stack in the default palette that nobody can comfortably read.

The next six are the escalation cases — narrow, concrete, and each one a finding that a
softer severity would let ship as a "known issue":

| id | Condition |
|---|---|
| `NG-DESTRUCTIVE` | A destructive action with no confirmation, no undo, and no visual treatment distinct from a routine action — all three missing, not one. |
| `NG-TRUNCATED` | Content truncated with no way to reach the full value — no tooltip, `title`, or expanded view. |
| `NG-HIDDEN-CUE` | Content or a control reachable only past a scroll edge or behind a disclosure with no visible cue that it's there. |
| `NG-ERROR-RECOVERY` | An error that names no way to recover from it — what happened with no why, or why with no next step. |
| `NG-COLOR-MISUSE` | A semantic colour used against its own meaning — the danger hue on a non-destructive action, a status colour repurposed as decoration. |
| `NG-MOTION-ONLY-STATE` | A state change carried by motion alone, with no colour, icon, or label left behind when the animation doesn't run. |

`NG-UNCHECKED-CLAIM` is the one that matters most, because it is the only one that
corrupts every other row. A build with a contrast failure is a build with a bug. A
report claiming contrast was checked when it was not is a build with a bug **and** a
reason nobody will look for it.

---

## Go — all must be true

Not the absence of the above. These are positive, and each has to be answerable out
loud in one sentence.

| id | Condition |
|---|---|
| `GO-DERIVED` | Every significant choice traces to something true about the subject, the audience, or the job. "It looks good" is not a trace. |
| `GO-NAMEABLE` | The direction can be named in one sentence, and the thing built matches that sentence. |
| `GO-SPEC` | Every value came from a written spec, and the spec exists in the repo rather than in the conversation. |
| `GO-STATES` | Every state that can occur exists, and you can say which ones can occur and why the others cannot. |
| `GO-MEASURED` | The measurable half was measured with the scripts. The judged half is reported as judged, separately, without a number. |
| `GO-ARCHETYPE` | The register and the use-case archetype are named in the output, and the density, motion budget, and colour strategy follow from them. |
| `GO-MATERIAL` | One icon set, one elevation language with one light direction, one radius rule, one border token, one date and number treatment. `elements.md` §"Making them agree". |
| `GO-SIGNATURE` | The one thing this will be remembered by is nameable, and it comes from the subject rather than a catalogue of effects. |
| `GO-SURVIVES` | It holds up squinted and in grayscale: the intended first stop is still first. |
| `GO-GAPS-NAMED` | What was not covered is stated plainly, before the user has to ask. |

---

## The grey zone

Most real findings are neither. A cramped gutter, a heading one step too large, a hover
that feels slow — these are **findings, not blocks**. Report them with severity and
ship, unless the user asked for a polish pass, in which case fix them.

The line: **a no-go is something that makes the interface wrong or unusable for
somebody. A finding is something that makes it worse.** If you are arguing with yourself
about which, it is a finding.

## Exceptions

A no-go can be waived exactly once per occurrence, in writing:

1. The user asks for it explicitly, or the constraint genuinely cannot be met here.
2. It goes in `DESIGN.md` with a date, the rule id, and the reason.
3. It is stated in the report, not buried.

An exception nobody wrote down is not an exception, it is the rule being ignored. Three
waivers of the same rule is not three exceptions; it is a spec that is wrong, and the
spec gets fixed instead.

## What is *not* a no-go

The gate has to refuse ordinary work as rarely as it refuses defects, or people learn to
route around it.

- **Unconventional expression is not a no-go.** A palette, type system, or composition
  with no precedent in the training data is the goal, not the risk. Unconventional
  *mechanics* are a different matter and are gated by `NG-NOVELTY-COST` — the split is
  in `convention.md`.
- **Sparse is not a no-go.** Emptiness that the content earns is a decision.
- **Loud is not a no-go**, and neither is quiet. Register decides, not preference.
- **A low slop-index score is not a no-go.** It is a regression guard. Optimising against
  it is how the guard becomes the target and stops guarding anything.
- **Disagreeing with the user's brief is not a no-go.** Say so once, then build what they
  asked for.
- **A finding you cannot fix inside this scope is not a no-go.** Name it and hand it over.

## Reporting the verdict

One line, first, before anything else:

> **Go.** 2 findings, both P2, listed below.
> **No-go — `NG-MISSING-STATE`.** The table has no error state and the endpoint can fail.

Never bury a no-go under a description of what went well, and never report `Go` while
listing something from the no-go table as a "known issue". Those are the same sentence
written two ways, and only one of them is honest.
