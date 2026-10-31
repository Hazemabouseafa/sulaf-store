import { NextRequest, NextResponse } from "next/server";
import { readJsonFile, writeJsonFile } from "@/lib/db/json-db";
import { ProductData } from "@/lib/data/mock-data";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const products = readJsonFile<ProductData[]>("products.json", []);
    const product = products.find((p) => p.id === id || p.slug === id);

    if (!product) {
      return NextResponse.json({ success: false, error: "المستحضر غير موجود." }, { status: 404 });
    }

    return NextResponse.json({ success: true, product });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const products = readJsonFile<ProductData[]>("products.json", []);
    const index = products.findIndex((p) => p.id === id || p.slug === id);

    if (index === -1) {
      return NextResponse.json({ success: false, error: "المستحضر غير موجود." }, { status: 404 });
    }

    const updatedImages =
      body.images && body.images.length > 0
        ? body.images
        : body.imageUrl
          ? [{ url: body.imageUrl, alt: body.nameAr || products[index].nameAr, isPrimary: true }]
          : products[index].images;

    const nextPrice = body.price !== undefined ? Number(body.price) : products[index].price;
    const nextStock = body.stock !== undefined ? Number(body.stock) : products[index].stock;
    const nextCompareAtPrice =
      body.compareAtPrice !== undefined ? Number(body.compareAtPrice) : products[index].compareAtPrice;
    const nextSku = body.sku !== undefined ? body.sku : products[index].sku;

    const existingVariants =
      Array.isArray(body.variants) && body.variants.length > 0
        ? [...body.variants]
        : Array.isArray(products[index].variants) && products[index].variants.length > 0
        ? products[index].variants.map((v) => ({ ...v }))
        : [
            {
              id: `var-${products[index].id}`,
              titleAr: "العبوة الأساسية (200 مل)",
              titleEn: "Standard Jar 200ml",
              sku: nextSku || "SLF-001",
              price: nextPrice,
              stock: nextStock,
              volumeMl: 200,
            },
          ];

    if (!body.variants && existingVariants[0]) {
      if (body.price !== undefined) existingVariants[0].price = nextPrice;
      if (body.stock !== undefined) existingVariants[0].stock = nextStock;
      if (body.sku !== undefined) existingVariants[0].sku = nextSku;
    }

    products[index] = {
      ...products[index],
      ...body,
      images: updatedImages,
      variants: existingVariants,
      price: nextPrice,
      stock: nextStock,
      compareAtPrice: nextCompareAtPrice,
      sku: nextSku,
    };

    if (body.isFeatured !== undefined) {
      if (body.isFeatured) {
        products.forEach((p, i) => {
          p.isFeatured = (i === index);
        });
        try {
          const settings = readJsonFile<any>("store-settings.json", {});
          settings.featuredProductId = products[index].id;
          writeJsonFile("store-settings.json", settings);
        } catch {}
      } else {
        products[index].isFeatured = false;
      }
    }

    writeJsonFile("products.json", products);
    return NextResponse.json({
      success: true,
      message: "تم تحديث المستحضر بنجاح.",
      product: products[index],
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const products = readJsonFile<ProductData[]>("products.json", []);
    const filtered = products.filter((p) => p.id !== id && p.slug !== id);

    if (filtered.length === products.length) {
      return NextResponse.json({ success: false, error: "المستحضر غير موجود." }, { status: 404 });
    }

    writeJsonFile("products.json", filtered);
    return NextResponse.json({ success: true, message: "تم حذف المستحضر بنجاح." });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
