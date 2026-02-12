-- ==============================================
-- BEV Flow - Fix RLS InitPlan + Unused Indexes + Invoice Numbers
-- Run this in Supabase SQL Editor
-- ==============================================

-- ==============================================
-- STEP 1: FIX auth_rls_initplan WARNINGS
-- Wrap current_setting() in (SELECT ...) so it's evaluated once
-- per query instead of per-row.
-- We drop + recreate each affected policy.
-- ==============================================

-- ---- ANNUALORDERS ----
DROP POLICY IF EXISTS "annualorders_insert" ON annualorders;
DROP POLICY IF EXISTS "annualorders_update" ON annualorders;
DROP POLICY IF EXISTS "annualorders_delete" ON annualorders;

CREATE POLICY "annualorders_insert" ON annualorders FOR INSERT
  WITH CHECK ((select current_setting('role')) IN ('service_role', 'authenticated'));
CREATE POLICY "annualorders_update" ON annualorders FOR UPDATE
  USING ((select current_setting('role')) IN ('service_role', 'authenticated'))
  WITH CHECK ((select current_setting('role')) IN ('service_role', 'authenticated'));
CREATE POLICY "annualorders_delete" ON annualorders FOR DELETE
  USING ((select current_setting('role')) IN ('service_role', 'authenticated'));

-- ---- CUSTOMERS ----
DROP POLICY IF EXISTS "customers_insert" ON customers;
DROP POLICY IF EXISTS "customers_update" ON customers;
DROP POLICY IF EXISTS "customers_delete" ON customers;

CREATE POLICY "customers_insert" ON customers FOR INSERT
  WITH CHECK ((select current_setting('role')) IN ('service_role', 'authenticated'));
CREATE POLICY "customers_update" ON customers FOR UPDATE
  USING ((select current_setting('role')) IN ('service_role', 'authenticated'))
  WITH CHECK ((select current_setting('role')) IN ('service_role', 'authenticated'));
CREATE POLICY "customers_delete" ON customers FOR DELETE
  USING ((select current_setting('role')) IN ('service_role', 'authenticated'));

-- ---- FORECASTS ----
DROP POLICY IF EXISTS "forecasts_insert" ON forecasts;
DROP POLICY IF EXISTS "forecasts_update" ON forecasts;
DROP POLICY IF EXISTS "forecasts_delete" ON forecasts;

CREATE POLICY "forecasts_insert" ON forecasts FOR INSERT
  WITH CHECK ((select current_setting('role')) IN ('service_role', 'authenticated'));
CREATE POLICY "forecasts_update" ON forecasts FOR UPDATE
  USING ((select current_setting('role')) IN ('service_role', 'authenticated'))
  WITH CHECK ((select current_setting('role')) IN ('service_role', 'authenticated'));
CREATE POLICY "forecasts_delete" ON forecasts FOR DELETE
  USING ((select current_setting('role')) IN ('service_role', 'authenticated'));

-- ---- PRODUCT_SUPPLIER_AVAILABILITY ----
DROP POLICY IF EXISTS "psa_insert" ON product_supplier_availability;
DROP POLICY IF EXISTS "psa_update" ON product_supplier_availability;
DROP POLICY IF EXISTS "psa_delete" ON product_supplier_availability;

CREATE POLICY "psa_insert" ON product_supplier_availability FOR INSERT
  WITH CHECK ((select current_setting('role')) IN ('service_role', 'authenticated'));
CREATE POLICY "psa_update" ON product_supplier_availability FOR UPDATE
  USING ((select current_setting('role')) IN ('service_role', 'authenticated'))
  WITH CHECK ((select current_setting('role')) IN ('service_role', 'authenticated'));
CREATE POLICY "psa_delete" ON product_supplier_availability FOR DELETE
  USING ((select current_setting('role')) IN ('service_role', 'authenticated'));

-- ---- PRODUCTS ----
DROP POLICY IF EXISTS "products_insert" ON products;
DROP POLICY IF EXISTS "products_update" ON products;
DROP POLICY IF EXISTS "products_delete" ON products;

CREATE POLICY "products_insert" ON products FOR INSERT
  WITH CHECK ((select current_setting('role')) IN ('service_role', 'authenticated'));
