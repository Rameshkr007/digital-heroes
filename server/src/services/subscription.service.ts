import { prisma } from '../utils/prisma';

export async function getUserSubscription(userId: string) {
  let sub = await prisma.subscription.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  if (!sub) {
    sub = await prisma.subscription.create({
      data: {
        userId,
        planName: 'Hero Pro Champion Plan',
        status: 'ACTIVE',
        priceMonthly: 999.0,
        currency: 'INR',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        nextRenewalAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });
  }

  const daysLeft = Math.max(0, Math.ceil((sub.nextRenewalAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

  return {
    subscription: sub,
    daysLeft,
    timeline: [
      { date: sub.currentPeriodStart, event: 'Subscription Renewed', amount: '₹999' },
      { date: sub.nextRenewalAt, event: 'Next Auto-Renewal Scheduled', amount: '₹999' },
    ],
    invoices: [
      { id: 'INV-2026-0901', date: '2026-09-01', amount: '₹999', status: 'PAID' },
      { id: 'INV-2026-0801', date: '2026-08-01', amount: '₹999', status: 'PAID' },
    ],
  };
}
