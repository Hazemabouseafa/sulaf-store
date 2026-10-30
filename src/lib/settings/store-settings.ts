export interface SectionVisibilitySettings {
  announcementBar: boolean;        // شريط الإعلانات العلوي
  heroSection: boolean;            // قسم الهيرو الرئيسي
  singleProductShowcase?: boolean; // قسم استعراض المنتج الواحد الأيقوني
  aboutSection: boolean;           // قسم عن سُلاف والقصة
  artOfCosmeceuticals: boolean;    // قسم فن الـ Cosmeceuticals ولآلئ المكونات
  gallerySection: boolean;         // معرض المستحضرات على المنصات الرخامية
  clinicalStorySection: boolean;   // قسم الأدلة السريرية والدراسات المعملية
  reviewsSection: boolean;         // قسم آراء وتجارب العملاء والأطباء
  consultationSection: boolean;    // بنر الاستشارة الجلدية عبر واتساب
}

export type HomepageSectionKey =
  | "heroSection"
  | "singleProductShowcase"
  | "aboutSection"
  | "artOfCosmeceuticals"
  | "gallerySection"
  | "clinicalStorySection"
  | "reviewsSection"
  | "consultationSection";

export type CustomSectionType =
  | "banner"
  | "features"
  | "mediaText"
  | "faq"
  | "quote"
  | "richText";

export interface CustomSectionItem {
  id: string;
  titleAr: string;
  titleEn?: string;
  descAr?: string;
  descEn?: string;
  icon?: string;
  imageUrl?: string;
  linkUrl?: string;
  linkTextAr?: string;
  linkTextEn?: string;
}

export interface CustomHomepageSection {
  id: string;
  type: CustomSectionType;
  titleAr: string;
  titleEn?: string;
  subtitleAr?: string;
  subtitleEn?: string;
  badgeAr?: string;
  badgeEn?: string;
  contentAr?: string;
  contentEn?: string;
  imageUrl?: string;
  imagePosition?: "left" | "right" | "center" | "background";
  ctaTextAr?: string;
  ctaTextEn?: string;
  ctaUrl?: string;
  secondaryCtaTextAr?: string;
  secondaryCtaTextEn?: string;
  secondaryCtaUrl?: string;
  bgStyle?: "default" | "dark" | "gradient" | "glass" | "primary";
  bgColor?: string;
  textColor?: string;
  isVisible: boolean;
  items?: CustomSectionItem[];
  createdAt: number;
}

export const DEFAULT_HOMEPAGE_SECTIONS_ORDER: string[] = [
  "heroSection",
  "singleProductShowcase",
  "gallerySection",
  "reviewsSection",
  "consultationSection",
];

export interface ElementVisibilitySettings {
  // Announcement
  announcementBadge: boolean;
  announcementText: boolean;

  // Hero Section
  heroBadge: boolean;
  heroPoem: boolean;
  heroSubheading: boolean;
  heroPriceCard: boolean;
  heroPrimaryCta: boolean;
  heroSecondaryCta: boolean;
  heroTrustBadges: boolean;
  heroDossier: boolean;
  heroDossierTrinity: boolean;
  heroDossierBarrier: boolean;
  heroDossierPurity: boolean;
  heroDossierStat: boolean;

  // About Section
  aboutBadge: boolean;
  aboutHeading: boolean;
  aboutParagraph: boolean;
  aboutCta: boolean;

  // Art of Cosmeceuticals
  artBadge: boolean;
  artHeading: boolean;
  artDesc: boolean;
  artGuarantee: boolean;

  // Gallery Section
  galleryBadge: boolean;
  galleryHeading: boolean;
  galleryDesc: boolean;
  galleryViewAll: boolean;

  // Clinical Story & Evidence
  clinicalBadge: boolean;
  clinicalHeading: boolean;
  clinicalDesc: boolean;
  clinicalStats: boolean;
  clinicalButtons: boolean;

  // Reviews
  reviewsBadge: boolean;
  reviewsHeading: boolean;
  reviewsDesc: boolean;

  // Consultation Banner
  consultationBadge: boolean;
  consultationHeading: boolean;
  consultationDesc: boolean;
  consultationButton: boolean;

  // Product Page Elements
  productPodiumTagVis?: boolean;
  productSignaturePoemVis?: boolean;
  productReviewsBadgeVis?: boolean;
  productPaymentOptionsVis?: boolean;
  productGuaranteesVis?: boolean;
  productStorySectionVis?: boolean;
  productActivesSectionVis?: boolean;
  productRitualSectionVis?: boolean;
  productInciSectionVis?: boolean;

  // Philosophy Page Elements
  philosophyBadgeVis?: boolean;
  philosophyHeadingVis?: boolean;
  philosophySubtitleVis?: boolean;
  philosophyCard1Vis?: boolean;
  philosophyCard2Vis?: boolean;
  philosophyCard3Vis?: boolean;
  philosophyMoleculesVis?: boolean;
  philosophyOrbsVis?: boolean;

  // Story Page Elements
  storyTaglineVis?: boolean;
  storyPoemVis?: boolean;
  storyCard1Vis?: boolean;
  storyCard2Vis?: boolean;
  storyCard3Vis?: boolean;
  storyCard4Vis?: boolean;
  storyClosingVis?: boolean;

  // Guide Page Elements
  guideBadgeVis?: boolean;
  guideHeadingVis?: boolean;
  guideSubtitleVis?: boolean;
  guideStep1Vis?: boolean;
  guideStep2Vis?: boolean;
  guideStep3Vis?: boolean;
  guideStep4Vis?: boolean;
  guideDoctorTipVis?: boolean;

