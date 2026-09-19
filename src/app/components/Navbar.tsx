// src/app/components/Navbar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import FutsalEmblem from './FutsalEmblem';

interface NavbarProps {
  onLogoClick?: () => void;
}

export default function Navbar({ onLogoClick }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-stone-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Tombol Logo: Menjalankan Splash Screen lalu ke Beranda */}
        <button
          type="button"
          onClick={onLogoClick}
          className="flex items-center gap-3 group text-left cursor-pointer focus:outline-none"
        >
          <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-100 group-hover:bg-emerald-100 transition-colors">
            <FutsalEmblem className="w-7 h-7 text-emerald-700" />
          </div>
          <div>
            <span className="font-black text-xl tracking-tight text-[#0F291E] block leading-none">
              FUTSALHUB
            </span>
            <span className="text-[10px] tracking-widest text-emerald-800 font-semibold uppercase">
              Arena System
            </span>
          </div>
        </button>

        {/* Menu Navigasi (Tombol Home Biasa Tanpa Splashscreen) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
          <Link href="/" className="text-emerald-900 font-bold hover:text-emerald-950 transition-colors">
            Home
          </Link>
          <Link href="/jadwal" className="hover:text-emerald-900 transition-colors">
            Jadwal Lapangan
          </Link>
          <Link href="/fasilitas" className="hover:text-emerald-900 transition-colors">
            Fasilitas & Tarif
          </Link>
          <Link href="/tentang" className="hover:text-emerald-900 transition-colors">
            Tentang Kami
          </Link>
        </nav>

        {/* Tombol Masuk & Booking */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-5 py-2.5 text-sm font-semibold text-emerald-950 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-all shadow-sm"
          >
            Masuk Akun
          </Link>
          <Link
            href="/jadwal"
            className="hidden sm:inline-flex px-5 py-2.5 text-sm font-semibold text-[#FDFBF7] bg-[#144734] hover:bg-[#0E3526] rounded-lg transition-all shadow-sm"
          >
            Booking Lapangan
          </Link>
        </div>

      </div>
    </header>
  );
}