CREATE POLICY "products_update" ON products FOR UPDATE
  USING ((select current_setting('role')) IN ('service_role', 'authenticated'))
  WITH CHECK ((select current_setting('role')) IN ('service_role', 'authenticated'));
CREATE POLICY "products_delete" ON products FOR DELETE
  USING ((select current_setting('role')) IN ('service_role', 'authenticated'));

-- ---- PURCHASEORDERITEMS ----
DROP POLICY IF EXISTS "poi_insert" ON purchaseorderitems;
DROP POLICY IF EXISTS "poi_update" ON purchaseorderitems;
DROP POLICY IF EXISTS "poi_delete" ON purchaseorderitems;

CREATE POLICY "poi_insert" ON purchaseorderitems FOR INSERT
  WITH CHECK ((select current_setting('role')) IN ('service_role', 'authenticated'));
CREATE POLICY "poi_update" ON purchaseorderitems FOR UPDATE
  USING ((select current_setting('role')) IN ('service_role', 'authenticated'))
  WITH CHECK ((select current_setting('role')) IN ('service_role', 'authenticated'));
CREATE POLICY "poi_delete" ON purchaseorderitems FOR DELETE
  USING ((select current_setting('role')) IN ('service_role', 'authenticated'));

-- ---- PURCHASEORDERS ----
DROP POLICY IF EXISTS "po_insert" ON purchaseorders;
DROP POLICY IF EXISTS "po_update" ON purchaseorders;
DROP POLICY IF EXISTS "po_delete" ON purchaseorders;

CREATE POLICY "po_insert" ON purchaseorders FOR INSERT
  WITH CHECK ((select current_setting('role')) IN ('service_role', 'authenticated'));
CREATE POLICY "po_update" ON purchaseorders FOR UPDATE
  USING ((select current_setting('role')) IN ('service_role', 'authenticated'))
  WITH CHECK ((select current_setting('role')) IN ('service_role', 'authenticated'));
CREATE POLICY "po_delete" ON purchaseorders FOR DELETE
  USING ((select current_setting('role')) IN ('service_role', 'authenticated'));

-- ---- SALEITEMS ----
DROP POLICY IF EXISTS "si_insert" ON saleitems;
DROP POLICY IF EXISTS "si_update" ON saleitems;
DROP POLICY IF EXISTS "si_delete" ON saleitems;

CREATE POLICY "si_insert" ON saleitems FOR INSERT
  WITH CHECK ((select current_setting('role')) IN ('service_role', 'authenticated'));
CREATE POLICY "si_update" ON saleitems FOR UPDATE
  USING ((select current_setting('role')) IN ('service_role', 'authenticated'))
  WITH CHECK ((select current_setting('role')) IN ('service_role', 'authenticated'));
CREATE POLICY "si_delete" ON saleitems FOR DELETE
  USING ((select current_setting('role')) IN ('service_role', 'authenticated'));

-- ---- SALES ----
DROP POLICY IF EXISTS "sales_insert" ON sales;
DROP POLICY IF EXISTS "sales_update" ON sales;
DROP POLICY IF EXISTS "sales_delete" ON sales;

CREATE POLICY "sales_insert" ON sales FOR INSERT
  WITH CHECK ((select current_setting('role')) IN ('service_role', 'authenticated'));
CREATE POLICY "sales_update" ON sales FOR UPDATE
  USING ((select current_setting('role')) IN ('service_role', 'authenticated'))
  WITH CHECK ((select current_setting('role')) IN ('service_role', 'authenticated'));
CREATE POLICY "sales_delete" ON sales FOR DELETE
  USING ((select current_setting('role')) IN ('service_role', 'authenticated'));

-- ---- SUPPLIERS ----
DROP POLICY IF EXISTS "suppliers_insert" ON suppliers;
DROP POLICY IF EXISTS "suppliers_update" ON suppliers;
DROP POLICY IF EXISTS "suppliers_delete" ON suppliers;

CREATE POLICY "suppliers_insert" ON suppliers FOR INSERT
  WITH CHECK ((select current_setting('role')) IN ('service_role', 'authenticated'));
CREATE POLICY "suppliers_update" ON suppliers FOR UPDATE
  USING ((select current_setting('role')) IN ('service_role', 'authenticated'))
  WITH CHECK ((select current_setting('role')) IN ('service_role', 'authenticated'));
