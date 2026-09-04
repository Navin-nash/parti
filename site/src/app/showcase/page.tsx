import type { Metadata } from "next";
import { ShowcasePlayground } from "@/components/showcase/showcase-playground";

export const metadata: Metadata = {
  title: "Showcase",
  description: "The full-page live comparison playground - every example, one instrument.",
};

export default function ShowcasePage() {
  return <ShowcasePlayground />;
}
