import { Router } from 'express';
import { addScore, getPerformance, getCoachAdvice } from '../controllers/golf.controller';
import { optionalAuth } from '../middleware/auth';

const router = Router();

router.post('/score', optionalAuth, addScore);
router.get('/performance', optionalAuth, getPerformance);
router.get('/coach', optionalAuth, getCoachAdvice);

export default router;
