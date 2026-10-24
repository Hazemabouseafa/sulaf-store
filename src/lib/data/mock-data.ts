export interface ActiveIngredientData {
  id: string;
  nameAr: string;
  nameEn: string;
  concentration: string;
  functionAr: string;
  functionEn: string;
  scientificDescriptionAr: string;
  moleculeSvg: string;
}

export interface ProductVariantData {
  id: string;
  titleAr: string;
  titleEn: string;
  sku: string;
  price: number;
  stock: number;
  volumeMl: number;
}

export interface ReviewData {
  id: string;
  authorName: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  isVerifiedPurchase: boolean;
}

export interface ActiveIngredientDetail {
  id: string;
  name: string;
  nameAr?: string;
  nameEn?: string;
  description: string;
  descriptionAr?: string;
  descriptionEn?: string;
  actionAr?: string;
  actionEn?: string;
  svgType: string;
  isTrinity: boolean;
  concentration: string;
}

export interface ProductData {
  id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
  subtitleAr: string;
  subtitleEn: string;
  shortDescription?: string;
  descriptionAr: string;
  descriptionEn: string;
  
  // Rich sections
  storyTitle?: string;
  storyParagraphs?: string[];
  activesTitle?: string;
  activeIngredientsList?: ActiveIngredientDetail[];
  howToUseTitle?: string;
  howToUseSteps?: string[];
  clinicalNote?: string;
  inciTitle?: string;
  inciIntro?: string;
  inci?: string;
  signatureTitle?: string;
  signatureArabic?: string;
  signatureTranslation?: string;

  usageInstructionsAr: string;
  usageInstructionsEn?: string;
  clinicalResultsAr: string;
  routineStepsAr: string[];
  skinTypeAr: string;
  concernsAr: string[];
  price: number;
  compareAtPrice: number;
  stock: number;
  sku: string;
  badgeAr?: string;
  accentColor: string;
  images: {
    url: string;
    alt: string;
    isPrimary: boolean;
  }[];
  variants: ProductVariantData[];
  activeIngredients: ActiveIngredientData[];
  reviews: ReviewData[];
  rating: number;
  reviewsCount: number;
}

export const SULAF_SETTINGS = {
  brandNameAr: "سُلاف",
  brandNameEn: "Sulaf",
  poeticSlogan: "ما كان في رِفقٍ يُداوينا سُلافُ بهِ.. إلّا تحوّل حُسنًا لا ينهزمُ.",
  taglineEn: "Where Pharmaceutical Science Meets Beauty.",
  depositAmountEgp: 100,
  instapayHandle: "sulaf.care@instapay",
  vodafoneCashNumber: "01099887766",
  whatsappNumber: "201099887766",
  supportEmail: "care@sulaf.com",
  currencyAr: "ج.م",
  currencyEn: "EGP",
  freeShippingThreshold: 850,
  shippingRates: {
    cairo_giza: 45,
    alex_delta: 55,
    canal_upper_egypt: 70,
    remote: 90,
  },
};

