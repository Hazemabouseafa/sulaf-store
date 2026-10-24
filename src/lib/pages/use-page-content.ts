"use client";

import { useEffect, useState } from "react";

export interface StorePageContent {
  id: string;
  slug: string;
  route: string;
  type: "builtin" | "custom";
  titleAr: string;
  titleEn: string;
  subtitleAr?: string;
  subtitleEn?: string;
  contentAr?: string;
  contentEn?: string;
  published: boolean;
  updatedAt: string;
}

export function usePageContent(slug: string) {
  const [page, setPage] = useState<StorePageContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const res = await fetch("/api/pages", { cache: "no-store" });
        if (res.ok) {
          const d = await res.json();
          const found = (d.pages || []).find((p: StorePageContent) => p.slug === slug);
          if (isMounted && found) {
            setPage(found);
          }
        }
      } catch (e) {
        console.warn("Failed to load page content for slug:", slug, e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  return { page, loading };
}
