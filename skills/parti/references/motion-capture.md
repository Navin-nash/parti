# Reference Capture

`parti` specifies motion in prose and code and reviews it against a rule catalog, but a
screenshot — the only reference it took before — freezes one frame. Scroll choreography,
page-load sequences, stagger cadence, parallax depth, and easing *feel* live in time, not
pixels. This pipeline ingests them from a running page and makes them buildable in the user's
own stack.

`parti`'s governing rule is *"style is derived, never selected."* This pipeline's version:

> **Captured per element, never per site.** Every borrowed element lands in a dated record
> stating what it is, why it works, and whether it was copied faithfully or re-derived. The
> skill will not reproduce a site's identity — layout system + type + color + motion together —
> from one URL; that is **never a whole-site clone**. A request that amounts to it is surfaced
> as a conflict (name a specific element / run `explore` *informed by* the reference / go
> element-by-element), not executed.

Provenance **is** the anti-clone mechanism: nothing is borrowed silently.

**Read this when** a `parti` invocation includes an inspiration URL · you run `reference` or
`capture` directly · a `motion` pass asks for motion "like site X".

---

## 1. The one rule, and where it bites

| Trigger | What runs |
|---|---|
| URL in a `parti` invocation (`redesign my hero like stripe.com`) | `reference` runs first; one line: `Capturing stripe.com first (focus: hero motion). Say "skip capture" to work from description only.` |
| `parti reference https://siteX.com/pricing — the plan toggle` | explicit capture, stated focus |
| `motion` pass, "like site X" | `reference`, then the spec is written as a diff from the findings |
| Focus absent, or "the whole look" | **no capture.** The three options above, then wait. |

Multiple URLs (`reference A.com B.com`) produce one report whose findings are **unioned into a
single list** — the script does not tag each row with its source URL. The agent attributes each
finding to the URL it came from **when it renders the capture markdown** (it knows which page it
fetched what from). Still per element — no cross-site identity merge.

---

## 2. The three tiers

`scripts/capture.py` orchestrates. Tiers run **cheapest-first and stop once the stated focus is
answered.** The report always records which tier ran and what it could not see.

| Tier | What runs | Sees | Blind to |
|---|---|---|---|
| **Tier 1 — static** (always; stdlib only) | `scripts/capture.py`, `urllib` fetches the HTML + every linked stylesheet **by URL**; reads the `<script src>` list + inline `<script>` text for library fingerprinting only (it does not fetch that JS) | `@keyframes`, `transition` / `animation` shorthand + longhand, `cubic-bezier()` / `steps()`, `animation-timeline: scroll()` / `view()`, `@starting-style`, `transition-behavior: allow-discrete`, `@view-transition`, `view-transition-name`; library fingerprint (GSAP / ScrollTrigger / SplitText, Motion, Lenis, Locomotive, Swiper, AOS, Lottie, Rive, Three / R3F) from `<script src>` + chunk names; trigger hints `data-scroll`, `data-aos`, `data-speed`, `data-lag`, `data-gsap` | minified-JS motion (most React sites), canvas / WebGL, anything JS-triggered |
| **Tier 2 — Playwright runtime** (`--tier runtime` or `auto`) | headless Chromium; the import is guarded — absent → Tier 1 + a note. Runs even when Tier 1 got a 403 (many sites block non-browser requests but load in Chromium). One URL that fails to load is skipped, not fatal | `document.getAnimations()` at load **and re-read at each of 14 scroll steps** — a reveal that only instantiates when its section enters the viewport is caught and tagged `trigger: in-view / scroll`; `ScrollTrigger.getAll()` → each trigger's `start` / `end` / `scrub` / `pin` / `trigger` / `vars` (surfaced as its own `## ScrollTrigger` section — GSAP animates off the WAAPI so it won't appear in Motion findings); the scroll→property curve for the focus elements; a focus-element snapshot (trimmed `outerHTML`, computed box, states by synthetic toggle). A plain-English `--focus` resolves through a heuristic selector list (`[class*=hero]`, `main > section`, `section`, `[data-scroll]`, …) and the chosen selector is reported | needs `pip install playwright && playwright install chromium`; still can't read shader/canvas internals; a site that also bot-walls headless Chrome stays on Tier 1 (the report says so); GSAP/JS motion driven by direct style writes (not the WAAPI) shows up only in `## ScrollTrigger`, not Motion findings |
| **Tier 3 — agent-driven** (harness has an MCP browser, no Playwright) | the agent pastes the §4 snippets into whatever browser tool the harness has (Claude Browser pane, claude-in-chrome, Playwright MCP) and folds the results into the capture markdown by hand | same three dumps as Tier 2, non-deterministically | report is stamped `tier 3 (agent-captured)` |

No millisecond or easing value is ever invented. An un-measurable behavior is described
qualitatively or flagged for the Tier 3 path / a user description. The report's **"Not
captured"** section names, every time it applies: minified-JS motion under Tier 1, canvas /
WebGL, Rive / Lottie assets, auth-walled content.

