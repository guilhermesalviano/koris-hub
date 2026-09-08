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
point back at this repo for these plugins). Three families live here:
`tools/` (below), `skills/` (see `skills/README.md`), and `channels/` (see `channels/README.md`).

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

Each has its matching `content/marketplace/channels/<slug>.json` `sourcePath`/
`sourceUrl` pointing here instead of `koris`.

Note: many of these files import shared modules that aren't vendored here —
tools reach for `../contracts`, `../define-tool`, `../runtime`, `../cron`,
`../../registry` (and `create-tool` also `../../../scripts/scaffold-tool`);
channels for `../contracts`, `../channel-config`, `../../registry` — those still
live in `koris`. This directory isn't type-checked or built by this app (see the
`koris-plugins` exclude in `tsconfig.json`), so the unresolved imports don't
break `pnpm lint`/`pnpm build`. The one exception is `pnpm build:channels`,
which esbuild-bundles `channels/<slug>/index.ts` and deliberately leaves those
same `koris`-owned modules external.

## Adding another plugin here

1. Move its directory in under `koris-plugins/<family>/<slug>/`.
2. Update the matching `content/marketplace/<family>/<slug>.json`'s
   `sourcePath` (e.g. `koris-plugins/tools/<slug>`) and `sourceUrl` (this
   repo's GitHub URL for that path) to stop pointing at `koris`.
3. For a channel, also add its slug to `SLUGS` in `scripts/build-channels.ts`
   (see `channels/README.md`).
4. Note the move in this file and in AGENTS.md's "Relationship to koris"
   section.
