// src/app/fasilitas/page.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { Check, ShieldCheck, Zap, Sparkles, Trophy, Users, Droplets, Coffee, Car } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Badge from '../components/ui/Badge';

export default function FasilitasPage() {
  const lapangans = [
    {
      id: 1,
      nama: 'Lapangan 1',
      tipe: 'Lantai Vinyl Turnamen',
      image: '/images/lapangan-1.jpg',
      tarifWeekdays: 'Rp 150.000',
      tarifWeekend: 'Rp 180.000',
      fitur: [
        'Lantai Vinyl empuk peredam benturan',
        'Penerangan LED 800 Lux anti-silau',
        'Papan skor digital & bench pemain',
        'Ukuran regulasi resmi 26 × 16 meter'
      ]
    },
    {
      id: 2,
      nama: 'Lapangan 2',
      tipe: 'Lantai Vinyl Turnamen',
      image: '/images/lapangan-2.jpg',
      tarifWeekdays: 'Rp 150.000',
      tarifWeekend: 'Rp 180.000',
      fitur: [
        'Lantai Vinyl grip anti-selip',
        'Penerangan LED 800 Lux anti-silau',
        'Gawang turnamen & jaring keliling',
        'Ukuran regulasi resmi 26 × 16 meter'
      ]
    },
    {
      id: 3,
      nama: 'Lapangan 3',
      tipe: 'Lantai Vinyl Turnamen',
      image: '/images/lapangan-3.jpg',
      tarifWeekdays: 'Rp 150.000',
      tarifWeekend: 'Rp 180.000',
      fitur: [
        'Lantai Vinyl presisi pantulan bola',
        'Penerangan LED 800 Lux anti-silau',
        'Sirkulasi udara indoor optimal',
        'Ukuran regulasi resmi 26 × 16 meter'
      ]
    }
  ];

  const fasilitasVenue = [
    {
      icon: Droplets,
      nama: 'Kamar Bilas & Shower',
      deskripsi: 'Air bersih lancar, shower terawat, dan area bilas terpisah.'
    },
    {
      icon: ShieldCheck,
      nama: 'Loker Pemain',
      deskripsi: 'Loker tim aman untuk menyimpan perlengkapan dan barang berharga.'
    },
    {
      icon: Users,
      nama: 'Tribun Penonton',
      deskripsi: 'Tempat duduk penonton nyaman di setiap sisi lapangan.'
    },
    {
      icon: Coffee,
      nama: 'Kantin & Area Santai',
      deskripsi: 'Menyediakan minuman dingin, snack energi, dan ruang istirahat.'
    },
    {
      icon: Car,
      nama: 'Area Parkir Luas',
      deskripsi: 'Kapasitas parkir motor dan mobil terjamin aman dengan pantauan CCTV.'
    },
    {
      icon: Zap,
      nama: 'Genset Cadangan',
      deskripsi: 'Cadangan listrik otomatis agar permainan tetap berjalan tanpa henti.'
    }
  ];

  return (
    <div className="min-h-screen bg-brand-bg dark:bg-brand-ink text-brand-ink dark:text-stone-100 font-sora selection:bg-brand-lime selection:text-brand-navy flex flex-col justify-between transition-colors">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10 flex-1 space-y-12 w-full">
        {/* Section Label: Tanpa Huruf C */}
        <div className="flex items-center gap-3">
          <span className="font-bebas text-xl md:text-2xl tracking-wider text-brand-ink dark:text-white uppercase">
            Spesifikasi & Struktur Tarif
          </span>
          <div className="h-[1.5px] flex-1 bg-brand-line dark:bg-white/10" />
        </div>

        {/* Header Bersih */}
        <div className="border-b-[1.5px] border-brand-line dark:border-white/10 pb-6 space-y-2">
          <Badge variant="blue" size="md">Standar Futsal Resmi</Badge>
          <h1 className="font-bebas text-4xl sm:text-5xl text-brand-ink dark:text-white uppercase tracking-tight leading-none">
            FASILITAS 3 LAPANGAN & STRUKTUR TARIF
          </h1>
          <p className="font-sora text-sm text-brand-dim dark:text-stone-400 max-w-2xl">
            Tiga lapangan futsal berlantai vinyl standar turnamen dengan harga seragam dan fasilitas venue lengkap untuk kenyamanan tim Anda.
          </p>
        </div>

        {/* 3 Kartu Lapangan Informatif Tanpa Tombol */}
        <div className="grid md:grid-cols-3 gap-8">
          {lapangans.map((lap) => (
            <div 
              key={lap.id} 
              className="bg-white dark:bg-brand-navy/30 border-[1.5px] border-brand-line dark:border-white/10 rounded-2xl p-6 space-y-6 shadow-sm hover:shadow-hard-navy hover:border-brand-navy transition-all"
            >
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
                    <Badge variant="lime">Lantai Vinyl</Badge>
                  </div>
                </div>

                <div>
                  <h2 className="font-bebas text-2xl text-brand-ink dark:text-white uppercase">{lap.nama}</h2>
                  <span className="font-sora text-xs text-brand-dim dark:text-stone-400 font-semibold">{lap.tipe}</span>
                </div>

                {/* Struktur Tarif Weekdays vs Weekend */}
                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-brand-bg dark:bg-brand-navy/60 border-[1.5px] border-brand-line dark:border-white/10">
                  <div>
                    <span className="text-[11px] text-brand-dim dark:text-stone-400 block font-bold">Senin - Jumat (Weekdays)</span>
                    <span className="font-bebas text-2xl text-brand-navy dark:text-white leading-tight block mt-0.5">{lap.tarifWeekdays}</span>
                    <span className="text-[10px] text-brand-dim font-mono">/ jam</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-brand-dim dark:text-stone-400 block font-bold">Sabtu - Minggu (Weekend)</span>
                    <span className="font-bebas text-2xl text-brand-blue dark:text-brand-lime leading-tight block mt-0.5">{lap.tarifWeekend}</span>
                    <span className="text-[10px] text-brand-dim font-mono">/ jam</span>
                  </div>
                </div>

                <div className="space-y-2.5 pt-1">
                  <span className="text-xs font-bold text-brand-ink dark:text-white uppercase tracking-wider block">
                    Fasilitas Lapangan:
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
            </div>
          ))}
        </div>

        {/* Fasilitas Venue Tambahan */}
        <div className="pt-6 space-y-6">
          <div className="border-b-[1.5px] border-brand-line dark:border-white/10 pb-4">
            <h2 className="font-bebas text-3xl text-brand-ink dark:text-white uppercase">
              Fasilitas Pendukung Venue
            </h2>
            <p className="font-sora text-xs text-brand-dim dark:text-stone-400">
              Kenyamanan ekstra di luar arena pertandingan untuk seluruh tim dan pendukung.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {fasilitasVenue.map((f, i) => {
              const IconComp = f.icon;
              return (
                <div key={i} className="p-5 rounded-2xl bg-white dark:bg-brand-navy/30 border-[1.5px] border-brand-line dark:border-white/10 shadow-xs flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-blue/10 dark:bg-brand-lime/10 text-brand-blue dark:text-brand-lime flex items-center justify-center shrink-0">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bebas text-lg text-brand-ink dark:text-white uppercase">{f.nama}</h3>
                    <p className="font-sora text-xs text-brand-dim dark:text-stone-300 leading-relaxed">{f.deskripsi}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
