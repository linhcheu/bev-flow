-- ==============================================
-- BEV Flow - SQLite Database Schema
-- Compatible with better-sqlite3
-- Based on Excel IMS structure
-- ==============================================

-- Enable foreign key support for SQLite
PRAGMA foreign_keys = ON;

-- ==============================================
-- 1. USERS TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS Users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'user' CHECK(role IN ('admin', 'manager', 'user')),
    phone VARCHAR(30),
    location VARCHAR(100),
    profile_image TEXT,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================
-- 2. SUPPLIERS TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS Suppliers (
    supplier_id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100),
    sale_agent VARCHAR(100),
    phone VARCHAR(30),
    email VARCHAR(100),
    address TEXT,
    lead_time_days INTEGER DEFAULT 7,
    payment_method VARCHAR(50) DEFAULT 'Collect' CHECK(payment_method IN ('Prepaid', 'Collect', 'Credit', 'COD')),
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================
-- 3. PRODUCTS TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS Products (
    product_id INTEGER PRIMARY KEY AUTOINCREMENT,
    sku VARCHAR(50) UNIQUE,
    product_name VARCHAR(100) NOT NULL,
    description TEXT,
    image_url TEXT,
    cost_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    selling_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    supplier_id INTEGER,
    safety_stock INTEGER DEFAULT 0,
    reorder_quantity INTEGER DEFAULT 0,
    min_stock_level INTEGER DEFAULT 0,
    current_stock INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES Suppliers(supplier_id) ON DELETE SET NULL
);

-- ==============================================
-- 4. CUSTOMERS TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS Customers (
    customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100),
    phone VARCHAR(30),
    email VARCHAR(100),
    address TEXT,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================
-- 5. PURCHASE ORDERS TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS PurchaseOrders (
    po_id INTEGER PRIMARY KEY AUTOINCREMENT,
    po_number VARCHAR(50) UNIQUE NOT NULL,
    supplier_id INTEGER NOT NULL,
    order_date DATE NOT NULL,
    eta_date DATE,
    subtotal DECIMAL(10, 2) DEFAULT 0,
    shipping_rate DECIMAL(5, 2) DEFAULT 3.00,
    shipping_cost DECIMAL(10, 2) DEFAULT 0,
    promotion_percent DECIMAL(5, 2) DEFAULT 0,
    promotion_amount DECIMAL(10, 2) DEFAULT 0,
    promotion_text TEXT,
    total_amount DECIMAL(10, 2) DEFAULT 0,
    status VARCHAR(30) DEFAULT 'Pending' CHECK(status IN ('Pending', 'Ordered', 'Shipped', 'Co-loader Shipped', 'Received', 'Cancelled')),
    payment_method VARCHAR(50) DEFAULT 'Collect' CHECK(payment_method IN ('Prepaid', 'Collect', 'Credit', 'COD')),
    payment_status VARCHAR(30) DEFAULT 'Unpaid' CHECK(payment_status IN ('Unpaid', 'Partial', 'Paid')),
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
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES Suppliers(supplier_id) ON DELETE RESTRICT
);

-- ==============================================
-- 6. PURCHASE ORDER ITEMS TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS PurchaseOrderItems (
    item_id INTEGER PRIMARY KEY AUTOINCREMENT,
    po_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL CHECK(quantity > 0),
    unit_cost DECIMAL(10, 2) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (po_id) REFERENCES PurchaseOrders(po_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE RESTRICT
);

-- ==============================================
-- 7. SALES TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS Sales (
    sale_id INTEGER PRIMARY KEY AUTOINCREMENT,
    sale_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id INTEGER,
    sale_date DATE NOT NULL,
    subtotal DECIMAL(10, 2) DEFAULT 0,
    discount_percent DECIMAL(5, 2) DEFAULT 0,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) DEFAULT 0,
    payment_method VARCHAR(30) DEFAULT 'Cash',
    status VARCHAR(20) DEFAULT 'Completed' CHECK(status IN ('Pending', 'Completed', 'Cancelled', 'Refunded')),
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id) ON DELETE SET NULL
);

