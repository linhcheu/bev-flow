// Authentication configuration
// ============================================
// Token expiration time in milliseconds
// 
// CHANGE THIS VALUE TO ADJUST TOKEN EXPIRATION:
// - 1 minute (testing): 1 * 60 * 1000 = 60000
// - 3 hours (production): 3 * 60 * 60 * 1000 = 10800000
// - 24 hours: 24 * 60 * 60 * 1000 = 86400000
// ============================================

export const AUTH_CONFIG = {
  // Token expiry in milliseconds - Currently set to 1 minute for testing
  // Change to 3 * 60 * 60 * 1000 for 3 hours in production
  TOKEN_EXPIRY_MS: 3 * 60 * 60 * 1000,
};
