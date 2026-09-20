import React from 'react';
import { motion } from 'framer-motion';

export interface TabItem { id: string; label: string; icon?: React.ReactNode; count?: number; }

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
  variant?: 'default' | 'pills';
}

export function Tabs({ tabs, activeTab, onChange, className = '', variant = 'default' }: TabsProps) {
  if (variant === 'pills') {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => onChange(tab.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 focus-ring ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-glow-sm' : 'bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-navy-700'}`}>
            {tab.icon}{tab.label}
            {tab.count !== undefined && <span className={`text-xs rounded-full px-1.5 py-0.5 font-medium ${activeTab === tab.id ? 'bg-white/20' : 'bg-slate-200 dark:bg-navy-700'}`}>{tab.count}</span>}
          </button>
        ))}
      </div>
    );
  }
  return (
    <div className={`border-b border-slate-200 dark:border-navy-700 ${className}`}>
      <div className="flex gap-0 overflow-x-auto hide-scrollbar">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => onChange(tab.id)}
            className={`relative px-4 py-3 text-sm font-medium whitespace-nowrap flex items-center gap-2 transition-colors duration-200 focus-ring ${activeTab === tab.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}>
            {tab.icon}{tab.label}
            {tab.count !== undefined && <span className="text-xs bg-slate-100 dark:bg-navy-700 rounded-full px-1.5 py-0.5">{tab.count}</span>}
            {activeTab === tab.id && <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full" />}
          </button>
        ))}
      </div>
    </div>
  );
}