---

## 3. Running it

```bash
python scripts/capture.py --url https://siteX.com/pricing --focus "the plan toggle" \
    --tier auto --json /tmp/capture.json --md captures/sitex-com-2026-09-04.md
```

- `--tier auto` (default) → Tier 1, then Tier 2 if `playwright` imports. `--tier static` is the
  fast, dependency-free pass; `--tier runtime` forces the Tier 2 attempt.
- `--url` is repeatable for multiple references. The findings union into one combined list in the
  report — the script adds no per-source tag; the agent attributes each finding to its URL when
  it renders the capture markdown. **Still per element — no identity merge.**
- Exit code is `1` if every URL failed to fetch, so a caller can gate on it.
- The markdown lands in `captures/<domain>-<date>.md`; the JSON is the machine copy on the §5
  schema. `DESIGN.md` gets one Changelog line per adopted element.

---

## 4. Tier 3 — in-page snippets

Run each block through the harness's browser tool, paste the JSON back, and fold it into the
capture markdown directly — there is **no step that hands it to `capture.py`**. Blocks (a) and
(b) are the two halves of `RUNTIME_JS` in `scripts/capture.py`, split here for readability;
keep them identical if you edit either.

**(a) `document.getAnimations()` dump** — every running `CSSAnimation` / `CSSTransition` /
WAAPI `Animation`:

```js
() => {
  const out = [];
  for (const a of document.getAnimations()) {
    let kf = [], tm = {};
    try { kf = a.effect.getKeyframes(); } catch (e) {}
    try { tm = a.effect.getTiming(); } catch (e) {}
    out.push({
      type: a.constructor.name,
      id: a.animationName || a.transitionProperty || "",
      duration: tm.duration, delay: tm.delay, easing: tm.easing,
      iterations: tm.iterations,
      keyframes: kf.map(k => ({ offset: k.offset, easing: k.easing,
        transform: k.transform, opacity: k.opacity })),
    });
  }
  return out;
}
```

**(b) `ScrollTrigger.getAll()` dump** — guarded by `window.ScrollTrigger`; returns `[]` when
GSAP/ScrollTrigger is not on the page:

```js
() => {
  if (!(window.ScrollTrigger && window.ScrollTrigger.getAll)) return [];
  return window.ScrollTrigger.getAll().map(st => ({
    start: String(st.start), end: String(st.end),
    scrub: st.vars && st.vars.scrub,
    pin: !!(st.vars && st.vars.pin),
    trigger: st.trigger && st.trigger.tagName,
    vars: st.animation && st.animation.vars ? Object.keys(st.animation.vars) : [],
  }));
}
```

**(c) 40-step scroll sampler** — steps `scrollTo` 0 → 100 %, waits a frame each step, records
`{ y, transform, opacity }` for the elements matching a selector. This mirrors the sampler in
`capture.py`'s `capture_runtime`, with an explicit double-`requestAnimationFrame` settle
because an agent-run `eval` has no Playwright step-wait (`capture.py` abbreviates the
per-element keys `t` / `o`):

```js
async (sel) => {
  const els = [...document.querySelectorAll(sel)].slice(0, 6);
  const H = document.body.scrollHeight;
  const raf = () => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  const rows = [];
  for (let i = 0; i <= 40; i++) {
    const y = Math.round(H * i / 40);
    window.scrollTo(0, y);
    await raf();
    rows.push({ y, e: els.map(el => {
      const s = getComputedStyle(el);
      return { transform: s.transform, opacity: s.opacity };
    })});
  }
  window.scrollTo(0, 0);
  return rows;
}
```

---

## 5. The capture schema

`scripts/capture.py --json` writes the machine copy; the agent renders
`captures/<domain>-<date>.md`. Two parts.

### 5.1 Motion findings — one row per distinct behavior

```
element         focus selector / description
trigger         load | scroll(range) | hover | press | in-view(threshold) | route-change
mechanism       what visibly happens, one sentence
properties      transform / opacity / filter / clip-path — measured from → to
timing          duration, easing (as cubic-bezier), delay, stagger, iterations
library         CSS | WAAPI | GSAP+ScrollTrigger | Motion | Lenis | View Transitions | ...
scrubbed?       yes(lag=N) | no
reduced-motion  what the site does under `reduce` (or "nothing — a11y gap")
```

### 5.2 Focus element anatomy (scope B — one named element)

```
structure       trimmed DOM + the CSS rules that carry the mechanism (layout, spacing, motion)
states          default / hover / focus-visible / active / open — each as observed
why it works    the design rationale, in parti's voice
```

### 5.3 Two columns per element

