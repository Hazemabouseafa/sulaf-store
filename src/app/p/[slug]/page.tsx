import React from "react";
import fs from "fs";
import path from "path";
import CustomPageClient, { StorePage } from "./CustomPageClient";

interface PageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

function getPageFromDatabase(slug: string): StorePage | null {
  try {
    const pagesFile = path.join(process.cwd(), "data", "pages.json");
    if (!fs.existsSync(pagesFile)) return null;
    const raw = fs.readFileSync(pagesFile, "utf-8");
    const pages: StorePage[] = JSON.parse(raw);
    return pages.find((p) => p.slug === slug) || null;
  } catch (err) {
    console.error("Error reading page from database:", err);
    return null;
  }
}

export default async function CustomStorePage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || "";
  const initialPage = getPageFromDatabase(slug);

  return <CustomPageClient slug={slug} initialPage={initialPage} />;
}
