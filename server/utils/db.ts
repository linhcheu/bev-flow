// Database connection utility
// Uncomment and configure this file when you're ready to connect to your MySQL database

/*
import mysql from 'mysql2/promise';

let connection: any = null;

export const connectToDatabase = async () => {
  if (connection) {
    return connection;
  }

  connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'bev_flow',
    waitForConnections: true,
  });

  return connection;
};

export const query = async (sql: string, values?: any[]) => {
  const conn = await connectToDatabase();
  const [rows] = await conn.execute(sql, values);
  return rows;
};
*/

// Export placeholder functions for now
export const connectToDatabase = async () => {
  throw new Error('Database connection not configured. See server/utils/db.ts');
};

export const query = async (sql: string, values?: any[]) => {
  throw new Error('Database connection not configured. See server/utils/db.ts');
};
