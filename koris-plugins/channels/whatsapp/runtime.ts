import type { AudioTranscriber, IChannelHandlerFactory } from '../contracts';
import { loadWhatsAppConfig, type WhatsAppPluginConfig } from './config';
import { whatsappState } from './state';

/**
 * Primes the module-level runtime state (channel handler, whitelist, trust
 * policy) that `create()` normally sets once at boot, so a caller can
 * (re)start WhatsApp live — e.g. after the setup wizard changes
 * these values — without restarting the process. Re-reads `config.yml` from
 * disk when no `config` is passed explicitly — which also picks up an
 * `allow_unlisted_senders` change saved via the web UI. Returns the resolved
 * config so callers don't need to know its shape ahead of time.
 *
 * Deliberately does NOT touch the bot's identity (`botNumber` / `botLid` /
 * `botName`): this runs again on every settings save while the socket is live
 * (`core/src/dashboard/live-channel-runtime.ts`), so writing identity here
 * would wipe what `adoptBotIdentity` detected.
 */
export function configureWhatsAppRuntime(cfg: {
  channelHandler: IChannelHandlerFactory;
  config?: WhatsAppPluginConfig;
  audioTranscriber?: AudioTranscriber;
}): WhatsAppPluginConfig {
  const resolved = cfg.config ?? loadWhatsAppConfig();
  whatsappState.channelHandler = cfg.channelHandler;
  whatsappState.whitelist = resolved.whitelist.split(',').map((num) => num.trim()).filter(Boolean);
  whatsappState.allowUntrusted = resolved.allowUnlistedSenders;
  if ('audioTranscriber' in cfg) {
    whatsappState.audioTranscriber = cfg.audioTranscriber;
  }
  return resolved;
}
