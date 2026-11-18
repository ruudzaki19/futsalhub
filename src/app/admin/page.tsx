// src/app/admin/page.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Plus, 
  Calendar,
  ExternalLink,
  ShieldCheck,
  UserCheck,
  Phone,
  DollarSign,
  Printer,
  LogOut,
  RefreshCw,
  Search,
  Eye,
  X,
  FileText,
  Mail,
  Receipt,
  Download,
  RotateCcw,
  AlertTriangle,
  Layers,
  Check,
  Users,
  Trash2,
  LayoutDashboard,
  TrendingUp,
  Settings,
  Menu
} from 'lucide-react';
import FutsalEmblem from '../components/FutsalEmblem';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { getStoredUser, clearStoredUser, UserSession } from '../../data/authStore';
import { 
  getAllBookings, 
  updateBookingStatus, 
  createBooking, 
  formatRupiah, 
  BookingRecord,
  checkAndExpireBookings,
  processRefundBooking,
  getSlotLiveDetailsForCourt,
  clearAllBookings
} from '../../data/bookingStore';

// 16 Slot Operasional Lapangan (08:00 sampai 00:00)
const JAM_OPERASIONAL = [
  '08:00 - 09:00',
  '09:00 - 10:00',
  '10:00 - 11:00',
  '11:00 - 12:00',
  '12:00 - 13:00',
  '13:00 - 14:00',
  '14:00 - 15:00',
  '15:00 - 16:00',
  '16:00 - 17:00',
  '17:00 - 18:00',
  '18:00 - 19:00',
  '19:00 - 20:00',
  '20:00 - 21:00',
  '21:00 - 22:00',
  '22:00 - 23:00',
  '23:00 - 00:00',
];