  // Contact Page Elements
  contactHeadingVis?: boolean;
  contactSubtitleVis?: boolean;
  contactChannelsVis?: boolean;
  contactWhatsappCardVis?: boolean;
  contactFormVis?: boolean;

  // Policies (Refund / Terms) Elements
  refundTitleVis?: boolean;
  refundGuaranteeVis?: boolean;
  refundDamagedVis?: boolean;
  termsTitleVis?: boolean;
  termsIntroVis?: boolean;
  termsDepositVis?: boolean;
  termsInspectionVis?: boolean;
}

export interface CustomContentSettings {
  // Announcement & Footer
  announcementText?: string;
  announcementBadge?: string;
  footerTagline?: string;
  footerNewsletterTitle?: string;
  footerNewsletterDesc?: string;

  // Section 1: Hero Top Archway Texts
  heroHeritageText?: string;
  heroBadgeText?: string;
  heroPoemLine1?: string;
  heroPoemLine2?: string;
  heroSubheading?: string;
  heroPrimaryCtaText?: string;
  heroSecondaryCtaText?: string;
  heroPriceLabel?: string;
  heroShippingNote?: string;
  heroTrustEfficacy?: string;
  heroTrustShipping?: string;
  heroDossierTitle?: string;
  heroDossierSubtitle?: string;
  heroDossierTrinityTitle?: string;
  heroDossierTrinityDesc?: string;
  heroDossierBarrierTitle?: string;
  heroDossierBarrierDesc?: string;
  heroDossierPurityTitle?: string;
  heroDossierPurityDesc?: string;
  heroDossierStatText?: string;

  // Section 2: Dark Forest Ritual Band & 4 Arches
  ritualBadgeText?: string;
  ritualHeadingText?: string;
  ritualHeadingAccent?: string;
  ritualDescText?: string;
  ritualLinkText?: string;
  ritualArch1Title?: string;
  ritualArch1Desc?: string;
  ritualArch2Title?: string;
  ritualArch2Desc?: string;
  ritualArch3Title?: string;
  ritualArch3Desc?: string;
  ritualArch4Title?: string;
  ritualArch4Desc?: string;

  // About Texts
  aboutBadgeText?: string;
  aboutHeadingText?: string;
  aboutParagraphText?: string;
  aboutCtaText?: string;

  // Art of Cosmeceuticals Texts
  artBadgeText?: string;
  artHeadingText?: string;
  artDescText?: string;
  artGuaranteeText?: string;

  // Section 3: Gallery & 5 Arches Texts
  galleryBadgeText?: string;
  galleryHeadingText?: string;
  galleryDescText?: string;
  galleryViewAllText?: string;
  arch1Title?: string;
  arch1Sub?: string;
  arch2Title?: string;
  arch2Sub?: string;
  arch3Title?: string;
  arch3Sub?: string;
  arch4Title?: string;
  arch4Sub?: string;
  arch5Title?: string;
  arch5Sub?: string;

  // Section 4: Best Seller Mandala Showcase
  bestSellerBadgeText?: string;
  bestSellerQuoteText?: string;

  // Section 5: The Sulaf Difference (4 Pillars)
  diffBadgeText?: string;
  diffHeadingText?: string;
  diff1Title?: string;
  diff1Desc?: string;
  diff2Title?: string;
  diff2Desc?: string;
  diff3Title?: string;
  diff3Desc?: string;
  diff4Title?: string;
  diff4Desc?: string;

  // Clinical Evidence Texts
  clinicalBadgeText?: string;
  clinicalHeadingText?: string;
  clinicalDescText?: string;
  clinicalReadResearchText?: string;
  clinicalUsageGuideText?: string;

  // Section 6: Reviews Texts
  reviewsBadgeText?: string;
  reviewsHeadingText?: string;
  reviewsDescText?: string;
  reviewsAddBtnText?: string;

  // Section 7: Consultation Banner Texts
  consultationBadgeText?: string;
  consultationHeadingText?: string;
  consultationDescText?: string;
  consultationShopBtnText?: string;
  consultationButtonText?: string;
  consultationSideLabel1?: string;
  consultationSideLabel2?: string;

  // Product Page Texts
  productPodiumTag?: string;
  productSignaturePoem?: string;
  productReviewsBadge?: string;
  productPaymentOptionsHeading?: string;
  productDepositTitle?: string;
  productDepositDesc?: string;
  productFullPayTitle?: string;
  productFullPayDesc?: string;
  productAddToCartBtn?: string;
  productGuarantee1?: string;
  productGuarantee2?: string;
  productGuarantee3?: string;
  productStoryBadge?: string;
  productStoryTitle?: string;
  productStoryParagraph1?: string;
  productStoryParagraph2?: string;
  productStoryParagraph3?: string;
  productActivesBadge?: string;
  productActivesTitle?: string;
  productActivesDesc?: string;
  productRitualBadge?: string;
  productRitualTitle?: string;
  productRitualSubtitle?: string;
  productRitualStep1Phase?: string;
  productRitualStep1Text?: string;
  productRitualStep2Phase?: string;
  productRitualStep2Text?: string;
  productRitualStep3Phase?: string;
  productRitualStep3Text?: string;
  productClinicalNote?: string;
  productInciTitle?: string;
  productInciIntro?: string;

