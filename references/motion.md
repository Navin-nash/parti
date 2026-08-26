# Motion

Motion is where "designed" and "generated" separate most visibly. Almost every AI-produced interface animates, and almost all of it animates the same way: everything fades up 20px over 500ms with `ease-in-out` on scroll. That single pattern is more identifying than any color choice.

Read this when specifying motion for a direction, doing a `motion` pass, or reviewing animation in a redesign.

**Three files, one subject — know which one you want:**

| File | Owns |
|---|---|
| **this file** | *Why* and *with what* — whether to animate, library choice, scroll technique, performance, reduced motion, and how to write a direction's motion section. |
| `references/motion-rules.md` | The **rule catalog**: every rule id, its severity, a fail example and a pass example, and the canonical curves, durations and spring configs. What `review` cites and what `scripts/motion.py` checks. |
| `references/motion-recipes.md` | **Correct implementations** for the components that come up most — button, dropdown, tooltip, modal, drawer, toast, accordion, stagger, tab indicator, drag-to-dismiss. Start here rather than from a blank file. |

**Contents**
1. [Decide whether to animate at all](#1-decide-whether-to-animate-at-all)
2. [Durations and easing](#2-durations-and-easing)
3. [Choosing a library](#3-choosing-a-library)
4. [Motion (framer-motion)](#4-motion-framer-motion)
5. [GSAP](#5-gsap)
6. [Scroll](#6-scroll)
7. [CSS and View Transitions](#7-css-and-view-transitions)
8. [Rive, Lottie, canvas, WebGL](#8-rive-lottie-canvas-webgl)
9. [Performance](#9-performance)
10. [Reduced motion](#10-reduced-motion)
11. [Motion anti-slop](#11-motion-anti-slop)
12. [Specifying motion in a direction](#12-specifying-motion-in-a-direction)
13. [The build sequence](#13-the-build-sequence)

---

## 1. Decide whether to animate at all

Motion earns its place when it does one of these jobs. If it isn't doing one, cut it.

| Job | Example |
|---|---|
| **Explain a spatial relationship** | A panel slides from the button that opened it, so the user knows where it came from and where it will return. |
| **Preserve continuity across a change** | A list reorders and items travel to their new positions instead of teleporting. |
| **Direct attention to a change the user didn't cause** | A row updates from a websocket and briefly flashes. |
| **Acknowledge input faster than the result can arrive** | A button depresses at 80ms while the request takes 600ms. |
| **Carry brand character in one deliberate moment** | The page-load sequence on a landing page. |

**Frequency governs intensity.** The more often an action happens, the less it should animate. A dropdown a user opens forty times a day should be near-instant (100–150ms) or not animated. A checkout confirmation, seen once, can take 400ms and be choreographed. Animating high-frequency actions is the most common cause of software that feels slow while being fast.

**Ask the two-hundredth-encounter question** for anything decorative. Delight that survives repetition stays; delight that grates goes.

**The classic animation principles translate directly, and naming them sharpens the spec.** Squash-and-stretch (a button compresses slightly on press — mass responding to force), anticipation (a drawer's motion begins before it reaches full velocity, not instantly at top speed), follow-through and overshoot (an element arrives past its resting point and settles back, rather than stopping dead), secondary action (an auxiliary element responds a beat after the primary one — a badge count updates just after the row it belongs to finishes moving). A spec that says "the drawer slides in" is a description; a spec that says which of these four jobs the slide is doing is a decision.

**The motion needs a director, not just a library.** Award-winning 2026 motion work is described exactly this way: not animation for its own sake, but choreography — transitions that carry meaning, a scroll sequence that paces a story, micro-interactions that reward attention on purpose. Installing Motion or GSAP doesn't produce that; deciding which single moment in Step 3 gets the choreography, and leaving everything else quiet, does.

---

## 2. Durations and easing

### Durations

| Element | Duration |
|---|---|
| Hover, focus, active, color change | 100–150ms |
| Small entrances — tooltip, dropdown, popover | 150–200ms |
| Modals | 200–300ms |
| Sheets, drawers | 250–500ms — they travel further |
| Full-screen or page-level transitions | 300–400ms |
| Deliberate choreographed brand moments | 400–800ms, once |
| Large elements | slower than small ones — a sheet the height of the screen at 150ms looks like a glitch |

**Above 300ms, UI feels sluggish; above 400ms, users notice waiting.** Enter can be slightly slower than exit — people wait for things to appear but want them gone immediately.

### Easing

Never ship the browser defaults. `ease` and `ease-in-out` are the "Inter for everything" of motion: not wrong, just unauthored.

```css
--ease-out:      cubic-bezier(0.16, 1, 0.3, 1);     /* entrances — fast start, soft settle */
--ease-out-soft: cubic-bezier(0.25, 1, 0.5, 1);     /* gentler entrance */
--ease-in-out:   cubic-bezier(0.65, 0, 0.35, 1);    /* movement between two on-screen states */
--ease-in:       cubic-bezier(0.55, 0, 1, 0.45);    /* exits only */
--ease-back:     cubic-bezier(0.34, 1.56, 0.64, 1); /* slight overshoot, playful directions */
--ease-drawer:   cubic-bezier(0.32, 0.72, 0, 1);    /* iOS-like drawer / sheet */
```

These are the canonical values for the whole skill — `references/tokens.md` emits them and
`references/motion-rules.md` §12 restates them. One set, one source. A direction that wants a
different curve changes it in the token spec; it never gets a second one typed next to it.

Rules that hold across directions:

- **`ease-out` for anything entering.** It starts fast and settles — reads as responsive.
- **Never `ease-in` on something the user is waiting for.** It starts slow, which reads as lag.
- **`linear` only for continuous motion** — spinners, progress, marquees, scrubbing.
- **Springs beat curves for anything interruptible** — drag, gesture, live-value changes. A spring retargets from its current velocity; a curve restarts.
- **Symmetric in/out easing looks mechanical.** Give enter and exit different curves and often different durations.

---

## 3. Choosing a library

| Situation | Reach for |
|---|---|
| React component states, enter/exit, layout changes, gestures | **Motion** (`motion/react`) |
| Complex multi-element timelines with precise sequencing | **GSAP** |
| Scroll-scrubbed narrative, pinning, SVG/canvas frame scrubbing | **GSAP + ScrollTrigger** |
| Character-level or line-level text animation | **GSAP SplitText** |
| Simple state transitions already expressible in CSS | **CSS** — don't add a dependency |
| Route/page transitions on modern browsers | **View Transitions API**, with a fallback |
| Designer-authored illustrated animation with state machines | **Rive** |
| After Effects export, playback only | **Lottie** (heavier; prefer Rive for interactive) |
| 3D, particles, shaders | **Three.js / R3F** — and be honest about the bundle cost |

**Don't ship two general-purpose animation libraries.** Motion and GSAP together in one React app is roughly 60–80kb of overlapping capability. Pick the one that fits the dominant need and use CSS for the rest. The exception that's actually defensible: Motion for component-level interaction plus GSAP/ScrollTrigger for one scroll-narrative page — but say so explicitly in the spec so it's a decision and not an accretion.

---

## 4. Motion (framer-motion)

The library rebranded from Framer Motion to **Motion**. Current import is `motion/react`; the `framer-motion` package still works as a legacy alias, but new specs should use the current path. In Vue, `motion-v`; vanilla, `motion`.

```tsx
import { motion, AnimatePresence, useReducedMotion, MotionConfig } from "motion/react";
```

### The patterns worth specifying

**Variants + stagger** — orchestration without hand-timed delays. One choreographed sequence lands harder than scattered effects.

```tsx
const list = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04, delayChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } },
};
```

Stagger between **30–60ms**. Below 20ms it reads as simultaneous; above 100ms the last item feels forgotten. Cap the number of staggered children — twenty items staggered at 60ms means the last one arrives 1.2s late.

**`AnimatePresence`** for exits. Without it, unmounting components vanish. Use `mode="wait"` for swapping one thing for another, `popLayout` when siblings need to close the gap.

**`layout` and `layoutId`** — the highest-value feature and the most over-applied. `layoutId` shared between two elements makes one morph into the other (thumbnail → lightbox, tab → active indicator). This is genuinely hard to do any other way. But `layout` on many simultaneous elements triggers measurement on every frame; keep it to a handful.

**`whileHover` / `whileTap` / `whileFocus`** — declarative states. `whileTap={{ scale: 0.97 }}` at ~100ms is the single cheapest tactility upgrade in most interfaces.

**Springs over durations for interaction.** `{ type: "spring", stiffness: 400, damping: 30 }` for snappy UI; lower stiffness (150–250) and damping ~20 for softer, larger movement. Springs interrupt gracefully — critical for drag and for values that change while animating.

**`MotionConfig`** — set `reducedMotion="user"` once at the root and every child respects the OS setting.

**`useScroll` + `useTransform`** for scroll-linked values without re-rendering. Use `useSpring` on the scroll progress to smooth it.

### Failure modes

- Animating `height: auto` — expensive; use `layout` or animate `max-height` / `grid-template-rows: 0fr → 1fr`.
- `initial={{ opacity: 0 }}` on server-rendered above-the-fold content — content flashes invisible before hydration; a real LCP and accessibility problem.
- `whileInView` on every section — the fade-up tell (see §11).
- Forgetting `key` on `AnimatePresence` children, so exits never fire.

---

## 5. GSAP

GSAP is now fully free including all plugins (ScrollTrigger, SplitText, MorphSVG, Flip). Reach for it when the animation is a **timeline** — several elements in a precise sequence — or when it's driven by scroll.

```tsx
import gsap from "gsap";
import { useGSAP } from "@gsap/react";     // handles cleanup in React
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger, useGSAP);
```

**Always scope and clean up in React.** `useGSAP(() => {...}, { scope: containerRef })` reverts every animation and ScrollTrigger created inside it on unmount. Skipping this is the standard GSAP-in-React memory leak.

**Timelines are the reason to use GSAP:**

```js
const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.5 } });
tl.from(".eyebrow", { opacity: 0, y: 12 })
  .from(".headline", { opacity: 0, y: 20 }, "-=0.35")   // overlap
  .from(".cta", { opacity: 0, scale: 0.96 }, "<0.1");   // relative to previous start
```

Position parameters (`"-=0.35"`, `"<"`, `">"`, labels) are what make sequencing legible. Hand-computed `delay` values on separate tweens are how sequences become unmaintainable.

**`gsap.matchMedia()`** handles breakpoints *and* reduced motion in one place, with automatic cleanup:

```js
const mm = gsap.matchMedia();
mm.add("(prefers-reduced-motion: no-preference)", () => { /* full animation */ });
mm.add("(prefers-reduced-motion: reduce)", () => { /* opacity only, or nothing */ });
```

**Flip** for layout changes GSAP-side (equivalent to Motion's `layout`). **SplitText** for per-character or per-line reveals — stagger 15–30ms per character, 60–80ms per line, and remember it needs `aria` care so screen readers don't read fragments.

---

## 6. Scroll

**ScrollTrigger** — the core parameters worth specifying: `trigger`, `start`/`end` (e.g. `"top 75%"`), `scrub` (a number is a smoothing lag in seconds — `scrub: 0.5` feels far better than `scrub: true`), `pin`, `toggleActions`.

**Scroll-scrubbed frame sequences** — image sequences extracted from video, drawn to canvas, indexed by scroll progress. Preload, use `willReadFrequently: false`, size the canvas to devicePixelRatio, and be honest about the payload (150 frames at 40kb is 6MB).

**Smooth scroll (Lenis)** — it can make a scroll-narrative feel considered, and it can also break Cmd+F, anchor links, and native scrollbar position. If used, sync it with ScrollTrigger (`lenis.on("scroll", ScrollTrigger.update)`) and disable it under reduced motion. Never use it on a documentation site or an app.

**Scroll-jacking** — taking control of scroll distance or direction. It's a real technique for a product story and a hostile one everywhere else. The test: could the user leave at any moment with a normal gesture, and does the content justify the time it now takes to pass?

**Reveal on scroll** is the most over-applied pattern on the web. If you use it, animate the *first* screenful only, or reveal groups rather than every element, and never re-trigger on scroll-up.

---

## 7. CSS and View Transitions

Much of what libraries get used for is now native. Don't add a dependency for these:

- **`@starting-style`** — entry animations for elements entering the DOM or leaving `display: none`, no JS.
- **`transition-behavior: allow-discrete`** — animate `display` and `popover`.
- **`grid-template-rows: 0fr → 1fr`** — the clean accordion, no measured heights.
- **`animation-timeline: scroll()` / `view()`** — scroll-driven animation off the main thread. Progressive enhancement; check support for the target audience.
- **`@view-transition`** and `document.startViewTransition()` — cross-document and same-document transitions, with `view-transition-name` for shared elements. Feature-detect and let it be a no-op elsewhere.
- **`:has()`**, `:focus-visible`, `@media (hover: hover)** — hover effects that don't stick on touch devices.

---

## 8. Rive, Lottie, canvas, WebGL

- **Rive** — small runtime, state machines, responds to input, designer-editable. The right answer for an interactive illustrated element (an animated toggle, a mascot, an onboarding illustration).
- **Lottie** — After Effects export. Heavier runtime, playback-oriented. Use dotLottie for the smaller payload. Reasonable when a motion designer already works in AE.
- **Canvas 2D** — particle fields, generative texture, frame scrubbing. Cheaper than WebGL and usually enough.
- **WebGL / Three.js** — only when the direction genuinely requires depth or shaders. State the bundle cost and the low-end-device fallback in the spec, not afterward.

---

## 9. Performance

- **Animate `transform` and `opacity` only.** Everything else (width, height, top, left, margin, box-shadow, filter, background-position) triggers layout or paint per frame.
- **Box-shadow is expensive to animate** — animate the opacity of a pseudo-element carrying the shadow instead.
- **`will-change` sparingly**, applied just before the animation and removed after. Applied permanently to many elements, it exhausts GPU memory and makes things slower.
- **Blur (`filter`, `backdrop-filter`) is the most expensive common effect.** Animating blur radius drops frames on mid-range mobile. Animate opacity of a pre-blurred layer instead.
- **Budget one main animated layer.** Two independent 60fps animations on a page is usually one too many.
- **Test on a mid-range Android**, not on the machine you built it on. Use Chrome DevTools 4× CPU throttle as a floor.

---

## 10. Reduced motion

`prefers-reduced-motion: reduce` is an accessibility contract, not a preference toggle. Some users get genuinely ill from parallax, large-scale movement, and spin.

**Reduced motion does not mean no motion.** Blanket-disabling all transitions removes the state-change feedback these users still need. The correct degradation:

| Full | Reduced |
|---|---|
| Slide + fade entrance | Fade only, shorter |
| Scale/zoom transition | Opacity crossfade |
| Parallax, scroll-scrub | Static final state |
| Auto-playing loops, marquees | Paused, or a static frame |
| Spring physics on drag | Instant snap |

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```
That global reset is the safety net, not the design. Specify per-element degradation in the token spec; use the reset to catch what you missed.

Also honor `prefers-reduced-transparency` where the direction leans on translucency, and never animate anything above 3Hz.

---

## 11. Motion anti-slop

These are the *concept-level* tells — patterns visible in a plan or a mockup. The mechanical
defects (`ease-in` on UI, `transition: all`, `scale(0)`, missing reduced motion, ungated hover)
have rule ids and a script: `references/motion-rules.md` and `python scripts/motion.py <path>`.

The tells, in rough order of how often they appear:

1. **Fade-up-on-scroll on everything** — every section entering with the same `opacity: 0, y: 20` over 500ms. It's the visual signature of generated motion.
2. **500ms everywhere** — one duration applied to hover, modal, and page transition alike.
3. **`ease-in-out` as the default curve**, so nothing feels like it has weight.
4. **Staggered card grids** where the stagger communicates nothing about the content's order.
5. **Counting-up numbers** on stat blocks, every time.
6. **Typewriter text** in a hero. Once distinctive; now instant recognition.
7. **Infinite marquee of logos** at a uniform speed.
8. **Animated gradient mesh** drifting behind a glass card.
9. **Parallax on every section** rather than one deliberate depth moment.
10. **Hover scale 1.05 on every card**, with no shadow, origin, or cursor response to support it.
11. **Spinning/floating hero graphic** with no relationship to the product.
12. **Page-load spinner** for content that renders in 200ms.
13. **Scroll-jacking** a page whose content is four paragraphs.
14. **Motion with no source** — things that fly in from off-screen edges they have no relationship to.

**The replacement principle:** rather than animating everything a little, animate one thing well. One choreographed page-load sequence, or one signature interaction, with everything else near-instant and quiet, reads as designed. Motion distributed evenly across a page reads as a setting that was turned on.

---

## 12. Specifying motion in a direction

Every direction's motion section should answer these, concretely:

1. **Posture** — still / responsive-only / choreographed / ambient. One word that governs everything else.
2. **The one moment** — the single choreographed sequence or signature interaction, described shot by shot.
3. **What animates**, as a list, with duration and easing for each.
4. **What never animates**, as a list. This constrains the builder more usefully than the first list.
5. **Library and why** — including the decision not to add one.
6. **Reduced-motion degradation**, per item, not just the global reset.

Example, terse enough to hand to an engineer:

> **Posture:** responsive-only. The interface acknowledges, it doesn't perform.
> **The one moment:** on first successful upload, the document thumbnail travels via shared-element transition into the sidebar list and the row it lands in flashes the accent for 400ms. Once per session.
> **Animates:** row hover bg 100ms `--ease-out` · popover scale-from-origin 0.96→1 + opacity 150ms `--ease-out` · sheet translateY 300ms `--ease-out` · status color 200ms linear · shared-element upload 400ms `--ease-in-out`.
> **Never animates:** table render, page navigation, numbers, section entry on scroll, any count-up.
> **Library:** Motion (`motion/react`) — already present for popovers; `layoutId` is doing the shared-element work. No GSAP; there is no timeline here.
> **Reduced motion:** shared-element → 150ms crossfade; sheet → opacity only; hover and status unchanged (they're feedback, not decoration).


---

## 13. The build sequence

When you are *writing* an animation rather than specifying or reviewing one, run these seven
steps **in order**. Steps 1 and 2 are gates: they exist to produce zero lines of code sometimes,
and that is a success, not a dodge. Don't reach for a curve before you know whether it animates
at all.

1. **Should this animate?** Check the frequency tier (`motion-rules.md` → `purpose-high-frequency`).
   100+/day or keyboard-initiated → **no animation, stop here**, and say so plainly. Offer the
   non-motion alternative — an instant state change, a static affordance — instead of building
   it anyway.
2. **Name the purpose** in one word: feedback · spatial consistency · state indication ·
   preventing a jarring change · explanation · delight (rare/first-time only). Can't name it?
   Don't build it. Also check function: data the user is reading does not move for style.
3. **Pick the cheapest tool that works** — walk the ladder in `motion-rules.md` §12: CSS
   transition → `@starting-style` → CSS animation → WAAPI → Motion → GSAP. Don't add a library
   for a fade. If the task actually needs a *component* (toast, drawer, command menu), build on
   a headless primitive rather than hand-rolling one.
4. **Pick the properties** — `transform` and `opacity`, with `clip-path` as the sanctioned
   fourth. Never `scale(0)`. `transform-origin` at the trigger for anything anchored to one.
   Percentages in `translate()` over hardcoded pixels.
5. **Pick the curve and duration**, or reach for a spring — values from `motion-rules.md` §12,
   copied not approximated. Springs for anything interruptible or gesture-driven.
6. **Decide interruption and exit** — transitions (not keyframes) for anything triggered
   rapidly; exit by the path it entered; asymmetric timing where the user is deciding.
7. **Reduced motion and pointer gating ship with it**, in the same edit, not as a follow-up.

Then check the result against the never-ship list — every row in `motion-rules.md` marked P0 —
before calling it done. And say what needs a **feel-check**: anything whose correctness can't be
read off the code (a crossfade, a spring's bounce, an opacity/height pair, a gesture on a real
device) gets named as a check rather than guessed at.

Start from `references/motion-recipes.md` whenever the request matches one of the components it
covers. Rebuilding from a blank file is where `ease-in` and `transition: all` come back.
