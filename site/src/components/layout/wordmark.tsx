import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * The brand lockup: the chevron symbol plus the word. Two files rather than
 * one recoloured mark - the symbol carries a blue gradient that must not be
 * filtered, so the dark ground gets its own artwork with only the neutral
 * pixels inverted (public/logo-dark.svg).
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-center rounded-sm outline-none",
        "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-paper",
        className,
      )}
      aria-label="Parti - home"
    >
      <Image
        src="/logo.svg"
        alt=""
        width={440}
        height={190}
        priority
        className="h-7 w-auto dark:hidden"
      />
      <Image
        src="/logo-dark.svg"
        alt=""
        width={440}
        height={177}
        priority
        className="hidden h-7 w-auto dark:block"
      />
    </Link>
  );
}
