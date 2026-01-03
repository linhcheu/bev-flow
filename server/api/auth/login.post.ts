// API endpoint for user authentication
// Uses bcrypt for secure password hashing
import { queryOne, isProduction, getSupabase } from '~/server/utils/db';
import bcrypt from 'bcryptjs';
import type { User } from '~/types';

// Helper function to verify password
// Supports both bcrypt hashes and plain text (for legacy/test data)
async function verifyPassword(inputPassword: string, storedHash: string): Promise<boolean> {
  // Check if it's a bcrypt hash (starts with $2a$, $2b$, or $2y$)
  if (storedHash.startsWith('$2')) {
    return await bcrypt.compare(inputPassword, storedHash);
  }
  // Fallback: plain text comparison for test/legacy data
  return inputPassword === storedHash;
}

export default defineEventHandler(async (event) => {
  const body = await readBody<{ email: string; password: string }>(event);
  
  if (!body.email || !body.password) {
    throw createError({
      statusCode: 400,
      message: 'Email and password are required'
    });
  }
  
  // Production: Use Supabase
  if (isProduction()) {
    const supabase = getSupabase();
    
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', body.email)
      .eq('is_active', true)
      .single();
    
    if (error || !user) {
      throw createError({
        statusCode: 401,
        message: 'Invalid email or password'
      });
    }
    
    // Verify password using bcrypt (with fallback for plain text)
    const isValidPassword = await verifyPassword(body.password, user.password_hash);
    if (!isValidPassword) {
      throw createError({
        statusCode: 401,
        message: 'Invalid email or password'
      });
    }
    
    // Return user data without password
    const { password_hash, ...safeUser } = user;
    
    return {
      success: true,
      user: safeUser
    };
  }
  
  // Development: Use SQLite
  const user = queryOne<User>('SELECT * FROM Users WHERE email = ? AND is_active = 1', [body.email]);
  
  if (!user || !user.password_hash) {
    throw createError({
      statusCode: 401,
      message: 'Invalid email or password'
    });
  }
  
  // Verify password using bcrypt (with fallback for plain text)
  const isValidPassword = await verifyPassword(body.password, user.password_hash);
  if (!isValidPassword) {
    throw createError({
      statusCode: 401,
      message: 'Invalid email or password'
    });
  }
  
  // Return user data without password
  const { password_hash, ...safeUser } = user;
  
  return {
    success: true,
    user: safeUser
  };
});
