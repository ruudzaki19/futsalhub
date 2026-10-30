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
  Star
} from 'lucide-react';
import SplashScreen from './components/SplashScreen';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

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
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#121417] text-stone-900 dark:text-[#F3F4F6] font-sans selection:bg-emerald-200 dark:selection:bg-emerald-900 transition-colors">
      <SplashScreen isOpen={triggerSplash} onFinish={() => setTriggerSplash(false)} />
      <Navbar onLogoClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />

      {/* Hero Section (Sesuai Desain Referensi Gambar 1 & 2) */}
      <section className="relative pt-10 pb-20 lg:pt-16 lg:pb-28 border-b border-stone-200/80 dark:border-white/10 overflow-hidden">
        {/* Background Ambient Glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Kolom Kiri: Headline & Deskripsi */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-[62px] font-black text-stone-900 dark:text-white tracking-tight leading-[1.08]">
                Super Sport <br />
                <span className="text-emerald-700 dark:text-emerald-400">Community App</span> & Arena
              </h1>

              <p className="text-stone-600 dark:text-stone-300 text-base sm:text-lg max-w-xl leading-relaxed">
                Platform all-in-one untuk sewa 3 lapangan turnamen, cek ketersediaan jadwal 16 jam secara real-time, sparring antar tim, dan kelola jadwal tanding tanpa bentrok.
              </p>
            </div>

            {/* Kolom Kanan: Visual Hero Atlet Futsal / Suasana Lapangan */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-700/80 shadow-2xl bg-stone-900 aspect-4/3 sm:aspect-square lg:aspect-4/3">
                <Image
                  src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1000&auto=format&fit=crop&q=80"
                  alt="FutsalHub Arena Interlock"
                  fill
                  className="object-cover"
                  priority
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />
                
                {/* Floating Badge Profile */}
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border border-white/20 dark:border-stone-700 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                      Spesifikasi Resmi
                    </span>
                    <span className="text-sm font-extrabold text-stone-900 dark:text-white">
                      3 Lapangan Vinyl Interlock Turnamen
                    </span>
                  </div>
                  <div className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-white" />
                    <span>5.0</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Floating Search Bar (Persis Gambar 2 Referensi AYO) */}
          <div className="mt-14 -mb-10 relative z-20">
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-800 text-white shadow-xl grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              
              <div className="flex items-center gap-3.5 px-3 py-1.5 border-b sm:border-b-0 sm:border-r border-emerald-700/60">
                <div className="w-10 h-10 rounded-xl bg-emerald-900/80 flex items-center justify-center text-emerald-300">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-emerald-200/80 uppercase font-semibold block">Aktivitas</span>
                  <span className="text-xs sm:text-sm font-bold text-white">Sewa Lapangan Futsal</span>
                </div>
              </div>

              <div className="flex items-center gap-3.5 px-3 py-1.5 border-b sm:border-b-0 sm:border-r border-emerald-700/60">
                <div className="w-10 h-10 rounded-xl bg-emerald-900/80 flex items-center justify-center text-emerald-300">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-emerald-200/80 uppercase font-semibold block">Lokasi</span>
                  <span className="text-xs sm:text-sm font-bold text-white">Kota Tangerang Selatan</span>
                </div>
              </div>

              <div className="flex items-center gap-3.5 px-3 py-1.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-900/80 flex items-center justify-center text-emerald-300">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-emerald-200/80 uppercase font-semibold block">Cabang Olahraga</span>
                  <span className="text-xs sm:text-sm font-bold text-white">Futsal Interlock FIFA</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Bar Statistik Venue (Persis Gambar 2 Referensi) */}
      <section className="pt-20 pb-12 bg-white dark:bg-[#1A1D23] border-b border-stone-200/80 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-left">
            
            <div className="space-y-1 border-l-2 border-emerald-600 pl-4">
              <span className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-white">
                3 Lapangan
              </span>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                Standar Turnamen Resmi Interlock
              </p>
            </div>

            <div className="space-y-1 border-l-2 border-emerald-600 pl-4">
              <span className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-white">
                16 Jam
              </span>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                Ketersediaan Slot (08:00 - 00:00)
              </p>
            </div>

            <div className="space-y-1 border-l-2 border-emerald-600 pl-4">
              <span className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-white">
                15.000+
              </span>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                Jam Pertandingan & Sparring
              </p>
            </div>

            <div className="space-y-1 border-l-2 border-emerald-600 pl-4">
              <span className="text-3xl sm:text-4xl font-black text-emerald-700 dark:text-emerald-400">
                0% Bentrok
              </span>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                Sistem Kunci Otomatis Real-Time
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Section: Profile Venue & Manajemen (Persis Gambar 3 Referensi) */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Kolom Kiri: Tab Pemilik Lapangan vs Penyewa */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Tab Pill Sesuai Gambar 3 */}
            <div className="inline-flex p-1 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
              <button
                type="button"
                onClick={() => setActiveTab('penyewa')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'penyewa'
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
                }`}
              >
                Penyewa & Tim Futsal
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('pemilik')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'pemilik'
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
                }`}
              >
                Pemilik Lapangan (Owner)
              </button>
            </div>

            {activeTab === 'penyewa' ? (
              <div className="space-y-4">
                <h2 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-white tracking-tight leading-tight">
                  Main futsal bersama tim jadi lebih teratur, pasti, dan seru.
                </h2>
                <p className="text-stone-600 dark:text-stone-400 text-sm sm:text-base leading-relaxed">
                  Tidak perlu lagi tanya ketersediaan jadwal lewat chat yang lambat dibalas. Cukup buka jadwal di web, pilih jam main tim, kunci slot, dan langsung terima e-receipt bukti booking resmi.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-stone-800 dark:text-stone-200">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Pilihan durasi bermain fleksibel (1 jam, 2 jam, atau 3 jam beruntun)</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-stone-800 dark:text-stone-200">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Fleksibel bayar lunas atau DP 50% untuk amankan slot jadwal</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-stone-800 dark:text-stone-200">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Fitur Keranjang Sewa untuk booking beberapa jadwal sekaligus</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-white tracking-tight leading-tight">
                  Kelola venue lebih praktis, transparan, dan menguntungkan.
                </h2>
                <p className="text-stone-600 dark:text-stone-400 text-sm sm:text-base leading-relaxed">
                  Waktunya buat venue arena futsal Anda beroperasi dengan sistem otomatis. Pantau omzet real-time, sisa piutang DP kasir, okupansi 3 lapangan, dan kontrol tarif sewa kapan saja lewat portal owner.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-stone-800 dark:text-stone-200">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Pencatatan omzet otomatis langsung dari transaksi online & kasir</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-stone-800 dark:text-stone-200">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Manajemen tarif seragam untuk sesi Siang dan sesi Malam</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-stone-800 dark:text-stone-200">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Ekspor rekap keuangan lengkap dalam format CSV/PDF</span>
                  </div>
                </div>

                <div className="pt-4">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
                  >
                    <span>Masuk ke Portal Owner / Admin</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}

          </div>

          {/* Kolom Kanan: Galeri Foto Venue & Lapangan (Persis Gambar 3 Referensi) */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="relative h-44 sm:h-52 rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-sm">
                <Image
                  src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&auto=format&fit=crop&q=80"
                  alt="Lapangan 1 FutsalHub"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
              </div>
              <div className="relative h-32 sm:h-40 rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-sm">
                <Image
                  src="https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=600&auto=format&fit=crop&q=80"
                  alt="Lapangan 2 FutsalHub"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
              </div>
            </div>

            <div className="space-y-4 pt-6">
              <div className="relative h-32 sm:h-40 rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-sm">
                <Image
                  src="https://images.unsplash.com/photo-1551958219-acbc608c6377?w=600&auto=format&fit=crop&q=80"
                  alt="Lapangan 3 FutsalHub"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
              </div>
              <div className="relative h-44 sm:h-52 rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-sm">
                <Image
                  src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80"
                  alt="Fasilitas Kasir & Lounge"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
              </div>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
