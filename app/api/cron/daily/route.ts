import { NextResponse } from 'next/server';
import { prisma } from '../../../../server/prisma';
import { buildInsights } from '../../../../lib/insights';
import { computeProductivity } from '../../../../lib/productivity';

export async function GET() {
  const user = await prisma.user.findFirst({ include: { timeEntries: true, transactions: true, interruptions: true } });
  if (!user) {
    return NextResponse.json({ status: 'no-user' });
  }
  const productivity = computeProductivity(
    user.timeEntries.map((entry) => ({
      id: entry.id,
      start: entry.start.toISOString(),
      end: entry.end.toISOString(),
      durationMin: entry.durationMin,
      deepWork: entry.deepWork,
      billable: entry.billable,
      clientId: entry.clientId ?? undefined,
      projectId: entry.projectId ?? undefined,
      source: entry.source as 'MANUAL' | 'TIMER' | 'CALENDAR'
    })),
    user.interruptions.map((item) => ({ id: item.id, at: item.at.toISOString(), minutes: item.minutes }))
  );

  const insights = buildInsights({
    cashflowNetMinor: user.transactions.reduce((acc, tx) => acc + tx.amountMinor, 0),
    burnRateMinor: 0,
    runwayMonths: 4,
    focusMetrics: productivity
  });

  return NextResponse.json({ status: 'ok', insights });
}
