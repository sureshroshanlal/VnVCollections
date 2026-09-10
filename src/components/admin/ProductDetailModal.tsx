'use client';

import React, { useState } from 'react';
import { Product } from '@/lib/types';
import {
  X,
  Edit3,
  ShoppingBag,
  ExternalLink,
  Trash2,
  Sparkles,
  Tag,
  Layers,
  Scissors,
  DollarSign,
  TrendingUp,
  PackageCheck,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (product: Product) => void;
  onRecordSale: (productId: string) => void;
  onDelete: (productId: string, title: string) => void;
}

export default function ProductDetailModal({
  product,
  isOpen,
  onClose,
  onEdit,
  onRecordSale,
  onDelete,
}: ProductDetailModalProps) {
  if (!isOpen || !product) return null;

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const images = product.images && product.images.length > 0
    ? product.images
    : ['/images/products/kanjeevaram-crimson.jpg'];

  const currentImage = images[selectedImageIndex] || images[0];

  const unitProfit = product.selling_price - product.buying_price;
  const unitMargin = product.selling_price > 0 ? (unitProfit / product.selling_price) * 100 : 0;
  const totalCostValuation = product.buying_price * product.stock_quantity;
  const totalRetailValuation = product.selling_price * product.stock_quantity;
  const totalPotentialProfit = totalRetailValuation - totalCostValuation;

  const isOutOfStock = product.stock_quantity <= 0;
  const isLowStock = product.stock_quantity === 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl border border-[#D4AF37]/30 shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden text-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#3B0610] text-[#FAF7F2] px-6 py-4 flex items-center justify-between border-b border-[#D4AF37]/30 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <span className="font-mono text-xs text-[#E6C566] bg-black/25 px-2.5 py-1 rounded-md border border-[#D4AF37]/30 font-bold shrink-0">
              {product.sku}
            </span>
            <div className="min-w-0">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#F9E29D] truncate">
                {product.title}
              </h2>
              <div className="flex items-center gap-2 text-[11px] text-[#FAF7F2]/75">
                <span className="uppercase tracking-wider font-semibold text-[#D4AF37]">
                  {product.category || 'Saree'}
                </span>
                <span>&bull;</span>
                <span>{product.weave}</span>
                {product.is_featured && (
                  <>
                    <span>&bull;</span>
                    <span className="text-[#F9E29D] flex items-center gap-0.5">
                      <Sparkles className="w-3 h-3 text-[#D4AF37]" /> Featured Piece
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Quick Header Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onEdit(product)}
              className="bg-[#D4AF37] hover:bg-[#F9E29D] text-[#3B0610] px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              title="Edit saree details"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Edit</span>
            </button>

            <a
              href={`/catalog/${product.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 hover:bg-white/20 text-[#FAF7F2] px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5"
              title="Preview customer product page"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="hidden sm:inline">Live Storefront</span>
            </a>

            <button
              onClick={onClose}
              className="text-white/70 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors ml-1"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1 bg-[#FAF7F2]/40">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left Column: Visual Gallery & Specs (5 cols) */}
            <div className="md:col-span-5 space-y-4">
              {/* Primary Image Display */}
              <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border border-[#D4AF37]/30 shadow-md bg-white">
                <img
                  src={currentImage}
                  alt={product.title}
                  className="w-full h-full object-cover object-center"
                />

                <div className="absolute top-3 right-3">
                  {isOutOfStock ? (
                    <span className="bg-red-900/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-xs">
                      Sold Out
                    </span>
                  ) : isLowStock ? (
                    <span className="bg-amber-600/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-xs animate-pulse">
                      Only 1 Left
                    </span>
                  ) : (
                    <span className="bg-emerald-800/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-xs">
                      {product.stock_quantity} In Stock
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnails row (if multiple images) */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-14 h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                        selectedImageIndex === idx
                          ? 'border-[#7A1228] scale-105 shadow-sm'
                          : 'border-gray-200 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Artisan & Weave Specifications */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs space-y-2.5 text-xs">
                <h4 className="font-serif font-bold text-[#3B0610] uppercase tracking-wider text-[11px] border-b border-gray-100 pb-1.5 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Weave & Loom Specs</span>
                </h4>
                <div className="space-y-1.5 text-gray-700">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Category:</span>
                    <span className="font-semibold text-gray-900">{product.category || 'Saree'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Weave:</span>
                    <span className="font-semibold text-gray-900">{product.weave}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Fabric:</span>
                    <span className="font-semibold text-gray-900">{product.fabric}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Zari Type:</span>
                    <span className="font-semibold text-[#7A1228]">{product.zari_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Length:</span>
                    <span className="font-semibold text-gray-900">{product.length_meters || 6.2} meters</span>
                  </div>
                  <div className="pt-1 border-t border-gray-100">
                    <span className="text-gray-500 block text-[10px] uppercase font-semibold">Blouse Details:</span>
                    <span className="text-gray-700 text-[11px] italic leading-snug">{product.blouse_details}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Confidential Financials, Stock & Color Breakdown (7 cols) */}
            <div className="md:col-span-7 space-y-5">
              {/* Financial Performance Ledger (Confidential Admin View) */}
              <div className="bg-white rounded-2xl p-5 border border-[#D4AF37]/40 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <h3 className="font-serif text-sm font-bold text-[#3B0610] flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-[#D4AF37]" />
                    <span>Confidential Financials & Margins</span>
                  </h3>
                  <span className="text-[10px] uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                    Admin Eyes Only
                  </span>
                </div>

                {/* 3 Price Metrics Cards */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-[#FAF7F2] p-3 rounded-xl border border-gray-200">
                    <span className="text-[10px] text-gray-500 uppercase font-semibold block">
                      Buying Cost
                    </span>
                    <span className="font-mono text-base font-bold text-gray-900">
                      ₹{product.buying_price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[9px] text-gray-400 block mt-0.5">Wholesale cost</span>
                  </div>

                  <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#D4AF37]/50">
                    <span className="text-[10px] text-[#7A1228] uppercase font-bold block">
                      Selling Price
                    </span>
                    <span className="font-mono text-base font-bold text-[#7A1228]">
                      ₹{product.selling_price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[9px] text-gray-500 block mt-0.5">Boutique MRP</span>
                  </div>

                  <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-200">
                    <span className="text-[10px] text-emerald-800 uppercase font-bold block">
                      Profit / Unit
                    </span>
                    <span className="font-mono text-base font-bold text-emerald-700">
                      +₹{unitProfit.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[9px] text-emerald-600 font-semibold block mt-0.5">
                      {unitMargin.toFixed(1)}% margin
                    </span>
                  </div>
                </div>

                {/* Inventory Valuation for this Saree */}
                <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-200/60 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-gray-600 block text-[11px]">Remaining Stock Valuation:</span>
                    <span className="font-mono font-bold text-gray-900">
                      ₹{totalCostValuation.toLocaleString('en-IN')}{' '}
                      <span className="text-gray-400 font-normal text-[10px]">(Cost)</span> &rarr;{' '}
                      <span className="text-[#7A1228]">₹{totalRetailValuation.toLocaleString('en-IN')}</span>{' '}
                      <span className="text-gray-400 font-normal text-[10px]">(Retail)</span>
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-emerald-700 uppercase font-bold block">
                      Potential Profit
                    </span>
                    <span className="font-mono font-bold text-emerald-800 text-sm">
                      +₹{totalPotentialProfit.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Color Variants Stock Breakdown */}
              <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-sm font-bold text-[#3B0610] flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-[#D4AF37]" />
                    <span>Color Variants & Stock Availability</span>
                  </h3>
                  <span className="font-mono text-xs font-bold text-gray-700 bg-gray-100 px-2.5 py-0.5 rounded-full">
                    Total Units: {product.stock_quantity}
                  </span>
                </div>

                {product.color_variants && product.color_variants.length > 0 ? (
                  <div className="space-y-2">
                    {product.color_variants.map((v, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 bg-[#FAF7F2]/50 hover:bg-[#FAF7F2] transition-colors text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className="w-4 h-4 rounded-full border border-gray-300 shadow-2xs shrink-0"
                            style={{ backgroundColor: v.hexCode || '#7A1228' }}
                          ></span>
                          <div>
                            <span className="font-semibold text-gray-900">{v.colorName}</span>
                            {v.hexCode && (
                              <span className="text-[10px] text-gray-400 font-mono ml-2">
                                {v.hexCode}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`font-mono font-bold px-2.5 py-0.5 rounded-full text-xs ${
                              v.quantity <= 0
                                ? 'bg-red-100 text-red-800'
                                : v.quantity === 1
                                ? 'bg-amber-100 text-amber-800 animate-pulse'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {v.quantity} {v.quantity === 1 ? 'unit' : 'units'}
                          </span>
                          {v.quantity <= 0 && (
                            <span className="text-[10px] text-red-600 font-bold uppercase">
                              Out of stock
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 bg-gray-50 rounded-xl text-xs text-gray-600">
                    <span>Primary Color: <strong>{product.color}</strong> ({product.stock_quantity} in stock)</span>
                  </div>
                )}
              </div>

              {/* Product Description */}
              <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-2">
                <h4 className="font-serif text-xs font-bold text-[#3B0610] uppercase tracking-wider">
                  Product Description & Story
                </h4>
                <p className="text-xs text-gray-700 leading-relaxed font-light">
                  {product.description || 'No detailed description provided.'}
                </p>
              </div>

              {/* Action Toolbar */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    onClose();
                    onRecordSale(product.id);
                  }}
                  className="flex-1 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <ShoppingBag className="w-4 h-4 fill-white" />
                  <span>Record Sale for this Piece</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onEdit(product);
                  }}
                  className="bg-[#4D0917] hover:bg-[#7A1228] text-[#F9E29D] font-bold py-2.5 px-5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Edit3 className="w-4 h-4 text-[#D4AF37]" />
                  <span>Edit Product Details</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onDelete(product.id, product.title);
                  }}
                  className="border border-red-200 hover:bg-red-50 text-red-600 font-semibold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                  title="Delete product"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
