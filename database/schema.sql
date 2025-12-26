-- BEV Flow Database Schema
-- Compatible with SQLite (better-sqlite3)
-- Based on Excel IMS structure

-- Enable foreign key support for SQLite
PRAGMA foreign_keys = ON;

-- 1. USERS TABLE (for authentication)
CREATE TABLE IF NOT EXISTS Users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'user' CHECK(role IN ('admin', 'manager', 'user')),
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. SUPPLIERS TABLE (based on Supplier sheet)
CREATE TABLE IF NOT EXISTS Suppliers (
    supplier_id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100),
    sale_agent VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    lead_time_days INTEGER DEFAULT 7,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. PRODUCTS TABLE (based on Supplier sheet products)
CREATE TABLE IF NOT EXISTS Products (
    product_id INTEGER PRIMARY KEY AUTOINCREMENT,
    sku VARCHAR(50) UNIQUE,
    product_name VARCHAR(100) NOT NULL,
    description TEXT,
    cost_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    selling_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    supplier_id INTEGER,
    min_stock_level INTEGER DEFAULT 0,
    current_stock INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES Suppliers(supplier_id) ON DELETE SET NULL
);

-- 4. CUSTOMERS TABLE (for sales - based on Sale Entry sheet)
CREATE TABLE IF NOT EXISTS Customers (
    customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. PURCHASE ORDERS TABLE (based on PO Entry sheet)
CREATE TABLE IF NOT EXISTS PurchaseOrders (
    po_id INTEGER PRIMARY KEY AUTOINCREMENT,
    po_number VARCHAR(50) UNIQUE NOT NULL,
    supplier_id INTEGER NOT NULL,
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
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES Suppliers(supplier_id) ON DELETE RESTRICT
);

-- 6. PURCHASE ORDER ITEMS TABLE (based on PO Entry products)
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

-- 7. SALES TABLE (based on Sale Entry sheet)
CREATE TABLE IF NOT EXISTS Sales (
    sale_id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id INTEGER,
    customer_name VARCHAR(100),
    sale_date DATE NOT NULL,
    product_id INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    quantity INTEGER NOT NULL CHECK(quantity > 0),
    total_amount DECIMAL(10, 2) NOT NULL,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id) ON DELETE SET NULL,
    FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE RESTRICT
);

-- 8. PURCHASE DATA TABLE (based on Purchase Data sheet)
CREATE TABLE IF NOT EXISTS PurchaseData (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_number VARCHAR(50),
    supplier_id INTEGER,
    purchase_date DATE NOT NULL,
    product_id INTEGER NOT NULL,
    rate DECIMAL(10, 2) NOT NULL,
    quantity INTEGER NOT NULL,
    cost_amount DECIMAL(10, 2) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES Suppliers(supplier_id) ON DELETE SET NULL,
    FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE RESTRICT
);

-- 9. ANNUAL ORDERS TABLE (based on Annual Order sheet)
CREATE TABLE IF NOT EXISTS AnnualOrders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
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
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE CASCADE,
    UNIQUE(product_id, year)
);

-- 10. SALE FORECASTS TABLE (based on Sale Forecast sheet)
CREATE TABLE IF NOT EXISTS SaleForecasts (
    forecast_id INTEGER PRIMARY KEY AUTOINCREMENT,
    forecast_date DATE NOT NULL,
    product_1_qty INTEGER DEFAULT 0,
    product_2_qty INTEGER DEFAULT 0,
    product_3_qty INTEGER DEFAULT 0,
    product_4_qty INTEGER DEFAULT 0,
    product_5_qty INTEGER DEFAULT 0,
    product_6_qty INTEGER DEFAULT 0,
    product_7_qty INTEGER DEFAULT 0,
    product_8_qty INTEGER DEFAULT 0,
    product_9_qty INTEGER DEFAULT 0,
    product_10_qty INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(forecast_date)
);

-- 11. FORECASTS TABLE (product-level forecasts)
CREATE TABLE IF NOT EXISTS Forecasts (
    forecast_id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    forecast_date DATE NOT NULL,
    predicted_quantity INTEGER NOT NULL,
    confidence_level DECIMAL(5, 2) DEFAULT 0.80,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE CASCADE,
    UNIQUE(product_id, forecast_date)
);

