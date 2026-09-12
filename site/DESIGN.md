# DESIGN.md

> Binding design constraints for the Parti site. Read before changing anything visual.
> Conflicts with a request must be surfaced, not silently resolved.
> Last updated: 2026-09-11 · Direction: **Proof** (open-sky revision) · Score: 70/100 (Coherent) —
> `python skills/parti/scripts/score.py`, measured half only; see Changelog for what's judged.
>
> `tokens.json` and `design/palette.py` are round-tripped and current as of the audit below. The
> vendored component styles (`src/components/ui/*`) are current for the three hero components;
> shadcn's own primitives (radio, switch, scroll-area) still ship their default `rounded-*`,
> neutralized to `0` by this file's `--radius-*` override except where noted as an exception.

## Premise

A showcase for a design skill is a claim, and a claim has to be checked. This site sets each arm
as a **printer's proof**: one pull on uncoated white stock, marked in one sky-blue accent, crop
marks at the corners, the measurement written in the margin in mono. The reader is the
proofreader — the layout hands them the evidence in the order they would check it, and never
decorates over the thing being checked.

One thing changed after the first Proof draft: the proof is now pulled **against an open sky**.
The hero is a live sky — drifting cloud, `#87CEEB` at the horizon — with the thesis set over it,
and each section resolves on scroll the way a plate is lowered onto a light table. Everything
below the hero is still a proof: hard-edged plates, sky-blue crop marks, measurements in the
mono margin. The accent is that same `#87CEEB`, so a chip on a plate and the cloud behind it are
the one colour — the page never introduces a second hue.

## Brief

- **Register:** brand — the site is the argument for the skill's craft.
- **Scene:** a proof pulled and pinned against a bright sky. The sheet is unchanged — uncoated
  near-white stock, one sky-blue accent, crop marks, the score in the margin — only now you can see the
  weather behind it. Nothing on the sheet is lit dramatically; a proof is read, not staged.
- **Strategy:** restrained — one sky-blue accent on an achromatic field, and one live sky of the
  same colour behind it.
- **Users:** developers and designers who already live in Linear, Vercel, GitHub and shadcn docs.
  That is their baseline for "normal", and it is a high one.
- **Frequency:** one-shot to occasional → it earns explanation, one signature motif (the crop
  marks), and one choreographed moment per page; it does not earn density or shortcuts.
- **Priority order:** intentional > intuitive > modern > interactive.
- **Anti-references:** the gradient-mesh AI-tool landing page; the glass-card bento grid; the
  warm-cream editorial-serif redesign. The cloudscape is the one concession to atmosphere — if it
  ever reads as the gradient-mesh hero it replaces, it is wrong.

## Color

Near-pure white / near-pure black ground, one sky-blue accent — the same `#87CEEB` the Cloudscape
hero is built on, so the page and its sky read as one system. Authored here; to be round-tripped
through `design/palette.py` and `scripts/color.py`. Hex is the sRGB target. Ratios below were
computed against `paper` unless noted.

| Token | Light | Dark | Role | Contrast (light / dark) |
|---|---|---|---|---|
| `paper` | `#FCFCFD` | `#050506` | page ground | — |
| `plate` | `#FFFFFF` | `#0E0E10` | the specimen pane, cards | — |
| `plate-2` | `#F4F4F6` | `#020203` | recessed pane: code, inputs, wells | — |
| `rule` | `#E4E4E7` | `#232427` | hairline division | — |
| `rule-strong` | `#8A8A8F` | `#5F6065` | emphatic rule, non-text | 3.25:1 / 3.07:1 (UI floor, vs. `plate`) |
| `ink` | `#121316` | `#EBECEE` | primary text | 18.4:1 / 17.2:1 |
| `ink-muted` | `#54565A` | `#A0A2A6` | secondary text | 7.26:1 / 7.90:1 |
| `ink-dim` | `#63656A` | `#7D7F84` | labels, measurements | 5.75:1 / 5.03:1 |
| `mark` | `#87CEEB` | `#87CEEB` | the accent — fills, chips, bars, the hero horizon | 1.70:1 / 11.6:1 (fill-only, exempt from text floor) |
| `mark-text` | `#277796` | `#87CEEB` | the accent at link / small-UI / body-text size | 4.59:1 / 11.7:1 (worst case, vs. `plate-2`) |
| `mark-tint` | `#E8F4FA` | `#0E2A33` | accent ground, chips, ambient bands | — |
| `on-mark` | `#0A1518` | `#0A1518` | text on a solid `mark` fill — near-black in both themes | 10.8:1 (on `mark`) |

