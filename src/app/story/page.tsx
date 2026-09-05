import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Sparkles, ShieldCheck, Heart, Award, ArrowRight } from 'lucide-react';

export default function StoryPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2]">
      <Navbar />

      <main className="flex-1">
        {/* Banner Header */}
        <section className="bg-gradient-to-b from-[#4D0917] to-[#3B0610] text-[#FAF7F2] py-16 sm:py-24 text-center relative border-b-2 border-[#D4AF37]/30">
          <div className="max-w-4xl mx-auto px-4 space-y-4">
            <span className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-semibold flex items-center justify-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              Sacred Heritage & Divine Weaves
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              The Genesis of <br />
              <span className="gold-gradient-text font-serif italic">Vaarahi Vaagdevi Collections</span>
            </h1>
            <p className="text-sm sm:text-base text-[#FAF7F2]/80 max-w-2xl mx-auto font-light leading-relaxed">
              Born from a reverent devotion to traditional Indian handlooms and the divine patronesses of wisdom and sacred energy.
            </p>
          </div>
        </section>

        {/* Narrative Section */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-16">
          {/* Section 1: Sacred Inspiration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-widest text-[#9C7A1D] font-bold">
                Divine Inspiration
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#3B0610]">
                The Grace of Vaarahi & The Wisdom of Vaagdevi
              </h2>
              <p className="text-sm text-[#5C5552] leading-relaxed font-light">
                In Indian lore, <strong className="text-[#7A1228] font-medium">Goddess Vaarahi</strong> embodies unshakeable strength, regal radiance, and protective abundance. <strong className="text-[#7A1228] font-medium">Goddess Vaagdevi (Saraswati)</strong> represents the pinnacle of divine artistry, pure intellect, and aesthetic grace.
              </p>
              <p className="text-sm text-[#5C5552] leading-relaxed font-light">
                At <strong>Vaarahi Vaagdevi Collections</strong>, every saree is considered an offering of these eternal energies — crafted with devotion, purity of material, and centuries of handloom wisdom.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden border-2 border-[#D4AF37]/40 shadow-xl aspect-[4/3] bg-[#3B0610]">
              <img
                src="/images/products/kanjeevaram-crimson.jpg"
                alt="Sacred Weaving Heritage"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Section 2: Pure Looms & Artisan Ethos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="order-2 md:order-1 rounded-2xl overflow-hidden border-2 border-[#D4AF37]/40 shadow-xl aspect-[4/3] bg-[#3B0610]">
              <img
                src="/images/products/banarasi-emerald.jpg"
                alt="Artisan Weaving"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="order-1 md:order-2 space-y-4">
              <span className="text-xs uppercase tracking-widest text-[#9C7A1D] font-bold">
                Direct Artisan Partnership
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#3B0610]">
                Preserving Ancient Weaves on Traditional Looms
              </h2>
              <p className="text-sm text-[#5C5552] leading-relaxed font-light">
                We work directly with generational master weaving families in Kanchipuram, Varanasi, Paithan, and Chanderi. By eliminating layers of middlemen, we ensure:
              </p>
              <ul className="space-y-2 text-xs text-[#3B0610] font-medium">
                <li className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#D4AF37]" />
                  <span>Certified 100% pure Mulberry silk and tested gold/silver zari</span>
                </li>
                <li className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-[#D4AF37]" />
                  <span>Direct, dignified fair remuneration for our skilled weavers</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                  <span>Uncompromised bridal heirloom quality made to last generations</span>
                </li>
              </ul>
            </div>
          </div>

          {/* CTA Banner */}
          <div className="bg-[#4D0917] text-[#FAF7F2] p-8 sm:p-12 rounded-2xl border-2 border-[#D4AF37]/50 text-center space-y-4 shadow-xl">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#F9E29D]">
              Experience the Timeless Drape
            </h3>
            <p className="text-xs sm:text-sm text-[#FAF7F2]/80 max-w-xl mx-auto font-light">
              Explore our handloom creations or connect with our master stylist on WhatsApp for a live video consultation.
            </p>
            <div className="pt-2">
              <a
                href="/catalog"
                className="inline-flex items-center gap-2 gold-gradient-bg text-[#3B0610] hover:brightness-110 font-bold px-8 py-3 rounded-xl text-xs uppercase tracking-wider shadow-lg transition-all"
              >
                <span>Browse All Sarees</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>
      </main>

      <WhatsAppButton />
      <Footer />
    </div>
  );
}
