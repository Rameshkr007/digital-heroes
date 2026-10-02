import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { getUserSubscription } from '../services/subscription.service';

export async function getSubscription(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await getUserSubscription(req.user!.userId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}
