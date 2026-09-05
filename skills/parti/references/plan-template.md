# Plan Template

The handoff artifact. A plan exists so a **different agent, or a cheaper model, or a human on Monday** — with zero context from this conversation — can execute a design change and verify it landed.

Write plans when the user wants work queued rather than done now, when the change is larger than one sitting, or when execution is going to a different agent than the one that did the thinking. When you're going to build it yourself in the same session, skip this and go to Build mode — a plan you immediately execute yourself is ceremony.

## Where they live

```
plans/
  README.md            ← index: order, dependencies, status
  001-<slug>.md
  002-<slug>.md
```

`plans/` in the repo root, or `design-plans/` if `plans/` is already in use for something else (say which you chose). Numbering is monotonic — read the existing index before adding, never renumber, and mark superseded plans stale rather than deleting them.

Stamp every plan with the commit it was written against: `git rev-parse --short HEAD`. That's how the executor detects drift.

---

## The rule that makes a plan work

**The executor has zero taste and zero context.** Every value is inlined; nothing is referenced.

| Never write | Write |
|---|---|
| "use the easing we discussed" | `cubic-bezier(0.16, 1, 0.3, 1)` |
| "match the existing card style" | the exemplar file path + a code excerpt from it |
| "tighten the spacing" | `padding: var(--s-4)` → `var(--s-3)`, in these 3 files |
| "make it feel more responsive" | duration `320ms` → `180ms` |
| "follow the design system" | the six tokens it touches, listed |
| "works correctly" as done criteria | the command and the expected output |

Excerpts come from **your own reads**, never from an agent's report. Open every cited file before writing the plan — a wrong excerpt becomes a plan that fails its own drift check and an executor that improvises.

---

## Template

```markdown
# NNN — <Imperative title>

**Written against:** `<short-sha>` · **Severity:** P0/P1/P2 · **Effort:** S/M/L · **Risk:** LOW/MED/HIGH
**Depends on:** none | plan NNN
**Status:** TODO

## Why this matters

Two to four sentences. What is being paid for the current state, concretely, and
who pays it. Enough that the executor understands the goal well enough to notice
if a step would defeat it — not a rationale essay.

## Scope

**In scope**
- `path/to/file.tsx`
- `path/to/other.css`

**Out of scope — do not touch**
- `path/that/looks/related.tsx` — <one line on why it's excluded>
- Any file not listed above.

**If it turns out that <X>, STOP and report back instead of improvising.**

## Current state

`path/to/file.tsx:34-41`
```tsx
<excerpt, verbatim, as it exists at the stamped commit>
```

<One sentence naming what's wrong with it, in the vocabulary of the rule catalog
where one applies: `[easing-ease-in-on-ui]`, `[perf-layout-property]`, etc.>

## Target

The exact values. Every one of them. No ranges unless the range is the spec.

| Property | From | To |
|---|---|---|
| duration | `420ms` | `180ms` |
| easing | `ease-in` | `var(--ease-out)` |
| transform-origin | `center` | `var(--transform-origin)` |

Tokens this uses — all of them already exist in `<token file path>`:
```css
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
--dur-2: 180ms;
```

<If a token does NOT exist yet, adding it is step 1 of this plan, with its
exact value and the exact file and line region it goes in. Never let an
executor invent one.>

## Conventions to match

The repo does this like so — follow it, don't introduce a second pattern:

`path/to/exemplar.tsx:12-20`
```tsx
<excerpt from an existing file that already does it right>
```

## Steps

1. <One concrete action, one file.>
   **Verify:** `<command>` → expected: `<output>`
2. <Next action.>
   **Verify:** `<command>` → expected: `<output>`
3. ...

## Done criteria

Machine-checkable. Commands and expected results, not prose.

- [ ] `python scripts/motion.py <path>` reports 0 findings for `<rule-id>` (was N)
- [ ] `python scripts/lint.py <path> --tokens tokens.json` exits 0
- [ ] `python scripts/color.py check palette.json` — every pair AA or better
- [ ] `<typecheck / build / test command>` passes
- [ ] No new hex color appears in the diff

## States and accessibility

Not optional, not a follow-up. If this plan touches a component, the component
still has to have all of these when the plan is done:

- [ ] empty (first-run and cleared-by-user) · loading · partial · ideal · error · overflow
- [ ] visible focus state, keyboard-operable, ≥44px target
- [ ] `prefers-reduced-motion` branch present for anything that moves
- [ ] contrast verified, ratio stated

## Feel-check

<For anything that can't be judged from code — a crossfade, a spring's bounce,
an opacity/height pair, a gesture. Name the specific check:>

- Play at 3× duration in the DevTools animation inspector; the two states should
  never both be legible at once.
- Test the drag on a real phone, not a trackpad.
- Look at it again the next day.

<If nothing here needs feel-checking, write "None — every value is measurable."
Don't pad it.>

## Maintenance note

What future work will interact with this, and what a reviewer should watch for.
One or two sentences. E.g. "any new overlay component must use `--ease-out` and
`var(--transform-origin)`; a fourth hand-typed cubic-bezier is a regression."
```

---

## The index — `plans/README.md`

```markdown
# Design plans

Written against `<short-sha>` on <date>. Effort level: <quick|standard|deep>.

## Order

| # | Plan | Sev | Effort | Depends on | Status |
|---|---|---|---|---|---|
| 001 | Consolidate the four easing curves into two tokens | P2 | S | — | TODO |
| 002 | Fix `ease-in` on all overlay entrances | P0 | S | 001 | TODO |
| 003 | Give every pressable element an `:active` state | P1 | M | 001 | TODO |

## Not audited

<What the effort level excluded.>

## Considered and rejected

- `transform-origin: center` on `Dialog` — correct; modals aren't trigger-anchored.
- 600ms hero sequence on the marketing page — deliberate, once per session, documented in DESIGN.md.
```

Statuses: `TODO` → `IN PROGRESS` → `DONE` / `BLOCKED` / `STALE`. The executor updates them.

---

## Reviewing a plan before it ships

If you wrote the plan in this session, you will mentally fill gaps the executor can't. **Have a fresh-context agent read it cold** and report every ambiguity, then fix those. Self-critique reliably misses exactly the gaps that matter.

Check against these, which are how plans fail in practice:

- A value that appears as a range where the executor needs one number.
- A step whose verification is "check it looks right."
- A reference to something not in the plan ("the pattern from the header").
- A token used but never defined, and not confirmed to already exist.
- Scope that says what to change but not what to leave alone.
- No escape hatch, so an executor hitting a surprise invents a solution.

---

## Executing and reconciling

**Executing.** Dispatch one plan to an executor in an isolated worktree, then review the diff like a tech lead: re-run the done criteria yourself, confirm every hunk traces to a numbered step, and reject anything out of scope however plausible it looks. An executor that also "fixed the spacing while it was in there" produced an unreviewed change. Then run the three checks in `references/verify.md` on the result — a plan's done criteria are a subset of them, not a replacement.

**Reconciling.** Re-check `plans/` against the current code: mark landed plans `DONE`, investigate `BLOCKED` ones, refresh `file:line` references that drifted since the stamped commit, and retire findings that someone fixed another way. Then sync `DESIGN.md` with whatever the executed plans decided that the spec left open.
