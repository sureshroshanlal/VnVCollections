'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import ProductCard from '@/components/ProductCard';
import { fetchProducts } from '@/lib/storeService';
import { Product } from '@/lib/types';
import { Filter, Search, RotateCcw, Sparkles } from 'lucide-react';

function CatalogContent() {
  const searchParams = useSearchParams();
  const initialWeave = searchParams.get('weave') || 'all';
  const initialCategory = searchParams.get('category') || 'all';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [selectedWeave, setSelectedWeave] = useState<string>(initialWeave);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high'>('featured');

  useEffect(() => {
    async function loadData() {
      const data = await fetchProducts();
      setProducts(data);
      setLoading(false);
    }
    loadData();
  }, []);

  // Update filter when query param changes
  useEffect(() => {
    if (searchParams.get('weave')) {
      setSelectedWeave(searchParams.get('weave')!);
    }
    if (searchParams.get('category')) {
      setSelectedCategory(searchParams.get('category')!);
    }
  }, [searchParams]);

  // Unique Weaves & Categories list
  const weavesList = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.weave) set.add(p.weave);
    });
    return Array.from(set);
  }, [products]);

  const categoriesList = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [products]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (!p.is_active) return false;
      if (selectedWeave !== 'all' && p.weave !== selectedWeave) return false;
      if (selectedCategory !== 'all' && p.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;
      if (inStockOnly && p.stock_quantity <= 0) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(query);
        const matchesSku = p.sku.toLowerCase().includes(query);
        const matchesFabric = p.fabric.toLowerCase().includes(query);
        const matchesColor = p.color.toLowerCase().includes(query);
        const matchesDesc = p.description?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesSku && !matchesFabric && !matchesColor && !matchesDesc) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.selling_price - b.selling_price;
      if (sortBy === 'price-high') return b.selling_price - a.selling_price;
      // Default: featured first, then newest
      if (a.is_featured && !b.is_featured) return -1;
      if (!a.is_featured && b.is_featured) return 1;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [products, selectedWeave, selectedCategory, inStockOnly, searchQuery, sortBy]);

  const resetFilters = () => {
    setSelectedWeave('all');
    setSelectedCategory('all');
    setSearchQuery('');
    setInStockOnly(false);
    setSortBy('featured');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
        <span className="text-xs uppercase tracking-[0.25em] text-[#9C7A1D] font-semibold">
          Authentic Handloom Silks
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#3B0610]">
          The Boutique Collection
        </h1>
        <p className="text-xs sm:text-sm text-[#5C5552] leading-relaxed">
          Each piece is woven with devotion. Tap any saree to view weave details, blouse specifications, or request a live WhatsApp video drape.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#D4AF37]/30 shadow-sm mb-8 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          {/* Search Box */}
          <div className="sm:col-span-4 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search weave, color, or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 bg-[#FAF7F2] border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37]"
            />
          </div>

          {/* Category Select */}
          <div className="sm:col-span-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-gray-200 rounded-xl text-xs sm:text-sm text-[#1A1617] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
            >
              <option value="all">All Categories</option>
              {categoriesList.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Weave Select */}
          <div className="sm:col-span-3">
            <select
              value={selectedWeave}
              onChange={(e) => setSelectedWeave(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-gray-200 rounded-xl text-xs sm:text-sm text-[#1A1617] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
            >
              <option value="all">All Weaves</option>
              {weavesList.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Select */}
          <div className="sm:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-gray-200 rounded-xl text-xs sm:text-sm text-[#1A1617] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
            >
              <option value="featured">Featured First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {/* In Stock & Reset */}
          <div className="sm:col-span-1 flex items-center justify-between sm:justify-end gap-2">
            <label className="flex items-center gap-1 text-xs text-[#3B0610] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-3.5 h-3.5 text-[#7A1228] rounded border-gray-300 focus:ring-[#D4AF37]"
              />
              <span className="text-[11px]">Stock</span>
            </label>

            {(selectedWeave !== 'all' || selectedCategory !== 'all' || searchQuery || inStockOnly) && (
              <button
                onClick={resetFilters}
                className="text-[#7A1228] hover:text-[#D4AF37] p-1"
                title="Reset Filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Weave Quick Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-gray-400 font-medium whitespace-nowrap">Quick Filter:</span>
          <button
            onClick={() => setSelectedWeave('all')}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition-all ${
              selectedWeave === 'all'
                ? 'bg-[#4D0917] text-[#F9E29D] font-semibold shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Pieces ({products.length})
          </button>
          {weavesList.map((w) => (
            <button
              key={w}
              onClick={() => setSelectedWeave(w)}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition-all ${
                selectedWeave === w
                  ? 'bg-[#4D0917] text-[#F9E29D] font-semibold shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      {/* Catalog Results Grid */}
      {loading ? (
        <div className="py-20 text-center text-[#9C7A1D] flex flex-col items-center justify-center gap-3">
          <Sparkles className="w-8 h-8 animate-spin text-[#D4AF37]" />
          <p className="font-serif text-base">Unveiling our handcrafted silks...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-gray-300 p-8">
          <p className="font-serif text-xl text-[#3B0610] font-semibold">No sarees match your criteria</p>
          <p className="text-xs text-gray-500 mt-1">Try clearing your search query or weave filters.</p>
          <button
            onClick={resetFilters}
            className="mt-4 inline-flex items-center gap-1.5 bg-[#4D0917] text-[#F9E29D] px-4 py-2 rounded-lg text-xs font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset All Filters
          </button>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between text-xs text-gray-500 mb-4 px-1">
            <span>Showing {filteredProducts.length} authentic handcrafted creations</span>
            <span className="text-[#9C7A1D] font-medium">100% Certified Handloom Guarantee</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CatalogPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2]">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<div className="py-20 text-center">Loading collection...</div>}>
          <CatalogContent />
        </Suspense>
      </main>
      <WhatsAppButton />
      <Footer />
    </div>
  );
}
