// src/app/fasilitas/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { Check, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function FasilitasPage() {
  const lapangans = [
    {
      nama: 'Lapangan 1',
      tipe: 'Standar Turnamen Resmi',
      tarifSiang: 'Rp 150.000',
      tarifMalam: 'Rp 170.000',
      fitur: [
        'Lantai Vinyl Interlock resmi',
        'Penerangan LED 800 Lux anti-silau',
        'Papan skor digital & tribun penonton',
        'Ukuran regulasi resmi 26 × 16 meter'
      ]
    },
    {
      nama: 'Lapangan 2',
      tipe: 'Standar Turnamen Resmi',
      tarifSiang: 'Rp 150.000',
      tarifMalam: 'Rp 170.000',
      fitur: [
        'Lantai Vinyl Interlock resmi',
        'Penerangan LED 800 Lux anti-silau',
        'Papan skor digital & tribun penonton',
        'Ukuran regulasi resmi 26 × 16 meter'
      ]
    },
    {
      nama: 'Lapangan 3',
      tipe: 'Standar Turnamen Resmi',
      tarifSiang: 'Rp 150.000',
      tarifMalam: 'Rp 170.000',
      fitur: [
        'Lantai Vinyl Interlock resmi',
        'Penerangan LED 800 Lux anti-silau',
        'Papan skor digital & tribun penonton',
        'Ukuran regulasi resmi 26 × 16 meter'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#121417] text-stone-900 dark:text-[#F3F4F6] font-sans selection:bg-emerald-200 dark:selection:bg-emerald-900 flex flex-col justify-between transition-colors">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-12 flex-1 space-y-12 w-full">
        <div className="border-b border-stone-200 dark:border-white/10 pb-6 space-y-2">
          <span className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
            Spesifikasi & Harga Sewa Arena
          </span>
          <h1 className="text-3xl font-black text-stone-900 dark:text-white">
            Fasilitas 3 Lapangan & Struktur Tarif
          </h1>
          <p className="text-sm text-stone-600 dark:text-stone-400">
            Seluruh 3 lapangan memiliki spesifikasi material lantai vinyl interlock dan ukuran resmi yang seragam.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {lapangans.map((lap, i) => (
            <div key={i} className="bg-white dark:bg-[#1A1D23] border border-stone-200 dark:border-stone-700/80 rounded-3xl p-7 space-y-6 shadow-sm">
              <div>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">{lap.tipe}</span>
                <h2 className="text-2xl font-bold text-stone-900 dark:text-white mt-1">{lap.nama}</h2>
              </div>

              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800">
                <div>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400 block">Siang (08-17)</span>
                  <span className="text-base font-black text-stone-900 dark:text-white">{lap.tarifSiang}</span>
                  <span className="text-[10px] text-stone-400">/ jam</span>
                </div>
                <div>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400 block">Malam (17-23)</span>
                  <span className="text-base font-black text-emerald-700 dark:text-emerald-400">{lap.tarifMalam}</span>
                  <span className="text-[10px] text-stone-400">/ jam</span>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-bold text-stone-900 dark:text-white uppercase tracking-wider">Fasilitas Lapangan:</span>
                <ul className="space-y-2 text-xs text-stone-600 dark:text-stone-300">
                  {lap.fitur.map((f, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href={`/jadwal?lapangan=${i + 1}`}
                className="w-full py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-white dark:hover:bg-stone-200 text-white dark:text-stone-900 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Lihat Jadwal {lap.nama}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
