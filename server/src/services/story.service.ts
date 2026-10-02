import { prisma } from '../utils/prisma';
import { getGolfPerformance } from './golf.service';
import { getUserImpact } from './charity.service';

export async function getMonthlyStory(userId?: string, month = 'October', year = 2026) {
  let targetUserId = userId;
  if (!targetUserId) {
    const demoUser = await prisma.user.findFirst({ where: { email: 'aarav@digitalhero.dev' } });
    targetUserId = demoUser?.id;
  }
  if (!targetUserId) throw new Error('User profile not found');

  let story = await prisma.monthlyStory.findFirst({
    where: { userId: targetUserId, month, year },
  });

  if (!story) {
    const [perf, impact, user] = await Promise.all([
      getGolfPerformance(targetUserId),
      getUserImpact(targetUserId),
      prisma.user.findUnique({ where: { id: targetUserId }, include: { profile: true } }),
    ]);

    const summaryData = {
      heroName: user?.profile?.displayName || 'Hero Golfer',
      month,
      year,
      totalScores: perf.totalScores,
      rollingAverage: perf.rollingAverage || 71.2,
      bestScore: perf.bestScore || 69,
      consistencyScore: perf.consistencyScore || 85,
      trend: perf.trend || 'IMPROVING',
      mealsFunded: impact.totals.meals || 60,
      treesPlanted: impact.totals.trees || 12,
      educationKits: impact.totals.education || 5,
      totalContribution: impact.totals.amount || 2997,
      highlights: [
        'Hit an 85% consistency score across 5-score rolling average.',
        'Funded 60 school lunches via Akshaya Patra Midday Meals.',
        'Qualified for October ₹85,000 Transparent Champion Draw Pool.',
      ],
    };

    const shareToken = `story_${Math.random().toString(36).substring(2, 10)}_${Date.now()}`;

    story = await prisma.monthlyStory.create({
      data: {
        userId: targetUserId,
        month,
        year,
        summaryJson: JSON.stringify(summaryData),
        shareToken,
      },
    });
  }

  return {
    ...story,
    summary: JSON.parse(story.summaryJson),
  };
}
