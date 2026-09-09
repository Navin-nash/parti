# Form field

One labelled input with its help, its error, and every state it can be in. The smallest
surface in the set and the one that decides whether a product feels trustworthy: a
person meets a form at the moment they are being asked to commit something.

This is direction, not markup. Build it in your stack, against your tokens.

## When it applies

Any input a person types or chooses into. **The field is the unit** — not the form, not
the input element. Everything needed to answer correctly belongs inside that boundary,
which is why label, help, and error are one thing and not three components that happen
to sit near each other.

**When it does not:** a single search box in a toolbar, where placement and an icon are
the whole contract. That is the only honest exception, and only while the input's
purpose is obvious from where it sits.

## The shape decisions

**The label is always visible, always a real label element, above the input.** Not a
placeholder. Placeholder-as-label disappears exactly when a person needs to check what
they were asked, fails contrast in nearly every implementation, and leaves anyone who
tabbed in with no idea what field they are on. Floating labels solve half of this and
keep the label at its smallest and faintest on the field currently being answered.

**Help text goes above the input; the error goes below.** A rule a person needs *before*
typing is not help if they meet it after failing. Keeping the two in separate slots also
means the field does not resize when an error appears, so the submit button does not
move out from under the cursor mid-form.

**Errors are text, and colour is the reinforcement.** Colour alone excludes anyone who
cannot distinguish it and everyone reading a bad screen in bright light. The error names
what is wrong specifically enough to act on: which rule failed, and what the value did
instead.

**Invalidity is announced, not just styled.** A class communicates to sighted users
only. The field's invalid state and the connection between input, help, and error have
to exist in the accessibility tree, and both help and error stay connected — a person
who tabs back needs the rule as well as the failure.

**Focus is never subtle.** It is the one state that must be unmistakable on every
input method. This is the state most often sacrificed for tidiness, and the sacrifice
lands on keyboard users.

**Nothing restyles merely because a value was entered.** A field that changes appearance
once filled makes a review pass harder to read, which is the moment accuracy matters
most.

## What the tokens have to carry

- **A danger role** that passes 4.5:1 on the field's own background, not on white.
- **A focus-ring role** distinct from both border and accent, so focus is never confused
  with selection or validity.
- **A border role and a stronger border role** — hover and rest cannot be the same, and
  neither can carry the invalid state on its own.
- **A muted text role** for help that still passes body contrast. Help is not decorative.
- **A control height** at or above the comfortable touch target, with an input font size
  that will not trigger zoom-on-focus on mobile browsers.
- **A disabled treatment that is a real surface**, not an opacity. Fading the whole field
  drags label and help below contrast along with it.

## States that must exist

| State | What distinguishes it |
|---|---|
| **Empty** | A placeholder only if it shows *format*, never a restatement of the label. |
| **Filled** | Nothing changes but the value. |
| **Focus** | Unmistakable ring, offset so it never hides the border it sits on. |
| **Invalid** | Announced as invalid, error text below, colour reinforcing. Help stays connected. |
| **Disabled** | Reduced contrast on a solid surface. If the reason is not obvious, say it in the help — a disabled control with no explanation is a dead end. |
| **Read-only** | Shown without control chrome. At that point it is data, not a control. |
| **Pending** | Async validation leaves the field usable and puts status in the error slot as a live region. Never lock a field while checking it. |
| **Overflow** | Long values scroll within the control; the field does not grow. |

## Responsive

The field is already fluid. What changes is the *form*: multi-column layouts collapse to
one, and side-by-side pairs stack unless both are genuinely short. Control height does
not shrink on small screens — touch targets matter more as screens get smaller, not
less.

## Motion

Border colour on focus and hover, short and out-eased. Nothing else. The defects to
check against: `timing-over-300ms` (a field is not an event), `easing-ease-in-on-ui`
(the control reads as hesitating), `a11y-ungated-hover` (hover sticking on touch).

**Errors appear without animation.** Sliding an error in delays reading the one sentence
that matters, and a shake reads as scolding. If an error needs noticing, that is the
copy's job.

A colour crossfade with no transform is not vestibular motion, so there is nothing
spatial for a reduced-motion path to reduce. The moment this surface gains a transform or
an entrance, `a11y-no-reduced-motion` applies and that exemption is void.

## How it goes wrong

- Placeholder as label: disappears on type, fails contrast, breaks autofill.
- Help below the input, arriving after the mistake it was meant to prevent.
- Error by colour only.
- Layout shifting when an error appears.
- The help connection dropped when the error replaces it.
- Input text small enough to trigger zoom on focus, losing the person's place.
- Autocomplete hints omitted — the cheapest completion-rate improvement available, and
  the most commonly forgotten attribute in generated markup.
- Validating on every keystroke: telling someone their email is invalid while they are
  still typing it is noise. Validate on blur; re-validate live only after a field has
  already failed.
- A disabled submit with no explanation. The person cannot tell what is missing. Keep it
  enabled and show the errors on submit.
- Required-ness marked only with an asterisk and no legend.
