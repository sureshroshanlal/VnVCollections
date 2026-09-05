'use client';

import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

export default function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(true);
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210';
  const url = `https://wa.me/${phone}?text=${encodeURIComponent('Namaste Vaarahi Vaagdevi Collections! I would like assistance with your saree collection.')}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-end gap-3 pointer-events-auto">
      {/* Interactive Concierge Bubble Tooltip */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 bg-white border border-[#D4AF37]/40 shadow-xl rounded-2xl px-4 py-2.5 max-w-xs animate-bounce">
          <div className="text-xs text-[#3B0610] leading-snug">
            <span className="font-semibold block text-[#7A1228]">Need help finding a saree?</span>
            Chat directly with our boutique stylist on WhatsApp!
          </div>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-gray-400 hover:text-gray-700 p-1"
            aria-label="Close tooltip"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Floating Action Button */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300 ring-4 ring-[#25D366]/20 relative group"
        aria-label="Chat on WhatsApp Concierge"
      >
        <MessageCircle className="w-7 h-7 fill-white" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full border-2 border-white animate-ping"></span>
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full border-2 border-white"></span>
      </a>
    </div>
  );
}
