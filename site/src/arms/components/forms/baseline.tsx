"use client";

import * as React from "react";
import { Calendar, Check, ChevronDown, CircleAlert } from "@/lib/icons";

/* Relay - POST /v1/messages request form controls. Baseline arm. */

const B = {
  "--b-accent": "#4f46e5",
  "--b-accent-hover": "#4338ca",
  "--b-accent-fg": "#ffffff",
  "--b-ring": "#6366f1",
  "--b-danger": "#dc2626",
  "--b-danger-d": "#f87171",
  "--b-radius": "0.5rem",
} as React.CSSProperties;

const shell =
  "w-full rounded-lg border border-slate-200 bg-white p-6 text-slate-900 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100";

const legend =
  "mb-4 text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100";

const labelCls =
  "mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300";

const hintCls = "mt-1.5 text-xs text-slate-500 dark:text-slate-400";

const errCls =
  "mt-1.5 flex items-center gap-1.5 text-xs text-[var(--b-danger)] dark:text-[var(--b-danger-d)]";

const control =
  "w-full rounded-[var(--b-radius)] border bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--b-ring)] disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:disabled:bg-slate-900/60 dark:disabled:text-slate-600";

const ok = "border-slate-300 dark:border-slate-700";
const focused = "border-[var(--b-accent)] ring-2 ring-[var(--b-ring)]";
const bad =
  "border-[var(--b-danger)] dark:border-[var(--b-danger-d)] focus:ring-[var(--b-danger)]";

function StateLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
      {children}
    </p>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">{children}</div>;
}

export function InputBaseline() {
  const id = React.useId();
  return (
    <div data-arm="baseline" style={B} className={shell}>
      <p className={legend}>channel — required</p>
      <Grid>
        <div>
          <StateLabel>Default</StateLabel>
          <label htmlFor={`${id}-a`} className={labelCls}>
            Channel ID
          </label>
          <input
            id={`${id}-a`}
            defaultValue="ch_live_sms_us"
            className={`${control} ${ok}`}
          />
          <p className={hintCls}>The verified channel the message is sent on.</p>
        </div>
        <div>
          <StateLabel>Focus</StateLabel>
          <label htmlFor={`${id}-b`} className={labelCls}>
            Channel ID
          </label>
          <input id={`${id}-b`} defaultValue="ch_live_" className={`${control} ${focused}`} />
          <p className={hintCls}>The verified channel the message is sent on.</p>
        </div>
        <div>
          <StateLabel>Disabled</StateLabel>
          <label htmlFor={`${id}-c`} className={labelCls}>
            Channel ID
          </label>
          <input id={`${id}-c`} disabled defaultValue="ch_test_sandbox" className={`${control} ${ok}`} />
          <p className={hintCls}>Locked while the sandbox key is in use.</p>
        </div>
        <div>
          <StateLabel>Error</StateLabel>
          <label htmlFor={`${id}-d`} className={labelCls}>
            Channel ID
          </label>
          <input
            id={`${id}-d`}
            defaultValue="ch_live_email_eu"
            aria-invalid
            aria-describedby={`${id}-d-err`}
            className={`${control} ${bad}`}
          />
          <p id={`${id}-d-err`} className={errCls}>
            <CircleAlert className="size-3.5 shrink-0" aria-hidden />
            422 channel_unverified — verify the sender domain first.
          </p>
        </div>
      </Grid>
    </div>
  );
}

