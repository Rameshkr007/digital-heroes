import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { submitGolfScore, getGolfPerformance, getAIGolfCoachAdvice } from '../services/golf.service';

export async function addScore(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { score, handicap, courseName } = req.body;
    if (!score || typeof score !== 'number' || score < 50 || score > 150) {
      res.status(400).json({ success: false, message: 'Valid golf score between 50 and 150 is required' });
      return;
    }
    const result = await submitGolfScore(req.user!.userId, { score, handicap, courseName });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function getPerformance(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const perf = await getGolfPerformance(req.user!.userId);
    res.json({ success: true, data: perf });
  } catch (err) {
    next(err);
  }
}

export async function getCoachAdvice(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const advice = await getAIGolfCoachAdvice(req.user!.userId);
    res.json({ success: true, data: advice });
  } catch (err) {
    next(err);
  }
}
