-- ==============================================
-- BEV Flow - Supabase PostgreSQL Schema
-- Version: 2.0 (Production-Ready, No Forecasts)
-- Includes: RLS, triggers, indexes, grants
-- Run in Supabase SQL Editor
-- ==============================================

-- ==============================================
-- CLEANUP: Drop everything in reverse dependency order
-- ==============================================
DROP TABLE IF EXISTS user_settings CASCADE;
DROP TABLE IF EXISTS dailystockreports CASCADE;
DROP TABLE IF EXISTS saleitems CASCADE;
DROP TABLE IF EXISTS sales CASCADE;
DROP TABLE IF EXISTS purchaseorderitems CASCADE;
DROP TABLE IF EXISTS purchaseorders CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS suppliers CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP VIEW IF EXISTS supplier_po_summary CASCADE;

-- Drop trigger function if exists
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- ==============================================
-- TRIGGER FUNCTION: Auto-update updated_at
-- ==============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- ==============================================
-- 1. USERS
-- ==============================================
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'manager', 'user')),
    phone VARCHAR(30),
    location VARCHAR(100),
    profile_image TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================
-- 2. SUPPLIERS
-- ==============================================
CREATE TABLE suppliers (
    supplier_id SERIAL PRIMARY KEY,
    company_name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100),
    sale_agent VARCHAR(100),
    phone VARCHAR(30),
    email VARCHAR(100),
    address TEXT,
    lead_time_days INTEGER DEFAULT 7,
    payment_method VARCHAR(50) DEFAULT 'Collect' CHECK (payment_method IN ('Prepaid', 'Collect', 'Credit', 'COD')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_suppliers_updated_at
    BEFORE UPDATE ON suppliers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================
-- 3. PRODUCTS
-- ==============================================
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    sku VARCHAR(50) UNIQUE,
    product_name VARCHAR(100) NOT NULL,
    description TEXT,
    image_url TEXT,
    cost_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    selling_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    supplier_id INTEGER REFERENCES suppliers(supplier_id) ON DELETE SET NULL,
    safety_stock INTEGER DEFAULT 0,
    reorder_quantity INTEGER DEFAULT 0,
    min_stock_level INTEGER DEFAULT 0,
    current_stock INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_supplier ON products(supplier_id);
CREATE INDEX idx_products_sku ON products(sku);

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================
-- 4. CUSTOMERS
-- ==============================================
CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100),
    phone VARCHAR(30),
    email VARCHAR(100),
    address TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_customers_updated_at
    BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================
