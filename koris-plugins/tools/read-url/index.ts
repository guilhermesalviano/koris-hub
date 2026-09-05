import { URL } from 'node:url';
import type { ILogger, Plugin, ToolPluginContext, ToolResult } from '../contracts';
import { COMMANDS } from '../contracts';
import { defineTool } from '../define-tool';
import {
  execFilePromise,
  getOptionalBooleanArg,
  getOptionalNumberArg,
  getRequiredStringArg,
} from '../runtime';
import { extractLinks, paginate, stripHtml } from './extract';
import { TOOL_NAME } from './constants';

export { TOOL_NAME };

const DEFAULT_MAX_CHARS = 8000;
const MAX_RESULT_OUTPUT = 20000;
const DEFAULT_TIMEOUT_SECONDS = 30;
const MAX_LINKS = 30;
const MAX_DOWNLOAD_BYTES = 5_000_000;
const MAX_REDIRECTS = 5;
const USER_AGENT = 'Koris/1.0 (+https://hub.koaris.com)';
const ACCEPT =
  'text/html,application/xhtml+xml,application/xml;q=0.9,text/plain;q=0.8,*/*;q=0.5';

/**
 * curl writes this once per transfer via `-w`. Greedy `(.*)` so a content type
 * containing hyphens (`application/x-www-form-urlencoded`) survives intact.
 */
const META_PREFIX = '---KORIS_META:';
const META_PATTERN = /^---KORIS_META:(\d{3}):(.*)---$/;

export function buildFetchArgs(url: string, timeoutSeconds: number): string[] {
  return [
    '-s',
    // No `-k` here, unlike curl_request: this tool reads arbitrary pages found
    // through search, so a certificate it cannot verify is a reason to fail.
    '-L', '--max-redirs', String(MAX_REDIRECTS),
    '--compressed',
    '--max-filesize', String(MAX_DOWNLOAD_BYTES),
    '--max-time', String(timeoutSeconds),
    '-A', USER_AGENT,
    '-H', `Accept: ${ACCEPT}`,
    '-w', `\n${META_PREFIX}%{http_code}:%{content_type}---`,
    url,
  ];
}

export interface FetchedResponse {
  status: number;
  contentType: string;
  body: string;
}

export function parseResponse(raw: string): FetchedResponse {
  const lines = raw.split('\n');
  const markers = lines.filter((line) => META_PATTERN.test(line));
  const body = lines.filter((line) => !META_PATTERN.test(line)).join('\n');

  // Parse the LAST marker — curl may emit one per redirect hop, and only the
  // final one reflects the resolved request.
  const match = markers.length ? META_PATTERN.exec(markers[markers.length - 1]) : null;
  if (!match) return { status: 0, contentType: '', body };

  return { status: parseInt(match[1], 10), contentType: match[2].trim().toLowerCase(), body };
}

export type ContentKind = 'html' | 'text' | 'binary';

export function classifyContent(contentType: string): ContentKind {
  const type = contentType.split(';')[0].trim();
  if (!type) return 'text';
  if (type === 'text/html' || type === 'application/xhtml+xml') return 'html';
  if (
    type.startsWith('text/') ||
    type === 'application/json' ||
    type === 'application/xml' ||
    type.endsWith('+json') ||
    type.endsWith('+xml')
  ) {
    return 'text';
  }
  return 'binary';
}

