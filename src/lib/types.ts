export type Category = string; // Fully dynamic category support

export interface ColorVariant {
  colorName: string;
  hexCode?: string;      // e.g. '#7A1228' or '#D4AF37'
  quantity: number;      // Specific stock for this color
}

export interface Product {
  id: string;
  sku: string;
  title: string;
  slug: string;
  category: string;      // Dynamic category (e.g. Saree, Dress, Lehenga, Kurti, Dupatta, etc.)
  weave: string;
  fabric: string;
  zari_type: string;
  color: string;         // Summary or primary color name
  color_variants: ColorVariant[]; // Breakdown of available colors & stock per color
  description: string;
  blouse_details: string;
  length_meters: number;
  buying_price: number;  // Confidential: Visible to Admin only
  selling_price: number; // Public Display Price (INR)
  stock_quantity: number;// Total units across all colors
  images: string[];      // Multiple uploaded saree photos
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export type SalesChannel = 'WhatsApp' | 'In-Store' | 'Instagram' | 'Exhibition' | 'Website Inquiry';

export interface Sale {
  id: string;
  product_id?: string;
  sku: string;
  product_title: string;
  selected_color?: string; // Captures which specific color variant was sold
  quantity: number;
  unit_cost_price: number;
  unit_sale_price: number;
  total_revenue: number;
  total_profit: number;
  channel: SalesChannel;
  customer_name?: string;
  customer_phone?: string;
  notes?: string;
  sale_date: string;
  created_at?: string;
}

export interface DashboardStats {
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  profitMargin: number;
  totalStockUnits: number;
  inventoryCostValuation: number;
  inventoryRetailValuation: number;
  totalCatalogItems: number;
  lowStockItemsCount: number;
  salesCount: number;
  channelBreakdown: Record<string, { count: number; revenue: number; profit: number }>;
}

export interface FilterState {
  search: string;
  category: string;
  weave: string;
  color: string;
  maxPrice: number;
  inStockOnly: boolean;
  sortBy: 'featured' | 'price-low' | 'price-high' | 'newest';
}
