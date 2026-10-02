import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { getUserPreferences, updateUserPreferences, clearUserAIMemory } from '../services/preference.service';
import { askUserCopilot } from '../services/copilot.service';
import { getUserJourney } from '../services/journey.service';
import { getConfigurableAchievements, createConfigurableAchievement, toggleConfigurableAchievement } from '../services/gamification.service';
import { getImpactLedger } from '../services/impactLedger.service';
import { getDomainEvents } from '../services/events.service';
import { prisma } from '../utils/prisma';

// 1. Preferences & AI Memory
export async function getPreferences(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const prefs = await getUserPreferences(req.user?.userId);
    res.json({ success: true, data: prefs });
  } catch (err) {
    next(err);
  }
}

export async function updatePreferences(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const updated = await updateUserPreferences(req.user?.userId, req.body);
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}

export async function clearMemory(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await clearUserAIMemory(req.user?.userId);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// 2. Personal AI Copilot
export async function askCopilot(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { question } = req.body;
    if (!question || typeof question !== 'string') {
      res.status(400).json({ success: false, message: 'Question parameter string is required' });
      return;
    }
    const answer = await askUserCopilot(question, req.user?.userId);
    res.json({ success: true, data: { answer, timestamp: new Date().toISOString() } });
  } catch (err) {
    next(err);
  }
}

// 3. Journey & Smart Actions
export async function getJourney(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const journey = await getUserJourney(req.user?.userId);
    res.json({ success: true, data: journey });
  } catch (err) {
    next(err);
  }
}

// 4. Configurable Gamification
export async function listAchievements(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const list = await getConfigurableAchievements();
    res.json({ success: true, data: list });
  } catch (err) {
    next(err);
  }
}

export async function createAchievement(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const created = await createConfigurableAchievement(req.body);
    res.json({ success: true, data: created });
  } catch (err) {
    next(err);
  }
}

export async function toggleAchievement(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { active } = req.body;
    const updated = await toggleConfigurableAchievement(id, Boolean(active));
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}

// 5. Impact Ledger
export async function listImpactLedger(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const ledger = await getImpactLedger();
    res.json({ success: true, data: ledger });
  } catch (err) {
    next(err);
  }
}

// 6. Domain Events Center
export async function listDomainEvents(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const events = await getDomainEvents();
    res.json({ success: true, data: events });
  } catch (err) {
    next(err);
  }
}

// 7. System Health Check (/api/health and /api/ready)
export async function readinessCheck(req: Request, res: Response): Promise<void> {
  try {
    const dbOk = await prisma.user.count().then(() => true).catch(() => false);
    if (dbOk) {
      res.json({
        status: 'READY',
        database: 'CONNECTED',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      });
    } else {
      res.status(503).json({ status: 'NOT_READY', database: 'DISCONNECTED' });
    }
  } catch {
    res.status(503).json({ status: 'NOT_READY', database: 'ERROR' });
  }
}
