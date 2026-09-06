import type { Locale } from '@/i18n/locales';

export interface DemoMessage {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  /**
   * Where this message sits relative to the viewer's own clock, so the thread
   * separators read "Today" / "Yesterday" however long after the build the page
   * is opened. Resolved to an absolute time in the browser only — see
   * `resolveAt` in ChatDemo. Messages sent during the demo carry `at` instead.
   */
  daysAgo?: number;
  minuteOfDay?: number;
  at?: number;
  pending?: boolean;
}

export interface DemoSession {
  id: string;
  title: string;
  timestamp: string;
  channel: string;
  messages: DemoMessage[];
}

/**
 * Demo content per locale. The English demo was previously opening with a
 * Portuguese greeting; the two are now separate so each locale's demo reads in
 * its own language.
 */
const EN_SESSIONS: DemoSession[] = [
  {
    id: 'good-morning',
    title: 'Morning check-in',
    timestamp: '09:58 PM',
    channel: 'web',
    messages: [
      { id: 1, role: 'user', content: 'Morning — everything running?', timestamp: '09:58 PM', daysAgo: 0, minuteOfDay: 21 * 60 + 58 },
      {
        id: 2,
        role: 'assistant',
        content: 'Morning! All good here — heartbeats running, queue empty. What can I do for you?',
        timestamp: '09:58 PM',
        daysAgo: 0,
        minuteOfDay: 21 * 60 + 58,
      },
    ],
  },
  {
    id: 'deploy-check',
    title: 'Deploy check',
    timestamp: 'Yesterday',
    channel: 'web',
    messages: [
      { id: 1, role: 'user', content: 'Did the last deploy finish cleanly?', timestamp: '4:12 PM', daysAgo: 1, minuteOfDay: 16 * 60 + 12 },
      {
        id: 2,
        role: 'assistant',
        content:
          'Yes — build finished in 42s, health check passed, and no errors in the audit log for the last hour.',
        timestamp: '4:12 PM',
        daysAgo: 1,
        minuteOfDay: 16 * 60 + 12,
      },
    ],
  },
  {
    id: 'audit-summary',
    title: 'Summarize the audit log',
    timestamp: 'Mon',
    channel: 'telegram',
    messages: [
      { id: 1, role: 'user', content: "Summarize today's audit log for me.", timestamp: '11:03 AM', daysAgo: 4, minuteOfDay: 11 * 60 + 3 },
      {
        id: 2,
        role: 'assistant',
        content:
          '312 calls today, 3 providers used, no failed tool calls. Token usage stayed well under the context threshold all day.',
        timestamp: '11:04 AM',
        daysAgo: 4,
        minuteOfDay: 11 * 60 + 4,
      },
    ],
  },
];

const PT_BR_SESSIONS: DemoSession[] = [
  {
    id: 'good-morning',
    title: 'Bom dia, tudo bom?',
    timestamp: '21:58',
    channel: 'web',
    messages: [
      { id: 1, role: 'user', content: 'Bom dia, tudo bom?', timestamp: '21:58', daysAgo: 0, minuteOfDay: 21 * 60 + 58 },
      {
        id: 2,
        role: 'assistant',
        content: 'Bom dia! Tudo certo por aqui — heartbeats rodando, fila vazia. Como posso ajudar?',
        timestamp: '21:58',
        daysAgo: 0,
        minuteOfDay: 21 * 60 + 58,
      },
    ],
  },
  {
    id: 'deploy-check',
    title: 'Conferir o deploy',
    timestamp: 'Ontem',
    channel: 'web',
    messages: [
      { id: 1, role: 'user', content: 'O último deploy terminou sem erro?', timestamp: '16:12', daysAgo: 1, minuteOfDay: 16 * 60 + 12 },
      {
        id: 2,
        role: 'assistant',
        content:
          'Sim — o build levou 42s, o health check passou e não houve erros no log de auditoria na última hora.',
        timestamp: '16:12',
        daysAgo: 1,
        minuteOfDay: 16 * 60 + 12,
      },
    ],
  },
  {
    id: 'audit-summary',
    title: 'Resumir o log de auditoria',
    timestamp: 'Seg',
    channel: 'telegram',
    messages: [
      { id: 1, role: 'user', content: 'Me resume o log de auditoria de hoje.', timestamp: '11:03', daysAgo: 4, minuteOfDay: 11 * 60 + 3 },
      {
        id: 2,
        role: 'assistant',
        content:
          '312 chamadas hoje, 3 provedores usados, nenhuma chamada de ferramenta falhou. O uso de tokens ficou bem abaixo do limite de contexto o dia todo.',
        timestamp: '11:04',
        daysAgo: 4,
        minuteOfDay: 11 * 60 + 4,
      },
    ],
  },
];

const EN_REPLIES = [
  "Got it — I'll keep that in mind. Anything else you'd like me to check?",
  'Done. That change is reflected the next time a heartbeat runs.',
  "I don't have a live backend in this preview, but that's the kind of thing the real agent handles over chat, Telegram, or WhatsApp.",
  'Noted in memory — I\u2019ll remember that across sessions, not just this chat.',
  'Sure, give me a moment... all good, nothing blocking in the queue right now.',
];

const PT_BR_REPLIES = [
  'Anotado — vou lembrar disso. Quer que eu verifique mais alguma coisa?',
  'Feito. Essa mudança já vale na próxima vez que um heartbeat rodar.',
  'Não tenho um backend ao vivo nesta prévia, mas é exatamente o tipo de coisa que o agente real resolve por chat, Telegram ou WhatsApp.',
  'Guardado na memória — vou lembrar disso entre sessões, não só nesta conversa.',
  'Claro, um instante... tudo certo, nada travado na fila agora.',
];

export function mockSessions(locale: Locale): DemoSession[] {
  return locale === 'pt-br' ? PT_BR_SESSIONS : EN_SESSIONS;
}

export function cannedReplies(locale: Locale): string[] {
  return locale === 'pt-br' ? PT_BR_REPLIES : EN_REPLIES;
}
