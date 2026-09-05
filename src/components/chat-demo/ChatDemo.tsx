'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import styles from './chat-demo.module.css';
import { CANNED_REPLIES, MOCK_SESSIONS, type DemoMessage } from './mock-data';
import {
  AttachIcon,
  AuditIcon,
  ChevronDownIcon,
  HeartbeatsIcon,
  MemoriesIcon,
  OverviewIcon,
  PluginsIcon,
  PlusIcon,
  QueueIcon,
  SendIcon,
  SettingsIcon,
  SkillsIcon,
} from './icons';

const NAV_ITEMS = [
  { label: 'Overview', icon: OverviewIcon },
  { label: 'Memories', icon: MemoriesIcon },
  { label: 'Beats', icon: HeartbeatsIcon },
  { label: 'Skills', icon: SkillsIcon },
  { label: 'Queue', icon: QueueIcon },
  { label: 'Audit', icon: AuditIcon },
];

const PROVIDERS = [
  { name: 'ollama', model: 'gemma4:e4b-it-q4_K_M', active: true },
  { name: 'nvidia', model: 'llama-3.3-70b', active: false },
  { name: 'mock', model: '', active: false },
];

function now(): string {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 px-1">
      <span className={`h-[5px] w-[5px] rounded-full bg-[var(--txt-3)] ${styles.blink}`} />
      <span className={`h-[5px] w-[5px] rounded-full bg-[var(--txt-3)] ${styles.blink2}`} />
      <span className={`h-[5px] w-[5px] rounded-full bg-[var(--txt-3)] ${styles.blink3}`} />
    </div>
  );
}

function Bubble({ message }: { message: DemoMessage }) {
  const isUser = message.role === 'user';
  return (
    <div className={`flex gap-2.5 ${styles.msgIn} ${isUser ? 'flex-row-reverse' : ''}`}>
      {!isUser && (
        <div className="mt-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[var(--accent)] font-mono text-[10px] font-medium text-white">
          ai
        </div>
      )}
      <div className={`flex max-w-[calc(100%-44px)] flex-col gap-1 ${isUser ? 'items-end' : ''}`}>
        {isUser ? (
          <div className="break-words rounded-[var(--radius-card)] rounded-br-[5px] bg-[var(--accent)] px-3.5 py-2.5 text-sm leading-relaxed text-white">
            {message.content}
          </div>
        ) : message.pending ? (
          <div className="break-words rounded-[var(--radius-card)] rounded-bl-[5px] border border-[var(--subtle)] bg-[var(--bg-3)] px-3.5 py-2.5 text-sm leading-relaxed text-[var(--txt)]">
            <TypingDots />
          </div>
        ) : (
          <div className="break-words rounded-[var(--radius-card)] rounded-bl-[5px] border border-[var(--subtle)] bg-[var(--bg-3)] px-3.5 py-2.5 text-sm leading-relaxed text-[var(--txt)]">
            {message.content}
          </div>
        )}
        {!message.pending && <span className="px-1 font-mono text-[11px] text-[var(--txt-3)]">{message.timestamp}</span>}
      </div>
    </div>
  );
}

function ContextBar({ pct }: { pct: number }) {
  const near = pct >= 75;
  const fill = near ? 'bg-amber-500' : 'bg-[var(--accent)]';
  const label = near ? 'text-amber-400' : '';
  return (
    <div className="w-40 font-mono text-[10px] text-[var(--txt-3)]">
      <div className="flex items-center justify-between">
        <span>context</span>
        <span className={label}>{pct}%</span>
      </div>
      <div className="mt-1 h-1 overflow-hidden rounded-full bg-[var(--bg-4)]">
        <div className={`h-full rounded-full transition-all duration-500 ${fill}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function ProviderPicker() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const active = PROVIDERS.find((p) => p.active)!;

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    window.addEventListener('mousedown', onDown);
    return () => window.removeEventListener('mousedown', onDown);
  }, [open]);

  return (
    <div ref={wrapRef} className="relative min-w-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        title="AI provider for this chat (preview only)"
        className="flex min-w-0 max-w-full items-center gap-1.5 rounded-lg border border-[var(--strong)] bg-[var(--bg-3)] px-2 py-1 text-[var(--txt-2)] transition-colors duration-150 hover:border-[var(--accent)] hover:text-[var(--txt)]"
      >
        <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-500" />
        <span className="truncate">
          {active.name} · {active.model}
        </span>
        <ChevronDownIcon className="h-3 w-3 flex-shrink-0 fill-none stroke-current" />
      </button>

      {open && (
        <div className="absolute bottom-full left-0 z-20 mb-2 w-64 max-w-[calc(100vw-2rem)] overflow-hidden rounded-[var(--radius-card)] border border-[var(--strong)] bg-[var(--bg-2)] py-1 shadow-2xl">
          {PROVIDERS.map((p) => (
            <div
              key={p.name}
              onClick={() => setOpen(false)}
              className="flex cursor-pointer items-center gap-2 px-3 py-2 hover:bg-[var(--bg-3)]"
            >
              <span className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${p.active ? 'bg-[var(--accent)]' : 'bg-[var(--txt-3)]'}`} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] text-[var(--txt)]">{p.name}</span>
                {p.model && <span className="block truncate font-mono text-[10px] text-[var(--txt-3)]">{p.model}</span>}
              </span>
              {p.active && (
                <span className="flex-shrink-0 rounded bg-[var(--accent-muted)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--accent-2)]">
                  active
                </span>
              )}
            </div>
          ))}
          <div className="my-1 border-t border-[var(--subtle)]" />
          <div className="px-3 py-2 text-left text-[13px] text-[var(--txt-3)]">Full switching in the real dashboard</div>
        </div>
      )}
    </div>
  );
}

