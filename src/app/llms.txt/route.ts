import { SITE_URL } from '@/lib/constants';
import { getAllDocSlugs, getDoc, summarize } from '@/lib/docs';
import { getFamilyGroups } from '@/lib/marketplace';
import { localePath } from '@/i18n/locales';

// Static export: this GET handler runs at `next build` and its body is written
// to out/llms.txt. Generated rather than hand-written so it cannot drift from
// the docs tree and the marketplace catalog the way a checked-in copy would.
export const dynamic = 'force-static';

/**
 * llms.txt — a plain-Markdown map of the site for AI answer engines, which
 * would otherwise have to infer structure from rendered HTML. Convention:
 * https://llmstxt.org
 */
function buildLlmsTxt(): string {
  const docs = getAllDocSlugs()
    .map((slug) => {
      const doc = getDoc(slug);
      if (!doc) return null;
      const summary = summarize(doc.content, 120);
      const url = `${SITE_URL}/docs/${slug.join('/')}/`;
      return `- [${doc.meta.title}](${url})${summary ? `: ${summary}` : ''}`;
    })
    .filter(Boolean)
    .join('\n');

  const catalog = getFamilyGroups()
    .map((group) => {
      const items = group.entries
        .map(
          (entry) =>
            `- [${entry.name}](${SITE_URL}/marketplace/${entry.slug}/)${
              entry.toolName ? ` (\`${entry.toolName}\`)` : ''
            }: ${entry.summary}`,
        )
        .join('\n');
      return `### ${group.label}\n\n${items}`;
    })
    .join('\n\n');

  return `# Koris

> Koris is an open-source, self-hosted AI agent framework written in TypeScript.
> It receives messages through pluggable channels (Telegram, WhatsApp, a terminal
> UI, and a web dashboard), runs them through an LLM, and executes tools on the
> user's behalf. Memory and sessions persist in a local SQLite database, so state
> survives restarts.

Koris runs on your own infrastructure — there is no hosted service and no
subscription. It is provider-agnostic: you point it at the LLM provider you
choose. Source: https://github.com/guilhermesalviano/koris

Key facts:

- License: ISC (open source)
- Language: TypeScript; requires Node.js >= 24 and pnpm
- Extended by **tools** (executable TypeScript plugins the model calls) and
  **skills** (Markdown files that teach the agent a procedure, no code)
- Security model: outbound network tools are gated by a domain allowlist, and
  trust is decided per channel — untrusted senders receive no tools and no skills

## Documentation

${docs}

## Português (pt-BR)

The whole site is also published in Brazilian Portuguese under
${SITE_URL}/pt-br/ — same pages, same structure, translated content. Each
English URL declares its pt-BR counterpart via hreflang, and vice versa.

- [Início](${SITE_URL}${localePath('pt-br', '/')})
- [Documentação](${SITE_URL}${localePath('pt-br', '/docs/')})
- [Marketplace](${SITE_URL}${localePath('pt-br', '/marketplace/')})

## Marketplace

The tools, channels, and skills bundled with Koris.

${catalog}
`;
}

export function GET() {
  return new Response(buildLlmsTxt(), {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
}
