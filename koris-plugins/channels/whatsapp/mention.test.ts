import { describe, expect, it } from 'vitest';
import type { WAMessage } from '@whiskeysockets/baileys';
import {
  botNameToken,
  extractMentionedJids,
  isAddressedToBot,
  jidToNumber,
  normalizeNumber,
  stripBotAddressing,
  type BotIdentity,
} from './mention';

describe('normalizeNumber', () => {
  it('strips spaces, plus signs and punctuation', () => {
    expect(normalizeNumber('+55 (11) 99999-8888')).toBe('5511999998888');
  });

  it('returns an empty string when there are no digits', () => {
    expect(normalizeNumber('')).toBe('');
    expect(normalizeNumber('korisbot')).toBe('');
  });
});

describe('jidToNumber', () => {
  it('strips a device suffix and the JID domain', () => {
    expect(jidToNumber('5511999998888:7@s.whatsapp.net')).toBe('5511999998888');
    expect(jidToNumber('5511999998888@lid')).toBe('5511999998888');
    expect(jidToNumber('5511999998888@s.whatsapp.net')).toBe('5511999998888');
  });
});

describe('extractMentionedJids', () => {
  const wa = (message: unknown): WAMessage => ({ message } as WAMessage);

  it('reads mentionedJid from an extendedTextMessage contextInfo', () => {
    const msg = wa({
      extendedTextMessage: { text: 'hi', contextInfo: { mentionedJid: ['5511999998888@s.whatsapp.net'] } },
    });
    expect(extractMentionedJids(msg)).toEqual(['5511999998888@s.whatsapp.net']);
  });

  it('reads mentionedJid from an image caption contextInfo', () => {
    const msg = wa({
      imageMessage: { caption: 'look', contextInfo: { mentionedJid: ['5521888887777@lid'] } },
    });
    expect(extractMentionedJids(msg)).toEqual(['5521888887777@lid']);
  });

  it('returns an empty array when there is no mention metadata', () => {
    expect(extractMentionedJids(wa({ conversation: 'plain text' }))).toEqual([]);
    expect(extractMentionedJids(wa(undefined))).toEqual([]);
  });
});

describe('botNameToken', () => {
  it('lowercases a single-word display name', () => {
    expect(botNameToken('Koris')).toBe('koris');
  });

  it('takes only the first token of a multi-word name', () => {
    expect(botNameToken('Koris Assistant')).toBe('koris');
  });

  it('accepts accented letters', () => {
    expect(botNameToken('José')).toBe('josé');
  });

  it('rejects a token shorter than three characters', () => {
    expect(botNameToken('Ko')).toBe('');
  });

  it('rejects tokens that are not purely letters', () => {
    expect(botNameToken('koris2')).toBe('');
    expect(botNameToken('🤖bot')).toBe('');
    expect(botNameToken('bot-1')).toBe('');
  });

  it('returns an empty string for missing or blank input', () => {
    expect(botNameToken(undefined)).toBe('');
    expect(botNameToken(null)).toBe('');
    expect(botNameToken('   ')).toBe('');
  });
});

