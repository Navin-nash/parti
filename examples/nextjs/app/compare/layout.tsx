import { DocsSidebar } from "@/components/docs/DocsSidebar";

export const metadata = { title: "Compare — Meridian" };

/**
 * The docs shell: a fixed sidebar of everything previewable, and a content
 * column. Deliberately conventional — this is navigation chrome, and Jakob's
 * Law applies hardest to the parts of an interface that are not the point.
 */
export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="docs">
      <DocsSidebar />
      <div className="docs__main">{children}</div>
    </div>
  );
}
