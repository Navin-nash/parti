"use client";

import * as React from "react";

/* ==========================================================================
   DIRECTION — "Dispatch Ledger"                    Relay · POST /v1/messages

   THESIS
   An engineer mid-integration is not reading a page, they are scanning a log.
   Relay's own artifacts are ledger lines: a timestamp, a key, a value, a
   status. So the interface is not a page with forms on it — it is the ledger
   itself, and a form field is just a record whose value has not been written
   yet. Every row carries the same three tracks the delivery log carries.

   AXES
     Density         dense — 13px mono body, 4px base, records ruled not boxed.
                     A daily tool with a terminal open next to it earns density.
     Structure       grid-strict — three tracks on every row, no exceptions:
                     [status rail 3px] [key gutter 148px] [value 1fr].
                     Arriving from search, you find a parameter by scanning
                     one column, never by reading prose.
     Type voice      mono-technical — the face of the terminal in the next
                     window (JetBrains Mono, loaded; falls back to the platform
                     mono, which is the same argument). Prose is the exception
                     and is set in the system grotesque, deliberately smaller
                     in presence than the keys it explains.
     Chroma          achromatic + status ink only. Colour is never decoration
                     here: an amber, a green or a red means queued, delivered
                     or failed. Interactive emphasis is achromatic — weight and
                     rule, never a brand hue — so a 429 is the loudest thing
                     on any screen it appears on.
     Motion posture  responsive-only, with one ambient exception: a queued
                     record's rail marches, because work is genuinely in
                     flight. Nothing else moves without a user action.
     Depth           flat — zero shadows. Elevation is rule weight (1px
                     hairline → 2px rule → 3px rail) and ground value.

   SIGNATURE
     The gutter rail. Every record — field, option, row, event — carries a 3px
     left rail whose *pattern* as well as colour states the record's condition:
     hollow = idle, solid ink = focused, marching dash = queued/in flight,
     static dash = disabled, solid amber/green/red = queued/delivered/failed.
     Pattern carries the state independently of hue, so the signature element
     is also the grayscale-safe state channel.

   GIVES UP
     Warmth, and any chance of reading as a marketing surface. No imagery, no
     cards, no illustration, and long-form prose is actively de-emphasised —
     a tutorial written in this system would read worse than in the baseline.
     Nothing is rounded except radio controls, which keep their circle because
     breaking that convention costs the user more than it buys the direction.

   MEASURED CONTRAST (scripts/color.py, not asserted)
     light  ink/ground 16.01 · ink-2/ground 7.68 · ink-3/ground 5.14
            fail/field 7.74 · fail/ground 6.84 · queued/ground 6.12
            ok/ground 6.21 · edge/ground 4.18 (control boundary, needs 3.0)
            focus rail = ink on ground 16.01 (needs 3.0)
     dark   ink/ground 15.95 · ink-2/ground 8.69 · ink-3/ground 6.13
            fail/field 7.89 · queued/field 9.11 · ok/field 8.32
            edge/field 4.42 (control boundary) · focus rail 14.62
   ========================================================================== */

const P = {
  "--p-ground": "#F1F1EE",
  "--p-ground-d": "#0E1013",
  "--p-field": "#FFFFFF",
  "--p-field-d": "#171A1E",
  "--p-ink": "#14161A",
  "--p-ink-d": "#E9EBEE",
  "--p-ink-2": "#454C54",
  "--p-ink-2-d": "#A8B0B9",
  "--p-ink-3": "#5F666E",
  "--p-ink-3-d": "#8B939C",
  "--p-rule": "#D9D9D2",
  "--p-rule-d": "#262A2F",
  "--p-edge": "#6E747A",
  "--p-edge-d": "#79818A",
  "--p-queued": "#7A5200",
  "--p-queued-d": "#E5B44A",
  "--p-ok": "#0B6640",
  "--p-ok-d": "#58C793",
  "--p-fail": "#A02016",
  "--p-fail-d": "#FF8F80",
  "--p-s-1": "4px",
  "--p-s-2": "8px",
  "--p-s-3": "12px",
  "--p-s-4": "16px",
  "--p-s-5": "24px",
  "--p-s-6": "32px",
  "--p-gutter": "148px",
  "--p-rail": "3px",
  "--p-t-key": "11px",
  "--p-t-caption": "12px",
  "--p-t-body": "13px",
  "--p-t-h2": "18px",
  "--p-t-h1": "26px",
  "--p-d-1": "90ms",
  "--p-d-2": "160ms",
  "--p-ease": "cubic-bezier(0.2, 0, 0, 1)",
  "--p-mono":
    "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
  "--p-sans": "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif",
  fontFamily: "var(--p-mono)",
} as React.CSSProperties;

