import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export function Skeleton({ className = '', variant = 'rectangular', width, height, lines = 1 }: SkeletonProps) {
  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  const baseClasses = `shimmer bg-slate-200 dark:bg-navy-800 ${variant === 'circular' ? 'rounded-full' : variant === 'text' ? 'rounded-md' : 'rounded-xl'}`;

  if (lines > 1) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`${baseClasses} ${className}`}
            style={{ ...style, width: i === lines - 1 && lines > 1 ? '70%' : style.width }}
          />
        ))}
      </div>
    );
  }

  return <div className={`${baseClasses} ${className}`} style={style} />;
}

export function HeroCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-900/80 p-6 space-y-4">
      <div className="flex items-start gap-4">
        <Skeleton variant="circular" width={56} height={56} />
        <div className="flex-1 space-y-2">
          <Skeleton height={20} className="w-3/4" />
          <Skeleton height={14} className="w-1/2" />
        </div>
      </div>
      <Skeleton height={14} lines={2} />
      <div className="flex gap-2">
        <Skeleton height={24} width={60} />
        <Skeleton height={24} width={70} />
        <Skeleton height={24} width={50} />
      </div>
    </div>
  );
}
