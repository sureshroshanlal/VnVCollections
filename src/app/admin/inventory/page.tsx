'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminNav from '@/components/admin/AdminNav';
import SaleEntryModal from '@/components/admin/SaleEntryModal';
import ProductDetailModal from '@/components/admin/ProductDetailModal';
import { fetchProducts, deleteProduct, saveProduct } from '@/lib/storeService';
import { Product } from '@/lib/types';
import {
  Package,
  PlusCircle,
  ShoppingBag,
  Trash2,
  ExternalLink,
  Sparkles,
  AlertTriangle,
  Search,
  Eye,
  Edit3,
} from 'lucide-react';

export default function InventoryManagementPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [saleModalProduct, setSaleModalProduct] = useState<string | undefined>(undefined);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [selectedProductForView, setSelectedProductForView] = useState<Product | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Auth Guard
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isAuth = localStorage.getItem('vv_admin_auth') || sessionStorage.getItem('vv_admin_auth');
      if (!isAuth) {
        router.push('/admin/login');
        return;
      }
    }
    loadProducts();
  }, [router]);

  const loadProducts = async () => {
    setLoading(false);
    const data = await fetchProducts();
    setProducts(data);
    setLoading(false);
  };

  const handleStockChange = async (product: Product, delta: number) => {
    const newQty = Math.max(0, product.stock_quantity + delta);
    await saveProduct({
      ...product,
      stock_quantity: newQty,
    });
    loadProducts();
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to remove "${title}" from boutique inventory?`)) {
      await deleteProduct(id);
      loadProducts();
    }
  };

  const openSaleModal = (productId: string) => {
    setSaleModalProduct(productId);
    setIsSaleModalOpen(true);
  };

  const openViewModal = (product: Product) => {
    setSelectedProductForView(product);
    setIsViewModalOpen(true);
  };

  const filteredProducts = products.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.weave.toLowerCase().includes(q) ||
      p.color.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col">
      <AdminNav />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D4AF37]/30 pb-5">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-[#9C7A1D] font-bold">
              Stock Control & Margins
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#3B0610]">
              Inventory Management
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Maintain stock counts, buying vs selling prices, and track item profit margins
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/admin/inventory/new"
              className="bg-[#4D0917] hover:bg-[#7A1228] text-[#F9E29D] font-bold px-4 py-2.5 rounded-xl text-xs tracking-wider uppercase transition-all shadow-sm flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Saree / Dress</span>
            </a>
          </div>
        </div>

        {/* Search & Stats Filter */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by SKU, title, weave, or color..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#FAF7F2] border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-600">
            <span>Total Catalog Items: <strong>{products.length}</strong></span>
            <span>&bull;</span>
            <span>Total Stock Units: <strong>{products.reduce((acc, p) => acc + p.stock_quantity, 0)}</strong></span>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-2xl border border-[#D4AF37]/30 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF7F2] text-gray-600 uppercase tracking-wider text-[10px] border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4">Weave & Fabric</th>
                  <th className="py-3 px-4 text-right">Buying Price (Cost)</th>
                  <th className="py-3 px-4 text-right">Selling Price (MRP)</th>
                  <th className="py-3 px-4 text-right">Margin / Unit</th>
                  <th className="py-3 px-4 text-center">Stock</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((product) => {
                  const unitProfit = product.selling_price - product.buying_price;
                  const unitMargin = product.selling_price > 0 ? (unitProfit / product.selling_price) * 100 : 0;
                  const isOutOfStock = product.stock_quantity <= 0;
                  const isLowStock = product.stock_quantity === 1;

                  return (
                    <tr key={product.id} className="hover:bg-amber-50/40 transition-colors">
                      {/* Item Image & Title */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => openViewModal(product)}
                            className="group/thumb relative w-12 h-14 shrink-0 rounded-lg overflow-hidden border border-gray-200 hover:border-[#D4AF37] transition-colors"
                            title="Click to view full specifications"
                          >
                            <img
                              src={product.images?.[0] || '/images/products/kanjeevaram-crimson.jpg'}
                              alt={product.title}
                              className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center">
                              <Eye className="w-3.5 h-3.5 text-white drop-shadow-sm" />
                            </div>
                          </button>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-[10px] font-bold text-gray-500 block">
                                {product.sku}
                              </span>
                              <span className="bg-[#4D0917]/10 text-[#7A1228] text-[9px] font-bold px-1.5 py-0.2 rounded uppercase">
                                {product.category || 'Saree'}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => openViewModal(product)}
                              className="font-serif font-bold text-gray-900 hover:text-[#7A1228] line-clamp-1 text-xs text-left transition-colors"
                              title="Click to view full details"
                            >
                              {product.title}
                            </button>
                            
                            {/* Color Variants Stock Breakdown */}
                            <div className="flex flex-wrap gap-1 mt-1">
                              {product.color_variants && product.color_variants.length > 0 ? (
                                product.color_variants.map((v, i) => (
                                  <span
                                    key={i}
                                    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono ${
                                      v.quantity <= 0 ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-700'
                                    }`}
                                  >
                                    <span
                                      className="w-2 h-2 rounded-full shrink-0"
                                      style={{ backgroundColor: v.hexCode || '#7A1228' }}
                                    ></span>
                                    <span>{v.colorName}: <strong>{v.quantity}</strong></span>
                                  </span>
                                ))
                              ) : (
                                <span className="text-[10px] text-gray-500">{product.color}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Weave & Fabric */}
                      <td className="py-3.5 px-4 text-gray-700">
                        <span className="font-semibold block">{product.weave}</span>
                        <span className="text-[10px] text-gray-500 line-clamp-1">{product.fabric}</span>
                      </td>

                      {/* Buying Price (Confidential Cost) */}
                      <td className="py-3.5 px-4 text-right font-mono text-gray-700">
                        ₹{product.buying_price.toLocaleString('en-IN')}
                      </td>

                      {/* Selling Price (Public MRP) */}
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-[#4D0917]">
                        ₹{product.selling_price.toLocaleString('en-IN')}
                      </td>

                      {/* Margin / Unit */}
                      <td className="py-3.5 px-4 text-right font-mono">
                        <span className="font-bold text-emerald-700 block">
                          +₹{unitProfit.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-emerald-600 font-medium">
                          {unitMargin.toFixed(0)}% margin
                        </span>
                      </td>

                      {/* Stock Adjuster */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleStockChange(product, -1)}
                            className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold flex items-center justify-center text-xs"
                            title="Decrease stock by 1"
                          >
                            -
                          </button>
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-bold font-mono ${
                              isOutOfStock
                                ? 'bg-red-100 text-red-700'
                                : isLowStock
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-50 text-emerald-800'
                            }`}
                          >
                            {product.stock_quantity}
                          </span>
                          <button
                            onClick={() => handleStockChange(product, 1)}
                            className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold flex items-center justify-center text-xs"
                            title="Increase stock by 1"
                          >
                            +
                          </button>
                        </div>
                        {isOutOfStock && (
                          <span className="block text-center text-[9px] text-red-600 font-bold uppercase mt-0.5">
                            Sold Out
                          </span>
                        )}
                        {isLowStock && (
                          <span className="block text-center text-[9px] text-amber-600 font-bold uppercase mt-0.5">
                            1 left
                          </span>
                        )}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Full Product Specifications */}
                          <button
                            onClick={() => openViewModal(product)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-colors"
                            title="View Full Saree Specifications & Confidential Financials"
                          >
                            <Eye className="w-3 h-3 text-gray-600" />
                            <span>View</span>
                          </button>

                          {/* Edit Product Specifications */}
                          <button
                            onClick={() => router.push(`/admin/inventory/${product.id}/edit`)}
                            className="bg-[#4D0917]/10 hover:bg-[#4D0917] text-[#7A1228] hover:text-[#F9E29D] px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-all"
                            title="Edit Saree Details, Pricing & Color Variants"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>

                          {/* Record Sale */}
                          <button
                            onClick={() => openSaleModal(product.id)}
                            className="bg-[#25D366] hover:bg-[#1EBE5D] text-white px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 shadow-2xs transition-colors"
                            title="Record a sale for this piece"
                          >
                            <ShoppingBag className="w-3 h-3 fill-white" />
                            <span>Sell</span>
                          </button>

                          {/* Delete Item */}
                          <button
                            onClick={() => handleDelete(product.id, product.title)}
                            className="text-gray-400 hover:text-red-600 p-1 rounded transition-colors"
                            title="Delete Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Product Detail Modal (Quick View & Specs) */}
      <ProductDetailModal
        product={selectedProductForView}
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        onEdit={(p) => router.push(`/admin/inventory/${p.id}/edit`)}
        onRecordSale={(prodId) => openSaleModal(prodId)}
        onDelete={(prodId, title) => handleDelete(prodId, title)}
      />

      {/* Sale Entry Modal */}
      <SaleEntryModal
        products={products}
        isOpen={isSaleModalOpen}
        onClose={() => setIsSaleModalOpen(false)}
        onSaleCompleted={loadProducts}
        initialProductId={saleModalProduct}
      />
    </div>
  );
}
