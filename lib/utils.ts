import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amountMinor: number, currency: string) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2
  }).format(amountMinor / 100);
}

export function sumBy<T>(items: T[], iteratee: (item: T) => number) {
  return items.reduce((acc, item) => acc + iteratee(item), 0);
}
