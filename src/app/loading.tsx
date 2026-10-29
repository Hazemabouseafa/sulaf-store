import React from "react";

export default function Loading() {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#485c36] text-[#f6f9e6] select-none overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 50% 40%, #587042 0%, #485c36 50%, #25331c 100%)",
      }}
    >
      {/* Ambient background glows */}
      <div className="absolute w-80 h-80 rounded-full bg-[#f3e5ab]/15 blur-[100px] pointer-events-none -top-12 animate-pulse" />
      <div className="absolute w-80 h-80 rounded-full bg-[#ca384a]/20 blur-[90px] pointer-events-none -bottom-12 animate-pulse" />

      {/* Rosette Spinner (Continuous Smooth Spin) */}
      <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full animate-[spin_12s_linear_infinite]"
        >
          <defs>
            <linearGradient id="loadingRosetteGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fdfbf4" />
              <stop offset="50%" stopColor="#e5c876" />
              <stop offset="100%" stopColor="#f3a5a1" />
            </linearGradient>
          </defs>

          {/* 8-Petal Rosette */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <path
              key={angle}
              d="M100,100 C120,40 160,50 140,100 C160,150 120,160 100,100 Z"
              transform={`rotate(${angle} 100 100)`}
              fill="none"
              stroke="url(#loadingRosetteGoldGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.9"
            />
          ))}

          {/* Inner Star */}
          <polygon
            points="100,75 115,95 135,100 115,105 100,125 85,105 65,100 85,95"
            fill="none"
            stroke="#e5c876"
            strokeWidth="2"
            opacity="0.95"
          />

          {/* Center Dot */}
          <circle cx="100" cy="100" r="5.5" fill="#ca384a" />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="mt-4 flex flex-col items-center text-center">
        <span className="font-gulzar text-2xl sm:text-3xl font-bold tracking-wide text-[#f6f9e6]">
          سُــــلَاف
        </span>
        <span className="font-cormorant text-xs tracking-[0.28em] uppercase text-[#e5c876] mt-1 font-bold">
          SULAF COSMECEUTICALS
        </span>
      </div>
    </div>
  );
}
