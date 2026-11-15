/**
 * Sulaf Store - Non-Destructive Production Startup Script for Coolify / Docker
 *
 * Ensures that:
 * 1. Persistent DATA_DIR (`/app/data` or mounted Coolify volume) is initialized safely.
 * 2. Existing files in DATA_DIR are NEVER overwritten or wiped on redeploy!
 * 3. Any uploaded files in `/app/data/uploads` are also linked/copied to `/app/public/uploads`.
 * 4. Starts the Next.js production server (`next start`).
 */

import fs from "fs";
import path from "path";
import { spawn } from "child_process";

const cwd = process.cwd();
const hasUpperAppData = process.platform !== "win32" && fs.existsSync("/APP/DATA");
const dataDir =
  hasUpperAppData && fs.existsSync("/APP/DATA/products.json")
    ? "/APP/DATA"
    : process.env.DATA_DIR
    ? path.resolve(process.env.DATA_DIR)
    : path.join(cwd, "data");
const seedDir = path.join(cwd, "data-seed");
const uploadsDataDir = path.join(dataDir, "uploads");
const uploadsSeedDir = path.join(seedDir, "uploads");
const uploadsPublicDir = path.join(cwd, "public", "uploads");
const hasLiveSnapshot = fs.existsSync(path.join(seedDir, ".live-snapshot.json"));

for (const dir of [dataDir, uploadsDataDir, uploadsPublicDir]) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function safeReadJson(filePath) {
  try {
    if (!fs.existsSync(filePath)) return null;
    const raw = fs.readFileSync(filePath, "utf-8").trim();
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function initializePersistentData() {
  if (!fs.existsSync(seedDir)) return;

  const jsonFiles = [
    "products.json",
    "store-settings.json",
    "orders.json",
    "coupons.json",
    "pages.json",
    "reviews.json",
    "registered-customers.json",
  ];

  for (const filename of jsonFiles) {
    const targetPath = path.join(dataDir, filename);
    const seedPath = path.join(seedDir, filename);

    if (!fs.existsSync(seedPath)) continue;

    const existingData = safeReadJson(targetPath);
    const seedData = safeReadJson(seedPath);

    // If target file does not exist or is invalid JSON, initialize from seed
    if (existingData === null && seedData !== null) {
      fs.copyFileSync(seedPath, targetPath);
      console.log(`[Sulaf Boot] Initialized ${filename} in ${dataDir}`);
      continue;
    }

    // If both are arrays (products, orders, coupons, reviews, pages, customers),
    // NEVER delete or overwrite existing items in targetPath!
    if (Array.isArray(existingData) && Array.isArray(seedData)) {
      if (existingData.length === 0 && seedData.length > 0) {
        fs.writeFileSync(targetPath, JSON.stringify(seedData, null, 2), "utf-8");
        console.log(`[Sulaf Boot] Restored ${seedData.length} records into empty ${filename}`);
      } else if (hasLiveSnapshot && seedData.length > existingData.length) {
        const existingIds = new Set(existingData.map((item) => item?.id || item?.code || item?.orderNumber).filter(Boolean));
        let added = 0;
        const merged = [...existingData];
        for (const item of seedData) {
          const key = item?.id || item?.code || item?.orderNumber;
          if (key && !existingIds.has(key)) {
            merged.push(item);
            existingIds.add(key);
            added++;
          }
        }
        if (added > 0) {
          fs.writeFileSync(targetPath, JSON.stringify(merged, null, 2), "utf-8");
          console.log(`[Sulaf Boot] Merged ${added} live snapshot records into ${filename}`);
        }
      }
    }
  }

  // Sync uploads between seed, persistent data/uploads, and public/uploads without overwriting existing files
  if (fs.existsSync(uploadsSeedDir)) {
    for (const file of fs.readdirSync(uploadsSeedDir)) {
      if (file === ".gitkeep") continue;
      const src = path.join(uploadsSeedDir, file);
      const destData = path.join(uploadsDataDir, file);
      if (!fs.existsSync(destData) && fs.statSync(src).isFile()) {
        fs.copyFileSync(src, destData);
      }
    }
  }

  if (fs.existsSync(uploadsDataDir)) {
    for (const file of fs.readdirSync(uploadsDataDir)) {
      if (file === ".gitkeep") continue;
      const src = path.join(uploadsDataDir, file);
      const destPub = path.join(uploadsPublicDir, file);
      try {
        if (!fs.existsSync(destPub) && fs.statSync(src).isFile()) {
          fs.copyFileSync(src, destPub);
        }
      } catch {}
    }
  }
}

initializePersistentData();

// Start Next.js production server
const port = process.env.PORT || "3000";
const hostname = process.env.HOSTNAME || "0.0.0.0";
const nextBin = path.join(cwd, "node_modules", "next", "dist", "bin", "next");

const child = spawn(process.execPath, [nextBin, "start", "-H", hostname, "-p", String(port)], {
  stdio: "inherit",
  env: process.env,
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