  // Philosophy Page Texts
  philosophyBadgeText?: string;
  philosophyHeadingText?: string;
  philosophySubtitleText?: string;
  philosophyCard1Title?: string;
  philosophyCard1Desc?: string;
  philosophyCard2Title?: string;
  philosophyCard2Desc?: string;
  philosophyCard3Title?: string;
  philosophyCard3Desc?: string;
  philosophyMoleculesTitle?: string;

  // Story Page Texts
  storyTaglineLine1?: string;
  storyTaglineLine2?: string;
  storyPoemQuote?: string;
  storyCard1Badge?: string;
  storyCard1Text?: string;
  storyCard2Badge?: string;
  storyCard2Text?: string;
  storyCard3Badge?: string;
  storyCard3Text?: string;
  storyCard4Badge?: string;
  storyCard4Text?: string;
  storyClosingTitle?: string;
  storyClosingDecorative?: string;

  // Guide Page Texts
  guideBadgeText?: string;
  guideHeadingText?: string;
  guideSubtitleText?: string;
  guideStep1Title?: string;
  guideStep1Desc?: string;
  guideStep2Title?: string;
  guideStep2Desc?: string;
  guideStep3Title?: string;
  guideStep3Desc?: string;
  guideStep4Title?: string;
  guideStep4Desc?: string;
  guideDoctorTipText?: string;

  // Contact Page Texts
  contactHeadingText?: string;
  contactSubtitleText?: string;
  contactChannelsTitle?: string;
  contactAddressText?: string;
  contactEmailText?: string;
  contactPhoneText?: string;
  contactWhatsappTitle?: string;
  contactWhatsappDesc?: string;
  contactWhatsappBtnText?: string;
  contactFormTitle?: string;

  // Policies Texts
  refundTitleText?: string;
  refundGuaranteeTitle?: string;
  refundGuaranteeText?: string;
  refundDamagedTitle?: string;
  refundDamagedText?: string;
  termsTitleText?: string;
  termsIntroText?: string;
  termsDepositTitle?: string;
  termsDepositText?: string;
  termsInspectionTitle?: string;
  termsInspectionText?: string;
}

export type ShippingProviderType = "stox" | "bosta" | "aramex" | "mylerz" | "custom";

export interface ShippingProviderConfig {
  id: ShippingProviderType;
  nameAr: string;
  nameEn: string;
  enabled: boolean;
  apiKey: string;
  apiSecret?: string;
  accountNumber?: string;
  baseUrl: string;
  trackingEndpoint?: string;
  trackingUrlTemplate: string;
  authHeaderType?: "Bearer" | "Basic" | "ApiKey" | "Custom";
  authHeaderName?: string;
  webhookSecret?: string;
  webhookUrl?: string;
  isSandbox: boolean;
  notes?: string;
}

export const DEFAULT_SHIPPING_PROVIDERS: Record<ShippingProviderType, ShippingProviderConfig> = {
  stox: {
    id: "stox",
    nameAr: "STOX Express (مصر)",
    nameEn: "STOX Express (Egypt)",
    enabled: true,
    apiKey: "",
    baseUrl: "https://merchants.stox-eg.com/api/v1",
    trackingEndpoint: "/shipments/track/{tracking}",
    trackingUrlTemplate: "https://merchants.stox-eg.com/track/{tracking}",
    isSandbox: true,
    notes: "شركة الشحن الافتراضية الرسمية لتغطية كافة محافظات جمهورية مصر العربية.",
  },
  bosta: {
    id: "bosta",
    nameAr: "Bosta (بوسطة)",
    nameEn: "Bosta Shipping",
    enabled: false,
    apiKey: "",
    baseUrl: "https://api.bosta.co/api/v0",
    trackingEndpoint: "/deliveries/{tracking}",
    trackingUrlTemplate: "https://bosta.co/tracking/{tracking}",
    isSandbox: true,
    notes: "شحن سريع وتغطية مكثفة مع إشعارات تسليم للعملاء.",
  },
  aramex: {
    id: "aramex",
    nameAr: "Aramex (أرامكس)",
    nameEn: "Aramex Express",
    enabled: false,
    apiKey: "",
    apiSecret: "",
    accountNumber: "",
    baseUrl: "https://ws.aramex.net/ShippingAPI.V2",
    trackingEndpoint: "/Tracking/Service_1_0.svc/json/TrackShipments",
    trackingUrlTemplate: "https://www.aramex.com/track/results?shipmentNumber={tracking}",
    isSandbox: true,
    notes: "شحن محلي وإقليمي موثوق مع بوليصات رقمية متقدمة.",
  },
  mylerz: {
    id: "mylerz",
    nameAr: "Mylerz (مايلرز)",
    nameEn: "Mylerz Express Egypt",
    enabled: false,
    apiKey: "",
    baseUrl: "https://api.mylerz.net/api",
    trackingEndpoint: "/Orders/GetTracking",
    trackingUrlTemplate: "https://track.mylerz.com/{tracking}",
    isSandbox: true,
    notes: "توصيل خلال نفس اليوم واليوم التالي في القاهرة والإسكندرية.",
  },
  custom: {
    id: "custom",
    nameAr: "شركة شحن مخصصة (Custom API)",
    nameEn: "Custom Shipping Provider API",
    enabled: false,
    apiKey: "",
    apiSecret: "",
    baseUrl: "https://api.yourshippingcarrier.com",
    trackingEndpoint: "/track/{tracking}",
    trackingUrlTemplate: "https://yourshippingcarrier.com/track/{tracking}",
    authHeaderType: "Bearer",
    authHeaderName: "Authorization",
    isSandbox: true,
    notes: "ربط مرن لأي شركة شحن أخرى عبر Webhook أو REST API وبوليصة تتبع مباشرة.",
  },
};

