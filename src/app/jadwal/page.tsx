// src/app/jadwal/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar as CalendarIcon, Clock, ChevronRight, CheckCircle2, Lock } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface SlotDetail {
  id: string;
  jam: string;
  lapanganId: number;
  lapangan: string;
  tarif: number;
  status: 'kosong' | 'terkunci' | 'terisi';
}

export default function JadwalPage() {
  const [selectedDate, setSelectedDate] = useState('2026-09-28');
  const [selectedLap, setSelectedLap] = useState<'semua' | 1 | 2 | 3>('semua');

  // Slot 3 Lapangan (Semua jenis sama: Standar Vinyl Interlock Resmi)
  const slots: SlotDetail[] = [
    // Lapangan 1
    { id: 'L1-S1', jam: '15:00 - 16:00', lapanganId: 1, lapangan: 'Lapangan 1', tarif: 150000, status: 'kosong' },
    { id: 'L1-S2', jam: '16:00 - 17:00', lapanganId: 1, lapangan: 'Lapangan 1', tarif: 150000, status: 'kosong' },
    { id: 'L1-S3', jam: '17:00 - 18:00', lapanganId: 1, lapangan: 'Lapangan 1', tarif: 170000, status: 'kosong' },
    { id: 'L1-S4', jam: '18:00 - 19:00', lapanganId: 1, lapangan: 'Lapangan 1', tarif: 170000, status: 'terkunci' },
    { id: 'L1-S5', jam: '19:00 - 20:00', lapanganId: 1, lapangan: 'Lapangan 1', tarif: 170000, status: 'terisi' },
    { id: 'L1-S6', jam: '20:00 - 21:00', lapanganId: 1, lapangan: 'Lapangan 1', tarif: 170000, status: 'terisi' },
    { id: 'L1-S7', jam: '21:00 - 22:00', lapanganId: 1, lapangan: 'Lapangan 1', tarif: 170000, status: 'kosong' },

    // Lapangan 2
    { id: 'L2-S1', jam: '15:00 - 16:00', lapanganId: 2, lapangan: 'Lapangan 2', tarif: 150000, status: 'kosong' },
    { id: 'L2-S2', jam: '16:00 - 17:00', lapanganId: 2, lapangan: 'Lapangan 2', tarif: 150000, status: 'kosong' },
    { id: 'L2-S3', jam: '17:00 - 18:00', lapanganId: 2, lapangan: 'Lapangan 2', tarif: 170000, status: 'terisi' },
    { id: 'L2-S4', jam: '18:00 - 19:00', lapanganId: 2, lapangan: 'Lapangan 2', tarif: 170000, status: 'kosong' },
    { id: 'L2-S5', jam: '19:00 - 20:00', lapanganId: 2, lapangan: 'Lapangan 2', tarif: 170000, status: 'terkunci' },
    { id: 'L2-S6', jam: '20:00 - 21:00', lapanganId: 2, lapangan: 'Lapangan 2', tarif: 170000, status: 'kosong' },
    { id: 'L2-S7', jam: '21:00 - 22:00', lapanganId: 2, lapangan: 'Lapangan 2', tarif: 170000, status: 'terisi' },

    // Lapangan 3
    { id: 'L3-S1', jam: '15:00 - 16:00', lapanganId: 3, lapangan: 'Lapangan 3', tarif: 150000, status: 'kosong' },
    { id: 'L3-S2', jam: '16:00 - 17:00', lapanganId: 3, lapangan: 'Lapangan 3', tarif: 150000, status: 'kosong' },
    { id: 'L3-S3', jam: '17:00 - 18:00', lapanganId: 3, lapangan: 'Lapangan 3', tarif: 170000, status: 'kosong' },
    { id: 'L3-S4', jam: '18:00 - 19:00', lapanganId: 3, lapangan: 'Lapangan 3', tarif: 170000, status: 'terisi' },
    { id: 'L3-S5', jam: '19:00 - 20:00', lapanganId: 3, lapangan: 'Lapangan 3', tarif: 170000, status: 'kosong' },
    { id: 'L3-S6', jam: '20:00 - 21:00', lapanganId: 3, lapangan: 'Lapangan 3', tarif: 170000, status: 'terkunci' },
    { id: 'L3-S7', jam: '21:00 - 22:00', lapanganId: 3, lapangan: 'Lapangan 3', tarif: 170000, status: 'kosong' },
  ];

  const filteredSlots = slots.filter((s) => {
    if (selectedLap === 'semua') return true;
    return s.lapanganId === selectedLap;
  });

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#121417] text-stone-900 dark:text-[#F3F4F6] font-sans selection:bg-emerald-200 dark:selection:bg-emerald-900 flex flex-col justify-between transition-colors">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10 flex-1 space-y-8 w-full">
        {/* Header */}
        <div className="border-b border-stone-200 dark:border-white/10 pb-6 space-y-2">
          <span className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
            Kalender Pemesanan Real-Time
          </span>
          <h1 className="text-3xl font-black text-stone-900 dark:text-white">
            Jadwal Ketersediaan 3 Lapangan Futsal
          </h1>
          <p className="text-sm text-stone-600 dark:text-stone-400">
            Pilih tanggal dan slot jam bermain di Lapangan 1, 2, atau 3 yang masih kosong untuk reservasi instan.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white dark:bg-[#1A1D23] border border-stone-200 dark:border-stone-700/80 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <CalendarIcon className="w-5 h-5 text-stone-500" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2 text-sm text-stone-800 dark:text-stone-200 focus:outline-none"
            />
          </div>

          {/* Filter 3 Lapangan */}
          <div className="flex bg-stone-100 dark:bg-stone-800 p-1 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-300 w-full sm:w-auto justify-center">
            <button
              onClick={() => setSelectedLap('semua')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedLap === 'semua'
                  ? 'bg-white dark:bg-[#121417] text-stone-900 dark:text-white shadow-sm font-bold'
                  : 'hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              Semua Lapangan
            </button>
            <button
              onClick={() => setSelectedLap(1)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedLap === 1
                  ? 'bg-white dark:bg-[#121417] text-stone-900 dark:text-white shadow-sm font-bold'
                  : 'hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              Lapangan 1
            </button>
            <button
              onClick={() => setSelectedLap(2)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedLap === 2
                  ? 'bg-white dark:bg-[#121417] text-stone-900 dark:text-white shadow-sm font-bold'
                  : 'hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              Lapangan 2
            </button>
            <button
              onClick={() => setSelectedLap(3)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedLap === 3
                  ? 'bg-white dark:bg-[#121417] text-stone-900 dark:text-white shadow-sm font-bold'
                  : 'hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              Lapangan 3
            </button>
          </div>
        </div>

        {/* Grid Slot Jam */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSlots.map((slot) => {
            const isKosong = slot.status === 'kosong';
            const isTerkunci = slot.status === 'terkunci';

            return (
              <div
                key={slot.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isKosong
                    ? 'bg-white dark:bg-[#1A1D23] border-stone-200 dark:border-stone-700/80 hover:border-stone-400 dark:hover:border-stone-500 shadow-sm'
                    : isTerkunci
                    ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40'
                    : 'bg-stone-50 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800 opacity-60'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-xs font-bold text-stone-700 dark:text-stone-300 block">{slot.lapangan}</span>
                    <span className="text-[11px] text-stone-400 dark:text-stone-500">Arena Standar Turnamen</span>
                  </div>
                  <div>
                    {isKosong ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
                        KOSONG
                      </span>
                    ) : isTerkunci ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40">
                        HOLD (15 MNT)
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-stone-100 dark:bg-stone-800 text-stone-500">
                        TERISI
                      </span>
                    )}
                  </div>
                </div>

                <div className="my-4">
                  <span className="text-xl font-black text-stone-900 dark:text-white block font-mono">
                    {slot.jam}
                  </span>
                  <span className="text-sm font-semibold text-stone-600 dark:text-stone-300">
                    Rp {slot.tarif.toLocaleString('id-ID')} / jam
                  </span>
                </div>

                {isKosong ? (
                  <Link
                    href={`/booking?slot=${slot.id}&lapangan=${slot.lapanganId}`}
                    className="w-full py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-white dark:hover:bg-stone-200 text-white dark:text-stone-900 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>Pesan Slot Ini</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <button
                    disabled
                    className="w-full py-2.5 px-4 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-400 dark:text-stone-500 text-xs font-semibold cursor-not-allowed"
                  >
                    Tidak Tersedia
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
