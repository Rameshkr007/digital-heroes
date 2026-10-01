import { Router } from 'express';
import { syncGitHub, getGitHubStats } from '../controllers/github.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/sync', authenticate, syncGitHub);
router.get('/stats/:username', getGitHubStats);

export default router;
