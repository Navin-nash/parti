import { PROCESS } from "@/data/process";

/**
 * The seven stages, as a card grid on wide screens and a stacked list below
 * lg. The third stage is marked "skipped" because it is the one that usually
 * does not happen: an exploration that produces three palettes of the same
 * layout has not explored anything, and skipping it is invisible in the
 * output - the result still looks like a design was done.
 */
export function ProcessRail() {
  return (
    <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {PROCESS.map((s) => (
        <li
          key={s.index}
          className="flex flex-col rounded-2xl border border-rule bg-plate p-4"
        >
          <div className="mb-2 flex items-center gap-2">
            <h3 className="text-[0.9375rem] leading-snug text-ink">{s.title}</h3>
            {s.pivotal ? (
              <span className="ml-auto shrink-0 rounded-full bg-mark-tint px-2 py-0.5 text-[0.6875rem] font-medium text-mark">
                skipped
              </span>
            ) : null}
          </div>
          <p className="text-[0.8125rem] leading-snug text-ink-muted">{s.short}</p>
          <ul className="mt-3 flex flex-wrap gap-1.5 border-t border-rule/60 pt-3">
            {s.fields.map((f) => (
              <li
                key={f}
                className="rounded-full bg-plate-2 px-2 py-0.5 text-[0.6875rem] text-ink-dim"
              >
                {f}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}
