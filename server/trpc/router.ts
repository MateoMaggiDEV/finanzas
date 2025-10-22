import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from './trpc';
import { prisma } from '../prisma';
import { groupCashflowByMonth, runwayFromTransactions } from '../../lib/cashflow';
import { computeProductivity, detectFocusRecommendations } from '../../lib/productivity';

export const appRouter = router({
  health: publicProcedure.query(() => ({ status: 'ok' })),
  dashboard: protectedProcedure.query(async ({ ctx }) => {
    const [accounts, transactions, timeEntries, interruptions] = await Promise.all([
      prisma.account.findMany({ where: { userId: ctx.userId } }),
      prisma.transaction.findMany({ where: { userId: ctx.userId }, orderBy: { date: 'desc' }, take: 120 }),
      prisma.timeEntry.findMany({ where: { userId: ctx.userId } }),
      prisma.interruption.findMany({ where: { userId: ctx.userId } })
    ]);

    const cashflow = groupCashflowByMonth(
      transactions.map((tx) => ({
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

    const balances = accounts.map((account) => ({
      accountId: account.id,
      balanceMinor: account.balanceMinor,
      currency: account.currency as 'ARS' | 'USD' | 'EUR'
    }));

    const runway = runwayFromTransactions(
      transactions.map((tx) => ({
        id: tx.id,
        userId: tx.userId,
        accountId: tx.accountId,
        type: tx.type as 'INCOME' | 'EXPENSE' | 'TRANSFER',
        amountMinor: tx.amountMinor,
        currency: tx.currency as 'ARS' | 'USD' | 'EUR',
        date: tx.date.toISOString().slice(0, 10)
      })),
      balances,
      'ARS'
    );

    const productivity = computeProductivity(
      timeEntries.map((entry) => ({
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
      interruptions.map((i) => ({ id: i.id, at: i.at.toISOString(), minutes: i.minutes }))
    );

    const focusRecommendations = detectFocusRecommendations(productivity);

    return {
      cashflow,
      balances,
      runway,
      productivity,
      focusRecommendations
    };
  }),
  createRule: protectedProcedure
    .input(
      z.object({
        expression: z.string().min(1),
        mode: z.enum(['contains', 'regex']),
        categoryId: z.string().optional(),
        clientId: z.string().optional(),
        projectId: z.string().optional(),
        tags: z.array(z.string()).default([])
      })
    )
    .mutation(async ({ ctx, input }) => {
      const rule = await prisma.rule.create({
        data: {
          userId: ctx.userId,
          expression: input.expression,
          mode: input.mode,
          categoryId: input.categoryId,
          clientId: input.clientId,
          projectId: input.projectId,
          tags: input.tags
        }
      });
      return rule;
    })
});

export type AppRouter = typeof appRouter;
