import type { WAMessage } from '@whiskeysockets/baileys';

/**
 * Everything the bot can be recognised by. Purely session-derived — there is no
 * configuration input for any of it (see `socket.ts:adoptBotIdentity`).
 */
export interface BotIdentity {
  /** Digit ids: [botNumber, botLid]. Empty strings filtered out. */
  ids: string[];
  /** First token of the session display name, lowercased. Empty when unusable. */
  name: string;
}

/** The parts of an inbound message that can carry "this is for the bot". */
export interface AddressingSignals {
  text: string;
  mentionedJids: string[];
  /** Author of the quoted message, when this message is a reply. */
  quotedParticipant?: string;
}

/** Strips everything except digits (drops `+`, spaces, dashes, parentheses). */
export function normalizeNumber(raw: string): string {
  return raw.replace(/\D/g, '');
}

/**
 * Digits-only identifier from a WhatsApp JID, dropping the `@domain`
 * (`@s.whatsapp.net` / `@lid`) and any `:device` suffix first so those digits
 * don't bleed into the number. `"5511999998888:7@s.whatsapp.net"` -> `"5511999998888"`.
 */
export function jidToNumber(jid: string): string {
  return normalizeNumber(jid.split('@')[0].split(':')[0]);
}

function readMentionedJids(container: unknown): string[] {
  if (!container || typeof container !== 'object') return [];
  const contextInfo = (container as Record<string, unknown>)['contextInfo'];
  if (!contextInfo || typeof contextInfo !== 'object') return [];
  const mentioned = (contextInfo as Record<string, unknown>)['mentionedJid'];
  if (!Array.isArray(mentioned)) return [];
  return mentioned.filter((jid): jid is string => typeof jid === 'string');
}

/** WhatsApp mention metadata: the JIDs explicitly @-tagged in a text or image caption. */
export function extractMentionedJids(msg: WAMessage): string[] {
  if (!msg.message || typeof msg.message !== 'object') return [];
  const content = msg.message as Record<string, unknown>;
  return [
    ...readMentionedJids(content['extendedTextMessage']),
    ...readMentionedJids(content['imageMessage']),
    ...readMentionedJids(content['audioMessage']),
  ];
}

/**
 * Normalizes a raw WhatsApp display name into an addressing token, or `''` when
 * it isn't usable as one. Only a single word of at least three letters is
 * accepted: multi-word names ("Koris Assistant" -> "koris"), digits and emoji
 * would all produce far too many false matches against ordinary group chatter.
 */
export function botNameToken(raw: string | null | undefined): string {
  const first = (raw ?? '').trim().split(/\s+/)[0] ?? '';
  if (first.length < 3) return '';
  if (!/^\p{L}+$/u.test(first)) return '';
  return first.toLowerCase();
}

/**
 * True when any of `botIds` (digit strings — the bot's phone number and/or its
 * LID) is the target of a mention, via WhatsApp's own `mentionedJid` metadata
 * or an `@<id>` token in the text. LID-addressed groups carry the bot's LID
 * here, never its phone number, so both identities have to be checked.
 */
function isBotMentioned(text: string, mentionedJids: string[], botIds: string[]): boolean {
  if (botIds.length === 0) return false;
  const mentionedNumbers = mentionedJids.map(jidToNumber);
  return botIds.some((id) => mentionedNumbers.includes(id) || text.includes(`@${id}`));
}

/**
 * Matches `<name>` at the very start of the text, followed by end-of-string or
 * a non-letter (`,` `:` whitespace `!` `?`). The "first token" requirement is
 * what keeps "ask koris about it" from counting as addressing the bot, and the
 * non-letter boundary keeps "korisbot" from matching "koris".
 */
function startsWithBotName(text: string, name: string): boolean {
  if (!name) return false;
  const head = text.trimStart().toLowerCase();
  if (!head.startsWith(name)) return false;
  const next = head[name.length];
  return next === undefined || !/\p{L}/u.test(next);
}

/**
 * The three signals a human reads as *talking to the bot* in a group: an
 * @-mention, a reply to one of the bot's own messages, or addressing it by its
 * display name. DMs are never gated on this (`handler.ts` short-circuits them).
 */
export function isAddressedToBot(signals: AddressingSignals, identity: BotIdentity): boolean {
  const ids = identity.ids.filter(Boolean);
  if (isBotMentioned(signals.text, signals.mentionedJids, ids)) return true;
  if (signals.quotedParticipant && ids.includes(jidToNumber(signals.quotedParticipant))) return true;
  return startsWithBotName(signals.text, identity.name);
}

/** Removes every `@<id>` token for the known bot identities and tidies whitespace. */
function stripBotMention(text: string, botIds: string[]): string {
  let out = text;
  for (const id of botIds.filter(Boolean)) {
    out = out.split(`@${id}`).join('');
  }
  return out.replace(/\s{2,}/g, ' ').trim();
}

/**
 * Drops every way the message named the bot, so the agent sees only what was
 * actually said: `@<id>` tokens anywhere, and a leading name token with its
 * trailing separator. A message that was *only* the bot's name ("Koris?") would
 * strip down to nothing, so that one is handed through untouched instead.
 */
export function stripBotAddressing(text: string, identity: BotIdentity): string {
  const withoutMentions = stripBotMention(text, identity.ids);
  if (!startsWithBotName(withoutMentions, identity.name)) return withoutMentions;

  const rest = withoutMentions.trimStart().slice(identity.name.length).replace(/^[\s,:!?]+/, '').trim();
  return rest || withoutMentions;
}
