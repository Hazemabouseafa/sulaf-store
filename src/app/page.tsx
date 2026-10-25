"use client";

import React from "react";
import { useStoreSettings } from "@/lib/settings/store-settings-context";
import { DEFAULT_HOMEPAGE_SECTIONS_ORDER, HomepageSectionKey } from "@/lib/settings/store-settings";
import { HeroSection } from "@/components/home/HeroSection";
import { HomeAboutSection } from "@/components/home/HomeAboutSection";
import { CosmeceuticalsArtSection } from "@/components/home/CosmeceuticalsArtSection";
import { HorizontalGallerySection } from "@/components/home/HorizontalGallerySection";
import { ClinicalStorySection } from "@/components/home/ClinicalStorySection";
import { DoctorReviewsSection } from "@/components/home/DoctorReviewsSection";
import { ConsultationBanner } from "@/components/home/ConsultationBanner";

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
        if (vis[sectionKey] === false) return null;
        const Component = SECTION_COMPONENTS[sectionKey];
        if (!Component) return null;
        return <Component key={sectionKey} />;
      })}
    </div>
  );
}
