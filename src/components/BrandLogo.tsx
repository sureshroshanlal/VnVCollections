'use client';

import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'on-dark';
}

export default function BrandLogo({
  className = '',
  size = 'md',
  variant = 'default',
}: BrandLogoProps) {
  const logoHeight =
    size === 'sm'
      ? 'h-12 sm:h-14'
      : size === 'md'
      ? 'h-16 sm:h-18'
      : size === 'lg'
      ? 'h-18 sm:h-20'
      : 'h-24 sm:h-28';

  const logoSrc =
    variant === 'on-dark'
      ? '/images/client-logo-light.png'
      : '/images/client-logo.png';

  return (
    <div className={`inline-flex items-center ${className}`}>
      <img
        src={logoSrc}
        alt="Vaarahi & Vaagdevi Collections Logo"
        className={`${logoHeight} w-auto object-contain max-w-[320px] sm:max-w-[420px] drop-shadow-xs transition-all`}
      />
    </div>
  );
}
