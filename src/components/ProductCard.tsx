'use client';

import React from 'react';
import Image from 'next/image';
import { Product } from '@/lib/types';
import { MessageCircle, Sparkles, Eye } from 'lucide-react';
import { generateWhatsAppInquiryUrl } from '@/lib/storeService';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const isOutOfStock = product.stock_quantity <= 0;
  const isLowStock = product.stock_quantity === 1;
  const imageUrl = product.images?.[0] || '/images/products/kanjeevaram-crimson.jpg';
  const whatsappUrl = generateWhatsAppInquiryUrl(product);

  return (
    <div className="group bg-white rounded-xl overflow-hidden border border-[#D4AF37]/20 shadow-sm hover:shadow-xl hover:border-[#D4AF37]/60 transition-all duration-300 flex flex-col justify-between">
      {/* Media & Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#FAF7F2]">
        <img
          src={imageUrl}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          <span className="bg-[#4D0917]/90 backdrop-blur-md text-[#F9E29D] border border-[#D4AF37]/40 text-[10px] uppercase font-semibold px-2.5 py-1 rounded-full tracking-wider flex items-center gap-1 shadow-sm">
            <Sparkles className="w-2.5 h-2.5 text-[#D4AF37]" />
            {product.weave}
          </span>
          {product.is_featured && (
            <span className="bg-[#D4AF37] text-[#3B0610] text-[10px] uppercase font-bold px-2 py-0.5 rounded-full tracking-wider shadow-sm">
              Royal Pick
            </span>
          )}
        </div>

        {/* Stock Status Pill */}
        <div className="absolute top-3 right-3 z-10">
          {isOutOfStock ? (
            <span className="bg-red-900/90 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm">
              Sold Out
            </span>
          ) : isLowStock ? (
            <span className="bg-amber-600/90 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm animate-pulse">
              Only 1 Left
            </span>
          ) : (
            <span className="bg-emerald-800/90 text-white text-[10px] font-medium px-2 py-0.5 rounded-full backdrop-blur-sm">
              In Stock
            </span>
          )}
        </div>

        {/* Hover Quick Action Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
          <a
            href={`/catalog/${product.slug}`}
            className="w-full bg-white/90 hover:bg-white text-[#3B0610] text-xs font-semibold py-2 rounded-lg flex items-center justify-center gap-1.5 shadow-md backdrop-blur-sm transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Drape & Specs</span>
          </a>
        </div>
      </div>

      {/* Saree Details & Pricing */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="uppercase tracking-wider text-[#9C7A1D] font-medium truncate">
              {product.fabric}
            </span>
            {product.category && product.category !== 'Saree' && (
              <span className="bg-[#4D0917]/10 text-[#7A1228] font-bold text-[9px] px-1.5 py-0.2 rounded uppercase">
                {product.category}
              </span>
            )}
          </div>

          <h3 className="font-serif text-base font-semibold text-[#1A1617] group-hover:text-[#7A1228] transition-colors line-clamp-1 mt-0.5">
            <a href={`/catalog/${product.slug}`}>{product.title}</a>
          </h3>

          {/* Color Swatches */}
          {product.color_variants && product.color_variants.length > 0 && (
            <div className="flex items-center gap-1.5 mt-1.5">
              <div className="flex -space-x-1 items-center">
                {product.color_variants.slice(0, 4).map((v, i) => (
                  <span
                    key={i}
                    title={`${v.colorName} (${v.quantity} in stock)`}
                    className="w-3.5 h-3.5 rounded-full border-2 border-white shadow-2xs"
                    style={{ backgroundColor: v.hexCode || '#7A1228' }}
                  ></span>
                ))}
              </div>
              <span className="text-[10px] text-gray-500">
                {product.color_variants.length} color{product.color_variants.length > 1 ? 's' : ''}
              </span>
            </div>
          )}

          <p className="text-xs text-[#5C5552] line-clamp-2 mt-1.5 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-gray-500 block uppercase tracking-wider">Price</span>
            <span className="font-serif text-lg font-bold text-[#4D0917]">
              ₹{product.selling_price.toLocaleString('en-IN')}
            </span>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow-sm hover:shadow transition-all"
            title="Enquire & Order on WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-white" />
            <span>Enquire</span>
          </a>
        </div>
      </div>
    </div>
  );
}
