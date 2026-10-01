import { Router } from 'express';
import { askAIMentor } from '../controllers/ai.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/mentor', authenticate, askAIMentor);

export default router;
