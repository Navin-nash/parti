import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "default" | "quiet";
type Size = "md" | "lg";

const cls = (variant: Variant, size: Size, extra?: string) =>
  [
    "btn",
    variant === "primary" ? "btn--primary" : "",
    variant === "quiet" ? "btn--quiet" : "",
    size === "lg" ? "btn--lg" : "",
    extra ?? "",
  ]
    .filter(Boolean)
    .join(" ");

/**
 * Every control carries its verb. There is no icon-only variant, deliberately —
 * a dispatcher acting from muscle memory at hour ten needs the word.
 */
export function Button({
  variant = "default",
  size = "md",
  className,
  children,
  ...rest
}: {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cls(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "default",
  size = "md",
  className,
  children,
  ...rest
}: {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
} & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={cls(variant, size, className)} {...rest}>
      {children}
    </a>
  );
}
