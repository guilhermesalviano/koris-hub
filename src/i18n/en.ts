/**
 * English strings — the reference dictionary. `Dictionary` is derived from this
 * object's shape (see ./index.ts), so any key missing from another locale is a
 * `pnpm lint` failure rather than a blank spot on the page.
 */
export const en = {
  nav: {
    marketplace: 'Marketplace',
    docs: 'Docs',
    github: 'GitHub',
    switchLanguage: 'Change language',
  },

  hero: {
    titleLead: 'An ',
    titleAccent: 'autonomous AI assistant',
    titleTail: ', running on your own infrastructure',
    subtitle:
      'Koris Assistant is a TypeScript framework for building AI assistants with pluggable channels, extensible skills, and memory that persists across sessions — not just within a chat window.',
    readDocs: 'Read the docs',
  },

  extend: {
    title: 'Extend it in minutes',
    subtitle:
      'Teach the agent something new with a Markdown skill it reads, or a TypeScript tool it calls. Neither one touches core code.',
    tabSkill: 'Skill',
    tabTool: 'Tool',
    footnoteLead:
      "No changes to core needed — drop the file in and it's picked up automatically. Full guide:",
    docLabelSkill: 'Skills docs',
    docLabelTool: 'Tools docs',
  },

  download: {
    title: 'Get Koris running',
    subtitle:
      'Install the desktop app, or build it from source. Either way, the first launch drops you into a browser setup wizard — no manual config editing.',
    tabDesktop: 'Desktop app',
    tabSource: 'From source',
    fromGitHub: 'Download from GitHub',
    yourOs: 'Your OS',
    latestRelease: 'Latest release',
    latestGitHubRelease: 'latest GitHub release',
    downloadFor: 'Download for',
    download: 'Download',
  },

  changelog: {
    title: 'Changelog',
    subtitle: 'Every release, straight from GitHub.',
    viewFull: 'View full changelog',
  },

  footer: {
    license: 'ISC License',
    builtBy: 'Built with ❤️ by Koaris',
  },

  docs: {
    overview: 'Overview',
  },

  chatDemo: {
    adminPanel: 'Admin panel',
    newChat: 'New chat',
    chats: 'Chats',
    plugins: 'Plugins',
    configuration: 'Configuration',
    prompt: 'What can I help with?',
    placeholder: 'Ask something…',
    contextUsage: 'context usage',
    active: 'active',
    switchingNote: 'Full switching in the real dashboard',
  },

  marketplace: {
    backToMarketplace: 'Marketplace',
    confirmationRequired: 'confirmation required',
    offByDefault: 'off by default',
    toolName: 'tool name:',
    parameters: 'Parameters',
    readWhen: 'Read when',
    setupGuidance: 'Setup & Configuration Guidance',
    viewSource: 'View source',
    improveEntry: 'Improve this entry',
    noParameters: 'No parameters.',
    paramName: 'Name',
    paramType: 'Type',
    paramRequired: 'Required',
    paramDescription: 'Description',
    paramYes: 'yes',
  },

  notFound: {
    heading: 'Even an agent with persistent memory forgot this page.',
    body: "We checked the long-term memory store, ran a full skill sync, and sent a heartbeat to ask nicely. This route just isn't in the training data — it probably wandered off to go summarize itself.",
    home: 'Take me home',
    report: 'File a bug report',
    status: "status: 404 · heartbeat still running, don't worry",
  },

  meta: {
    siteTitle: 'Koris — self-hosted AI assistant framework',
    siteDescription:
      'Koris is an open-source, self-hosted AI agent framework in TypeScript. It runs on your own infrastructure, talks over Telegram and WhatsApp, remembers across sessions, and extends through tools and Markdown skills.',
    docsTitle: 'Docs',
    docsDescription:
      'Documentation for Koris — install and configure the self-hosted AI agent, connect Telegram or WhatsApp channels, and extend it with tools and skills.',
    marketplaceTitle: 'Marketplace',
    marketplaceDescription:
      'Every tool, channel, and skill that ships with Koris — what each one does, the parameters it takes, and a link to its source.',
    marketplaceIntroLead: 'The tools, channels, and skills bundled with Koris today. Each one lives in the',
    marketplaceIntroTail: 'repo — this is a browsable index, not an installer.',
    notFoundTitle: '404 — page not found',
  },
} as const;
