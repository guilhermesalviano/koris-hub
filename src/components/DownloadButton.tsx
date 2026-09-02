'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { RELEASES_URL } from '@/lib/constants';
import type { DownloadAsset, LatestDownloads, Platform } from '@/lib/downloads';
import { PLATFORM_LABELS, detectPlatform } from '@/lib/platform';

interface Props {
  className?: string;
  // Where to send the visitor when a direct asset can't be resolved (fetch
  // failed, no assets, or SSR before hydration). May be an in-page anchor.
  fallbackHref?: string;
  // Override the auto label ("Download" / "Download for macOS").
  children?: ReactNode;
  // Append the detected OS to the label when a direct asset is resolved.
  showPlatform?: boolean;
}

// Picks the asset a one-click CTA should hand over: the first asset for the
// visitor's OS, else the first asset of the first listed platform.
function pickAsset(
  data: LatestDownloads,
  detected: Platform | null,
): { asset: DownloadAsset; platform: Platform } | null {
  const target = data.platforms.find((p) => p.platform === detected) ?? data.platforms[0];
  if (!target || target.assets.length === 0) return null;
  return { asset: target.assets[0], platform: target.platform };
}

export function DownloadButton({
  className,
  fallbackHref = RELEASES_URL,
  children,
  showPlatform = true,
}: Props) {
  const [data, setData] = useState<LatestDownloads | null | undefined>(undefined);
  const [detected, setDetected] = useState<Platform | null>(null);

  useEffect(() => {
    setDetected(detectPlatform());
    let active = true;
    fetch('/api/downloads')
      .then((res) => (res.ok ? (res.json() as Promise<LatestDownloads | null>) : null))
      .then((d) => {
        if (active) setData(d);
      })
      .catch(() => {
        if (active) setData(null);
      });
    return () => {
      active = false;
    };
  }, []);

  const resolved = useMemo(() => (data ? pickAsset(data, detected) : null), [data, detected]);

  const href = resolved?.asset.url ?? fallbackHref;
  const external = /^https?:/.test(href);
  const matchedOS = resolved !== null && resolved.platform === detected;

  const label =
    children ??
    (showPlatform && matchedOS ? `Download for ${PLATFORM_LABELS[resolved!.platform]}` : 'Download');

  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener' } : {})}
      className={className}
    >
      {label}
    </a>
  );
}
