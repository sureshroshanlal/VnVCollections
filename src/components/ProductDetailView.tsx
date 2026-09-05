'use client';

import React, { useState } from 'react';
import { Product } from '@/lib/types';
import { generateWhatsAppInquiryUrl } from '@/lib/storeService';
import {
  MessageCircle,
  ShieldCheck,
  Video,
  Scissors,
  Truck,
  Sparkles,
  ChevronRight,
  Info,
  Palette,
  Check,
} from 'lucide-react';

interface ProductDetailViewProps {
  product: Product;
}

export default function ProductDetailView({ product }: ProductDetailViewProps) {
  const images = product.images && product.images.length > 0
    ? product.images
    : ['/images/products/kanjeevaram-crimson.jpg'];

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Color variants state
  const variants = product.color_variants && product.color_variants.length > 0
    ? product.color_variants
    : [{ colorName: product.color || 'Standard', hexCode: '#7A1228', quantity: product.stock_quantity }];

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const currentVariant = variants[selectedVariantIndex] || variants[0];

  const isOutOfStock = currentVariant.quantity <= 0;
  const isLowStock = currentVariant.quantity === 1;

  // URLs
  const orderWhatsAppUrl = generateWhatsAppInquiryUrl(
    product,
    undefined,
    currentVariant.colorName
  );

  const videoCallWhatsAppUrl = generateWhatsAppInquiryUrl(
    product,
    `Namaste *Vaarahi Vaagdevi Collections*! 🙏\n\nI am interested in *${product.title}* (SKU: ${product.sku}, Color: *${currentVariant.colorName}*, Price: ₹${product.selling_price.toLocaleString('en-IN')}).\n\nCould you please arrange a *Live Video Drape Consultation* or send a high-res video clip of this saree shade? Thank you!`,
    currentVariant.colorName
  );

  return (
    <div className="space-y-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-gray-500">
        <a href="/" className="hover:text-[#7A1228]">Home</a>
        <ChevronRight className="w-3.5 h-3.5" />
        <a href="/catalog" className="hover:text-[#7A1228]">Collections</a>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#3B0610] font-medium truncate max-w-xs">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* LEFT: Saree Imagery & Thumbnails */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative rounded-2xl overflow-hidden border-2 border-[#D4AF37]/40 shadow-xl bg-[#3B0610] aspect-[3/4] group">
            <img
              src={images[activeImageIndex] || images[0]}
              alt={product.title}
              className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out cursor-zoom-in"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              <span className="bg-[#3B0610]/90 backdrop-blur-md text-[#F9E29D] border border-[#D4AF37]/50 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                {product.weave}
              </span>
              <span className="bg-emerald-900/90 text-white text-[11px] font-medium px-3 py-0.5 rounded-full backdrop-blur-sm border border-emerald-500/30">
                Certified Silk Mark
              </span>
            </div>

            {/* Color-specific Stock Indicator */}
            <div className="absolute top-4 right-4 z-10">
              {isOutOfStock ? (
                <span className="bg-red-800 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                  {currentVariant.colorName} &bull; Sold Out
                </span>
              ) : isLowStock ? (
                <span className="bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md animate-pulse">
                  Only 1 left in {currentVariant.colorName}!
                </span>
              ) : (
                <span className="bg-emerald-800 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                  In Stock ({currentVariant.quantity} pieces in {currentVariant.colorName})
                </span>
              )}
            </div>

            {/* Zoom hint */}
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white/90 text-[11px] px-3 py-1 rounded-full pointer-events-none">
              Hover to inspect weave & zari details
            </div>
          </div>

          {/* Multiple Photo Thumbnails Selector */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImageIndex(i)}
                  className={`relative rounded-xl overflow-hidden aspect-[3/4] w-20 border-2 transition-all shrink-0 ${
                    activeImageIndex === i
                      ? 'border-[#7A1228] ring-2 ring-[#7A1228]/40 scale-105'
                      : 'border-gray-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Micro Guarantees */}
          <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs text-[#3B0610]">
            <div className="bg-white p-3 rounded-xl border border-[#D4AF37]/30 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37] mx-auto mb-1" />
              <span className="font-semibold block">100% Pure Silk</span>
              <span className="text-[10px] text-gray-500">Certified Authentic</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-[#D4AF37]/30 shadow-2xs">
              <Scissors className="w-4 h-4 text-[#D4AF37] mx-auto mb-1" />
              <span className="font-semibold block">Complimentary Fall</span>
              <span className="text-[10px] text-gray-500">Pico edging done</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-[#D4AF37]/30 shadow-2xs">
              <Truck className="w-4 h-4 text-[#D4AF37] mx-auto mb-1" />
              <span className="font-semibold block">Insured Transit</span>
              <span className="text-[10px] text-gray-500">Worldwide delivery</span>
            </div>
          </div>
        </div>

        {/* RIGHT: Product Specs, Color Variants & WhatsApp CTAs */}
        <div className="lg:col-span-6 space-y-6">
          {/* Header info */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.2em] text-[#9C7A1D] font-bold">
                SKU: {product.sku}
              </span>
              <span className="bg-[#4D0917]/10 text-[#7A1228] text-xs font-bold px-2 py-0.5 rounded uppercase">
                {product.category || 'Saree'}
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#3B0610] mt-1.5 leading-snug">
              {product.title}
            </h1>

            <div className="mt-3 flex items-baseline gap-3">
              <span className="font-serif text-3xl font-bold text-[#7A1228]">
                ₹{product.selling_price.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-gray-500 font-normal">
                (Inclusive of all taxes & complimentary fall/pico)
              </span>
            </div>
          </div>

          {/* COLOR VARIANT PICKER */}
          <div className="bg-white p-5 rounded-2xl border border-[#D4AF37]/40 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-[#3B0610] flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-[#D4AF37]" />
                <span>Available Color Shades:</span>
              </label>
              <span className="text-xs text-gray-500">
                Selected: <strong className="text-[#7A1228]">{currentVariant.colorName}</strong>
              </span>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {variants.map((variant, index) => {
                const isSelected = selectedVariantIndex === index;
                const isSoldOut = variant.quantity <= 0;

                return (
                  <button
                    key={variant.colorName}
                    type="button"
                    onClick={() => setSelectedVariantIndex(index)}
                    className={`group relative flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs transition-all ${
                      isSelected
                        ? 'border-[#7A1228] bg-amber-50/50 ring-2 ring-[#7A1228]/20 font-bold text-[#3B0610] shadow-xs'
                        : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
                    } ${isSoldOut ? 'opacity-60' : ''}`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-gray-300 shrink-0 shadow-2xs"
                      style={{ backgroundColor: variant.hexCode || '#7A1228' }}
                    ></span>
                    <span>{variant.colorName}</span>
                    <span className={`text-[10px] font-mono ml-1 ${isSoldOut ? 'text-red-500' : 'text-emerald-700'}`}>
                      ({variant.quantity})
                    </span>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-[#7A1228]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-[#5C5552] leading-relaxed border-t border-b border-gray-200 py-4 font-light">
            {product.description}
          </p>

          {/* Primary WhatsApp Action CTAs */}
          <div className="space-y-3 pt-2">
            <a
              href={orderWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold py-4 rounded-xl text-sm sm:text-base tracking-wide shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>Enquire & Order in {currentVariant.colorName} on WhatsApp</span>
            </a>

            <a
              href={videoCallWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[#FAF7F2] hover:bg-white text-[#4D0917] border border-[#D4AF37] font-semibold py-3 rounded-xl text-xs sm:text-sm tracking-wide shadow-xs hover:shadow transition-all"
            >
              <Video className="w-4 h-4 text-[#7A1228]" />
              <span>Request Live Drape Video Call for this Shade</span>
            </a>
            <p className="text-[11px] text-center text-gray-500 italic">
              Connect directly with our boutique master stylist. Instant responses during working hours.
            </p>
          </div>

          {/* Specifications Matrix */}
          <div className="bg-white rounded-2xl p-6 border border-[#D4AF37]/30 shadow-xs space-y-4">
            <h3 className="font-serif text-base font-bold text-[#3B0610] flex items-center gap-2 border-b border-gray-100 pb-3">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>Weave & Fabric Specifications</span>
            </h3>

            <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 text-xs">
              <div>
                <span className="text-gray-400 block uppercase tracking-wider text-[10px]">Category</span>
                <span className="font-semibold text-[#1A1617]">{product.category}</span>
              </div>
              <div>
                <span className="text-gray-400 block uppercase tracking-wider text-[10px]">Weave Type</span>
                <span className="font-semibold text-[#1A1617]">{product.weave}</span>
              </div>
              <div>
                <span className="text-gray-400 block uppercase tracking-wider text-[10px]">Fabric Purity</span>
                <span className="font-semibold text-[#1A1617]">{product.fabric}</span>
              </div>
              <div>
                <span className="text-gray-400 block uppercase tracking-wider text-[10px]">Zari Specification</span>
                <span className="font-semibold text-[#1A1617]">{product.zari_type}</span>
              </div>
              <div>
                <span className="text-gray-400 block uppercase tracking-wider text-[10px]">Selected Color</span>
                <span className="font-semibold text-[#1A1617]">{currentVariant.colorName}</span>
              </div>
              <div>
                <span className="text-gray-400 block uppercase tracking-wider text-[10px]">Total Saree Length</span>
                <span className="font-semibold text-[#1A1617]">{product.length_meters} Meters (with blouse)</span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-400 block uppercase tracking-wider text-[10px]">Blouse Details</span>
                <span className="font-semibold text-[#1A1617]">{product.blouse_details}</span>
              </div>
            </div>
          </div>

          {/* Pure Silk Preservation Note */}
          <div className="bg-[#FAF7F2] border border-[#D4AF37]/40 rounded-xl p-4 flex items-start gap-3 text-xs text-[#3B0610]">
            <Info className="w-4 h-4 text-[#9C7A1D] shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold">Care & Preservation:</strong>
              <span>Dry clean only. Store draped in pure cotton or muslin cloth away from direct moisture to preserve the natural zari luster for generations.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
