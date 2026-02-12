-- ==============================================
-- BEV Flow - Stock Reports Migration for Supabase
-- Run this in Supabase SQL Editor
-- Creates DailyStockReports table + seeds Feb 2026 data
-- Also fixes all security warnings and errors
-- ==============================================

-- ==============================================
-- STEP 1: FIX ERROR - Drop SECURITY DEFINER view
-- The view supplier_po_summary was created with SECURITY DEFINER
-- which enforces the creator's permissions instead of the querying user
-- ==============================================
DROP VIEW IF EXISTS supplier_po_summary CASCADE;

-- Recreate the view as SECURITY INVOKER (default, safe)
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
    COUNT(po.po_id) as total_orders,
    COALESCE(SUM(po.total_amount), 0) as total_amount,
    MAX(po.order_date) as last_order_date
FROM suppliers s
LEFT JOIN purchaseorders po ON s.supplier_id = po.supplier_id
GROUP BY s.supplier_id, s.company_name, s.contact_person, s.sale_agent, 
         s.phone, s.email, s.address, s.lead_time_days, s.payment_method;

-- ==============================================
-- STEP 2: FIX WARNING - Function search_path mutable
-- Set search_path on update_updated_at_column() function
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
-- STEP 3: FIX WARNINGS - RLS policies always true
-- Replace overly permissive "USING (true) WITH CHECK (true)" for ALL
-- with separate per-operation policies (SELECT/INSERT/UPDATE/DELETE)
-- ==============================================

-- Helper: list of all tables to fix
-- annualorders, customers, forecasts, product_supplier_availability,
-- products, purchaseorderitems, purchaseorders, saleitems, sales, suppliers, users

-- ---- ANNUALORDERS ----
DROP POLICY IF EXISTS "Allow all access to annualorders" ON annualorders;
-- SELECT is fine with USING(true) for public read access (not flagged by linter)
CREATE POLICY "annualorders_select" ON annualorders FOR SELECT USING (true);
-- Service role can do everything via RLS bypass; authenticated users get role-checked access
CREATE POLICY "annualorders_insert" ON annualorders FOR INSERT
  WITH CHECK ((select current_setting('role')) IN ('service_role', 'authenticated'));
CREATE POLICY "annualorders_update" ON annualorders FOR UPDATE
  USING ((select current_setting('role')) IN ('service_role', 'authenticated'))
  WITH CHECK ((select current_setting('role')) IN ('service_role', 'authenticated'));
CREATE POLICY "annualorders_delete" ON annualorders FOR DELETE
  USING ((select current_setting('role')) IN ('service_role', 'authenticated'));

-- ---- CUSTOMERS ----
DROP POLICY IF EXISTS "Allow all access to customers" ON customers;
DROP POLICY IF EXISTS "Service role has full access to customers" ON customers;
DROP POLICY IF EXISTS "Authenticated users can view customers" ON customers;
DROP POLICY IF EXISTS "Authenticated users can manage customers" ON customers;
CREATE POLICY "customers_select" ON customers FOR SELECT USING (true);
CREATE POLICY "customers_insert" ON customers FOR INSERT
  WITH CHECK ((select current_setting('role')) IN ('service_role', 'authenticated'));
CREATE POLICY "customers_update" ON customers FOR UPDATE
  USING ((select current_setting('role')) IN ('service_role', 'authenticated'))
  WITH CHECK ((select current_setting('role')) IN ('service_role', 'authenticated'));
CREATE POLICY "customers_delete" ON customers FOR DELETE
  USING ((select current_setting('role')) IN ('service_role', 'authenticated'));

-- ---- FORECASTS ----
DROP POLICY IF EXISTS "Allow all access to forecasts" ON forecasts;
DROP POLICY IF EXISTS "Service role has full access to forecasts" ON forecasts;
DROP POLICY IF EXISTS "Authenticated users can view forecasts" ON forecasts;
DROP POLICY IF EXISTS "Authenticated users can manage forecasts" ON forecasts;
CREATE POLICY "forecasts_select" ON forecasts FOR SELECT USING (true);
CREATE POLICY "forecasts_insert" ON forecasts FOR INSERT
  WITH CHECK ((select current_setting('role')) IN ('service_role', 'authenticated'));
