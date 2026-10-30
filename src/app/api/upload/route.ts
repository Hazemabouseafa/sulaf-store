import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getDataDir } from "@/lib/db/json-db";

export const dynamic = "force-dynamic";

const EXTENSION_MAP: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
  "image/avif": "avif",
};

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    // 1. Multipart Form Data (File Upload from browser file picker)
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const files = formData.getAll("files") as File[];
      const singleFile = formData.get("file") as File | null;

      const fileList: File[] = [];
      if (files && files.length > 0) {
        fileList.push(...files.filter((f) => f && typeof f.arrayBuffer === "function"));
      } else if (singleFile && typeof singleFile.arrayBuffer === "function") {
        fileList.push(singleFile);
      }

      if (fileList.length === 0) {
        return NextResponse.json(
          { success: false, error: "لم يتم استلام أي ملفات صور صالحة." },
          { status: 400 }
        );
      }

      const uploadedResults = [];
      const uploadsDirData = path.join(getDataDir(), "uploads");
      const uploadsDirPublic = path.join(process.cwd(), "public", "uploads");

      if (!fs.existsSync(uploadsDirData)) {
        fs.mkdirSync(uploadsDirData, { recursive: true });
      }
      if (!fs.existsSync(uploadsDirPublic)) {
        fs.mkdirSync(uploadsDirPublic, { recursive: true });
      }

      for (const file of fileList) {
        let ext = "";
        if (file.type && EXTENSION_MAP[file.type]) {
          ext = EXTENSION_MAP[file.type];
        } else if (file.name && file.name.includes(".")) {
          ext = file.name.split(".").pop()?.toLowerCase() || "png";
        } else {
          ext = "png";
        }

        // Clean sanitized name
        const cleanOriginalName = file.name
          ? file.name
              .replace(/\.[^/.]+$/, "")
              .toLowerCase()
              .replace(/[^a-z0-9_-]/g, "-")
              .slice(0, 30)
          : "product";

        const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        const filename = `${cleanOriginalName}-${uniqueSuffix}.${ext}`;

        const buffer = Buffer.from(await file.arrayBuffer());

        // Save to persistent storage directory
        fs.writeFileSync(path.join(uploadsDirData, filename), buffer);

        // Also save to public directory for static serving
        try {
          fs.writeFileSync(path.join(uploadsDirPublic, filename), buffer);
        } catch {
          // Non-blocking if public folder is read-only in container
        }

        uploadedResults.push({
          url: `/api/uploads/${filename}`,
          publicUrl: `/uploads/${filename}`,
          filename,
          originalName: file.name,
          size: file.size,
          type: file.type || `image/${ext}`,
        });
      }

      return NextResponse.json({
        success: true,
        message:
          fileList.length === 1
            ? "تم رفع الصورة بنجاح."
            : `تم رفع ${fileList.length} صور بنجاح.`,
        uploads: uploadedResults,
        // Shorthand for single file
        url: uploadedResults[0]?.url,
        publicUrl: uploadedResults[0]?.publicUrl,
      });
    }

    // 2. Base64 Upload (Alternative from rich editors or canvas)
    if (contentType.includes("application/json")) {
      const body = await req.json();
      const { base64, filename: reqFilename, mimeType = "image/png" } = body;

      if (!base64) {
        return NextResponse.json(
          { success: false, error: "بيانات الصورة غير موجودة." },
          { status: 400 }
        );
      }

      const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      const ext = EXTENSION_MAP[mimeType] || "png";
      const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const filename = reqFilename
        ? `${reqFilename.replace(/[^a-z0-9_-]/gi, "-")}-${uniqueSuffix}.${ext}`
        : `product-${uniqueSuffix}.${ext}`;

      const uploadsDirData = path.join(getDataDir(), "uploads");
      const uploadsDirPublic = path.join(process.cwd(), "public", "uploads");

      if (!fs.existsSync(uploadsDirData)) fs.mkdirSync(uploadsDirData, { recursive: true });
      if (!fs.existsSync(uploadsDirPublic)) fs.mkdirSync(uploadsDirPublic, { recursive: true });

      fs.writeFileSync(path.join(uploadsDirData, filename), buffer);
      try {
        fs.writeFileSync(path.join(uploadsDirPublic, filename), buffer);
      } catch {}

      return NextResponse.json({
        success: true,
        message: "تم حفظ الصورة بنجاح.",
        url: `/api/uploads/${filename}`,
        publicUrl: `/uploads/${filename}`,
        filename,
      });
    }

    return NextResponse.json(
      { success: false, error: "نوع الطلب غير مدعوم." },
      { status: 400 }
    );
  } catch (err: any) {
    console.error("[Upload API Error]:", err);
    return NextResponse.json(
      { success: false, error: err.message || "فشل رفع الصورة." },
      { status: 500 }
    );
  }
}
