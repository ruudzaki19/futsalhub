// src/app/components/FutsalEmblem.tsx
import React from 'react';

interface EmblemProps {
  className?: string;
}

export default function FutsalEmblem({ className = "w-8 h-8 text-emerald-700" }: EmblemProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Lingkaran Luar Bola Futsal */}
      <circle
        cx="24"
        cy="24"
        r="20"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="currentColor"
        fillOpacity="0.06"
      />
      {/* Poligon Panel Tengah Bola */}
      <polygon
        points="24,14 32,20 29,30 19,30 16,20"
        stroke="currentColor"
        strokeWidth="2.2"
        fill="currentColor"
        fillOpacity="0.25"
      />
      {/* Garis-Garis Sambungan Panel Futsal */}
      <line x1="24" y1="14" x2="24" y2="4" stroke="currentColor" strokeWidth="2.2" />
      <line x1="32" y1="20" x2="42" y2="17" stroke="currentColor" strokeWidth="2.2" />
      <line x1="29" y1="30" x2="36" y2="39" stroke="currentColor" strokeWidth="2.2" />
      <line x1="19" y1="30" x2="12" y2="39" stroke="currentColor" strokeWidth="2.2" />
      <line x1="16" y1="20" x2="6" y2="17" stroke="currentColor" strokeWidth="2.2" />
    </svg>
  );
}
