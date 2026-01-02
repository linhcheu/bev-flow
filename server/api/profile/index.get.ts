// Get current user profile
import { queryOne, isProduction, getSupabase } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  try {
    // Get user_id from session/token (for now, use admin user as seed data)
    const userId = 1; // Admin user from seed data

    // Production: Use Supabase
    if (isProduction()) {
      const supabase = getSupabase();
      
      const { data: user, error } = await supabase
        .from('users')
        .select('user_id, username, email, full_name, role, phone, location, is_active, created_at, updated_at')
        .eq('user_id', userId)
        .single();
      
      if (error || !user) {
        throw createError({
          statusCode: 404,
          statusMessage: 'User not found',
        });
      }
      
      return {
        id: user.user_id,
        name: user.full_name || 'Admin User',
        username: user.username,
        email: user.email,
        role: user.role === 'admin' ? 'System Administrator' : user.role === 'manager' ? 'Manager' : 'Staff',
        phone: user.phone || '+855 23 456 7890',
        location: user.location || 'Phnom Penh, Cambodia',
        joinDate: formatDate(user.created_at),
        lastLogin: 'Today at ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        isActive: user.is_active === true,
      };
    }

    // Development: Use SQLite
    const user = queryOne<{
      user_id: number;
      username: string;
      email: string;
      full_name: string;
      role: string;
      phone: string | null;
      location: string | null;
      is_active: number;
      created_at: string;
      updated_at: string;
    }>(
      `SELECT user_id, username, email, full_name, role, phone, location, is_active, created_at, updated_at 
       FROM Users WHERE user_id = ?`,
      [userId]
    );

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found',
      });
    }

    // Return profile data
    return {
      id: user.user_id,
      name: user.full_name || 'Admin User',
      username: user.username,
      email: user.email,
      role: user.role === 'admin' ? 'System Administrator' : user.role === 'manager' ? 'Manager' : 'Staff',
      phone: user.phone || '+855 23 456 7890',
      location: user.location || 'Phnom Penh, Cambodia',
      joinDate: formatDate(user.created_at),
      lastLogin: 'Today at ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      isActive: user.is_active === 1,
    };
  } catch (error: any) {
    if (error.statusCode) throw error;
    
    console.error('Error fetching profile:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch profile',
    });
  }
});

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}
