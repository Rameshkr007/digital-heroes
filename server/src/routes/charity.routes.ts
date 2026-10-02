import { Router } from 'express';
import { getMap, getMyImpact } from '../controllers/charity.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/map', getMap);
router.get('/my-impact', authenticate, getMyImpact);

export default router;
