// src/app/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SplashScreen from './components/SplashScreen';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export default function HomePage() {
  const router = useRouter();
  const [triggerSplash, setTriggerSplash] = useState(false);

  // Fungsi saat logo diklik
  const handleLogoClick = () => {
    setTriggerSplash(true);
  };

  const handleSplashFinish = () => {
    setTriggerSplash(false);
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-800 font-sans selection:bg-emerald-200">
      
      {/* Splash Screen hanya muncul jika triggerSplash = true */}
      <SplashScreen isOpen={triggerSplash} onFinish={handleSplashFinish} />

      {/* Navbar dengan trigger klik logo */}
      <Navbar onLogoClick={handleLogoClick} />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-stone-200/60">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-emerald-100/70 border border-emerald-200 text-xs font-bold text-emerald-900 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
              Sistem Reservasi Futsal Real-Time 24/7
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0F291E] tracking-tight leading-[1.15]">
              Pesan Lapangan Futsal Tanpa Hambat Jadwal.
            </h1>

            <p className="text-base sm:text-lg text-stone-600 max-w-xl leading-relaxed">
              Tinggalkan cara manual buku catatan dan konfirmasi WhatsApp yang lambat[cite: 10, 11]. Pantau kalender ketersediaan langsung[cite: 10], kunci slot otomatis 15 menit[cite: 10], dan dapatkan e-receipt resmi secara instan[cite: 10].
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href="/jadwal"
                className="px-8 py-4 text-center text-sm font-bold tracking-wide text-[#FDFBF7] bg-[#144734] hover:bg-[#0E3526] rounded-xl shadow-md transition-all hover:shadow-lg"
              >
                Cek Ketersediaan Slot
              </Link>
              <Link
                href="/tentang"
                className="px-8 py-4 text-center text-sm font-bold tracking-wide text-stone-700 bg-white border border-stone-300 hover:bg-stone-50 rounded-xl transition-all shadow-sm"
              >
                Pelajari Alur Bisnis
              </Link>
            </div>

            <div className="pt-8 grid grid-cols-3 gap-4 border-t border-stone-200/80 max-w-lg">
              <div>
                <span className="block text-2xl font-black text-emerald-900">0%</span>
                <span className="text-xs text-stone-500 font-medium">Bentrokan Jadwal[cite: 10, 11]</span>
              </div>
              <div>
                <span className="block text-2xl font-black text-emerald-900">15 Mnt</span>
                <span className="text-xs text-stone-500 font-medium">Auto-Lock Slot[cite: 10, 11]</span>
              </div>
              <div>
                <span className="block text-2xl font-black text-emerald-900">24 Jam</span>
                <span className="text-xs text-stone-500 font-medium">Layanan Terbuka[cite: 11]</span>
              </div>
            </div>
          </div>

          {/* Hero Live Preview Card */}
          <div className="lg:col-span-5 relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-200/50 to-stone-200/30 rounded-3xl blur-2xl -z-10" />
            <div className="bg-white/80 backdrop-blur-md border border-stone-200 rounded-2xl p-6 shadow-xl space-y-5">
              
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <span className="text-xs font-bold text-stone-400 tracking-wider uppercase">Live Arena Preview</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-100">
                  <div>
                    <span className="block text-xs font-bold text-emerald-950 uppercase">18:00 - 19:00 WIB</span>
                    <span className="text-[11px] text-emerald-700">Lapangan 1 • Lantai Vinyl[cite: 10]</span>
                  </div>
                  <span className="px-2.5 py-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 rounded-md">
                    TERSEDIA[cite: 10]
                  </span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-amber-50/70 border border-amber-200">
                  <div>
                    <span className="block text-xs font-bold text-amber-950 uppercase">19:00 - 20:00 WIB</span>
                    <span className="text-[11px] text-amber-700">Checkout Pelanggan Lain</span>
                  </div>
                  <span className="px-2.5 py-1 text-[11px] font-bold text-amber-800 bg-amber-100 border border-amber-300 rounded-md">
                    TERKUNCI (12:40)[cite: 10]
                  </span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-stone-100/80 border border-stone-200 opacity-60">
                  <div>
                    <span className="block text-xs font-bold text-stone-700 uppercase">20:00 - 21:00 WIB</span>
                    <span className="text-[11px] text-stone-500">Garuda FC • Terverifikasi[cite: 10]</span>
                  </div>
                  <span className="px-2.5 py-1 text-[11px] font-bold text-stone-600 bg-stone-200 rounded-md">
                    TERISI[cite: 10]
                  </span>
                </div>
              </div>

              <div className="p-3 bg-[#0F291E] text-[#FDFBF7] rounded-xl text-xs flex items-center justify-between">
                <span>Total Operasional Hari Ini</span>
                <span className="font-bold text-emerald-400">8 Slot Siap Main</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Katalog Pilihan Lapangan */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold tracking-widest text-emerald-800 uppercase">
              Fasilitas Arena[cite: 10]
            </span>
            <h2 className="text-3xl font-black text-[#0F291E] tracking-tight mt-1">
              Pilihan Lapangan Futsal[cite: 10]
            </h2>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white border border-stone-200 rounded-2xl p-7 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs font-bold tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100 uppercase">
                  Vinyl Standar Internasional
                </span>
                <h3 className="text-2xl font-bold text-stone-900 mt-2">Lapangan 1 (Arena A)[cite: 10]</h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-stone-400 block">Tarif[cite: 10]</span>
                <span className="text-xl font-black text-[#0F291E]">Rp 150.000</span>
                <span className="text-xs text-stone-500 font-medium"> / jam</span>
              </div>
            </div>
            <p className="text-stone-600 text-sm mb-6 leading-relaxed">
              Lantai vinyl dengan peredam kejut tinggi, bebas silau, dan sesuai standar kompetisi resmi futsal.
            </p>
            <Link
              href="/jadwal"
              className="block w-full py-3.5 text-center text-sm font-bold text-emerald-950 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all"
            >
              Lihat Kalender Slot Lapangan 1[cite: 10]
            </Link>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl p-7 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs font-bold tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100 uppercase">
                  Rumput Sintetis Monofilament
                </span>
                <h3 className="text-2xl font-bold text-stone-900 mt-2">Lapangan 2 (Arena B)[cite: 10]</h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-stone-400 block">Tarif[cite: 10]</span>
                <span className="text-xl font-black text-[#0F291E]">Rp 170.000</span>
                <span className="text-xs text-stone-500 font-medium"> / jam</span>
              </div>
            </div>
            <p className="text-stone-600 text-sm mb-6 leading-relaxed">
              Rumput sintetis monofilament dengan rubber infill elastis untuk kenyamanan sendi dan traksi sepatu maksimal.
            </p>
            <Link
              href="/jadwal"
              className="block w-full py-3.5 text-center text-sm font-bold text-emerald-950 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all"
            >
              Lihat Kalender Slot Lapangan 2[cite: 10]
            </Link>
          </div>
        </div>
      </section>

      <Footer />

    </div>
  );
}