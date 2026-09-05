import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Sparkles, Sun, Droplets, Wind, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function CareGuidePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2]">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs uppercase tracking-[0.25em] text-[#9C7A1D] font-semibold">
            Preserving Heirloom Heirlooms
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#3B0610]">
            The Royal Silk & Zari Care Guide
          </h1>
          <p className="text-xs sm:text-sm text-[#5C5552] leading-relaxed">
            Pure silk and real metallic zari are natural organic fibers. With mindful care, your Vaarahi Vaagdevi saree will retain its lustrous sheen and border crispness for decades.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Washing & Dry Cleaning */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#D4AF37]/30 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#4D0917]/10 flex items-center justify-center text-[#7A1228]">
              <Droplets className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#3B0610]">
              1. Professional Dry Cleaning Only
            </h3>
            <p className="text-xs text-[#5C5552] leading-relaxed font-light">
              Never handwash, soak, or machine-wash pure silk sarees. Always entrust them to an established dry-cleaner experienced in delicate zari work. Request dry cleaning without harsh chemical bleaches.
            </p>
          </div>

          {/* Card 2: Storage & Muslin Wrap */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#D4AF37]/30 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#4D0917]/10 flex items-center justify-center text-[#7A1228]">
              <Wind className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#3B0610]">
              2. Wrap in Pure Cotton or Muslin
            </h3>
            <p className="text-xs text-[#5C5552] leading-relaxed font-light">
              Store your saree wrapped in a soft, unbleached cotton saree bag or pure muslin cloth. Avoid plastic zip bags, which trap humidity and can oxidize metallic zari over time.
            </p>
          </div>

          {/* Card 3: Periodic Refolding */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#D4AF37]/30 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#4D0917]/10 flex items-center justify-center text-[#7A1228]">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#3B0610]">
              3. Unfold & Air Periodically
            </h3>
            <p className="text-xs text-[#5C5552] leading-relaxed font-light">
              Every 3 to 4 months, take your silk sarees out of the wardrobe, gently unfold them, and air them in a shaded, ventilated room for a few hours. Change the fold crease line to prevent fiber strain.
            </p>
          </div>

          {/* Card 4: Ironing & Direct Sunlight */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#D4AF37]/30 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#4D0917]/10 flex items-center justify-center text-[#7A1228]">
              <Sun className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#3B0610]">
              4. Moderate Steam & Ironing Protection
            </h3>
            <p className="text-xs text-[#5C5552] leading-relaxed font-light">
              Always iron on the reverse side on low-to-medium silk heat settings. Never iron directly over metallic zari; place a thin cotton pressing cloth in between. Never spray perfume or deodorant directly on silk.
            </p>
          </div>
        </div>

        {/* Prohibitions Alert */}
        <div className="mt-10 bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-4">
          <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 space-y-1">
            <strong className="block font-semibold">Important Precautions for Gold & Silver Zari:</strong>
            <p>
              Do not use naphthalene balls or camphor directly touching the silk. For moth repellent, place natural dried neem leaves or cloves wrapped in a small cloth pouch at the bottom corner of your wardrobe.
            </p>
          </div>
        </div>
      </main>

      <WhatsAppButton />
      <Footer />
    </div>
  );
}
