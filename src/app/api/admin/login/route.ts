import { NextRequest, NextResponse } from "next/server";
import { readJsonFile } from "@/lib/db/json-db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    const settings = readJsonFile<any>("store-settings.json", {});

    const expectedUser = settings.admin?.username || "admin";
    const expectedPass = settings.admin?.password || "sulaf2026";

    if (username === expectedUser && password === expectedPass) {
      return NextResponse.json({
        success: true,
        message: "تم تسجيل الدخول بنجاح كمدير عام لمتجر سلاف.",
        token: `sulaf_session_${Date.now()}`,
      });
    }

    return NextResponse.json(
      { success: false, error: "اسم المستخدم أو كلمة المرور غير صحيحة." },
      { status: 401 }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
