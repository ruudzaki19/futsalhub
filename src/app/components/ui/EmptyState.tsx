// src/app/components/ui/EmptyState.tsx
import React from 'react';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="py-12 px-6 text-center space-y-3 rounded-2xl border-[1.5px] border-dashed border-[#E3E7EF] dark:border-[#1E263D] bg-stone-50/50 dark:bg-stone-900/20">
      {icon && (
        <div className="w-12 h-12 rounded-xl bg-white dark:bg-[#13192B] border-[1.5px] border-[#E3E7EF] dark:border-[#1E263D] text-[#0B1B3F] dark:text-[#B8F03C] flex items-center justify-center mx-auto shadow-xs">
          {icon}
        </div>
      )}
      <div className="space-y-1">
        <h4 className="text-sm font-black text-[#0E1220] dark:text-[#F3F4F6]">
          {title}
        </h4>
        <p className="text-xs text-[#5B6478] dark:text-[#94A3B8] max-w-sm mx-auto leading-relaxed">
          {description}
        </p>
      </div>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}
