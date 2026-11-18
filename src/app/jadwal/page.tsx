// src/app/jadwal/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ChevronRight, CheckCircle2, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
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
    kategori: 'Vinyl Interlock',
    hargaCoret: 200000,
    hargaMulai: 150000,
    imageUrl: '/images/lapangan-1.jpg',
    deskripsi: 'Lantai interlock vinyl resmi turnamen standar FIFA, peredaman hentakan tinggi, dan pencahayaan LED 800 lux anti-silau.',
  },
  {
    id: 2,
    nama: 'Lapangan 2',
    lokasi: 'Kota Tangerang Selatan',
    rating: 4.95,
    kategori: 'Taraflex Pro',
    hargaCoret: 200000,
    hargaMulai: 140000,
    imageUrl: '/images/lapangan-2.jpg',
    deskripsi: 'Lantai Taraflex empuk standar liga internasional dengan traksi maksimal untuk kecepatan dan kelincahan tim.',
  },
  {
    id: 3,
    nama: 'Lapangan 3',
    lokasi: 'Kota Tangerang Selatan',
    rating: 4.98,
    kategori: 'Polypropylene',
    hargaCoret: 200000,
    hargaMulai: 160000,
    imageUrl: '/images/lapangan-3.jpg',
    deskripsi: 'Ubin interlocking polypropylene anti-selip dengan pantulan bola akurat, dilengkapi sirkulasi indoor sejuk & bench representatif.',
  },
];

export default function JadwalPage() {
  return (
    <div className="min-h-screen bg-brand-bg dark:bg-brand-ink text-brand-ink dark:text-stone-100 font-sora selection:bg-brand-lime selection:text-brand-navy flex flex-col justify-between transition-colors">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10 flex-1 space-y-10 w-full">
        
        {/* Section Marker Label */}
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-brand-navy dark:bg-brand-lime text-brand-lime dark:text-brand-navy flex items-center justify-center font-bebas text-base font-bold shadow-sm">
            B
          </span>
          <span className="font-bebas text-xl md:text-2xl tracking-wider text-brand-ink dark:text-white uppercase">
            Kalender Jadwal Lapangan
          </span>
          <div className="h-[1.5px] flex-1 bg-brand-line dark:bg-white/10" />
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-[1.5px] border-brand-line dark:border-white/10">
          <div className="space-y-1">
            <h1 className="font-bebas text-4xl sm:text-5xl text-brand-ink dark:text-white uppercase tracking-tight leading-none">
              PILIH LAPANGAN TURNAMEN
            </h1>
            <p className="font-sora text-xs sm:text-sm text-brand-dim dark:text-stone-400">
              Pilih salah satu lapangan di bawah untuk membuka grid 16 jam slot bermain, durasi fleksibel, dan kunci slot otomatis.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Badge variant="lime" size="md">
              <span className="w-2 h-2 rounded-full bg-brand-navy dark:bg-brand-ink animate-ping" />
              <span>3 Lapangan Aktif 16 Jam</span>
            </Badge>
          </div>
        </div>

        {/* 3 Kartu Lapangan */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {DAFTAR_LAPANGAN.map((lap) => (
            <Link
              key={lap.id}
              href={`/jadwal/${lap.id}`}
              className="group rounded-2xl bg-white dark:bg-brand-navy/30 border-[1.5px] border-brand-line dark:border-white/10 hover:border-brand-navy dark:hover:border-brand-lime overflow-hidden shadow-sm hover:shadow-hard-navy transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Gambar Lapangan */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-brand-navy">
                  <Image
                    src={lap.imageUrl}
                    alt={lap.nama}
                    fill
                    className="object-cover group-hover:scale-103 transition-transform duration-500"
                  />
                  <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                    <Badge variant="navy">Venue #{lap.id}</Badge>
                    <Badge variant="lime">{lap.kategori}</Badge>
                  </div>
                  <div className="absolute bottom-3.5 right-3.5 px-2.5 py-1 rounded-lg bg-black/80 text-white text-xs font-bold flex items-center gap-1 backdrop-blur-sm">
                    <Star className="w-3.5 h-3.5 fill-brand-lime text-brand-lime" />
                    <span>{lap.rating.toFixed(2)}</span>
                  </div>
                </div>

                {/* Konten Detail Lapangan */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="font-bebas text-2xl text-brand-ink dark:text-white uppercase group-hover:text-brand-blue dark:group-hover:text-brand-lime transition-colors">
                      {lap.nama} • {lap.kategori}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-brand-dim dark:text-stone-400">
                    <span className="font-mono text-brand-blue font-bold">16 Jam Slot</span>
                    <span>•</span>
                    <span>{lap.lokasi}</span>
                  </div>

                  <p className="font-sora text-xs text-brand-dim dark:text-stone-400 leading-relaxed line-clamp-2">
                    {lap.deskripsi}
                  </p>
                </div>
              </div>

              {/* Harga & Tombol Aksi */}
              <div className="p-6 pt-0 border-t border-brand-line dark:border-white/10 mt-2">
                <div className="pt-4 flex items-center justify-between">
                  <div>
                    <span className="line-through text-xs text-brand-dim block font-mono">
                      {formatRupiah(lap.hargaCoret)}
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs text-brand-dim">Mulai</span>
                      <span className="font-bebas text-2xl text-brand-blue dark:text-brand-lime">
                        {formatRupiah(lap.hargaMulai)}
                      </span>
                      <span className="text-xs text-brand-dim">/jam</span>
                    </div>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-brand-navy text-brand-lime group-hover:bg-brand-lime group-hover:text-brand-navy flex items-center justify-center transition-all shadow-sm">
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