Every in-theme *text* pair clears AA body. Two values sit below 4.5:1 on purpose and are never
text: `rule-strong` (a rule; 3.0:1 floor), and `mark` (`#87CEEB` is a light tint in **both**
themes — it is a fill colour, and text-size uses of the accent take `mark-text`).

**Rules:**

- `mark` identifies the parti arm and the one primary action, nothing else. It never carries a
  whole page, never appears twice on one screen without a reason written in the diff.
- `#87CEEB` is a light tint in both themes, so a `mark`-filled control **always** carries
  near-black `on-mark` text — a pale-blue button with dark type, echoing the sky. Never white
  text on `mark`.
- Links, small accent text, accent numerals, hairline accent rules use `mark-text`
  (`#2B7A99` on white, the same `#87CEEB` on black). On white, `#87CEEB` as small text or a 1px
  line is invisible — reach for `mark-text` or make it a fill/bar instead.
- Cloudscape gradient stops bind to tokens, not the component defaults:
  light `colorBottom = mark` (`#87CEEB`) · `colorMid #F4F6F7` · `colorTop #FFFFFF`;
  dark `colorBottom #1C4D66` · `colorMid #0C2531` · `colorTop #050506` (a night sky, same shader).
- The crop marks are the single decorative use of the accent (see Shape and elevation). They are
  structural framing and exempt from "one mark per screen"; content marks are not.
- No warm accent — persimmon, amber, orange, terracotta — anywhere. The accent is the sky and
  only the sky. Indigo / violet appear only inside `src/arms/*/baseline.tsx`, where the
  generated-default palette is the deliberate "before" exhibit.

## Typography

| Role | Family | Source | Used for |
|---|---|---|---|
| Interface | Geist | Google Fonts | everything structural — navigation, prose, controls, and the thesis lines |
| Evidence | Geist Mono | Google Fonts | labels, plate numbers, measurements, tokens, code, crop-mark coordinates |

Two faces, one job each: the interface and the evidence. A printer's proof has no editorial
display face — the argument is carried by **size and the accent**, not by a change of voice.
Thesis lines are Geist at the top of the scale in weight 500, not a serif.

Scale — ratio 1.2 for UI:

`mono-xs` 0.6875 · `xs` 0.75 · `sm` 0.8125 · `base` 0.9375 · `md` 1.0625 · `lg` 1.3125 ·
`xl` 1.75 · `2xl` 2.375 · `3xl` 3 (rem)

**Rules:** the top three steps (`xl`–`3xl`) are thesis lines and plate titles only, one line at a
time. Measurements and token names are always mono, so evidence stays visually distinct from
claims about it. Full spec and the six sign-off decisions live in the type specimen artifact.

### Motion treatments of Geist

Two GSAP components animate Geist itself — they are not a third face, they are choreography.

- **`pixel-text-fill`** (`@hyperiux`) — the hero thesis resolves from a coarse pixel grid to crisp
  type on load. At most **one per page**, on the single largest statement. Honours
  `prefers-reduced-motion` natively (renders final state).
