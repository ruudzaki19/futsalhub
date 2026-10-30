// src/app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  CreditCard,
  ChevronRight
} from 'lucide-react';
import SplashScreen from './components/SplashScreen';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

interface SlotJam {
  id: string;
  jam: string;
  harga: number;
  status: 'tersedia' | 'hold' | 'terisi';
}

export default function HomePage() {
  const [triggerSplash, setTriggerSplash] = useState(false);

  useEffect(() => {
    const isReloaded = sessionStorage.getItem('futsalhub_has_loaded');
    if (!isReloaded) {
      setTriggerSplash(true);
      sessionStorage.setItem('futsalhub_has_loaded', 'true');
    }
  }, []);

  const [selectedDay, setSelectedDay] = useState<'hari-ini' | 'besok'>('hari-ini');
  const [activeSlotId, setActiveSlotId] = useState<string>('slot-2');

  const slots: SlotJam[] = [
    { id: 'slot-1', jam: '16:00 - 17:00', harga: 150000, status: 'tersedia' },
    { id: 'slot-2', jam: '18:00 - 19:00', harga: 170000, status: 'tersedia' },
    { id: 'slot-3', jam: '19:00 - 20:00', harga: 170000, status: 'hold' },
    { id: 'slot-4', jam: '20:00 - 21:00', harga: 170000, status: 'terisi' },
    { id: 'slot-5', jam: '21:00 - 22:00', harga: 170000, status: 'tersedia' },
  ];

  const currentSlot = slots.find((s) => s.id === activeSlotId) || slots[1];

  const handleTriggerLogoSplash = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTriggerSplash(true);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#121417] text-stone-900 dark:text-[#F3F4F6] font-sans selection:bg-emerald-200 dark:selection:bg-emerald-900 transition-colors">
      
      <SplashScreen isOpen={triggerSplash} onFinish={() => setTriggerSplash(false)} />
      <Navbar onLogoClick={handleTriggerLogoSplash} />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-stone-200/80 dark:border-white/10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Kolom Kiri */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-700 dark:text-stone-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Sistem Reservasi 3 Lapangan Futsal Real-Time
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-black text-stone-900 dark:text-white tracking-tight leading-[1.12]">
              Pesan Lapangan Futsal, <br />
              <span className="text-emerald-700 dark:text-emerald-400">Cek Jadwal Langsung.</span>
            </h1>

            <p className="text-stone-600 dark:text-stone-400 text-base sm:text-lg max-w-xl leading-relaxed">
              Tinggalkan cara lama menanyakan jadwal via WhatsApp atau nota manual. Pantau kalender ketersediaan 3 lapangan kami secara langsung, kunci slot otomatis selama 15 menit saat transaksi, dan terima tanda bukti resmi secara praktis.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <Link
                href="/jadwal"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-white dark:hover:bg-stone-200 text-white dark:text-stone-900 font-bold text-sm tracking-wide shadow-sm transition-all"
              >
                <span>Lihat Jadwal Lengkap</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/fasilitas"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white dark:bg-[#1A1D23] hover:bg-stone-50 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-bold text-sm tracking-wide shadow-sm transition-all"
              >
                <span>Tarif & Spesifikasi</span>
              </Link>
            </div>

            <div className="pt-8 grid grid-cols-3 gap-6 border-t border-stone-200 dark:border-white/10 max-w-lg">
              <div>
                <span className="block text-2xl font-black text-stone-900 dark:text-white">15 Mnt</span>
                <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">Auto-Lock Checkout</span>
              </div>
              <div>
                <span className="block text-2xl font-black text-emerald-700 dark:text-emerald-400">0%</span>
                <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">Bentrokan Jadwal</span>
              </div>
              <div>
                <span className="block text-2xl font-black text-stone-900 dark:text-white">3 Lapangan</span>
                <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">Standar Turnamen Resmi</span>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Card Widget */}
          <div className="lg:col-span-5">
            <div className="bg-white dark:bg-[#1A1D23] border border-stone-200 dark:border-stone-700/80 rounded-3xl p-6 sm:p-7 shadow-lg dark:shadow-black/30 space-y-6 transition-colors">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
                <div>
                  <h3 className="text-sm font-bold text-stone-900 dark:text-white">Jadwal Cepat Lapangan</h3>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">3 Lapangan Standar Interlock</p>
                </div>
                <div className="flex bg-stone-100 dark:bg-stone-800 p-1 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-300">
                  <button
                    type="button"
                    onClick={() => setSelectedDay('hari-ini')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      selectedDay === 'hari-ini' 
                        ? 'bg-white dark:bg-[#121417] text-stone-900 dark:text-white shadow-sm font-bold' 
                        : 'hover:text-stone-900 dark:hover:text-white'
                    }`}
                  >
                    Hari Ini
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedDay('besok')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      selectedDay === 'besok' 
                        ? 'bg-white dark:bg-[#121417] text-stone-900 dark:text-white shadow-sm font-bold' 
                        : 'hover:text-stone-900 dark:hover:text-white'
                    }`}
                  >
                    Besok
                  </button>
                </div>
              </div>

              <div className="space-y-2.5">
                <span className="text-[11px] font-bold text-stone-400 dark:text-stone-400 uppercase tracking-wider block">
                  Pilih Jam Bermain:
                </span>
                <div className="space-y-2">
                  {slots.map((s) => {
                    const isSelected = activeSlotId === s.id;
                    const isTersedia = s.status === 'tersedia';
                    const isHold = s.status === 'hold';

                    return (
                      <div
                        key={s.id}
                        onClick={() => isTersedia && setActiveSlotId(s.id)}
                        className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                          !isTersedia
                            ? 'bg-stone-50/70 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800 opacity-50 cursor-not-allowed'
                            : isSelected
                            ? 'bg-stone-50 dark:bg-stone-800/80 border-stone-900 dark:border-stone-300 shadow-sm cursor-pointer'
                            : 'bg-white dark:bg-[#1A1D23] border-stone-200 dark:border-stone-700/80 hover:border-stone-400 dark:hover:border-stone-500 cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-3 h-3 rounded-full border ${
                              isSelected
                                ? 'bg-emerald-600 dark:bg-emerald-400 border-emerald-700 dark:border-emerald-300 ring-4 ring-emerald-100 dark:ring-emerald-950'
                                : isTersedia
                                ? 'bg-white dark:bg-stone-800 border-stone-300 dark:border-stone-600'
                                : isHold
                                ? 'bg-amber-400 border-amber-500'
                                : 'bg-stone-300 dark:bg-stone-700 border-stone-400 dark:border-stone-600'
                            }`}
                          />
                          <div>
                            <span className="block text-xs font-bold text-stone-900 dark:text-stone-100 leading-tight">
                              {s.jam} WIB
                            </span>
                            <span className="text-[10px] text-stone-500 dark:text-stone-400">
                              Rp {s.harga.toLocaleString('id-ID')}
                            </span>
                          </div>
                        </div>

                        <div>
                          {isTersedia ? (
                            <span className="px-2.5 py-1 text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 rounded-md border border-emerald-200/60 dark:border-emerald-800/40">
                              Tersedia
                            </span>
                          ) : isHold ? (
                            <span className="px-2.5 py-1 text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 rounded-md border border-amber-200/60 dark:border-amber-800/40">
                              Diproses
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 text-[10px] font-bold text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 rounded-md">
                              Penuh
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Box Rincian */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#121417] border border-stone-200 dark:border-stone-800 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400 block">Jam terpilih:</span>
                  <span className="text-sm font-bold text-stone-900 dark:text-white">
                    {currentSlot.jam} WIB
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-stone-500 dark:text-stone-400 block">Total tagihan:</span>
                  <span className="text-sm font-black text-stone-900 dark:text-emerald-400">
                    Rp {currentSlot.harga.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <Link
                href="/jadwal"
                className="w-full py-3.5 px-4 bg-stone-900 hover:bg-stone-800 dark:bg-white dark:hover:bg-stone-200 text-white dark:text-stone-900 text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Lanjut ke Pemesanan</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Feature Section */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mb-14 space-y-2">
          <span className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
            Solusi Nyata
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
            Kenapa Booking Lewat Website Lebih Praktis?
          </h2>
          <p className="text-stone-600 dark:text-stone-400 text-sm">
            Tidak perlu menunggu jawaban penjaga lapangan. Seluruh tahapan reservasi terkonfirmasi secara sistematis.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-7 rounded-2xl bg-white dark:bg-[#1A1D23] border border-stone-200 dark:border-stone-700/80 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-800 dark:text-stone-200">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-stone-900 dark:text-white">Jadwal Selalu Real-Time</h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Ketersediaan slot waktu disajikan secara langsung dari basis data, mencegah jadwal bentrok antar-tim di 3 lapangan kami.
            </p>
          </div>

          <div className="p-7 rounded-2xl bg-white dark:bg-[#1A1D23] border border-stone-200 dark:border-stone-700/80 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-800 dark:text-stone-200">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-stone-900 dark:text-white">Kunci Slot 15 Menit</h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Saat proses checkout berlangsung, slot ditahan selama 15 menit agar tidak diambil pengguna lain.
            </p>
          </div>

          <div className="p-7 rounded-2xl bg-white dark:bg-[#1A1D23] border border-stone-200 dark:border-stone-700/80 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-800 dark:text-stone-200">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-stone-900 dark:text-white">Bukti Booking Sah</h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Setiap transaksi sukses menerbitkan nomor booking dan tanda terima resmi untuk verifikasi di lapangan.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
