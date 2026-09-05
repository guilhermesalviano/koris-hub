'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CopyButton } from '@/components/Download';

type TabId = 'skill' | 'tool';

const TABS: { id: TabId; label: string }[] = [
  { id: 'skill', label: 'Skill' },
  { id: 'tool', label: 'Tool' },
];

const SKILL_SNIPPET = `---
name: weather
description: Get current weather and forecasts via wttr.in, no API key needed.
read_when:
  - user asks about weather, temperature, or forecasts for any location
---

# Weather

Current weather conditions and short-range forecasts.

## Commands

### Current Weather

\`\`\`bash
curl "wttr.in/[city]?format=3"
\`\`\`

Response: \`[city]: ⛅  +17°C\``;

const TOOL_SNIPPET = `import { defineTool } from '../define-tool';

export const TOOL_NAME = 'get_time';

export function create(context: ToolPluginContext): Plugin {
  return {
    name: 'get-time',
    setup(registry) {
      registry.registerTool(
        defineTool({
          name: TOOL_NAME,
          description: 'Get the current time in a timezone.',
          parameters: {
            timezone: { type: 'string', required: true, description: 'IANA timezone' },
          },
          handler: async (args) => ({
            toolName: TOOL_NAME,
            success: true,
            result: new Date().toLocaleString('en-US', { timeZone: args.timezone }),
          }),
          enabled: () => true,
        }),
      );
    },
  };
}`;

const PANELS: Record<TabId, { path: string; code: string; docHref: string; docLabel: string }> = {
  skill: {
    path: 'plugins/skills/weather/SKILL.md',
    code: SKILL_SNIPPET,
    docHref: '/docs/skills',
    docLabel: 'Skills docs',
  },
  tool: {
    path: 'plugins/tools/get-time/index.ts',
    code: TOOL_SNIPPET,
    docHref: '/docs/tools',
    docLabel: 'Tools docs',
  },
};

export function Extend() {
  const [tab, setTab] = useState<TabId>('skill');
  const panel = PANELS[tab];

  return (
    <section id="extend" className="mt-24 scroll-mt-20">
      <div className="mb-8 max-w-xl">
        <h2 className="text-3xl font-bold tracking-tight text-txt sm:text-4xl">Extend it in minutes</h2>
        <p className="mt-3 text-muted">
          Teach the agent something new with a Markdown skill it reads, or a TypeScript tool it
          calls. Neither one touches core code.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex items-center gap-1 overflow-x-auto border-b border-border bg-bg-subtle px-2 py-2">
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                aria-pressed={active}
                aria-label={t.label}
                className={`flex-shrink-0 rounded-lg px-3 py-1.5 font-mono text-xs transition-colors ${
                  active ? 'bg-card text-txt' : 'text-muted hover:text-txt'
                }`}
              >
                {PANELS[t.id].path}
              </button>
            );
          })}
          <CopyButton text={panel.code} className="ml-auto flex-shrink-0" />
        </div>
        <pre className="overflow-x-auto px-5 py-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
          <code>{panel.code}</code>
        </pre>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted">
        No changes to core needed &mdash; drop the file in and it's picked up automatically. Full
        guide:{' '}
        <Link
          href={panel.docHref}
          className="font-semibold text-muted underline decoration-border underline-offset-2 transition-colors hover:text-accent"
        >
          {panel.docLabel}
        </Link>
        .
      </p>
    </section>
  );
}
