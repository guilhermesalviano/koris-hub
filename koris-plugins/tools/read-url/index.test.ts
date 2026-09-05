/**
 * Tests for the read_url tool.
 *
 * The fetch itself is mocked at `../runtime`; what matters here is the shape of
 * the curl argv, the domain-gate message that tells the human how to allow a
 * host, and how responses are classified and paginated.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

type ExecFilePromiseFn = (command: string, args: string[], timeoutMs: number) => Promise<string>;

const { mockExecFilePromise } = vi.hoisted(() => ({
  mockExecFilePromise: vi.fn<ExecFilePromiseFn>(),
}));

vi.mock('../runtime', async (importOriginal) => {
  const original = await importOriginal<typeof import('../runtime')>();
  return { ...original, execFilePromise: mockExecFilePromise };
});

import { buildFetchArgs, classifyContent, create, executeReadUrl, parseResponse } from './index';
import type { ToolDefinition, ToolPluginContext } from '../contracts';
import type { PluginRegistry } from '../../registry';

const mockLogger = {
  info: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  debug: vi.fn(),
} as any;

/** Gate that allows everything, like a host already on the allowlist. */
const allowAll = () => null;
/** Gate that blocks everything, like a fresh search result. */
const blockAll = () => 'Domain not allowed: example.com';

