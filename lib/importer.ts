import Papa from 'papaparse';
import { z } from 'zod';

const mappingSchema = z.record(z.string(), z.string());

export interface CsvProfile {
  id: string;
  name: string;
  delimiter: string;
  mapping: Record<string, string>;
}

export interface ParsedTransaction {
  date: string;
  amountMinor: number;
  description: string;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
}

export function parseCsvTransactions(
  csvContent: string,
  profile: CsvProfile
): ParsedTransaction[] {
  const mapping = mappingSchema.parse(profile.mapping);
  const result = Papa.parse<Record<string, string>>(csvContent, {
    delimiter: profile.delimiter,
    header: true,
    skipEmptyLines: true
  });

  if (result.errors.length > 0) {
    throw new Error(result.errors.map((error) => error.message).join(', '));
  }

  return result.data.map((row, index) => {
    const amount = Number(row[mapping.amountMinor]);
    if (Number.isNaN(amount)) {
      throw new Error(`Fila ${index + 1}: monto inválido`);
    }
    const type = (row[mapping.type] || 'EXPENSE').toUpperCase() as ParsedTransaction['type'];

    return {
      date: row[mapping.date],
      amountMinor: Math.round(amount * 100),
      description: row[mapping.description] ?? '',
      type: ['INCOME', 'EXPENSE', 'TRANSFER'].includes(type) ? type : 'EXPENSE'
    };
  });
}

export const MERCADO_PAGO_PROFILE: CsvProfile = {
  id: 'mercado-pago',
  name: 'Mercado Pago',
  delimiter: ',',
  mapping: {
    date: 'Fecha',
    amountMinor: 'Importe',
    description: 'Descripción',
    type: 'Tipo'
  }
};

export const UALA_PROFILE: CsvProfile = {
  id: 'uala',
  name: 'Ualá',
  delimiter: ',',
  mapping: {
    date: 'Fecha',
    amountMinor: 'Monto',
    description: 'Detalle',
    type: 'Movimiento'
  }
};
