// Update user (Admin only)
// Uses bcrypt for secure password hashing when password is changed
import { execute, queryOne, isProduction, getSupabase } from '~/server/utils/db';
import bcrypt from 'bcryptjs';

const BCRYPT_SALT_ROUNDS = 10;

export default defineEventHandler(async (event) => {
  try {
    const userId = getRouterParam(event, 'id');
    const body = await readBody(event);
    const { name, email, role, phone, location, isActive, password } = body;
    
    if (!userId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'User ID is required',
      });
    }

    // Map display role to db role
    const roleMap: Record<string, string> = {
      'System Administrator': 'admin',
      'Manager': 'manager',
      'Staff': 'user',
    };
    const dbRole = role ? (roleMap[role] || 'user') : undefined;

    // Production: Use Supabase
    if (isProduction()) {
      const supabase = getSupabase();
      
      const updateData: Record<string, any> = {
        updated_at: new Date().toISOString(),
      };
      
      if (name) updateData.full_name = name;
      if (email) updateData.email = email;
      if (dbRole) updateData.role = dbRole;
      if (phone !== undefined) updateData.phone = phone || null;
      if (location !== undefined) updateData.location = location || null;
      if (isActive !== undefined) updateData.is_active = isActive;
      // Hash new password with bcrypt if provided
      if (password) updateData.password_hash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
      
      const { error } = await supabase
        .from('users')
        .update(updateData)
        .eq('user_id', userId);
      
      if (error) {
        throw createError({
          statusCode: 500,
          statusMessage: 'Failed to update user',
        });
      }
      
      return {
        success: true,
        message: 'User updated successfully',
      };
    }

    // Development: Use SQLite
    const updates: string[] = ['updated_at = CURRENT_TIMESTAMP'];
    const values: any[] = [];
    
    if (name) {
      updates.push('full_name = ?');
      values.push(name);
    }
    if (email) {
      updates.push('email = ?');
      values.push(email);
    }
    if (dbRole) {
      updates.push('role = ?');
      values.push(dbRole);
    }
    if (phone !== undefined) {
      updates.push('phone = ?');
      values.push(phone || null);
    }
    if (location !== undefined) {
      updates.push('location = ?');
      values.push(location || null);
    }
    if (isActive !== undefined) {
      updates.push('is_active = ?');
      values.push(isActive ? 1 : 0);
    }
    // Hash new password with bcrypt if provided
    if (password) {
      updates.push('password_hash = ?');
      values.push(await bcrypt.hash(password, BCRYPT_SALT_ROUNDS));
    }
    
    values.push(userId);
    
    execute(
      `UPDATE Users SET ${updates.join(', ')} WHERE user_id = ?`,
      values
    );

    return {
      success: true,
      message: 'User updated successfully',
    };
  } catch (error: any) {
    if (error.statusCode) throw error;
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update user',
    });
  }
});
