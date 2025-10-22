import { describe, expect, it } from 'vitest';
import { MERCADO_PAGO_PROFILE, parseCsvTransactions } from '../../lib/importer';

const csv = `Fecha,Descripción,Importe,Tipo
2024-05-01,Venta,120000,INCOME
`;

describe('importer', () => {
  it('parses csv using mapping profile', () => {
    const parsed = parseCsvTransactions(csv, MERCADO_PAGO_PROFILE);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].amountMinor).toBe(12_000_000);
  });
});
