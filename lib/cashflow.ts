import { addMonths, differenceInCalendarDays, parseISO } from 'date-fns';
import { convertCurrency, type CurrencyCode } from './currency';

export type TransactionType = 'INCOME' | 'EXPENSE' | 'TRANSFER';

export interface TransactionLike {
  id: string;
  userId: string;
  accountId: string;
  type: TransactionType;
  amountMinor: number;
  currency: CurrencyCode;
  date: string;
}

export interface AccountBalanceLike {
  accountId: string;
  balanceMinor: number;
  currency: CurrencyCode;
}

export interface CashflowSeriePoint {
  month: string;
  incomeMinor: number;
  expenseMinor: number;
  netMinor: number;
}

export function normalizeToCurrency<T extends { currency: CurrencyCode; amountMinor: number }>(
  items: T[],
  currency: CurrencyCode
) {
  return items.map((item) => ({
    ...item,
    amountMinor: convertCurrency(item.amountMinor, item.currency, currency)
  }));
}

export function groupCashflowByMonth(
  transactions: TransactionLike[],
  currency: CurrencyCode
): CashflowSeriePoint[] {
  const normalized = normalizeToCurrency(transactions, currency);
  const map = new Map<string, { income: number; expense: number }>();
  normalized.forEach((tx) => {
    const month = tx.date.slice(0, 7);
    if (!map.has(month)) {
      map.set(month, { income: 0, expense: 0 });
    }
    const bucket = map.get(month)!;
    if (tx.type === 'INCOME') bucket.income += tx.amountMinor;
    if (tx.type === 'EXPENSE') bucket.expense += Math.abs(tx.amountMinor);
  });

  return Array.from(map.entries())
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([month, value]) => ({
      month,
      incomeMinor: value.income,
      expenseMinor: value.expense,
      netMinor: value.income - value.expense
    }));
}

export function calculateRunway(
  balances: AccountBalanceLike[],
  monthlyBurnMinor: number,
  currency: CurrencyCode
) {
  if (monthlyBurnMinor <= 0) return Infinity;
  const normalized = normalizeToCurrency(balances, currency);
  const total = normalized.reduce((sum, balance) => sum + balance.amountMinor, 0);
  return total / monthlyBurnMinor;
}

export function averageMonthlyBurn(transactions: TransactionLike[], currency: CurrencyCode) {
  const normalized = normalizeToCurrency(transactions, currency);
  const expenses = normalized.filter((tx) => tx.type === 'EXPENSE');
  if (expenses.length === 0) return 0;
  const byMonth = groupCashflowByMonth(expenses, currency);
  const total = byMonth.reduce((sum, month) => sum + month.expenseMinor, 0);
  return total / byMonth.length || 0;
}

export function budgetProgress({
  limitMinor,
  spentMinor
}: {
  limitMinor: number;
  spentMinor: number;
}) {
  if (limitMinor === 0) return 0;
  return Math.min(1, spentMinor / limitMinor);
}

export interface TimeAndIncomeSnapshot {
  periodHours: number;
  billableHours: number;
  incomeMinor: number;
}

export function effectiveRatePerHour(snapshot: TimeAndIncomeSnapshot) {
  if (snapshot.periodHours === 0) return 0;
  return snapshot.incomeMinor / snapshot.periodHours;
}

export function detectDuplicates(transactions: TransactionLike[]) {
  const seen = new Map<string, TransactionLike>();
  const duplicates: TransactionLike[] = [];
  transactions.forEach((tx) => {
    const key = `${tx.amountMinor}-${tx.date}-${tx.type}`;
    if (seen.has(key)) {
      const existing = seen.get(key)!;
      const diff = Math.abs(differenceInCalendarDays(parseISO(existing.date), parseISO(tx.date)));
      if (diff <= 1) {
        duplicates.push(tx);
      }
    } else {
      seen.set(key, tx);
    }
  });
  return duplicates;
}

export function forecastBudgetAlert(limitMinor: number, spentMinor: number) {
  const ratio = budgetProgress({ limitMinor, spentMinor });
  if (ratio >= 1) return 'danger';
  if (ratio >= 0.8) return 'warning';
  return 'ok';
}

export function runwayFromTransactions(transactions: TransactionLike[], balances: AccountBalanceLike[], currency: CurrencyCode) {
  const burn = averageMonthlyBurn(transactions, currency);
  return calculateRunway(balances, burn, currency);
}

export function futureDateRange(startDate: string, months: number) {
  const result: string[] = [];
  let cursor = parseISO(`${startDate}-01`);
  for (let i = 0; i < months; i += 1) {
    const current = addMonths(cursor, i);
    result.push(`${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`);
  }
  return result;
}
