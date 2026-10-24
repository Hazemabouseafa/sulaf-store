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

    products[index] = {
      ...products[index],
      ...body,
      price: body.price !== undefined ? Number(body.price) : products[index].price,
      stock: body.stock !== undefined ? Number(body.stock) : products[index].stock,
      compareAtPrice: body.compareAtPrice !== undefined ? Number(body.compareAtPrice) : products[index].compareAtPrice,
    };

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
