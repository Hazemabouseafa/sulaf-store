import { NextRequest, NextResponse } from "next/server";
import { universalShippingService } from "@/lib/shipping/shipping-provider";
import { ShippingProviderConfig } from "@/lib/settings/store-settings";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const provider: ShippingProviderConfig = body.provider;

    if (!provider || !provider.id) {
      return NextResponse.json(
        { success: false, messageAr: "بيانات شركة الشحن غير مكتملة.", messageEn: "Invalid shipping provider data." },
        { status: 400 }
      );
    }

    const result = await universalShippingService.testProviderConnection(provider);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        messageAr: `خطأ أثناء فحص اتصال شركة الشحن: ${err.message}`,
        messageEn: `Error testing shipping provider connection: ${err.message}`,
        latencyMs: 0,
      },
      { status: 500 }
    );
  }
}
