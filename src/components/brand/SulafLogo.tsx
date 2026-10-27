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
        src="/brand/sulaf-logo-official.png"
        alt="سُلاف | Sulaf"
        width={size}
        height={size}
        style={{ width: size, height: size }}
        className={`object-contain transition-transform duration-700 ${
          animated ? "animate-[spin_40s_linear_infinite]" : ""
        }`}
        priority
      />
    </div>
  );
}

/**
 * Official Sulaf Logo Component — Renders ONLY the official attached logo lockup
 * (/brand/sulaf-logo-official.png) with ZERO extra text beside it.
 */
export function SulafLogo({
  size = "md",
  color = "burgundy",
  className = "",
  href = "/",
}: SulafLogoProps) {
  const dimensions = {
    sm: { boxW: 115, boxH: 44, imgSize: 120 },
    md: { boxW: 145, boxH: 54, imgSize: 150 },
    lg: { boxW: 185, boxH: 68, imgSize: 190 },
    xl: { boxW: 230, boxH: 84, imgSize: 235 },
  };

  const current = dimensions[size];

  const content = (
    <div
      style={{ width: current.boxW, height: current.boxH }}
      className={`relative inline-flex items-center justify-center overflow-hidden select-none shrink-0 ${className}`}
    >
      <Image
        src="/brand/sulaf-logo-official.png"
        alt="سُلاف | Sulaf"
        width={current.imgSize}
        height={current.imgSize}
        style={{ width: current.imgSize, height: current.imgSize }}
        className={`object-contain transition-transform duration-500 group-hover:scale-105 ${
          color === "cream" ? "brightness-0 invert opacity-95" : ""
        }`}
        priority
      />
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="inline-flex items-center focus:outline-none group"
        aria-label="سُـلاف | Sulaf"
      >
        {content}
      </Link>
    );
  }

  return content;
}
