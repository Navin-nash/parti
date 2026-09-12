import { BackgroundPaths } from "@/components/ui/background-paths";
import { Wordmark } from "./wordmark";

export function SiteFooter() {
  return (
    <footer className="relative isolate overflow-hidden border-t border-rule bg-plate-2 text-ink">
      <BackgroundPaths className="-z-10 opacity-60" />

      <div className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6 lg:px-8">
        <Wordmark />
        <p className="mt-4 max-w-[38ch] text-[0.9375rem] leading-relaxed text-ink-muted">
          A design skill, for any coding agent, that derives a direction from
          the subject instead of picking one off a style menu.
        </p>
      </div>
    </footer>
  );
}
