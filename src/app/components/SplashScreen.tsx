// src/app/components/SplashScreen.tsx
'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FutsalEmblem from './FutsalEmblem';

interface SplashScreenProps {
  isOpen: boolean;
  onFinish: () => void;
}

export default function SplashScreen({ isOpen, onFinish }: SplashScreenProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onFinish();
      }, 1900);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onFinish]);

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          key="splash-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0B1B3F] text-white"
        >
          {/* Logo Bola Futsal */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="mb-4"
          >
            <div className="w-20 h-20 rounded-2xl bg-[#1456D6] flex items-center justify-center shadow-hard-lime">
              <FutsalEmblem className="w-12 h-12 text-[#B8F03C]" />
            </div>
          </motion.div>

          {/* Teks Brand FUTSALHUB */}
          <motion.div
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center space-y-1.5"
          >
            <h1 className="font-condensed text-4xl sm:text-5xl tracking-wider text-white font-bold leading-none">
              FUTSALHUB
            </h1>
            <p className="text-[11px] font-bold tracking-[0.25em] text-[#B8F03C] uppercase">
              Arena System • Standar Turnamen
            </p>
          </motion.div>

          {/* Progress Bar Sporty */}
          <div className="w-48 h-1.5 bg-white/10 rounded-full mt-8 overflow-hidden">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              className="h-full bg-[#B8F03C]"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
