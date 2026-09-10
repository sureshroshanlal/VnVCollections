'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminNav from '@/components/admin/AdminNav';
import {
  fetchProductById,
  saveProduct,
  fetchCategories,
  uploadSareeImage,
  deleteProduct,
} from '@/lib/storeService';
import { Product, ColorVariant } from '@/lib/types';
import {
  ArrowLeft,
  UploadCloud,
  X,
  Sparkles,
  Trash2,
  Check,
  Palette,
  Layers,
  Save,
  AlertCircle,
  ExternalLink,
  Eye,
} from 'lucide-react';

const PRESET_SAMPLE_IMAGES = [
  { label: 'Crimson Kanjeevaram Silk', url: '/images/products/kanjeevaram-crimson.jpg' },
  { label: 'Emerald Banarasi Silk', url: '/images/products/banarasi-emerald.jpg' },
  { label: 'Blush Organza Tissue', url: '/images/products/organza-rose.jpg' },
  { label: 'Mustard Yellow Paithani', url: '/images/products/paithani-mustard.jpg' },
];

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Categories state
  const [categoriesList, setCategoriesList] = useState<string[]>(['Saree', 'Dress', 'Lehenga', 'Fabric']);
  const [selectedCategory, setSelectedCategory] = useState<string>('Saree');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState('');

  // Form Fields
  const [title, setTitle] = useState('');
  const [sku, setSku] = useState('');
  const [slug, setSlug] = useState('');
  const [weave, setWeave] = useState('');
  const [fabric, setFabric] = useState('');
  const [zariType, setZariType] = useState('');

  // Color Variants with Stock
  const [colorVariants, setColorVariants] = useState<ColorVariant[]>([]);

  // Financials
  const [buyingPrice, setBuyingPrice] = useState<number>(0);
  const [sellingPrice, setSellingPrice] = useState<number>(0);

  // Images state
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Specifications
  const [description, setDescription] = useState('');
  const [blouseDetails, setBlouseDetails] = useState('');
  const [lengthMeters, setLengthMeters] = useState<number>(6.2);
  const [isFeatured, setIsFeatured] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Auth Guard & Initial Load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isAuth = localStorage.getItem('vv_admin_auth') || sessionStorage.getItem('vv_admin_auth');
      if (!isAuth) {
        router.push('/admin/login');
        return;
      }
    }
    loadData();
  }, [productId, router]);

  const loadData = async () => {
    setLoading(true);
    try {
      const cats = await fetchCategories();
      setCategoriesList(cats);

      if (productId) {
        const found = await fetchProductById(productId);
        if (found) {
          setProduct(found);
          setTitle(found.title);
          setSku(found.sku);
          setSlug(found.slug);

          if (cats.includes(found.category)) {
            setSelectedCategory(found.category);
            setIsCustomCategory(false);
          } else {
            setIsCustomCategory(true);
            setCustomCategoryInput(found.category);
          }

          setWeave(found.weave);
          setFabric(found.fabric);
          setZariType(found.zari_type || 'Pure Gold Zari (Tested Wire)');
          setColorVariants(
            found.color_variants && found.color_variants.length > 0
              ? found.color_variants
              : [{ colorName: found.color || 'Standard', quantity: found.stock_quantity || 1 }]
          );
          setBuyingPrice(found.buying_price);
          setSellingPrice(found.selling_price);
          setImages(found.images && found.images.length > 0 ? found.images : ['/images/products/kanjeevaram-crimson.jpg']);
          setDescription(found.description);
          setBlouseDetails(found.blouse_details);
          setLengthMeters(found.length_meters || 6.2);
          setIsFeatured(found.is_featured);
          setIsActive(found.is_active ?? true);
        } else {
          setErrorMessage('Product not found in inventory.');
        }
      }
    } catch (err) {
      console.error('Failed to load product:', err);
      setErrorMessage('Could not load product details.');
    } finally {
      setLoading(false);
    }
  };

  // Computed Values
  const totalStockUnits = colorVariants.reduce((acc, v) => acc + (Number(v.quantity) || 0), 0);
  const unitProfit = sellingPrice - buyingPrice;
  const marginPercent = sellingPrice > 0 ? (unitProfit / sellingPrice) * 100 : 0;

  // Category Handler
  const handleCategoryChange = (val: string) => {
    if (val === '__NEW__') {
      setIsCustomCategory(true);
      setCustomCategoryInput('');
    } else {
      setIsCustomCategory(false);
      setSelectedCategory(val);
    }
  };

  // Color Variant Handlers
  const addColorVariant = () => {
    setColorVariants((prev) => [
      ...prev,
      { colorName: 'Royal Silk Shade', hexCode: '#D4AF37', quantity: 1 },
    ]);
  };

  const removeColorVariant = (index: number) => {
    if (colorVariants.length <= 1) {
      alert('At least one color variant or shade is required.');
      return;
    }
    setColorVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const updateColorVariant = (index: number, field: keyof ColorVariant, value: string | number) => {
    setColorVariants((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: field === 'quantity' ? Math.max(0, parseInt(value as string) || 0) : value,
      };
      return updated;
    });
  };

  // File Upload Handlers
  const handleDeviceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const uploadPromises = Array.from(files).map((f) => uploadSareeImage(f));
      const uploadedUrls = await Promise.all(uploadPromises);
      setImages((prev) => [...prev, ...uploadedUrls]);
    } catch (err) {
      console.error('Image upload failed:', err);
      alert('Failed to upload image from device. Check storage configuration.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (indexToRemove: number) => {
    if (images.length <= 1) {
      alert('Keep at least one display photo for the saree.');
      return;
    }
    setImages((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const addPresetImage = (url: string) => {
    if (!images.includes(url)) {
      setImages((prev) => [...prev, url]);
    }
  };

  // Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    if (!title.trim()) {
      alert('Please enter a title for the saree.');
      return;
    }

    const finalCategory = isCustomCategory ? customCategoryInput.trim() : selectedCategory;
    if (!finalCategory) {
      alert('Please provide a category name.');
      return;
    }

    setSaving(true);
    try {
      const summaryColor = colorVariants.map((v) => v.colorName).join(' / ');

      await saveProduct({
        id: product.id,
        sku: sku.trim() || product.sku,
        title: title.trim(),
        slug: slug.trim() || product.slug,
        category: finalCategory,
        weave,
        fabric,
        zari_type: zariType,
        color: summaryColor || 'Multicolor',
        color_variants: colorVariants,
        buying_price: Number(buyingPrice) || 0,
        selling_price: Number(sellingPrice) || 0,
        stock_quantity: totalStockUnits,
        images,
        description,
        blouse_details: blouseDetails,
        length_meters: Number(lengthMeters) || 6.2,
        is_featured: isFeatured,
        is_active: isActive,
      });

      setSavedSuccess(true);
      setTimeout(() => {
        router.push('/admin/inventory');
      }, 800);
    } catch (err) {
      console.error('Failed to update product:', err);
      alert('Failed to update product. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteItem = async () => {
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

  if (errorMessage || !product) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] text-gray-900 flex flex-col">
        <AdminNav />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="bg-white p-8 rounded-2xl border border-red-200 text-center max-w-md space-y-4 shadow-sm">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto" />
            <h2 className="font-serif text-lg font-bold text-gray-900">Product Not Found</h2>
            <p className="text-xs text-gray-600">{errorMessage || 'The requested item could not be retrieved.'}</p>
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

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-gray-900 flex flex-col">
      <AdminNav />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        {/* Breadcrumb Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
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
                  Edit Mode
                </span>
              </div>
              <h1 className="font-serif text-2xl font-bold text-[#3B0610] line-clamp-1">
                Edit: {title || product.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`/catalog/${product.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border border-gray-300 hover:border-[#D4AF37] text-gray-700 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-[#7A1228]" />
              <span className="hidden sm:inline">Storefront PDP</span>
              <ExternalLink className="w-3 h-3 text-gray-400" />
            </a>

            <button
              type="button"
              onClick={handleDeleteItem}
              className="border border-red-200 text-red-600 hover:bg-red-50 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Delete this piece"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Delete</span>
            </button>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Essential Attributes & Images (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Category & Title Card */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                <h2 className="font-serif text-sm font-bold text-[#3B0610] uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-2">
                  <Layers className="w-4 h-4 text-[#D4AF37]" />
                  <span>Category & Identification</span>
                </h2>

                {/* Category Selector */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Boutique Category <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <select
                      value={isCustomCategory ? '__NEW__' : selectedCategory}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className="w-full sm:w-1/2 p-2.5 bg-[#FAF7F2] border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#D4AF37]"
                    >
                      {categoriesList.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                      <option value="__NEW__">+ Add New Custom Category...</option>
                    </select>

                    {isCustomCategory && (
                      <input
                        type="text"
                        placeholder="Type new category (e.g. Kurti, Dupatta)..."
                        value={customCategoryInput}
                        onChange={(e) => setCustomCategoryInput(e.target.value)}
                        className="w-full sm:w-1/2 p-2.5 bg-amber-50/50 border border-amber-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#D4AF37]"
                        required
                        autoFocus
                      />
                    )}
                  </div>
                </div>

                {/* Saree Title */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Item Title / Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Ratna Swarna Bridal Kanjeevaram Silk"
                    className="w-full p-2.5 bg-[#FAF7F2] border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#D4AF37]"
                    required
                  />
                </div>

                {/* SKU & URL Slug */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      SKU Code
                    </label>
                    <input
                      type="text"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-bold text-gray-700"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      URL Slug
                    </label>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="w-full p-2.5 bg-[#FAF7F2] border border-gray-200 rounded-xl text-xs font-mono text-gray-700"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Color Variants & Individual Stock Card */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <h2 className="font-serif text-sm font-bold text-[#3B0610] uppercase tracking-wider flex items-center gap-2">
                    <Palette className="w-4 h-4 text-[#D4AF37]" />
                    <span>Color Variants & Stock Quantities</span>
                  </h2>
                  <button
                    type="button"
                    onClick={addColorVariant}
                    className="text-xs text-[#7A1228] hover:text-[#D4AF37] font-bold flex items-center gap-1"
                  >
                    <span>+ Add Color Shade</span>
                  </button>
                </div>

                <p className="text-[11px] text-gray-500">
                  Manage individual stock counts for each color. The total units across all shades will synchronize automatically.
                </p>

                <div className="space-y-3">
                  {colorVariants.map((variant, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3 bg-[#FAF7F2] rounded-xl border border-gray-200"
                    >
                      {/* Color Picker / Swatch */}
                      <div className="flex items-center gap-2 shrink-0">
                        <input
                          type="color"
                          value={variant.hexCode || '#7A1228'}
                          onChange={(e) => updateColorVariant(index, 'hexCode', e.target.value)}
                          className="w-8 h-8 rounded-lg cursor-pointer border border-gray-300 p-0.5 bg-white"
                          title="Pick shade hex code"
                        />
                        <span className="font-mono text-[10px] text-gray-500 w-16">
                          {variant.hexCode || '#7A1228'}
                        </span>
                      </div>

                      {/* Color Name */}
                      <div className="flex-1">
                        <input
                          type="text"
                          value={variant.colorName}
                          onChange={(e) => updateColorVariant(index, 'colorName', e.target.value)}
                          placeholder="Color name (e.g. Rani Pink, Peacock Blue)"
                          className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs font-medium"
                          required
                        />
                      </div>

                      {/* Quantity in Stock for this color */}
                      <div className="flex items-center gap-2 shrink-0">
                        <label className="text-[11px] text-gray-600 font-semibold">Units:</label>
                        <input
                          type="number"
                          min="0"
                          value={variant.quantity}
                          onChange={(e) => updateColorVariant(index, 'quantity', e.target.value)}
                          className="w-20 p-2 bg-white border border-gray-200 rounded-lg text-xs font-mono font-bold text-center"
                          required
                        />

                        {colorVariants.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeColorVariant(index)}
                            className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                            title="Remove color variant"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-2 text-xs border-t border-gray-100 font-medium">
                  <span className="text-gray-500">Total Computed Stock Units:</span>
                  <span className="font-mono font-bold text-[#7A1228] text-sm">
                    {totalStockUnits} {totalStockUnits === 1 ? 'Piece' : 'Pieces'}
                  </span>
                </div>
              </div>

              {/* Saree Images Management */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <h2 className="font-serif text-sm font-bold text-[#3B0610] uppercase tracking-wider flex items-center gap-2">
                    <UploadCloud className="w-4 h-4 text-[#D4AF37]" />
                    <span>Product Photography & Gallery</span>
                  </h2>
                  <span className="text-[11px] text-gray-500">{images.length} photos</span>
                </div>

                {/* Upload Buttons */}
                <div className="flex flex-wrap gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleDeviceUpload}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="bg-[#4D0917] hover:bg-[#7A1228] text-[#F9E29D] font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-xs transition-all disabled:opacity-50"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>{isUploading ? 'Uploading...' : 'Upload Photos from Device'}</span>
                  </button>

                  <div className="flex items-center gap-1.5 pl-2">
                    <span className="text-[10px] text-gray-500">Quick presets:</span>
                    {PRESET_SAMPLE_IMAGES.map((sample, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => addPresetImage(sample.url)}
                        className="text-[10px] text-[#7A1228] bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2 py-1 rounded-md transition-colors"
                      >
                        +{sample.label.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Images Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {images.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className="group relative aspect-[3/4] rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-100 shadow-2xs"
                    >
                      <img src={imgUrl} alt={`Saree Photo ${idx + 1}`} className="w-full h-full object-cover" />
                      {idx === 0 && (
                        <span className="absolute bottom-1.5 left-1.5 bg-[#4D0917] text-[#F9E29D] text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs uppercase tracking-wider">
                          Main Cover
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1.5 right-1.5 bg-red-600/90 hover:bg-red-700 text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                        title="Remove photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Confidential Financials & Weave Specs (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Confidential Pricing & Profit Calculator */}
              <div className="bg-white p-6 rounded-2xl border-2 border-[#D4AF37]/50 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <h2 className="font-serif text-sm font-bold text-[#3B0610] uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                    <span>Confidential Financials</span>
                  </h2>
                  <span className="text-[9px] uppercase font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                    Admin Eyes Only
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Buying / Procurement Cost (₹) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-gray-500 text-xs">
                        ₹
                      </span>
                      <input
                        type="number"
                        min="0"
                        value={buyingPrice}
                        onChange={(e) => setBuyingPrice(Number(e.target.value) || 0)}
                        placeholder="12000"
                        className="w-full pl-7 pr-3 py-2.5 bg-[#FAF7F2] border border-gray-200 rounded-xl text-xs font-mono font-bold text-gray-900 focus:ring-2 focus:ring-[#D4AF37]"
                        required
                      />
                    </div>
                    <span className="text-[10px] text-gray-400 mt-0.5 block">
                      Wholesale purchase cost from master weaver
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Selling Price / Public MRP (₹) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-[#7A1228] text-xs font-bold">
                        ₹
                      </span>
                      <input
                        type="number"
                        min="0"
                        value={sellingPrice}
                        onChange={(e) => setSellingPrice(Number(e.target.value) || 0)}
                        placeholder="22500"
                        className="w-full pl-7 pr-3 py-2.5 bg-[#FAF7F2] border border-[#D4AF37]/60 rounded-xl text-xs font-mono font-bold text-[#4D0917] focus:ring-2 focus:ring-[#D4AF37]"
                        required
                      />
                    </div>
                    <span className="text-[10px] text-gray-400 mt-0.5 block">
                      Public retail price displayed on boutique catalog
                    </span>
                  </div>
                </div>

                {/* Profit Preview Widget */}
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-emerald-900 font-semibold">Net Profit / Unit:</span>
                    <span className="font-mono text-base font-bold text-emerald-800">
                      +₹{unitProfit.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-emerald-700">Gross Margin:</span>
                    <span className="font-mono font-bold text-emerald-800">
                      {marginPercent.toFixed(1)}%
                    </span>
                  </div>
                  <div className="pt-2 border-t border-emerald-200/60 flex justify-between items-center text-[11px]">
                    <span className="text-emerald-700">Potential Profit ({totalStockUnits} units):</span>
                    <span className="font-mono font-bold text-emerald-900">
                      +₹{(unitProfit * totalStockUnits).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Loom & Weave Specifications */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                <h2 className="font-serif text-sm font-bold text-[#3B0610] uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-2">
                  <Layers className="w-4 h-4 text-[#D4AF37]" />
                  <span>Weave & Fabric Specifications</span>
                </h2>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Weave Style
                    </label>
                    <select
                      value={weave}
                      onChange={(e) => setWeave(e.target.value)}
                      className="w-full p-2.5 bg-[#FAF7F2] border border-gray-200 rounded-xl text-xs font-medium"
                    >
                      <option value="Kanjeevaram Silk">Kanjeevaram Silk</option>
                      <option value="Banarasi Brocade">Banarasi Brocade</option>
                      <option value="Organza Tissue">Organza Tissue</option>
                      <option value="Paithani Silk">Paithani Silk</option>
                      <option value="Tussar Silk">Tussar Silk</option>
                      <option value="Chanderi Silk">Chanderi Silk</option>
                      <option value="Raw Silk Ensemble">Raw Silk Ensemble</option>
                      <option value="Handloom Cotton">Handloom Cotton</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Fabric Material
                    </label>
                    <input
                      type="text"
                      value={fabric}
                      onChange={(e) => setFabric(e.target.value)}
                      placeholder="e.g. Pure Mulberry Silk (Silk Mark Certified)"
                      className="w-full p-2.5 bg-[#FAF7F2] border border-gray-200 rounded-xl text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Zari Details
                    </label>
                    <select
                      value={zariType}
                      onChange={(e) => setZariType(e.target.value)}
                      className="w-full p-2.5 bg-[#FAF7F2] border border-gray-200 rounded-xl text-xs font-medium"
                    >
                      <option value="Pure Gold Zari (Tested Wire)">Pure Gold Zari (Tested Wire)</option>
                      <option value="Antique Silver Zari">Antique Silver Zari</option>
                      <option value="Dual Tone Copper Zari">Dual Tone Copper Zari</option>
                      <option value="Intricate Resham Threadwork">Intricate Resham Threadwork</option>
                      <option value="Fine Metallic Thread">Fine Metallic Thread</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Length (Meters)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={lengthMeters}
                      onChange={(e) => setLengthMeters(Number(e.target.value) || 6.2)}
                      className="w-full p-2.5 bg-[#FAF7F2] border border-gray-200 rounded-xl text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Blouse Details
                    </label>
                    <textarea
                      rows={2}
                      value={blouseDetails}
                      onChange={(e) => setBlouseDetails(e.target.value)}
                      className="w-full p-2.5 bg-[#FAF7F2] border border-gray-200 rounded-xl text-xs font-medium resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Full Description & Artisan Story
                    </label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full p-2.5 bg-[#FAF7F2] border border-gray-200 rounded-xl text-xs font-medium resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Status Toggles */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3">
                <h2 className="font-serif text-sm font-bold text-[#3B0610] uppercase tracking-wider border-b border-gray-100 pb-2">
                  Display Settings
                </h2>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 text-[#7A1228] rounded border-gray-300 focus:ring-[#D4AF37]"
                  />
                  <div>
                    <span className="text-xs font-semibold text-gray-800 block">Featured Royal Piece</span>
                    <span className="text-[10px] text-gray-500">Showcases prominently on boutique homepage</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer pt-2 border-t border-gray-100">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 text-[#7A1228] rounded border-gray-300 focus:ring-[#D4AF37]"
                  />
                  <div>
                    <span className="text-xs font-semibold text-gray-800 block">Active in Public Catalog</span>
                    <span className="text-[10px] text-gray-500">Uncheck to hide without deleting</span>
                  </div>
                </label>
              </div>

              {/* Submit & Save Button Bar */}
              <div className="bg-white p-5 rounded-2xl border border-[#D4AF37]/50 shadow-md space-y-3">
                {savedSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 font-bold flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Saree specifications updated successfully! Redirecting...</span>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => router.push('/admin/inventory')}
                    className="flex-1 py-3 px-4 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-xs transition-colors text-center"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-2 bg-[#4D0917] hover:bg-[#7A1228] text-[#F9E29D] font-bold py-3 px-6 rounded-xl text-xs tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saving ? 'Saving Updates...' : 'Save Product Changes'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
