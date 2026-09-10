---
title: MCP Servers
order: 10
---

# MCP Servers

MCP (Model Context Protocol) server plugins allow Koris to connect to external
tool ecosystems and dashboards over Streamable HTTP without modifying core code.
Each integration is a [plugin](/docs/plugins) under `plugins/mcps/`, structured as
a standalone folder.

## How Koris connects to an MCP server

At startup, Koris scans `plugins/mcps/` for installed server plugins. Each plugin
registers a server descriptor on the `MCP_SERVERS` extension point.

When an MCP server is enabled:

1. `McpManager` opens a Streamable HTTP connection to the configured server URL
   (e.g. `http://mac.local:3000/api/mcp`), presenting the bearer token if provided.
2. The server returns its list of available tools and schemas.
3. Koris dynamically registers those tools into the standard tool execution
   pipeline, prefixed as `<server>__<tool>` (for example, `coredash__calendar`).
4. The model can invoke the tool seamlessly during reasoning turns. Calls are
   delegated back over the Streamable HTTP transport.

If an MCP server becomes unreachable, Koris logs a connection warning and
gracefully degrades. A connection failure never crashes the agent or blocks chat.
Koris retries connection when toggled, when its configuration is patched, or upon
process restart.

## Configuration

Server-specific settings live in each plugin's `config.yml` (and fall back to
environment variables defined in the plugin's `config.ts`):

```yaml
url: "http://mac.local:3000/api/mcp"
bearer_token: "secret_token_here"
```

Configuration can be updated live without restarting:
- In the **Plugins** panel in the [Admin dashboard](/docs/admin-dashboard) via the **Configure** modal.
- Via `PATCH /api/admin/mcps/<name>/config`.
- By directly editing `plugins/mcps/<name>/config.yml`.

## Enabling and disabling

Like tools and channels, MCP servers are DB-backed in the `plugin_settings` table:
`family: 'mcps'`, `name: '<slug>'`, `enabled: true|false`.

MCP servers default to disabled when first downloaded. Enable them using:
- **Chat**: `/mcps enable <name>` (trusted senders only)
- **Admin Dashboard**: Toggle on in the **Plugins** panel
- **Admin API**: `PATCH /api/admin/plugins/mcps/<name>`

## Slash commands

Trusted senders can inspect, download, and toggle MCP servers directly from chat
using `/mcps`:

| Command | Usage | Description |
| --- | --- | --- |
| `/mcps` | `/mcps` or `/mcps list` | List installed MCP servers and their connection state |
| `/mcps remote` | `/mcps remote` | List available MCP servers on Koris Hub |
| `/mcps download` | `/mcps download <name> [--force]` | Download and hot-load an MCP plugin from Koris Hub |
| `/mcps enable` | `/mcps enable <name>` | Enable an installed MCP server |
| `/mcps disable` | `/mcps disable <name>` | Disable an installed MCP server |

## Adding an MCP server plugin

To create a new MCP server plugin:

1. Create a folder under `plugins/mcps/<slug>/`.
2. Define a typed configuration using `definePluginConfig` in `config.ts`.
3. Provide a `config.example.yml` template.
4. Export a `create(context)` function in `index.ts` that extends `MCP_SERVERS`.

```ts
import type { McpPluginContext, Plugin } from '../contracts';
import { MCP_SERVERS } from '../contracts';
import { myMcpConfig } from './config';

const SERVER_NAME = 'my-server';

export function create(context?: McpPluginContext): Plugin | null {
  if (!context) return null;
  return {
    name: SERVER_NAME,
    setup(registry) {
      registry.extend(MCP_SERVERS, {
        name: SERVER_NAME,
        enabled: () => context.pluginEnablement.isEnabled(SERVER_NAME),
        loadConfig: () => myMcpConfig.load(),
        writeConfigPatch: (patch) => myMcpConfig.writePatch(patch),
      });
    },
  };
}
```

To browse available MCP servers or contribute one to the community, visit the
[Marketplace](/marketplace).
