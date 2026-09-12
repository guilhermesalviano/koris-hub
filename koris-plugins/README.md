# koris-plugins/

Canonical source for `koris` plugins whose source has been removed from the
`koris` repo and now lives here instead. This is **not** a vendored/read-only
snapshot — it's the actual, maintained source. Nothing here is built,
imported, or executed by this Next.js app; it's kept alongside the site
purely so the plugin has a single home.

## Layout

Mirrors the path convention used in `koris`: `koris-plugins/<family>/<slug>/...`,
matching `sourcePath` in the corresponding
`content/marketplace/<family>/<slug>.json` entry (whose `sourceUrl` should
point back at this repo for these plugins). Four families live here:
`tools/` (below), `skills/` (see `skills/README.md`), `channels/` (see `channels/README.md`),
and `mcps/` (see `mcps/README.md`).

## Contents

### Tools

14 tools. Thirteen were originally at `koris`'s `plugins/tools/<slug>/`, removed
there and now maintained here going forward; `read-url` was written here from the
start and has never lived in `koris`:

- `tools/create-tool/`
- `tools/curl-request/`
- `tools/delete-beat/`
- `tools/issue/`
- `tools/learn-sticker/`
- `tools/list-beats/`
- `tools/read-url/`
- `tools/search-engine/`
- `tools/search-engine-restart/`
- `tools/send-message/`
- `tools/send-sticker/`
- `tools/set-beat/`
- `tools/unlearn-sticker/`
- `tools/update-beat/`

Each has its matching `content/marketplace/tools/<slug>.json` `sourcePath`/
`sourceUrl` pointing here instead of `koris`.

### Channels

2 channels. Originally at `koris`'s `plugins/channels/<slug>/`, removed there
and maintained here as TypeScript source (same as tools):

- `channels/telegram/`
- `channels/whatsapp/`

Unlike tools/skills, a channel also ships a standalone CJS `index.js` bundle —
built from the source by `scripts/build-channels.ts` (`pnpm build:channels`) and
published as a `channels-latest` release asset by
`.github/workflows/build-channels.yml`. The bundle is **git-ignored**, never
hand-committed. See `channels/README.md` for what it inlines vs. leaves external.

That bundle must be self-contained with respect to the host modules, which is
why the channel family (and only the channel family) has vendored copies of
them here — see "Vendored host modules" below.

Each has its matching `content/marketplace/channels/<slug>.json` `sourcePath`/
`sourceUrl` pointing here instead of `koris`.

### MCP Servers

1 MCP server. Maintained as TypeScript source, pulled by `koris` on demand
via `pnpm hub:pull <slug>` or `/mcps download <slug>`:

- `mcps/coredash/`

Each has its matching `content/marketplace/mcps/<slug>.json` `sourcePath`/
`sourceUrl` pointing here instead of `koris`. See `mcps/README.md`.

Note: many of these files import shared modules owned by `koris` — tools reach
for `../contracts`, `../define-tool`, `../runtime`, `../cron`, `../../registry`
(and `create-tool` also `../../../scripts/scaffold-tool`); channels for
`../contracts`, `../channel-config`, `../../registry`. For tools and skills
those still live only in `koris`: this directory isn't type-checked or built by
this app (see the `koris-plugins` exclude in `tsconfig.json`), `koris` pulls the
`.ts` and compiles it there, so the unresolved imports break nothing here.

### Vendored host modules

Channels are the exception, because they ship as pre-bundled JS rather than as
`.ts` that `koris` compiles. Those three specifiers used to be marked EXTERNAL
in `scripts/build-channels.ts`, on the assumption that they would resolve
against `koris/plugins/channels/contracts.ts` at load time. They can't: `koris`
ships them as `.ts`, and Node's CJS resolver never tries a `.ts` extension, so
every published bundle died with `Cannot find module '../contracts'` the moment
`koris`'s plugin loader required it — and its loader swallows the error, so the
channel just silently never appeared.

So the six host modules are vendored here, at exactly the paths those relative
imports resolve to, and bundled in:

| here | upstream in `koris` |
| --- | --- |
| `channels/contracts.ts` | `plugins/channels/contracts.ts` |
| `channels/channel-config.ts` | `plugins/channels/channel-config.ts` |
| `registry.ts` | `plugins/registry.ts` |
| `config/define-config.ts` | `plugins/config/define-config.ts` |
| `config/loader.ts` | `plugins/config/loader.ts` |
| `config/writer.ts` | `plugins/config/writer.ts` |

Mirroring the paths means esbuild and vitest both resolve them with no aliasing
or bundler plugin, and the full channel test suite runs in CI without a `koris`
checkout. They are byte-identical copies: `koris` remains the source of truth
for their content. `pnpm check:host-sync` diffs them against a local `koris`
checkout (`$HOME/projects/koris`, or `KORIS_ROOT`) and fails on drift; after
re-copying, rerun `pnpm build:channels`.

Inlining is safe for the `ADAPTERS` extension point: `PluginRegistry` keys
registrations by `point.id` (the string `'channels.adapters'`), not by object
identity, so the bundle's own `ExtensionPoint` instance is still collected
through `koris` core's.

## Adding another plugin here

1. Move its directory in under `koris-plugins/<family>/<slug>/`.
2. Update the matching `content/marketplace/<family>/<slug>.json`'s
   `sourcePath` (e.g. `koris-plugins/tools/<slug>`) and `sourceUrl` (this
   repo's GitHub URL for that path) to stop pointing at `koris`.
3. For a channel, also add its slug to `SLUGS` in `scripts/build-channels.ts`
   (see `channels/README.md`). If it imports a `koris` module that isn't in the
   vendored set above, vendor that one too and add it to
   `VENDORED_HOST_MODULES` in `scripts/check-host-sync.ts` — leaving it external
   ships a bundle that cannot load.
4. Note the move in this file and in AGENTS.md's "Relationship to koris"
   section.
