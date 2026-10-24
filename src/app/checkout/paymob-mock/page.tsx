"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { updateOrderStatus, getOrderById } from "@/lib/orders/order-store";
import { CreditCard, ShieldCheck, CheckCircle2, Lock } from "lucide-react";

function PaymobMockContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderNumber = searchParams.get("order") || "SLF-XXXX";
  const amount = searchParams.get("amount") || "100";

  const [processing, setProcessing] = useState(false);
  const [method, setMethod] = useState<"card" | "wallet" | "fawry">("card");

  function handleCompletePayment() {
    setProcessing(true);
    setTimeout(() => {
      const order = getOrderById(orderNumber);
      if (order) {
        updateOrderStatus(order.id, {
          paymentStatus: order.isDepositMode ? "DEPOSIT_PAID" : "FULLY_PAID",
          orderStatus: "PROCESSING",
        });
      }
      alert("تمت معالجة الدفع التجريبي بنجاح عبر Paymob Accept!");
      router.push("/account");
    }, 1500);
  }

  return (
    <div className="py-20 bg-gray-50 min-h-screen flex items-center justify-center px-4 text-[#222b1a]">
      <div className="max-w-md w-full bg-white rounded-3xl border border-gray-200 shadow-xl p-8 space-y-6">
        {/* Paymob Header */}
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#002b49] text-white flex items-center justify-center font-bold text-xs">
              P
            </div>
            <div>
              <span className="font-bold text-xs text-gray-900 block">Paymob Accept</span>
              <span className="text-[10px] text-gray-500">بوابة الدفع الإلكتروني المعتمدة</span>
            </div>
          </div>
          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
            بيئة الاختبار (Sandbox)
          </span>
        </div>

        {/* Payment Amount */}
        <div className="p-4 rounded-2xl bg-gray-50 text-center space-y-1">
          <span className="text-xs text-gray-500 font-cairo">المبلغ المطلوب سداده لطلب {orderNumber}:</span>
          <div className="text-3xl font-bold font-cairo text-[#002b49]">
            {amount} ج.م
          </div>
        </div>

        {/* Method selector */}
        <div className="grid grid-cols-3 gap-2 font-cairo text-xs">
          <button
            type="button"
            onClick={() => setMethod("card")}
            className={`p-3 rounded-xl border text-center font-bold transition-all ${
              method === "card" ? "border-[#002b49] bg-blue-50 text-[#002b49]" : "border-gray-200 text-gray-600"
            }`}
          >
            بطاقة بنكية
          </button>
          <button
            type="button"
            onClick={() => setMethod("wallet")}
            className={`p-3 rounded-xl border text-center font-bold transition-all ${
              method === "wallet" ? "border-[#002b49] bg-blue-50 text-[#002b49]" : "border-gray-200 text-gray-600"
            }`}
          >
            محفظة كاش
          </button>
          <button
            type="button"
            onClick={() => setMethod("fawry")}
            className={`p-3 rounded-xl border text-center font-bold transition-all ${
              method === "fawry" ? "border-[#002b49] bg-blue-50 text-[#002b49]" : "border-gray-200 text-gray-600"
            }`}
          >
            فوري
          </button>
        </div>

        {/* Mock Card Form */}
        <div className="space-y-3 font-cairo text-xs">
          <div>
            <label className="block text-gray-600 mb-1">رقم البطاقة (تجريبي)</label>
            <input
              type="text"
              readOnly
              value="•••• •••• •••• 4242"
              className="w-full p-2.5 rounded-xl border bg-gray-50 font-mono text-center tracking-widest"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-gray-600 mb-1">تاريخ الانتهاء</label>
              <input
                type="text"
                readOnly
                value="12/28"
                className="w-full p-2.5 rounded-xl border bg-gray-50 text-center"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">رمز الأمان (CVV)</label>
              <input
                type="text"
                readOnly
                value="123"
                className="w-full p-2.5 rounded-xl border bg-gray-50 text-center"
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleCompletePayment}
          disabled={processing}
          className="w-full py-4 rounded-2xl bg-[#002b49] hover:bg-[#001c30] text-white font-cairo font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
        >
          {processing ? (
            <span>جاري الاتصال بالبنك والتحقق...</span>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              <span>تأكيد سداد {amount} ج.م تجريبياً</span>
            </>
          )}
        </button>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 font-cairo">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>تشفير 256-bit بمعايير PCI-DSS المصرفية</span>
        </div>
      </div>
    </div>
  );
}

export default function PaymobMockPage() {
  return (
    <React.Suspense fallback={<div className="py-20 text-center font-cairo">جاري تحميل بوابة الدفع...</div>}>
      <PaymobMockContent />
    </React.Suspense>
  );
}
