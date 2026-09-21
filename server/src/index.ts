import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/auth.routes';
import heroRoutes from './routes/hero.routes';
import achievementRoutes from './routes/achievement.routes';
import activityRoutes from './routes/activity.routes';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';
import { runSeed } from './utils/seed';
import { prisma } from './utils/prisma';

const app = express();
const PORT = process.env.PORT || 4000;

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: true, // Allow all origins for API access (Vercel, custom domains, local)
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Digital Heroes API is running', timestamp: new Date().toISOString() });
});

// Seed endpoint to trigger database reset & re-seed with Indian Heroes
app.get('/api/seed', async (req, res) => {
  try {
    await runSeed(prisma);
    res.json({ success: true, message: 'Database successfully re-seeded with Indian Heroes!' });
  } catch (error) {
    logger.error('Seed error:', error);
    res.status(500).json({ success: false, message: 'Seeding failed', error: String(error) });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/heroes', heroRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/activities', activityRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.path} not found` });
});

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Digital Heroes API running on http://localhost:${PORT}`);
});

export default app;
