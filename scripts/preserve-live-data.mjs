/**
 * Sulaf Store - Pre-Build Live Data Preservation Script for Coolify / Docker
 *
 * When deploying a new version on Coolify, `docker build` runs while the previous
 * production container is STILL online and serving the live website.
 *
 * This script automatically fetches the latest live JSON data (products, settings,
 * orders, coupons, pages, reviews, customers) AND uploaded images from the running
 * production site before the container is replaced, saving them into `data/` and `data-seed/`.
 *
 * It NEVER deletes or overwrites local data with empty data.
 */

import fs from "fs";
import path from "path";

const cwd = process.cwd();
const dataDir = path.join(cwd, "data");
const seedDir = path.join(cwd, "data-seed");
const uploadsDataDir = path.join(dataDir, "uploads");
const uploadsSeedDir = path.join(seedDir, "uploads");
const uploadsPublicDir = path.join(cwd, "public", "uploads");

for (const dir of [dataDir, seedDir, uploadsDataDir, uploadsSeedDir, uploadsPublicDir]) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Copy current `data/` into `data-seed/` first as a baseline
 */
function copyBaselineToSeed() {
  if (!fs.existsSync(dataDir)) return;
  const entries = fs.readdirSync(dataDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(dataDir, entry.name);
    const destPath = path.join(seedDir, entry.name);
    if (entry.isFile() && entry.name.endsWith(".json")) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
  if (fs.existsSync(uploadsDataDir)) {
    for (const f of fs.readdirSync(uploadsDataDir)) {
      const s = path.join(uploadsDataDir, f);
      if (fs.statSync(s).isFile()) {
        fs.copyFileSync(s, path.join(uploadsSeedDir, f));
      }
    }
  }
}

function getCandidateLiveUrls() {
  const rawCandidates = [
    process.env.LIVE_SITE_URL,
    process.env.COOLIFY_URL,
    process.env.COOLIFY_FQDN,
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.NEXT_PUBLIC_APP_URL,
  ].filter(Boolean);

  const urls = new Set();
  for (const raw of rawCandidates) {
    for (const part of String(raw).split(",")) {
      const trimmed = part.trim().replace(/\/+$/, "");
      if (!trimmed) continue;
      if (
        trimmed.includes("localhost") ||
        trimmed.includes("127.0.0.1") ||
        trimmed.includes("sulaf.com") // default placeholder in layout.tsx unless actually live
      ) {
        // Still allow if explicitly set via COOLIFY_URL / LIVE_SITE_URL
        if (raw !== process.env.COOLIFY_URL && raw !== process.env.LIVE_SITE_URL && raw !== process.env.COOLIFY_FQDN) {
          continue;
        }
      }
      if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
        urls.add(trimmed);
      } else {
        urls.add(`https://${trimmed}`);
        urls.add(`http://${trimmed}`);
      }
    }
  }
  return Array.from(urls);
}

async function fetchJsonWithTimeout(url, timeoutMs = 6000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json", "Cache-Control": "no-cache" },
      signal: controller.signal,
    });
    clearTimeout(id);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    clearTimeout(id);
    return null;
  }
}

async function downloadUploadFile(baseUrl, uploadPath) {
  const cleanName = path.basename(uploadPath.split("?")[0]);
  if (!cleanName || cleanName === ".gitkeep") return;

  const urlsToTry = [
    `${baseUrl}/api/uploads/${encodeURIComponent(cleanName)}`,
    `${baseUrl}/uploads/${encodeURIComponent(cleanName)}`,
  ];

  for (const fileUrl of urlsToTry) {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 8000);
      const res = await fetch(fileUrl, { signal: controller.signal });
      clearTimeout(id);
      if (res.ok) {
        const arrayBuffer = await res.arrayBuffer();
        const buf = Buffer.from(arrayBuffer);
        if (buf.length > 0) {
          fs.writeFileSync(path.join(uploadsDataDir, cleanName), buf);
          fs.writeFileSync(path.join(uploadsSeedDir, cleanName), buf);
          fs.writeFileSync(path.join(uploadsPublicDir, cleanName), buf);
          console.log(`[PreserveLiveData] Downloaded uploaded media: ${cleanName} (${buf.length} bytes)`);
          return;
        }
      }
    } catch {}
  }
}