export const MOCK_PRODUCTS: ProductData[] = [
  {
    "id": "prod-absolutes-cream",
    "nameAr": "Absolutes Smoothing Body Cream",
    "nameEn": "Absolutes Smoothing Body Cream",
    "slug": "absolutes-smoothing-body-cream",
    "subtitleAr": "Architectural Keratolytic Reset | 30% Pure Urea • 10% Ammonium Lactate • 2% Salicylic Acid",
    "subtitleEn": "Architectural Keratolytic Reset | 30% Pure Urea • 10% Ammonium Lactate • 2% Salicylic Acid",
    "descriptionAr": "Absolutes Smoothing Body Cream is a clinical masterpiece formulated to end the war between your skin and coarse exfoliants. Crafted with a medical-grade 30% Urea core, 10% Ammonium Lactate, and an intensified, 2% Salicylic Acid matrix, it breaks the mineralized bonds of stubborn follicular plugs from the root up. No micro-tears. No rebound coarseness. Just pure, uncompromised biological alchemy that turns weathered texture into silk.",
    "descriptionEn": "Absolutes Smoothing Body Cream is a clinical masterpiece formulated to end the war between your skin and coarse exfoliants. Crafted with a medical-grade 30% Urea core, 10% Ammonium Lactate, and an intensified, 2% Salicylic Acid matrix, it breaks the mineralized bonds of stubborn follicular plugs from the root up. No micro-tears. No rebound coarseness. Just pure, uncompromised biological alchemy that turns weathered texture into silk.",
    "usageInstructionsAr": "Phase 1: Massage 2-3 evenings weekly into targeted zones. Phase 2: Maintain with 1-2 applications weekly.",
    "clinicalResultsAr": "• 96% complete skin texture transformation to silk smoothness within 7 days.\n• 91% noticeable reduction in keratosis pilaris redness and rough follicular bumps within 14 days.\n• 48 hours of continuous cellular moisture lock proven via TEWL barrier testing.\n• 100% gentle, dermatologically certified formula free from harsh fragrances and sulfates.",
    "routineStepsAr": [
        "Target: Apply directly to clean, dry problem areas—upper arms, thighs, elbows, heels, or wherever keratin build-up creates roughness.",
        "Phase 1 (The Shock Reset - Weeks 1 & 2): Massage a dime-sized amount 2 to 3 evenings per week into targeted zones until absorbed.",
        "Phase 2 (Architectural Maintenance - Week 3 onward): Maintain smooth texture with 1 to 2 applications weekly, ideally layered under your barrier lipid shield."
    ],
    "skinTypeAr": "All skin types prone to roughness, keratosis pilaris, strawberry bumps, or compromised barrier.",
    "concernsAr": [
        "Keratosis Pilaris (Strawberry Bumps)",
        "Rough Arms & Legs",
        "Elbows & Knees Hardness",
        "Cracked Heels"
    ],
    "price": 420,
    "compareAtPrice": 530,
    "stock": 140,
    "sku": "SLF-ABS-001",
    "badgeAr": "Architectural Reset",
    "accentColor": "#485c36",
    "images": [
        {
            "url": "/brand/sulaf-flower-symbol.png",
            "alt": "Absolutes Smoothing Body Cream Front View",
            "isPrimary": true
        },
        {
            "url": "/brand/sulaf-logo-full.png",
            "alt": "Absolutes Smoothing Body Cream Brand Lockup",
            "isPrimary": false
        }
    ],
    "variants": [
        {
            "id": "var-200ml",
            "titleAr": "Clinical Jar 200ml",
            "titleEn": "Clinical Jar 200ml",
            "sku": "SLF-ABS-200ML",
            "price": 420,
            "stock": 140,
            "volumeMl": 200
        }
    ],
    "activeIngredients": [],
    "reviews": [
        {
            "id": "rev-1",
            "authorName": "Dr. Iman El-Shennawy (Dermatologist)",
            "rating": 5,
            "title": "Architectural reset for keratosis pilaris",
            "comment": "In my clinical practice, I recommended Absolutes Smoothing Body Cream for patients with chronic Keratosis Pilaris. Within 7 days, follicular erythema and bumps subsided remarkably without irritation.",
            "date": "2026-10-15",
            "isVerifiedPurchase": true
        },
        {
            "id": "rev-2",
            "authorName": "Nadia Mamdouh",
            "rating": 5,
            "title": "Transformed rough texture into pure silk",
            "comment": "The 30% Urea and 10% Ammonium Lactate combination is unmatched. Fast-absorbing, velvet touch, and no sticky residue.",
            "date": "2026-10-18",
            "isVerifiedPurchase": true
        }
    ],
    "rating": 4.96,
    "reviewsCount": 128,
    "shortDescription": "Architectural Keratolytic Reset: 30% Pure Urea, 10% Ammonium Lactate and 2% Salicylic Acid for rough, bumpy skin. Structural restoration, not friction.",
    "storyTitle": "The Story: Structural Restoration, Not Friction",
    "storyParagraphs": [
        "When ancient artisans raised the palaces of Andalusia, they understood a fundamental law of balance: stone never submits to brute force, only to enduring geometry.",
        "Your skin speaks the same language. Those rough, strawberry bumps aren't debris to be scrubbed away—they are fragile ramparts, desperate keratin shields raised by a barrier stripped of moisture.",
        "Absolutes Smoothing Body Cream is a clinical masterpiece formulated to end the war between your skin and coarse exfoliants. Crafted with a medical-grade 30% Urea core, 10% Ammonium Lactate, and an intensified, 2% Salicylic Acid matrix, it breaks the mineralized bonds of stubborn follicular plugs from the root up. No micro-tears. No rebound coarseness. Just pure, uncompromised biological alchemy that turns weathered texture into silk."
    ],
    "activesTitle": "The Triple Clinical Complex & Key Actives",
    "activeIngredientsList": [
        {
            "id": "urea-30",
            "name": "30% Medical-Grade Pure Urea",
            "description": "The ultimate hydro-keratolytic agent. Dissolves hardened cellular mortar and draws hydration deep into the stratum corneum, softening calcified keratin plugs from within.",
            "svgType": "urea",
            "isTrinity": true,
            "concentration": "30%"
        },
        {
            "id": "lactate-10",
            "name": "10% Ammonium Lactate",
            "description": "A bio-identical alpha-hydroxy derivative that gently loosens micro-scales while replenishing moisture reservoirs, leaving an instantly elastic, pliant finish.",
            "svgType": "lactate",
            "isTrinity": true,
            "concentration": "10%"
        },
        {
            "id": "salicylic-2",
            "name": "2% Lipophilic Salicylic Acid (BHA)",
            "description": "Penetrates straight into the lipid-dense follicular funnel, dissolving trapped sebum, loosening the stubborn plug at its anchor point, and smoothing out rough bumps.",
            "svgType": "salicylic",
            "isTrinity": true,
            "concentration": "2%"
        },
        {
            "id": "niacinamide-5",
            "name": "5% Pure Niacinamide (Vitamin B3)",
            "description": "Intercepts post-inflammatory redness, clears follicular shadowing, and fortifies the cellular envelope.",
            "svgType": "niacinamide",
            "isTrinity": false,
            "concentration": "5%"
        },
        {
            "id": "ceramides-triad",
            "name": "Biomimetic Ceramide Triad (NP, AP, EOP) + Phytosphingosine",
            "description": "Restores the physiological lipid mortar, rebuilding the barrier as active exfoliation takes place to prevent rebound keratosis.",
            "svgType": "ceramide",
            "isTrinity": false,
            "concentration": "Triad"
        },
        {
            "id": "centella-allantoin",
            "name": "Centella Asiatica (Madecassoside) & Allantoin",
            "description": "Quenches perifollicular heat, calming irritation and cocooning sensitized skin in soothing relief.",
            "svgType": "centella",
            "isTrinity": false,
            "concentration": "Bio-Calm"
        }
    ],
    "howToUseTitle": "Ritual & Architectural Application",
    "howToUseSteps": [
        "Target: Apply directly to clean, dry problem areas—upper arms, thighs, elbows, heels, or wherever keratin build-up creates roughness.",
        "Phase 1 (The Shock Reset - Weeks 1 & 2): Massage a dime-sized amount 2 to 3 evenings per week into targeted zones until absorbed.",
        "Phase 2 (Architectural Maintenance - Week 3 onward): Maintain smooth texture with 1 to 2 applications weekly, ideally layered under your barrier lipid shield."
    ],
    "clinicalNote": "Clinical Note: Formulated without harsh physical abrasives, drying sulfates, or pore-clogging waxes. Always apply daytime SPF to sun-exposed treated zones.",
    "inciTitle": "Full INCI Composition",
    "inciIntro": "Formulated to strict clinical and cosmetic purity standards:",
    "inci": "Aqua (Deionized Water), Urea, Ammonium Lactate, Niacinamide, Salicylic Acid, Butyrospermum Parkii (Shea) Butter, Cetearyl Alcohol, Glycerin, Polysorbate 60, C12-15 Alkyl Benzoate, Panthenol (D-Panthenol), Centella Asiatica Leaf Extract, Ceramide NP, Ceramide AP, Ceramide EOP, Phytosphingosine, Cholesterol, Tocopherol (Vitamin E), Allantoin, Argania Spinosa (Argan) Kernel Oil, Persea Gratissima (Avocado) Oil, Prunus Amygdalus Dulcis (Sweet Almond) Oil, Dimethicone, Theobroma Cacao (Cocoa) Seed Butter, Cetyl Alcohol, Phenoxyethanol, Ethylhexylglycerin, Disodium EDTA, Fragrance.",
    "signatureTitle": "The Sulaf Signature",
    "signatureArabic": "ما كان في رِفقٍ يُداوينا سُلافُ بهِ.. إلّا تحوّل حُسنًا لا ينهزمُ.",
    "signatureTranslation": "Never was Sulaf's gentleness poured into our healing, but that grace triumphed, undefeated."
},
 
  {
    id: "prod-velvet-cleanser",
    nameAr: "سلاف غسول السيراميدات المخملي | Velvet Barrier Cleanser",
    nameEn: "Sulaf Velvet Barrier Cleanser",
    slug: "sulaf-velvet-barrier-cleanser",
    subtitleAr: "غسول زيتي-كريمي لطيف مهدئ ومرمم للحاجز الواقي مع الأحماض الأمينية",
    subtitleEn: "Soothing Oil-to-Cream Barrier Cleanser with Amino Acids",
    descriptionAr: `غسول طبي خفيف خالي تماماً من الصابون والكبريتات، ينظف البشرة بلطف دون تجريدها من زيوتها الطبيعية. غني بالسيراميدات والأحماض الأمينية وخلاصة البابونج الأندلسي لتهدئة البشرة المتهيجة وتهيئتها لاستقبال كريم Absolutes Smoothing Body Cream.`,
    descriptionEn: `Sulfate-free lipid-replenishing cleanser engineered to gently purify while preserving vital epidermal moisture.`,
    usageInstructionsAr: `يُدلك على بشرة مبللة صباحاً ومساءً ثم يُشطف بماء فاتر.`,
    clinicalResultsAr: `100% حفاظ على توازن الحاجز الدهني دون أي شعور بالشد أو الجفاف.`,
    routineStepsAr: ["الخطوة الأولى في الروتين العلاجي اليومي."],
    skinTypeAr: "كافة أنواع البشرة الحساسة والجافة",
    concernsAr: ["التحسس", "الجفاف بعد الاستحمام", "ضعف حاجز البشرة"],
    price: 290,
    compareAtPrice: 350,
    stock: 90,
    sku: "SLF-CLN-002",
    badgeAr: "جديد سلاف",
    accentColor: "#610b0d",
    images: [
      {
        url: "/brand/sulaf-flower-symbol.png",
        alt: "Sulaf Velvet Cleanser",
        isPrimary: true,
      },
    ],
    variants: [
      {
        id: "var-cln-250",
        titleAr: "عبوة مضخة 250 مل",
        titleEn: "Pump Bottle 250ml",
        sku: "SLF-CLN-250ML",
        price: 290,
        stock: 90,
        volumeMl: 250,
      },
    ],
    activeIngredients: [
      {
        id: "ing-amino",
        nameAr: "أحماض أمينية نقية",
        nameEn: "Pure Amino Complex",
        concentration: "5%",
        functionAr: "تغذية بروتينات البشرة وموازنة درجة الحموضة الفسيولوجية (pH 5.5)",
        functionEn: "Maintains optimal acid mantle",
        scientificDescriptionAr: "تحافظ على غشاء البشرة الحامضي الواقي من الميكروبات الضارة.",
        moleculeSvg: "amino",
      },
    ],
    rating: 4.8,
    reviewsCount: 64,
    reviews: [],
  },
  {
    id: "prod-gold-nectar",
    nameAr: "سلاف إكسير أوراق الذهب والأزيليك | Gold Radiance Nectar",
    nameEn: "Sulaf Gold Radiance Azelaic Nectar",
    slug: "sulaf-gold-radiance-nectar",
    subtitleAr: "سيروم توحيد لون البشرة بصفائح الذهب عيار 24 وحمض الأزيليك 10%",
    subtitleEn: "Radiance Serum with 24K Gold Flakes and 10% Azelaic Acid",
    descriptionAr: `تحفة فنية تجمع بين صفائح الذهب الأندلسي النقي وحمض الأزيليك المركز بنسبة 10% والنياسيناميد. يستهدف التصبغات وآثار الحبوب ومسام الجلد، ويضفي إشراقة مخملية ونضارة فورية لا مثيل لها.`,
    descriptionEn: `Luminous cosmeceutical blend infused with real gold particles and 10% Azelaic Acid for spotless radiance.`,
    usageInstructionsAr: `توضع 3 إلى 4 قطرات على الوجه والرقبة مساءً قبل المرطب.`,
    clinicalResultsAr: `89% توحيد ملحوظ في درجات لون البشرة خلال 21 يوماً.`,
    routineStepsAr: ["يوضع على بشرة نظيفة بعد الغسول وقبل الكريم."],
    skinTypeAr: "جميع أنواع البشرة التي تعاني من التصبغات والشحوب",
    concernsAr: ["التصبغات", "آثار الحبوب", "المسام المتسعة", "فقدان النضارة"],
    price: 580,
    compareAtPrice: 720,
    stock: 75,
    sku: "SLF-GLD-003",
    badgeAr: "إصدار فاخر محدود",
    accentColor: "#d4af37",
    images: [
      {
        url: "/brand/sulaf-flower-symbol.png",
        alt: "Sulaf Gold Radiance Nectar",
        isPrimary: true,
      },
    ],
    variants: [
      {
        id: "var-gld-30",
        titleAr: "قارورة قطارة زجاجية 30 مل",
        titleEn: "Glass Dropper Bottle 30ml",
        sku: "SLF-GLD-30ML",
        price: 580,
        stock: 75,
        volumeMl: 30,
      },
    ],
    activeIngredients: [
      {
        id: "ing-azelaic",
        nameAr: "حمض الأزيليك الصيدلاني",
        nameEn: "Pharmaceutical Azelaic Acid",
        concentration: "10%",
        functionAr: "تثبيط إنزيم التيروزيناز المفرز للتصبغات وتصفية شوائب المسام",
        functionEn: "Melanin inhibitor & pore clarifying",
        scientificDescriptionAr: "مركب طبيعي مثبت في توحيد لون البشرة ومحاربة التصبغات العنيدة.",
        moleculeSvg: "azelaic",
      },
    ],
    rating: 5.0,
    reviewsCount: 38,
    reviews: [],
  },
];

