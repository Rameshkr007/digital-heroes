import { Router } from 'express';
import { getDraw, runSimulation, executeDraw } from '../controllers/draw.controller';
import { optionalAuth } from '../middleware/auth';

const router = Router();

router.get('/current', getDraw);
router.post('/simulate', optionalAuth, runSimulation);
router.post('/execute', optionalAuth, executeDraw);

export default router;
