/**
 * A labelled data field. The value is always monospace and tabular so columns
 * align and digits do not jitter when the board refreshes.
 */
export function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="label">{label}</div>
      <div className="strip">{value}</div>
    </div>
  );
}
