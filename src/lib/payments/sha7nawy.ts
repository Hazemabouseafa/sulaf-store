import { getDataFilePath } from "@/lib/db/json-db";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { DEFAULT_STORE_SETTINGS, StoreSettings } from "@/lib/settings/store-settings";

export type Sha7nawyWalletMethod = "vf_cash" | "or_cash" | "et_cash";

export interface Sha7nawyCreatePaymentParams {
  orderId: string;
  number: string;
  amount: number;
  method: Sha7nawyWalletMethod;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  description?: string;
  webhookUrl?: string;
  metadata?: Record<string, any>;
}

export interface Sha7nawyCreatePaymentResponse {
  success: boolean;
  code?: string;
  message?: string;
  data?: {
    id: string;
    reference: string;
    order_id: string;
    amount: number;
    method: Sha7nawyWalletMethod;
    number: string;
    status: "pending" | "completed" | "rejected";
    instructions: string;
    instructionsEn?: string;
    actionCode?: string; // e.g. *9*1#
    dialCode?: string;
    timeoutSeconds?: number;
    created_at?: string;
  };
  error?: string;
}

export interface Sha7nawyConfirmResponse {
  success: boolean;
  code?: string;
  message?: string;
  data?: {
    reference: string;
    status: "completed" | "pending" | "rejected";
    transaction_id?: string;
    provider_transaction_id?: string;
    updated_at?: string;
  };
  error?: string;
}

export interface Sha7nawyPaymentInfoResponse {
  success: boolean;
  code?: string;
  data?: {
    reference: string;
    order_id: string;
    status: "pending" | "completed" | "rejected";
    amount: number;
    currency: string;
    method: Sha7nawyWalletMethod;
    number: string;
    client: string;
    transaction_id?: string;
    created_at?: string;
    updated_at?: string;
  };
  error?: string;
}

/**
 * Sha7nawy Gate Payment Service (API v2.0)
 * Supports Vodafone Cash, Orange Cash, Etisalat Cash
 */
export class Sha7nawyService {
  private baseUrl: string;
  private publicKey: string;
  private secretKey: string;
  private appName: string;
  private isSandbox: boolean;

  constructor() {
    const settings = this.getSettings();
    const sha = settings.sha7nawy;

    this.baseUrl = (sha?.baseUrl || process.env.SHA7NAWY_BASE_URL || "https://gate.sha7nawy.com").replace(/\/+$/, "");
    this.publicKey = sha?.publicKey || process.env.SHA7NAWY_PUBLIC_KEY || "";
    this.secretKey = sha?.secretKey || process.env.SHA7NAWY_SECRET_KEY || "";
    this.appName = sha?.appName || process.env.SHA7NAWY_APP_NAME || "Sulaf-Store";
    this.isSandbox = sha?.isSandbox !== false;
  }

  private getSettings(): StoreSettings {
    try {
      const settingsPath = getDataFilePath("store-settings.json");
      if (fs.existsSync(settingsPath)) {
        const raw = fs.readFileSync(settingsPath, "utf-8");
        return { ...DEFAULT_STORE_SETTINGS, ...JSON.parse(raw) };
      }
    } catch {
      // fallback
    }
    return DEFAULT_STORE_SETTINGS;
  }

