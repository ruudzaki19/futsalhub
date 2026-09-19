// src/app/tentang/page.tsx
'use client';

import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function TentangPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-800 font-sans">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-16 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold tracking-widest text-emerald-800 uppercase">
            Latar Belakang Proyek
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0F291E] tracking-tight">
            Tentang Sistem FUTSALHUB
          </h1>
          <p className="text-stone-600 text-sm max-w-xl mx-auto">
            Sistem Informasi Operasional & Reservasi Lapangan Futsal Berbasis Web Terintegrasi.
          </p>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-8 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-stone-900 border-b border-stone-100 pb-3">
            Tujuan Pengembangan Sistem
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed">
            FUTSALHUB dirancang untuk mengatasi inefisiensi pencatatan manual dan pemesanan via obrolan instan. Melalui penerapan basis data terpusat, sistem ini mengeliminasi masalah *race condition* atau bentrok jadwal sewa (double booking), memvalidasi pembayaran melalui *audit trail*, dan memberikan transparansi pendapatan harian bagi pengelola.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 pt-4">
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
              <span className="block text-xs font-bold text-emerald-900 uppercase">Mata Kuliah</span>
              <span className="text-sm font-semibold text-stone-800">Analisis & Perancangan Sistem Informasi</span>
            </div>
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
              <span className="block text-xs font-bold text-emerald-900 uppercase">Institusi</span>
              <span className="text-sm font-semibold text-stone-800">Program Studi Sistem Informasi - FTD</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}