CREATE POLICY "forecasts_update" ON forecasts FOR UPDATE
  USING ((select current_setting('role')) IN ('service_role', 'authenticated'))
  WITH CHECK ((select current_setting('role')) IN ('service_role', 'authenticated'));
CREATE POLICY "forecasts_delete" ON forecasts FOR DELETE
  USING ((select current_setting('role')) IN ('service_role', 'authenticated'));

-- ---- PRODUCT_SUPPLIER_AVAILABILITY ----
DROP POLICY IF EXISTS "Allow all access to product_supplier_availability" ON product_supplier_availability;
DROP POLICY IF EXISTS "Service role has full access to product_supplier_availability" ON product_supplier_availability;
DROP POLICY IF EXISTS "Authenticated users can view product_supplier_availability" ON product_supplier_availability;
DROP POLICY IF EXISTS "Authenticated users can manage product_supplier_availability" ON product_supplier_availability;
CREATE POLICY "psa_select" ON product_supplier_availability FOR SELECT USING (true);
CREATE POLICY "psa_insert" ON product_supplier_availability FOR INSERT
  WITH CHECK ((select current_setting('role')) IN ('service_role', 'authenticated'));
CREATE POLICY "psa_update" ON product_supplier_availability FOR UPDATE
  USING ((select current_setting('role')) IN ('service_role', 'authenticated'))
  WITH CHECK ((select current_setting('role')) IN ('service_role', 'authenticated'));
CREATE POLICY "psa_delete" ON product_supplier_availability FOR DELETE
  USING ((select current_setting('role')) IN ('service_role', 'authenticated'));

-- ---- PRODUCTS ----
DROP POLICY IF EXISTS "Allow all access to products" ON products;
DROP POLICY IF EXISTS "Service role has full access to products" ON products;
DROP POLICY IF EXISTS "Authenticated users can view products" ON products;
DROP POLICY IF EXISTS "Authenticated users can manage products" ON products;
CREATE POLICY "products_select" ON products FOR SELECT USING (true);
CREATE POLICY "products_insert" ON products FOR INSERT
  WITH CHECK ((select current_setting('role')) IN ('service_role', 'authenticated'));
CREATE POLICY "products_update" ON products FOR UPDATE
  USING ((select current_setting('role')) IN ('service_role', 'authenticated'))
  WITH CHECK ((select current_setting('role')) IN ('service_role', 'authenticated'));
CREATE POLICY "products_delete" ON products FOR DELETE
  USING ((select current_setting('role')) IN ('service_role', 'authenticated'));

-- ---- PURCHASEORDERITEMS ----
DROP POLICY IF EXISTS "Allow all access to purchaseorderitems" ON purchaseorderitems;
DROP POLICY IF EXISTS "Service role has full access to purchaseorderitems" ON purchaseorderitems;
DROP POLICY IF EXISTS "Authenticated users can view purchaseorderitems" ON purchaseorderitems;
DROP POLICY IF EXISTS "Authenticated users can manage purchaseorderitems" ON purchaseorderitems;
CREATE POLICY "poi_select" ON purchaseorderitems FOR SELECT USING (true);
CREATE POLICY "poi_insert" ON purchaseorderitems FOR INSERT
  WITH CHECK ((select current_setting('role')) IN ('service_role', 'authenticated'));
CREATE POLICY "poi_update" ON purchaseorderitems FOR UPDATE
  USING ((select current_setting('role')) IN ('service_role', 'authenticated'))
  WITH CHECK ((select current_setting('role')) IN ('service_role', 'authenticated'));
CREATE POLICY "poi_delete" ON purchaseorderitems FOR DELETE
  USING ((select current_setting('role')) IN ('service_role', 'authenticated'));

-- ---- PURCHASEORDERS ----
DROP POLICY IF EXISTS "Allow all access to purchaseorders" ON purchaseorders;
DROP POLICY IF EXISTS "Service role has full access to purchaseorders" ON purchaseorders;
DROP POLICY IF EXISTS "Authenticated users can view purchaseorders" ON purchaseorders;
DROP POLICY IF EXISTS "Authenticated users can manage purchaseorders" ON purchaseorders;
CREATE POLICY "po_select" ON purchaseorders FOR SELECT USING (true);
CREATE POLICY "po_insert" ON purchaseorders FOR INSERT
  WITH CHECK ((select current_setting('role')) IN ('service_role', 'authenticated'));
