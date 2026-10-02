import { prisma } from '../utils/prisma';
import { getGolfPerformance } from './golf.service';
import { getUserImpact } from './charity.service';
import { getUserSubscription } from './subscription.service';
import { getUserJourney } from './journey.service';

export async function processVoiceIntent(
  transcript: string,
  screenContext = 'GENERAL',
  userId?: string
) {
  let targetUserId = userId;
  if (!targetUserId) {
    const demoUser = await prisma.user.findFirst({ where: { email: 'aarav@digitalhero.dev' } });
    targetUserId = demoUser?.id;
  }

  const tLower = transcript.toLowerCase();
  let intent = 'GENERAL_QUERY';
  let toolUsed = 'NONE';
  let isCriticalAction = false;
  let actionPreview: any = null;
  let responseText = '';

  // 1. Safety Check for Critical Actions (Payment, Cancellation, Payouts)
  if (
    tLower.includes('cancel subscription') ||
    tLower.includes('delete account') ||
    tLower.includes('approve payout') ||
    tLower.includes('execute draw')
  ) {
    isCriticalAction = true;
    intent = 'CRITICAL_ACTION_ATTEMPT';
    actionPreview = {
      actionType: 'CRITICAL_MUTATION',
      target: '/dashboard',
      requiresScreenConfirmation: true,
      title: 'Action Requires Explicit Manual Confirmation',
      description: 'Voice commands cannot silently execute financial or admin payout mutations.',
      message: 'Critical actions such as payment modifications, payout approvals, or account cancellations require explicit manual button confirmation on screen.',
    };
    responseText = '⚠️ Voice Action Preview: Critical actions such as payment modifications, payout approvals, or account cancellations require explicit manual button confirmation on screen.';
  } else if (tLower.includes('performance') || tLower.includes('score') || tLower.includes('trend') || screenContext === 'GolfCoach') {
    // 2. Performance Query Intent
    intent = 'PERFORMANCE_QUERY';
    toolUsed = 'getGolfPerformance';
    const perf = await getGolfPerformance(targetUserId);
    responseText = `⛳ Based on your recent round data, your 5-score rolling average is ${perf.rollingAverage || 71.2} strokes with an ${perf.consistencyScore || 85}% consistency index. Your current trend status is ${perf.trend || 'IMPROVING'}.`;
  } else if (tLower.includes('charity') || tLower.includes('impact') || tLower.includes('meal') || screenContext === 'ImpactMap') {
    // 3. Charity & Impact Query Intent
    intent = 'CHARITY_QUERY';
    toolUsed = 'getUserImpact';
    const impact = await getUserImpact(targetUserId);
    responseText = `💚 Your active subscription has funded ${impact.totals.meals || 60} school lunches and supported ${impact.totals.trees || 12} native trees across verified charity partners. Total lifetime impact: ₹${impact.totals.amount || 2997}.`;
  } else if (tLower.includes('subscription') || tLower.includes('renew') || screenContext === 'Subscription') {
    // 4. Subscription Query Intent
    intent = 'SUBSCRIPTION_QUERY';
    toolUsed = 'getUserSubscription';
    const sub = await getUserSubscription(targetUserId);
    responseText = `💳 You are currently on the ${sub.subscription.planName} (${sub.subscription.status}). Your next auto-renewal of ₹${sub.subscription.priceMonthly} is scheduled in ${sub.daysLeft} days.`;
  } else if (tLower.includes('achievement') || tLower.includes('badge') || tLower.includes('level')) {
    // 5. Achievement Query Intent
    intent = 'ACHIEVEMENT_QUERY';
    toolUsed = 'getUserProfile';
    const user = await prisma.user.findUnique({
      where: { id: targetUserId },
      include: { profile: { include: { badges: { include: { badge: true } } } } },
    });
    const badgesCount = user?.profile?.badges.length || 4;
    responseText = `🏆 You are currently Level ${user?.profile?.level || 1} with ${user?.profile?.xp || 11500} total XP. You have earned ${badgesCount} achievement badges, including the Rising Hero Badge.`;
  } else if (tLower.includes('draw') || tLower.includes('pool') || screenContext === 'DrawEngine') {
    // 6. Draw Pool Query Intent
    intent = 'DRAW_QUERY';
    toolUsed = 'getCurrentDraw';
    const draw = await prisma.drawPool.findFirst({ where: { status: 'OPEN' } });
    responseText = `🎲 The October Champion Draw Pool features a ₹${draw?.prizePool.toLocaleString() || '85,000'} prize pool in ${draw?.mode || 'HYBRID'} mode. Maintain 80%+ score consistency to remain eligible.`;
  } else {
    // 7. General Context-Aware Intent
    intent = 'GENERAL_ASSISTANT';
    toolUsed = 'getUserJourney';
    const journey = await getUserJourney(targetUserId);
    responseText = `👋 I am your Digital Heroes Voice Assistant. You are currently on step "${journey.nextBestAction.title}". How can I assist you with your performance, charity impact, or achievements today?`;
  }

  // Record session in database
  const session = await prisma.voiceSession.create({
    data: {
      userId: targetUserId!,
      transcript,
      intent,
      response: responseText,
      toolUsed,
      durationSec: Math.max(1.5, parseFloat((transcript.length * 0.08).toFixed(1))),
    },
  });

  // Record voice usage cost log
  await prisma.voiceUsageLog.create({
    data: {
      userId: targetUserId!,
      sttCalls: 1,
      ttsCalls: 1,
      audioSec: session.durationSec,
      estimatedCost: 0.002,
      provider: 'WebSpeechAPI/GroundedVoiceEngine',
    },
  });

  return {
    sessionId: session.id,
    intent,
    transcript,
    response: responseText,
    toolUsed,
    isCriticalAction,
    actionPreview,
    timestamp: new Date().toISOString(),
  };
}
