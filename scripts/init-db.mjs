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

// Read and execute schema
const schemaPath = join(rootDir, 'database', 'sqlite', 'schema.sql');
const schema = readFileSync(schemaPath, 'utf-8');

console.log('📝 Executing schema...');

const execSql = (sql, label) => {
  try {
    db.exec(sql);
    console.log(`✅ ${label} executed successfully!`);
  } catch (e) {
    console.log(`⚠️ ${label}: some errors, trying statement by statement...`);
    const lines = sql.split('\n');
    let statement = '';
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('--')) continue;
      statement += line + '\n';
      if (trimmed.endsWith(';')) {
        try { db.exec(statement); } catch (err) {
          console.warn('  ⚠️', err.message.substring(0, 80));
        }
        statement = '';
      }
    }
    console.log(`✅ ${label} complete (with warnings)`);
  }
};

execSql(schema, 'Schema');

// Read and execute seed data
const seedPath = join(rootDir, 'database', 'sqlite', 'seed.sql');
if (existsSync(seedPath)) {
  const seed = readFileSync(seedPath, 'utf-8');
  console.log('🌱 Seeding data...');
  execSql(seed, 'Seed data');
} else {
  console.log('⚠️ No seed-all.sql found, skipping seed data');
}

// Verify tables
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").all();
console.log('\n📋 Created tables:', tables.map(t => t.name).join(', '));

// Verify sample data counts
const counts = {
  Users: db.prepare('SELECT COUNT(*) as c FROM Users').get().c,
  Suppliers: db.prepare('SELECT COUNT(*) as c FROM Suppliers').get().c,
  Products: db.prepare('SELECT COUNT(*) as c FROM Products').get().c,
  Customers: db.prepare('SELECT COUNT(*) as c FROM Customers').get().c,
  PurchaseOrders: db.prepare('SELECT COUNT(*) as c FROM PurchaseOrders').get().c,
  Sales: db.prepare('SELECT COUNT(*) as c FROM Sales').get().c,
  SaleItems: db.prepare('SELECT COUNT(*) as c FROM SaleItems').get().c,
  DailyStockReports: db.prepare('SELECT COUNT(*) as c FROM DailyStockReports').get().c,
};

console.log('\n📊 Data loaded:');
for (const [table, count] of Object.entries(counts)) {
  console.log(`  - ${table}: ${count}`);
}

db.close();
console.log('🎉 Done!');
