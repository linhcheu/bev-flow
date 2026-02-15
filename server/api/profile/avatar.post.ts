// Upload / update profile avatar (base64 data URL)
import { execute, queryOne, isProduction, getSupabase } from '~/server/utils/db';

const MAX_SIZE_BYTES = 512 * 1024; // 512 KB max after base64 encoding
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export default defineEventHandler(async (event) => {
  try {
    const userIdCookie = getCookie(event, 'userId');
    const userId = userIdCookie ? parseInt(userIdCookie) : null;

    if (!userId) {
      throw createError({ statusCode: 401, statusMessage: 'Not authenticated' });
    }

    const body = await readBody(event);
    const { image } = body; // Expected: data:image/png;base64,... or null to remove

    // Allow null to remove avatar
    if (image === null || image === '') {
      if (isProduction()) {
        const supabase = getSupabase();
        await supabase.from('users').update({ profile_image: null, updated_at: new Date().toISOString() }).eq('user_id', userId);
      } else {
        execute('UPDATE Users SET profile_image = NULL, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?', [userId]);
      }
      return { success: true, message: 'Avatar removed', profileImage: null };
    }

    if (typeof image !== 'string') {
      throw createError({ statusCode: 400, statusMessage: 'Invalid image data' });
    }

    // Validate data URL format
    const match = image.match(/^data:(image\/\w+);base64,/);
    if (!match) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid image format. Must be a base64 data URL.' });
    }

    const mimeType = match[1];
    if (!ALLOWED_TYPES.includes(mimeType)) {
      throw createError({ statusCode: 400, statusMessage: `Unsupported image type: ${mimeType}. Allowed: JPEG, PNG, GIF, WebP` });
    }

    // Check size (base64 string length ≈ 1.37x raw size)
    if (image.length > MAX_SIZE_BYTES * 1.4) {
      throw createError({ statusCode: 400, statusMessage: 'Image too large. Maximum size is 500KB.' });
    }

    // Production: Supabase
    if (isProduction()) {
      const supabase = getSupabase();

      const { error } = await supabase
        .from('users')
        .update({ profile_image: image, updated_at: new Date().toISOString() })
        .eq('user_id', userId);

      if (error) {
        console.error('Supabase avatar update error:', error);
        throw createError({ statusCode: 500, statusMessage: 'Failed to update avatar' });
      }

      return { success: true, message: 'Avatar updated', profileImage: image };
    }

    // Development: SQLite
    execute(
      'UPDATE Users SET profile_image = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?',
      [image, userId]
    );

    return { success: true, message: 'Avatar updated', profileImage: image };
  } catch (error: any) {
    if (error.statusCode) throw error;
    console.error('Error uploading avatar:', error);
    throw createError({ statusCode: 500, statusMessage: 'Failed to upload avatar' });
  }
});
