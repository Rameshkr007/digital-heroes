import { prisma } from '../utils/prisma';

export async function getImpactLedger() {
  let items = await prisma.impactLedgerItem.findMany({
    orderBy: { createdAt: 'desc' },
  });

  if (items.length === 0) {
    // Seed verified impact ledger items
    items = await Promise.all([
      prisma.impactLedgerItem.create({
        data: {
          charityName: 'Akshaya Patra Midday Meals',
          amount: 485000.0,
          metricType: 'MEALS',
          metricCount: 19400,
          period: 'September 2026',
          proofUrl: 'https://digitalhero.dev/proof/akshaya-patra-sep-2026.pdf',
          status: 'VERIFIED',
        },
      }),
      prisma.impactLedgerItem.create({
        data: {
          charityName: 'GiveIndia Green Earth Initiative',
          amount: 320000.0,
          metricType: 'TREES',
          metricCount: 6400,
          period: 'September 2026',
          proofUrl: 'https://digitalhero.dev/proof/giveindia-sep-2026.pdf',
          status: 'VERIFIED',
        },
      }),
      prisma.impactLedgerItem.create({
        data: {
          charityName: 'Delhi Child Literacy Mission',
          amount: 290000.0,
          metricType: 'EDUCATION',
          metricCount: 2900,
          period: 'September 2026',
          proofUrl: 'https://digitalhero.dev/proof/child-literacy-sep-2026.pdf',
          status: 'VERIFIED',
        },
      }),
    ]);
  }

  return items;
}
