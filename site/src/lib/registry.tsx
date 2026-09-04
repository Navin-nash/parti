import type { ReactNode } from "react";

/**
 * The render registry.
 *
 * Maps a stable key to the real component and the real file it lives in. The
 * code viewer reads that file off disk at build time, so what a reader sees in
 * the Code tab is byte-for-byte what rendered in the Preview tab above it - a
 * hand-written snippet stored alongside would drift within a week and then
 * quietly lie on a site whose entire argument is "look at the actual output".
 *
 * Generated shape, hand-maintained: adding a pair means adding two lines here
 * and one entry in the data file.
 */

import {
  NavigationBarBaseline, AnnouncementBarBaseline, HeroBaseline, CtaBaseline, FeatureGridBaseline, LogoCloudBaseline, TestimonialBaseline, PricingBaseline, FaqBaseline, FooterBaseline,
} from "@/arms/components/marketing/baseline";
import {
  NavigationBarParti, AnnouncementBarParti, HeroParti, CtaParti, FeatureGridParti, LogoCloudParti, TestimonialParti, PricingParti, FaqParti, FooterParti,
} from "@/arms/components/marketing/parti";
import {
  DashboardHeaderBaseline, SidebarBaseline, StatCardsBaseline, DataTableBaseline, ChartPanelBaseline, FilterBarBaseline, SearchBaseline, TabsBaseline, ModalBaseline, DrawerBaseline, DropdownBaseline, CommandMenuBaseline, ToastBaseline, EmptyStateBaseline, LoadingStateBaseline, ErrorStateBaseline,
} from "@/arms/components/product/baseline";
import {
  DashboardHeaderParti, SidebarParti, StatCardsParti, DataTableParti, ChartPanelParti, FilterBarParti, SearchParti, TabsParti, ModalParti, DrawerParti, DropdownParti, CommandMenuParti, ToastParti, EmptyStateParti, LoadingStateParti, ErrorStateParti,
} from "@/arms/components/product/parti";
import {
  InputBaseline, TextareaBaseline, SelectBaseline, CheckboxBaseline, RadioBaseline, SwitchBaseline, DatePickerBaseline, FormSectionBaseline,
} from "@/arms/components/forms/baseline";
import {
  InputParti, TextareaParti, SelectParti, CheckboxParti, RadioParti, SwitchParti, DatePickerParti, FormSectionParti,
} from "@/arms/components/forms/parti";
import {
  ArticleHeaderBaseline, DocsNavBaseline, CodeBlockBaseline, TimelineBaseline, ComparisonTableBaseline, MetadataBaseline, BreadcrumbsBaseline,
} from "@/arms/components/content/baseline";
import {
  ArticleHeaderParti, DocsNavParti, CodeBlockParti, TimelineParti, ComparisonTableParti, MetadataParti, BreadcrumbsParti,
} from "@/arms/components/content/parti";
import { LedgerlineBaseline } from "@/arms/finance-research-platform/baseline";
import { LedgerlineParti } from "@/arms/finance-research-platform/parti";
import { CadenceBaseline } from "@/arms/agent-platform-landing/baseline";
import { CadenceParti } from "@/arms/agent-platform-landing/parti";
import { NorthboundBaseline } from "@/arms/campaign-analytics/baseline";
import { NorthboundParti } from "@/arms/campaign-analytics/parti";
import { RelayDocsBaseline } from "@/arms/infrastructure-docs/baseline";
import { RelayDocsParti } from "@/arms/infrastructure-docs/parti";
import { KestrelBaseline } from "@/arms/product-page/baseline";
import { KestrelParti } from "@/arms/product-page/parti";

export interface RegistryEntry {
  sourcePath: string;
  /** Full-bleed arms opt out of the preview shell's own padding. */
  bleed?: boolean;
  render: () => ReactNode;
}

