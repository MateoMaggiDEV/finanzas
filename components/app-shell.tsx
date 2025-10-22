import type { ReactNode } from 'react';
import { Sidebar } from './sidebar';

export function AppShell({
  children,
  locale
}: {
  children: ReactNode;
  locale: string;
}) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar locale={locale} />
      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-4">
          <div>
            <p className="text-sm text-slate-500">AR$ • Lunes a Sábado • Foco sugerido 09-13 / 16-18</p>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <span>🔥 Focus 62%</span>
            <span>👤 Martina Founder</span>
          </div>
        </header>
        <main className="px-8 py-6">{children}</main>
      </div>
    </div>
  );
}
