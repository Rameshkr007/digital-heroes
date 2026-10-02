import { prisma } from '../utils/prisma';

export async function getUserJourney(userId?: string) {
  let targetUserId = userId;
  if (!targetUserId) {
    const demoUser = await prisma.user.findFirst({ where: { email: 'aarav@digitalhero.dev' } });
    targetUserId = demoUser?.id;
  }
  if (!targetUserId) throw new Error('User profile not found');

  const user = await prisma.user.findUnique({ where: { id: targetUserId }, include: { profile: true } });

  const [scoreCount, contributionCount, achievementCount, savedSteps] = await Promise.all([
    prisma.golfScore.count({ where: { userId: targetUserId } }),
    prisma.charityContribution.count({ where: { userId: targetUserId } }),
    prisma.achievement.count({ where: { heroId: user?.profile?.id || '' } }),
    prisma.userJourneyStep.findMany({ where: { userId: targetUserId } }),
  ]);

  const stepsDef = [
    {
      stepKey: 'REGISTERED',
      title: 'Welcome to Digital Heroes',
      description: 'Account created and profile initialized.',
      isDone: true,
    },
    {
      stepKey: 'FIRST_SCORE',
      title: 'Enter First Golf Round',
      description: 'Submit an 18-hole score to activate 5-score rolling average.',
      isDone: scoreCount >= 1,
    },
    {
      stepKey: 'FIRST_IMPACT',
      title: 'Choose Charity Cause',
      description: 'Allocate your subscription portion to hunger relief or reforestation.',
      isDone: contributionCount >= 1,
    },
    {
      stepKey: 'FIVE_SCORE_STREAK',
      title: 'Reach 5-Score Consistency',
      description: 'Submit 5 scores to calculate official consistency index.',
      isDone: scoreCount >= 5,
    },
    {
      stepKey: 'FIRST_ACHIEVEMENT',
      title: 'Unlock Performance Badge',
      description: 'Earn a performance badge and level up your hero identity.',
      isDone: achievementCount >= 1,
    },
    {
      stepKey: 'TRANSPARENT_DRAW',
      title: 'Participate in Monthly Draw',
      description: 'Achieve 80%+ consistency to enter the ₹85,000 monthly pool.',
      isDone: scoreCount >= 5,
    },
  ];

  const completedCount = stepsDef.filter((s) => s.isDone).length;
  const progressPercentage = Math.round((completedCount / stepsDef.length) * 100);

  // Determine Next Best Action with Rationale
  let nextBestAction = {
    stepKey: 'COMPLETE_PROFILE',
    title: 'Submit your next golf round',
    description: 'Keep your 5-score rolling average updated for the upcoming draw.',
    reason: 'Your consistency rating improves with every verified score entry.',
    actionUrl: '/golf-coach',
    ctaText: 'Enter Golf Score',
  };

  if (scoreCount === 0) {
    nextBestAction = {
      stepKey: 'FIRST_SCORE',
      title: 'Enter your first golf score',
      description: 'Activate your 5-score rolling metrics and AI Golf Coach analytics.',
      reason: 'Score entry unlocks AI performance analysis and Stableford point tracking.',
      actionUrl: '/golf-coach',
      ctaText: 'Submit First Score',
    };
  } else if (contributionCount === 0) {
    nextBestAction = {
      stepKey: 'SELECT_CHARITY',
      title: 'Explore Impact Map & Select Charity',
      description: 'Choose which charity receives your monthly subscription impact.',
      reason: 'Charity selection converts your active play into verified community impact.',
      actionUrl: '/impact-map',
      ctaText: 'Explore Impact Map',
    };
  } else if (scoreCount < 5) {
    nextBestAction = {
      stepKey: 'REACH_5_SCORES',
      title: `Submit ${5 - scoreCount} more score(s) for 5-score streak`,
      description: 'You need 5 total scores to unlock official consistency index rating.',
      reason: '5 scores are required for transparent monthly draw eligibility.',
      actionUrl: '/golf-coach',
      ctaText: 'Add Round',
    };
  }

  return {
    steps: stepsDef,
    completedStepsCount: completedCount,
    totalStepsCount: stepsDef.length,
    progressPercentage,
    nextBestAction,
  };
}
