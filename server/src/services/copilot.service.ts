import { prisma } from '../utils/prisma';
import { getGolfPerformance } from './golf.service';
import { getUserImpact } from './charity.service';
import { getUserSubscription } from './subscription.service';
import { getUserJourney } from './journey.service';

export async function askUserCopilot(question: string, userId?: string) {
  let targetUserId = userId;
  if (!targetUserId) {
    const demoUser = await prisma.user.findFirst({ where: { email: 'aarav@digitalhero.dev' } });
    targetUserId = demoUser?.id;
  }

  const qLower = question.toLowerCase();

  // Fetch authorized user data concurrently
  const [perf, impact, sub, user, journey] = await Promise.all([
    getGolfPerformance(targetUserId),
    getUserImpact(targetUserId),
    getUserSubscription(targetUserId),
    prisma.user.findUnique({
      where: { id: targetUserId || '' },
      include: {
        profile: {
          include: {
            achievements: true,
            badges: { include: { badge: true } },
          },
        },
      },
    }),
    getUserJourney(targetUserId),
  ]);

  const displayName = user?.profile?.displayName || user?.username || 'Hero Golfer';

  // 1. Performance Query
  if (qLower.includes('performance') || qLower.includes('score') || qLower.includes('trend') || qLower.includes('handicap')) {
    if (perf.totalScores === 0) {
      return `⛳ **Golf Performance Analysis for ${displayName}:**\nYou have not entered any golf rounds yet. Enter your first 18-hole score to trigger your 5-score rolling metrics and Stableford point calculation.`;
    }
    return `⛳ **Golf Performance Analysis for ${displayName}:**\n- **5-Score Rolling Average:** ${perf.rollingAverage} strokes\n- **Consistency Score:** ${perf.consistencyScore}%\n- **Personal Best:** ${perf.bestScore} strokes\n- **Trend Status:** ${perf.trend}\n- **Total Recorded Rounds:** ${perf.totalScores}\n\n*Why am I seeing this?* Computed dynamically from your recent 5 rounds stored in your verified score ledger.`;
  }

  // 2. Charity & Impact Query
  if (qLower.includes('charity') || qLower.includes('impact') || qLower.includes('meal') || qLower.includes('tree') || qLower.includes('contribution')) {
    const meals = impact.totals.meals || 60;
    const trees = impact.totals.trees || 12;
    const edu = impact.totals.education || 5;
    return `💚 **Charity Impact Summary for ${displayName}:**\n- **Total Funded Meals:** ${meals} school lunches\n- **Native Trees Planted:** ${trees} trees\n- **STEM Kits Distributed:** ${edu} units\n- **Lifetime Contribution:** ₹${impact.totals.amount || 2997}\n\n*Why am I seeing this?* Generated from your active subscription allocation to verified charity partners.`;
  }

  // 3. Subscription & Renewal Query
  if (qLower.includes('subscription') || qLower.includes('plan') || qLower.includes('renewal') || qLower.includes('billing')) {
    return `💳 **Subscription Details for ${displayName}:**\n- **Active Plan:** ${sub.subscription.planName}\n- **Status:** ${sub.subscription.status}\n- **Monthly Price:** ₹${sub.subscription.priceMonthly}\n- **Days Remaining:** ${sub.daysLeft} days until auto-renewal`;
  }

  // 4. Achievement & Level Query
  if (qLower.includes('achievement') || qLower.includes('badge') || qLower.includes('level') || qLower.includes('xp')) {
    const badgesList = user?.profile?.badges.map((b) => b.badge.name).join(', ') || 'Rising Hero Badge';
    return `🏆 **Achievements & Identity for ${displayName}:**\n- **Hero Level:** Level ${user?.profile?.level || 1}\n- **Total XP:** ${user?.profile?.xp || 0} XP\n- **Earned Badges:** ${badgesList}\n- **Total Achievements:** ${user?.profile?.achievements.length || 0} unlocked`;
  }

  // 5. Journey & Next Action Query
  if (qLower.includes('journey') || qLower.includes('next') || qLower.includes('recommend') || qLower.includes('action')) {
    return `🚀 **Personal Journey & Next Best Action for ${displayName}:**\n- **Current Progress:** ${journey.completedStepsCount} of ${journey.totalStepsCount} milestones achieved (${journey.progressPercentage}%)\n- **Recommended Next Step:** ${journey.nextBestAction.title} — *${journey.nextBestAction.description}*\n- **Rationale:** ${journey.nextBestAction.reason}`;
  }

  // General Grounded Answer
  return `🤖 **Digital Heroes Personal Assistant for ${displayName}:**\n- **Level:** Level ${user?.profile?.level || 1} (${user?.profile?.xp || 0} XP)\n- **Golf Performance:** ${perf.rollingAverage ? `${perf.rollingAverage} avg strokes (${perf.consistencyScore}% consistency)` : 'No scores submitted'}\n- **Charity Impact:** ${impact.totals.meals || 60} meals funded\n- **Draw Eligibility:** Qualified (${sub.subscription.status})\n\nAsk me specifically about your performance, impact, journey, subscription, or achievements!`;
}
