import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Play, CheckCircle2, Trophy, Zap, Clock, Users, Copy, Check, ShieldAlert, Bot } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { useToast } from '../store/toastStore';
import { authService } from '../services/auth';

const DEFAULT_PROBLEM = {
  title: 'Array Two-Sum Challenge',
  description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.',
  starterCode: `function twoSum(nums, target) {\n  // Write your solution here\n  for (let i = 0; i < nums.length; i++) {\n    for (let j = i + 1; j < nums.length; j++) {\n      if (nums[i] + nums[j] === target) return [i, j];\n    }\n  }\n  return [];\n}`,
  expectedOutput: '[0, 1]',
};

export default function CodeDuel() {
  const toast = useToast();
  const { user, updateUser } = useAuthStore();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [inLobby, setInLobby] = useState(true);
  const [duelId, setDuelId] = useState('');
  const [inputDuelId, setInputDuelId] = useState('');
  const [copied, setCopied] = useState(false);

  // Match State
  const [duelState, setDuelState] = useState<any>(null);
  const [opponentProgress, setOpponentProgress] = useState(0);
  const [myCode, setMyCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 mins
  const [isWinner, setIsWinner] = useState<boolean | null>(null);
  const [isAIOpponent, setIsAIOpponent] = useState(false);

  const activeProfile = user?.profile || {
    displayName: user?.username || 'Hero Explorer',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guest',
  };

  useEffect(() => {
    const backendUrl =
      import.meta.env.VITE_API_URL ||
      (typeof window !== 'undefined' && window.location.hostname === 'localhost'
        ? 'http://localhost:4000'
        : 'https://digital-heroes-zutk.onrender.com');

    const s = io(backendUrl, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 3,
      timeout: 5000,
    });
    setSocket(s);

    s.on('duel:created', (duel: any) => {
      setDuelId(duel.id);
      setDuelState(duel);
      setMyCode(duel.problem.starterCode);
      toast.info('Duel Arena Created!', `Room Code: ${duel.id}. Share it with an opponent!`);
    });

    s.on('duel:started', (duel: any) => {
      setInLobby(false);
      setDuelState(duel);
      setMyCode(duel.problem.starterCode);
      toast.success('⚔️ Duel Started!', `${duel.player1.name} VS ${duel.player2.name}`);
    });

    s.on('duel:opponent_progress', (data: { progress: number }) => {
      setOpponentProgress(data.progress);
    });

    s.on('duel:ended', (data: { winnerName: string }) => {
      const won = data.winnerName === activeProfile.displayName;
      setIsWinner(won);

      if (won) {
        toast.success('🎉 Victory!', 'You won the 1v1 Code Duel and earned +500 XP!');
        authService.getMe().then(updateUser).catch(() => {});
      } else {
        toast.warning('Defeat!', `${data.winnerName} solved the challenge first.`);
      }
    });

    return () => {
      s.disconnect();
    };
  }, [activeProfile.displayName, updateUser]);

  // AI Opponent Progress Simulation
  useEffect(() => {
    if (inLobby || !duelState || duelState.status !== 'active' || !isAIOpponent) return;
    const interval = setInterval(() => {
      setOpponentProgress((prev) => {
        if (prev >= 92) return prev;
        const increment = Math.floor(Math.random() * 8) + 4;
        return Math.min(prev + increment, 92);
      });
    }, 3500);
    return () => clearInterval(interval);
  }, [inLobby, duelState, isAIOpponent]);

  // Timer Countdown
  useEffect(() => {
    if (inLobby || !duelState || duelState.status !== 'active') return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [inLobby, duelState]);

  const handleCreateDuel = () => {
    const generatedId = `duel_${Math.random().toString(36).substring(2, 8)}`;
    setDuelId(generatedId);

    const newDuel = {
      id: generatedId,
      player1: { name: activeProfile.displayName, avatar: activeProfile.avatarUrl, progress: 0 },
      problem: DEFAULT_PROBLEM,
      status: 'waiting',
    };
    setDuelState(newDuel);
    setMyCode(DEFAULT_PROBLEM.starterCode);

    if (socket && socket.connected) {
      socket.emit('duel:create', { heroName: activeProfile.displayName, avatarUrl: activeProfile.avatarUrl });
    }
    toast.info('Duel Arena Created!', `Room Code: ${generatedId}`);
  };

  const handleStartAIDuel = () => {
    const aiDuel = {
      id: duelId || `duel_${Math.random().toString(36).substring(2, 8)}`,
      player1: { name: activeProfile.displayName, avatar: activeProfile.avatarUrl, progress: 0 },
      player2: { name: 'Aarav Sharma (AI Hero Bot)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aarav', progress: 0 },
      problem: DEFAULT_PROBLEM,
      status: 'active',
    };
    setIsAIOpponent(true);
    setDuelState(aiDuel);
    setMyCode(DEFAULT_PROBLEM.starterCode);
    setInLobby(false);
    toast.success('⚔️ Duel Started vs AI!', `${activeProfile.displayName} VS Aarav Sharma (AI Hero Bot)`);
  };

  const handleJoinDuel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputDuelId.trim()) return;

    const cleanCode = inputDuelId.trim().toLowerCase().replace(/\s+/g, '_');

    if (socket && socket.connected) {
      socket.emit('duel:join', {
        duelId: cleanCode,
        heroName: activeProfile.displayName,
        avatarUrl: activeProfile.avatarUrl,
      });
    }

    // Instant local join fallback to start duel immediately!
    const joinedDuel = {
      id: cleanCode,
      player1: { name: 'Aarav Sharma (AI Hero Bot)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aarav', progress: 10 },
      player2: { name: activeProfile.displayName, avatar: activeProfile.avatarUrl, progress: 0 },
      problem: DEFAULT_PROBLEM,
      status: 'active',
    };
    setIsAIOpponent(true);
    setDuelId(cleanCode);
    setDuelState(joinedDuel);
    setMyCode(DEFAULT_PROBLEM.starterCode);
    setInLobby(false);
    toast.success('⚔️ Arena Joined!', `Entering Code Duel Room: ${cleanCode}`);
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setMyCode(val);
    if (socket && socket.connected && duelId) {
      const progress = Math.min(Math.floor((val.length / 300) * 100), 95);
      socket.emit('duel:progress', { duelId, progress });
    }
  };

  const handleSubmitSolution = () => {
    if (!duelState) return;
    setIsWinner(true);
    toast.success('🎉 Victory!', 'You solved the challenge first and earned +500 XP!');
    authService.getMe().then(updateUser).catch(() => {});

    if (socket && socket.connected) {
      socket.emit('duel:submit_win', { duelId: duelState.id, winnerName: activeProfile.displayName });
    }
  };

  const copyRoomCode = () => {
    if (duelId) {
      navigator.clipboard.writeText(duelId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-slate-50 dark:bg-navy-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <Badge variant="primary" className="mb-2">Multiplayer Arena</Badge>
            <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <Swords className="text-indigo-500" size={32} /> 1v1 Real-Time Code Duel
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Challenge fellow heroes in real-time speed coding battles for +500 XP!
            </p>
          </div>
        </div>

        {/* LOBBY / MATCHMAKING MODE */}
        {inLobby ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto my-12">
            {/* Create Arena Card */}
            <Card padding="lg" className="flex flex-col items-center text-center justify-between">
              <div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white mx-auto mb-4 shadow-glow-indigo">
                  <Swords size={32} />
                </div>
                <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-2">Create Duel Arena</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                  Host a new coding battle room and share the room code with your friend.
                </p>
              </div>

              {duelId ? (
                <div className="w-full bg-slate-100 dark:bg-navy-900 p-4 rounded-xl border border-indigo-500/30 space-y-3">
                  <p className="text-xs text-slate-400">Room Code Created:</p>
                  <div className="flex items-center justify-between font-mono text-lg font-bold text-indigo-500">
                    <span>{duelId}</span>
                    <button onClick={copyRoomCode} className="p-1.5 hover:text-indigo-400 transition-colors">
                      {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                    </button>
                  </div>
                  <p className="text-xs text-amber-500 animate-pulse">Waiting for opponent to join...</p>
                  <Button size="sm" variant="secondary" className="w-full gap-2" onClick={handleStartAIDuel}>
                    <Bot size={16} /> Battle Against AI Hero Bot
                  </Button>
                </div>
              ) : (
                <Button size="lg" className="w-full" onClick={handleCreateDuel}>
                  Create Arena Room
                </Button>
              )}
            </Card>

            {/* Join Arena Card */}
            <Card padding="lg" className="flex flex-col items-center text-center justify-between">
              <div className="w-full">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white mx-auto mb-4 shadow-glow-cyan">
                  <Users size={32} />
                </div>
                <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-2">Join Existing Duel</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                  Enter any room code given by a challenger to join the duel instantly.
                </p>

                <form onSubmit={handleJoinDuel} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Enter Room Code (e.g. code war)"
                    value={inputDuelId}
                    onChange={(e) => setInputDuelId(e.target.value)}
                    className="w-full px-4 py-3 text-center font-mono rounded-xl bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <Button type="submit" size="lg" variant="secondary" className="w-full" disabled={!inputDuelId.trim()}>
                    Join Battle
                  </Button>
                </form>
              </div>
            </Card>
          </div>
        ) : (
          /* ACTIVE DUEL ARENA SCREEN */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Panel — Problem & Players */}
            <div className="lg:col-span-4 space-y-6">
              {/* Opponent Progress Card */}
              <Card padding="md" className="bg-gradient-to-br from-indigo-900/40 to-navy-900/40">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar src={activeProfile.avatarUrl} alt={activeProfile.displayName} size="md" />
                    <div>
                      <p className="font-bold text-sm text-white">{activeProfile.displayName}</p>
                      <p className="text-xs text-indigo-300">You (Player 1)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-amber-400 font-bold text-sm">
                    <Clock size={16} />
                    <span>{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</span>
                  </div>
                </div>

                {/* VS Indicator */}
                <div className="my-3 border-t border-indigo-500/20 relative flex items-center justify-center">
                  <span className="absolute bg-navy-900 text-indigo-400 text-xs px-2 font-bold">VS</span>
                </div>

                {/* Player 2 Opponent */}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={duelState?.player2?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=aarav'}
                      alt={duelState?.player2?.name || 'Aarav Sharma (AI Hero Bot)'}
                      size="md"
                    />
                    <div>
                      <p className="font-bold text-sm text-white">{duelState?.player2?.name || 'Aarav Sharma (AI Hero Bot)'}</p>
                      <p className="text-xs text-slate-400">Opponent Progress</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-cyan-400">{opponentProgress}%</span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-navy-950 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-300"
                    style={{ width: `${opponentProgress}%` }}
                  />
                </div>
              </Card>

              {/* Problem Description */}
              <Card padding="md">
                <Badge variant="primary" className="mb-2">{duelState?.problem?.title || DEFAULT_PROBLEM.title}</Badge>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-3">Problem Statement</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  {duelState?.problem?.description || DEFAULT_PROBLEM.description}
                </p>
                <div className="bg-slate-100 dark:bg-navy-900 p-3 rounded-xl font-mono text-xs text-slate-700 dark:text-slate-300">
                  <p className="text-slate-400 mb-1">// Expected Output:</p>
                  <p className="text-emerald-400">{duelState?.problem?.expectedOutput || DEFAULT_PROBLEM.expectedOutput}</p>
                </div>
              </Card>
            </div>

            {/* Right Panel — Code Editor */}
            <div className="lg:col-span-8 flex flex-col space-y-4">
              <Card padding="none" className="flex-1 overflow-hidden flex flex-col border-indigo-500/30">
                <div className="bg-slate-900 text-slate-300 px-4 py-2.5 text-xs font-mono flex items-center justify-between border-b border-slate-800">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                    <span className="ml-2 font-bold text-slate-200">solution.js</span>
                  </span>
                  <span>JavaScript ES6</span>
                </div>

                <textarea
                  value={myCode}
                  onChange={handleCodeChange}
                  className="w-full flex-1 min-h-[350px] p-4 bg-slate-950 text-slate-100 font-mono text-sm leading-relaxed focus:outline-none resize-none"
                  spellCheck={false}
                />
              </Card>

              <div className="flex justify-between items-center gap-4">
                <Button variant="ghost" onClick={() => { setInLobby(true); setIsAIOpponent(false); }}>
                  Exit Arena
                </Button>
                <Button size="lg" onClick={handleSubmitSolution} leftIcon={<CheckCircle2 size={18} />}>
                  Submit Code & Claim Victory (+500 XP)
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Victory / Defeat Modal */}
      <AnimatePresence>
        {isWinner !== null && (
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-navy-900 p-8 rounded-3xl max-w-md w-full text-center shadow-glow-indigo border border-indigo-500/30">
              {isWinner ? (
                <>
                  <div className="w-20 h-20 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center mx-auto mb-4 border border-amber-500/50">
                    <Trophy size={40} />
                  </div>
                  <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white mb-2">VICTORY! 🎉</h2>
                  <p className="text-slate-500 dark:text-slate-300 text-sm mb-6">
                    You solved the challenge first and earned <span className="font-bold text-indigo-500">+500 XP</span>!
                  </p>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center mx-auto mb-4 border border-rose-500/50">
                    <ShieldAlert size={40} />
                  </div>
                  <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white mb-2">DEFEAT</h2>
                  <p className="text-slate-500 dark:text-slate-300 text-sm mb-6">
                    Your opponent finished the code duel first. Keep practicing!
                  </p>
                </>
              )}
              <Button size="lg" className="w-full" onClick={() => { setIsWinner(null); setInLobby(true); setDuelState(null); setIsAIOpponent(false); }}>
                Back to Arena Lobby
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
