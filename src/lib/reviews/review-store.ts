import { readJsonFile, writeJsonFile } from "@/lib/db/json-db";

export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface ReviewItem {
  id: string;
  productId?: string;
  productName?: string;
  authorName: string;
  authorRole?: string;
  rating: number; // 1 to 5
  title?: string;
  comment: string;
  status: ReviewStatus;
  isVerifiedPurchase: boolean;
  createdAt: string;
  approvedAt?: string;
}

export function getAllReviews(): ReviewItem[] {
  return readJsonFile<ReviewItem[]>("reviews.json", []);
}

export function saveAllReviews(reviews: ReviewItem[]): void {
  try {
    writeJsonFile("reviews.json", reviews);

    // Sync approved reviews count and average rating into products.json
    const products = readJsonFile<any[]>("products.json", []);
    if (Array.isArray(products) && products.length > 0) {
      const approved = reviews.filter((r) => r.status === "APPROVED");
      let changed = false;
      for (const prod of products) {
        const prodReviews = approved.filter(
          (r) => !r.productId || r.productId === prod.id || r.productId === prod.slug
        );
        const newCount = prodReviews.length;
        const newRating =
          newCount > 0
            ? Number(
                (
                  prodReviews.reduce((sum, r) => sum + (Number(r.rating) || 5), 0) /
                  newCount
                ).toFixed(1)
              )
            : 5;
        if (prod.reviewsCount !== newCount || prod.rating !== newRating) {
          prod.reviewsCount = newCount;
          prod.rating = newRating;
          changed = true;
        }
      }
      if (changed) {
        writeJsonFile("products.json", products);
      }
    }
  } catch (err) {
    console.error("Error writing reviews.json:", err);
  }
}

export function getApprovedReviews(productId?: string): ReviewItem[] {
  const all = getAllReviews();
  return all.filter((r) => {
    if (r.status !== "APPROVED") return false;
    if (productId && r.productId && r.productId !== productId) return false;
    return true;
  });
}

export function getPendingReviews(): ReviewItem[] {
  const all = getAllReviews();
  return all.filter((r) => r.status === "PENDING");
}

export function addCustomerReview(data: {
  productId?: string;
  productName?: string;
  authorName: string;
  rating: number;
  title?: string;
  comment: string;
  authorRole?: string;
}): ReviewItem {
  const all = getAllReviews();
  const newReview: ReviewItem = {
    id: `rev-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    productId: data.productId,
    productName: data.productName,
    authorName: data.authorName.trim(),
    authorRole: data.authorRole?.trim() || "عميل موثق",
    rating: Math.min(5, Math.max(1, Math.round(data.rating))),
    title: data.title?.trim() || "",
    comment: data.comment.trim(),
    status: "PENDING", // Always pending when submitted by customer
    isVerifiedPurchase: true,
    createdAt: new Date().toISOString(),
  };

  all.unshift(newReview);
  saveAllReviews(all);
  return newReview;
}

export function addAdminReview(data: {
  productId?: string;
  productName?: string;
  authorName: string;
  authorRole?: string;
  rating: number;
  title?: string;
  comment: string;
  isVerifiedPurchase?: boolean;
}): ReviewItem {
  const all = getAllReviews();
  const newReview: ReviewItem = {
    id: `rev-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    productId: data.productId,
    productName: data.productName,
    authorName: data.authorName.trim(),
    authorRole: data.authorRole?.trim() || "رأي موثق",
    rating: Math.min(5, Math.max(1, Math.round(data.rating))),
    title: data.title?.trim() || "",
    comment: data.comment.trim(),
    status: "APPROVED", // Pre-approved when added by admin
    isVerifiedPurchase: data.isVerifiedPurchase ?? true,
    createdAt: new Date().toISOString(),
    approvedAt: new Date().toISOString(),
  };

  all.unshift(newReview);
  saveAllReviews(all);
  return newReview;
}

export function updateReviewStatus(id: string, status: ReviewStatus): ReviewItem | null {
  const all = getAllReviews();
  const idx = all.findIndex((r) => r.id === id);
  if (idx === -1) return null;

  all[idx].status = status;
  if (status === "APPROVED") {
    all[idx].approvedAt = new Date().toISOString();
  }
  saveAllReviews(all);
  return all[idx];
}

export function updateReview(id: string, updates: Partial<ReviewItem>): ReviewItem | null {
  const all = getAllReviews();
  const idx = all.findIndex((r) => r.id === id);
  if (idx === -1) return null;

  all[idx] = { ...all[idx], ...updates };
  saveAllReviews(all);
  return all[idx];
}

export function deleteReview(id: string): boolean {
  const all = getAllReviews();
  const filtered = all.filter((r) => r.id !== id);
  if (filtered.length === all.length) return false;

  saveAllReviews(filtered);
  return true;
}
