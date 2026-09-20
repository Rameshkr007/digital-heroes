import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, Home, Users, Trophy, Info, LayoutDashboard, LogIn, Zap, ArrowRight, Contact } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const commands = [
  { id: 'home', label: 'Go to Home', icon: <Home size={16} />, action: '/', category: 'Navigate' },
  { id: 'explore', label: 'Explore Heroes', icon: <Search size={16} />, action: '/explore', category: 'Navigate' },
  { id: 'heroes', label: 'Browse Heroes', icon: <Users size={16} />, action: '/heroes', category: 'Navigate' },
  { id: 'achievements', label: 'View Achievements', icon: <Trophy size={16} />, action: '/achievements', category: 'Navigate' },
  { id: 'about', label: 'About Digital Heroes', icon: <Info size={16} />, action: '/about', category: 'Navigate' },
  { id: 'contact', label: 'Contact Us', icon: <Contact size={16} />, action: '/contact', category: 'Navigate' },
  { id: 'dashboard', label: 'Open Dashboard', icon: <LayoutDashboard size={16} />, action: '/dashboard', category: 'Account', requiresAuth: true },
  { id: 'login', label: 'Sign In', icon: <LogIn size={16} />, action: '/login', category: 'Account', requiresGuest: true },
  { id: 'register', label: 'Join Heroes', icon: <Zap size={16} />, action: '/register', category: 'Account', requiresGuest: true },
];

interface CommandPaletteProps { isOpen: boolean; onClose: () => void; }

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = commands.filter((cmd) => {
    if (cmd.requiresAuth && !isAuthenticated) return false;
    if (cmd.requiresGuest && isAuthenticated) return false;
    if (!query) return true;
    return cmd.label.toLowerCase().includes(query.toLowerCase());
  });

  useEffect(() => {
    if (isOpen) { setQuery(''); setActiveIndex(0); setTimeout(() => inputRef.current?.focus(), 50); }
  }, [isOpen]);
  useEffect(() => setActiveIndex(0), [query]);

  const execute = (action: string) => { navigate(action); onClose(); };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex((i) => Math.min(i + 1, filtered.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex((i) => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter' && filtered[activeIndex]) execute(filtered[activeIndex].action);
    else if (e.key === 'Escape') onClose();
  };

  const grouped = filtered.reduce((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = [];
    acc[cmd.category].push(cmd);
    return acc;
  }, {} as Record<string, typeof filtered>);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[20vh] px-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }} transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="relative w-full max-w-lg bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-700 shadow-2xl overflow-hidden"
            onKeyDown={handleKeyDown}
          >
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 dark:border-navy-800">
              <Search size={18} className="text-slate-400 shrink-0" />
              <input ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)}
                placeholder="Search commands, pages..." className="flex-1 text-sm bg-transparent outline-none text-slate-900 dark:text-white placeholder:text-slate-400" />
              <kbd className="px-1.5 py-0.5 text-xs text-slate-400 border border-slate-200 dark:border-navy-700 rounded font-mono">ESC</kbd>
            </div>
            <div className="max-h-72 overflow-y-auto py-2">
              {filtered.length === 0 ? (
                <p className="text-center text-sm text-slate-400 py-8">No commands found</p>
              ) : (
                Object.entries(grouped).map(([category, items]) => (
                  <div key={category}>
                    <p className="px-4 py-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{category}</p>
                    {items.map((cmd) => {
                      const gi = filtered.indexOf(cmd);
                      return (
                        <button key={cmd.id} onClick={() => execute(cmd.action)}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left ${gi === activeIndex ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-navy-800'}`}>
                          <span className={gi === activeIndex ? 'text-indigo-500' : 'text-slate-400'}>{cmd.icon}</span>
                          <span className="flex-1">{cmd.label}</span>
                          {gi === activeIndex && <ArrowRight size={14} className="text-indigo-400" />}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>
            <div className="px-4 py-2 border-t border-slate-100 dark:border-navy-800 flex items-center gap-4">
              {[['↑↓', 'navigate'], ['↵', 'open'], ['esc', 'close']].map(([key, label]) => (
                <span key={label} className="flex items-center gap-1 text-xs text-slate-400">
                  <kbd className="px-1 py-0.5 bg-slate-100 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded font-mono text-xs">{key}</kbd>
                  {label}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
