import { describe, it, expect } from 'vitest';
import worker from './index';

describe('Worker Security Features', () => {
  const env = {};

  it('injects security headers on responses', async () => {
    const req = new Request('https://imkoris.com/api/health', {
      method: 'GET',
    });
    const res = await worker.fetch(req, env);

    expect(res.headers.get('X-Frame-Options')).toBe('DENY');
    expect(res.headers.get('X-Content-Type-Options')).toBe('nosniff');
    expect(res.headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
    expect(res.headers.get('Permissions-Policy')).toContain('camera=()');
    expect(res.headers.get('Strict-Transport-Security')).toContain('max-age=31536000');
    expect(res.headers.get('Content-Security-Policy')).toContain("default-src 'self'");
  });

  it('responds to the health check', async () => {
    const req = new Request('https://imkoris.com/api/health', {
      method: 'GET',
    });
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(200);
    const body = (await res.json()) as { ok?: boolean };
    expect(body.ok).toBe(true);
  });

  it('returns 404 when no asset binding is present', async () => {
    const req = new Request('https://imkoris.com/missing', {
      method: 'GET',
    });
    const res = await worker.fetch(req, env);

    expect(res.status).toBe(404);
  });
});

describe('Markdown URL Sanitizer', async () => {
  const { isSafeUrl } = await import('../../src/lib/url');

  it('rejects dangerous URI schemes', () => {
    expect(isSafeUrl('javascript:alert(1)')).toBe(false);
    expect(isSafeUrl('JAVASCRIPT:alert(1)')).toBe(false);
    expect(isSafeUrl('  javascript:alert(1)')).toBe(false);
    expect(isSafeUrl('vbscript:msgbox(1)')).toBe(false);
    expect(isSafeUrl('data:text/html,<script>alert(1)</script>')).toBe(false);
  });

  it('allows safe URLs', () => {
    expect(isSafeUrl('https://imkoris.com')).toBe(true);
    expect(isSafeUrl('http://example.com')).toBe(true);
    expect(isSafeUrl('/docs/getting-started')).toBe(true);
    expect(isSafeUrl('#section')).toBe(true);
  });
});
