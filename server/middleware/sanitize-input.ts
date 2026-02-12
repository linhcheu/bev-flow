// Server middleware: Input sanitization
// Strips dangerous HTML/script tags from all string inputs on POST/PUT/PATCH

const DANGEROUS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,  // <script> tags
  /on\w+\s*=\s*["'][^"']*["']/gi,                          // Event handlers (onclick, etc.)
  /javascript\s*:/gi,                                        // javascript: URIs
  /data\s*:\s*text\/html/gi,                                 // data: HTML URIs
];

function sanitizeValue(value: any): any {
  if (typeof value === 'string') {
    let clean = value;
    for (const pattern of DANGEROUS_PATTERNS) {
      clean = clean.replace(pattern, '');
    }
    // Trim excessive whitespace
    clean = clean.trim();
    return clean;
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  if (value && typeof value === 'object') {
    const cleaned: Record<string, any> = {};
    for (const [k, v] of Object.entries(value)) {
      cleaned[k] = sanitizeValue(v);
    }
    return cleaned;
  }
  return value;
}

export default defineEventHandler(async (event) => {
  const method = getMethod(event);

  // Only sanitize write operations
  if (!['POST', 'PUT', 'PATCH'].includes(method)) return;

  // Only for API routes
  const path = getRequestURL(event).pathname;
  if (!path.startsWith('/api/')) return;

  // Read and sanitize body
  try {
    const body = await readBody(event);
    if (body && typeof body === 'object') {
      const sanitized = sanitizeValue(body);
      // Override the body for downstream handlers
      (event as any)._sanitizedBody = sanitized;
    }
  } catch {
    // No body or parse error — skip
  }
});
