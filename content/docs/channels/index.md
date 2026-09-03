---
title: Channels
order: 5
---

# Channels

A channel is a message entry point. Koris runs the same agent behind every channel;
the channel plugin only handles transport and normalisation.

## How a message enters

A channel plugin receives a raw message from its platform, normalises it into an
`InboundChannelMessage`, and delegates to the generic `IChannelHandler`. The handler
applies the channel rules — group-mention filter, trust-based gating of tools and
learned skills, prompt prefixing, reply splitting — and then calls
`MessageGateway.handle`. From there the flow is identical regardless of channel. See
[Concepts](/docs/concepts) for the rest of the path.

## Built-in channels

- **Telegram** — via `@guilhermesalviano/telegram-bot`.
- **WhatsApp** — via Baileys (`@whiskeysockets/baileys`).
- **TUI** — the terminal UI in `apps/tui/`. Run it with `pnpm app --tui`.
- **Web dashboard chat** — served on port 3000. See [Admin dashboard](/docs/admin-dashboard).

Browse the full set on the [marketplace](/marketplace).

## Trust and unlisted senders

Each channel's `config.yml` holds its secrets — `bot_token`, `whitelist`, and so on —
plus a per-channel `allow_unlisted_senders` flag on `telegram` and `whatsapp`. When
that flag is set, a sender who is not on the whitelist is still answered, but as an
untrusted sender: no tools of any kind (including stickers and search) and no learned
skills. The flag is read on demand, so a change takes effect without a restart, and it
has a toggle on the Channels settings page. See [Security](/docs/security) for what
untrusted access means.

## Enabling and disabling

A channel's on/off state is DB-backed in the `plugin_settings` table, not in
`config.yml`. Toggle it live from the admin Plugins panel or the setup wizard; no
restart is needed. Only the `enabled` flag moved to the database — secrets stay in
`config.yml`. See [Admin dashboard](/docs/admin-dashboard).

## Adding a channel

Add a folder under `plugins/channels/` that exposes `create(context)` and registers a
`ChannelDefinition` on the `ADAPTERS` extension point. No core changes are required.
See [Plugins](/docs/plugins).
