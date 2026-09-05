import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import ProductCard from '@/components/ProductCard';
import { fetchProducts } from '@/lib/storeService';
import { Sparkles, ShieldCheck, Video, Scissors, Truck, ArrowRight, MessageCircle, Star } from 'lucide-react';

export const revalidate = 0; // Fresh inventory

export default async function HomePage() {
  const products = await fetchProducts();
  const featuredProducts = products.filter((p) => p.is_featured).slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2]">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-b from-[#4D0917] via-[#5C0D1E] to-[#3B0610] text-[#FAF7F2] py-16 sm:py-24 overflow-hidden border-b-2 border-[#D4AF37]/30">
        {/* Decorative Golden Ambient Glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-[#FAF7F2]/10 border border-[#D4AF37]/40 px-3.5 py-1.5 rounded-full text-xs text-[#F9E29D] tracking-widest uppercase">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Exquisite Handcrafted Silks &bull; Since Inception</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#FAF7F2] leading-[1.15]">
                Sacred Heritage Weaves, <br />
                <span className="gold-gradient-text font-serif italic font-normal">
                  Crafted for Eternity.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-[#FAF7F2]/80 max-w-2xl leading-relaxed font-light">
                Welcome to <strong className="text-[#F9E29D] font-medium">Vaarahi Vaagdevi Collections</strong>. We curate India's finest bridal Kanjeevarams, royal Banarasi brocades, and gossamer organzas directly from traditional master weavers. Experience bespoke drape consultations via direct WhatsApp VIP concierge.
              </p>

              {/* Action CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <a
                  href="/catalog"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 gold-gradient-bg text-[#3B0610] hover:brightness-110 font-bold px-8 py-3.5 rounded-xl text-sm tracking-wider uppercase shadow-xl transition-all transform hover:-translate-y-0.5"
                >
                  <span>Explore Collections</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210'}?text=${encodeURIComponent('Namaste! I would like to book a bridal saree consultation.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold px-6 py-3.5 rounded-xl text-sm tracking-wide shadow-md transition-all transform hover:-translate-y-0.5"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Book WhatsApp Drape Call</span>
                </a>
              </div>

              {/* Trust Pillars */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 text-left">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#F9E29D]">
                    <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                    <span>Pure Silk Mark</span>
                  </div>
                  <p className="text-[11px] text-[#FAF7F2]/70">100% Certified Mulberry Silk</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#F9E29D]">
                    <Video className="w-4 h-4 text-[#D4AF37]" />
                    <span>Live Video Drape</span>
                  </div>
                  <p className="text-[11px] text-[#FAF7F2]/70">View drape before ordering</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#F9E29D]">
                    <Truck className="w-4 h-4 text-[#D4AF37]" />
                    <span>Express Delivery</span>
                  </div>
                  <p className="text-[11px] text-[#FAF7F2]/70">Insured worldwide transit</p>
                </div>
              </div>
            </div>

            {/* Right Hero Visual (The Crimson Kanjeevaram Highlight) */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-sm rounded-2xl overflow-hidden border-2 border-[#D4AF37]/50 shadow-2xl bg-[#3B0610] group">
                <div className="aspect-[3/4] relative overflow-hidden">
                  <img
                    src="/images/products/kanjeevaram-crimson.jpg"
                    alt="Maharani Kanjeevaram Bridal Silk Saree"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  
                  {/* Floating Highlight Card */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-xl p-4 text-[#1A1617] border border-[#D4AF37]/40 shadow-lg">
                    <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-[#7A1228] font-bold">
                      <span>Bridal Masterpiece</span>
                      <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">In Stock</span>
                    </div>
                    <h3 className="font-serif text-base font-bold text-[#1A1617] mt-0.5">
                      Maharani Ratna Kanjeevaram
                    </h3>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                      <span className="font-serif text-lg font-bold text-[#7A1228]">₹26,800</span>
                      <a
                        href="/catalog/maharani-ratna-kanjeevaram-bridal-silk"
                        className="text-xs bg-[#4D0917] hover:bg-[#7A1228] text-white px-3 py-1.5 rounded-md font-medium transition-colors"
                      >
                        View Drape
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. WEAVE GALLERIES (CATEGORIES) */}
      <section className="py-16 bg-[#F4EFE6]/70 border-b border-[#D4AF37]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] text-[#9C7A1D] font-semibold">
              Sacred Heritage Weaves
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#3B0610]">
              Curated by Loom & Tradition
            </h2>
            <p className="text-xs sm:text-sm text-[#5C5552] leading-relaxed">
              Explore authentic weaves nurtured across historic weaving clusters of India, from the temple sanctums of Tamil Nadu to the ghats of Varanasi.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-12">
            {/* Kanjeevaram */}
            <a
              href="/catalog?weave=Kanjeevaram+Silk"
              className="group relative rounded-xl overflow-hidden aspect-[4/5] shadow-md border border-[#D4AF37]/30 hover:border-[#D4AF37] transition-all"
            >
              <img
                src="/images/products/kanjeevaram-crimson.jpg"
                alt="Kanjeevaram Silks"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3B0610] via-black/20 to-transparent flex flex-col justify-end p-4 text-white">
                <span className="text-[10px] uppercase tracking-wider text-[#F9E29D]">Tamil Nadu</span>
                <h3 className="font-serif text-base sm:text-lg font-bold">Kanjeevaram Silks</h3>
                <p className="text-[11px] text-[#FAF7F2]/80 line-clamp-1">Pure Mulberry Silk & Tested Gold Zari</p>
              </div>
            </a>

            {/* Banarasi */}
            <a
              href="/catalog?weave=Banarasi+Brocade"
              className="group relative rounded-xl overflow-hidden aspect-[4/5] shadow-md border border-[#D4AF37]/30 hover:border-[#D4AF37] transition-all"
            >
              <img
                src="/images/products/banarasi-emerald.jpg"
                alt="Banarasi Brocades"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3B0610] via-black/20 to-transparent flex flex-col justify-end p-4 text-white">
                <span className="text-[10px] uppercase tracking-wider text-[#F9E29D]">Varanasi</span>
                <h3 className="font-serif text-base sm:text-lg font-bold">Banarasi Brocades</h3>
                <p className="text-[11px] text-[#FAF7F2]/80 line-clamp-1">Intricate Kadwa Jaal & Katan Silks</p>
              </div>
            </a>

            {/* Organza Tissue */}
            <a
              href="/catalog?weave=Organza+Tissue"
              className="group relative rounded-xl overflow-hidden aspect-[4/5] shadow-md border border-[#D4AF37]/30 hover:border-[#D4AF37] transition-all"
            >
              <img
                src="/images/products/organza-rose.jpg"
                alt="Organza Tissue Silks"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3B0610] via-black/20 to-transparent flex flex-col justify-end p-4 text-white">
                <span className="text-[10px] uppercase tracking-wider text-[#F9E29D]">Contemporary</span>
                <h3 className="font-serif text-base sm:text-lg font-bold">Organza & Tissue</h3>
                <p className="text-[11px] text-[#FAF7F2]/80 line-clamp-1">Handcrafted Scalloped Zari Borders</p>
              </div>
            </a>

            {/* Paithani */}
            <a
              href="/catalog?weave=Paithani+Silk"
              className="group relative rounded-xl overflow-hidden aspect-[4/5] shadow-md border border-[#D4AF37]/30 hover:border-[#D4AF37] transition-all"
            >
              <img
                src="/images/products/paithani-mustard.jpg"
                alt="Paithani Silks"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3B0610] via-black/20 to-transparent flex flex-col justify-end p-4 text-white">
                <span className="text-[10px] uppercase tracking-wider text-[#F9E29D]">Maharashtra</span>
                <h3 className="font-serif text-base sm:text-lg font-bold">Paithani Silks</h3>
                <p className="text-[11px] text-[#FAF7F2]/80 line-clamp-1">Mor-Pankh & Asawali Tapestry Weave</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* 3. FEATURED SAREES SHOWCASE */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-[#D4AF37]/30 pb-6">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-[0.25em] text-[#9C7A1D] font-semibold">
              Curated Royal Selection
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#3B0610]">
              Featured Boutique Masterpieces
            </h2>
          </div>
          <a
            href="/catalog"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7A1228] hover:text-[#D4AF37] tracking-wider uppercase transition-colors"
          >
            <span>View Complete Catalog ({products.length})</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mt-10">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. HOW BOUTIQUE ORDERING WORKS */}
      <section className="bg-[#4D0917] text-[#FAF7F2] py-16 border-y-2 border-[#D4AF37]/30 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
              The Vaarahi Vaagdevi Experience
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white">
              Bespoke Luxury, Simplified
            </h2>
            <p className="text-xs sm:text-sm text-[#FAF7F2]/80 leading-relaxed font-light">
              We eliminate middlemen and impersonal checkouts. Every saree is treated with bridal reverence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-12 text-center">
            {/* Step 1 */}
            <div className="space-y-3 p-6 bg-[#3B0610]/80 rounded-xl border border-[#D4AF37]/20">
              <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center mx-auto text-[#F9E29D] font-serif font-bold text-lg">
                1
              </div>
              <h3 className="font-serif text-base font-bold text-[#F9E29D]">Select Your Weave</h3>
              <p className="text-xs text-[#FAF7F2]/75 leading-relaxed font-light">
                Browse our high-definition catalog of authentic handloom silks with certified specifications.
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-3 p-6 bg-[#3B0610]/80 rounded-xl border border-[#D4AF37]/20">
              <div className="w-12 h-12 rounded-full bg-[#25D366]/20 border border-[#25D366] flex items-center justify-center mx-auto text-[#25D366]">
                <MessageCircle className="w-6 h-6 fill-[#25D366]" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#F9E29D]">WhatsApp Concierge</h3>
              <p className="text-xs text-[#FAF7F2]/75 leading-relaxed font-light">
                Tap 'Enquire' to instantly connect with our stylist. Request live drape clips, lighting previews, or video call.
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-3 p-6 bg-[#3B0610]/80 rounded-xl border border-[#D4AF37]/20">
              <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center mx-auto text-[#F9E29D]">
                <Scissors className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#F9E29D]">Fall, Pico & Tailoring</h3>
              <p className="text-xs text-[#FAF7F2]/75 leading-relaxed font-light">
                Complimentary fall and edging (pico) included. Custom bridal blouse stitching available upon request.
              </p>
            </div>

            {/* Step 4 */}
            <div className="space-y-3 p-6 bg-[#3B0610]/80 rounded-xl border border-[#D4AF37]/20">
              <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center mx-auto text-[#F9E29D]">
                <Truck className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#F9E29D]">Doorstep Delivery</h3>
              <p className="text-xs text-[#FAF7F2]/75 leading-relaxed font-light">
                Dispatched in luxury dust bags with tracking and authenticity certificate. Express domestic & worldwide delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BRIDAL TESTIMONIALS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-[#9C7A1D] font-semibold">
            Cherished Experiences
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#3B0610]">
            Words from our Connoisseurs
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {/* Review 1 */}
          <div className="bg-white p-8 rounded-2xl border border-[#D4AF37]/30 shadow-sm relative">
            <div className="flex text-[#D4AF37] gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#D4AF37]" />
              ))}
            </div>
            <p className="text-xs text-[#5C5552] leading-relaxed italic">
              "The crimson Kanjeevaram I ordered for my Muhurtham was absolutely breathtaking. The stylist showed me the drape on a WhatsApp video call within 10 minutes of inquiring. The zari sheen and silk quality exceeded my expectations!"
            </p>
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="font-bold text-[#3B0610]">Sowmya N.</span>
              <span className="text-gray-400">Bengaluru &bull; Bridal Order</span>
            </div>
          </div>

          {/* Review 2 */}
          <div className="bg-white p-8 rounded-2xl border border-[#D4AF37]/30 shadow-sm relative">
            <div className="flex text-[#D4AF37] gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#D4AF37]" />
              ))}
            </div>
            <p className="text-xs text-[#5C5552] leading-relaxed italic">
              "Living in Dallas, finding authentic pure handloom silks with tested zari is difficult. Vaarahi Vaagdevi delivered my Banarasi silk within 5 days with fall and pico ready to wear. Stunning craftsmanship!"
            </p>
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="font-bold text-[#3B0610]">Meenakshi Iyer</span>
              <span className="text-gray-400">Dallas, USA &bull; Express NRI Courier</span>
            </div>
          </div>

          {/* Review 3 */}
          <div className="bg-white p-8 rounded-2xl border border-[#D4AF37]/30 shadow-sm relative">
            <div className="flex text-[#D4AF37] gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#D4AF37]" />
              ))}
            </div>
            <p className="text-xs text-[#5C5552] leading-relaxed italic">
              "The blush organza tissue saree is whisper-light yet looks so grand for festive evenings. Communicating directly on WhatsApp made coordinating blouse tailoring seamless. Highly recommended!"
            </p>
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="font-bold text-[#3B0610]">Dr. Radhika K.</span>
              <span className="text-gray-400">Hyderabad &bull; Festive Festive Collection</span>
            </div>
          </div>
        </div>
      </section>

      <WhatsAppButton />
      <Footer />
    </div>
  );
}
