export const supportedLocales = ['it', 'en', 'es', 'fr', 'de'] as const;

export type SupportedLocale = (typeof supportedLocales)[number];

export const defaultLocale: SupportedLocale = 'en';

export function resolveLocale(deviceLocale?: string | null): SupportedLocale {
  const languageCode = deviceLocale?.toLowerCase().split(/[-_]/)[0];
  return supportedLocales.find((locale) => locale === languageCode) ?? defaultLocale;
}
