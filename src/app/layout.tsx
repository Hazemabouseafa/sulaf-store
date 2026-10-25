import type { Metadata } from "next";
import { Amiri, Cairo, Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { LenisProvider } from "@/components/motion/LenisProvider";
import { CartProvider } from "@/lib/cart/cart-context";
import { CustomerAuthProvider } from "@/lib/auth/customer-auth";
import { StoreSettingsProvider } from "@/lib/settings/store-settings-context";
import { LanguageProvider } from "@/lib/i18n/language-context";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { ThemeStyleInjector } from "@/components/theme/ThemeStyleInjector";
import { generateThemeCss, DEFAULT_THEME_COLORS } from "@/lib/settings/store-settings";
import fs from "fs";
import path from "path";

function getServerSettings() {
  try {
    const file = path.join(process.cwd(), "data", "store-settings.json");
    if (fs.existsSync(file)) {
      return JSON.parse(fs.readFileSync(file, "utf8"));
    }
  } catch (e) {}
  return null;
}

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-cairo",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "سُـلاف | SULAF — Where Pharmaceutical Science Meets Beauty",
  description:
    "Where Pharmaceutical Science Meets Beauty. SULAF | سُلاف — Architectural Keratolytic Reset: 30% Pure Urea, 10% Ammonium Lactate and 2% Salicylic Acid for rough, bumpy skin. Structural restoration, not friction.",
  keywords: [
    "سلاف",
    "Sulaf",
    "Absolutes Smoothing Body Cream",
    "Architectural Keratolytic Reset",
    "Urea 30%",
    "Ammonium Lactate 10%",
    "Salicylic Acid 2%",
    "Keratosis Pilaris",
    "Cosmeceuticals",
    "Where Pharmaceutical Science Meets Beauty",
  ],
  authors: [{ name: "Sulaf Cosmeceuticals Laboratories" }],
  openGraph: {
    title: "SULAF | سُلاف — Absolutes Smoothing Body Cream",
    description:
      "Architectural Keratolytic Reset: 30% Pure Urea, 10% Ammonium Lactate and 2% Salicylic Acid for rough, bumpy skin. Structural restoration, not friction.",
    url: "https://sulaf.com",
    siteName: "سلاف | Sulaf",
    images: [
      {
        url: "/brand/sulaf-logo-full.png",
        width: 800,
        height: 600,
        alt: "Absolutes Smoothing Body Cream — Sulaf Cosmeceuticals",
      },
    ],
    locale: "ar_EG",
    type: "website",
  },
  icons: {
    icon: "/brand/sulaf-flower-symbol.png",
    apple: "/brand/sulaf-flower-symbol.png",
  },
};

const jsonLdData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://sulaf.com/#organization",
      "name": "Sulaf Cosmeceuticals",
      "url": "https://sulaf.com",
      "logo": "https://sulaf.com/brand/sulaf-logo-full.png",
      "slogan": "Where Pharmaceutical Science Meets Beauty.",
      "description": "من عبق الهوية العربية، وسحر الروح الأندلسية، وُلدت سُلاف؛ حيث يلتقي العلم الصيدلاني بفنّ العناية بالجمال."
    },
    {
      "@type": "Product",
      "@id": "https://sulaf.com/product/absolutes-smoothing-body-cream#product",
      "name": "Absolutes Smoothing Body Cream",
      "image": "https://sulaf.com/brand/sulaf-flower-symbol.png",
      "description": "Architectural Keratolytic Reset: 30% Pure Urea, 10% Ammonium Lactate and 2% Salicylic Acid for rough, bumpy skin. Structural restoration, not friction.",
      "sku": "SLF-ABS-001",
      "brand": {
        "@type": "Brand",
        "name": "Sulaf"
      },
      "offers": {
        "@type": "Offer",
        "url": "https://sulaf.com/product/absolutes-smoothing-body-cream",
        "priceCurrency": "EGP",
        "price": "420",
        "priceValidUntil": "2027-12-31",
        "availability": "https://schema.org/InStock",
        "seller": {
          "@type": "Organization",
          "name": "Sulaf"
        }
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.96",
        "reviewCount": "128"
      }
    }
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const serverSettings = getServerSettings();
  const ssrThemeCss = generateThemeCss(serverSettings?.themeColors || DEFAULT_THEME_COLORS);

  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${amiri.variable} ${cairo.variable} ${cormorant.variable} ${inter.variable} antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&family=Almarai:wght@400;700;800&family=Amiri:ital,wght@0,400;0,700;1,400;1,700&family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600;1,700&display=swap"
          rel="stylesheet"
        />
        {/* SSR Theme Colors: Injected before paint for 0ms flicker */}
        <style
          id="sulaf-ssr-theme"
          dangerouslySetInnerHTML={{ __html: ssrThemeCss }}
        />
        {/* Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#f6f9e6] text-[#222b1a]">
        <LanguageProvider>
          {/* Pass live server settings to provider for zero-delay SSR */}
          <StoreSettingsProvider initialSettings={serverSettings}>
            <ThemeStyleInjector />
            <LenisProvider>
              <CartProvider>
                <CustomerAuthProvider>
                  <StorefrontShell>
                    {children}
                  </StorefrontShell>
                </CustomerAuthProvider>
              </CartProvider>
            </LenisProvider>
          </StoreSettingsProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
