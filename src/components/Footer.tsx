import React from 'react';
import { MessageCircle, ShieldCheck, Sparkles, Heart, Phone, MapPin, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#3B0610] text-[#FAF7F2] border-t-2 border-[#D4AF37]/40 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:16px_16px]"></div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-[#D4AF37] p-1 flex items-center justify-center bg-[#4D0917]">
                <svg viewBox="0 0 100 100" className="w-6 h-6 fill-[#D4AF37]">
                  <path d="M50 15 C35 15, 20 35, 20 60 C20 78, 35 88, 50 90 C65 88, 80 78, 80 60 C80 35, 65 15, 50 15 Z" fill="none" stroke="#D4AF37" strokeWidth="3"/>
                  <path d="M50 30 C54 38, 62 48, 59 60 C56 70, 50 72, 50 72 C50 72, 44 70, 41 60 C38 48, 46 38, 50 30 Z"/>
                  <circle cx="50" cy="22" r="3"/>
                </svg>
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-[#F9E29D] tracking-wider">
                  VAARAHI VAAGDEVI
                </h3>
                <p className="text-[10px] tracking-[0.25em] text-[#D4AF37]">COLLECTIONS</p>
              </div>
            </div>
            <p className="text-xs text-[#FAF7F2]/80 leading-relaxed font-light">
              Curators of authentic handwoven pure silks, bridal Kanjeevarams, antique Banarasi brocades, and contemporary luxury weaves. Honoring centuries of loom mastery.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#E6C566] pt-2">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>Certified Pure Silk Mark Guarantee</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-wider text-[#D4AF37] uppercase border-b border-[#D4AF37]/30 pb-2">
              Weaves & Silks
            </h4>
            <ul className="space-y-2 text-xs text-[#FAF7F2]/85">
              <li>
                <a href="/catalog?weave=Kanjeevaram+Silk" className="hover:text-[#D4AF37] transition-colors">
                  Pure Kanjeevaram Silks
                </a>
              </li>
              <li>
                <a href="/catalog?weave=Banarasi+Brocade" className="hover:text-[#D4AF37] transition-colors">
                  Banarasi Katan & Kadwa
                </a>
              </li>
              <li>
                <a href="/catalog?weave=Organza+Tissue" className="hover:text-[#D4AF37] transition-colors">
                  Blush Organza & Tissue
                </a>
              </li>
              <li>
                <a href="/catalog?weave=Paithani+Silk" className="hover:text-[#D4AF37] transition-colors">
                  Royal Paithani Weaves
                </a>
              </li>
              <li>
                <a href="/catalog?category=Dress" className="hover:text-[#D4AF37] transition-colors">
                  Designer Silk Dresses & Ensembles
                </a>
              </li>
            </ul>
          </div>

          {/* Boutique Guides */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-wider text-[#D4AF37] uppercase border-b border-[#D4AF37]/30 pb-2">
              Boutique Services
            </h4>
            <ul className="space-y-2 text-xs text-[#FAF7F2]/85">
              <li>
                <a href="/story" className="hover:text-[#D4AF37] transition-colors">
                  Our Artisan & Loom Heritage
                </a>
              </li>
              <li>
                <a href="/care-guide" className="hover:text-[#D4AF37] transition-colors">
                  Pure Silk & Zari Preservation
                </a>
              </li>
              <li>
                <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210'}?text=${encodeURIComponent('Namaste! I would like to book a live video call drape consultation.')}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#D4AF37] transition-colors">
                  Book Live Video Call Drape
                </a>
              </li>
              <li>
                <a href="/admin" className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5 text-[#D4AF37]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin / Boutique Portal</span>
                </a>
              </li>
            </ul>
          </div>

          {/* VIP Concierge & Contact */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-wider text-[#D4AF37] uppercase border-b border-[#D4AF37]/30 pb-2">
              VIP WhatsApp Desk
            </h4>
            <p className="text-xs text-[#FAF7F2]/80 leading-relaxed">
              For bridal inquiries, color customizations, or high-res drape videos, connect directly with our boutique stylist.
            </p>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210'}?text=${encodeURIComponent('Namaste Vaarahi Vaagdevi Collections, I would like to know more about available sarees.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wider transition-all shadow-md"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Connect on WhatsApp</span>
            </a>
            <div className="pt-2 text-[11px] text-[#FAF7F2]/60 space-y-1">
              <p className="flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-[#D4AF37]" />
                Mon – Sun: 10:00 AM – 8:30 PM IST
              </p>
              <p className="flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                Worldwide Courier & Domestic Express Delivery
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Royal Divider */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-[#FAF7F2]/60 gap-4">
          <p>© {new Date().getFullYear()} Vaarahi Vaagdevi Collections. All Rights Reserved.</p>
          <p className="flex items-center gap-1">
            Handcrafted with devotion for Indian weaves <Heart className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
          </p>
        </div>
      </div>
    </footer>
  );
}
