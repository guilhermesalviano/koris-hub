import { RELEASES_API_URL } from './constants';

export interface ChangelogEntry {
  version: string; // tag_name with a leading "v" stripped, e.g. "0.1.4"
  date: string | null; // published_at, "YYYY-MM-DD"
  url: string; // release html_url
}

interface GitHubRelease {
  tag_name: string;
  html_url: string;
  published_at: string | null;
  draft: boolean;
  prerelease: boolean;
}

const MAX_ENTRIES = 10;

// Data layer for the `/api/changelog` route handler. Hits the public koris Releases
// API (no auth needed for public repos) and normalizes it to `ChangelogEntry[]`,
// newest first, stable releases only. A failed fetch resolves to `[]` so the route
// still returns valid JSON and the build never breaks.
export async function fetchChangelogEntries(): Promise<ChangelogEntry[]> {
  try {
    const res = await fetch(`${RELEASES_API_URL}?per_page=30`, {
      headers: { Accept: 'application/vnd.github+json' },
    });

    if (!res.ok) {
      console.warn(`[changelog] GitHub releases fetch failed: ${res.status} ${res.statusText}`);
      return [];
    }

    const releases = (await res.json()) as GitHubRelease[];

    return releases
      .filter((release) => !release.draft && !release.prerelease)
      // Newest first by publish date; unpublished releases sink to the bottom.
      .sort((a, b) => (b.published_at ?? '').localeCompare(a.published_at ?? ''))
      .slice(0, MAX_ENTRIES)
      .map((release) => ({
        version: release.tag_name.replace(/^v/, ''),
        date: release.published_at ? release.published_at.slice(0, 10) : null,
        url: release.html_url,
      }));
  } catch (err) {
    console.warn('[changelog] GitHub releases fetch errored:', err);
    return [];
  }
}
