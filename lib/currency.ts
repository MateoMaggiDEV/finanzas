export type CurrencyCode = 'ARS' | 'USD' | 'EUR';

export interface CurrencyRate {
  from: CurrencyCode;
  to: CurrencyCode;
  rate: number; // 1 unit of from in to
}

export const DEFAULT_RATES: CurrencyRate[] = [
  { from: 'USD', to: 'ARS', rate: 900 },
  { from: 'EUR', to: 'ARS', rate: 980 },
  { from: 'ARS', to: 'USD', rate: 1 / 900 },
  { from: 'ARS', to: 'EUR', rate: 1 / 980 }
];

export function convertCurrency(
  amountMinor: number,
  from: CurrencyCode,
  to: CurrencyCode,
  rates: CurrencyRate[] = DEFAULT_RATES
) {
  if (from === to) return amountMinor;
  const match = rates.find((rate) => rate.from === from && rate.to === to);
  if (!match) {
    throw new Error(`Missing currency rate from ${from} to ${to}`);
  }
  return Math.round(amountMinor * match.rate);
}
