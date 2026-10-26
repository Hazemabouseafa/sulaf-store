"use client";

import React from "react";
import { useStoreSettings } from "@/lib/settings/store-settings-context";
import { DEFAULT_HOMEPAGE_SECTIONS_ORDER, HomepageSectionKey } from "@/lib/settings/store-settings";
import dynamic from "next/dynamic";
import { HeroSection } from "@/components/home/HeroSection";
import { HorizontalGallerySection } from "@/components/home/HorizontalGallerySection";
import { CustomSectionRenderer } from "@/components/home/CustomSectionRenderer";

const HomeAboutSection = dynamic(
  () => import("@/components/home/HomeAboutSection").then((mod) => mod.HomeAboutSection),
  { loading: () => <div className="min-h-[200px]" /> }
);
const CosmeceuticalsArtSection = dynamic(
  () => import("@/components/home/CosmeceuticalsArtSection").then((mod) => mod.CosmeceuticalsArtSection),
  { loading: () => <div className="min-h-[200px]" /> }
);
const ClinicalStorySection = dynamic(
  () => import("@/components/home/ClinicalStorySection").then((mod) => mod.ClinicalStorySection),
  { loading: () => <div className="min-h-[200px]" /> }
);
const DoctorReviewsSection = dynamic(
  () => import("@/components/home/DoctorReviewsSection").then((mod) => mod.DoctorReviewsSection),
  { loading: () => <div className="min-h-[200px]" /> }
);
const ConsultationBanner = dynamic(
  () => import("@/components/home/ConsultationBanner").then((mod) => mod.ConsultationBanner),
  { loading: () => <div className="min-h-[160px]" /> }
);

const SECTION_COMPONENTS: Record<HomepageSectionKey, React.ComponentType> = {
  heroSection: HeroSection,
  aboutSection: HomeAboutSection,
  artOfCosmeceuticals: CosmeceuticalsArtSection,
  gallerySection: HorizontalGallerySection,
  clinicalStorySection: ClinicalStorySection,
  reviewsSection: DoctorReviewsSection,
  consultationSection: ConsultationBanner,
};

export default function HomePage() {
  const { settings } = useStoreSettings();
  const vis = settings.sectionsVisibility || {
    heroSection: true,
    aboutSection: true,
    artOfCosmeceuticals: true,
    gallerySection: true,
    clinicalStorySection: true,
    reviewsSection: true,
    consultationSection: true,
  };

  const sectionsOrder = (settings.sectionsOrder && settings.sectionsOrder.length > 0)
    ? settings.sectionsOrder
    : DEFAULT_HOMEPAGE_SECTIONS_ORDER;

  return (
    <div className="flex flex-col w-full">
      {sectionsOrder.map((sectionKey) => {
        // 1. Built-in Section
        if (sectionKey in SECTION_COMPONENTS) {
          if (vis[sectionKey as HomepageSectionKey] === false) return null;
          const Component = SECTION_COMPONENTS[sectionKey as HomepageSectionKey];
          if (!Component) return null;
          return <Component key={sectionKey} />;
        }

        // 2. Custom Section added by client
        const customSection = (settings.customSections || []).find((s) => s.id === sectionKey);
        if (customSection) {
          if (customSection.isVisible === false) return null;
          return <CustomSectionRenderer key={customSection.id} section={customSection} />;
        }

        return null;
      })}
    </div>
  );
}
