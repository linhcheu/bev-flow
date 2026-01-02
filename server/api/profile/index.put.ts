// Update current user profile
import { execute, queryOne, isProduction, getSupabase } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { name, phone, location, role } = body;

    // Validate required fields
    if (!name) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Name is required',
      });
    }

    // Get user_id from session/token (for now, use admin user)
    const userId = 1;

    // Map role display name to DB value
    const roleMap: Record<string, string> = {
      'System Administrator': 'admin',
      'Manager': 'manager',
      'Staff': 'user',
    };
    const dbRole = roleMap[role] || 'user';

    // Production: Use Supabase
    if (isProduction()) {
      const supabase = getSupabase();
      
      await supabase
        .from('users')
        .update({
          full_name: name,
          phone: phone || null,
          location: location || null,
          role: dbRole,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);
      
      const { data: updatedUser } = await supabase
        .from('users')
        .select('user_id, username, email, full_name, role, phone, location')
        .eq('user_id', userId)
        .single();
      
      return {
        success: true,
        message: 'Profile updated successfully',
        profile: {
          id: updatedUser?.user_id,
          name: updatedUser?.full_name,
          email: updatedUser?.email,
          role: role,
          phone: updatedUser?.phone || '+855 23 456 7890',
          location: updatedUser?.location || 'Phnom Penh, Cambodia',
        },
      };
    }

    // Development: Use SQLite
    // Update user profile (email is not editable)
    execute(
      `UPDATE Users 
       SET full_name = ?, phone = ?, location = ?, role = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE user_id = ?`,
      [name, phone || null, location || null, dbRole, userId]
    );

    // Fetch updated profile
    const updatedUser = queryOne<{
      user_id: number;
      username: string;
      email: string;
      full_name: string;
      role: string;
      phone: string | null;
      location: string | null;
    }>(
      'SELECT user_id, username, email, full_name, role, phone, location FROM Users WHERE user_id = ?',
      [userId]
    );

    return {
      success: true,
      message: 'Profile updated successfully',
      profile: {
        id: updatedUser?.user_id,
        name: updatedUser?.full_name,
        email: updatedUser?.email,
        role: role,
        phone: updatedUser?.phone || '+855 23 456 7890',
        location: updatedUser?.location || 'Phnom Penh, Cambodia',
      },
    };
  } catch (error: any) {
    if (error.statusCode) throw error;

    console.error('Error updating profile:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update profile',
    });
  }
});
