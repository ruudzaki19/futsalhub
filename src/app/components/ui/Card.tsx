// src/app/components/ui/Card.tsx
import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  shadowHard?: 'navy' | 'blue' | 'lime' | 'none';
  hoverLift?: boolean;
  children: React.ReactNode;
}

export default function Card({
  shadowHard = 'none',
  hoverLift = false,
  className = '',
  children,
  ...props
}: CardProps) {
  const shadowClasses = {
    navy: 'shadow-hard-navy',
    blue: 'shadow-hard-blue',
    lime: 'shadow-hard-lime',
    none: '',
  };

  const liftClass = hoverLift ? 'hover:-translate-y-1 transition-transform duration-200' : '';

  return (
    <div
      className={`bg-white dark:bg-[#13192B] border-[1.5px] border-[#E3E7EF] dark:border-[#1E263D] rounded-xl p-6 transition-colors ${shadowClasses[shadowHard]} ${liftClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
