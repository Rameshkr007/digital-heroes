import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import { Radio, Zap, Trophy, X } from 'lucide-react';

export interface LiveEvent {
  id: string;
  type: 'level_up' | 'xp_gained' | 'achievement_unlocked' | 'welcome';
  title: string;
  message: string;
  heroName?: string;
  avatarUrl?: string;
  timestamp: string;
}

export function LiveActivityBanner() {
  const [currentEvent, setCurrentEvent] = useState<LiveEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
    const socket = io(backendUrl, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
    });

    socket.on('live_event', (event: LiveEvent) => {
      if (event.type === 'welcome') return; // skip welcome ping for ticker banner
      setCurrentEvent(event);
      setVisible(true);

      // Auto dismiss after 6 seconds
      const timer = setTimeout(() => {
        setVisible(false);
      }, 6000);

      return () => clearTimeout(timer);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  if (!currentEvent || !visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -40 }}
        className="fixed top-16 left-0 right-0 z-40 px-4 pointer-events-none flex justify-center"
      >
        <div className="pointer-events-auto bg-gradient-to-r from-indigo-900/90 via-violet-900/90 to-navy-900/90 border border-indigo-500/40 backdrop-blur-md text-white px-4 py-2.5 rounded-full shadow-glow-indigo flex items-center gap-3 text-xs sm:text-sm max-w-xl">
          <div className="relative flex items-center justify-center">
            <Radio size={16} className="text-cyan-400 animate-pulse" />
            <span className="absolute w-2 h-2 rounded-full bg-cyan-400 animate-ping opacity-75" />
          </div>

          <div className="flex-1 truncate">
            <span className="font-semibold text-indigo-200 mr-2">{currentEvent.title}</span>
            <span className="text-slate-300 hidden sm:inline">{currentEvent.message}</span>
          </div>

          <button
            onClick={() => setVisible(false)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
