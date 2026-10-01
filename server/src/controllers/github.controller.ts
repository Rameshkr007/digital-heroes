import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { syncGitHubForHero, fetchGitHubData } from '../services/github.service';
import { prisma } from '../utils/prisma';

export async function syncGitHub(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { githubUsername } = req.body;
    if (!githubUsername) {
      res.status(400).json({ success: false, message: 'GitHub username is required' });
      return;
    }

    const profile = await prisma.heroProfile.findUnique({
      where: { userId: req.user!.userId },
    });

    if (!profile) {
      res.status(404).json({ success: false, message: 'Hero profile not found' });
      return;
    }

    const result = await syncGitHubForHero(profile.id, githubUsername);
    res.json({
      success: true,
      message: `Successfully synced GitHub data for @${githubUsername}`,
      data: result,
    });
  } catch (err: any) {
    if (err.message.includes('not found') || err.message.includes('required')) {
      res.status(400).json({ success: false, message: err.message });
      return;
    }
    next(err);
  }
}

export async function getGitHubStats(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { username } = req.params;
    const stats = await fetchGitHubData(username);
    res.json({ success: true, data: stats });
  } catch (err: any) {
    next(err);
  }
}
