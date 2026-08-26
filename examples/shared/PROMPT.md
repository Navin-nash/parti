# The shared prompt

This exact text is given to both agents, verbatim and unmodified. It is the only design input either receives. It deliberately contains **no style guidance** — no palette, no typeface, no mood, no reference products — because the point of the comparison is what fills that gap when nothing is specified.

---

## Prompt

> Build a four-surface UI for **Meridian**, a flight-operations scheduling tool used by dispatchers at regional airlines. Dispatchers sit with it for a full 10-hour shift and use it to reassign aircraft and crew when a flight goes irregular (delay, diversion, mechanical, crew timeout).
>
> Build these four surfaces:
>
> 1. **Landing page** — marketing home. Hero, capability section, social proof, call to action.
> 2. **Pricing page** — three tiers, comparison, FAQ.
> 3. **Dashboard** — the main dispatcher screen. Live flight status, the day's disruptions, and whatever else the job needs.
> 4. **Components** — a data table of flights, shown in each of its states: populated, empty, loading, and error.
>
> Plain HTML and CSS. No frameworks, no build step, no CDN links. Each surface is a self-contained `.html` file plus one shared stylesheet. Use real, plausible content — no lorem ipsum, no "Feature One".
>
> This is production-facing work. Do your best.

---

## Why this subject

A generic subject ("a project management SaaS") lets both runs coast on category defaults, which makes the comparison meaningless — everything would look like every other project-management page and the baseline would be *correct* to produce that.

Meridian was chosen because it has strong **native material** to draw from that has nothing to do with SaaS convention: flight strips, timetables, tail numbers, dispatch-room screens, the vocabulary of irregular operations. Whether a run reaches for that material or reaches for the component library is the thing being measured.

It also has real constraints a design has to answer to: a 10-hour shift (fatigue, dim room), dense tabular data (alignment matters), and a job that is *interrupt-driven* (attention has to survive being pulled away and returned).

## Controls

| | Baseline agent | Parti agent |
|---|---|---|
| Prompt | identical | identical |
| Model | identical | identical |
| Stack constraint | plain HTML/CSS | plain HTML/CSS |
| Skill access | **explicitly denied** | **explicitly required** |
| Told it's a comparison | no | no |
| Told to do its best | yes | yes |

The baseline agent is instructed not to invoke any skill and not to read `SKILL.md`, `references/`, or anything under `.claude/` — necessary because this repository *is* the skill, so an uncontrolled agent would find it. This is the one place the comparison is enforced by instruction rather than by genuine absence, and it is stated here rather than buried.

Neither agent is told a comparison is happening. An agent that knows it is the "bad" arm produces a strawman, and an agent that knows it is the "good" arm overreaches.
