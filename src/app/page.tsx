"use client";

import React from "react";
import { motion } from "framer-motion";
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
    aboutSection: false,
    artOfCosmeceuticals: false,
    gallerySection: true,
    clinicalStorySection: false,
    reviewsSection: true,
    consultationSection: true,
  };

  const sectionsOrder = (settings.sectionsOrder && settings.sectionsOrder.length > 0)
    ? settings.sectionsOrder
    : DEFAULT_HOMEPAGE_SECTIONS_ORDER;

  return (
    <div className="flex flex-col w-full overflow-hidden">
      {sectionsOrder.map((sectionKey) => {
        // 1. Built-in Section
        if (sectionKey in SECTION_COMPONENTS) {
          if (vis[sectionKey as HomepageSectionKey] === false) return null;
          const Component = SECTION_COMPONENTS[sectionKey as HomepageSectionKey];
          if (!Component) return null;

          // Hero handles its own above-the-fold entrance animations
          if (sectionKey === "heroSection") {
            return (
              <div key={sectionKey} data-live-section="heroSection" data-section-name="قسم الهيرو الرئيسي" className="w-full">
                <Component />
              </div>
            );
          }

          const sectionLabels: Record<string, string> = {
            aboutSection: "قسم عن سُلاف والقصة",
            artOfCosmeceuticals: "قسم فن الـ Cosmeceuticals",
            gallerySection: "معرض المستحضرات والطقوس",
            clinicalStorySection: "قسم الأدلة السريرية والنتائج",
            reviewsSection: "آراء الأطباء وتجارب العملاء",
            consultationSection: "بنر الاستشارة الفورية عبر واتساب",
          };

          return (
            <motion.div
              key={sectionKey}
              data-live-section={sectionKey}
              data-section-name={sectionLabels[sectionKey] || sectionKey}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.05 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              <Component />
            </motion.div>
          );
        }

        // 2. Custom Section added by client
        const customSection = (settings.customSections || []).find((s) => s.id === sectionKey);
        if (customSection) {
          if (customSection.isVisible === false) return null;
          return (
            <motion.div
              key={customSection.id}
              data-live-section={customSection.id}
              data-section-name={customSection.titleAr || "قسم مخصص"}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.05 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              <CustomSectionRenderer section={customSection} />
            </motion.div>
          );
        }

        return null;
      })}
    </div>
  );
}