CREATE POLICY "suppliers_delete" ON suppliers FOR DELETE
  USING ((select current_setting('role')) IN ('service_role', 'authenticated'));

-- ---- USERS ----
DROP POLICY IF EXISTS "users_insert" ON users;
DROP POLICY IF EXISTS "users_update" ON users;
DROP POLICY IF EXISTS "users_delete" ON users;

CREATE POLICY "users_insert" ON users FOR INSERT
  WITH CHECK ((select current_setting('role')) IN ('service_role', 'authenticated'));
CREATE POLICY "users_update" ON users FOR UPDATE
  USING ((select current_setting('role')) IN ('service_role', 'authenticated'))
  WITH CHECK ((select current_setting('role')) IN ('service_role', 'authenticated'));
CREATE POLICY "users_delete" ON users FOR DELETE
  USING ((select current_setting('role')) IN ('service_role', 'authenticated'));

-- ---- DAILYSTOCKREPORTS ----
DROP POLICY IF EXISTS "dsr_insert" ON dailystockreports;
DROP POLICY IF EXISTS "dsr_update" ON dailystockreports;
DROP POLICY IF EXISTS "dsr_delete" ON dailystockreports;

CREATE POLICY "dsr_insert" ON dailystockreports FOR INSERT
  WITH CHECK ((select current_setting('role')) IN ('service_role', 'authenticated'));
CREATE POLICY "dsr_update" ON dailystockreports FOR UPDATE
  USING ((select current_setting('role')) IN ('service_role', 'authenticated'))
  WITH CHECK ((select current_setting('role')) IN ('service_role', 'authenticated'));
CREATE POLICY "dsr_delete" ON dailystockreports FOR DELETE
  USING ((select current_setting('role')) IN ('service_role', 'authenticated'));


-- ==============================================
-- STEP 2: DROP UNUSED INDEXES
-- These indexes have never been used and waste storage/write overhead.
-- ==============================================

DROP INDEX IF EXISTS idx_si_product;
DROP INDEX IF EXISTS idx_forecast_product;
DROP INDEX IF EXISTS idx_dsr_product;
DROP INDEX IF EXISTS idx_dsr_product_date;
DROP INDEX IF EXISTS idx_annual_orders_product;
DROP INDEX IF EXISTS idx_psa_product;
DROP INDEX IF EXISTS idx_psa_supplier;
DROP INDEX IF EXISTS idx_users_username;
DROP INDEX IF EXISTS idx_products_supplier;
DROP INDEX IF EXISTS idx_products_sku;
DROP INDEX IF EXISTS idx_sales_customer;
DROP INDEX IF EXISTS idx_sales_status;
DROP INDEX IF EXISTS idx_poi_product;
DROP INDEX IF EXISTS idx_po_supplier;
DROP INDEX IF EXISTS idx_po_status;


-- ==============================================
-- STEP 3: RENAME SALE NUMBERS from SALE-YEAR-XXXX to INV-H20-XXXX
-- H20 = brand prefix for BEV Flow invoices
-- ==============================================

-- Update all existing sale_number values
UPDATE sales
SET sale_number = REPLACE(
  REPLACE(sale_number, 'SALE-2025-', 'INV-H20-'),
  'SALE-2026-', 'INV-H20-'
)
WHERE sale_number LIKE 'SALE-%';

-- Also handle any other year patterns
UPDATE sales
SET sale_number = 'INV-H20-' || LPAD(
  SUBSTRING(sale_number FROM '[0-9]+$'), 4, '0'
)
WHERE sale_number LIKE 'SALE-%';


-- ==============================================
-- VERIFY
-- ==============================================
SELECT 'Fix complete!' AS status;
SELECT sale_number FROM sales ORDER BY sale_id LIMIT 5;


-- ==============================================
-- STEP 4: REVOKE write access from anon role
-- The anon key should only be able to read public data.
-- All writes require authenticated (service_role key).
-- ==============================================

REVOKE INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public FROM anon;
REVOKE USAGE ON ALL SEQUENCES IN SCHEMA public FROM anon;

-- Keep SELECT for anon (public reads are fine for this app)
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
