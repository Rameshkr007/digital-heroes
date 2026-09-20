import { Request, Response, NextFunction } from 'express';
import { registerSchema, loginSchema } from '../validators/auth.validators';
import { registerUser, loginUser, getMe } from '../services/auth.service';
import { AuthRequest } from '../middleware/auth';

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const input = registerSchema.parse(req.body);
    const result = await registerUser(input);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    if (err instanceof Error && (err.message.includes('already') || err.message.includes('taken'))) {
      res.status(409).json({ success: false, message: err.message });
      return;
    }
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const input = loginSchema.parse(req.body);
    const result = await loginUser(input);
    res.json({ success: true, data: result });
  } catch (err) {
    if (err instanceof Error && err.message.includes('Invalid')) {
      res.status(401).json({ success: false, message: err.message });
      return;
    }
    next(err);
  }
}

export async function me(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await getMe(req.user!.userId);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}
