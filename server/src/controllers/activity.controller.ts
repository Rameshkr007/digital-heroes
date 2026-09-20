import { Request, Response, NextFunction } from 'express';
import { getActivities } from '../services/activity.service';

export async function listActivities(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { heroId } = req.params;
    const limit = Number(req.query.limit) || 20;
    const activities = await getActivities(heroId, limit);
    res.json({ success: true, data: activities });
  } catch (err) {
    next(err);
  }
}
