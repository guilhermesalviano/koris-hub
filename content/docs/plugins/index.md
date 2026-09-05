---
title: Plugins
order: 9
---

# Plugins

Plugins are how you extend Koris without touching its core. There are two plugin
families — [channels](/docs/channels) and [tools](/docs/tools) — that share the same
shape and the same kernel, described below. `plugins/` also holds
[skills](/docs/skills), but skills are a different kind of extension — plain Markdown,
synced by `SkillSyncService` rather than the kernel this page describes.

## The kernel

`plugins/registry.ts` holds the family-agnostic core: `ExtensionPoint`,
`PluginRegistry`, and `buildRegistry`. Both families build on it. At startup
`core/src/app.ts` builds one shared `PluginRegistry` from the channel plugins and the
tool plugins together.

## Dependency inversion

A plugin imports **only** from its own family's `contracts.ts` and the shared
`plugins/registry.ts`. It never imports from `core/src/`, and never from the other
family's `contracts.ts`.

Core depends on the SDKs and injects concrete services the other way, through a
`PluginContext` (channels) or `ToolPluginContext` (tools) assembled at the composition
root, `core/src/app.ts`. Each plugin folder exposes a `create(context)` function that
receives that context.

The one documented exception is `plugins/tools/create-tool/`, which reaches into
`scripts/scaffold-tool.ts` to generate new tool folders.

## Discovery

The scanner loads every subdirectory of a family folder — `plugins/channels/` and
`plugins/tools/`. Files that sit directly in those folders, such as `contracts.ts`, are
skipped. Adding a plugin means adding a folder; for tools, `pnpm scaffold:tool <name>`
creates one for you. No core changes are required. (`plugins/skills/` sits alongside
these two, but isn't scanned here — see [Skills](/docs/skills) for how it's synced.)

## On/off state

Enablement lives in the database, in the `plugin_settings` table: `family`, `name`, and
`enabled`, with a primary key of `(family, name)`. `resolvePluginEnabled` reads the row
and falls back to a code-level default when no row exists yet.

Toggling is live — no restart. `PluginCatalogSingleton` keeps every registered
`{ family, name }` pair so the admin API can list plugins without rescanning disk. See
the [admin dashboard](/docs/admin-dashboard) for the Plugins panel.

Channel plugins still keep their secrets and the `allow_unlisted_senders` trust flag in
each folder's `config.yml`; only the `enabled` flag moved to the database.
