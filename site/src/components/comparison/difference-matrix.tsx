import type { MatrixRow } from "@/lib/schema";
import { ArmBadge } from "@/components/specimen/arm-badge";

/**
 * The difference matrix, §27.
 *
 * Every cell is a qualitative statement about something observable in the two
 * arms above it. No cell contains a number, on purpose: a matrix that scores
 * each dimension out of ten invites the reader to sum the column, and a single
 * blended design-quality number is exactly what the skill's own documentation
 * says not to produce.
 *
 * Below `md` this stops being a table and becomes a stack of paired rows.
 * A 3-column table at 375px is unreadable, and shrinking it is not a design.
 */
export function DifferenceMatrix({ rows }: { rows: MatrixRow[] }) {
  return (
    <>
      {/* Table at md and up. */}
      <div className="hidden overflow-hidden overflow-x-auto rounded-2xl border border-rule md:block">
        <table className="w-full border-collapse text-left text-[0.875rem]">
          <caption className="sr-only">
            Dimension-by-dimension comparison of the two arms
          </caption>
          <thead>
            <tr className="border-b border-rule bg-plate-2">
              <th scope="col" className="w-[16%] px-4 py-2.5">
                <span className="plate-label">Dimension</span>
              </th>
              <th scope="col" className="w-[42%] border-l border-rule px-4 py-2.5">
                <ArmBadge arm="baseline" variant="full" />
              </th>
              <th scope="col" className="w-[42%] border-l border-rule px-4 py-2.5">
                <ArmBadge arm="parti" variant="full" />
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.dimension} className="border-b border-rule last:border-0">
                <th
                  scope="row"
                  className="bg-plate-2 px-4 py-3 align-top font-normal"
                >
                  <span className="plate-label">{r.dimension}</span>
                </th>
                <td className="border-l border-rule bg-plate px-4 py-3 align-top text-ink-muted">
                  {r.baseline}
                </td>
                <td className="border-l border-rule bg-plate px-4 py-3 align-top text-ink">
                  {r.parti}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stacked below md. */}
      <ul className="space-y-3 md:hidden">
        {rows.map((r) => (
          <li key={r.dimension} className="rounded-2xl border border-rule bg-plate p-4">
            <p className="plate-label mb-3">{r.dimension}</p>
            <dl className="space-y-3 text-[0.875rem]">
              <div>
                <dt className="mb-1">
                  <ArmBadge arm="baseline" variant="short" />
                </dt>
                <dd className="text-ink-muted">{r.baseline}</dd>
              </div>
              <div>
                <dt className="mb-1">
                  <ArmBadge arm="parti" variant="short" />
                </dt>
                <dd className="text-ink">{r.parti}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </>
  );
}