- **`depth-flip-text`** (`@hyperiux`) — a 3D per-character hinge flip cycling a short phrase list
  (the hero subhead: "a runtime… / a dashboard… / an API doc…"). At most **one per page**.
  `textColor` = `ink` (light) / `sky-text` (dark), `backgroundColor="transparent"`, `loop`.

`pixel-text-fill` and `depth-flip-text` never occupy the same viewport.

## Space

Base unit 4px. Scale: 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 80 · 96 · 128. Unchanged.

**Rules:** off-grid values need a reason in the diff. Optical alignment of a rule or a baseline is
a reason; "it looked better" is not.

## Shape and elevation

Radius **`0`, everywhere** — including buttons and inputs. Crop marks and registration marks meet
at right angles; a rounded corner is not something a proof has. This is the headline break from
the previous direction and from the shadcn default, which for this subject is load-bearing.

Elevation: **no shadows.** Depth is a hairline `rule` plus one step from `paper` to `plate`. A
drop shadow on one pane of a two-pane comparison adds visual weight to that pane, and the
instrument must not put its thumb on the scale.

**One exception:** the hero cloudscape is the single soft, non-hard-edged surface in the system.
It is WebGL atmosphere, it sits strictly behind content, and it is never itself framed or given a
plate. Every surface *in front of* it keeps radius `0` and no shadow.

**A second, narrow exception:** the radio-button dot and the switch thumb stay circular
(`rounded-full`). Their shape is the control's meaning, not decoration — a square radio dot reads
as a checkbox, and a square switch thumb reads as nothing at all. This is the one place
`references/convention.md`'s "conventional in mechanics" clause outranks radius `0`. Every other
`rounded-full` in the build (icon buttons, search triggers, segmented-control pills, sample bars)
is drift and gets squared off — audited 2026-09-11, see Changelog.

**The signature motif:** four short `mark` crop marks at the corners of each specimen plate — 1px,
~10px long, ~6px outside the plate edge. On a plate's scroll reveal the marks draw in from the
corner (see Motion). It is the only ornament in the system and it is literally a printing artifact.

Focus: a `2px` `mark` outline with a `1px` `paper` gap, on every interactive element, in both
themes. Never animated.

## Motion

- **Posture:** entrance-choreographed, quiet at rest. Each section and plate resolves once as it
  enters the viewport; nothing re-animates on scroll-back, and only the hero sky parallaxes. This
  replaces the earlier responsive-only posture.
- **Libraries** — three, no more, scoped narrower than the first draft of this section had it:
  - `framer-motion` (`motion/react`) — React component enter/exit, layout shifts, hover / tap
    micro-interactions, the comparison-slider handle, **and every scroll reveal** (`whileInView` +
    `viewport={{ once: true }}`). The single shared `Reveal` primitive lives here, not in GSAP —
    a fire-once intersection trigger with no scrubbing or pinning doesn't need a heavier tool,
    and `motion.md`'s own tool ladder says take the cheapest one that works.
  - `gsap` + `@gsap/react` — confined to the two vendored Geist text treatments
    (`pixel-text-fill`, `depth-flip-text`) only. No `ScrollTrigger` elsewhere in the build.
  - Cloudscape ships its own WebGL `requestAnimationFrame` loop and its own `speed` prop for the
    hero parallax; it pulls no animation library for that coupling either.
- **Scroll reveal** — one shared `Reveal` primitive (`components/proof/reveal.tsx`) wraps every
  section and plate: `y: 14px → 0` (content stays opaque at rest and in SSR — it is never parked
  invisible behind an observer), `duration 500ms`, `ease [0.16, 1, 0.3, 1]` (`--ease-out`),
  `viewport={{ once: true, amount: 0.15 }}`. A `delay` prop staggers siblings. The plate's crop
  marks draw in on the same trigger (`scaleX / scaleY 0 → 1` from each corner). Do not hand-roll
  per-component observers.
- **The one choreographed moment (per page):** the hero — cloudscape drifting behind while
  `pixel-text-fill` resolves the thesis on load. Everything else is entrance-only and understated.
