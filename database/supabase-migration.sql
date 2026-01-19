-- ==============================================
-- BEV Flow - Complete Supabase Migration
-- Run this ONCE in Supabase SQL Editor
-- This adds all new fields and fixes RLS security issues
-- ==============================================

-- ==============================================
-- STEP 1: ADD MISSING COLUMNS TO SUPPLIERS
-- ==============================================
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'suppliers' AND column_name = 'payment_method') THEN
        ALTER TABLE suppliers ADD COLUMN payment_method VARCHAR(50) DEFAULT 'Collect';
    END IF;
END $$;

-- ==============================================
-- STEP 2: ADD MISSING COLUMNS TO PRODUCTS
-- ==============================================
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'image_url') THEN
        ALTER TABLE products ADD COLUMN image_url TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'safety_stock') THEN
        ALTER TABLE products ADD COLUMN safety_stock INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'reorder_quantity') THEN
        ALTER TABLE products ADD COLUMN reorder_quantity INTEGER DEFAULT 0;
    END IF;
END $$;

-- ==============================================
-- STEP 3: ADD MISSING COLUMNS TO PURCHASE ORDERS
-- ==============================================
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'purchaseorders' AND column_name = 'payment_method') THEN
        ALTER TABLE purchaseorders ADD COLUMN payment_method VARCHAR(50) DEFAULT 'Collect';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'purchaseorders' AND column_name = 'payment_status') THEN
        ALTER TABLE purchaseorders ADD COLUMN payment_status VARCHAR(30) DEFAULT 'Unpaid';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'purchaseorders' AND column_name = 'payment_date') THEN
        ALTER TABLE purchaseorders ADD COLUMN payment_date DATE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'purchaseorders' AND column_name = 'payment_attachment') THEN
        ALTER TABLE purchaseorders ADD COLUMN payment_attachment TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'purchaseorders' AND column_name = 'authorized_by') THEN
        ALTER TABLE purchaseorders ADD COLUMN authorized_by VARCHAR(100);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'purchaseorders' AND column_name = 'authorized_signature') THEN
        ALTER TABLE purchaseorders ADD COLUMN authorized_signature TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'purchaseorders' AND column_name = 'authorization_date') THEN
        ALTER TABLE purchaseorders ADD COLUMN authorization_date DATE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'purchaseorders' AND column_name = 'promotion_percent') THEN
        ALTER TABLE purchaseorders ADD COLUMN promotion_percent DECIMAL(5, 2) DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'purchaseorders' AND column_name = 'promotion_text') THEN
        ALTER TABLE purchaseorders ADD COLUMN promotion_text TEXT;
    END IF;
END $$;

-- ==============================================
-- STEP 4: UPDATE STATUS CONSTRAINT FOR CO-LOADER SHIPPED
-- ==============================================
ALTER TABLE purchaseorders DROP CONSTRAINT IF EXISTS purchaseorders_status_check;
ALTER TABLE purchaseorders ADD CONSTRAINT purchaseorders_status_check 
    CHECK (status IN ('Pending', 'Ordered', 'Shipped', 'Co-loader Shipped', 'Received', 'Cancelled'));

-- ==============================================
-- STEP 5: CREATE PRODUCT SUPPLIER AVAILABILITY TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS product_supplier_availability (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    supplier_id INTEGER NOT NULL REFERENCES suppliers(supplier_id) ON DELETE CASCADE,
    is_available BOOLEAN DEFAULT true,
    supplier_sku VARCHAR(50),
    supplier_price DECIMAL(10, 2),
    lead_time_days INTEGER,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, supplier_id)
);

CREATE INDEX IF NOT EXISTS idx_psa_product ON product_supplier_availability(product_id);
CREATE INDEX IF NOT EXISTS idx_psa_supplier ON product_supplier_availability(supplier_id);

-- ==============================================
-- STEP 6: DROP VIEWS WITH SECURITY DEFINER
-- ==============================================
DROP VIEW IF EXISTS supplier_po_summary CASCADE;

-- ==============================================
-- STEP 7: ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- ==============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchaseorders ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchaseorderitems ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE saleitems ENABLE ROW LEVEL SECURITY;
ALTER TABLE forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_supplier_availability ENABLE ROW LEVEL SECURITY;

-- ==============================================
-- STEP 8: DROP ALL EXISTING POLICIES
-- ==============================================
DROP POLICY IF EXISTS "Allow all access to users" ON users;
DROP POLICY IF EXISTS "Allow all access to suppliers" ON suppliers;
DROP POLICY IF EXISTS "Allow all access to products" ON products;
DROP POLICY IF EXISTS "Allow all access to customers" ON customers;
DROP POLICY IF EXISTS "Allow all access to purchaseorders" ON purchaseorders;
DROP POLICY IF EXISTS "Allow all access to purchaseorderitems" ON purchaseorderitems;
DROP POLICY IF EXISTS "Allow all access to sales" ON sales;
DROP POLICY IF EXISTS "Allow all access to saleitems" ON saleitems;
DROP POLICY IF EXISTS "Allow all access to forecasts" ON forecasts;
DROP POLICY IF EXISTS "Allow all access to product_supplier_availability" ON product_supplier_availability;

-- ==============================================
-- STEP 9: CREATE NEW RLS POLICIES (Allow all access for API)
-- ==============================================
CREATE POLICY "Allow all access to users" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to suppliers" ON suppliers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to products" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to customers" ON customers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to purchaseorders" ON purchaseorders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to purchaseorderitems" ON purchaseorderitems FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to sales" ON sales FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to saleitems" ON saleitems FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to forecasts" ON forecasts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to product_supplier_availability" ON product_supplier_availability FOR ALL USING (true) WITH CHECK (true);

-- ==============================================
-- STEP 10: RECREATE VIEW WITHOUT SECURITY DEFINER
-- ==============================================
CREATE OR REPLACE VIEW supplier_po_summary AS
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
-- STEP 11: GRANT PERMISSIONS
-- ==============================================
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

-- ==============================================
-- STEP 12: CREATE TRIGGER FOR product_supplier_availability
-- ==============================================
DROP TRIGGER IF EXISTS update_psa_updated_at ON product_supplier_availability;
CREATE TRIGGER update_psa_updated_at
    BEFORE UPDATE ON product_supplier_availability
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ==============================================
-- DONE!
-- ==============================================
SELECT 'Migration completed successfully!' as result;
