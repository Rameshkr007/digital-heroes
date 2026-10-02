import { prisma } from '../utils/prisma';

export async function getAdminQueue() {
  let items = await prisma.adminQueueItem.findMany({
    where: { status: 'PENDING' },
    orderBy: { createdAt: 'desc' },
  });

  if (items.length === 0) {
    // Seed sample queue items if empty
    const flaggedCount = await prisma.golfScore.count({ where: { isFlagged: true } });

    items = await Promise.all([
      prisma.adminQueueItem.create({
        data: {
          severity: 'HIGH',
          module: 'WINNER_VERIFICATION',
          reason: 'Winner proof document uploaded for October Draw. Verification pending.',
          recommendedAction: 'Review uploaded proof PDF and approve or reject payout status.',
          status: 'PENDING',
        },
      }),
      prisma.adminQueueItem.create({
        data: {
          severity: flaggedCount > 0 ? 'MEDIUM' : 'LOW',
          module: 'ANOMALY_MONITOR',
          reason: `${flaggedCount} score submission(s) flagged for unusual stroke variation.`,
          recommendedAction: 'Inspect score history and confirm score validity.',
          status: 'PENDING',
        },
      }),
    ]);
  }

  return items;
}

export async function resolveAdminQueueItem(id: string) {
  return prisma.adminQueueItem.update({
    where: { id },
    data: { status: 'RESOLVED' },
  });
}
