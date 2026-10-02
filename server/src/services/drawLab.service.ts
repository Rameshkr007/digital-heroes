import crypto from 'crypto';
import { prisma } from '../utils/prisma';

export async function simulateDrawLab(data: {
  participantCount?: number;
  prizePool?: number;
  mode?: string;
}) {
  const count = data.participantCount || 2500;
  const prizePool = data.prizePool || 85000;
  const mode = data.mode || 'HYBRID';
  const seed = `lab_seed_${Math.random().toString(36).substring(2, 8)}`;

  // Pure non-destructive simulation calculation
  const sampleWinners = ['Aarav Sharma', 'Sarah Nova', 'Alex Chen', 'Priya Sharma', 'Marcus Williams'];
  const selectedWinner = sampleWinners[Math.floor(Math.random() * sampleWinners.length)];

  const simulationHash = crypto
    .createHash('sha256')
    .update(`${seed}:${mode}:${count}:${prizePool}:${selectedWinner}`)
    .digest('hex');

  return {
    isSimulationOnly: true,
    mode,
    seed,
    participantCount: count,
    prizePool,
    selectedWinner,
    verificationHash: simulationHash,
    algorithm: `${mode} Transparent Draw Algorithm (SHA-256 Seed Grounded)`,
    timestamp: new Date().toISOString(),
  };
}

export async function createDrawSnapshot(drawId: string) {
  const draw = await prisma.drawPool.findUnique({ where: { id: drawId } });
  if (!draw) throw new Error('Draw pool not found');

  const eligibleUsers = await prisma.user.findMany({
    where: { role: 'USER' },
    select: { id: true, username: true, role: true },
  });

  const participantsJson = JSON.stringify(eligibleUsers);
  const rulesJson = JSON.stringify({ mode: draw.mode, prizePool: draw.prizePool, month: draw.month });

  const hash = crypto
    .createHash('sha256')
    .update(`${draw.id}:${draw.seed}:${eligibleUsers.length}:${rulesJson}`)
    .digest('hex');

  const snapshot = await prisma.drawSnapshot.create({
    data: {
      drawId: draw.id,
      eligibleCount: eligibleUsers.length,
      participantsJson,
      rulesJson,
      verificationHash: hash,
    },
  });

  return snapshot;
}
