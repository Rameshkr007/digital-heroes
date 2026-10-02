import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { getCurrentDraw, simulateDraw, executeLiveDraw } from '../services/draw.service';

export async function getDraw(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const draw = await getCurrentDraw();
    res.json({ success: true, data: draw });
  } catch (err) {
    next(err);
  }
}

export async function runSimulation(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { mode, seed } = req.body;
    const sim = await simulateDraw({ mode, seed });
    res.json({ success: true, data: sim });
  } catch (err) {
    next(err);
  }
}

export async function executeDraw(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { drawId } = req.body;
    if (!drawId) {
      res.status(400).json({ success: false, message: 'Draw ID is required' });
      return;
    }
    const result = await executeLiveDraw(drawId);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}