export function TextareaBaseline() {
  const id = React.useId();
  const body = '{\n  "to": "+15125550142",\n  "body": "Your code is 481920"\n}';
  return (
    <div data-arm="baseline" style={B} className={shell}>
      <p className={legend}>payload — JSON object</p>
      <Grid>
        <div>
          <StateLabel>Default</StateLabel>
          <label htmlFor={`${id}-a`} className={labelCls}>
            Payload
          </label>
          <textarea
            id={`${id}-a`}
            rows={4}
            defaultValue={body}
            className={`${control} ${ok} font-mono text-xs`}
          />
        </div>
        <div>
          <StateLabel>Focus</StateLabel>
          <label htmlFor={`${id}-b`} className={labelCls}>
            Payload
          </label>
          <textarea
            id={`${id}-b`}
            rows={4}
            defaultValue={body}
            className={`${control} ${focused} font-mono text-xs`}
          />
        </div>
        <div>
          <StateLabel>Disabled</StateLabel>
          <label htmlFor={`${id}-c`} className={labelCls}>
            Payload
          </label>
          <textarea
            id={`${id}-c`}
            rows={4}
            disabled
            defaultValue={body}
            className={`${control} ${ok} font-mono text-xs`}
          />
        </div>
        <div>
          <StateLabel>Error</StateLabel>
          <label htmlFor={`${id}-d`} className={labelCls}>
            Payload
          </label>
          <textarea
            id={`${id}-d`}
            rows={4}
            aria-invalid
            aria-describedby={`${id}-d-err`}
            defaultValue={'{\n  "to": "+15125550142",\n  "body":\n}'}
            className={`${control} ${bad} font-mono text-xs`}
          />
          <p id={`${id}-d-err`} className={errCls}>
            <CircleAlert className="size-3.5 shrink-0" aria-hidden />
            Unexpected token at line 3 — payload must be valid JSON.
          </p>
        </div>
      </Grid>
    </div>
  );
}

const POLICIES = [
  { value: "exponential", label: "exponential — 6 attempts over 2h" },
  { value: "linear", label: "linear — 4 attempts, 30s apart" },
  { value: "none", label: "none — fail on first rejection" },
];

