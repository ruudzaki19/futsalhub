// src/app/components/ui/Input.tsx
'use client';

import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

export default function Input({
  label,
  error,
  leftIcon,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-bold text-[#0E1220] dark:text-[#F3F4F6] uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3.5 text-stone-400 pointer-events-none flex items-center justify-center">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          className={`w-full py-2.5 px-4 ${leftIcon ? 'pl-10' : 'pl-4'} bg-white dark:bg-[#13192B] border-[1.5px] ${
            error 
              ? 'border-red-500 focus:ring-2 focus:ring-red-500/20' 
              : 'border-[#E3E7EF] dark:border-[#1E263D] focus:border-[#1456D6] focus:ring-2 focus:ring-[#1456D6]/20'
          } rounded-xl text-sm text-[#0E1220] dark:text-[#F3F4F6] placeholder:text-stone-400 focus:outline-none transition-all ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-[11px] font-bold text-red-600 dark:text-red-400 pt-0.5">
          {error}
        </p>
      )}
    </div>
  );
}
