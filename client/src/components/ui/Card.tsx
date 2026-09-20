import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
  onClick?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function Card({ children, className = '', hover = false, gradient = false, onClick, padding = 'md' }: CardProps) {
  const Tag = onClick || hover ? motion.div : 'div';
  const motionProps = (onClick || hover) ? {
    whileHover: { y: -2, boxShadow: '0 12px 40px -8px rgba(0,0,0,0.2)' },
    transition: { type: 'spring', stiffness: 300, damping: 25 },
  } : {};

  return (
    <Tag
      {...motionProps}
      onClick={onClick}
      className={`
        rounded-2xl border
        bg-white dark:bg-navy-900/80
        border-slate-200/60 dark:border-navy-700/60
        shadow-card
        ${hover || onClick ? 'cursor-pointer hover:border-indigo-300/60 dark:hover:border-indigo-600/50 hover:shadow-card-hover' : ''}
        ${gradient ? 'bg-gradient-to-br from-white to-slate-50/50 dark:from-navy-900/80 dark:to-navy-800/40' : ''}
        ${paddingClasses[padding]}
        transition-all duration-300
        ${className}
      `}
    >
      {children}
    </Tag>
  );
}
