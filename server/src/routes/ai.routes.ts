import { Router } from 'express';
import { askAIMentor } from '../controllers/ai.controller';
import { optionalAuth } from '../middleware/auth';

const router = Router();

router.post('/mentor', optionalAuth, askAIMentor);

export default router;
