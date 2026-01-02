// Type declarations for better-sqlite3
// This ensures TypeScript recognizes the module
declare module 'better-sqlite3' {
  import type BetterSqlite3 from 'better-sqlite3';
  export = BetterSqlite3;
}