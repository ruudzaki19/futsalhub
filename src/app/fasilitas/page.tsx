// src/app/fasilitas/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Check, ArrowRight, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

export default function FasilitasPage() {
  const lapangans = [
    {
      id: 1,
      nama: 'Lapangan 1',
      tipe: 'Vinyl Interlock Resmi',
      image: '/images/lapangan-1.jpg',
      tarifSiang: 'Rp 150.000',
      tarifMalam: 'Rp 170.000',
      fitur: [
        'Lantai Vinyl Interlock standar FIFA',
        'Penerangan LED 800 Lux anti-silau',
        'Papan skor digital & tribun penonton',
        'Ukuran regulasi resmi 26 × 16 meter'
      ]
    },
    {
      id: 2,
      nama: 'Lapangan 2',
      tipe: 'Taraflex Pro Standard',
      image: '/images/lapangan-2.jpg',
      tarifSiang: 'Rp 140.000',
      tarifMalam: 'Rp 165.000',
      fitur: [
        'Lantai Taraflex empuk anti-cedera',
        'Penerangan LED 800 Lux anti-silau',
        'Gawang standar turnamen & jaring 6m',
        'Ukuran regulasi resmi 26 × 16 meter'
      ]
    },
    {
      id: 3,
      nama: 'Lapangan 3',
      tipe: 'Premium Polypropylene',
      image: '/images/lapangan-3.jpg',
      tarifSiang: 'Rp 160.000',
      tarifMalam: 'Rp 180.000',
      fitur: [
        'Ubin interlocking polypropylene anti-selip',
        'Penerangan LED 800 Lux anti-silau',
        'Sirkulasi indoor sejuk & bench representatif',
        'Ukuran regulasi resmi 26 × 16 meter'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-brand-bg dark:bg-brand-ink text-brand-ink dark:text-stone-100 font-sora selection:bg-brand-lime selection:text-brand-navy flex flex-col justify-between transition-colors">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10 flex-1 space-y-10 w-full">
        {/* Section Marker Label */}
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-brand-navy dark:bg-brand-lime text-brand-lime dark:text-brand-navy flex items-center justify-center font-bebas text-base font-bold shadow-sm">
            C
          </span>
          <span className="font-bebas text-xl md:text-2xl tracking-wider text-brand-ink dark:text-white uppercase">
            Spesifikasi & Struktur Tarif
          </span>
          <div className="h-[1.5px] flex-1 bg-brand-line dark:bg-white/10" />
        </div>

        <div className="border-b-[1.5px] border-brand-line dark:border-white/10 pb-6 space-y-2">
          <Badge variant="blue" size="md">Standar Turnamen Resmi FIFA</Badge>
          <h1 className="font-bebas text-4xl sm:text-5xl text-brand-ink dark:text-white uppercase tracking-tight leading-none">
            FASILITAS 3 LAPANGAN & STRUKTUR TARIF
          </h1>
          <p className="font-sora text-sm text-brand-dim dark:text-stone-400 max-w-2xl">
            Seluruh lapangan dilengkapi lantai interlock resmi, penerangan stadion 800 Lux daylight, ruang bilas shower air bersih, dan loker tim.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {lapangans.map((lap, i) => (
            <div key={i} className="bg-white dark:bg-brand-navy/30 border-[1.5px] border-brand-line dark:border-white/10 rounded-2xl p-6 space-y-6 shadow-sm hover:shadow-hard-navy hover:border-brand-navy transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-brand-navy">
                  <Image
                    src={lap.image}
                    alt={lap.nama}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <Badge variant="navy">Venue #{lap.id}</Badge>
                    <Badge variant="lime">{lap.tipe}</Badge>
                  </div>
                </div>

                <div>
                  <h2 className="font-bebas text-2xl text-brand-ink dark:text-white uppercase">{lap.nama}</h2>
                  <span className="font-sora text-xs text-brand-dim dark:text-stone-400 font-semibold">{lap.tipe}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-brand-bg dark:bg-brand-navy/60 border-[1.5px] border-brand-line dark:border-white/10">
                  <div>
                    <span className="text-[11px] text-brand-dim block font-bold">Siang (08:00 - 15:00)</span>
                    <span className="font-bebas text-2xl text-brand-blue dark:text-brand-lime leading-tight block">{lap.tarifSiang}</span>
                    <span className="text-[10px] text-brand-dim font-mono">/ jam</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-brand-dim block font-bold">Malam (15:00 - 00:00)</span>
                    <span className="font-bebas text-2xl text-brand-navy dark:text-white leading-tight block">{lap.tarifMalam}</span>
                    <span className="text-[10px] text-brand-dim font-mono">/ jam</span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <span className="text-xs font-bold text-brand-ink dark:text-white uppercase tracking-wider block">
                    Fasilitas Unggulan:
                  </span>
                  <ul className="space-y-2 text-xs text-stone-600 dark:text-stone-300">
                    {lap.fitur.map((f, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 dark:text-brand-lime shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-brand-line dark:border-white/10">
                <Link href={`/jadwal/${lap.id}`}>
                  <Button variant="dark" className="w-full font-bebas text-lg tracking-wider uppercase justify-between">
                    <span>Pilih Jam {lap.nama}</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
