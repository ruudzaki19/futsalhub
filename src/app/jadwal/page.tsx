// src/app/jadwal/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ChevronRight, CheckCircle2, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { formatRupiah } from '../../data/bookingStore';

interface LapanganCardInfo {
  id: number;
  nama: string;
  lokasi: string;
  rating: number;
  kategori: string;
  hargaCoret: number;
  hargaMulai: number;
  imageUrl: string;
  deskripsi: string;
}

const DAFTAR_LAPANGAN: LapanganCardInfo[] = [
  {
    id: 1,
    nama: 'Lapangan 1',
    lokasi: 'Kota Tangerang Selatan',
    rating: 5.0,
    kategori: 'Futsal',
    hargaCoret: 200000,
    hargaMulai: 150000,
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=80',
    deskripsi: 'Lantai interlock turnamen standar internasional, pencahayaan LED daylight 800 lux bebas silau.',
  },
  {
    id: 2,
    nama: 'Lapangan 2',
    lokasi: 'Kota Tangerang Selatan',
    rating: 4.95,
    kategori: 'Futsal',
    hargaCoret: 200000,
    hargaMulai: 150000,
    imageUrl: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800&auto=format&fit=crop&q=80',
    deskripsi: 'Lantai interlock turnamen peredam kejut maksimal, gawang ukuran standar nasional & jaring pengaman rapat.',
  },
  {
    id: 3,
    nama: 'Lapangan 3',
    lokasi: 'Kota Tangerang Selatan',
    rating: 4.98,
    kategori: 'Futsal',
    hargaCoret: 200000,
    hargaMulai: 150000,
    imageUrl: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&auto=format&fit=crop&q=80',
    deskripsi: 'Lantai interlock turnamen grip optimal, sirkulasi udara indoor sejuk dilengkapi bench pemain representatif.',
  },
];

export default function JadwalPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#121417] text-stone-900 dark:text-[#F3F4F6] font-sans selection:bg-emerald-200 dark:selection:bg-emerald-900 flex flex-col justify-between transition-colors">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10 flex-1 space-y-10 w-full">
        
        {/* Header (Sesuai Gambar 4 Referensi) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200 dark:border-white/10">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
              Pilih Lapangan
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
              Klik salah satu lapangan di bawah untuk membuka halaman jadwal dan mengecek ketersediaan jam bermain
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 self-start sm:self-auto">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>3 Lapangan Siap Pakai</span>
          </div>
        </div>

        {/* 3 Kartu Lapangan (Persis Layout Gambar 4 dengan Tema Hijau) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {DAFTAR_LAPANGAN.map((lap) => (
            <Link
              key={lap.id}
              href={`/jadwal/${lap.id}`}
              className="group rounded-3xl bg-white dark:bg-[#1A1D23] border border-stone-200 dark:border-stone-800 hover:border-emerald-600 dark:hover:border-emerald-500 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Gambar Lapangan */}
                <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-stone-100 dark:bg-stone-900">
                  <Image
                    src={lap.imageUrl}
                    alt={lap.nama}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                  <div className="absolute top-3.5 left-3.5">
                    <span className="px-2.5 py-1 rounded-md bg-white/95 dark:bg-stone-900/90 text-[11px] font-bold text-stone-700 dark:text-stone-300 shadow-xs backdrop-blur-xs">
                      Venue
                    </span>
                  </div>
                </div>

                {/* Konten Detail Lapangan */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-stone-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {lap.nama}
                    </h2>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40">
                      Standard Turnamen
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-400">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span className="font-bold text-stone-800 dark:text-stone-200">{lap.rating.toFixed(2)}</span>
                    <span className="text-stone-400">•</span>
                    <span>{lap.lokasi}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
                    <span>⚽</span>
                    <span>{lap.kategori} Interlock Standard</span>
                  </div>

                  <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed pt-1 line-clamp-2">
                    {lap.deskripsi}
                  </p>
                </div>
              </div>

              {/* Harga & Tombol Aksi */}
              <div className="p-6 pt-0 border-t border-stone-100 dark:border-stone-800/80 mt-2">
                <div className="pt-4 flex items-center justify-between">
                  <div>
                    <span className="line-through text-xs text-stone-400 block">
                      {formatRupiah(lap.hargaCoret)}
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs text-stone-500 dark:text-stone-400">Mulai</span>
                      <span className="text-lg font-black text-stone-900 dark:text-white">
                        {formatRupiah(lap.hargaMulai)}
                      </span>
                      <span className="text-xs text-stone-500 dark:text-stone-400">/sesi</span>
                    </div>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-800 group-hover:bg-emerald-600 group-hover:text-white text-stone-700 dark:text-stone-300 flex items-center justify-center transition-all shadow-xs">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </div>

            </Link>
          ))}
        </div>

      </main>

      <Footer />
    </div>
  );
}