- **The one direct-manipulation moment:** the comparison slider. It tracks the pointer 1:1 with no
  easing, because a lagging divider makes the two arms look misaligned when they are not.
  Unchanged.
- **Durations:** UI fast `120ms` · base `180ms` · slow `260ms`; reveal `500ms`; hero pixel-fill
  `~900ms`. Easing: UI `cubic-bezier(0.32, 0.72, 0, 1)` (`--ease`, applied as Tailwind's own
  `--default-transition-timing-function` so a bare `transition-colors` inherits it with no
  per-callsite modifier); reveals `cubic-bezier(0.16, 1, 0.3, 1)` (`--ease-out`).
- **Never animates:** anything that repeats on every scroll pass; parallax on the plates (only the
  hero sky moves); the margin-rail numbers; focus rings.
- **Reduced motion:** cloudscape freezes to one static frame of the `sky → plate` gradient;
  `pixel-text-fill` and `depth-flip-text` render their final state instantly (native);
  every scroll reveal becomes immediate (`opacity: 1`, no transform, marks drawn) — all content is
  fully present, nothing gated on an observer. The slider still tracks.

## Hero

- **Background:** `Cloudscape` (`@amanshakya307`), full-bleed inside a `~88vh` hero (not `100vh` —
  the next section peeks). `speed={0.6}`. Gradient stops bound to tokens (see Color). A `1px`
  `rule` bottom edge; crop marks at the hero's own four corners — the hero frame is still a proof.
- **Foreground, in the margin-rail grid:** the rail label (`00 · A Claude Code design skill`); the
  thesis via `pixel-text-fill`; a `depth-flip-text` subhead cycling the subjects Parti designs;
  two actions (`mark` fill with `on-mark` text + hard outline); the mono install line.
- **Legibility over the sky:** a `sky-tint`→transparent vertical scrim behind the text block only,
  so the thesis always clears AA against whatever cloud is behind it. `on-sky` covers any text
  that sits on a solid sky patch.

## Discipline

1. **The chrome never out-designs the specimen.** The cloudscape is atmosphere; if a site
   component — the sky included — is more interesting than what it frames, it is wrong.
2. **Evidence is set in mono and quoted verbatim.** Numbers come from the scripts, never from an
   author's memory.
3. **One spot mark per screen.** Crop marks are structural framing and exempt; content marks are
   not. `sky` is not a mark and does not count — but it also never behaves like one.
4. **Square corners and no shadows on content.** The cloudscape is the one soft thing and it stays
   behind the plates. A rounded content card, a drop shadow, or a second hue all break the
   material language.

## Anti-rules

- **No border radius.** `rounded-*` is banned on content. This is the change most likely to show
  up as drift — see Open questions.
- **No shadow utilities.** Depth is rule plus one lightness step. `shadow-*` is banned on content.
- **No display serif.** The argument is carried by size and the accent; the two GSAP text
  treatments animate Geist, they do not introduce a face.
- **One accent, and it is the sky.** `#87CEEB` for fills, tints, chips and bars;
  `mark-text` (`#2B7A99`) for links and small text on white. No warm accent — persimmon, amber,
  orange, terracotta — anywhere on the site.
- **Scroll reveals fire once.** Entrance-only, `once: true`; nothing re-animates on scroll-back,
  and only the hero sky parallaxes. A reveal that replays on every pass is drift.
- **No third animation library.** `framer-motion` for React motion, `gsap` / `ScrollTrigger` for
  scroll and the text treatments, Cloudscape's own loop for the sky. Nothing else.
- **No lorem, no "Feature One".** Placeholder copy hides the hierarchy problems this site exists
  to show. Where those strings appear in `src/data/*.ts` they are prose *about* the tell, which is
  why that directory is excluded from the content rules rather than rewritten.
