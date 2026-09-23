# AGENTS.md

Guidance for agents working in `koris-hub` — the public website, plugin source,
and docs for [Koris Bot](https://github.com/guilhermesalviano/koris-bot).

## What this is

A standalone Next.js 16 App Router app, **statically exported** (`output: 'export'`
in `next.config.ts`), deployed to Cloudflare Workers (static assets) on
`https://imkoris.com` — served from the domain root, so `basePath: ''`. The
site deploys via Cloudflare Workers Builds (dashboard git integration) using
the root `wrangler.toml`; build `pnpm build`, deploy `npx wrangler deploy`.
Independent repo; not part of the `koris` pnpm workspace (it has its own
`pnpm-workspace.yaml` so pnpm/Turbopack stop walking up).

## Commands

- `pnpm dev` — dev server (`http://localhost:3000`)
- `pnpm build` — builds static export to `out/`
- `pnpm deploy` — builds and deploys to Cloudflare via `wrangler deploy`
- `pnpm lint` — `tsc --noEmit` against both the app and `worker/` (no ESLint; strict TS)
- `pnpm preview` — `serve out/`
- `pnpm worker:dev` — run unified Cloudflare Worker and static assets locally via `wrangler dev`

Run `pnpm lint` and `pnpm build` before considering a change done.

## Layout

```
src/app/            routes: / (landing),
                    /docs, /docs/[...slug]; api/changelog, api/downloads
                    (force-static GitHub Releases proxies); layout.tsx,
                    not-found.tsx, globals.css
src/components/     Navbar, Hero, Download, Feature, Changelog, Footer, icons,
                    Markdown, DocsSidebar
src/lib/            constants.ts, changelog.ts, downloads.ts,
                    docs.ts
content/docs/         *.md docs (frontmatter: title, order); index.md per section
scripts/              build-channels.ts (esbuild →
                      koris-plugins/channels/*/index.js, git-ignored)
worker/               Cloudflare Worker `worker/src/index.ts` mounted with static
                      assets in the root `wrangler.toml`: serves `./out` and adds
                      security headers, plus a `/api/health` endpoint
koris-plugins/        canonical home for tool / skill / channel / mcp source that has moved
                      out of `koris` (reference only, not built/imported by this app —
                      except `pnpm build:channels`); see koris-plugins/README.md,
                      koris-plugins/skills/README.md, koris-plugins/channels/README.md,
                      koris-plugins/mcps/README.md
```

## Conventions / gotchas

- **Static export**: every dynamic route needs `generateStaticParams()` **and**
  `export const dynamicParams = false`. `/docs/[...slug]` does this.
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
- **`@content/*`** tsconfig alias → `./content/*`; `@/*` → `./src/*`.

## Relationship to koris

The koris repo runs the agent and this repository holds the public website
and plugin source under koris-plugins/. The old marketplace catalog and
download commands have been removed. Plugin installation is handled separately.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
