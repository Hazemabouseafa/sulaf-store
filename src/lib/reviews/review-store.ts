import fs from "fs";
import path from "path";

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

const REVIEWS_FILE = path.join(process.cwd(), "data", "reviews.json");

function ensureFile() {
  const dir = path.dirname(REVIEWS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(REVIEWS_FILE)) {
    fs.writeFileSync(REVIEWS_FILE, "[]", "utf8");
  }
}

export function getAllReviews(): ReviewItem[] {
  try {
    ensureFile();
    const raw = fs.readFileSync(REVIEWS_FILE, "utf8");
    return JSON.parse(raw) as ReviewItem[];
  } catch (err) {
    console.error("Error reading reviews.json:", err);
    return [];
  }
}

export function saveAllReviews(reviews: ReviewItem[]): void {
  try {
    ensureFile();
    fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2), "utf8");

    // Sync approved reviews count and average rating into products.json
    const productsFile = path.join(process.cwd(), "data", "products.json");
    if (fs.existsSync(productsFile)) {
      const productsRaw = fs.readFileSync(productsFile, "utf8");
      const products = JSON.parse(productsRaw);
      if (Array.isArray(products)) {
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
          fs.writeFileSync(productsFile, JSON.stringify(products, null, 2), "utf8");
        }
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
