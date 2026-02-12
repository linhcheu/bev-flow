// Server middleware: Security headers
// Adds standard security headers to all responses

export default defineEventHandler((event) => {
  // Prevent MIME type sniffing
  setHeader(event, 'X-Content-Type-Options', 'nosniff');

  // Prevent clickjacking — only allow same origin to iframe the app
  setHeader(event, 'X-Frame-Options', 'SAMEORIGIN');

  // Enable XSS filter in older browsers
  setHeader(event, 'X-XSS-Protection', '1; mode=block');

  // Referrer policy — only send origin on cross-origin requests
  setHeader(event, 'Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions policy — disable unused browser features
  setHeader(event, 'Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');

  // Strict Transport Security — force HTTPS for 1 year (only in production)
  if (process.env.NODE_ENV === 'production') {
    setHeader(event, 'Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
});
