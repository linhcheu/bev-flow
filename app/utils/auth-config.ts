// Authentication configuration
// ============================================
// Session expires at midnight (00:00) before the next Monday.
// This gives users roughly a 7-day session that resets weekly.
// ============================================

export const AUTH_CONFIG = {
  // Fixed 7-day session window (fallback max lifetime)
  TOKEN_EXPIRY_MS: 7 * 24 * 60 * 60 * 1000,

  // Session description shown on settings page
  SESSION_POLICY: '7 days (resets every Monday at midnight)',
};

/**
 * Calculate the session expiry timestamp.
 * Returns the epoch ms of the upcoming Monday at 00:00:00 local time.
 * If today IS Monday and it's before midnight, it returns tonight at 00:00
 * (i.e. the very start of the next day / end of this Monday).
 * Otherwise it returns the next Monday 00:00.
 */
export function getSessionExpiry(): number {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon ... 6=Sat

  // Calculate days until next Monday at 00:00
  // Monday = 1. If today is Monday (1), daysUntilMonday = 7 (next Monday).
  // If today is Sunday (0), daysUntilMonday = 1.
  // If today is Tuesday (2), daysUntilMonday = 6.
  let daysUntilMonday = (8 - dayOfWeek) % 7;
  if (daysUntilMonday === 0) daysUntilMonday = 7; // If already Monday, target next Monday

  const expiry = new Date(now);
  expiry.setDate(expiry.getDate() + daysUntilMonday);
  expiry.setHours(0, 0, 0, 0); // midnight

  // Safety cap: never exceed 7 days from now
  const maxExpiry = now.getTime() + 7 * 24 * 60 * 60 * 1000;
  return Math.min(expiry.getTime(), maxExpiry);
}
