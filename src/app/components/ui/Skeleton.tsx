// src/app/components/ui/Skeleton.tsx
import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function Skeleton({ className = '', ...props }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-stone-200 dark:bg-stone-800 rounded-lg ${className}`}
      {...props}
    />
  );
}
