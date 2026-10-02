import { Router } from 'express';
import {
  handleVoiceQuery,
  getVoiceUsage,
  getPrivacySettings,
  deleteVoiceHistory,
} from '../controllers/voice.controller';
import { optionalAuth } from '../middleware/auth';

const router = Router();

// Voice Intent Processing Gateway
router.post('/query', optionalAuth, handleVoiceQuery);

// Admin Voice Usage & Cost Monitoring
router.get('/usage', getVoiceUsage);

// Voice Privacy Controls
router.get('/privacy', optionalAuth, getPrivacySettings);
router.post('/privacy/clear-history', optionalAuth, deleteVoiceHistory);

export default router;
