import { Product, Sale, DashboardStats, ColorVariant } from './types';
import { INITIAL_PRODUCTS, INITIAL_SALES } from './demoData';
import { supabase, isSupabaseConfigured } from './supabaseClient';

const PRODUCTS_STORAGE_KEY = 'vv_boutique_products_v2';
const SALES_STORAGE_KEY = 'vv_boutique_sales_v2';

// Helper to get local storage data with SSR guard
function getLocalProducts(): Product[] {
  if (typeof window === 'undefined') return INITIAL_PRODUCTS;
  try {
    const data = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    const parsed = JSON.parse(data);
    // Ensure all products have color_variants array
    return parsed.map((p: any) => ({
      ...p,
      color_variants: p.color_variants && p.color_variants.length > 0 
        ? p.color_variants 
        : [{ colorName: p.color || 'Standard', quantity: p.stock_quantity || 1 }]
    }));
  } catch {
    return INITIAL_PRODUCTS;
  }
}

function setLocalProducts(products: Product[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  } catch (err) {
    console.error('Failed to save products to localStorage', err);
  }
}

function getLocalSales(): Sale[] {
  if (typeof window === 'undefined') return INITIAL_SALES;
  try {
    const data = localStorage.getItem(SALES_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(SALES_STORAGE_KEY, JSON.stringify(INITIAL_SALES));
      return INITIAL_SALES;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_SALES;
  }
}

function setLocalSales(sales: Sale[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SALES_STORAGE_KEY, JSON.stringify(sales));
  } catch (err) {
    console.error('Failed to save sales to localStorage', err);
  }
}

// -------------------------------------------------------------
// Products API
// -------------------------------------------------------------
export async function fetchProducts(): Promise<Product[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((p: any) => ({
          ...p,
          color_variants: p.color_variants && p.color_variants.length > 0
            ? p.color_variants
            : [{ colorName: p.color || 'Standard', quantity: p.stock_quantity || 1 }]
        })) as Product[];
      }
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to local store:', err);
    }
  }
  return getLocalProducts();
}

export async function fetchCategories(): Promise<string[]> {
  const products = await fetchProducts();
  const categorySet = new Set<string>(['Saree', 'Dress', 'Lehenga', 'Fabric']);
  products.forEach((p) => {
    if (p.category && p.category.trim()) {
      categorySet.add(p.category.trim());
    }
  });
  return Array.from(categorySet);
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const products = await fetchProducts();
  const normalized = decodeURIComponent(slug).toLowerCase().trim();
  return (
    products.find(
      (p) =>
        p.slug.toLowerCase() === normalized ||
        p.id.toLowerCase() === normalized ||
        p.sku.toLowerCase() === normalized ||
        p.slug.toLowerCase().includes(normalized) ||
        normalized.includes(p.slug.toLowerCase())
    ) || null
  );
}

export async function saveProduct(
  productData: Omit<Product, 'id' | 'created_at'> & { id?: string }
): Promise<Product> {
  // Synchronize stock_quantity with total across color variants if provided
  let computedStock = Number(productData.stock_quantity) || 0;
  let variants: ColorVariant[] = productData.color_variants || [];

  if (variants.length > 0) {
    computedStock = variants.reduce((sum, v) => sum + (Number(v.quantity) || 0), 0);
  } else {
    variants = [{ colorName: productData.color || 'Standard', quantity: computedStock }];
  }

  const payload = {
    ...productData,
    stock_quantity: computedStock,
    color_variants: variants,
  };

  if (isSupabaseConfigured && supabase) {
    try {
      if (payload.id) {
        const { data, error } = await supabase
          .from('products')
          .update({
            ...payload,
            updated_at: new Date().toISOString(),
          })
          .eq('id', payload.id)
          .select()
          .single();

        if (!error && data) return data as Product;
      } else {
        const { data, error } = await supabase
          .from('products')
          .insert([
            {
              ...payload,
              created_at: new Date().toISOString(),
            },
          ])
          .select()
          .single();

        if (!error && data) return data as Product;
      }
    } catch (err) {
      console.warn('Supabase product save failed, using local store:', err);
    }
  }

  // Local fallback
  const products = getLocalProducts();
  if (payload.id) {
    const index = products.findIndex((p) => p.id === payload.id);
    if (index >= 0) {
      const updated: Product = {
        ...products[index],
        ...payload,
        updated_at: new Date().toISOString(),
      };
      products[index] = updated;
      setLocalProducts(products);
      return updated;
    }
  }

  const newProduct: Product = {
    ...payload,
    id: `prod-${Date.now()}`,
    created_at: new Date().toISOString(),
  };
  const updatedList = [newProduct, ...products];
  setLocalProducts(updatedList);
  return newProduct;
}

export async function deleteProduct(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (!error) return true;
    } catch (err) {
      console.warn('Supabase delete failed, using local store:', err);
    }
  }

  const products = getLocalProducts().filter((p) => p.id !== id);
  setLocalProducts(products);
  return true;
}

// -------------------------------------------------------------
// Image Upload Helper (Device file upload / Supabase Storage)
// -------------------------------------------------------------
export async function uploadSareeImage(file: File): Promise<string> {
  // If Supabase is configured, upload directly to the 'saree-media' bucket
  if (isSupabaseConfigured && supabase) {
    try {
      const cleanFileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const { data, error } = await supabase.storage
        .from('saree-media')
        .upload(cleanFileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (!error && data) {
        const { data: publicData } = supabase.storage
          .from('saree-media')
          .getPublicUrl(cleanFileName);
        return publicData.publicUrl;
      }
    } catch (err) {
      console.warn('Supabase image upload failed, falling back to data URL:', err);
    }
  }

  // Local / Client fallback: Convert to Data URL
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

// -------------------------------------------------------------
// Sales & Stock Maintenance API
// -------------------------------------------------------------
export async function fetchSales(): Promise<Sale[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .order('sale_date', { ascending: false });

      if (!error && data) return data as Sale[];
    } catch (err) {
      console.warn('Supabase sales fetch failed, falling back to local store:', err);
    }
  }
  return getLocalSales();
}