export function ChatDemo() {
  const [activeId, setActiveId] = useState<string | null>(MOCK_SESSIONS[0].id);
  const [sessionMessages, setSessionMessages] = useState<Record<string, DemoMessage[]>>(() =>
    Object.fromEntries(MOCK_SESSIONS.map((s) => [s.id, s.messages])),
  );
  const [newChatMessages, setNewChatMessages] = useState<DemoMessage[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);

  const nextId = useRef(1000);
  const replyIndex = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const messages = activeId ? sessionMessages[activeId] : newChatMessages;
  const activeTitle = activeId ? MOCK_SESSIONS.find((s) => s.id === activeId)?.title : undefined;
  const contextPct = useMemo(() => Math.min(92, messages.length * 6 + 8), [messages.length]);

  useEffect(() => {
    if (threadRef.current) threadRef.current.scrollTop = threadRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  function setMessages(updater: (prev: DemoMessage[]) => DemoMessage[]) {
    if (activeId) {
      setSessionMessages((prev) => ({ ...prev, [activeId]: updater(prev[activeId] ?? []) }));
    } else {
      setNewChatMessages(updater);
    }
  }

  function handleNewChat() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setStreaming(false);
    setActiveId(null);
    setNewChatMessages([]);
    setInput('');
    requestAnimationFrame(() => textareaRef.current?.focus());
  }

  function handleSelectSession(id: string) {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setStreaming(false);
    setActiveId(id);
    setInput('');
  }

  function submit() {
    const text = input.trim();
    if (!text || streaming) return;

    const userMsg: DemoMessage = { id: nextId.current++, role: 'user', content: text, timestamp: now() };
    const pendingMsg: DemoMessage = { id: nextId.current++, role: 'assistant', content: '', timestamp: now(), pending: true };
    setMessages((prev) => [...prev, userMsg, pendingMsg]);
    setInput('');
    setStreaming(true);

    const targetId = activeId;
    const reply = CANNED_REPLIES[replyIndex.current % CANNED_REPLIES.length];
    replyIndex.current += 1;

    timeoutRef.current = setTimeout(
      () => {
        const apply = (prev: DemoMessage[]) =>
          prev.map((m) => (m.id === pendingMsg.id ? { ...m, content: reply, pending: false, timestamp: now() } : m));
        if (targetId) {
          setSessionMessages((prev) => ({ ...prev, [targetId]: apply(prev[targetId] ?? []) }));
        } else {
          setNewChatMessages(apply);
        }
        setStreaming(false);
      },
      700 + Math.random() * 500,
    );
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  const showEmptyState = messages.length === 0;

  const composer = (
    <>
      <div className="flex items-start gap-2 rounded-[var(--radius-card)] border border-[var(--strong)] bg-[var(--bg-3)] px-4 py-2.5 pr-2.5 transition-colors duration-200 focus-within:border-[var(--accent)]">
        <button
          type="button"
          disabled
          title="Not available in this preview"
          className="flex h-[34px] w-[34px] flex-shrink-0 cursor-not-allowed items-center justify-center rounded-[10px] border-none bg-transparent text-[var(--txt-3)] opacity-40"
        >
          <AttachIcon className="h-[16px] w-[16px] fill-none stroke-current" />
        </button>
        <textarea
          ref={textareaRef}
          rows={1}
          placeholder="Ask something…"
          autoComplete="off"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="max-h-32 min-h-[22px] flex-1 resize-none bg-transparent font-sans text-sm leading-snug text-[var(--txt)] outline-none placeholder:text-[var(--txt-3)]"
        />
        <button
          type="button"
          disabled={!input.trim() || streaming}
          title="Send message"
          onClick={submit}
          className="relative flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center overflow-hidden rounded-[10px] border-none bg-[var(--accent)] transition-all duration-150 hover:enabled:opacity-90 active:enabled:scale-95 disabled:opacity-35 disabled:cursor-default"
        >
          <SendIcon className="relative z-10 h-[15px] w-[15px] fill-none stroke-white" />
        </button>
      </div>
      <div className="mt-1.5 flex items-center justify-between gap-2 px-1 font-mono text-[11px] text-[var(--txt-3)]">
        <ProviderPicker />
        <div className="flex min-w-0 items-center gap-2">
          <span className="hidden shrink-0 sm:inline">↵ send · ⇧↵ newline</span>
          <span className="shrink-0">{input.length}</span>
        </div>
      </div>
    </>
  );

  return (
    <div className={`${styles.root} flex h-[600px] w-full flex-col overflow-hidden rounded-2xl border border-[var(--subtle)] bg-[var(--bg)]`}>
      <header className="flex h-14 flex-shrink-0 items-center justify-between gap-2 border-b border-[var(--subtle)] bg-[color-mix(in_srgb,var(--bg)_80%,transparent)] px-4 backdrop-blur-md">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[var(--accent)]">
            <Image src="/logo.png" alt="koris" width={30} height={30} className="h-full w-full object-cover" />
          </div>
          <div className="hidden sm:block">
            <div className="text-[13px] font-medium text-[var(--txt)]">koris</div>
            <div className="font-mono text-[11px] text-[var(--txt-3)]">Admin panel</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-[var(--subtle)] bg-[var(--bg-3)] px-2.5 py-1 font-mono text-[11px] text-[var(--txt-3)]">
          <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
          <span className="hidden sm:inline">Online</span>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-56 flex-shrink-0 flex-col border-r border-[var(--subtle)] bg-[var(--bg-2)] md:flex">
          <nav className="flex-shrink-0 space-y-0.5 p-2 pb-1.5">
            {NAV_ITEMS.map(({ label, icon: Icon }) => (
              <button
                key={label}
                type="button"
                aria-disabled
                title="Only available in the full dashboard"
                className="flex w-full cursor-default items-center gap-2.5 rounded-lg border border-transparent px-3 py-2.5 text-[13px] text-[var(--txt-2)] opacity-60"
              >
                <Icon className="h-4 w-4 flex-shrink-0 fill-none stroke-current" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
          <div className="flex-shrink-0 border-t border-[var(--subtle)]" />
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="p-3">
              <button
                type="button"
                onClick={handleNewChat}
                className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-[var(--strong)] bg-[var(--bg-3)] px-3 py-2 text-[13px] text-[var(--txt)] transition-all duration-150 hover:border-[var(--accent)] hover:bg-[var(--accent-muted)] hover:text-[var(--accent-2)]"
              >
                <PlusIcon className="h-3.5 w-3.5 fill-none stroke-current" />
                New chat
              </button>
            </div>
            <div className="px-4 pb-1 pt-1 font-mono text-[10px] uppercase tracking-wider text-[var(--txt-3)]">Chats</div>
            <div className={`flex-1 space-y-0.5 overflow-y-auto px-2 pb-3 ${styles.scrollThin}`}>
              {MOCK_SESSIONS.map((session) => {
                const isActive = session.id === activeId;
                return (
                  <button
                    key={session.id}
                    type="button"
                    onClick={() => handleSelectSession(session.id)}
                    className={`w-full rounded-lg border px-3 py-2 text-left transition-colors duration-150 ${
                      isActive ? 'border-[var(--accent-muted)] bg-[var(--accent-muted)]' : 'border-transparent hover:bg-[var(--bg-3)]'
                    }`}
                  >
                    <div className="truncate text-[13px] text-[var(--txt)]">{session.title}</div>
                    <div className="mt-1 flex items-center gap-1.5 font-mono text-[10px] text-[var(--txt-3)]">
                      <span>{session.timestamp}</span>
                      <span>·</span>
                      <span>{session.channel}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex-shrink-0 space-y-0.5 border-t border-[var(--subtle)] p-2">
            <button
              type="button"
              aria-disabled
              title="Only available in the full dashboard"
              className="flex w-full cursor-default items-center gap-2.5 rounded-lg border border-transparent px-3 py-2.5 text-[13px] text-[var(--txt-2)] opacity-60"
            >
              <PluginsIcon className="h-4 w-4 flex-shrink-0 fill-none stroke-current" />
              <span>Plugins</span>
            </button>
            <button
              type="button"
              aria-disabled
              title="Only available in the full dashboard"
              className="flex w-full cursor-default items-center gap-2.5 rounded-lg border border-transparent px-3 py-2.5 text-[13px] text-[var(--txt-2)] opacity-60"
            >
              <SettingsIcon className="h-4 w-4 flex-shrink-0 fill-none stroke-current" />
              <span>Configuration</span>
            </button>
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <div className="flex flex-shrink-0 items-center justify-between gap-2 border-b border-[var(--subtle)] px-4 py-2">
            <span className="truncate font-mono text-[11px] text-[var(--txt-3)]">{activeTitle || 'New chat'}</span>
            <ContextBar pct={contextPct} />
          </div>

          {showEmptyState ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-5 px-4">
              <h2 className="text-center text-xl font-medium text-[var(--txt)]">What can I help with?</h2>
              <div className="w-full max-w-2xl">{composer}</div>
            </div>
          ) : (
            <>
              <div ref={threadRef} className={`flex flex-1 flex-col gap-5 overflow-y-auto scroll-smooth px-5 py-6 ${styles.scrollThin}`}>
                {messages.map((m) => (
                  <Bubble key={m.id} message={m} />
                ))}
              </div>
              <div className="flex-shrink-0 border-t border-[var(--subtle)] bg-[color-mix(in_srgb,var(--bg)_90%,transparent)] px-4 pb-4 pt-3 backdrop-blur-md">
                {composer}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