describe('isAddressedToBot', () => {
  const PN = '5562999998888';
  const LID = '199999999998888';
  const identity: BotIdentity = { ids: [PN, LID], name: 'koris' };
  const nameless: BotIdentity = { ids: [PN, LID], name: '' };

  it('is false when no bot id is known and no name is adopted', () => {
    expect(
      isAddressedToBot({ text: `@${PN} hi`, mentionedJids: [`${PN}@s.whatsapp.net`] }, { ids: [], name: '' }),
    ).toBe(false);
  });

  it('matches a phone-number mentionedJid (PN-addressed group)', () => {
    expect(isAddressedToBot({ text: 'hey help me', mentionedJids: [`${PN}:3@s.whatsapp.net`] }, nameless)).toBe(true);
  });

  it('matches a LID mentionedJid (LID-addressed group)', () => {
    expect(isAddressedToBot({ text: `@${LID} eai mano`, mentionedJids: [`${LID}@lid`] }, nameless)).toBe(true);
  });

  it('matches a LID even when only the LID is known', () => {
    expect(
      isAddressedToBot({ text: `@${LID} eai mano`, mentionedJids: [`${LID}@lid`] }, { ids: [LID], name: '' }),
    ).toBe(true);
  });

  it('falls back to an @<id> substring in the text', () => {
    expect(isAddressedToBot({ text: `hey @${PN} help me`, mentionedJids: [] }, nameless)).toBe(true);
  });

  it('is false when neither the metadata nor the text names the bot', () => {
    expect(
      isAddressedToBot(
        { text: 'hey @5500000000000 help me', mentionedJids: ['5500000000000@s.whatsapp.net'] },
        identity,
      ),
    ).toBe(false);
  });

  it('matches a reply to one of the bot’s own messages, by phone number', () => {
    expect(
      isAddressedToBot(
        { text: 'and what about tuesday?', mentionedJids: [], quotedParticipant: `${PN}:12@s.whatsapp.net` },
        nameless,
      ),
    ).toBe(true);
  });

  it('matches a reply to the bot in a LID-addressed group', () => {
    expect(
      isAddressedToBot(
        { text: 'and what about tuesday?', mentionedJids: [], quotedParticipant: `${LID}@lid` },
        nameless,
      ),
    ).toBe(true);
  });

  it('does not match a reply to somebody else', () => {
    expect(
      isAddressedToBot(
        { text: 'hah true', mentionedJids: [], quotedParticipant: '5500000000000@s.whatsapp.net' },
        identity,
      ),
    ).toBe(false);
  });

  it('matches the display name at the start of the text', () => {
    expect(isAddressedToBot({ text: 'Koris, are you there?', mentionedJids: [] }, identity)).toBe(true);
    expect(isAddressedToBot({ text: '  koris: status please', mentionedJids: [] }, identity)).toBe(true);
    expect(isAddressedToBot({ text: 'koris', mentionedJids: [] }, identity)).toBe(true);
  });

  it('does not match the display name away from the start', () => {
    expect(isAddressedToBot({ text: "I'll ask koris later", mentionedJids: [] }, identity)).toBe(false);
  });

  it('does not match a longer word that merely starts with the name', () => {
    expect(isAddressedToBot({ text: 'korisbot is down', mentionedJids: [] }, identity)).toBe(false);
  });

  it('never matches by name when the display name was unusable', () => {
    expect(isAddressedToBot({ text: 'Ko, are you there?', mentionedJids: [] }, { ids: [PN], name: botNameToken('Ko') })).toBe(false);
    expect(
      isAddressedToBot({ text: 'koris2, are you there?', mentionedJids: [] }, { ids: [PN], name: botNameToken('koris2') }),
    ).toBe(false);
  });
});

describe('stripBotAddressing', () => {
  const identity: BotIdentity = { ids: ['5562999998888', '199999999998888'], name: 'koris' };

  it('removes an @<lid> token and tidies whitespace', () => {
    expect(stripBotAddressing('@199999999998888 eai mano', identity)).toBe('eai mano');
  });

  it('removes an @<phone> token', () => {
    expect(stripBotAddressing('hey @5562999998888 help', { ids: ['5562999998888'], name: '' })).toBe('hey help');
  });

  it('leaves text untouched when no bot id appears', () => {
    expect(stripBotAddressing('nothing to strip here', { ...identity, name: '' })).toBe('nothing to strip here');
  });

  it('removes a leading name token and its separator', () => {
    expect(stripBotAddressing('Koris, what is on my agenda?', identity)).toBe('what is on my agenda?');
    expect(stripBotAddressing('koris: ping', identity)).toBe('ping');
    expect(stripBotAddressing('Koris ping', identity)).toBe('ping');
  });

  it('leaves the name alone when it is not the first token', () => {
    expect(stripBotAddressing("I'll ask koris later", identity)).toBe("I'll ask koris later");
  });

  it('keeps a message that is nothing but the bot’s name', () => {
    expect(stripBotAddressing('Koris?', identity)).toBe('Koris?');
  });

  it('strips a mention and a leading name together, with single spacing', () => {
    expect(stripBotAddressing('Koris @5562999998888 hey  help', identity)).toBe('hey help');
  });
});
