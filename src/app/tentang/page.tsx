// src/app/tentang/page.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { ShieldCheck, Clock, CheckCircle2, Trophy, Users, Zap, Award } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FutsalEmblem from '../components/FutsalEmblem';
import Badge from '../components/ui/Badge';

export default function TentangPage() {
  const nilaiArena = [
    {
      icon: Clock,
      judul: 'Transparansi Jadwal 24/7',
      deskripsi: 'Jadwal 16 jam selalu sinkron real-time, menghilangkan risiko jadwal ganda atau miskomunikasi kasir.'
    },
    {
      icon: ShieldCheck,
      judul: 'Kunci Slot Otomatis',
      deskripsi: 'Sistem auto-lock mengamankan jadwal pilihan tim Anda saat proses checkout tanpa takut diserobot.'
    },
    {
      icon: Award,
      judul: '3 Lapangan Vinyl Resmi',
      deskripsi: 'Permukaan lapangan vinyl berkualitas turnamen, nyaman untuk lutut dan optimal untuk kecepatan tim.'
    },
    {
      icon: Users,
      judul: 'Komunitas & Fair Play',
      deskripsi: 'Wadah bagi ratusan tim futsal untuk sparring rutin, turnamen komunitas, dan kompetisi bergengsi.'
    }
  ];

  return (
    <div className="min-h-screen bg-brand-bg dark:bg-brand-ink text-brand-ink dark:text-stone-100 font-sora selection:bg-brand-lime selection:text-brand-navy flex flex-col justify-between transition-colors">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10 flex-1 space-y-12 w-full">
        {/* Section Label: Tanpa Huruf D */}
        <div className="flex items-center gap-3">
          <span className="font-bebas text-xl md:text-2xl tracking-wider text-brand-ink dark:text-white uppercase">
            Tentang Sistem FUTSALHUB
          </span>
          <div className="h-[1.5px] flex-1 bg-brand-line dark:bg-white/10" />
        </div>

        {/* Hero Title */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex p-3 rounded-2xl bg-white dark:bg-brand-navy/60 border-[1.5px] border-brand-line dark:border-white/10 shadow-sm">
            <FutsalEmblem className="w-10 h-10" />
          </div>
          <h1 className="font-bebas text-4xl sm:text-5xl md:text-6xl text-brand-ink dark:text-white uppercase tracking-tight leading-none">
            STANDAR BARU ARENA FUTSAL MODERN
          </h1>
          <p className="font-sora text-sm text-brand-dim dark:text-stone-300 leading-relaxed">
            Platform reservasi dan operasional futsal yang dirancang untuk memberikan kepastian jadwal bertanding bagi seluruh tim olahraga.
          </p>
        </div>

        {/* Showcase Visual: Foto Arena & Nilai Inti */}
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          
          {/* Foto Dokumentasi Futsal */}
          <div className="lg:col-span-6 relative aspect-[4/3] rounded-2xl overflow-hidden border-[1.5px] border-brand-navy/30 dark:border-white/10 shadow-hard-navy bg-brand-navy">
            <Image
              src="/images/tentang-2.jpg"
              alt="Tim Futsal Berdiskusi Taktik"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-brand-navy/90 border border-white/20 text-white backdrop-blur-sm">
              <span className="font-bebas text-lg text-brand-lime block">KOMUNITAS & SPARRING TERATUR</span>
              <p className="text-xs text-stone-300">
                Pilih jadwal pasti, sparring sportif, dan nikmati waktu bertanding tanpa keraguan bentrok slot.
              </p>
            </div>
          </div>

          {/* Grid 4 Nilai Utama: Padat, Bersih, Tanpa Tombol */}
          <div className="lg:col-span-6 grid sm:grid-cols-2 gap-4">
            {nilaiArena.map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <div 
                  key={idx}
                  className="p-5 rounded-2xl bg-white dark:bg-brand-navy/40 border-[1.5px] border-brand-line dark:border-white/10 shadow-xs space-y-2.5"
                >
                  <div className="w-9 h-9 rounded-xl bg-brand-navy dark:bg-brand-lime text-brand-lime dark:text-brand-navy flex items-center justify-center font-bold">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <h3 className="font-bebas text-xl text-brand-ink dark:text-white uppercase leading-none">
                    {item.judul}
                  </h3>
                  <p className="font-sora text-xs text-brand-dim dark:text-stone-400 leading-relaxed">
                    {item.deskripsi}
                  </p>
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
