# متجر سُـــلَاف | Sulaf Cosmeceuticals
> «ما كان في رفقٍ يداوينا سلافُ به إلّا تحوّل حسنًا لا ينهزمُ»

مشروع متجر إلكتروني فاخر متكامل وعالي الأداء لمستحضرات التجميل العلاجية (Cosmeceuticals)، مستوحى من الجمال الأندلسي العريق، ومبني بأحدث تقنيات الويب السريعة والحديثة:
**Next.js 15 (App Router) + TypeScript + Tailwind CSS + Prisma ORM + PostgreSQL (Neon) + Stox Egypt Shipping + Paymob Accept + Framer Motion + Lenis Smooth Scroll**.

---

## 💎 الهوية والتصميم المعتمد
- **الاسم والشعار**: سلاف (Sulaf) بشعار الوردة الهندسية الأندلسية ذات الـ 8 بتلات + خط عربي كاليغرافي فاخر + الشعار الشعري في الهيرو.
- **لوحة الألوان الملكية (Design Tokens)**:
  - **الأخضر الطاغي (Primary)**: `#485c36` (الهيرو، الأزرار، والفوتر)
  - **الكريمي الأندلسي (Background/Surface)**: `#f6f9e6` (الخلفية والبطاقات)
  - **البورجندي الملكي (Accent/Borders)**: `#610b0d` (للتفاصيل والحدود الفاخرة)
  - **الوردي الناعم (Highlight)**: `#f3a5a1` (للإشارات والـ hover)
  - **الأحمر التنبيهي (Sale/Alert)**: `#ca384a` (للخصومات وتأكيدات الدفع)
- **الخطوط**:
  - عربي: Amiri و Aref Ruqaa للعناوين الشعرية + Cairo للنصوص والواجهات.
  - إنجليزي: Cormorant Garamond للعناوين الفاخرة + Inter للأرقام والنصوص.

---

## 🧪 المستحضر العلاجي الأول (Seeded Product)
**Sulaf Rough Away Intensive Clinical Cream**:
- **30% Pure Medical Urea**: تفكيك كيراتين جلد الوزة وترطيب عميق حتى أعمق طبقات الجلد.
- **2% Pure Salicylic Acid (BHA)**: تنقية المسام ومضاد سريري للاحمرار والالتهاب.
- **12% Ammonium Lactate**: تسريع التقشير الفسيولوجي واستعادة مرونة البشرة.
- **Bio-Identical Barrier Complex**: سيراميدات معملية مطابقة حيوياً لحبس الترطيب 48 ساعة.
- **سعر العبوة**: 420 ج.م (أو حجز بعربون 100 ج.م فقط).

---

## 🚀 المميزات والأنظمة المكتملة

### 1. تجربة حركة وأنيميشن 60fps فريدة
- **Lenis Smooth Scroll**: تصفح انسيابي فاخر يحترم تفضيل تقليل الحركة.
- **Preloader الوردة الأندلسية**: رسم مسار الوردة الهندسية الأندلسية بتقنية SVG Path Animation ثم انفتاحها للـ Hero.
- **Hero Section**: ظهور النص الشعري كلمة بكلمة بقناع كاشف (Mask Reveal) مع نقش أندلسي دوار ثلاثي الأبعاد.
- **Interactive Pearl Orbs Component**: كرات لؤلؤية ثلاثية الأبعاد تتبع حركة الماوس وتتفاعل مع الـ Scroll، وتكشف التركيب الجزيئي لكل مكوّن فعال عند الضغط.
- **Marble Podium Showcase**: عرض المستحضرات على منصات رخامية عاكسة ثلاثية الأبعاد بظلال وانعكاسات واقعية.
- **Cart Drawer جانبي**: حقيبة مشتريات جانبية سريعة مع عداد الشحن المجاني وحساب العربون الفوري.

### 2. نظام الدفع الثنائي المتطور (Dual-Payment Engine)
- خياران واضحان للعميل:
  1. **الدفع بالكامل الآن** مع خصم فوري.
  2. **دفع عربون 100 ج.م فقط** وسداد المتبقي عند الاستلام لمندوب الشحن (COD).
- بوابات الدفع:
  - **Paymob Accept**: بطاقات بنكية، محافظ إلكترونية، فوري، مع دعم Intention API وتدقيق توقيع HMAC Webhook.
  - **التحويل اليدوي (InstaPay / المحافظ كاش)**: عرض بيانات الحساب (`sulaf.care@instapay`)، رفع صورة الإيصال في الـ Checkout، وزر فتح واتساب برسالة جاهزة تتضمن رقم الطلب والمبلغ للاعتماد الفوري.

