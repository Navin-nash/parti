import { ARM_LABEL, ARM_PLATE, type ArmKind } from "@/lib/schema";
import { cn } from "@/lib/utils";

/**
 * Arms are distinguished by label and position, never by a good/bad colour.
 *
 * Tinting the parti arm green and the baseline arm red would decide the
 * comparison before the reader looks at it. The mark colour is reserved
 * strictly for annotation - findings, focus, the active control - so it never
 * ends up meaning "this is the better one".
 */
export function ArmBadge({
  arm,
  variant = "full",
  className,
}: {
  arm: ArmKind;
  variant?: "full" | "plate" | "short";
  className?: string;
}) {
  const text =
    variant === "plate"
      ? ARM_PLATE[arm]
      : variant === "short"
        ? arm === "baseline"
          ? "Without"
          : "With"
        : ARM_LABEL[arm];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.6875rem] font-medium",
        arm === "baseline"
          ? "bg-plate-2 text-ink-muted"
          : "bg-plate-2 text-ink",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "size-1.5",
          arm === "baseline" ? "bg-ink-dim" : "bg-ink",
        )}
      />
      {text}
    </span>
  );
}

/** Prints where a plate's evidence comes from. Required on every example. */
export function ProvenanceBadge({
  provenance,
  className,
}: {
  provenance: "measured" | "authored";
  className?: string;
}) {
  const measured = provenance === "measured";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.6875rem] font-medium",
        measured
          ? "bg-mark-tint text-mark"
          : "bg-plate-2 text-ink-dim",
        className,
      )}
      title={
        measured
          ? "Both arms were produced by separate agent runs on the same prompt and scored by scripts/. The figures shown are that script output."
          : "Both arms were authored to illustrate a difference documented elsewhere in the repo. No score is claimed for this plate."
      }
    >
      {measured ? "Measured run" : "Authored plate"}
    </span>
  );
}
