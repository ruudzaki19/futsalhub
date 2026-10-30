// src/app/admin/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Plus, 
  Calendar,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getStoredUser, UserSession } from '../../data/authStore';

interface BookingRequest {
  id: string;
  namaTim: string;
  pemesan: string;
  noHp: string;
  lapangan: string;
  tanggal: string;
  jam: string;
  totalBayar: number;
  metode: string;
  buktiUrl: string;
  status: 'menunggu' | 'confirmed' | 'ditolak';
}

export default function AdminPanelPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);

  // Data tiruan antrean booking masuk 3 Lapangan
  const [antreanBooking, setAntreanBooking] = useState<BookingRequest[]>([
    {
      id: 'BK-091',
      namaTim: 'Spartan Futsal Club',
      pemesan: 'Rian Pratama',
      noHp: '081289123001',
      lapangan: 'Lapangan 1',
      tanggal: '19/09/2026',
      jam: '19:00 - 20:00',
      totalBayar: 170000,
      metode: 'QRIS / Transfer BCA',
      buktiUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop&q=80',
      status: 'menunggu',
    },
    {
      id: 'BK-092',
      namaTim: 'Teknik FC',
      pemesan: 'Dimas Anggara',
      noHp: '085712349911',
      lapangan: 'Lapangan 2',
      tanggal: '19/09/2026',
      jam: '20:00 - 21:00',
      totalBayar: 170000,
      metode: 'Transfer Mandiri',
      buktiUrl: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=500&auto=format&fit=crop&q=80',
      status: 'menunggu',
    },
    {
      id: 'BK-093',
      namaTim: 'Garuda Nusantara',
      pemesan: 'Fajar Kurnia',
      noHp: '081399887766',
      lapangan: 'Lapangan 3',
      tanggal: '19/09/2026',
      jam: '16:00 - 17:00',
      totalBayar: 150000,
      metode: 'Tunai di Meja Kasir',
      buktiUrl: '',
      status: 'confirmed',
    }
  ]);

  // Form input walk-in kasir
  const [walkInTim, setWalkInTim] = useState('');
  const [walkInLapangan, setWalkInLapangan] = useState('Lapangan 1');
  const [walkInJam, setWalkInJam] = useState('16:00 - 17:00');

  // Proteksi Hak Akses
  useEffect(() => {
    const user = getStoredUser();
    if (!user || (user.role !== 'admin' && user.role !== 'owner')) {
      toast.error('Akses ditolak! Halaman ini khusus staf operasional kasir.');
      router.push('/login');
      return;
    }
    setCurrentUser(user);
  }, [router]);

  // Handler Konfirmasi Pembayaran
  const handleKonfirmasi = (id: string, namaTim: string) => {
    setAntreanBooking((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'confirmed' } : item))
    );
    toast.success(`Booking ${id} (${namaTim}) berhasil dikonfirmasi! E-Receipt telah diterbitkan.`);
  };

  // Handler Tolak Pembayaran
  const handleTolak = (id: string, namaTim: string) => {
    setAntreanBooking((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'ditolak' } : item))
    );
    toast.error(`Booking ${id} (${namaTim}) ditolak. Slot jam telah dibebaskan.`);
  };

  // Handler Input Walk-in Offline Kasir
  const handleWalkInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkInTim) {
      toast.error('Nama tim walk-in wajib diisi!');
      return;
    }

    const isSiang = walkInJam.startsWith('15') || walkInJam.startsWith('16');
    const tarif = isSiang ? 150000 : 170000;

    const newBooking: BookingRequest = {
      id: `WI-${Date.now().toString().slice(-3)}`,
      namaTim: walkInTim,
      pemesan: 'Kasir Lapangan (Walk-in)',
      noHp: '-',
      lapangan: walkInLapangan,
      tanggal: '19/09/2026',
      jam: walkInJam,
      totalBayar: tarif,
      metode: 'Tunai di Meja Kasir',
      buktiUrl: '',
      status: 'confirmed',
    };

    setAntreanBooking([newBooking, ...antreanBooking]);
    setWalkInTim('');
    toast.success(`Penyewaan walk-in untuk ${walkInTim} (${walkInLapangan}) berhasil dicatat.`);
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-800 font-sans selection:bg-emerald-500 selection:text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        
        {/* Header Panel Admin */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-100 border border-emerald-200 text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              Terminal Operasional Kasir
            </div>
            <h1 className="text-3xl font-black text-[#0F291E] tracking-tight">
              Akses Panel Admin Kasir
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Validasi bukti transfer pelanggan dan catat reservasi langsung di 3 arena lapangan futsal.
            </p>
          </div>

          <div className="p-3 bg-white border border-stone-200 rounded-2xl flex items-center gap-3 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-800 font-bold">
              AK
            </div>
            <div>
              <span className="block text-xs font-bold text-stone-800">{currentUser.nama}</span>
              <span className="text-[10px] text-emerald-800 font-semibold uppercase">Petugas Shift Aktif</span>
            </div>
          </div>
        </div>

        {/* Section 1: Input Pelanggan Walk-In Langsung */}
        <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-[#0F291E] mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4 text-emerald-700" />
            Input Booking Walk-In (Pelanggan Bayar Tunai Langsung)
          </h2>
          <form onSubmit={handleWalkInSubmit} className="grid sm:grid-cols-12 gap-4 items-end">
            <div className="sm:col-span-4 space-y-1 text-left">
              <label className="text-xs font-bold text-stone-600 uppercase">Nama Tim / Pemain</label>
              <input
                type="text"
                placeholder="Contoh: Alumni SMAN 1"
                value={walkInTim}
                onChange={(e) => setWalkInTim(e.target.value)}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
              />
            </div>
            <div className="sm:col-span-3 space-y-1 text-left">
              <label className="text-xs font-bold text-stone-600 uppercase">Pilih Lapangan</label>
              <select
                value={walkInLapangan}
                onChange={(e) => setWalkInLapangan(e.target.value)}
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
              >
                <option value="Lapangan 1">Lapangan 1</option>
                <option value="Lapangan 2">Lapangan 2</option>
                <option value="Lapangan 3">Lapangan 3</option>
              </select>
            </div>
            <div className="sm:col-span-3 space-y-1 text-left">
              <label className="text-xs font-bold text-stone-600 uppercase">Slot Waktu Main</label>
              <select
                value={walkInJam}
                onChange={(e) => setWalkInJam(e.target.value)}
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
              >
                <option value="15:00 - 16:00">15:00 - 16:00 WIB (Rp 150.000)</option>
                <option value="16:00 - 17:00">16:00 - 17:00 WIB (Rp 150.000)</option>
                <option value="17:00 - 18:00">17:00 - 18:00 WIB (Rp 170.000)</option>
                <option value="18:00 - 19:00">18:00 - 19:00 WIB (Rp 170.000)</option>
                <option value="19:00 - 20:00">19:00 - 20:00 WIB (Rp 170.000)</option>
                <option value="20:00 - 21:00">20:00 - 21:00 WIB (Rp 170.000)</option>
                <option value="21:00 - 22:00">21:00 - 22:00 WIB (Rp 170.000)</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-[#0F291E] hover:bg-[#143B2C] text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
              >
                Catat Transaksi
              </button>
            </div>
          </form>
        </div>

        {/* Section 2: Tabel Verifikasi Bukti Pembayaran */}
        <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#0F291E] flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-700" />
              Antrean Verifikasi Pembayaran Online
            </h2>
            <span className="text-xs font-semibold px-2.5 py-1 bg-stone-100 text-stone-600 rounded-lg">
              {antreanBooking.filter(b => b.status === 'menunggu').length} Menunggu Tindakan
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 uppercase border-y border-stone-200">
                <tr>
                  <th className="py-3 px-4">ID / Tim</th>
                  <th className="py-3 px-4">Lapangan & Waktu</th>
                  <th className="py-3 px-4">Total & Metode</th>
                  <th className="py-3 px-4">Bukti Transfer</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Tindakan Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {antreanBooking.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-4 px-4">
                      <span className="font-bold text-stone-900 block">{item.namaTim}</span>
                      <span className="text-[11px] text-stone-400 font-mono">{item.id} • {item.pemesan}</span>
                    </td>
                    <td className="py-4 px-4 font-medium">
                      <span className="font-bold text-stone-800 block">{item.lapangan}</span>
                      <span className="text-emerald-800 font-bold">{item.jam}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-bold text-stone-900 block">Rp {item.totalBayar.toLocaleString('id-ID')}</span>
                      <span className="text-[11px] text-stone-500">{item.metode}</span>
                    </td>
                    <td className="py-4 px-4">
                      {item.buktiUrl ? (
                        <a
                          href={item.buktiUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-emerald-800 font-bold hover:underline"
                        >
                          Lihat Struk <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-stone-400 italic">Bayar Tunai</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${
                          item.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : item.status === 'ditolak'
                            ? 'bg-red-100 text-red-700 border border-red-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      {item.status === 'menunggu' ? (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleKonfirmasi(item.id, item.namaTim)}
                            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg transition-all cursor-pointer"
                          >
                            Konfirmasi
                          </button>
                          <button
                            onClick={() => handleTolak(item.id, item.namaTim)}
                            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all cursor-pointer"
                          >
                            Tolak
                          </button>
                        </div>
                      ) : (
                        <span className="text-stone-400 font-semibold italic text-[11px]">Selesai Diproses</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}

