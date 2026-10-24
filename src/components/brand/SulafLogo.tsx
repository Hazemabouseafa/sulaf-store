import React from "react";
import Image from "next/image";
import Link from "next/link";

interface SulafLogoProps {
  variant?: "full" | "flower" | "typography" | "horizontal";
  size?: "sm" | "md" | "lg" | "xl";
  color?: "burgundy" | "green" | "cream" | "gold";
  showPoem?: boolean;
  className?: string;
  href?: string;
}

export function SulafFlowerIcon({
  size = 48,
  className = "",
  animated = false,
}: {
  size?: number;
  className?: string;
  animated?: boolean;
}) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
    >
      <Image
        src="/brand/sulaf-flower-symbol.png"
        alt="سلاف زهرة أندلسية"
        width={size}
        height={size}
        className={`object-contain transition-transform duration-700 ${
          animated ? "animate-[spin_40s_linear_infinite]" : ""
        }`}
        priority
      />
    </div>
  );
}

export function SulafLogo({
  variant = "horizontal",
  size = "md",
  color = "burgundy",
  showPoem = false,
  className = "",
  href = "/",
}: SulafLogoProps) {
  const sizeMap = {
    sm: { flower: 32, textH: "h-6", textSize: "text-lg", sub: "text-[10px]" },
    md: { flower: 46, textH: "h-9", textSize: "text-2xl", sub: "text-xs" },
    lg: { flower: 64, textH: "h-12", textSize: "text-3xl", sub: "text-sm" },
    xl: { flower: 90, textH: "h-16", textSize: "text-4xl", sub: "text-base" },
  };

  const currentSize = sizeMap[size];

  const content = (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* 8-Petal Andalusian Flower Symbol */}
      <SulafFlowerIcon size={currentSize.flower} animated={size === "xl" || size === "lg"} />

      {/* Brand Typography */}
      <div className="flex flex-col justify-center">
        <div className="flex items-baseline gap-2">
          <span
            className={`font-amiri font-bold tracking-wide leading-none ${currentSize.textSize} ${
              color === "cream"
                ? "text-[#f6f9e6]"
                : color === "green"
                ? "text-[#485c36]"
                : color === "gold"
                ? "text-[#d4af37]"
                : "text-[#610b0d]"
            }`}
          >
            سُــلَاف
          </span>
          <span
            className={`font-cormorant font-semibold tracking-widest uppercase leading-none opacity-90 ${
              size === "sm" ? "text-xs" : "text-sm"
            } ${
              color === "cream"
                ? "text-[#f6f9e6]"
                : color === "green"
                ? "text-[#485c36]"
                : color === "gold"
                ? "text-[#d4af37]"
                : "text-[#610b0d]"
            }`}
          >
            Sulaf
          </span>
        </div>
        <span
          className={`font-cairo tracking-wider font-light uppercase opacity-75 ${currentSize.sub} ${
            color === "cream" ? "text-[#f6f9e6]/80" : "text-[#485c36]/90"
          }`}
        >
          Cosmeceuticals
        </span>

        {showPoem && (
          <p className="mt-1 font-amiri text-xs text-[#d4af37] italic opacity-90 max-w-xs">
            «ما كان في رفقٍ يداوينا سلافُ به إلّا تحوّل حسنًا لا ينهزمُ»
          </p>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="group transition-opacity hover:opacity-95">
        {content}
      </Link>
    );
  }

  return content;
}
