"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Preloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user already saw preloader in this session
    const seen = sessionStorage.getItem("sulaf_preloader_seen");
    if (seen) {
      setLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      setLoading(false);
      sessionStorage.setItem("sulaf_preloader_seen", "true");
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#485c36] text-[#f6f9e6]"
        >
          {/* Subtle Andalusian Geometry in Background */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f6f9e6_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

          {/* Central 8-Petal Rosette Drawing Animation */}
          <div className="relative w-44 h-44 flex items-center justify-center">
            <svg
              viewBox="0 0 200 200"
              className="w-full h-full drop-shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
            >
              <defs>
                <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f3e5ab" />
                  <stop offset="50%" stopColor="#d4af37" />
                  <stop offset="100%" stopColor="#aa820a" />
                </linearGradient>
              </defs>

              {/* Outer 8-Petal Geometric Curves */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => (
                <motion.path
                  key={angle}
                  d="M100,100 C120,40 160,50 140,100 C160,150 120,160 100,100 Z"
                  transform={`rotate(${angle} 100 100)`}
                  fill="none"
                  stroke="url(#goldGrad)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{
                    duration: 1.6,
                    delay: index * 0.08,
                    ease: "easeInOut",
                  }}
                />
              ))}

              {/* Inner Diamond Star Core */}
              <motion.polygon
                points="100,75 115,95 135,100 115,105 100,125 85,105 65,100 85,95"
                fill="none"
                stroke="#f6f9e6"
                strokeWidth="1.5"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.2, delay: 0.8, ease: "backOut" }}
              />

              {/* Center Radiant Core */}
              <motion.circle
                cx="100"
                cy="100"
                r="6"
                fill="#f3a5a1"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.4, 1] }}
                transition={{ duration: 0.6, delay: 1.4 }}
              />
            </svg>
          </div>

          {/* Brand Name Typography */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mt-6 flex flex-col items-center text-center"
          >
            <h1 className="font-amiri text-4xl font-bold tracking-wide text-[#f6f9e6]">
              سُــــلَاف
            </h1>
            <span className="font-cormorant text-sm tracking-[0.3em] uppercase text-[#f3e5ab] mt-1">
              SULAF COSMECEUTICALS
            </span>
          </motion.div>

          {/* Poetic Line Reveal */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.1, delay: 1.6 }}
            className="mt-4 font-amiri text-base text-[#f6f9e6]/80 italic text-center px-4 max-w-md leading-relaxed"
          >
            «ما كان في رفقٍ يداوينا سلافُ به إلّا تحوّل حسنًا لا ينهزمُ»
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
