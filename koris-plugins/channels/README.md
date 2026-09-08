# koris-plugins/channels/

Canonical source for `koris` **channel** plugins whose source has been removed
from the `koris` repo and now lives here instead. Same idea as
`koris-plugins/tools/` and `koris-plugins/skills/`: this is the actual,
maintained TypeScript source, not a vendored/read-only snapshot. Nothing here is
built, imported, or executed by this Next.js app (`koris-plugins` is in
`tsconfig.json`'s `exclude`).

## Layout

Mirrors the path convention used in `koris`: `koris-plugins/channels/<slug>/...`,
matching `sourcePath` in `content/marketplace/channels/<slug>.json` (whose
`sourceUrl` points back at this repo).

```
koris-plugins/channels/<slug>/
  index.ts, adapter.ts, channel.ts, config.ts, factory.ts, ...   maintained source
  *.test.ts                                                       vitest specs (run in koris)
  config.example.yml                                              config template
  package.json                                                    { "main": "index.js" }
  index.js                                                        BUILT — git-ignored, not here
```

## The `index.js` bundle

`index.js` is **not committed** (see the repo `.gitignore`). It is produced from
the `.ts` source by `scripts/build-channels.ts` (`pnpm build:channels`, esbuild
→ standalone CJS) and published as an asset on the rolling `channels-latest`
prerelease by `.github/workflows/build-channels.yml`.

The bundle inlines the third-party runtime deps (`@whiskeysockets/baileys`,
`@guilhermesalviano/telegram-bot`, `qrcode-terminal`) and leaves these
unresolved, to be provided by `koris` at load time:

- `../contracts`, `../channel-config`, `../../registry` — koris core modules;
  they resolve against `koris/plugins/channels/` once the bundle is pulled there.
- Baileys' optional peers (`jimp`, `link-preview-js`, `bufferutil`, native
  `sharp`/`ws` speedups, ...) — lazily `require()`d inside try/catch; baileys
  degrades gracefully and koris supplies the ones it wants.

## Contents

2 channels, originally at `koris`'s `plugins/channels/<slug>/`:

- `telegram/` — Telegram bot adapter, via `@guilhermesalviano/telegram-bot`.
- `whatsapp/` — WhatsApp adapter, via Baileys (`@whiskeysockets/baileys`).

## How `koris` consumes these

`koris` pulls a channel on demand (setup wizard / admin marketplace, or
`pnpm hub:pull <slug>`): the `.ts` / `.yml` / `package.json` come from this
folder over `raw.githubusercontent.com` (same as tools/skills), and `index.js`
comes from the `channels-latest` release asset.

> Requires a matching `channel` entry in `koris`'s `scripts/hub-sync.ts` — see
> that repo. Until then, only tools and skills are wired into `hub:pull`.

## Adding another channel here

1. Move its directory in under `koris-plugins/channels/<slug>/` (source +
   `config.example.yml` + a `package.json` with `"main": "index.js"`; leave any
   runtime `config.yml` behind).
2. Add its slug to `SLUGS` in `scripts/build-channels.ts`.
3. Add the matching `content/marketplace/channels/<slug>.json` with `sourcePath`
   / `sourceUrl` pointing here.
4. Note the move in this file, `koris-plugins/README.md`, and AGENTS.md's
   "Relationship to koris" section.
