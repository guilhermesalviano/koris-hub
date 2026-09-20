/**
 * Cloudflare Worker that fronts the static hub export.
 *
 * The Worker serves the assets built into `./out` (see the `[assets]` block in
 * the root `wrangler.toml`) and adds a small set of security headers to every
 * response. The `/api/health` route is handled directly so uptime checks do not
 * depend on an asset existing.
 */

interface Env {
  ASSETS?: {
    fetch(request: Request | string): Promise<Response>;
  };
}

const SECURITY_HEADERS: Record<string, string> = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https://avatars.githubusercontent.com https://raw.githubusercontent.com",
    "font-src 'self' data:",
    "connect-src 'self'",
    "frame-ancestors 'none'",
  ].join('; '),
};

function applySecurityHeaders(res: Response): Response {
  const newHeaders = new Headers(res.headers);
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    if (!newHeaders.has(key)) {
      newHeaders.set(key, value);
    }
  }
  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers: newHeaders,
  });
}

function json(data: unknown, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

async function handleFetch(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const pathname = url.pathname.replace(/\/+$/, '') || '/';

  if (request.method === 'GET' && (pathname === '/health' || pathname === '/api/health')) {
    return json({ ok: true }, 200);
  }

  if (env.ASSETS) {
    return env.ASSETS.fetch(request);
  }

  return json({ error: 'not_found' }, 404);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const response = await handleFetch(request, env);
    return applySecurityHeaders(response);
  },
};
