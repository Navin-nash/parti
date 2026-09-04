# The briefs

Each brief below is given to both arms **verbatim and identically**. The only
difference between the two runs is whether the Parti skill is loaded. Product
names and content are pinned here so the two arms render comparable content -
otherwise the comparison degrades into comparing two different products.

---

## 01 - `finance-research-platform` - Finance / Dashboard

**Product:** Ledgerline
**Brief:**

> Design the main workspace for Ledgerline, a research tool for serious
> independent investors - people who read filings, hold 15-40 positions for
> years, and write down why they bought before they buy. It is not a broker
> and it does not execute trades. The screen must let someone resume a
> half-finished thesis on a company after two weeks away, see what changed in
> their positions since they last looked, and jump into a company's filing
> history. Include: workspace navigation, a portfolio summary, a watchlist,
> the research/thesis panel for one company, a price chart, and an activity
> timeline.

**Content to use (both arms):** positions in `SSNC`, `WCC`, `EVR`, `TPL`,
`AMBP`, `IESC`. Open thesis on `WCC` (Wesco International), last edited 14 days
ago, conviction "medium-high", one unresolved question about backlog
conversion. Recent filings: `WCC` 10-Q filed 3 days ago, `TPL` 8-K yesterday.
Portfolio 6 positions, 31% cash.

---

## 02 - `agent-platform-landing` - Developer tool / Landing page

**Product:** Cadence
**Brief:**

> Design the landing page for Cadence, a runtime for building production AI
> agents - durable execution, replayable runs, and typed tool boundaries. The
> audience is backend engineers who have already built an agent prototype that
> broke in production and are evaluating whether to adopt a runtime or keep
> hand-rolling. They are skeptical of AI marketing language. Include: hero, a
> real code example, capabilities, an architecture section, and a closing call
> to action.

**Content to use (both arms):** the code sample defines a `refund` agent with
two tools (`lookupOrder`, `issueRefund`), a retry policy, and a replay handle.
Capabilities: durable execution, deterministic replay, typed tool boundaries,
per-step observability. Architecture: control plane / worker pool / event log.

---

## 03 - `campaign-analytics` - Analytics / Dashboard

**Product:** Northbound
**Brief:**

> Design the campaign performance workspace for Northbound, used by a
> two-person growth team to decide where next month's budget goes. The job is
> a reallocation decision made once a week, not passive monitoring. The screen
> must make it obvious which campaigns are worth more money and which should
> be cut. Include: KPI summary, a chart, a campaign table, filters, and an
> insight panel.

**Content to use (both arms):** campaigns `Search - brand`, `Search - category`,
`Paid social - retargeting`, `Paid social - prospecting`, `Newsletter sponsorships`,
`Podcast - Q3 test`. Spend column, CAC, qualified signups, 28-day trend.
Podcast test is the outlier: high CAC, small sample, ambiguous.

---

## 04 - `infrastructure-docs` - Documentation

**Product:** Relay API
**Brief:**

> Design the documentation reading experience for the Relay API, a message
> delivery infrastructure product. The reader is an engineer mid-integration
> with a terminal open in the next window, usually arriving from search, and
> usually needing exactly one parameter or one error code. Include: sidebar
> navigation, a documentation page header, code blocks, an API reference
> table, and search.

**Content to use (both arms):** the page documents `POST /v1/messages`.
Parameters: `channel` (required), `payload`, `idempotency_key`, `deliver_at`,
`retry_policy`. Errors: `429 rate_limited`, `409 duplicate_idempotency_key`,
`422 channel_unverified`. Code samples in cURL and TypeScript.

---

## 05 - `product-page` - E-commerce

**Product:** Field Notes Co. - the Kestrel field knife
**Brief:**

> Design the product page for the Kestrel, a $189 fixed-blade field knife from
> a small manufacturer that has made the same three products for eleven years.
> Buyers research for weeks and read the steel specification before they read
> the marketing. The page must survive that scrutiny and still sell. Include:
> gallery, purchase area, product information, recommendations, and trust
> signals.

**Content to use (both arms):** CPM-3V steel, 4.1" blade, 0.14" stock, full
tang, micarta scales, 8.7 oz, made in Marquette, Michigan. Options: scale
colour (olive / black / natural), sheath (leather / kydex). Lead time 2 weeks.
Lifetime sharpening. No fabricated customer testimonials with attributed names.
