export interface DemoMessage {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  pending?: boolean;
}

export interface DemoSession {
  id: string;
  title: string;
  timestamp: string;
  channel: string;
  messages: DemoMessage[];
}

export const MOCK_SESSIONS: DemoSession[] = [
  {
    id: 'bom-dia',
    title: 'Bom dia, tudo bom?',
    timestamp: '09:58 PM',
    channel: 'web',
    messages: [
      { id: 1, role: 'user', content: 'Bom dia, tudo bom?', timestamp: '09:58 PM' },
      {
        id: 2,
        role: 'assistant',
        content: 'Bom dia! Tudo certo por aqui — heartbeats rodando, fila vazia. Como posso ajudar?',
        timestamp: '09:58 PM',
      },
    ],
  },
  {
    id: 'deploy-check',
    title: 'Deploy check',
    timestamp: 'Yesterday',
    channel: 'web',
    messages: [
      { id: 1, role: 'user', content: 'Did the last deploy finish cleanly?', timestamp: '4:12 PM' },
      {
        id: 2,
        role: 'assistant',
        content:
          'Yes — build finished in 42s, health check passed, and no errors in the audit log for the last hour.',
        timestamp: '4:12 PM',
      },
    ],
  },
  {
    id: 'audit-summary',
    title: 'Summarize the audit log',
    timestamp: 'Mon',
    channel: 'telegram',
    messages: [
      { id: 1, role: 'user', content: 'Summarize today\'s audit log for me.', timestamp: '11:03 AM' },
      {
        id: 2,
        role: 'assistant',
        content:
          '312 calls today, 3 providers used, no failed tool calls. Token usage stayed well under the context threshold all day.',
        timestamp: '11:04 AM',
      },
    ],
  },
];

export const CANNED_REPLIES = [
  "Got it — I'll keep that in mind. Anything else you'd like me to check?",
  'Done. That change is reflected the next time a heartbeat runs.',
  "I don't have a live backend in this preview, but that's the kind of thing the real agent handles over chat, Telegram, or WhatsApp.",
  'Noted in memory — I’ll remember that across sessions, not just this chat.',
  'Sure, give me a moment... all good, nothing blocking in the queue right now.',
];
