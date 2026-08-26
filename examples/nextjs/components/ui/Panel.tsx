import type { ReactNode } from "react";

/**
 * The only container in the system.
 *
 * A Panel never contains another Panel — interior grouping is a hairline plus
 * a .label. Nested cards are banned in DESIGN.md, and the nesting is what makes
 * generated dashboards read as generated.
 *
 * Elevation is a lightness step, never a shadow: at the ground luminance this
 * design operates at, a drop shadow is invisible and a 4% lightness step is not.
 */
export function Panel({
  title,
  meta,
  actions,
  focus = false,
  bodyless = false,
  children,
}: {
  title?: string;
  meta?: ReactNode;
  actions?: ReactNode;
  focus?: boolean;
  /** skip the padded body — for tables that should meet the panel edge */
  bodyless?: boolean;
  children: ReactNode;
}) {
  return (
    <section className={`panel${focus ? " panel--focus" : ""}`}>
      {(title || actions) && (
        <header className="panel__head">
          <div className="row-between" style={{ gap: "var(--s-3)" }}>
            {title && <h2 className="label">{title}</h2>}
            {meta}
          </div>
          {actions}
        </header>
      )}
      {bodyless ? children : <div className="panel__body">{children}</div>}
    </section>
  );
}
