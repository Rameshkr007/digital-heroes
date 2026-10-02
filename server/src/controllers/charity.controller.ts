import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { getImpactMapData, getUserImpact } from '../services/charity.service';

export async function getMap(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await getImpactMapData();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getMyImpact(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await getUserImpact(req.user!.userId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}
