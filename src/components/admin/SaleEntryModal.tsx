'use client';

import React, { useState, useEffect } from 'react';
import { Product, SalesChannel } from '@/lib/types';
import { recordSaleEntry } from '@/lib/storeService';
import { X, ShoppingBag, ArrowRight, DollarSign, TrendingUp, AlertTriangle, Palette } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SaleEntryModalProps {
  products: Product[];
  isOpen: boolean;
  onClose: () => void;
  onSaleCompleted: () => void;
  initialProductId?: string;
}

export default function SaleEntryModal({
  products,
  isOpen,
  onClose,
  onSaleCompleted,
  initialProductId,
}: SaleEntryModalProps) {
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [salePrice, setSalePrice] = useState<number>(0);
  const [costPrice, setCostPrice] = useState<number>(0);
  const [channel, setChannel] = useState<SalesChannel>('WhatsApp');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [saving, setSaving] = useState(false);

  // When initial product changes or modal opens
  useEffect(() => {
    if (initialProductId) {
      setSelectedProductId(initialProductId);
    } else if (products.length > 0 && !selectedProductId) {
      setSelectedProductId(products[0].id);
    }
  }, [initialProductId, products]);

  // When selected product changes, populate cost, sale price, and color variants
  useEffect(() => {
    const prod = products.find((p) => p.id === selectedProductId);
    if (prod) {
      setCostPrice(prod.buying_price);
      setSalePrice(prod.selling_price);
      if (prod.color_variants && prod.color_variants.length > 0) {
        setSelectedColor(prod.color_variants[0].colorName);
      } else {
        setSelectedColor(prod.color || 'Standard');
      }
    }
  }, [selectedProductId, products]);

  if (!isOpen) return null;

  const currentProduct = products.find((p) => p.id === selectedProductId);
  const totalRevenue = quantity * salePrice;
  const totalCost = quantity * costPrice;
  const totalProfit = totalRevenue - totalCost;
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
  const isOutOfStock = currentProduct ? currentProduct.stock_quantity <= 0 : false;

  // Selected color variant stock
  const currentColorVariant = currentProduct?.color_variants?.find(
    (v) => v.colorName.toLowerCase() === selectedColor.toLowerCase()
  );
  const currentColorStock = currentColorVariant ? currentColorVariant.quantity : currentProduct?.stock_quantity || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct) return;

    setSaving(true);
    try {
      await recordSaleEntry({
        product_id: currentProduct.id,
        sku: currentProduct.sku,
        product_title: currentProduct.title,
        selected_color: selectedColor,
        quantity,
        unit_cost_price: costPrice,
        unit_sale_price: salePrice,
        channel,
        customer_name: customerName.trim() || undefined,
        customer_phone: customerPhone.trim() || undefined,
        notes: notes.trim() || undefined,
        sale_date: new Date().toISOString(),
      });

      // Celebrate sale!
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#7A1228', '#25D366'],
        });
      } catch {}

      onSaleCompleted();
      onClose();
    } catch (err) {
      console.error('Failed to record sale:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-[#D4AF37]/50">
        {/* Header */}
        <div className="bg-[#3B0610] p-5 text-white flex items-center justify-between border-b border-[#D4AF37]/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#4D0917] border border-[#D4AF37] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-[#F9E29D]" />
            </div>
            <div>
              <h2 className="font-serif text-base font-bold text-[#F9E29D]">
                Record Saree / Dress Sale Entry
              </h2>
              <p className="text-[10px] text-white/70">
                Updates specific color stock & records profit in boutique ledger
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Select Product */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700 block">
              Select Saree / Dress <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-gray-300 rounded-xl text-xs sm:text-sm text-[#1A1617] focus:ring-2 focus:ring-[#D4AF37]"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  [{p.sku}] {p.title} &bull; Total Stock: {p.stock_quantity} &bull; ₹{p.selling_price.toLocaleString('en-IN')}
                </option>
              ))}
            </select>
          </div>

          {/* Color Variant Selection */}
          {currentProduct && currentProduct.color_variants && currentProduct.color_variants.length > 0 && (
            <div className="bg-amber-50/50 p-3.5 rounded-xl border border-[#D4AF37]/40 space-y-1.5">
              <label className="text-xs font-semibold text-[#7A1228] block flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Select Color Variant Sold</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentProduct.color_variants.map((v) => {
                  const isSelected = selectedColor.toLowerCase() === v.colorName.toLowerCase();
                  return (
                    <div
                      key={v.colorName}
                      onClick={() => setSelectedColor(v.colorName)}
                      className={`cursor-pointer flex items-center justify-between p-2.5 rounded-lg border text-xs transition-all ${
                        isSelected
                          ? 'border-[#7A1228] bg-white ring-2 ring-[#7A1228]/20 shadow-xs'
                          : 'border-gray-200 bg-white/70 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-4 h-4 rounded-full border border-gray-300 shrink-0"
                          style={{ backgroundColor: v.hexCode || '#7A1228' }}
                        ></span>
                        <span className="font-semibold text-gray-800">{v.colorName}</span>
                      </div>
                      <span className={`font-mono text-[11px] font-bold ${v.quantity <= 0 ? 'text-red-600' : 'text-emerald-700'}`}>
                        {v.quantity} in stock
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {isOutOfStock && (
            <div className="bg-amber-50 border border-amber-300 text-amber-800 text-xs p-3 rounded-lg flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Warning: This piece has 0 stock. Recording a sale will maintain stock at 0.</span>
            </div>
          )}

          {/* Pricing & Profit Preview Card */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700 block">
                Buying Price (Cost per unit)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-bold">₹</span>
                <input
                  type="number"
                  required
                  value={costPrice}
                  onChange={(e) => setCostPrice(Number(e.target.value))}
                  className="w-full pl-7 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs sm:text-sm font-semibold text-gray-700"
                />
              </div>
              <span className="text-[10px] text-gray-400">Confidential purchase cost</span>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700 block">
                Selling Price (Realized per unit)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-bold">₹</span>
                <input
                  type="number"
                  required
                  value={salePrice}
                  onChange={(e) => setSalePrice(Number(e.target.value))}
                  className="w-full pl-7 pr-3 py-2 bg-[#FAF7F2] border border-gray-300 rounded-lg text-xs sm:text-sm font-bold text-[#7A1228]"
                />
              </div>
              <span className="text-[10px] text-gray-400">Actual price charged</span>
            </div>
          </div>

          {/* Quantity & Sales Channel */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700 block">Quantity Sold</label>
              <input
                type="number"
                min="1"
                required
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-gray-300 rounded-lg text-xs sm:text-sm font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700 block">Sales Channel</label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value as SalesChannel)}
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-gray-300 rounded-lg text-xs sm:text-sm font-semibold"
              >
                <option value="WhatsApp">WhatsApp VIP Concierge</option>
                <option value="In-Store">In-Store Walk-in</option>
                <option value="Instagram">Instagram Direct</option>
                <option value="Exhibition">Exhibition / Trunk Show</option>
                <option value="Website Inquiry">Website Inquiry</option>
              </select>
            </div>
          </div>

          {/* Real-time Profit Preview Pill */}
          <div className="bg-[#FAF7F2] border border-[#D4AF37]/40 rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-gray-500 block">Calculated Profit</span>
              <span className="font-serif text-xl font-bold text-emerald-800">
                +₹{totalProfit.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider text-gray-500 block">Margin</span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full inline-block">
                {profitMargin.toFixed(1)}% Gross Margin
              </span>
            </div>
          </div>

          {/* Customer Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700 block">Customer Name (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Smt. Lakshmi"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-gray-300 rounded-lg text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700 block">Customer Phone (Optional)</label>
              <input
                type="text"
                placeholder="e.g. +91 98450 12345"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-gray-300 rounded-lg text-xs"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700 block">Order Notes / Customization</label>
            <input
              type="text"
              placeholder="e.g. Custom fall & pico included; dispatched via courier."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-[#FAF7F2] border border-gray-300 rounded-lg text-xs"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-[#4D0917] hover:bg-[#7A1228] text-[#F9E29D] font-bold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2"
            >
              <span>{saving ? 'Recording...' : 'Confirm Sale & Deduct Stock'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
