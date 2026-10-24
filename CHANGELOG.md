# سجل التغييرات والتحديثات — براند سُلاف | Sulaf
## [Content & Brand Update] - Absolutes Smoothing Body Cream

تم تحديث المحتوى النصي الكامل لمتجر **سُلاف (Sulaf)** بما يتماشى بدقة متناهية مع معايير وهوية البراند الطبية الفاخرة (Cosmeceuticals)، مع الحفاظ الصارم على الهوية البصرية (الزمرد الأندلسي `#485c36` والأبيض الكريمي `#f6f9e6`) وتأثيرات الحركة بدون أي تعديل.

---

### 1. إعادة تسمية المستحضر الأساسي (Product Renaming & Slugs)
- **الاسم الجديد**: `Absolutes Smoothing Body Cream`.
- **المعرف (Slug)**: تم تغييره إلى `absolutes-smoothing-body-cream`.
- **التحويل الدائم (301 Permanent Redirect)**:
  - تم ضبط التحويل الدائم عبر `next.config.ts` من المسارات القديمة:
    - `/product/sulaf-rough-away` ➔ `/product/absolutes-smoothing-body-cream` (301 Permanent)
    - `/products/sulaf-rough-away` ➔ `/product/absolutes-smoothing-body-cream` (301 Permanent)
    - `/product/rough-away` ➔ `/product/absolutes-smoothing-body-cream` (301 Permanent)
  - دعم التحويل الفوري على جانب العميل (`client-side redirect`) عبر `router.replace` داخل صفحة المستحضر عند استدعاء أي رابط قديم.
- **التحديث الشامل للبيانات**:
  - تحديث ملف المنتجات `data/products.json` و `src/lib/data/mock-data.ts`.
  - تحديث سجلات الطلبات القديمة في `data/orders.json`.
  - تحديث بيانات التهيئة `prisma/seed.ts`.
  - تنظيف كامل لجميع الإشارات القديمة في مقالات المدونة، صفحات الإرشادات، وسياسة الاسترجاع.

---

### 2. الأقسام التفصيلية الجديدة لصفحة المستحضر (`/product/absolutes-smoothing-body-cream`)
تم اعتماد النصوص الإنجليزية الموحدة والمثبتة طبياً بدقة مع عناوين وترتيبات متناسقة ثنائية اللغة:
1. **العنوان الفرعي للمنتج (Subtitle)**:
   - `Architectural Keratolytic Reset | 30% Pure Urea • 10% Ammonium Lactate • 2% Salicylic Acid`
2. **القصة السريرية (The Story: Structural Restoration, Not Friction)**:
   - إدراج الفقرات الثلاث المعتمدة بالنص الحرفي دون تعديل أو إعادة صياغة، لتوضيح الفلسفة البيولوجية لترميم سطح الجلد بدلاً من الكشط الميكانيكي.
3. **الثالوث السريري والمكونات الفعالة (The Clinical Trinity & Key Actives)**:
   - ترقية مكون اللآلئ التفاعلية (`PearlOrbs`) بست لآلئ تفاعلية تضم رسومات SVG جزيئية دقيقة (Line-Art Molecular Diagrams):
     - **الثالوث السريري الأساسي (The Trinity)**:
       1. `30% Pure Medical-Grade Urea`
       2. `10% Ammonium Lactate (Lactic Acid Salt)`
       3. `2% Bioactive Salicylic Acid (BHA)`
     - **المكونات الثانوية الداعمة (Secondary Actives)**:
       4. `5% Niacinamide (Vitamin B3)`
       5. `Biomimetic Ceramide Triad (EOP, NP, AP)`
       6. `Centella Asiatica & Pure Allantoin`
4. **طقس الاستخدام والتطبيق المعماري (Ritual & Architectural Application)**:
   - خطوات التطبيق الثلاث المعتمدة (Preparation, Application, Chrono-Absorption).
   - الملاحظة السريرية بلون العنابي الملكي (`#610b0d` Burgundy Callout): `Clinical Note: Slight transient tingling may occur...`.
5. **التركيبة الكاملة (Full INCI Composition)**:
   - الاقتباس الافتتاحي: `"Formulated with zero hidden fillers. Every molecule serves a defined dermatological purpose."`
   - قائمة المكونات الكاملة داخل أكورديون (`Accordion`) تفاعلي قابل للفتح والإغلاق ومصنف حسب الوظيفة الطبية.
6. **بصمة سُلاف (The Sulaf Signature)**:
   - عرض البيت الشعري كلمة بكلمة بحركة انسيابية (`word-by-word reveal`):
     «ما كان في رِفقٍ يُداوينا سُلافُ به إلّا تحوّل حُسنًا لا ينهزمُ»
   - الترجمة الإنجليزية الشعرية المعتمدة:
     *"Whatever Sulaf remedies with gentle grace turns into beauty that cannot be defeated."*
7. **الوصف المختصر (Short Description)**:
   - `A high-potency keratolytic treatment designed to reset compromised skin texture...`

---

### 3. هوية البراند وقصة سُلاف (Brand Identity & Story)
- **الشعار الرسمي (Tagline)**:
  - العربية: `سُلاف | Sulaf — حيث يلتقي علم الصيدلة بالجمال.`
  - الإنجليزية: `SULAF | سُلاف — Where Pharmaceutical Science Meets Beauty.`
  - تطبيق الشعار في الهيدر، الفوتر تحت الشعار، وبيانات الميتا داتا.
- **صفحة قصة سُلاف (`/story`)**:
  - الفقرات الأربع الكاملة المعتمدة التي تشرح التقاء الصيدلة الأندلسية بالنقاء الجزيئي الحديث.
  - ختام كاليغرافي عربي مركزي للبيت الشعري مع تشكيل كامل مذهّب وخط زخرفي فاخر (`Gold Decorative Divider`).
- **قسم القصة في الصفحة الرئيسية (Homepage About Section)**:
  - إدراج الفقرة الأولى من قصة سُلاف مباشرة مع زر انتقال أنيق (`اقرأ قصتنا`) يوجه إلى `/story`.

---

### 4. لوحة التحكم والإدارة الديناميكية (Admin Control Panel)
- إضافة تبويب متقدم ومخصص في لوحة التحكم (`/admin`) لإدارة:
  - شعار البراند بالعربية والإنجليزية (`brandTagline`, `brandTaglineEn`).
  - فقرات قصة سُلاف الأربع وخاتمتها الكاليغرافية كاملة.
  - جميع حقول المستحضر النصية، التركيبات، والتعليمات قابلة للتعديل والحفظ الفوري دون أي نصوص مدفونة بالكود (`No Hardcoded Data`).

---

### 5. محركات البحث والبيانات المنظمة (SEO & Structured Data)
- **JSON-LD Schema.org**:
  - إضافة مخطط `Organization` يحمل هوية البراند ورابط الموقع.
  - إضافة مخطط `Product` لمستحضر `Absolutes Smoothing Body Cream` مع الأسعار والتوفر والعلامة التجارية.
- **OpenGraph & Twitter Cards**:
  - تحديث العناوين والأوصاف الرسمية في `src/app/layout.tsx` و `src/app/sitemap.ts`.
