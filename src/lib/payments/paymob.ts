import crypto from "crypto";

export interface PaymobIntentionParams {
  amountCents: number;
  currency: string;
  orderNumber: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  billingAddress: {
    street: string;
    city: string;
    governorate: string;
    country: string;
  };
  paymentMethods?: ("card" | "wallet" | "fawry")[];
}

export interface PaymobPaymentResult {
  success: boolean;
  clientSecret?: string;
  paymentUrl?: string;
  iframeUrl?: string;
  transactionId?: string;
  error?: string;
}

export class PaymobService {
  private secretKey: string;
  private publicKey: string;
  private hmacSecret: string;
  private cardIntegrationId: string;
  private walletIntegrationId: string;
  private iframeId: string;

  constructor() {
    this.secretKey = process.env.PAYMOB_SECRET_KEY || "";
    this.publicKey = process.env.PAYMOB_PUBLIC_KEY || "";
    this.hmacSecret = process.env.PAYMOB_HMAC_SECRET || "";
    this.cardIntegrationId = process.env.PAYMOB_INTEGRATION_CARD_ID || "123456";
    this.walletIntegrationId = process.env.PAYMOB_INTEGRATION_WALLET_ID || "123457";
    this.iframeId = process.env.PAYMOB_IFRAME_ID || "12345";
  }

  /**
   * Verifies Paymob Webhook HMAC signature
   */
  public verifyHmac(payload: Record<string, any>, receivedHmac: string): boolean {
    if (!this.hmacSecret) return true; // development fallback

    // Paymob HMAC concatenated fields in specific sequence
    const keys = [
      "amount_cents",
      "created_at",
      "currency",
      "error_occured",
      "has_parent_transaction",
      "id",
      "integration_id",
      "is_3d_secure",
      "is_auth",
      "is_capture",
      "is_refunded",
      "is_standalone_payment",
      "is_voided",
      "order",
      "owner",
      "pending",
      "source_data_pan",
      "source_data_sub_type",
      "source_data_type",
      "success",
    ];

    let concatenated = "";
    for (const key of keys) {
      if (payload[key] !== undefined) {
        concatenated += String(payload[key]);
      }
    }

    const calculatedHmac = crypto
      .createHmac("sha512", this.hmacSecret)
      .update(concatenated)
      .digest("hex");

    return calculatedHmac.toLowerCase() === receivedHmac.toLowerCase();
  }

  /**
   * Creates payment intention
   */
  public async createIntention(params: PaymobIntentionParams): Promise<PaymobPaymentResult> {
    console.log(`[Paymob Service] Initiating payment for Order ${params.orderNumber} - Amount: ${params.amountCents / 100} EGP`);

    // In sandbox / development or if keys are placeholders
    if (!this.secretKey || this.secretKey.startsWith("sec_sample")) {
      console.log("[Paymob Service] Simulating sandbox checkout session");
      return {
        success: true,
        clientSecret: `cs_simulated_${Date.now()}`,
        paymentUrl: `/checkout/paymob-mock?order=${params.orderNumber}&amount=${params.amountCents / 100}`,
        iframeUrl: `/checkout/paymob-mock?order=${params.orderNumber}&amount=${params.amountCents / 100}`,
      };
    }

    try {
      const response = await fetch("https://accept.paymob.com/v1/intention/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${this.secretKey}`,
        },
        body: JSON.stringify({
          amount: params.amountCents,
          currency: params.currency || "EGP",
          payment_methods: [Number(this.cardIntegrationId), Number(this.walletIntegrationId)],
          items: [
            {
              name: `طلب سلاف رقم ${params.orderNumber}`,
              amount: params.amountCents,
              quantity: 1,
            },
          ],
          billing_data: {
            first_name: params.customer.firstName || "عميل",
            last_name: params.customer.lastName || "سلاف",
            email: params.customer.email || "customer@sulaf.com",
            phone_number: params.customer.phone || "+201000000000",
            street: params.billingAddress.street || "شارع التسعين",
            city: params.billingAddress.city || "القاهرة",
            country: "EGY",
            state: params.billingAddress.governorate || "القاهرة",
          },
          special_reference: params.orderNumber,
        }),
      });

      const data = await response.json();
      if (response.ok && data.client_secret) {
        return {
          success: true,
          clientSecret: data.client_secret,
          paymentUrl: `https://accept.paymob.com/unifiedcheckout/?publicKey=${this.publicKey}&clientSecret=${data.client_secret}`,
        };
      } else {
        throw new Error(data.message || JSON.stringify(data));
      }
    } catch (e: any) {
      console.error("[Paymob Service] Intention failed:", e);
      return {
        success: false,
        error: e.message || "Failed to create Paymob intention",
      };
    }
  }
}

export const paymobService = new PaymobService();
export default paymobService;
