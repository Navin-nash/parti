# From finding to change

`verify.md` says what to run. This says what to do with what comes back.

Without this the loop has a hole in the middle: findings get read, the obvious ones get
patched where they were reported, and the same class of defect returns next build because
nothing changed at the level that caused it. Worse, findings get *satisfied* rather than
fixed — the value nudged until the detector goes quiet, which improves the report and
nothing else.

**The loop, once:**

```
run the checks  →  triage every finding  →  choose the level  →  change it
      ↑                                                              ↓
      └──────────────  re-run everything  ←──────────────────────────┘
                              ↓
                    report, sync DESIGN.md
```

---

## 1. Triage: every finding is exactly one of four things

Decide this **before** touching anything. Most bad remediation is a correct fix applied to
a misdiagnosed finding.

| Kind | What it means | Required action |
|---|---|---|
| **Code defect** | The build disagrees with the spec, and the spec is right. | Fix the code. Most findings. |
| **Spec defect** | The build is right and the spec is wrong or silent. The value was needed and nothing legitimate covered it. | **Amend the spec first**, then re-run so the finding clears against the new spec. Never edit the code to fit a spec you already believe is wrong. |
| **Context exception** | The rule is right in general and wrong here, for a stated reason. | Write the exception down per `go-no-go.md` — dated, rule id, reason, in `DESIGN.md`. Then leave the code. An undocumented exception is the rule being ignored. |
| **Instrument defect** | The finding is wrong. The detector misread the code. | Do not change the design. Record it, and if it will recur, fix the detector and add a false-positive fixture (`evals/README.md` Layer 2). |

**The tie-break:** if you cannot tell a spec defect from a context exception, it is a spec
defect. Amending the spec is visible and reviewable; an exception is a note that one
person reads once.

**Three exceptions for the same rule is not three exceptions.** It is a spec that is
wrong. Fix the spec.

## 2. Choose the level: token, component, instance

A finding is reported at a line. That is where it was *detected*, not necessarily where it
should be *fixed*.

Ask: if this were fixed only here, would the same finding appear somewhere else in this
codebase? If yes, this is the wrong level.

| Fix at | When | Signal you got it wrong |
|---|---|---|
| **Token** | The value is used, or should be used, in more than one place. Colour, spacing step, radius, duration, density. | You are about to make the same edit a third time. |
| **Component** | The construction is wrong wherever this component appears — a missing focus state, an ungated hover, a missing state. | The finding lists several files that all render the same thing. |
| **Instance** | This one place genuinely differs, for a content reason. | You cannot say what makes this instance different. |

**Token drift is almost always a token-level fix.** Fourteen findings for one off-spec
colour is one decision, not fourteen. Patch them individually and you have made fourteen
edits, learned nothing, and left the reason intact.

## 3. Order

1. **Group by rule id first, not by file.** One rule across ten files is one fix.
2. **Then by level**: token fixes, then component, then instance. Token fixes often clear
   whole groups of lower-level findings, and doing them last means redoing work.
3. **Then by severity within the level**: P0, P1, P2.

Do not walk the findings list top to bottom. That is the order the script emitted, which
is file order, which correlates with nothing.

## 4. When findings conflict

Two findings sometimes pull opposite ways — raising contrast breaks the brand colour,
tightening density breaks a touch target. Precedence, highest first:

1. **Accessibility floors.** Contrast, focus, keyboard, target size. These do not lose to
   anything, including a brand guideline. If the brand colour cannot carry text at 4.5:1,
   the brand colour is not a text colour — it stays as a fill and the text role changes.
2. **Correctness and states.** A missing error state beats a spacing preference.
3. **The spec.** Token discipline beats local taste.
4. **The register and archetype.** A dashboard's density beats a general aesthetic
   guideline; `use-case.md` names which.
5. **Craft findings.** Rhythm, optical alignment, polish.

If a conflict is not resolved by this list, it is a design decision, not a remediation
decision — say so, state the trade, and let the user choose.

## 5. Re-verify

**Re-run the full check, not the file you touched.** A token change reaches everything
that reads the token, and the whole point of fixing at the token level is that it changes
places you did not open.

Then compare against the previous run, and account for three things:

- **Cleared** — expected.
- **Still present** — either the fix was at the wrong level, or the diagnosis was wrong.
  Go back to triage. Do not apply a second, more forceful fix on top of the first.
- **New** — the fix caused them. This is common and it is the reason re-verification is
  not optional. A contrast fix that darkens a token can break a border's non-text
  contrast somewhere else entirely.

