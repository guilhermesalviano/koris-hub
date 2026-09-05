---
title: Tools
order: 7
---

# Tools

Tools are the AI agent's capabilities — the actions it can take beyond replying with
text. Each one is a [plugin](/docs/plugins) under `plugins/tools/`, one folder per tool,
and each folder owns its own LLM-facing schema, its handler, and the rules for when it
is offered.

## How a tool call runs

At boot the framework scans `plugins/tools/`, collects every `ToolDefinition`, and
stores the list in `ToolPluginsSingleton`. When the model emits a tool call,
`AgnosticExecutionTool` matches the call's name against that list and runs the matching
definition's `handler`.

Every definition also carries an `enabled(opts)` filter that decides whether the tool is
even shown to the model for a given turn. It keys on the sender's trust level, whether
stickers are enabled, and — for the beat tools — whether the call is coming from a
heartbeat run.

## Built-in tools

| Tool | What it does |
| --- | --- |
| `curl_request` | Makes an HTTP request. Gated by the domain allowlist — see [Security](/docs/security). |
| `search_engine` | Web search through a self-hosted SearXNG instance (`ai.searxng_url`). |
| `read_url` | Opens a page and returns its readable text — the follow-up to a `search_engine` result. Gated by the domain allowlist; names the `/allow` command when a host is blocked. |
| `restart_search_engine` | Recovers `search_engine` from connection or 403 failures. Requires confirmation; runs `scripts/run_search_engine.sh --restart`. |
| `issue` | GitHub issue tracking. |
| `set_beat` | Creates a cron-scheduled beat (a [heartbeat](/docs/concepts) agent). |
| `list_beats` | Lists the configured beats. |
| `update_beat` | Changes an existing beat. |
| `delete_beat` | Removes a beat. |
| `send_message` | Sends a message on a channel outside the current turn. |
| `learn_sticker` | Records a rule for when to send a sticker. |
| `send_sticker` | Sends a sticker. |
| `unlearn_sticker` | Removes a sticker rule. |
| `create_tool` | Scaffolds a new tool plugin from chat. Disabled by default, requires confirmation, and is never usable in the same process — plugins are discovered only at startup, so a restart is needed. |

## Enabling and disabling

On/off state is stored in the database, in the `plugin_settings` table — not in a config
file. Every tool defaults to enabled except `create_tool`, which defaults to disabled.
Toggling takes effect immediately, with no restart, from the Plugins panel or the setup
wizard in the [admin dashboard](/docs/admin-dashboard).

Untrusted senders get no tools at all — including search and stickers. See
[Security](/docs/security) for how trust is decided.

## Adding a tool

Add a folder under `plugins/tools/`, or scaffold one:

```bash
pnpm scaffold:tool <name> --description "..."
```

No changes to `core/` are needed — the scanner picks up the new folder at the next
startup. See [Plugins](/docs/plugins) for the plugin contract.

To browse the tools that ship with Koris, see the [marketplace](/marketplace).
