"""Generate src/data/components.ts.

The authored content lives here rather than in the .ts file so the repetitive
scaffolding (state lists, registry keys, source paths) is derived instead of
copy-pasted 41 times. Re-run after adding a pair.
"""

import json
import pathlib

# slug, name, group, directionKey, brief, tell, findings[(finding, why, decision, result)]
C = [
    # ------------------------------------------------------------- marketing
    ("navigation-bar", "Navigation Bar", "Marketing", "append-only",
     "Primary site navigation for a developer runtime.",
     "Count the affordances. The baseline navbar is a centred pill with a gradient CTA; the parti one is flush, carries the run sequence number, and its CTA names the actual next step rather than 'Get started'.",
     [("A floating rounded navbar detached from the top edge",
       "It is the single most-copied navigation pattern in current generated output, so it is what the model reaches for before reading the brief.",
       "Flush to the top on a hairline, with the run-sequence gutter continuing through it.",
       "The navigation stops being a separate decorative object and becomes the first record of the journal the page is."),
      ("CTA labelled 'Get started'",
       "It is the highest-frequency CTA string on the web, so it is the safest completion.",
       "The control names what happens: it opens a run you can step through.",
       "A skeptical engineer can tell what the click costs before making it.")]),

    ("announcement-bar", "Announcement Bar", "Marketing", "append-only",
     "A dismissible strip announcing a change above the navigation.",
     "The baseline bar is a gradient strip with an emoji and a chevron. The parti one is a changelog line with a version and a date, because that is what this audience wants from an announcement.",
     [("Gradient strip with an emoji and the word New",
       "Announcement bars in training data are marketing furniture, so marketing furniture is what gets produced.",
       "One appended record: version, date, one clause, and a link to the diff.",
       "The bar becomes readable at a glance by someone deciding whether to care, and it dismisses without losing the information.")]),

    ("hero", "Hero", "Marketing", "append-only",
     "The first screen: what this is, who it is for, and one proof.",
     "The clearest single contrast in the library. The baseline hero centres a headline over a gradient with a product screenshot; the parti hero renders a real failed-then-resumed run with a working replay scrubber.",
     [("Centred headline, subhead, two buttons, product screenshot",
       "It is the structural default of nearly every SaaS hero in the training set, and it is genuinely safe - it works, which is exactly why it converges.",
       "Show the artifact instead of describing it: an actual span waterfall from a run that was interrupted mid-execution and resumed.",
       "The proof is on screen in the first viewport instead of being promised three sections down."),
      ("A gradient mesh behind the headline",
       "Decorative background gradients are a strong prior for 'this is a modern product page'.",
       "No background treatment at all. The ground is one flat value and the interest comes from the run record.",
       "Nothing competes with the one thing on the page worth looking at."),
      ("A screenshot of a dashboard as the hero visual",
       "A picture of the product is the conventional way to show the product.",
       "Render the product. It is a web app; a live component costs the same as an image and can be interacted with.",
       "The visitor can step through a run in the hero rather than squinting at a picture of one.")]),

    ("cta", "CTA", "Marketing", "append-only",
     "The closing call to action.",
     "Read the two button labels. One offers to start a free trial; the other names the specific next step this audience would actually take.",
     [("'Start your free trial' over a saturated band",
       "The pattern is so common it arrives without a decision being made.",
       "The closing record of the run journal, with the two real next steps named.",
       "The page ends where it began - as one continuous artifact - rather than switching register to sell.")]),

    ("feature-grid", "Feature Grid", "Marketing", "append-only",
     "Four capabilities, presented so a skeptic can evaluate them.",
     "Look at the icons. The baseline has four rounded-square gradient tiles above four headings; the parti arm has none, and uses the offset in the run where each capability applies.",
     [("Rounded-square gradient icon tiles above each feature heading",
       "Feature grids in the training set almost always carry decorative icons, and the icons carry no information in any of them.",
       "The sequence marker each capability applies at, drawn from the run itself.",
       "The numbering now encodes something true - where in an execution the feature matters - rather than being 01/02/03."),
      ("Three or four equal cards in a symmetric row",
       "Equal cards are the least-risk layout, so they are the default completion.",
       "Records of unequal height on one grid, sized by how much each actually needs to say.",
       "The layout stops implying the four things are equally important when they are not.")]),

    ("logo-cloud", "Logo Cloud", "Marketing", "append-only",
     "Social proof by association.",
     "The baseline shows six grey company wordmarks. The parti arm shows what this audience actually evaluates on, because an unnamed logo row is unfalsifiable.",
     [("A row of desaturated company logos",
       "It is the standard social-proof unit and it reads as credible at a glance.",
       "State the deployment shape instead - runtime, scale, and workload class - since those are checkable and a logo is not.",
       "The section says something a skeptical reader can act on, and it does not require inventing customers.")]),

    ("testimonial", "Testimonial", "Marketing", "append-only",
     "One quote, presented so it is worth reading.",
     "Neither arm invents a named person at a named company. Compare what each does with that constraint instead.",
     [("A quote card with a circular avatar and a full name at a real company",
       "Testimonials in training data have avatars and names, so the model fabricates them.",
       "Attribute by role and system, and set the quote as a journal entry rather than a card.",
       "The proof is honest and the layout stops needing a face it does not have.")]),

    ("pricing", "Pricing", "Marketing", "append-only",
     "Three tiers and the decision between them.",
     "Look at how the recommended tier is marked. One lifts it with a shadow and a scale transform; the other steps the ground and prints a reason.",
     [("The middle tier lifted with a shadow, a border glow and 'Most popular'",
       "Emphasis-by-elevation is the reflex, and 'Most popular' is the default badge string.",
       "One ground step and a printed reason for the recommendation.",
       "The emphasis survives grayscale, and the badge says why rather than asserting popularity."),
      ("Pricing per seat",
       "Per-seat is the dominant SaaS model in the training set.",
       "Price on the unit that does the work - runs and retained history - because that is what this product consumes.",
       "The pricing page stops requiring a translation step before an engineer can estimate their bill.")]),

    ("faq", "FAQ", "Marketing", "append-only",
     "The objections, answered.",
     "Both arms use a disclosure. Check what happens without JavaScript, and check what the questions are - one set is generic, one set is the objections this audience actually raises.",
     [("Questions like 'Is there a free trial?' and 'Can I cancel anytime?'",
       "Generic FAQ content is the highest-probability completion under an FAQ heading.",
       "The actual objections: what happens when a deploy lands mid-run, how replay handles a changed tool signature, what the event log costs at volume.",
       "The section does work instead of occupying space.")]),

    ("footer", "Footer", "Marketing", "append-only",
     "The colophon and the link farm.",
     "Count the columns. Four columns of links is the reflex; the parti footer prints what the document is and what verified it.",
     [("Four columns of links, several of which go nowhere",
       "Footers in the training set have four columns, so four columns get generated regardless of how many destinations exist.",
       "As many columns as there are real destinations, plus a colophon.",
       "The footer stops advertising pages that do not exist.")]),

    # --------------------------------------------------------------- product
    ("dashboard-header", "Dashboard Header", "Product", "marginalia",
     "The top bar of a research workspace.",
     "The baseline header has a search field, a bell, and an avatar. The parti one carries the date of the last session, because the job is re-entry after two weeks away.",
     [("Search, notifications bell, avatar menu",
       "It is the canonical app-shell header and it is not wrong - it is simply unexamined.",
       "The header states when you were last here and what changed since, which is the first question this user has.",
       "The most valuable information on the screen is in the first place the eye lands.")]),

    ("sidebar", "Sidebar", "Product", "marginalia",
     "Primary workspace navigation.",
     "Compare the icons. One arm gives every nav item an icon; the other gives none, because the items are words this user reads dozens of times a day.",
     [("An icon beside every navigation label",
       "Sidebars in the training set have icons, so icons get added whether or not they disambiguate anything.",
       "Text only, in the margin rail, with the count of what is inside each section.",
       "Nothing has to be learned, and the counts add information the icons were not carrying.")]),

    ("stat-cards", "Stat Cards", "Product", "marginalia",
     "The portfolio summary figures.",
     "Count the KPI tiles. The parti arm has fewer and they are not cards, because four big numbers in rounded boxes is a consumer-analytics convention borrowed from a different job.",
     [("Four equal cards with a large number and a green or red delta arrow",
       "The KPI tile row is the single strongest visual prior for the word 'dashboard'.",
       "Ruled figures in the margin with the period they cover stated, and no colour on the delta.",
       "A minus three percent fortnight stops outranking an unresolved question in a five-year thesis."),
      ("A green up-arrow and a red down-arrow on every figure",
       "Directional colour on a number is the reflex for financial data.",
       "Colour is reserved for one meaning: this needs your judgement.",
       "The one thing that genuinely needs attention becomes the only coloured thing on the screen.")]),

    ("data-table", "Data Table", "Product", "marginalia",
     "The positions table.",
     "Look at the numerals. Both arms are competent; check whether the columns stay aligned when a value changes, and what happens at 375px.",
     [("Proportional figures in numeric columns",
       "Body text defaults to proportional numerals and nobody notices until a column jitters on refresh.",
       "Tabular numerals on every value that is read as data.",
       "Columns hold still, which is the difference between a table you can scan and one you have to read."),
      ("The table becomes a horizontal scroll at mobile width",
       "Shrinking is the default responsive behaviour for a table.",
       "Below the breakpoint it stops being a table and becomes records - which is what the margin structure already was.",
       "The data is readable at 375px instead of merely present.")]),

    ("chart-panel", "Chart Panel", "Product", "marginalia",
     "Price history against cost basis.",
     "Check what the chart is for. One draws a price line; the other marks where the thesis was written against it.",
     [("A price chart with a gradient area fill under the line",
       "Area gradients are the default chart decoration.",
       "A flat line with the cost basis ruled across it and the thesis dates marked in the margin.",
       "The chart answers the question this user actually has - was I right - rather than showing that the price moved.")]),

    ("filter-bar", "Filter Bar", "Product", "marginalia",
     "Narrowing the position list.",
     "Check whether the applied filters are still visible after you scroll away from the bar.",
     [("Filters applied but not restated near the results",
       "The control and its effect get designed separately, so the connection between them is lost.",
       "The active filter is printed in the margin beside the result count, and the empty state names it.",
       "A user who scrolls back to an unexpectedly short list can see why it is short.")]),

    ("search", "Search", "Product", "marginalia",
     "Finding a company or a filing.",
     "Type nothing and look at what each arm offers.",
     [("An empty dropdown until the user types",
       "The populated state is the one that gets designed.",
       "Recent tickers and open theses on focus, before any keystroke.",
       "The most common search - back to what I was reading - takes zero characters.")]),

    ("tabs", "Tabs", "Product", "marginalia",
     "Switching between thesis, filings, and notes.",
     "Watch the indicator when you switch. Then switch with the keyboard.",
     [("The active tab marked only by colour",
       "Colour is the cheapest way to mark selection and it looks fine to a sighted reviewer.",
       "Weight, rule, and position all change, so selection survives grayscale.",
       "The component stops depending on one channel to carry its only state.")]),

    ("modal", "Modal", "Product", "marginalia",
     "A focused task over the workspace.",
     "Press Escape. Then Tab past the last control and see where focus goes.",
     [("Focus not trapped, and not returned on close",
       "The visual design of a modal is separable from its focus management, so the focus half gets skipped.",
       "Focus moves in on open, is trapped while open, and returns to the trigger on close.",
       "The dialog is operable without a mouse, which is a floor rather than a feature.")]),

    ("drawer", "Drawer", "Product", "marginalia",
     "A side panel for a secondary task.",
     "Check what the drawer covers, and whether you lose your place behind it.",
     [("The drawer slides over the content it relates to",
       "An overlay is the default drawer behaviour.",
       "The drawer displaces rather than covers, so the row it came from stays visible.",
       "The user keeps their position on the board while reading the detail.")]),

    ("dropdown", "Dropdown", "Product", "marginalia",
     "A menu of actions.",
     "Open it and read the item labels.",
     [("Items labelled by system operation rather than user intent",
       "Menu labels get written from the handler names.",
       "Each item says what happens when it is used, in the interface's voice.",
       "The menu can be read without knowing how the feature is implemented.")]),

    ("command-menu", "Command Menu", "Product", "marginalia",
     "Keyboard-first navigation.",
     "Look at the empty-query state, and at whether the shortcut is discoverable anywhere else.",
     [("A generic list of commands with no grouping and no recents",
       "The command palette is copied structurally without a decision about what it is for here.",
       "Grouped by the two things this user does - resume a thesis, open a filing - with recents first.",
       "The palette is faster than the sidebar for the actual common case, which is the only reason to have one.")]),

    ("toast", "Toast", "Product", "marginalia",
     "Transient confirmation.",
     "Time it. Then check whether the message says what to do if it was wrong.",
     [("A toast that auto-dismisses in three seconds with no undo",
       "Three seconds is the library default and undo is extra work.",
       "The confirmation stays until dismissed when it reports a destructive change, and carries the reversal.",
       "A user who looks away does not lose the only notice that something changed.")]),

    ("empty-state", "Empty State", "Product", "marginalia",
     "Nothing to show, and why.",
     "The clearest contrast in the library, and the cheapest to fix. Read the two messages.",
     [("'No results found'",
       "It is the highest-probability string for an empty container, and it is not wrong - only useless.",
       "Name the filter that caused it and offer to clear it, and distinguish first-run empty from cleared-by-user empty.",
       "The user stops having to guess whether the product is broken or their filter is narrow.")]),

    ("loading-state", "Loading State", "Product", "marginalia",
     "Waiting.",
     "Check whether a background refresh blanks the screen.",
     [("A skeleton on every fetch, including background refreshes",
       "Loading is treated as one state rather than several.",
       "Shape-matched skeletons on first load only; a refresh keeps stale rows on screen with the timestamp dimmed.",
       "The user never loses the screen mid-decision because a poll came back slow.")]),

    ("error-state", "Error State", "Product", "marginalia",
     "Something failed.",
     "Read both messages and count how many of the four questions each one answers.",
     [("'Something went wrong. Please try again.'",
       "It is the safest possible string because it is true of every failure.",
       "Which feed failed, when the data was last good, what to do instead, and a reference to quote.",
       "The message becomes an instruction rather than an apology.")]),

    # ----------------------------------------------------------------- forms
    ("input", "Input", "Forms", "dispatch-ledger",
     "A single-line text field, in every state it can be in.",
     "Look at the focus treatment, then at the disabled one. One arm removes the outline; the other changes the rail pattern.",
     [("outline: none on focus, with a coloured border as the replacement",
       "Removing the default outline is the standard way to make a field look designed, and the replacement usually fails contrast.",
       "A rail pattern change plus a 3:1 boundary, verified rather than assumed.",
       "The field stays operable by keyboard for a user who cannot see the border colour change.")]),

    ("textarea", "Textarea", "Forms", "dispatch-ledger",
     "Multi-line entry.",
     "Type past the visible area in each.",
     [("A fixed height with an internal scrollbar",
       "A fixed height is the library default.",
       "Grows to a stated maximum, then scrolls, with the character budget printed.",
       "The writer can see what they wrote without scrolling inside a box inside a page.")]),

    ("select", "Select", "Forms", "dispatch-ledger",
     "Choosing one of several.",
     "Open both with the keyboard alone.",
     [("A custom listbox without the roles that make it a listbox",
       "Styling a native select is hard, so it gets replaced with divs that look right.",
       "Native semantics kept and restyled - and where a custom control was genuinely needed, the full role set ships with it.",
       "The control announces itself correctly to a screen reader.")]),

    ("checkbox", "Checkbox", "Forms", "dispatch-ledger",
     "A binary choice in a set.",
     "Check the hit area, then check the indeterminate state.",
     [("A 16px box as the entire hit target",
       "The visual size and the touch target get treated as the same measurement.",
       "The label is part of the target and the whole row reaches 44px.",
       "The control is usable on a phone without precision.")]),

    ("radio", "Radio", "Forms", "dispatch-ledger",
     "One of several, mutually exclusive.",
     "Arrow-key through both groups.",
     [("Each radio is separately tabbable",
       "Rendering a list of inputs produces a list of tab stops unless the roving pattern is deliberate.",
       "One tab stop for the group, arrows to move within it.",
       "A keyboard user passes the group in one keystroke instead of five.")]),

    ("switch", "Switch", "Forms", "dispatch-ledger",
     "An immediate on/off.",
     "Look for the label that says what 'on' currently means.",
     [("A switch with no state text beside it",
       "The affordance reads as self-explanatory, so the label gets skipped.",
       "The current state is printed, because a switch's position is ambiguous without one.",
       "The user can tell what the setting is rather than inferring it from a knob position.")]),

    ("date-picker", "Date Picker", "Forms", "dispatch-ledger",
     "Choosing a delivery time.",
     "Try to type a date into each.",
     [("A calendar grid with no text entry",
       "The calendar is the visible part of the pattern, so it becomes the whole pattern.",
       "Typing is the primary path and the calendar is the fallback, with the timezone stated.",
       "A user who knows the date they want gets it in four keystrokes.")]),

    ("form-section", "Form Section", "Forms", "dispatch-ledger",
     "A group of related fields with a heading.",
     "Look at where the section explanation sits relative to the fields it explains.",
     [("Section help text placed under the heading, away from the field it concerns",
       "The heading block and the field block get designed as separate units.",
       "Each field's constraint sits with the field, in the key gutter.",
       "The reader never has to hold an explanation in memory while scrolling to the input.")]),

    # --------------------------------------------------------------- content
    ("article-header", "Article Header", "Content", "dispatch-ledger",
     "The head of a documentation page.",
     "Check what metadata each carries, and whether it is useful mid-integration.",
     [("Title, author avatar and reading time",
       "Article headers in the training set are blog headers.",
       "Method, path, stability, and the version the page describes.",
       "The metadata answers the questions an integrating engineer actually has.")]),

    ("docs-nav", "Documentation Navigation", "Content", "dispatch-ledger",
     "The sidebar of an API reference.",
     "Look at how the current page is marked, and how deep the tree goes before it collapses.",
     [("Every section expanded, with the current page marked by colour only",
       "Expanding everything avoids a decision about hierarchy.",
       "The current section expanded and the rest collapsed, current page marked by rail pattern and weight.",
       "The nav fits on a screen and the position is findable without colour.")]),

    ("code-block", "Code Block", "Content", "dispatch-ledger",
     "A request sample.",
     "Copy from both. Then check whether the line numbers came with it.",
     [("Line numbers rendered as text inside the code",
       "Numbers as markup is the simplest implementation.",
       "A CSS counter, so a copy takes the code and nothing else.",
       "The pasted sample runs.")]),

    ("timeline", "Timeline", "Content", "dispatch-ledger",
     "A delivery event sequence.",
     "Check whether the timeline encodes real elapsed time or only order.",
     [("Evenly spaced events regardless of the gaps between them",
       "Even spacing is what a list produces.",
       "Offsets from t0 printed, with retry intervals visible as intervals.",
       "The retry ladder is legible as a ladder, which is the reason to draw it as a timeline at all.")]),

    ("comparison-table", "Comparison Table", "Content", "dispatch-ledger",
     "Two options, dimension by dimension.",
     "Read a row at 375px in each.",
     [("A three-column table that scrolls horizontally on mobile",
       "Horizontal scroll is the default table fallback.",
       "Below the breakpoint the table becomes stacked pairs, one dimension per block.",
       "The comparison is readable on a phone rather than merely present.")]),

    ("metadata", "Metadata", "Content", "dispatch-ledger",
     "Key-value facts about a page or object.",
     "Check the alignment of the values.",
     [("Key and value in a flowing paragraph or an uneven two-column list",
       "Definition lists get styled as prose.",
       "The same key gutter every other record uses, so values align down the page.",
       "The block is scannable by column, which is the only reason to tabulate it.")]),

    ("breadcrumbs", "Breadcrumbs", "Content", "dispatch-ledger",
     "Where this page sits.",
     "Check what the last item is, and whether it is a link.",
     [("The current page rendered as a link to itself",
       "Mapping an array to links produces a link for every item.",
       "The current page is marked with aria-current and is not a link.",
       "The trail says where you are, rather than offering to take you where you already are.")]),
]

