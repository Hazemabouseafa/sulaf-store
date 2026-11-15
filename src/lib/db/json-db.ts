import fs from "fs";
import path from "path";

/**
 * Sulaf Local Ultra-Fast JSON DB Engine
 * Supports local VPS hosting, Docker/Coolify persistent volume via DATA_DIR environment variable.
 * Non-destructive: Never overwrites existing live data on Coolify deployments.
 */
export function getDataDir(): string {
  const envDir = process.env.DATA_DIR;
  // Also support case where user mounted /APP/DATA in uppercase in Coolify on Linux
  if (
    process.platform !== "win32" &&
    fs.existsSync(/*turbopackIgnore: true*/ "/APP/DATA") &&
    fs.existsSync(/*turbopackIgnore: true*/ "/APP/DATA/products.json")
  ) {
    return "/APP/DATA";
  }
  const targetDir = envDir
    ? path.resolve(/*turbopackIgnore: true*/ envDir)
    : path.join(/*turbopackIgnore: true*/ process.cwd(), "data");
  if (!fs.existsSync(/*turbopackIgnore: true*/ targetDir)) {
    fs.mkdirSync(/*turbopackIgnore: true*/ targetDir, { recursive: true });
  }
  return targetDir;
}

export function getSeedDataDir(): string {
  return path.join(/*turbopackIgnore: true*/ process.cwd(), "data-seed");
}

export function getDataFilePath(filename: string): string {
  const targetPath = path.join(/*turbopackIgnore: true*/ getDataDir(), filename);
  if (!fs.existsSync(/*turbopackIgnore: true*/ targetPath)) {
    // Check if a seed/snapshot file exists in data-seed before falling back
    const seedPath = path.join(/*turbopackIgnore: true*/ getSeedDataDir(), filename);
    if (fs.existsSync(/*turbopackIgnore: true*/ seedPath)) {
      try {
        fs.copyFileSync(/*turbopackIgnore: true*/ seedPath, /*turbopackIgnore: true*/ targetPath);
      } catch (e) {
        console.warn(`[jsonDb] Could not copy seed file ${filename}:`, e);
      }
    }
  }
  return targetPath;
}

export function readJsonFile<T>(filename: string, defaultValue: T): T {
  try {
    const filePath = getDataFilePath(filename);
    if (!fs.existsSync(/*turbopackIgnore: true*/ filePath)) {
      writeJsonFile(filename, defaultValue);
      return defaultValue;
    }
    const raw = fs.readFileSync(/*turbopackIgnore: true*/ filePath, "utf-8");
    if (!raw.trim()) {
      // Check seed before overwriting with defaultValue
      const seedPath = path.join(/*turbopackIgnore: true*/ getSeedDataDir(), filename);
      if (fs.existsSync(/*turbopackIgnore: true*/ seedPath)) {
        const seedRaw = fs.readFileSync(/*turbopackIgnore: true*/ seedPath, "utf-8").trim();
        if (seedRaw) {
          const parsedSeed = JSON.parse(seedRaw) as T;
          writeJsonFile(filename, parsedSeed);
          return parsedSeed;
        }
      }
      writeJsonFile(filename, defaultValue);
      return defaultValue;
    }
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`[jsonDb] Error reading ${filename}:`, err);
    return defaultValue;
  }
}

export function writeJsonFile<T>(filename: string, data: T): void {
  try {
    const dir = getDataDir();
    const filePath = path.join(/*turbopackIgnore: true*/ dir, filename);
    const tempPath = path.join(
      /*turbopackIgnore: true*/ dir,
      `.${filename}.${Date.now()}.${Math.random().toString(36).slice(2, 8)}.tmp`
    );

    const payload = JSON.stringify(data, null, 2);
    // Atomic write: write to temp file then atomic rename to prevent corruption
    fs.writeFileSync(/*turbopackIgnore: true*/ tempPath, payload, "utf-8");
    fs.renameSync(/*turbopackIgnore: true*/ tempPath, /*turbopackIgnore: true*/ filePath);

    // Mirror to alternate case path if mounted on Linux (/APP/DATA <-> /app/data)
    if (process.platform !== "win32") {
      for (const altDir of ["/app/data", "/APP/DATA"]) {
        if (altDir !== dir && fs.existsSync(/*turbopackIgnore: true*/ altDir)) {
          try {
            fs.writeFileSync(
              path.join(/*turbopackIgnore: true*/ altDir, filename),
              payload,
              "utf-8"
            );
          } catch {}
        }
      }
    }
  } catch (err) {
    console.error(`[jsonDb] Error atomic writing ${filename}:`, err);
  }
}