function curlResponse(body: string, status = 200, contentType = 'text/html; charset=utf-8'): string {
  return `${body}\n---KORIS_META:${status}:${contentType}---`;
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('buildFetchArgs', () => {
  it('verifies TLS — unlike curl_request, it never passes -k', () => {
    expect(buildFetchArgs('https://example.com/', 30)).not.toContain('-k');
  });

  it('follows redirects with a bound, and caps size and time', () => {
    const args = buildFetchArgs('https://example.com/', 12);
    expect(args).toContain('-L');
    expect(args[args.indexOf('--max-redirs') + 1]).toBe('5');
    expect(args[args.indexOf('--max-filesize') + 1]).toBe('5000000');
    expect(args[args.indexOf('--max-time') + 1]).toBe('12');
  });

  it('puts the URL last so it is never read as a flag', () => {
    const args = buildFetchArgs('https://example.com/page', 30);
    expect(args[args.length - 1]).toBe('https://example.com/page');
  });
});

describe('parseResponse', () => {
  it('reads the status and content type out of the trailing marker', () => {
    const parsed = parseResponse(curlResponse('<p>hi</p>', 200, 'text/html; charset=utf-8'));
    expect(parsed).toEqual({ status: 200, contentType: 'text/html; charset=utf-8', body: '<p>hi</p>' });
  });

  it('keeps a content type containing hyphens intact', () => {
    expect(parseResponse(curlResponse('x', 200, 'application/x-www-form-urlencoded')).contentType)
      .toBe('application/x-www-form-urlencoded');
  });

  it('uses the last marker and strips them all — curl may emit one per redirect hop', () => {
    const raw = 'first\n---KORIS_META:301:text/html---\nsecond\n---KORIS_META:200:text/plain---';
    const parsed = parseResponse(raw);
    expect(parsed.status).toBe(200);
    expect(parsed.contentType).toBe('text/plain');
    expect(parsed.body).toBe('first\nsecond');
  });

  it('reports status 0 when curl produced no marker at all', () => {
    expect(parseResponse('').status).toBe(0);
  });
});

describe('classifyContent', () => {
  it.each([
    ['text/html; charset=utf-8', 'html'],
    ['application/xhtml+xml', 'html'],
    ['text/plain', 'text'],
    ['application/json', 'text'],
    ['application/ld+json', 'text'],
    ['', 'text'],
    ['application/pdf', 'binary'],
    ['image/png', 'binary'],
  ])('classifies %s as %s', (contentType, expected) => {
    expect(classifyContent(contentType)).toBe(expected);
  });
});

describe('executeReadUrl', () => {
  it('names the host and the /allow command when the domain gate blocks the URL', async () => {
    const result = await executeReadUrl(mockLogger, { url: 'https://example.com/a' }, blockAll);

    expect(mockExecFilePromise).not.toHaveBeenCalled();
    expect(result.success).toBe(false);
    expect(result.error).toContain('/allow example.com');
    expect(result.error).toContain('Do not retry');
  });

  it('returns the page title and readable text', async () => {
    mockExecFilePromise.mockResolvedValue(
      curlResponse('<html><head><title>Docs</title></head><body><p>Hello there</p></body></html>'),
    );

    const result = await executeReadUrl(mockLogger, { url: 'https://example.com/a' }, allowAll);

    expect(result.success).toBe(true);
    expect(result.result).toContain('# Docs');
    expect(result.result).toContain('Source: https://example.com/a (HTTP 200, text/html; charset=utf-8)');
    expect(result.result).toContain('Hello there');
  });

  it('adds https:// to a scheme-less URL', async () => {
    mockExecFilePromise.mockResolvedValue(curlResponse('<p>ok</p>'));

    await executeReadUrl(mockLogger, { url: 'example.com/a' }, allowAll);

    const args = mockExecFilePromise.mock.calls[0][1];
    expect(args[args.length - 1]).toBe('https://example.com/a');
  });

  it('truncates long pages and says how to fetch the next slice', async () => {
    mockExecFilePromise.mockResolvedValue(curlResponse(`<p>${'x'.repeat(50)}</p>`));

    const result = await executeReadUrl(
      mockLogger,
      { url: 'https://example.com/a', max_chars: 20 },
      allowAll,
    );

    expect(result.success).toBe(true);
    expect(result.result).toContain('[truncated at 20 of 50 chars');
    expect(result.result).toContain('start_char=20');
  });

  it('resumes from start_char', async () => {
    mockExecFilePromise.mockResolvedValue(curlResponse(`<p>${'ab'.repeat(30)}</p>`));

    const result = await executeReadUrl(
      mockLogger,
      { url: 'https://example.com/a', max_chars: 10, start_char: 40 },
      allowAll,
    );

    expect(result.result).toContain('ababababab');
    expect(result.result).toContain('[truncated at 50 of 60 chars');
  });

  it('omits the truncation note when the last slice ends the page', async () => {
    mockExecFilePromise.mockResolvedValue(curlResponse(`<p>${'ab'.repeat(30)}</p>`));

    const result = await executeReadUrl(
      mockLogger,
      { url: 'https://example.com/a', max_chars: 10, start_char: 50 },
      allowAll,
    );

    expect(result.result).not.toContain('[truncated');
  });

  it('passes plain text and JSON straight through without stripping', async () => {
    mockExecFilePromise.mockResolvedValue(curlResponse('{"a": "<b>"}', 200, 'application/json'));

    const result = await executeReadUrl(mockLogger, { url: 'https://example.com/a.json' }, allowAll);

    expect(result.success).toBe(true);
    expect(result.result).toContain('{"a": "<b>"}');
  });

  it('refuses a binary response instead of dumping bytes', async () => {
    mockExecFilePromise.mockResolvedValue(curlResponse('%PDF-1.4 ...', 200, 'application/pdf'));

    const result = await executeReadUrl(mockLogger, { url: 'https://example.com/a.pdf' }, allowAll);

    expect(result.success).toBe(false);
    expect(result.error).toContain('application/pdf');
  });

  it('reports an HTTP error status', async () => {
    mockExecFilePromise.mockResolvedValue(curlResponse('<h1>Not Found</h1>', 404));

    const result = await executeReadUrl(mockLogger, { url: 'https://example.com/a' }, allowAll);

    expect(result.success).toBe(false);
    expect(result.error).toContain('HTTP 404');
  });

  it('explains an empty render rather than returning a blank result', async () => {
    mockExecFilePromise.mockResolvedValue(curlResponse('<html><body><div id="root"></div></body></html>'));

    const result = await executeReadUrl(mockLogger, { url: 'https://example.com/a' }, allowAll);

    expect(result.success).toBe(false);
    expect(result.error).toContain('JavaScript');
  });

  it('lists links only when include_links is set', async () => {
    const html = '<p>text</p><a href="/next">Next page</a>';
    mockExecFilePromise.mockResolvedValue(curlResponse(html));

    const without = await executeReadUrl(mockLogger, { url: 'https://example.com/a' }, allowAll);
    expect(without.result).not.toContain('Links:');

    mockExecFilePromise.mockResolvedValue(curlResponse(html));
    const with_ = await executeReadUrl(
      mockLogger,
      { url: 'https://example.com/a', include_links: true },
      allowAll,
    );
    expect(with_.result).toContain('- Next page — https://example.com/next');
  });

  it('rejects a non-http protocol before touching the network', async () => {
    const result = await executeReadUrl(mockLogger, { url: 'file:///etc/passwd' }, allowAll);

    expect(mockExecFilePromise).not.toHaveBeenCalled();
    expect(result.success).toBe(false);
    expect(result.error).toContain('Unsupported protocol');
  });

  it('reports a timeout in seconds', async () => {
    mockExecFilePromise.mockRejectedValue(new Error('timeout'));

    const result = await executeReadUrl(
      mockLogger,
      { url: 'https://example.com/a', timeout: 5 },
      allowAll,
    );

    expect(result.success).toBe(false);
    expect(result.error).toBe('Request timeout after 5 seconds');
  });

  it('reports an unreachable host when curl returns nothing', async () => {
    mockExecFilePromise.mockResolvedValue('');

    const result = await executeReadUrl(mockLogger, { url: 'https://example.com/a' }, allowAll);

    expect(result.success).toBe(false);
    expect(result.error).toContain('no response from curl');
  });
});

describe('create', () => {
  function register(isEnabled: () => boolean): ToolDefinition {
    const context = {
      security: { gateUrl: allowAll },
      pluginEnablement: { isEnabled },
    } as unknown as ToolPluginContext;
    let registered: ToolDefinition | undefined;
    const fakeRegistry = {
      extend: vi.fn((_point, value: ToolDefinition) => { registered = value; }),
    } as unknown as PluginRegistry;
    create(context).setup(fakeRegistry);
    return registered!;
  }

  it('is enabled when trusted and the plugin is enabled', () => {
    expect(register(() => true).enabled({ trusted: true })).toBe(true);
  });

  it('is disabled when the plugin is administratively disabled, even when trusted', () => {
    expect(register(() => false).enabled({ trusted: true })).toBe(false);
  });

  it('is disabled for an untrusted sender', () => {
    expect(register(() => true).enabled({ trusted: false })).toBe(false);
  });
});
