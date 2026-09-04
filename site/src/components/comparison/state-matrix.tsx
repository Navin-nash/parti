import { Check, Minus } from "@/lib/icons";
import type { StateSpec } from "@/lib/schema";

/**
 * State coverage, §9.
 *
 * The interesting column is not which states exist but which are *missing*.
 * A build that only implements the ideal state is the most common way a
 * shipped product diverges from what was approved, and it is invisible in a
 * screenshot - so it gets its own table rather than a line in the matrix.
 */
export function StateMatrix({ states }: { states: StateSpec[] }) {
  const missing = states.filter((s) => !s.implemented).length;

  return (
    <div className="bg-plate">
      <div className="flex items-baseline gap-3 border-b border-rule bg-plate-2 px-3 py-1.5">
        <span className="font-mono text-[0.625rem] tabular text-ink-dim">
          {states.length - missing} of {states.length} implemented
        </span>
        {missing > 0 ? (
          <span className="ml-auto font-mono text-[0.625rem] uppercase tracking-[0.12em] text-mark">
            {missing} missing
          </span>
        ) : null}
      </div>
      <ul className="divide-y divide-rule">
        {states.map((s) => (
          <li key={s.name} className="flex items-start gap-3 px-3 py-2.5">
            <span
              aria-hidden
              className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-plate"
            >
              {s.implemented ? (
                <Check className="size-3 text-mark" aria-hidden />
              ) : (
                <Minus className="size-3 text-ink-dim" aria-hidden />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p className="flex items-baseline gap-2">
                <code className="font-mono text-[0.75rem] text-ink">{s.name}</code>
                <span className="sr-only">
                  {s.implemented ? "implemented" : "not implemented"}
                </span>
                {!s.implemented ? (
                  <span className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-ink-dim">
                    not built
                  </span>
                ) : null}
              </p>
              <p className="mt-0.5 text-[0.8125rem] leading-snug text-ink-muted">
                {s.intent}
              </p>
              {s.note ? (
                <p className="mt-1 border-l-2 border-rule pl-2 text-[0.75rem] leading-snug text-ink-dim">
                  {s.note}
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
