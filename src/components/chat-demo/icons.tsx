import type { CSSProperties } from 'react';

interface IconProps {
  className?: string;
}

function svgStyle(width: number): CSSProperties {
  return { strokeWidth: width, strokeLinecap: 'round', strokeLinejoin: 'round' };
}

export function OverviewIcon({ className }: IconProps) {
  return (
    <svg className={className} style={svgStyle(1.7)} viewBox="0 0 24 24">
      <path d="M3 3v18h18M7 15l4-6 4 4 4-8" />
    </svg>
  );
}

export function MemoriesIcon({ className }: IconProps) {
  return (
    <svg className={className} style={svgStyle(1.7)} viewBox="0 0 24 24">
      <path d="M12 2a7 7 0 0 0-7 7c0 2.4 1.2 4.1 2.5 5.3.8.7 1.5 1.7 1.5 2.7v1h6v-1c0-1 .7-2 1.5-2.7C17.8 13.1 19 11.4 19 9a7 7 0 0 0-7-7zM9 21h6" />
    </svg>
  );
}

export function HeartbeatsIcon({ className }: IconProps) {
  return (
    <svg className={className} style={svgStyle(1.7)} viewBox="0 0 24 24">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}

export function SkillsIcon({ className }: IconProps) {
  return (
    <svg className={className} style={svgStyle(1.7)} viewBox="0 0 24 24">
      <path d="M12 2l3 6 6.5 1-4.7 4.6 1.1 6.4-5.9-3-5.9 3 1.1-6.4L2.5 9l6.5-1z" />
    </svg>
  );
}

export function QueueIcon({ className }: IconProps) {
  return (
    <svg className={className} style={svgStyle(1.7)} viewBox="0 0 24 24">
      <path d="M12 3v18M3 7l9-4 9 4M3 17l9 4 9-4M3 7v10M21 7v10M3 12h18" />
    </svg>
  );
}

export function AuditIcon({ className }: IconProps) {
  return (
    <svg className={className} style={svgStyle(1.7)} viewBox="0 0 24 24">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
    </svg>
  );
}

export function SettingsIcon({ className }: IconProps) {
  return (
    <svg className={className} style={svgStyle(1.7)} viewBox="0 0 24 24">
      <path d="M10.3 2h3.4l.4 2.5a8 8 0 0 1 2 .8l2.1-1.4 2.4 2.4-1.4 2.1a8 8 0 0 1 .8 2l2.5.4v3.4l-2.5.4a8 8 0 0 1-.8 2l1.4 2.1-2.4 2.4-2.1-1.4a8 8 0 0 1-2 .8l-.4 2.5h-3.4l-.4-2.5a8 8 0 0 1-2-.8l-2.1 1.4-2.4-2.4 1.4-2.1a8 8 0 0 1-.8-2L2 13.7v-3.4l2.5-.4a8 8 0 0 1 .8-2L3.9 5.8l2.4-2.4 2.1 1.4a8 8 0 0 1 2-.8zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
    </svg>
  );
}

export function PluginsIcon({ className }: IconProps) {
  return (
    <svg className={className} style={svgStyle(1.7)} viewBox="0 0 24 24">
      <path d="M9 2v4M15 2v4M7 6h10l-1 6H8L7 6zM6 12h12v3a6 6 0 0 1-12 0v-3zM12 21v-3" />
    </svg>
  );
}

export function PlusIcon({ className }: IconProps) {
  return (
    <svg className={className} style={svgStyle(2)} viewBox="0 0 24 24">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

export function AttachIcon({ className }: IconProps) {
  return (
    <svg className={className} style={svgStyle(1.8)} viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}

export function SendIcon({ className }: IconProps) {
  return (
    <svg className={className} style={svgStyle(2.2)} viewBox="0 0 24 24">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

export function ChevronDownIcon({ className }: IconProps) {
  return (
    <svg className={className} style={svgStyle(2)} viewBox="0 0 24 24">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
