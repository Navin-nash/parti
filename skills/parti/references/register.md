# Register

Read this after the brief, before any palette, type, or layout name. A tax tool and a hotel site that share a craft playbook have already failed.

**Name exactly one register. Write it in the output. Load only that register's rules.** Mixing them is how a settings page gets a cinematic hero and a landing page gets a 1.125 type scale.

**Then name the archetype underneath it.** Register is one bit of information, and it is not enough on its own: a trading terminal and a meditation app are both product, and a design that suits one is a failure in the other. `references/use-case.md` sets density, motion budget, type, colour strategy, and the failure everyone makes in that category.

| | Brand | Product |
|---|---|---|
| Stance | Design *is* the product. Impression is the deliverable. | Design *serves* the product. The tool should disappear into the task. |
| Surfaces | Landing, campaign, portfolio, about, long-form, marketing | App shell, dashboard, settings, data tables, authenticated tools |
| Quality bar | Distinctiveness. A visitor should not be able to name the generator. | Earned familiarity. A user fluent in Linear / Figma / Stripe should trust it without pausing. |
| Failure mode | Flatness, category-reflex aesthetics, unchosen cream/serif. | Strangeness without purpose: display fonts on labels, gratuitous motion, invented affordances. |
| Type | Display pairing allowed. Fluid clamp on marketing heroes. | One family is often right. Fixed rem scale. Tighter ratio (1.125–1.2). |
| Color strategy default | Committed or Full — identity has to carry. | Restrained. Accent on primary action, selection, and state — not decoration. |
| Motion | Rare, cinematic, one moment. | Frequency-gated. 100+/day and keyboard: never animate. UI under 300ms. |
| Light/dark | Forced by the **scene sentence**, never by category. | Same. Daily tools often follow ambient light the user already works in. |

If the request spans both (marketing site *and* the app), say so and treat each surface as its own register. Do not average them.

---

## Scene sentence (before light/dark, before palette)

One physical sentence: who uses this, where, under what light, in what mood.

- Weak: "This is a modern fintech dashboard."
- Strong: "A freelancer at a kitchen table at 11pm, laptop glare, trying to finish quarterly estimates before bed."

If the sentence doesn't force light vs dark, it isn't concrete enough. Add detail until it does. Then pick a **color strategy** before any hex:

| Strategy | What it means | Default for |
|---|---|---|
| **Restrained** | Tinted neutrals + one accent ≤10% of surface | Product |
| **Committed** | One saturated color carries 30–60% of surface | Brand with a strong identity color |
| **Full** | 3–4 named roles, each deliberate | Brand campaigns, data viz |
| **Drenched** | The surface *is* the color | Brand heroes only |

"Warm" / "premium" / "trustworthy" are not strategies and are not a license for cream body backgrounds. Warmth lives in accent, type, and imagery.

---

## Second-order slop (both registers)

- **First-order:** could someone guess theme + palette from the category alone? (Tax → paper cream + green. SaaS → bento + violet.) Restart.
- **Second-order:** could they guess the *aesthetic family* from category plus the obvious anti-reference? (Tax that's "not a dashboard" → editorial serif ledger. AI tool that's "not cream" → dark terminal.) That's the trap one tier deeper. Name the lane you're about to occupy. If it is the saturated counter-cliché for this category, look further.

Brand-register saturated lanes (2026): editorial-typographic (display serif italic + mono labels + hairline rules, no imagery); cream + terracotta + Fraunces; glass cards on a purple mesh; acid-green on black with tracked eyebrows.

Product-register saturated lanes: every settings page as a marketing hero; Inter + zinc + equal card grid; fade-up-on-scroll on a daily tool.

---

## Brief block (write into DESIGN.md)

```markdown
## Brief
- **Register:** brand | product
- **Scene:** [the physical sentence]
- **Strategy:** restrained | committed | full | drenched
- **Job / audience / frequency:** [from explore Step 1]
```

Do not add a second source-of-truth file (`PRODUCT.md`). If one already exists from another skill, read it as input, then fold the binding bits into this Brief.

---

## Rationalizations (from baseline runs)

| Excuse | Reality |
|---|---|
| "The brief said premium, so cream/paper is fine." | Premium is not a substrate. Cream-on-warm-serif is the first-order tax/SaaS/consumer reflex. |
| "Product UI can still have a cinematic hero — it looks more designed." | Product register: no marketing hero on tools used 5–20× a week. Density and labels, not display type. |
| "Editorial serif makes a tax product feel trustworthy." | That's second-order slop (not-a-dashboard → ledger). Trust in this subject is earned by figures, sequence, and plain language. |
| "Make it look premium" with no subject → pick Linear/Stripe dark luxury. | No subject means you still pin a subject or refuse a vibe menu. Style is derived, never selected. |
