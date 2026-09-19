// src/app/fasilitas/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function FasilitasPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-800 font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold tracking-widest text-emerald-800 uppercase">
            Spesifikasi & Standar Arena
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0F291E] tracking-tight">
            Fasilitas & Skema Tarif Lapangan
          </h1>
          <p className="text-stone-600 text-sm">
            Arena futsal berspesifikasi turnamen dengan fasilitas penunjang kenyamanan dan keselamatan atlet.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Lapangan 1 */}
          <div className="bg-white border border-stone-200 rounded-2xl p-8 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100 uppercase">
                  Arena A
                </span>
                <h2 className="text-2xl font-bold text-stone-900 mt-2">Lapangan Vinyl Premium</h2>
              </div>
              <div className="text-right">
                <span className="text-xs text-stone-400 block">Tarif Sewa</span>
                <span className="text-2xl font-black text-[#0F291E]">Rp 150.000</span>
                <span className="text-xs text-stone-500 font-medium"> / jam</span>
              </div>
            </div>
            <p className="text-sm text-stone-600 leading-relaxed">
              Lantai vinyl interlock dengan elastisitas tinggi untuk meminimalkan risiko cedera sendi. Dilengkapi garis batas resmi turnamen futsal nasional.
            </p>
            <ul className="space-y-2 text-xs text-stone-600 pt-2 border-t border-stone-100">
              <li>• Dimensi lapangan: 26 m × 16 m</li>
              <li>• Pencahayaan LED 800 Lux anti-glare</li>
              <li>• Jaring pengaman sekeliling setinggi 6 meter</li>
            </ul>
            <Link
              href="/jadwal"
              className="inline-block w-full py-3 text-center text-sm font-bold text-[#FDFBF7] bg-[#144734] hover:bg-[#0E3526] rounded-xl transition-all shadow-sm"
            >
              Pilih Slot Lapangan A
            </Link>
          </div>

          {/* Lapangan 2 */}
          <div className="bg-white border border-stone-200 rounded-2xl p-8 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100 uppercase">
                  Arena B
                </span>
                <h2 className="text-2xl font-bold text-stone-900 mt-2">Rumput Sintetis Monofilament</h2>
              </div>
              <div className="text-right">
                <span className="text-xs text-stone-400 block">Tarif Sewa</span>
                <span className="text-2xl font-black text-[#0F291E]">Rp 170.000</span>
                <span className="text-xs text-stone-500 font-medium"> / jam</span>
              </div>
            </div>
            <p className="text-sm text-stone-600 leading-relaxed">
              Rumput sintetis monofilament 50 mm berpadu rubber infill ramah lingkungan. Menghadirkan pantulan bola stabil dan cengkeraman sepatu optimal.
            </p>
            <ul className="space-y-2 text-xs text-stone-600 pt-2 border-t border-stone-100">
              <li>• Dimensi lapangan: 28 m × 16 m</li>
              <li>• Infill butiran karet berkualitas bebas debu</li>
              <li>• Bench pemain cadangan terlindung kanopi</li>
            </ul>
            <Link
              href="/jadwal"
              className="inline-block w-full py-3 text-center text-sm font-bold text-[#FDFBF7] bg-[#144734] hover:bg-[#0E3526] rounded-xl transition-all shadow-sm"
            >
              Pilih Slot Lapangan B
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}