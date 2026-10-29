"use client";

import React, { useState } from "react";
import {
  DEFAULT_SHIPPING_PROVIDERS,
  ShippingProviderConfig,
  ShippingProviderType,
} from "@/lib/settings/store-settings";
import { Truck, Check, RefreshCw } from "lucide-react";

interface ShippingCarrierSettingsProps {
  adminLang: "ar" | "en";
  activeProvider: ShippingProviderType;
  providers: Record<ShippingProviderType, ShippingProviderConfig>;
  onChangeActiveProvider: (provider: ShippingProviderType) => void;
  onChangeProviderConfig: (provider: ShippingProviderType, config: Partial<ShippingProviderConfig>) => void;
  showToast: (msg: string, type?: "success" | "error") => void;
}

export function ShippingCarrierSettings({
  adminLang,
  activeProvider,
  providers,
  onChangeActiveProvider,
  onChangeProviderConfig,
  showToast,
}: ShippingCarrierSettingsProps) {
  const [selectedCarrier, setSelectedCarrier] = useState<ShippingProviderType>("stox");
  const [testLoading, setTestLoading] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  const currentProvider = providers[selectedCarrier] || DEFAULT_SHIPPING_PROVIDERS[selectedCarrier];
  const isCurrentlyActive = activeProvider === selectedCarrier;

  async function handleTestConnection() {
    setTestLoading(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/shipping/test-connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider: currentProvider }),
      });
      const data = await res.json();
      setTestResult(data);
      if (data.success) {
        showToast(adminLang === "ar" ? data.messageAr : data.messageEn);
      } else {
        showToast(adminLang === "ar" ? data.messageAr : data.messageEn, "error");
      }
    } catch {
      showToast(adminLang === "ar" ? "فشل الاتصال بخادم الشحن." : "Failed to connect to shipping API.", "error");
    } finally {
      setTestLoading(false);
    }
  }

  const carrierTabs: ShippingProviderType[] = ["stox", "bosta", "aramex", "mylerz", "custom"];

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-[#485c36]/25 shadow-md space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#485c36]/10 text-[#485c36] flex items-center justify-center">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg text-[#1e2b18]">
                {adminLang === "ar" ? "إدارة شركات الشحن والربط البرمجي للـ API والتتبع" : "Shipping Companies & Tracking APIs Manager"}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
                {adminLang === "ar" ? "نظام مرن عام (Modular Engine)" : "Universal Carrier Engine"}
              </span>
            </div>
            <p className="text-xs text-gray-500 font-semibold mt-0.5">
              {adminLang === "ar"
                ? "التحكم في شركة الشحن الافتراضية (STOX Express) أو ربط أي شركة شحن بديلة (بوسطة، أرامكس، مايلرز، أو Custom REST API) لإصدار البوليصات والتتبع المباشر للعميل."
                : "Manage default carrier (STOX Express) or plug in any alternate shipping provider (Bosta, Aramex, Mylerz, or Custom REST API) for automated waybills and live customer tracking."}
            </p>
          </div>
        </div>

        {/* Current Active Carrier Pill */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#f4f1e6] border border-[#485c36]/30">
          <span className="text-xs font-bold text-gray-600">
            {adminLang === "ar" ? "الشركة الأساسية الحالية:" : "Active Carrier:"}
          </span>
          <span className="text-xs font-black text-[#610b0d] px-2.5 py-1 rounded-xl bg-white border border-[#610b0d]/20 shadow-xs">
            {providers[activeProvider]?.nameAr || activeProvider.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Provider Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-gray-50 border border-gray-200">
        {carrierTabs.map((pKey) => {
          const p = providers[pKey] || DEFAULT_SHIPPING_PROVIDERS[pKey];
          const isSelected = selectedCarrier === pKey;
          const isActive = activeProvider === pKey;

          return (
            <button
              key={pKey}
              type="button"
              onClick={() => {
                setSelectedCarrier(pKey);
                setTestResult(null);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isSelected
                  ? "bg-[#485c36] text-[#f6f9e6] shadow-sm scale-102"
                  : "text-gray-700 hover:bg-gray-200/60"
              }`}
            >
              <span>{adminLang === "ar" ? p.nameAr : p.nameEn}</span>
              {isActive && (
                <span className={`w-2 h-2 rounded-full ${isSelected ? "bg-emerald-300" : "bg-emerald-500"} animate-pulse`} title="الشركة الأساسية النشطة" />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Provider Details */}
      <div className="space-y-6 bg-[#fcfdfa] p-6 rounded-2xl border border-gray-200">
        <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-base text-[#1e2b18]">
                {adminLang === "ar" ? currentProvider.nameAr : currentProvider.nameEn}
              </h4>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${currentProvider.isSandbox ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>
                {currentProvider.isSandbox ? (adminLang === "ar" ? "وضع المحاكاة التجريبي (Sandbox)" : "Sandbox / Test Mode") : (adminLang === "ar" ? "الوضع الحي المباشر (Live)" : "Live Production")}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {currentProvider.notes || (adminLang === "ar" ? "إعدادات الربط البرمجي ومفاتيح الاتصال." : "API credentials and tracking configurations.")}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isCurrentlyActive ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
                <Check className="w-4 h-4" />
                <span>{adminLang === "ar" ? "شركة الشحن الأساسية المعتمدة حالياً ✓" : "Active Primary Carrier ✓"}</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onChangeActiveProvider(selectedCarrier);
                  showToast(adminLang === "ar" ? `تم تعيين ${currentProvider.nameAr} كشركة الشحن الأساسية.` : `${currentProvider.nameEn} set as active carrier.`);
                }}
                className="px-4 py-2 rounded-xl bg-[#610b0d] hover:bg-[#4a080a] text-[#f6f9e6] text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>{adminLang === "ar" ? `تعيين ${currentProvider.nameAr} كشركة أساسية` : `Set ${currentProvider.nameEn} as Primary`}</span>
              </button>
            )}

            <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={currentProvider.isSandbox}
                onChange={(e) => onChangeProviderConfig(selectedCarrier, { isSandbox: e.target.checked })}
                className="rounded border-gray-300 text-[#485c36] focus:ring-[#485c36]"
              />
              <span>{adminLang === "ar" ? "وضع التجربة (Sandbox)" : "Sandbox Mode"}</span>
            </label>
          </div>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1.5">
              {adminLang === "ar" ? "اسم شركة الشحن / المزود" : "Provider Name"}
            </label>
            <input
              type="text"
              value={currentProvider.nameAr}
              onChange={(e) => onChangeProviderConfig(selectedCarrier, { nameAr: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold text-gray-900 focus:border-[#485c36] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1.5">
              {adminLang === "ar" ? "مفتاح الربط البرمجي (API Key / Bearer Token)" : "API Key / Bearer Token"}
            </label>
            <input
              type="password"
              placeholder={selectedCarrier === "stox" ? "stx_live_sk_..." : "Bearer token / API Key"}
              value={currentProvider.apiKey}
              onChange={(e) => onChangeProviderConfig(selectedCarrier, { apiKey: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-mono text-gray-900 focus:border-[#485c36] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1.5">
              {adminLang === "ar" ? "رابط خادم المزود (API Base URL)" : "API Base URL"}
            </label>
            <input
              type="text"
              value={currentProvider.baseUrl}
              onChange={(e) => onChangeProviderConfig(selectedCarrier, { baseUrl: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-mono text-gray-900 focus:border-[#485c36] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1.5">
              {adminLang === "ar" ? "قالب رابط تتبع العميل المباشر (Customer Tracking URL)" : "Customer Tracking URL Template"}
            </label>
            <input
              type="text"
              placeholder="https://carrier.com/track/{tracking}"
              value={currentProvider.trackingUrlTemplate}
              onChange={(e) => onChangeProviderConfig(selectedCarrier, { trackingUrlTemplate: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-mono text-gray-900 focus:border-[#485c36] focus:outline-none"
            />
            <span className="text-[10px] text-gray-500 mt-1 block">
              {adminLang === "ar" ? "استخدم {tracking} ليتم استبداله برقم بوليصة الشحنة تلقائياً." : "Use {tracking} placeholder, will be replaced with waybill number."}
            </span>
          </div>

          {(selectedCarrier === "aramex" || selectedCarrier === "custom") && (
            <>
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5">
                  {adminLang === "ar" ? "كلمة السر السرية (API Secret / Password)" : "API Secret / Password"}
                </label>
                <input
                  type="password"
                  value={currentProvider.apiSecret || ""}
                  onChange={(e) => onChangeProviderConfig(selectedCarrier, { apiSecret: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-mono text-gray-900 focus:border-[#485c36] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5">
                  {adminLang === "ar" ? "رقم حساب التاجر (Account / Entity Number)" : "Merchant Account Number"}
                </label>
                <input
                  type="text"
                  value={currentProvider.accountNumber || ""}
                  onChange={(e) => onChangeProviderConfig(selectedCarrier, { accountNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-mono text-gray-900 focus:border-[#485c36] focus:outline-none"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1.5">
              {adminLang === "ar" ? "مسار استعلام التتبع (Tracking Endpoint)" : "Tracking Endpoint"}
            </label>
            <input
              type="text"
              placeholder="/shipments/track/{tracking}"
              value={currentProvider.trackingEndpoint || ""}
              onChange={(e) => onChangeProviderConfig(selectedCarrier, { trackingEndpoint: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-mono text-gray-900 focus:border-[#485c36] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1.5">
              {adminLang === "ar" ? "رابط الويب هوك لاستلام التحديثات (Webhook URL)" : "Webhook Receiver URL"}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value="/api/webhooks/stox"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-100 text-xs font-mono text-gray-700 cursor-copy"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    navigator.clipboard.writeText(window.location.origin + "/api/webhooks/stox");
                    showToast(adminLang === "ar" ? "تم نسخ رابط الـ Webhook إلى الحافظة ✓" : "Webhook URL copied ✓");
                  }
                }}
              />
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    navigator.clipboard.writeText(window.location.origin + "/api/webhooks/stox");
                    showToast(adminLang === "ar" ? "تم نسخ رابط الـ Webhook إلى الحافظة ✓" : "Webhook URL copied ✓");
                  }
                }}
                className="px-3 py-2.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-xs font-bold text-gray-800 cursor-pointer"
              >
                {adminLang === "ar" ? "نسخ" : "Copy"}
              </button>
            </div>
          </div>
        </div>

        {/* Action Row */}
        <div className="pt-3 border-t border-gray-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={testLoading}
              onClick={handleTestConnection}
              className="px-5 py-2.5 rounded-xl bg-[#22301e] hover:bg-[#34482f] text-[#f6f9e6] text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testLoading ? "animate-spin" : ""}`} />
              <span>{testLoading ? (adminLang === "ar" ? "جاري فحص الاتصال..." : "Testing...") : (adminLang === "ar" ? "فحص اتصال الـ API الآن" : "Test API Connection")}</span>
            </button>

            {testResult && (
              <span className={`text-xs font-bold px-3 py-1.5 rounded-xl border ${
                testResult.success
                  ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                  : "bg-rose-50 text-rose-800 border-rose-300"
              }`}>
                {adminLang === "ar" ? testResult.messageAr : testResult.messageEn}
              </span>
            )}
          </div>

          <div className="text-[11px] text-gray-500 font-semibold">
            {adminLang === "ar"
              ? "يتم تفعيل التغييرات فور الضغط على زر حفظ إعدادات المتجر بالأسفل."
              : "Click Save Settings below to apply shipping API changes."}
          </div>
        </div>
      </div>
    </div>
  );
}
