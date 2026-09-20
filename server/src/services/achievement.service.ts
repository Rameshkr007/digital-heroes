import { prisma } from '../utils/prisma';

export async function getAchievements(heroId?: string, category?: string) {
  const where: Record<string, unknown> = {};
  if (heroId) where.heroId = heroId;
  if (category) where.category = category;

  return prisma.achievement.findMany({
    where,
    orderBy: { achievedAt: 'desc' },
    include: {
      hero: {
        select: {
          displayName: true,
          avatarUrl: true,
          user: { select: { username: true } },
        },
      },
    },
  });
}

export async function createAchievement(heroId: string, data: {
  title: string;
  description: string;
  category: string;
  iconName?: string;
  xpReward?: number;
  impactScore?: number;
  relatedSkills?: string[];
}) {
  const achievement = await prisma.achievement.create({
    data: {
      heroId,
      title: data.title,
      description: data.description,
      category: data.category,
      iconName: data.iconName || 'trophy',
      xpReward: data.xpReward || 100,
      impactScore: data.impactScore || 0,
      relatedSkills: JSON.stringify(data.relatedSkills || []),
    },
  });

  // Award XP
  await prisma.heroProfile.update({
    where: { id: heroId },
    data: {
      xp: { increment: achievement.xpReward },
      totalImpact: { increment: achievement.impactScore },
    },
  });

  // Recalculate level (every 1000 XP = 1 level)
  const hero = await prisma.heroProfile.findUnique({ where: { id: heroId } });
  if (hero) {
    const newLevel = Math.floor(hero.xp / 1000) + 1;
    if (newLevel !== hero.level) {
      await prisma.heroProfile.update({
        where: { id: heroId },
        data: { level: newLevel },
      });
    }
  }

  return achievement;
}
