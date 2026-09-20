import { Router } from 'express';
import { listAchievements } from '../controllers/achievement.controller';

const router = Router();

router.get('/', listAchievements);

export default router;
