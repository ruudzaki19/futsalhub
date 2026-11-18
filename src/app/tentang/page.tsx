// src/app/tentang/page.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Clock, CheckCircle2, Trophy, Users } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FutsalEmblem from '../components/FutsalEmblem';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

export default function TentangPage() {
  return (
    <div className="min-h-screen bg-brand-bg dark:bg-brand-ink text-brand-ink dark:text-stone-100 font-sora selection:bg-brand-lime selection:text-brand-navy flex flex-col justify-between transition-colors">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10 flex-1 space-y-12 w-full">
        {/* Section Marker Label */}
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-brand-navy dark:bg-brand-lime text-brand-lime dark:text-brand-navy flex items-center justify-center font-bebas text-base font-bold shadow-sm">
            D
          </span>
          <span className="font-bebas text-xl md:text-2xl tracking-wider text-brand-ink dark:text-white uppercase">
            Tentang Sistem FUTSALHUB
          </span>
          <div className="h-[1.5px] flex-1 bg-brand-line dark:bg-white/10" />
        </div>

        {/* Hero Title */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex p-3 rounded-2xl bg-white dark:bg-brand-navy/60 border-[1.5px] border-brand-line dark:border-white/10 shadow-sm">
            <FutsalEmblem className="w-12 h-12" />
          </div>
          <h1 className="font-bebas text-5xl sm:text-6xl md:text-7xl text-brand-ink dark:text-white uppercase tracking-tight leading-none">
            REVOLUSI BOOKING & MANAJEMEN FUTSAL
          </h1>
          <p className="font-sora text-sm sm:text-base text-brand-dim dark:text-stone-300 leading-relaxed">
            Platform operasional digital terintegrasi untuk 3 lapangan futsal resmi standar turnamen, menghadirkan transparansi jam bermain dan rekap finansial akurat.
          </p>
        </div>

        {/* Grid Visual & Cerita */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border-[1.5px] border-brand-line dark:border-white/10 shadow-hard-navy bg-brand-navy">
            <Image
              src="/images/tentang-2.jpg"
              alt="Tim Futsal Berdiskusi Taktik"
              fill
              className="object-cover"
            />
            <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-brand-navy/95 border border-white/20 text-white backdrop-blur-sm">
              <span className="font-bebas text-lg text-brand-lime block">KOMUNITAS & SPARRING TERATUR</span>
              <p className="text-xs text-stone-300">
                Pilih jadwal pasti, sparring fair-play, dan nikmati waktu bertanding tanpa drama double booking.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <Badge variant="blue" size="md">Transparansi Digital 100%</Badge>
              <h2 className="font-bebas text-3xl sm:text-4xl text-brand-ink dark:text-white uppercase leading-none">
                MENGHAPUS CARA LAMA CATATAN KERTAS & CHAT LAMBAT
              </h2>
              <p className="font-sora text-sm text-brand-dim dark:text-stone-300 leading-relaxed">
                Sistem FUTSALHUB diciptakan untuk menjawab keresahan tim futsal yang sering kecewa akibat jadwal bentrok di lokasi, konfirmasi admin yang terlambat, atau ketidakjelasan bukti pembayaran.
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-white dark:bg-brand-navy/40 border-[1.5px] border-brand-line dark:border-white/10 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-brand-lime flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bebas text-lg text-brand-ink dark:text-white uppercase">Auto-Lock Slot 15 Menit</h4>
                  <p className="font-sora text-xs text-brand-dim dark:text-stone-400">
                    Begitu Anda memilih jam main di checkout, slot otomatis diamankan dari pengguna lain selama 15 menit.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-brand-navy/40 border-[1.5px] border-brand-line dark:border-white/10 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-brand-blue/10 text-brand-blue flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bebas text-lg text-brand-ink dark:text-white uppercase">E-Receipt QR Code Resmi</h4>
                  <p className="font-sora text-xs text-brand-dim dark:text-stone-400">
                    Bukti booking ber-QR code sah untuk check-in kasir di pintu arena, valid dan tersimpan di profil akun.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link href="/jadwal">
                <Button variant="primary" size="lg" className="font-bebas text-xl tracking-wider uppercase shadow-hard-navy">
                  <span>Cek Ketersediaan Slot Sekarang</span>
                  <ArrowRight className="w-5 h-5 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
