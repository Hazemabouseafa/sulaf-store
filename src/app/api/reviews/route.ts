import { NextRequest, NextResponse } from "next/server";
import {
  getAllReviews,
  getApprovedReviews,
  addCustomerReview,
  addAdminReview,
} from "@/lib/reviews/review-store";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const productId = searchParams.get("productId") || undefined;

    let reviews;
    if (status === "APPROVED") {
      reviews = getApprovedReviews(productId);
    } else {
      reviews = getAllReviews();
      if (productId) {
        reviews = reviews.filter((r) => r.productId === productId);
      }
    }

    return NextResponse.json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body || !body.authorName || !body.comment) {
      return NextResponse.json(
        { success: false, error: "يرجى كتابة اسمك وتفاصيل رأيك / التقييم." },
        { status: 400 }
      );
    }

    const rating = Number(body.rating) || 5;

    // Check if added by Admin
    if (body.isAdmin) {
      const adminReview = addAdminReview({
        productId: body.productId,
        productName: body.productName,
        authorName: body.authorName,
        authorRole: body.authorRole || "رأي موثق",
        rating,
        title: body.title,
        comment: body.comment,
        isVerifiedPurchase: body.isVerifiedPurchase ?? true,
      });

      return NextResponse.json({
        success: true,
        message: "تمت إضافة الرأي واعتماده بنجاح ✓",
        review: adminReview,
      });
    }

    // Customer Submission (PENDING)
    const newReview = addCustomerReview({
      productId: body.productId,
      productName: body.productName,
      authorName: body.authorName,
      rating,
      title: body.title,
      comment: body.comment,
      authorRole: body.authorRole || "عميل موثق",
    });

    return NextResponse.json({
      success: true,
      message: "شكراً لتقييمك! تم إرسال رأيك بنجاح وهو قيد المراجعة من الإدارة قبل النشر ✓",
      review: newReview,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to submit review" },
      { status: 500 }
    );
  }
}