STATES_BY_GROUP = {
    "Forms": ["default", "hover", "focus", "active", "disabled", "error", "success"],
    "Product": ["default", "hover", "focus", "loading", "empty", "error", "overflow"],
    "Marketing": ["default", "hover", "focus", "active", "overflow"],
    "Content": ["default", "hover", "focus", "overflow", "empty"],
}

STATE_INTENT = {
    "default": "The resting state. What the reader sees before touching anything.",
    "hover": "Pointer feedback only - never the sole carrier of information, since it does not exist on touch.",
    "focus": "Keyboard position, visible at 3:1 against its adjacent ground.",
    "active": "The moment of press. Confirms the input landed.",
    "disabled": "Unavailable, with the reason available rather than merely dimmed.",
    "loading": "Waiting, shaped like the content that is coming.",
    "empty": "Nothing to show, naming the cause and offering the next action.",
    "error": "What broke, why, and what to do next.",
    "success": "Confirmation that persists long enough to be read.",
    "overflow": "Ten times the expected content, without the layout breaking.",
}

GROUP_FILE = {"Marketing": "marketing", "Product": "product",
              "Forms": "forms", "Content": "content"}

SUBJECT = {
    "append-only": "Cadence, a runtime for production AI agents",
    "dispatch-ledger": "Relay, a message-delivery API",
    "marginalia": "Ledgerline, a research workspace for independent investors",
}