  /**
   * Generates localized customer action instructions based on wallet method
   */
  public static getMethodInstructions(method: Sha7nawyWalletMethod): {
    instructionsAr: string;
    instructionsEn: string;
    actionCode?: string;
    actionTitleAr: string;
    actionTitleEn: string;
  } {
    switch (method) {
      case "vf_cash":
        return {
          instructionsAr: "يُرجى طلب الكود *9*1# على هاتفك خلال 60 ثانية للموافقة على السحب وإدخال الرقم السري لمحفظة فودافون كاش.",
          instructionsEn: "Please dial *9*1# on your phone within 60 seconds to approve debit and enter your Vodafone Cash PIN.",
          actionCode: "*9*1#",
          actionTitleAr: "فودافون كاش (اطلب *9*1#)",
          actionTitleEn: "Vodafone Cash (Dial *9*1#)",
        };
      case "or_cash":
        return {
          instructionsAr: "يُرجى فتح تطبيق Orange Cash الآن والموافقة على إشعار السحب المعلق وإدخال رقمك السري.",
          instructionsEn: "Please open Orange Cash app now and approve the pending payment request with your PIN.",
          actionCode: "Orange Cash App",
          actionTitleAr: "أورنج كاش (تطبيق Orange)",
          actionTitleEn: "Orange Cash (App Request)",
        };
      case "et_cash":
        return {
          instructionsAr: "يُرجى طلب الكود *777*11# أو فتح تطبيق e& Money للموافقة على السحب وإدخال رقمك السري.",
          instructionsEn: "Please dial *777*11# or open e& Money app to approve payment with your PIN.",
          actionCode: "*777*11#",
          actionTitleAr: "اتصالات كاش (اطلب *777*11#)",
          actionTitleEn: "Etisalat Cash (Dial *777*11#)",
        };
      default:
        return {
          instructionsAr: "يُرجى الموافقة على طلب السحب على هاتفك خلال 60 ثانية.",
          instructionsEn: "Please approve the debit request on your phone within 60 seconds.",
          actionCode: "",
          actionTitleAr: "المحفظة الإلكترونية",
          actionTitleEn: "E-Wallet",
        };
    }
  }

