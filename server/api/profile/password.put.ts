// Update user password
import { execute, queryOne, isProduction, getSupabase } from '~/server/utils/db';

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

    // Get user_id from session/token (for now, use admin user)
    const userId = 1;

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
      
      if (user.password_hash !== currentPassword) {
        throw createError({
          statusCode: 401,
          statusMessage: 'Current password is incorrect',
        });
      }
      
      await supabase
        .from('users')
        .update({
          password_hash: newPassword,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);
      
      return {
        success: true,
        message: 'Password updated successfully',
      };
    }

    // Development: Use SQLite
    // Verify current password
    // Note: In production, this should use proper password hashing (bcrypt, argon2, etc.)
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

    // Simple password check (seed data uses plain text - in production use bcrypt)
    if (user.password_hash !== currentPassword) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Current password is incorrect',
      });
    }

    // Update password
    // Note: In production, hash the new password before storing
    execute(
      `UPDATE Users 
       SET password_hash = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE user_id = ?`,
      [newPassword, userId]
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