export const REGISTRY: Record<string, RegistryEntry> = {
  /* ---- marketing ---- */
  "marketing/navigation-bar/baseline": { sourcePath: "src/arms/components/marketing/baseline.tsx", render: () => <NavigationBarBaseline /> },
  "marketing/navigation-bar/parti": { sourcePath: "src/arms/components/marketing/parti.tsx", render: () => <NavigationBarParti /> },
  "marketing/announcement-bar/baseline": { sourcePath: "src/arms/components/marketing/baseline.tsx", render: () => <AnnouncementBarBaseline /> },
  "marketing/announcement-bar/parti": { sourcePath: "src/arms/components/marketing/parti.tsx", render: () => <AnnouncementBarParti /> },
  "marketing/hero/baseline": { sourcePath: "src/arms/components/marketing/baseline.tsx", render: () => <HeroBaseline /> },
  "marketing/hero/parti": { sourcePath: "src/arms/components/marketing/parti.tsx", render: () => <HeroParti /> },
  "marketing/cta/baseline": { sourcePath: "src/arms/components/marketing/baseline.tsx", render: () => <CtaBaseline /> },
  "marketing/cta/parti": { sourcePath: "src/arms/components/marketing/parti.tsx", render: () => <CtaParti /> },
  "marketing/feature-grid/baseline": { sourcePath: "src/arms/components/marketing/baseline.tsx", render: () => <FeatureGridBaseline /> },
  "marketing/feature-grid/parti": { sourcePath: "src/arms/components/marketing/parti.tsx", render: () => <FeatureGridParti /> },
  "marketing/logo-cloud/baseline": { sourcePath: "src/arms/components/marketing/baseline.tsx", render: () => <LogoCloudBaseline /> },
  "marketing/logo-cloud/parti": { sourcePath: "src/arms/components/marketing/parti.tsx", render: () => <LogoCloudParti /> },
  "marketing/testimonial/baseline": { sourcePath: "src/arms/components/marketing/baseline.tsx", render: () => <TestimonialBaseline /> },
  "marketing/testimonial/parti": { sourcePath: "src/arms/components/marketing/parti.tsx", render: () => <TestimonialParti /> },
  "marketing/pricing/baseline": { sourcePath: "src/arms/components/marketing/baseline.tsx", render: () => <PricingBaseline /> },
  "marketing/pricing/parti": { sourcePath: "src/arms/components/marketing/parti.tsx", render: () => <PricingParti /> },
  "marketing/faq/baseline": { sourcePath: "src/arms/components/marketing/baseline.tsx", render: () => <FaqBaseline /> },
  "marketing/faq/parti": { sourcePath: "src/arms/components/marketing/parti.tsx", render: () => <FaqParti /> },
  "marketing/footer/baseline": { sourcePath: "src/arms/components/marketing/baseline.tsx", render: () => <FooterBaseline /> },
  "marketing/footer/parti": { sourcePath: "src/arms/components/marketing/parti.tsx", render: () => <FooterParti /> },
  /* ---- product ---- */
  "product/dashboard-header/baseline": { sourcePath: "src/arms/components/product/baseline.tsx", render: () => <DashboardHeaderBaseline /> },
  "product/dashboard-header/parti": { sourcePath: "src/arms/components/product/parti.tsx", render: () => <DashboardHeaderParti /> },
  "product/sidebar/baseline": { sourcePath: "src/arms/components/product/baseline.tsx", render: () => <SidebarBaseline /> },
  "product/sidebar/parti": { sourcePath: "src/arms/components/product/parti.tsx", render: () => <SidebarParti /> },
  "product/stat-cards/baseline": { sourcePath: "src/arms/components/product/baseline.tsx", render: () => <StatCardsBaseline /> },
  "product/stat-cards/parti": { sourcePath: "src/arms/components/product/parti.tsx", render: () => <StatCardsParti /> },
  "product/data-table/baseline": { sourcePath: "src/arms/components/product/baseline.tsx", render: () => <DataTableBaseline /> },
  "product/data-table/parti": { sourcePath: "src/arms/components/product/parti.tsx", render: () => <DataTableParti /> },
  "product/chart-panel/baseline": { sourcePath: "src/arms/components/product/baseline.tsx", render: () => <ChartPanelBaseline /> },
  "product/chart-panel/parti": { sourcePath: "src/arms/components/product/parti.tsx", render: () => <ChartPanelParti /> },
  "product/filter-bar/baseline": { sourcePath: "src/arms/components/product/baseline.tsx", render: () => <FilterBarBaseline /> },
  "product/filter-bar/parti": { sourcePath: "src/arms/components/product/parti.tsx", render: () => <FilterBarParti /> },
  "product/search/baseline": { sourcePath: "src/arms/components/product/baseline.tsx", render: () => <SearchBaseline /> },
  "product/search/parti": { sourcePath: "src/arms/components/product/parti.tsx", render: () => <SearchParti /> },
  "product/tabs/baseline": { sourcePath: "src/arms/components/product/baseline.tsx", render: () => <TabsBaseline /> },
  "product/tabs/parti": { sourcePath: "src/arms/components/product/parti.tsx", render: () => <TabsParti /> },
  "product/modal/baseline": { sourcePath: "src/arms/components/product/baseline.tsx", render: () => <ModalBaseline /> },
  "product/modal/parti": { sourcePath: "src/arms/components/product/parti.tsx", render: () => <ModalParti /> },
  "product/drawer/baseline": { sourcePath: "src/arms/components/product/baseline.tsx", render: () => <DrawerBaseline /> },
  "product/drawer/parti": { sourcePath: "src/arms/components/product/parti.tsx", render: () => <DrawerParti /> },
  "product/dropdown/baseline": { sourcePath: "src/arms/components/product/baseline.tsx", render: () => <DropdownBaseline /> },
  "product/dropdown/parti": { sourcePath: "src/arms/components/product/parti.tsx", render: () => <DropdownParti /> },
  "product/command-menu/baseline": { sourcePath: "src/arms/components/product/baseline.tsx", render: () => <CommandMenuBaseline /> },
  "product/command-menu/parti": { sourcePath: "src/arms/components/product/parti.tsx", render: () => <CommandMenuParti /> },
  "product/toast/baseline": { sourcePath: "src/arms/components/product/baseline.tsx", render: () => <ToastBaseline /> },
  "product/toast/parti": { sourcePath: "src/arms/components/product/parti.tsx", render: () => <ToastParti /> },
  "product/empty-state/baseline": { sourcePath: "src/arms/components/product/baseline.tsx", render: () => <EmptyStateBaseline /> },
  "product/empty-state/parti": { sourcePath: "src/arms/components/product/parti.tsx", render: () => <EmptyStateParti /> },
  "product/loading-state/baseline": { sourcePath: "src/arms/components/product/baseline.tsx", render: () => <LoadingStateBaseline /> },
  "product/loading-state/parti": { sourcePath: "src/arms/components/product/parti.tsx", render: () => <LoadingStateParti /> },
  "product/error-state/baseline": { sourcePath: "src/arms/components/product/baseline.tsx", render: () => <ErrorStateBaseline /> },
  "product/error-state/parti": { sourcePath: "src/arms/components/product/parti.tsx", render: () => <ErrorStateParti /> },
  /* ---- forms ---- */
  "forms/input/baseline": { sourcePath: "src/arms/components/forms/baseline.tsx", render: () => <InputBaseline /> },
  "forms/input/parti": { sourcePath: "src/arms/components/forms/parti.tsx", render: () => <InputParti /> },
  "forms/textarea/baseline": { sourcePath: "src/arms/components/forms/baseline.tsx", render: () => <TextareaBaseline /> },
  "forms/textarea/parti": { sourcePath: "src/arms/components/forms/parti.tsx", render: () => <TextareaParti /> },
  "forms/select/baseline": { sourcePath: "src/arms/components/forms/baseline.tsx", render: () => <SelectBaseline /> },
  "forms/select/parti": { sourcePath: "src/arms/components/forms/parti.tsx", render: () => <SelectParti /> },
  "forms/checkbox/baseline": { sourcePath: "src/arms/components/forms/baseline.tsx", render: () => <CheckboxBaseline /> },
  "forms/checkbox/parti": { sourcePath: "src/arms/components/forms/parti.tsx", render: () => <CheckboxParti /> },
  "forms/radio/baseline": { sourcePath: "src/arms/components/forms/baseline.tsx", render: () => <RadioBaseline /> },
  "forms/radio/parti": { sourcePath: "src/arms/components/forms/parti.tsx", render: () => <RadioParti /> },
  "forms/switch/baseline": { sourcePath: "src/arms/components/forms/baseline.tsx", render: () => <SwitchBaseline /> },
  "forms/switch/parti": { sourcePath: "src/arms/components/forms/parti.tsx", render: () => <SwitchParti /> },
  "forms/date-picker/baseline": { sourcePath: "src/arms/components/forms/baseline.tsx", render: () => <DatePickerBaseline /> },
  "forms/date-picker/parti": { sourcePath: "src/arms/components/forms/parti.tsx", render: () => <DatePickerParti /> },
  "forms/form-section/baseline": { sourcePath: "src/arms/components/forms/baseline.tsx", render: () => <FormSectionBaseline /> },
  "forms/form-section/parti": { sourcePath: "src/arms/components/forms/parti.tsx", render: () => <FormSectionParti /> },
  /* ---- content ---- */
  "content/article-header/baseline": { sourcePath: "src/arms/components/content/baseline.tsx", render: () => <ArticleHeaderBaseline /> },
  "content/article-header/parti": { sourcePath: "src/arms/components/content/parti.tsx", render: () => <ArticleHeaderParti /> },
  "content/docs-nav/baseline": { sourcePath: "src/arms/components/content/baseline.tsx", render: () => <DocsNavBaseline /> },
  "content/docs-nav/parti": { sourcePath: "src/arms/components/content/parti.tsx", render: () => <DocsNavParti /> },
  "content/code-block/baseline": { sourcePath: "src/arms/components/content/baseline.tsx", render: () => <CodeBlockBaseline /> },
  "content/code-block/parti": { sourcePath: "src/arms/components/content/parti.tsx", render: () => <CodeBlockParti /> },
  "content/timeline/baseline": { sourcePath: "src/arms/components/content/baseline.tsx", render: () => <TimelineBaseline /> },
  "content/timeline/parti": { sourcePath: "src/arms/components/content/parti.tsx", render: () => <TimelineParti /> },
  "content/comparison-table/baseline": { sourcePath: "src/arms/components/content/baseline.tsx", render: () => <ComparisonTableBaseline /> },
  "content/comparison-table/parti": { sourcePath: "src/arms/components/content/parti.tsx", render: () => <ComparisonTableParti /> },
  "content/metadata/baseline": { sourcePath: "src/arms/components/content/baseline.tsx", render: () => <MetadataBaseline /> },
  "content/metadata/parti": { sourcePath: "src/arms/components/content/parti.tsx", render: () => <MetadataParti /> },
  "content/breadcrumbs/baseline": { sourcePath: "src/arms/components/content/baseline.tsx", render: () => <BreadcrumbsBaseline /> },
  "content/breadcrumbs/parti": { sourcePath: "src/arms/components/content/parti.tsx", render: () => <BreadcrumbsParti /> },
  /* ---- full-screen examples ---- */
  "example/finance-research-platform/baseline": { sourcePath: "src/arms/finance-research-platform/baseline.tsx", bleed: true, render: () => <LedgerlineBaseline /> },
  "example/finance-research-platform/parti": { sourcePath: "src/arms/finance-research-platform/parti.tsx", bleed: true, render: () => <LedgerlineParti /> },
  "example/agent-platform-landing/baseline": { sourcePath: "src/arms/agent-platform-landing/baseline.tsx", bleed: true, render: () => <CadenceBaseline /> },
  "example/agent-platform-landing/parti": { sourcePath: "src/arms/agent-platform-landing/parti.tsx", bleed: true, render: () => <CadenceParti /> },
  "example/campaign-analytics/baseline": { sourcePath: "src/arms/campaign-analytics/baseline.tsx", bleed: true, render: () => <NorthboundBaseline /> },
  "example/campaign-analytics/parti": { sourcePath: "src/arms/campaign-analytics/parti.tsx", bleed: true, render: () => <NorthboundParti /> },
  "example/infrastructure-docs/baseline": { sourcePath: "src/arms/infrastructure-docs/baseline.tsx", bleed: true, render: () => <RelayDocsBaseline /> },
  "example/infrastructure-docs/parti": { sourcePath: "src/arms/infrastructure-docs/parti.tsx", bleed: true, render: () => <RelayDocsParti /> },
  "example/product-page/baseline": { sourcePath: "src/arms/product-page/baseline.tsx", bleed: true, render: () => <KestrelBaseline /> },
  "example/product-page/parti": { sourcePath: "src/arms/product-page/parti.tsx", bleed: true, render: () => <KestrelParti /> },
};

export function entry(key: string): RegistryEntry {
  const e = REGISTRY[key];
  if (!e) throw new Error(`No registry entry for "${key}". Registry keys are the contract between the data files and the arms; a miss here is a data bug, not a missing feature.`);
  return e;
}

export function armKey(kind: "example" | string, slug: string, arm: "baseline" | "parti") {
  return `${kind}/${slug}/${arm}`;
}