  /**
   * 1. Create Payment Request (API v2.0)
   */
  public async createPayment(params: Sha7nawyCreatePaymentParams): Promise<Sha7nawyCreatePaymentResponse> {
    const cleanNumber = params.number.replace(/\D/g, "");
    if (!cleanNumber || cleanNumber.length < 11) {
      return {
        success: false,
        code: "SH-4021",
        error: "رقم هاتف المحفظة غير صحيح، يجب أن يتكون من 11 رقماً (مثال: 01012345678).",
      };
    }

    if (!params.amount || params.amount <= 0) {
      return {
        success: false,
        code: "SH-4022",
        error: "قيمة المبلغ غير صالحة.",
      };
    }

    const { instructionsAr, instructionsEn, actionCode } = Sha7nawyService.getMethodInstructions(params.method);

    // If no real public key configured or in simulated sandbox testing mode
    const isMock = !this.publicKey || this.publicKey.startsWith("YOUR_") || this.isSandbox;

    if (isMock) {
      const mockRef = `SH-${Math.floor(100000000 + Math.random() * 900000000)}`;
      const mockTxId = `${Date.now()}`;

      return {
        success: true,
        code: "SH-0000",
        message: "تم بدء طلب الدفع بالمحفظة بنجاح (وضع الاختبار المعتمد)",
        data: {
          id: mockTxId,
          reference: mockRef,
          order_id: params.orderId,
          amount: params.amount,
          method: params.method,
          number: cleanNumber,
          status: "pending",
          instructions: instructionsAr,
          instructionsEn,
          actionCode,
          dialCode: actionCode?.startsWith("*") ? actionCode : undefined,
          timeoutSeconds: 60,
          created_at: new Date().toISOString(),
        },
      };
    }

    // Real API Call
    try {
      const endpoint = `${this.baseUrl}/api/v2/payment/create`;
      const payload = {
        order_id: params.orderId,
        number: cleanNumber,
        amount: Math.round(params.amount),
        method: params.method,
        customer_name: params.customerName || "عميلة سُـلاف",
        customer_email: params.customerEmail || "client@sulaf.com",
        customer_phone: cleanNumber,
        description: params.description || `سُـلاف | طلب رقم ${params.orderId}`,
        webhook_url: params.webhookUrl || `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/webhooks/sha7nawy`,
        metadata: params.metadata || {},
      };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: this.publicKey,
          "X-App-Name": this.appName,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data) {
        return {
          success: false,
          code: data?.code || `SH-${res.status}`,
          error: data?.message || data?.error || `فشل الاتصال ببوابة شحناوي (${res.status})`,
        };
      }

      return {
        success: true,
        code: data.code || "SH-0000",
        message: data.message || "تم إنشاء طلب الدفع بنجاح",
        data: {
          id: data.data?.id || `${Date.now()}`,
          reference: data.data?.reference,
          order_id: params.orderId,
          amount: params.amount,
          method: params.method,
          number: cleanNumber,
          status: data.data?.status || "pending",
          instructions: data.data?.instructions || instructionsAr,
          instructionsEn,
          actionCode,
          dialCode: actionCode?.startsWith("*") ? actionCode : undefined,
          timeoutSeconds: 60,
          created_at: data.data?.created_at || new Date().toISOString(),
        },
      };
    } catch (err: any) {
      console.error("[Sha7nawy API Error]:", err);
      return {
        success: false,
        error: err.message || "خطأ أثناء الاتصال بسيرفر شحناوي",
      };
    }
  }

  /**
   * 2. Confirm Payment (API v2.0)
   */
  public async confirmPayment(reference: string): Promise<Sha7nawyConfirmResponse> {
    if (!reference) {
      return { success: false, error: "الكود المرجعي reference مطلوب لتأكيد العملية" };
    }

    const isMock = !this.publicKey || this.publicKey.startsWith("YOUR_") || this.isSandbox;

    if (isMock) {
      return {
        success: true,
        code: "SH-0000",
        message: "تم تأكيد عملية السحب بنجاح واكتمال الدفع",
        data: {
          reference,
          status: "completed",
          transaction_id: `TX-${Date.now()}`,
          provider_transaction_id: `PROV-${Math.floor(10000000 + Math.random() * 90000000)}`,
          updated_at: new Date().toISOString(),
        },
      };
    }

    try {
      const endpoint = `${this.baseUrl}/api/v2/payment/confirm`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: this.publicKey,
        },
        body: JSON.stringify({ reference }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data) {
        return {
          success: false,
          code: data?.code || `SH-${res.status}`,
          error: data?.message || data?.error || "فشل تأكيد العملية من قبل مزود الخدمة",
        };
      }

      return {
        success: true,
        code: data.code || "SH-0000",
        message: data.message || "تم تأكيد السحب بنجاح",
        data: data.data,
      };
    } catch (err: any) {
      console.error("[Sha7nawy Confirm Error]:", err);
      return { success: false, error: err.message || "تعذر تأكيد العملية" };
    }
  }

  /**
   * 3. Check Payment Status (API v2.0 - Requires Secret Key)
   */
  public async getPaymentInfo(reference: string): Promise<Sha7nawyPaymentInfoResponse> {
    if (!reference) {
      return { success: false, error: "الكود المرجعي مطلوب" };
    }

    const isMock = !this.secretKey || this.secretKey.startsWith("YOUR_") || this.isSandbox;

    if (isMock) {
      return {
        success: true,
        code: "SH-0000",
        data: {
          reference,
          order_id: "ORD-MOCK",
          status: "completed",
          amount: 420,
          currency: "EGP",
          method: "vf_cash",
          number: "01012345678",
          client: "عميلة سُـلاف",
          transaction_id: `TX-${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      };
    }

    try {
      const endpoint = `${this.baseUrl}/api/v2/payment/info/${encodeURIComponent(reference)}`;
      const res = await fetch(endpoint, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: this.secretKey,
        },
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data) {
        return {
          success: false,
          code: data?.code || `SH-${res.status}`,
          error: data?.message || "تعذر الاستعلام عن المعاملة",
        };
      }

      return {
        success: true,
        code: data.code || "SH-0000",
        data: data.data,
      };
    } catch (err: any) {
      return { success: false, error: err.message || "خطأ أثناء فحص المعاملة" };
    }
  }

  /**
   * 4. Verify HMAC-SHA256 Webhook Signature
   */
  public verifyWebhookSignature(rawBody: string, receivedSignature: string): boolean {
    if (!this.secretKey) return true; // dev fallback if not configured
    if (!receivedSignature) return false;

    try {
      const calculatedSignature = crypto
        .createHmac("sha256", this.secretKey)
        .update(rawBody)
        .digest("hex");

      return calculatedSignature.toLowerCase() === receivedSignature.toLowerCase();
    } catch (e) {
      console.error("[Sha7nawy Signature Verification Error]:", e);
      return false;
    }
  }
}
