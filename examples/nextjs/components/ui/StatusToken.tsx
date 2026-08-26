import type { Signal } from "@/lib/data";

/**
 * The signature element. Status is carried by THREE redundant channels —
 * the printed word, the colour, and the signed delta — because the board must
 * stay readable in grayscale, in peripheral vision, and with CVD.
 *
 * Never render this with colour alone. That is a DESIGN.md rule, not a
 * preference: a dispatcher misreading a status is the failure this prevents.
 */
export function StatusToken({
  state,
  label,
  delta,
}: {
  state: Signal;
  label: string;
  delta?: number;
}) {
  const sign = delta === undefined ? null : delta > 0 ? `+${delta}` : `${delta}`;
  return (
    <span className={`token token--${state}`}>
      <span>{label}</span>
      {sign !== null && delta !== 0 && (
        <span className="token__delta" aria-label={`${delta} minutes off schedule`}>
          {sign}
        </span>
      )}
    </span>
  );
}
