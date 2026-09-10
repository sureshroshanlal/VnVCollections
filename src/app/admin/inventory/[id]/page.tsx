'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminNav from '@/components/admin/AdminNav';
import { fetchProductById, deleteProduct } from '@/lib/storeService';
import { Product } from '@/lib/types';
import SaleEntryModal from '@/components/admin/SaleEntryModal';
import {
  ArrowLeft,
  Edit3,
  ShoppingBag,
  Trash2,
  Sparkles,
  Layers,
  DollarSign,
  Tag,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

export default function AdminProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isAuth = localStorage.getItem('vv_admin_auth') || sessionStorage.getItem('vv_admin_auth');
      if (!isAuth) {
        router.push('/admin/login');
        return;
      }
    }
    loadProduct();
  }, [productId, router]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      if (productId) {
        const found = await fetchProductById(productId);
        setProduct(found);
      }
    } catch (err) {
      console.error('Failed to load product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!product) return;
    if (window.confirm(`Are you sure you want to permanently delete "${product.title}"?`)) {
      await deleteProduct(product.id);
      router.push('/admin/inventory');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] text-gray-900 flex flex-col">
        <AdminNav />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-3 border-[#D4AF37] border-t-[#3B0610] rounded-full animate-spin"></div>
            <p className="font-serif text-sm font-semibold text-[#3B0610]">Loading Saree Specifications...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] text-gray-900 flex flex-col">
        <AdminNav />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="bg-white p-8 rounded-2xl border border-red-200 text-center max-w-md space-y-4 shadow-sm">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto" />
            <h2 className="font-serif text-lg font-bold text-gray-900">Product Not Found</h2>
            <p className="text-xs text-gray-600">The requested item could not be retrieved from inventory.</p>
            <a
              href="/admin/inventory"
              className="inline-flex items-center gap-2 bg-[#4D0917] text-[#F9E29D] px-4 py-2 rounded-xl text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Inventory</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-[#FAF7F2] text-gray-900 flex flex-col">
      <AdminNav />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        {/* Header Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/admin/inventory')}
              className="p-2 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors shadow-2xs"
              title="Back to Inventory"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-gray-500 font-bold">{product.sku}</span>
                <span className="bg-[#4D0917]/10 text-[#7A1228] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  {product.category || 'Saree'}
                </span>
                {product.is_featured && (
                  <span className="bg-[#D4AF37] text-[#3B0610] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" /> Featured
                  </span>
                )}
              </div>
              <h1 className="font-serif text-2xl font-bold text-[#3B0610] line-clamp-1">
                {product.title}
              </h1>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2.5">
            <a
              href={`/catalog/${product.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border border-gray-300 hover:border-[#D4AF37] text-gray-700 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#7A1228]" />
              <span className="hidden sm:inline">Storefront PDP</span>
            </a>

            <button
              onClick={() => setIsSaleModalOpen(true)}
              className="bg-[#25D366] hover:bg-[#1EBE5D] text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
            >
              <ShoppingBag className="w-3.5 h-3.5 fill-white" />
              <span>Record Sale</span>
            </button>

            <button
              onClick={() => router.push(`/admin/inventory/${product.id}/edit`)}
              className="bg-[#4D0917] hover:bg-[#7A1228] text-[#F9E29D] px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Edit Details</span>
            </button>

            <button
              onClick={handleDelete}
              className="border border-red-200 text-red-600 hover:bg-red-50 p-2 rounded-xl text-xs transition-colors"
              title="Delete item"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Product Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column: Visual Gallery & Loom Specs (5 cols) */}
          <div className="md:col-span-5 space-y-5">
            <div className="bg-white p-4 rounded-2xl border border-[#D4AF37]/30 shadow-xs space-y-3">
              <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden border border-gray-100 bg-[#FAF7F2]">
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

              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-14 h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                        selectedImageIndex === idx
                          ? 'border-[#7A1228] scale-105 shadow-xs'
                          : 'border-gray-200 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Weave & Fabric Specifications */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-3 text-xs">
              <h3 className="font-serif font-bold text-[#3B0610] uppercase tracking-wider text-xs border-b border-gray-100 pb-2 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#D4AF37]" />
                <span>Weave & Loom Specs</span>
              </h3>
              <div className="space-y-2 text-gray-700">
                <div className="flex justify-between">
                  <span className="text-gray-500">Category:</span>
                  <span className="font-semibold text-gray-900">{product.category || 'Saree'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Weave Style:</span>
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
                <div className="pt-2 border-t border-gray-100">
                  <span className="text-gray-500 block text-[10px] uppercase font-semibold">Blouse Details:</span>
                  <span className="text-gray-700 text-xs italic leading-relaxed">{product.blouse_details}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Confidential Financials, Color Variants & Description (7 cols) */}
          <div className="md:col-span-7 space-y-5">
            {/* Confidential Financials */}
            <div className="bg-white rounded-2xl p-6 border-2 border-[#D4AF37]/50 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <h3 className="font-serif text-sm font-bold text-[#3B0610] flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-[#D4AF37]" />
                  <span>Confidential Financials & Margins</span>
                </h3>
                <span className="text-[10px] uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold">
                  Admin Eyes Only
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#FAF7F2] p-3.5 rounded-xl border border-gray-200">
                  <span className="text-[10px] text-gray-500 uppercase font-semibold block">Buying Cost</span>
                  <span className="font-mono text-lg font-bold text-gray-900">
                    ₹{product.buying_price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[9px] text-gray-400 block mt-0.5">Wholesale cost</span>
                </div>

                <div className="bg-[#FAF7F2] p-3.5 rounded-xl border border-[#D4AF37]/50">
                  <span className="text-[10px] text-[#7A1228] uppercase font-bold block">Selling Price</span>
                  <span className="font-mono text-lg font-bold text-[#7A1228]">
                    ₹{product.selling_price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[9px] text-gray-500 block mt-0.5">Boutique MRP</span>
                </div>

                <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200">
                  <span className="text-[10px] text-emerald-800 uppercase font-bold block">Profit / Unit</span>
                  <span className="font-mono text-lg font-bold text-emerald-700">
                    +₹{unitProfit.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[9px] text-emerald-600 font-semibold block mt-0.5">
                    {unitMargin.toFixed(1)}% margin
                  </span>
                </div>
              </div>

              <div className="bg-amber-50/50 p-3.5 rounded-xl border border-amber-200/60 flex items-center justify-between text-xs">
                <div>
                  <span className="text-gray-600 block text-[11px]">Unsold Stock Valuation ({product.stock_quantity} units):</span>
                  <span className="font-mono font-bold text-gray-900">
                    ₹{totalCostValuation.toLocaleString('en-IN')}{' '}
                    <span className="text-gray-400 font-normal text-[10px]">(Cost)</span> &rarr;{' '}
                    <span className="text-[#7A1228]">₹{totalRetailValuation.toLocaleString('en-IN')}</span>{' '}
                    <span className="text-gray-400 font-normal text-[10px]">(Retail)</span>
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-emerald-700 uppercase font-bold block">Potential Profit</span>
                  <span className="font-mono font-bold text-emerald-800 text-sm">
                    +₹{totalPotentialProfit.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Color Variants Breakdown */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-sm font-bold text-[#3B0610] flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#D4AF37]" />
                  <span>Color Variants & Stock Quantities</span>
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
                      className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-[#FAF7F2]/50 hover:bg-[#FAF7F2] transition-colors text-xs"
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

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-2">
              <h4 className="font-serif text-xs font-bold text-[#3B0610] uppercase tracking-wider">
                Artisan Story & Product Description
              </h4>
              <p className="text-xs text-gray-700 leading-relaxed font-light">
                {product.description || 'No detailed description provided.'}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Sale Modal */}
      <SaleEntryModal
        products={[product]}
        isOpen={isSaleModalOpen}
        onClose={() => setIsSaleModalOpen(false)}
        onSaleCompleted={loadProduct}
        initialProductId={product.id}
      />
    </div>
  );
}