export const MOCK_BLOG_POSTS = [
  {
    id: "post-1",
    slug: "urea-30-science-rough-skin",
    titleAr: "علم اليوريا 30%: كيف تفكك الخشونة وتعيد إحياء ملمس الحرير؟",
    titleEn: "The Molecular Science of 30% Urea in Keratosis Pilaris",
    excerptAr: "دليل سريري شامل يشرح الميكانيزم الجزيئي لليوريا بتركيز 30% وكيف تذيب سدادات الكيراتين دون إتلاف خلايا البشرة الحية.",
    author: "د. هبة منصور - رئيسة أبحاث سلاف",
    publishedAt: "2026-10-18",
    readTimeAr: "5 دقائق قراءة",
    coverImage: "/brand/sulaf-palette.jpg",
  },
  {
    id: "post-2",
    slug: "andalusian-beauty-meets-cosmeceuticals",
    titleAr: "الفلسفة الأندلسية في قوارير معملية: عندما تلتقي الرفاهية بالطب السريري",
    titleEn: "Andalusian Botanical Heritage Meets Clinical Cosmeceuticals",
    excerptAr: "كيف استلهمنا هندسة الزخارف الأندلسية وتناغم الطبيعة لتصميم مستحضرات علاجية متقدمة تحقق نتائج حقيقية.",
    author: "فريق الإبداع والتركيب - سلاف",
    publishedAt: "2026-10-12",
    readTimeAr: "4 دقائق قراءة",
    coverImage: "/brand/sulaf-flower-symbol.png",
  },
];
