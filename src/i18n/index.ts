import { en } from './en';
import { ptBr } from './pt-br';
import type { Locale } from './locales';

/**
 * The dictionary shape, derived from English. Every other locale is typed
 * against this, so adding a key to `en.ts` without translating it breaks
 * `pnpm lint` instead of silently rendering nothing.
 *
 * The mapped type strips the `as const` literal types from `en`, so
 * translations are free to differ in wording (they just have to be strings).
 */
export type Dictionary = {
  [Section in keyof typeof en]: { [Key in keyof (typeof en)[Section]]: string };
};

const dictionaries: Record<Locale, Dictionary> = {
  en,
  'pt-br': ptBr,
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export type { Locale };
