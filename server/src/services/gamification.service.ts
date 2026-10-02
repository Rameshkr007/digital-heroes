import { prisma } from '../utils/prisma';

export async function getConfigurableAchievements() {
  let achievements = await prisma.configurableAchievement.findMany({
    orderBy: { createdAt: 'desc' },
  });

  if (achievements.length === 0) {
    // Seed initial configurable achievements
    achievements = await Promise.all([
      prisma.configurableAchievement.create({
        data: {
          key: 'FIRST_SCORE_ACHIEVEMENT',
          title: '🏅 First Round Hero',
          description: 'Submitted first 18-hole verified golf round.',
          category: 'Performance',
          iconName: 'target',
          triggerKey: 'SCORE_COUNT',
          threshold: 1,
          xpReward: 150,
          impactScore: 50,
          active: true,
        },
      }),
      prisma.configurableAchievement.create({
        data: {
          key: 'CONSISTENCY_CHAMPION',
          title: '🔥 5-Score Consistency Streak',
          description: 'Achieved a 5-score rolling streak with sub-5 stroke variance.',
          category: 'Consistency',
          iconName: 'flame',
          triggerKey: 'SCORE_COUNT',
          threshold: 5,
          xpReward: 350,
          impactScore: 150,
          active: true,
        },
      }),
      prisma.configurableAchievement.create({
        data: {
          key: 'CHARITY_CHAMPION',
          title: '💚 Impact Legend',
          description: 'Funded 50+ meals or 10+ native trees for charity partners.',
          category: 'Charity',
          iconName: 'heart',
          triggerKey: 'IMPACT_COUNT',
          threshold: 50,
          xpReward: 500,
          impactScore: 300,
          active: true,
        },
      }),
      prisma.configurableAchievement.create({
        data: {
          key: 'TRANSPARENT_DRAW_HERO',
          title: '🏆 Monthly Draw Participant',
          description: 'Entered the transparent monthly champion draw pool.',
          category: 'Participation',
          iconName: 'trophy',
          triggerKey: 'DRAW_JOINED',
          threshold: 1,
          xpReward: 250,
          impactScore: 100,
          active: true,
        },
      }),
    ]);
  }

  return achievements;
}

export async function createConfigurableAchievement(data: {
  key: string;
  title: string;
  description: string;
  category: string;
  iconName?: string;
  triggerKey: string;
  threshold?: number;
  xpReward?: number;
  impactScore?: number;
}) {
  return prisma.configurableAchievement.create({
    data: {
      key: data.key,
      title: data.title,
      description: data.description,
      category: data.category,
      iconName: data.iconName || 'trophy',
      triggerKey: data.triggerKey,
      threshold: data.threshold || 1,
      xpReward: data.xpReward || 100,
      impactScore: data.impactScore || 0,
      active: true,
    },
  });
}

export async function toggleConfigurableAchievement(id: string, active: boolean) {
  return prisma.configurableAchievement.update({
    where: { id },
    data: { active },
  });
}