export async function recordSaleEntry(
  saleInput: Omit<Sale, 'id' | 'total_revenue' | 'total_profit' | 'created_at'>
): Promise<Sale> {
  const total_revenue = saleInput.quantity * saleInput.unit_sale_price;
  const total_cost = saleInput.quantity * saleInput.unit_cost_price;
  const total_profit = total_revenue - total_cost;

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('sales')
        .insert([
          {
            ...saleInput,
            total_revenue,
            total_profit,
            sale_date: saleInput.sale_date || new Date().toISOString(),
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (!error && data) {
        return data as Sale;
      }
    } catch (err) {
      console.warn('Supabase sale record failed, using local store:', err);
    }
  }

  // Local fallback: Deduct product stock & color variant stock
  const products = getLocalProducts();
  if (saleInput.product_id) {
    const prodIndex = products.findIndex((p) => p.id === saleInput.product_id);
    if (prodIndex >= 0) {
      const targetProd = products[prodIndex];
      // Deduct overall stock
      targetProd.stock_quantity = Math.max(
        0,
        targetProd.stock_quantity - saleInput.quantity
      );

      // Deduct specific color variant stock
      if (saleInput.selected_color && targetProd.color_variants) {
        const variantIndex = targetProd.color_variants.findIndex(
          (v) => v.colorName.toLowerCase() === saleInput.selected_color?.toLowerCase()
        );
        if (variantIndex >= 0) {
          targetProd.color_variants[variantIndex].quantity = Math.max(
            0,
            targetProd.color_variants[variantIndex].quantity - saleInput.quantity
          );
        }
      }
      setLocalProducts(products);
    }
  }

  const sales = getLocalSales();
  const newSale: Sale = {
    ...saleInput,
    id: `sale-${Date.now()}`,
    total_revenue,
    total_profit,
    sale_date: saleInput.sale_date || new Date().toISOString(),
    created_at: new Date().toISOString(),
  };

  const updatedSales = [newSale, ...sales];
  setLocalSales(updatedSales);
  return newSale;
}

// -------------------------------------------------------------
// Cumulative Financial Analytics
// -------------------------------------------------------------
export async function calculateDashboardStats(): Promise<DashboardStats> {
  const [products, sales] = await Promise.all([fetchProducts(), fetchSales()]);

  let totalRevenue = 0;
  let totalCost = 0;
  let totalProfit = 0;

  const channelBreakdown: Record<string, { count: number; revenue: number; profit: number }> = {};

  sales.forEach((s) => {
    totalRevenue += Number(s.total_revenue) || 0;
    totalProfit += Number(s.total_profit) || 0;
    const cost = (Number(s.quantity) || 1) * (Number(s.unit_cost_price) || 0);
    totalCost += cost;

    const channel = s.channel || 'Other';
    if (!channelBreakdown[channel]) {
      channelBreakdown[channel] = { count: 0, revenue: 0, profit: 0 };
    }
    channelBreakdown[channel].count += 1;
    channelBreakdown[channel].revenue += Number(s.total_revenue) || 0;
    channelBreakdown[channel].profit += Number(s.total_profit) || 0;
  });

  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  let totalStockUnits = 0;
  let inventoryCostValuation = 0;
  let inventoryRetailValuation = 0;
  let lowStockItemsCount = 0;

  products.forEach((p) => {
    const qty = Number(p.stock_quantity) || 0;
    totalStockUnits += qty;
    inventoryCostValuation += qty * (Number(p.buying_price) || 0);
    inventoryRetailValuation += qty * (Number(p.selling_price) || 0);
    if (qty <= 1 && p.is_active) {
      lowStockItemsCount += 1;
    }
  });

  return {
    totalRevenue,
    totalCost,
    totalProfit,
    profitMargin,
    totalStockUnits,
    inventoryCostValuation,
    inventoryRetailValuation,
    totalCatalogItems: products.length,
    lowStockItemsCount,
    salesCount: sales.length,
    channelBreakdown,
  };
}

// WhatsApp Concierge Link Generator (with optional color choice)
export function generateWhatsAppInquiryUrl(
  product: Product,
  customMessage?: string,
  selectedColor?: string
): string {
  const boutiquePhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== 'undefined' && window.location.hostname !== 'localhost' ? window.location.origin : 'https://vaarahivaagdevi.com');
  const productUrl = `${siteUrl}/catalog/${product.slug}`;

  const colorLine = selectedColor
    ? `🎨 *Selected Color:* ${selectedColor}\n`
    : `🎨 *Color:* ${product.color}\n`;

  const message = customMessage || 
    `Namaste *Vaarahi Vaagdevi Collections*! 🙏\n\nI am interested in this exquisite saree:\n` +
    `🥻 *Product:* ${product.title}\n` +
    `🔖 *SKU:* ${product.sku}\n` +
    `🧵 *Weave:* ${product.weave} (${product.fabric})\n` +
    colorLine +
    `💰 *Price:* ₹${product.selling_price.toLocaleString('en-IN')}\n\n` +
    `🔗 *View Saree:* ${productUrl}\n\n` +
    `Please let me know if it is available in this color and share drape details / video. Thank you!`;

  return `https://wa.me/${boutiquePhone}?text=${encodeURIComponent(message)}`;
}