export async function executeReadUrl(
  logger: ILogger,
  args: Record<string, unknown>,
  gateUrl: (url: string) => string | null,
): Promise<ToolResult> {
  let url = getRequiredStringArg(args, 'url');
  if (!url) {
    return { toolName: TOOL_NAME, success: false, error: 'Missing required parameter: url' };
  }

  if (!url.match(/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//)) {
    url = `https://${url}`;
  }

  let target: URL;
  try {
    target = new URL(url);
  } catch {
    return { toolName: TOOL_NAME, success: false, error: `Invalid URL: ${url}` };
  }

  if (target.protocol !== 'http:' && target.protocol !== 'https:') {
    return {
      toolName: TOOL_NAME,
      success: false,
      error: `Unsupported protocol "${target.protocol}" — read_url only reads http:// and https:// pages.`,
    };
  }

  const encodedUrl = target.toString();

  // Same allowlist every network tool goes through. The difference is the
  // message: a search result is expected to be off-list, so say exactly how the
  // human can allow it instead of returning the bare gate error.
  const gateError = gateUrl(encodedUrl);
  if (gateError) {
    logger.warn('read_url blocked by domain gate', {
      url: encodedUrl,
      host: target.hostname,
      error: gateError,
    });
    return {
      toolName: TOOL_NAME,
      success: false,
      error:
        `Blocked by the domain allowlist: ${target.hostname} is not in allowed_domains. ` +
        `Ask the human whether to allow it — a trusted sender can reply "/allow ${target.hostname}", ` +
        `after which read_url will work for that domain from then on. ` +
        `Do not retry until they have confirmed. (${gateError})`,
    };
  }

  const maxChars = Math.min(
    Math.max(getOptionalNumberArg(args, 'max_chars', DEFAULT_MAX_CHARS), 1),
    MAX_RESULT_OUTPUT,
  );
  const startChar = Math.max(getOptionalNumberArg(args, 'start_char', 0), 0);
  const timeout = Math.max(getOptionalNumberArg(args, 'timeout', DEFAULT_TIMEOUT_SECONDS), 1);
  const includeLinks = getOptionalBooleanArg(args, 'include_links', false);

  logger.info('Reading URL', { url: encodedUrl, maxChars, startChar, timeout, includeLinks });

  let raw: string;
  try {
    raw = await execFilePromise('curl', buildFetchArgs(encodedUrl, timeout), timeout * 1000);
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    if (errorMsg.includes('timeout')) {
      logger.warn('read_url timed out', { url: encodedUrl, timeout });
      return { toolName: TOOL_NAME, success: false, error: `Request timeout after ${timeout} seconds` };
    }
    logger.error('read_url failed', { url: encodedUrl, error: errorMsg });
    return { toolName: TOOL_NAME, success: false, error: errorMsg };
  }

  const { status, contentType, body } = parseResponse(raw);

  if (status === 0) {
    return {
      toolName: TOOL_NAME,
      success: false,
      error: `Could not fetch ${encodedUrl} — no response from curl. The host may be unreachable, or the certificate could not be verified.`,
    };
  }

  if (status >= 400) {
    logger.warn('read_url got an error status', { url: encodedUrl, status });
    return {
      toolName: TOOL_NAME,
      success: false,
      error: `${encodedUrl} returned HTTP ${status}.`,
    };
  }

  const kind = classifyContent(contentType);
  if (kind === 'binary') {
    return {
      toolName: TOOL_NAME,
      success: false,
      error: `${encodedUrl} is ${contentType || 'a binary file'}, which read_url cannot turn into text. Only HTML and text formats are readable.`,
    };
  }

  const page = kind === 'html' ? stripHtml(body) : { title: null, text: body.trim() };

  if (!page.text) {
    return {
      toolName: TOOL_NAME,
      success: false,
      error: `${encodedUrl} returned HTTP ${status} but no readable text — the page probably renders its content with JavaScript.`,
    };
  }

  const excerpt = paginate(page.text, startChar, maxChars);

  const sections: string[] = [];
  if (page.title) sections.push(`# ${page.title}`);
  sections.push(`Source: ${encodedUrl} (HTTP ${status}, ${contentType || 'unknown type'})`);
  sections.push('');
  sections.push(excerpt.body);

  if (includeLinks && kind === 'html') {
    const links = extractLinks(body, encodedUrl, MAX_LINKS);
    if (links.length) {
      sections.push('');
      sections.push('Links:');
      sections.push(...links.map((link) => `- ${link}`));
    }
  }

  if (excerpt.nextStart !== null) {
    sections.push('');
    sections.push(
      `[truncated at ${excerpt.nextStart} of ${excerpt.total} chars — call read_url again with start_char=${excerpt.nextStart} for more]`,
    );
  }

  logger.info('read_url completed', {
    url: encodedUrl,
    status,
    contentType,
    totalChars: excerpt.total,
    returnedChars: excerpt.body.length,
  });

  return {
    toolName: TOOL_NAME,
    success: true,
    result: sections.join('\n').slice(0, MAX_RESULT_OUTPUT),
  };
}

export function create(context: ToolPluginContext): Plugin {
  return {
    name: 'read-url',
    setup(registry) {
      const definition = defineTool({
        name: TOOL_NAME,
        description:
          'Fetch a web page and return its readable text with the HTML stripped out. ' +
          'Use this to actually read a page — most often the "link" of a search_engine result, ' +
          'when the result snippet is not enough to answer the question, or a URL the human pasted. ' +
          'Long pages come back one slice at a time: when the result ends with a "[truncated ...]" note, ' +
          'call the tool again with the start_char it gives you. ' +
          'If the tool reports that the domain is not in the allowlist, do not retry — tell the human ' +
          'which domain is blocked and ask whether they want to allow it with "/allow <domain>". ' +
          'For APIs and non-page requests (custom methods, headers, request bodies) use curl_request instead.',
        parameters: {
          url: {
            type: 'string',
            required: true,
            description: 'The page to read. Usually the "link" field of a search_engine result.',
          },
          max_chars: {
            type: 'number',
            description: `Characters of page text to return (default: ${DEFAULT_MAX_CHARS}, max: ${MAX_RESULT_OUTPUT}).`,
          },
          start_char: {
            type: 'number',
            description: 'Offset into the page text (default: 0). Use the value from a "[truncated ...]" note to read the next slice.',
          },
          timeout: {
            type: 'number',
            description: `Request timeout in seconds (default: ${DEFAULT_TIMEOUT_SECONDS}).`,
          },
          include_links: {
            type: 'boolean',
            description: `Also list up to ${MAX_LINKS} links found on the page, as absolute URLs (default: false). Use when you may need to follow one.`,
          },
        },
        handler: (logger, args) => executeReadUrl(logger, args, context.security.gateUrl),
        enabled: (opts) => opts.trusted && context.pluginEnablement.isEnabled('read-url'),
      });
      registry.extend(COMMANDS, definition);
    },
  };
}
