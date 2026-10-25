"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface MarblePodiumProps {
  imageSrc: string;
  alt: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  showOrbs?: boolean;
}

export function MarblePodium({
  imageSrc,
  alt,
  size = "md",
  className = "",
}: MarblePodiumProps) {
  const sizeConfig = {
    sm: { height: "h-40 sm:h-44", podiumW: "w-36 sm:w-40", imgSize: 105 },
    md: { height: "h-48 sm:h-52", podiumW: "w-44 sm:w-48", imgSize: 135 },
    lg: { height: "h-64 sm:h-72", podiumW: "w-56 sm:w-64", imgSize: 185 },
  };

  const config = sizeConfig[size];

  return (
    <div
      className={`relative flex flex-col items-center justify-end select-none ${config.height} ${className}`}
    >
      {/* Product Floating on Top */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-20 mb-2 flex items-center justify-center filter drop-shadow-[0_12px_20px_rgba(72,92,54,0.2)]"
      >
        <Image
          src={imageSrc}
          alt={alt}
          width={config.imgSize}
          height={config.imgSize}
          className="object-contain max-h-36 transition-transform duration-500 hover:scale-105"
          priority
        />
      </motion.div>

      {/* Reflected Mirror Shadow */}
      <div className="absolute bottom-5 z-10 w-28 h-5 bg-black/15 rounded-full blur-md transform scale-y-50" />

      {/* Luxury White Carrara / Green Marble Tiered Podium */}
      <div className={`relative z-10 flex flex-col items-center max-w-full ${config.podiumW}`}>
        {/* Upper Marble Disk with Gold Bevel */}
        <div className="w-full h-7 rounded-full bg-gradient-to-r from-[#fbfdf7] via-[#f0f4e3] to-[#e6ecd2] border-t-2 border-[#d4af37]/60 shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),0_4px_10px_rgba(72,92,54,0.12)] flex items-center justify-center relative overflow-hidden">
          {/* Subtle Marble Vein Lines */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#485c36_1px,transparent_1px)] [background-size:12px_12px]" />
          <div className="w-2/3 h-[1px] bg-white/80 blur-[0.5px]" />
        </div>

        {/* Lower Wood / Gold Base Layer */}
        <div className="w-[88%] h-4 -mt-1.5 rounded-full bg-gradient-to-r from-[#2c3821] via-[#485c36] to-[#2c3821] border-b border-[#d4af37]/40 shadow-md" />
      </div>
    </div>
  );
}
