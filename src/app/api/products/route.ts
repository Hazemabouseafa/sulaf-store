import { NextRequest, NextResponse } from "next/server";
import { readJsonFile, writeJsonFile } from "@/lib/db/json-db";
import { ProductData } from "@/lib/data/mock-data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = readJsonFile<ProductData[]>("products.json", []);
    return NextResponse.json({ success: true, count: products.length, products });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || !body.nameAr || !body.price) {
      return NextResponse.json(
        { success: false, error: "يرجى إدخال اسم المستحضر وسعره." },
        { status: 400 }
      );
    }

    const products = readJsonFile<ProductData[]>("products.json", []);
    const id = body.id || `prod-${Date.now()}`;
    const newProduct: ProductData = {
      ...body,
      id,
      slug: body.slug || (body.nameEn ? body.nameEn.toLowerCase().replace(/\s+/g, "-") : id),
      price: Number(body.price),
      compareAtPrice: Number(body.compareAtPrice) || 0,
      stock: Number(body.stock) || 0,
      rating: body.rating || 5.0,
      reviewsCount: body.reviewsCount || 1,
      accentColor: body.accentColor || "#3d502d",
      images: body.images?.length > 0 ? body.images : [
        {
          url: body.imageUrl || "/brand/sulaf-flower-symbol.png",
          alt: body.nameAr,
          isPrimary: true,
        },
      ],
      variants: body.variants?.length > 0 ? body.variants : [
        {
          id: `var-${id}`,
          titleAr: "العبوة الأساسية (200 مل)",
          titleEn: "Standard Jar 200ml",
          sku: body.sku || `SLF-${Math.floor(100 + Math.random() * 900)}`,
          price: Number(body.price),
          stock: Number(body.stock) || 0,
          volumeMl: 200,
        },
      ],
      activeIngredients: body.activeIngredients || [],
      reviews: body.reviews || [],
      routineStepsAr: body.routineStepsAr || ["تطبيق المستحضر مرتين يومياً على بشرة نظيفة."],
      skinTypeAr: body.skinTypeAr || "لكافة أنواع البشرة",
      concernsAr: body.concernsAr || ["العناية والترميم"],
    };

    products.unshift(newProduct);
    writeJsonFile("products.json", products);

    return NextResponse.json({
      success: true,
      message: "تمت إضافة المستحضر بنجاح.",
      product: newProduct,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// Quick bulk updates (e.g., adjust stock delta)
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, stockDelta, price, stock } = body;
    const products = readJsonFile<ProductData[]>("products.json", []);
    const index = products.findIndex((p) => p.id === id);

    if (index === -1) {
      return NextResponse.json({ success: false, error: "المستحضر غير موجود." }, { status: 404 });
    }

    if (typeof stockDelta === "number") {
      products[index].stock = Math.max(0, products[index].stock + stockDelta);
      if (products[index].variants?.[0]) {
        products[index].variants[0].stock = products[index].stock;
      }
    }

    if (typeof stock === "number") {
      products[index].stock = Math.max(0, stock);
      if (products[index].variants?.[0]) {
        products[index].variants[0].stock = products[index].stock;
      }
    }

    if (typeof price === "number") {
      products[index].price = price;
      if (products[index].variants?.[0]) {
        products[index].variants[0].price = price;
      }
    }

    writeJsonFile("products.json", products);
    return NextResponse.json({
      success: true,
      message: "تم تحديث المستحضر فورياً.",
      product: products[index],
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
