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
INSERT INTO users (username, email, password_hash, full_name, role) VALUES
('admin', 'admin@bevflow.com', '$2b$10$rICGHfL7YVZjQXDu5QVUPO4aOaYj7VBZXFGxFzKvJ5bGxkT0wJYZi', 'System Admin', 'admin');

-- Manager user (password: manager123)
INSERT INTO users (username, email, password_hash, full_name, role) VALUES
('manager', 'manager@bevflow.com', '$2b$10$rICGHfL7YVZjQXDu5QVUPO4aOaYj7VBZXFGxFzKvJ5bGxkT0wJYZi', 'Store Manager', 'manager');

-- Staff user (password: staff123)
INSERT INTO users (username, email, password_hash, full_name, role) VALUES
('staff', 'staff@bevflow.com', '$2b$10$rICGHfL7YVZjQXDu5QVUPO4aOaYj7VBZXFGxFzKvJ5bGxkT0wJYZi', 'Staff Member', 'user');

-- Suppliers
INSERT INTO suppliers (company_name, contact_person, sale_agent, phone, email, address, lead_time_days) VALUES
('Depo Bou Yong', 'Sopheak', 'Sopheak', '011 946 889', 'bouyongdepo@gmail.com', 'Mao Tse Toung, Phnom Penh', 1),
('Depo Mean Mean', 'Rotha', 'Rotha', '078 467 369', 'meanmeandepo9@gmail.com', 'Takhmao, Kandal', 1),
('Depo AMK', 'Socheat', 'Socheat', '012 967 039', 'depo-amk@gmail.com', 'Takdol, Kandal', 1),
('Jae Ka Beer Depo', 'Nimol', 'Nimol', '096 057 417', 'kakabeer88@gmail.com', 'Daun Penh, Phnom Penh', 2),
('Mesa Saang Beer Depo', 'Bopha', 'Bopha', '090 245 966', 'saang-mesabeer@gmail.com', 'Saang, Kandal', 3);

-- Products
INSERT INTO products (sku, product_name, description, cost_price, selling_price, supplier_id, min_stock_level, current_stock) VALUES
('A001', 'ABC Extra Stout', '330ml * 24c', 25.00, 30.00, 1, 50, 100),
('A002', 'Anchor Beer', '330ml * 24c', 12.00, 15.00, 2, 100, 200),
('A003', 'Anchor Smooth White Beer', '330ml * 24c', 14.00, 18.00, 2, 80, 150),
('A004', 'Anchor Beer (Bottle)', '325ml * 24B', 20.00, 25.00, 2, 60, 120),
('A005', 'Cambodia Lite Beer', '330ml * 24c', 15.00, 19.00, 3, 100, 180),
('A006', 'Tiger Lager Beer', '330ml * 24c', 18.00, 22.00, 4, 120, 200),
('A007', 'Tiger Crystal', '330ml * 24c', 22.00, 27.00, 4, 80, 150),
('A008', 'Tiger Lager Beer (Bottle)', '325ml * 24B', 24.00, 29.00, 4, 60, 100),
('A009', 'Tiger Crystal (Bottle)', '325ml * 24B', 26.00, 31.00, 4, 50, 90),
('A010', 'Heineken (Bottle)', '325ml * 24B', 28.00, 34.00, 5, 100, 180);

-- Customers
INSERT INTO customers (customer_name, contact_person, phone, email, address) VALUES
('Depo Bou Yong', 'Sopheak', '011 946 889', 'bouyongdepo@gmail.com', 'Mao Tse Toung, Phnom Penh'),
('Depo Mean Mean', 'Rotha', '078 467 369', 'meanmeandepo9@gmail.com', 'Takhmao, Kandal'),
('Depo AMK', 'Socheat', '012 967 039', 'depo-amk@gmail.com', 'Takdol, Kandal');

-- Sample Purchase Order
INSERT INTO purchaseorders (po_number, supplier_id, order_date, eta_date, subtotal, shipping_rate, shipping_cost, promotion_amount, total_amount, status, truck_remark, overall_remark) VALUES
('PO-001-004', 5, '2025-12-22', '2025-12-26', 560.00, 3.00, 16.80, 50.00, 526.80, 'Pending', 'give DO', 'give latest expiry');

-- Sample PO Items
INSERT INTO purchaseorderitems (po_id, product_id, quantity, unit_cost, amount) VALUES
(1, 10, 20, 28.00, 560.00);

-- Sample Sales
INSERT INTO sales (invoice_number, customer_id, customer_name, sale_date, product_id, unit_price, quantity, total_amount) VALUES
('1001', 1, 'Depo Bou Yong', '2025-12-21', 2, 15.00, 10, 150.00);

-- Sample Sale Items
INSERT INTO saleitems (sale_id, product_id, quantity, unit_price, amount) VALUES
(1, 2, 10, 15.00, 150.00);

-- Sample Forecasts
INSERT INTO forecasts (product_id, forecast_date, predicted_quantity, confidence_level, notes) VALUES
(2, '2026-01-15', 350, 0.85, 'Based on seasonal trends'),
(5, '2026-01-15', 280, 0.80, 'Holiday demand expected'),
(6, '2026-01-15', 420, 0.90, 'High confidence forecast');

-- Annual Orders data
INSERT INTO annualorders (product_id, year, jan_qty, feb_qty, mar_qty, apr_qty, may_qty, jun_qty, jul_qty, aug_qty, sep_qty, oct_qty, nov_qty, dec_qty) VALUES
(2, 2025, 345, 515, 759, 759, 352, 372, 647, 362, 757, 740, 645, 694),
(5, 2025, 598, 912, 574, 457, 343, 746, 467, 462, 464, 715, 653, 800),
(3, 2025, 942, 495, 247, 237, 576, 487, 754, 356, 464, 914, 948, 895);

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
