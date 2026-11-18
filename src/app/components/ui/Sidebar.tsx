// src/app/components/ui/Sidebar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import FutsalEmblem from '../FutsalEmblem';

export interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  badge?: string | number;
}

export interface SidebarProps {
  title: string;
  roleBadge: string;
  items: SidebarItem[];
  footerAction?: React.ReactNode;
}

export default function Sidebar({
  title,
  roleBadge,
  items,
  footerAction,
}: SidebarProps) {
  return (
    <aside className="w-64 shrink-0 bg-[#0B1B3F] text-white flex flex-col justify-between border-r-[1.5px] border-[#0E1220] min-h-screen">
      <div className="p-6 space-y-8">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1456D6] flex items-center justify-center text-[#B8F03C] shadow-hard-lime">
            <FutsalEmblem className="w-6 h-6 text-[#B8F03C]" />
          </div>
          <div>
            <span className="font-condensed text-2xl tracking-wider block leading-none font-bold">
              FUTSALHUB
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#B8F03C]">
              {roleBadge}
            </span>
          </div>
        </div>

        {/* Section title */}
        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold block">
            {title}
          </span>
          <nav className="space-y-1.5 pt-2">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={item.onClick}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  item.active
                    ? 'bg-[#B8F03C] text-[#0B1B3F] shadow-hard-navy font-black'
                    : 'text-stone-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="shrink-0">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                    item.active ? 'bg-[#0B1B3F] text-white' : 'bg-white/10 text-stone-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {footerAction && (
        <div className="p-6 border-t border-white/10">
          {footerAction}
        </div>
      )}
    </aside>
  );
}
