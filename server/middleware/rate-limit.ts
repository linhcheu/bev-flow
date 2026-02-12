// Server middleware: Rate limiting for API endpoints
// Prevents brute-force attacks on login and abuse of write endpoints

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Config per route pattern
const RATE_LIMITS: Record<string, { maxRequests: number; windowMs: number }> = {
  '/api/auth/login': { maxRequests: 5, windowMs: 15 * 60 * 1000 },    // 5 attempts per 15 min
  '/api/sales': { maxRequests: 60, windowMs: 60 * 1000 },              // 60 req/min
  '/api/products': { maxRequests: 60, windowMs: 60 * 1000 },
  '/api/purchase-orders': { maxRequests: 60, windowMs: 60 * 1000 },
  '/api/suppliers': { maxRequests: 60, windowMs: 60 * 1000 },
  '/api/forecasts': { maxRequests: 30, windowMs: 60 * 1000 },          // 30 req/min (heavier)
  '/api/stock-reports/seed': { maxRequests: 3, windowMs: 60 * 60 * 1000 }, // 3 per hour
  '/api/dashboard': { maxRequests: 120, windowMs: 60 * 1000 },         // 120 req/min (read-heavy)
};

// Cleanup stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

function getClientIP(event: any): string {
  const forwarded = getHeader(event, 'x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  const real = getHeader(event, 'x-real-ip');
  if (real) return real;
  return 'unknown';
}

function findRateLimit(path: string): { maxRequests: number; windowMs: number } | null {
  // Exact match first
  if (RATE_LIMITS[path]) return RATE_LIMITS[path];
  // Prefix match
  for (const [pattern, config] of Object.entries(RATE_LIMITS)) {
    if (path.startsWith(pattern)) return config;
  }
  return null;
}

export default defineEventHandler((event) => {
  const path = getRequestURL(event).pathname;

  // Only rate-limit API routes
  if (!path.startsWith('/api/')) return;

  const config = findRateLimit(path);
  if (!config) return; // No limit configured for this route

  const ip = getClientIP(event);
  const key = `${ip}:${path}`;
  const now = Date.now();

  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetTime) {
    // New window
    rateLimitStore.set(key, { count: 1, resetTime: now + config.windowMs });
    return;
  }

  entry.count++;

  // Set rate limit headers
  setHeader(event, 'X-RateLimit-Limit', String(config.maxRequests));
  setHeader(event, 'X-RateLimit-Remaining', String(Math.max(0, config.maxRequests - entry.count)));
  setHeader(event, 'X-RateLimit-Reset', String(Math.ceil(entry.resetTime / 1000)));

  if (entry.count > config.maxRequests) {
    setHeader(event, 'Retry-After', Math.ceil((entry.resetTime - now) / 1000));
    throw createError({
      statusCode: 429,
      message: 'Too many requests. Please try again later.',
    });
  }
});
