import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { getRecommendations, dismissRecommendation } from '../services/recommendation.service';
import { getMonthlyStory } from '../services/story.service';
import { simulateDrawLab, createDrawSnapshot } from '../services/drawLab.service';
import { getBackgroundJobs, enqueueJob } from '../services/jobs.service';
import { getPredictiveInsights } from '../services/predictive.service';
import { getAdminQueue, resolveAdminQueueItem } from '../services/adminQueue.service';
import { prisma } from '../utils/prisma';

// 1. Recommendation Engine
export async function listRecommendations(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const recs = await getRecommendations(req.user?.userId);
    res.json({ success: true, data: recs });
  } catch (err) {
    next(err);
  }
}

export async function dismissRec(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const updated = await dismissRecommendation(id);
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}

// 2. Personalized Monthly Story
export async function getStory(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { month, year } = req.query as { month?: string; year?: string };
    const story = await getMonthlyStory(req.user?.userId, month || 'October', Number(year) || 2026);
    res.json({ success: true, data: story });
  } catch (err) {
    next(err);
  }
}

// 3. Draw Engine 4.0 & Simulation Lab
export async function runDrawLab(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await simulateDrawLab(req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function snapshotDraw(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { drawId } = req.params;
    const snapshot = await createDrawSnapshot(drawId);
    res.json({ success: true, data: snapshot });
  } catch (err) {
    next(err);
  }
}

// 4. Background Job Queue
export async function listJobs(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const jobs = await getBackgroundJobs();
    res.json({ success: true, data: jobs });
  } catch (err) {
    next(err);
  }
}

export async function createJob(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { jobType, payload } = req.body;
    const job = await enqueueJob(jobType || 'ANALYTICS_AGGREGATION', payload || {});
    res.json({ success: true, data: job });
  } catch (err) {
    next(err);
  }
}

// 5. Predictive Insights Engine
export async function listPredictiveInsights(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const insights = await getPredictiveInsights(req.user?.userId);
    res.json({ success: true, data: insights });
  } catch (err) {
    next(err);
  }
}

// 6. Needs Attention Admin Queue
export async function listAdminQueue(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const queue = await getAdminQueue();
    res.json({ success: true, data: queue });
  } catch (err) {
    next(err);
  }
}

export async function resolveQueue(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const updated = await resolveAdminQueueItem(id);
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}

// 7. System Health Center (/api/system/health)
export async function systemHealthCheck(req: Request, res: Response): Promise<void> {
  try {
    const [userCount, jobCount, queueCount] = await Promise.all([
      prisma.user.count(),
      prisma.backgroundJob.count(),
      prisma.adminQueueItem.count({ where: { status: 'PENDING' } }),
    ]);

    res.json({
      status: 'HEALTHY',
      version: '4.0.0-ENTERPRISE',
      uptime: process.uptime(),
      metrics: {
        users: userCount,
        backgroundJobs: jobCount,
        queueNeedsAttention: queueCount,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ status: 'UNHEALTHY', error: String(err) });
  }
}
