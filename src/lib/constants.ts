// Canonical origin of this site — must match the Workers custom domain in the
// root wrangler.toml. Used for metadataBase, canonical URLs, the sitemap, and
// JSON-LD `@id`s. No trailing slash; `trailingSlash: true` in next.config.ts
// means route paths carry their own (e.g. `${SITE_URL}/docs/`).
export const SITE_URL = 'https://imkoris.com';

// The code repository (releases, source, issues).
export const REPO_URL = 'https://github.com/guilhermesalviano/koris-bot';
export const RELEASES_URL = `${REPO_URL}/releases/latest`;

// Releases REST API for the code repo — the changelog is built from this at build time.
export const RELEASES_API_URL = 'https://api.github.com/repos/guilhermesalviano/koris-bot/releases';

// This repo — the website / marketplace / docs. Used for "edit this entry" links.
export const HUB_REPO_URL = 'https://github.com/guilhermesalviano/koris-hub';

// Must match `basePath` in next.config.ts — next/image does not auto-prefix
// local `src` values with basePath in this static-export setup.
// Empty: the site is served from the root of the custom domain.
export const BASE_PATH = '';

// Public Cloudflare Worker (see worker/wrangler.toml) that proxies the "Ask
// about the docs" widget to TypeSafe Jev. The API key stays in the Worker; this
// URL is safe to ship in the client bundle.
// Origin of the FAQ / Ask proxy. Served by the same Cloudflare Worker that
// serves the static site, so relative `/api/ask` works same-origin without CORS.
// Overridable via NEXT_PUBLIC_ASK_API_URL for local development if needed.
export const ASK_API_URL = process.env.NEXT_PUBLIC_ASK_API_URL || '/api/ask';
