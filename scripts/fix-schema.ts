import Database from 'better-sqlite3';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const dbPath = join(rootDir, '.data', 'bev-flow.db');
const db = new Database(dbPath);
db.pragma('foreign_keys = OFF');

console.log('Recreating tables with correct schema...');

// Drop dependent tables first
db.exec('DROP TABLE IF EXISTS PurchaseOrderItems');
db.exec('DROP TABLE IF EXISTS PurchaseData');
db.exec('DROP TABLE IF EXISTS Sales');
db.exec('DROP TABLE IF EXISTS PurchaseOrders');
db.exec('DROP TABLE IF EXISTS Suppliers');
db.exec('DROP TABLE IF EXISTS Customers');

// Recreate Suppliers with all columns
db.exec(`
CREATE TABLE Suppliers (
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
)
`);
console.log('✅ Suppliers table recreated');

// Recreate Customers
db.exec(`
CREATE TABLE Customers (
    customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`);
console.log('✅ Customers table recreated');

// Recreate PurchaseOrders with all columns
db.exec(`
CREATE TABLE PurchaseOrders (
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
    status VARCHAR(20) DEFAULT 'Pending',
    truck_remark TEXT,
    overall_remark TEXT,
    third_party_agent VARCHAR(100),
    agent_phone VARCHAR(20),
    agent_email VARCHAR(100),
    agent_address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES Suppliers(supplier_id) ON DELETE RESTRICT
)
`);
console.log('✅ PurchaseOrders table recreated');

// Recreate PurchaseOrderItems
db.exec(`
CREATE TABLE PurchaseOrderItems (
    item_id INTEGER PRIMARY KEY AUTOINCREMENT,
    po_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL CHECK(quantity > 0),
    unit_cost DECIMAL(10, 2) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (po_id) REFERENCES PurchaseOrders(po_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE RESTRICT
)
`);
console.log('✅ PurchaseOrderItems table recreated');

// Recreate Sales with all columns
db.exec(`
CREATE TABLE Sales (
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
)
`);
console.log('✅ Sales table recreated');

// Recreate PurchaseData
db.exec(`
CREATE TABLE PurchaseData (
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
)
`);
console.log('✅ PurchaseData table recreated');

// Add sample suppliers
db.exec(`
INSERT INTO Suppliers (company_name, contact_person, sale_agent, phone, email, address, lead_time_days) VALUES
('ABC Beverages', 'John Smith', 'Mike Johnson', '555-0101', 'john@abcbev.com', '123 Main St', 7),
('XYZ Drinks Co', 'Jane Doe', 'Sarah Wilson', '555-0102', 'jane@xyzdrinks.com', '456 Oak Ave', 5),
('Global Imports', 'Bob Brown', 'Tom Davis', '555-0103', 'bob@globalimports.com', '789 Pine Rd', 10)
`);
console.log('✅ Sample suppliers added');

// Add sample customers
db.exec(`
INSERT INTO Customers (customer_name, contact_person, phone, email, address) VALUES
('Corner Store', 'Alice Green', '555-1001', 'alice@cornerstore.com', '100 First St'),
('Super Mart', 'Charlie Blue', '555-1002', 'charlie@supermart.com', '200 Second Ave'),
('Quick Stop', 'Diana White', '555-1003', 'diana@quickstop.com', '300 Third Blvd')
`);
console.log('✅ Sample customers added');

db.pragma('foreign_keys = ON');
db.close();
console.log('🎉 Database schema fixed!');
