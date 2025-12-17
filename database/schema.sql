-- BEV Flow Database Schema
-- Run this SQL script to create the database structure

-- 1. SUPPLIERS TABLE
-- Stores supplier details to avoid repetition in the product table.
CREATE TABLE Suppliers (
    supplier_id INT PRIMARY KEY AUTO_INCREMENT,
    company_name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    lead_time_days INT DEFAULT 7 -- Average time they take to deliver
);

-- 2. PRODUCTS TABLE
-- Based on your "Product Table" and Image 1.
CREATE TABLE Products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    sku VARCHAR(50) UNIQUE, -- The "A005", "A002" codes from Image 1
    product_name VARCHAR(100) NOT NULL,
    description TEXT,
    cost_price DECIMAL(10, 2) NOT NULL,
    selling_price DECIMAL(10, 2) NOT NULL,
    supplier_id INT,
    
    -- "Profit" is calculated on the fly, but we can store a cached value if needed.
    -- In a query, you would use: (selling_price - cost_price) as profit
    
    FOREIGN KEY (supplier_id) REFERENCES Suppliers(supplier_id)
);

-- 3. PURCHASE ORDERS (PO) - Head
-- Represents the "PO Board".
CREATE TABLE PurchaseOrders (
    po_id INT PRIMARY KEY AUTO_INCREMENT,
    po_number VARCHAR(50) UNIQUE, -- Your custom PO Number
    supplier_id INT,
    order_date DATE NOT NULL,
    eta_date DATE, -- Estimated Time of Arrival
    status ENUM('Pending', 'Shipped', 'Received', 'Cancelled') DEFAULT 'Pending',
    truck_remark VARCHAR(255),
    overall_remark TEXT,
    promotion_amount DECIMAL(10, 2) DEFAULT 0.00,
    
    FOREIGN KEY (supplier_id) REFERENCES Suppliers(supplier_id)
);

-- 4. PURCHASE ORDER ITEMS - Detail
-- Lists specific items inside a PO (Quantity, Cost).
CREATE TABLE PurchaseOrderItems (
    po_item_id INT PRIMARY KEY AUTO_INCREMENT,
    po_id INT,
    product_id INT,
    quantity INT NOT NULL,
    unit_cost DECIMAL(10, 2), -- Cost might change over time, so we record it here
    
    FOREIGN KEY (po_id) REFERENCES PurchaseOrders(po_id),
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
);

-- 5. SALES TRANSACTIONS (Stock Out)
-- Based on Image 2 (Daily sales).
CREATE TABLE Sales (
    sale_id INT PRIMARY KEY AUTO_INCREMENT,
    sale_date DATE NOT NULL,
    product_id INT,
    quantity_sold INT NOT NULL,
    total_amount DECIMAL(10, 2), -- (Quantity * Selling Price)
    
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
);

-- 6. SALES FORECAST
-- Stores the prediction based on the "last 3 months" logic.
CREATE TABLE SalesForecasts (
    forecast_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT,
    forecast_month DATE, -- e.g., 2025-11-01
    predicted_quantity INT,
    based_on_months VARCHAR(100), -- e.g., "Aug, Sep, Oct"
    
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
);

-- Sample data for testing
INSERT INTO Suppliers (company_name, contact_person, phone, email, address, lead_time_days) VALUES
('ABC Suppliers Inc.', 'John Doe', '555-0100', 'john@abcsuppliers.com', '123 Main St, City, State', 7),
('XYZ Wholesale', 'Jane Smith', '555-0200', 'jane@xyzwholesale.com', '456 Oak Ave, City, State', 5);

INSERT INTO Products (sku, product_name, description, cost_price, selling_price, supplier_id) VALUES
('A005', 'Sample Product 1', 'Product description here', 10.00, 15.00, 1),
('A002', 'Sample Product 2', 'Another product', 20.00, 30.00, 2);