export interface CustomGovernorateShippingRate {
  governorate: string;
  rate: number;
  shippingFee?: number;
}

export interface MultiProductPromotionSettings {
  enabled: boolean;
  minQuantity: number;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  freeShippingEnabled: boolean;
}

export interface CheckoutFieldsSettings {
  showBirthdate: boolean;
  showClosePerson: boolean;
}

export interface ThemeColorsSettings {
  primary: string;         // اللون الرئيسي (الأخير في الصورة: #485c36)
  primaryHover?: string;    // درجة التحويم للأزرار: #38492a
  secondary: string;       // اللون الثانوي (الأول في الصورة: #610b0d)
  gold: string;            // لون الأكسنت (الرابع في الصورة: #ca384a)
  background: string;      // لون خلفية المتجر (الثاني في الصورة: #f6f9e6)
  surface: string;         // لون كروت المحتوى: #ffffff
  text: string;            // لون النصوص: #1c2616
  rose?: string;           // الورد الناعم (الثالث في الصورة: #f3a5a1)
  crimson?: string;        // القرمزي الحريري (الرابع في الصورة: #ca384a)
}

export const DEFAULT_THEME_COLORS: ThemeColorsSettings = {
  primary: "#610b0d", // اللون الأول في الصورة: العنابي القرطبي الملكي (اللون السائد)
  primaryHover: "#470708", // درجة تحويم داكنة فاخرة
  secondary: "#610b0d", // تم تحويل كافة الظلال الخضراء بالكامل إلى اللون الأول #610b0d
  gold: "#ca384a", // اللون الرابع في الصورة: القرمزي الحريري (لون جانبي للعروض والخصومات)
  background: "#f6f9e6", // اللون الثاني في الصورة: العاجي الناعم الموحد
  surface: "#ffffff",
  text: "#220809", // نصوص بلون داكن فخم مائل للعنابي العميق
  rose: "#f3a5a1", // اللون الثالث في الصورة: الورد الناعم (لون جانبي)
  crimson: "#ca384a", // اللون الرابع في الصورة: القرمزي (لون جانبي)
};

export interface ThemePreset {
  id: string;
  nameAr: string;
  nameEn: string;
  descAr: string;
  colors: ThemeColorsSettings;
}

export const LUXURY_THEME_PRESETS: ThemePreset[] = [
  {
    id: "sulaf_signature",
    nameAr: "سُـلاف الأندلسي الملكي (الأصلي)",
    nameEn: "Sulaf Signature Andalusian",
    descAr: "الزيتوني الأندلسي العريق مع الرق العاجي والذهب المعتق والعنابي القرطبي",
    colors: {
      primary: "#485c36",
      primaryHover: "#38492a",
      secondary: "#610b0d",
      gold: "#ca384a",
      background: "#f6f9e6",
      surface: "#ffffff",
      text: "#1c2616",
    },
  },
  {
    id: "emerald_pharma",
    nameAr: "الزمرد الصيدلاني النقي",
    nameEn: "Pharmaceutical Emerald",
    descAr: "طابع علمي سريري فاخر بظلال الزمرد العميقة مع خلفية قطنية ناصعة",
    colors: {
      primary: "#1b4d3e",
      primaryHover: "#13382d",
      secondary: "#85263a",
      gold: "#c5a059",
      background: "#f4f8f5",
      surface: "#ffffff",
      text: "#11221b",
    },
  },
  {
    id: "velvet_ruby",
    nameAr: "الياقوت المخملي والورد",
    nameEn: "Velvet Ruby & Rose",
    descAr: "طابع أنثوي مفعم بالفخامة والجاذبية بنفحات الياقوت الإمبراطوري",
    colors: {
      primary: "#5e1922",
      primaryHover: "#471018",
      secondary: "#2c4826",
      gold: "#d4af37",
      background: "#faf5f5",
      surface: "#ffffff",
      text: "#221114",
    },
  },
  {
    id: "royal_sapphire",
    nameAr: "اللازورد والذهب الملوكي",
    nameEn: "Midnight Royal Sapphire",
    descAr: "الأزرق الملكي الدوائي مع بريق الذهب ووضوح سريري فائق",
    colors: {
      primary: "#193554",
      primaryHover: "#11243a",
      secondary: "#7e1528",
      gold: "#dfb15b",
      background: "#f3f6fa",
      surface: "#ffffff",
      text: "#0f1c2b",
    },
  },
  {
    id: "warm_cashmere",
    nameAr: "الكشمير والتوابل الأندلسية",
    nameEn: "Warm Cashmere & Amber",
    descAr: "دفء رمال الأندلس ونعومة الكشمير مع العنبر الذهبي الخالص",
    colors: {
      primary: "#5c3d22",
      primaryHover: "#432b17",
      secondary: "#7c221a",
      gold: "#dca238",
      background: "#fbf7f0",
      surface: "#ffffff",
      text: "#24180e",
    },
  },
];

