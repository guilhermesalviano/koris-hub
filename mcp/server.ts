import * as z from 'zod/v4';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import { getAllEntries, getEntry } from '../src/lib/marketplace';
import type { CatalogEntry, Family } from '../content/marketplace/schema';

const FAMILIES = ['tool', 'channel', 'skill', 'mcp'] as const satisfies readonly Family[];
const CATALOG_URI = 'koris://marketplace/catalog';

type SearchInput = {
  query?: string;
  family?: Family;
  tags?: string[];
};

function textResult(value: unknown) {
  return {
    content: [{ type: 'text' as const, text: JSON.stringify(value, null, 2) }],
  };
}

function searchEntries(entries: CatalogEntry[], input: SearchInput): CatalogEntry[] {
  const terms = (input.query ?? '')
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
  const tags = (input.tags ?? []).map((tag) => tag.trim().toLowerCase()).filter(Boolean);

  return entries.filter((entry) => {
    if (input.family && entry.family !== input.family) return false;

    if (tags.length > 0 && !tags.every((tag) => entry.tags.some((entryTag) => entryTag.toLowerCase() === tag))) {
      return false;
    }

    if (terms.length === 0) return true;

    const searchableText = [
      entry.name,
      entry.slug,
      entry.family,
      entry.type ?? '',
      entry.summary,
      entry.description,
      ...entry.tags,
      ...(entry.readWhen ?? []),
      entry.toolName ?? '',
    ]
      .join(' ')
      .toLowerCase();

    return terms.every((term) => searchableText.includes(term));
  });
}

function entryUri(entry: CatalogEntry): string {
  return `koris://marketplace/${entry.family}/${entry.slug}`;
}

export function createServer(): McpServer {
  const entries = getAllEntries();
  const server = new McpServer({
    name: 'koris-hub',
    version: '0.1.0',
  });

  server.registerTool(
    'search_marketplace',
    {
      title: 'Search Koris Marketplace',
      description:
        'Find Koris tools, channels, skills, and MCP servers by free-text query, family, or exact tags. This only searches the catalog; it does not execute plugins.',
      inputSchema: {
        query: z.string().optional().describe('Words to find in names, descriptions, tags, or triggers.'),
        family: z.enum(FAMILIES).optional().describe('Limit results to a tool, channel, skill, or mcp server.'),
        tags: z.array(z.string()).optional().describe('Require all of these exact tags.'),
      },
      annotations: {
        readOnlyHint: true,
        openWorldHint: false,
      },
    },
    async (input) => {
      const results = searchEntries(entries, input);
      const structuredContent = { total: results.length, entries: results };

      return {
        ...textResult(structuredContent),
        structuredContent,
      };
    },
  );

  server.registerTool(
    'get_marketplace_entry',
    {
      title: 'Get Koris Marketplace Entry',
      description:
        'Return the complete catalog entry for one Koris plugin by slug. This only returns metadata and source links; it does not install or execute the plugin.',
      inputSchema: {
        slug: z.string().min(1).describe('The marketplace slug, for example read-url or telegram.'),
        family: z.enum(FAMILIES).optional().describe('Optional family check for the slug.'),
      },
      annotations: {
        readOnlyHint: true,
        openWorldHint: false,
      },
    },
    async ({ slug, family }) => {
      const entry = getEntry(slug);
      if (!entry || (family && entry.family !== family)) {
        const message = family
          ? `No ${family} marketplace entry exists for slug "${slug}".`
          : `No marketplace entry exists for slug "${slug}".`;
        return {
          isError: true,
          content: [{ type: 'text' as const, text: message }],
        };
      }

      return {
        ...textResult(entry),
        structuredContent: { entry },
      };
    },
  );

  server.registerResource(
    'marketplace-catalog',
    CATALOG_URI,
    {
      title: 'Koris Marketplace Catalog',
      description: 'The complete read-only catalog of Koris tools, channels, skills, and MCP servers.',
      mimeType: 'application/json',
    },
    async () => ({
      contents: [{ uri: CATALOG_URI, mimeType: 'application/json', text: JSON.stringify(entries, null, 2) }],
    }),
  );

  for (const entry of entries) {
    const uri = entryUri(entry);
    server.registerResource(
      `marketplace-${entry.family}-${entry.slug}`,
      uri,
      {
        title: entry.name,
        description: entry.summary,
        mimeType: 'application/json',
      },
      async () => ({
        contents: [{ uri, mimeType: 'application/json', text: JSON.stringify(entry, null, 2) }],
      }),
    );
  }

  return server;
}

async function main(): Promise<void> {
  const server = createServer();
  await server.connect(new StdioServerTransport());
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.stack ?? error.message : String(error));
  process.exitCode = 1;
});
