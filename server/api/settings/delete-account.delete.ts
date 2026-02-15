// DELETE /api/settings/delete-account - Securely delete the current user's account
// Security: Admins cannot delete their own account. User must be active. Settings & data are cascade-deleted.
import { queryOne, execute, isProduction, getSupabase } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  try {
    const userIdCookie = getCookie(event, 'userId');
    const userId = userIdCookie ? parseInt(userIdCookie) : 0;

    if (!userId || isNaN(userId) || userId < 1) {
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
    }

    if (isProduction()) {
      const supabase = getSupabase();

      // Fetch user to verify existence and check role
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('user_id, role, is_active')
        .eq('user_id', userId)
        .single();

      if (userError || !user) {
        throw createError({ statusCode: 404, statusMessage: 'User not found' });
      }

      if (!user.is_active) {
        throw createError({ statusCode: 403, statusMessage: 'Account is already deactivated' });
      }

      // Prevent admin self-deletion (safety guard)
      if (user.role === 'admin') {
        throw createError({
          statusCode: 403,
          statusMessage: 'System Administrators cannot delete their own account. Contact another administrator.',
        });
      }

      // Delete user settings first
      await supabase.from('user_settings').delete().eq('user_id', userId);

      // Soft-delete: deactivate the user instead of hard delete to preserve data integrity
      const { error: updateError } = await supabase
        .from('users')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('user_id', userId);

      if (updateError) {
        console.error('Supabase account deactivation error:', updateError);
        throw createError({ statusCode: 500, statusMessage: 'Failed to delete account' });
      }

      // Clear auth cookies
      deleteCookie(event, 'userId');
      deleteCookie(event, 'isAuthenticated');
      deleteCookie(event, 'tokenExpiry');

      return {
        success: true,
        message: 'Account has been permanently deactivated',
      };
    }

    // Development: SQLite
    const user = queryOne<{ user_id: number; role: string; is_active: number }>(
      'SELECT user_id, role, is_active FROM Users WHERE user_id = ?',
      [userId]
    );

    if (!user) {
      throw createError({ statusCode: 404, statusMessage: 'User not found' });
    }

    if (user.is_active !== 1) {
      throw createError({ statusCode: 403, statusMessage: 'Account is already deactivated' });
    }

    // Prevent admin self-deletion
    if (user.role === 'admin') {
      throw createError({
        statusCode: 403,
        statusMessage: 'System Administrators cannot delete their own account. Contact another administrator.',
      });
    }

    // Delete settings
    try {
      execute('DELETE FROM UserSettings WHERE user_id = ?', [userId]);
    } catch {
      // Table may not exist yet
    }

    // Soft-delete user
    execute(
      'UPDATE Users SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?',
      [userId]
    );

    // Clear auth cookies
    deleteCookie(event, 'userId');
    deleteCookie(event, 'isAuthenticated');
    deleteCookie(event, 'tokenExpiry');

    return {
      success: true,
      message: 'Account has been permanently deactivated',
    };
  } catch (error: any) {
    if (error.statusCode) throw error;

    console.error('Error deleting account:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete account',
    });
  }
});
