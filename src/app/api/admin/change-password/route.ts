import { NextRequest, NextResponse } from "next/server";
import { readJsonFile, writeJsonFile } from "@/lib/db/json-db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { currentPassword, newPassword, confirmPassword, newUsername } = body;

    const settings = readJsonFile<any>("store-settings.json", {});
    const expectedPassword = settings.admin?.password || "sulaf2026";
    const expectedUsername = settings.admin?.username || "admin";

    // 1. Verify Current Password
    if (!currentPassword) {
      return NextResponse.json(
        { success: false, error: "يرجى إدخال كلمة المرور الحالية للتأكيد." },
        { status: 400 }
      );
    }

    if (currentPassword.trim() !== expectedPassword.trim()) {
      return NextResponse.json(
        { success: false, error: "كلمة المرور الحالية غير صحيحة. يرجى التأكد وإعادة المحاولة." },
        { status: 400 }
      );
    }

    // 2. Validate New Password
    if (!newPassword || typeof newPassword !== "string") {
      return NextResponse.json(
        { success: false, error: "يرجى كتابة كلمة المرور الجديدة." },
        { status: 400 }
      );
    }

    if (newPassword.trim().length < 6) {
      return NextResponse.json(
        { success: false, error: "يجب أن تتكون كلمة المرور الجديدة من 6 خانات على الأقل." },
        { status: 400 }
      );
    }

    if (newPassword.trim() !== (confirmPassword || "").trim()) {
      return NextResponse.json(
        { success: false, error: "كلمة المرور الجديدة وتأكيدها غير متطابقين." },
        { status: 400 }
      );
    }

    // 3. Optional Username Update
    let targetUsername = expectedUsername;
    if (newUsername && typeof newUsername === "string" && newUsername.trim()) {
      if (newUsername.trim().length < 3) {
        return NextResponse.json(
          { success: false, error: "اسم المستخدم يجب ألا يقل عن 3 أحرف." },
          { status: 400 }
        );
      }
      targetUsername = newUsername.trim();
    }

    // 4. Save to store-settings.json
    settings.admin = {
      username: targetUsername,
      password: newPassword.trim(),
    };

    writeJsonFile("store-settings.json", settings);

    return NextResponse.json({
      success: true,
      message: "تم تغيير كلمة مرور المدير بنجاح. يرجى استخدام كلمة المرور الجديدة في المرات القادمة.",
      admin: {
        username: targetUsername,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "حدث خطأ غير متوقع أثناء تغيير كلمة المرور." },
      { status: 500 }
    );
  }
}
