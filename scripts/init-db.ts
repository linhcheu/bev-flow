// Script to initialize the database manually
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
const schemaPath = join(rootDir, 'database', 'schema.sql');
const schema = readFileSync(schemaPath, 'utf-8');

console.log('📝 Executing schema...');

try {
  db.exec(schema);
  console.log('✅ Database initialized successfully!');
} catch (e) {
  console.log('⚠️ Some errors occurred, trying statement by statement...');
  
  // Parse and execute statements
  const lines = schema.split('\n');
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
  
  console.log('✅ Database initialization complete (with warnings)');
}

// Verify tables
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").all();
console.log('\n📋 Created tables:', tables.map((t: any) => t.name).join(', '));

// Verify sample data
const userCount = db.prepare('SELECT COUNT(*) as count FROM Users').get() as { count: number };
const productCount = db.prepare('SELECT COUNT(*) as count FROM Products').get() as { count: number };
const supplierCount = db.prepare('SELECT COUNT(*) as count FROM Suppliers').get() as { count: number };

console.log(`\n📊 Sample data loaded:
  - Users: ${userCount.count}
  - Products: ${productCount.count}
  - Suppliers: ${supplierCount.count}
`);

db.close();
console.log('🎉 Done!');
