import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, LayoutDashboard, Target, Heart, Dices, User } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export function MobileNav() {
  const location = useLocation();
  const { user } = useAuthStore();

  const links = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/golf-coach', label: 'Coach', icon: Target },
    { href: '/impact-map', label: 'Impact', icon: Heart },
    { href: '/draw-engine', label: 'Draws', icon: Dices },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-navy-950/95 backdrop-blur-xl border-t border-slate-200/60 dark:border-navy-800/60 px-2 py-2 shadow-2xl">
      <div className="flex items-center justify-around">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.href;
          return (
            <Link
              key={link.href}
              to={link.href}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors ${isActive ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-400 dark:text-slate-500 hover:text-slate-200'}`}
            >
              <Icon size={20} />
              <span className="text-[10px]">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
