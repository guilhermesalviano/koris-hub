# Koris Hub MCP server

This directory contains a read-only Model Context Protocol server for the Koris
marketplace catalog. It helps an AI agent discover tools, channels, and skills;
it does not install or execute plugin code.

## Run locally over stdio

```bash
pnpm mcp:stdio
```

Example client configuration:

```json
{
  "mcpServers": {
    "koris-hub": {
      "command": "pnpm",
      "args": ["--dir", "/absolute/path/to/koris-hub", "mcp:stdio"]
    }
  }
}
```

The server exposes:

- `search_marketplace` — search by text, family, and tags;
- `get_marketplace_entry` — retrieve one complete entry by slug;
- `koris://marketplace/catalog` — the complete catalog resource;
- `koris://marketplace/{family}/{slug}` — one resource per catalog entry.

The catalog JSON files under `content/marketplace/` remain the source of truth.
The server is intentionally separate from the statically exported Next.js app;
remote Streamable HTTP hosting can be added later without changing the catalog
or the website deployment.