**Never report a check you did not re-run.** `NG-UNCHECKED-CLAIM` applies here more than
anywhere, because the temptation is highest at the end of a long fix pass.

## 6. When the loop ends

Not at zero findings. It ends when **every finding is in one of four terminal states**:

- fixed, and re-verification confirms it,
- covered by a written exception with its reason,
- recorded as an instrument defect,
- or handed over as an out-of-scope finding, named, with a severity.

A finding that is none of these is an open loop, and the build is not done regardless of
how the report reads.

## 7. Repairs that are forbidden

Each of these makes the report better and the interface no different. They are the
Goodhart failure in its concrete forms.

- **Nudging a value to evade a detector.** Shifting a hex a few points to slip a hue band,
  renaming a token, reformatting a line so a pattern stops matching. Evading a tell is not
  choosing a design.
- **Adding a no-op.** A `prefers-reduced-motion` block that changes a 120ms colour fade to
  0ms clears a finding and does nothing for a user. If the rule does not apply, that is a
  documented exception, not a code change.
- **Deleting the evidence.** Removing the long string that overflowed, cutting the row that
  showed the alignment problem, replacing real content with shorter placeholder. The
  finding was about what happens with real content.
- **Suppressing.** Adding an ignore comment, excluding a path from the scan, dropping
  `--tokens` so drift stops being checked. If a check is wrong, fix the check.
- **Fixing the symptom at every call site** while leaving the cause. Ten guards where one
  belonged is a larger diff, not a smaller one.
- **Reporting a lower severity than the rule assigns** because the fix is inconvenient.

## 8. What gets written back

- **`DESIGN.md`** — every spec amendment and every exception, dated, with the rule id and
  the reason. This is the record that makes the next pass cheaper, and it is the only
  place an exception legitimately lives.
- **The build report** (`verify.md`) — counts before and after, each P0 and P1 with its
  disposition, and the deviations section filled in rather than empty by default.
- **Nothing else.** Do not write a summary of the findings into the code as comments.

## Worked example

Real output, `lint.py --tokens` over a build whose spec names four roles
(`--bg --surface --ink --accent`). Ten findings, abbreviated:

```
P0  Purple-to-blue gradient                      arm-baseline.html
P0  #6366f1 used but not in the token spec       (3 places)
P0  #6b7280 used but not in the token spec       (4 places)
P0  #e5e7eb used but not in the token spec       (4 places)
P0  #ffffff used but not in the token spec       (4 places)
P0  #f9fafb, #111827, #f3f4f6, #eef2ff, #fef3c7  (1-2 places each)
```

**Walking the list gives ten edits and teaches nothing.** The loop gives four decisions:

| Finding | Triage | Level | Change |
|---|---|---|---|
| `#6b7280` in 4 places | **Spec defect.** Secondary text is a real need and the spec has no role for it. | Token | Add `--ink-muted`, contrast-checked against `--surface`. Map all four. |
| `#e5e7eb` in 4 places | **Spec defect.** Same: no border role exists. | Token | Add `--rule`. Map all four. |
| `#ffffff`, `#f9fafb` | **Spec defect.** Two surface levels are in use and one is defined. | Token | Add the second surface level, or collapse to one if the second was not a decision. |
| `#6366f1` + the gradient | **Code defect.** The accent exists and this is not it — it is the default the build reached for. | Component | Replace with `--accent`. No new token; that is the finding. |
| `#111827` | **Code defect.** `--ink` exists. | Instance | Use the token. |
| `#eef2ff`, `#fef3c7` | **Spec defect.** Status tints have no roles. | Token | Add them, or drop the badge colours if status is already carried by text. |

Three spec amendments, one substitution, two mappings. **The ten findings were symptoms of
one cause: a spec with four roles describing an interface that needs nine.** Patching each
hex where it was reported would have produced ten edits, a green report, and the identical
spec — so the eleventh colour arrives next build and nobody knows why.

Then: re-run everything, confirm the count drops for the reason you expect rather than by
coincidence, write the three new roles into `DESIGN.md` with the date, and report the
before-and-after counts with each amendment named.

## Judged findings enter the same loop

Findings from squint, grayscale, hierarchy, copy, and concept have no rule id and no line
number, and they go through exactly the same eight steps. The difference is that their
severity is *argued* rather than computed, so the argument is written next to them.

A judged finding may not be reported as a measured one, and no judged finding gets a
number. `GO-MEASURED` in the gate is what keeps those halves apart.
