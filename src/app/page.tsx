// src/app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, 
  MapPin, 
  Activity, 
  Calendar, 
  ShieldCheck, 
  Clock, 
  Users, 
  Trophy, 
  Sparkles, 
  CheckCircle2,
  ChevronRight,
  Star,
  Zap
} from 'lucide-react';
import SplashScreen from './components/SplashScreen';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Button from './components/ui/Button';
import Badge from './components/ui/Badge';
import Card from './components/ui/Card';

export default function HomePage() {
  const [triggerSplash, setTriggerSplash] = useState(false);
  const [activeTab, setActiveTab] = useState<'penyewa' | 'pemilik'>('penyewa');

  useEffect(() => {
    const isReloaded = sessionStorage.getItem('futsalhub_has_loaded');
    if (!isReloaded) {
      setTriggerSplash(true);
      sessionStorage.setItem('futsalhub_has_loaded', 'true');
    }
  }, []);

  return (
    <div className="min-h-screen bg-brand-bg dark:bg-brand-ink text-brand-ink dark:text-stone-100 font-sora selection:bg-brand-lime selection:text-brand-navy transition-colors">
      <SplashScreen isOpen={triggerSplash} onFinish={() => setTriggerSplash(false)} />
      <Navbar onLogoClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />

      {/* =========================================================================
          HERO SECTION: FOTO FULL-WIDTH + HEADLINE RAKSASA "MAIN SERU."
         ========================================================================= */}
      <section className="relative pt-6 pb-16 lg:pt-10 lg:pb-24 border-b-[1.5px] border-brand-line dark:border-white/10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Main Hero Showcase Container */}
          <div className="relative rounded-2xl md:rounded-3xl overflow-hidden border-[1.5px] border-brand-navy/20 dark:border-white/10 shadow-hard-navy-lg bg-brand-navy min-h-[500px] md:min-h-[580px] lg:min-h-[640px] flex flex-col justify-between p-6 sm:p-10 lg:p-12">
            
            {/* Background Photographic Image */}
            <div className="absolute inset-0 -z-0">
              <Image
                src="/images/hero.jpg"
                alt="Futsal Player Striking Ball"
                fill
                priority
                className="object-cover object-center scale-100 hover:scale-103 transition-transform duration-700 opacity-60 md:opacity-75"
              />
              {/* Flat dark vignette overlay without blurry AI gradient */}
              <div className="absolute inset-0 bg-brand-navy/40 dark:bg-brand-ink/60" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/30 to-transparent" />
            </div>

            {/* Top Bar inside Hero: Chip Status */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-brand-navy/90 border border-white/20 text-white backdrop-blur-sm text-xs font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-lime animate-ping" />
                <span className="tracking-wide uppercase font-bebas text-sm text-brand-lime">Arena Siap Pakai 24/7</span>
                <span className="text-stone-400 font-mono text-[11px] hidden sm:inline">| 3 Lapangan Interlock FIFA</span>
              </div>

              <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-white/90 bg-black/40 px-3 py-1.5 rounded-lg border border-white/10">
                <MapPin className="w-3.5 h-3.5 text-brand-lime" />
                <span>Tangerang Selatan, Banten</span>
              </div>
            </div>

            {/* Middle: Headline Raksasa "MAIN SERU." */}
            <div className="relative z-10 my-auto py-8">
              <span className="font-bebas text-brand-lime text-xl md:text-2xl tracking-widest uppercase block mb-1">
                Arena Futsal Modern & Real-Time Booking
              </span>
              <h1 className="font-bebas text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-white tracking-tight leading-[0.88] uppercase drop-shadow-md">
                MAIN SERU. <br />
                <span className="text-brand-lime">TANPA BENTROK.</span>
              </h1>
              <p className="font-sora text-stone-200 text-sm sm:text-base md:text-lg max-w-xl mt-4 leading-relaxed font-normal">
                Platform reservasi 3 lapangan futsal turnamen dengan sistem kunci slot 15 menit otomatis, e-receipt resmi, dan kepastian jadwal tim tanpa chat bolak-balik.
              </p>
            </div>

            {/* Bottom Row inside Hero: Info Card (Kiri Bawah) & Tombol Booking (Kanan Bawah) */}
            <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-end justify-between gap-6 pt-4 border-t border-white/15">
              
              {/* Kartu info kecil kiri bawah */}
              <div className="p-4 rounded-xl bg-brand-navy/95 border-[1.5px] border-white/20 text-white backdrop-blur-md max-w-md shadow-hard-navy">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-brand-lime text-brand-navy flex items-center justify-center font-bebas text-xl font-bold shrink-0">
                    3L
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white uppercase tracking-wider">Status Live Lapangan</span>
                      <Badge variant="lime" size="sm">Buka Hari Ini</Badge>
                    </div>
                    <p className="text-[11px] text-stone-300 mt-0.5">
                      Sesi Siang (08:00 - 15:00) & Sesi Malam (15:00 - 00:00). Slot ter-update setiap detik.
                    </p>
                  </div>
                </div>
              </div>

              {/* Tombol Booking Sekarang kanan bawah */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link href="/jadwal" className="w-full sm:w-auto">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-hard-navy font-bebas text-xl tracking-wider uppercase">
                    <span>Booking Sekarang</span>
                    <ArrowRight className="w-5 h-5 ml-1" />
                  </Button>
                </Link>
                <Link href="/fasilitas" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border-white/30 font-bebas text-xl tracking-wider uppercase">
                    Lihat Tarif
                  </Button>
                </Link>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION A: TENTANG KAMI & STATISTIK VENUE
         ========================================================================= */}
      <section className="py-20 border-b-[1.5px] border-brand-line dark:border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Section Marker Label: A / Tentang */}
          <div className="flex items-center gap-3 mb-10">
            <span className="w-8 h-8 rounded-full bg-brand-navy dark:bg-brand-lime text-brand-lime dark:text-brand-navy flex items-center justify-center font-bebas text-base font-bold shadow-sm">
              A
            </span>
            <span className="font-bebas text-xl md:text-2xl tracking-wider text-brand-ink dark:text-white uppercase">
              Tentang FutsalHub Arena
            </span>
            <div className="h-[1.5px] flex-1 bg-brand-line dark:bg-white/10" />
          </div>

          {/* Grid Konten Section A */}
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Kolom Kiri: Foto Besar dengan Chip Statistik */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-2xl overflow-hidden border-[1.5px] border-brand-navy/30 dark:border-white/10 shadow-hard-navy bg-brand-navy aspect-[4/3]">
                <Image
                  src="/images/tentang-1.jpg"
                  alt="Arena Futsal Modern FutsalHub"
                  fill
                  className="object-cover hover:scale-103 transition-transform duration-500"
                />
                
                {/* Chip Statistik di atas foto */}
                <div className="absolute top-4 left-4 p-3 rounded-xl bg-brand-navy/95 border-[1.5px] border-white/20 text-white backdrop-blur-md shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-brand-blue flex items-center justify-center text-white">
                      <Trophy className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bebas text-xl leading-none block text-brand-lime">3 LAPANGAN RESMI</span>
                      <span className="text-[11px] text-stone-300 font-sora">Interlock Standar Turnamen</span>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-4 right-4 p-3 rounded-xl bg-brand-navy/95 border-[1.5px] border-white/20 text-white backdrop-blur-md shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-brand-lime text-brand-navy flex items-center justify-center">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bebas text-xl leading-none block text-white">16 JAM OPERASIONAL</span>
                      <span className="text-[11px] text-stone-300 font-sora">08:00 - 00:00 WIB</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Kolom Kanan: Penjelasan & Angka Raksasa 15.000+ */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-block">
                <Badge variant="blue" size="md">Standar Futsal Profesional</Badge>
              </div>

              <h2 className="font-bebas text-4xl sm:text-5xl lg:text-6xl text-brand-ink dark:text-white uppercase leading-none tracking-tight">
                PENGALAMAN BERTANDING TERBAIK DI KOTA ANDA.
              </h2>

              <p className="font-sora text-brand-dim dark:text-stone-300 text-sm sm:text-base leading-relaxed">
                FutsalHub hadir dengan transparansi penuh untuk mengeliminasi sistem lama yang rentan bentrok jadwal dan pencatatan manual. Baik untuk sparring santai mingguan, latihan rutin komunitas, maupun turnamen antar-instansi resmi.
              </p>

              {/* Angka Raksasa 15.000+ & Metrik Kunci */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white dark:bg-brand-navy/50 border-[1.5px] border-brand-line dark:border-white/10 shadow-sm">
                  <span className="font-bebas text-5xl md:text-6xl text-brand-blue block leading-none">15.000+</span>
                  <span className="font-sora text-xs font-bold text-brand-ink dark:text-stone-200 uppercase mt-1 block">
                    Jam Pertandingan
                  </span>
                  <p className="font-sora text-[11px] text-brand-dim dark:text-stone-400 mt-0.5">
                    Tercatat aman tanpa insiden jadwal ganda.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-brand-navy/50 border-[1.5px] border-brand-line dark:border-white/10 shadow-sm">
                  <span className="font-bebas text-5xl md:text-6xl text-emerald-600 dark:text-brand-lime block leading-none">0%</span>
                  <span className="font-sora text-xs font-bold text-brand-ink dark:text-stone-200 uppercase mt-1 block">
                    Bentrok Jadwal
                  </span>
                  <p className="font-sora text-[11px] text-brand-dim dark:text-stone-400 mt-0.5">
                    Auto-lock slot 15 menit menjamin kepemilikan Anda.
                  </p>
                </div>
              </div>

              {/* Tab Profil Penyewa vs Owner (Mempertahankan State & Logika 100%) */}
              <div className="pt-4">
                <div className="inline-flex p-1 rounded-xl bg-stone-200/80 dark:bg-white/10 border border-brand-line dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => setActiveTab('penyewa')}
                    className={`px-4 py-2 rounded-lg font-bebas text-base uppercase tracking-wider transition-all cursor-pointer ${
                      activeTab === 'penyewa'
                        ? 'bg-brand-navy text-brand-lime shadow-sm dark:bg-brand-lime dark:text-brand-navy'
                        : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
                    }`}
                  >
                    Untuk Penyewa & Tim
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('pemilik')}
                    className={`px-4 py-2 rounded-lg font-bebas text-base uppercase tracking-wider transition-all cursor-pointer ${
                      activeTab === 'pemilik'
                        ? 'bg-brand-navy text-brand-lime shadow-sm dark:bg-brand-lime dark:text-brand-navy'
                        : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
                    }`}
                  >
                    Untuk Pengelola Arena
                  </button>
                </div>

                <div className="mt-4 p-4 rounded-xl bg-white dark:bg-brand-navy/40 border-[1.5px] border-brand-line dark:border-white/10">
                  {activeTab === 'penyewa' ? (
                    <ul className="space-y-2 text-xs sm:text-sm text-stone-700 dark:text-stone-300 font-sora">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-brand-lime shrink-0" />
                        <span>Pilihan durasi 1 jam, 2 jam, atau 3 jam beruntun dengan diskon otomatis.</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-brand-lime shrink-0" />
                        <span>Opsi bayar Lunas atau DP 50% untuk kepastian slot tanding.</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-brand-lime shrink-0" />
                        <span>Keranjang sewa untuk memesan banyak tanggal sekaligus.</span>
                      </li>
                    </ul>
                  ) : (
                    <ul className="space-y-2 text-xs sm:text-sm text-stone-700 dark:text-stone-300 font-sora">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-brand-blue shrink-0" />
                        <span>Pencatatan omzet otomatis dari transaksi online dan kasir manual.</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-brand-blue shrink-0" />
                        <span>Kontrol tarif fleksibel untuk sesi Siang dan sesi Malam.</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-brand-blue shrink-0" />
                        <span>Ekspor rekap pembukuan lengkap format CSV/PDF siap audit.</span>
                      </li>
                    </ul>
                  )}
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION B: PILIHAN LAPANGAN (KARTU LAPANGAN 1-3 BERFOTO)
         ========================================================================= */}
      <section className="py-20 border-b-[1.5px] border-brand-line dark:border-white/10 bg-white dark:bg-brand-ink/80">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Section Marker Label: B / Lapangan */}
          <div className="flex items-center gap-3 mb-10">
            <span className="w-8 h-8 rounded-full bg-brand-navy dark:bg-brand-lime text-brand-lime dark:text-brand-navy flex items-center justify-center font-bebas text-base font-bold shadow-sm">
              B
            </span>
            <span className="font-bebas text-xl md:text-2xl tracking-wider text-brand-ink dark:text-white uppercase">
              Pilihan Lapangan Arena
            </span>
            <div className="h-[1.5px] flex-1 bg-brand-line dark:bg-white/10" />
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <h2 className="font-bebas text-4xl sm:text-5xl text-brand-ink dark:text-white uppercase leading-none tracking-tight">
                3 LAPANGAN TURNAMEN RESMI
              </h2>
              <p className="font-sora text-sm text-brand-dim dark:text-stone-400 mt-2 max-w-lg">
                Seluruh lapangan dilengkapi lantai interlock standar FIFA, pencahayaan 400 Lux tanpa bayangan, dan jaring pengaman keliling 6 meter.
              </p>
            </div>
            <Link href="/jadwal">
              <Button variant="outline" className="font-bebas text-lg uppercase tracking-wider">
                Lihat Semua Kalender Slot <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          {/* Grid 3 Kartu Lapangan */}
          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Kartu Lapangan 1 */}
            <div className="group rounded-2xl overflow-hidden border-[1.5px] border-brand-line dark:border-white/10 bg-brand-bg dark:bg-brand-navy/30 hover:border-brand-navy transition-all hover:shadow-hard-navy flex flex-col justify-between">
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-brand-navy">
                  <Image
                    src="/images/lapangan-1.jpg"
                    alt="Lapangan 1 - Vinyl Interlock"
                    fill
                    className="object-cover group-hover:scale-103 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <Badge variant="navy">Venue #1</Badge>
                    <Badge variant="lime">Interlock</Badge>
                  </div>
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/80 text-white text-xs font-bold flex items-center gap-1 backdrop-blur-sm">
                    <Star className="w-3.5 h-3.5 fill-brand-lime text-brand-lime" />
                    <span>5.0</span>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="font-bebas text-2xl text-brand-ink dark:text-white uppercase tracking-tight">
                    LAPANGAN 1 • VINYL INTERLOCK
                  </h3>
                  <p className="font-sora text-xs text-brand-dim dark:text-stone-400 leading-relaxed">
                    Lantai interlock vinyl resmi turnamen dengan daya redam lutut tinggi, ideal untuk kompetisi intensitas tinggi.
                  </p>
                  
                  <div className="pt-2 border-t border-brand-line dark:border-white/10 flex items-baseline justify-between">
                    <div>
                      <span className="text-xs text-brand-dim line-through block font-mono">Rp 180.000</span>
                      <span className="font-bebas text-2xl text-brand-blue dark:text-brand-lime">
                        Mulai Rp 150.000 <span className="font-sora text-xs text-brand-dim dark:text-stone-400 font-normal">/ jam</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link href="/jadwal/1">
                  <Button variant="dark" className="w-full justify-between font-bebas text-lg tracking-wider uppercase">
                    <span>Pilih Jam Lapangan 1</span>
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Kartu Lapangan 2 */}
            <div className="group rounded-2xl overflow-hidden border-[1.5px] border-brand-line dark:border-white/10 bg-brand-bg dark:bg-brand-navy/30 hover:border-brand-navy transition-all hover:shadow-hard-navy flex flex-col justify-between">
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-brand-navy">
                  <Image
                    src="/images/lapangan-2.jpg"
                    alt="Lapangan 2 - Taraflex Pro"
                    fill
                    className="object-cover group-hover:scale-103 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <Badge variant="navy">Venue #2</Badge>
                    <Badge variant="blue">Taraflex Pro</Badge>
                  </div>
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/80 text-white text-xs font-bold flex items-center gap-1 backdrop-blur-sm">
                    <Star className="w-3.5 h-3.5 fill-brand-lime text-brand-lime" />
                    <span>4.9</span>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="font-bebas text-2xl text-brand-ink dark:text-white uppercase tracking-tight">
                    LAPANGAN 2 • TARAFLEX PRO
                  </h3>
                  <p className="font-sora text-xs text-brand-dim dark:text-stone-400 leading-relaxed">
                    Permukaan Taraflex empuk standar liga internasional dengan traksi optimal untuk kecepatan dan kelincahan tim.
                  </p>
                  
                  <div className="pt-2 border-t border-brand-line dark:border-white/10 flex items-baseline justify-between">
                    <div>
                      <span className="text-xs text-brand-dim line-through block font-mono">Rp 175.000</span>
                      <span className="font-bebas text-2xl text-brand-blue dark:text-brand-lime">
                        Mulai Rp 140.000 <span className="font-sora text-xs text-brand-dim dark:text-stone-400 font-normal">/ jam</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link href="/jadwal/2">
                  <Button variant="dark" className="w-full justify-between font-bebas text-lg tracking-wider uppercase">
                    <span>Pilih Jam Lapangan 2</span>
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Kartu Lapangan 3 */}
            <div className="group rounded-2xl overflow-hidden border-[1.5px] border-brand-line dark:border-white/10 bg-brand-bg dark:bg-brand-navy/30 hover:border-brand-navy transition-all hover:shadow-hard-navy flex flex-col justify-between">
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-brand-navy">
                  <Image
                    src="/images/lapangan-3.jpg"
                    alt="Lapangan 3 - Premium Polypropylene"
                    fill
                    className="object-cover group-hover:scale-103 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <Badge variant="navy">Venue #3</Badge>
                    <Badge variant="lime">Polypropylene</Badge>
                  </div>
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/80 text-white text-xs font-bold flex items-center gap-1 backdrop-blur-sm">
                    <Star className="w-3.5 h-3.5 fill-brand-lime text-brand-lime" />
                    <span>5.0</span>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="font-bebas text-2xl text-brand-ink dark:text-white uppercase tracking-tight">
                    LAPANGAN 3 • PREMIUM INTERLOCK
                  </h3>
                  <p className="font-sora text-xs text-brand-dim dark:text-stone-400 leading-relaxed">
                    Ubin polypropylene interlocking anti-selip dengan pantulan bola sempurna, sangat cocok untuk sparring dan turnamen.
                  </p>
                  
                  <div className="pt-2 border-t border-brand-line dark:border-white/10 flex items-baseline justify-between">
                    <div>
                      <span className="text-xs text-brand-dim line-through block font-mono">Rp 190.000</span>
                      <span className="font-bebas text-2xl text-brand-blue dark:text-brand-lime">
                        Mulai Rp 160.000 <span className="font-sora text-xs text-brand-dim dark:text-stone-400 font-normal">/ jam</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link href="/jadwal/3">
                  <Button variant="dark" className="w-full justify-between font-bebas text-lg tracking-wider uppercase">
                    <span>Pilih Jam Lapangan 3</span>
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          BLOK STATISTIK GELAP (#0B1B3F NAVY)
         ========================================================================= */}
      <section className="py-16 bg-brand-navy text-white border-b-[1.5px] border-brand-line/20 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            
            <div className="space-y-1 border-l-2 border-brand-lime pl-4">
              <span className="font-bebas text-4xl sm:text-5xl text-brand-lime block leading-none">3 LAPANGAN</span>
              <p className="font-sora text-xs text-stone-300">
                Interlock Standar Resmi Turnamen
              </p>
            </div>

            <div className="space-y-1 border-l-2 border-brand-blue pl-4">
              <span className="font-bebas text-4xl sm:text-5xl text-white block leading-none">16 JAM</span>
              <p className="font-sora text-xs text-stone-300">
                Operasional Harian (08:00 - 00:00)
              </p>
            </div>

            <div className="space-y-1 border-l-2 border-brand-lime pl-4">
              <span className="font-bebas text-4xl sm:text-5xl text-brand-lime block leading-none">15 MENIT</span>
              <p className="font-sora text-xs text-stone-300">
                Kunci Slot Checkout Otomatis
              </p>
            </div>

            <div className="space-y-1 border-l-2 border-brand-blue pl-4">
              <span className="font-bebas text-4xl sm:text-5xl text-white block leading-none">100% RESMI</span>
              <p className="font-sora text-xs text-stone-300">
                E-Receipt QR Code Terverifikasi
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          CTA SECTION: "SIAP TANDING?"
         ========================================================================= */}
      <section className="py-20 bg-brand-bg dark:bg-brand-ink">
        <div className="max-w-7xl mx-auto px-6">
          <div className="rounded-3xl bg-brand-navy p-8 md:p-14 text-white border-[1.5px] border-brand-line/20 dark:border-white/10 shadow-hard-navy-lg flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2 text-center md:text-left">
              <span className="font-bebas text-brand-lime text-lg uppercase tracking-wider block">Jadwal Cepat & Akurat</span>
              <h2 className="font-bebas text-5xl md:text-7xl uppercase tracking-tight leading-none">
                SIAP TANDING HARI INI?
              </h2>
              <p className="font-sora text-sm text-stone-300 max-w-lg">
                Pilih jam favorit tim Anda sekarang sebelum slot terkunci oleh komunitas lain. Pembayaran aman dan instan.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              <Link href="/jadwal" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-hard-navy font-bebas text-xl tracking-wider uppercase">
                  <span>Pilih Jam Sekarang</span>
                  <ArrowRight className="w-5 h-5 ml-1" />
                </Button>
              </Link>
              <Link href="/fasilitas" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white/10 text-white border-white/20 hover:bg-white/20 font-bebas text-xl tracking-wider uppercase">
                  Lihat Fasilitas
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
