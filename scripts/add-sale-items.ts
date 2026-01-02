// Script to add SaleItems table
import Database from 'better-sqlite3';

const db = new Database('.data/bev-flow.db');

// Create SaleItems table
db.exec(`
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
  )
`);

// Migrate existing sales to sale items
const existingSales = db.prepare(`
  SELECT sale_id, product_id, quantity, unit_price, quantity * unit_price as amount
  FROM Sales
  WHERE product_id IS NOT NULL
`).all();

const insertItem = db.prepare(`
  INSERT OR IGNORE INTO SaleItems (sale_id, product_id, quantity, unit_price, amount)
  VALUES (?, ?, ?, ?, ?)
`);

for (const sale of existingSales as any[]) {
  try {
    insertItem.run(sale.sale_id, sale.product_id, sale.quantity, sale.unit_price, sale.amount);
  } catch (e) {
    // Ignore duplicates
  }
}

console.log('SaleItems table created and data migrated');
db.close();
