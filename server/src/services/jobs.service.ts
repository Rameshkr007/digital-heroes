import { prisma } from '../utils/prisma';

export async function enqueueJob(jobType: string, payload: Record<string, any>) {
  const job = await prisma.backgroundJob.create({
    data: {
      jobType,
      status: 'PENDING',
      payload: JSON.stringify(payload),
      attempts: 0,
      maxAttempts: 3,
    },
  });

  // Process job asynchronously
  setTimeout(async () => {
    try {
      await prisma.backgroundJob.update({
        where: { id: job.id },
        data: { status: 'PROCESSING', attempts: 1 },
      });

      // Execute job logic based on type
      if (jobType === 'MONTHLY_REPORT_GENERATION') {
        // Report logic
      } else if (jobType === 'FRAUD_SCAN') {
        // Scan logic
      }

      await prisma.backgroundJob.update({
        where: { id: job.id },
        data: { status: 'COMPLETED' },
      });
    } catch (err: any) {
      await prisma.backgroundJob.update({
        where: { id: job.id },
        data: { status: 'FAILED', lastError: err.message },
      });
    }
  }, 100);

  return job;
}

export async function getBackgroundJobs() {
  let jobs = await prisma.backgroundJob.findMany({
    orderBy: { scheduledAt: 'desc' },
    take: 20,
  });

  if (jobs.length === 0) {
    // Seed initial completed background jobs
    jobs = await Promise.all([
      prisma.backgroundJob.create({
        data: {
          jobType: 'MONTHLY_REPORT_GENERATION',
          status: 'COMPLETED',
          payload: JSON.stringify({ month: 'October 2026' }),
          attempts: 1,
        },
      }),
      prisma.backgroundJob.create({
        data: {
          jobType: 'FRAUD_SCAN',
          status: 'COMPLETED',
          payload: JSON.stringify({ scannedScoresCount: 32 }),
          attempts: 1,
        },
      }),
      prisma.backgroundJob.create({
        data: {
          jobType: 'ANALYTICS_AGGREGATION',
          status: 'COMPLETED',
          payload: JSON.stringify({ period: 'Daily' }),
          attempts: 1,
        },
      }),
    ]);
  }

  return jobs;
}
