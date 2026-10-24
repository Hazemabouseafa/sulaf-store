import { PrismaClient, Role, PaymentMethod, PaymentStatus, OrderStatus, DiscountType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Sulaf | سلاف Cosmeceuticals database...");

  // 1. Settings
  const settings = [
    { key: "deposit_amount_egp", value: "100", description: "مبلغ العربون المطلوب عند اختيار الدفع بالعربون (ج.م)" },
    { key: "instapay_handle", value: "sulaf.care@instapay", description: "معرّف حساب إنستاباي لتلقي التحويلات" },
    { key: "vodafone_cash_number", value: "01099887766", description: "رقم محفظة فودافون كاش الرسمية للبراند" },
    { key: "whatsapp_number", value: "201099887766", description: "رقم واتساب خدمة العملاء وتأكيد التحويلات" },
    { key: "stox_test_mode", value: "true", description: "تفعيل البيئة التجريبية لشركة شحن Stox" },
    { key: "brand_slogan_ar", value: "ما كان في رفقٍ يداوينا سلافُ به إلّا تحوّل حسنًا لا ينهزمُ", description: "الشعار الشعري الرسمي في الهيرو" },
    { key: "shipping_fee_cairo_giza", value: "45", description: "تكلفة الشحن للقاهرة والجيزة" },
    { key: "shipping_fee_alex_delta", value: "55", description: "تكلفة الشحن للإسكندرية ومدن الدلتا" },
    { key: "shipping_fee_upper_egypt", value: "70", description: "تكلفة الشحن لمحافظات الصعيد والقناة" },
    { key: "free_shipping_threshold", value: "850", description: "الحد الأدنى للطلب للحصول على شحن مجاني" }
  ];

  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value, description: s.description },
      create: s,
    });
  }

  // 2. Users (Super Admin, Admin, Customer)
  const superAdmin = await prisma.user.upsert({
    where: { email: "admin@sulaf.com" },
    update: {},
    create: {
      name: "مدير النظام - سلاف",
      email: "admin@sulaf.com",
      phone: "+201000000001",
      role: Role.SUPER_ADMIN,
    },
  });

  const staff = await prisma.user.upsert({
    where: { email: "staff@sulaf.com" },
    update: {},
    create: {
      name: "فريق الدعم والعمليات",
      email: "staff@sulaf.com",
      phone: "+201000000002",
      role: Role.STAFF,
    },
  });

  const demoCustomer = await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: {},
    create: {
      name: "سارة الأندلسي",
      email: "customer@example.com",
      phone: "+201012345678",
      role: Role.CUSTOMER,
      addresses: {
        create: {
          fullName: "سارة الأندلسي",
          phone: "01012345678",
          governorate: "القاهرة",
          city: "التجمع الخامس",
          street: "شارع التسعين الشمالي، كمبوند النرجس",
          building: "عمارة 14، شقة 5",
          isDefault: true,
        },
      },
    },
  });

  // 3. Category & Collection
  const intensiveCareCategory = await prisma.category.upsert({
    where: { slug: "intensive-care" },
    update: {},
    create: {
      nameAr: "العناية المكثفة والترميم",
      nameEn: "Intensive Care & Barrier Repair",
      slug: "intensive-care",
      descriptionAr: "تركيبات صيدلانية متقدمة بتركيزات سريرية لعلاج جفاف وخشونة الجلد وإعادة بناء الحاجز الطبيعي.",
      descriptionEn: "Advanced pharmaceutical formulations for rough skin and cellular barrier reconstruction.",
      image: "/products/rough-away-hero.png",
    },
  });

  const andalusianCollection = await prisma.collection.upsert({
    where: { slug: "andalusian-botanical-science" },
    update: {},
    create: {
      nameAr: "مجموعة العلم والجمال الأندلسي",
      nameEn: "Andalusian Botanical Science",
      slug: "andalusian-botanical-science",
      descriptionAr: "التقاء أصالة المستخلصات النباتية النادرة بأحدث جزيئات الـ Cosmeceuticals.",
    },
  });

  // 4. Primary Product: "Absolutes Smoothing Body Cream"
  const roughAway = await prisma.product.upsert({
    where: { slug: "absolutes-smoothing-body-cream" },
    update: {},
    create: {
      nameAr: "Absolutes Smoothing Body Cream",
      nameEn: "Absolutes Smoothing Body Cream",
      slug: "absolutes-smoothing-body-cream",
      subtitleAr: "كريم الترميم السريري وعلاج جلد الوزة والخشونة المستعصية",
      subtitleEn: "Intensive Clinical Keratosis Pilaris & Rough Skin Repair Cream",
      descriptionAr: `مركب علاجي متطور يجمع بين قوة اليوريا الطبية بتركيز 30% وحمض الساليسيليك النقي 2% مع أمونيوم لاكتات ومركب السيراميدات المعملي. صُمم خصيصاً لتنعيم الجلد الخشن والمتصلب، والتخلص الجذري من مظهر "جلد الوزة" (Keratosis Pilaris)، وتجديد خلايا الأدمة مع حماية حاجز الترطيب الطبيعي للجلد دون تهيج. قوام كريمي مخملي فاخر سريع الامتصاص مع لمسة هيدرات حريرية تدوم 48 ساعة.`,
      descriptionEn: `An advanced cosmeceutical formulation delivering medical-grade 30% Urea, 2% Salicylic Acid, Ammonium Lactate, and Multi-Ceramide Barrier Complex. Specifically engineered to smooth dry stubborn texture, eliminate keratosis pilaris bumps, and deeply repair the cutaneous moisture barrier.`,
      usageInstructionsAr: `يُوضع مرتين يومياً على بشرة نظيفة وجافة في المناطق المستهدفة (الذراعين، الساقين، الركب، الأكواع، الكعبين). يُدلّك بلطف بحركات دائرية حتى تمام الامتصاص. يُنصح باستخدامه بانتظام لمدة 14 يوماً لملاحظة التحول السريري الكامل لملمس البشرة. يُرجى استخدام واقي شمس عند التعرض المباشر للأشعة.`,
      usageInstructionsEn: `Apply twice daily to clean, dry skin on targeted rough areas (arms, legs, elbows, heels). Gently massage in circular motions until fully absorbed. Consistent use for 14 days reveals silky transformation.`,
      clinicalResultsAr: `• 96% من المشاركين لاحظوا اختفاء ملمس الخشونة وتحول البشرة للنعومة الفائقة خلال 7 أيام.
• 91% انخفاض ملحوظ في احمرار ونتوءات جلد الوزة بعد 14 يوماً.
• ترطيب مستمر ومثبت معملياً لمدة 48 ساعة من الاستخدام الأول.
• 0% حالات تهيج أو تحسس جلدي في التجارب السريرية للتركيبة المتوازنة.`,
      clinicalResultsEn: `• 96% reported velvet smoothness within 7 days.
• 91% noticeable reduction in keratosis pilaris redness and bumps within 14 days.
• 48-hour continuous hydration lock.`,
      routineStepsAr: `الخطوة 1: تنظيف البشرة بغسول لطيف خالٍ من الكبريتات.
الخطوة 2: تجفيف البشرة برفق دون فرك قاسي.
الخطوة 3: توزيع كمية مناسبة من كريم Absolutes Smoothing Body Cream والتدليك بأطراف الأصابع.
الخطوة 4: الانتظار 3 دقائق لامتصاص كامل وإحساس فوري بالراحة.`,
      routineStepsEn: `Step 1: Cleanse with gentle wash. Step 2: Pat dry gently. Step 3: Massage Absolutes Smoothing Body Cream. Step 4: Allow 3 minutes for velvet finish.`,
      skinTypeAr: "البشرة الجافة، شديدة الجفاف، المتصلبة، والمعرضة لجلد الوزة والشعر تحت الجلد",
      skinTypeEn: "Dry, very dry, rough, bumpy, and KP-prone skin",
      concernsAr: "جلد الوزة (Keratosis Pilaris)، خشونة الأكواع والركب، الكعوب المتشققة، مسام الساق الداكنة، جفاف الشتاء الشديد",
      concernsEn: "Keratosis Pilaris, rough elbows & knees, cracked heels, strawberry legs",
      price: 420.0,
      compareAtPrice: 530.0,
      costPrice: 190.0,
      stock: 150,
      sku: "SLF-RGH-001",
      isPublished: true,
      isFeatured: true,
      seoTitle: "سلاف رف أواي | كريم علاج جلد الوزة والخشونة باليوريا 30% والسالسيليك",
      seoDescription: "اكتشفي Absolutes Smoothing Body Cream بتركيز اليوريا الطبي 30% وأمونيوم لاكتات 10% وحمض الساليسيليك 2% لترميم حاجز البشرة والتخلص من مظهر جلد الوزة في 7 أيام مع الدفع بالعربون أو بالكامل.",
      categoryId: intensiveCareCategory.id,
      collectionId: andalusianCollection.id,
      variants: {
        create: [
          {
            titleAr: "عبوة سريرية فاخرة 200 مل",
            titleEn: "Luxury Clinical Jar 200ml",
            sku: "SLF-RGH-200ML",
            price: 420.0,
            stock: 120,
            volumeMl: 200,
          },
          {
            titleAr: "حجم السفر والاختبار 75 مل",
            titleEn: "Travel & Trial Size 75ml",
            sku: "SLF-RGH-75ML",
            price: 240.0,
            stock: 60,
            volumeMl: 75,
          },
        ],
      },
      images: {
        create: [
          {
            url: "/brand/sulaf-flower-symbol.png",
            alt: "Absolutes Smoothing Body Cream Hero Presentation",
            order: 0,
            isPrimary: true,
          },
          {
            url: "/brand/sulaf-logo-full.png",
            alt: "Absolutes Smoothing Body Cream Branding & Package",
            order: 1,
            isPrimary: false,
          },
        ],
      },
      activeIngredients: {
        create: [
          {
            nameAr: "يوريا طبية نقية",
            nameEn: "Medical-Grade Pure Urea",
            concentration: "30%",
            functionAr: "تفكيك الروابط الكيراتينية المسببة للخشونة وتثبيت الرطوبة داخل أعمق طبقات الجلد",
            functionEn: "Keratolytic keratolysis & deep humectant cellular hydration",
            scientificDescriptionAr: "جزيء طبيعي ينتمي لعوامل الترطيب الذاتية (NMF). يعمل بتركيز 30% على إذابة تراكمات خلايا الجلد الميتة وتنعيم الحبيبات البارزة فوراً دون خدش البشرة.",
            moleculeSvg: `<svg viewBox="0 0 100 100" class="w-full h-full text-primary"><circle cx="50" cy="50" r="30" stroke="currentColor" stroke-width="2" fill="none"/><line x1="50" y1="20" x2="50" y2="40" stroke="currentColor" stroke-width="2.5"/><line x1="30" y1="65" x2="45" y2="55" stroke="currentColor" stroke-width="2.5"/><line x1="70" y1="65" x2="55" y2="55" stroke="currentColor" stroke-width="2.5"/></svg>`,
          },
          {
            nameAr: "حمض الساليسيليك النقي (BHA)",
            nameEn: "Pure Salicylic Acid (BHA)",
            concentration: "2%",
            functionAr: "اختراق مسام بصيلات الشعر وتنقيتها من الدهون وتسكين الاحمرار والالتهاب",
            functionEn: "Lipophilic pore penetrator, anti-inflammatory & exfoliating agent",
            scientificDescriptionAr: "حمض هيدروكسي بيتا محب للدهون قادر على التغلغل بعمق داخل مسام الشعر لاستهداف جذور مظهر جلد الوزة، مما يمنع انسداد البصيلات ويقلل التهيج.",
            moleculeSvg: `<svg viewBox="0 0 100 100" class="w-full h-full text-burgundy"><polygon points="50,15 80,32 80,68 50,85 20,68 20,32" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="50" cy="50" r="16" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4,3" fill="none"/></svg>`,
          },
          {
            nameAr: "أمونيوم لاكتات الدقيق",
            nameEn: "Refined Ammonium Lactate",
            concentration: "12%",
            functionAr: "تسريع التجديد الخلوي وتحفيز مرونة الجلد وحمايته من التشققات",
            functionEn: "Accelerates epidermal renewal and skin elastic compliance",
            scientificDescriptionAr: "ملح حمض اللاكتيك المتقدم الذي يعزز عملية التقشير الفسيولوجي الطبيعي ويرفع مستويات حمض الهيالورونيك الذاتي في الأنسجة.",
            moleculeSvg: `<svg viewBox="0 0 100 100" class="w-full h-full text-pink-soft"><circle cx="35" cy="50" r="18" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="65" cy="50" r="18" stroke="currentColor" stroke-width="2" fill="none"/><line x1="35" y1="50" x2="65" y2="50" stroke="currentColor" stroke-width="2.5"/></svg>`,
          },
          {
            nameAr: "مركب السيراميدات المعملي",
            nameEn: "Bio-Identical Barrier Complex",
            concentration: "Triple 1, 3, 6-II",
            functionAr: "ترميم حاجز حماية البشرة وحبس الرطوبة ومقاومة العوامل البيئية الضارة",
            functionEn: "Lipid restoration and transepidermal water loss (TEWL) defense",
            scientificDescriptionAr: "مزيج متطابق بيولوجياً من السيراميدات الأساسية مع الفايتوسفينجوزين والأحماض الدهنية يعيد بناء الطبقة الإسمنتية بين خلايا البشرة لترميم الحاجز التالف.",
            moleculeSvg: `<svg viewBox="0 0 100 100" class="w-full h-full text-gold"><path d="M20,50 Q50,20 80,50 T140,50" stroke="currentColor" stroke-width="2.5" fill="none"/><circle cx="50" cy="35" r="8" fill="currentColor"/></svg>`,
          },
        ],
      },
      reviews: {
        create: [
          {
            authorName: "د. ياسمين الشاذلي",
            rating: 5,
            title: "نتائج سريرية مبهرة على جلد الوزة",
            comment: "كنت أعاني من جلد الوزة في الذراعين لسنوات، وبعد 8 أيام فقط من استخدام Absolutes Smoothing Body Cream اختفت الحبوب الخشنة تماماً وأصبح ملمس الجلد فائق النعومة. تركيبة عالمية تضاهي أفضل المستحضرات الفرنسية.",
            isApproved: true,
            isVerifiedPurchase: true,
          },
          {
            authorName: "مريم عبد الرحمن",
            rating: 5,
            title: "أفضل كريم يوريا جربته في حياتي",
            comment: "عادة كريمات اليوريا تكون لزجة أو لها رائحة كريهة، لكن سلاف أبدعوا! قوام كريمي راقي يمتص بسرعة فائقة وترطيب يدوم ليومين كاملين. دفعت عربون 100 جنيه واستلمت خلال يومين مع شركة Stox.",
            isApproved: true,
            isVerifiedPurchase: true,
          },
          {
            authorName: "نورهان كمال",
            rating: 5,
            title: "علاج فوري لتشقق الكعبين والركب",
            comment: "نتيجته مع الأكواع والركب سحرية، من أول يومين النتيجة واضحة. تجربة الشراء والدفع السلسة وتغليف البراند الفاخر يشعرك بالفخامة الحقيقية.",
            isApproved: true,
            isVerifiedPurchase: true,
          },
        ],
      },
    },
  });

  // 5. Coupons
  await prisma.coupon.upsert({
    where: { code: "SULAF10" },
    update: {},
    create: {
      code: "SULAF10",
      discountType: DiscountType.PERCENTAGE,
      value: 10,
      minOrderValue: 400,
      maxDiscount: 100,
      isActive: true,
      usageLimit: 500,
    },
  });

  await prisma.coupon.upsert({
    where: { code: "WELCOME50" },
    update: {},
    create: {
      code: "WELCOME50",
      discountType: DiscountType.FIXED,
      value: 50,
      minOrderValue: 500,
      isActive: true,
      usageLimit: 200,
    },
  });

  // 6. Blog Category and Posts
  const blogCategory = await prisma.blogCategory.upsert({
    where: { slug: "clinical-dermatology" },
    update: {},
    create: {
      nameAr: "العلم والجلدية السريرية",
      nameEn: "Clinical Dermatology & Science",
      slug: "clinical-dermatology",
    },
  });

  await prisma.blogPost.upsert({
    where: { slug: "urea-30-science-rough-skin" },
    update: {},
    create: {
      categoryId: blogCategory.id,
      titleAr: "علم اليوريا 30%: كيف تفكك الخشونة وتعيد إحياء ملمس الحرير؟",
      titleEn: "The Science of 30% Urea: Dissolving Roughness into Velvet",
      slug: "urea-30-science-rough-skin",
      excerptAr: "دليل طبي شامل يشرح الميكانيزم الجزيئي لليوريا بتركيز 30% ودورها في استعادة حاجز البشرة والتخلص من جلد الوزة دون تهيج.",
      contentAr: `تُعد اليوريا أحد أهم المكونات الطبيعية الموجودة في عامل الترطيب الطبيعي للبشرة (NMF). ولكن عندما يصل تركيزها في التركيبات الصيدلانية إلى 30%، فإنها تتحول من مجرد مرطب سطحي إلى عامل سريري لتكسير الكيراتين المفرط (Keratolytic Agent).

في هذا المقال نستعرض كيف تتغلغل جزيئات اليوريا في ألياف الكيراتين المتصلبة لتفكيك الروابط الهيدروجينية، مما يسمح للجلد بطرد الخلايا الميتة بسلاسة فائقة، مع حبس الماء في عمق الأدمة ليتحول الملمس الخشن إلى نعومة مخملية لا تنهزم.`,
      coverImage: "/products/urea-science-cover.jpg",
      author: "د. هبة منصور - رئيسة أبحاث سلاف",
      isPublished: true,
    },
  });

  console.log("Database seeded successfully with Sulaf Cosmeceuticals catalog!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
