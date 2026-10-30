// src/app/owner/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  TrendingUp, 
  DollarSign, 
  CalendarCheck, 
  Download, 
  Sliders, 
  Check, 
  ArrowUpRight 
} from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getStoredUser, UserSession } from '../../data/authStore';

export default function OwnerPanelPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);

  // State Pengaturan Tarif 3 Lapangan
  const [tarifReguler, setTarifReguler] = useState(150000);
  const [tarifMalam, setTarifMalam] = useState(170000);
  const [diskonMember, setDiskonMember] = useState(10);
  const [isSaving, setIsSaving] = useState(false);

  // Proteksi Hak Akses Khusus Owner
  useEffect(() => {
    const user = getStoredUser();
    if (!user || user.role !== 'owner') {
      toast.error('Akses ditolak! Halaman ini memiliki otoritas tinggi khusus Pemilik Arena.');
      router.push('/login');
      return;
    }
    setCurrentUser(user);
  }, [router]);

  const handleSimpanTarif = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Pengaturan tarif baru 3 lapangan berhasil disimpan dan langsung diterapkan ke jadwal!');
    }, 600);
  };

  const handleExportPDF = () => {
    toast.success('Sedang mengunduh berkas Laporan_Keuangan_FutsalHub_September_2026.pdf...');
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-800 font-sans selection:bg-emerald-500 selection:text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        
        {/* Header Dashboard Owner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-100 border border-emerald-200 text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              Executive Business Overview
            </div>
            <h1 className="text-3xl font-black text-[#0F291E] tracking-tight">
              Akses Panel Pemilik (Owner)
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Pemantauan kinerja keuangan, okupansi 3 lapangan main, dan pengaturan skema tarif sewa arena.
            </p>
          </div>

          <button
            onClick={handleExportPDF}
            className="inline-flex items-center gap-2 px-5 py-3 bg-[#0F291E] hover:bg-[#143B2C] text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Ekspor Laporan Resmi (PDF)</span>
          </button>
        </div>

        {/* Kartu Statistik Keuangan Utama */}
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm space-y-3">
            <div className="flex justify-between items-center text-emerald-800">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Omzet Bulan Ini</span>
              <div className="p-2 rounded-xl bg-emerald-50"><DollarSign className="w-5 h-5" /></div>
            </div>
            <div className="text-3xl font-black text-[#0F291E]">Rp 28.450.000</div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
              <TrendingUp className="w-3.5 h-3.5" /> +14.8% dari bulan lalu
            </span>
          </div>

          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm space-y-3">
            <div className="flex justify-between items-center text-emerald-800">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Total Slot Terisi (3 Lapangan)</span>
              <div className="p-2 rounded-xl bg-emerald-50"><CalendarCheck className="w-5 h-5" /></div>
            </div>
            <div className="text-3xl font-black text-[#0F291E]">186 Jam</div>
            <span className="text-[11px] text-stone-400 font-medium">Dari kapasitas 240 jam main</span>
          </div>

          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm space-y-3">
            <div className="flex justify-between items-center text-emerald-800">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Tingkat Okupansi</span>
              <div className="p-2 rounded-xl bg-emerald-50"><ArrowUpRight className="w-5 h-5" /></div>
            </div>
            <div className="text-3xl font-black text-[#0F291E]">77.5%</div>
            <span className="text-[11px] text-emerald-700 font-bold">Jam sibuk malam terisi 98%</span>
          </div>
        </div>

        {/* Section Pengaturan Tarif & Promosi */}
        <div className="bg-white border border-stone-200 rounded-3xl p-8 shadow-sm">
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-stone-100">
            <div>
              <h2 className="text-lg font-bold text-[#0F291E] flex items-center gap-2">
                <Sliders className="w-5 h-5 text-emerald-700" />
                Pengaturan Tarif Sewa 3 Lapangan
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Kewenangan eksklusif pemilik untuk menentukan struktur harga per jam main Lapangan 1, 2, dan 3.
              </p>
            </div>
          </div>

          <form onSubmit={handleSimpanTarif} className="grid sm:grid-cols-3 gap-6 items-end">
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-stone-700 uppercase">Tarif Reguler Siang (08.00 - 17.00)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-xs font-bold text-stone-400">Rp</span>
                <input
                  type="number"
                  value={tarifReguler}
                  onChange={(e) => setTarifReguler(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                />
              </div>
            </div>

            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-stone-700 uppercase">Tarif Malam / Peak Hours (17.00 - 23.00)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-xs font-bold text-stone-400">Rp</span>
                <input
                  type="number"
                  value={tarifMalam}
                  onChange={(e) => setTarifMalam(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                />
              </div>
            </div>

            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-stone-700 uppercase">Diskon Program Turnamen / Komunitas (%)</label>
              <input
                type="number"
                value={diskonMember}
                onChange={(e) => setDiskonMember(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
              />
            </div>

            <div className="sm:col-span-3 flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-3 bg-[#0F291E] hover:bg-[#143B2C] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                {isSaving ? <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> : <Check className="w-4 h-4 text-emerald-400" />}
                <span>Perbarui Struktur Tarif 3 Lapangan</span>
              </button>
            </div>
          </form>
        </div>

      </main>

      <Footer />
    </div>
  );
}

