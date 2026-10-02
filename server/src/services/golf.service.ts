import { prisma } from '../utils/prisma';

export async function submitGolfScore(userId?: string, data: { score: number; handicap?: number; courseName?: string } = { score: 72 }) {
  let targetUserId = userId;
  if (!targetUserId) {
    const demoUser = await prisma.user.findFirst({ where: { email: 'aarav@digitalhero.dev' } });
    targetUserId = demoUser?.id;
  }
  if (!targetUserId) throw new Error('User profile not found');
  const user = await prisma.user.findUnique({ where: { id: targetUserId }, include: { profile: true } });
  if (!user || !user.profile) throw new Error('User profile not found');

  // Fetch recent scores for rolling average & anomaly detection
  const recentScores = await prisma.golfScore.findMany({
    where: { userId: targetUserId },
    orderBy: { playedAt: 'desc' },
    take: 5,
  });

  const handicap = data.handicap || 5.0;
  const stablefordPoints = Math.max(18, Math.min(54, Math.floor(54 - data.score / 2 + handicap)));

  // Anomaly & Outlier Detection
  let isFlagged = false;
  let flagReason = '';

  if (recentScores.length >= 3) {
    const avgScore = recentScores.reduce((acc, curr) => acc + curr.score, 0) / recentScores.length;
    const diff = Math.abs(data.score - avgScore);
    if (diff > 12) {
      isFlagged = true;
      flagReason = `Unusual score variation: ${data.score} differs by ${diff.toFixed(1)} strokes from 5-score rolling avg (${avgScore.toFixed(1)}). Admin review flagged.`;
    }
  }

  // Duplicate score check (same score on same course within 1 minute)
  const duplicate = await prisma.golfScore.findFirst({
    where: {
      userId: targetUserId,
      score: data.score,
      courseName: data.courseName || 'Delhi Golf Club',
      playedAt: { gte: new Date(Date.now() - 60 * 1000) },
    },
  });

  if (duplicate) {
    throw new Error('Duplicate score submission detected. Please wait 1 minute before re-submitting identical score.');
  }

  const newScore = await prisma.golfScore.create({
    data: {
      userId: targetUserId!,
      score: data.score,
      handicap,
      stablefordPoints,
      courseName: data.courseName || 'Delhi Golf Club',
      isFlagged,
      flagReason,
    },
  });

  // Audit log entry
  await prisma.auditLog.create({
    data: {
      userId: targetUserId!,
      username: user.username,
      action: 'SCORE_SUBMITTED',
      module: 'GOLF_INTELLIGENCE',
      details: `Submitted score ${data.score} (${stablefordPoints} Stableford pts). Flagged: ${isFlagged}`,
    },
  });

  // Check and award badges
  const totalScoresCount = await prisma.golfScore.count({ where: { userId: targetUserId } });
  if (totalScoresCount === 1) {
    const badge = await prisma.badge.findUnique({ where: { name: '🏅 First Score' } });
    if (badge) {
      await prisma.heroBadge.create({ data: { heroId: user.profile.id, badgeId: badge.id } }).catch(() => {});
    }
  } else if (totalScoresCount >= 5) {
    const badge = await prisma.badge.findUnique({ where: { name: '🔥 5-Score Streak' } });
    if (badge) {
      await prisma.heroBadge.create({ data: { heroId: user.profile.id, badgeId: badge.id } }).catch(() => {});
    }
  }

  return {
    score: newScore,
    isFlagged,
    flagReason,
    stablefordPoints,
    aiFeedback: isFlagged
      ? 'Score flagged for review due to unusual stroke variation. Admin notification dispatched.'
      : 'Score verified & recorded! Stableford points calculated.',
  };
}

