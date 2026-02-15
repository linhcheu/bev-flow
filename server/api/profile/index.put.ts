// Update current user profile
import { execute, queryOne, isProduction, getSupabase } from '~/server/utils/db';

// Ensure profile_image column exists (self-healing for existing dev DBs)
let columnChecked = false;
function ensureProfileImageColumn() {
  if (columnChecked || isProduction()) return;
  try {
    queryOne<{ profile_image: string | null }>('SELECT profile_image FROM Users LIMIT 1', []);
    columnChecked = true;
  } catch {
    try {
      execute('ALTER TABLE Users ADD COLUMN profile_image TEXT', []);
      columnChecked = true;
    } catch { columnChecked = true; }
  }
}

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

    // Get user_id from cookie
    const userIdCookie = getCookie(event, 'userId');
    const userId = userIdCookie ? parseInt(userIdCookie) : 1;

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
        .select('user_id, username, email, full_name, role, phone, location, profile_image')
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
          profileImage: updatedUser?.profile_image || null,
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

    // Ensure column exists before selecting
    if (!isProduction()) ensureProfileImageColumn();

    // Fetch updated profile
    const updatedUser = queryOne<{
      user_id: number;
      username: string;
      email: string;
      full_name: string;
      role: string;
      phone: string | null;
      location: string | null;
      profile_image: string | null;
    }>(
      'SELECT user_id, username, email, full_name, role, phone, location, profile_image FROM Users WHERE user_id = ?',
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
        profileImage: updatedUser?.profile_image || null,
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
