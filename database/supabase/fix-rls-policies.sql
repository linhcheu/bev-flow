-- ==============================================
-- H2O - FIX RLS POLICIES
-- Run this in Supabase SQL Editor to fix write operations
-- ==============================================
-- Problem: The old RLS policies only allowed 'service_role' and 'authenticated'
-- roles to INSERT/UPDATE/DELETE. If using the anon key, all writes were blocked.
-- Fix: Allow all operations for all roles (the app handles auth server-side).
-- ==============================================

-- ============ DROP OLD RESTRICTIVE POLICIES ============

-- Users
DROP POLICY IF EXISTS "users_select" ON users;
DROP POLICY IF EXISTS "users_insert" ON users;
DROP POLICY IF EXISTS "users_update" ON users;
DROP POLICY IF EXISTS "users_delete" ON users;

-- Suppliers
DROP POLICY IF EXISTS "suppliers_select" ON suppliers;
DROP POLICY IF EXISTS "suppliers_insert" ON suppliers;
DROP POLICY IF EXISTS "suppliers_update" ON suppliers;
DROP POLICY IF EXISTS "suppliers_delete" ON suppliers;

-- Products
DROP POLICY IF EXISTS "products_select" ON products;
DROP POLICY IF EXISTS "products_insert" ON products;
DROP POLICY IF EXISTS "products_update" ON products;
DROP POLICY IF EXISTS "products_delete" ON products;

-- Customers
DROP POLICY IF EXISTS "customers_select" ON customers;
DROP POLICY IF EXISTS "customers_insert" ON customers;
DROP POLICY IF EXISTS "customers_update" ON customers;
DROP POLICY IF EXISTS "customers_delete" ON customers;

-- Purchase Orders
DROP POLICY IF EXISTS "po_select" ON purchaseorders;
DROP POLICY IF EXISTS "po_insert" ON purchaseorders;
DROP POLICY IF EXISTS "po_update" ON purchaseorders;
DROP POLICY IF EXISTS "po_delete" ON purchaseorders;

-- Purchase Order Items
DROP POLICY IF EXISTS "poi_select" ON purchaseorderitems;
DROP POLICY IF EXISTS "poi_insert" ON purchaseorderitems;
DROP POLICY IF EXISTS "poi_update" ON purchaseorderitems;
DROP POLICY IF EXISTS "poi_delete" ON purchaseorderitems;

-- Sales
DROP POLICY IF EXISTS "sales_select" ON sales;
DROP POLICY IF EXISTS "sales_insert" ON sales;
DROP POLICY IF EXISTS "sales_update" ON sales;
DROP POLICY IF EXISTS "sales_delete" ON sales;

-- Sale Items
DROP POLICY IF EXISTS "si_select" ON saleitems;
DROP POLICY IF EXISTS "si_insert" ON saleitems;
DROP POLICY IF EXISTS "si_update" ON saleitems;
DROP POLICY IF EXISTS "si_delete" ON saleitems;

-- Daily Stock Reports
DROP POLICY IF EXISTS "dsr_select" ON dailystockreports;
DROP POLICY IF EXISTS "dsr_insert" ON dailystockreports;
DROP POLICY IF EXISTS "dsr_update" ON dailystockreports;
DROP POLICY IF EXISTS "dsr_delete" ON dailystockreports;

-- User Settings
DROP POLICY IF EXISTS "us_select" ON user_settings;
DROP POLICY IF EXISTS "us_insert" ON user_settings;
DROP POLICY IF EXISTS "us_update" ON user_settings;
DROP POLICY IF EXISTS "us_delete" ON user_settings;


-- ============ CREATE NEW PERMISSIVE POLICIES ============

-- Users
CREATE POLICY "users_select" ON users FOR SELECT USING (true);
CREATE POLICY "users_insert" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "users_update" ON users FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "users_delete" ON users FOR DELETE USING (true);

-- Suppliers
CREATE POLICY "suppliers_select" ON suppliers FOR SELECT USING (true);
CREATE POLICY "suppliers_insert" ON suppliers FOR INSERT WITH CHECK (true);
CREATE POLICY "suppliers_update" ON suppliers FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "suppliers_delete" ON suppliers FOR DELETE USING (true);

-- Products
CREATE POLICY "products_select" ON products FOR SELECT USING (true);
CREATE POLICY "products_insert" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "products_update" ON products FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "products_delete" ON products FOR DELETE USING (true);

-- Customers
CREATE POLICY "customers_select" ON customers FOR SELECT USING (true);
CREATE POLICY "customers_insert" ON customers FOR INSERT WITH CHECK (true);
CREATE POLICY "customers_update" ON customers FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "customers_delete" ON customers FOR DELETE USING (true);

-- Purchase Orders
CREATE POLICY "po_select" ON purchaseorders FOR SELECT USING (true);
CREATE POLICY "po_insert" ON purchaseorders FOR INSERT WITH CHECK (true);
CREATE POLICY "po_update" ON purchaseorders FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "po_delete" ON purchaseorders FOR DELETE USING (true);

-- Purchase Order Items
CREATE POLICY "poi_select" ON purchaseorderitems FOR SELECT USING (true);
CREATE POLICY "poi_insert" ON purchaseorderitems FOR INSERT WITH CHECK (true);
CREATE POLICY "poi_update" ON purchaseorderitems FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "poi_delete" ON purchaseorderitems FOR DELETE USING (true);

-- Sales
CREATE POLICY "sales_select" ON sales FOR SELECT USING (true);
CREATE POLICY "sales_insert" ON sales FOR INSERT WITH CHECK (true);
CREATE POLICY "sales_update" ON sales FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "sales_delete" ON sales FOR DELETE USING (true);

-- Sale Items
CREATE POLICY "si_select" ON saleitems FOR SELECT USING (true);
CREATE POLICY "si_insert" ON saleitems FOR INSERT WITH CHECK (true);
CREATE POLICY "si_update" ON saleitems FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "si_delete" ON saleitems FOR DELETE USING (true);

-- Daily Stock Reports
CREATE POLICY "dsr_select" ON dailystockreports FOR SELECT USING (true);
CREATE POLICY "dsr_insert" ON dailystockreports FOR INSERT WITH CHECK (true);
CREATE POLICY "dsr_update" ON dailystockreports FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "dsr_delete" ON dailystockreports FOR DELETE USING (true);

-- User Settings
CREATE POLICY "us_select" ON user_settings FOR SELECT USING (true);
CREATE POLICY "us_insert" ON user_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "us_update" ON user_settings FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "us_delete" ON user_settings FOR DELETE USING (true);

-- ============ ENSURE GRANTS ARE CORRECT ============
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon;

-- Done! All CRUD operations should now work with any Supabase key.
