import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Toaster } from "@/components/ui/sonner";
import { CommandMenu } from "@/components/site/command-menu";
import { SmartCursor } from "@/components/proof/smart-cursor";
import { ChromeGate } from "@/components/site/chrome-gate";
import "./globals.css";

// Two faces, one job each: Geist is the interface (and the thesis lines),
// Geist Mono is the evidence. No editorial display face - see DESIGN.md.
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://parti.design"),
  title: {
    default: "Parti - design direction for AI-generated interfaces",
    template: "%s - Parti",
  },
  description:
    "A Claude Code skill that derives a design direction from the subject instead of picking one off a style menu. A gallery of what it produced, the seven-stage method, and the full command set.",
  openGraph: {
    title: "Parti - design direction for AI-generated interfaces",
    description: "A Claude Code skill that derives a design direction from the subject.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <ThemeProvider>
          <TooltipProvider delayDuration={200}>
            <ChromeGate>
              <CommandMenu />
              <Toaster position="bottom-right" />
              <a
                href="#main"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-mark focus:px-3 focus:py-2 focus:text-on-mark focus:outline-none"
              >
                Skip to content
              </a>
              <SmartCursor />
              <SiteHeader />
            </ChromeGate>
            <main id="main" className="flex-1">
              {children}
            </main>
            <ChromeGate>
              <SiteFooter />
            </ChromeGate>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
