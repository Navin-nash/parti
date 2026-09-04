import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Headline. The serif carries the argument; nothing else on the site uses it. */
export function Display({
  children, level = 1, className,
}: { children: ReactNode; level?: 1 | 2 | 3; className?: string }) {
  const Tag = (["h1", "h2", "h3"] as const)[level - 1];
  const size =
    level === 1
      ? "text-[clamp(2.25rem,5.5vw,3.75rem)]"
      : level === 2
        ? "text-[clamp(1.75rem,3.5vw,2.5rem)]"
        : "text-[clamp(1.3125rem,2.2vw,1.75rem)]";
  return <Tag className={cn("display text-ink", size, className)}>{children}</Tag>;
}

/** Body copy at a 68ch measure. */
export function Lede({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("max-w-[62ch] text-[1.0625rem] leading-[1.65] text-ink-muted", className)}>
      {children}
    </p>
  );
}

export function Prose({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("prose-specimen", className)}>{children}</div>;
}
