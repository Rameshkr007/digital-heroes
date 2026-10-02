import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Brain, Target, MapPin, Trophy, ShieldCheck, Settings, Award, Command } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent toggles state
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const items = [
    { id: 'dash', title: 'User Dashboard', icon: <Target size={18} />, route: '/dashboard', category: 'Navigation' },
    { id: 'coach', title: 'AI Golf Performance Coach', icon: <Brain size={18} />, route: '/golf-coach', category: 'Intelligence' },
    { id: 'map', title: 'Live Charity Impact Map', icon: <MapPin size={18} />, route: '/impact-map', category: 'Impact' },
    { id: 'draw', title: 'Dynamic Draw Engine & Simulator', icon: <Trophy size={18} />, route: '/draw-engine', category: 'Rewards' },
    { id: 'trust', title: 'Platform Trust & Verification Center', icon: <ShieldCheck size={18} />, route: '/trust', category: 'Trust' },
    { id: 'admin', title: 'AI Admin Copilot & Anomaly Monitor', icon: <Settings size={18} />, route: '/admin-copilot', category: 'Admin' },
    { id: 'story', title: 'Monthly Impact Story', icon: <Award size={18} />, route: '/month-story', category: 'Impact' },
    { id: 'ledger', title: 'Verified Impact Ledger', icon: <MapPin size={18} />, route: '/impact-ledger', category: 'Trust' },
  ];

  const filteredItems = items.filter(
    (i) => i.title.toLowerCase().includes(query.toLowerCase()) || i.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (route: string) => {
    navigate(route);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="relative w-full max-w-xl bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-700 shadow-2xl overflow-hidden z-10"
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 py-3 border-b border-slate-200 dark:border-navy-800">
              <Search className="text-slate-400 mr-3 shrink-0" size={20} />
              <input
                type="text"
                placeholder="Type a command or search feature... (e.g. Golf Coach, Impact Map)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none text-sm font-medium"
                autoFocus
              />
              <span className="text-xs bg-slate-100 dark:bg-navy-800 text-slate-400 px-2 py-0.5 rounded font-mono shrink-0">
                ESC
              </span>
            </div>

            {/* Results List */}
            <div className="max-h-80 overflow-y-auto p-2 space-y-1">
              {filteredItems.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-sm">
                  No matching commands found.
                </div>
              ) : (
                filteredItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.route)}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-navy-800 text-left transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        {item.icon}
                      </div>
                      <span className="font-semibold text-sm text-slate-900 dark:text-white">{item.title}</span>
                    </div>
                    <span className="text-xs bg-slate-100 dark:bg-navy-950 text-slate-400 px-2 py-1 rounded-full font-medium">
                      {item.category}
                    </span>
                  </button>
                ))
              )}
            </div>

            <div className="p-3 bg-slate-50 dark:bg-navy-950 border-t border-slate-200 dark:border-navy-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Command size={12} /> Digital Heroes Command Palette
              </span>
              <span>Press ESC to exit</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
