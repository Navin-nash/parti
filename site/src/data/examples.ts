import type { ShowcaseExample } from "@/lib/schema";

/**
 * The benchmark examples.
 *
 * Each entry is one brief run twice. `provenance` records how the pair was
 * produced and the UI prints it, because the two kinds of evidence are not
 * equivalent:
 *
 *   measured  - two separate agent runs on the identical prompt, one required
 *               to use the skill and one denied it, then scored by scripts/.
 *               The figures shown come from that script output.
 *   authored  - both arms written to illustrate a difference documented
 *               elsewhere in the repo. No score is claimed.
 *
 * All five pairs here were produced as separate agent runs from a shared brief
 * (src/arms/BRIEFS.md), with the baseline runs denied the skill and never told
 * a comparison was happening. Only the Meridian pair in the skill repo carries
 * full script measurement, so only it is marked `measured`; claiming the
 * others were scored when they were not would be the exact failure this site
 * argues against.
 */

const SHARED_MATRIX_ROWS = [
  "Visual direction", "Typography", "Layout", "Density", "Color",
  "Motion", "Depth", "Signature", "Tokens", "States", "Responsive",
  "Accessibility",
] as const;

export const MATRIX_DIMENSIONS = SHARED_MATRIX_ROWS;

export const EXAMPLES: ShowcaseExample[] = [
  {
    id: "ex-01",
    slug: "finance-research-platform",
    plate: "PLATE 01",
    title: "Financial Research Platform",
    category: "Finance",
    brief: "A research workspace for serious independent investors.",
    sharedBrief:
      "Design the main workspace for Ledgerline, a research tool for serious independent investors - people who read filings, hold 15-40 positions for years, and write down why they bought before they buy. It is not a broker and it does not execute trades. The screen must let someone resume a half-finished thesis on a company after two weeks away, see what changed in their positions since they last looked, and jump into a company's filing history. Include: workspace navigation, a portfolio summary, a watchlist, the research/thesis panel for one company, a price chart, and an activity timeline.",
    tags: ["Finance", "Dashboard", "Data dense", "explore", "tokens", "build"],
    provenance: "authored",
    tell:
      "Look at the colour on the price deltas. The baseline colours every move green or red; the parti arm colours nothing except the one unresolved question in the thesis. That is a claim about what this user is actually here to decide.",
    baseline: {
      prompt:
        "Design the main workspace for Ledgerline, a research tool for serious independent investors. [full brief above, verbatim]",
      componentKey: "example/finance-research-platform/baseline",
      sourcePath: "src/arms/finance-research-platform/baseline.tsx",
      rationale:
        "A standard app shell: fixed left nav rail, a search and notification top bar, a four-up KPI strip, then a one-third / two-thirds split of positions and research panel with the activity timeline beneath. The thesis panel is the focal card with three tabs and a collapsible amber callout for the unresolved question, over an inline SVG area chart of the 24-month price against cost basis. This is competent work - it reads the brief, it uses the real tickers, and it puts the thesis in the focal position.",
      notes: [
        "Spacing is sensible but chosen per component rather than from a declared scale.",
        "Colour is authored in Tailwind palette classes across the file.",
      ],
    },
    parti: {
      prompt:
        "Design the main workspace for Ledgerline, a research tool for serious independent investors. [full brief above, verbatim] - with the parti skill loaded and followed.",
      commands: ["explore", "palette", "typeset", "tokens", "build", "states", "a11y"],
      direction: {
        name: "Fair Copy",
        thesis:
          "A long-term investor's real artifact isn't the marked-up filing - it's the fair copy, the clean memo they'd hand their future self once the thinking is done. The job is a slow re-read after two weeks away, not a fast scan, so the workspace should read like that memo, not a terminal.",
        nearestMovement: "Editorial long-form / the epistolary memo",
        departure:
          "Editorial layouts serve one linear read start to finish. This one serves a return visit mid-argument - footnotes let the reader keep their place in the prose while a citation comes to them, rather than sending them away to find it.",
        axes: {
          density: "measured",
          structure: "editorial-asymmetric",
          typeVoice: "editorial-serif",
          chroma: "duotone",
          motionPosture: "choreographed",
          depth: "layered-shadow",
        },
        signature:
          "The footnote - a small brass number set into the prose. Clicking it doesn't send you away: a citation strip rises from the foot of the memo, then settles back, the way a real memo already keeps a claim and its source together.",
        cost:
          "Marginalia's forty-position scan density and its instant, wordless 'something changed' read. Here the screen only comfortably holds six positions read carefully, and you read one sentence to find out what changed rather than seeing it at a glance.",
      },
      componentKey: "example/finance-research-platform/parti",
      sourcePath: "src/arms/finance-research-platform/parti.tsx",
      rationale:
        "A serious investor's writing already works like this on paper: the claim stays in view and the source comes to it, which is why the footnote became the signature rather than a margin mark. Prose that will be reread over years earns a serif built for reading, not a mono face borrowed from a terminal it isn't. Price moves are still deliberately not green and red: this is not a broker, and a minus three percent fortnight should not outrank an unresolved question in a five-year thesis - brass is reserved for exactly one meaning, a claim that needs your judgement.",
      tokens: {
        color: [
          { name: "p-bg", value: "#F7F3EA", role: "the page - warm paper", contrast: "-" },
          { name: "p-surface", value: "#FFFDF8", role: "the memo, appendix cards", contrast: "-" },
          { name: "p-tint", value: "#EFE8D8", role: "the return strip", contrast: "-" },
          { name: "p-rule", value: "#E0D6C0", role: "hairlines", contrast: "non-text" },
          { name: "p-rule-ctl", value: "#7D6E4B", role: "input underlines, dashed borders", contrast: "4.51:1 on bg" },
          { name: "p-ink", value: "#2A2318", role: "primary text", contrast: "14.0:1 on bg" },
          { name: "p-ink-2", value: "#5C4F3B", role: "secondary prose", contrast: "7.2:1 on bg" },
          { name: "p-ink-3", value: "#7A6D55", role: "labels, captions", contrast: "4.57:1 on bg" },
          { name: "p-accent", value: "#966517", role: "brass - the one drawn colour: a claim, a footnote, a needs-your-judgement mark", contrast: "4.55:1 on bg" },
        ],
        type: [
          { name: "p-font-serif", value: "Source Serif 4", role: "argument and headings - prose meant to be reread" },
          { name: "p-font-sans", value: "Inter", role: "every number and label" },
          { name: "p-t-xs", value: "11px", role: "captions, table labels" },
          { name: "p-t-sm", value: "13px", role: "secondary text, table cells" },
          { name: "p-t-base", value: "15.5px", role: "memo prose, line-height 1.65" },
          { name: "p-t-lg", value: "23px", role: "company name" },
          { name: "p-t-xl", value: "29px", role: "the return headline" },
        ],
        space: [
          { name: "p-s1", value: "4px", role: "base unit" },
          { name: "p-s3", value: "12px", role: "inside a block" },
          { name: "p-s5", value: "20px", role: "card padding" },
          { name: "p-s6", value: "28px", role: "between blocks" },
          { name: "p-s8", value: "40px", role: "page margin" },
        ],
        shape: [
          { name: "p-r", value: "3px", role: "card corner - paper, not a UI chip" },
          { name: "p-r-chip", value: "999px", role: "pills - range toggle, conviction badge" },
          { name: "p-e1", value: "0 1px 2px rgba(42,35,24,.07)", role: "appendix cards - resting on the desk" },
          { name: "p-e2", value: "0 10px 24px rgba(42,35,24,.12)", role: "the memo - the one lifted surface" },
        ],
        motion: [
          { name: "p-d-fast", value: "140ms", role: "hover and tab-underline feedback" },
          { name: "p-d-base", value: "220ms", role: "the footnote strip rising and settling" },
          { name: "p-d-slow", value: "420ms", role: "the memo settling on load; a page turning on tab change" },
          { name: "p-ease-out", value: "cubic-bezier(0.22,1,0.36,1)", role: "the only curve" },
        ],
      },
      states: [
        { name: "default", intent: "The memo as you left it, with what changed named in prose above it.", implemented: true },
        { name: "hover", intent: "Row and tab identification only; carries no information not already printed.", implemented: true },
        { name: "focus", intent: "Visible at 3:1 in brass, and never removed.", implemented: true },
        { name: "loading", intent: "Filings fetch from EDGAR on first open of that tab.", implemented: true, note: "Derived from tab-open-but-not-ready rather than stored, so it can only ever announce completion." },
        { name: "empty", intent: "Names the watchlist filter that caused it and offers to clear it.", implemented: true },
        { name: "error", intent: "A stale quote is marked in brass with how long it's been stale, at the row that's wrong.", implemented: true },
        { name: "overflow", intent: "22 activity entries and 4 filings without the memo growing past a comfortable read.", implemented: true },
      ],
      findings: [
        {
          finding: "The baseline colours every price delta green or red.",
          whyItHappens:
            "Directional colour on a financial figure is the strongest convention in the category, and it arrives before anyone asks what this particular user is deciding.",
          partiDecision:
            "Reserve colour for one meaning only: this needs your judgement. Price moves are printed as signed figures with no hue.",
          result:
            "The single unresolved question in an open thesis is one of the only brass things on the screen, which matches what the user came back to do.",
        },
        {
          finding: "Four KPI tiles across the top.",
          whyItHappens:
            "The KPI row is the single strongest visual prior for the word dashboard, and it is genuinely useful in monitoring products.",
          partiDecision:
            "No tiles. Portfolio state is a plain appendix table, read as figures rather than scanned as a gauge.",
          result:
            "The screen stops borrowing a consumer-analytics convention from a monitoring job this product does not do.",
        },
        {
          finding: "A citation, once clicked, would normally navigate the reader away from the claim it supports.",
          whyItHappens:
            "Standard footnote or citation patterns on the web are links - the fastest thing to reach for is an anchor jump or a new tab.",
          partiDecision:
            "The footnote strip rises in place at the foot of the memo and the claim never leaves view; closing it returns to exactly where the reader was.",
          result:
            "Checking a source costs one glance down and back, not a lost place in a five-paragraph thesis.",
        },
      ],
    },
    matrix: [
      { dimension: "Visual direction", baseline: "Competent modern app shell. No stated thesis.", parti: "Fair Copy - the workspace is the clean memo, not the marked-up filing." },
      { dimension: "Typography", baseline: "One sans family across the interface, sizes chosen per block.", parti: "Editorial serif for argument and headings, plain grotesque for every number and label. No mono." },
      { dimension: "Layout", baseline: "Nav rail, KPI strip, 1/3 + 2/3 split, timeline beneath.", parti: "Editorial-asymmetric: a wide memo column carries the argument, a narrow appendix carries the numbers." },
      { dimension: "Density", baseline: "Comfortable medium - the default when density is not decided.", parti: "Measured - one reading column at prose line-height, not blocks packed edge to edge." },
      { dimension: "Color", baseline: "Neutral ramp, brand accent, green/red on deltas.", parti: "Warm-paper duotone plus one brass accent meaning a claim needs your judgement." },
      { dimension: "Motion", baseline: "Standard transitions on hover and tab change.", parti: "Choreographed: the memo settles on load, and switching Thesis/Question/Filings turns a page, not a panel swap." },
      { dimension: "Depth", baseline: "Layered cards with shadows.", parti: "Layered-shadow with intent - the memo is lifted (e2), the appendix rests flat (e1)." },
      { dimension: "Signature", baseline: "None. Competent defaults throughout.", parti: "The footnote - a citation strip that rises to the claim instead of sending the reader away from it." },
      { dimension: "Tokens", baseline: "Colour authored in palette classes across the file; no declared scale.", parti: "A full token spec emitted before the build, used for every value." },
      { dimension: "States", baseline: "Ideal state, plus interaction states.", parti: "All seven, shipped in the same pass." },
      { dimension: "Responsive", baseline: "Table scrolls horizontally below the breakpoint.", parti: "Below the breakpoint the memo and appendix stack to one column, still asymmetric in weight, never equal." },
      { dimension: "Accessibility", baseline: "Reasonable, incompletely applied. Selection carried by colour in places.", parti: "AA verified with color.py; state carried by weight and underline as well as hue." },
    ],
  },

  {
    id: "ex-02",
    slug: "agent-platform-landing",
    plate: "PLATE 02",
    title: "AI Developer Tool Landing Page",
    category: "Developer tool",
    brief: "A runtime for building production AI agents.",
    sharedBrief:
      "Design the landing page for Cadence, a runtime for building production AI agents - durable execution, replayable runs, and typed tool boundaries. The audience is backend engineers who have already built an agent prototype that broke in production and are evaluating whether to adopt a runtime or keep hand-rolling. They are skeptical of AI marketing language. Include: hero, a real code example, capabilities, an architecture section, and a closing call to action.",
    tags: ["Developer tool", "Landing page", "Marketing", "explore", "deslop", "build"],
    provenance: "authored",
    tell:
      "The hero. One arm centres a headline over a gradient and shows a screenshot of the product; the other is typeset as a filed incident postmortem, with the real refund-agent source and its replay trace quoted in as labelled exhibits. Both are about durable execution. Only one of them reads like the document this audience already trusts.",
    baseline: {
      prompt: "Design the landing page for Cadence, a runtime for building production AI agents. [full brief above, verbatim]",
      componentKey: "example/agent-platform-landing/baseline",
      sourcePath: "src/arms/agent-platform-landing/baseline.tsx",
      rationale:
        "A conventional developer-tool landing page: two-column hero with copy left and a dark terminal-chrome code panel right holding the real refund agent definition, with a language tab switcher, copy button and line numbers. Below it a two-by-two capability grid, a three-node control plane / worker pool / event log architecture row with connecting arrows, and a centred CTA band. The code sample is real and correct, which is the part that matters most to this audience.",
      notes: ["The code panel is the strongest element and it is genuinely well made."],
    },
    parti: {
      prompt: "Design the landing page for Cadence, a runtime for building production AI agents. [full brief above, verbatim] - with the parti skill loaded and followed.",
      commands: ["explore", "deslop", "signature", "tokens", "build", "motion"],
      direction: {
        name: "Field Report",
        thesis:
          "This audience does not read landing pages, they read postmortems - the document written the morning after something broke, which is exactly what got them here. The page borrows that document form to carry the log's claim, quoting the code and the trace as exhibits rather than laying them out as a dashboard.",
        nearestMovement: "Editorial report / incident postmortem",
        departure:
          "A postmortem is usually an internal, unstyled document. Here it is deliberately typeset and paginated as if it were about to be printed and highlighted, with the evidence lifted off the page as physical exhibits rather than left inline as plain text.",
        axes: {
          density: "measured",
          structure: "editorial-asymmetric",
          typeVoice: "editorial-serif",
          chroma: "monochrome+accent",
          motionPosture: "still",
          depth: "layered-shadow",
        },
        signature:
          "The exhibit tab - the code and the log are quoted mid-paragraph as labelled, slightly rotated exhibits lifted off the page with their own shadow, exactly the way a photocopied attachment gets taped into a printed report. It exists because Cadence's claim is that a run is admissible evidence, not a vibe.",
        cost:
          "Scale as spectacle. There is no full-bleed dashboard, no scrubbable timeline, no dark rack-panel drama - a reader looking for a product screenshot to compare against a competitor's landing page will not find one.",
      },
      componentKey: "example/agent-platform-landing/parti",
      sourcePath: "src/arms/agent-platform-landing/parti.tsx",
      rationale:
        "The page is typeset as a filed incident report rather than a marketing surface: a doc-metadata strip in place of a hero stat row, prose paragraphs that quote the code and the log as evidence, and a closing 'action items' section in place of a generic CTA band. One ochre accent marks evidence and nothing else - no second status hue competes with it.",
      tokens: {
        color: [
          { name: "p-paper", value: "#F3EFE5", role: "the report page" },
          { name: "p-desk", value: "#E4DCC8", role: "the backdrop the page sits on" },
          { name: "p-mono-bg", value: "#E9E2CF", role: "exhibit and appendix fill" },
          { name: "p-rule", value: "#D8D0BC", role: "hairlines", contrast: "non-text" },
          { name: "p-ink", value: "#221D15", role: "primary text", contrast: "14.58:1 on paper" },
          { name: "p-ink-2", value: "#55503F", role: "secondary text", contrast: "7.02:1 on paper" },
          { name: "p-ink-3", value: "#8A8471", role: "labels, large text only", contrast: "3.25:1 on paper (AA large)" },
          { name: "p-accent", value: "#9A5A1F", role: "evidence: links, the exhibit tab, the failed-step underline", contrast: "4.74:1 on paper" },
          { name: "p-accent-ink", value: "#FBF7EE", role: "text on filled accent", contrast: "5.09:1 on accent" },
        ],
        type: [
          { name: "p-font-serif", value: "Source Serif 4", role: "headings and all prose - the report's voice" },
          { name: "p-font-mono", value: "IBM Plex Mono", role: "confined to exhibits: code and log transcripts only" },
          { name: "p-t-label", value: "11px", role: "eyebrows, doc metadata, exhibit captions" },
          { name: "p-t-body", value: "16.5px", role: "report prose" },
          { name: "p-t-md", value: "20px", role: "section heads" },
          { name: "p-t-xl", value: "clamp(30px,4.2vw,44px)", role: "the report title" },
        ],
        space: [
          { name: "p-s-1", value: "4px", role: "base unit" },
          { name: "p-s-4", value: "16px", role: "exhibit padding" },
          { name: "p-s-7", value: "48px", role: "section rhythm" },
          { name: "p-s-8", value: "72px", role: "cover / closing padding" },
        ],
        shape: [
          { name: "p-radius", value: "0", role: "a page and its exhibits have no corner radius" },
          { name: "p-e-1", value: "0 18px 40px -22px rgba(34,25,12,.45)", role: "the page lifted off the desk - the only large shadow" },
          { name: "p-e-2", value: "0 10px 18px -10px rgba(34,25,12,.4)", role: "an exhibit lifted off the page - the only small shadow" },
        ],
        motion: [
          { name: "p-d-1", value: "120ms", role: "the only duration: a colour fade on hover/focus" },
        ],
      },
      states: [
        { name: "default", intent: "The report at rest, exhibits collapsed to their excerpt.", implemented: true },
        { name: "hover", intent: "Links and controls fade to the accent - colour feedback only, no motion.", implemented: true },
        { name: "focus", intent: "Visible accent outline on every interactive element.", implemented: true },
        { name: "active", intent: "A finding expanded; the copy button's confirmed state.", implemented: true },
        { name: "overflow", intent: "The full nine-event trace and a worker pool of five, both in a scrolling exhibit rather than breaking the page.", implemented: true },
      ],
      findings: [
        {
          finding: "The hero shows a screenshot of the product rather than the product.",
          whyItHappens:
            "A picture of the interface is the conventional hero visual, and it is cheap. Nothing in the brief forces a decision about it.",
          partiDecision:
            "Open with a doc-metadata strip and quote the actual deployed code as Exhibit A, in the first viewport.",
          result:
            "The claim - that a run is quotable evidence - is demonstrated with the real artifact instead of illustrated with a mockup.",
        },
        {
          finding: "A gradient mesh behind the headline.",
          whyItHappens:
            "Decorative background treatment is a strong prior for a modern product page, and it is invisible to a reviewer as a decision because it reads as polish.",
          partiDecision:
            "No background treatment. Warm paper and a single lifted-page shadow; the interest comes from the exhibits.",
          result:
            "Nothing competes with the two things on the page worth reading closely: the code and the log.",
        },
        {
          finding: "Four rounded-square gradient icon tiles above the four capabilities.",
          whyItHappens:
            "Feature grids in the training set have decorative icons almost without exception, and the icons carry no information in almost all of them.",
          partiDecision:
            "Replace the grid with four numbered findings (F1-F4), each paired with what breaks without it, the way a postmortem's findings section reads.",
          result:
            "Each capability is argued from the incident that just got quoted, instead of asserted in a tile with no connection to the evidence above it.",
        },
      ],
    },
    matrix: [
      { dimension: "Visual direction", baseline: "Conventional developer-tool landing page, competently made.", parti: "Field Report - the page is a filed incident postmortem." },
      { dimension: "Typography", baseline: "Sans throughout, mono inside the code panel only.", parti: "Serif carries headings and all prose; mono is confined to exhibits only." },
      { dimension: "Layout", baseline: "Two-column hero, 2x2 grid, three-node row, centred CTA.", parti: "A single reading column with off-axis exhibits, like a report's body and its attachments." },
      { dimension: "Density", baseline: "Generous marketing spacing.", parti: "Measured. A report is read once, start to finish, at a comfortable line-height." },
      { dimension: "Color", baseline: "Neutral ramp plus a brand accent, gradient in the hero.", parti: "Warm paper and ink plus one ochre accent, reserved for evidence." },
      { dimension: "Motion", baseline: "Fade-up reveals on scroll.", parti: "Still. Disclosures snap open; the only motion is a 120ms hover fade." },
      { dimension: "Depth", baseline: "Cards with shadows; terminal chrome with a drop shadow.", parti: "Layered-shadow: the page lifted off a desk, exhibits lifted off the page - two magnitudes, one grammar." },
      { dimension: "Signature", baseline: "The code panel is the strongest element but is a category convention.", parti: "The exhibit tab - evidence taped into the report, rotated and shadowed like a real attachment." },
      { dimension: "Tokens", baseline: "Tailwind palette classes; no declared spec.", parti: "Declared token spec, used for every value." },
      { dimension: "States", baseline: "Ideal state plus interaction states.", parti: "All five that apply, including the full nine-event trace and worker pool as scrolling overflow." },
      { dimension: "Responsive", baseline: "Columns stack; the code panel scrolls.", parti: "The exhibit margin collapses and exhibits realign to the reading column; nothing scales down." },
      { dimension: "Accessibility", baseline: "Reasonable. Status conveyed partly by colour.", parti: "The failed step is carried by an icon, a label and an underline as well as by the accent; contrast verified." },
    ],
  },

  {
    id: "ex-03",
    slug: "campaign-analytics",
    plate: "PLATE 03",
    title: "Marketing Analytics Dashboard",
    category: "Analytics",
    brief: "Where next month's budget goes.",
    sharedBrief:
      "Design the campaign performance workspace for Northbound, used by a two-person growth team to decide where next month's budget goes. The job is a reallocation decision made once a week, not passive monitoring. The screen must make it obvious which campaigns are worth more money and which should be cut. Include: KPI summary, a chart, a campaign table, filters, and an insight panel.",
    tags: ["Analytics", "Dashboard", "Decision support", "explore", "density", "build"],
    provenance: "authored",
    tell:
      "Find the podcast test in both. It has a high CAC on a small sample, which means its number is not yet meaningful. Check whether each arm ranks it as if the number were real.",
    baseline: {
      prompt: "Design the campaign performance workspace for Northbound. [full brief above, verbatim]",
      componentKey: "example/campaign-analytics/baseline",
      sourcePath: "src/arms/campaign-analytics/baseline.tsx",
      rationale:
        "A decision-oriented dashboard: a KPI row where deltas are coloured by whether the direction is good rather than merely up, a two-thirds bar chart beside a one-third insight panel that states an actual recommendation for the unallocated budget, and a sortable campaign table with per-row sparklines and an explicit Scale / Hold / Cut verdict. The podcast test is flagged low-sample rather than ranked as if its CAC were reliable. This is thoughtful work and it reads the brief closely.",
      notes: [
        "The low-sample flag is a genuinely good call that the baseline made unprompted.",
        "Verdict badges rely on colour plus a word, which is the right instinct.",
      ],
    },
    parti: {
      prompt: "Design the campaign performance workspace for Northbound. [full brief above, verbatim] - with the parti skill loaded and followed.",
      commands: ["explore", "density", "palette", "tokens", "build", "states"],
      direction: {
        name: "Displacement",
        thesis:
          "A weekly budget review is a zero-sum trade, not monitoring: the pot is fixed, so every pound argued into one line has to be argued out of another. This screen is an allocation instrument first and a report second - you move the money here, and the interface makes you feel what the move costs.",
        nearestMovement: "Information design / Tufte",
        departure:
          "Tufte optimises for density of evidence. This optimises for one recurring choice, so evidence that does not bear on the choice - trend archaeology, cohort views, a date-range picker - is left out rather than quietened.",
        axes: {
          density: "measured",
          structure: "modular-bento",
          typeVoice: "neutral-utility",
          chroma: "duotone",
          motionPosture: "responsive-only",
          depth: "flat",
        },
        signature:
          "The balance beam - a fixed-width master bus above the rack showing the whole pot as one segmented bar, a live allocated/unallocated readout, and a hatched overflow segment that runs past the end when you over-commit. It never silently rebalances; it tells you the number and makes you find it.",
        cost:
          "Trend archaeology - no date-range picker, no cohort view, so 'why did last Tuesday spike' is someone else's question. Also any sense of celebration: nothing here ever turns green.",
      },
      componentKey: "example/campaign-analytics/parti",
      sourcePath: "src/arms/campaign-analytics/parti.tsx",
      rationale:
        "The content demands measured rather than dense: six campaigns, once a week, by two people who do not live in this tool. Confidence is drawn as segment saturation on the allocation bar and a plain-language label per row (thin / usable / solid), so a small-sample campaign is visibly pale rather than footnoted - the podcast test renders palest of all six because n=11.",
      tokens: {
        color: [
          { name: "p-bg", value: "#EDEBE6", role: "the board" },
          { name: "p-ink", value: "#191814", role: "primary text, the bar fill", contrast: "14.9:1 on bg" },
          { name: "p-ink-2", value: "#4E4A42", role: "secondary text", contrast: "7.4:1 on bg" },
          { name: "p-ink-3", value: "#6E695F", role: "tertiary / labels", contrast: "4.6:1 on bg" },
          { name: "p-rule", value: "#CFCAC0", role: "hairline section dividers", contrast: "decorative, not required" },
          { name: "p-edge", value: "#847F70", role: "functional borders - chips, fader track, inputs", contrast: "3.4:1 on bg, UI/non-text" },
          { name: "p-conf", value: "#5B21B6", role: "the only accent - overflow, low-confidence flag, stale-data flag", contrast: "7.5:1 on bg" },
        ],
        type: [
          { name: "p-font", value: "Chivo", role: "the only family - interface, prose, every figure, tabular-nums throughout" },
          { name: "p-t-2xs", value: "10px", role: "column labels, meta" },
          { name: "p-t-base", value: "15px", role: "body prose" },
          { name: "p-t-num", value: "31px", role: "the figures that carry the decision" },
          { name: "p-t-pot", value: "clamp(34px,5.2vw,54px)", role: "the pot itself - the one number everything else is measured against" },
        ],
        space: [
          { name: "p-s1", value: "4px", role: "base unit" },
          { name: "p-s4", value: "16px", role: "row gaps" },
          { name: "p-s5", value: "24px", role: "section padding" },
          { name: "p-s7", value: "48px", role: "gaps between the header's four figures" },
        ],
        shape: [
          { name: "radius", value: "0", role: "square throughout - nothing is a card" },
          { name: "border width", value: "1px, 2px on the beam's ends and the header rule", role: "the only two weights" },
          { name: "shadow", value: "none", role: "elevation is a ground step, except the fader track" },
        ],
        motion: [
          { name: "p-d", value: "140ms", role: "the only duration - a bar segment resizing because a fader moved" },
          { name: "p-ease", value: "cubic-bezier(0.3,0,0,1)", role: "the only curve" },
        ],
      },
      states: [
        { name: "default", intent: "The board with last week's allocation and this week's proposal.", implemented: true },
        { name: "hover", intent: "Fader buttons and filter chips darken; focus rings show the reachable segments.", implemented: true },
        { name: "focus", intent: "Every control - group chip, sort toggle, fader, range input - reachable and outlined.", implemented: true },
        { name: "loading", intent: "Shape-matched plates stand in for the beam and rack on first load; no shimmer, since nothing here animates on its own.", implemented: true },
        { name: "empty", intent: "A filter/threshold combination clears every row; names the filter and offers to undo it.", implemented: true },
        { name: "error", intent: "One campaign's attribution feed is stale; a banner names which one and how many hours behind.", implemented: true },
        { name: "overflow", intent: "The bus bar's segments never collapse to zero width and the rack is a plain scrolling list, so a larger roster degrades gracefully.", implemented: true },
      ],
      findings: [
        {
          finding: "A KPI row of four large aggregate figures.",
          whyItHappens:
            "It is the standard opening of an analytics screen, and aggregates are always available.",
          partiDecision:
            "Lead with the balance beam - the decision itself - and demote aggregates to a supporting line beside it.",
          result:
            "The first thing on screen is the thing the user came to change, not a summary of what already happened.",
        },
        {
          finding: "Small-sample uncertainty carried by a text flag.",
          whyItHappens:
            "Flagging it in text is correct and cheap. Drawing it requires deciding how uncertainty should look.",
          partiDecision:
            "Draw confidence as segment saturation on the allocation bar itself, so a thin-sample campaign is visibly pale, not footnoted.",
          result:
            "The ambiguity is legible at a glance - the podcast test is the palest segment on the bar before you read a single number.",
        },
        {
          finding: "Dense layout on a screen used once a week by two people.",
          whyItHappens:
            "Density is inherited from the word dashboard rather than derived from the frequency of use.",
          partiDecision:
            "Measured, not dense. Weekly use by non-specialists does not license the density a daily tool earns.",
          result:
            "The screen is legible to someone who has not seen it in seven days, which is the actual usage pattern.",
        },
      ],
    },
    matrix: [
      { dimension: "Visual direction", baseline: "Decision-oriented dashboard, well reasoned.", parti: "Displacement - the screen is shaped like the weekly reallocation, not a report." },
      { dimension: "Typography", baseline: "One sans family; figures proportional in places.", parti: "One family, Chivo, tabular-nums everywhere - no separate display or mono face." },
      { dimension: "Layout", baseline: "KPI row, 2/3 chart + 1/3 insight, table beneath.", parti: "Modular-parallel - six identical strips racked under one master bus." },
      { dimension: "Density", baseline: "Dense, inherited from the category.", parti: "Measured with extreme scale contrast - a 54px pot figure against 10px labels." },
      { dimension: "Color", baseline: "Neutral plus semantic green and red on deltas.", parti: "Graphite plus one violet accent meaning overflow, low confidence, or a stale source - never good/bad." },
      { dimension: "Motion", baseline: "Standard hover and sort transitions.", parti: "Responsive-only. Bar segments resize in 140ms because a fader moved, and that is the only motion." },
      { dimension: "Depth", baseline: "Cards with subtle shadows.", parti: "Flat except the fader track, the one recessed element. Zero shadow." },
      { dimension: "Signature", baseline: "The Scale / Hold / Cut verdict column is close to one.", parti: "The balance beam - the whole pot as one segmented bar with a hatched overflow run." },
      { dimension: "Tokens", baseline: "Palette classes; spacing per component.", parti: "Declared spec with a 4px base, one duration, one curve." },
      { dimension: "States", baseline: "Ideal plus interaction states; low-sample handled well.", parti: "All seven, including a stale-source banner and a shape-matched first-load plate." },
      { dimension: "Responsive", baseline: "Table scrolls horizontally on mobile.", parti: "Rack becomes per-campaign records in a 2-column grid; the bus bar stays full-width." },
      { dimension: "Accessibility", baseline: "Good. Verdict uses colour plus a word.", parti: "AA verified; confidence is saturation plus a plain-language label, so it never depends on colour alone." },
    ],
  },

  {
    id: "ex-04",
    slug: "infrastructure-docs",
    plate: "PLATE 04",
    title: "Infrastructure API Documentation",
    category: "Documentation",
    brief: "Documentation for a message-delivery API.",
    sharedBrief:
      "Design the documentation reading experience for the Relay API, a message delivery infrastructure product. The reader is an engineer mid-integration with a terminal open in the next window, usually arriving from search, and usually needing exactly one parameter or one error code. Include: sidebar navigation, a documentation page header, code blocks, an API reference table, and search.",
    tags: ["Documentation", "Developer tool", "Data dense", "explore", "typeset", "build"],
    provenance: "authored",
    tell:
      "Arrive at the page as if from a search result and try to find the retry_policy parameter without reading anything. Time both.",
    baseline: {
      prompt: "Design the documentation reading experience for the Relay API. [full brief above, verbatim]",
      componentKey: "example/infrastructure-docs/baseline",
      sourcePath: "src/arms/infrastructure-docs/baseline.tsx",
      rationale:
        "A clean, familiar documentation layout: three-column shell with a nav sidebar, prose column, and an on-page table of contents. Parameters in a table with type and required columns, code samples in a tabbed panel with copy buttons, and errors in a definition list. This is close to the category standard because the category standard is genuinely good, and a reader who has used any modern API docs will be immediately oriented.",
      notes: ["Familiarity is a real asset here and the baseline is right to lean on it."],
    },
    parti: {
      prompt: "Design the documentation reading experience for the Relay API. [full brief above, verbatim] - with the parti skill loaded and followed.",
      commands: ["explore", "typeset", "density", "tokens", "build", "responsive"],
      direction: {
        name: "Marginalia",
        thesis:
          "An engineer integrating against a spec reads the prose once for shape, then lives in the margin - the exact constraint jotted beside the exact term. The page is built as an annotated document, not a scannable index.",
        nearestMovement: "Annotated manuscript / RFC marginal notes",
        departure:
          "A manuscript's margin is static print. This one only fills in where there is something to annotate, and a search can pull a note forward with a drawn-in leader.",
        axes: {
          density: "measured",
          structure: "editorial-asymmetric",
          typeVoice: "editorial-serif",
          chroma: "monochrome+accent",
          motionPosture: "responsive-only",
          depth: "layered-shadow",
        },
        signature:
          "The margin note - every parameter and error is a compact fact on the left with its explanation pinned as an elevated card beside it, connected by a short hand-drawn leader. Depth is spent exactly once, on this element.",
        cost:
          "Single-glance grep density. A reader who wants every constraint in one eye-sweep across a compact grid gets more travel here, traded for prose that reads correctly the first time.",
      },
      componentKey: "example/infrastructure-docs/parti",
      sourcePath: "src/arms/infrastructure-docs/parti.tsx",
      rationale:
        "Compact facts (name, type, required, default) stay compact in a real reference table; the explanation and constraint move into a pinned margin note beside the row instead of crowding the cell. Search draws the matched term's leader in like a pen underlining it, then floats its note into view - so a reader arriving mid-integration still lands on one row, without the page defaulting back to dense mono grid lines.",
      tokens: {
        color: [
          { name: "p-ground", value: "#EAEDE8", role: "the page - cool sage paper, not warm cream" },
          { name: "p-card", value: "#FBFBF9", role: "the margin note and code figure", contrast: "non-text" },
          { name: "p-ink", value: "#1B211D", role: "prose and headings", contrast: "13.9:1 on ground" },
          { name: "p-ink-2", value: "#4B564E", role: "secondary prose", contrast: "6.5:1 on ground" },
          { name: "p-ink-3", value: "#626D65", role: "labels and meta", contrast: "4.6:1 on ground" },
          { name: "p-accent", value: "#28457A", role: "cobalt ink - links, matched state, active nav", contrast: "8.0:1 on ground" },
          { name: "p-error", value: "#8C3B2E", role: "4xx status numerals", contrast: "6.4:1 on ground" },
          { name: "p-ok", value: "#2F5D40", role: "the POST badge and 2xx mentions", contrast: "7.6:1 white-on-fill" },
        ],
        type: [
          { name: "p-font-serif", value: "Newsreader", role: "prose and headings - built for long-form optical sizing" },
          { name: "p-font-mono", value: "IBM Plex Mono", role: "identifiers only - a marked, minority voice" },
          { name: "p-t-md", value: "16px", role: "body, 1.7 line-height" },
          { name: "p-t-lg", value: "19px", role: "intro paragraph" },
          { name: "p-t-2xl", value: "34px", role: "the page h1" },
        ],
        space: [
          { name: "p-s3", value: "16px", role: "base rhythm unit" },
          { name: "p-s4", value: "24px", role: "row and section padding" },
          { name: "note width", value: "248px", role: "the margin rail - present only where annotating" },
        ],
        shape: [
          { name: "p-r-sm", value: "4px", role: "table rows, inputs, chips" },
          { name: "p-r-md", value: "10px", role: "the margin note and code figure - an index-card corner" },
          { name: "p-note-shadow", value: "0 1px 2px + 0 10px 22px -10px", role: "spent once, on the margin note only" },
        ],
        motion: [
          { name: "p-d-fast", value: "120ms", role: "hover and focus feedback" },
          { name: "p-d-draw", value: "420ms", role: "the leader-and-underline draw-in on a search match" },
          { name: "p-ease", value: "cubic-bezier(0.2, 0, 0, 1)", role: "every transition" },
        ],
      },
      states: [
        { name: "default", intent: "The reference at rest, notes visible beside every row.", implemented: true },
        { name: "hover", intent: "Copy affordance and nav identification.", implemented: true },
        { name: "focus", intent: "Every control and anchor reachable with a visible cobalt ring.", implemented: true },
        { name: "empty", intent: "A search with no matches names the query and suggests errors or clearing it.", implemented: true },
        { name: "overflow", intent: "The parameter list scrolls within a bounded column past five rows without breaking the note rail.", implemented: true },
      ],
      findings: [
        {
          finding: "Parameters presented as a dense table with the explanation packed into the same cell as the type and constraint.",
          whyItHappens:
            "It is the category standard, and cramming everything into one row reads as efficient even when it slows comprehension on first read.",
          partiDecision:
            "Split the row: name, type, required and default stay a compact fact; description and constraint move into a pinned margin note beside it.",
          result:
            "The table stays scannable and the explanation stays readable - neither is fighting the other for the same six inches.",
        },
        {
          finding: "A found search result is marked by a colour flash on the row.",
          whyItHappens:
            "A background flash is the cheapest 'it matched' signal and it reads fine in a sighted demo.",
          partiDecision:
            "The matched term's leader line draws in stroke-first, like a pen underlining it, before its note is highlighted.",
          result:
            "The motion shows arrival at a specific word, not just a binary hit - and it is the one moment this direction spends motion on.",
        },
        {
          finding: "Every page in the docs family on this site reaches for a dense mono grid with an amber or duotone accent.",
          whyItHappens:
            "Once one arm on the site lands on 'terminal-adjacent dense mono,' every other technical brief reads as an invitation to repeat it.",
          partiDecision:
            "Serif prose, a cool sage ground, a single cobalt accent, and depth spent on exactly one element - the margin note - instead of a flat mono grid.",
          result:
            "This example now reads as a different family of tool from its siblings even in grayscale, not just a different palette on the same skeleton.",
        },
      ],
    },
    matrix: [
      { dimension: "Visual direction", baseline: "Category-standard three-column docs. Familiar and effective.", parti: "Marginalia - the docs are an annotated manuscript." },
      { dimension: "Typography", baseline: "Sans prose, mono in code blocks.", parti: "Serif carries prose and headings; mono is reserved for identifiers only." },
      { dimension: "Layout", baseline: "Nav / prose / table of contents.", parti: "Editorial-asymmetric: one reading column with an intermittent margin rail." },
      { dimension: "Density", baseline: "Comfortable reading density.", parti: "Measured - real paragraphs, 1.7 line-height, a 68ch prose measure." },
      { dimension: "Color", baseline: "Neutral ramp plus a brand accent on links.", parti: "Cool sage paper plus one cobalt ink accent - no amber, no cream, no terracotta." },
      { dimension: "Motion", baseline: "Standard transitions.", parti: "Responsive-only, one moment: a matched term's leader draws in like a pen underlining it." },
      { dimension: "Depth", baseline: "Cards around code samples.", parti: "Flat everywhere except the margin note, which is elevated once, on purpose." },
      { dimension: "Signature", baseline: "None specific to this product.", parti: "The margin note - a pinned index card connected to its row by a hand-drawn leader." },
      { dimension: "Tokens", baseline: "Palette classes.", parti: "Declared spec including the 248px note rail and the two-typeface split." },
      { dimension: "States", baseline: "Ideal plus interaction states.", parti: "All five, including a search-empty that names the query." },
      { dimension: "Responsive", baseline: "Sidebar collapses; tables scroll.", parti: "Notes drop under their row below md; the reading column stays full width down to 375px." },
      { dimension: "Accessibility", baseline: "Good. Current page by colour.", parti: "Matched state carries an underline and a border change, not colour alone; contrast verified." },
    ],
  },

  {
    id: "ex-05",
    slug: "product-page",
    plate: "PLATE 05",
    title: "E-commerce Product Page",
    category: "E-commerce",
    brief: "A $189 field knife from an eleven-year-old workshop.",
    sharedBrief:
      "Design the product page for the Kestrel, a $189 fixed-blade field knife from a small manufacturer that has made the same three products for eleven years. Buyers research for weeks and read the steel specification before they read the marketing. The page must survive that scrutiny and still sell. Include: gallery, purchase area, product information, recommendations, and trust signals.",
    tags: ["E-commerce", "Marketing", "Considered purchase", "explore", "signature", "build"],
    provenance: "authored",
    tell:
      "Find the steel specification in both. This buyer reads CPM-3V and 0.14 inch stock before they read a single adjective; where each arm puts that information is the whole argument.",
    baseline: {
      prompt: "Design the product page for the Kestrel. [full brief above, verbatim]",
      componentKey: "example/product-page/baseline",
      sourcePath: "src/arms/product-page/baseline.tsx",
      rationale:
        "A well-executed premium product page: large gallery with thumbnails, a sticky purchase column with option pickers for scale colour and sheath, a specification table below the fold, a recommendations row, and trust badges for the lifetime sharpening and the two-week lead time. Clean, generous, and close to the best-practice pattern for a considered purchase.",
      notes: ["The option pickers are well built and the lead time is stated honestly and early."],
    },
    parti: {
      prompt: "Design the product page for the Kestrel. [full brief above, verbatim] - with the parti skill loaded and followed.",
      commands: ["explore", "signature", "copy", "tokens", "build", "responsive"],
      direction: {
        name: "Spec Card",
        thesis:
          "This buyer researches for weeks and arrives already suspicious of marketing, so the page should read as the maker's own specification sheet rather than as an advertisement for it.",
        nearestMovement: "Industrial / catalogue typography",
        departure:
          "A catalogue treats every item identically. This is a workshop that has made three products for eleven years, so the page can afford the specificity a catalogue cannot.",
        axes: {
          density: "measured",
          structure: "editorial-asymmetric",
          typeVoice: "mono-technical",
          chroma: "achromatic-with-material",
          motionPosture: "still",
          depth: "flat",
        },
        signature:
          "The dimensioned drawing - the knife rendered as a measured line drawing with leader lines to the actual figures, so the specification and the picture are one object.",
        cost:
          "Impulse appeal and lifestyle photography. Someone shopping for a gift will find this page cold.",
      },
      componentKey: "example/product-page/parti",
      sourcePath: "src/arms/product-page/parti.tsx",
      rationale:
        "The specification moves above the fold and the marketing copy moves below it, because that is the order this buyer reads in. Motion posture is still: a considered purchase researched over weeks gains nothing from movement, and every animation on a page like this reads as a sales technique.",
      tokens: {
        color: [
          { name: "p-paper", value: "#F4F2ED", role: "the sheet" },
          { name: "p-panel", value: "#FFFFFF", role: "the drawing field" },
          { name: "p-rule", value: "#D6D2C8", role: "leader lines and hairlines", contrast: "non-text" },
          { name: "p-ink", value: "#1C1A16", role: "primary", contrast: "15.2:1 on paper" },
          { name: "p-ink-2", value: "#57534A", role: "secondary", contrast: "6.9:1 on paper" },
          { name: "p-dim-line", value: "#8A5A2B", role: "dimension callouts - the only accent", contrast: "4.9:1 on paper" },
        ],
        type: [
          { name: "p-font-mono", value: "technical mono", role: "every figure and dimension" },
          { name: "p-font-sans", value: "grotesque", role: "prose and controls" },
          { name: "p-t-dim", value: "11px", role: "dimension callouts" },
          { name: "p-t-body", value: "15px", role: "body" },
          { name: "p-t-spec", value: "17px", role: "specification values" },
          { name: "p-t-name", value: "30px", role: "the product name, once" },
        ],
        space: [
          { name: "p-s-1", value: "4px", role: "base unit" },
          { name: "p-s-5", value: "20px", role: "block padding" },
          { name: "p-s-8", value: "40px", role: "between blocks" },
          { name: "p-s-12", value: "80px", role: "section rhythm" },
        ],
        shape: [
          { name: "p-radius", value: "0", role: "a drawing sheet has square corners" },
          { name: "p-rule-w", value: "1px", role: "the only border weight" },
          { name: "p-shadow", value: "none", role: "no elevation on a flat sheet" },
        ],
        motion: [
          { name: "p-d-1", value: "0ms", role: "still posture. Only focus and press respond." },
          { name: "p-d-press", value: "80ms", role: "control press feedback, the one exception" },
        ],
      },
      states: [
        { name: "default", intent: "The specification sheet.", implemented: true },
        { name: "hover", intent: "Option identification only.", implemented: true },
        { name: "focus", intent: "Every option and control reachable and visibly focused.", implemented: true },
        { name: "active", intent: "The selected scale colour and sheath, stated in text as well as shown.", implemented: true },
        { name: "disabled", intent: "An unavailable combination says why and when it returns.", implemented: true },
        { name: "error", intent: "A failed add-to-cart names the cause and preserves the selection.", implemented: true },
      ],
      findings: [
        {
          finding: "The specification table sits below the fold, under the marketing copy.",
          whyItHappens:
            "Product pages in the training set lead with imagery and copy, because most products are not bought this way.",
          partiDecision:
            "The specification moves above the fold; the copy moves below it.",
          result:
            "The page is ordered the way this specific buyer reads, which is the whole reason to design it rather than template it.",
        },
        {
          finding: "Scroll-triggered fade-ups on the gallery and the recommendations.",
          whyItHappens:
            "Reveal animation is the default way to make a marketing page feel finished.",
          partiDecision:
            "Still posture. Nothing animates except focus and press.",
          result:
            "The page stops performing, which for a buyer who has already researched for weeks is the more persuasive posture.",
        },
        {
          finding: "Trust conveyed by badge icons - a shield, a truck, a return arrow.",
          whyItHappens:
            "Trust badges are the conventional unit and they are recognisable at a glance.",
          partiDecision:
            "State the actual terms: eleven years, three products, two-week lead time, lifetime sharpening, and where it is made.",
          result:
            "Each claim is specific enough to be checked, which is what earns trust from a buyer who is looking for reasons to doubt.",
        },
      ],
    },
    matrix: [
      { dimension: "Visual direction", baseline: "Premium product page, best-practice pattern.", parti: "Spec Card - the page is the maker's specification sheet." },
      { dimension: "Typography", baseline: "One sans family; figures proportional.", parti: "Mono for every figure and dimension; sans for prose and controls." },
      { dimension: "Layout", baseline: "Gallery left, sticky purchase column right, specs below.", parti: "Editorial asymmetric led by the dimensioned drawing; specification above the fold." },
      { dimension: "Density", baseline: "Generous, as premium product pages are.", parti: "Measured. Generous enough to feel considered, dense enough to carry the spec." },
      { dimension: "Color", baseline: "Warm neutral plus a brand accent.", parti: "Achromatic paper and ink, plus one dimension-line accent." },
      { dimension: "Motion", baseline: "Fade-ups on scroll; gallery crossfade.", parti: "Still. Only focus and press respond, and press is 80ms." },
      { dimension: "Depth", baseline: "Cards and soft shadows on the gallery.", parti: "Flat. A drawing sheet has no elevation." },
      { dimension: "Signature", baseline: "None specific to this maker.", parti: "The dimensioned drawing with leader lines to the real figures." },
      { dimension: "Tokens", baseline: "Palette classes; spacing per section.", parti: "Declared spec with a 4px base." },
      { dimension: "States", baseline: "Ideal plus interaction states.", parti: "All six, including an unavailable combination that says when it returns." },
      { dimension: "Responsive", baseline: "Columns stack; sticky column releases.", parti: "The drawing reflows its leader lines rather than scaling; spec stays first." },
      { dimension: "Accessibility", baseline: "Good. Selected option marked by colour and ring.", parti: "Selection stated in text as well as shown; contrast verified." },
    ],
  },
];

export function exampleBySlug(slug: string): ShowcaseExample | undefined {
  return EXAMPLES.find((e) => e.slug === slug);
}

export function exampleSlugs(): string[] {
  return EXAMPLES.map((e) => e.slug);
}
