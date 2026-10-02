import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';

export async function checkIdempotency(req: Request, res: Response, next: NextFunction): Promise<void> {
  const key = req.headers['x-idempotency-key'] as string;
  if (!key) {
    next();
    return;
  }

  try {
    const existing = await prisma.idempotencyRecord.findUnique({ where: { key } });
    if (existing) {
      res.setHeader('X-Cache-Lookup', 'IDEMPOTENT_HIT');
      res.status(200).json(JSON.parse(existing.response));
      return;
    }

    // Intercept res.json to save response
    const originalJson = res.json.bind(res);
    res.json = (body: any) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        prisma.idempotencyRecord
          .create({
            data: {
              key,
              path: req.originalUrl,
              response: JSON.stringify(body),
            },
          })
          .catch(() => {});
      }
      return originalJson(body);
    };

    next();
  } catch (err) {
    next();
  }
}
