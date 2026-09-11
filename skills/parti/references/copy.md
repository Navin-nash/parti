# Copy

Loaded by `copy`, `explore` §4 (render copy), `build` B2 (every state's text), `critique`,
and `redesign`. Generic copy templates a design as fast as generic layout — a hero with
the right hierarchy and "Powerful. Simple. Fast." underneath it is still slop, and a
build with real state coverage and "Oops! Something went wrong." in the error state has
shipped half the work.

**The rule this file exists to enforce: names come from what the user controls, not from
how the system is built.** "Send" names the user's action. "Submit request to endpoint"
names the implementation. Every rule below is a specific case of that one.

---

## Recon before writing

Read the copy that already exists before adding to it — terminology, capitalization
habit, whether the product says "you" or stays impersonal, any content style guide in the
repo. A deliberate brand voice is not a defect; flag a departure from plain language only
when it creates ambiguity, inconsistent terms, translation risk, or a tone the stakes
don't support. This is `register.md`'s split applied to words: **brand** copy earns
personality, **product** copy earns clarity, and neither earns it at the other's expense.

## Tone follows stakes, not mood

One voice, flexible tone. A local edit does not get to invent a new one, and terms stay
fixed across a flow — if a menu says "Archive", a toast never says "Moved to storage".

| Context | Tone |
|---|---|
| Success, onboarding, empty states | Warm, can be light |
| Routine actions, settings | Neutral, minimal |
| Errors, destructive confirmations | Calm, plain, zero playfulness |
| Data loss, security | Serious, explicit |

Playfulness on an error is the copy equivalent of a bounce easing on a destructive
button — the register is wrong for the stakes, independent of how well it's written.

## Address the reader directly

Instructional copy says "you", not "the user". In errors, "we" invites ambiguity and
reads as deflection — "Unable to load content" beats "We're having trouble loading this
content." Use possessives sparingly ("Favorites", not "Your Favorites"), hold one
perspective through a whole flow, and skip unnecessary gender ("Subscribers can post
recipes," not "each subscriber can post his or her recipes").

Match the verb to the input device — "tap" on touch, "click" with a pointer, "select"
when both are possible. Never assemble a sentence from fragments around a variable
(`"You have " + n + " new messages"`); word order changes per language, so use a full
templated string with real pluralization.

## Verb-first, consequence-repeating

A button label starts with a verb naming the action: "Send", "Save draft", "Delete
project" — never "OK!", "Let's go!", or a bare "Yes"/"No" on anything consequential. A
confirmation dialog repeats the consequence in its button so it's answerable without
reading the body: "Delete this project?" pairs with `Delete project` and `Cancel`, not
`Yes` and `No`.

A multi-step flow keeps one vocabulary throughout — "Get started" to enter, "Continue" or
"Next" (pick one) to advance, "Done" to finish. Alternating synonyms makes a user wonder
whether the buttons do different things.

## Links and labels

Link text has to make sense out of context — screen-reader users navigate by a list of
the page's links, so "Read the billing docs" survives that list and "Click here" doesn't.
A bare "Learn more" breaks the moment two appear on one page; suffix each one ("Learn more
about exports").

Pick title case or sentence case per element type and hold it everywhere that type
appears. Sentence case is the calmer default, has no per-word rule to remember, and
localizes cleanly — "Save Changes" next to "Discard changes" reads as carelessness, not
variety.

## Settings describe the ON state

Label a toggle for what happens when it's on: "Send read receipts" lets the reader infer
the off state; "Don't send read receipts" makes every toggle a double negative. Link
straight to a referenced setting rather than narrating the path to it — a "Notification
settings" link, not "Go to Settings → Notifications → Email".

## Errors: what happened, why, what to do, next to where it broke

An error is an instruction, placed beside the field that failed, never in a banner far
from it and never as a modal for anything recoverable.

| Bad | Good |
|---|---|
| That password is too short | Choose a password with at least 8 characters |
| Invalid name | Use only letters for your name |
| Oops! Something went wrong. | Unable to save. Check your connection and try again. |

No blame, no "oops", no exclamation marks. Phrase hints positively ("Use only letters",
not "Don't use numbers or symbols") and show them before the mistake where the form
allows it, not only after. **An error that names no way to recover is a no-go
(`go-no-go.md` `NG-ERROR-RECOVERY`), not a wording finding** — if the same error keeps
firing, redesign the interaction instead of rewording it again.

## Empty states point forward

An empty state says what this place is, how to fill it, and offers one clear next action
— never a shrug ("No results.") and never persistent information, which vanishes the
moment content exists.

```html
<!-- Bad: a shrug -->
<p>No results.</p>

<!-- Good: orientation plus a next step -->
<p class="font-medium">No projects yet</p>
<p class="text-sm text-muted">Projects keep your tasks and files together.</p>
<button class="mt-4">Create a project</button>
```

A search or filter empty state names the query and offers an exit: "No results for
'quarterly'. Clear filters."

## Placeholders are examples, never labels

A placeholder shows the expected format (`name@example.com`, `DD/MM/YYYY`) and vanishes on
input, so it can never be the only label — every field keeps a visible one. This is an
accessibility rule as much as a copy one: a placeholder-only field fails the real
`<label for>` requirement in `ux-methods.md` §8 the same way an unlabeled input does.

## Truncated and destructive copy

Truncated content needs a way to reach the full value — a title attribute, a tooltip, an
expand control — never truncation with no recovery path (`NG-TRUNCATED`). A destructive
action's copy names the consequence in the confirmation itself, and pairs with a distinct
visual treatment, not just a red word in an otherwise identical button
(`NG-DESTRUCTIVE`).

## How copy renders is a different file

Capitalization via `text-transform`, truncation mechanics, smart punctuation, and
tabular-figure treatment for numbers belong to `type-craft.md` — write copy in natural
case and let CSS control presentation, so a redesign never means rewriting strings.

---

## Running the `copy` command

1. Read every visible string once, out loud if it helps — the fastest way to catch
   lorem-shaped copy that occupies the right space and says nothing.
2. Check names against what they control, not the implementation. Check terms stay
   identical across the flow. Check every button is verb-first.
3. Check every error state has what-happened / why / next-step, next to the field.
4. Check every empty state has orientation and one action.
5. Report findings the same way `critique.md` does — evidence, not adjectives — sorted
   Blocker / High / Medium / Low, each with the current string and the replacement.

A copy pass with no findings is a valid result; say that you read every string rather
than reporting nothing checked.