function SelectShell({
  id,
  state,
  disabled,
  describedBy,
}: {
  id: string;
  state: string;
  disabled?: boolean;
  describedBy?: string;
}) {
  return (
    <div className="relative">
      <select
        id={id}
        disabled={disabled}
        aria-invalid={describedBy ? true : undefined}
        aria-describedby={describedBy}
        defaultValue="exponential"
        className={`${control} ${state} appearance-none pr-9`}
      >
        {POLICIES.map((p) => (
          <option key={p.value} value={p.value}>
            {p.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
        aria-hidden
      />
    </div>
  );
}

export function SelectBaseline() {
  const id = React.useId();
  return (
    <div data-arm="baseline" style={B} className={shell}>
      <p className={legend}>retry_policy — enum</p>
      <Grid>
        <div>
          <StateLabel>Default</StateLabel>
          <label htmlFor={`${id}-a`} className={labelCls}>
            Retry policy
          </label>
          <SelectShell id={`${id}-a`} state={ok} />
        </div>
        <div>
          <StateLabel>Focus</StateLabel>
          <label htmlFor={`${id}-b`} className={labelCls}>
            Retry policy
          </label>
          <SelectShell id={`${id}-b`} state={focused} />
        </div>
        <div>
          <StateLabel>Disabled</StateLabel>
          <label htmlFor={`${id}-c`} className={labelCls}>
            Retry policy
          </label>
          <SelectShell id={`${id}-c`} state={ok} disabled />
          <p className={hintCls}>Fixed by the channel&apos;s delivery contract.</p>
        </div>
        <div>
          <StateLabel>Error</StateLabel>
          <label htmlFor={`${id}-d`} className={labelCls}>
            Retry policy
          </label>
          <SelectShell id={`${id}-d`} state={bad} describedBy={`${id}-d-err`} />
          <p id={`${id}-d-err`} className={errCls}>
            <CircleAlert className="size-3.5 shrink-0" aria-hidden />
            429 rate_limited — exponential is required above 100 msg/s.
          </p>
        </div>
      </Grid>
    </div>
  );
}

function Box({ checked, disabled, error }: { checked: boolean; disabled?: boolean; error?: boolean }) {
  return (
    <span
      aria-hidden
      className={[
        "flex size-4 shrink-0 items-center justify-center rounded border shadow-sm transition-colors",
        checked
          ? "border-[var(--b-accent)] bg-[var(--b-accent)] text-[var(--b-accent-fg)]"
          : "border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-900",
        error ? "border-[var(--b-danger)] dark:border-[var(--b-danger-d)]" : "",
        disabled ? "opacity-50" : "",
      ].join(" ")}
    >
      {checked ? <Check className="size-3" strokeWidth={3} /> : null}
    </span>
  );
}

function CheckRow({
  id,
  label,
  hint,
  defaultChecked,
  disabled,
  error,
}: {
  id: string;
  label: string;
  hint?: string;
  defaultChecked?: boolean;
  disabled?: boolean;
  error?: string;
}) {
  const [checked, setChecked] = React.useState(!!defaultChecked);
  return (
    <div>
      <div className="flex items-start gap-2.5">
        <span className="relative mt-0.5 flex">
          <input
            id={id}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${id}-err` : undefined}
            onChange={(e) => setChecked(e.target.checked)}
            className="peer absolute inset-0 size-4 cursor-pointer opacity-0 disabled:cursor-not-allowed"
          />
          <span className="rounded ring-offset-1 peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--b-ring)]">
            <Box checked={checked} disabled={disabled} error={!!error} />
          </span>
        </span>
        <label
          htmlFor={id}
          className={`text-sm ${disabled ? "text-slate-400 dark:text-slate-600" : "text-slate-700 dark:text-slate-300"}`}
        >
          {label}
          {hint ? (
            <span className="block text-xs text-slate-500 dark:text-slate-400">{hint}</span>
          ) : null}
        </label>
      </div>
      {error ? (
        <p id={`${id}-err`} className={`${errCls} ml-6`}>
          <CircleAlert className="size-3.5 shrink-0" aria-hidden />
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function CheckboxBaseline() {
  const id = React.useId();
  return (
    <div data-arm="baseline" style={B} className={shell}>
      <p className={legend}>Delivery options</p>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-4">
          <div>
            <StateLabel>Default / checked</StateLabel>
            <div className="space-y-3">
              <CheckRow
                id={`${id}-a`}
                label="Request delivery receipt"
                hint="Adds a receipt event to the webhook stream."
              />
              <CheckRow id={`${id}-b`} label="Reuse idempotency_key on retry" defaultChecked />
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <StateLabel>Disabled / error</StateLabel>
            <div className="space-y-3">
              <CheckRow
                id={`${id}-c`}
                label="Deliver to unverified channels"
                hint="Unavailable on live keys."
                disabled
              />
              <CheckRow
                id={`${id}-d`}
                label="I understand duplicates will be rejected"
                error="409 duplicate_idempotency_key — acknowledge to continue."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RadioGroup({
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
      className="space-y-2.5"
    >
      {POLICIES.map((p) => (
        <div key={p.value} className="flex items-center gap-2.5">
          <span className="relative flex">
            <input
              id={`${name}-${p.value}`}
              type="radio"
              name={name}
              value={p.value}
              checked={value === p.value}
              disabled={disabled}
              onChange={() => setValue(p.value)}
              className="peer absolute inset-0 size-4 cursor-pointer opacity-0 disabled:cursor-not-allowed"
            />
            <span
              aria-hidden
              className={[
                "flex size-4 items-center justify-center rounded-full border shadow-sm ring-offset-1 peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--b-ring)]",
                value === p.value
                  ? "border-[var(--b-accent)] bg-[var(--b-accent)]"
                  : "border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-900",
                error ? "border-[var(--b-danger)] dark:border-[var(--b-danger-d)]" : "",
                disabled ? "opacity-50" : "",
              ].join(" ")}
            >
              {value === p.value ? <span className="size-1.5 rounded-full bg-white" /> : null}
            </span>
          </span>
          <label
            htmlFor={`${name}-${p.value}`}
            className={`text-sm ${disabled ? "text-slate-400 dark:text-slate-600" : "text-slate-700 dark:text-slate-300"}`}
          >
            {p.label}
          </label>
        </div>
      ))}
      {error ? (
        <p id={`${name}-err`} className={errCls}>
          <CircleAlert className="size-3.5 shrink-0" aria-hidden />
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function RadioBaseline() {
  const id = React.useId();
  return (
    <div data-arm="baseline" style={B} className={shell}>
      <p className={legend}>retry_policy — radio group</p>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
        <div>
          <StateLabel>Default / checked</StateLabel>
          <RadioGroup name={`${id}-a`} />
        </div>
        <div>
          <StateLabel>Disabled</StateLabel>
          <RadioGroup name={`${id}-b`} disabled />
        </div>
        <div>
          <StateLabel>Error</StateLabel>
          <RadioGroup
            name={`${id}-c`}
            error="429 rate_limited — pick exponential above 100 msg/s."
          />
        </div>
      </div>
    </div>
  );
}

function Toggle({
  id,
  label,
  hint,
  defaultOn,
  disabled,
  ring,
}: {
  id: string;
  label: string;
  hint?: string;
  defaultOn?: boolean;
  disabled?: boolean;
  ring?: boolean;
}) {
  const [on, setOn] = React.useState(!!defaultOn);
  return (
    <div className="flex items-start justify-between gap-4">
      <label
        htmlFor={id}
        className={`text-sm ${disabled ? "text-slate-400 dark:text-slate-600" : "text-slate-700 dark:text-slate-300"}`}
      >
        {label}
        {hint ? <span className="block text-xs text-slate-500 dark:text-slate-400">{hint}</span> : null}
      </label>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={on}
        aria-labelledby={undefined}
        disabled={disabled}
        onClick={() => setOn((v) => !v)}
        className={[
          "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border border-transparent shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--b-ring)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          on ? "bg-[var(--b-accent)]" : "bg-slate-300 dark:bg-slate-700",
          ring ? "ring-2 ring-[var(--b-ring)] ring-offset-2" : "",
        ].join(" ")}
      >
        <span
          className={`inline-block size-4 rounded-full bg-white shadow transition-transform ${on ? "translate-x-4" : "translate-x-0.5"}`}
        />
      </button>
    </div>
  );
}

export function SwitchBaseline() {
  const id = React.useId();
  return (
    <div data-arm="baseline" style={B} className={shell}>
      <p className={legend}>Request flags</p>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-4">
          <StateLabel>Off / on</StateLabel>
          <Toggle id={`${id}-a`} label="Sandbox mode" hint="Nothing leaves the network." />
          <Toggle id={`${id}-b`} label="Send delivery webhooks" defaultOn />
        </div>
        <div className="space-y-4">
          <StateLabel>Focus / disabled</StateLabel>
          <Toggle id={`${id}-c`} label="Deduplicate on idempotency_key" defaultOn ring />
          <Toggle
            id={`${id}-d`}
            label="Bypass rate limit"
            hint="Enterprise plans only."
            disabled
          />
        </div>
      </div>
    </div>
  );
}

function DateField({
  id,
  state,
  disabled,
  describedBy,
  value,
}: {
  id: string;
  state: string;
  disabled?: boolean;
  describedBy?: string;
  value: string;
}) {
  return (
    <div className="relative">
      <input
        id={id}
        type="datetime-local"
        defaultValue={value}
        disabled={disabled}
        aria-invalid={describedBy ? true : undefined}
        aria-describedby={describedBy}
        className={`${control} ${state} pr-9`}
      />
      <Calendar
        className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
        aria-hidden
      />
    </div>
  );
}

export function DatePickerBaseline() {
  const id = React.useId();
  return (
    <div data-arm="baseline" style={B} className={shell}>
      <p className={legend}>deliver_at — RFC 3339 timestamp</p>
      <Grid>
        <div>
          <StateLabel>Default</StateLabel>
          <label htmlFor={`${id}-a`} className={labelCls}>
            Deliver at
          </label>
          <DateField id={`${id}-a`} state={ok} value="2026-09-04T09:30" />
          <p className={hintCls}>Empty means deliver immediately.</p>
        </div>
        <div>
          <StateLabel>Focus</StateLabel>
          <label htmlFor={`${id}-b`} className={labelCls}>
            Deliver at
          </label>
          <DateField id={`${id}-b`} state={focused} value="2026-09-04T09:30" />
          <p className={hintCls}>Sent as UTC regardless of local zone.</p>
        </div>
        <div>
          <StateLabel>Disabled</StateLabel>
          <label htmlFor={`${id}-c`} className={labelCls}>
            Deliver at
          </label>
          <DateField id={`${id}-c`} state={ok} value="2026-09-04T09:30" disabled />
          <p className={hintCls}>Scheduling is off for this channel.</p>
        </div>
        <div>
          <StateLabel>Error</StateLabel>
          <label htmlFor={`${id}-d`} className={labelCls}>
            Deliver at
          </label>
          <DateField
            id={`${id}-d`}
            state={bad}
            value="2026-08-30T09:30"
            describedBy={`${id}-d-err`}
          />
          <p id={`${id}-d-err`} className={errCls}>
            <CircleAlert className="size-3.5 shrink-0" aria-hidden />
            deliver_at is in the past — must be within the next 30 days.
          </p>
        </div>
      </Grid>
    </div>
  );
}

export function FormSectionBaseline() {
  const id = React.useId();
  const [channel, setChannel] = React.useState("");
  const [key, setKey] = React.useState("evt_9f31c0_retry");
  const [submitted, setSubmitted] = React.useState(false);
  const channelBad = submitted && channel.trim() === "";

  return (
    <div data-arm="baseline" style={B} className={shell}>
      <div className="mb-6 border-b border-slate-200 pb-4 dark:border-slate-800">
        <h2 className="text-base font-semibold tracking-tight">Send a message</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          POST /v1/messages — build the request body and send it against your test key.
        </p>
      </div>

      {submitted && channelBad ? (
        <div
          role="alert"
          className="mb-5 rounded-lg border border-[var(--b-danger)] bg-red-50 p-3 text-sm text-[var(--b-danger)] dark:border-[var(--b-danger-d)] dark:bg-red-950/40 dark:text-[var(--b-danger-d)]"
        >
          <span className="font-medium">1 field needs attention.</span> channel is required.
        </div>
      ) : null}

      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor={`${id}-ch`} className={labelCls}>
              channel <span className="text-[var(--b-danger)] dark:text-[var(--b-danger-d)]">*</span>
            </label>
            <input
              id={`${id}-ch`}
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              placeholder="ch_live_sms_us"
              aria-invalid={channelBad || undefined}
              aria-describedby={channelBad ? `${id}-ch-err` : `${id}-ch-hint`}
              className={`${control} ${channelBad ? bad : ok} font-mono text-xs`}
            />
            {channelBad ? (
              <p id={`${id}-ch-err`} className={errCls}>
                <CircleAlert className="size-3.5 shrink-0" aria-hidden />
                422 channel_unverified — supply a verified channel ID.
              </p>
            ) : (
              <p id={`${id}-ch-hint`} className={hintCls}>
                Verified channel ID. Required.
              </p>
            )}
          </div>
          <div>
            <label htmlFor={`${id}-key`} className={labelCls}>
              idempotency_key
            </label>
            <input
              id={`${id}-key`}
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className={`${control} ${ok} font-mono text-xs`}
            />
            <p className={hintCls}>Reused keys return the original response for 24h.</p>
          </div>
        </div>

        <div>
          <label htmlFor={`${id}-payload`} className={labelCls}>
            payload
          </label>
          <textarea
            id={`${id}-payload`}
            rows={5}
            defaultValue={'{\n  "to": "+15125550142",\n  "body": "Your code is 481920"\n}'}
            className={`${control} ${ok} font-mono text-xs`}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor={`${id}-at`} className={labelCls}>
              deliver_at
            </label>
            <DateField id={`${id}-at`} state={ok} value="2026-09-04T09:30" />
          </div>
          <div>
            <label htmlFor={`${id}-rp`} className={labelCls}>
              retry_policy
            </label>
            <SelectShell id={`${id}-rp`} state={ok} />
          </div>
        </div>

        <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
          <Toggle id={`${id}-sb`} label="Send with the sandbox key" defaultOn />
          <CheckRow id={`${id}-rc`} label="Request delivery receipt" defaultChecked />
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4 dark:border-slate-800">
          <button
            type="button"
            className="rounded-[var(--b-radius)] border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--b-ring)] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Copy as cURL
          </button>
          <button
            type="submit"
            className="rounded-[var(--b-radius)] bg-[var(--b-accent)] px-4 py-2 text-sm font-medium text-[var(--b-accent-fg)] shadow-sm transition-colors hover:bg-[var(--b-accent-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--b-ring)] focus-visible:ring-offset-2"
          >
            Send request
          </button>
        </div>
      </form>
    </div>
  );
}
