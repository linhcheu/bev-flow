// Quick seed script to create/reset users in the database
import Database from 'better-sqlite3';
import { existsSync, mkdirSync } from 'fs';
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
console.log('📂 Database path:', dbPath);

// Check if database exists
if (!existsSync(dbPath)) {
  console.log('❌ Database does not exist. Creating new database...');
}

const db = new Database(dbPath);
db.pragma('foreign_keys = ON');

// Create Users table if not exists
console.log('📝 Creating Users table if not exists...');
db.exec(`
CREATE TABLE IF NOT EXISTS Users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'user' CHECK(role IN ('admin', 'manager', 'user')),
    phone VARCHAR(20),
    location VARCHAR(100),
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`);

// Delete existing users and re-insert
console.log('🗑️  Clearing existing users...');
db.exec('DELETE FROM Users');

// Insert users
console.log('👤 Inserting users...');
const insertUser = db.prepare(`
  INSERT INTO Users (username, email, password_hash, full_name, role, is_active)
  VALUES (?, ?, ?, ?, ?, 1)
`);

insertUser.run('admin', 'admin@bevflow.com', 'admin123', 'System Administrator', 'admin');
insertUser.run('manager', 'manager@bevflow.com', 'manager123', 'Store Manager', 'manager');
insertUser.run('staff', 'staff@bevflow.com', 'staff123', 'Staff User', 'user');

console.log('✅ Users seeded successfully!');

// Verify users
const users = db.prepare('SELECT user_id, username, email, role, is_active FROM Users').all();
console.log('\n📋 Users in database:');
console.table(users);

db.close();
console.log('\n🎉 Done! You can now login with:');
console.log('   Admin: admin@bevflow.com / admin123');
console.log('   Manager: manager@bevflow.com / manager123');
console.log('   Staff: staff@bevflow.com / staff123');
