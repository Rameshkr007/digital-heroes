import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Star, Moon, Sun, ChevronRight, LogOut, LayoutDashboard, User, Zap } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/explore', label: 'Explore' },
  { href: '/heroes', label: 'Heroes' },
  { href: '/achievements', label: 'Achievements' },
  { href: '/about', label: 'About' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { resolvedTheme, setTheme } = useThemeStore();
  const { isAuthenticated, user, logout } = useAuthStore();

  useEffect(() => {
    const fn = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setIsMobileOpen(false); setUserMenuOpen(false); }, [location.pathname]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }} animate={{ y: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-white/90 dark:bg-navy-950/90 backdrop-blur-xl border-b border-slate-200/60 dark:border-navy-800/60 shadow-nav py-3' : 'bg-transparent py-5'}`}
        role="navigation" aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5 group focus-ring rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-glow-sm group-hover:shadow-glow-indigo transition-shadow duration-300">
                <Star size={16} className="text-white" fill="white" />
              </div>
              <span className="font-display font-bold text-slate-900 dark:text-white text-lg tracking-tight">
                Digital<span className="gradient-text">Heroes</span>
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.href;
                return (
                  <Link key={link.href} to={link.href}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 focus-ring ${isActive ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-navy-800/60'}`}
                    aria-current={isActive ? 'page' : undefined}>
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-800 hover:text-slate-700 dark:hover:text-slate-200 transition-all duration-200 focus-ring"
                aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}>
                <AnimatePresence mode="wait">
                  <motion.div key={resolvedTheme} initial={{ rotate: -30, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 30, opacity: 0 }} transition={{ duration: 0.2 }}>
                    {resolvedTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                  </motion.div>
                </AnimatePresence>
              </button>

              <button
                onClick={() => { const e = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }); document.dispatchEvent(e); }}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-navy-700 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors"
                aria-label="Open command palette"
              >
                <Zap size={12} />
                <span>⌘K</span>
              </button>

              {isAuthenticated && user ? (
                <div className="relative">
                  <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors focus-ring"
                    aria-expanded={userMenuOpen} aria-haspopup="menu">
                    <Avatar src={user.profile?.avatarUrl} alt={user.profile?.displayName || user.username} size="sm" level={user.profile?.level} />
                    <span className="hidden sm:block text-sm font-medium text-slate-700 dark:text-slate-300">{user.profile?.displayName || user.username}</span>
                  </button>
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }} transition={{ duration: 0.15 }}
                        className="absolute right-0 top-12 w-48 bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-2xl shadow-card-hover py-2 z-50" role="menu">
                        <button onClick={() => { navigate('/dashboard'); setUserMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-navy-800 transition-colors" role="menuitem">
                          <LayoutDashboard size={15} /> Dashboard
                        </button>
                        <button onClick={() => { navigate(`/heroes/${user.username}`); setUserMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-navy-800 transition-colors" role="menuitem">
                          <User size={15} /> My Profile
                        </button>
                        <div className="h-px bg-slate-100 dark:bg-navy-800 my-1" />
                        <button onClick={() => { logout(); setUserMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors" role="menuitem">
                          <LogOut size={15} /> Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Sign In</Button>
                  <Button size="sm" onClick={() => navigate('/register')} rightIcon={<ChevronRight size={14} />}>Join Heroes</Button>
                </div>
              )}

              <button onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors focus-ring"
                aria-label="Toggle mobile menu" aria-expanded={isMobileOpen}>
                <AnimatePresence mode="wait">
                  <motion.div key={isMobileOpen ? 'x' : 'menu'} initial={{ rotate: -30, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 30, opacity: 0 }} transition={{ duration: 0.2 }}>
                    {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
                  </motion.div>
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-x-0 top-0 z-30 pt-20 pb-6 px-4 bg-white/95 dark:bg-navy-950/95 backdrop-blur-xl border-b border-slate-200 dark:border-navy-800 shadow-xl">
            <nav className="flex flex-col gap-1 mb-6">
              {navLinks.map((link, i) => {
                const isActive = location.pathname === link.href;
                return (
                  <motion.div key={link.href} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                    <Link to={link.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors ${isActive ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-navy-800'}`}>
                      <ChevronRight size={14} className={isActive ? 'opacity-100' : 'opacity-0'} />
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>
            {!isAuthenticated && (
              <div className="flex gap-2">
                <Button variant="secondary" className="flex-1" onClick={() => navigate('/login')}>Sign In</Button>
                <Button className="flex-1" onClick={() => navigate('/register')}>Join Heroes</Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
