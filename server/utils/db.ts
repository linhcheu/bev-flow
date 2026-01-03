// Database connection utility - automatically uses SQLite (local) or Supabase (production)
import { join } from 'path';
import { existsSync, readFileSync, mkdirSync } from 'fs';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { createRequire } from 'module';

// Create require function for ESM compatibility
const require = createRequire(import.meta.url);

// Check if we should use Supabase
// Use Supabase if: production OR Vercel OR Supabase env vars are available
export const isProduction = () => {
  return process.env.NODE_ENV === 'production' || 
         process.env.VERCEL === '1' ||
         (!!process.env.SUPABASE_URL && !!process.env.SUPABASE_KEY);
};

// ============================================
// SUPABASE CLIENT (Production)
// ============================================
let supabase: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient => {
  if (supabase) return supabase;
  
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_KEY environment variables');
  }

  supabase = createClient(supabaseUrl, supabaseKey);
  console.log('✅ Supabase client initialized');
  return supabase;
};

// ============================================
// SQLITE (Local Development Only)
// ============================================
let db: any = null;
let Database: any = null;

// Pre-load better-sqlite3 at module level for development
if (!isProduction()) {
  try {
    Database = require('better-sqlite3');
  } catch (e) {
    console.warn('better-sqlite3 not available:', e);
  }
}

const getSQLite = () => {
  if (db) return db;

  // Skip SQLite in production - it won't work on Vercel
  if (isProduction()) {
    throw new Error('SQLite is not available in production. Use Supabase.');
  }

  if (!Database) {
    throw new Error('SQLite not available. Make sure better-sqlite3 is installed for local development.');
  }

  try {
    
    // Ensure .data directory exists
    const dataDir = join(process.cwd(), '.data');
    if (!existsSync(dataDir)) {
      mkdirSync(dataDir, { recursive: true });
    }

    // Database file location
    const dbPath = join(dataDir, 'bev-flow.db');
    
    // Create database connection
    db = new Database(dbPath);
    
    // Enable foreign keys
    db.pragma('foreign_keys = ON');
    db.pragma('journal_mode = WAL');
    
    // Initialize schema if database is new
    initializeSchema();
    
    return db;
  } catch (error) {
    console.error('Failed to load SQLite:', error);
    throw new Error('SQLite not available. Make sure better-sqlite3 is installed for local development.');
  }
};

// Initialize the database schema (SQLite only)
const initializeSchema = () => {
  if (!db) return;
  
  const tableCheck = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='Users'").get();
  
  if (!tableCheck) {
    console.log('🗄️ Initializing database schema...');
    
    const schemaPath = join(process.cwd(), 'database', 'schema.sql');
    if (existsSync(schemaPath)) {
      const schema = readFileSync(schemaPath, 'utf-8');
      
      try {
        db.exec(schema);
        console.log('✅ Database schema initialized successfully!');
      } catch (e) {
        const lines = schema.split('\n');
        let currentStatement = '';
        
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith('--')) continue;
          currentStatement += line + '\n';
          if (trimmed.endsWith(';')) {
            try {
              db.exec(currentStatement);
            } catch (err) {}
            currentStatement = '';
          }
        }
        console.log('✅ Database schema initialized');
      }
    }
  }
};

// Get the raw database instance (for backwards compatibility in dev)
export const useDatabase = () => {
  if (isProduction()) {
    throw new Error('useDatabase() not available in production. Use getSupabase() instead.');
  }
  return getSQLite();
};

// ============================================
// UNIFIED QUERY HELPERS (SQLite only - sync)
// ============================================

// Helper function for SELECT queries (SQLite only)
export const queryAll = <T = any>(sql: string, params: any[] = []): T[] => {
  if (isProduction()) {
    throw new Error('queryAll() is sync and not available in production. Use queryAllSupabase() instead.');
  }
  const database = getSQLite();
  return database.prepare(sql).all(...params) as T[];
};

// Helper function for SELECT single row (SQLite only)
export const queryOne = <T = any>(sql: string, params: any[] = []): T | undefined => {
  if (isProduction()) {
    throw new Error('queryOne() is sync and not available in production. Use queryOneSupabase() instead.');
  }
  const database = getSQLite();
  return database.prepare(sql).get(...params) as T | undefined;
};

// Helper function for INSERT/UPDATE/DELETE (SQLite only)
export const execute = (sql: string, params: any[] = []) => {
  if (isProduction()) {
    throw new Error('execute() is sync and not available in production. Use Supabase methods instead.');
  }
  const database = getSQLite();
  return database.prepare(sql).run(...params);
};

// Helper to get last inserted ID (SQLite only)
export const getLastInsertId = () => {
  if (isProduction()) {
    throw new Error('getLastInsertId() not available in production.');
  }
  const database = getSQLite();
  const result = database.prepare('SELECT last_insert_rowid() as id').get() as { id: number };
  return result.id;
};


