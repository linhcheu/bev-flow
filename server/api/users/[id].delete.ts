// Delete user (Admin only)
import { execute, queryOne, isProduction, getSupabase } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  try {
    const userId = getRouterParam(event, 'id');
    
    if (!userId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'User ID is required',
      });
    }

    // Prevent deleting the main admin user (ID 1)
    if (userId === '1') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Cannot delete the primary administrator account',
      });
    }

    // Production: Use Supabase
    if (isProduction()) {
      const supabase = getSupabase();
      
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('user_id', userId);
      
      if (error) {
        throw createError({
          statusCode: 500,
          statusMessage: 'Failed to delete user',
        });
      }
      
      return {
        success: true,
        message: 'User deleted successfully',
      };
    }

    // Development: Use SQLite
    // Check if user exists
    const user = queryOne<{ user_id: number }>(
      'SELECT user_id FROM Users WHERE user_id = ?',
      [userId]
    );
    
    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found',
      });
    }

    execute('DELETE FROM Users WHERE user_id = ?', [userId]);

    return {
      success: true,
      message: 'User deleted successfully',
    };
  } catch (error: any) {
    if (error.statusCode) throw error;
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete user',
    });
  }
});
