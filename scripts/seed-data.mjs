// Script to seed realistic data for BEV Flow karaoke business
// @ts-nocheck
import Database from 'better-sqlite3';
import { existsSync, mkdirSync, unlinkSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Ensure .data directory exists
const dataDir = join(rootDir, '.data');
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

const dbPath = join(dataDir, 'bev-flow.db');

// Delete existing database
if (existsSync(dbPath)) {
  unlinkSync(dbPath);
  console.log('🗑️ Deleted existing database');
}

console.log('🗄️ Creating fresh database at:', dbPath);

const db = new Database(dbPath);
db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');

// Create tables
console.log('📝 Creating tables...');

db.exec(`
-- Users Table
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

-- Suppliers Table
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

-- Products Table
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

-- Customers Table
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

-- Purchase Orders Table
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

-- Purchase Order Items Table
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

-- Sales Table
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

-- Forecasts Table
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

-- Stock Table
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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_supplier ON Products(supplier_id);
CREATE INDEX IF NOT EXISTS idx_products_sku ON Products(sku);
CREATE INDEX IF NOT EXISTS idx_po_supplier ON PurchaseOrders(supplier_id);
CREATE INDEX IF NOT EXISTS idx_po_status ON PurchaseOrders(status);
CREATE INDEX IF NOT EXISTS idx_sales_date ON Sales(sale_date);
CREATE INDEX IF NOT EXISTS idx_sales_product ON Sales(product_id);
CREATE INDEX IF NOT EXISTS idx_forecasts_product ON Forecasts(product_id);
`);

console.log('✅ Tables created');

// Seed Users
console.log('👤 Seeding users...');
db.exec(`
INSERT INTO Users (username, email, password_hash, full_name, role) VALUES
('admin', 'admin@bevflow.com', 'admin123', 'System Admin', 'admin'),
('manager', 'manager@bevflow.com', 'manager123', 'Store Manager', 'manager'),
('staff', 'staff@bevflow.com', 'staff123', 'Staff User', 'user');
`);

// Seed Suppliers
console.log('🏢 Seeding suppliers...');
db.exec(`
INSERT INTO Suppliers (company_name, contact_person, sale_agent, phone, email, address, lead_time_days) VALUES
('Cambrew Brewery', 'Mr. Sokha', 'Sokha', '012 345 678', 'sokha@cambrew.com', 'National Road 4, Phnom Penh', 2),
('Heineken Cambodia', 'Ms. Dara', 'Dara', '011 222 333', 'dara@heineken.com.kh', 'Koh Pich, Phnom Penh', 3),
('Tiger Beer Distributor', 'Mr. Visal', 'Visal', '078 456 789', 'visal@tigerbeer.kh', 'Toul Kork, Phnom Penh', 2),
('ABC Stout Depot', 'Ms. Sreymom', 'Sreymom', '096 111 222', 'sreymom@abcstout.kh', 'Chamkar Mon, Phnom Penh', 1),
('Angkor Beer Distributor', 'Mr. Piseth', 'Piseth', '015 888 999', 'piseth@angkorbeer.kh', 'Daun Penh, Phnom Penh', 2);
`);

// Seed Products with realistic stock
console.log('📦 Seeding products...');
db.exec(`
INSERT INTO Products (sku, product_name, description, cost_price, selling_price, supplier_id, min_stock_level, current_stock) VALUES
('BEV-001', 'Anchor Beer Can', '330ml x 24 cans', 12.50, 18.00, 1, 20, 85),
('BEV-002', 'Anchor Smooth White', '330ml x 24 cans', 13.00, 19.00, 1, 15, 62),
('BEV-003', 'Cambodia Lager Beer', '330ml x 24 cans', 11.00, 16.00, 1, 25, 120),
('BEV-004', 'Angkor Beer Can', '330ml x 24 cans', 10.50, 15.00, 5, 30, 145),
('BEV-005', 'Angkor Extra Stout', '330ml x 24 cans', 14.00, 20.00, 5, 15, 48),
('BEV-006', 'Tiger Lager Can', '330ml x 24 cans', 15.00, 22.00, 3, 20, 92),
('BEV-007', 'Tiger Crystal', '330ml x 24 cans', 16.50, 24.00, 3, 15, 55),
('BEV-008', 'Heineken Bottle', '330ml x 24 bottles', 22.00, 32.00, 2, 10, 38),
('BEV-009', 'Heineken Can', '330ml x 24 cans', 20.00, 29.00, 2, 12, 42),
('BEV-010', 'ABC Extra Stout', '330ml x 24 cans', 18.00, 26.00, 4, 10, 35),
('BEV-011', 'Coca Cola', '330ml x 24 cans', 8.00, 12.00, 1, 30, 180),
('BEV-012', 'Sprite', '330ml x 24 cans', 8.00, 12.00, 1, 25, 150),
('BEV-013', 'Red Bull', '250ml x 24 cans', 15.00, 24.00, 1, 20, 95),
('BEV-014', 'Singha Beer', '330ml x 24 cans', 14.50, 21.00, 3, 15, 68),
('BEV-015', 'Leo Beer', '330ml x 24 cans', 13.50, 19.50, 3, 15, 72);
`);

// Seed Customers (regular karaoke customers)
console.log('👥 Seeding customers...');
db.exec(`
INSERT INTO Customers (customer_name, phone, email, address) VALUES
('Walk-in Customer', NULL, NULL, NULL),
('VIP Room 1', '012 111 111', NULL, 'Regular VIP'),
('VIP Room 2', '012 222 222', NULL, 'Regular VIP'),
('Mr. Vichet', '078 333 444', 'vichet@gmail.com', 'Regular customer'),
('Ms. Sreyleak', '096 555 666', 'sreyleak@gmail.com', 'Birthday party regular'),
('Mr. Bunna', '011 777 888', 'bunna@gmail.com', 'Corporate events'),
('Ms. Phally', '015 999 000', 'phally@gmail.com', 'Weekend regular');
`);

// Generate 12 months of sales data (Jan 2025 - Dec 2025)
console.log('💰 Generating sales data for full year 2025...');

const insertSale = db.prepare(`
  INSERT INTO Sales (invoice_number, customer_id, customer_name, sale_date, product_id, unit_price, quantity, total_amount)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

const products = db.prepare('SELECT product_id, selling_price, product_name FROM Products').all() as any[];
const customers = db.prepare('SELECT customer_id, customer_name FROM Customers').all() as any[];

let invoiceNum = 1;

// Sales patterns: Higher on weekends, special occasions, etc.
for (let month = 0; month < 12; month++) {
  // More sales in certain months (holidays, festivals)
  const monthMultiplier = [0.8, 0.7, 0.9, 1.3, 0.85, 0.75, 0.9, 0.85, 0.9, 1.0, 1.1, 1.5][month]; // Dec highest (New Year)
  
  const daysInMonth = new Date(2025, month + 1, 0).getDate();
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(2025, month, day);
    const dayOfWeek = date.getDay();
    
    // More sales on Friday (5), Saturday (6), Sunday (0)
    let dailySales = dayOfWeek === 5 || dayOfWeek === 6 ? Math.floor(Math.random() * 15) + 10 : 
                     dayOfWeek === 0 ? Math.floor(Math.random() * 10) + 8 :
                     Math.floor(Math.random() * 8) + 3;
    
    dailySales = Math.floor(dailySales * monthMultiplier);
    
    for (let sale = 0; sale < dailySales; sale++) {
      // Random product (beer products more popular)
      const productIndex = Math.random() < 0.7 
        ? Math.floor(Math.random() * 10) // Beer products (0-9)
        : Math.floor(Math.random() * 5) + 10; // Soft drinks (10-14)
      
      const product = products[productIndex] || products[0];
      const customer = customers[Math.floor(Math.random() * customers.length)];
      
      // Quantity: 1-5 for individuals, higher for groups
      const quantity = Math.random() < 0.3 
        ? Math.floor(Math.random() * 10) + 5 // Group order
        : Math.floor(Math.random() * 4) + 1;  // Individual
      
      const totalAmount = product.selling_price * quantity;
      const dateStr = date.toISOString().split('T')[0];
      
      insertSale.run(
        `INV-${String(invoiceNum).padStart(4, '0')}`,
        customer.customer_id,
        customer.customer_name,
        dateStr,
        product.product_id,
        product.selling_price,
        quantity,
        totalAmount
      );
      
      invoiceNum++;
    }
  }
}

console.log(`✅ Generated ${invoiceNum - 1} sales records`);

// Generate Purchase Orders for restocking
console.log('📋 Generating purchase orders...');

const insertPO = db.prepare(`
  INSERT INTO PurchaseOrders (po_number, supplier_id, order_date, eta_date, subtotal, shipping_cost, promotion_amount, total_amount, status)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertPOItem = db.prepare(`
  INSERT INTO PurchaseOrderItems (po_id, product_id, quantity, unit_cost, amount)
  VALUES (?, ?, ?, ?, ?)
`);

const suppliers = db.prepare('SELECT supplier_id FROM Suppliers').all() as any[];
const productsBySupplier = db.prepare('SELECT product_id, cost_price, supplier_id FROM Products').all() as any[];

let poNum = 1;
const statuses = ['Received', 'Received', 'Received', 'Received', 'Shipped', 'Pending'];

// Generate POs throughout the year (2 per week average)
for (let month = 0; month < 12; month++) {
  const daysInMonth = new Date(2025, month + 1, 0).getDate();
  const posThisMonth = Math.floor(Math.random() * 4) + 6; // 6-10 POs per month
  
  for (let po = 0; po < posThisMonth; po++) {
    const day = Math.floor(Math.random() * daysInMonth) + 1;
    const orderDate = new Date(2025, month, day);
    const etaDate = new Date(orderDate);
    etaDate.setDate(etaDate.getDate() + Math.floor(Math.random() * 3) + 1);
    
    const supplier = suppliers[Math.floor(Math.random() * suppliers.length)];
    const supplierProducts = productsBySupplier.filter((p: any) => p.supplier_id === supplier.supplier_id);
    
    if (supplierProducts.length === 0) continue;
    
    // 1-3 items per PO
    const numItems = Math.floor(Math.random() * 3) + 1;
    let subtotal = 0;
    const items: any[] = [];
    
    for (let i = 0; i < numItems; i++) {
      const product = supplierProducts[Math.floor(Math.random() * supplierProducts.length)];
      const quantity = (Math.floor(Math.random() * 10) + 5) * 10; // 50-150 units
      const amount = product.cost_price * quantity;
      subtotal += amount;
      
      items.push({
        product_id: product.product_id,
        quantity,
        unit_cost: product.cost_price,
        amount
      });
    }
    
    const shippingCost = subtotal * 0.03;
    const promotion = Math.random() < 0.3 ? Math.floor(Math.random() * 50) + 10 : 0;
    const total = subtotal + shippingCost - promotion;
    
    // Older POs are received
    const status = month < 11 ? 'Received' : statuses[Math.floor(Math.random() * statuses.length)];
    
    const result = insertPO.run(
      `PO-${String(poNum).padStart(4, '0')}`,
      supplier.supplier_id,
      orderDate.toISOString().split('T')[0],
      etaDate.toISOString().split('T')[0],
      subtotal,
      shippingCost,
      promotion,
      total,
      status
    );
    
    const poId = result.lastInsertRowid;
    
    for (const item of items) {
      insertPOItem.run(poId, item.product_id, item.quantity, item.unit_cost, item.amount);
    }
    
    poNum++;
  }
}

console.log(`✅ Generated ${poNum - 1} purchase orders`);

// Update product stock based on POs received and sales made
console.log('📊 Calculating current stock levels...');

const updateStock = db.prepare(`
  UPDATE Products SET current_stock = (
    COALESCE((SELECT SUM(poi.quantity) FROM PurchaseOrderItems poi 
              JOIN PurchaseOrders po ON poi.po_id = po.po_id 
              WHERE poi.product_id = Products.product_id AND po.status = 'Received'), 0)
    -
    COALESCE((SELECT SUM(quantity) FROM Sales WHERE product_id = Products.product_id), 0)
    + min_stock_level * 2
  )
  WHERE product_id = ?
`);

for (const product of products) {
  updateStock.run(product.product_id);
}

// Make sure stock is positive
db.exec(`UPDATE Products SET current_stock = min_stock_level WHERE current_stock < 0`);

console.log('✅ Stock levels updated');

// Verify data
const salesCount = db.prepare('SELECT COUNT(*) as count FROM Sales').get() as { count: number };
const poCount = db.prepare('SELECT COUNT(*) as count FROM PurchaseOrders').get() as { count: number };
const productCount = db.prepare('SELECT COUNT(*) as count FROM Products').get() as { count: number };
const totalRevenue = db.prepare('SELECT SUM(total_amount) as total FROM Sales').get() as { total: number };

console.log(`
📊 Data Summary:
  - Products: ${productCount.count}
  - Sales: ${salesCount.count}
  - Purchase Orders: ${poCount.count}
  - Total Revenue: $${totalRevenue.total?.toFixed(2) || 0}
`);

db.close();
console.log('🎉 Database seeded successfully!');
