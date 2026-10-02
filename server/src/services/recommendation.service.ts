import { prisma } from '../utils/prisma';
import { getGolfPerformance } from './golf.service';
import { getUserImpact } from './charity.service';

export async function getRecommendations(userId?: string) {
  let targetUserId = userId;
  if (!targetUserId) {
    const demoUser = await prisma.user.findFirst({ where: { email: 'aarav@digitalhero.dev' } });
    targetUserId = demoUser?.id;
  }
  if (!targetUserId) throw new Error('User profile not found');

  const [perf, impact, dbRecs] = await Promise.all([
    getGolfPerformance(targetUserId),
    getUserImpact(targetUserId),
    prisma.recommendation.findMany({
      where: { userId: targetUserId, dismissed: false },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  if (dbRecs.length > 0) {
    return dbRecs;
  }

  // Generate dynamic recommendations with explicit rationale and attribution
  const generated: Array<{
    title: string;
    description: string;
    reason: string;
    dataSource: string;
    confidence: number;
    actionUrl: string;
    ctaText: string;
  }> = [];

  if (perf.totalScores < 5) {
    generated.push({
      title: `Submit ${5 - perf.totalScores} more score(s) for 5-score rolling average`,
      description: 'Your consistency rating and official draw eligibility require 5 total rounds.',
      reason: 'Calculated from your current total recorded score count in your verified score ledger.',
      dataSource: 'GolfScore Ledger Model',
      confidence: 0.98,
      actionUrl: '/golf-coach',
      ctaText: 'Submit Score',
    });
  } else if (perf.consistencyScore >= 80) {
    generated.push({
      title: '🌟 High Consistency Rating — Qualified for Monthly Draw Pool!',
      description: `Your ${perf.consistencyScore}% consistency score qualifies you for the ₹85,000 October draw pool.`,
      reason: 'Derived from low standard deviation across your last 5 golf rounds.',
      dataSource: 'AI Golf Performance Engine',
      confidence: 0.95,
      actionUrl: '/draw-engine',
      ctaText: 'View Draw Status',
    });
  }

  if (impact.totals.amount === 0) {
    generated.push({
      title: 'Choose your monthly charity partner',
      description: 'Allocate your subscription impact to school lunches or tree planting.',
      reason: 'Charity selection turns your monthly subscription into verified community impact.',
      dataSource: 'Charity Impact Engine',
      confidence: 0.92,
      actionUrl: '/impact-map',
      ctaText: 'Explore Impact Map',
    });
  }

  // Save generated recommendations to database
  const createdRecs = await Promise.all(
    generated.map((g) =>
      prisma.recommendation.create({
        data: {
          userId: targetUserId!,
          title: g.title,
          description: g.description,
          reason: g.reason,
          dataSource: g.dataSource,
          confidence: g.confidence,
          actionUrl: g.actionUrl,
          ctaText: g.ctaText,
        },
      })
    )
  );

  return createdRecs;
}

export async function dismissRecommendation(id: string) {
  return prisma.recommendation.update({
    where: { id },
    data: { dismissed: true },
  });
}