export function adjustHexBrightness(hex: string, percent: number): string {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return hex;
  const num = parseInt(clean, 16);
  let r = (num >> 16) + Math.round((255 * percent) / 100);
  let g = ((num >> 8) & 0x00ff) + Math.round((255 * percent) / 100);
  let b = (num & 0x0000ff) + Math.round((255 * percent) / 100);
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export function generateThemeCss(colors: ThemeColorsSettings = DEFAULT_THEME_COLORS): string {
  const primary = colors.primary || DEFAULT_THEME_COLORS.primary;
  const primaryHover = colors.primaryHover || adjustHexBrightness(primary, -15);
  const secondary = colors.secondary || DEFAULT_THEME_COLORS.secondary;
  const gold = colors.gold || DEFAULT_THEME_COLORS.gold;
  const goldLight = adjustHexBrightness(gold, 25);
  const background = colors.background || DEFAULT_THEME_COLORS.background;
  const surface = colors.surface || DEFAULT_THEME_COLORS.surface;
  const text = colors.text || DEFAULT_THEME_COLORS.text;
  const border = adjustHexBrightness(background, -10);

  return [
    ':root {',
    `  --primary: ${primary};`,
    `  --primary-dark: ${primaryHover};`,
    `  --primary-light: ${adjustHexBrightness(primary, 15)};`,
    `  --burgundy: ${primary};`,
    `  --olive: ${secondary};`,
    `  --gold: ${gold};`,
    `  --gold-light: ${goldLight};`,
    `  --pink-soft: ${colors.rose || '#f3a5a1'};`,
    `  --red-accent: ${gold};`,
    `  --background: ${background};`,
    `  --cream: ${background};`,
    `  --foreground: ${text};`,
    `  --border: ${border};`,
    `  --sulaf-primary: ${primary};`,
    `  --sulaf-primary-hover: ${primaryHover};`,
    `  --sulaf-secondary: ${secondary};`,
    `  --sulaf-gold: ${gold};`,
    `  --sulaf-bg: ${background};`,
    `  --sulaf-surface: ${surface};`,
    `  --sulaf-text: ${text};`,
    `  --sulaf-border: ${border};`,
    `  --sulaf-rose: ${colors.rose || '#f3a5a1'};`,
    `  --sulaf-crimson: ${gold};`,
    `  --sulaf-olive: ${primary};`,
    '}',
    'body {',
    `  background-color: ${background} !important;`,
    `  color: ${text} !important;`,
    '}',
    '/* All Green shades converted to Primary Burgundy (#610b0d) */',
    '.bg-\\[\\#485c36\\], .bg-\\[\\#38492a\\], .bg-\\[\\#3a4d2c\\], .bg-\\[\\#3a4a2b\\], .bg-\\[\\#3d502d\\], .bg-\\[\\#2d3b21\\], .bg-\\[\\#233019\\], .bg-\\[\\#2c3821\\], .bg-\\[\\#18271b\\], .bg-\\[\\#162519\\], .bg-\\[\\#1f3322\\], .bg-\\[\\#142217\\], .bg-\\[\\#1f3123\\], .bg-\\[\\#243928\\], .bg-\\[\\#222b1a\\], .bg-\\[\\#22301e\\], .bg-\\[\\#24301a\\], .bg-\\[\\#1f2915\\], .bg-\\[\\#1c2616\\], .bg-\\[\\#610b0d\\], .bg-emerald-600, .bg-emerald-700, .bg-emerald-800, .bg-green-600, .bg-green-700 {',
    `  background-color: ${primary} !important;`,
    '}',
    '.text-\\[\\#485c36\\], .text-\\[\\#38492a\\], .text-\\[\\#3a4d2c\\], .text-\\[\\#3a4a2b\\], .text-\\[\\#3d502d\\], .text-\\[\\#2c3821\\], .text-\\[\\#24301a\\], .text-\\[\\#1f2915\\], .text-\\[\\#22301e\\], .text-\\[\\#1c2616\\], .text-\\[\\#610b0d\\], .text-emerald-600, .text-emerald-700, .text-green-600, .text-green-700 {',
    `  color: ${primary} !important;`,
    '}',
    '.border-\\[\\#485c36\\], .border-\\[\\#38492a\\], .border-\\[\\#3d502d\\], .border-\\[\\#2c3821\\], .border-\\[\\#610b0d\\], .border-emerald-600, .border-green-600 {',
    `  border-color: ${primary} !important;`,
    '}',
    '.hover\\:bg-\\[\\#3d502d\\]:hover, .hover\\:bg-\\[\\#2d3b21\\]:hover, .hover\\:bg-\\[\\#233019\\]:hover, .hover\\:bg-\\[\\#2c3821\\]:hover, .hover\\:bg-\\[\\#38482a\\]:hover, .hover\\:bg-\\[\\#470708\\]:hover {',
    `  background-color: ${primaryHover} !important;`,
    '}',
    '.hover\\:text-\\[\\#485c36\\]:hover, .hover\\:text-\\[\\#3d502d\\]:hover, .hover\\:text-\\[\\#610b0d\\]:hover {',
    `  color: ${primary} !important;`,
    '}',
    '/* Carmine & Gold Accent Overrides (#ca384a) */',
    '.text-\\[\\#d4af37\\], .text-\\[\\#aa820a\\], .text-\\[\\#ca384a\\] {',
    `  color: ${gold} !important;`,
    '}',
    '.bg-\\[\\#d4af37\\], .bg-\\[\\#ca384a\\] {',
    `  background-color: ${gold} !important;`,
    '}',
    '.border-\\[\\#d4af37\\], .border-\\[\\#aa820a\\], .border-\\[\\#ca384a\\] {',
    `  border-color: ${gold} !important;`,
    '}',
    '/* Soft Rose Accents (#f3a5a1) */',
    '.text-\\[\\#f3a5a1\\] {',
    `  color: ${colors.rose || '#f3a5a1'} !important;`,
    '}',
    '.bg-\\[\\#f3a5a1\\] {',
    `  background-color: ${colors.rose || '#f3a5a1'} !important;`,
    '}',
    '/* Background / Canvas Overrides (#f6f9e6) */',
    '.bg-\\[\\#f4f1e6\\], .bg-\\[\\#f6f9e6\\] {',
    `  background-color: ${background} !important;`,
    '}',
    '.bg-\\[\\#fafcf3\\], .bg-\\[\\#fbf9f0\\], .bg-\\[\\#fcfdfa\\] {',
    `  background-color: ${surface} !important;`,
    '}',
    '.border-\\[\\#dbe2bd\\], .border-\\[\\#e2e8c0\\] {',
    `  border-color: ${border} !important;`,
    '}',
    '/* Scrollbars */',
    '::-webkit-scrollbar-track {',
    `  background: ${background} !important;`,
    '}',
    '::-webkit-scrollbar-thumb {',
    `  background: ${primary} !important;`,
    '}',
    '::-webkit-scrollbar-thumb:hover {',
    `  background: ${primaryHover} !important;`,
    '}',
  ].join('\n');
}

export interface LiveTextOverride {
  text?: string;
  href?: string;
  target?: string;
  color?: string;
  fontSize?: string;
  fontWeight?: string;
  fontFamily?: string;
  isHidden?: boolean;
  isDeleted?: boolean;
}

export interface CustomSocialLink {
  id: string;
  platform: string;
  title: string;
  url: string;
  enabled?: boolean;
}

export interface SocialMediaSettings {
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  twitter?: string;
  youtube?: string;
  snapchat?: string;
  telegram?: string;
  whatsapp?: string;
  linkedin?: string;
  pinterest?: string;
  customLinks?: CustomSocialLink[];
}

export interface StoreSettings {
  defaultLanguage?: "ar" | "en";
  brandName: string;
  brandTagline: string;
  brandTaglineEn?: string;
  featuredProductId?: string;

  ourStory?: {
    taglineLine1: string;
    taglineLine2: string;
    paragraph1: string;
    paragraph2: string;
    paragraph3: string;
    paragraph4: string;
    closingTitle: string;
    closingDecorative: string;
  };

  announcement: {
    enabled: boolean;
    text: string;
    badge: string;
  };

  hero: {
    poemLine1: string;
    poemLine2: string;
    heading: string;
    subheading: string;
    badge: string;
    ctaText: string;
  };

  sectionsVisibility: SectionVisibilitySettings;
  sectionsOrder?: string[];
  customSections?: CustomHomepageSection[];
  elementsVisibility: ElementVisibilitySettings;
  customContent: CustomContentSettings;
  customContentEn?: CustomContentSettings;

  payment: {
    depositAmount: number;
    allowFullPayment: boolean;
    allowDeposit: boolean;
    instapayHandle: string;
    vodafoneCash: string;
  };

  paymob: {
    enabled: boolean;
    isSandbox: boolean;
    apiKey: string;
    secretKey: string;
    publicKey: string;
    hmacSecret: string;
    cardIntegrationId: string;
    walletIntegrationId: string;
    iframeId: string;
  };

  gatewaysMode?: "both" | "paymob_only" | "sha7nawy_only";

  sha7nawy?: {
    enabled: boolean;
    isSandbox: boolean;
    baseUrl: string;
    publicKey: string;
    secretKey: string;
    appName: string;
    webhookUrl: string;
  };

  shipping: {
    activeProvider: ShippingProviderType;
    defaultUnifiedRate?: number;
    freeShippingThreshold: number;
    customGovernorateRates?: CustomGovernorateShippingRate[];
    cairoGiza?: number;
    alexDelta?: number;
    canal?: number;
    upperEgypt?: number;
    providers?: Record<ShippingProviderType, ShippingProviderConfig>;
  };

  multiProductPromo?: MultiProductPromotionSettings;
  checkoutFields?: CheckoutFieldsSettings;
  themeColors?: ThemeColorsSettings;
  customLinks?: Record<string, string>;
  liveTextOverrides?: Record<string, LiveTextOverride>;

  socialMedia?: SocialMediaSettings;

  contacts: {
    whatsapp: string;
    phone: string;
    email: string;
    instagram: string;
    facebook: string;
    tiktok: string;
    twitter?: string;
    youtube?: string;
    snapchat?: string;
    telegram?: string;
    linkedin?: string;
    pinterest?: string;
  };

  products: {
    roughAwayPrice: number;
    roughAwayOriginalPrice: number;
    inStock: boolean;
    stockCount: number;
    absolutesPrice?: number;
    absolutesOriginalPrice?: number;
  };

  admin: {
    username: string;
    password: string;
  };
}

export const DEFAULT_SECTION_VISIBILITY: SectionVisibilitySettings = {
  announcementBar: true,
  heroSection: true,
  aboutSection: false,
  artOfCosmeceuticals: false,
  gallerySection: true,
  clinicalStorySection: false,
  reviewsSection: true,
  consultationSection: true,
};

export const DEFAULT_ELEMENT_VISIBILITY: ElementVisibilitySettings = {
  announcementBadge: true,
  announcementText: true,

  heroBadge: true,
  heroPoem: true,
  heroSubheading: true,
  heroPriceCard: true,
  heroPrimaryCta: true,
  heroSecondaryCta: true,
  heroTrustBadges: true,
  heroDossier: true,
  heroDossierTrinity: true,
  heroDossierBarrier: true,
  heroDossierPurity: true,
  heroDossierStat: true,

  aboutBadge: true,
  aboutHeading: true,
  aboutParagraph: true,
  aboutCta: true,

  artBadge: true,
  artHeading: true,
  artDesc: true,
  artGuarantee: true,

  galleryBadge: true,
  galleryHeading: true,
  galleryDesc: true,
  galleryViewAll: true,

  clinicalBadge: true,
  clinicalHeading: true,
  clinicalDesc: true,
  clinicalStats: true,
  clinicalButtons: true,

  reviewsBadge: true,
  reviewsHeading: true,
  reviewsDesc: true,

  consultationBadge: true,
  consultationHeading: true,
  consultationDesc: true,
  consultationButton: true,

  productPodiumTagVis: true,
  productSignaturePoemVis: true,
  productReviewsBadgeVis: true,
  productPaymentOptionsVis: true,
  productGuaranteesVis: true,
  productStorySectionVis: true,
  productActivesSectionVis: true,
  productRitualSectionVis: true,
  productInciSectionVis: true,

  // Philosophy Page Elements
  philosophyBadgeVis: true,
  philosophyHeadingVis: true,
  philosophySubtitleVis: true,
  philosophyCard1Vis: true,
  philosophyCard2Vis: true,
  philosophyCard3Vis: true,
  philosophyMoleculesVis: true,
  philosophyOrbsVis: true,

  // Story Page Elements
  storyTaglineVis: true,
  storyPoemVis: true,
  storyCard1Vis: true,
  storyCard2Vis: true,
  storyCard3Vis: true,
  storyCard4Vis: true,
  storyClosingVis: true,

  // Guide Page Elements
  guideBadgeVis: true,
  guideHeadingVis: true,
  guideSubtitleVis: true,
  guideStep1Vis: true,
  guideStep2Vis: true,
  guideStep3Vis: true,
  guideStep4Vis: true,
  guideDoctorTipVis: true,

  // Contact Page Elements
  contactHeadingVis: true,
  contactSubtitleVis: true,
  contactChannelsVis: true,
  contactWhatsappCardVis: true,
  contactFormVis: true,

  // Policies Elements
  refundTitleVis: true,
  refundGuaranteeVis: true,
  refundDamagedVis: true,
  termsTitleVis: true,
  termsIntroVis: true,
  termsDepositVis: true,
  termsInspectionVis: true,
};

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  defaultLanguage: "en",
  brandName: "سُـلاف | Sulaf",
  brandTagline: "حيث يلتقي العلم الصيدلاني بالجمال.",
  brandTaglineEn: "Where Pharmaceutical Science Meets Beauty.",
  featuredProductId: "prod-absolutes-cream",

  ourStory: {
    taglineLine1: "SULAF | سُلاف",
    taglineLine2: "Where Pharmaceutical Science Meets Beauty.",
    paragraph1: "من عبق الهوية العربية، وسحر الروح الأندلسية، وُلدت سُلاف؛ حيث يلتقي العلم الصيدلاني بفنّ العناية بالجمال.",
    paragraph2: "نؤمن أن الجمال ليس مجرد مظهر، بل رحلة من الفهم والعناية والتوازن؛ لذلك نجمع بين المعرفة الصيدلانية، وفهم احتياجات البشرة، وفلسفة العناية المدروسة، لنقدّم تجربة تتجاوز المألوف.",
    paragraph3: "في سُلاف، لا نرى العناية بالبشرة مجرد خطوات، بل لغةً من الرفق، وعلمًا يُترجم إلى عناية، وجمالًا تُصاغ تفاصيله بعناية.",
    paragraph4: "نستلهم من تراثنا العربي أصالته، ومن الأندلس روحها الشعرية، ومن العلم دقّته؛ لنصنع هويةً تحتفي بجمالك المعاصر دون أن تنسى جذورها.",
    closingTitle: "سُلاف… حين يلتقي العلم بالجمال، وتُروى العناية بروحٍ عربية.",
    closingDecorative: "مَا كَانَ فِي رِفْقٍ يُدَاوِينَا، سُلَافٌ بِهِ."
  },

  announcement: {
    enabled: true,
    text: "شحن مجاني وسريع لكافة المحافظات على الطلبات فوق 800 ج — اطلبي عبوتك الآن بضمان النتائج",
    badge: "عرض إطلاق محدود",
  },

  hero: {
    poemLine1: "ما كان في رفقٍ يداوينا سلافُ به",
    poemLine2: "إلّا تحوّل حسنًا لا ينهزمُ",
    heading: "الجمال الأندلسي يلتقي بالطب السريري",
    subheading: "تركيبة علاجية متقدمة بتركيز 30% يوريا نقية و2% حمض الساليسيليك والسيراميدات لترميم حاجز البشرة، والقضاء الجذري على مظهر جلد الوزة والخشونة المتصلبة من أول 7 أيام.",
    badge: "حيث يلتقي العلم الصيدلاني بالجمال",
    ctaText: "اطلبي عبوتك الآن",
  },

  sectionsVisibility: DEFAULT_SECTION_VISIBILITY,
  sectionsOrder: DEFAULT_HOMEPAGE_SECTIONS_ORDER,
  customSections: [],
  elementsVisibility: DEFAULT_ELEMENT_VISIBILITY,
  customContent: {},
  customContentEn: {},

  payment: {
    depositAmount: 100,
    allowFullPayment: true,
    allowDeposit: true,
    instapayHandle: "sulaf@instapay",
    vodafoneCash: "01099887766",
  },

  paymob: {
    enabled: true,
    isSandbox: true,
    apiKey: "ENV_OR_TEST_API_KEY",
    secretKey: "sec_test_sulaf_gateway_accept_2026",
    publicKey: "pub_test_sulaf_gateway_accept_2026",
    hmacSecret: "hmac_secret_sulaf_paymob_hash_2026",
    cardIntegrationId: "482019",
    walletIntegrationId: "482020",
    iframeId: "847291",
  },

  gatewaysMode: "both",

  sha7nawy: {
    enabled: true,
    isSandbox: true,
    baseUrl: "https://gate.sha7nawy.com",
    publicKey: "",
    secretKey: "",
    appName: "Sulaf-Store",
    webhookUrl: "/api/webhooks/sha7nawy",
  },

  shipping: {
    activeProvider: "stox",
    defaultUnifiedRate: 45,
    freeShippingThreshold: 800,
    customGovernorateRates: [
      { governorate: "أسوان", rate: 65 },
      { governorate: "الوادي الجديد", rate: 75 },
      { governorate: "مطروح", rate: 70 },
      { governorate: "شمال سيناء", rate: 80 },
      { governorate: "جنوب سيناء", rate: 80 },
      { governorate: "البحر الأحمر", rate: 75 },
    ],
    cairoGiza: 45,
    alexDelta: 55,
    canal: 60,
    upperEgypt: 70,
    providers: DEFAULT_SHIPPING_PROVIDERS,
  },

  multiProductPromo: {
    enabled: true,
    minQuantity: 2,
    discountType: "PERCENTAGE",
    discountValue: 10,
    freeShippingEnabled: true,
  },

  checkoutFields: {
    showBirthdate: true,
    showClosePerson: true,
  },

  themeColors: DEFAULT_THEME_COLORS,
  customLinks: {},
  liveTextOverrides: {},

  socialMedia: {
    instagram: "https://instagram.com/sulaf.eg",
    facebook: "https://facebook.com/sulaf.eg",
    tiktok: "https://tiktok.com/@sulaf.eg",
    twitter: "",
    youtube: "",
    snapchat: "",
    telegram: "",
    whatsapp: "+201099887766",
    linkedin: "",
    pinterest: "",
    customLinks: [],
  },

  contacts: {
    whatsapp: "+201099887766",
    phone: "19876",
    email: "care@sulaf.com",
    instagram: "https://instagram.com/sulaf.eg",
    facebook: "https://facebook.com/sulaf.eg",
    tiktok: "https://tiktok.com/@sulaf.eg",
    twitter: "",
    youtube: "",
    snapchat: "",
    telegram: "",
    linkedin: "",
    pinterest: "",
  },

  products: {
    roughAwayPrice: 420,
    roughAwayOriginalPrice: 530,
    inStock: true,
    stockCount: 142,
    absolutesPrice: 420,
    absolutesOriginalPrice: 530,
  },

  admin: {
    username: "admin",
    password: "sulaf2026",
  },
};

