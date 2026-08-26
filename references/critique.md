# Critique

Two protocols: one for auditing your own proposed directions before you recommend them, one for auditing someone else's existing design.

---

## 1. The anti-slop pass (run on your own work)

Generated design converges. Not because the models lack ability, but because everyone trained on the same portfolio sites and the same component libraries. The tells below are not *bad* — several are legitimate answers to some briefs. They're bad **as defaults**, chosen without a reason specific to the brief.

**The test for every item on this list:** can you name something true about *this* subject, audience, or content that produced this choice? If the answer is "it looks good," cut it and choose again.

### The recognizable looks

1. **AI cream** — warm off-white background near `#F4F1EA`, high-contrast serif display, terracotta/clay accent near `#D97757`. The single most recognizable tell of 2024–26 generated design.
2. **Acid on black** — near-black background, one bright acid-green or vermilion accent, monospace eyebrow labels.
3. **The broadsheet** — hairline rules, zero radius, dense faux-newspaper columns applied to four items of content.
4. **Glass over mesh** — frosted translucent card floating on an animated gradient mesh, usually purple-to-blue.
5. **Neo-brutalist theme pack** — thick black borders and hard offset shadows on every element without exception.

### The component tells

6. **Inter (or Geist, or DM Sans) for everything** — a neutral grotesque doing display, body, and utility duty. Not wrong; just an absence of a decision.
7. **Purple-to-blue gradient** on the CTA, the logo, the heading, and the background blur — specifically `#8B5CF6`-to-`#3B82F6` (Tailwind's default violet/purple paired with its default blue). This exact pair is now the single most identifying fingerprint of AI-generated UI, more so than any other tell on this list; it's what people mean when they say a page "looks AI."
8. **Rounded-square icon tile above every heading** — the 48px gradient square with a Lucide icon in it, repeated across three feature cards.
9. **Cards inside cards inside cards** — nested containers each with their own border, radius, and shadow.
10. **Bento by default** — the modular tile grid reached for whenever there are more than three features.
11. **The KPI row** — four equal boxes with a big number, a small label, and a green up-arrow, at the top of every dashboard.
12. **01 / 02 / 03 numbering** on content that isn't a sequence.
13. **Gray text on colored backgrounds** — `#6B7280` body text that fails contrast the moment the background isn't white.
14. **Everything at 12px radius** — one radius value applied uniformly, including to things that should be square or fully round.
15. **Uniform shadow** — the same `0 4px 6px rgba(0,0,0,0.1)` on every elevated surface regardless of elevation.
16. **The three-column feature grid** with icon, bold heading, two lines of gray text. Identical on every product page ever generated.
17. **Fade-up-on-scroll on everything** — every section entering with the same 20px translate and 500ms fade.
18. **Testimonial cards with generated avatars** and quotes that no human said.
19. **"Powerful. Simple. Fast."** — three-word feature headlines that describe nothing.
20. **Emoji as icons** in a product interface.

### Structural tells

21. **Symmetry everywhere** — perfectly centered hero, perfectly equal columns, no tension anywhere.
22. **The hero that says nothing** — a big claim, a subhead restating the claim, two buttons, and an abstract illustration. The hero should be a *thesis*: the most characteristic thing in the subject's world.
23. **Lorem-shaped real copy** — text that occupies the right amount of space and communicates nothing. Copy makes a design feel templated as fast as layout does.
24. **No opinion about density** — everything at a comfortable medium, because medium is the default rather than a decision the content demanded.
25. **Motion without a source** — animation applied because a page should have some, rather than because a specific relationship or state change needs explaining.
26. **Overcorrection** — recognizing a design reads as generic and responding by piling on parallax, custom cursors, animated backgrounds, and gratuitous glow. This reads as noise, not as fixed, and it's the most common failure mode of a *second* pass at a slop-flagged design. The fix for generic is specific, not loud — go back to Step 2 and derive from the subject, don't decorate the same structure harder.

### Running the pass

Go through your three directions. For each tell present, either **justify it from the brief in one sentence** or **replace it.** Then report what you changed:

> Direction 2 had the default 48px gradient icon tiles. Replaced with the actual form-field glyphs from the grant documents this product parses — the icons now come from the subject's own world.

If a direction survives with nothing changed, it's probably too safe. Check again.

---

## 2. The redesign audit (run on someone else's work)

### Order of operations

**Understand before judging.** What was this trying to do? What constraints produced it — legacy, brand mandate, technical limit, a real user need you can't see? Some ugly things are load-bearing. Ask, or state the assumption.

**Then diagnose in four buckets.** Keep them separate; they have different authority:

| Bucket | What it is | Your standing |
|---|---|---|
| **A. Usability failure** | People can't complete the job, or complete it wrongly | Raise unprompted. This is objective. |
| **B. System failure** | Inconsistency, no scale, arbitrary values, states undesigned | Raise unprompted. Objectively fixable. |
| **C. Dated convention** | Patterns that have aged out and now cost credibility | Raise, but note it's a positioning call, not a defect. |
| **D. Taste** | You'd have done it differently | Only if asked. Label it as taste when you say it. |

Collapsing D into A — dressing preference as usability — is the fastest way to lose the client's trust and it's the most common failure in AI design critique.

### Severity rubric

- **Blocker** — prevents task completion, or fails accessibility law. Fix now.
- **High** — measurably slows or misleads a majority of users; hierarchy inversions, unlabeled destructive actions, illegible contrast.
- **Medium** — inconsistency, missing states, weak information scent. Costs polish and compounds over time.
- **Low** — refinement: optical alignment, easing curves, spacing rhythm, copy tone.
- **Note** — taste, opportunity, or a question.

### Evidence, not adjectives

Every finding needs a specific referent and a specific fix.

- Weak: "the page feels cluttered and the hierarchy is off"
- Strong: "hierarchy inverts in the pricing card — 'Contact sales' has the highest contrast on the screen while 'Start free' is a ghost button, so the low-intent action is winning attention. Swap the emphasis."

- Weak: "the colors don't work"
- Strong: "body text is `#8A8F98` on `#F7F7F8` — 2.9:1, below the 4.5:1 floor. Darkening to `#5A5F68` gets it to 4.6:1 with no other change."

### What to keep

End every audit with an explicit **keep list.** Users have muscle memory, and a redesign that relocates everything taxes the people who liked the product most. Name what's working and what stays put, with the reason.

### Two scales, always offered

- **Surgical** — the 5–8 highest-leverage fixes inside the existing system. Days of work, low risk, most of the perceived gain. Most people asking for a redesign want this and don't know to ask for it.
- **Directional** — the full three-direction process. Weeks of work, real risk, warranted when the current design's *premise* is wrong rather than its execution.

Say which you'd recommend and why. Recommending the expensive one by default is a tell of its own.

---

## 3. Self-critique disciplines

Apply to any direction before it leaves your hands:

- **Chanel's mirror** — remove one element from each direction and see if it got better. Name what you removed. It usually did get better.
- **Spend boldness once** — one signature element is memorable; two are noise. If two things are shouting, quiet one.
- **The grayscale test** — screenshot in grayscale. If the hierarchy collapses, it was carried entirely by color.
- **The squint test** — blur it. The reading order should still be obvious from mass and position alone.
- **The generic-prompt test** — would you have produced roughly this for a different subject in the same category? If yes, nothing here came from *this* brief.
- **The two-hundredth-encounter test** — for anything delightful, imagine the two-hundredth time. Delight that survives repetition stays; delight that grates goes.
- **The cost sentence** — you should be able to finish "this direction gives up ___." If you can't, you haven't made a choice; you've made a compromise.
