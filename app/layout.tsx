import './globals.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'NombreDeLaApp',
  description: 'Finanzas y productividad unificadas para agencias de edición de video.'
};

export default function RootLayout({
  children
}: {
  children: ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-slate-50 text-slate-900">{children}</body>
    </html>
  );
}
