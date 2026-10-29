"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/i18n/language-context";

export function Preloader() {
  const [loading, setLoading] = useState(true);
  const { isArabic, t } = useLanguage();

  useEffect(() => {
    // Keep visible briefly for luxurious introduction, then smoothly dissolve
    const timer = setTimeout(() => {
      setLoading(false);
      if (typeof window !== "undefined") {
        (window as any).__SULAF_LOADED__ = true;
        window.dispatchEvent(new CustomEvent("sulaf:ready"));
        window.dispatchEvent(new Event("resize"));
        window.dispatchEvent(new Event("scroll"));
      }
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            y: -24,
            filter: "blur(8px)",
          }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#485c36] text-[#f6f9e6] select-none overflow-hidden"
          style={{
            background:
              "radial-gradient(ellipse at 50% 40%, #587042 0%, #485c36 50%, #25331c 100%)",
          }}
        >
          {/* Continuous Flowing & Breathing Atmospheric Glows (Green & Gold Harmony) */}
          <motion.div
            animate={{
              scale: [1, 1.25, 1],
              opacity: [0.25, 0.45, 0.25],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute w-96 h-96 sm:w-[500px] sm:h-[500px] rounded-full bg-[#f3e5ab]/20 blur-[120px] pointer-events-none -top-16"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute w-80 h-80 sm:w-[420px] sm:h-[420px] rounded-full bg-[#ca384a]/20 blur-[100px] pointer-events-none -bottom-16"
          />

          {/* Central 8-Petal Rosette Drawing & Continuous Slow Spin */}
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center">
            <motion.svg
              viewBox="0 0 200 200"
              animate={{ rotate: 360 }}
              transition={{
                duration: 40,
                repeat: Infinity,
                ease: "linear",
              }}
              className="w-full h-full drop-shadow-[0_10px_35px_rgba(0,0,0,0.35)]"
            >
              <defs>
                <linearGradient id="sulafRosetteGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fdfbf4" />
                  <stop offset="45%" stopColor="#e5c876" />
                  <stop offset="100%" stopColor="#f3a5a1" />
                </linearGradient>
              </defs>

              {/* Outer 8-Petal Geometric Curves */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => (
                <motion.path
                  key={angle}
                  d="M100,100 C120,40 160,50 140,100 C160,150 120,160 100,100 Z"
                  transform={`rotate(${angle} 100 100)`}
                  fill="none"
                  stroke="url(#sulafRosetteGoldGrad)"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{
                    duration: 0.9,
                    delay: index * 0.05,
                    ease: "easeInOut",
                  }}
                />
              ))}

              {/* Inner Diamond Star Core */}
              <motion.polygon
                points="100,75 115,95 135,100 115,105 100,125 85,105 65,100 85,95"
                fill="none"
                stroke="#e5c876"
                strokeWidth="2"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [1, 1.08, 1], opacity: 1 }}
                transition={{
                  scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                  opacity: { duration: 0.7, delay: 0.4 },
                }}
              />

              {/* Center Radiant Core */}
              <motion.circle
                cx="100"
                cy="100"
                r="6.5"
                fill="#ca384a"
                initial={{ scale: 0 }}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{
                  scale: { duration: 2.2, repeat: Infinity, ease: "easeInOut" },
                }}
              />
            </motion.svg>
          </div>

          {/* Brand Name Typography */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-6 flex flex-col items-center text-center px-4"
          >
            <h1
              className={`${
                isArabic ? "font-gulzar text-3xl sm:text-4xl" : "font-cinzel text-2xl sm:text-3xl tracking-widest"
              } font-bold text-[#f6f9e6] drop-shadow-[0_2px_12px_rgba(0,0,0,0.3)]`}
            >
              {isArabic ? "سُــــلَاف" : "S U L A F"}
            </h1>
            <span className="font-cormorant text-xs sm:text-sm tracking-[0.32em] uppercase text-[#e5c876] mt-1.5 font-bold">
              {isArabic ? "SULAF COSMECEUTICALS" : "COSMECEUTICALS LABORATORIES"}
            </span>
          </motion.div>

          {/* Poetic Line Reveal with Continuous Ambient Breathing */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{
              opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              delay: 0.65,
            }}
            className={`mt-3.5 ${
              isArabic ? "font-gulzar text-sm sm:text-base" : "font-cormorant italic text-sm sm:text-base tracking-wide"
            } text-[#f6f9e6]/90 font-medium text-center px-6 max-w-md leading-relaxed`}
          >
            {isArabic
              ? "«ما كان في رفقٍ يداوينا سُلافُ بهِ إلّا تحوّل حُسنًا لا ينهزمُ»"
              : "“Whatever gentle care Sulaf bestows to heal, becomes unyielding beauty time cannot conceal.”"}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
