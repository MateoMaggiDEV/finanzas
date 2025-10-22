'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { cn } from '../lib/utils';

const items = [
  { href: '', key: 'nav.dashboard', icon: '🏠' },
  { href: 'finanzas', key: 'nav.finances', icon: '💰' },
  { href: 'tiempo', key: 'nav.time', icon: '⏱️' },
  { href: 'clientes', key: 'nav.clients', icon: '🤝' },
  { href: 'proyectos', key: 'nav.projects', icon: '🎬' },
  { href: 'reportes', key: 'nav.reports', icon: '📊' },
  { href: 'automatizaciones', key: 'nav.automation', icon: '⚙️' },
  { href: 'ajustes', key: 'nav.settings', icon: '⚖️' }
];

export function Sidebar({ locale }: { locale: string }) {
  const pathname = usePathname();
  const t = useTranslations();

  return (
    <aside className="flex h-full w-64 flex-col border-r border-slate-200 bg-white">
      <div className="flex items-center gap-2 border-b border-slate-100 px-6 py-5">
        <span className="text-2xl">🎬</span>
        <span className="text-lg font-semibold">NombreDeLaApp</span>
      </div>
      <nav className="flex-1 space-y-1 px-2 py-4">
        {items.map((item) => {
          const href = `/${locale}/${item.href}`.replace(/\/$/, '');
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={item.key}
              href={href || `/${locale}`}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900',
                active && 'bg-slate-900 text-white hover:bg-slate-900 hover:text-white'
              )}
            >
              <span>{item.icon}</span>
              <span>{t(item.key)}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