const CSS = `
[data-arm="parti-forms"] [data-p-rail="queued"]{background-color:transparent;background-image:repeating-linear-gradient(to bottom,currentColor 0 4px,transparent 4px 8px);animation:p-march 900ms linear infinite}
[data-arm="parti-forms"] [data-p-rail="off"]{background-color:transparent;background-image:repeating-linear-gradient(to bottom,currentColor 0 2px,transparent 2px 6px)}
@keyframes p-march{to{background-position:0 -8px}}
@media (prefers-reduced-motion: reduce){
  [data-arm="parti-forms"] *{animation-duration:1ms!important;animation-iteration-count:1!important;transition-duration:1ms!important}
}`;

type RailState = "idle" | "active" | "queued" | "ok" | "error" | "off";

const RAIL_TONE: Record<RailState, string> = {
  idle: "text-[var(--p-rule)] dark:text-[var(--p-rule-d)]",
  active: "text-[var(--p-ink)] dark:text-[var(--p-ink-d)]",
  queued: "text-[var(--p-queued)] dark:text-[var(--p-queued-d)]",
  ok: "text-[var(--p-ok)] dark:text-[var(--p-ok-d)]",
  error: "text-[var(--p-fail)] dark:text-[var(--p-fail-d)]",
  off: "text-[var(--p-edge)] dark:text-[var(--p-edge-d)]",
};

const inkC = "text-[var(--p-ink)] dark:text-[var(--p-ink-d)]";
const ink2C = "text-[var(--p-ink-2)] dark:text-[var(--p-ink-2-d)]";
const ink3C = "text-[var(--p-ink-3)] dark:text-[var(--p-ink-3-d)]";
const failC = "text-[var(--p-fail)] dark:text-[var(--p-fail-d)]";
const ruleB = "border-[var(--p-rule)] dark:border-[var(--p-rule-d)]";
const edgeB = "border-[var(--p-edge)] dark:border-[var(--p-edge-d)]";

const keyCls = `text-[length:var(--p-t-key)] uppercase tracking-[0.09em] ${ink2C}`;
const noteCls = `mt-[var(--p-s-1)] text-[length:var(--p-t-caption)] leading-[1.5] ${ink3C}`;
const errCls = `mt-[var(--p-s-1)] text-[length:var(--p-t-caption)] leading-[1.5] ${failC}`;

const field =
  `w-full appearance-none rounded-none border-0 border-b bg-transparent px-0 pb-[5px] pt-[2px] text-[length:var(--p-t-body)] ${inkC} ${edgeB} outline-none transition-[border-color,padding] duration-[var(--p-d-1)] ease-[var(--p-ease)] placeholder:text-[var(--p-ink-3)] dark:placeholder:text-[var(--p-ink-3-d)] focus:border-b-2 focus:pb-[4px] focus:border-[var(--p-ink)] dark:focus:border-[var(--p-ink-d)] disabled:border-dashed disabled:text-[var(--p-ink-3)] dark:disabled:text-[var(--p-ink-3-d)]`;

const fieldFocus =
  "border-b-2 pb-[4px] border-[var(--p-ink)] dark:border-[var(--p-ink-d)]";
const fieldErr = "border-b-2 pb-[4px] border-[var(--p-fail)] dark:border-[var(--p-fail-d)]";

function Sheet({
  children,
  title,
  sub,
}: {
  children: React.ReactNode;
  title: string;
  sub: string;
}) {
  return (
    <div
      data-arm="parti-forms"
      style={P}
      className={`w-full border-t-2 bg-[var(--p-ground)] px-[var(--p-s-5)] pb-[var(--p-s-5)] pt-[var(--p-s-4)] dark:bg-[var(--p-ground-d)] border-[var(--p-ink)] dark:border-[var(--p-ink-d)] ${inkC}`}
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap"
      />
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div
        className={`mb-[var(--p-s-4)] flex flex-wrap items-baseline justify-between gap-[var(--p-s-3)] border-b pb-[var(--p-s-2)] ${ruleB}`}
      >
        <h2 className="text-[length:var(--p-t-body)] font-medium">{title}</h2>
        <p className={keyCls}>{sub}</p>
      </div>
      {children}
    </div>
  );
}

