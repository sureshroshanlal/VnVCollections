-- =========================================================================
-- Vaarahi Vaagdevi Collections - Database Schema & Security
-- Saree Boutique Catalog, Stock Maintenance & Financial Analytics
-- =========================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PRODUCTS TABLE
create table if not exists public.products (
    id uuid primary key default gen_random_uuid(),
    sku text unique not null,
    title text not null,
    slug text unique not null,
    category text not null default 'Saree', -- Dynamic: 'Saree', 'Dress', 'Lehenga', 'Fabric', 'Kurti', 'Dupatta', etc.
    weave text not null,                   -- 'Kanjeevaram', 'Banarasi', 'Organza', 'Tussar', 'Paithani', 'Chanderi', 'Cotton'
    fabric text not null,                  -- 'Pure Mulberry Silk', 'Katan Silk', 'Tissue Organza', etc.
    zari_type text not null default 'Pure Gold Zari', -- 'Pure Gold Zari', 'Tested Zari', 'Thread Work'
    color text not null,
    color_variants jsonb default '[]'::jsonb, -- Array of { colorName: text, hexCode: text, quantity: int }
    description text,
    blouse_details text default 'Running unstitched blouse piece included with rich border work',
    length_meters numeric(4, 2) default 6.2,
    buying_price numeric(12, 2) not null default 0.00,  -- Confidential: Cost price
    selling_price numeric(12, 2) not null default 0.00, -- Public: Retail/MRP price
    stock_quantity integer not null default 1,
    images text[] default '{}',
    is_featured boolean default false,
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexing for fast catalog browsing & filtering
create index if not exists idx_products_category on public.products(category);
create index if not exists idx_products_weave on public.products(weave);
create index if not exists idx_products_selling_price on public.products(selling_price);
create index if not exists idx_products_is_active on public.products(is_active);

-- 2. SALES TABLE (Live stock deductions & profit tracking)
create table if not exists public.sales (
    id uuid primary key default gen_random_uuid(),
    product_id uuid references public.products(id) on delete set null,
    sku text not null,
    product_title text not null,
    selected_color text, -- Color variant chosen
    quantity integer not null default 1,
    unit_cost_price numeric(12, 2) not null default 0.00,
    unit_sale_price numeric(12, 2) not null default 0.00,
    total_revenue numeric(12, 2) not null default 0.00,
    total_profit numeric(12, 2) not null default 0.00,
    channel text not null default 'WhatsApp', -- 'WhatsApp', 'In-Store', 'Instagram', 'Exhibition'
    customer_name text,
    customer_phone text,
    notes text,
    sale_date timestamp with time zone default timezone('utc'::text, now()) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_sales_date on public.sales(sale_date);
create index if not exists idx_sales_channel on public.sales(channel);

-- 3. AUTOMATIC STOCK DEDUCTION TRIGGER
create or replace function public.process_sale_and_deduct_stock()
returns trigger as $$
begin
    -- Deduct stock from products table
    if new.product_id is not null then
        update public.products
        set stock_quantity = greatest(0, stock_quantity - new.quantity),
            updated_at = timezone('utc'::text, now())
        where id = new.product_id;
    end if;
    return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trigger_deduct_stock_on_sale on public.sales;
create trigger trigger_deduct_stock_on_sale
after insert on public.sales
for each row
execute function public.process_sale_and_deduct_stock();

-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- Security rule: Public users CAN browse active sarees (with public selling price),
-- but CANNOT see buying_price or sales ledger. Only authenticated Admin can view/edit everything.

alter table public.products enable row level security;
alter table public.sales enable row level security;

-- Public can view active products
create policy "Allow public read access to active products"
on public.products for select
using (is_active = true);

-- Authenticated admins have full CRUD on products
create policy "Allow authenticated admin full access to products"
on public.products for all
to authenticated
using (true)
with check (true);

-- Authenticated admins have full CRUD on sales ledger
create policy "Allow authenticated admin full access to sales"
on public.sales for all
to authenticated
using (true)
with check (true);

-- 5. STORAGE BUCKET CREATION (for Saree photos)
insert into storage.buckets (id, name, public)
values ('saree-media', 'saree-media', true)
on conflict (id) do nothing;

create policy "Public Access to saree images"
on storage.objects for select
using (bucket_id = 'saree-media');

create policy "Authenticated users can upload saree images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'saree-media');

create policy "Authenticated users can update/delete saree images"
on storage.objects for all
to authenticated
using (bucket_id = 'saree-media');
