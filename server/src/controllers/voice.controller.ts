import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { processVoiceIntent } from '../services/voice.service';
import { getVoiceUsageStats, getVoicePrivacySettings, clearVoiceHistory } from '../services/voiceUsage.service';

// 1. Voice Intent Processing Gateway
export async function handleVoiceQuery(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { transcript, screenContext } = req.body;
    if (!transcript || typeof transcript !== 'string') {
      res.status(400).json({ success: false, message: 'Transcript parameter string is required' });
      return;
    }
    const result = await processVoiceIntent(transcript, screenContext || 'GENERAL', req.user?.userId);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

// 2. Admin Voice & AI Cost Metrics
export async function getVoiceUsage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const stats = await getVoiceUsageStats();
    res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
}

// 3. User Voice Privacy Settings
export async function getPrivacySettings(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const settings = await getVoicePrivacySettings(req.user?.userId);
    res.json({ success: true, data: settings });
  } catch (err) {
    next(err);
  }
}

export async function deleteVoiceHistory(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await clearVoiceHistory(req.user?.userId);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
