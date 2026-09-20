import { Request, Response, NextFunction } from 'express';
import { getAchievements } from '../services/achievement.service';

export async function listAchievements(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { heroId, category } = req.query as { heroId?: string; category?: string };
    const achievements = await getAchievements(heroId, category);
    res.json({ success: true, data: achievements });
  } catch (err) {
    next(err);
  }
}
