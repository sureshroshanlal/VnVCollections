'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminNav from '@/components/admin/AdminNav';
import SaleEntryModal from '@/components/admin/SaleEntryModal';
import { fetchSales, fetchProducts } from '@/lib/storeService';
import { Sale, Product } from '@/lib/types';
import { ShoppingBag, PlusCircle, Search, Calendar, User, Phone, MessageSquare } from 'lucide-react';

export default function SalesHistoryPage() {
  const router = useRouter();
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Auth Guard
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isAuth = localStorage.getItem('vv_admin_auth') || sessionStorage.getItem('vv_admin_auth');
      if (!isAuth) {
        router.push('/admin/login');
        return;
      }
    }
    loadData();
  }, [router]);

  const loadData = async () => {
    setLoading(true);
    const [fetchedSales, fetchedProducts] = await Promise.all([fetchSales(), fetchProducts()]);
    setSales(fetchedSales);
    setProducts(fetchedProducts);
    setLoading(false);
  };

  const totalSalesRevenue = sales.reduce((acc, s) => acc + (Number(s.total_revenue) || 0), 0);
  const totalSalesProfit = sales.reduce((acc, s) => acc + (Number(s.total_profit) || 0), 0);

  const filteredSales = sales.filter((s) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.sku.toLowerCase().includes(q) ||
      s.product_title.toLowerCase().includes(q) ||
      (s.customer_name && s.customer_name.toLowerCase().includes(q)) ||
      s.channel.toLowerCase().includes(q)
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
              Ledger & Realized Gains
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#3B0610]">
              Sales History & Realized Profit
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Complete transaction record with automatic stock deduction and channel tracking
            </p>
          </div>

          <button
            onClick={() => setIsSaleModalOpen(true)}
            className="bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold px-4 py-2.5 rounded-xl text-xs tracking-wider uppercase transition-all shadow-sm flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4 fill-white" />
            <span>Record New Sale</span>
          </button>
        </div>

        {/* Aggregate Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
            <span className="text-xs text-gray-500 block">Total Orders Sold</span>
            <span className="font-serif text-xl font-bold text-gray-900">{sales.length} Transactions</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
            <span className="text-xs text-gray-500 block">Cumulative Sales Revenue</span>
            <span className="font-serif text-xl font-bold text-[#4D0917]">
              ₹{totalSalesRevenue.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-emerald-300 bg-emerald-50/40 shadow-xs">
            <span className="text-xs text-emerald-800 block font-semibold">Total Realized Profit</span>
            <span className="font-serif text-xl font-bold text-emerald-800">
              +₹{totalSalesProfit.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search sales by SKU, item, customer, or channel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#FAF7F2] border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>
        </div>

        {/* Sales Table */}
        <div className="bg-white rounded-2xl border border-[#D4AF37]/30 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF7F2] text-gray-600 uppercase tracking-wider text-[10px] border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">SKU & Item Title</th>
                  <th className="py-3 px-4">Customer Details</th>
                  <th className="py-3 px-4">Channel</th>
                  <th className="py-3 px-4 text-right">Cost Price</th>
                  <th className="py-3 px-4 text-right">Sale Price</th>
                  <th className="py-3 px-4 text-right">Net Profit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredSales.map((sale) => {
                  const margin = sale.total_revenue > 0 ? (sale.total_profit / sale.total_revenue) * 100 : 0;
                  return (
                    <tr key={sale.id} className="hover:bg-amber-50/40 transition-colors">
                      <td className="py-3.5 px-4 text-gray-500 whitespace-nowrap">
                        {new Date(sale.sale_date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-[10px] font-bold text-gray-600 block">
                          {sale.sku}
                        </span>
                        <span className="font-semibold text-gray-900 block">{sale.product_title}</span>
                        {sale.notes && (
                          <span className="text-[10px] text-gray-500 italic block mt-0.5">
                            Note: {sale.notes}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-gray-700">
                        <span className="font-medium block">{sale.customer_name || 'Walk-in Customer'}</span>
                        {sale.customer_phone && (
                          <span className="text-[10px] text-gray-500 block">{sale.customer_phone}</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="bg-[#3B0610]/10 text-[#7A1228] px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider">
                          {sale.channel}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-gray-600">
                        ₹{sale.unit_cost_price.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-[#4D0917]">
                        ₹{sale.unit_sale_price.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono">
                        <span className="font-bold text-emerald-700 block">
                          +₹{sale.total_profit.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-emerald-600 font-medium">
                          {margin.toFixed(0)}% margin
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Sale Entry Modal */}
      <SaleEntryModal
        products={products}
        isOpen={isSaleModalOpen}
        onClose={() => setIsSaleModalOpen(false)}
        onSaleCompleted={loadData}
      />
    </div>
  );
}
