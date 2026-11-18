// src/app/components/ui/Button.tsx
'use client';

import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'dark' | 'blue' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  shadowHard?: boolean;
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  shadowHard = false,
  className = '',
  disabled,
  children,
  ...props
}: ButtonProps) {
  const base = "inline-flex items-center justify-center gap-2 font-bold transition-all duration-150 rounded-xl cursor-pointer select-none active:translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none";

  const sizeClasses = {
    sm: "px-3.5 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3.5 text-base",
  };

  const variantClasses = {
    primary: "bg-[#B8F03C] text-[#0B1B3F] hover:bg-[#A6DE2E] border-[1.5px] border-[#0B1B3F]",
    dark: "bg-[#0B1B3F] text-white hover:bg-[#0E1220] border-[1.5px] border-[#0B1B3F]",
    blue: "bg-[#1456D6] text-white hover:bg-[#0F45B0] border-[1.5px] border-[#1456D6]",
    outline: "bg-transparent border-[1.5px] border-[#E3E7EF] dark:border-[#1E263D] text-[#0E1220] dark:text-[#F3F4F6] hover:bg-stone-100 dark:hover:bg-stone-800/60",
    ghost: "bg-transparent text-[#0E1220] dark:text-[#F3F4F6] hover:bg-stone-100 dark:hover:bg-stone-800/60",
    danger: "bg-[#EF4444] text-white hover:bg-[#DC2626] border-[1.5px] border-[#DC2626]",
  };

  const shadowClass = shadowHard 
    ? (variant === 'primary' || variant === 'blue' || variant === 'outline' ? 'shadow-hard-navy hover:-translate-y-0.5' : 'shadow-hard-lime hover:-translate-y-0.5')
    : 'hover:-translate-y-0.5';

  return (
    <button
      className={`${base} ${sizeClasses[size]} ${variantClasses[variant]} ${shadowClass} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Memproses...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
