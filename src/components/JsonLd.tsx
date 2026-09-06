/**
 * Emits a schema.org JSON-LD block.
 *
 * Structured data is the most reliable way for both search crawlers and AI
 * answer engines to read what a page *is* rather than inferring it from prose,
 * so every top-level route type declares one.
 *
 * `<` is escaped so a string in the data can never close the script tag early.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