- **`src/data/*.ts` is excluded from the token-drift check.** `commands.ts` reprints real, dated
  `scripts/color.py`/`lint.py` terminal output as demo text (captured hex values in a ramp table,
  not live styling); `showcases.ts` restates each showcase's own `accent` for gallery metadata,
  the same color already excluded at the source in `src/showcases/*`.
- **`src/showcases/*` is excluded from the token-drift check.** Each of the five showcases is its
  own brief with its own derived palette, scoped via a local `[data-showcase]` CSS-variable block
  — deliberately outside this file's Proof tokens (see Changelog, gallery rebuild). Checking them
  against this site's own token spec would flag every one of them by design.
- **`src/components/proof/theme-hex.ts` is excluded from the token-drift check.** It's a literal
  JS restatement of this file's own Color tokens, resolved per theme, for the three vendored
  `src/components/ui/*` components that take hex strings instead of CSS custom properties — the
  hex values there mirror the tokens, they don't drift from them.
- **`src/components/ui/depth-flip-text.tsx` is excluded from the token-drift check.** Its
  `backgroundColor`/`textColor` defaults are the vendored library's own fallback values; the one
  call site (`subjects-flip.tsx`) always overrides them with resolved Proof hex, so the defaults
  never render.

## Accessibility floor

Contrast AA (4.5 body, 3.0 large and UI) · visible focus on every interactive element · 44px
touch targets · keyboard-complete · reduced-motion honored (see Motion) · hierarchy survives
grayscale · hero text clears AA against the cloudscape via the scrim, not against luck.

## Open questions

Closed by the 2026-09-11 audit, below — the six items above this line in the previous revision
(`tokens.json`/`palette.py` stale, install the hero components, the scroll-reveal pass, `mark` vs
`mark-text`, `radius 0`, `!important`) are resolved or reclassified; see Changelog for what
changed and why. What's still genuinely open:

- [ ] **Motion budget, unmeasured.** GSAP's actual footprint turned out narrower than first
      specified — confined to the two vendored text treatments, not scroll reveals — which likely
      already answers this, but nobody has run a bundle-size measurement to confirm. Do that
      before calling it closed.
- [ ] **Page-content judgment.** The measured score (70/100) covers system discipline only.
      Hierarchy, signature, content fit, copy, and state coverage on each of the four pages —
      home, commands, gallery, method — are unjudged. Next task.

## Changelog

