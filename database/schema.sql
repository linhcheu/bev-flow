-- BEV Flow Database Schema
-- Compatible with SQLite (better-sqlite3)
-- Run this SQL script to create the database structure

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

-- 2. SUPPLIERS TABLE
CREATE TABLE IF NOT EXISTS Suppliers (
    supplier_id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    lead_time_days INTEGER DEFAULT 7,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. PRODUCTS TABLE
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

-- 4. PURCHASE ORDERS TABLE
CREATE TABLE IF NOT EXISTS PurchaseOrders (
    po_id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    supplier_id INTEGER NOT NULL,
    order_date DATE NOT NULL,
    expected_delivery DATE,
    quantity INTEGER NOT NULL CHECK(quantity > 0),
    unit_cost DECIMAL(10, 2) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK(status IN ('pending', 'ordered', 'shipped', 'received', 'cancelled')),
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES Suppliers(supplier_id) ON DELETE SET NULL,
    FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE RESTRICT
);

-- 5. SALES TABLE
CREATE TABLE IF NOT EXISTS Sales (
    sale_id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    sale_date DATE NOT NULL,
    quantity INTEGER NOT NULL CHECK(quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE RESTRICT
);

-- 6. FORECASTS TABLE
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

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_supplier ON Products(supplier_id);
CREATE INDEX IF NOT EXISTS idx_products_sku ON Products(sku);
CREATE INDEX IF NOT EXISTS idx_po_supplier ON PurchaseOrders(supplier_id);
CREATE INDEX IF NOT EXISTS idx_po_status ON PurchaseOrders(status);
CREATE INDEX IF NOT EXISTS idx_sales_date ON Sales(sale_date);
CREATE INDEX IF NOT EXISTS idx_sales_product ON Sales(product_id);
CREATE INDEX IF NOT EXISTS idx_forecasts_product ON Forecasts(product_id);

-- Sample data for testing
-- Admin user (password: admin123)
INSERT INTO Users (username, email, password_hash, full_name, role) VALUES
('admin', 'admin@bevflow.com', 'admin123', 'System Admin', 'admin');

-- Demo user
INSERT INTO Users (username, email, password_hash, full_name, role) VALUES
('demo', 'demo@bevflow.com', 'demo123', 'Demo User', 'user');

-- Sample suppliers
INSERT INTO Suppliers (company_name, contact_person, phone, email, address, lead_time_days) VALUES
('ABC Suppliers Inc.', 'John Doe', '555-0100', 'john@abcsuppliers.com', '123 Main St, City, State', 7),
('XYZ Wholesale', 'Jane Smith', '555-0200', 'jane@xyzwholesale.com', '456 Oak Ave, City, State', 5),
('Premium Beverages Co.', 'Mike Johnson', '555-0300', 'mike@premiumbev.com', '789 Elm St, City, State', 3);

-- Sample products
INSERT INTO Products (sku, product_name, description, cost_price, selling_price, supplier_id, min_stock_level, current_stock) VALUES
('BEV001', 'Premium Cola 500ml', 'Premium quality cola beverage', 1.50, 2.50, 1, 100, 250),
('BEV002', 'Sparkling Water 1L', 'Natural sparkling mineral water', 0.80, 1.50, 2, 150, 320),
('BEV003', 'Orange Juice 500ml', 'Fresh squeezed orange juice', 2.00, 3.50, 1, 80, 180),
('BEV004', 'Energy Drink 250ml', 'High caffeine energy drink', 1.20, 2.80, 3, 200, 450),
('BEV005', 'Green Tea 330ml', 'Organic green tea beverage', 1.00, 2.20, 2, 120, 275);
