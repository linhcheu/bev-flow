// Database connection utility using better-sqlite3
import Database from 'better-sqlite3';
import { join } from 'path';
import { existsSync, readFileSync, mkdirSync } from 'fs';

let db: Database.Database | null = null;

// Get the database instance (singleton pattern)
export const useDatabase = () => {
  if (db) {
    return db;
  }

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
};

// Initialize the database schema
const initializeSchema = () => {
  if (!db) return;
  
  // Check if tables exist
  const tableCheck = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='Users'").get();
  
  if (!tableCheck) {
    console.log('🗄️ Initializing database schema...');
    
    // Read schema file
    const schemaPath = join(process.cwd(), 'database', 'schema.sql');
    if (existsSync(schemaPath)) {
      const schema = readFileSync(schemaPath, 'utf-8');
      
      // Execute the entire schema
      try {
        db.exec(schema);
        console.log('✅ Database schema initialized successfully!');
      } catch (e) {
        console.error('❌ Error initializing schema:', (e as Error).message);
        // Try to execute statement by statement
        const lines = schema.split('\n');
        let currentStatement = '';
        
        for (const line of lines) {
          const trimmed = line.trim();
          // Skip empty lines and comments
          if (!trimmed || trimmed.startsWith('--')) continue;
          
          currentStatement += line + '\n';
          
          // If line ends with semicolon, execute it
          if (trimmed.endsWith(';')) {
            try {
              db.exec(currentStatement);
            } catch (err) {
              console.warn('⚠️ Statement failed:', (err as Error).message.substring(0, 100));
            }
            currentStatement = '';
          }
        }
        
        console.log('✅ Database schema initialized (with some warnings)');
      }
    } else {
      console.warn('⚠️ Schema file not found at:', schemaPath);
    }
  }
};

// Helper function for SELECT queries
export const queryAll = <T = any>(sql: string, params: any[] = []): T[] => {
  const database = useDatabase();
  return database.prepare(sql).all(...params) as T[];
};

// Helper function for SELECT single row
export const queryOne = <T = any>(sql: string, params: any[] = []): T | undefined => {
  const database = useDatabase();
  return database.prepare(sql).get(...params) as T | undefined;
};

// Helper function for INSERT/UPDATE/DELETE
export const execute = (sql: string, params: any[] = []) => {
  const database = useDatabase();
  return database.prepare(sql).run(...params);
};

// Helper to get last inserted ID
export const getLastInsertId = () => {
  const database = useDatabase();
  const result = database.prepare('SELECT last_insert_rowid() as id').get() as { id: number };
  return result.id;
};