- **Faithful** — exact measured values, re-expressed in the user's stack: their easing token
  where one already matches, the raw `cubic-bezier` where none does. Perf mistakes are *not*
  propagated — a finding that animates `height` / `top` / `width` / `margin` is re-expressed
  with the `transform` / `opacity` equivalent and the substitution is noted.
- **Adapted** — the mechanism and intent only; values re-derived from the user's own tokens,
  density, and motion posture (from `DESIGN.md` / the token spec).

---

## 6. Faithful vs Adapted — the method

Decide **per element**, not per capture.

| Verdict | When | Tell |
|---|---|---|
| **Faithful** | the mechanism *is* the value | an easing that carries the brand's character; a stagger cadence tuned to pace reading; a shared-element morph that only works as itself |
| **Adapted** | only the idea transfers | a nav that collapses on scroll — keep the trigger and the intent, use your proportions and your curve |

**The test:** strip the measured numbers and describe what is left. If the description alone
reproduces the effect → **Adapt**. If the effect dies without the exact values → **Faithful**.

Either way, perf mistakes never propagate: a layout-property animation (`height` / `top` /
`width` / `margin`) is re-expressed as `transform` / `opacity` in the Faithful column, and the
substitution is written down.

### Worked example — a sliding-pill segmented control

Captured from a pricing page's monthly / annual toggle.

**Observed:** `<div role="radiogroup">` with two labels; a pill (`::before` on the group) sits
behind the active label and moves via `transform: translateX()` — `0` on option one, `100%` on
option two; `240ms cubic-bezier(0.32, 0.72, 0, 1)`; label text color crossfades
`--text-muted → --text` over `160ms`; `focus-visible` ring `0 0 0 2px` on the active label.
Reduced-motion on the reference: **none — the pill jumps**.

**Faithful**
```css
.seg { position: relative; display: inline-grid; grid-auto-flow: column; }
.seg::before {                                   /* the pill */
  content: ""; position: absolute; inset: 2px; width: 50%;
  background: var(--surface-2); border-radius: var(--radius-pill);
  transform: translateX(0);
  transition: transform 240ms cubic-bezier(0.32, 0.72, 0, 1);
}
.seg[data-active="1"]::before { transform: translateX(100%); }
.seg label                    { color: var(--text-muted); transition: color 160ms var(--ease-out); }
.seg label:has(:checked)      { color: var(--text); }
.seg label:has(:focus-visible){ box-shadow: 0 0 0 2px var(--focus-ring); }
@media (prefers-reduced-motion: reduce) {
  .seg::before, .seg label { transition-duration: 1ms; }   /* the gap the reference left — closed here */
}
```
`cubic-bezier(0.32, 0.72, 0, 1)` is `--ease-drawer` in this skill's token set, so it maps to
`var(--ease-drawer)`. Nothing animates a layout property — no substitution needed.

**Adapted**
```css
/* Same mechanism — one element moves, not two crossfading. Values from your tokens: */
.seg::before {
  transform: translateX(0);
  transition: transform var(--dur-2) var(--ease-out);   /* your 180ms, your curve */
}
.seg[data-active="1"]::before { transform: translateX(100%); }
/* Your control has 3 options → width: 33.333%; translateX(100%) / translateX(200%). */
/* Label crossfade dropped — your density is tighter and the color shift read as noise. */
```
The pill mechanic is the whole point, so it survives. The `240ms`, the specific curve, and the
label crossfade are the reference's taste, not yours — re-derived or cut.

---

## 7. Guardrails

| Case | Behavior |
|---|---|
| Focus absent / "the whole look" | No capture. Offer the three options in the rule above, wait. |
| Distinctive signature element, faithful mode | Report header carries a one-line note that faithfully reproducing a signature element is a design-originality question for the user to weigh. Flagged, not policed. |
| Tier 1 on a minified React site / canvas / WebGL / Rive / Lottie / auth wall | Named in "Not captured". Offer the Tier 3 snippet path or ask the user to describe it. No invented values. |
| Cross-origin stylesheet | Fetched by URL directly — never `sheet.cssRules`, which throws. |
| Reference has no reduced-motion handling | Recorded as a gap the user's build must **not** inherit. |
| Finding animates a layout property | Faithful column substitutes the `transform` / `opacity` form and notes it. |
| Playwright absent | Auto-fall to Tier 1 + note. `deep` without Playwright warns that feel / scroll capture is unavailable. |
| Same URL captured before | New dated file; prior kept. Report notes the prior capture exists. |

---

## 8. What this is not

- **Not a token-system capture.** One named element's construction, not type scale + spacing +
  color + radius/shadow as a system.
- **Not Rive / Lottie / WebGL reproduction.** Those assets are flagged in "Not captured" and
  the *intent* is rebuilt — the asset is never reproduced.
- **Not a cross-site merge.** "Nav from A, type from B, motion from C" is declined.
- **Not a general scraper.** Scoped to design-and-motion learning for an existing `parti`
  engagement — nothing here fetches content for its own sake.
