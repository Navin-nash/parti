import Link from "next/link";
import { Panel } from "@/components/ui/Panel";
import { REGISTRY, GROUPS, byGroup } from "@/lib/registry";

export const metadata = { title: "Components — Meridian" };

/**
 * The gallery index. Every component in the system, grouped, each linking to
 * its own isolated preview — so a single component can be looked at with
 * nothing else on screen.
 */
export default function GalleryPage() {
  return (
    <div className="wrap" style={{ paddingTop: "var(--s-10)", paddingBottom: "var(--s-16)" }}>
      <div className="label">Component gallery</div>
      <h1 className="h1 measure" style={{ marginTop: "var(--s-3)" }}>
        {REGISTRY.length} components, each with the decision that shaped it.
      </h1>
      <p className="body measure muted" style={{ marginTop: "var(--s-4)" }}>
        Every entry links to an isolated preview. The note on each one is not documentation
        written afterwards — it is the reason the component looks the way it does, which is the
        thing that usually goes missing between a design and its code.
      </p>

      <div className="stack" style={{ marginTop: "var(--s-10)" }}>
        {GROUPS.map((group) => (
          <Panel key={group} title={group} meta={<span className="strip dim">{byGroup(group).length}</span>}>
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {byGroup(group).map((e) => (
                <li key={e.slug} style={{ borderBottom: "1px solid var(--border)" }}>
                  <Link
                    href={`/gallery/${e.slug}`}
                    style={{
                      display: "flex",
                      gap: "var(--s-4)",
                      alignItems: "baseline",
                      padding: "var(--s-3) 0",
                      textDecoration: "none",
                      flexWrap: "wrap",
                    }}
                  >
                    <span className="strip" style={{ minWidth: "18ch" }}>
                      {e.name}
                    </span>
                    <span className="small muted" style={{ flex: 1, minWidth: "20ch" }}>
                      {e.note}
                    </span>
                    <span className="label">{e.file.split("/").pop()}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Panel>
        ))}
      </div>
    </div>
  );
}
