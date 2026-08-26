# UX Methods

Read this when the question is about behavior, flow, or comprehension rather than surface. These are tools for *deriving* design decisions, and for defending them with something better than preference.

**Contents**
1. [Framing the problem](#1-framing-the-problem)
2. [Laws of UX](#2-laws-of-ux-and-what-they-actually-license)
3. [Heuristics for evaluation](#3-heuristics-for-evaluation)
4. [Information architecture](#4-information-architecture)
5. [Interaction and state](#5-interaction-and-state)
6. [Cognitive load](#6-cognitive-load)
7. [Emotional design](#7-emotional-design)
8. [Accessibility floor](#8-accessibility-floor)
9. [Deciding without users in the room](#9-deciding-without-users-in-the-room)

---

## 1. Framing the problem

**Jobs to be Done.** People don't want a feature; they hire a product to make progress in a situation. Frame as: *When [situation], I want to [motivation], so I can [outcome].* This is more useful than personas for design decisions because it names the moment, and the moment determines the layout.

**The one job.** Every screen has exactly one job. If you can't name it in a sentence, the screen is doing two things and should probably be two screens — or one of the two things is secondary and should look it.

**First-run vs. thousandth-run.** These want opposite designs. First-run wants explanation, defaults, and a single path. Thousandth-run wants density, shortcuts, and no explanation. Decide which you're optimizing and let the other be merely acceptable. Trying to serve both equally serves neither.

**The critical moment.** Name the single interaction where the product either earns trust or loses it — the first search, the first upload, the moment the result appears. Design that moment first and let the rest follow from it.

---

## 2. Laws of UX (and what they actually license)

**Jakob's Law** — people spend most of their time on other products, so they expect yours to work the same way. *License:* borrow conventions freely for anything that isn't your differentiator. Break them only where breaking them is the point, and expect to pay in learning time.

**Fitts's Law** — time to hit a target scales with distance and inversely with size. *License:* primary actions get to be big and near the user's resting position (thumb zone on mobile, near current focus on desktop). Destructive actions get to be small and far. Screen edges are infinitely deep targets.

**Hick's Law** — decision time grows with the number and complexity of choices. *License:* progressive disclosure, sensible defaults, and categorization. But note the limit — for *expert* users doing a known task, a long visible list beats a short nested one. Hick's Law argues for fewer choices at a decision point, not fewer features.

**Miller's Law** — working memory holds roughly 5–9 chunks. *License:* chunking. Group related items so the user holds groups rather than items. Don't use it to justify arbitrary "max 7 nav items" rules.

**Tesler's Law (conservation of complexity)** — every system has irreducible complexity; the only question is who absorbs it. *License:* move complexity into the product (smart defaults, inference, automation) rather than onto the user — but be honest that you're moving it, not deleting it.

**Doherty Threshold** — response under ~400ms keeps a user in flow; above it, attention leaves. *License:* optimistic UI, skeleton states, and immediate acknowledgement of input. Perceived performance is a design responsibility, not just an engineering one.

**Peak-End Rule** — people judge an experience by its most intense moment and its ending. *License:* invest disproportionately in the peak moment and the completion state. A great empty-to-first-success arc outweighs a hundred mediocre screens.

**Von Restorff (isolation) effect** — the item that differs is the one remembered. *License:* exactly one thing per screen may be visually exceptional. Two exceptional things cancel.

**Serial position effect** — first and last items are recalled best. *License:* put the most important nav and list items at the ends.

**Zeigarnik effect** — incomplete tasks stay in memory. *License:* progress indicators and checklists genuinely drive completion — but they manufacture obligation, so use them where completion serves the user.

**Postel's Law** — be liberal in what you accept from the user. *License:* accept phone numbers with spaces, dates in any format, pasted text with whitespace. Never make a person format data for the machine's convenience.

**Gestalt principles** — proximity, similarity, closure, continuity, common region, common fate. *License:* this is the actual mechanism behind grouping. Proximity beats borders. If two things are related, move them closer before you draw a box around them.

---

## 3. Heuristics for evaluation

Nielsen's ten, compressed to what you'd actually check:

1. **Visibility of system status** — does the user always know what's happening and what state they're in?
2. **Match to the real world** — does it use the user's vocabulary, not the system's internals?
3. **User control and freedom** — is there an obvious exit, undo, and back from every state?
4. **Consistency and standards** — does the same word mean the same thing everywhere? Does the same control look the same everywhere?
5. **Error prevention** — are destructive actions guarded, confirmable, and reversible? Prevention beats good error messages.
6. **Recognition over recall** — is the information needed to act visible at the point of acting, rather than remembered from a previous screen?
7. **Flexibility and efficiency** — are there accelerators for experts that don't burden novices?
8. **Aesthetic and minimalist design** — does every element compete for attention only in proportion to its importance?
9. **Error recovery** — do errors say what happened, why, and exactly what to do next, in plain language?
10. **Help and documentation** — is help available at the point of confusion rather than in a separate manual?

**Using these in a critique:** don't recite them. Find the two or three that the design actually violates, point at the specific evidence, and propose the fix.

---

## 4. Information architecture

- **Organizational schemes** — alphabetical, chronological, by topic, by task, by audience, by hierarchy. Pick based on how the user will *look*, not how the content is *structured*. People search by task far more than by category.
- **Breadth vs. depth** — flatter is usually better for findability up to about 15 items per level; deeper is better once labels get vague. Vague labels are the real cost of depth.
- **Labeling** — the most common IA failure. Labels should be the user's word, tested by whether someone could guess what's behind it without clicking. "Resources," "Solutions," and "More" are all confessions that the grouping is unclear.
- **Navigation types** — global (constant), local (contextual), contextual (inline links), supplemental (sitemap, index), and search. Most products need three of these, not one.
- **Progressive disclosure** — show the common case; reveal the rest on demand. The failure mode is hiding something people need every time. Rule: if more than ~20% of sessions need it, it isn't advanced.
- **Card sorting / tree testing** — when you genuinely don't know how people group things, say so and propose the test rather than guessing confidently.

---

## 5. Interaction and state

**Design every state, not just the happy one.** For each meaningful component: empty, loading, partial, ideal, error, too-much, offline, no-permission. Most design work that "falls apart in production" fell apart because only the ideal state was designed.

- **Empty states** are the highest-leverage screen in most products. They're the first thing a new user sees and the only screen where you have their full attention. An empty state should explain the value, show what filled looks like, and offer one action.
- **Loading** — skeleton over spinner when layout is predictable; spinner only for indeterminate short waits; progress bar with real estimate for anything over ~5 seconds. Never show a loading state for under 300ms; it flashes and feels *slower*.
- **Errors** — state what happened, why, and the next action. In the interface's voice, not a person's apology. Never blame the user, never expose a stack trace, never use a modal for a recoverable error.
- **Destructive actions** — undo beats confirm. A confirmation dialog trains people to click through it; a 10-second undo actually saves them.
- **Forms** — one column, labels above fields, group related fields, validate on blur (not on every keystroke), show requirements before the user violates them, never clear a form on error, and mark optional rather than required when most fields are required.
- **Feedback** — every action needs a response within 100ms even if the result takes longer. Silence reads as breakage.

---

## 6. Cognitive load

Three kinds, and only one is worth cutting:

- **Intrinsic** — the inherent difficulty of the task. Can't be removed, only supported (better defaults, examples, inline guidance).
- **Extraneous** — load created by the interface itself: inconsistent patterns, unclear labels, unnecessary decisions, visual noise. **This is the one design removes.**
- **Germane** — load spent building a mental model. Worth preserving; this is how someone becomes an expert user.

Practical reducers: sensible defaults, inline examples over placeholder text, one decision per screen during onboarding, consistent placement (people learn locations before labels), and removing options that fewer than 5% of users change.

---

## 7. Emotional design

Norman's three levels, useful for deciding where to spend:

- **Visceral** — the immediate gut reaction to appearance. This is the first 50ms, and it sets trust before a single word is read.
- **Behavioral** — the pleasure of use. Responsiveness, feel, control, competence.
- **Reflective** — what using it says about the person. Identity, story, meaning, the thing they'd tell a colleague.

Most products over-invest at the visceral level and under-invest at the behavioral. A beautiful product that feels sluggish loses to a plain one that feels instant.

**Delight has a budget.** One well-placed moment of unexpected craft is memorable; delight everywhere is a tax on repeat use. Ask of any flourish: how does this feel on the two-hundredth encounter?

---

## 8. Accessibility floor

Non-negotiable, and built in silently rather than presented as a feature:

- **Contrast** — 4.5:1 for body text, 3:1 for large text (18.66px+ bold or 24px+) and for UI component boundaries and states. Check the worst case, not the average.
- **Color independence** — every distinction carried by color also carried by shape, position, weight, or label. Test in grayscale.
- **Keyboard** — full operability, logical tab order, visible focus (never `outline: none` without a replacement), no traps, skip-to-content.
- **Targets** — 44×44px minimum on touch, with adequate spacing between adjacent targets.
- **Motion** — honor `prefers-reduced-motion`; no vestibular triggers (large parallax, spin, zoom) without an off switch. No flashing above 3Hz.
- **Semantics** — real headings in order, real buttons for actions and links for navigation, labels tied to inputs, alt text that conveys purpose rather than describing pixels.
- **Text** — resizable to 200% without loss, line length 45–75 characters, never disable zoom.

---

## 9. Deciding without users in the room

You usually won't have research. Be honest about the epistemics rather than dressing preference as evidence:

- **State the assumption.** "This assumes users arrive knowing what they want" is a testable claim; "this is more intuitive" isn't.
- **Reason from the closest analogue.** What does the audience already use daily? That's their expectation baseline, and it's real evidence.
- **Name the cheapest test.** Five-second test for first impressions, tree test for IA, unmoderated task test for flows, and a preference test only when the question genuinely is preference.
- **Separate confidence levels.** Contrast ratios are facts. Fitts's Law is established. "Users will find the sidebar overwhelming" is a hypothesis. Say which is which.
- **Watch for the designer's fallacy** — you are not the user, you have seen this screen four hundred times, and everything is obvious to the person who built it.
