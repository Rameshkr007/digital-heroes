import { Router } from 'express';
import { getSubscription } from '../controllers/subscription.controller';
import { optionalAuth } from '../middleware/auth';

const router = Router();

router.get('/me', optionalAuth, getSubscription);

export default router;
