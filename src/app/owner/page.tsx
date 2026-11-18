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
  Building2,
  LayoutDashboard,
  Calendar,
  Menu,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import FutsalEmblem from '../components/FutsalEmblem';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { getStoredUser, clearStoredUser, UserSession } from '../../data/authStore';
import { getAllBookings, formatRupiah, BookingRecord } from '../../data/bookingStore';

export default function OwnerPanelPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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

  useEffect(() => {
    const handleUpdate = () => loadBookings();
    window.addEventListener('futsalhub_bookings_changed', handleUpdate);
    return () => window.removeEventListener('futsalhub_bookings_changed', handleUpdate);
  }, []);

  const validBookings = useMemo(() => {
    return bookings.filter((b) => b.status === 'confirmed' || b.status === 'selesai');
  }, [bookings]);

  const totalOmzet = useMemo(() => {
    return validBookings.reduce((sum, b) => sum + b.nominalDibayar, 0);
  }, [validBookings]);

  const totalPiutangKasir = useMemo(() => {
    return bookings
      .filter((b) => b.tipePembayaran === 'dp' && b.status === 'confirmed')
      .reduce((sum, b) => sum + b.sisaPelunasan, 0);
  }, [bookings]);

  const totalJamTersewa = useMemo(() => {
    return validBookings.reduce((sum, b) => sum + b.slots.length, 0);
  }, [validBookings]);

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
    <div className="min-h-screen bg-brand-bg dark:bg-brand-ink text-brand-ink dark:text-stone-100 font-sora flex">
      
      {/* SIDEBAR NAVY (#0B1B3F) */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-brand-navy text-white flex flex-col justify-between border-r-[1.5px] border-brand-line/10 transition-transform duration-300 lg:translate-x-0 ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div>
          {/* Logo & Brand Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <FutsalEmblem className="w-8 h-8" />
              <div>
                <span className="font-bebas text-2xl tracking-wider text-white block leading-none">FUTSALHUB</span>
                <span className="font-sora text-[10px] tracking-widest text-brand-lime uppercase font-semibold">Executive Owner</span>
              </div>
            </Link>
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="lg:hidden p-1 text-stone-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigasi Utama */}
          <nav className="p-4 space-y-1.5 font-bebas text-lg tracking-wider uppercase">
            <Link
              href="/owner"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-brand-lime text-brand-navy font-bold shadow-hard-lime"
            >
              <TrendingUp className="w-5 h-5" />
              <span>Kinerja Finansial</span>
            </Link>

            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-stone-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              <ExternalLink className="w-5 h-5 text-brand-lime" />
              <span>Lihat Web Publik</span>
            </Link>
          </nav>
        </div>

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-white/10 space-y-3 font-sora">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-xs font-bold transition-all cursor-pointer font-bebas tracking-wider uppercase"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar Akun</span>
          </button>
        </div>
      </aside>

      {/* OVERLAY MOBILE */}
      {isMobileSidebarOpen && (
        <div 
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
        />
      )}

      {/* AREA KONTEN UTAMA */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        
        {/* TOPBAR BERSIH */}
        <header className="sticky top-0 z-20 bg-white/95 dark:bg-brand-navy/95 backdrop-blur-md border-b-[1.5px] border-brand-line dark:border-white/10 px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-brand-dim hover:text-brand-ink"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-bebas text-2xl text-brand-ink dark:text-white uppercase leading-none tracking-tight">
                PORTAL EKSEKUTIF PEMILIK (OWNER)
              </h1>
            </div>
          </div>
        </header>

        {/* ISI HALAMAN OWNER */}
        <main className="p-6 lg:p-8 space-y-8 flex-1 max-w-7xl w-full mx-auto">
          
          {/* HEADER ACTION ROW */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-line dark:border-white/10">
            <div>
              <h2 className="font-bebas text-3xl text-brand-ink dark:text-white uppercase leading-none">
                RINGKASAN KINERJA BISNIS & FINANSIAL
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={loadBookings}
                className="p-2.5 rounded-xl bg-white dark:bg-brand-navy/60 border border-brand-line dark:border-white/10 hover:bg-brand-line/40 text-brand-dim transition-colors cursor-pointer"
                title="Refresh Data"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              <Button
                type="button"
                variant="dark"
                size="md"
                onClick={handleExportCSV}
                className="font-bebas text-base uppercase tracking-wider"
              >
                <Download className="w-4 h-4 mr-1 text-brand-lime" />
                <span>Ekspor Rekap Finansial (CSV)</span>
              </Button>
            </div>
          </div>

          {/* 4 KARTU METRIK KEUANGAN (ANGKA CONDENSED BESAR) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            <div className="bg-white dark:bg-brand-navy/30 border-[1.5px] border-brand-line dark:border-white/10 rounded-2xl p-6 shadow-sm space-y-2">
              <div className="flex justify-between items-center text-emerald-600 dark:text-brand-lime">
                <span className="font-sora text-[11px] font-bold uppercase tracking-wider text-brand-dim">
                  Omzet Diterima
                </span>
                <div className="p-2 rounded-xl bg-brand-bg dark:bg-brand-navy">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div className="font-bebas text-4xl sm:text-5xl text-brand-blue dark:text-brand-lime leading-none">
                {formatRupiah(totalOmzet)}
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-brand-lime">
                <TrendingUp className="w-3.5 h-3.5" /> Pembayaran valid terkonfirmasi
              </span>
            </div>

            <div className="bg-white dark:bg-brand-navy/30 border-[1.5px] border-brand-line dark:border-white/10 rounded-2xl p-6 shadow-sm space-y-2">
              <div className="flex justify-between items-center text-blue-600">
                <span className="font-sora text-[11px] font-bold uppercase tracking-wider text-brand-dim">
                  Piutang DP di Kasir
                </span>
                <div className="p-2 rounded-xl bg-brand-bg dark:bg-brand-navy">
                  <CalendarCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="font-bebas text-4xl sm:text-5xl text-brand-navy dark:text-white leading-none">
                {formatRupiah(totalPiutangKasir)}
              </div>
              <span className="text-[11px] text-brand-dim">
                Sisa pelunasan saat tim hadir main
              </span>
            </div>

            <div className="bg-white dark:bg-brand-navy/30 border-[1.5px] border-brand-line dark:border-white/10 rounded-2xl p-6 shadow-sm space-y-2">
              <div className="flex justify-between items-center text-brand-dim">
                <span className="font-sora text-[11px] font-bold uppercase tracking-wider text-brand-dim">
                  Total Jam Tersewa
                </span>
                <div className="p-2 rounded-xl bg-brand-bg dark:bg-brand-navy">
                  <Building2 className="w-4 h-4" />
                </div>
              </div>
              <div className="font-bebas text-4xl sm:text-5xl text-brand-ink dark:text-white leading-none">
                {totalJamTersewa} Jam
              </div>
              <span className="text-[11px] text-brand-dim">
                Dari {bookings.length} total transaksi
              </span>
            </div>

            {/* OKUPANSI 3 LAPANGAN (GRAFIK PALET BIRU-LIME) */}
            <div className="bg-white dark:bg-brand-navy/30 border-[1.5px] border-brand-line dark:border-white/10 rounded-2xl p-6 shadow-sm space-y-2">
              <div className="flex justify-between items-center text-brand-dim">
                <span className="font-sora text-[11px] font-bold uppercase tracking-wider text-brand-dim">
                  Okupansi 3 Lapangan
                </span>
                <div className="p-2 rounded-xl bg-brand-bg dark:bg-brand-navy">
                  <PieChart className="w-4 h-4 text-brand-lime" />
                </div>
              </div>
              <div className="text-xs font-semibold text-brand-dim space-y-1.5 pt-1">
                <div className="flex justify-between items-center">
                  <span>Lapangan 1:</span>
                  <span className="font-mono font-bold text-brand-ink dark:text-white">{statsLapangan[1]} Jam</span>
                </div>
                <div className="w-full bg-brand-line/50 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-brand-blue h-full"
                    style={{ width: `${Math.min(100, (statsLapangan[1] / Math.max(1, totalJamTersewa)) * 100)}%` }}
                  />
                </div>

                <div className="flex justify-between items-center pt-1">
                  <span>Lapangan 2:</span>
                  <span className="font-mono font-bold text-brand-ink dark:text-white">{statsLapangan[2]} Jam</span>
                </div>
                <div className="w-full bg-brand-line/50 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-brand-lime h-full"
                    style={{ width: `${Math.min(100, (statsLapangan[2] / Math.max(1, totalJamTersewa)) * 100)}%` }}
                  />
                </div>

                <div className="flex justify-between items-center pt-1">
                  <span>Lapangan 3:</span>
                  <span className="font-mono font-bold text-brand-ink dark:text-white">{statsLapangan[3]} Jam</span>
                </div>
                <div className="w-full bg-brand-line/50 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-brand-navy dark:bg-white h-full"
                    style={{ width: `${Math.min(100, (statsLapangan[3] / Math.max(1, totalJamTersewa)) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

          </div>

          {/* TABEL DATA PEMBAYARAN MASUK */}
          <div className="bg-white dark:bg-brand-navy/30 rounded-2xl border-[1.5px] border-brand-line dark:border-white/10 p-6 space-y-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-brand-line dark:border-white/10">
              <div>
                <h3 className="font-bebas text-2xl text-brand-ink dark:text-white uppercase leading-none">
                  Riwayat Transaksi Finansial Terkini
                </h3>
                <p className="font-sora text-xs text-brand-dim dark:text-stone-400 mt-1">
                  Data pembayaran riil dari seluruh pemesanan online dan kasir.
                </p>
              </div>
              <Badge variant="navy">{bookings.length} Transaksi</Badge>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sora">
                <thead className="bg-brand-bg dark:bg-brand-navy/80 text-brand-dim font-bold uppercase tracking-wider border-b-[1.5px] border-brand-line dark:border-white/10">
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
                <tbody className="divide-y divide-brand-line/60 dark:divide-white/10">
                  {bookings.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-brand-dim">
                        Belum ada transaksi tercatat.
                      </td>
                    </tr>
                  ) : (
                    bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-brand-bg/50 dark:hover:bg-white/5 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-brand-ink dark:text-white">
                          #{b.id}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-brand-ink dark:text-white">
                          {b.namaPenyewa}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-brand-dim dark:text-stone-300">
                          {b.lapanganNama && !b.lapanganNama.startsWith('2 Lapangan') && !b.lapanganNama.startsWith('3 Lapangan')
                            ? b.lapanganNama
                            : `Lapangan ${b.lapanganId || 1} (${b.slots.length} Jam)`}
                        </td>
                        <td className="py-3.5 px-4 text-brand-dim dark:text-stone-400">
                          {b.tanggalLabel} • {b.slots.map((s) => s.jam).join(', ')}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-brand-blue dark:text-brand-lime">
                          {b.status === 'dibatalkan' || b.status === 'kadaluarsa' 
                            ? 'Rp 0 (Batal)' 
                            : b.status === 'ditolak' && b.refundStatus === 'selesai_refund'
                            ? `Refund ${formatRupiah(b.refundNominal || b.nominalDibayar)}`
                            : formatRupiah(b.nominalDibayar)}
                        </td>
                        <td className="py-3.5 px-4 text-brand-dim uppercase font-mono text-[11px]">
                          {b.metodePembayaran} ({b.tipePembayaran === 'lunas' ? 'Lunas' : 'DP 50%'})
                        </td>
                        <td className="py-3.5 px-4">
                          {b.status === 'confirmed' ? (
                            <Badge variant="success">Terkonfirmasi</Badge>
                          ) : b.status === 'selesai' ? (
                            <Badge variant="blue">Lunas Kasir</Badge>
                          ) : b.status === 'menunggu_verifikasi' ? (
                            <Badge variant="warning">Verifikasi</Badge>
                          ) : b.status === 'menunggu_pembayaran' ? (
                            <Badge variant="warning">Hold 10m</Badge>
                          ) : b.status === 'ditolak' ? (
                            <Badge variant="danger">{b.refundStatus === 'selesai_refund' ? 'Refund' : 'Ditolak'}</Badge>
                          ) : (
                            <Badge variant="neutral">Batal</Badge>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* MANAJEMEN TARIF SEWA 3 LAPANGAN */}
          <div className="bg-white dark:bg-brand-navy/30 rounded-2xl border-[1.5px] border-brand-line dark:border-white/10 p-6 space-y-6 shadow-sm">
            <div className="flex items-center gap-2.5 pb-4 border-b border-brand-line dark:border-white/10">
              <div className="w-8 h-8 rounded-xl bg-brand-navy text-brand-lime flex items-center justify-center font-bold">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bebas text-2xl text-brand-ink dark:text-white uppercase leading-none">
                  Manajemen Tarif Sewa 3 Lapangan
                </h3>
                <p className="font-sora text-xs text-brand-dim dark:text-stone-400">
                  Tarif berlaku seragam untuk Lapangan 1, Lapangan 2, dan Lapangan 3.
                </p>
              </div>
            </div>

            <form onSubmit={handleSimpanTarif} className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-sora">
              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-ink dark:text-stone-200 uppercase tracking-wider block">
                  Tarif Sesi Siang (08:00 - 15:00)
                </label>
                <div className="flex items-center rounded-xl bg-white dark:bg-brand-navy/50 border-[1.5px] border-brand-line dark:border-white/10 px-3 py-1.5 focus-within:border-brand-blue">
                  <span className="text-xs font-bold text-brand-dim mr-2 font-mono">Rp</span>
                  <input
                    type="number"
                    step="10000"
                    value={tarifSiang}
                    onChange={(e) => setTarifSiang(Number(e.target.value))}
                    className="w-full bg-transparent text-xs font-bold text-brand-ink dark:text-white outline-none py-1.5 font-mono"
                  />
                  <span className="text-[11px] text-brand-dim font-mono">/jam</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-ink dark:text-stone-200 uppercase tracking-wider block">
                  Tarif Sesi Malam (15:00 - 00:00)
                </label>
                <div className="flex items-center rounded-xl bg-white dark:bg-brand-navy/50 border-[1.5px] border-brand-line dark:border-white/10 px-3 py-1.5 focus-within:border-brand-blue">
                  <span className="text-xs font-bold text-brand-dim mr-2 font-mono">Rp</span>
                  <input
                    type="number"
                    step="10000"
                    value={tarifMalam}
                    onChange={(e) => setTarifMalam(Number(e.target.value))}
                    className="w-full bg-transparent text-xs font-bold text-brand-ink dark:text-white outline-none py-1.5 font-mono"
                  />
                  <span className="text-[11px] text-brand-dim font-mono">/jam</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-ink dark:text-stone-200 uppercase tracking-wider block">
                  Diskon Komunitas / Sparring (%)
                </label>
                <div className="flex items-center rounded-xl bg-white dark:bg-brand-navy/50 border-[1.5px] border-brand-line dark:border-white/10 px-3 py-1.5 focus-within:border-brand-blue">
                  <input
                    type="number"
                    value={diskonMember}
                    onChange={(e) => setDiskonMember(Number(e.target.value))}
                    className="w-full bg-transparent text-xs font-bold text-brand-ink dark:text-white outline-none py-1.5 font-mono"
                  />
                  <span className="text-xs font-bold text-brand-dim">%</span>
                </div>
              </div>

              <div className="sm:col-span-3 flex justify-end">
                <Button
                  type="submit"
                  disabled={isSaving}
                  variant="primary"
                  size="md"
                  className="font-bebas text-lg tracking-wider uppercase shadow-hard-navy"
                >
                  <Check className="w-4 h-4 mr-1" />
                  <span>{isSaving ? 'Menyimpan...' : 'Terapkan Tarif Baru ke Sistem'}</span>
                </Button>
              </div>
            </form>
          </div>

        </main>
      </div>

    </div>
  );
}
