-- ==============================================
-- BEV Flow - Supabase PostgreSQL Schema
-- Run this in Supabase SQL Editor
-- ==============================================

-- 1. USERS TABLE (for authentication - works alongside Supabase Auth)
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'user' CHECK(role IN ('admin', 'manager', 'user')),
    is_active BOOLEAN DEFAULT true,
    phone VARCHAR(20),
    location VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SUPPLIERS TABLE
CREATE TABLE IF NOT EXISTS suppliers (
    supplier_id SERIAL PRIMARY KEY,
    company_name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100),
    sale_agent VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    lead_time_days INTEGER DEFAULT 7,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
    product_id SERIAL PRIMARY KEY,
    sku VARCHAR(50) UNIQUE,
    product_name VARCHAR(100) NOT NULL,
    description TEXT,
    cost_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    selling_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    supplier_id INTEGER REFERENCES suppliers(supplier_id) ON DELETE SET NULL,
    min_stock_level INTEGER DEFAULT 0,
    current_stock INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS customers (
    customer_id SERIAL PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PURCHASE ORDERS TABLE
CREATE TABLE IF NOT EXISTS purchaseorders (
    po_id SERIAL PRIMARY KEY,
    po_number VARCHAR(50) UNIQUE NOT NULL,
    supplier_id INTEGER NOT NULL REFERENCES suppliers(supplier_id) ON DELETE RESTRICT,
    order_date DATE NOT NULL,
    eta_date DATE,
    subtotal DECIMAL(10, 2) DEFAULT 0,
    shipping_rate DECIMAL(5, 2) DEFAULT 3.00,
    shipping_cost DECIMAL(10, 2) DEFAULT 0,
    promotion_amount DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'Pending' CHECK(status IN ('Pending', 'Ordered', 'Shipped', 'Received', 'Cancelled')),
    truck_remark TEXT,
    overall_remark TEXT,
    third_party_agent VARCHAR(100),
    agent_phone VARCHAR(20),
    agent_email VARCHAR(100),
    agent_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PURCHASE ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS purchaseorderitems (
    item_id SERIAL PRIMARY KEY,
    po_id INTEGER NOT NULL REFERENCES purchaseorders(po_id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(product_id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK(quantity > 0),
    unit_cost DECIMAL(10, 2) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. SALES TABLE (header info)
CREATE TABLE IF NOT EXISTS sales (
    sale_id SERIAL PRIMARY KEY,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id INTEGER REFERENCES customers(customer_id) ON DELETE SET NULL,
    customer_name VARCHAR(100),
    sale_date DATE NOT NULL,
    product_id INTEGER REFERENCES products(product_id) ON DELETE SET NULL,
    unit_price DECIMAL(10, 2) DEFAULT 0,
    quantity INTEGER DEFAULT 0,
    subtotal DECIMAL(10, 2) DEFAULT 0,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7b. SALE ITEMS TABLE (line items for multi-product sales)
CREATE TABLE IF NOT EXISTS saleitems (
    item_id SERIAL PRIMARY KEY,
    sale_id INTEGER NOT NULL REFERENCES sales(sale_id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(product_id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK(quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. FORECASTS TABLE
CREATE TABLE IF NOT EXISTS forecasts (
    forecast_id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    forecast_date DATE NOT NULL,
    predicted_quantity INTEGER NOT NULL,
    confidence_level DECIMAL(5, 2) DEFAULT 0.80,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(product_id, forecast_date)
);

-- 9. ANNUAL ORDERS TABLE
CREATE TABLE IF NOT EXISTS annualorders (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    year INTEGER NOT NULL,
    jan_qty INTEGER DEFAULT 0,
    feb_qty INTEGER DEFAULT 0,
    mar_qty INTEGER DEFAULT 0,
    apr_qty INTEGER DEFAULT 0,
    may_qty INTEGER DEFAULT 0,
    jun_qty INTEGER DEFAULT 0,
    jul_qty INTEGER DEFAULT 0,
    aug_qty INTEGER DEFAULT 0,
    sep_qty INTEGER DEFAULT 0,
    oct_qty INTEGER DEFAULT 0,
    nov_qty INTEGER DEFAULT 0,
    dec_qty INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(product_id, year)
);

-- ==============================================
-- INDEXES
-- ==============================================
CREATE INDEX IF NOT EXISTS idx_products_supplier ON products(supplier_id);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_po_supplier ON purchaseorders(supplier_id);
CREATE INDEX IF NOT EXISTS idx_po_status ON purchaseorders(status);
CREATE INDEX IF NOT EXISTS idx_po_number ON purchaseorders(po_number);
CREATE INDEX IF NOT EXISTS idx_po_items_po ON purchaseorderitems(po_id);
CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(sale_date);
CREATE INDEX IF NOT EXISTS idx_sales_invoice ON sales(invoice_number);
CREATE INDEX IF NOT EXISTS idx_sale_items_sale ON saleitems(sale_id);
CREATE INDEX IF NOT EXISTS idx_forecasts_product ON forecasts(product_id);
CREATE INDEX IF NOT EXISTS idx_annual_orders_product ON annualorders(product_id);

-- ==============================================
-- SAMPLE DATA
-- ==============================================

-- Admin user (password: admin123)


-- ==============================================
-- Enable Row Level Security (RLS) - Optional but recommended
-- ==============================================
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE products ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE purchaseorders ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE purchaseorderitems ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE saleitems ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE forecasts ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE annualorders ENABLE ROW LEVEL SECURITY;
