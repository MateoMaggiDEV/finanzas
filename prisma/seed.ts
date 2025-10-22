import { PrismaClient } from '@prisma/client';
import { addDays, addMinutes, subMonths } from 'date-fns';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'martina@nombre.app' },
    update: {},
    create: {
      email: 'martina@nombre.app',
      name: 'Martina Founder',
      passwordHash: '$2a$10$hashplaceholderhashplaceholderhashplaceholderha'
    }
  });

  const [mp, uala, banco] = await Promise.all([
    prisma.account.upsert({
      where: { id: 'account-mp' },
      update: {},
      create: {
        id: 'account-mp',
        userId: user.id,
        name: 'Mercado Pago',
        institution: 'Mercado Pago',
        currency: 'ARS',
        balanceMinor: 12500000
      }
    }),
    prisma.account.upsert({
      where: { id: 'account-uala' },
      update: {},
      create: {
        id: 'account-uala',
        userId: user.id,
        name: 'Ualá',
        institution: 'Ualá',
        currency: 'ARS',
        balanceMinor: 8600000
      }
    }),
    prisma.account.upsert({
      where: { id: 'account-banco' },
      update: {},
      create: {
        id: 'account-banco',
        userId: user.id,
        name: 'Banco Nación',
        institution: 'Banco',
        currency: 'ARS',
        balanceMinor: 3500000
      }
    })
  ]);

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { id: 'cat-ingresos-servicios' },
      update: {},
      create: {
        id: 'cat-ingresos-servicios',
        userId: user.id,
        name: 'Servicios'
      }
    }),
    prisma.category.upsert({
      where: { id: 'cat-gastos-software' },
      update: {},
      create: {
        id: 'cat-gastos-software',
        userId: user.id,
        name: 'Software'
      }
    }),
    prisma.category.upsert({
      where: { id: 'cat-gastos-freelancers' },
      update: {},
      create: {
        id: 'cat-gastos-freelancers',
        userId: user.id,
        name: 'Freelancers'
      }
    })
  ]);

  const clients = await Promise.all([
    prisma.client.upsert({
      where: { id: 'client-reels' },
      update: {},
      create: {
        id: 'client-reels',
        userId: user.id,
        name: 'Reels Mentorship',
        defaultRatePerHourMinor: 150000
      }
    }),
    prisma.client.upsert({
      where: { id: 'client-luxury' },
      update: {},
      create: {
        id: 'client-luxury',
        userId: user.id,
        name: 'Luxury Coach',
        defaultRatePerHourMinor: 200000
      }
    }),
    prisma.client.upsert({
      where: { id: 'client-faith' },
      update: {},
      create: {
        id: 'client-faith',
        userId: user.id,
        name: 'Faith Academy',
        defaultRatePerHourMinor: 175000
      }
    }),
    prisma.client.upsert({
      where: { id: 'client-creators' },
      update: {},
      create: {
        id: 'client-creators',
        userId: user.id,
        name: 'Creators Lab',
        defaultRatePerHourMinor: 130000
      }
    })
  ]);

  const projects = await Promise.all([
    prisma.project.upsert({
      where: { id: 'project-reels-packs' },
      update: {},
      create: {
        id: 'project-reels-packs',
        userId: user.id,
        clientId: clients[0].id,
        name: 'Pack mensual reels',
        status: 'ACTIVE',
        ratePerHourMinor: 160000
      }
    }),
    prisma.project.upsert({
      where: { id: 'project-luxury-youtube' },
      update: {},
      create: {
        id: 'project-luxury-youtube',
        userId: user.id,
        clientId: clients[1].id,
        name: 'Luxury Coach YouTube',
        status: 'ACTIVE',
        ratePerHourMinor: 220000
      }
    }),
    prisma.project.upsert({
      where: { id: 'project-faith-community' },
      update: {},
      create: {
        id: 'project-faith-community',
        userId: user.id,
        clientId: clients[2].id,
        name: 'Faith Academy Comunidad',
        status: 'PAUSED',
        ratePerHourMinor: 180000
      }
    })
  ]);

  const baseDate = subMonths(new Date(), 6);

  await prisma.transaction.deleteMany({ where: { userId: user.id } });
  await prisma.timeEntry.deleteMany({ where: { userId: user.id } });
  await prisma.interruption.deleteMany({ where: { userId: user.id } });

  const transactions = Array.from({ length: 60 }).map((_, index) => {
    const date = addDays(baseDate, index * 3);
    const income = index % 4 === 0;
    return {
      id: `tx-${index}`,
      userId: user.id,
      accountId: income ? mp.id : uala.id,
      type: income ? 'INCOME' : 'EXPENSE',
      amountMinor: income ? 250000 + index * 1000 : -(90000 + (index % 5) * 5000),
      currency: 'ARS',
      date,
      description: income ? 'Cobro servicio' : 'Gasto operativo',
      categoryId: income ? categories[0].id : categories[1 + (index % 2)].id,
      clientId: income ? clients[index % clients.length].id : null,
      projectId: income ? projects[index % projects.length].id : null,
      tags: income ? ['facturable'] : ['operativo']
    };
  });

  await prisma.$transaction(transactions.map((tx) => prisma.transaction.create({ data: tx })));

  const timeEntries = Array.from({ length: 120 }).map((_, index) => {
    const start = addDays(baseDate, Math.floor(index / 2));
    const duration = 60 + (index % 3) * 30;
    return {
      id: `time-${index}`,
      userId: user.id,
      start,
      end: addMinutes(start, duration),
      durationMin: duration,
      clientId: clients[index % clients.length].id,
      projectId: projects[index % projects.length].id,
      task: 'Edición de video',
      billable: index % 5 !== 0,
      deepWork: index % 3 === 0,
      source: index % 2 === 0 ? 'TIMER' : 'MANUAL'
    };
  });

  await prisma.timeEntry.createMany({ data: timeEntries });

  const interruptions = Array.from({ length: 40 }).map((_, index) => ({
    id: `int-${index}`,
    userId: user.id,
    at: addDays(baseDate, index),
    minutes: 5 + (index % 4) * 5,
    reason: 'Mensaje urgente'
  }));

  await prisma.interruption.createMany({ data: interruptions });

  await prisma.budget.upsert({
    where: { userId_categoryId_period: { userId: user.id, categoryId: categories[1].id, period: '2024-05' } },
    update: {
      limitMinor: 4000000
    },
    create: {
      userId: user.id,
      categoryId: categories[1].id,
      period: '2024-05',
      limitMinor: 4000000,
      currency: 'ARS'
    }
  });

  await prisma.rule.upsert({
    where: { id: 'rule-saas' },
    update: {},
    create: {
      id: 'rule-saas',
      userId: user.id,
      expression: 'software',
      mode: 'contains',
      categoryId: categories[1].id,
      tags: ['suscripcion']
    }
  });

  await prisma.goal.upsert({
    where: { id: 'goal-focus' },
    update: {},
    create: {
      id: 'goal-focus',
      userId: user.id,
      type: 'TIME',
      target: 0.6,
      current: 0.45,
      period: '2024-05'
    }
  });

  await prisma.setting.upsert({
    where: { userId_key: { userId: user.id, key: 'baseCurrency' } },
    update: {
      value: 'ARS'
    },
    create: {
      userId: user.id,
      key: 'baseCurrency',
      value: 'ARS'
    }
  });

  await prisma.invoice.upsert({
    where: { id: 'invoice-reels-may' },
    update: {},
    create: {
      id: 'invoice-reels-may',
      userId: user.id,
      clientId: clients[0].id,
      projectId: projects[0].id,
      issueDate: new Date('2024-05-05'),
      items: [{ description: 'Edición reels', quantity: 10, unitPriceMinor: 250000 }],
      totalMinor: 2500000,
      currency: 'ARS',
      status: 'SENT'
    }
  });

  console.log('Seed data generated');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
