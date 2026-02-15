// Upload / update profile avatar (base64 data URL)
import { execute, queryOne, isProduction, getSupabase } from '~/server/utils/db';

const MAX_SIZE_BYTES = 512 * 1024; // 512 KB max after base64 encoding
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

// Ensure profile_image column exists (self-healing for existing dev DBs)
let columnChecked = false;
function ensureProfileImageColumn() {
  if (columnChecked || isProduction()) return;
  try {
    // Use a safe test query — if it fails, the column doesn't exist
    queryOne<{ profile_image: string | null }>(
      'SELECT profile_image FROM Users LIMIT 1',
      []
    );
    columnChecked = true;
  } catch {
    try {
      execute('ALTER TABLE Users ADD COLUMN profile_image TEXT', []);
      console.log('✅ Auto-added profile_image column to Users');
      columnChecked = true;
    } catch {
      // Column might already exist, that's fine
      columnChecked = true;
    }
  }
}

export default defineEventHandler(async (event) => {
  try {
    // Ensure the profile_image column exists in dev DB
    if (!isProduction()) {
      ensureProfileImageColumn();
    }

    const userIdCookie = getCookie(event, 'userId');
    const userId = userIdCookie ? parseInt(userIdCookie) : 1;

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
