import fs from "fs";
import path from "path";

/**
 * Sulaf Local Ultra-Fast JSON DB Engine
 * Supports local VPS hosting, Docker/Coolify persistent volume via DATA_DIR environment variable.
 * Non-destructive: Never overwrites existing live data on Coolify deployments.
 */
export function getDataDir(): string {
  const envDir = process.env.DATA_DIR;
  const targetDir = envDir ? path.resolve(envDir) : path.join(process.cwd(), "data");
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  return targetDir;
}

export function getSeedDataDir(): string {
  return path.join(process.cwd(), "data-seed");
}

export function getDataFilePath(filename: string): string {
  const targetPath = path.join(getDataDir(), filename);
  if (!fs.existsSync(targetPath)) {
    // Check if a seed/snapshot file exists in data-seed before falling back
    const seedPath = path.join(getSeedDataDir(), filename);
    if (fs.existsSync(seedPath)) {
      try {
        fs.copyFileSync(seedPath, targetPath);
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
    if (!fs.existsSync(filePath)) {
      writeJsonFile(filename, defaultValue);
      return defaultValue;
    }
    const raw = fs.readFileSync(filePath, "utf-8");
    if (!raw.trim()) {
      // Check seed before overwriting with defaultValue
      const seedPath = path.join(getSeedDataDir(), filename);
      if (fs.existsSync(seedPath)) {
        const seedRaw = fs.readFileSync(seedPath, "utf-8").trim();
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
    const filePath = path.join(dir, filename);
    const tempPath = path.join(
      dir,
      `.${filename}.${Date.now()}.${Math.random().toString(36).slice(2, 8)}.tmp`
    );

    // Atomic write: write to temp file then atomic rename to prevent corruption
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), "utf-8");
    fs.renameSync(tempPath, filePath);
  } catch (err) {
    console.error(`[jsonDb] Error atomic writing ${filename}:`, err);
  }
}
