import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { getAuditLogs, getAnomalyMonitors, askAdminCopilot, getFeatureFlags, toggleFeatureFlag } from '../services/admin.service';

export async function fetchAuditLogs(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { module, action, limit } = req.query as any;
    const logs = await getAuditLogs({ module, action, limit: limit ? Number(limit) : 30 });
    res.json({ success: true, data: logs });
  } catch (err) {
    next(err);
  }
}

export async function fetchAnomalies(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await getAnomalyMonitors();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function copilotQuery(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { question } = req.body;
    if (!question) {
      res.status(400).json({ success: false, message: 'Question is required' });
      return;
    }
    const answer = await askAdminCopilot(question);
    res.json({ success: true, data: { answer } });
  } catch (err) {
    next(err);
  }
}

export async function fetchFlags(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const flags = await getFeatureFlags();
    res.json({ success: true, data: flags });
  } catch (err) {
    next(err);
  }
}

export async function updateFlag(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { key, enabled } = req.body;
    const flag = await toggleFeatureFlag(key, enabled);
    res.json({ success: true, data: flag });
  } catch (err) {
    next(err);
  }
}
