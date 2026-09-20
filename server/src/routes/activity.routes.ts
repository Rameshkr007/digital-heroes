import { Router } from 'express';
import { listActivities } from '../controllers/activity.controller';

const router = Router();

router.get('/:heroId', listActivities);

export default router;
