-- ==============================================
-- BEV Flow - Supabase Schema (Updated v2)
-- Clean schema with proper constraints
-- ==============================================

-- Drop existing tables (in reverse dependency order)
DROP TABLE IF EXISTS saleitems CASCADE;
DROP TABLE IF EXISTS sales CASCADE;
DROP TABLE IF EXISTS purchaseorderitems CASCADE;
DROP TABLE IF EXISTS purchaseorders CASCADE;
DROP TABLE IF EXISTS forecasts CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS suppliers CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ==============================================
-- USERS TABLE
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
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for login queries
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

-- ==============================================
-- SUPPLIERS TABLE
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
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================
-- PRODUCTS TABLE
-- ==============================================
CREATE TABLE products (
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for product queries
CREATE INDEX idx_products_supplier ON products(supplier_id);
CREATE INDEX idx_products_sku ON products(sku);

-- ==============================================
-- CUSTOMERS TABLE
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

-- ==============================================
-- PURCHASE ORDERS TABLE
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
    status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Ordered', 'Shipped', 'Received', 'Cancelled')),
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

-- Index for PO queries
CREATE INDEX idx_po_supplier ON purchaseorders(supplier_id);
CREATE INDEX idx_po_status ON purchaseorders(status);
CREATE INDEX idx_po_date ON purchaseorders(order_date DESC);

-- ==============================================
-- PURCHASE ORDER ITEMS TABLE
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

-- Index for PO items
CREATE INDEX idx_poi_po ON purchaseorderitems(po_id);
CREATE INDEX idx_poi_product ON purchaseorderitems(product_id);

-- ==============================================
-- SALES TABLE
-- ==============================================
CREATE TABLE sales (
    sale_id SERIAL PRIMARY KEY,
    sale_number VARCHAR(50) UNIQUE NOT NULL,
    sale_date DATE NOT NULL,
    customer_id INTEGER REFERENCES customers(customer_id) ON DELETE SET NULL,
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

-- Index for sales queries
CREATE INDEX idx_sales_customer ON sales(customer_id);
CREATE INDEX idx_sales_date ON sales(sale_date DESC);
CREATE INDEX idx_sales_status ON sales(status);

-- ==============================================
-- SALE ITEMS TABLE
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

-- Index for sale items
CREATE INDEX idx_si_sale ON saleitems(sale_id);
CREATE INDEX idx_si_product ON saleitems(product_id);

-- ==============================================
-- FORECASTS TABLE
-- ==============================================
CREATE TABLE forecasts (
    forecast_id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    forecast_date DATE NOT NULL,
    predicted_demand INTEGER DEFAULT 0,
    confidence_score DECIMAL(3, 2) DEFAULT 0.5 CHECK (confidence_score BETWEEN 0 AND 1),
    recommended_order INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for forecasts
CREATE INDEX idx_forecast_product ON forecasts(product_id);
CREATE INDEX idx_forecast_date ON forecasts(forecast_date DESC);

-- ==============================================
-- UPDATED_AT TRIGGER FUNCTION
-- ==============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables with updated_at column
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_suppliers_updated_at
    BEFORE UPDATE ON suppliers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at
    BEFORE UPDATE ON customers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_po_updated_at
    BEFORE UPDATE ON purchaseorders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sales_updated_at
    BEFORE UPDATE ON sales
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ==============================================
-- ENABLE ROW LEVEL SECURITY (optional)
-- ==============================================
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE products ENABLE ROW LEVEL SECURITY;
-- etc.

-- ==============================================
-- GRANTS (for Supabase service role)
-- ==============================================
-- GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
-- GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