const SETTINGS_STORAGE_KEY = "sulaf_storefront_settings_v1";

export function getClientSettings(): StoreSettings {
  if (typeof window === "undefined") return DEFAULT_STORE_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return DEFAULT_STORE_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_STORE_SETTINGS,
      ...parsed,
      sectionsVisibility: { ...DEFAULT_SECTION_VISIBILITY, ...(parsed.sectionsVisibility || {}) },
      sectionsOrder: Array.isArray(parsed.sectionsOrder) && parsed.sectionsOrder.length > 0 ? parsed.sectionsOrder : DEFAULT_HOMEPAGE_SECTIONS_ORDER,
      customSections: Array.isArray(parsed.customSections) ? parsed.customSections : [],
      elementsVisibility: { ...DEFAULT_ELEMENT_VISIBILITY, ...(parsed.elementsVisibility || {}) },
      customContent: { ...(parsed.customContent || {}) },
      customContentEn: { ...(parsed.customContentEn || {}) },
      shipping: {
        ...DEFAULT_STORE_SETTINGS.shipping,
        ...(parsed.shipping || {}),
        activeProvider: parsed.shipping?.activeProvider || DEFAULT_STORE_SETTINGS.shipping.activeProvider,
        providers: {
          ...DEFAULT_SHIPPING_PROVIDERS,
          ...(parsed.shipping?.providers || {}),
        },
        customGovernorateRates: parsed.shipping?.customGovernorateRates || DEFAULT_STORE_SETTINGS.shipping.customGovernorateRates,
      },
      multiProductPromo: {
        ...DEFAULT_STORE_SETTINGS.multiProductPromo,
        ...(parsed.multiProductPromo || {}),
      },
      checkoutFields: {
        ...DEFAULT_STORE_SETTINGS.checkoutFields,
        ...(parsed.checkoutFields || {}),
      },
      themeColors: {
        ...DEFAULT_THEME_COLORS,
        ...(parsed.themeColors || {}),
      },
      socialMedia: {
        ...DEFAULT_STORE_SETTINGS.socialMedia,
        ...(parsed.socialMedia || {}),
        customLinks: Array.isArray(parsed.socialMedia?.customLinks)
          ? parsed.socialMedia.customLinks
          : [],
      },
      contacts: {
        ...DEFAULT_STORE_SETTINGS.contacts,
        ...(parsed.contacts || {}),
      },
    };
  } catch (e) {
    return DEFAULT_STORE_SETTINGS;
  }
}

export function saveClientSettings(settings: StoreSettings): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    window.dispatchEvent(new Event("sulaf_settings_updated"));
  } catch (e) {
    console.error("Failed to save settings locally", e);
  }
}
