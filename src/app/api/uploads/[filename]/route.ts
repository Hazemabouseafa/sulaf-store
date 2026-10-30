import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getDataDir } from "@/lib/db/json-db";

export const dynamic = "force-dynamic";

const MIME_MAP: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  svg: "image/svg+xml",
  avif: "image/avif",
  mp4: "video/mp4",
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    // Sanitize filename to prevent directory traversal
    const safeFilename = path.basename(filename);

    const uploadsDirData = path.join(getDataDir(), "uploads", safeFilename);
    const uploadsDirPublic = path.join(process.cwd(), "public", "uploads", safeFilename);

    let filePath = "";
    if (fs.existsSync(uploadsDirData)) {
      filePath = uploadsDirData;
    } else if (fs.existsSync(uploadsDirPublic)) {
      filePath = uploadsDirPublic;
    } else {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const ext = safeFilename.split(".").pop()?.toLowerCase() || "png";
    const contentType = MIME_MAP[ext] || "application/octet-stream";

    const fileBuffer = fs.readFileSync(filePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
