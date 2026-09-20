import { Request, Response, NextFunction } from 'express';
import { heroQuerySchema, updateProfileSchema } from '../validators/hero.validators';
import { getHeroes, getHeroByUsername, getTopHeroes, getStats } from '../services/hero.service';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';

export async function listHeroes(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const query = heroQuerySchema.parse(req.query);
    const result = await getHeroes(query);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

export async function getHero(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const hero = await getHeroByUsername(req.params.username);
    res.json({ success: true, data: hero });
  } catch (err) {
    if (err instanceof Error && err.message === 'Hero not found') {
      res.status(404).json({ success: false, message: 'Hero not found' });
      return;
    }
    next(err);
  }
}

export async function topHeroes(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const heroes = await getTopHeroes(6);
    res.json({ success: true, data: heroes });
  } catch (err) {
    next(err);
  }
}

export async function platformStats(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const stats = await getStats();
    res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const input = updateProfileSchema.parse(req.body);
    const profile = await prisma.heroProfile.update({
      where: { userId: req.user!.userId },
      data: input,
    });
    res.json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
}
