# AGENTS.md

Guidance for agents working in `koris-hub` — the public website, plugins
marketplace, and docs for [Koris Bot](https://github.com/guilhermesalviano/koris-bot).

## What this is

A standalone Next.js 16 App Router app, **statically exported** (`output: 'export'`
in `next.config.ts`), deployed to GitHub Pages on the custom domain
`https://hub.koaris.com` (`public/CNAME`) — served from the domain root, so
`basePath: ''`.
Independent repo; not part of the `koris` pnpm workspace (it has its own
`pnpm-workspace.yaml` so pnpm/Turbopack stop walking up).

## Commands

- `pnpm dev` — dev server (`http://localhost:3000/koris`)
- `pnpm build` — static export to `out/`
- `pnpm lint` — `tsc --noEmit` against both the app and `worker/` (no ESLint; strict TS)
- `pnpm preview` — `serve out/` (does **not** replicate the `/koris` prefix)
- `pnpm gen:doc-topics` — regenerate `worker/src/doc-topics.generated.ts` from `content/docs`
- `pnpm worker:dev` / `pnpm worker:deploy` — run/deploy the Cloudflare Worker

Run `pnpm lint` and `pnpm build` before considering a change done.

## Layout

```
src/app/            routes: / (landing), /marketplace, /marketplace/[slug],
                    /docs, /docs/[...slug]; api/changelog, api/downloads
                    (force-static GitHub Releases proxies); layout.tsx,
                    not-found.tsx, globals.css
src/components/     Navbar, Hero, Download, Feature, Changelog, Footer, icons,
                    Markdown, MarketplaceCard, ParamTable, DocsSidebar
src/lib/            constants.ts, changelog.ts, downloads.ts, marketplace.ts,
                    docs.ts
content/marketplace/  catalog entries as <family-dir>/<slug>.json (tools/, channels/,
                    skills/, mcps/) + schema.ts (typed)
content/docs/         *.md docs (frontmatter: title, order); index.md per section
scripts/              generate-catalog.ts (sketch), generate-doc-topics.ts (docs index →
                      worker/src/doc-topics.generated.ts), build-channels.ts (esbuild →
                      koris-plugins/channels/*/index.js, git-ignored)
worker/               Cloudflare Worker `koris-hub-ask` at api.hub.koaris.com: the
                      secret-holding Jev proxy behind the FAQ "ask the docs" widget
koris-plugins/        canonical home for tool / skill / channel / mcp source that has moved
                      out of `koris` (reference only, not built/imported by this app —
                      except `pnpm build:channels`); see koris-plugins/README.md,
                      koris-plugins/skills/README.md, koris-plugins/channels/README.md,
                      koris-plugins/mcps/README.md
```

## Conventions / gotchas

- **Static export**: every dynamic route needs `generateStaticParams()` **and**
  `export const dynamicParams = false`. `/marketplace/[slug]` and `/docs/[...slug]`
  both do this.
- **`params` is a Promise** (Next 15+): page and `generateMetadata` are `async` and
  `await params`.
- **`next/image` + basePath**: local `src` values are not auto-prefixed in this
  static-export setup — prefix with `BASE_PATH` from `src/lib/constants.ts`
  (see `Navbar.tsx`).
- **Styling**: Tailwind v4, CSS-first `@theme` tokens in `globals.css`
  (`bg`, `bg-subtle`, `txt`, `muted`, `accent`, `border`), dark only. No
  `tailwind.config`. Markdown is styled with `@tailwindcss/typography` (`@plugin`
  in `globals.css`).
- **Markdown**: `react-markdown` + `remark-gfm` in `src/components/Markdown.tsx`.
  No MDX, no second build tool. Keep it that way unless docs genuinely need inline
  React.
- **Catalog**: JSON files are the source of truth, grouped by family under
  `content/marketplace/{tools,channels,skills}/`. `src/lib/marketplace.ts`
  validates `slug === filename`, that the file lives under the folder matching
  its `family`, and the `family` enum itself, all at load time — a bad entry
  fails the build. `scripts/generate-catalog.ts` only *merges* derived fields.
- **`@content/*`** tsconfig alias → `./content/*`; `@/*` → `./src/*`.

## Ask-the-docs widget (TypeSafe Jev)

The FAQ's last item is a question box backed by TypeSafe's Jev model. The site is
static and cannot hold `TYPESAFE_API_KEY`, so the browser calls the Cloudflare
Worker in `worker/`, which owns the key as a secret and talks to
`POST https://api.typesafe.ai/v1/systemone`.

- Jev does **not** generate prose. It returns typed answers (`choice`, `noul`,
  `score`); the widget asks it to pick the best-matching documentation section and
  report coverage, then renders that page's baked `excerpt` as the answer.
- `scripts/generate-doc-topics.ts` bakes `content/docs` + `content/pt-br/docs`
  into `worker/src/doc-topics.generated.ts` (committed). **Regenerate with
  `pnpm gen:doc-topics` whenever docs change** — the Worker deploy workflow does
  this automatically.
- The Worker keeps a fixed question template, a 500-char question cap, CORS for
  `hub.koaris.com`/`localhost:3000`, and an in-memory per-IP limit (10/min). It
  never echoes the key or raw upstream errors.
- Client helper: `src/lib/ask-jev.ts`; endpoint constant: `ASK_API_URL` in
  `src/lib/constants.ts`; UI: `AskDocsItem` in `src/components/Faq.tsx`.
- Secrets/CI: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, and
  `TYPESAFE_API_KEY` in GitHub Actions
  (`.github/workflows/deploy-worker.yml`). The route
  `api.hub.koaris.com` is created by `custom_domain` in `worker/wrangler.toml`.

## Relationship to koris

The `koris` repo no longer contains a website. It links here from its README /
AGENTS.md. Some plugin/skill source still lives in `koris` (under
`plugins/tools/`, `plugins/skills/`); this repo describes those via `content/marketplace/`. A growing
set of plugins, skills, channels, and MCP servers (see `koris-plugins/README.md`,
`koris-plugins/skills/README.md`, `koris-plugins/channels/README.md`, and
`koris-plugins/mcps/README.md` for the current lists) have had their source
removed from `koris` and now live here instead, under `koris-plugins/tools/`,
`koris-plugins/skills/`, `koris-plugins/channels/`, and `koris-plugins/mcps/` — for
those, `content/marketplace/*.json` `sourcePath`/`sourceUrl` point at this repo,
not `koris`.

`koris` pulls these on demand via `pnpm hub:pull` (`koris/scripts/hub-sync.ts`),
which reads files straight from this repo's tree. Channels additionally need
their built `index.js` — git-ignored here, published to the `channels-latest`
release by `.github/workflows/build-channels.yml`. MCP servers and tools/skills
are pulled directly as source from `main`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