HEADER = '''import type { ComponentPair, StateSpec, StateName } from "@/lib/schema";

/**
 * The component comparison library. Generated by design/gen_components.py -
 * edit the authored strings there, not here.
 *
 * `tell` is the most valuable field on each entry: the one specific, checkable
 * thing to look at first. A comparison that only says "the parti one is nicer"
 * is not evidence, and a reader who is told exactly where to look is able to
 * disagree with us, which is the point.
 *
 * State coverage is recorded per arm because the gap between the two is
 * usually the largest real difference, and it is completely invisible in a
 * screenshot.
 */

const INTENT: Record<StateName, string> = %s;

function states(
  names: StateName[],
  built: StateName[],
): StateSpec[] {
  return names.map((n) => ({
    name: n,
    intent: INTENT[n],
    implemented: built.includes(n),
  }));
}

export const COMPONENT_PAIRS: ComponentPair[] = [
'''

FOOTER = '''];

export const COMPONENT_GROUPS = ["Marketing", "Product", "Forms", "Content"] as const;

export function pairsByGroup(group: string): ComponentPair[] {
  return COMPONENT_PAIRS.filter((c) => c.group === group);
}

export function pairBySlug(slug: string): ComponentPair | undefined {
  return COMPONENT_PAIRS.find((c) => c.slug === slug);
}

export function componentSlugs(): string[] {
  return COMPONENT_PAIRS.map((c) => c.slug);
}
'''


