# Real-world test report

**Date:** 2026-09-01 · **Target:** `parti` script layer (Layer 2) against production codebases

Six real codebases, none written for this test and none produced by this skill. Every finding below was verified against source before being recorded.

| Codebase | Stack | Files scanned | Score | Band |
|---|---|---|---|---|
| `docu_web` | Next.js + Tailwind | 296 | 53.9 | Ad hoc |
| `core-engine` | React + CSS | 129 | 72.7 | Coherent |
| `friendtree` | React + CSS | 13 | 68.5 | Drifting |
| `BidRadar` | Next.js + Tailwind | 34 | 65.7 | Drifting |
| `BidAssist` | React | 192 | 61.1 | Drifting |
| `mongodb_lead_agent/mobile` | React Native | 100 | 71.3 | Coherent |

## What worked

- **No crashes** across 764 files and five different stacks, including one it does not claim to support.
- **Plausible discrimination.** Scores span 53.9–72.7 rather than clustering at a default, and the ordering broadly matched what inspection showed.
- **Contrast sampling found real problems.** `#4a7bff` on `#eeeeee` at 3.25:1 in `docu_web` is a genuine AA body failure.
- **`type_system` hedges correctly** — see Finding 2. It is the model the other dimensions should copy.

## Finding 1 — Generated assets silently corrupt the audit

**Severity: high · Confirmed · `docu_web`**

96% of all color evidence (7,751 of 8,103 hex occurrences) came from **two files in `public/`** — `ToHTML.html` and `test.html`, which are HWP document exports, not authored UI.

Consequences, all reported with full confidence and no warning:

| Reported | Reality |
|---|---|
| `10 families: FF3, FF1, FF2, FF0, FF4` | not typefaces — internal font ids from the document format |
| `6 distinct sizes: [1.17, 1.5, 2.0, …]` | document units, not px type scale |
| `286 unique colors` | 282 of them from generated exports |
| **53.9 / Ad hoc** | **58.7 / Drifting** when scoped to `src/` |

Scoping to authored source changes the **band**, and resolves the fake families to the real ones (`Apple SD Gothic Neo`, `-apple-system`, `Inter`).

`.next/` *is* correctly skipped. `public/` is not — and a fixture, export, or vendored HTML file there is indistinguishable from design intent to the current walker.

**Not universal:** the other five repos showed 0% contamination. The failure is silent when it happens, which is what makes it serious — nothing in the output suggests the evidence is unrepresentative.

**Recommended fix.** Do not simply add `public/` to `SKIP_DIRS` — real projects put real CSS there. Instead report concentration: when any single file contributes more than ~30% of the color evidence, name it and say so. A human resolves this instantly given the signal; the tool cannot resolve it reliably on its own.

## Finding 2 — Utility-class projects: one dimension hedges, the other asserts

**Severity: high · Confirmed · `BidRadar`, and any Tailwind codebase**

`audit.py` reads raw CSS declarations. Tailwind expresses spacing and type as utility classes, so both come back empty. The two dimensions then diverge:

```
Type System      10.0/20   "no explicit font sizes — likely utility classes; verify the scale manually"
Spatial Rhythm   10.2/15   "no base unit detected — spacing is arbitrary"
```

The first is **exactly right**: it names the limitation and hands the judgment back.

The second is a **false assertion**. `BidRadar`'s spacing is not arbitrary — it is Tailwind's 4px scale, used consistently:

```
p-2 p-3 p-4 p-5 p-6 p-8 · px-1…px-6 · py-0…py-12 · gap-1 gap-2 gap-3 gap-4 gap-6
```

The type scale is likewise real and legible: `text-xs` ×91, `text-sm` ×61, `text-2xl` ×20.

This matters disproportionately because **Tailwind is the dominant SaaS stack** — the one the skill's own build mode detects first.

**Recommended fix.** When utility classes are present, `spatial_rhythm` should hedge in `type_system`'s exact language rather than assert arbitrariness, and should not levy the penalty. Better still, parse the utility scale directly: `p-4`/`gap-2` are more machine-readable than raw CSS, not less.

## Finding 3 — Unreadable stacks score *higher*

**Severity: critical · Confirmed · React Native**

On a stack the skill does not claim (React Native, styles as JS objects), the audit reported:

```
TYPE   0 families · 0 distinct sizes
SPACE  0 values · base unit none detected
SHAPE  0 radii · 0 shadows
```

Every one of those is false:

| Reported | Actual |
|---|---|
| 0 font sizes | **64** `fontSize` declarations, 7 distinct values: 9, 12, 13, 15, 20, 28, 40 |
| 0 radii | **40** `borderRadius` declarations |
| 0 spacing values | padding/margin present throughout |

It scored **71.3 — "Coherent"**, second-highest of the six, and was told *"Sound underneath; the gaps are specific and cheap to close."*

**Absence of evidence was scored as evidence of quality.** This is the most dangerous failure mode an evaluation tool can have: the less it understands, the better the verdict it issues. A `9px`/`13px`/`15px` type scale is genuinely ad hoc and would have produced real findings had it been legible.

**Recommended fix.** Add a coverage check before scoring. If declarations-found per file falls below a floor, refuse to emit a score and report *"this stack is not readable by these scripts"*. A withheld number is honest; a flattering one is not. This is the same principle the skill already applies to screenshots — *"say so and score the judged half only"* — simply not yet applied to unparseable code.

## Finding 4 — Tell precision: role blindness

**Severity: medium · Confirmed · `BidRadar`**

The tell *"Mid-gray body text (#6B7280 family) as default"* flagged three files. Verified individually:

| File | Verdict |
|---|---|
| `page.tsx` | **true positive** — 15 × `text-gray-400`, 4 × `text-gray-500` as body text |
| `DashboardCharts.tsx` | **false positive** — 6 × `stroke="#6b7280"` on Recharts axes |
| `CompetitorCharts.tsx` | **false positive** — 2 × the same |

Gray on a chart axis is a correct choice, not a tell. The rule matches the value without seeing its role, so **2 of 3 flagged files are wrong** here — though the finding it exists for is genuinely present.

**Recommended fix.** Cheap and targeted: exclude matches inside `stroke=` / `fill=` attributes for this rule. The general problem — a value's role determining whether it's a tell — is not solvable by regex, which is an argument for reporting matches with their surrounding line so a human adjudicates, not for deleting the rule.

## Summary

| # | Finding | Severity | Affects |
|---|---|---|---|
| 1 | Generated assets corrupt the audit, silently | High | any repo with HTML in `public/` |
| 2 | `spatial_rhythm` asserts arbitrariness on utility classes | High | every Tailwind project |
| 3 | Unreadable stacks score higher | Critical | RN, CSS-in-JS, anything non-CSS |
| 4 | Tells are role-blind | Medium | charting code especially |

Findings 1 and 3 share a root cause worth naming: **the scripts have no notion of their own coverage.** They report what they found without reporting what fraction of the design they were able to see, so both a corrupted sample and an unreadable one produce confident output. A single coverage signal — *what did I actually parse, and how much of it is one file* — would address both.

None of this touches Layer 4. Whether the skill's *judgment* is good remains unbenchmarkable, and nothing here should be read as evidence about it.
