import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { logger } from './logger';

let io: SocketIOServer | null = null;

export function initSocket(httpServer: HTTPServer): SocketIOServer {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: true,
      credentials: true,
    },
  });

  io.on('connection', (socket: Socket) => {
    logger.info(`⚡ New WebSockets client connected: ${socket.id}`);

    // Send welcome live broadcast
    socket.emit('live_event', {
      id: Math.random().toString(36).substring(2),
      type: 'welcome',
      title: 'Digital Heroes Live Network Connected',
      message: 'You are now connected to the real-time hero activity stream.',
      timestamp: new Date().toISOString(),
    });

    socket.on('disconnect', () => {
      logger.info(`WebSockets client disconnected: ${socket.id}`);
    });
  });

  return io;
}

export function broadcastLiveEvent(event: {
  type: 'level_up' | 'xp_gained' | 'achievement_unlocked' | 'welcome';
  title: string;
  message: string;
  heroName?: string;
  avatarUrl?: string;
}) {
  if (!io) return;
  const payload = {
    id: Math.random().toString(36).substring(2),
    ...event,
    timestamp: new Date().toISOString(),
  };
  io.emit('live_event', payload);
  logger.info(`📢 Broadcasted live event: ${event.title}`);
}
