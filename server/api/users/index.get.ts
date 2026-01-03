// Get all users (Admin only)
import { queryAll, isProduction, getSupabase } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  try {
    // TODO: Check if current user is admin

    // Production: Use Supabase
    if (isProduction()) {
      const supabase = getSupabase();
      
      const { data: users, error } = await supabase
        .from('users')
        .select('user_id, username, email, full_name, role, phone, location, is_active, created_at, updated_at')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw createError({
          statusCode: 500,
          statusMessage: 'Failed to fetch users',
        });
      }
      
      return users.map(user => ({
        id: user.user_id,
        username: user.username,
        email: user.email,
        name: user.full_name || user.username,
        role: user.role === 'admin' ? 'System Administrator' : user.role === 'manager' ? 'Manager' : 'Staff',
        dbRole: user.role,
        phone: user.phone || '',
        location: user.location || '',
        isActive: user.is_active === true,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      }));
    }

    // Development: Use SQLite
    const users = queryAll<{
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
       FROM Users ORDER BY created_at DESC`
    );

    return users.map(user => ({
      id: user.user_id,
      username: user.username,
      email: user.email,
      name: user.full_name || user.username,
      role: user.role === 'admin' ? 'System Administrator' : user.role === 'manager' ? 'Manager' : 'Staff',
      dbRole: user.role,
      phone: user.phone || '',
      location: user.location || '',
      isActive: user.is_active === 1,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    }));
  } catch (error: any) {
    if (error.statusCode) throw error;
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch users',
    });
  }
});
