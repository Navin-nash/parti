import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The button used everywhere on the site: a rounded pill, filled for the
 * primary action and outlined for the secondary one. Press scales down
 * slightly to read as physical; the state change survives reduced motion
 * since scale alone (no opacity/blur choreography) is cheap either way.
 */
export function SquareLink({
  href,
  children,
  variant = "quiet",
  size = "md",
  external = false,
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: "quiet" | "mark";
  size?: "md" | "lg";
  external?: boolean;
  className?: string;
}) {
  const cls = cn(
    "inline-flex items-center gap-2 rounded-full font-medium transition-all duration-(--d-fast) ease-(--ease-specimen) active:scale-[0.98]",
    size === "lg" ? "px-6 py-3.5 text-[0.9375rem]" : "px-5 py-2.5 text-[0.875rem]",
    variant === "mark"
      ? "bg-mark text-on-mark hover:opacity-90"
      : "border border-rule-strong bg-transparent text-ink hover:bg-plate-2",
    className,
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer noopener" className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
