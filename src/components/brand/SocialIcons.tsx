import React from "react";

export type SocialPlatformType =
  | "instagram"
  | "facebook"
  | "tiktok"
  | "twitter"
  | "x"
  | "youtube"
  | "snapchat"
  | "telegram"
  | "whatsapp"
  | "linkedin"
  | "pinterest"
  | "threads"
  | "custom";

export interface SocialPlatformMeta {
  key: SocialPlatformType;
  nameAr: string;
  nameEn: string;
  placeholder: string;
  color: string;
  bgLight: string;
}

export const SUPPORTED_SOCIAL_PLATFORMS: SocialPlatformMeta[] = [
  {
    key: "instagram",
    nameAr: "إنستغرام (Instagram)",
    nameEn: "Instagram",
    placeholder: "https://instagram.com/sulaf.eg",
    color: "#E1306C",
    bgLight: "rgba(225, 48, 108, 0.1)",
  },
  {
    key: "facebook",
    nameAr: "فيسبوك (Facebook)",
    nameEn: "Facebook",
    placeholder: "https://facebook.com/sulaf.eg",
    color: "#1877F2",
    bgLight: "rgba(24, 119, 242, 0.1)",
  },
  {
    key: "tiktok",
    nameAr: "تيك توك (TikTok)",
    nameEn: "TikTok",
    placeholder: "https://tiktok.com/@sulaf.eg",
    color: "#000000",
    bgLight: "rgba(0, 0, 0, 0.08)",
  },
  {
    key: "twitter",
    nameAr: "منصة إكس / تويتر (X / Twitter)",
    nameEn: "X (Twitter)",
    placeholder: "https://x.com/sulaf_eg",
    color: "#0f1419",
    bgLight: "rgba(15, 20, 25, 0.08)",
  },
  {
    key: "youtube",
    nameAr: "يوتيوب (YouTube)",
    nameEn: "YouTube",
    placeholder: "https://youtube.com/@sulaf",
    color: "#FF0000",
    bgLight: "rgba(255, 0, 0, 0.1)",
  },
  {
    key: "snapchat",
    nameAr: "سناب شات (Snapchat)",
    nameEn: "Snapchat",
    placeholder: "https://snapchat.com/add/sulaf",
    color: "#FFFC00",
    bgLight: "rgba(255, 252, 0, 0.2)",
  },
  {
    key: "telegram",
    nameAr: "تيليجرام (Telegram)",
    nameEn: "Telegram",
    placeholder: "https://t.me/sulaf_eg",
    color: "#229ED9",
    bgLight: "rgba(34, 158, 217, 0.1)",
  },
  {
    key: "whatsapp",
    nameAr: "واتساب (WhatsApp)",
    nameEn: "WhatsApp",
    placeholder: "+201099887766 أو https://wa.me/201099887766",
    color: "#25D366",
    bgLight: "rgba(37, 211, 102, 0.1)",
  },
  {
    key: "linkedin",
    nameAr: "لينكد إن (LinkedIn)",
    nameEn: "LinkedIn",
    placeholder: "https://linkedin.com/company/sulaf",
    color: "#0A66C2",
    bgLight: "rgba(10, 102, 194, 0.1)",
  },
  {
    key: "pinterest",
    nameAr: "بينتيريست (Pinterest)",
    nameEn: "Pinterest",
    placeholder: "https://pinterest.com/sulaf",
    color: "#BD081C",
    bgLight: "rgba(189, 8, 28, 0.1)",
  },
];

export function SocialIcon({
  platform,
  className = "w-4 h-4",
}: {
  platform: string;
  className?: string;
}) {
  const norm = (platform || "").toLowerCase().trim();

  switch (norm) {
    case "instagram":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      );

    case "facebook":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      );

    case "tiktok":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.12V9.32a6.34 6.34 0 0 0-.86-.06A6.34 6.34 0 0 0 3.1 15.6a6.34 6.34 0 0 0 10.82 4.48c.03-.03.06-.06.09-.09V10.81a8.28 8.28 0 0 0 5.58 2.18V9.54a4.84 4.84 0 0 1-2.91-2.85z" />
        </svg>
      );

    case "twitter":
    case "x":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );

    case "youtube":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.376.55 9.376.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      );

    case "snapchat":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M12 2.25c-3.66 0-5.74 2.68-5.74 5.92 0 1.25.32 2.39.48 3.16-.38.19-1.15.57-1.44 1.05-.29.48-.19 1.05.19 1.34.57.38 1.44.29 2.01.1.29.77 1.05 1.63 2.11 1.92.1.38-.38.77-.96 1.05-.57.29-1.05.67-1.05 1.34 0 .67.57 1.05 1.44 1.05 1.15 0 2.11-.38 2.97-.86.86.48 1.82.86 2.97.86.86 0 1.44-.38 1.44-1.05 0-.67-.48-1.05-1.05-1.34-.57-.29-1.05-.67-.96-1.05 1.05-.29 1.82-1.15 2.11-1.92.57.19 1.44.29 2.01-.1.38-.29.48-.86.19-1.34-.29-.48-1.05-.86-1.44-1.05.16-.77.48-1.91.48-3.16 0-3.24-2.08-5.92-5.74-5.92z" />
        </svg>
      );

    case "telegram":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.52 2.77-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
        </svg>
      );

    case "whatsapp":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm0 18.12c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.36c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c.02 4.54-3.68 8.21-8.22 8.21zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.84-.86 2.05s.88 2.38 1 2.55c.12.17 1.74 2.65 4.21 3.72.59.25 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.18-.47-.3z" />
        </svg>
      );

    case "linkedin":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.79v8.37H6.46v-8.37M7.86 6.3a1.62 1.62 0 0 0-1.62 1.62c0 .9.72 1.62 1.62 1.62.9 0 1.62-.72 1.62-1.62 0-.9-.72-1.62-1.62-1.62z" />
        </svg>
      );

    case "pinterest":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M12 2a10 10 0 0 0-3.66 19.31c-.04-.84-.08-2.14.02-3.06l.72-3.08s-.18-.37-.18-.91c0-.85.5-1.49 1.11-1.49.52 0 .78.39.78.86 0 .53-.34 1.32-.51 2.05-.15.61.3 1.11.9 1.11 1.08 0 1.91-1.14 1.91-2.78 0-1.45-1.04-2.47-2.54-2.47-1.73 0-2.75 1.3-2.75 2.64 0 .52.2 1.08.45 1.39.05.06.06.12.04.18l-.17.7c-.03.11-.1.15-.22.1-1-.46-1.62-1.92-1.62-3.09 0-2.51 1.83-4.82 5.27-4.82 2.77 0 4.92 1.97 4.92 4.61 0 2.75-1.73 4.96-4.14 4.96-.81 0-1.57-.42-1.83-.92l-.5 1.9c-.18.7-.67 1.57-.99 2.1A10 10 0 1 0 12 2z" />
        </svg>
      );

    case "threads":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm3.8 12.3a4.7 4.7 0 0 1-7.6-1.8 4.6 4.6 0 0 1 2.1-5.7 4.9 4.9 0 0 1 6.3 1.4" />
          <path d="M12 8.5v5" />
        </svg>
      );

    default:
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="2" x2="22" y1="12" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      );
  }
}
