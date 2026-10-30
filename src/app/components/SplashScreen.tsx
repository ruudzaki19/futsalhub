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
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0F291E]"
        >
          {/* Aksen Glow Hijau Lembut */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.35, 0.2] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute w-72 h-72 rounded-full bg-emerald-500 blur-3xl -z-10"
          />

          {/* Logo Bola Futsal */}
          <motion.div
            initial={{ scale: 0.6, rotate: -25, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 220, damping: 22 }}
            className="mb-4"
          >
            <FutsalEmblem className="w-20 h-20 text-emerald-400" />
          </motion.div>

          {/* Teks Brand */}
          <motion.h1
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="text-2xl font-black tracking-widest text-[#FDFBF7] uppercase"
          >
            FUTSALHUB
          </motion.h1>

          <motion.p
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="text-[11px] tracking-widest text-emerald-200/80 mt-1 uppercase"
          >
            Integrated Arena Booking System
          </motion.p>

          {/* Progress Bar Loading */}
          <div className="w-36 h-1 bg-emerald-950 rounded-full mt-6 overflow-hidden">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '0%' }}
              transition={{ duration: 1.6, ease: 'easeInOut' }}
              className="w-full h-full bg-gradient-to-r from-emerald-500 to-emerald-300"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
