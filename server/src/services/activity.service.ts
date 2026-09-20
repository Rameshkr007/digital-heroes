import { prisma } from '../utils/prisma';

export async function getActivities(heroId: string, limit = 20) {
  return prisma.activity.findMany({
    where: { heroId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      user: { select: { username: true } },
    },
  });
}

export async function createActivity(userId: string, heroId: string, type: string, content: string, metadata?: Record<string, unknown>) {
  return prisma.activity.create({
    data: {
      userId,
      heroId,
      type,
      content,
      metadata: JSON.stringify(metadata || {}),
    },
  });
}
