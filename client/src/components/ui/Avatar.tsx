import React from 'react';

interface AvatarProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  level?: number;
}

const sizeMap = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-base',
  xl: 'w-20 h-20 text-xl',
  '2xl': 'w-28 h-28 text-2xl',
};

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
}

export function Avatar({ src, alt, size = 'md', className = '', level }: AvatarProps) {
  return (
    <div className={`relative inline-block shrink-0 ${className}`}>
      <div
        className={`
          ${sizeMap[size]} rounded-full overflow-hidden
          ring-2 ring-indigo-500/20 dark:ring-indigo-400/20
          bg-gradient-to-br from-indigo-400 to-violet-500
          flex items-center justify-center
          font-semibold text-white
        `}
      >
        {src ? (
          <img src={src} alt={alt} className="w-full h-full object-cover" />
        ) : (
          <span>{getInitials(alt)}</span>
        )}
      </div>
      {level !== undefined && (
        <div
          className="absolute -bottom-1 -right-1 bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white dark:border-navy-900 shadow"
        >
          {level}
        </div>
      )}
    </div>
  );
}