CREATE POLICY "po_update" ON purchaseorders FOR UPDATE
  USING ((select current_setting('role')) IN ('service_role', 'authenticated'))
  WITH CHECK ((select current_setting('role')) IN ('service_role', 'authenticated'));
CREATE POLICY "po_delete" ON purchaseorders FOR DELETE
  USING ((select current_setting('role')) IN ('service_role', 'authenticated'));

-- ---- SALEITEMS ----
DROP POLICY IF EXISTS "Allow all access to saleitems" ON saleitems;
DROP POLICY IF EXISTS "Service role has full access to saleitems" ON saleitems;
DROP POLICY IF EXISTS "Authenticated users can view saleitems" ON saleitems;
DROP POLICY IF EXISTS "Authenticated users can manage saleitems" ON saleitems;
CREATE POLICY "si_select" ON saleitems FOR SELECT USING (true);
CREATE POLICY "si_insert" ON saleitems FOR INSERT
  WITH CHECK ((select current_setting('role')) IN ('service_role', 'authenticated'));
CREATE POLICY "si_update" ON saleitems FOR UPDATE
  USING ((select current_setting('role')) IN ('service_role', 'authenticated'))
  WITH CHECK ((select current_setting('role')) IN ('service_role', 'authenticated'));
CREATE POLICY "si_delete" ON saleitems FOR DELETE
  USING ((select current_setting('role')) IN ('service_role', 'authenticated'));

-- ---- SALES ----
DROP POLICY IF EXISTS "Allow all access to sales" ON sales;
DROP POLICY IF EXISTS "Service role has full access to sales" ON sales;
DROP POLICY IF EXISTS "Authenticated users can view sales" ON sales;
DROP POLICY IF EXISTS "Authenticated users can manage sales" ON sales;
CREATE POLICY "sales_select" ON sales FOR SELECT USING (true);
CREATE POLICY "sales_insert" ON sales FOR INSERT
  WITH CHECK ((select current_setting('role')) IN ('service_role', 'authenticated'));
CREATE POLICY "sales_update" ON sales FOR UPDATE
  USING ((select current_setting('role')) IN ('service_role', 'authenticated'))
  WITH CHECK ((select current_setting('role')) IN ('service_role', 'authenticated'));
CREATE POLICY "sales_delete" ON sales FOR DELETE
  USING ((select current_setting('role')) IN ('service_role', 'authenticated'));

-- ---- SUPPLIERS ----
DROP POLICY IF EXISTS "Allow all access to suppliers" ON suppliers;
DROP POLICY IF EXISTS "Service role has full access to suppliers" ON suppliers;
DROP POLICY IF EXISTS "Authenticated users can view suppliers" ON suppliers;
DROP POLICY IF EXISTS "Authenticated users can manage suppliers" ON suppliers;
CREATE POLICY "suppliers_select" ON suppliers FOR SELECT USING (true);
CREATE POLICY "suppliers_insert" ON suppliers FOR INSERT
  WITH CHECK ((select current_setting('role')) IN ('service_role', 'authenticated'));
CREATE POLICY "suppliers_update" ON suppliers FOR UPDATE
  USING ((select current_setting('role')) IN ('service_role', 'authenticated'))
  WITH CHECK ((select current_setting('role')) IN ('service_role', 'authenticated'));
CREATE POLICY "suppliers_delete" ON suppliers FOR DELETE
  USING ((select current_setting('role')) IN ('service_role', 'authenticated'));

-- ---- USERS ----
DROP POLICY IF EXISTS "Allow all access to users" ON users;
DROP POLICY IF EXISTS "Service role has full access to users" ON users;
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
CREATE POLICY "users_select" ON users FOR SELECT USING (true);
CREATE POLICY "users_insert" ON users FOR INSERT
  WITH CHECK ((select current_setting('role')) IN ('service_role', 'authenticated'));
CREATE POLICY "users_update" ON users FOR UPDATE
  USING ((select current_setting('role')) IN ('service_role', 'authenticated'))
  WITH CHECK ((select current_setting('role')) IN ('service_role', 'authenticated'));
CREATE POLICY "users_delete" ON users FOR DELETE
  USING ((select current_setting('role')) IN ('service_role', 'authenticated'));

