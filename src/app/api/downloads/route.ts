import { fetchLatestDownloads } from '@/lib/downloads';

// Static export: this GET handler runs at `next build`, hits the GitHub Releases API
// once, and its JSON is written to `out/api/downloads`. The client `Downloads`
// component fetches that file — the browser never calls GitHub directly.
export const dynamic = 'force-static';

export async function GET() {
  return Response.json(await fetchLatestDownloads());
}
