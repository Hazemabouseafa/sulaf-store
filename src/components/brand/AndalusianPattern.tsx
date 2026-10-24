import React from "react";

interface AndalusianPatternProps {
  className?: string;
  opacity?: number;
  color?: string;
  scale?: number;
}

export function AndalusianPattern({
  className = "",
  opacity = 0.07,
  color = "#f6f9e6",
  scale = 1,
}: AndalusianPatternProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{ opacity }}
    >
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          <pattern
            id="andalusian-grid"
            width={80 * scale}
            height={80 * scale}
            patternUnits="userSpaceOnUse"
          >
            {/* Center 8-pointed star */}
            <path
              d="M40 10 L48 28 L68 28 L52 40 L60 58 L40 46 L20 58 L28 40 L12 28 L32 28 Z"
              fill="none"
              stroke={color}
              strokeWidth="0.8"
            />
            {/* Outer interlacing diamond motifs */}
            <path
              d="M40 0 L80 40 L40 80 L0 40 Z"
              fill="none"
              stroke={color}
              strokeWidth="0.5"
              strokeDasharray="2,3"
            />
            <circle cx="40" cy="40" r="16" fill="none" stroke={color} strokeWidth="0.5" />
            <circle cx="0" cy="0" r="12" fill="none" stroke={color} strokeWidth="0.5" />
            <circle cx="80" cy="0" r="12" fill="none" stroke={color} strokeWidth="0.5" />
            <circle cx="0" cy="80" r="12" fill="none" stroke={color} strokeWidth="0.5" />
            <circle cx="80" cy="80" r="12" fill="none" stroke={color} strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#andalusian-grid)" />
      </svg>
    </div>
  );
}
