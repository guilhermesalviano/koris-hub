---
title: Security
order: 13
---

# Security

Koris runs on your own infrastructure and talks to untrusted people over public
channels. The controls below limit what the agent can reach and who can drive it.

## Domain allowlist gate

Tools that reach the network — `curl_request`, `read_url` and `search_engine` — are
checked against an allowlist before they run. The allowlist is `allowed_domains` in
`koris.json`. A request to a host that is not on the list returns an error string
instead of running; an empty allowlist blocks all such requests.

The gate lives in `core/src/services/security/gate.ts`. Tool plugins never import it
directly — `core/src/app.ts` injects it into each tool as `context.security.gateUrl`.

Trusted senders can extend the allowlist at runtime with `/allow <domain>`. See
[Commands](/docs/commands).

`read_url` is built around that command: a page found through search is normally not
on the allowlist, so instead of a bare error it reports the blocked host and the exact
`/allow` line that permits it, and is told not to retry until a human has run it.

## Trust model

Trust is decided per channel. Each channel has a whitelist plus an
`allow_unlisted_senders` flag. When a sender is not on the whitelist:

- With `allow_unlisted_senders` off, they get no reply.
- With it on, they are answered as untrusted and get **no tools of any kind** —
  including stickers and search — and **no learned skills**.

Details of how each channel is configured are in [Channels](/docs/channels).

## Confirmation-gated tools

Some [tools](/docs/tools) never run on the model's say-so alone:

- `restart_search_engine` — requires explicit user confirmation. It recreates the
  self-hosted search stack to recover from connection or 403 failures.
- `create_tool` — requires confirmation, is disabled by default, and cannot take
  effect until the process restarts, because plugins are discovered only at startup.

## Command execution

Tool plugins that shell out share the helpers in `plugins/tools/runtime.ts`: no-shell
`spawn` / `execFile` (a structural defense against shell injection) and a 10 MB cap on
captured output. See [Plugins](/docs/plugins).

## Secret handling

The admin settings API deep-masks secrets in its responses, including `BOT_TOKEN`,
`API_TOKEN`, and `SEARCH_API_KEY`. Channel secrets stay in each channel plugin's
`config.yml`; only the enabled/disabled flag moved to the database.
