'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function KeyboardShortcuts({ locale }: { locale: string }) {
  const router = useRouter();

  useEffect(() => {
    function handler(event: KeyboardEvent) {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }
      switch (event.key.toLowerCase()) {
        case 't':
          event.preventDefault();
          router.push(`/${locale}/tiempo?timer=toggle`);
          break;
        case 'i':
          event.preventDefault();
          router.push(`/${locale}/tiempo?interruption=new`);
          break;
        case 'n':
          event.preventDefault();
          router.push(`/${locale}/finanzas?transaction=new`);
          break;
        case '/':
          event.preventDefault();
          router.push(`/${locale}/search`);
          break;
      }
    }
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [locale, router]);

  return null;
}
