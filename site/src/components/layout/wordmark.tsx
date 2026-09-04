import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * The wordmark is a registration mark: two arms bracketed by a rule, which is
 * the whole argument of the site compressed into 18 pixels. It is drawn, not
 * set in a logo font, so it inherits the mark colour in both themes.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-baseline gap-2 outline-none",
        className,
      )}
      aria-label="Parti - home"
    >
      <svg
        viewBox="0 0 20 20"
        width="18"
        height="18"
        aria-hidden="true"
        className="translate-y-[2px] shrink-0"
      >
        {/* two arms */}
        <rect x="1" y="4" width="7" height="12" className="fill-ink-dim" />
        <rect x="12" y="4" width="7" height="12" className="fill-mark" />
        {/* the registration rule that divides them */}
        <rect x="9.5" y="0" width="1" height="20" className="fill-rule-strong" />
      </svg>
      <span className="font-display text-[1.15rem] leading-none tracking-tight">
        Parti
      </span>
    </Link>
  );
}
