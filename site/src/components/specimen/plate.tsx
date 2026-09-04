import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * A rounded card surface: a soft border, a subtle ambient shadow, and an
 * optional header row for a label and actions. `index` is accepted for
 * backward compatibility but no longer rendered.
 */
export interface PlateProps {
  /** @deprecated no longer rendered */
  index?: string;
  label?: string;
  meta?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  /** Recessed ground - for code wells, gutters, table heads. */
  recessed?: boolean;
  as?: "div" | "section" | "article" | "aside";
}

export function Plate({
  label,
  meta,
  action,
  children,
  className,
  bodyClassName,
  recessed = false,
  as: Tag = "div",
}: PlateProps) {
  const hasHead = Boolean(label || meta || action);
  return (
    <Tag
      className={cn(
        "rounded-2xl border border-rule/70 shadow-sm",
        recessed ? "bg-plate-2" : "bg-plate",
        className,
      )}
    >
      {hasHead ? (
        <div className="flex min-h-11 items-center gap-3 border-b border-rule/70 px-4 py-2.5">
          {label ? (
            <span className="plate-label truncate text-ink-muted">{label}</span>
          ) : null}
          <div className="ml-auto flex shrink-0 items-center gap-2">
            {meta}
            {action}
          </div>
        </div>
      ) : null}
      <div className={bodyClassName}>{children}</div>
    </Tag>
  );
}
