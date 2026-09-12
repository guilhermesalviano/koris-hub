import type { AudioTranscriber, IChannelHandlerFactory, ILogger } from '../contracts';
import type { BotIdentity } from './mention';
import type { SocketLike } from './types';

export const whatsappState = {
  channelHandler: undefined as unknown as IChannelHandlerFactory,
  /** Set on socket start so send helpers can log outside the inbound handler. */
  logger: undefined as ILogger | undefined,
  /** The bot's phone number (digits), auto-detected from the session — never configured. */
  botNumber: '',
  /** The bot's LID (digits), auto-detected from the session — mentions in LID-addressed groups use this. */
  botLid: '',
  /** The bot's display-name addressing token, auto-detected from the session — never configured. */
  botName: '',
  whitelist: [] as string[],
  allowUntrusted: false,
  activeSocket: null as SocketLike | null,
  audioTranscriber: undefined as AudioTranscriber | undefined,
};

/** The identities learned from the live session, in the shape `mention.ts` reads. */
export function botIdentity(): BotIdentity {
  return {
    ids: [whatsappState.botNumber, whatsappState.botLid].filter(Boolean),
    name: whatsappState.botName,
  };
}
