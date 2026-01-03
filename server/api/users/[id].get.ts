// Get single user (Admin only)
import { queryOne, isProduction, getSupabase } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  try {
    const userId = getRouterParam(event, 'id');
    
    if (!userId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'User ID is required',
      });
    }

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

    return {
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
    };
  } catch (error: any) {
    if (error.statusCode) throw error;
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch user',
    });
  }
});
