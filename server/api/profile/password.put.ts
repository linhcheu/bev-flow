// Update user password
import { execute, queryOne, isProduction, getSupabase } from '~/server/utils/db';
import bcrypt from 'bcryptjs';

const BCRYPT_SALT_ROUNDS = 10;

// Verify password - supports both bcrypt hashes and plain text (for legacy/seed data)
async function verifyPassword(inputPassword: string, storedHash: string): Promise<boolean> {
  if (storedHash.startsWith('$2')) {
    return await bcrypt.compare(inputPassword, storedHash);
  }
  return inputPassword === storedHash;
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { currentPassword, newPassword } = body;

    // Validate required fields
    if (!currentPassword || !newPassword) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Current password and new password are required',
      });
    }

    // Validate new password requirements
    if (newPassword.length < 8) {
      throw createError({
        statusCode: 400,
        statusMessage: 'New password must be at least 8 characters',
      });
    }

    if (!/[A-Z]/.test(newPassword)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'New password must contain at least one uppercase letter',
      });
    }

    if (!/[0-9]/.test(newPassword)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'New password must contain at least one number',
      });
    }

    // Get user_id from cookie
    const userIdCookie = getCookie(event, 'userId');
    const userId = userIdCookie ? parseInt(userIdCookie) : 1;

    // Production: Use Supabase
    if (isProduction()) {
      const supabase = getSupabase();
      
      const { data: user, error } = await supabase
        .from('users')
        .select('password_hash')
        .eq('user_id', userId)
        .single();
      
      if (error || !user) {
        throw createError({
          statusCode: 404,
          statusMessage: 'User not found',
        });
      }
      
      const isValidPassword = await verifyPassword(currentPassword, user.password_hash);
      if (!isValidPassword) {
        throw createError({
          statusCode: 401,
          statusMessage: 'Current password is incorrect',
        });
      }
      
      // Hash the new password before storing
      const newHash = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);
      
      await supabase
        .from('users')
        .update({
          password_hash: newHash,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);
      
      return {
        success: true,
        message: 'Password updated successfully',
      };
    }

    // Development: Use SQLite
    const user = queryOne<{ password_hash: string }>(
      'SELECT password_hash FROM Users WHERE user_id = ?',
      [userId]
    );

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found',
      });
    }

    // Verify current password (supports bcrypt hashes and plain text seed data)
    const isValidPassword = await verifyPassword(currentPassword, user.password_hash);
    if (!isValidPassword) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Current password is incorrect',
      });
    }

    // Hash the new password with bcrypt before storing
    const newHash = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);
    
    execute(
      `UPDATE Users 
       SET password_hash = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE user_id = ?`,
      [newHash, userId]
    );

    return {
      success: true,
      message: 'Password updated successfully',
    };
  } catch (error: any) {
    if (error.statusCode) throw error;

    console.error('Error updating password:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update password',
    });
  }
});
