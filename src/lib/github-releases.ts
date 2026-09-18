import { RELEASES_API_URL } from './constants';

export interface GitHubAsset {
  name: string;
  browser_download_url: string;
  size: number;
}

export interface GitHubRelease {
  tag_name: string;
  html_url: string;
  published_at: string | null;
  draft: boolean;
  prerelease: boolean;
  assets: GitHubAsset[];
}

interface CacheState {
  data: GitHubRelease[];
  timestamp: number;
  etag: string | null;
}

// 10 minutes cache TTL for development and server runtime
const CACHE_TTL_MS = 10 * 60 * 1000;

let memoryCache: CacheState | null = null;
let inFlightPromise: Promise<GitHubRelease[]> | null = null;

/**
 * Centralized, cached, and deduplicated GitHub Releases fetcher.
 *
 * 1. In-flight request deduplication: concurrent calls (e.g. downloads & changelog)
 *    share the exact same network promise instead of making parallel requests.
 * 2. In-memory cache with 10-minute TTL: avoids spamming api.github.com on dev page refreshes.
 * 3. GitHub token support: uses GITHUB_TOKEN or GH_TOKEN if available to avoid 60 req/hr rate limits.
 * 4. Conditional requests: sends If-None-Match with ETag to receive 304 Not Modified.
 * 5. Stale fallback: gracefully serves cached data if GitHub rate limits (403) or fails.
 */
export async function fetchRawGitHubReleases(): Promise<GitHubRelease[]> {
  const now = Date.now();

  // 1. Fresh cache hit: return immediately without any network request
  if (memoryCache && now - memoryCache.timestamp < CACHE_TTL_MS) {
    return memoryCache.data;
  }

  // 2. In-flight request deduplication: share ongoing promise
  if (inFlightPromise) {
    return inFlightPromise;
  }

  inFlightPromise = (async () => {
    try {
      const headers: Record<string, string> = {
        Accept: 'application/vnd.github+json',
      };

      // Support personal or CI GitHub token if present in environment
      const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Send ETag for conditional requests if available
      if (memoryCache?.etag) {
        headers['If-None-Match'] = memoryCache.etag;
      }

      const res = await fetch(`${RELEASES_API_URL}?per_page=30`, { headers });

      // 304 Not Modified: cache is still fresh, reset timestamp and return
      if (res.status === 304 && memoryCache) {
        memoryCache.timestamp = now;
        return memoryCache.data;
      }

      if (!res.ok) {
        console.warn(`[github-releases] GitHub API returned ${res.status} ${res.statusText}`);
        if (memoryCache) {
          console.warn('[github-releases] Serving stale cached releases.');
          return memoryCache.data;
        }
        return [];
      }

      const releases = (await res.json()) as GitHubRelease[];
      const etag = res.headers.get('etag');

      memoryCache = {
        data: releases,
        timestamp: now,
        etag,
      };

      return releases;
    } catch (err) {
      console.warn('[github-releases] Network error while fetching releases:', err);
      if (memoryCache) {
        return memoryCache.data;
      }
      return [];
    } finally {
      inFlightPromise = null;
    }
  })();

  return inFlightPromise;
}
