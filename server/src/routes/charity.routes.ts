import { Router } from 'express';
import { getMap, getMyImpact } from '../controllers/charity.controller';
import { optionalAuth } from '../middleware/auth';

const router = Router();

router.get('/map', getMap);
router.get('/my-impact', optionalAuth, getMyImpact);

export default router;
