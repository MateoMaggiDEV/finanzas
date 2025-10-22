import { NextResponse } from 'next/server';
import { prisma } from '../../../../server/prisma';
import { groupCashflowByMonth } from '../../../../lib/cashflow';

export async function GET() {
  const user = await prisma.user.findFirst({ include: { transactions: true } });
  if (!user) return NextResponse.json({ status: 'no-user' });

  const cashflow = groupCashflowByMonth(
    user.transactions.map((tx) => ({
      id: tx.id,
      userId: tx.userId,
      accountId: tx.accountId,
      type: tx.type as 'INCOME' | 'EXPENSE' | 'TRANSFER',
      amountMinor: tx.amountMinor,
      currency: tx.currency as 'ARS' | 'USD' | 'EUR',
      date: tx.date.toISOString().slice(0, 10)
    })),
    'ARS'
  );

  return NextResponse.json({ status: 'ok', cashflow });
}
