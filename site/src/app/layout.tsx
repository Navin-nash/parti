import type { Metadata } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
// The display face: headlines and plate titles only. A modern geometric
// grotesque reads as professional developer-tooling rather than editorial,
// which is the register this rewrite asked for.
const displayFace = Plus_Jakarta_Sans({
  variable: "--font-display-face",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://parti.design"),
  title: {
    default: "Parti - design direction for AI-generated interfaces",
    template: "%s - Parti",
  },
  description:
    "The same brief, run twice: once with the Parti skill and once without it. Both arms rendered, measured, and annotated so the difference is observable rather than asserted.",
  openGraph: {
    title: "Parti - design direction for AI-generated interfaces",
    description: "Same brief. Different process. Both arms rendered and measured.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${displayFace.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <ThemeProvider>
          <TooltipProvider delayDuration={200}>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-mark focus:px-3 focus:py-2 focus:text-on-mark focus:outline-none"
            >
              Skip to content
            </a>
            <SiteHeader />
            <main id="main" className="flex-1">
              {children}
            </main>
            <SiteFooter />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
