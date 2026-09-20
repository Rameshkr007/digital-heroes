import { prisma } from '../utils/prisma';

export async function getHeroes(query: {
  search?: string;
  skill?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
}) {
  const page = query.page || 1;
  const limit = Math.min(query.limit || 12, 50);
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (query.search) {
    where.OR = [
      { displayName: { contains: query.search } },
      { title: { contains: query.search } },
      { bio: { contains: query.search } },
    ];
  }
  if (query.skill) {
    where.skills = {
      some: {
        skill: { name: { contains: query.skill } },
      },
    };
  }

  const orderBy: Record<string, string> = {};
  switch (query.sortBy) {
    case 'level': orderBy.level = 'desc'; break;
    case 'xp': orderBy.xp = 'desc'; break;
    case 'impact': orderBy.totalImpact = 'desc'; break;
    case 'newest': orderBy.createdAt = 'desc'; break;
    default: orderBy.xp = 'desc';
  }

  const [heroes, total] = await Promise.all([
    prisma.heroProfile.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        user: { select: { username: true, email: true } },
        skills: { include: { skill: true }, take: 5, orderBy: { proficiency: 'desc' } },
        badges: { include: { badge: true }, take: 3 },
        _count: { select: { achievements: true } },
      },
    }),
    prisma.heroProfile.count({ where }),
  ]);

  return {
    heroes,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getHeroByUsername(username: string) {
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      profile: {
        include: {
          skills: { include: { skill: true }, orderBy: { proficiency: 'desc' } },
          achievements: { orderBy: { achievedAt: 'desc' } },
          badges: { include: { badge: true } },
          projects: { orderBy: { createdAt: 'desc' } },
        },
      },
    },
  });
  if (!user || !user.profile) throw new Error('Hero not found');
  const { passwordHash, ...safeUser } = user;
  void passwordHash;
  return safeUser;
}

export async function getTopHeroes(limit = 6) {
  return prisma.heroProfile.findMany({
    take: limit,
    orderBy: { xp: 'desc' },
    include: {
      user: { select: { username: true } },
      badges: { include: { badge: true }, take: 3 },
      _count: { select: { achievements: true } },
    },
  });
}

export async function getStats() {
  const [heroCount, achievementCount, totalXp] = await Promise.all([
    prisma.heroProfile.count(),
    prisma.achievement.count(),
    prisma.heroProfile.aggregate({ _sum: { xp: true } }),
  ]);
  return {
    heroCount,
    achievementCount,
    totalXp: totalXp._sum.xp || 0,
    impactScore: heroCount * 42 + achievementCount * 17,
  };
}
