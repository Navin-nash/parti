import { StatusToken } from "@/components/ui/StatusToken";
import type { Flight } from "@/lib/data";

/**
 * The rack. Fields print in the order a paper flight-progress strip prints
 * them, because that order is already in this audience's hands — the "bay"
 * column is carried over from the physical rack for the same reason.
 *
 * The rack scrolls sideways inside its own container rather than truncating.
 * A clipped tail number is an airworthiness risk, not a layout inconvenience.
 */
export function FlightRack({
  flights,
  caption,
}: {
  flights: Flight[];
  caption?: string;
}) {
  return (
    <div className="rack-scroll">
      <table className="rack">
        {caption && <caption className="label" style={{ textAlign: "left", padding: "var(--s-3) var(--s-4)" }}>{caption}</caption>}
        <thead>
          <tr>
            <th scope="col">Flight</th>
            <th scope="col">Tail</th>
            <th scope="col">Type</th>
            <th scope="col">Pair</th>
            <th scope="col">STD</th>
            <th scope="col">ETD</th>
            <th scope="col" className="num">Δ</th>
            <th scope="col">Bay</th>
            <th scope="col">Crew</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {flights.map((f) => (
            <tr key={f.id} data-state={f.state}>
              <th scope="row" style={{ fontWeight: 500, font: "500 13px/16px var(--f-mono)" }}>
                {f.flight}
              </th>
              <td>{f.tail}</td>
              <td>{f.type}</td>
              <td>
                {f.origin}–{f.dest}
              </td>
              <td>{f.std}</td>
              <td>{f.etd}</td>
              <td className="num">{f.delta === 0 ? "—" : f.delta > 0 ? `+${f.delta}` : f.delta}</td>
              <td>{f.bay}</td>
              <td>{f.crew}</td>
              <td>
                <StatusToken state={f.state} label={f.status} delta={f.delta} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
