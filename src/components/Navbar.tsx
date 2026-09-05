'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Menu, X, MessageCircle, ShieldCheck, Sparkles } from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#FAF7F2]/98 backdrop-blur-md border-b border-[#D4AF37]/40 text-[#1A1617] shadow-xs transition-all">
      {/* Top Auspicious Micro-Announcement Bar */}
      <div className="bg-[#3B0610] text-[#E6C566] text-xs py-1.5 px-4 text-center tracking-wider border-b border-[#D4AF37]/30 flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
        <span>Authentic Handcrafted Silks &bull; Direct Artisan Weaves &bull; Bespoke Bridal Consultations</span>
        <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse hidden sm:inline" />
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-22 sm:h-24 flex items-center justify-between">
        {/* Brand Logo - Highlighted on pristine Ivory */}
        <a href="/" className="block py-2" title="Vaarahi & Vaagdevi Collections">
          <BrandLogo size="md" />
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wide">
          <a
            href="/"
            className="text-[#4D0917] hover:text-[#AA7C11] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#D4AF37] hover:after:w-full after:transition-all"
          >
            Home
          </a>
          <a
            href="/catalog"
            className="text-[#4D0917] hover:text-[#AA7C11] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#D4AF37] hover:after:w-full after:transition-all"
          >
            Collections
          </a>
          <a
            href="/story"
            className="text-[#4D0917] hover:text-[#AA7C11] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#D4AF37] hover:after:w-full after:transition-all"
          >
            Heritage & Loom
          </a>
          <a
            href="/care-guide"
            className="text-[#4D0917] hover:text-[#AA7C11] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#D4AF37] hover:after:w-full after:transition-all"
          >
            Silk Care Guide
          </a>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210'}?text=${encodeURIComponent('Namaste Vaarahi & Vaagdevi Collections, I would like to enquire about your luxury saree collection.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white px-5 py-2.5 rounded-full text-xs font-bold tracking-wider transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>WhatsApp VIP</span>
          </a>

          <a
            href="/admin"
            title="Boutique Admin Portal"
            className="text-[#7A1228] hover:text-[#3B0610] p-2 rounded-full hover:bg-[#FAF7F2] border border-[#D4AF37]/40 transition-colors"
          >
            <ShieldCheck className="w-5 h-5" />
          </a>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-3">
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366] text-white p-2 rounded-full"
            aria-label="WhatsApp"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
          </a>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#4D0917] hover:text-[#3B0610]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF7F2] border-t-2 border-[#D4AF37]/40 px-6 py-6 space-y-4 shadow-xl">
          <a
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[#4D0917] hover:text-[#AA7C11] py-2 text-base font-semibold border-b border-gray-200"
          >
            Home
          </a>
          <a
            href="/catalog"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[#4D0917] hover:text-[#AA7C11] py-2 text-base font-semibold border-b border-gray-200"
          >
            Collections (All Sarees)
          </a>
          <a
            href="/story"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[#4D0917] hover:text-[#AA7C11] py-2 text-base font-semibold border-b border-gray-200"
          >
            Heritage & Loom
          </a>
          <a
            href="/care-guide"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[#4D0917] hover:text-[#AA7C11] py-2 text-base font-semibold border-b border-gray-200"
          >
            Silk Care Guide
          </a>
          <div className="pt-2 flex flex-col gap-3">
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-2.5 rounded-lg text-sm font-semibold shadow-md"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              Chat on WhatsApp Concierge
            </a>
            <a
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 text-xs text-[#7A1228] font-bold py-2 border border-gray-200 rounded-lg bg-white"
            >
              <ShieldCheck className="w-4 h-4" />
              Boutique Admin Portal
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
