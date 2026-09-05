# Style Vocabulary

A catalog of design movements available to you. Use it two ways: to **name** a direction you arrived at through constraints, and to **borrow moves** from a movement without adopting the whole costume.

Each entry gives what the style believes, its signature moves, what it's genuinely good at, its failure mode, and when to avoid it. The failure modes matter more than the definitions — every one of these styles has a version that reads as costume.

**Contents**

1. [Reductive](#1-reductive) — Swiss/International, Minimalism, Quiet Luxury, Flat/Material
2. [Raw & Expressive](#2-raw--expressive) — Brutalism, Neo-Brutalism, Anti-Design, Zine/Collage
3. [Material & Depth](#3-material--depth) — Glassmorphism, Neumorphism, Claymorphism, Skeuomorphism, Spatial UI
4. [Editorial & Type-Led](#4-editorial--type-led) — Editorial, Broadsheet, Kinetic Typography, Variable-Type
5. [Ornamental & Maximal](#5-ornamental--maximal) — Maximalism, Memphis, Y2K/Frutiger Aero, Vaporwave/Retro-Futurism, Organic/Biomorphic
6. [Systems & Data](#6-systems--data) — Terminal/Monospace, Data-Dense, Utilitarian Dashboard, Bento
7. [Atmosphere & Motion](#7-atmosphere--motion) — Scroll-Narrative, Ambient/Generative, Dark/OLED, Tactile Micro-Interaction
8. [Cross-cutting moves](#8-cross-cutting-moves)

---

## 1. Reductive

### Swiss / International Typographic
**Believes:** clarity is a moral position. The grid is the argument. Not "less" for its own sake — **the working test is: if removing an element hurts usability, keep it.** The goal is clarity, not austerity, and that distinction is what separates disciplined Swiss work from a design that's merely empty.
**Moves:** strict modular grid, one grotesque type family at several weights, flush-left ragged-right, generous white space, asymmetric balance, near-zero ornament, one accent color used as punctuation.
**Good at:** dense information that must stay legible, institutional trust, work that should still look right in fifteen years.
**Fails when:** the grid gets followed without tension — everything centered, everything equally spaced, and the result is inert rather than rigorous. Swiss done well has *asymmetry* and deliberate imbalance.
**Avoid when:** the product needs warmth or personality more than it needs authority.

### Minimalism
**Believes:** what remains after removal is what mattered.
**Moves:** severe restraint in palette (often two colors plus paper), a single type family, large negative space, no borders where alignment can do the work, content-as-decoration.
**Good at:** premium positioning, focus-driven tools, products with a single obvious action.
**Fails when:** it's subtraction without a thesis — thin gray text, everything at 40% opacity, no hierarchy, no focal point. That's not minimal, that's unfinished. Minimalism demands *more* precision in spacing and type, not less.
**Avoid when:** the content is genuinely dense. Minimalism applied to dense content just hides things behind clicks.

### Quiet Luxury
**Believes:** anyone shouting is selling something.
**Moves:** off-white and warm neutrals, a restrained high-quality serif or a refined neo-grotesque, extreme spacing, very slow and small motion, photography over illustration, no gradients, no glow, generous letter-spacing on small caps labels.
**Good at:** high-price-point products, portfolios, brands where restraint signals confidence.
**Fails when:** it becomes indistinguishable from every other beige site. The 2024–26 "AI cream" palette (warm off-white + high-contrast serif + terracotta accent) is this style's exhausted default — see `critique.md`.
**Avoid when:** the audience needs energy or the product is genuinely for everyone.

### Flat / Material
**Believes:** the interface should announce itself as software, with consistent, learnable rules.
**Moves:** solid fills, systematic elevation via shadow tokens, consistent corner radius, icon system, predictable component states, motion that explains spatial relationships.
**Good at:** large multi-team products that need consistency more than distinction; anything where a design system must scale across dozens of screens.
**Fails when:** it's just the default component library with the brand color swapped — the "shadcn look," recognizable at a glance.
**Avoid when:** the brief is a brand moment. Flat is a product language, not a marketing one.

---

## 2. Raw & Expressive

### Brutalism (web)
**Believes:** honesty about the medium. It's a document; let it be a document. Where Minimalism aims for *refined* simplicity, Brutalism aims for **clarity through confrontation** — it doesn't refine away tension, it uses raw structure and stark contrast on purpose, embracing asymmetry the way Minimalism would smooth it out.
**Moves:** default or near-default system type, visible structure, hairline black borders, zero radius, unstyled or barely styled links, high contrast, monospace accents, HTML's own aesthetics unhidden.
**Good at:** technical audiences, editorial and archive work, anything positioning against polish, extremely fast pages.
**Fails when:** the harshness is applied to a product that requires trust in a transaction. Also: brutalism is not an excuse for bad hierarchy. The good examples are *ruthlessly* organized.
**Avoid when:** the audience isn't technical or the content is emotionally sensitive.

### Neo-Brutalism
**Believes:** the raw look, but fun.
**Moves:** thick solid black borders (2–4px), hard offset drop shadows with no blur, saturated flat primaries and candy colors, chunky sans or grotesque at heavy weights, playful rotation, sticker-like elements, zero-to-large radius mixed deliberately.
**Good at:** developer tools with personality, indie SaaS, launch pages that need to be screenshot-able, products aimed at people tired of gradients.
**Fails when:** it's the only idea. Neo-brutalism became a template of its own around 2023 — offset shadows on everything reads as a downloaded theme. Use two or three of its moves, not all of them.
**Avoid when:** the product handles money, health, or anything where playfulness undermines credibility.

### Anti-Design
**Believes:** the rules produced homogeneity, so break them on purpose.
**Moves:** intentional misalignment, clashing type sizes, overlapping elements, raw HTML artifacts, disorienting scroll, colors that shouldn't sit together.
**Good at:** art, culture, fashion, music, events, personal sites — anywhere the *experience of looking* is the product.
**Fails when:** applied to a task. Chaos costs the user time.
**Avoid when:** anyone needs to accomplish something on a deadline.

### Zine / Collage
**Believes:** texture and human hand over machine perfection.
**Moves:** photocopy grain, torn edges, tape and staples, halftone, mixed type as if cut and pasted, physical scan artifacts, layered paper, handwriting.
**Good at:** community projects, music, activism, anything wanting to feel made by a person rather than a company.
**Fails when:** it's a filter over an otherwise corporate layout. The layout has to be irregular too.

---

## 3. Material & Depth

### Glassmorphism
**Believes:** layers should feel like physical planes of frosted material.
**Moves:** `backdrop-filter: blur()` on semi-transparent panels, thin light border on the top edge, soft inner glow, colorful background bleeding through, layered depth without heavy shadow.
**Good at:** overlays and floating controls over rich content — media players, map UIs, OS-style panels, anything with photography or video behind.
**Fails when:** used without something worth seeing behind the glass. Frosted panel over a static mesh gradient is the single most recognizable AI-design tell of this era. Also: text contrast on glass is genuinely hard — verify against the *actual worst-case* background, not the average one.
**Avoid when:** the background is flat, the content is text-heavy, or performance on low-end devices matters (`backdrop-filter` is expensive).

### Neumorphism / Soft UI
**Believes:** controls should look extruded from the surface.
**Moves:** monochromatic background, paired light and dark shadows to simulate embossing and debossing, very low contrast, subtle inner shadows for pressed states.
**Good at:** almost nothing, honestly — it's aesthetically distinctive and functionally poor.
**Fails when:** always, on accessibility. The style is defined by low contrast, so affordances become invisible and contrast requirements can't be met.
**Avoid when:** anyone needs to find the button. Borrow at most a single soft-extrusion detail on a decorative element; never build the control system on it.

### Claymorphism
**Believes:** soft, friendly, toy-like, three-dimensional.
**Moves:** large corner radii, pastel fills, double inner shadows for puffiness, 3D-ish illustrations of rounded objects, soft outer shadow, chunky proportions.
**Good at:** kids' products, wellness, onboarding, education, anything trying to lower the stakes.
**Fails when:** the puffiness gets applied to data or dense tools — it wastes enormous space and infantilizes.

### Skeuomorphism (modern)
**Believes:** familiarity from the physical world reduces the learning curve.
**Moves:** real materials and textures, physical affordances, realistic lighting, objects that behave like their referents.
**Good at:** music and audio tools, creative instruments, anything where a physical predecessor exists and users know it. Modern usage is selective — one realistic knob in an otherwise flat UI, not a leather-stitched everything.
**Fails when:** the metaphor doesn't map. A "bookshelf" of things that aren't books costs more than it teaches.

### Spatial / Depth UI
**Believes:** the interface occupies space; z-depth carries meaning.
**Moves:** parallax layers, real perspective transforms, depth-of-field blur on inactive layers, elements that move at different rates, 3D objects, light that comes from a consistent direction.
**Good at:** product showcases, immersive storytelling, spatial-computing contexts, hero moments.
**Fails when:** motion sickness. Respect `prefers-reduced-motion` seriously here — it's not optional garnish, it's the accessibility contract for this style.

---

## 4. Editorial & Type-Led

### Editorial
**Believes:** the reading experience is the design.
**Moves:** strong display/body hierarchy, measure held to 60–75 characters, pull quotes, drop caps, sidenotes, asymmetric columns, images that break the grid deliberately, generous leading, real typographic detail (hanging punctuation, proper dashes, old-style figures in running text).
**Good at:** long-form content, documentation that wants to be read, brand storytelling, essays, case studies.
**Fails when:** applied to interactive tools — editorial rhythm assumes linear reading, and apps aren't read linearly.

### Broadsheet / Newspaper
**Believes:** density is a virtue; the page is a map of importance.
**Moves:** hairline rules, tight dense columns, zero radius, condensed headline faces, small caps, dateline eyebrows, black and white with one spot color.
**Good at:** news, archives, changelogs, results pages, anything with genuine informational hierarchy.
**Fails when:** it's a costume over four cards. Broadsheet needs *volume* of content to justify itself. It has also become a common AI default — see `critique.md`.

### Kinetic Typography
**Believes:** type is the image.
**Moves:** oversized display type as the primary visual element, text that responds to scroll or cursor, letterforms as layout, variable-font weight or width animation, marquees, type that overlaps and masks images.
**Good at:** agencies, portfolios, launches, editorial covers, brands with a strong verbal identity.
**Fails when:** the words aren't good enough to be the image. This style has nowhere to hide weak copy.

### Variable-Type Systems
**Believes:** one typeface, continuously adjustable, is a system rather than a set.
**Moves:** weight and width axes tied to hierarchy or viewport, optical sizing, animated axis transitions on interaction, a single family doing the job of five.
**Good at:** performance-conscious, cohesive identities; responsive type that adapts rather than jumps.
**Fails when:** the axes get animated for their own sake.

---

## 5. Ornamental & Maximal

### Maximalism
**Believes:** more, arranged well, is a form of generosity.
**Moves:** dense layering, multiple type families, saturated clashing color, pattern, texture, ornament, imagery on imagery, every surface considered.
**Good at:** culture, food, fashion, festivals, personality-driven brands, anything competing for attention in a feed.
**Fails when:** density without hierarchy. Real maximalism is *rigorously* organized underneath — there's still a grid, still a reading order, still one focal point.
**Avoid when:** the user is trying to concentrate.

### Memphis / Postmodern
**Believes:** geometry and color should be joyful and slightly absurd.
**Moves:** squiggles, terrazzo speckle, primary and pastel clash, circles and triangles as free-floating elements, patterned fills, asymmetric composition.
**Good at:** creative tools, events, education, brands that want to feel unserious in a confident way.
**Fails when:** the squiggles float over a standard SaaS layout — that's a sticker pack, not a direction.

### Y2K / Frutiger Aero
**Believes:** optimistic technology, glossy and wet.
**Moves:** chrome and metallic gradients, bubbles, gloss highlights, lens flare, aqua blues and greens, bevels, transparency, skeuomorphic glass buttons, pixel and bitmap type accents.
**Good at:** nostalgia-driven consumer products, music, gaming, Gen-Z-facing brands.
**Fails when:** deployed at half strength. This style only works fully committed; a chrome button on a modern SaaS page is an accident.

### Vaporwave / Retro-Futurism
**Believes:** the future as it was imagined in the past.
**Moves:** magenta-cyan duotone, grid horizons, scanlines, CRT curvature, chromatic aberration, 80s–90s type, VHS artifacts, Greek statuary, glow.
**Good at:** music, gaming, crypto, night-time products, anything with an outsider identity.
**Fails when:** it's used past its cultural moment without irony or reinvention.

### Organic / Biomorphic
**Believes:** nothing in nature is a rectangle.
**Moves:** blob shapes, SVG curves, asymmetric radii, flowing dividers, hand-drawn line work, earth palettes, grain and paper texture, botanical illustration.
**Good at:** wellness, food, sustainability, healthcare, therapy, anything wanting to feel non-corporate.
**Fails when:** blobs are used as generic decorative background. The curve has to structure something.

---

## 6. Systems & Data

### Terminal / Monospace
**Believes:** the machine's own aesthetic, unapologetically.
**Moves:** monospace throughout, fixed character grid, ASCII rules and box drawing, green/amber-on-black or high-contrast light, cursor motifs, keyboard-first affordances, command palette as primary navigation.
**Good at:** developer tools, infrastructure, CLI companions, technical audiences who read this as respect.
**Fails when:** monospace is used for body copy at length — it reads slower. Also, this style now has its own cliché (the fake terminal window in a hero section).

### Data-Dense / Terminal-Trader
**Believes:** the expert user's time is worth more than their comfort.
**Moves:** small type (12–13px), tight row height, tabular figures, thin separators, color used only for state and delta, no decorative space, keyboard shortcuts, everything visible at once.
**Good at:** analytics, finance, ops, monitoring, admin tools used all day by trained people.
**Fails when:** applied to occasional users, who need onboarding rather than efficiency.

### Utilitarian Dashboard
**Believes:** clarity and consistency; get out of the way.
**Moves:** systematic card grid, restrained palette, one chart library used consistently, semantic color for status only, clear empty states, predictable filter and table patterns.
**Good at:** internal tools, B2B products, anything judged on how fast a task completes.
**Fails when:** it's cards-inside-cards-inside-cards with a KPI row of four boxes at the top. That's the default, not a decision.

### Bento
**Believes:** heterogeneous content, arranged in a modular tiled grid of varying cell sizes.
**Moves:** rounded tiles of different spans, each self-contained, consistent internal padding, subtle differentiation per tile.
**Good at:** feature overviews, capability showcases, dashboards with genuinely varied content types.
**Fails when:** used as the default layout for anything with more than four items. Bento became the reflexive AI answer to "arrange these features" — if you reach for it, be able to say why the content is genuinely modular and non-sequential.

---

## 7. Atmosphere & Motion

### Scroll-Narrative
**Believes:** scroll is a timeline; the page is a sequence.
**Moves:** pinned sections, scroll-scrubbed animation or video frames, staged reveals, progress indicators, chapters, horizontal scroll segments.
**Good at:** product stories, data narratives, launches, annual reports.
**Fails when:** scroll-jacking removes control, or the content could have been read in thirty seconds and now takes three minutes.

### Ambient / Generative
**Believes:** the interface has weather.
**Moves:** slow shader or canvas backgrounds, noise, particle fields, gradient meshes that drift, subtle audio-reactive or time-of-day response, motion at a rate you notice only if you look.
**Good at:** landing pages, creative tools, meditative products, anything wanting atmosphere rather than message.
**Fails when:** it's a mesh gradient loop behind a glass card — the most saturated combination in AI-generated design. Also watch battery and CPU cost.

### Dark / OLED
**Believes:** the surrounding darkness is a design surface.
**Moves:** true black or near-black base, elevation expressed by lightness rather than shadow, restrained saturation (bright saturated colors vibrate on dark), lowered white text opacity (~87%) to reduce halation, careful with pure white.
**Good at:** media, night use, developer tools, OLED battery savings, focus environments.
**Fails when:** it's a light design with inverted colors. Dark mode needs its own contrast, saturation, and elevation logic — most notably, shadows stop working as depth cues.

### Tactile Micro-Interaction
**Believes:** the feel of software is made of hundreds of details nobody consciously notices.
**Moves:** custom easing curves rather than CSS defaults, transitions (not keyframes) for interruptible states, origin-aware scale-in on popovers, optimistic UI, haptics, spring physics on drag, states that never flash or jump.
**Good at:** everything. This is less a style than a quality floor; it composes with any other direction.
**Rules of thumb:** UI transitions 150–300ms; high-frequency actions faster or not animated at all; `ease-out` for entrances, `ease-in-out` for movement, avoid `ease-in` on anything the user waits for; animate `transform` and `opacity` only.

---

## 8. Cross-cutting moves

Borrowable independent of direction:

- **Optical alignment over mathematical** — punctuation, icons, and round letterforms need manual nudging to *look* aligned.
- **Type scale from a ratio** — 1.2 for dense UI, 1.25–1.333 for general, 1.414–1.618 for editorial drama. Pick one and hold it.
- **OKLCH over HSL** — perceptually uniform lightness means a palette generated by holding L constant actually looks consistent; HSL doesn't.
- **One accent, used as punctuation** — a single high-chroma color that appears three or four times per screen is louder than six colors.
- **Contrast through weight and size, not just color** — hierarchy that survives grayscale survives everything.
- **Grain and texture at 2–4% opacity** — kills the plastic flatness of pure digital gradients.
- **Asymmetry as tension** — a strict grid broken deliberately in exactly one place reads as intent; broken everywhere reads as error.
- **Negative space as a component** — allocate it deliberately at the layout stage rather than treating it as leftover.
