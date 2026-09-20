import { Router } from 'express';
import { listHeroes, getHero, topHeroes, platformStats, updateProfile } from '../controllers/hero.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', listHeroes);
router.get('/top', topHeroes);
router.get('/stats', platformStats);
router.get('/:username', getHero);
router.patch('/me/profile', authenticate, updateProfile);

export default router;
