// src/app/components/ui/Badge.tsx
import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'lime' | 'blue' | 'navy' | 'success' | 'warning' | 'danger' | 'neutral';
  size?: 'sm' | 'md';
  children: React.ReactNode;
}

export default function Badge({
  variant = 'neutral',
  size = 'md',
  className = '',
  children,
  ...props
}: BadgeProps) {
  const base = "inline-flex items-center gap-1.5 font-bold uppercase tracking-wider rounded-lg border-[1.5px] select-none";

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-3 py-1 text-[11px]",
  };

  const variantClasses = {
    lime: "bg-[#B8F03C] text-[#0B1B3F] border-[#0B1B3F]",
    blue: "bg-[#1456D6] text-white border-[#1456D6]",
    navy: "bg-[#0B1B3F] text-white border-[#0B1B3F]",
    success: "bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
    warning: "bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",
    danger: "bg-red-50 text-red-800 border-red-300 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800",
    neutral: "bg-stone-100 text-stone-700 border-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700",
  };

  return (
    <span
      className={`${base} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