-- 5. PURCHASE ORDERS
-- ==============================================
CREATE TABLE purchaseorders (
    po_id SERIAL PRIMARY KEY,
    po_number VARCHAR(50) UNIQUE NOT NULL,
    supplier_id INTEGER NOT NULL REFERENCES suppliers(supplier_id) ON DELETE RESTRICT,
    order_date DATE NOT NULL,
    eta_date DATE,
    subtotal DECIMAL(10, 2) DEFAULT 0,
    shipping_rate DECIMAL(5, 2) DEFAULT 3.00,
    shipping_cost DECIMAL(10, 2) DEFAULT 0,
    promotion_percent DECIMAL(5, 2) DEFAULT 0,
    promotion_amount DECIMAL(10, 2) DEFAULT 0,
    promotion_text TEXT,
    total_amount DECIMAL(10, 2) DEFAULT 0,
    status VARCHAR(30) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Ordered', 'Shipped', 'Co-loader Shipped', 'Received', 'Cancelled')),
    payment_method VARCHAR(50) DEFAULT 'Collect' CHECK (payment_method IN ('Prepaid', 'Collect', 'Credit', 'COD')),
    payment_status VARCHAR(30) DEFAULT 'Unpaid' CHECK (payment_status IN ('Unpaid', 'Partial', 'Paid')),
    payment_date DATE,
    payment_attachment TEXT,
    authorized_by VARCHAR(100),
    authorized_signature TEXT,
    authorization_date DATE,
    received_date DATE,
    received_by VARCHAR(100),
    received_notes TEXT,
    truck_remark TEXT,
    overall_remark TEXT,
    third_party_agent VARCHAR(100),
    agent_phone VARCHAR(30),
    agent_email VARCHAR(100),
    agent_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_po_supplier ON purchaseorders(supplier_id);
CREATE INDEX idx_po_status ON purchaseorders(status);
CREATE INDEX idx_po_date ON purchaseorders(order_date DESC);

CREATE TRIGGER update_po_updated_at
    BEFORE UPDATE ON purchaseorders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================
-- 6. PURCHASE ORDER ITEMS
-- ==============================================
CREATE TABLE purchaseorderitems (
    item_id SERIAL PRIMARY KEY,
    po_id INTEGER NOT NULL REFERENCES purchaseorders(po_id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(product_id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_cost DECIMAL(10, 2) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_poi_po ON purchaseorderitems(po_id);
CREATE INDEX idx_poi_product ON purchaseorderitems(product_id);

-- ==============================================
-- 7. SALES
-- ==============================================
CREATE TABLE sales (
    sale_id SERIAL PRIMARY KEY,
    sale_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id INTEGER REFERENCES customers(customer_id) ON DELETE SET NULL,
    sale_date DATE NOT NULL,
    subtotal DECIMAL(10, 2) DEFAULT 0,
    discount_percent DECIMAL(5, 2) DEFAULT 0,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) DEFAULT 0,
    payment_method VARCHAR(30) DEFAULT 'Cash',
    status VARCHAR(20) DEFAULT 'Completed' CHECK (status IN ('Pending', 'Completed', 'Cancelled', 'Refunded')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sales_customer ON sales(customer_id);
CREATE INDEX idx_sales_date ON sales(sale_date DESC);
CREATE INDEX idx_sales_status ON sales(status);

CREATE TRIGGER update_sales_updated_at
    BEFORE UPDATE ON sales
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================
-- 8. SALE ITEMS
-- ==============================================
CREATE TABLE saleitems (
    item_id SERIAL PRIMARY KEY,
    sale_id INTEGER NOT NULL REFERENCES sales(sale_id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(product_id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_si_sale ON saleitems(sale_id);
CREATE INDEX idx_si_product ON saleitems(product_id);

-- ==============================================
-- 9. DAILY STOCK REPORTS
-- ==============================================
CREATE TABLE dailystockreports (
    report_id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    report_date DATE NOT NULL,
    -- Big Stock Inventory (Warehouse)
    big_opening INTEGER DEFAULT 0,
    big_purchase_in INTEGER DEFAULT 0,
    big_move_out INTEGER DEFAULT 0,
    big_remaining INTEGER DEFAULT 0,
    -- Small Stock Inventory (Retail/Fridge)
    small_opening INTEGER DEFAULT 0,
    small_move_in INTEGER DEFAULT 0,
    small_sell_out INTEGER DEFAULT 0,
    small_closing INTEGER DEFAULT 0,
    -- Legacy columns (kept for backward compatibility, computed from big+small)
    opening_stock INTEGER DEFAULT 0,
    purchased_qty INTEGER DEFAULT 0,
    sold_qty INTEGER DEFAULT 0,
    closing_stock INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, report_date)
);

CREATE INDEX idx_dsr_product ON dailystockreports(product_id);
CREATE INDEX idx_dsr_date ON dailystockreports(report_date);
CREATE INDEX idx_dsr_product_date ON dailystockreports(product_id, report_date);

-- ==============================================
-- 10. USER SETTINGS
-- ==============================================
CREATE TABLE user_settings (
    setting_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_user_settings_updated_at
    BEFORE UPDATE ON user_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX idx_user_settings_user_id ON user_settings(user_id);

-- ==============================================
-- VIEW: Supplier PO Summary (SECURITY INVOKER)
-- ==============================================
CREATE OR REPLACE VIEW supplier_po_summary
WITH (security_invoker = true) AS
SELECT
    s.supplier_id,
    s.company_name,
    s.contact_person,
    s.sale_agent,
    s.phone,
    s.email,
    s.address,
    s.lead_time_days,
    s.payment_method,
    COUNT(po.po_id) AS total_orders,
    COALESCE(SUM(po.total_amount), 0) AS total_amount,
    MAX(po.order_date) AS last_order_date
FROM suppliers s
LEFT JOIN purchaseorders po ON s.supplier_id = po.supplier_id
GROUP BY s.supplier_id, s.company_name, s.contact_person, s.sale_agent,
         s.phone, s.email, s.address, s.lead_time_days, s.payment_method;

-- ==============================================
-- ROW LEVEL SECURITY
-- ==============================================
-- NOTE: This app uses server-side API routes with the service_role key,
-- which bypasses RLS entirely. These policies are kept as a safety net
-- and also allow the anon role for cases where the anon key is used.
-- ==============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchaseorders ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchaseorderitems ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE saleitems ENABLE ROW LEVEL SECURITY;
ALTER TABLE dailystockreports ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- ==============================================
-- RLS POLICIES (allow all roles: service_role, authenticated, anon)
-- The app handles its own authentication via JWT tokens in API routes.
-- ==============================================

-- ---- USERS ----
CREATE POLICY "users_select" ON users FOR SELECT USING (true);
CREATE POLICY "users_insert" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "users_update" ON users FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "users_delete" ON users FOR DELETE USING (true);

-- ---- SUPPLIERS ----
CREATE POLICY "suppliers_select" ON suppliers FOR SELECT USING (true);
CREATE POLICY "suppliers_insert" ON suppliers FOR INSERT WITH CHECK (true);
CREATE POLICY "suppliers_update" ON suppliers FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "suppliers_delete" ON suppliers FOR DELETE USING (true);

-- ---- PRODUCTS ----
CREATE POLICY "products_select" ON products FOR SELECT USING (true);
CREATE POLICY "products_insert" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "products_update" ON products FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "products_delete" ON products FOR DELETE USING (true);

-- ---- CUSTOMERS ----
CREATE POLICY "customers_select" ON customers FOR SELECT USING (true);
CREATE POLICY "customers_insert" ON customers FOR INSERT WITH CHECK (true);
CREATE POLICY "customers_update" ON customers FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "customers_delete" ON customers FOR DELETE USING (true);

-- ---- PURCHASE ORDERS ----
CREATE POLICY "po_select" ON purchaseorders FOR SELECT USING (true);
CREATE POLICY "po_insert" ON purchaseorders FOR INSERT WITH CHECK (true);
CREATE POLICY "po_update" ON purchaseorders FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "po_delete" ON purchaseorders FOR DELETE USING (true);

-- ---- PURCHASE ORDER ITEMS ----
CREATE POLICY "poi_select" ON purchaseorderitems FOR SELECT USING (true);
CREATE POLICY "poi_insert" ON purchaseorderitems FOR INSERT WITH CHECK (true);
CREATE POLICY "poi_update" ON purchaseorderitems FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "poi_delete" ON purchaseorderitems FOR DELETE USING (true);

-- ---- SALES ----
CREATE POLICY "sales_select" ON sales FOR SELECT USING (true);
CREATE POLICY "sales_insert" ON sales FOR INSERT WITH CHECK (true);
CREATE POLICY "sales_update" ON sales FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "sales_delete" ON sales FOR DELETE USING (true);

-- ---- SALE ITEMS ----
CREATE POLICY "si_select" ON saleitems FOR SELECT USING (true);
CREATE POLICY "si_insert" ON saleitems FOR INSERT WITH CHECK (true);
CREATE POLICY "si_update" ON saleitems FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "si_delete" ON saleitems FOR DELETE USING (true);

-- ---- DAILY STOCK REPORTS ----
CREATE POLICY "dsr_select" ON dailystockreports FOR SELECT USING (true);
CREATE POLICY "dsr_insert" ON dailystockreports FOR INSERT WITH CHECK (true);
CREATE POLICY "dsr_update" ON dailystockreports FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "dsr_delete" ON dailystockreports FOR DELETE USING (true);

-- ---- USER SETTINGS ----
CREATE POLICY "us_select" ON user_settings FOR SELECT USING (true);
CREATE POLICY "us_insert" ON user_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "us_update" ON user_settings FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "us_delete" ON user_settings FOR DELETE USING (true);

-- ==============================================
-- GRANTS
-- ==============================================
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon;
