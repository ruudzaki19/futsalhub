// src/app/components/ui/Tabs.tsx
'use client';

import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
}

export interface TabsProps {
  tabs: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export default function Tabs({
  tabs,
  activeId,
  onChange,
  className = '',
}: TabsProps) {
  return (
    <div className={`flex items-center gap-1.5 overflow-x-auto pb-1 select-none ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 border-[1.5px] ${
              isActive
                ? 'bg-[#0B1B3F] text-white border-[#0B1B3F] shadow-hard-lime dark:bg-[#B8F03C] dark:text-[#0B1B3F] dark:border-[#B8F03C]'
                : 'bg-white dark:bg-[#13192B] text-stone-600 dark:text-stone-300 border-[#E3E7EF] dark:border-[#1E263D] hover:bg-stone-50 dark:hover:bg-stone-800'
            }`}
          >
            <span>{tab.label}</span>
            {typeof tab.count === 'number' && (
              <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-black ${
                isActive 
                  ? 'bg-[#B8F03C] text-[#0B1B3F] dark:bg-[#0B1B3F] dark:text-white' 
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-500'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