function Rec({
  rail,
  name,
  required,
  status,
  children,
}: {
  rail: RailState;
  name: string;
  required?: boolean;
  status?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`grid items-stretch gap-x-[var(--p-s-4)] border-b py-[var(--p-s-3)] ${ruleB}`}
      style={{ gridTemplateColumns: "var(--p-rail) var(--p-gutter) minmax(0,1fr)" }}
    >
      <span
        aria-hidden
        data-p-rail={rail}
        className={`bg-current ${RAIL_TONE[rail]}`}
      />
      <div className="pt-[2px]">
        <p className={keyCls}>
          {name}
          {required ? <span className={failC}> *</span> : null}
        </p>
        {status ? (
          <p className={`mt-[var(--p-s-1)] text-[length:var(--p-t-key)] ${ink3C}`}>{status}</p>
        ) : null}
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

export function InputParti() {
  const id = React.useId();
  return (
    <Sheet title="channel — string, required" sub="4 record states">
      <Rec rail="idle" name="channel" required status="idle">
        <label htmlFor={`${id}-a`} className="sr-only">
          Channel ID, idle
        </label>
        <input id={`${id}-a`} defaultValue="ch_live_sms_us" className={field} />
        <p className={noteCls}>Verified channel the message leaves on.</p>
      </Rec>

      <Rec rail="active" name="channel" required status="editing">
        <label htmlFor={`${id}-b`} className="sr-only">
          Channel ID, focused
        </label>
        <input id={`${id}-b`} defaultValue="ch_live_" className={`${field} ${fieldFocus}`} />
        <p className={noteCls}>3 channels match this prefix.</p>
      </Rec>

      <Rec rail="off" name="channel" status="locked">
        <label htmlFor={`${id}-c`} className="sr-only">
          Channel ID, locked
        </label>
        <input id={`${id}-c`} disabled defaultValue="ch_test_sandbox" className={field} />
        <p className={noteCls}>Pinned by the sandbox key. Rotate the key to change it.</p>
      </Rec>

      <Rec rail="error" name="channel" required status="rejected">
        <label htmlFor={`${id}-d`} className="sr-only">
          Channel ID, rejected
        </label>
        <input
          id={`${id}-d`}
          defaultValue="ch_live_email_eu"
          aria-invalid
          aria-describedby={`${id}-d-err`}
          className={`${field} ${fieldErr}`}
        />
        <p id={`${id}-d-err`} className={errCls}>
          422 channel_unverified — the sender domain relay.dev has no verified DKIM record.
        </p>
      </Rec>
    </Sheet>
  );
}

const BODY = '{\n  "to": "+15125550142",\n  "body": "Your code is 481920"\n}';
const BAD_BODY = '{\n  "to": "+15125550142",\n  "body":\n}';

function Payload({
  id,
  value,
  invalid,
  disabled,
  focus,
  describedBy,
}: {
  id: string;
  value: string;
  invalid?: boolean;
  disabled?: boolean;
  focus?: boolean;
  describedBy?: string;
}) {
  const lines = value.split("\n");
  return (
    <div className="flex gap-[var(--p-s-3)]">
      <pre aria-hidden className={`select-none text-[length:var(--p-t-body)] leading-[1.7] ${ink3C}`}>
        {lines.map((_, i) => `${i + 1}`.padStart(2, "0")).join("\n")}
      </pre>
      <textarea
        id={id}
        rows={lines.length}
        defaultValue={value}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        spellCheck={false}
        className={`${field} resize-none leading-[1.7] ${focus ? fieldFocus : ""} ${invalid ? fieldErr : ""}`}
      />
    </div>
  );
}

export function TextareaParti() {
  const id = React.useId();
  return (
    <Sheet title="payload — object, max 64 KB" sub="4 record states">
      <Rec rail="idle" name="payload" status="64 KB limit">
        <label htmlFor={`${id}-a`} className="sr-only">
          Payload, idle
        </label>
        <Payload id={`${id}-a`} value={BODY} />
        <p className={noteCls}>Channel-specific body. Serialised as-is.</p>
      </Rec>
      <Rec rail="active" name="payload" status="editing">
        <label htmlFor={`${id}-b`} className="sr-only">
          Payload, focused
        </label>
        <Payload id={`${id}-b`} value={BODY} focus />
        <p className={noteCls}>218 bytes of 65 536.</p>
      </Rec>
      <Rec rail="off" name="payload" status="locked">
        <label htmlFor={`${id}-c`} className="sr-only">
          Payload, locked
        </label>
        <Payload id={`${id}-c`} value={BODY} disabled />
        <p className={noteCls}>Replayed from idempotency_key evt_9f31c0_retry.</p>
      </Rec>
      <Rec rail="error" name="payload" status="rejected">
        <label htmlFor={`${id}-d`} className="sr-only">
          Payload, rejected
        </label>
        <Payload id={`${id}-d`} value={BAD_BODY} invalid describedBy={`${id}-d-err`} />
        <p id={`${id}-d-err`} className={errCls}>
          400 invalid_payload — unexpected &rbrace; at line 03, column 01. A value is missing
          after &quot;body&quot;.
        </p>
      </Rec>
    </Sheet>
  );
}

const POLICIES = [
  { value: "exponential", label: "exponential", detail: "6 attempts · 1s → 2h" },
  { value: "linear", label: "linear", detail: "4 attempts · 30s apart" },
  { value: "none", label: "none", detail: "fail on first rejection" },
];

function Caret() {
  return (
    <svg
      viewBox="0 0 10 6"
      aria-hidden
      className="pointer-events-none absolute right-0 top-[8px] h-[6px] w-[10px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
    >
      <path d="M1 1l4 4 4-4" />
    </svg>
  );
}

function Picker({
  id,
  focus,
  disabled,
  invalid,
  describedBy,
}: {
  id: string;
  focus?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  describedBy?: string;
}) {
  return (
    <div className={`relative ${ink2C}`}>
      <select
        id={id}
        disabled={disabled}
        defaultValue="exponential"
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        className={`${field} pr-[var(--p-s-5)] ${focus ? fieldFocus : ""} ${invalid ? fieldErr : ""}`}
      >
        {POLICIES.map((p) => (
          <option key={p.value} value={p.value}>
            {p.label} — {p.detail}
          </option>
        ))}
      </select>
      <Caret />
    </div>
  );
}

export function SelectParti() {
  const id = React.useId();
  return (
    <Sheet title="retry_policy — enum" sub="4 record states">
      <Rec rail="idle" name="retry_policy" status="default: exponential">
        <label htmlFor={`${id}-a`} className="sr-only">
          Retry policy, idle
        </label>
        <Picker id={`${id}-a`} />
        <p className={noteCls}>The ladder Relay walks before a message is marked failed.</p>
      </Rec>
      <Rec rail="active" name="retry_policy" status="editing">
        <label htmlFor={`${id}-b`} className="sr-only">
          Retry policy, focused
        </label>
        <Picker id={`${id}-b`} focus />
        <p className={noteCls}>3 policies available on this channel.</p>
      </Rec>
      <Rec rail="off" name="retry_policy" status="locked">
        <label htmlFor={`${id}-c`} className="sr-only">
          Retry policy, locked
        </label>
        <Picker id={`${id}-c`} disabled />
        <p className={noteCls}>Fixed by the carrier contract on ch_live_sms_us.</p>
      </Rec>
      <Rec rail="error" name="retry_policy" status="rejected">
        <label htmlFor={`${id}-d`} className="sr-only">
          Retry policy, rejected
        </label>
        <Picker id={`${id}-d`} invalid describedBy={`${id}-d-err`} />
        <p id={`${id}-d-err`} className={errCls}>
          429 rate_limited — none is not accepted above 100 msg/s. Use exponential.
        </p>
      </Rec>
    </Sheet>
  );
}

function Tick({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 12 12" aria-hidden className="h-[12px] w-[12px]" fill="none">
      {on ? (
        <path
          d="M2 6.5l2.8 2.8L10 3.5"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="square"
        />
      ) : null}
    </svg>
  );
}

function Flag({
  id,
  label,
  note,
  defaultOn,
  disabled,
  error,
}: {
  id: string;
  label: string;
  note?: string;
  defaultOn?: boolean;
  disabled?: boolean;
  error?: string;
}) {
  const [on, setOn] = React.useState(!!defaultOn);
  return (
    <div>
      <div className="flex items-start gap-[var(--p-s-3)]">
        <span className="relative mt-[1px] flex">
          <input
            id={id}
            type="checkbox"
            checked={on}
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${id}-err` : undefined}
            onChange={(e) => setOn(e.target.checked)}
            className="peer absolute inset-0 h-[16px] w-[16px] cursor-pointer opacity-0 disabled:cursor-not-allowed"
          />
          <span
            aria-hidden
            className={[
              "flex h-[16px] w-[16px] items-center justify-center border transition-colors duration-[var(--p-d-1)] ease-[var(--p-ease)]",
              error ? "border-[var(--p-fail)] dark:border-[var(--p-fail-d)]" : edgeB,
              on
                ? `bg-[var(--p-ink)] text-[var(--p-ground)] dark:bg-[var(--p-ink-d)] dark:text-[var(--p-ground-d)] ${error ? "" : "border-[var(--p-ink)] dark:border-[var(--p-ink-d)]"}`
                : "bg-[var(--p-field)] dark:bg-[var(--p-field-d)]",
              disabled ? "border-dashed" : "",
              "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--p-ink)] dark:peer-focus-visible:outline-[var(--p-ink-d)]",
            ].join(" ")}
          >
            <Tick on={on} />
          </span>
        </span>
        <label
          htmlFor={id}
          className={`text-[length:var(--p-t-body)] leading-[1.45] ${disabled ? ink3C : inkC}`}
        >
          {label}
          {note ? <span className={`block ${noteCls}`}>{note}</span> : null}
        </label>
      </div>
      {error ? (
        <p id={`${id}-err`} className={`${errCls} pl-[28px]`}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function CheckboxParti() {
  const id = React.useId();
  return (
    <Sheet title="Request flags — boolean" sub="off · on · locked · rejected">
      <Rec rail="idle" name="receipt" status="off">
        <Flag
          id={`${id}-a`}
          label="Request a delivery receipt"
          note="Emits message.receipt on the webhook stream when the carrier confirms."
        />
      </Rec>
      <Rec rail="ok" name="dedupe" status="on">
        <Flag id={`${id}-b`} label="Reuse idempotency_key across retries" defaultOn />
      </Rec>
      <Rec rail="off" name="unverified" status="locked">
        <Flag
          id={`${id}-c`}
          label="Deliver to unverified channels"
          note="Sandbox keys only. Live traffic always returns 422 channel_unverified."
          disabled
        />
      </Rec>
      <Rec rail="error" name="ack" required status="rejected">
        <Flag
          id={`${id}-d`}
          label="I accept that a repeated key returns the first response"
          error="409 duplicate_idempotency_key — acknowledge before sending with a reused key."
        />
      </Rec>
    </Sheet>
  );
}

function Ladder({
  name,
  disabled,
  error,
}: {
  name: string;
  disabled?: boolean;
  error?: string;
}) {
  const [value, setValue] = React.useState("exponential");
  return (
    <div
      role="radiogroup"
      aria-label="Retry policy"
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? `${name}-err` : undefined}
      className="space-y-[var(--p-s-2)]"
    >
      {POLICIES.map((p) => {
        const on = value === p.value;
        return (
          <div key={p.value} className="flex items-baseline gap-[var(--p-s-3)]">
            <span className="relative flex translate-y-[2px]">
              <input
                id={`${name}-${p.value}`}
                type="radio"
                name={name}
                value={p.value}
                checked={on}
                disabled={disabled}
                onChange={() => setValue(p.value)}
                className="peer absolute inset-0 h-[14px] w-[14px] cursor-pointer opacity-0 disabled:cursor-not-allowed"
              />
              <span
                aria-hidden
                className={[
                  "flex h-[14px] w-[14px] items-center justify-center rounded-full border",
                  error ? "border-[var(--p-fail)] dark:border-[var(--p-fail-d)]" : edgeB,
                  disabled ? "border-dashed" : "",
                  "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--p-ink)] dark:peer-focus-visible:outline-[var(--p-ink-d)]",
                ].join(" ")}
              >
                {on ? (
                  <span className="h-[6px] w-[6px] rounded-full bg-[var(--p-ink)] dark:bg-[var(--p-ink-d)]" />
                ) : null}
              </span>
            </span>
            <label
              htmlFor={`${name}-${p.value}`}
              className={`text-[length:var(--p-t-body)] ${disabled ? ink3C : inkC}`}
            >
              {p.label}
              <span className={`ml-[var(--p-s-2)] text-[length:var(--p-t-caption)] ${ink3C}`}>
                {p.detail}
              </span>
            </label>
          </div>
        );
      })}
      {error ? (
        <p id={`${name}-err`} className={errCls}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function RadioParti() {
  const id = React.useId();
  return (
    <Sheet title="retry_policy — the ladder, one rung" sub="selected · locked · rejected">
      <Rec rail="active" name="retry_policy" status="selected">
        <Ladder name={`${id}-a`} />
      </Rec>
      <Rec rail="off" name="retry_policy" status="locked">
        <Ladder name={`${id}-b`} disabled />
        <p className={noteCls}>Carrier contract pins this channel to exponential.</p>
      </Rec>
      <Rec rail="error" name="retry_policy" status="rejected">
        <Ladder
          name={`${id}-c`}
          error="429 rate_limited — this key sustained 128 msg/s; only exponential is accepted."
        />
      </Rec>
    </Sheet>
  );
}

function Slot({
  id,
  label,
  note,
  defaultOn,
  disabled,
}: {
  id: string;
  label: string;
  note?: string;
  defaultOn?: boolean;
  disabled?: boolean;
}) {
  const [on, setOn] = React.useState(!!defaultOn);
  return (
    <div className="flex items-start justify-between gap-[var(--p-s-4)]">
      <label
        htmlFor={id}
        className={`text-[length:var(--p-t-body)] leading-[1.45] ${disabled ? ink3C : inkC}`}
      >
        {label}
        {note ? <span className={`block ${noteCls}`}>{note}</span> : null}
      </label>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={on}
        disabled={disabled}
        onClick={() => setOn((v) => !v)}
        className={[
          "relative flex h-[18px] w-[42px] shrink-0 items-center border",
          disabled ? `border-dashed ${edgeB} cursor-not-allowed` : edgeB,
          "bg-[var(--p-field)] dark:bg-[var(--p-field-d)]",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--p-ink)] dark:focus-visible:outline-[var(--p-ink-d)]",
        ].join(" ")}
      >
        <span
          aria-hidden
          className={`absolute left-0 top-0 h-full w-[20px] bg-[var(--p-ink)] transition-transform duration-[var(--p-d-2)] ease-[var(--p-ease)] dark:bg-[var(--p-ink-d)] ${on ? "translate-x-[22px]" : "translate-x-0"} ${disabled ? "opacity-40" : ""}`}
        />
        <span
          aria-hidden
          className={`relative z-[1] w-full text-center text-[length:var(--p-t-key)] uppercase tracking-[0.08em] ${on ? "pr-[20px]" : "pl-[20px]"} ${ink2C}`}
        >
          {on ? "on" : "off"}
        </span>
      </button>
    </div>
  );
}

export function SwitchParti() {
  const id = React.useId();
  return (
    <Sheet title="Send-time switches" sub="off · on · locked">
      <Rec rail="idle" name="sandbox" status="off">
        <Slot id={`${id}-a`} label="Sandbox mode" note="Nothing leaves the network." />
      </Rec>
      <Rec rail="ok" name="webhooks" status="on">
        <Slot
          id={`${id}-b`}
          label="Emit delivery webhooks"
          note="POSTs to https://hooks.acme.dev/relay on every status change."
          defaultOn
        />
      </Rec>
      <Rec rail="queued" name="dedupe" status="on · in effect">
        <Slot id={`${id}-c`} label="Deduplicate on idempotency_key" defaultOn />
        <p className={noteCls}>4 duplicate sends collapsed in the last hour.</p>
      </Rec>
      <Rec rail="off" name="bypass" status="locked">
        <Slot
          id={`${id}-d`}
          label="Bypass the 100 msg/s limit"
          note="Available on Scale plans."
          disabled
        />
      </Rec>
    </Sheet>
  );
}

function When({
  id,
  value,
  echo,
  focus,
  disabled,
  invalid,
  describedBy,
}: {
  id: string;
  value: string;
  echo: string;
  focus?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  describedBy?: string;
}) {
  return (
    <div>
      <input
        id={id}
        type="datetime-local"
        defaultValue={value}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        className={`${field} ${focus ? fieldFocus : ""} ${invalid ? fieldErr : ""}`}
      />
      <p className={`mt-[var(--p-s-1)] text-[length:var(--p-t-caption)] ${ink3C}`}>
        sends as <span className={inkC}>{echo}</span>
      </p>
    </div>
  );
}

export function DatePickerParti() {
  const id = React.useId();
  return (
    <Sheet title="deliver_at — RFC 3339, ≤ 30 days out" sub="4 record states">
      <Rec rail="idle" name="deliver_at" status="scheduled">
        <label htmlFor={`${id}-a`} className="sr-only">
          Deliver at, idle
        </label>
        <When id={`${id}-a`} value="2026-09-04T09:30" echo="2026-09-04T09:30:00Z · in 3d 04h" />
        <p className={noteCls}>Omit the field entirely to deliver on accept.</p>
      </Rec>
      <Rec rail="active" name="deliver_at" status="editing">
        <label htmlFor={`${id}-b`} className="sr-only">
          Deliver at, focused
        </label>
        <When
          id={`${id}-b`}
          value="2026-09-04T09:30"
          echo="2026-09-04T09:30:00Z · in 3d 04h"
          focus
        />
      </Rec>
      <Rec rail="off" name="deliver_at" status="locked">
        <label htmlFor={`${id}-c`} className="sr-only">
          Deliver at, locked
        </label>
        <When id={`${id}-c`} value="2026-09-04T09:30" echo="immediate" disabled />
        <p className={noteCls}>ch_live_sms_us does not accept scheduled delivery.</p>
      </Rec>
      <Rec rail="error" name="deliver_at" status="rejected">
        <label htmlFor={`${id}-d`} className="sr-only">
          Deliver at, rejected
        </label>
        <When
          id={`${id}-d`}
          value="2026-08-30T09:30"
          echo="2026-08-30T09:30:00Z · 2d 05h ago"
          invalid
          describedBy={`${id}-d-err`}
        />
        <p id={`${id}-d-err`} className={errCls}>
          400 invalid_deliver_at — the timestamp is in the past. Accepted window is now → +30d.
        </p>
      </Rec>
    </Sheet>
  );
}

type Phase = "idle" | "queued" | "delivered" | "rejected";

export function FormSectionParti() {
  const id = React.useId();
  const [channel, setChannel] = React.useState("ch_live_sms_us");
  const [key, setKey] = React.useState("evt_9f31c0_retry");
  const [phase, setPhase] = React.useState<Phase>("idle");
  const timer = React.useRef<number | undefined>(undefined);

  React.useEffect(() => () => window.clearTimeout(timer.current), []);

  const bad = phase === "rejected";
  const send = () => {
    window.clearTimeout(timer.current);
    if (channel.trim() === "") {
      setPhase("rejected");
      return;
    }
    setPhase("queued");
    timer.current = window.setTimeout(() => setPhase("delivered"), 1400);
  };

  const rail: RailState =
    phase === "queued" ? "queued" : phase === "delivered" ? "ok" : phase === "rejected" ? "error" : "idle";

  return (
    <Sheet title="POST /v1/messages" sub="request record">
      <Rec rail={rail} name="status" status="live">
        <p className="text-[length:var(--p-t-body)]">
          {phase === "idle" ? "not sent — the record is open" : null}
          {phase === "queued" ? (
            <span className="text-[var(--p-queued)] dark:text-[var(--p-queued-d)]">
              202 accepted · queued · msg_01J7QPZ4W8
            </span>
          ) : null}
          {phase === "delivered" ? (
            <span className="text-[var(--p-ok)] dark:text-[var(--p-ok-d)]">
              delivered · 1.32s · receipt rcpt_4b02de
            </span>
          ) : null}
          {phase === "rejected" ? (
            <span className={failC}>422 channel_unverified · 1 field rejected</span>
          ) : null}
        </p>
        {phase === "queued" ? (
          <p className={noteCls}>attempt 1 of 6 · next rung at +1s</p>
        ) : null}
      </Rec>

      <Rec rail={bad && channel.trim() === "" ? "error" : "idle"} name="channel" required>
        <label htmlFor={`${id}-ch`} className="sr-only">
          channel
        </label>
        <input
          id={`${id}-ch`}
          value={channel}
          onChange={(e) => {
            setChannel(e.target.value);
            setPhase("idle");
          }}
          placeholder="ch_live_sms_us"
          aria-invalid={bad && channel.trim() === "" ? true : undefined}
          aria-describedby={
            bad && channel.trim() === "" ? `${id}-ch-err` : `${id}-ch-hint`
          }
          className={`${field} ${bad && channel.trim() === "" ? fieldErr : ""}`}
        />
        {bad && channel.trim() === "" ? (
          <p id={`${id}-ch-err`} className={errCls}>
            422 channel_unverified — channel is required and must be verified.
          </p>
        ) : (
          <p id={`${id}-ch-hint`} className={noteCls}>
            Verified channel ID.
          </p>
        )}
      </Rec>

      <Rec rail="idle" name="idempotency_key">
        <label htmlFor={`${id}-key`} className="sr-only">
          idempotency_key
        </label>
        <input
          id={`${id}-key`}
          value={key}
          onChange={(e) => setKey(e.target.value)}
          className={field}
        />
        <p className={noteCls}>Replays the first response for 24h. 409 on a body mismatch.</p>
      </Rec>

      <Rec rail="idle" name="payload">
        <label htmlFor={`${id}-pl`} className="sr-only">
          payload
        </label>
        <Payload id={`${id}-pl`} value={BODY} />
      </Rec>

      <Rec rail="idle" name="deliver_at">
        <label htmlFor={`${id}-at`} className="sr-only">
          deliver_at
        </label>
        <When id={`${id}-at`} value="2026-09-04T09:30" echo="2026-09-04T09:30:00Z · in 3d 04h" />
      </Rec>

      <Rec rail="idle" name="retry_policy">
        <label htmlFor={`${id}-rp`} className="sr-only">
          retry_policy
        </label>
        <Picker id={`${id}-rp`} />
      </Rec>

      <Rec rail="idle" name="flags">
        <div className="space-y-[var(--p-s-3)]">
          <Slot id={`${id}-sb`} label="Sandbox mode" defaultOn />
          <Flag id={`${id}-rc`} label="Request a delivery receipt" defaultOn />
        </div>
      </Rec>

      <div className="mt-[var(--p-s-4)] flex flex-wrap items-center justify-end gap-[var(--p-s-3)]">
        <button
          type="button"
          className={`border px-[var(--p-s-3)] py-[var(--p-s-2)] text-[length:var(--p-t-key)] uppercase tracking-[0.09em] ${edgeB} ${ink2C} transition-colors duration-[var(--p-d-1)] ease-[var(--p-ease)] hover:border-[var(--p-ink)] hover:text-[var(--p-ink)] dark:hover:border-[var(--p-ink-d)] dark:hover:text-[var(--p-ink-d)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--p-ink)] dark:focus-visible:outline-[var(--p-ink-d)]`}
        >
          Copy as cURL
        </button>
        <button
          type="button"
          onClick={send}
          disabled={phase === "queued"}
          className="border border-[var(--p-ink)] bg-[var(--p-ink)] px-[var(--p-s-4)] py-[var(--p-s-2)] text-[length:var(--p-t-key)] uppercase tracking-[0.09em] text-[var(--p-ground)] transition-opacity duration-[var(--p-d-1)] ease-[var(--p-ease)] disabled:opacity-60 dark:border-[var(--p-ink-d)] dark:bg-[var(--p-ink-d)] dark:text-[var(--p-ground-d)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--p-ink)] dark:focus-visible:outline-[var(--p-ink-d)]"
        >
          {phase === "queued" ? "Sending…" : "Send request"}
        </button>
      </div>
    </Sheet>
  );
}
