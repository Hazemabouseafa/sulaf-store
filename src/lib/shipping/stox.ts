/**
 * Sulaf Store - Stox Egypt Shipping Service Layer
 * Official Merchant Portal: https://merchants.stox-eg.com
 * Delegates live API calls to UniversalShippingService (reading credentials from store-settings.json / .env)
 */

import { universalShippingService } from "./shipping-provider";

export interface StoxAddress {
  fullName: string;
  phone: string;
  governorate: string;
  city: string;
  street: string;
  building?: string;
  notes?: string;
}

export interface StoxCreateShipmentParams {
  orderId: string;
  orderNumber: string;
  recipient: StoxAddress;
  codAmount: number;
  items: {
    sku: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  packageDescription?: string;
}

export interface StoxShipmentResult {
  success: boolean;
  trackingNumber: string;
  stoxOrderId?: string;
  waybillUrl?: string;
  status: string;
  rawResponse?: any;
  error?: string;
}

export interface StoxTrackingEvent {
  status: string;
  timestamp: string;
  hubName?: string;
  notes?: string;
}

export interface StoxTrackingResult {
  trackingNumber: string;
  currentStatus: "CREATED" | "PICKED_UP" | "OUT_FOR_DELIVERY" | "DELIVERED" | "RETURNED" | "FAILED";
  statusTextAr: string;
  lastUpdated: string;
  carrierHub: string;
  events: StoxTrackingEvent[];
}

// Egyptian Governorates Shipping Rates (EGP)
export const EGYPT_GOVERNORATES_RATES: Record<string, { fee: number; region: string }> = {
  "القاهرة": { fee: 45, region: "cairo_giza" },
  "الجيزة": { fee: 45, region: "cairo_giza" },
  "الإسكندرية": { fee: 55, region: "alex_delta" },
  "البحيرة": { fee: 55, region: "alex_delta" },
  "الدقهلية": { fee: 55, region: "alex_delta" },
  "الغربية": { fee: 55, region: "alex_delta" },
  "الشرقية": { fee: 55, region: "alex_delta" },
  "المنوفية": { fee: 55, region: "alex_delta" },
  "القليوبية": { fee: 50, region: "cairo_giza" },
  "كفر الشيخ": { fee: 55, region: "alex_delta" },
  "دمياط": { fee: 55, region: "alex_delta" },
  "بورسعيد": { fee: 60, region: "canal" },
  "الإسماعيلية": { fee: 60, region: "canal" },
  "السويس": { fee: 60, region: "canal" },
  "الفيوم": { fee: 65, region: "upper_egypt" },
  "بني سويف": { fee: 65, region: "upper_egypt" },
  "المنيا": { fee: 70, region: "upper_egypt" },
  "أسيوط": { fee: 70, region: "upper_egypt" },
  "سوهاج": { fee: 75, region: "upper_egypt" },
  "قنا": { fee: 80, region: "upper_egypt" },
  "الأقصر": { fee: 80, region: "upper_egypt" },
  "أسوان": { fee: 85, region: "upper_egypt" },
  "البحر الأحمر": { fee: 95, region: "remote" },
  "مطروح": { fee: 95, region: "remote" },
  "جنوب سيناء": { fee: 95, region: "remote" },
  "شمال سيناء": { fee: 95, region: "remote" },
  "الوادي الجديد": { fee: 95, region: "remote" },
};

export class StoxShippingService {
  public calculateShippingFee(governorate: string, orderSubtotal: number): number {
    return universalShippingService.calculateShippingFee(governorate, orderSubtotal);
  }

  public async createShipment(params: StoxCreateShipmentParams): Promise<StoxShipmentResult> {
    const res = await universalShippingService.createShipment(params);
    return {
      success: res.success,
      trackingNumber: res.trackingNumber,
      stoxOrderId: res.carrierOrderId,
      waybillUrl: res.waybillUrl,
      status: res.status,
      rawResponse: res.rawResponse,
      error: res.error,
    };
  }

  public async trackShipment(trackingNumber: string): Promise<StoxTrackingResult> {
    const res = await universalShippingService.trackShipment(trackingNumber);
    return {
      trackingNumber: res.trackingNumber,
      currentStatus: res.currentStatus,
      statusTextAr: res.statusTextAr,
      lastUpdated: res.lastUpdated,
      carrierHub: res.carrierHub,
      events: res.events,
    };
  }
}

export const stoxService = new StoxShippingService();
export default stoxService;
