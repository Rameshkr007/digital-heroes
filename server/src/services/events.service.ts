import { prisma } from '../utils/prisma';
import { broadcastLiveEvent } from '../utils/socket';

export type EventType =
  | 'USER_REGISTERED'
  | 'SCORE_SUBMITTED'
  | 'SCORE_UPDATED'
  | 'SUBSCRIPTION_ACTIVATED'
  | 'SUBSCRIPTION_RENEWED'
  | 'CHARITY_SELECTED'
  | 'CONTRIBUTION_CREATED'
  | 'DRAW_OPENED'
  | 'DRAW_CLOSED'
  | 'WINNER_SELECTED'
  | 'PROOF_SUBMITTED'
  | 'WINNER_VERIFIED'
  | 'PAYOUT_UPDATED'
  | 'ACHIEVEMENT_UNLOCKED';

export async function emitDomainEvent(eventType: EventType, payload: Record<string, any>, userId?: string) {
  let targetUserId = userId;
  if (!targetUserId) {
    const demoUser = await prisma.user.findFirst({ where: { email: 'aarav@digitalhero.dev' } });
    targetUserId = demoUser?.id;
  }

  // 1. Log domain event
  const domainEvent = await prisma.domainEvent.create({
    data: {
      userId: targetUserId,
      eventType,
      payload: JSON.stringify(payload),
    },
  });

  // 2. Broadcast via WebSockets
  broadcastLiveEvent({
    type: eventType as any,
    title: payload.title || `Event: ${eventType}`,
    message: payload.message || `Action ${eventType} completed successfully.`,
    heroName: payload.heroName || 'Hero Golfer',
  });

  // 3. Update User Journey Steps automatically based on eventType
  if (targetUserId) {
    try {
      if (eventType === 'USER_REGISTERED') {
        await completeJourneyStep(targetUserId, 'REGISTERED', 'Registered Account', 'Successfully joined the Digital Heroes platform.');
      } else if (eventType === 'SCORE_SUBMITTED') {
        await completeJourneyStep(targetUserId, 'FIRST_SCORE', 'Entered First Golf Score', 'Submitted gross score for AI performance analysis.');
      } else if (eventType === 'CHARITY_SELECTED' || eventType === 'CONTRIBUTION_CREATED') {
        await completeJourneyStep(targetUserId, 'FIRST_IMPACT', 'Created Charitable Impact', 'Allocated subscription portion to verified causes.');
      } else if (eventType === 'ACHIEVEMENT_UNLOCKED') {
        await completeJourneyStep(targetUserId, 'FIRST_ACHIEVEMENT', 'Unlocked First Badge', 'Earned performance badge and level advancement.');
      }
    } catch (e) {
      // ignore step errors
    }
  }

  return domainEvent;
}

async function completeJourneyStep(userId: string, stepKey: string, title: string, description: string) {
  await prisma.userJourneyStep.upsert({
    where: { userId_stepKey: { userId, stepKey } },
    update: { completed: true, completedAt: new Date() },
    create: {
      userId,
      stepKey,
      title,
      description,
      completed: true,
      completedAt: new Date(),
    },
  });
}

export async function getDomainEvents(limit = 20) {
  return prisma.domainEvent.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}
