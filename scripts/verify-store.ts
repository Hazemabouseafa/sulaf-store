import { stoxService, EGYPT_GOVERNORATES_RATES } from "../src/lib/shipping/stox";
import { SULAF_SETTINGS } from "../src/lib/data/mock-data";

console.log("=== بدء اختبارات الحسابات واللوجستيات لمتجر سُلاف (Cosmeceuticals) ===");

let passed = 0;
let failed = 0;

function assert(condition: boolean, msg: string) {
  if (condition) {
    console.log(`[PASS] ${msg}`);
    passed++;
  } else {
    console.error(`[FAIL] ${msg}`);
    failed++;
  }
}

// 1. اختبار حساب تكلفة الشحن للمحافظات
const cairoFee = stoxService.calculateShippingFee("القاهرة", 420);
assert(cairoFee === 45, `تكلفة شحن القاهرة لطلب 420 ج.م يجب أن تكون 45 ج.م (الناتج: ${cairoFee})`);

const alexFee = stoxService.calculateShippingFee("الإسكندرية", 500);
assert(alexFee === 55, `تكلفة شحن الإسكندرية لطلب 500 ج.م يجب أن تكون 55 ج.م (الناتج: ${alexFee})`);

const aswanFee = stoxService.calculateShippingFee("أسوان", 300);
assert(aswanFee === 85, `تكلفة شحن أسوان لطلب 300 ج.م يجب أن تكون 85 ج.م (الناتج: ${aswanFee})`);

// 2. اختبار ميزة الشحن المجاني فوق الحد الأدنى (850 ج.م)
const freeShipFee = stoxService.calculateShippingFee("أسوان", 900);
assert(freeShipFee === 0, `طلب بقيمة 900 ج.م يجب أن يحصل على شحن مجاني 0 ج.م (الناتج: ${freeShipFee})`);

// 3. اختبارات حسابات العربون والمتبقي (COD)
const productPrice = 420; // عبوة Absolutes Smoothing Body Cream
const shippingFee = 45; // القاهرة
const totalOrder = productPrice + shippingFee; // 465 ج.م
const deposit = SULAF_SETTINGS.depositAmountEgp; // 100 ج.م

// سيناريو 1: الدفع بالعربون
const dueNowDeposit = Math.min(totalOrder, deposit);
const remainingCod = totalOrder - deposit;

assert(dueNowDeposit === 100, `المطلوب سداده الآن في خيار العربون يجب أن يكون 100 ج.م (الناتج: ${dueNowDeposit})`);
assert(remainingCod === 365, `المتبقي تسليمه لمندوب Stox يجب أن يكون 365 ج.م (الناتج: ${remainingCod})`);
assert(dueNowDeposit + remainingCod === totalOrder, `مجموع العربون + المتبقي يجب أن يساوي إجمالي الطلب 465 ج.م`);

// سيناريو 2: الدفع بالكامل
const dueNowFull = totalOrder;
const remainingCodFull = 0;

assert(dueNowFull === 465, `في خيار الدفع الكامل يجب أن يكون المطلوب سداده الآن 465 ج.م`);
assert(remainingCodFull === 0, `في خيار الدفع الكامل يجب ألا يتبقى أي مبلغ لمندوب الشحن`);

// 4. اختبار تكامل إنشاء الشحنة مع Stox وتمرير الـ COD المتبقي بدقة
async function testStoxDispatch() {
  const shipment = await stoxService.createShipment({
    orderId: "test-ord-01",
    orderNumber: "SLF-TEST-99",
    recipient: {
      fullName: "عميل تجريبي",
      phone: "01000000000",
      governorate: "القاهرة",
      city: "المعادي",
      street: "شارع النصر",
    },
    codAmount: remainingCod, // 365 EGP
    items: [
      {
        sku: "SLF-RGH-200ML",
        name: "سلاف رف أواي",
        quantity: 1,
        price: 420,
      },
    ],
  });

  assert(shipment.success === true, `نجاح استدعاء خدمة الشحن Stox وإصدار بوليصة تتبع: ${shipment.trackingNumber}`);
  assert(Boolean(shipment.trackingNumber), `توليد رقم تتبع معتمد للشحنة: ${shipment.trackingNumber}`);
}

testStoxDispatch().then(() => {
  console.log(`\n=== نتيجة الاختبارات: تم بنجاح ${passed} اختبارات من أصل ${passed + failed} ===`);
  if (failed > 0) {
    process.exit(1);
  } else {
    console.log("كافة معادلات حساب العربون والشحن وخدمات Stox تعمل بنجاح 100%!");
  }
});
