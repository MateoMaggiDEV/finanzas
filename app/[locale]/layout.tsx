import type { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { ReactQueryClientProvider } from '../../components/providers/react-query-client-provider';
import { AuthSessionProvider } from '../../components/providers/session-provider';
import { KeyboardShortcuts } from '../../components/keyboard-shortcuts';
import { AppShell } from '../../components/app-shell';
import { getMessages } from '../../lib/messages';
import { locales, type Locale } from '../../i18n';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  const locale = params.locale as Locale;
  if (!locales.includes(locale)) {
    notFound();
  }
  const messages = await getMessages(locale);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ReactQueryClientProvider>
        <AuthSessionProvider>
          <KeyboardShortcuts locale={locale} />
          <AppShell locale={locale}>{children}</AppShell>
        </AuthSessionProvider>
      </ReactQueryClientProvider>
    </NextIntlClientProvider>
  );
}
