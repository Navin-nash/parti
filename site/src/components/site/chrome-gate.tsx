"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Every showcase renders inside `/preview/[slug]`, and it has to look like a
 * real, independent site when iframed - the site's own nav, footer, command
 * menu and custom cursor would all leak into what is supposed to read as
 * someone else's page. The root layout can't swap layouts per route (there
 * is exactly one root layout), so this gates on the path instead.
 */
export function ChromeGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/preview/")) return null;
  return <>{children}</>;
}
