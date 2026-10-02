import { Router } from 'express';
import {
  getPreferences,
  updatePreferences,
  clearMemory,
  askCopilot,
  getJourney,
  listAchievements,
  createAchievement,
  toggleAchievement,
  listImpactLedger,
  listDomainEvents,
  readinessCheck,
} from '../controllers/level3.controller';
import { optionalAuth } from '../middleware/auth';
import { checkIdempotency } from '../middleware/idempotency.middleware';

const router = Router();

// Readiness check
router.get('/ready', readinessCheck);

// Preferences & AI Memory
router.get('/preferences', optionalAuth, getPreferences);
router.patch('/preferences', optionalAuth, updatePreferences);
router.post('/preferences/clear-memory', optionalAuth, clearMemory);

// Personal AI Copilot
router.post('/copilot', optionalAuth, askCopilot);

// Personal Journey Engine
router.get('/journey', optionalAuth, getJourney);

// Configurable Gamification
router.get('/gamification/achievements', listAchievements);
router.post('/gamification/achievements', createAchievement);
router.patch('/gamification/achievements/:id/toggle', toggleAchievement);

// Impact Ledger
router.get('/impact-ledger', listImpactLedger);

// Domain Events Center
router.get('/events', listDomainEvents);

export default router;
