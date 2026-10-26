import { NextRequest, NextResponse } from "next/server";
import {
  updateReviewStatus,
  updateReview,
  deleteReview,
} from "@/lib/reviews/review-store";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, error: "معرّف التقييم مفقود" }, { status: 400 });
    }

    let updated = null;
    if (body.status) {
      updated = updateReviewStatus(id, body.status);
    }

    if (body.authorName || body.comment || body.rating || body.authorRole || body.title) {
      updated = updateReview(id, body);
    }

    if (!updated) {
      return NextResponse.json({ success: false, error: "التقييم غير موجود" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: body.status === "APPROVED" ? "تم اعتماد التقييم ونشره بالمتجر بنجاح ✓" : "تم تحديث التقييم بنجاح ✓",
      review: updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update review" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, error: "معرّف التقييم مفقود" }, { status: 400 });
    }

    const ok = deleteReview(id);
    if (!ok) {
      return NextResponse.json({ success: false, error: "التقييم غير موجود" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "تم حذف التقييم بنجاح ✓",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to delete review" },
      { status: 500 }
    );
  }
}
