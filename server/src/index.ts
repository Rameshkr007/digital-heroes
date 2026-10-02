import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/auth.routes';
import heroRoutes from './routes/hero.routes';
import achievementRoutes from './routes/achievement.routes';
import activityRoutes from './routes/activity.routes';
import githubRoutes from './routes/github.routes';
import aiRoutes from './routes/ai.routes';
import golfRoutes from './routes/golf.routes';
import charityRoutes from './routes/charity.routes';
import drawRoutes from './routes/draw.routes';
import adminRoutes from './routes/admin.routes';
import subscriptionRoutes from './routes/subscription.routes';
import level3Routes from './routes/level3.routes';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';
import { runSeed } from './utils/seed';
import { prisma } from './utils/prisma';
import { initSocket } from './utils/socket';

const app = express();
const PORT = process.env.PORT || 4000;
const server = http.createServer(app);

// Initialize Socket.io WebSockets
initSocket(server);

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
app.use('/api/github', githubRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/golf', golfRoutes);
app.use('/api/charity', charityRoutes);
app.use('/api/draw', drawRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/level3', level3Routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.path} not found` });
});

// Error handler
app.use(errorHandler);

server.listen(PORT, () => {
  logger.info(`Digital Heroes API & WebSockets running on http://localhost:${PORT}`);
});

export default app;