-- 12. STOCK TABLE (based on Stock sheet)
CREATE TABLE IF NOT EXISTS Stock (
    stock_id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    opening_stock INTEGER DEFAULT 0,
    purchased_qty INTEGER DEFAULT 0,
    sold_qty INTEGER DEFAULT 0,
    closing_stock INTEGER DEFAULT 0,
    stock_date DATE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_supplier ON Products(supplier_id);
CREATE INDEX IF NOT EXISTS idx_products_sku ON Products(sku);
CREATE INDEX IF NOT EXISTS idx_po_supplier ON PurchaseOrders(supplier_id);
CREATE INDEX IF NOT EXISTS idx_po_status ON PurchaseOrders(status);
CREATE INDEX IF NOT EXISTS idx_po_number ON PurchaseOrders(po_number);
CREATE INDEX IF NOT EXISTS idx_po_items_po ON PurchaseOrderItems(po_id);
CREATE INDEX IF NOT EXISTS idx_sales_date ON Sales(sale_date);
CREATE INDEX IF NOT EXISTS idx_sales_product ON Sales(product_id);
CREATE INDEX IF NOT EXISTS idx_sales_invoice ON Sales(invoice_number);
CREATE INDEX IF NOT EXISTS idx_forecasts_product ON Forecasts(product_id);
CREATE INDEX IF NOT EXISTS idx_annual_orders_product ON AnnualOrders(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_product ON Stock(product_id);

-- =====================================================
-- SAMPLE DATA (based on Excel screenshots)
-- =====================================================

-- Admin user (password: admin123)
INSERT INTO Users (username, email, password_hash, full_name, role) VALUES
('admin', 'admin@bevflow.com', 'admin123', 'System Admin', 'admin');

-- Demo user
INSERT INTO Users (username, email, password_hash, full_name, role) VALUES
('demo', 'demo@bevflow.com', 'demo123', 'Demo User', 'user');

-- Suppliers (from Excel Supplier sheet)
INSERT INTO Suppliers (company_name, contact_person, sale_agent, phone, email, address, lead_time_days) VALUES
('Depo Bou Yong', 'Sopheak', 'Sopheak', '011 946 889', 'bouyongdepo@gmail.com', 'Mao Tse Toung, Phnom Penh', 1),
('Depo Mean Mean', 'Rotha', 'Rotha', '078 467 369', 'meanmeandepo9@gmail.com', 'Takhmao, Kandal', 1),
('Depo AMK', 'Socheat', 'Socheat', '012 967 039', 'depo-amk@gmail.com', 'Takdol, Kandal', 1),
('Jae Ka Beer Depo', 'Nimol', 'Nimol', '096 057 417', 'kakabeer88@gmail.com', 'Daun Penh, Phnom Penh', 2),
('Mesa Saang Beer Depo', 'Bopha', 'Bopha', '090 245 966', 'saang-mesabeer@gmail.com', 'Saang, Kandal', 3);

-- Products (from Excel Supplier sheet)
INSERT INTO Products (sku, product_name, description, cost_price, selling_price, supplier_id, min_stock_level, current_stock) VALUES
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

-- Customers (from Sale Entry sheet)
INSERT INTO Customers (customer_name, contact_person, phone, email, address) VALUES
('Depo Bou Yong', 'Sopheak', '011 946 889', 'bouyongdepo@gmail.com', 'Mao Tse Toung, Phnom Penh'),
('Depo Mean Mean', 'Rotha', '078 467 369', 'meanmeandepo9@gmail.com', 'Takhmao, Kandal'),
('Depo AMK', 'Socheat', '012 967 039', 'depo-amk@gmail.com', 'Takdol, Kandal');

-- Sample Purchase Order (from PO Entry sheet)
INSERT INTO PurchaseOrders (po_number, supplier_id, order_date, eta_date, subtotal, shipping_rate, shipping_cost, promotion_amount, total_amount, status, truck_remark, overall_remark) VALUES
('PO-001-004', 5, '2025-12-22', '2025-12-26', 560.00, 3.00, 16.80, 50.00, 526.80, 'Pending', 'give DO', 'give latest expiry');

-- Sample Purchase Order Items
INSERT INTO PurchaseOrderItems (po_id, product_id, quantity, unit_cost, amount) VALUES
(1, 10, 20, 28.00, 560.00);

-- Sample Sales
INSERT INTO Sales (invoice_number, customer_id, customer_name, sale_date, product_id, unit_price, quantity, total_amount) VALUES
('1001', 1, 'Depo Bou Yong', '2025-12-21', 2, 15.00, 10, 150.00);

-- Annual Orders data (from Annual Order sheet)
INSERT INTO AnnualOrders (product_id, year, jan_qty, feb_qty, mar_qty, apr_qty, may_qty, jun_qty, jul_qty, aug_qty, sep_qty, oct_qty, nov_qty, dec_qty) VALUES
(2, 2025, 345, 515, 759, 759, 352, 372, 647, 362, 757, 740, 645, 694),
(5, 2025, 598, 912, 574, 457, 343, 746, 467, 462, 464, 715, 653, 800),
(3, 2025, 942, 495, 247, 237, 576, 487, 754, 356, 464, 914, 948, 895);
