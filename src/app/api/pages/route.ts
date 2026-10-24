import { NextRequest, NextResponse } from "next/server";
import { readJsonFile, writeJsonFile } from "@/lib/db/json-db";

export const dynamic = "force-dynamic";

export interface StorePageRecord {
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

export async function GET() {
  try {
    const pages = readJsonFile<StorePageRecord[]>("pages.json", []);
    return NextResponse.json({ success: true, pages });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;
    let pages = readJsonFile<StorePageRecord[]>("pages.json", []);

    if (action === "save_page") {
      const { page } = body;
      if (!page || !page.titleAr) {
        return NextResponse.json({ success: false, error: "يرجى إدخال عنوان الصفحة." }, { status: 400 });
      }

      const rawSlug = (page.slug || page.titleEn || page.titleAr)
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\u0621-\u064A]+/g, "-")
        .replace(/^-+|-+$/g, "");

      const cleanSlug = rawSlug || "page-" + Date.now();
      const route = page.type === "builtin" ? page.route : `/p/${cleanSlug}`;

      if (page.id) {
        // Update existing
        const idx = pages.findIndex((p) => p.id === page.id);
        if (idx !== -1) {
          pages[idx] = {
            ...pages[idx],
            ...page,
            slug: cleanSlug,
            route,
            updatedAt: new Date().toISOString().split("T")[0],
          };
        } else {
          pages.unshift({
            ...page,
            id: page.id,
            slug: cleanSlug,
            route,
            updatedAt: new Date().toISOString().split("T")[0],
          });
        }
      } else {
        // Create new
        const newPage: StorePageRecord = {
          id: "page-" + Date.now(),
          slug: cleanSlug,
          route,
          type: "custom",
          titleAr: page.titleAr.trim(),
          titleEn: page.titleEn?.trim() || page.titleAr.trim(),
          subtitleAr: page.subtitleAr?.trim() || "",
          subtitleEn: page.subtitleEn?.trim() || "",
          contentAr: page.contentAr || "",
          contentEn: page.contentEn || page.contentAr || "",
          published: page.published ?? true,
          updatedAt: new Date().toISOString().split("T")[0],
        };
        pages.unshift(newPage);
      }

      writeJsonFile("pages.json", pages);
      return NextResponse.json({ success: true, message: "تم حفظ الصفحة بنجاح ✓", pages });
    }

    if (action === "toggle_published") {
      const { id, slug } = body;
      pages = pages.map((p) => {
        if ((id && p.id === id) || (slug && p.slug === slug)) {
          return { ...p, published: !p.published, updatedAt: new Date().toISOString().split("T")[0] };
        }
        return p;
      });
      writeJsonFile("pages.json", pages);
      const updatedPage = pages.find((p) => (id && p.id === id) || (slug && p.slug === slug));
      return NextResponse.json({ success: true, page: updatedPage, pages });
    }

    if (action === "delete_page") {
      const { id, slug } = body;
      const target = pages.find((p) => (id && p.id === id) || (slug && p.slug === slug));
      if (target?.type === "builtin") {
        return NextResponse.json({ success: false, error: "لا يمكن حذف الصفحات الأساسية للنظام." }, { status: 400 });
      }
      pages = pages.filter((p) => !((id && p.id === id) || (slug && p.slug === slug)));
      writeJsonFile("pages.json", pages);
      return NextResponse.json({ success: true, message: "تم حذف الصفحة بنجاح ✓", pages });
    }

    return NextResponse.json({ success: false, error: "إجراء غير معروف" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
