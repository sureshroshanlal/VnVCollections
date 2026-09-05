'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import AdminNav from '@/components/admin/AdminNav';
import { saveProduct, fetchCategories, uploadSareeImage } from '@/lib/storeService';
import { ColorVariant } from '@/lib/types';
import {
  PlusCircle,
  ArrowLeft,
  UploadCloud,
  X,
  Sparkles,
  Trash2,
  Check,
  Palette,
  Layers,
} from 'lucide-react';

const PRESET_SAMPLE_IMAGES = [
  { label: 'Crimson Kanjeevaram Silk', url: '/images/products/kanjeevaram-crimson.jpg' },
  { label: 'Emerald Banarasi Silk', url: '/images/products/banarasi-emerald.jpg' },
  { label: 'Blush Organza Tissue', url: '/images/products/organza-rose.jpg' },
  { label: 'Mustard Yellow Paithani', url: '/images/products/paithani-mustard.jpg' },
];

export default function NewProductPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auth Guard
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isAuth = localStorage.getItem('vv_admin_auth') || sessionStorage.getItem('vv_admin_auth');
      if (!isAuth) {
        router.push('/admin/login');
      }
    }
    loadExistingCategories();
  }, [router]);

  // Categories state
  const [categoriesList, setCategoriesList] = useState<string[]>(['Saree', 'Dress', 'Lehenga', 'Fabric']);
  const [selectedCategory, setSelectedCategory] = useState<string>('Saree');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState('');

  const loadExistingCategories = async () => {
    const cats = await fetchCategories();
    setCategoriesList(cats);
  };

  // Basic Details
  const [title, setTitle] = useState('');
  const [sku, setSku] = useState(`VV-SAREE-${Math.floor(100 + Math.random() * 900)}`);
  const [weave, setWeave] = useState('Kanjeevaram Silk');
  const [fabric, setFabric] = useState('Pure 100% Mulberry Silk');
  const [zariType, setZariType] = useState('Pure Gold Zari (Tested Wire)');

  // Color Variants with Stock
  const [colorVariants, setColorVariants] = useState<ColorVariant[]>([
    { colorName: 'Temple Crimson & Gold', hexCode: '#7A1228', quantity: 2 },
  ]);

  // Financials
  const [buyingPrice, setBuyingPrice] = useState<number>(12000);
  const [sellingPrice, setSellingPrice] = useState<number>(22500);

  // Images state (multiple photos supported)
  const [images, setImages] = useState<string[]>([PRESET_SAMPLE_IMAGES[0].url]);
  const [isUploading, setIsUploading] = useState(false);

  // Saree Details
  const [description, setDescription] = useState(
    'Handcrafted by master artisans on traditional pit-looms. Features opulent contrast border and rich zari pallu work.'
  );
  const [blouseDetails, setBlouseDetails] = useState(
    'Includes 0.8m running unstitched pure silk blouse piece with matching zari sleeve border.'
  );
  const [lengthMeters, setLengthMeters] = useState<number>(6.2);
  const [isFeatured, setIsFeatured] = useState<boolean>(true);
  const [saving, setSaving] = useState(false);

  // Computed Values
  const totalStockUnits = colorVariants.reduce((acc, v) => acc + (Number(v.quantity) || 0), 0);
  const unitProfit = sellingPrice - buyingPrice;
  const marginPercent = sellingPrice > 0 ? (unitProfit / sellingPrice) * 100 : 0;

  // Category Selection Handler
  const handleCategoryChange = (val: string) => {
    if (val === '__NEW__') {
      setIsCustomCategory(true);
      setCustomCategoryInput('');
    } else {
      setIsCustomCategory(false);
      setSelectedCategory(val);
    }
  };

  // Color Variants Handlers
  const handleAddColorVariant = () => {
    setColorVariants([
      ...colorVariants,
      { colorName: '', hexCode: '#D4AF37', quantity: 1 },
    ]);
  };

  const handleUpdateColorVariant = (
    index: number,
    field: keyof ColorVariant,
    value: any
  ) => {
    const updated = [...colorVariants];
    updated[index] = { ...updated[index], [field]: value };
    setColorVariants(updated);
  };

  const handleRemoveColorVariant = (index: number) => {
    if (colorVariants.length <= 1) return;
    setColorVariants(colorVariants.filter((_, i) => i !== index));
  };

  // Image Upload Handlers
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const uploadedUrl = await uploadSareeImage(file);
        newUrls.push(uploadedUrl);
      }
      setImages((prev) => [...prev, ...newUrls]);
    } catch (err) {
      console.error('Error uploading image:', err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    if (images.length <= 1) return;
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSetPrimaryImage = (index: number) => {
    if (index === 0) return;
    const target = images[index];
    const remaining = images.filter((_, i) => i !== index);
    setImages([target, ...remaining]);
  };

  const handleSelectPreset = (url: string) => {
    if (!images.includes(url)) {
      setImages([url, ...images]);
    }
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const finalCategory = isCustomCategory
        ? customCategoryInput.trim() || 'Saree'
        : selectedCategory;

      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') || `item-${Date.now()}`;

      // Primary color summary
      const colorSummary = colorVariants.map((c) => c.colorName).filter(Boolean).join(', ') || 'Multicolor';

      await saveProduct({
        sku,
        title,
        slug: `${slug}-${sku.toLowerCase()}`,
        category: finalCategory,
        weave,
        fabric,
        zari_type: zariType,
        color: colorSummary,
        color_variants: colorVariants,
        description,
        blouse_details: blouseDetails,
        length_meters: lengthMeters,
        buying_price: buyingPrice,
        selling_price: sellingPrice,
        stock_quantity: totalStockUnits,
        images: images.length > 0 ? images : [PRESET_SAMPLE_IMAGES[0].url],
        is_featured: isFeatured,
        is_active: true,
      });

      router.push('/admin/inventory');
    } catch (err) {
      console.error('Failed to create product:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col">
      <AdminNav />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-4">
          <div className="flex items-center gap-3">
            <a
              href="/admin/inventory"
              className="p-2 bg-white rounded-lg border border-gray-200 text-gray-600 hover:text-[#7A1228]"
            >
              <ArrowLeft className="w-4 h-4" />
            </a>
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-[#9C7A1D] font-bold">
                New Catalog Entry
              </span>
              <h1 className="font-serif text-2xl font-bold text-[#3B0610]">
                Add New Saree / Dress with Color Variants
              </h1>
            </div>
          </div>
        </div>

        {/* Upload Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#D4AF37]/30 shadow-xs p-6 sm:p-8 space-y-8">
          {/* SECTION 1: BASIC IDENTIFIERS */}
          <div className="space-y-4">
            <h2 className="text-xs uppercase tracking-wider text-[#9C7A1D] font-bold border-b border-gray-100 pb-2">
              1. Saree & Category Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-semibold text-gray-700 block">
                  Product Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Mayil Temple Border Kanjeevaram Silk Saree"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-gray-300 rounded-lg text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700 block">
                  SKU / Identifier <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-gray-300 rounded-lg text-xs sm:text-sm font-mono font-bold text-[#7A1228]"
                />
              </div>
            </div>

            {/* DYNAMIC CATEGORY SELECTION */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#FAF7F2] p-4 rounded-xl border border-gray-200">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700 block flex items-center justify-between">
                  <span>Product Category</span>
                  <span className="text-[10px] text-gray-500">Select or add new</span>
                </label>
                <select
                  value={isCustomCategory ? '__NEW__' : selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm font-medium"
                >
                  {categoriesList.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                  <option value="__NEW__" className="font-bold text-[#7A1228]">
                    + Add New Custom Category...
                  </option>
                </select>
              </div>

              {isCustomCategory ? (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#7A1228] block">
                    Type New Category Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    placeholder="e.g. Dupattas, Kurti Sets, Shawls, etc."
                    value={customCategoryInput}
                    onChange={(e) => setCustomCategoryInput(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#D4AF37] rounded-lg text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-[#D4AF37]"
                  />
                </div>
              ) : (
                <div className="flex items-center text-xs text-gray-500 pt-5">
                  <span>Categories will dynamically appear in the storefront catalog filters.</span>
                </div>
              )}
            </div>

            {/* Weave, Fabric, Zari */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700 block">Weave Heritage</label>
                <input
                  type="text"
                  value={weave}
                  onChange={(e) => setWeave(e.target.value)}
                  placeholder="e.g. Kanjeevaram Silk"
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-gray-300 rounded-lg text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700 block">Fabric Composition</label>
                <input
                  type="text"
                  value={fabric}
                  onChange={(e) => setFabric(e.target.value)}
                  placeholder="e.g. Pure 100% Mulberry Silk"
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-gray-300 rounded-lg text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700 block">Zari Type</label>
                <input
                  type="text"
                  value={zariType}
                  onChange={(e) => setZariType(e.target.value)}
                  placeholder="e.g. Pure Gold Zari"
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-gray-300 rounded-lg text-xs"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: COLOR VARIANTS & INDIVIDUAL QUANTITIES */}
          <div className="space-y-4 bg-amber-50/40 p-5 rounded-xl border border-[#D4AF37]/40">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xs uppercase tracking-wider text-[#7A1228] font-bold flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-[#D4AF37]" />
                  <span>2. Available Colors & Stock per Color</span>
                </h2>
                <p className="text-[11px] text-gray-600 mt-0.5">
                  Capture each available color shade and how many pieces are in stock for that color.
                </p>
              </div>

              <span className="bg-[#4D0917] text-[#F9E29D] px-3 py-1 rounded-full text-xs font-bold font-mono">
                Total Stock: {totalStockUnits} Pieces
              </span>
            </div>

            <div className="space-y-3">
              {colorVariants.map((variant, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-3 items-center bg-white p-3 rounded-lg border border-gray-200 shadow-xs"
                >
                  {/* Swatch color picker */}
                  <div className="col-span-2 sm:col-span-1 flex flex-col items-center">
                    <input
                      type="color"
                      value={variant.hexCode || '#7A1228'}
                      onChange={(e) => handleUpdateColorVariant(index, 'hexCode', e.target.value)}
                      className="w-8 h-8 rounded-full border border-gray-300 cursor-pointer p-0 overflow-hidden"
                      title="Pick swatch color"
                    />
                  </div>

                  {/* Color Name */}
                  <div className="col-span-6 sm:col-span-7">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Temple Crimson, Peacock Blue, Mustard Gold..."
                      value={variant.colorName}
                      onChange={(e) => handleUpdateColorVariant(index, 'colorName', e.target.value)}
                      className="w-full px-3 py-1.5 bg-[#FAF7F2] border border-gray-300 rounded-md text-xs font-semibold"
                    />
                  </div>

                  {/* Quantity for this color */}
                  <div className="col-span-3 sm:col-span-3 flex items-center gap-1.5">
                    <span className="text-[11px] text-gray-500 whitespace-nowrap">Qty:</span>
                    <input
                      type="number"
                      min="0"
                      required
                      value={variant.quantity}
                      onChange={(e) =>
                        handleUpdateColorVariant(index, 'quantity', Math.max(0, Number(e.target.value)))
                      }
                      className="w-full px-2 py-1.5 bg-[#FAF7F2] border border-gray-300 rounded-md text-xs font-bold text-center font-mono"
                    />
                  </div>

                  {/* Remove Variant Button */}
                  <div className="col-span-1 text-right">
                    {colorVariants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveColorVariant(index)}
                        className="text-gray-400 hover:text-red-600 p-1"
                        title="Remove color variant"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddColorVariant}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7A1228] hover:text-[#3B0610] bg-white border border-[#D4AF37]/50 px-3 py-1.5 rounded-lg shadow-2xs hover:bg-[#FAF7F2] transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>+ Add Another Color Variant</span>
              </button>
            </div>
          </div>

          {/* SECTION 3: SAREE IMAGES (DEVICE UPLOAD & PREVIEW) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h2 className="text-xs uppercase tracking-wider text-[#9C7A1D] font-bold flex items-center gap-1.5">
                <UploadCloud className="w-4 h-4 text-[#D4AF37]" />
                <span>3. Saree Photography & Media Upload</span>
              </h2>
              <span className="text-[10px] text-gray-500">
                {images.length} photo(s) selected
              </span>
            </div>

            {/* Direct Device Upload Dropzone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#D4AF37]/60 hover:border-[#7A1228] bg-[#FAF7F2] hover:bg-[#FAF7F2]/80 rounded-2xl p-6 text-center cursor-pointer transition-colors space-y-2 group"
            >
              <input
                type="file"
                ref={fileInputRef}
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-full bg-[#4D0917]/10 flex items-center justify-center mx-auto text-[#7A1228] group-hover:scale-110 transition-transform">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div className="text-xs text-gray-700">
                <span className="font-bold text-[#7A1228]">Click to upload saree photos from device</span> or drag and drop
              </div>
              <p className="text-[10px] text-gray-400">
                Supports JPG, PNG, WEBP. Upload full drape, pallu close-up, and pleat details.
              </p>
              {isUploading && (
                <p className="text-xs text-amber-700 font-semibold animate-pulse">
                  Uploading and processing image(s)...
                </p>
              )}
            </div>

            {/* Selected Images Gallery Grid */}
            {images.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-gray-700 block">
                  Uploaded Saree Photos (Click "Make Primary" to set main thumbnail):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative rounded-xl overflow-hidden border-2 border-gray-200 aspect-[3/4] group bg-black/5"
                    >
                      <img src={img} alt={`Saree Photo ${idx + 1}`} className="w-full h-full object-cover" />

                      {/* Primary Badge */}
                      {idx === 0 ? (
                        <span className="absolute top-2 left-2 bg-[#4D0917] text-[#F9E29D] text-[9px] font-bold px-2 py-0.5 rounded shadow">
                          Primary
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSetPrimaryImage(idx)}
                          className="absolute top-2 left-2 bg-white/90 text-gray-700 hover:bg-white text-[9px] font-bold px-2 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Make Primary
                        </button>
                      )}

                      {/* Delete Photo */}
                      {images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-2 right-2 bg-red-600/90 hover:bg-red-700 text-white p-1 rounded-full shadow transition-colors"
                          title="Remove image"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Presets Quick Pick */}
            <div className="pt-2">
              <span className="text-[11px] text-gray-500 block mb-1">
                Or quickly pick an authentic sample weave image:
              </span>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                {PRESET_SAMPLE_IMAGES.map((preset) => (
                  <button
                    key={preset.url}
                    type="button"
                    onClick={() => handleSelectPreset(preset.url)}
                    className="whitespace-nowrap px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-[10px]"
                  >
                    + {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 4: FINANCIALS (BUYING VS SELLING PRICE) */}
          <div className="bg-[#FAF7F2] p-5 rounded-xl border-2 border-[#D4AF37]/50 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <h3 className="font-serif text-sm font-bold text-[#3B0610]">
                4. Financial Acquisition & Pricing
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700 block">
                  Buying Price / Weaver Cost (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={buyingPrice}
                  onChange={(e) => setBuyingPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm font-semibold font-mono"
                />
                <span className="text-[10px] text-gray-500">Confidential cost to boutique</span>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#7A1228] block">
                  Selling Price / Retail (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm font-bold font-mono text-[#7A1228]"
                />
                <span className="text-[10px] text-gray-500">Displayed on public catalog</span>
              </div>
            </div>

            {/* Margin Preview */}
            <div className="pt-3 border-t border-gray-200 flex items-center justify-between text-xs">
              <span className="text-gray-600">
                Gross Profit per Piece: <strong className="text-emerald-700 font-mono font-bold">+₹{unitProfit.toLocaleString('en-IN')}</strong>
              </span>
              <span className="bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full text-xs">
                {marginPercent.toFixed(1)}% Gross Margin
              </span>
            </div>
          </div>

          {/* SECTION 5: DESCRIPTION & ATTRIBUTES */}
          <div className="space-y-4">
            <h2 className="text-xs uppercase tracking-wider text-[#9C7A1D] font-bold border-b border-gray-100 pb-2">
              5. Saree Details & Measurements
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700 block">Total Length (Meters)</label>
                <input
                  type="number"
                  step="0.1"
                  value={lengthMeters}
                  onChange={(e) => setLengthMeters(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-gray-300 rounded-lg text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700 block">Blouse Piece Details</label>
                <input
                  type="text"
                  value={blouseDetails}
                  onChange={(e) => setBlouseDetails(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-gray-300 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700 block">Saree Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-gray-300 rounded-lg text-xs leading-relaxed"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="isFeatured"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 text-[#7A1228] rounded border-gray-300 focus:ring-[#D4AF37]"
              />
              <label htmlFor="isFeatured" className="text-xs text-gray-800 font-medium cursor-pointer">
                Feature this piece on the Boutique Homepage
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <a
              href="/admin/inventory"
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800"
            >
              Cancel
            </a>
            <button
              type="submit"
              disabled={saving || !title.trim() || totalStockUnits <= 0}
              className="bg-[#4D0917] hover:bg-[#7A1228] text-[#F9E29D] font-bold px-8 py-3 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{saving ? 'Adding to Inventory...' : 'Save Saree to Boutique Catalog'}</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
