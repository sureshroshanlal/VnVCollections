'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminNav from '@/components/admin/AdminNav';
import MetricCard from '@/components/admin/MetricCard';
import SaleEntryModal from '@/components/admin/SaleEntryModal';
import { calculateDashboardStats, fetchProducts, fetchSales } from '@/lib/storeService';
import { Product, Sale, DashboardStats } from '@/lib/types';
import {
  DollarSign,
  TrendingUp,
  Package,
  Boxes,
  PlusCircle,
  ShoppingBag,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);

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
    const [fetchedStats, fetchedProducts, fetchedSales] = await Promise.all([
      calculateDashboardStats(),
      fetchProducts(),
      fetchSales(),
    ]);
    setStats(fetchedStats);
    setProducts(fetchedProducts);
    setSales(fetchedSales);
    setLoading(false);
  };

  if (loading || !stats) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col">
        <AdminNav />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <Sparkles className="w-8 h-8 animate-spin text-[#D4AF37] mx-auto" />
            <p className="font-serif text-[#3B0610]">Loading Boutique Financial Ledger...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col">
      <AdminNav />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Page Top Header with Quick Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D4AF37]/30 pb-5">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-[#9C7A1D] font-bold">
              Boutique Overview
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#3B0610]">
              Financial & Inventory Dashboard
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Live tracking of revenue, acquisition costs, net profit, and stock valuation
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSaleModalOpen(true)}
              className="bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold px-4 py-2.5 rounded-xl text-xs tracking-wider uppercase transition-all shadow-sm flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4 fill-white" />
              <span>Record Sale Entry</span>
            </button>

            <a
              href="/admin/inventory/new"
              className="bg-[#4D0917] hover:bg-[#7A1228] text-[#F9E29D] font-bold px-4 py-2.5 rounded-xl text-xs tracking-wider uppercase transition-all shadow-sm flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add New Saree</span>
            </a>
          </div>
        </div>

        {/* CUMULATIVE FINANCIAL STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Total Revenue */}
          <MetricCard
            title="Total Realized Revenue"
            value={`₹${stats.totalRevenue.toLocaleString('en-IN')}`}
            subtitle={`Across ${stats.salesCount} recorded sales`}
            icon={DollarSign}
            trend="Gross Boutique Income"
          />

          {/* Cost of Goods Sold */}
          <MetricCard
            title="Cost of Goods Sold (COGS)"
            value={`₹${stats.totalCost.toLocaleString('en-IN')}`}
            subtitle="Original weaver acquisition cost"
            icon={Boxes}
            trend="Procurement Outflow"
          />

          {/* Net Profit */}
          <MetricCard
            title="Net Realized Profit"
            value={`₹${stats.totalProfit.toLocaleString('en-IN')}`}
            subtitle={`${stats.profitMargin.toFixed(1)}% Overall Gross Margin`}
            icon={TrendingUp}
            trend="Net Earnings After Cost"
            isProfit
          />

          {/* Active Inventory Count & Valuation */}
          <MetricCard
            title="Active Inventory in Stock"
            value={`${stats.totalStockUnits} Pieces`}
            subtitle={`Valuation: ₹${stats.inventoryRetailValuation.toLocaleString('en-IN')}`}
            icon={Package}
            trend={`${stats.lowStockItemsCount} items low/exclusive`}
          />
        </div>

        {/* INVENTORY VALUATION DETAILS & SALES CHANNELS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Inventory Valuation Breakdown */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-[#D4AF37]/30 shadow-xs space-y-4">
            <h2 className="font-serif text-base font-bold text-[#3B0610] flex items-center justify-between">
              <span>Unsold Stock Valuation & Potential Profit</span>
              <span className="text-xs font-sans text-gray-500 font-normal">
                {stats.totalCatalogItems} Catalog Items
              </span>
            </h2>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-[#FAF7F2] p-4 rounded-xl border border-gray-200">
                <span className="text-[11px] text-gray-500 uppercase tracking-wider block">
                  Total Purchase Investment
                </span>
                <span className="font-serif text-xl font-bold text-gray-800">
                  ₹{stats.inventoryCostValuation.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-gray-400 block mt-0.5">
                  Capital locked in current inventory
                </span>
              </div>

              <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#D4AF37]/40">
                <span className="text-[11px] text-[#7A1228] uppercase tracking-wider block font-semibold">
                  Expected Retail Value
                </span>
                <span className="font-serif text-xl font-bold text-[#7A1228]">
                  ₹{stats.inventoryRetailValuation.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-emerald-700 font-medium block mt-0.5">
                  Potential Profit: +₹{(stats.inventoryRetailValuation - stats.inventoryCostValuation).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Quick Link */}
            <div className="pt-2 flex items-center justify-between text-xs border-t border-gray-100">
              <span className="text-gray-500">View and adjust buying/selling prices</span>
              <a
                href="/admin/inventory"
                className="text-[#7A1228] hover:text-[#D4AF37] font-semibold flex items-center gap-1"
              >
                <span>Manage Inventory & Stock</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Sales by Channel Distribution */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-[#D4AF37]/30 shadow-xs space-y-4">
            <h2 className="font-serif text-base font-bold text-[#3B0610]">
              Sales Channel Performance
            </h2>

            <div className="space-y-3">
              {Object.keys(stats.channelBreakdown).length === 0 ? (
                <p className="text-xs text-gray-500 py-4">No sales recorded yet.</p>
              ) : (
                Object.entries(stats.channelBreakdown).map(([channel, data]) => {
                  const percentage = stats.totalRevenue > 0 ? (data.revenue / stats.totalRevenue) * 100 : 0;
                  return (
                    <div key={channel} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-gray-800">{channel}</span>
                        <span className="text-gray-500">
                          ₹{data.revenue.toLocaleString('en-IN')} ({percentage.toFixed(0)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-[#7A1228] h-full rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-[10px] text-gray-400">
                        <span>{data.count} items sold</span>
                        <span className="text-emerald-700 font-medium">+₹{data.profit.toLocaleString('en-IN')} profit</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* RECENT SALES LEDGER TABLE */}
        <div className="bg-white rounded-2xl border border-[#D4AF37]/30 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#7A1228]" />
              <h2 className="font-serif text-base font-bold text-[#3B0610]">
                Recent Sales & Profit Ledger
              </h2>
            </div>
            <a
              href="/admin/sales"
              className="text-xs text-[#7A1228] hover:text-[#D4AF37] font-semibold flex items-center gap-1"
            >
              <span>View Full History</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF7F2] text-gray-600 uppercase tracking-wider text-[10px] border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">SKU & Item</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Channel</th>
                  <th className="py-3 px-4 text-right">Cost Price</th>
                  <th className="py-3 px-4 text-right">Sale Price</th>
                  <th className="py-3 px-4 text-right">Net Profit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sales.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-400">
                      No sales recorded yet. Click "Record Sale Entry" above to log your first sale!
                    </td>
                  </tr>
                ) : (
                  sales.slice(0, 5).map((sale) => {
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
                          <span className="font-mono text-[11px] font-bold text-gray-700 block">
                            {sale.sku}
                          </span>
                          <span className="text-gray-900 font-medium truncate max-w-xs block">
                            {sale.product_title}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-gray-700">
                          {sale.customer_name || <span className="text-gray-400 italic">Walk-in</span>}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="bg-[#3B0610]/10 text-[#7A1228] px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider">
                            {sale.channel}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right text-gray-600 font-mono">
                          ₹{sale.unit_cost_price.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold text-[#3B0610] font-mono">
                          ₹{sale.unit_sale_price.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="font-bold text-emerald-700 font-mono block">
                            +₹{sale.total_profit.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-emerald-600 font-medium">
                            {margin.toFixed(0)}% margin
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
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
