import { notFound } from "next/navigation";
import { showcaseBySlug, showcaseSlugs } from "@/data/showcases";
import { SHOWCASE_COMPONENTS } from "@/showcases";

/**
 * Bare render target for one showcase - no site nav, footer, cursor or
 * command menu (see ChromeGate). This is what the gallery and detail pages
 * put inside an iframe, so it has to stand on its own the way a real,
 * independently-hosted landing page would.
 */
export function generateStaticParams() {
  return showcaseSlugs().map((slug) => ({ slug }));
}

export default async function PreviewPage({ params }: PageProps<"/preview/[slug]">) {
  const { slug } = await params;
  const showcase = showcaseBySlug(slug);
  const Component = SHOWCASE_COMPONENTS[slug];
  if (!showcase || !Component) notFound();

  return <Component />;
}