- 2026-09-11 — **First real run of the new CI gate against this tree surfaced a stale `lint.py`
  ignore list, three pre-existing lint errors in vendored/core components, and two `motion.py`
  instrument gaps.** `--ignore` in `.github/workflows/ci.yml` still pointed at the deleted
  `src/arms/*` comparison system; replaced with the exclusions listed in Anti-rules above
  (`src/showcases/*`, `src/data/*.ts`, `folder-gallery.tsx`, `theme-hex.ts`, `depth-flip-text.tsx`).
  Separately, `eslint --max-warnings 0` caught real issues the newer Rules-of-React lints hadn't
  been run against before (these files were untracked pre-session): `smooth-cursor.tsx` read
  `Date.now()` at module-eval time for a ref default instead of on mount (`react-hooks/purity`);
  `pixel-text-fill.tsx` and `smart-cursor.tsx` read `matchMedia` via `useState`+`useEffect`+
  `setState` instead of `useSyncExternalStore` (`react-hooks/set-state-in-effect`, matching
  `search-trigger.tsx`'s established pattern); `dia-text-reveal.tsx` mutated a ref during render
  and reset state directly inside an effect (fixed via React's documented "adjust state during
  render" pattern, with a `useEffect` re-syncing the ref post-commit since refs can't be written
  during render either); `reveal.tsx` called `motion.create()` — which builds a new component
  identity — inside the render body via `useMemo`, still flagged by `react-hooks/static-components`
  despite memoization; precomputed the three tags `Reveal` is actually given (`div`/`li`/`section`)
  once at module scope instead. Last, `skills/parti/scripts/motion.py` flagged 42 `timing-over-300ms`
  P0s: 38 were `src/showcases/*`'s own hero-style entrance choreography — the file rename from
  `src/arms/*` had outrun `RE_LONG_OK_PATH`'s keyword list, so added `showcase` to it; 3 were
  `Reveal`/`Plate`/`BrowserFrame`'s scroll-triggered, fires-once crop-mark/rise entrance
  (`whileInView` + `viewport={{ once: true }}`) — the same "content arriving, not a control
  responding" case the tool already exempts for a drawn SVG stroke, just spread across a few
  adjacent lines instead of one; added a small line-window check for it. The one genuine outlier,
  `text-loop.tsx`'s 800ms phrase crossfade (used once, inside `Hero`, which the regex can't see
  from the vendored component's own path), was cheaper to just bring inside budget (280ms) than to
  build a caller-context exemption for. One more, unrelated to any of the above: the `site` job's
  `pnpm/action-setup@v4` step failed outright (`No pnpm version is specified`) because its
  `package_json_file` input defaults to `./package.json` at the repo root, and this repo has no
  root `package.json` - the pinned `packageManager` field lives in `site/package.json`. Pointed the
  action at it explicitly.

- 2026-09-11 — **Home page's live single-showcase preview replaced with a folder-gallery
  reveal; then corrected twice on direct request.** The "It ships real interfaces" section used
  to embed one live `BrowserFrame` iframe (Kiln, hard-coded as `SHOWCASES[0]`); replaced with
  `@alexperezcedeno`'s Interactive Folder Gallery (21st.dev) — a folder that springs open on
  click and fans all five showcases out as real links into the gallery. First pass adapted the
  chrome to this site's own `plate`/`rule` tokens and hard edges; **the user asked for the exact
  original chrome instead** (dark gradient folder body, glossy rounded cards, real drop
  shadows), so this is now a fourth, explicit, user-directed exception to radius `0` — not
  derived, requested — scoped to `components/proof/folder-gallery.tsx` alone. Fixing it surfaced
  a real bug: `rounded-xl`/`rounded-lg`/`rounded-2xl` silently resolved to `0px` everywhere in
  this component, because they route through the same `--radius-*` theme variables this file
  zeroed out site-wide earlier in the session. Fixed by using literal pixel values
  (`rounded-[12px]`, `rounded-[16px]`, `rounded-[8px]`) that bypass the theme scale — worth
  remembering for any future component that deliberately wants a radius on this site.
  Second correction: the "photos" (first built as accent-color posters) are now real screenshots
  — `public/gallery/<slug>.png`, captured from the live `/preview/<slug>` route via Playwright
  (`npx playwright screenshot --wait-for-timeout=1500`, so the capture waits out each page's own
  entrance animation instead of catching it mid-fade). Playwright was added as a one-off `npx`
  tool, not a project dependency — `scripts/capture.py` in the `parti` skill this site showcases
  already documents Playwright as the sanctioned tool for exactly this. Live iframe scrolling
  stays where it earns its keep: the gallery grid's compact previews and the full detail-page
  frame. Verified via the accessibility tree, direct DOM/computed-style checks
  (`getBoundingClientRect`, `img.complete`/`naturalWidth`, `getComputedStyle(...).borderRadius`),
  an actual click-through navigation, and finally two real screenshots once the Browser pane
  came back into a visible state (it was hidden on the user's side for part of this session,
  which starves `requestAnimationFrame` and screenshot capture the same way backgrounding a
  real browser tab does — not a site defect).

- 2026-09-11 — **Two showcases re-skinned to prove the gallery holds genuinely divergent
  directions, not five variations on one palette.** `datum.tsx` → brutalism: raw hazard-yellow
  ground (`#E8B923`), real navy ink (`#1B2A4A`, not black), a concrete-beige panel (`#D8CBAE`),
  the kept signal-red accent — thick 2px borders throughout, and a `.datum-block` interaction
  motif (a hard offset shadow the element presses into on `:active`, no blur, no scale) in place
  of the site-wide soft-transition default. The pairing is derived, not decorative: Datum is an
  architecture studio, and brutalism is literally the movement about a material admitting what it
  is. `tandem.tsx` → bright: vivid coral ground (`#FF8F6B`), a real plum ink (`#3D1B4E`, not
  black), a sunny-yellow panel (`#FFD666`), a cyan accent (`#5EEAD4`) replacing the coral one
  (moved to the ground). Every new pair contrast-verified with `color.py` — one body-text pair
  needed a 1-step lightness correction (`#6B4A78`→`#543461` ink-soft on the coral ground, 3.27:1
  → 4.60:1) before it cleared AA; none of the other four showcases or the site's own Proof tokens
  were touched. Both confirmed rendering correctly via computed styles and in the gallery grid.

- 2026-09-11 — **Gallery rebuilt: comparison arms discarded, five new landing pages, live-browser
  detail view.** The whole `src/arms/` comparison system (baseline-vs-parti component pairs, the
  five old examples — finance workspace, dev-tool landing, analytics dashboard, API docs, product
  page) is gone, along with `lib/registry.tsx`, `lib/schema.ts`, `lib/source.ts`, the iPhone/
  MacBook mockup components, and `device-showcase.tsx`. In their place: `src/data/showcases.ts`
  (a five-line-per-entry data model — slug, title, tagline, category, accent — no prompts, no
  baseline arm, no measured/judged split) and `src/showcases/*.tsx`, five self-contained landing
  pages (Kiln, Torque, Undertow, Datum, Tandem — a ceramics studio, an e-bike, a sleep app, an
  architecture studio, a language-exchange app), each with its own derived direction, its own
  fonts, and its own token scope via a local `[data-showcase]` CSS-variable block — deliberately
  outside this file's own Proof tokens, since each is its own brief. The gallery page is now a
  grid of live, scaled iframe previews (not text cards); the detail page is a live browser-chrome
  frame (`components/proof/browser-frame.tsx`, in this site's own crop-mark material language, not
  borrowed macOS chrome) around a genuine `/preview/[slug]` route — real scroll, real animation, no
  process narrative or axis breakdown on show. `ChromeGate` suppresses the site's own nav/footer/
  cursor/command-menu on `/preview/*` so an iframed showcase never leaks the site's own chrome.
  **Finding, fixed:** every showcase's hero content used `whileInView` for entrance animation,
  which depends on an `IntersectionObserver` trigger firing — unnecessary indirection for content
  that's already on screen at load. Switched all above-the-fold motion to `initial`+`animate`
  (fires on mount, no observer dependency); left below-the-fold reveals on `whileInView`, matching
  this site's own `Reveal` primitive. Verified in a production build (`next build && next start`),
  not just dev.

- 2026-09-11 — **Redesign-mode audit: measured (70/100, Coherent), triaged, and closed six of the
  seven open questions.** `tokens.json` and `design/palette.py` regenerated for "Proof" (were
  still "Specimen" — brick-red mark, warm-gray ground, three-face type, radius 2px); OKLCH
  round-tripped through `color.py`, catching two real near-miss contrast pairs (`mark-text` on
  `plate-2` 4.40:1, `rule-strong` on `plate` dark 2.94:1) and correcting both by 1% lightness,
  hue/chroma preserved (`mark-text` `#2B7A99`→`#277796`, `rule-strong` dark `#5C5D62`→`#5F6065`;
  propagated to `globals.css` and `theme-hex.ts`). Fixed a real contrast bug: `copy-button.tsx`'s
  confirmation check-icon used `text-mark` (≈1.4:1, invisible) instead of `text-mark-text`. Added
  `--default-transition-duration`/`--default-transition-timing-function` overrides in
  `globals.css` so every bare `transition-colors` site-wide (29 files) inherits `--d-fast`/
  `--ease` instead of Tailwind's stock curve, with no per-callsite edit — verified against the
  computed style, not assumed. Squared off three decorative `rounded-full` instances
  (`theme-toggle.tsx`, `search-trigger.tsx`, `token-inspector.tsx` ×2) that were drift, not
  convention; documented the radio/switch-thumb exception (see Shape and elevation) after
  confirming the site's own `radio-group.tsx`/`switch.tsx` and the `arms/components/forms`
  exhibit both use it as shape-carries-meaning, not decoration. Corrected the Motion section:
  the `Reveal` primitive is `framer-motion` `whileInView`, not GSAP `ScrollTrigger` as first
  specified — GSAP is confined to the two vendored text treatments only, a narrower and lighter
  footprint than drafted. Three findings from the tool turned out to be false positives on
  inspection (indigo confined to the `baseline.tsx` exhibit correctly; the "mid-gray text" tell
  matched no actual color; "20 unused CSS vars" are consumed via Tailwind utility classes
  `audit.py` can't trace) — recorded here as instrument-defect dispositions, not fixed.

- 2026-09-10 — **Accent moved to the sky: persimmon → `#87CEEB`.** The warm spot ink is removed;
  the accent is now the same sky-blue the Cloudscape hero is built on, so page and sky are one
  system. `mark` is `#87CEEB` in both themes (a light tint — `mark`-filled controls always carry
  near-black `on-mark` text); `mark-text` is its deep form `#2B7A99` on white / `#87CEEB` on
  black, for links and small text. `mark-tint` `#E8F4FA` / `#0E2A33`. The separate `sky*` tokens
  are folded into `mark*`. Ground, radius `0`, no-shadow, crop marks, motion stack all unchanged.

- 2026-09-10 — **"Proof" gains a sky.** Added atmospheric secondary `sky` `#87CEEB`
  (+ `sky-text` `#2B7A99` / `#87CEEB`, `sky-tint` `#E8F4FA` / `#0E2A33`, `on-sky` `#0A1518`) —
  decorative only, never an accent. Hero is now a WebGL `Cloudscape` with the thesis over it,
  resolved by `pixel-text-fill`; a `depth-flip-text` subhead cycles the subjects Parti designs.
  Motion posture changed from responsive-only to entrance-choreographed: `framer-motion` (React
  motion) + `gsap` / `ScrollTrigger` (scroll reveals, both text treatments) adopted, plus
  Cloudscape's own WebGL loop. The "No fade-up on scroll" anti-rule is lifted and replaced with a
  fire-once reveal rule; "no second hue" is narrowed to "no second *accent*". Content plates,
  radius `0`, no-shadow-on-content, crop marks, and the comparison-slider rule are unchanged.
- 2026-09-10 — **Full teardown: "Specimen" → "Proof".** Ground moved from warm grey
  `#F1F2F4` / `#0B0D0F` to near-pure `#FCFCFD` / `#050506`. Spot ink moved from brick red
  `#B82F2B` / `#F17262` to persimmon `#D64A24` / `#FF8460`, with a darkened `mark-text`
  (`#BE3E1C`) for body-size use on light and near-black `on-mark` on the fill in both themes.
  Radius `2px` → `0`. Typography cut from three faces to two — Instrument Serif removed; thesis
  lines are now Geist. Crop marks added as the one signature motif.
- 2026-09-10 — Forked seven vendored primitives off `transition-all` onto an explicit
  `color, background-color, border-color, box-shadow, transform` list. Clears the last
  `motion.py` P0.
- 2026-09-10 — First written. Recorded the de-facto system: values from `tokens.json`, contrast
  measured with `scripts/color.py`, score from `scripts/score.py`, open questions from
  `scripts/lint.py`.
