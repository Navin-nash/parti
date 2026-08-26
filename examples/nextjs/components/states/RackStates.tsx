import { Button } from "@/components/ui/Button";

/**
 * The four states of the rack, each designed rather than defaulted.
 *
 * A build that only ever implements the ideal state is the most common way
 * production quietly diverges from what was approved — so these ship in the
 * same pass as the populated table, not as follow-up work.
 */

/**
 * Empty names the filter that caused it and offers to clear it. An empty state
 * that says "No data" makes the dispatcher guess whether the board is broken or
 * their filter is narrow.
 */
export function RackEmpty({ onClear }: { onClear?: () => void }) {
  return (
    <div className="state">
      <p className="state__title">No flights match this filter</p>
      <p className="state__body">
        Filter is set to <span className="strip">STATUS = IROPS</span> and{" "}
        <span className="strip">BASE = GEG</span>. The SEA desk has 7 active flights outside
        this filter.
      </p>
      <Button onClick={onClear}>Clear filter</Button>
    </div>
  );
}

/**
 * Loading uses shape-matched skeletons and appears ONLY on first load. A
 * background refresh keeps stale rows on screen — a dispatcher must never lose
 * the board mid-decision because a poll came back slow.
 */
export function RackLoading({ rows = 6 }: { rows?: number }) {
  const widths = ["7ch", "8ch", "9ch", "8ch", "6ch", "6ch", "4ch", "4ch", "14ch", "10ch"];
  return (
    <div className="rack-scroll" role="status" aria-live="polite" aria-busy="true">
      <span
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          overflow: "hidden",
          clip: "rect(0 0 0 0)",
          whiteSpace: "nowrap",
        }}
      >
        Loading the rack
      </span>
      <table className="rack" aria-hidden="true">
        <tbody>
          {Array.from({ length: rows }).map((_, r) => (
            <tr key={r}>
              {widths.map((w, c) => (
                <td key={c}>
                  <div className="skel" style={{ width: w }} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Error says WHICH feed died, WHEN the data was last good, and what to do
 * instead — with a reference to quote. "Something went wrong" is not a state,
 * it is an apology.
 */
export function RackError({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="state" role="alert">
      <p className="state__title" style={{ color: "var(--warning)" }}>
        ACARS feed unavailable — board withdrawn
      </p>
      <p className="state__body">
        Last good data <span className="strip">14:18Z</span>, 4 minutes ago. Positions and ETDs
        are withdrawn rather than shown stale. Confirm status by radio with the SEA desk before
        acting. Quote incident <span className="strip">INC-4471</span> to operations
        engineering.
      </p>
      <div style={{ display: "flex", gap: "var(--s-2)", justifyContent: "center", flexWrap: "wrap" }}>
        <Button variant="primary" onClick={onRetry}>
          Retry feed
        </Button>
        <Button variant="quiet">Open desk log</Button>
      </div>
    </div>
  );
}
