import { describe, it, expect } from 'vitest';
import { collapseWhitespace, decodeEntities, extractLinks, paginate, stripHtml } from './extract';

describe('decodeEntities', () => {
  it('decodes the named entities pages actually use', () => {
    expect(decodeEntities('Tom &amp; Jerry &lt;3 &quot;quotes&quot;')).toBe('Tom & Jerry <3 "quotes"');
  });

  it('decodes decimal and hexadecimal numeric entities', () => {
    expect(decodeEntities('caf&#233; &#x2014; open')).toBe('café — open');
  });

  it('decodes &nbsp; to a plain space so it collapses like other whitespace', () => {
    expect(decodeEntities('a&nbsp;b')).toBe('a b');
  });

  it('leaves an unknown entity untouched rather than dropping text', () => {
    expect(decodeEntities('&notarealentity; &amp;')).toBe('&notarealentity; &');
  });

  it('leaves an out-of-range numeric entity untouched instead of throwing', () => {
    expect(decodeEntities('&#x110000;')).toBe('&#x110000;');
  });
});

describe('collapseWhitespace', () => {
  it('trims lines, squeezes spaces, and caps blank runs at one', () => {
    expect(collapseWhitespace('  a   b  \n\n\n\n   c  ')).toBe('a b\n\nc');
  });
});

describe('stripHtml', () => {
  const page = `
    <html>
      <head>
        <title>  Example &amp; Co  </title>
        <meta name="description" content="should not appear">
        <style>body { color: red }</style>
      </head>
      <body>
        <nav>Home About Contact</nav>
        <h1>Heading</h1>
        <p>First paragraph with <a href="/x">a link</a>.</p>
        <p>Second&nbsp;paragraph.</p>
        <script>console.log('nope')</script>
        <footer>© 2026</footer>
      </body>
    </html>
  `;

  it('extracts the title, decoded and trimmed', () => {
    expect(stripHtml(page).title).toBe('Example & Co');
  });

  it('keeps body prose and the text of inline links', () => {
    const { text } = stripHtml(page);
    expect(text).toContain('Heading');
    expect(text).toContain('First paragraph with a link .');
    expect(text).toContain('Second paragraph.');
  });

  it('drops script, style, nav, footer and head metadata', () => {
    const { text } = stripHtml(page);
    expect(text).not.toContain('console.log');
    expect(text).not.toContain('color: red');
    expect(text).not.toContain('Home About Contact');
    expect(text).not.toContain('2026');
    expect(text).not.toContain('should not appear');
  });

  it('puts block elements on their own lines', () => {
    // Both the opening and closing tag become newlines, so paragraphs end up
    // separated by one blank line.
    expect(stripHtml('<p>one</p><p>two</p>').text).toBe('one\n\ntwo');
  });

  it('returns a null title when the page has none', () => {
    expect(stripHtml('<p>hi</p>').title).toBeNull();
  });
});

describe('extractLinks', () => {
  const html = `
    <a href="/about">About us</a>
    <a href='https://other.example/page'>Other</a>
    <a href="/about">About again</a>
    <a href="#section">Anchor</a>
    <a href="javascript:void(0)">Script</a>
    <a href="mailto:x@example.com">Mail</a>
  `;

  it('resolves relative hrefs against the page URL and labels them', () => {
    const links = extractLinks(html, 'https://example.com/docs/', 10);
    expect(links[0]).toBe('About us — https://example.com/about');
  });

  it('keeps absolute hrefs as they are', () => {
    expect(extractLinks(html, 'https://example.com/', 10)).toContain('Other — https://other.example/page');
  });

  it('drops duplicates, anchors, and non-navigable schemes', () => {
    const links = extractLinks(html, 'https://example.com/', 10);
    expect(links).toHaveLength(2);
  });

  it('honours the limit', () => {
    expect(extractLinks(html, 'https://example.com/', 1)).toHaveLength(1);
  });
});

describe('paginate', () => {
  it('returns the whole text and no next offset when it fits', () => {
    expect(paginate('hello', 0, 100)).toEqual({ body: 'hello', total: 5, nextStart: null });
  });

  it('reports where the next slice starts when it does not fit', () => {
    expect(paginate('abcdefghij', 0, 4)).toEqual({ body: 'abcd', total: 10, nextStart: 4 });
  });

  it('resumes from start_char', () => {
    expect(paginate('abcdefghij', 4, 4)).toEqual({ body: 'efgh', total: 10, nextStart: 8 });
  });

  it('clamps a start_char past the end instead of throwing', () => {
    expect(paginate('abc', 99, 10)).toEqual({ body: '', total: 3, nextStart: null });
  });
});
