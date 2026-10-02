import { Router } from 'express';
import { getDraw, runSimulation, executeDraw } from '../controllers/draw.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/current', getDraw);
router.post('/simulate', authenticate, runSimulation);
router.post('/execute', authenticate, executeDraw);

export default router;
