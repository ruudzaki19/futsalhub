// src/app/components/SplashScreen.tsx
'use client';

import React, { useState, useEffect } from 'react';
import FutsalEmblem from './FutsalEmblem';

interface SplashScreenProps {
  isOpen: boolean;
  onFinish: () => void;
}

export default function SplashScreen({ isOpen, onFinish }: SplashScreenProps) {
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsFading(false);
      const timer = setTimeout(() => {
        setIsFading(true);
        setTimeout(() => {
          onFinish();
        }, 400);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onFinish]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0F291E] transition-opacity duration-500 ease-out ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center animate-pulse">
        <FutsalEmblem className="w-20 h-20 text-emerald-400 mb-4" />
        <h1 className="text-2xl font-black tracking-widest text-[#FDFBF7] uppercase">
          FUTSALHUB
        </h1>
        <p className="text-[11px] tracking-widest text-emerald-200/80 mt-1 uppercase">
          Integrated Arena Booking System
        </p>

        <div className="w-36 h-1 bg-emerald-950 rounded-full mt-6 overflow-hidden">
          <div className="w-full h-full bg-emerald-400 animate-pulse" />
        </div>
      </div>
    </div>
  );
}