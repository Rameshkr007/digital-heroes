import { Router } from 'express';
import { fetchAuditLogs, fetchAnomalies, copilotQuery, fetchFlags, updateFlag } from '../controllers/admin.controller';
import { optionalAuth } from '../middleware/auth';

const router = Router();

router.get('/audit-logs', optionalAuth, fetchAuditLogs);
router.get('/anomalies', optionalAuth, fetchAnomalies);
router.post('/ai-copilot', optionalAuth, copilotQuery);
router.get('/feature-flags', optionalAuth, fetchFlags);
router.patch('/feature-flags', optionalAuth, updateFlag);

export default router;
