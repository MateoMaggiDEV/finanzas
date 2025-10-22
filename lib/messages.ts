import 'server-only';

import { Locale, defaultLocale } from '../i18n';

export async function getMessages(locale: Locale) {
  const messages = await import(`../messages/${locale}.json`).catch(async () =>
    import(`../messages/${defaultLocale}.json`)
  );
  return messages.default;
}
