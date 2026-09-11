import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The one button. Square corners, one accent (DESIGN.md). A `mark`-filled
 * primary always carries near-black `on-mark` text; on hover the accent
 * deepens and any icon nudges toward the label. `href` renders it as a link.
 *
 * Adapted from the 21st.dev icon-slide pattern, held to the hard-edged system:
 * no pill radius, no 500ms morph.
 */
type Variant = "primary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const VARIANT: Record<Variant, string> = {
  primary:
    "border border-mark bg-mark text-on-mark hover:bg-mark-text hover:border-mark-text",
  outline:
    "border border-rule-strong text-ink hover:bg-plate-2 hover:border-ink-dim",
  ghost: "text-ink hover:bg-plate-2",
};

const SIZE: Record<Size, string> = {
  sm: "gap-1.5 px-3 py-2 text-[0.75rem]",
  md: "gap-2 px-4 py-2.5 text-[0.8125rem]",
  lg: "gap-2 px-5 py-3 text-[0.875rem]",
};

interface BaseProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  iconPosition?: "start" | "end";
  className?: string;
}

const base =
  "group inline-flex items-center justify-center font-medium transition-colors duration-(--d-fast) active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mark";

function Inner({
  children,
  icon,
  iconPosition = "end",
}: Pick<BaseProps, "children" | "icon" | "iconPosition">) {
  const glyph = icon ? (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 transition-transform duration-(--d-base) ease-(--ease-out) motion-reduce:transition-none",
        iconPosition === "end"
          ? "group-hover:translate-x-0.5"
          : "group-hover:-translate-x-0.5",
      )}
    >
      {icon}
    </span>
  ) : null;
  return (
    <>
      {iconPosition === "start" ? glyph : null}
      {children}
      {iconPosition === "end" ? glyph : null}
    </>
  );
}

type ButtonAsButton = BaseProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof BaseProps> & { href?: undefined };
type ButtonAsLink = BaseProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, keyof BaseProps> & { href: string };

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const {
    children,
    variant = "primary",
    size = "md",
    icon,
    iconPosition = "end",
    className,
    ...rest
  } = props;
  const cls = cn(base, VARIANT[variant], SIZE[size], className);

  if ("href" in props && props.href !== undefined) {
    const { href, ...linkRest } = rest as ComponentPropsWithoutRef<typeof Link>;
    return (
      <Link href={href} className={cls} {...linkRest}>
        <Inner icon={icon} iconPosition={iconPosition}>
          {children}
        </Inner>
      </Link>
    );
  }

  return (
    <button className={cls} {...(rest as ComponentPropsWithoutRef<"button">)}>
      <Inner icon={icon} iconPosition={iconPosition}>
        {children}
      </Inner>
    </button>
  );
}