### 3. تكامل الشحن المصري مع شركة Stox (Logistics)
- مكتبة معزولة وآمنة `lib/shipping/stox.ts` متصلة ببوابة `merchants.stox-eg.com`.
- احتساب دقيق لقيمة الـ COD (المبلغ المتبقي بعد خصم العربون المسدد).
- حساب تكلفة الشحن آلياً بحسب المحافظة المصرية مع ميزة الشحن المجاني فوق 850 ج.م.
- توليد وتتبع الشحنات لحظياً عبر `/track` وعرض مسار الطرد والمندوب.
- مهمة دورية Cron Job على Vercel `/api/cron/sync-stox` كل 20 دقيقة لمزامنة حالات التسليم.

### 4. لوحة تحكم الأدمن الشاملة (`/admin`)
- مؤشرات أداء حية (إجمالي المبيعات، العربونات المحصلة، المتبقي قيد التحصيل مع مناديب Stox).
- عارض إيصالات التحويل (Receipt Inspector) للمعاينة والاعتماد أو الرفض بضغطة واحدة.
- زر 1-Click لإصدار بوليصة شحن Stox وطباعة الفاتورة الرسمية.
- إدارة المنتجات والمكونات الكيميائية وتعديل إعدادات المتجر وقيمة العربون وأرقام إنستاباي.

### 5. بوابة العميل (`/account`)
- تسجيل دخول سريع وآمن عبر Google.
- عرض "طلباتي" بخط زمني تفاعلي لتتبع خط سير الشحنة.
- زر لسداد المتبقي إلكترونياً عند الاستلام.
- العناوين المسجلة، الكوبونات والعروض الخاصة (VIP Vouchers).

---

## 🛠️ خطوات التشغيل المحلي (Local Development)

### 1. تثبيت الحزم
```bash
npm install
```

### 2. إعداد متغيرات البيئة
انسخ ملف `.env.example` إلى `.env`:
```bash
cp .env.example .env
```
وقم بملء البيانات (PostgreSQL DATABASE_URL، STOX_API_KEY، PAYMOB_KEYS، وغيرها).

### 3. توليد Prisma وتغذية البيانات (Seed)
```bash
npx prisma generate
npx tsx prisma/seed.ts
```

### 4. تشغيل خادم التطوير
```bash
npm run dev
```
افتح المتصفح على: `http://localhost:3000`
- المتجر الرئيسي: `http://localhost:3000`
- صفحة المستحضر: `http://localhost:3000/product/sulaf-rough-away`
- صفحة السلة والـ Checkout: `http://localhost:3000/checkout`
- تتبع الشحنة مع Stox: `http://localhost:3000/track?id=SLF-8821`
- لوحة تحكم الأدمن: `http://localhost:3000/admin`
- حساب العميل: `http://localhost:3000/account`

### 5. تشغيل اختبارات الحسابات واللوجستيات
```bash
npx tsx scripts/verify-store.ts
```

---

## ☁️ خطوات النشر على Vercel (Production Deployment)

1. **ارفع المشروع إلى مستودع GitHub**:
   ```bash
   git init
   git add .
   git commit -m "feat: complete Sulaf luxury cosmeceuticals store"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **الربط مع Vercel**:
   - توجه إلى لوحة [Vercel Dashboard](https://vercel.com) واضغط **Add New Project**.
   - اختر مستودع المشروع واضبط إعدادات Build Command: `npm run build`.

3. **إدخال متغيرات البيئة (Environment Variables) في Vercel**:
   - `DATABASE_URL`: رابط قاعدة بيانات PostgreSQL (Neon / Supabase).
   - `AUTH_SECRET`: مفتاح تشفير عشوائي للجلسات.
   - `GOOGLE_CLIENT_ID` و `GOOGLE_CLIENT_SECRET`: لتسجيل دخول العملاء بجوجل.
   - `PAYMOB_API_KEY`, `PAYMOB_SECRET_KEY`, `PAYMOB_PUBLIC_KEY`, `PAYMOB_HMAC_SECRET`, `PAYMOB_INTEGRATION_CARD_ID`, `PAYMOB_INTEGRATION_WALLET_ID`.
   - `STOX_API_KEY`: مفتاح الـ API الرسمي لشركة الشحن Stox Egypt.
   - `STOX_BASE_URL`: `https://merchants.stox-eg.com/api/v1`
   - `STOX_TEST_MODE`: اضبطه على `false` في الإنتاج الحي أو `true` للتجربة.
   - `WHATSAPP_NUMBER`: رقم واتساب المتجر (مثال: `201099887766`).
   - `INSTAPAY_HANDLE`: معرف إنستاباي (مثال: `sulaf.care@instapay`).
   - `CRON_SECRET`: مفتاح حماية مهام المزامنة المجدولة.
   - `NEXT_PUBLIC_SITE_URL`: رابط موقعك المباشر على Vercel (مثال: `https://sulaf.vercel.app`).

4. **الـ Cron Jobs**:
   ملف `vercel.json` جاهز ومضبوط لمزامنة شحنات Stox كل 20 دقيقة تلقائياً.

---

## 📜 رخصة الاستخدام
تم تطوير المشروع بكامل حقوق الملكية الفكرية لصالح براند **سُلاف | Sulaf Cosmeceuticals**.