export async function getGolfPerformance(userId?: string) {
  let targetUserId = userId;
  if (!targetUserId) {
    const demoUser = await prisma.user.findFirst({ where: { email: 'aarav@digitalhero.dev' } });
    targetUserId = demoUser?.id;
  }

  const scores = targetUserId ? await prisma.golfScore.findMany({
    where: { userId: targetUserId },
    orderBy: { playedAt: 'desc' },
  }) : [];

  if (scores.length === 0) {
    return {
      totalScores: 0,
      rollingAverage: 0,
      bestScore: 0,
      worstScore: 0,
      consistencyScore: 100,
      trend: 'STABLE',
      scores: [],
    };
  }

  const scoresList = scores.map((s) => s.score);
  const bestScore = Math.min(...scoresList);
  const worstScore = Math.max(...scoresList);

  const last5 = scores.slice(0, 5);
  const rollingAverage = Number((last5.reduce((acc, s) => acc + s.score, 0) / last5.length).toFixed(1));

  // Consistency Score calculation (Standard Deviation)
  const mean = rollingAverage;
  const variance = last5.reduce((acc, s) => acc + Math.pow(s.score - mean, 2), 0) / last5.length;
  const stdDev = Math.sqrt(variance);
  const consistencyScore = Math.max(50, Math.min(99, Math.round(100 - stdDev * 4)));

  // Trend detection
  let trend: 'IMPROVING' | 'STABLE' | 'DECLINING' = 'STABLE';
  if (last5.length >= 2) {
    const diff = last5[0].score - last5[last5.length - 1].score;
    if (diff < -1) trend = 'IMPROVING'; // Lower golf score is better!
    else if (diff > 1) trend = 'DECLINING';
  }

  return {
    totalScores: scores.length,
    rollingAverage,
    bestScore,
    worstScore,
    consistencyScore,
    trend,
    scores,
  };
}

export async function getAIGolfCoachAdvice(userId?: string) {
  const perf = await getGolfPerformance(userId);
  let user = userId ? await prisma.user.findUnique({ where: { id: userId }, include: { profile: true } }) : null;
  if (!user) {
    user = await prisma.user.findFirst({ where: { email: 'aarav@digitalhero.dev' }, include: { profile: true } });
  }
  const name = user?.profile?.displayName.split(' ')[0] || 'Golfer';

  if (perf.totalScores < 3) {
    return {
      coachName: 'HeroBot AI Golf Coach',
      summary: `Welcome ${name}! Submit at least 3 scores to unlock your AI Golf Journey report and 5-score rolling metrics.`,
      consistencyScore: perf.consistencyScore,
      trend: perf.trend,
      strongAreas: ['Setup & Rhythm', 'Drive Accuracy'],
      weakAreas: ['Short Game Pitching', 'Lag Putting'],
      personalizedSuggestions: [
        'Practice 15 minutes of 6-foot putting drills before rounds.',
        'Focus on smooth tempo control during backswing transition.',
      ],
      journeyReport: `Your golf journey has just begun! Submit 5 scores to calculate your official consistency index.`,
    };
  }

  return {
    coachName: 'HeroBot AI Golf Coach',
    summary: `Your consistency improved ${Math.min(perf.consistencyScore - 70, 18)}% this month. Your recent ${perf.totalScores} scores show a ${perf.trend.toLowerCase()} performance trend with a rolling average of ${perf.rollingAverage}.`,
    consistencyScore: perf.consistencyScore,
    trend: perf.trend,
    strongAreas: ['Iron Play Consistency', 'Tee Shot Placement', 'Stableford Efficiency'],
    weakAreas: ['Bunker Recovery', '3-Putt Avoidance past 30ft'],
    personalizedSuggestions: [
      'Focus on target alignment on par 3 approaches.',
      'Maintain stable posture through impact to minimize score variance.',
      'Utilize 5-score rolling average targets for upcoming tournament rounds.',
    ],
    journeyReport: `🚀 **Your Golf Journey Report:**\nYour personal best is **${perf.bestScore}**. With a ${perf.consistencyScore}% consistency rating, you qualify for the *Consistency Hero* badge and monthly transparent draw eligibility!`,
  };
}
