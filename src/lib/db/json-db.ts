import fs from "fs";
import path from "path";

/**
 * Sulaf Local Ultra-Fast JSON DB Engine
 * Supports local VPS hosting, Docker/Coolify persistent volume via DATA_DIR environment variable.
 */
export function getDataDir(): string {
  const envDir = process.env.DATA_DIR;
  const targetDir = envDir ? path.resolve(envDir) : path.join(process.cwd(), "data");
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  return targetDir;
}

export function getDataFilePath(filename: string): string {
  return path.join(getDataDir(), filename);
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

