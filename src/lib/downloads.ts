import { REPO_URL, RELEASES_API_URL, RELEASES_URL } from './constants';
import { PLATFORM_LABELS, type Platform } from './platform';

export type { Platform };

export interface DownloadAsset {
  name: string; // original asset filename, e.g. "koris-0.1.4-mac-arm64.dmg"
  url: string; // browser_download_url
  size: number; // bytes
  arch: string | null; // "arm64" | "x64" | "amd64" | "x86_64" | ... when recognizable
  ext: string; // "dmg" | "exe" | "AppImage" | "deb" | ...
}

export interface PlatformDownloads {
  platform: Platform;
  label: string; // human label, e.g. "macOS"
  assets: DownloadAsset[]; // newest-release assets for this platform
}

export interface SourceDownload {
  tag: string; // original tag, e.g. "v0.1.4"
  dir: string; // folder the tarball extracts to, e.g. "koris-0.1.4"
  tarballUrl: string; // GitHub source tarball for the tag (.tar.gz)
  zipUrl: string; // GitHub source zip for the tag
  curl: string; // ready-to-paste one-liner: download + extract the tag
}

export interface LatestDownloads {
  version: string; // tag_name with a leading "v" stripped, e.g. "0.1.4"
  date: string | null; // published_at, "YYYY-MM-DD"
  url: string; // release html_url
  platforms: PlatformDownloads[]; // only platforms that actually have assets, mac → windows → linux
  source: SourceDownload; // build-from-source path for the same tag
}

interface GitHubAsset {
  name: string;
  browser_download_url: string;
  size: number;
}

interface GitHubRelease {
  tag_name: string;
  html_url: string;
  published_at: string | null;
  draft: boolean;
  prerelease: boolean;
  assets: GitHubAsset[];
}

// Installer / binary extensions we surface. electron-builder also uploads
// auto-update metadata (`.blockmap`, `latest*.yml`, `.zsync`) and checksums
// (`.sha256`, `.sig`) next to these — those are filtered out below.
const DOWNLOAD_EXT = /\.(dmg|pkg|exe|msi|AppImage|deb|rpm|snap|zip|tar\.gz|tar\.xz)$/i;

function classifyPlatform(name: string): Platform | null {
  const n = name.toLowerCase();
  if (/\b(mac|macos|osx|darwin)\b/.test(n) || /\.(dmg|pkg)$/i.test(name)) return 'mac';
  if (/\b(win|windows)\b/.test(n) || /\.(exe|msi)$/i.test(name)) return 'windows';
  if (/\b(linux)\b/.test(n) || /\.(appimage|deb|rpm|snap)$/i.test(name)) return 'linux';
  return null;
}

function extOf(name: string): string {
  const m = name.match(/\.(tar\.gz|tar\.xz|[a-z0-9]+)$/i);
  return m ? m[1] : '';
}

function archOf(name: string): string | null {
  const m = name.match(/\b(arm64|aarch64|x86_64|amd64|x64|x86|arm|universal|intel)\b/i);
  return m ? m[1].toLowerCase() : null;
}

const PLATFORM_ORDER: Platform[] = ['mac', 'windows', 'linux'];

// Data layer for the `/api/downloads` route handler. Hits the public koris Releases
// API (no auth needed for public repos), takes the newest stable release, and groups
// its installer assets by OS. A failed fetch or a release with no usable assets
// resolves to `null` so the route still returns valid JSON and the build never breaks.
export async function fetchLatestDownloads(): Promise<LatestDownloads | null> {
  try {
    const res = await fetch(`${RELEASES_API_URL}?per_page=30`, {
      headers: { Accept: 'application/vnd.github+json' },
    });

    if (!res.ok) {
      console.warn(`[downloads] GitHub releases fetch failed: ${res.status} ${res.statusText}`);
      return null;
    }

    const releases = (await res.json()) as GitHubRelease[];
    const latest = releases.find((r) => !r.draft && !r.prerelease && r.assets.length > 0);
    if (!latest) return null;

    const buckets = new Map<Platform, DownloadAsset[]>();

    for (const asset of latest.assets) {
      if (!DOWNLOAD_EXT.test(asset.name)) continue;
      const platform = classifyPlatform(asset.name);
      if (!platform) continue;

      const list = buckets.get(platform) ?? [];
      list.push({
        name: asset.name,
        url: asset.browser_download_url,
        size: asset.size,
        arch: archOf(asset.name),
        ext: extOf(asset.name),
      });
      buckets.set(platform, list);
    }

    const platforms: PlatformDownloads[] = PLATFORM_ORDER.filter((p) => buckets.has(p)).map((p) => ({
      platform: p,
      label: PLATFORM_LABELS[p],
      assets: buckets
        .get(p)!
        .sort((a, b) => a.name.localeCompare(b.name)),
    }));

    if (platforms.length === 0) return null;

    const tag = latest.tag_name;
    const version = tag.replace(/^v/, '');
    const repo = REPO_URL.replace(/\/+$/, '').split('/').pop() || 'koris';
    const dir = `${repo}-${version}`;
    const tarballUrl = `${REPO_URL}/archive/refs/tags/${tag}.tar.gz`;

    return {
      version,
      date: latest.published_at ? latest.published_at.slice(0, 10) : null,
      url: latest.html_url || RELEASES_URL,
      platforms,
      source: {
        tag,
        dir,
        tarballUrl,
        zipUrl: `${REPO_URL}/archive/refs/tags/${tag}.zip`,
        curl: `curl -L ${tarballUrl} | tar -xz\ncd ${dir}`,
      },
    };
  } catch (err) {
    console.warn('[downloads] GitHub releases fetch errored:', err);
    return null;
  }
}