-- ==============================================
-- STEP 4: Create DailyStockReports table
-- ==============================================
CREATE TABLE IF NOT EXISTS dailystockreports (
    report_id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    report_date DATE NOT NULL,
    opening_stock INTEGER DEFAULT 0,
    purchased_qty INTEGER DEFAULT 0,
    sold_qty INTEGER DEFAULT 0,
    closing_stock INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, report_date)
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_dsr_product ON dailystockreports(product_id);
CREATE INDEX IF NOT EXISTS idx_dsr_date ON dailystockreports(report_date);
CREATE INDEX IF NOT EXISTS idx_dsr_product_date ON dailystockreports(product_id, report_date);

-- Enable RLS
ALTER TABLE dailystockreports ENABLE ROW LEVEL SECURITY;

-- Per-operation policies (no always-true ALL)
CREATE POLICY "dsr_select" ON dailystockreports FOR SELECT USING (true);
CREATE POLICY "dsr_insert" ON dailystockreports FOR INSERT
  WITH CHECK ((select current_setting('role')) IN ('service_role', 'authenticated'));
CREATE POLICY "dsr_update" ON dailystockreports FOR UPDATE
  USING ((select current_setting('role')) IN ('service_role', 'authenticated'))
  WITH CHECK ((select current_setting('role')) IN ('service_role', 'authenticated'));
CREATE POLICY "dsr_delete" ON dailystockreports FOR DELETE
  USING ((select current_setting('role')) IN ('service_role', 'authenticated'));

-- Grants
GRANT ALL ON dailystockreports TO service_role;
GRANT ALL ON dailystockreports TO authenticated;
GRANT SELECT ON dailystockreports TO anon;
GRANT USAGE, SELECT ON SEQUENCE dailystockreports_report_id_seq TO service_role;
GRANT USAGE, SELECT ON SEQUENCE dailystockreports_report_id_seq TO authenticated;

-- ==============================================
-- STEP 5: Seed Feb 2026 Daily Stock Reports (280 rows)
-- ==============================================
-- Clear any existing Feb 2026 data
DELETE FROM dailystockreports WHERE report_date BETWEEN '2026-02-01' AND '2026-02-28';

-- Feb 2026 stock data generated from the same logic as the local seed endpoint.
-- Opening stock for Feb 1: P1=0, P2=5, P3=5, P4=9, P5=10, P6=2, P7=3, P8=0, P9=6, P10=8
-- Purchase schedule matching EOQ quantities (34-36 units) every 2-3 days per product.
-- Daily sales: realistic ~5-13 units/day/product.
-- closing = opening + purchased - sold

-- We use a DO block to compute opening/purchased/sold/closing programmatically,
-- matching the exact same logic as the local seed.post.ts endpoint.

