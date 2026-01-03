// Script to initialize the database manually
// @ts-nocheck
import Database from 'better-sqlite3';
import { readFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Ensure .data directory exists
const dataDir = join(rootDir, '.data');
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
  console.log('📁 Created .data directory');
}

// Database file path
const dbPath = join(dataDir, 'bev-flow.db');

console.log('🗄️ Initializing database at:', dbPath);

// Create database
const db = new Database(dbPath);
db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');

// Function to execute SQL file
const executeSqlFile = (filePath: string, description: string) => {
  console.log(`📝 Executing ${description}...`);
  const sql = readFileSync(filePath, 'utf-8');
  
  try {
    db.exec(sql);
    console.log(`✅ ${description} completed successfully!`);
  } catch (e) {
    console.log(`⚠️ Some errors in ${description}, trying statement by statement...`);
    
    const lines = sql.split('\n');
    let statement = '';
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('--')) continue;
      
      statement += line + '\n';
      
      if (trimmed.endsWith(';')) {
        try {
          db.exec(statement);
        } catch (err) {
          console.warn('  ⚠️', (err as Error).message.substring(0, 80));
        }
        statement = '';
      }
    }
    
    console.log(`✅ ${description} complete (with warnings)`);
  }
};

// Execute schema
const schemaPath = join(rootDir, 'database', 'schema.sql');
executeSqlFile(schemaPath, 'Schema');

// Execute seed data
const seedPath = join(rootDir, 'database', 'seed-data.sql');
if (existsSync(seedPath)) {
  executeSqlFile(seedPath, 'Seed data');
}

// Verify tables
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").all();
console.log('\n📋 Created tables:', tables.map((t: any) => t.name).join(', '));

// Verify sample data
const userCount = db.prepare('SELECT COUNT(*) as count FROM Users').get() as { count: number };
const productCount = db.prepare('SELECT COUNT(*) as count FROM Products').get() as { count: number };
const supplierCount = db.prepare('SELECT COUNT(*) as count FROM Suppliers').get() as { count: number };
const customerCount = db.prepare('SELECT COUNT(*) as count FROM Customers').get() as { count: number };
const poCount = db.prepare('SELECT COUNT(*) as count FROM PurchaseOrders').get() as { count: number };
const saleCount = db.prepare('SELECT COUNT(*) as count FROM Sales').get() as { count: number };

console.log(`\n📊 Data loaded:
  - Users: ${userCount.count}
  - Products: ${productCount.count}
  - Suppliers: ${supplierCount.count}
  - Customers: ${customerCount.count}
  - Purchase Orders: ${poCount.count}
  - Sales: ${saleCount.count}
`);

// Show test accounts
console.log(`\n🔐 Test Accounts:
  ┌─────────────────────────────────────────────────────────┐
  │ Role                │ Email                │ Password   │
  ├─────────────────────────────────────────────────────────┤
  │ System Admin        │ admin@bevflow.com    │ admin123   │
  │ Manager             │ manager@bevflow.com  │ manager123 │
  │ Staff               │ staff@bevflow.com    │ staff123   │
  └─────────────────────────────────────────────────────────┘
`);

db.close();
console.log('🎉 Done!');