-- ==============================================
-- 8. SALE ITEMS TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS SaleItems (
    item_id INTEGER PRIMARY KEY AUTOINCREMENT,
    sale_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL CHECK(quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sale_id) REFERENCES Sales(sale_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE RESTRICT
);

-- ==============================================
-- 9. FORECASTS TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS Forecasts (
    forecast_id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    forecast_date DATE NOT NULL,
    predicted_demand INTEGER NOT NULL DEFAULT 0,
    confidence_score DECIMAL(3, 2) DEFAULT 0.80,
    recommended_order INTEGER DEFAULT 0,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE CASCADE,
    UNIQUE(product_id, forecast_date)
);

-- ==============================================
-- 10. PRODUCT-SUPPLIER AVAILABILITY TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS ProductSupplierAvailability (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    supplier_id INTEGER NOT NULL,
    is_available INTEGER DEFAULT 1,
    supplier_price DECIMAL(10, 2),
    lead_time_days INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE CASCADE,
    FOREIGN KEY (supplier_id) REFERENCES Suppliers(supplier_id) ON DELETE CASCADE,
    UNIQUE(product_id, supplier_id)
);

-- ==============================================
-- 11. DAILY STOCK REPORTS TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS DailyStockReports (
    report_id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    report_date DATE NOT NULL,
    opening_stock INTEGER DEFAULT 0,
    purchased_qty INTEGER DEFAULT 0,
    sold_qty INTEGER DEFAULT 0,
    closing_stock INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE CASCADE,
    UNIQUE(product_id, report_date)
);

-- ==============================================
-- INDEXES
-- ==============================================
CREATE INDEX IF NOT EXISTS idx_users_email ON Users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON Users(username);
CREATE INDEX IF NOT EXISTS idx_products_supplier ON Products(supplier_id);
CREATE INDEX IF NOT EXISTS idx_products_sku ON Products(sku);
CREATE INDEX IF NOT EXISTS idx_po_supplier ON PurchaseOrders(supplier_id);
CREATE INDEX IF NOT EXISTS idx_po_status ON PurchaseOrders(status);
CREATE INDEX IF NOT EXISTS idx_po_date ON PurchaseOrders(order_date);
CREATE INDEX IF NOT EXISTS idx_poi_po ON PurchaseOrderItems(po_id);
CREATE INDEX IF NOT EXISTS idx_poi_product ON PurchaseOrderItems(product_id);
CREATE INDEX IF NOT EXISTS idx_sales_customer ON Sales(customer_id);
CREATE INDEX IF NOT EXISTS idx_sales_date ON Sales(sale_date);
CREATE INDEX IF NOT EXISTS idx_sales_status ON Sales(status);
CREATE INDEX IF NOT EXISTS idx_si_sale ON SaleItems(sale_id);
CREATE INDEX IF NOT EXISTS idx_si_product ON SaleItems(product_id);
CREATE INDEX IF NOT EXISTS idx_forecasts_product ON Forecasts(product_id);
CREATE INDEX IF NOT EXISTS idx_psa_product ON ProductSupplierAvailability(product_id);
CREATE INDEX IF NOT EXISTS idx_psa_supplier ON ProductSupplierAvailability(supplier_id);
CREATE INDEX IF NOT EXISTS idx_dsr_product ON DailyStockReports(product_id);
CREATE INDEX IF NOT EXISTS idx_dsr_date ON DailyStockReports(report_date);
CREATE INDEX IF NOT EXISTS idx_dsr_product_date ON DailyStockReports(product_id, report_date);

-- ==============================================
-- USER SETTINGS TABLE (minimal - for account management)
-- ==============================================
CREATE TABLE IF NOT EXISTS UserSettings (
    setting_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON UserSettings(user_id);
