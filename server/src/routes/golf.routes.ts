import { Router } from 'express';
import { addScore, getPerformance, getCoachAdvice } from '../controllers/golf.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/score', authenticate, addScore);
router.get('/performance', authenticate, getPerformance);
router.get('/coach', authenticate, getCoachAdvice);

export default router;
