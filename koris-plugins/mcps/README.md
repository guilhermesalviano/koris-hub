# koris-plugins/mcps/

Canonical source for `koris` **MCP (Model Context Protocol)** server plugins whose
source has been removed from the `koris` repo and now lives here instead. Same
idea as `koris-plugins/tools/`, `koris-plugins/skills/`, and
`koris-plugins/channels/`: this is the actual, maintained TypeScript source, not a
vendored/read-only snapshot. Nothing here is built, imported, or executed by this
Next.js app (`koris-plugins` is in `tsconfig.json`'s `exclude`).

## Layout

Mirrors the path convention used in `koris`: `koris-plugins/mcps/<slug>/...`,
matching `sourcePath` in `content/marketplace/mcps/<slug>.json` (whose `sourceUrl`
points back at this repo).

```
koris-plugins/mcps/<slug>/
  index.ts            Plugin factory; registers on MCP_SERVERS extension point
  config.ts           Typed configuration helper (via definePluginConfig)
  config.example.yml  Config template with fallback URL and token settings
  config.yml          RUNTIME ONLY — git-ignored, not committed
```

## How Koris interacts with MCP servers

MCP integrations connect Koris to remote or local MCP servers over Streamable
HTTP (`/api/mcp`). Koris owns the Streamable HTTP client, discovers each enabled
server's exposed tools dynamically, and registers them into its standard tool
execution pipeline with a `<server>__<tool>` prefix.

Server credentials and endpoints are loaded via `config.yml` or corresponding
environment variables (e.g. `COREDASH_MCP_URL`, `COREDASH_MCP_BEARER_TOKEN`).

MCP servers are disabled by default upon initial download. They can be enabled or
disabled at runtime without restarting the server:
- Via `/mcps enable <slug>` or `/mcps disable <slug>` in chat
- Via the Plugins panel in the web admin dashboard
- Via `PATCH /api/admin/plugins/mcps/<name>`

## Contents

1 MCP server:

- `coredash/` — Connects Koris to the [Coredash](https://github.com/guilhermesalviano/coredash) personal assistant dashboard (a lightweight, self-hosted personal dashboard for personal automation, system monitoring, habit tracking, and home-lab workflows),
  enabling tools for calendar, tasks, emails, and system operations.

## How `koris` consumes these

`koris` pulls an MCP server plugin on demand:
- From the terminal: `pnpm hub:pull <slug>`
- From trusted chat: `/mcps download <slug> [--force]`
- From the admin marketplace: click **Pull**

The `.ts` source and `config.example.yml` come from this folder over
`raw.githubusercontent.com` into `plugins/mcps/<slug>/`. Koris's `McpSyncService`
detects the new plugin on disk within ~500ms and registers it without requiring a
rebuild or restart.

## Adding another MCP server plugin here

1. Move or create its directory under `koris-plugins/mcps/<slug>/` (source +
   `config.example.yml`; leave runtime `config.yml` behind).
2. Add the matching `content/marketplace/mcps/<slug>.json` with `sourcePath`
   and `sourceUrl` pointing here.
3. Note the addition in this file, in `koris-plugins/README.md`, and in
   `AGENTS.md`'s "Relationship to koris" section.