def j(v):
    return json.dumps(v, ensure_ascii=True)


def main():
    out = [HEADER % json.dumps(STATE_INTENT, indent=2)]

    for slug, name, group, dirkey, brief, tell, findings in C:
        gf = GROUP_FILE[group]
        st = STATES_BY_GROUP[group]
        # The baseline arm reliably ships the interaction states and skips the
        # content states. That asymmetry is the finding, so it is recorded
        # rather than asserted in prose.
        baseline_built = [s for s in st if s in
                          ("default", "hover", "focus", "active")]
        prompt = (f"Build a {name.lower()} for {SUBJECT[dirkey]}. {brief}")
        cmds = (["explore", "tokens", "build", "states", "harden"]
                if group in ("Product", "Forms")
                else ["explore", "tokens", "build", "deslop"])

        fs = ",\n".join(
            "      {\n"
            f"        finding: {j(f[0])},\n"
            f"        whyItHappens: {j(f[1])},\n"
            f"        partiDecision: {j(f[2])},\n"
            f"        result: {j(f[3])},\n"
            "      }"
            for f in findings)

        out.append(f"""  {{
    slug: {j(slug)},
    name: {j(name)},
    group: {j(group)},
    brief: {j(brief)},
    prompt: {j(prompt)},
    tell: {j(tell)},
    baseline: {{
      componentKey: {j(f"{gf}/{slug}/baseline")},
      sourcePath: {j(f"src/arms/components/{gf}/baseline.tsx")},
      rationale: "Built cold from the brief with no design skill loaded: conventional structure, a neutral ramp with one brand accent, spacing chosen per component, and the ideal state implemented first.",
    }},
    parti: {{
      componentKey: {j(f"{gf}/{slug}/parti")},
      sourcePath: {j(f"src/arms/components/{gf}/parti.tsx")},
      direction: {j(dirkey)},
      commands: {j(cmds)},
      rationale: "Built to a direction derived from the subject's own material, with a declared token set used for every value and every named state shipped in the same pass rather than as follow-up work.",
    }},
    states: states({j(st)}, {j(baseline_built)}),
    partiStates: states({j(st)}, {j(st)}),
    findings: [
{fs}
    ],
  }},""")

    out.append(FOOTER)
    p = pathlib.Path(__file__).resolve().parents[1] / "src" / "data" / "components.ts"
    p.write_text("\n".join(out), encoding="utf-8")
    print(f"wrote {p} - {len(C)} pairs")


if __name__ == "__main__":
    main()
