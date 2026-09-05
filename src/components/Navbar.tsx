'use client';

import React, { useState } from 'react';
import Link from 'next/navigation';
import Image from 'next/image';
import { Menu, X, MessageCircle, ShieldCheck, Sparkles } from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#4D0917]/95 backdrop-blur-md border-b border-[#D4AF37]/30 text-[#FAF7F2] transition-all">
      {/* Top Auspicious Micro-Announcement Bar */}
      <div className="bg-[#3B0610] text-[#E6C566] text-xs py-1.5 px-4 text-center tracking-wider border-b border-[#D4AF37]/20 flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
        <span>Authentic Handcrafted Silks &bull; Direct Artisan Weaves &bull; Bespoke Bridal Consultations</span>
        <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse hidden sm:inline" />
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Emblem */}
        <a href="/" className="block" title="Vaarahi Vaagdevi Collections">
          <BrandLogo size="md" />
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
          <a href="/" className="text-[#FAF7F2] hover:text-[#D4AF37] transition-colors">
            Home
          </a>
          <a href="/catalog" className="text-[#FAF7F2] hover:text-[#D4AF37] transition-colors">
            Collections
          </a>
          <a href="/story" className="text-[#FAF7F2] hover:text-[#D4AF37] transition-colors">
            Heritage & Loom
          </a>
          <a href="/care-guide" className="text-[#FAF7F2] hover:text-[#D4AF37] transition-colors">
            Silk Care Guide
          </a>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210'}?text=${encodeURIComponent('Namaste Vaarahi Vaagdevi Collections, I would like to enquire about your luxury saree collection.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>WhatsApp VIP</span>
          </a>

          <a
            href="/admin"
            title="Boutique Admin Portal"
            className="text-[#D4AF37]/80 hover:text-[#F9E29D] p-2 rounded-full hover:bg-white/10 transition-colors"
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
            className="p-2 text-[#D4AF37] hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#3B0610] border-t border-[#D4AF37]/30 px-6 py-6 space-y-4">
          <a
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[#FAF7F2] hover:text-[#D4AF37] py-2 text-base font-medium border-b border-white/5"
          >
            Home
          </a>
          <a
            href="/catalog"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[#FAF7F2] hover:text-[#D4AF37] py-2 text-base font-medium border-b border-white/5"
          >
            Collections (All Sarees)
          </a>
          <a
            href="/story"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[#FAF7F2] hover:text-[#D4AF37] py-2 text-base font-medium border-b border-white/5"
          >
            Heritage & Loom
          </a>
          <a
            href="/care-guide"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[#FAF7F2] hover:text-[#D4AF37] py-2 text-base font-medium border-b border-white/5"
          >
            Silk Care Guide
          </a>
          <div className="pt-2 flex flex-col gap-3">
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-2.5 rounded-lg text-sm font-semibold"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              Chat on WhatsApp Concierge
            </a>
            <a
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 text-xs text-[#D4AF37]/80 hover:text-[#F9E29D] py-2"
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
