// Create new user (Admin only)
// Uses bcrypt for secure password hashing
import { execute, queryOne, isProduction, getSupabase } from '~/server/utils/db';
import bcrypt from 'bcryptjs';

// bcrypt settings:
// - Salt rounds: 10 (good balance of security and speed)
// - Higher = more secure but slower (12 is recommended for production)
const BCRYPT_SALT_ROUNDS = 10;

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { username, email, password, name, role, phone, location } = body;

    // Validate required fields
    if (!username || !email || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Username, email, and password are required',
      });
    }

    // Hash password with bcrypt (secure - cannot be reversed)
    const passwordHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    
    // Map display role to db role
    const roleMap: Record<string, string> = {
      'System Administrator': 'admin',
      'Manager': 'manager',
      'Staff': 'user',
    };
    const dbRole = roleMap[role] || 'user';

    // Production: Use Supabase
    if (isProduction()) {
      const supabase = getSupabase();
      
      // Check if username or email already exists
      const { data: existing } = await supabase
        .from('users')
        .select('user_id')
        .or(`username.eq.${username},email.eq.${email}`)
        .single();
      
      if (existing) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Username or email already exists',
        });
      }
      
      const { data: newUser, error } = await supabase
        .from('users')
        .insert({
          username,
          email,
          password_hash: passwordHash,
          full_name: name || username,
          role: dbRole,
          phone: phone || null,
          location: location || null,
          is_active: true,
        })
        .select()
        .single();
      
      if (error) {
        throw createError({
          statusCode: 500,
          statusMessage: 'Failed to create user',
        });
      }
      
      return {
        success: true,
        message: 'User created successfully',
        user: {
          id: newUser.user_id,
          username: newUser.username,
          email: newUser.email,
          name: newUser.full_name,
          role: role,
        },
      };
    }

    // Development: Use SQLite
    // Check if username or email already exists
    const existing = queryOne<{ user_id: number }>(
      'SELECT user_id FROM Users WHERE username = ? OR email = ?',
      [username, email]
    );
    
    if (existing) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Username or email already exists',
      });
    }

    execute(
      `INSERT INTO Users (username, email, password_hash, full_name, role, phone, location, is_active) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
      [username, email, passwordHash, name || username, dbRole, phone || null, location || null]
    );

    const newUser = queryOne<{ user_id: number }>(
      'SELECT user_id FROM Users WHERE username = ?',
      [username]
    );

    return {
      success: true,
      message: 'User created successfully',
      user: {
        id: newUser?.user_id,
        username,
        email,
        name: name || username,
        role,
      },
    };
  } catch (error: any) {
    if (error.statusCode) throw error;
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create user',
    });
  }
});
