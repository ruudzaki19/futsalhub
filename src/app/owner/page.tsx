// src/app/owner/page.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  TrendingUp, 
  DollarSign, 
  CalendarCheck, 
  Download, 
  Sliders, 
  Check, 
  ArrowUpRight,
  ExternalLink,
  LogOut,
  RefreshCw,
  PieChart,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { toast } from 'sonner';
import { getStoredUser, clearStoredUser, UserSession } from '../../data/authStore';
import { getAllBookings, formatRupiah, BookingRecord } from '../../data/bookingStore';

export default function OwnerPanelPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);

  // State Pengaturan Tarif 3 Lapangan
  const [tarifSiang, setTarifSiang] = useState(150000);
  const [tarifMalam, setTarifMalam] = useState(170000);
  const [diskonMember, setDiskonMember] = useState(10);
  const [isSaving, setIsSaving] = useState(false);

  // Proteksi Hak Akses Khusus Owner
  useEffect(() => {
    const user = getStoredUser();
    if (!user || user.role !== 'owner') {
      toast.error('Akses ditolak! Halaman ini khusus Pemilik Arena (Owner).');
      router.push('/login');
      return;
    }
    setCurrentUser(user);
    loadBookings();
  }, [router]);

  const loadBookings = () => {
    setBookings(getAllBookings());
  };

  // Listen to cross-component booking updates
  useEffect(() => {
    const handleUpdate = () => loadBookings();
    window.addEventListener('futsalhub_bookings_changed', handleUpdate);
    return () => window.removeEventListener('futsalhub_bookings_changed', handleUpdate);
  }, []);

  // Metrik Keuangan Real-Time
  const validBookings = useMemo(() => {
    return bookings.filter((b) => b.status === 'confirmed' || b.status === 'selesai');
  }, [bookings]);

  // Total Omzet yang sudah diterima (nominal dibayar dari booking yang confirmed / selesai)
  const totalOmzet = useMemo(() => {
    return validBookings.reduce((sum, b) => sum + b.nominalDibayar, 0);
  }, [validBookings]);

  // Estimasi Piutang Pelunasan Kasir (sisa pelunasan untuk booking DP)
  const totalPiutangKasir = useMemo(() => {
    return bookings
      .filter((b) => b.tipePembayaran === 'dp' && b.status === 'confirmed')
      .reduce((sum, b) => sum + b.sisaPelunasan, 0);
  }, [bookings]);

  // Total Jam Tersewa
  const totalJamTersewa = useMemo(() => {
    return validBookings.reduce((sum, b) => sum + b.slots.length, 0);
  }, [validBookings]);

  // Breakdown Jam per Lapangan
  const statsLapangan = useMemo(() => {
    const counts = { 1: 0, 2: 0, 3: 0 };
    validBookings.forEach((b) => {
      if (counts[b.lapanganId as 1 | 2 | 3] !== undefined) {
        counts[b.lapanganId as 1 | 2 | 3] += b.slots.length;
      }
    });
    return counts;
  }, [validBookings]);

  const handleSimpanTarif = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Pengaturan tarif 3 lapangan berhasil diperbarui!');
    }, 500);
  };

  const handleExportCSV = () => {
    const headers = 'ID,Penyewa,NoHP,Lapangan,Tanggal,Slot,NominalDibayar,TipeBayar,Metode,Status\n';
    const rows = bookings.map((b) => 
      `"${b.id}","${b.namaPenyewa}","${b.noHp}","${b.lapanganNama}","${b.tanggal}","${b.slots.map(s => s.jam).join('; ')}",${b.nominalDibayar},"${b.tipePembayaran}","${b.metodePembayaran}","${b.status}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Rekap_Keuangan_FutsalHub_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Laporan Keuangan CSV berhasil diunduh!');
  };

  const handleLogout = () => {
    clearStoredUser();
    toast.success('Berhasil keluar dari portal owner');
    router.push('/login');
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-900 font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* HEADER KHUSUS DASHBOARD OWNER (Tanpa Navbar Publik) */}
      <header className="bg-[#0F291E] text-white sticky top-0 z-30 shadow-md border-b border-emerald-950">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center font-black text-[#0F291E] text-base">
              FH
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-black tracking-tight text-white">
                  FutsalHub Executive Owner Portal
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30">
                  Otoritas Pemilik
                </span>
              </div>
              <p className="text-xs text-stone-300">
                Pemilik Arena: <span className="text-white font-semibold">{currentUser.nama}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-900/60 hover:bg-emerald-900 text-stone-200 text-xs font-semibold transition-all border border-emerald-800"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Buka Web Pelanggan</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-950/60 hover:bg-red-900/80 text-red-300 text-xs font-semibold transition-all border border-red-800/40 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Konten Utama Owner */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-10">
        
        {/* Header Action Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
          <div>
            <h2 className="text-2xl font-black text-stone-900 tracking-tight">
              Ringkasan Kinerja Bisnis & Finansial
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Pantau arus kas, realisasi transaksi pelanggan, okupansi 3 lapangan, dan kontrol tarif per jam
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={loadBookings}
              className="p-2.5 rounded-xl bg-white border border-stone-200 hover:bg-stone-50 text-stone-600 transition-colors cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Ekspor Rekap Finansial (CSV)</span>
            </button>
          </div>
        </div>

        {/* 4 Kartu Metrik Keuangan Utama */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs space-y-2">
            <div className="flex justify-between items-center text-emerald-700">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                Omzet Diterima
              </span>
              <div className="p-2 rounded-xl bg-emerald-50">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-stone-900">
              {formatRupiah(totalOmzet)}
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
              <TrendingUp className="w-3.5 h-3.5" /> Pembayaran valid terverifikasi
            </span>
          </div>

          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs space-y-2">
            <div className="flex justify-between items-center text-blue-700">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                Piutang DP di Kasir
              </span>
              <div className="p-2 rounded-xl bg-blue-50">
                <CalendarCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-blue-900">
              {formatRupiah(totalPiutangKasir)}
            </div>
            <span className="text-[11px] text-stone-500">
              Sisa pelunasan saat tim hadir main
            </span>
          </div>

          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs space-y-2">
            <div className="flex justify-between items-center text-stone-700">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                Total Jam Tersewa
              </span>
              <div className="p-2 rounded-xl bg-stone-100">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-stone-900">
              {totalJamTersewa} Jam
            </div>
            <span className="text-[11px] text-stone-500">
              Dari {bookings.length} total transaksi masuk
            </span>
          </div>

          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs space-y-2">
            <div className="flex justify-between items-center text-purple-700">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                Okupansi 3 Lapangan
              </span>
              <div className="p-2 rounded-xl bg-purple-50">
                <PieChart className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xs font-semibold text-stone-700 space-y-1 pt-1">
              <div className="flex justify-between">
                <span>Lapangan 1:</span>
                <strong className="text-stone-900">{statsLapangan[1]} Jam</strong>
              </div>
              <div className="flex justify-between">
                <span>Lapangan 2:</span>
                <strong className="text-stone-900">{statsLapangan[2]} Jam</strong>
              </div>
              <div className="flex justify-between">
                <span>Lapangan 3:</span>
                <strong className="text-stone-900">{statsLapangan[3]} Jam</strong>
              </div>
            </div>
          </div>

        </div>

        {/* Section: Riwayat Transaksi Finansial Pelanggan */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div>
              <h3 className="text-lg font-black text-stone-900">
                Riwayat Transaksi Masuk Terkini
              </h3>
              <p className="text-xs text-stone-500">
                Data pembayaran riil dari seluruh pemesanan online dan walk-in
              </p>
            </div>
            <span className="text-xs font-bold text-stone-400">
              {bookings.length} Data Tercatat
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 font-bold uppercase tracking-wider border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Kode Booking</th>
                  <th className="py-3 px-4">Nama Pelanggan</th>
                  <th className="py-3 px-4">Lapangan</th>
                  <th className="py-3 px-4">Tanggal & Jam</th>
                  <th className="py-3 px-4">Nominal Diterima</th>
                  <th className="py-3 px-4">Metode & Skema</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-stone-400">
                      Belum ada transaksi tercatat.
                    </td>
                  </tr>
                ) : (
                  bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                        {b.id}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-stone-800">
                        {b.namaPenyewa}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-stone-700">
                        {b.lapanganNama && !b.lapanganNama.startsWith('2 Lapangan') && !b.lapanganNama.startsWith('3 Lapangan')
                          ? b.lapanganNama
                          : `Lapangan ${b.lapanganId || 1} (${b.slots.length} Jam)`}
                      </td>
                      <td className="py-3.5 px-4 text-stone-600">
                        {b.tanggalLabel} • {b.slots.map((s) => s.jam).join(', ')}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-emerald-800">
                        {b.status === 'dibatalkan' || b.status === 'kadaluarsa' 
                          ? 'Rp 0 (Batal)' 
                          : b.status === 'ditolak' && b.refundStatus === 'selesai_refund'
                          ? `Refund ${formatRupiah(b.refundNominal || b.nominalDibayar)}`
                          : formatRupiah(b.nominalDibayar)}
                      </td>
                      <td className="py-3.5 px-4 text-stone-500 uppercase font-mono text-[11px]">
                        {b.metodePembayaran} ({b.tipePembayaran === 'lunas' ? 'Lunas' : 'DP 50%'})
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          b.status === 'confirmed' || b.status === 'selesai'
                            ? 'bg-emerald-100 text-emerald-800'
                            : b.status === 'menunggu_verifikasi'
                            ? 'bg-amber-100 text-amber-800'
                            : b.status === 'menunggu_pembayaran'
                            ? 'bg-yellow-100 text-yellow-800'
                            : b.status === 'dibatalkan' || b.status === 'kadaluarsa'
                            ? 'bg-stone-100 text-stone-500'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {b.status === 'confirmed' ? 'Terkonfirmasi' : 
                           b.status === 'selesai' ? 'Lunas Kasir' : 
                           b.status === 'menunggu_pembayaran' ? 'Menunggu Bayar' :
                           b.status === 'dibatalkan' ? 'Dibatalkan' :
                           b.status === 'kadaluarsa' ? 'Kadaluarsa' :
                           b.status === 'ditolak' && b.refundStatus === 'selesai_refund' ? 'Refund Selesai' : b.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section: Pengaturan Tarif Standard 3 Lapangan */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-stone-100">
            <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center font-bold">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-stone-900">
                Manajemen Tarif Sewa 3 Lapangan
              </h3>
              <p className="text-xs text-stone-500">
                Tarif berlaku seragam untuk Lapangan 1, Lapangan 2, dan Lapangan 3
              </p>
            </div>
          </div>

          <form onSubmit={handleSimpanTarif} className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1.5">
                Tarif Sesi Siang (08:00 - 17:00)
              </label>
              <div className="flex items-center rounded-xl bg-stone-50 border border-stone-200 px-3 py-1.5 focus-within:border-emerald-500">
                <span className="text-xs font-bold text-stone-500 mr-2">Rp</span>
                <input
                  type="number"
                  step="10000"
                  value={tarifSiang}
                  onChange={(e) => setTarifSiang(Number(e.target.value))}
                  className="w-full bg-transparent text-xs font-bold text-stone-900 outline-none py-1.5"
                />
                <span className="text-[11px] text-stone-400">/jam</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1.5">
                Tarif Sesi Malam (17:00 - 00:00)
              </label>
              <div className="flex items-center rounded-xl bg-stone-50 border border-stone-200 px-3 py-1.5 focus-within:border-emerald-500">
                <span className="text-xs font-bold text-stone-500 mr-2">Rp</span>
                <input
                  type="number"
                  step="10000"
                  value={tarifMalam}
                  onChange={(e) => setTarifMalam(Number(e.target.value))}
                  className="w-full bg-transparent text-xs font-bold text-stone-900 outline-none py-1.5"
                />
                <span className="text-[11px] text-stone-400">/jam</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1.5">
                Diskon Member Komunitas (%)
              </label>
              <div className="flex items-center rounded-xl bg-stone-50 border border-stone-200 px-3 py-1.5 focus-within:border-emerald-500">
                <input
                  type="number"
                  value={diskonMember}
                  onChange={(e) => setDiskonMember(Number(e.target.value))}
                  className="w-full bg-transparent text-xs font-bold text-stone-900 outline-none py-1.5"
                />
                <span className="text-xs font-bold text-stone-500">%</span>
              </div>
            </div>

            <div className="sm:col-span-3 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs tracking-wide shadow-sm transition-all cursor-pointer flex items-center gap-2"
              >
                <Check className="w-4 h-4 text-emerald-400" />
                <span>{isSaving ? 'Menyimpan...' : 'Terapkan Tarif Baru ke Sistem'}</span>
              </button>
            </div>
          </form>
        </div>

      </main>
    </div>
  );
}
