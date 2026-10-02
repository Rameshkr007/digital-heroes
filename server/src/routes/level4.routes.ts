import { Router } from 'express';
import {
  listRecommendations,
  dismissRec,
  getStory,
  runDrawLab,
  snapshotDraw,
  listJobs,
  createJob,
  listPredictiveInsights,
  listAdminQueue,
  resolveQueue,
  systemHealthCheck,
} from '../controllers/level4.controller';
import { optionalAuth } from '../middleware/auth';

const router = Router();

// System Health Center
router.get('/system/health', systemHealthCheck);

// Recommendation Engine
router.get('/recommendations', optionalAuth, listRecommendations);
router.patch('/recommendations/:id/dismiss', dismissRec);

// Personalized Monthly Story
router.get('/monthly-story', optionalAuth, getStory);

// Draw Engine 4.0 Simulation Lab & Snapshots
router.post('/draw/lab-simulate', runDrawLab);
router.post('/draw/:drawId/snapshot', snapshotDraw);

// Background Jobs Queue
router.get('/jobs', listJobs);
router.post('/jobs', createJob);

// Predictive Insights
router.get('/predictive', optionalAuth, listPredictiveInsights);

// Needs Attention Admin Queue
router.get('/admin/queue', listAdminQueue);
router.patch('/admin/queue/:id/resolve', resolveQueue);

export default router;
