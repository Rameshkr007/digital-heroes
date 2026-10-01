import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { logger } from './logger';

let io: SocketIOServer | null = null;

interface ActiveDuel {
  id: string;
  player1: { id: string; name: string; avatar?: string; progress: number };
  player2?: { id: string; name: string; avatar?: string; progress: number };
  problem: {
    title: string;
    description: string;
    starterCode: string;
    expectedOutput: string;
  };
  status: 'waiting' | 'active' | 'completed';
}

const activeDuels: Map<string, ActiveDuel> = new Map();

export function initSocket(httpServer: HTTPServer): SocketIOServer {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: true,
      credentials: true,
    },
  });

  io.on('connection', (socket: Socket) => {
    logger.info(`⚡ WebSockets client connected: ${socket.id}`);

    // Welcome ping
    socket.emit('live_event', {
      id: Math.random().toString(36).substring(2),
      type: 'welcome',
      title: 'Digital Heroes Live Network Connected',
      message: 'You are now connected to the real-time hero activity stream.',
      timestamp: new Date().toISOString(),
    });

    // Code Duel: Join Queue or Create Duel
    socket.on('duel:create', (data: { heroName: string; avatarUrl?: string }) => {
      const duelId = `duel_${Math.random().toString(36).substring(2, 8)}`;
      const newDuel: ActiveDuel = {
        id: duelId,
        player1: { id: socket.id, name: data.heroName, avatar: data.avatarUrl, progress: 0 },
        problem: {
          title: 'Array Two-Sum Challenge',
          description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.',
          starterCode: `function twoSum(nums, target) {\n  // Write your solution here\n  for (let i = 0; i < nums.length; i++) {\n    for (let j = i + 1; j < nums.length; j++) {\n      if (nums[i] + nums[j] === target) return [i, j];\n    }\n  }\n  return [];\n}`,
          expectedOutput: '[0, 1]',
        },
        status: 'waiting',
      };

      activeDuels.set(duelId, newDuel);
      socket.join(duelId);
      socket.emit('duel:created', newDuel);
      logger.info(`🎮 New Code Duel created: ${duelId} by ${data.heroName}`);
    });

    // Code Duel: Join Existing Arena or Auto-Create Room
    socket.on('duel:join', (data: { duelId: string; heroName: string; avatarUrl?: string }) => {
      const cleanDuelId = data.duelId.toLowerCase().trim().replace(/\s+/g, '_');
      let duel = activeDuels.get(cleanDuelId);

      if (!duel) {
        // Auto-create room for custom code if it doesn't exist yet!
        duel = {
          id: cleanDuelId,
          player1: { id: 'bot_ai', name: 'Aarav Sharma (AI Hero)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aarav', progress: 10 },
          problem: {
            title: 'Array Two-Sum Challenge',
            description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.',
            starterCode: `function twoSum(nums, target) {\n  // Write your solution here\n  for (let i = 0; i < nums.length; i++) {\n    for (let j = i + 1; j < nums.length; j++) {\n      if (nums[i] + nums[j] === target) return [i, j];\n    }\n  }\n  return [];\n}`,
            expectedOutput: '[0, 1]',
          },
          status: 'waiting',
        };
        activeDuels.set(cleanDuelId, duel);
      }

      if (duel.status === 'waiting' || duel.status === 'active') {
        duel.player2 = { id: socket.id, name: data.heroName, avatar: data.avatarUrl, progress: 0 };
        duel.status = 'active';
        activeDuels.set(cleanDuelId, duel);

        socket.join(cleanDuelId);
        io?.to(cleanDuelId).emit('duel:started', duel);
        logger.info(`🎮 Duel started: ${cleanDuelId} (${duel.player1.name} vs ${duel.player2.name})`);
      } else {
        socket.emit('duel:error', { message: 'Duel already completed or busy' });
      }
    });

    // Code Duel: Code Progress Update
    socket.on('duel:progress', (data: { duelId: string; progress: number }) => {
      const duel = activeDuels.get(data.duelId);
      if (duel) {
        if (socket.id === duel.player1.id) duel.player1.progress = data.progress;
        else if (duel.player2 && socket.id === duel.player2.id) duel.player2.progress = data.progress;

        socket.to(data.duelId).emit('duel:opponent_progress', { progress: data.progress });
      }
    });

    // Code Duel: Submit Winner
    socket.on('duel:submit_win', (data: { duelId: string; winnerName: string }) => {
      const duel = activeDuels.get(data.duelId);
      if (duel && duel.status === 'active') {
        duel.status = 'completed';
        io?.to(data.duelId).emit('duel:ended', { winnerName: data.winnerName });

        // Broadcast global live event across platform!
        broadcastLiveEvent({
          type: 'achievement_unlocked',
          title: `⚔️ ${data.winnerName} won a 1v1 Code Duel!`,
          message: `Defeated opponent in "Array Two-Sum Challenge" (+500 XP)`,
          heroName: data.winnerName,
        });

        activeDuels.delete(data.duelId);
      }
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
