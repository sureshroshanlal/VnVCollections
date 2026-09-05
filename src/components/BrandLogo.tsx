'use client';

import React, { useState } from 'react';

interface BrandLogoProps {
  className?: string;
  variant?: 'light' | 'on-dark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function BrandLogo({
  className = '',
  variant = 'light',
  size = 'md',
}: BrandLogoProps) {
  const [imageError, setImageError] = useState(false);

  const logoHeight =
    size === 'sm'
      ? 'h-12 sm:h-14'
      : size === 'md'
      ? 'h-16 sm:h-18'
      : size === 'lg'
      ? 'h-20 sm:h-24'
      : 'h-24 sm:h-28';

  const logoImage = (
    <img
      src="/images/client-logo.png"
      alt="Vaarahi & Vaagdevi Collections Logo"
      className={`${logoHeight} w-auto object-contain max-w-[320px] sm:max-w-[420px] drop-shadow-xs transition-all`}
      onError={() => setImageError(true)}
    />
  );

  // If used on a dark background, wrap in a soft ivory luxury plaque so dark emerald text is crystal clear
  if (variant === 'on-dark') {
    return (
      <div className={`inline-flex items-center bg-[#FAF7F2] px-3.5 py-2 rounded-xl border border-[#D4AF37]/50 shadow-sm ${className}`}>
        {!imageError ? (
          logoImage
        ) : (
          <FallbackEmblem />
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center ${className}`}>
      {!imageError ? logoImage : <FallbackEmblem />}
    </div>
  );
}

function FallbackEmblem() {
  return (
    <div className="flex items-center gap-3 group">
      <div className="w-10 h-10 rounded-full border border-[#D4AF37]/50 p-1 flex items-center justify-center bg-[#3B0610] shadow-md group-hover:border-[#F9E29D] transition-colors shrink-0">
        <svg viewBox="0 0 100 100" className="w-7 h-7 fill-[#D4AF37]">
          <path
            d="M50 15 C35 15, 20 35, 20 60 C20 78, 35 88, 50 90 C65 88, 80 78, 80 60 C80 35, 65 15, 50 15 Z"
            fill="none"
            stroke="#D4AF37"
            strokeWidth="3"
          />
          <path d="M50 30 C54 38, 62 48, 59 60 C56 70, 50 72, 50 72 C50 72, 44 70, 41 60 C38 48, 46 38, 50 30 Z" />
          <circle cx="50" cy="22" r="3" />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="font-serif text-lg sm:text-xl font-bold tracking-wider text-[#3B0610] group-hover:text-[#7A1228] transition-colors leading-tight">
          VAARAHI & VAAGDEVI
        </span>
        <span className="text-[10px] tracking-[0.28em] text-[#9C7A1D] uppercase font-semibold">
          COLLECTIONS
        </span>
      </div>
    </div>
  );
}
