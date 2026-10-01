import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { generateAIMentorAdvice } from '../services/ai.service';

export async function askAIMentor(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { message, history } = req.body;
    if (!message) {
      res.status(400).json({ success: false, message: 'Message is required' });
      return;
    }

    const advice = await generateAIMentorAdvice(req.user?.userId, message, history || []);
    res.json({
      success: true,
      data: {
        reply: advice,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    next(err);
  }
}
