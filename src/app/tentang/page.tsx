// src/app/tentang/page.tsx
'use client';

import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FutsalEmblem from '../components/FutsalEmblem';

export default function TentangPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#121417] text-stone-900 dark:text-[#F3F4F6] font-sans selection:bg-emerald-200 dark:selection:bg-emerald-900 flex flex-col justify-between transition-colors">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-14 flex-1 space-y-10 w-full">
        <div className="text-center space-y-4">
          <div className="inline-flex p-3 rounded-2xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
            <FutsalEmblem className="w-10 h-10 text-stone-800 dark:text-emerald-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-white">
            Tentang Sistem FUTSALHUB
          </h1>
          <p className="text-sm text-stone-600 dark:text-stone-400 max-w-xl mx-auto leading-relaxed">
            Platform operasional digital penyewaan 3 lapangan futsal terintegrasi untuk mengeliminasi konflik jadwal ganda dan manualisasi pembukuan kasir.
          </p>
        </div>

        <div className="bg-white dark:bg-[#1A1D23] border border-stone-200 dark:border-stone-700/80 rounded-3xl p-8 space-y-6 shadow-sm text-stone-700 dark:text-stone-300 text-sm leading-relaxed">
          <h2 className="text-lg font-bold text-stone-900 dark:text-white">Transparansi & Digitalisasi</h2>
          <p>
            Sistem Informasi Penyewaan Lapangan Futsal dirancang untuk mengatasi kelemahan operasional manual di mana catatan kertas dan verifikasi chat WhatsApp kerap menimbulkan tumpang tindih slot dan keterlambatan laporan.
          </p>
          <p>
            Melalui fitur penguncian otomatis 15 menit (Auto-Lock) dan antrean verifikasi kasir terpusat, pelanggan mendapatkan kepastian jam sewa secara real-time dan pemilik dapat memantau pendapatan harian tanpa distorsi data.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
