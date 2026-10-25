export interface SectionVisibilitySettings {
  announcementBar: boolean;        // شريط الإعلانات العلوي
  heroSection: boolean;            // قسم الهيرو الرئيسي
  aboutSection: boolean;           // قسم عن سُلاف والقصة
  artOfCosmeceuticals: boolean;    // قسم فن الـ Cosmeceuticals ولآلئ المكونات
  gallerySection: boolean;         // معرض المستحضرات على المنصات الرخامية
  clinicalStorySection: boolean;   // قسم الأدلة السريرية والدراسات المعملية
  reviewsSection: boolean;         // قسم آراء وتجارب العملاء والأطباء
  consultationSection: boolean;    // بنر الاستشارة الجلدية عبر واتساب
}

export type HomepageSectionKey =
  | "heroSection"
  | "aboutSection"
  | "artOfCosmeceuticals"
  | "gallerySection"
  | "clinicalStorySection"
  | "reviewsSection"
  | "consultationSection";

export const DEFAULT_HOMEPAGE_SECTIONS_ORDER: HomepageSectionKey[] = [
  "heroSection",
  "aboutSection",
  "artOfCosmeceuticals",
  "gallerySection",
  "clinicalStorySection",
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
  // Announcement
  announcementText?: string;
  announcementBadge?: string;

  // Hero Texts
  heroBadgeText?: string;
  heroPoemLine1?: string;
  heroPoemLine2?: string;
  heroSubheading?: string;
  heroPriceLabel?: string;
  heroPrimaryCtaText?: string;
  heroSecondaryCtaText?: string;
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

  // Gallery Texts
  galleryBadgeText?: string;
  galleryHeadingText?: string;
  galleryDescText?: string;
  galleryViewAllText?: string;

  // Clinical Evidence Texts
  clinicalBadgeText?: string;
  clinicalHeadingText?: string;
  clinicalDescText?: string;
  clinicalReadResearchText?: string;
  clinicalUsageGuideText?: string;

  // Reviews Texts
  reviewsBadgeText?: string;
  reviewsHeadingText?: string;
  reviewsDescText?: string;

  // Consultation Texts
  consultationBadgeText?: string;
  consultationHeadingText?: string;
  consultationDescText?: string;
  consultationButtonText?: string;

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
  primary: string;         // اللون الرئيسي (أخضر سُلاف الزيتوني: #485c36)
  primaryHover?: string;    // درجة التحويم للأزرار: #38492a
  secondary: string;       // اللون الثانوي / الأكسنت (بورجوندي عنابي: #610b0d)
  gold: string;            // اللون الذهبي الملكي: #d4af37
  background: string;      // لون خلفية المتجر: #f6f9e6
  surface: string;         // لون كروت المحتوى: #ffffff
  text: string;            // لون النصوص: #1c2616
}

export const DEFAULT_THEME_COLORS: ThemeColorsSettings = {
  primary: "#485c36",
  primaryHover: "#38492a",
  secondary: "#610b0d",
  gold: "#d4af37",
  background: "#f6f9e6",
  surface: "#ffffff",
  text: "#1c2616",
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
      gold: "#d4af37",
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
    `  --burgundy: ${secondary};`,
    `  --gold: ${gold};`,
    `  --gold-light: ${goldLight};`,
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
    '}',
    'body {',
    `  background-color: ${background} !important;`,
    `  color: ${text} !important;`,
    '}',
    '/* Primary Brand Overrides */',
    '.bg-\\[\\#485c36\\], .bg-\\[\\#3d502d\\], .bg-\\[\\#3a4d2c\\], .bg-\\[\\#3a4a2b\\] {',
    `  background-color: ${primary} !important;`,
    '}',
    '.text-\\[\\#485c36\\], .text-\\[\\#3d502d\\], .text-\\[\\#3a4d2c\\] {',
    `  color: ${primary} !important;`,
    '}',
    '.border-\\[\\#485c36\\], .border-\\[\\#3d502d\\] {',
    `  border-color: ${primary} !important;`,
    '}',
    '.hover\\:bg-\\[\\#3d502d\\]:hover, .hover\\:bg-\\[\\#2d3b21\\]:hover, .hover\\:bg-\\[\\#233019\\]:hover, .hover\\:bg-\\[\\#2c3821\\]:hover, .hover\\:bg-\\[\\#38482a\\]:hover {',
    `  background-color: ${primaryHover} !important;`,
    '}',
    '.hover\\:text-\\[\\#485c36\\]:hover, .hover\\:text-\\[\\#3d502d\\]:hover {',
    `  color: ${primary} !important;`,
    '}',
    '/* Gold / Luxury Accent Overrides */',
    '.text-\\[\\#d4af37\\], .text-\\[\\#aa820a\\] {',
    `  color: ${gold} !important;`,
    '}',
    '.bg-\\[\\#d4af37\\] {',
    `  background-color: ${gold} !important;`,
    '}',
    '.border-\\[\\#d4af37\\], .border-\\[\\#aa820a\\] {',
    `  border-color: ${gold} !important;`,
    '}',
    '/* Secondary / Burgundy Overrides */',
    '.text-\\[\\#610b0d\\], .text-\\[\\#ca384a\\] {',
    `  color: ${secondary} !important;`,
    '}',
    '.bg-\\[\\#610b0d\\], .bg-\\[\\#ca384a\\] {',
    `  background-color: ${secondary} !important;`,
    '}',
    '.border-\\[\\#610b0d\\] {',
    `  border-color: ${secondary} !important;`,
    '}',
    '/* Background / Canvas Overrides */',
    '.bg-\\[\\#f6f9e6\\] {',
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

export interface StoreSettings {
  brandName: string;
  brandTagline: string;
  brandTaglineEn?: string;

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
  sectionsOrder?: HomepageSectionKey[];
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

  shipping: {
    defaultUnifiedRate?: number;
    freeShippingThreshold: number;
    customGovernorateRates?: CustomGovernorateShippingRate[];
    cairoGiza?: number;
    alexDelta?: number;
    canal?: number;
    upperEgypt?: number;
  };

  multiProductPromo?: MultiProductPromotionSettings;
  checkoutFields?: CheckoutFieldsSettings;
  themeColors?: ThemeColorsSettings;

  contacts: {
    whatsapp: string;
    phone: string;
    email: string;
    instagram: string;
    facebook: string;
    tiktok: string;
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
  aboutSection: true,
  artOfCosmeceuticals: true,
  gallerySection: true,
  clinicalStorySection: true,
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
  brandName: "سُـلاف | Sulaf",
  brandTagline: "حيث يلتقي العلم الصيدلاني بالجمال.",
  brandTaglineEn: "Where Pharmaceutical Science Meets Beauty.",

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

  shipping: {
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

  contacts: {
    whatsapp: "+201099887766",
    phone: "19876",
    email: "care@sulaf.com",
    instagram: "https://instagram.com/sulaf.eg",
    facebook: "https://facebook.com/sulaf.eg",
    tiktok: "https://tiktok.com/@sulaf.eg",
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
      elementsVisibility: { ...DEFAULT_ELEMENT_VISIBILITY, ...(parsed.elementsVisibility || {}) },
      customContent: { ...(parsed.customContent || {}) },
      customContentEn: { ...(parsed.customContentEn || {}) },
      shipping: {
        ...DEFAULT_STORE_SETTINGS.shipping,
        ...(parsed.shipping || {}),
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
