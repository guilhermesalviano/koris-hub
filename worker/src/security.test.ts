import { describe, it, expect } from 'vitest';
import worker from './index';

describe('Worker Security Features', () => {
  const dummyEnv = {
    TYPESAFE_API_KEY: 'test-key',
  };

  it('injects security headers on responses', async () => {
    const req = new Request('https://imkoris.com/api/health', {
      method: 'GET',
    });
    const res = await worker.fetch(req, dummyEnv);

    expect(res.headers.get('X-Frame-Options')).toBe('DENY');
    expect(res.headers.get('X-Content-Type-Options')).toBe('nosniff');
    expect(res.headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
    expect(res.headers.get('Permissions-Policy')).toContain('camera=()');
    expect(res.headers.get('Strict-Transport-Security')).toContain('max-age=31536000');
    expect(res.headers.get('Content-Security-Policy')).toContain("default-src 'self'");
  });

  it('blocks unauthorized cross-origin requests on production', async () => {
    const req = new Request('https://imkoris.com/api/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'https://attacker.evil.com',
      },
      body: JSON.stringify({ question: 'hello' }),
    });
    const res = await worker.fetch(req, dummyEnv);

    expect(res.status).toBe(403);
    const body = (await res.json()) as { error?: string };
    expect(body.error).toBe('forbidden');
  });

  it('blocks localhost origins sent to production domain', async () => {
    const req = new Request('https://imkoris.com/api/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'http://localhost:3000',
      },
      body: JSON.stringify({ question: 'hello' }),
    });
    const res = await worker.fetch(req, dummyEnv);

    expect(res.status).toBe(403);
  });

  it('allows local cross-port requests in development', async () => {
    const req = new Request('http://localhost:8787/api/health', {
      method: 'GET',
      headers: { Origin: 'http://localhost:3000' },
    });
    const res = await worker.fetch(req, dummyEnv);
    expect(res.status).toBe(200);
  });

  it('supports IPv6 loopback and private LAN IPs in development', async () => {
    // IPv6 loopback
    const reqIpv6 = new Request('http://[::1]:8787/api/health', {
      method: 'GET',
      headers: { Origin: 'http://[::1]:3000' },
    });
    const resIpv6 = await worker.fetch(reqIpv6, dummyEnv);
    expect(resIpv6.status).toBe(200);

    // Private LAN (e.g. testing mobile device on Wi-Fi)
    const reqLan = new Request('http://192.168.1.50:8787/api/health', {
      method: 'GET',
      headers: { Origin: 'http://192.168.1.50:3000' },
    });
    const resLan = await worker.fetch(reqLan, dummyEnv);
    expect(resLan.status).toBe(200);
  });

  it('allows same-host preview deployments (e.g. workers.dev)', async () => {
    const req = new Request('https://branch-preview.koris.workers.dev/api/health', {
      method: 'GET',
      headers: { Origin: 'https://branch-preview.koris.workers.dev' },
    });
    const res = await worker.fetch(req, dummyEnv);
    expect(res.status).toBe(200);
  });

  it('blocks requests exceeding maximum body size (64KB)', async () => {
    const req = new Request('https://imkoris.com/api/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': '70000',
      },
      body: JSON.stringify({ question: 'large' }),
    });
    const res = await worker.fetch(req, dummyEnv);

    expect(res.status).toBe(413);
    const body = (await res.json()) as { error?: string };
    expect(body.error).toBe('payload_too_large');
  });

  it('allows same-origin / non-browser requests', async () => {
    const req = new Request('https://imkoris.com/api/health', {
      method: 'GET',
    });
    const res = await worker.fetch(req, dummyEnv);

    expect(res.status).toBe(200);
    const body = (await res.json()) as { ok?: boolean };
    expect(body.ok).toBe(true);
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

