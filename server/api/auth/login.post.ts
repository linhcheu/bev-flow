// API endpoint for user authentication
import { queryOne } from '~/server/utils/db';
import type { User } from '~/types';

export default defineEventHandler(async (event) => {
  const body = await readBody<{ email: string; password: string }>(event);
  
  if (!body.email || !body.password) {
    throw createError({
      statusCode: 400,
      message: 'Email and password are required'
    });
  }
  
  // Find user by email
  const user = queryOne<User>('SELECT * FROM Users WHERE email = ? AND is_active = 1', [body.email]);
  
  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Invalid email or password'
    });
  }
  
  // In a real application, you would hash passwords and compare them
  // For demo purposes, we're using plain text comparison
  if (user.password_hash !== body.password) {
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
