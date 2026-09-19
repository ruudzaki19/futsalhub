// src/app/jadwal/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { dummyLapangan, dummySlots, SlotWaktu } from '../../data/mockData';

export default function JadwalPage() {
  // State filter tanggal (default: hari ini)
  const [selectedDate, setSelectedDate] = useState('2026-09-19');
  // State filter lapangan (default: Lapangan 1)
  const [selectedLapanganId, setSelectedLapanganId] = useState<number>(1);

  // Filter slot berdasarkan lapangan yang dipilih
  const filteredSlots = dummySlots.filter(
    (slot) => slot.lapanganId === selectedLapanganId
  );

  const activeLapangan = dummyLapangan.find((l) => l.id === selectedLapanganId);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-800 font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Header Sesi Jadwal (Sesuai UC-02) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-stone-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-100 border border-emerald-200 text-xs font-bold text-emerald-900 uppercase tracking-wider mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              Sistem Ketersediaan Real-Time (UC-02)
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#0F291E] tracking-tight">
              Kalender Jadwal Lapangan
            </h1>
            <p className="text-stone-600 text-sm mt-1">
              Pilih arena, tentukan tanggal bermain, dan booking slot yang tersedia langsung tanpa antre.
            </p>
          </div>

          {/* Filter Tanggal */}
          <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-3">
            <label htmlFor="tanggal" className="text-xs font-bold text-stone-600 uppercase tracking-wider">
              Pilih Tanggal:
            </label>
            <input
              type="date"
              id="tanggal"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-sm font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-700/30"
            />
          </div>
        </div>

        {/* Tab Pemilihan Lapangan */}
        <div className="flex items-center gap-3 my-8 overflow-x-auto pb-2">
          {dummyLapangan.map((lap) => (
            <button
              key={lap.id}
              onClick={() => setSelectedLapanganId(lap.id)}
              className={`px-6 py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all border ${
                selectedLapanganId === lap.id
                  ? 'bg-[#144734] text-[#FDFBF7] border-[#0E3526] shadow-md'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
              }`}
            >
              {lap.nama} • <span className="font-normal opacity-80">{lap.tipe}</span>
            </button>
          ))}
        </div>

        {/* Legenda Status Warna (Sesuai Rancangan UI Dokumen UAS) */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm mb-10 flex flex-wrap items-center justify-between gap-4">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
            Indikator Status Slot:
          </span>
          <div className="flex flex-wrap items-center gap-6 text-xs font-semibold text-stone-700">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-600 border border-emerald-700" />
              <span>Kosong (Dapat Dipesan)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-amber-400 border border-amber-500" />
              <span>Terkunci (Hold 15 Mnt)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-red-500 border border-red-600" />
              <span>Terisi (Confirmed)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-stone-300 border border-stone-400" />
              <span>Selesai / Lewat</span>
            </div>
          </div>
        </div>

        {/* Grid Kartu Slot Waktu (UC-02 -> UC-03) */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredSlots.map((slot: SlotWaktu) => {
            const isKosong = slot.status === 'kosong';
            const isTerkunci = slot.status === 'terkunci';
            const isTerisi = slot.status === 'terisi';

            return (
              <div
                key={slot.id}
                className={`p-6 rounded-2xl border transition-all relative flex flex-col justify-between ${
                  isKosong
                    ? 'bg-white border-emerald-200 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-emerald-500'
                    : isTerkunci
                    ? 'bg-amber-50/50 border-amber-200 shadow-none'
                    : 'bg-stone-100/70 border-stone-200 shadow-none opacity-70'
                }`}
              >
                <div>
                  {/* Waktu Jam & Badge Status */}
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-xl font-black text-[#0F291E] tracking-tight">
                      {slot.jamMulai} - {slot.jamSelesai}
                    </span>
                    <span
                      className={`px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-md border ${
                        isKosong
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : isTerkunci
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : 'bg-stone-200 text-stone-600 border-stone-300'
                      }`}
                    >
                      {slot.status}
                    </span>
                  </div>

                  <p className="text-xs text-stone-500 mb-6">
                    {activeLapangan?.nama} ({activeLapangan?.tipe})
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-stone-400 block font-medium">Tarif Sewa</span>
                    <span className="text-sm font-bold text-stone-800">
                      Rp {slot.tarif.toLocaleString('id-ID')}
                    </span>
                  </div>

                  {isKosong ? (
                    <Link
                      href={`/booking/${slot.id}`}
                      className="px-4 py-2 text-xs font-bold text-[#FDFBF7] bg-[#144734] hover:bg-[#0E3526] rounded-lg transition-all shadow-sm"
                    >
                      Pesan Slot
                    </Link>
                  ) : isTerkunci ? (
                    <span className="text-[11px] font-semibold text-amber-700 italic">
                      Hold 15 Mnt
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-stone-400">
                      Tidak Tersedia
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}