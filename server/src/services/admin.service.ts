import { prisma } from '../utils/prisma';

export async function getAuditLogs(params: { module?: string; action?: string; limit?: number }) {
  const limit = params.limit || 30;
  const where: any = {};
  if (params.module) where.module = params.module;
  if (params.action) where.action = params.action;

  return prisma.auditLog.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

export async function getAnomalyMonitors() {
  const flaggedScores = await prisma.golfScore.findMany({
    where: { isFlagged: true },
    include: { user: { include: { profile: true } } },
    orderBy: { createdAt: 'desc' },
  });

  const riskLevel = flaggedScores.length > 5 ? 'HIGH' : flaggedScores.length > 0 ? 'MEDIUM' : 'LOW';

  return {
    riskLevel,
    flaggedCount: flaggedScores.length,
    flaggedScores: flaggedScores.map((s) => ({
      id: s.id,
      username: s.user.username,
      displayName: s.user.profile?.displayName || s.user.username,
      score: s.score,
      courseName: s.courseName,
      flagReason: s.flagReason,
      submittedAt: s.createdAt,
    })),
  };
}

export async function askAdminCopilot(question: string) {
  const qLower = question.toLowerCase();

  const [subscribersCount, totalCharity, flaggedCount, latestDraw] = await Promise.all([
    prisma.subscription.count({ where: { status: 'ACTIVE' } }),
    prisma.charityContribution.aggregate({ _sum: { amount: true } }),
    prisma.golfScore.count({ where: { isFlagged: true } }),
    prisma.drawPool.findFirst({ orderBy: { createdAt: 'desc' } }),
  ]);

  if (qLower.includes('subscriber') || qLower.includes('active') || qLower.includes('mrr')) {
    return `📊 **Active Subscribers:** We currently have **${subscribersCount} active subscribers** on the platform generating ~₹${(subscribersCount * 999).toLocaleString()} MRR.`;
  }

  if (qLower.includes('charity') || qLower.includes('contribution') || qLower.includes('impact')) {
    return `💚 **Charity Impact Summary:** Total contributions raised this month stand at **₹${(totalCharity._sum.amount || 0).toLocaleString()}**, supporting over 23,000+ meals and 6,000+ trees!`;
  }

  if (qLower.includes('unusual') || qLower.includes('score') || qLower.includes('flag') || qLower.includes('risk')) {
    return `🕵️ **Anomaly Monitor Report:** There are **${flaggedCount} flagged score submissions** requiring review. Risk status is set to **${flaggedCount > 0 ? 'MEDIUM' : 'LOW'}**.`;
  }

  if (qLower.includes('draw') || qLower.includes('winner') || qLower.includes('pool')) {
    return `🎲 **Draw Pool Summary:** The **${latestDraw?.title || 'Current Draw'}** has a prize pool of **₹${latestDraw?.prizePool.toLocaleString()}** with ${latestDraw?.totalParticipants} eligible entries (${latestDraw?.mode} mode).`;
  }

  return `🤖 **Digital Heroes Admin AI Copilot:**\n- **Subscribers:** ${subscribersCount} Active\n- **Charity Fund:** ₹${(totalCharity._sum.amount || 0).toLocaleString()}\n- **Flagged Scores:** ${flaggedCount} pending review\n- **Current Draw Pool:** ₹${latestDraw?.prizePool.toLocaleString()} (${latestDraw?.mode} mode)`;
}

export async function getFeatureFlags() {
  return prisma.featureFlag.findMany();
}

export async function toggleFeatureFlag(key: string, enabled: boolean) {
  const flag = await prisma.featureFlag.update({
    where: { key },
    data: { enabled },
  });

  await prisma.auditLog.create({
    data: {
      action: 'FEATURE_FLAG_TOGGLED',
      module: 'SYSTEM_SETTINGS',
      details: `Feature flag '${key}' set to ${enabled}`,
    },
  });

  return flag;
}
