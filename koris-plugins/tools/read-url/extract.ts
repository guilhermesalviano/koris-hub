/**
 * HTML → readable text, with no parser dependency.
 *
 * Deliberately regex-based: no plugin in this family pulls a DOM library, and a
 * page fetched from a search result only has to be good enough for the model to
 * read. Everything here is pure and network-free so it can be unit-tested
 * without spawning curl.
 */

/** Blocks whose *contents* are chrome or code, not page text. */
const DROPPED_BLOCKS = /<(script|style|noscript|svg|template|nav|footer|aside|form)\b[^>]*>[\s\S]*?<\/\1\s*>/gi;
const COMMENTS = /<!--[\s\S]*?-->/g;
const HEAD = /<head\b[^>]*>[\s\S]*?<\/head\s*>/gi;
const TITLE = /<title[^>]*>([\s\S]*?)<\/title>/i;
/** Tags that end a visual line — replaced by a newline rather than a space. */
const BLOCK_BOUNDARY = /<\/?(?:p|div|section|article|header|h[1-6]|li|ul|ol|dl|dt|dd|tr|table|thead|tbody|blockquote|pre|hr|br)\b[^>]*>/gi;
const ANY_TAG = /<[^>]+>/g;

const ANCHOR = /<a\b[^>]*\shref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))[^>]*>([\s\S]*?)<\/a\s*>/gi;
const NON_NAVIGABLE = /^(?:javascript|mailto|tel|data|blob):/i;

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'",
  // Decoded to a plain space so whitespace collapsing can do its job.
  nbsp: ' ', ensp: ' ', emsp: ' ', thinsp: ' ',
  mdash: '—', ndash: '–', hellip: '…', middot: '·', bull: '•',
  lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”',
  laquo: '«', raquo: '»', copy: '©', reg: '®', trade: '™', deg: '°',
  times: '×', divide: '÷', plusmn: '±', frac12: '½', euro: '€', pound: '£', yen: '¥', cent: '¢',
};

export function decodeEntities(input: string): string {
  return input.replace(/&(#[xX][0-9a-fA-F]+|#\d+|[a-zA-Z][a-zA-Z0-9]*);/g, (match, body: string) => {
    if (body.startsWith('#')) {
      const codePoint = body[1] === 'x' || body[1] === 'X'
        ? parseInt(body.slice(2), 16)
        : parseInt(body.slice(1), 10);
      if (!Number.isFinite(codePoint)) return match;
      try {
        return String.fromCodePoint(codePoint);
      } catch {
        // Out of range or a lone surrogate — leave the entity as written.
        return match;
      }
    }
    return NAMED_ENTITIES[body.toLowerCase()] ?? match;
  });
}

function stripTags(input: string): string {
  return input.replace(ANY_TAG, ' ');
}

/** Trim each line, squeeze runs of spaces, and cap blank runs at one. */
export function collapseWhitespace(input: string): string {
  return input
    .split('\n')
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export interface Page {
  title: string | null;
  text: string;
}

export function stripHtml(html: string): Page {
  const titleMatch = TITLE.exec(html);
  const title = titleMatch
    ? collapseWhitespace(decodeEntities(stripTags(titleMatch[1]))).replace(/\n+/g, ' ').trim()
    : '';

  const text = collapseWhitespace(
    decodeEntities(
      html
        .replace(COMMENTS, ' ')
        .replace(DROPPED_BLOCKS, ' ')
        // Title is already captured above; the rest of <head> is metadata noise.
        .replace(HEAD, ' ')
        .replace(BLOCK_BOUNDARY, '\n')
        .replace(ANY_TAG, ' '),
    ),
  );

  return { title: title || null, text };
}

/**
 * Absolute, de-duplicated hrefs, so the model can follow a link without going
 * back to search. Anchors and non-navigable schemes are dropped.
 */
export function extractLinks(html: string, baseUrl: string, limit: number): string[] {
  const seen = new Set<string>();
  const links: string[] = [];

  for (const match of html.matchAll(ANCHOR)) {
    if (links.length >= limit) break;

    const href = (match[1] ?? match[2] ?? match[3] ?? '').trim();
    if (!href || href.startsWith('#') || NON_NAVIGABLE.test(href)) continue;

    let resolved: string;
    try {
      resolved = new URL(href, baseUrl).toString();
    } catch {
      continue;
    }
    if (seen.has(resolved)) continue;
    seen.add(resolved);

    const label = collapseWhitespace(decodeEntities(stripTags(match[4]))).replace(/\n+/g, ' ').trim();
    links.push(label ? `${label} — ${resolved}` : resolved);
  }

  return links;
}

export interface Excerpt {
  body: string;
  total: number;
  /** Offset to pass back as `start_char` for the next slice, or null at the end. */
  nextStart: number | null;
}

export function paginate(text: string, startChar: number, maxChars: number): Excerpt {
  const total = text.length;
  const start = Math.min(Math.max(startChar, 0), total);
  const body = text.slice(start, start + Math.max(maxChars, 1));
  const end = start + body.length;

  return { body, total, nextStart: end < total ? end : null };
}
