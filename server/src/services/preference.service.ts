import { prisma } from '../utils/prisma';

export async function getUserPreferences(userId?: string) {
  let targetUserId = userId;
  if (!targetUserId) {
    const demoUser = await prisma.user.findFirst({ where: { email: 'aarav@digitalhero.dev' } });
    targetUserId = demoUser?.id;
  }
  if (!targetUserId) throw new Error('User profile not found');

  let prefs = await prisma.userPreference.findUnique({
    where: { userId: targetUserId },
  });

  if (!prefs) {
    prefs = await prisma.userPreference.create({
      data: {
        userId: targetUserId,
        dashboardLayout: 'ADAPTIVE',
        emailNotifs: true,
        inAppNotifs: true,
        preferredCharity: 'Akshaya Patra Midday Meals',
        isPublicProfile: true,
        aiMemoryJson: JSON.stringify({
          preferredView: 'Performance Overview',
          theme: 'dark',
          lastInteractedModule: 'Golf Performance Coach',
        }),
      },
    });
  }

  return {
    ...prefs,
    aiMemory: JSON.parse(prefs.aiMemoryJson || '{}'),
  };
}

export async function updateUserPreferences(userId: string | undefined, updates: {
  dashboardLayout?: string;
  emailNotifs?: boolean;
  inAppNotifs?: boolean;
  preferredCharity?: string;
  isPublicProfile?: boolean;
  aiMemory?: Record<string, any>;
}) {
  let targetUserId = userId;
  if (!targetUserId) {
    const demoUser = await prisma.user.findFirst({ where: { email: 'aarav@digitalhero.dev' } });
    targetUserId = demoUser?.id;
  }
  if (!targetUserId) throw new Error('User profile not found');

  const data: any = {};
  if (updates.dashboardLayout !== undefined) data.dashboardLayout = updates.dashboardLayout;
  if (updates.emailNotifs !== undefined) data.emailNotifs = updates.emailNotifs;
  if (updates.inAppNotifs !== undefined) data.inAppNotifs = updates.inAppNotifs;
  if (updates.preferredCharity !== undefined) data.preferredCharity = updates.preferredCharity;
  if (updates.isPublicProfile !== undefined) data.isPublicProfile = updates.isPublicProfile;
  if (updates.aiMemory !== undefined) data.aiMemoryJson = JSON.stringify(updates.aiMemory);

  const updated = await prisma.userPreference.upsert({
    where: { userId: targetUserId },
    update: data,
    create: {
      userId: targetUserId,
      ...data,
    },
  });

  return {
    ...updated,
    aiMemory: JSON.parse(updated.aiMemoryJson || '{}'),
  };
}

export async function clearUserAIMemory(userId?: string) {
  let targetUserId = userId;
  if (!targetUserId) {
    const demoUser = await prisma.user.findFirst({ where: { email: 'aarav@digitalhero.dev' } });
    targetUserId = demoUser?.id;
  }
  if (!targetUserId) throw new Error('User profile not found');

  const updated = await prisma.userPreference.update({
    where: { userId: targetUserId },
    data: { aiMemoryJson: '{}' },
  });

  return { success: true, message: 'AI personalization memory cleared successfully.', preferences: updated };
}