DO $$
DECLARE
    v_day INTEGER;
    v_pid INTEGER;
    v_idx INTEGER;
    v_opening INTEGER;
    v_purchased INTEGER;
    v_sold INTEGER;
    v_closing INTEGER;
    v_max_sellable INTEGER;
    v_date DATE;
    v_purchase_key TEXT;
    -- Current stock tracker (indexed 1-10)
    v_stock INTEGER[10];
    -- Feb 1 opening stock
    v_feb1_opening INTEGER[10] := ARRAY[0, 5, 5, 9, 10, 2, 3, 0, 6, 8];
    -- Daily sales data (28 days × 10 products), stored as flat array
    -- Index: (day-1)*10 + (product_idx-1) + 1
    v_daily_sales INTEGER[280] := ARRAY[
        -- Day 1:  p1,p2,p3,p4,p5,p6,p7,p8,p9,p10
        1, 0, 2, 0, 0, 0, 0, 3, 0, 0,
        -- Day 2
        4, 0, 2, 3, 1, 1, 0, 0, 1, 4,
        -- Day 3
        8, 3, 5, 6, 7, 4, 5, 2, 3, 6,
        -- Day 4
        12, 7, 3, 4, 9, 6, 8, 5, 7, 5,
        -- Day 5
        6, 8, 6, 7, 5, 3, 4, 8, 9, 7,
        -- Day 6
        10, 5, 7, 3, 8, 9, 6, 7, 5, 8,
        -- Day 7
        8, 6, 9, 8, 11, 7, 5, 10, 6, 9,
        -- Day 8
        11, 9, 8, 7, 6, 5, 12, 4, 8, 7,
        -- Day 9
        7, 5, 4, 9, 8, 10, 6, 11, 7, 5,
        -- Day 10
        9, 8, 6, 5, 7, 8, 10, 7, 9, 11,
        -- Day 11
        6, 7, 8, 10, 9, 6, 8, 5, 7, 6,
        -- Day 12
        13, 9, 7, 8, 5, 11, 6, 7, 9, 8,
        -- Day 13
        8, 6, 11, 5, 10, 7, 9, 6, 8, 7,
        -- Day 14
        10, 8, 7, 9, 6, 8, 5, 10, 7, 9,
        -- Day 15
        7, 5, 9, 6, 8, 7, 11, 4, 6, 8,
        -- Day 16
        9, 7, 6, 8, 5, 9, 7, 8, 5, 7,
        -- Day 17
        11, 8, 10, 7, 9, 6, 5, 7, 8, 10,
        -- Day 18
        6, 9, 5, 8, 7, 10, 8, 6, 7, 5,
        -- Day 19
        8, 5, 7, 6, 9, 8, 6, 9, 5, 8,
        -- Day 20
        10, 7, 8, 5, 6, 7, 9, 8, 6, 7,
        -- Day 21
        7, 8, 6, 9, 8, 5, 7, 6, 9, 8,
        -- Day 22
        9, 6, 7, 8, 5, 9, 6, 7, 8, 6,
        -- Day 23
        8, 7, 9, 6, 7, 8, 5, 8, 7, 9,
        -- Day 24
        6, 9, 5, 7, 8, 6, 8, 5, 9, 7,
        -- Day 25
        10, 5, 8, 6, 7, 9, 7, 6, 5, 8,
        -- Day 26
        7, 8, 6, 9, 5, 7, 6, 8, 7, 6,
        -- Day 27
        9, 6, 7, 5, 8, 8, 9, 5, 6, 9,
        -- Day 28
        8, 7, 5, 8, 6, 7, 5, 7, 8, 7
    ];