export default function AdminPanelPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Tanggal Monitoring Grid 3 Lapangan
  const [monitorDate, setMonitorDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Modals Detail, Cetak Struk, dan Refund
  const [selectedBookingForDetail, setSelectedBookingForDetail] = useState<BookingRecord | null>(null);
  const [selectedBookingForPrint, setSelectedBookingForPrint] = useState<BookingRecord | null>(null);
  const [refundBooking, setRefundBooking] = useState<BookingRecord | null>(null);
  const [refundNominalInput, setRefundNominalInput] = useState<number>(0);
  const [refundCatatanInput, setRefundCatatanInput] = useState<string>('');

  // Form Input Walk-in Offline Kasir
  const [walkInNama, setWalkInNama] = useState('');
  const [walkInHp, setWalkInHp] = useState('');
  const [walkInLapangan, setWalkInLapangan] = useState('Lapangan 1');
  const [walkInTanggal, setWalkInTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [walkInJam, setWalkInJam] = useState('19:00 - 20:00');
  const [walkInTipeBayar, setWalkInTipeBayar] = useState<'lunas' | 'dp'>('lunas');
  const [walkInMetode, setWalkInMetode] = useState<'qris' | 'bca' | 'mandiri' | 'bri'>('qris');

  // Proteksi Hak Akses Khusus Admin Kasir & Owner
  useEffect(() => {
    const user = getStoredUser();
    if (!user || (user.role !== 'admin' && user.role !== 'owner')) {
      router.push('/login');
      return;
    }
    setCurrentUser(user);
    loadBookings();
  }, [router]);

  const loadBookings = () => {
    checkAndExpireBookings();
    const list = getAllBookings();
    const sanitized = list.filter((b) => 
      !['Rian Pratama', 'Dimas Anggara', 'Fajar Kurnia'].includes(b.namaPenyewa) && b.id !== 'FH-8832'
    );
    setBookings(sanitized);
  };

  useEffect(() => {
    const handleUpdate = () => loadBookings();
    window.addEventListener('futsalhub_bookings_changed', handleUpdate);

    const interval = setInterval(() => {
      checkAndExpireBookings();
      loadBookings();
    }, 3000);

    return () => {
      window.removeEventListener('futsalhub_bookings_changed', handleUpdate);
      clearInterval(interval);
    };
  }, []);

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchStatus = 
        filterStatus === 'semua' 
          ? true 
          : filterStatus === 'menunggu' 
          ? b.status === 'menunggu_verifikasi'
          : filterStatus === 'belum_bayar'
          ? b.status === 'menunggu_pembayaran'
          : filterStatus === 'confirmed'
          ? b.status === 'confirmed'
          : filterStatus === 'dp'
          ? b.tipePembayaran === 'dp' && b.status === 'confirmed'
          : filterStatus === 'batal'
          ? b.status === 'dibatalkan' || b.status === 'kadaluarsa'
          : b.status === filterStatus;

      const matchSearch = 
        b.namaPenyewa.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.lapanganNama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.noHp.includes(searchQuery);

      return matchStatus && matchSearch;
    });
  }, [bookings, filterStatus, searchQuery]);

  const court1Status = useMemo(() => getSlotLiveDetailsForCourt(1, monitorDate), [monitorDate, bookings]);
  const court2Status = useMemo(() => getSlotLiveDetailsForCourt(2, monitorDate), [monitorDate, bookings]);
  const court3Status = useMemo(() => getSlotLiveDetailsForCourt(3, monitorDate), [monitorDate, bookings]);

  const handleKonfirmasi = (booking: BookingRecord) => {
    updateBookingStatus(booking.id, 'confirmed');
    if (selectedBookingForDetail?.id === booking.id) {
      setSelectedBookingForDetail({ ...selectedBookingForDetail, status: 'confirmed' });
    }
  };

  const handleTolakClick = (booking: BookingRecord) => {
    if (booking.status === 'menunggu_verifikasi' || booking.status === 'confirmed' || booking.status === 'selesai') {
      setRefundBooking(booking);
      setRefundNominalInput(booking.nominalDibayar);
      setRefundCatatanInput('Jadwal dialihkan / maintenance lapangan. Dana dikembalikan 100%.');
    } else {
      updateBookingStatus(booking.id, 'ditolak');
      if (selectedBookingForDetail?.id === booking.id) {
        setSelectedBookingForDetail({ ...selectedBookingForDetail, status: 'ditolak' });
      }
    }
  };

  const handleConfirmRefund = () => {
    if (!refundBooking) return;
    processRefundBooking(refundBooking.id, refundNominalInput, refundCatatanInput);
    if (selectedBookingForDetail?.id === refundBooking.id) {
      setSelectedBookingForDetail({ 
        ...selectedBookingForDetail, 
        status: 'ditolak',
        refundStatus: 'selesai_refund',
        refundNominal: refundNominalInput,
        refundCatatan: refundCatatanInput,
      });
    }
    setRefundBooking(null);
  };

  const handleTolakTanpaRefund = () => {
    if (!refundBooking) return;
    updateBookingStatus(refundBooking.id, 'ditolak', { refundStatus: 'none' });
    if (selectedBookingForDetail?.id === refundBooking.id) {
      setSelectedBookingForDetail({ ...selectedBookingForDetail, status: 'ditolak', refundStatus: 'none' });
    }
    setRefundBooking(null);
  };

  const handlePelunasanKasir = (booking: BookingRecord) => {
    updateBookingStatus(booking.id, 'selesai', { sisaPelunasan: 0 });
    if (selectedBookingForDetail?.id === booking.id) {
      setSelectedBookingForDetail({ ...selectedBookingForDetail, status: 'selesai', sisaPelunasan: 0 });
    }
  };

  const handleCetakStruk = (booking: BookingRecord) => {
    setSelectedBookingForPrint(booking);
  };

  const handleWalkInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkInNama) return;

    const lapId = walkInLapangan.includes('1') ? 1 : walkInLapangan.includes('2') ? 2 : 3;
    const isMalam = parseInt(walkInJam.slice(0, 2)) >= 17;
    const hargaSlot = isMalam ? 170000 : 150000;
    const totalAkhir = hargaSlot;
    const nominalDibayar = walkInTipeBayar === 'lunas' ? totalAkhir : Math.round(totalAkhir * 0.5);
    const sisaPelunasan = totalAkhir - nominalDibayar;

    const newBooking: BookingRecord = {
      id: `WI-${Math.floor(1000 + Math.random() * 9000)}`,
      namaPenyewa: `${walkInNama} (Walk-in Kasir)`,
      noHp: walkInHp || '08120000000',
      email: 'walkin@futsalhub.internal',
      lapanganId: lapId,
      lapanganNama: `${walkInLapangan} (${walkInJam})`,
      tanggal: walkInTanggal,
      tanggalLabel: walkInTanggal,
      slots: [{ jam: walkInJam, harga: hargaSlot }],
      subtotal: hargaSlot,
      biayaLayanan: 0,
      totalAkhir,
      tipePembayaran: walkInTipeBayar,
      nominalDibayar,
      sisaPelunasan,
      metodePembayaran: walkInMetode,
      kodeBayar: `KASIR-OFFLINE-${Date.now().toString().slice(-4)}`,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      refundStatus: 'none',
    };

    createBooking(newBooking);
    setWalkInNama('');
    setWalkInHp('');
  };

  const handleLogout = () => {
    clearStoredUser();
    router.push('/login');
  };

  const formatCourtLabel = (b: BookingRecord) => {
    if (b.lapanganNama && !b.lapanganNama.startsWith('2 Lapangan') && !b.lapanganNama.startsWith('3 Lapangan')) {
      return b.lapanganNama;
    }
    const totalJam = b.slots.length;
    return `Lapangan ${b.lapanganId || 1} (${totalJam} Jam)`;
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-brand-bg dark:bg-brand-ink text-brand-ink dark:text-stone-100 font-sora flex">
      
      {/* SIDEBAR NAVY (#0B1B3F) DENGAN AKSEN LIME (#B8F03C) */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-brand-navy text-white flex flex-col justify-between border-r-[1.5px] border-brand-line/10 transition-transform duration-300 lg:translate-x-0 ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div>
          {/* Logo & Brand Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <FutsalEmblem className="w-8 h-8" />
              <div>
                <span className="font-bebas text-2xl tracking-wider text-white block leading-none">FUTSALHUB</span>
                <span className="font-sora text-[10px] tracking-widest text-brand-lime uppercase font-semibold">Admin Kasir</span>
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
              href="/admin"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-brand-lime text-brand-navy font-bold shadow-hard-lime"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Desk Kasir & Antrean</span>
            </Link>

            <Link
              href="/owner"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-stone-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              <TrendingUp className="w-5 h-5 text-brand-lime" />
              <span>Portal Owner</span>
            </Link>

            <Link
              href="/jadwal"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-stone-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Calendar className="w-5 h-5" />
              <span>Kalender Jadwal</span>
            </Link>
          </nav>
        </div>

        {/* Footer Sidebar: Operator Info */}
        <div className="p-4 border-t border-white/10 space-y-3 font-sora">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-stone-400 block uppercase font-bold tracking-wider">Operator Kasir</span>
            <span className="font-bold text-xs text-white block truncate">{currentUser.nama}</span>
            <span className="text-[11px] text-brand-lime font-mono block truncate">{currentUser.email}</span>
          </div>

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

      {/* OVERLAY MOBILE SIDEBAR */}
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
                DESK KASIR & OPERASIONAL
              </h1>
              <span className="text-xs text-brand-dim dark:text-stone-400 hidden sm:inline">
                Sistem Verifikasi Antrean Reservasi 3 Lapangan
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-bg dark:bg-brand-navy/60 hover:bg-brand-line/50 text-brand-ink dark:text-stone-200 text-xs font-semibold border border-brand-line dark:border-white/10 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lihat Web Publik</span>
            </Link>

            <Badge variant="lime">
              <span className="w-2 h-2 rounded-full bg-brand-navy dark:bg-brand-ink animate-ping" />
              <span>Sistem Kasir Aktif</span>
            </Badge>
          </div>
        </header>

        {/* ISI HALAMAN KASIR */}
        <main className="p-6 lg:p-8 space-y-8 flex-1 max-w-7xl w-full mx-auto">
          
          {/* KARTU KPI (ANGKA CONDENSED BESAR) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-5 rounded-2xl bg-white dark:bg-brand-navy/30 border-[1.5px] border-brand-line dark:border-white/10 shadow-sm space-y-1">
              <span className="font-sora text-xs font-bold text-brand-dim uppercase tracking-wider block">
                Menunggu Verifikasi
              </span>
              <span className="font-bebas text-5xl md:text-6xl text-amber-500 block leading-none">
                {bookings.filter((b) => b.status === 'menunggu_verifikasi').length}
              </span>
              <span className="text-[11px] text-brand-dim block pt-1">
                Perlu cek mutasi transfer kasir
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-brand-navy/30 border-[1.5px] border-brand-line dark:border-white/10 shadow-sm space-y-1">
              <span className="font-sora text-xs font-bold text-brand-dim uppercase tracking-wider block">
                Terkonfirmasi Aktif
              </span>
              <span className="font-bebas text-5xl md:text-6xl text-emerald-600 dark:text-brand-lime block leading-none">
                {bookings.filter((b) => b.status === 'confirmed').length}
              </span>
              <span className="text-[11px] text-brand-dim block pt-1">
                Jadwal resmi terkunci & siap main
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-brand-navy/30 border-[1.5px] border-brand-line dark:border-white/10 shadow-sm space-y-1">
              <span className="font-sora text-xs font-bold text-brand-dim uppercase tracking-wider block">
                Uang Muka (DP 50%)
              </span>
              <span className="font-bebas text-5xl md:text-6xl text-brand-blue block leading-none">
                {bookings.filter((b) => b.tipePembayaran === 'dp' && b.status === 'confirmed').length}
              </span>
              <span className="text-[11px] text-brand-dim block pt-1">
                Sisa pelunasan di meja kasir
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-brand-navy/30 border-[1.5px] border-brand-line dark:border-white/10 shadow-sm space-y-1">
              <span className="font-sora text-xs font-bold text-brand-dim uppercase tracking-wider block">
                Total Transaksi
              </span>
              <span className="font-bebas text-5xl md:text-6xl text-brand-navy dark:text-white block leading-none">
                {bookings.length}
              </span>
              <div className="pt-1 flex items-center justify-between text-[11px] text-brand-dim font-bold">
                <span>Lunas/DP: {bookings.filter(b => b.status === 'confirmed' || b.status === 'selesai').length}</span>
                <span>Batal: {bookings.filter(b => b.status === 'dibatalkan' || b.status === 'kadaluarsa').length}</span>
              </div>
            </div>

          </div>

          {/* PAPAN MONITORING KETERSEDIAAN 3 LAPANGAN REAL-TIME */}
          <div className="bg-white dark:bg-brand-navy/30 rounded-2xl border-[1.5px] border-brand-line dark:border-white/10 p-6 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-line dark:border-white/10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="blue">Visual 16 Jam Slot</Badge>
                  <span className="font-bebas text-lg text-brand-ink dark:text-white uppercase">Monitoring 3 Lapangan</span>
                </div>
                <p className="font-sora text-xs text-brand-dim dark:text-stone-400">
                  Pantau slot kosong, sedang dipesan 10 menit, atau terisi tim. Klik slot untuk rincian cepat.
                </p>
              </div>

              {/* Pemilih Tanggal */}
              <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-brand-bg dark:bg-brand-navy/60 border-[1.5px] border-brand-line dark:border-white/10 text-xs self-start sm:self-auto shadow-sm">
                <Calendar className="w-4 h-4 text-brand-blue dark:text-brand-lime" />
                <span className="font-bold text-brand-dim">Tanggal:</span>
                <input
                  type="date"
                  value={monitorDate}
                  onChange={(e) => setMonitorDate(e.target.value)}
                  className="bg-transparent font-bold text-brand-ink dark:text-white outline-none cursor-pointer"
                />
              </div>
            </div>

            {/* Legenda Visual */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-sora">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-white dark:bg-brand-navy/60 border-[1.5px] border-brand-line dark:border-white/20" />
                <span className="text-brand-dim">Kosong (Tersedia)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-amber-400 border-[1.5px] border-amber-500 animate-pulse" />
                <span className="text-amber-700 dark:text-amber-400 font-bold">Hold 10 Mnt</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-brand-navy border-[1.5px] border-brand-lime" />
                <span className="text-brand-blue dark:text-brand-lime font-bold">Terisi / Terkonfirmasi</span>
              </div>
            </div>

            {/* Grid 3 Lapangan */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { id: 1, nama: 'Lapangan 1', spek: 'Vinyl Interlock FIFA', statusDict: court1Status },
                { id: 2, nama: 'Lapangan 2', spek: 'Taraflex Pro Standard', statusDict: court2Status },
                { id: 3, nama: 'Lapangan 3', spek: 'Polypropylene Interlock', statusDict: court3Status },
              ].map((court) => (
                <div key={court.id} className="rounded-xl border-[1.5px] border-brand-line dark:border-white/10 bg-brand-bg dark:bg-brand-navy/50 p-4 space-y-3">
                  <div className="border-b border-brand-line dark:border-white/10 pb-2.5 flex items-center justify-between">
                    <div>
                      <h3 className="font-bebas text-xl text-brand-ink dark:text-white uppercase leading-none">{court.nama}</h3>
                      <span className="text-[11px] text-brand-dim block mt-0.5">{court.spek}</span>
                    </div>
                    <Badge variant="navy">Venue #{court.id}</Badge>
                  </div>

                  <div className="space-y-1.5 max-h-[460px] overflow-y-auto pr-1">
                    {JAM_OPERASIONAL.map((slotJam) => {
                      const slotInfo = court.statusDict[slotJam];
                      const isTerisi = slotInfo?.status === 'terisi';
                      const isLocked10 = slotInfo?.status === 'locked_10min';
                      const b = slotInfo?.booking;

                      return (
                        <div
                          key={slotJam}
                          onClick={() => {
                            if (b) setSelectedBookingForDetail(b);
                          }}
                          className={`p-2.5 rounded-lg border-[1.5px] text-xs transition-all ${
                            isTerisi
                              ? 'bg-brand-navy text-white border-brand-lime hover:shadow-hard-lime cursor-pointer'
                              : isLocked10
                              ? 'bg-amber-500/10 border-amber-400 text-amber-900 dark:text-amber-200 hover:bg-amber-500/20 cursor-pointer'
                              : 'bg-white dark:bg-brand-navy/30 border-brand-line dark:border-white/10 text-brand-dim'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-[11px]">{slotJam}</span>
                            {isTerisi ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-lime text-brand-navy">
                                ✓ Terisi
                              </span>
                            ) : isLocked10 ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-white flex items-center gap-1 animate-pulse">
                                <Clock className="w-2.5 h-2.5" />
                                <span>Hold 10m</span>
                              </span>
                            ) : (
                              <span className="text-[10px] text-brand-dim">
                                Kosong
                              </span>
                            )}
                          </div>

                          {b && (
                            <div className="mt-1 pt-1 border-t border-white/10 flex items-center justify-between text-[11px]">
                              <span className="font-bold truncate max-w-[170px] text-brand-lime">
                                ⚽ {b.namaPenyewa}
                              </span>
                              <span className="text-[10px] font-mono text-stone-300">
                                #{b.id}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TABEL ANTREAN BOOKING PELANGGAN */}
          <div className="bg-white dark:bg-brand-navy/30 rounded-2xl border-[1.5px] border-brand-line dark:border-white/10 p-6 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-line dark:border-white/10">
              <div>
                <h2 className="font-bebas text-2xl text-brand-ink dark:text-white uppercase leading-none">
                  Antrean & Data Booking Masuk
                </h2>
                <p className="font-sora text-xs text-brand-dim dark:text-stone-400 mt-1">
                  Transaksi reservasi online & kasir terverifikasi resmi.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-brand-dim" />
                  <input
                    type="text"
                    placeholder="Cari ID / Nama / No HP..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-xl bg-brand-bg dark:bg-brand-navy/60 border border-brand-line dark:border-white/10 text-xs text-brand-ink dark:text-white outline-none w-48 sm:w-56"
                  />
                </div>

                <button
                  type="button"
                  onClick={loadBookings}
                  className="p-2 rounded-xl bg-brand-bg dark:bg-brand-navy/60 hover:bg-brand-line/50 text-brand-dim transition-colors cursor-pointer border border-brand-line dark:border-white/10"
                  title="Muat ulang data"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Apakah Anda ingin mengosongkan seluruh antrean transaksi dan mengembalikan seluruh jadwal lapangan menjadi TERSEDIA?')) {
                      clearAllBookings();
                      loadBookings();
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold transition-all cursor-pointer font-bebas tracking-wider uppercase"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Reset Transaksi</span>
                </button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bebas tracking-wider uppercase">
              {['semua', 'menunggu', 'belum_bayar', 'confirmed', 'dp', 'batal', 'ditolak'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setFilterStatus(st)}
                  className={`px-3.5 py-1.5 rounded-xl transition-all border-[1.5px] cursor-pointer ${
                    filterStatus === st
                      ? 'bg-brand-navy text-brand-lime border-brand-navy shadow-hard-lime dark:bg-brand-lime dark:text-brand-navy'
                      : 'bg-white dark:bg-brand-navy/50 text-brand-dim border-brand-line dark:border-white/10 hover:border-brand-navy'
                  }`}
                >
                  {st === 'menunggu' ? 'Menunggu Verifikasi' : 
                   st === 'belum_bayar' ? 'Belum Bayar' : 
                   st === 'dp' ? 'DP Belum Lunas' :
                   st === 'batal' ? 'Batal / Expire' : st}
                </button>
              ))}
            </div>

            {/* Tabel Data Padat */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sora">
                <thead className="bg-brand-bg dark:bg-brand-navy/80 text-brand-dim font-bold uppercase tracking-wider border-b-[1.5px] border-brand-line dark:border-white/10">
                  <tr>
                    <th className="py-3 px-4">ID Booking</th>
                    <th className="py-3 px-4">Penyewa & Kontak</th>
                    <th className="py-3 px-4">Lapangan & Slot Jam</th>
                    <th className="py-3 px-4">Pembayaran</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Aksi Kasir</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-line/60 dark:divide-white/10">
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-brand-dim">
                        Tidak ada data booking yang sesuai dengan filter.
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-brand-bg/50 dark:hover:bg-white/5 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-brand-ink dark:text-white">
                          #{b.id}
                          <span className="block text-[10px] font-normal text-brand-dim">
                            {b.createdAt ? new Date(b.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : ''}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 space-y-0.5">
                          <span className="font-bold text-brand-ink dark:text-white block">{b.namaPenyewa}</span>
                          <a
                            href={`https://wa.me/${b.noHp.replace(/^0/, '62')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-brand-blue dark:text-brand-lime hover:underline flex items-center gap-1 font-mono"
                          >
                            <Phone className="w-3 h-3" />
                            <span>{b.noHp}</span>
                          </a>
                        </td>

                        <td className="py-3.5 px-4 space-y-0.5">
                          <span className="font-bold text-brand-ink dark:text-white block">
                            {formatCourtLabel(b)}
                          </span>
                          <span className="text-[11px] text-brand-dim dark:text-stone-400 block">
                            {b.tanggalLabel} • {b.slots.map((s) => s.jam).join(', ')} ({b.slots.length} Jam)
                          </span>
                        </td>

                        <td className="py-3.5 px-4 space-y-0.5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-mono font-bold text-brand-ink dark:text-white">{formatRupiah(b.nominalDibayar)}</span>
                            <Badge variant={b.tipePembayaran === 'lunas' ? 'success' : 'warning'} size="sm">
                              {b.tipePembayaran === 'lunas' ? 'Lunas' : 'DP 50%'}
                            </Badge>
                          </div>
                          <span className="text-[10px] text-brand-dim uppercase font-mono block">
                            Metode: {b.metodePembayaran}
                          </span>
                          {b.tipePembayaran === 'dp' && b.sisaPelunasan > 0 && b.status === 'confirmed' && (
                            <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold block">
                              Sisa Kasir: {formatRupiah(b.sisaPelunasan)}
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          {b.status === 'confirmed' ? (
                            <Badge variant="success">Terkonfirmasi</Badge>
                          ) : b.status === 'selesai' ? (
                            <Badge variant="blue">Lunas Kasir</Badge>
                          ) : b.status === 'menunggu_verifikasi' ? (
                            <Badge variant="warning">Perlu Verifikasi</Badge>
                          ) : b.status === 'menunggu_pembayaran' ? (
                            <Badge variant="warning">Batas 10m</Badge>
                          ) : b.status === 'ditolak' ? (
                            <Badge variant="danger">{b.refundStatus === 'selesai_refund' ? 'Refund Selesai' : 'Ditolak'}</Badge>
                          ) : (
                            <Badge variant="neutral">Batal/Expire</Badge>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedBookingForDetail(b)}
                            className="text-xs"
                          >
                            <Eye className="w-3.5 h-3.5 mr-1" />
                            <span>Detail</span>
                          </Button>

                          {b.status === 'menunggu_pembayaran' && (
                            <>
                              <Button
                                type="button"
                                variant="primary"
                                size="sm"
                                onClick={() => handleKonfirmasi(b)}
                                className="text-xs shadow-sm"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                                <span>Bayar Kasir</span>
                              </Button>
                              <Button
                                type="button"
                                variant="danger"
                                size="sm"
                                onClick={() => handleTolakClick(b)}
                                className="text-xs"
                              >
                                <span>Batal</span>
                              </Button>
                            </>
                          )}

                          {b.status === 'menunggu_verifikasi' && (
                            <>
                              <Button
                                type="button"
                                variant="primary"
                                size="sm"
                                onClick={() => handleKonfirmasi(b)}
                                className="text-xs shadow-sm"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                                <span>Setujui</span>
                              </Button>
                              <Button
                                type="button"
                                variant="danger"
                                size="sm"
                                onClick={() => handleTolakClick(b)}
                                className="text-xs"
                              >
                                <span>Tolak/Refund</span>
                              </Button>
                            </>
                          )}

                          {b.status === 'confirmed' && b.tipePembayaran === 'dp' && b.sisaPelunasan > 0 && (
                            <Button
                              type="button"
                              variant="blue"
                              size="sm"
                              onClick={() => handlePelunasanKasir(b)}
                              className="text-xs"
                            >
                              <DollarSign className="w-3.5 h-3.5 mr-1" />
                              <span>Pelunasan</span>
                            </Button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleCetakStruk(b)}
                            className="p-2 rounded-lg bg-brand-bg dark:bg-brand-navy/60 hover:bg-brand-line text-brand-dim transition-colors cursor-pointer inline-block border border-brand-line dark:border-white/10"
                            title="Cetak Struk Transaksi / PDF"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>

          {/* FORM WALK-IN PEMESANAN DI TEMPAT */}
          <div className="bg-white dark:bg-brand-navy/30 rounded-2xl border-[1.5px] border-brand-line dark:border-white/10 p-6 space-y-6 shadow-sm">
            <div className="flex items-center gap-2.5 pb-4 border-b border-brand-line dark:border-white/10">
              <div className="w-8 h-8 rounded-xl bg-brand-navy text-brand-lime flex items-center justify-center font-bold">
                <Plus className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-bebas text-2xl text-brand-ink dark:text-white uppercase leading-none">
                  Input Walk-in Booking (Pemesanan di Tempat)
                </h2>
                <p className="font-sora text-xs text-brand-dim dark:text-stone-400">
                  Gunakan saat ada tim yang datang langsung ke meja kasir untuk sewa lapangan.
                </p>
              </div>
            </div>

            <form onSubmit={handleWalkInSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-sora">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-brand-dim uppercase block">
                  Nama Tim / Pemesan
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Spartan FC"
                  value={walkInNama}
                  onChange={(e) => setWalkInNama(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-brand-navy/50 border-[1.5px] border-brand-line dark:border-white/10 text-xs font-semibold text-brand-ink dark:text-white outline-none focus:border-brand-blue"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-brand-dim uppercase block">
                  Nomor WhatsApp
                </label>
                <input
                  type="tel"
                  placeholder="0812xxxx"
                  value={walkInHp}
                  onChange={(e) => setWalkInHp(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-brand-navy/50 border-[1.5px] border-brand-line dark:border-white/10 text-xs font-semibold text-brand-ink dark:text-white outline-none focus:border-brand-blue"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-brand-dim uppercase block">
                  Pilih Lapangan
                </label>
                <select
                  value={walkInLapangan}
                  onChange={(e) => setWalkInLapangan(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-brand-navy/50 border-[1.5px] border-brand-line dark:border-white/10 text-xs font-semibold text-brand-ink dark:text-white outline-none cursor-pointer"
                >
                  <option value="Lapangan 1">Lapangan 1 (Interlock)</option>
                  <option value="Lapangan 2">Lapangan 2 (Taraflex)</option>
                  <option value="Lapangan 3">Lapangan 3 (Polypropylene)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-brand-dim uppercase block">
                  Jam Main (08:00 - 00:00)
                </label>
                <select
                  value={walkInJam}
                  onChange={(e) => setWalkInJam(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-brand-navy/50 border-[1.5px] border-brand-line dark:border-white/10 text-xs font-semibold text-brand-ink dark:text-white outline-none cursor-pointer"
                >
                  {JAM_OPERASIONAL.map((slot) => {
                    const isMalam = parseInt(slot.slice(0, 2)) >= 17;
                    return (
                      <option key={slot} value={slot}>
                        {slot} ({isMalam ? 'Malam - Rp 170k' : 'Siang - Rp 150k'})
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-brand-dim uppercase block">
                  Tipe Pembayaran
                </label>
                <select
                  value={walkInTipeBayar}
                  onChange={(e) => setWalkInTipeBayar(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-brand-navy/50 border-[1.5px] border-brand-line dark:border-white/10 text-xs font-semibold text-brand-ink dark:text-white outline-none cursor-pointer"
                >
                  <option value="lunas">Lunas (100%)</option>
                  <option value="dp">DP (50% Uang Muka)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-brand-dim uppercase block">
                  Metode Bayar
                </label>
                <select
                  value={walkInMetode}
                  onChange={(e) => setWalkInMetode(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-brand-navy/50 border-[1.5px] border-brand-line dark:border-white/10 text-xs font-semibold text-brand-ink dark:text-white outline-none cursor-pointer"
                >
                  <option value="qris">QRIS Meja Kasir</option>
                  <option value="bca">Transfer Bank Kasir</option>
                </select>
              </div>

              <div className="sm:col-span-2 flex items-end">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full font-bebas text-lg tracking-wider uppercase shadow-hard-navy"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  <span>Simpan Booking & Kunci Jadwal</span>
                </Button>
              </div>
            </form>
          </div>

        </main>
      </div>

      {/* MODAL DETAIL LENGKAP BOOKING */}
      {selectedBookingForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-brand-navy/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white dark:bg-brand-navy w-full max-w-2xl rounded-2xl shadow-hard-navy-lg border-[1.5px] border-brand-line dark:border-white/10 overflow-hidden my-auto space-y-6 p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-brand-line dark:border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-navy text-brand-lime flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bebas text-2xl text-brand-ink dark:text-white uppercase leading-none">
                    Detail Verifikasi Booking #{selectedBookingForDetail.id}
                  </h3>
                  <span className="text-[11px] text-brand-dim">
                    Dibuat: {selectedBookingForDetail.createdAt ? new Date(selectedBookingForDetail.createdAt).toLocaleString('id-ID') : '-'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBookingForDetail(null)}
                className="p-1 rounded-lg text-brand-dim hover:text-brand-ink dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-brand-bg dark:bg-brand-navy/50 border border-brand-line dark:border-white/10">
              <span className="text-xs font-bold text-brand-dim uppercase tracking-wider">Status Reservasi:</span>
              <Badge variant="navy">#{selectedBookingForDetail.status.toUpperCase()}</Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sora">
              <div className="p-4 rounded-xl bg-brand-bg dark:bg-brand-navy/50 border border-brand-line dark:border-white/10 space-y-2">
                <span className="font-bold text-brand-ink dark:text-white uppercase tracking-wider block text-[11px]">
                  Informasi Penyewa:
                </span>
                <div className="space-y-1 text-brand-dim dark:text-stone-300">
                  <div className="flex justify-between">
                    <span>Nama:</span>
                    <strong className="text-brand-ink dark:text-white">{selectedBookingForDetail.namaPenyewa}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>WhatsApp:</span>
                    <strong className="text-brand-blue dark:text-brand-lime font-mono">{selectedBookingForDetail.noHp}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Email:</span>
                    <span>{selectedBookingForDetail.email}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-brand-bg dark:bg-brand-navy/50 border border-brand-line dark:border-white/10 space-y-2">
                <span className="font-bold text-brand-ink dark:text-white uppercase tracking-wider block text-[11px]">
                  Jadwal Lapangan:
                </span>
                <div className="space-y-1 text-brand-dim dark:text-stone-300">
                  <div className="flex justify-between">
                    <span>Venue:</span>
                    <strong className="text-brand-ink dark:text-white">{formatCourtLabel(selectedBookingForDetail)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Tanggal:</span>
                    <strong>{selectedBookingForDetail.tanggalLabel}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Jam:</span>
                    <strong>{selectedBookingForDetail.slots.length} Jam</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-brand-bg dark:bg-brand-navy/50 border border-brand-line dark:border-white/10 space-y-1.5 text-xs font-sora">
              <div className="flex justify-between font-bold text-brand-ink dark:text-white">
                <span>Total Tagihan:</span>
                <span className="font-bebas text-2xl text-brand-blue dark:text-brand-lime leading-none">{formatRupiah(selectedBookingForDetail.totalAkhir)}</span>
              </div>
              <div className="flex justify-between text-brand-dim">
                <span>Diterima ({selectedBookingForDetail.tipePembayaran.toUpperCase()}):</span>
                <span className="font-bold text-brand-ink dark:text-white">{formatRupiah(selectedBookingForDetail.nominalDibayar)}</span>
              </div>
              {selectedBookingForDetail.sisaPelunasan > 0 && (
                <div className="flex justify-between text-amber-700 dark:text-amber-400 font-bold">
                  <span>Sisa Pelunasan Kasir:</span>
                  <span>{formatRupiah(selectedBookingForDetail.sisaPelunasan)}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 pt-2 border-t border-brand-line dark:border-white/10">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleCetakStruk(selectedBookingForDetail)}
                className="font-bebas text-base uppercase tracking-wider"
              >
                <Printer className="w-4 h-4 mr-1" />
                <span>Cetak Struk Resmi</span>
              </Button>

              <div className="flex items-center gap-2">
                {(selectedBookingForDetail.status === 'menunggu_verifikasi' || selectedBookingForDetail.status === 'menunggu_pembayaran') && (
                  <>
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => handleTolakClick(selectedBookingForDetail)}
                    >
                      Tolak / Refund
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={() => handleKonfirmasi(selectedBookingForDetail)}
                      className="font-bebas text-base uppercase tracking-wider shadow-hard-navy"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      <span>Setujui</span>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL REFUND KASIR */}
      {refundBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-brand-navy/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white dark:bg-brand-navy w-full max-w-lg rounded-2xl shadow-hard-navy-lg border-[1.5px] border-brand-line dark:border-white/10 overflow-hidden my-auto p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-brand-line dark:border-white/10 pb-3">
              <h3 className="font-bebas text-xl text-brand-ink dark:text-white uppercase">
                Proses Refund & Tolak Pesanan #{refundBooking.id}
              </h3>
              <button
                type="button"
                onClick={() => setRefundBooking(null)}
                className="p-1 rounded-lg text-brand-dim hover:text-brand-ink dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-brand-bg dark:bg-brand-navy/50 border border-brand-line dark:border-white/10 text-xs space-y-1.5 font-sora">
              <div className="flex justify-between">
                <span>Nama:</span>
                <strong>{refundBooking.namaPenyewa}</strong>
              </div>
              <div className="flex justify-between">
                <span>Nominal Masuk:</span>
                <strong className="text-brand-blue dark:text-brand-lime font-mono">{formatRupiah(refundBooking.nominalDibayar)}</strong>
              </div>
            </div>

            <div className="space-y-3 font-sora text-xs">
              <div>
                <label className="font-bold text-brand-dim uppercase block mb-1">
                  Nominal Pengembalian Dana:
                </label>
                <input
                  type="number"
                  value={refundNominalInput}
                  onChange={(e) => setRefundNominalInput(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-brand-navy/50 border-[1.5px] border-brand-line dark:border-white/10 font-bold text-brand-ink dark:text-white outline-none focus:border-brand-blue"
                />
              </div>

              <div>
                <label className="font-bold text-brand-dim uppercase block mb-1">
                  Alasan Penolakan:
                </label>
                <textarea
                  rows={3}
                  value={refundCatatanInput}
                  onChange={(e) => setRefundCatatanInput(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-brand-navy/50 border-[1.5px] border-brand-line dark:border-white/10 text-brand-ink dark:text-white outline-none focus:border-brand-blue"
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-2.5 pt-2 border-t border-brand-line dark:border-white/10">
              <button
                type="button"
                onClick={handleTolakTanpaRefund}
                className="text-xs text-brand-dim hover:text-rose-600 font-semibold cursor-pointer"
              >
                Tolak Tanpa Refund
              </button>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={handleConfirmRefund}
                  className="font-bebas text-base uppercase tracking-wider"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  <span>Selesaikan Refund</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CETAK STRUK RESMI */}
      {selectedBookingForPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-brand-navy/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white dark:bg-brand-navy w-full max-w-lg rounded-2xl shadow-hard-navy-lg border-[1.5px] border-brand-line dark:border-white/10 overflow-hidden my-auto p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-brand-line dark:border-white/10 pb-3">
              <span className="font-bebas text-lg uppercase">
                Pratinjau Struk Bukti Booking
              </span>
              <button
                type="button"
                onClick={() => setSelectedBookingForPrint(null)}
                className="p-1 rounded-lg text-brand-dim hover:text-brand-ink dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div id="printable-area" className="p-6 bg-white border-[1.5px] border-brand-line rounded-xl text-stone-900 font-mono text-xs space-y-4 shadow-sm">
              <div className="text-center space-y-1 border-b-2 border-dashed border-stone-300 pb-4">
                <h2 className="font-bebas text-xl tracking-tight text-brand-navy">
                  FUTSALHUB ARENA RESMI
                </h2>
                <p className="text-[10px] text-stone-600 font-sora">
                  Kawasan Olahraga Terpadu, Tangerang Selatan
                </p>
                <p className="text-[10px] text-stone-600 font-sora">
                  Hotline: 0896-1725-1030
                </p>
              </div>

              <div className="space-y-1 text-[11px] border-b border-stone-200 pb-3">
                <div className="flex justify-between">
                  <span>No. Booking:</span>
                  <span className="font-bold">#{selectedBookingForPrint.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pemesan:</span>
                  <span className="font-bold">{selectedBookingForPrint.namaPenyewa}</span>
                </div>
                <div className="flex justify-between">
                  <span>Venue:</span>
                  <span className="font-bold">{formatCourtLabel(selectedBookingForPrint)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tanggal:</span>
                  <span>{selectedBookingForPrint.tanggalLabel}</span>
                </div>
              </div>

              <div className="space-y-1.5 text-[11px] border-b-2 border-dashed border-stone-300 pb-3">
                <div className="flex justify-between font-bold text-sm text-stone-900">
                  <span>TOTAL TAGIHAN:</span>
                  <span>{formatRupiah(selectedBookingForPrint.totalAkhir)}</span>
                </div>
                <div className="flex justify-between font-bold text-brand-blue">
                  <span>DIBAYAR:</span>
                  <span>{formatRupiah(selectedBookingForPrint.nominalDibayar)}</span>
                </div>
                {selectedBookingForPrint.sisaPelunasan > 0 && (
                  <div className="flex justify-between font-bold text-amber-800">
                    <span>SISA DI KASIR:</span>
                    <span>{formatRupiah(selectedBookingForPrint.sisaPelunasan)}</span>
                  </div>
                )}
              </div>

              <div className="text-center space-y-1 pt-1 text-[10px] text-stone-500 font-sora">
                <p className="font-bold text-stone-800">
                  *** TERIMA KASIH TELAH BERMAIN DI FUTSALHUB ***
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedBookingForPrint(null)}
                className="px-4 py-2 text-xs font-semibold text-brand-dim hover:text-brand-ink cursor-pointer"
              >
                Tutup
              </button>

              <Button
                type="button"
                variant="primary"
                onClick={() => window.print()}
                className="font-bebas text-base uppercase tracking-wider shadow-hard-navy"
              >
                <Printer className="w-4 h-4 mr-1" />
                <span>Cetak Struk / PDF</span>
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
