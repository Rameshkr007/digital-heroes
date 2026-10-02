import { Router } from 'express';
import { getSubscription } from '../controllers/subscription.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/me', authenticate, getSubscription);

export default router;
