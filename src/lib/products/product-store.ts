"use client";

import { useState, useEffect } from "react";
import { MOCK_PRODUCTS, ProductData } from "../data/mock-data";

const STORAGE_KEY = "sulaf_products_catalog_v3";

export function getStoredProducts(): ProductData[] {
  if (typeof window === "undefined") {
    return MOCK_PRODUCTS;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_PRODUCTS));
      syncProductsFromServer();
      return MOCK_PRODUCTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : MOCK_PRODUCTS;
  } catch (err) {
    console.error("Failed to load products from storage:", err);
    return MOCK_PRODUCTS;
  }
}

export async function syncProductsFromServer(): Promise<ProductData[]> {
  try {
    const res = await fetch("/api/products", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data.products && Array.isArray(data.products) && data.products.length > 0) {
        saveProducts(data.products);
        return data.products;
      }
    }
  } catch (err) {
    console.warn("Product sync failed, using cached:", err);
  }
  return getStoredProducts();
}

export function saveProducts(products: ProductData[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    window.dispatchEvent(new Event("sulaf_products_updated"));
  } catch (err) {
    console.error("Failed to save products to storage:", err);
  }
}

/**
 * Reactive hook for Storefront components:
 * Hydrates cleanly with MOCK_PRODUCTS (zero SSR mismatch) and syncs live from /api/products.
 */
export function useProducts(): ProductData[] {
  const [products, setProducts] = useState<ProductData[]>(MOCK_PRODUCTS);

  useEffect(() => {
    setProducts(getStoredProducts());
    syncProductsFromServer().then((fresh) => {
      if (fresh && fresh.length > 0) {
        setProducts(fresh);
      }
    });

    const handleUpdate = () => {
      setProducts(getStoredProducts());
    };

    window.addEventListener("sulaf_products_updated", handleUpdate);
    return () => window.removeEventListener("sulaf_products_updated", handleUpdate);
  }, []);

  return products;
}

export async function addProductApi(product: Omit<ProductData, "id"> & { id?: string }): Promise<ProductData> {
  const res = await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  const data = await res.json();
  if (data.product) {
    const current = getStoredProducts();
    saveProducts([data.product, ...current]);
    return data.product;
  }
  throw new Error(data.error || "فشل إضافة المنتج.");
}

export async function updateProductApi(id: string, updates: Partial<ProductData>): Promise<ProductData> {
  const res = await fetch(`/api/products/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  const data = await res.json();
  if (data.product) {
    const current = getStoredProducts();
    const index = current.findIndex((p) => p.id === id);
    if (index !== -1) {
      current[index] = data.product;
      saveProducts([...current]);
    }
    return data.product;
  }
  throw new Error(data.error || "فشل تحديث المنتج.");
}

export async function quickStockDeltaApi(id: string, stockDelta: number): Promise<ProductData> {
  const res = await fetch("/api/products", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, stockDelta }),
  });
  const data = await res.json();
  if (data.product) {
    const current = getStoredProducts();
    const index = current.findIndex((p) => p.id === id);
    if (index !== -1) {
      current[index] = data.product;
      saveProducts([...current]);
    }
    return data.product;
  }
  throw new Error(data.error || "فشل تحديث المخزون.");
}

export async function deleteProductApi(id: string): Promise<boolean> {
  const res = await fetch(`/api/products/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  if (res.ok) {
    const current = getStoredProducts();
    saveProducts(current.filter((p) => p.id !== id));
    return true;
  }
  return false;
}

// Synchronous bridges
export function addProduct(product: Omit<ProductData, "id"> & { id?: string }): ProductData {
  const current = getStoredProducts();
  const id = product.id || `prod-${Date.now()}`;
  const newProduct: ProductData = {
    ...product,
    id,
    slug: product.slug || id,
    images: product.images?.length > 0 ? product.images : [
      {
        url: "/brand/sulaf-flower-symbol.png",
        alt: product.nameAr,
        isPrimary: true,
      },
    ],
    variants: product.variants?.length > 0 ? product.variants : [
      {
        id: `var-${id}`,
        titleAr: "العبوة الأساسية",
        titleEn: "Standard Bottle",
        sku: product.sku || `SLF-${Date.now()}`,
        price: product.price,
        stock: product.stock,
        volumeMl: 200,
      },
    ],
    activeIngredients: product.activeIngredients || [],
    reviews: product.reviews || [],
    rating: product.rating || 5.0,
    reviewsCount: product.reviewsCount || 0,
    accentColor: product.accentColor || "#485c36",
    routineStepsAr: product.routineStepsAr || ["تطبيق المستحضر بلطف على بشرة نظيفة."],
    usageInstructionsAr: product.usageInstructionsAr || "يُوضع مرتين يومياً على بشرة نظيفة وجافة.",
    clinicalResultsAr: product.clinicalResultsAr || "نتائج ملحوظة في استعادة ملمس الحرير خلال 7 أيام.",
    skinTypeAr: product.skinTypeAr || "لكافة أنواع البشرة",
    concernsAr: product.concernsAr || ["العناية والترميم"],
  };

  const updated = [newProduct, ...current];
  saveProducts(updated);
  addProductApi(product).catch(() => {});
  return newProduct;
}

export function updateProduct(id: string, updates: Partial<ProductData>): ProductData | null {
  const current = getStoredProducts();
  const index = current.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const updatedProduct = {
    ...current[index],
    ...updates,
  };

  current[index] = updatedProduct;
  saveProducts(current);
  updateProductApi(id, updates).catch(() => {});
  return updatedProduct;
}

export function deleteProduct(id: string): boolean {
  const current = getStoredProducts();
  const filtered = current.filter((p) => p.id !== id);
  if (filtered.length === current.length) return false;

  saveProducts(filtered);
  deleteProductApi(id).catch(() => {});
  return true;
}

export function resetProducts(): void {
  if (typeof window === "undefined") return;
  saveProducts(MOCK_PRODUCTS);
}
