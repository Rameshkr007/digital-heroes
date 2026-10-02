import { Router } from 'express';
import { fetchAuditLogs, fetchAnomalies, copilotQuery, fetchFlags, updateFlag } from '../controllers/admin.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/audit-logs', authenticate, fetchAuditLogs);
router.get('/anomalies', authenticate, fetchAnomalies);
router.post('/ai-copilot', authenticate, copilotQuery);
router.get('/feature-flags', authenticate, fetchFlags);
router.patch('/feature-flags', authenticate, updateFlag);

export default router;