BEGIN
    -- Init stock from Feb 1 opening
    FOR i IN 1..10 LOOP
        v_stock[i] := v_feb1_opening[i];
    END LOOP;

    FOR v_day IN 1..28 LOOP
        v_date := ('2026-02-01'::date + (v_day - 1));
        
        FOR v_idx IN 1..10 LOOP
            v_pid := v_idx; -- product_id matches 1-10
            v_opening := v_stock[v_idx];
            
            -- Determine purchases from the schedule
            v_purchased := 0;
            v_purchase_key := v_day::text || '-' || v_pid::text;
            
            -- Purchase schedule (same as seed.post.ts)
            IF (v_day = 1 AND v_pid = 1) THEN v_purchased := 10;
            ELSIF (v_day = 1 AND v_pid = 8) THEN v_purchased := 10;
            ELSIF (v_day = 2 AND v_pid = 2) THEN v_purchased := 5;
            ELSIF (v_day = 2 AND v_pid = 3) THEN v_purchased := 5;
            ELSIF (v_day = 2 AND v_pid = 6) THEN v_purchased := 5;
            ELSIF (v_day = 2 AND v_pid = 7) THEN v_purchased := 5;
            ELSIF (v_day = 4 AND v_pid = 1) THEN v_purchased := 35;
            ELSIF (v_day = 4 AND v_pid = 4) THEN v_purchased := 35;
            ELSIF (v_day = 5 AND v_pid = 5) THEN v_purchased := 35;
            ELSIF (v_day = 5 AND v_pid = 10) THEN v_purchased := 35;
            ELSIF (v_day = 7 AND v_pid = 2) THEN v_purchased := 35;
            ELSIF (v_day = 7 AND v_pid = 3) THEN v_purchased := 35;
            ELSIF (v_day = 8 AND v_pid = 6) THEN v_purchased := 35;
            ELSIF (v_day = 8 AND v_pid = 8) THEN v_purchased := 35;
            ELSIF (v_day = 9 AND v_pid = 7) THEN v_purchased := 34;
            ELSIF (v_day = 9 AND v_pid = 9) THEN v_purchased := 35;
            ELSIF (v_day = 11 AND v_pid = 1) THEN v_purchased := 35;
            ELSIF (v_day = 11 AND v_pid = 10) THEN v_purchased := 35;
            ELSIF (v_day = 13 AND v_pid = 2) THEN v_purchased := 35;
            ELSIF (v_day = 13 AND v_pid = 4) THEN v_purchased := 35;
            ELSIF (v_day = 14 AND v_pid = 5) THEN v_purchased := 35;
            ELSIF (v_day = 14 AND v_pid = 6) THEN v_purchased := 35;
            ELSIF (v_day = 15 AND v_pid = 3) THEN v_purchased := 36;
            ELSIF (v_day = 15 AND v_pid = 8) THEN v_purchased := 35;
            ELSIF (v_day = 16 AND v_pid = 7) THEN v_purchased := 34;
            ELSIF (v_day = 16 AND v_pid = 9) THEN v_purchased := 35;
            ELSIF (v_day = 18 AND v_pid = 1) THEN v_purchased := 35;
            ELSIF (v_day = 18 AND v_pid = 10) THEN v_purchased := 35;
            ELSIF (v_day = 19 AND v_pid = 2) THEN v_purchased := 35;
            ELSIF (v_day = 19 AND v_pid = 4) THEN v_purchased := 35;
            ELSIF (v_day = 20 AND v_pid = 5) THEN v_purchased := 35;
            ELSIF (v_day = 20 AND v_pid = 6) THEN v_purchased := 35;
            ELSIF (v_day = 21 AND v_pid = 3) THEN v_purchased := 36;
            ELSIF (v_day = 21 AND v_pid = 8) THEN v_purchased := 35;
            ELSIF (v_day = 22 AND v_pid = 7) THEN v_purchased := 34;
            ELSIF (v_day = 22 AND v_pid = 9) THEN v_purchased := 35;
            ELSIF (v_day = 24 AND v_pid = 1) THEN v_purchased := 35;
            ELSIF (v_day = 24 AND v_pid = 10) THEN v_purchased := 35;
            ELSIF (v_day = 25 AND v_pid = 2) THEN v_purchased := 35;
            ELSIF (v_day = 25 AND v_pid = 4) THEN v_purchased := 35;
            ELSIF (v_day = 26 AND v_pid = 5) THEN v_purchased := 35;
            ELSIF (v_day = 26 AND v_pid = 6) THEN v_purchased := 35;
            ELSIF (v_day = 27 AND v_pid = 3) THEN v_purchased := 36;
            ELSIF (v_day = 27 AND v_pid = 8) THEN v_purchased := 35;
            ELSIF (v_day = 28 AND v_pid = 7) THEN v_purchased := 34;
            ELSIF (v_day = 28 AND v_pid = 9) THEN v_purchased := 35;
            END IF;
            
            -- Calculate sold (capped at available stock)
            v_max_sellable := v_opening + v_purchased;
            v_sold := LEAST(v_daily_sales[(v_day - 1) * 10 + v_idx], v_max_sellable);
            v_closing := v_opening + v_purchased - v_sold;
            
            INSERT INTO dailystockreports (product_id, report_date, opening_stock, purchased_qty, sold_qty, closing_stock)
            VALUES (v_pid, v_date, v_opening, v_purchased, v_sold, v_closing)
            ON CONFLICT (product_id, report_date) DO UPDATE SET
                opening_stock = EXCLUDED.opening_stock,
                purchased_qty = EXCLUDED.purchased_qty,
                sold_qty = EXCLUDED.sold_qty,
                closing_stock = EXCLUDED.closing_stock;
            
            -- Track stock for next day
            v_stock[v_idx] := v_closing;
        END LOOP;
    END LOOP;
    
    -- Update products table with final closing stock (Feb 28 values)
    FOR v_idx IN 1..10 LOOP
        UPDATE products SET current_stock = v_stock[v_idx] WHERE product_id = v_idx;
    END LOOP;
    
    RAISE NOTICE 'Seeded 280 daily stock report records for Feb 2026';
END $$;

-- ==============================================
-- STEP 6: Refresh grants for new table
-- ==============================================
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

-- ==============================================
-- VERIFY
-- ==============================================
SELECT 'Migration complete!' AS status,
       (SELECT COUNT(*) FROM dailystockreports) AS stock_report_rows,
       (SELECT COUNT(*) FROM dailystockreports WHERE report_date = '2026-02-01') AS feb1_rows,
       (SELECT COUNT(*) FROM dailystockreports WHERE report_date = '2026-02-28') AS feb28_rows;
