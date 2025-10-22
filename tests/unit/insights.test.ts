import { describe, expect, it } from 'vitest';
import { buildInsights } from '../../lib/insights';

const context = {
  cashflowNetMinor: -1000,
  burnRateMinor: 500,
  runwayMonths: 2,
  focusMetrics: {
    totalMinutes: 300,
    deepWorkMinutes: 90,
    interruptions: 60,
    billableMinutes: 120,
    contextSwitches: 6
  }
};

describe('insights', () => {
  it('generates guidance', () => {
    const insights = buildInsights(context);
    expect(insights).toContain('Revisa tus egresos del mes: el cashflow es negativo.');
    expect(insights.length).toBeGreaterThan(0);
  });
});