function extractUploadPaths(obj, found = new Set()) {
  if (!obj) return found;
  if (typeof obj === "string") {
    const matches = obj.match(/(?:\/api\/uploads\/|\/uploads\/)([^\s"'?]+)/g);
    if (matches) {
      for (const m of matches) found.add(m);
    }
    return found;
  }
  if (Array.isArray(obj)) {
    for (const item of obj) extractUploadPaths(item, found);
    return found;
  }
  if (typeof obj === "object") {
    for (const val of Object.values(obj)) extractUploadPaths(val, found);
  }
  return found;
}

function saveBoth(filename, data) {
  const content = JSON.stringify(data, null, 2);
  fs.writeFileSync(path.join(dataDir, filename), content, "utf-8");
  fs.writeFileSync(path.join(seedDir, filename), content, "utf-8");
}

async function main() {
  copyBaselineToSeed();

  const candidateUrls = getCandidateLiveUrls();
  if (candidateUrls.length === 0) {
    console.log("[PreserveLiveData] No external Coolify/live URL detected in build env. Baseline data-seed prepared.");
    return;
  }

  for (const baseUrl of candidateUrls) {
    console.log(`[PreserveLiveData] Checking running live instance at ${baseUrl} ...`);
    const productsRes = await fetchJsonWithTimeout(`${baseUrl}/api/products`);
    if (!productsRes || !Array.isArray(productsRes.products)) {
      continue;
    }

    console.log(`[PreserveLiveData] Connected to live instance at ${baseUrl}! Syncing live store data...`);
    const uploadRefs = new Set();

    // 1. Products
    if (productsRes.products.length > 0) {
      saveBoth("products.json", productsRes.products);
      extractUploadPaths(productsRes.products, uploadRefs);
      console.log(`[PreserveLiveData] Preserved ${productsRes.products.length} live products.`);
    }

    // 2. Settings
    const settingsRes = await fetchJsonWithTimeout(`${baseUrl}/api/settings`);
    if (settingsRes && settingsRes.settings && typeof settingsRes.settings === "object") {
      saveBoth("store-settings.json", settingsRes.settings);
      extractUploadPaths(settingsRes.settings, uploadRefs);
      console.log(`[PreserveLiveData] Preserved live store-settings.json.`);
    }

    // 3. Orders
    const ordersRes = await fetchJsonWithTimeout(`${baseUrl}/api/orders`);
    if (ordersRes && Array.isArray(ordersRes.orders) && ordersRes.orders.length > 0) {
      saveBoth("orders.json", ordersRes.orders);
      extractUploadPaths(ordersRes.orders, uploadRefs);
      console.log(`[PreserveLiveData] Preserved ${ordersRes.orders.length} live orders.`);
    }

    // 4. Coupons
    const couponsRes = await fetchJsonWithTimeout(`${baseUrl}/api/coupons`);
    if (couponsRes && Array.isArray(couponsRes.coupons) && couponsRes.coupons.length > 0) {
      saveBoth("coupons.json", couponsRes.coupons);
      console.log(`[PreserveLiveData] Preserved ${couponsRes.coupons.length} live coupons.`);
    }

    // 5. Pages
    const pagesRes = await fetchJsonWithTimeout(`${baseUrl}/api/pages`);
    if (pagesRes && Array.isArray(pagesRes.pages) && pagesRes.pages.length > 0) {
      saveBoth("pages.json", pagesRes.pages);
      extractUploadPaths(pagesRes.pages, uploadRefs);
      console.log(`[PreserveLiveData] Preserved ${pagesRes.pages.length} live pages.`);
    }

    // 6. Reviews
    const reviewsRes = await fetchJsonWithTimeout(`${baseUrl}/api/reviews`);
    if (reviewsRes && Array.isArray(reviewsRes.reviews) && reviewsRes.reviews.length > 0) {
      saveBoth("reviews.json", reviewsRes.reviews);
      extractUploadPaths(reviewsRes.reviews, uploadRefs);
      console.log(`[PreserveLiveData] Preserved ${reviewsRes.reviews.length} live reviews.`);
    }

    // 7. Customers
    const customersRes = await fetchJsonWithTimeout(`${baseUrl}/api/customers`);
    if (customersRes && Array.isArray(customersRes.customers) && customersRes.customers.length > 0) {
      saveBoth("registered-customers.json", customersRes.customers);
      console.log(`[PreserveLiveData] Preserved ${customersRes.customers.length} live registered customers.`);
    }

    // 8. Download any referenced uploaded images
    for (const uploadPath of uploadRefs) {
      await downloadUploadFile(baseUrl, uploadPath);
    }

    fs.writeFileSync(
      path.join(seedDir, ".live-snapshot.json"),
      JSON.stringify({ capturedAt: new Date().toISOString(), baseUrl }, null, 2),
      "utf-8"
    );

    console.log(`[PreserveLiveData] Live data snapshot complete!`);
    break;
  }
}

main().catch((err) => {
  console.warn("[PreserveLiveData] Non-fatal warning:", err?.message || err);
});
