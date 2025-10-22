import { describe, expect, it } from 'vitest';
import {
  averageMonthlyBurn,
  budgetProgress,
  detectDuplicates,
  forecastBudgetAlert,
  groupCashflowByMonth,
  runwayFromTransactions
} from '../../lib/cashflow';

const sampleTransactions = [
  {
    id: '1',
    userId: 'user',
    accountId: 'acc',
    type: 'INCOME' as const,
    amountMinor: 100_000,
    currency: 'ARS' as const,
    date: '2024-01-15'
  },
  {
    id: '2',
    userId: 'user',
    accountId: 'acc',
    type: 'EXPENSE' as const,
    amountMinor: -50_000,
    currency: 'ARS' as const,
    date: '2024-01-20'
  }
];

describe('cashflow calculations', () => {
  it('groups cashflow by month', () => {
    const result = groupCashflowByMonth(sampleTransactions, 'ARS');
    expect(result).toHaveLength(1);
    expect(result[0].netMinor).toBe(50_000);
  });

  it('computes average monthly burn', () => {
    const burn = averageMonthlyBurn(sampleTransactions, 'ARS');
    expect(burn).toBeGreaterThan(0);
  });

  it('computes runway from balances', () => {
    const runway = runwayFromTransactions(sampleTransactions, [{ accountId: 'acc', balanceMinor: 200_000, currency: 'ARS' }], 'ARS');
    expect(runway).toBeGreaterThan(0);
  });

  it('detects duplicates within 1 day difference', () => {
    const duplicates = detectDuplicates([
      sampleTransactions[0],
      {
        ...sampleTransactions[0],
        id: 'dup',
        date: '2024-01-16'
      }
    ]);
    expect(duplicates).toHaveLength(1);
  });

  it('computes budget progress with alerts', () => {
    expect(budgetProgress({ limitMinor: 100, spentMinor: 50 })).toBe(0.5);
    expect(forecastBudgetAlert(100, 50)).toBe('warning');
  });
});
