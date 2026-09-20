import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '../utils/logger';

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction): void {
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: err.errors.map((e) => ({ path: e.path.join('.'), message: e.message })),
    });
    return;
  }
  if (err instanceof Error) {
    logger.error(err.message, err.stack);
    res.status(500).json({
      success: false,
      message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    });
    return;
  }
  res.status(500).json({ success: false, message: 'Internal server error' });
}
