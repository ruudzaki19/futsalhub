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
  Trash2
} from 'lucide-react';
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
    // Bersihkan semua data fiktif lama, simpan data riil pengguna (seperti Ruud Zaki)
    const sanitized = list.filter((b) => 
      !['Rian Pratama', 'Dimas Anggara', 'Fajar Kurnia'].includes(b.namaPenyewa) && b.id !== 'FH-8832'
    );
    setBookings(sanitized);
  };

  // Real-time listener & periodic auto check
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

  // Filter Bookings
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

  // Data Live Status untuk 3 Lapangan pada tanggal monitorDate
  const court1Status = useMemo(() => getSlotLiveDetailsForCourt(1, monitorDate), [monitorDate, bookings]);
  const court2Status = useMemo(() => getSlotLiveDetailsForCourt(2, monitorDate), [monitorDate, bookings]);
  const court3Status = useMemo(() => getSlotLiveDetailsForCourt(3, monitorDate), [monitorDate, bookings]);

  // Handler Verifikasi / Konfirmasi Pembayaran
  const handleKonfirmasi = (booking: BookingRecord) => {
    updateBookingStatus(booking.id, 'confirmed');
    if (selectedBookingForDetail?.id === booking.id) {
      setSelectedBookingForDetail({ ...selectedBookingForDetail, status: 'confirmed' });
    }
  };

  // Handler Tolak Pembayaran / Buka Modal Refund
  const handleTolakClick = (booking: BookingRecord) => {
    // Jika pesanan sudah sempat melakukan konfirmasi / transfer (klaim verifikasi atau sudah confirmed),
    // berikan modal Refund resmi kepada Admin Kasir
    if (booking.status === 'menunggu_verifikasi' || booking.status === 'confirmed' || booking.status === 'selesai') {
      setRefundBooking(booking);
      setRefundNominalInput(booking.nominalDibayar);
      setRefundCatatanInput('Jadwal dialihkan / maintenance lapangan. Dana dikembalikan 100%.');
    } else {
      // Jika status masih menunggu_pembayaran / kadaluarsa / dibatalkan, langsung tolak tanpa refund
      updateBookingStatus(booking.id, 'ditolak');
      if (selectedBookingForDetail?.id === booking.id) {
        setSelectedBookingForDetail({ ...selectedBookingForDetail, status: 'ditolak' });
      }
    }
  };

  // Konfirmasi Proses Refund
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

  // Tolak Tanpa Refund (Kasir memastikan uang memang belum masuk)
  const handleTolakTanpaRefund = () => {
    if (!refundBooking) return;
    updateBookingStatus(refundBooking.id, 'ditolak', { refundStatus: 'none' });
    if (selectedBookingForDetail?.id === refundBooking.id) {
      setSelectedBookingForDetail({ ...selectedBookingForDetail, status: 'ditolak', refundStatus: 'none' });
    }
    setRefundBooking(null);
  };

  // Handler Pelunasan Kasir di Tempat untuk Tim DP
  const handlePelunasanKasir = (booking: BookingRecord) => {
    updateBookingStatus(booking.id, 'selesai', { sisaPelunasan: 0 });
    if (selectedBookingForDetail?.id === booking.id) {
      setSelectedBookingForDetail({ ...selectedBookingForDetail, status: 'selesai', sisaPelunasan: 0 });
    }
  };

  // Handler Cetak Struk
  const handleCetakStruk = (booking: BookingRecord) => {
    setSelectedBookingForPrint(booking);
  };

  // Handler Walk-in Booking
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

  // Helper tampilan nama lapangan yang bersih (mencegah "2 Lapangan")
  const formatCourtLabel = (b: BookingRecord) => {
    if (b.lapanganNama && !b.lapanganNama.startsWith('2 Lapangan') && !b.lapanganNama.startsWith('3 Lapangan')) {
      return b.lapanganNama;
    }
    const totalJam = b.slots.length;
    return `Lapangan ${b.lapanganId || 1} (${totalJam} Jam)`;
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-stone-900 font-sans selection:bg-emerald-500 selection:text-white pb-16">
      
      {/* HEADER KHUSUS DASHBOARD ADMIN KASIR (Tanpa Navbar Publik) */}
      <header className="bg-stone-900 text-white sticky top-0 z-30 shadow-md border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center font-black text-white text-base shadow-sm">
              FH
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-black tracking-tight text-white">
                  FutsalHub Kasir & Operasional
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                  Desk Kasir Aktif
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Operator: <span className="text-stone-200 font-semibold">{currentUser.nama}</span> ({currentUser.email})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold transition-all border border-stone-700"
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

      {/* Konten Utama Kasir */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        
        {/* Ringkasan Antrean Kasir & Detail Total Transaksi */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
            <span className="text-xs text-stone-500 font-semibold block">Menunggu Verifikasi</span>
            <span className="text-2xl font-black text-amber-600">
              {bookings.filter((b) => b.status === 'menunggu_verifikasi').length}
            </span>
            <span className="text-[10px] text-stone-400 block mt-1">Perlu pengecekan mutasi transfer</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
            <span className="text-xs text-stone-500 font-semibold block">Booking Terkonfirmasi</span>
            <span className="text-2xl font-black text-emerald-600">
              {bookings.filter((b) => b.status === 'confirmed').length}
            </span>
            <span className="text-[10px] text-stone-400 block mt-1">Jadwal resmi terkunci & siap main</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
            <span className="text-xs text-stone-500 font-semibold block">Uang Muka (DP Aktif)</span>
            <span className="text-2xl font-black text-blue-600">
              {bookings.filter((b) => b.tipePembayaran === 'dp' && b.status === 'confirmed').length}
            </span>
            <span className="text-[10px] text-stone-400 block mt-1">Sisa pelunasan di meja kasir</span>
          </div>

          {/* DETAIL STATS CARD: TOTAL TRANSAKSI MASUK DENGAN SUB-RINCIAN RESMI */}
          <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-stone-500 font-semibold block">Total Transaksi Masuk</span>
                <span className="text-2xl font-black text-stone-900">
                  {bookings.length}
                </span>
              </div>
              <div className="w-8 h-8 rounded-xl bg-stone-100 flex items-center justify-center text-stone-600">
                <Receipt className="w-4 h-4" />
              </div>
            </div>

            {/* Sub-Pills Rincian */}
            <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-stone-100 text-[10px] font-semibold">
              <span className="text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center justify-between">
                <span>Terkonfirmasi:</span>
                <strong>{bookings.filter(b => b.status === 'confirmed' || b.status === 'selesai').length}</strong>
              </span>
              <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md flex items-center justify-between">
                <span>Menunggu:</span>
                <strong>{bookings.filter(b => b.status === 'menunggu_verifikasi' || b.status === 'menunggu_pembayaran').length}</strong>
              </span>
              <span className="text-stone-700 bg-stone-100 px-2 py-0.5 rounded-md flex items-center justify-between">
                <span>Batal / Expire:</span>
                <strong>{bookings.filter(b => b.status === 'dibatalkan' || b.status === 'kadaluarsa').length}</strong>
              </span>
              <span className="text-red-800 bg-red-50 px-2 py-0.5 rounded-md flex items-center justify-between">
                <span>Ditolak / Refund:</span>
                <strong>{bookings.filter(b => b.status === 'ditolak').length}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* SECTION BARU: PAPAN MONITORING KETERSEDIAAN 3 LAPANGAN REAL-TIME */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 mb-2">
                <Layers className="w-3.5 h-3.5 text-emerald-600" />
                <span>Papan Monitoring Ketersediaan 3 Lapangan Real-Time</span>
              </div>
              <h2 className="text-lg font-black text-stone-900">
                Visualisasi Slot 3 Lapangan (08:00 - 00:00)
              </h2>
              <p className="text-xs text-stone-500">
                Lihat slot mana saja yang kosong, sedang dipesan 10 menit, atau terisi nama tim penyewa. Klik pada slot terisi untuk membuka detail transaksi.
              </p>
            </div>

            {/* Filter Tanggal Monitoring */}
            <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-stone-100 border border-stone-200 text-xs self-start sm:self-auto">
              <Calendar className="w-4 h-4 text-emerald-700" />
              <span className="font-bold text-stone-600">Tanggal:</span>
              <input
                type="date"
                value={monitorDate}
                onChange={(e) => setMonitorDate(e.target.value)}
                className="bg-transparent font-bold text-stone-900 outline-none cursor-pointer"
              />
            </div>
          </div>

          {/* Legenda Monitoring Kasir */}
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-stone-100 border border-stone-300" />
              <span className="text-stone-600">⚪ Kosong (Siap Disewa)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-amber-400 border border-amber-500 animate-pulse" />
              <span className="text-amber-700 font-bold">🟠 Sedang Dipesan 10 Mnt (Hold)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-emerald-600 border border-emerald-700" />
              <span className="text-emerald-800 font-bold">🟢 Terisi / Terkonfirmasi (Ada Tim)</span>
            </div>
          </div>

          {/* Grid 3 Kolom Lapangan */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { id: 1, nama: 'Lapangan 1', spek: 'Vinyl Interlock Standard Turnamen', statusDict: court1Status },
              { id: 2, nama: 'Lapangan 2', spek: 'Vinyl Peredam Kejut Maksimal', statusDict: court2Status },
              { id: 3, nama: 'Lapangan 3', spek: 'Vinyl Grip Optimal Indoor', statusDict: court3Status },
            ].map((court) => (
              <div key={court.id} className="rounded-2xl border border-stone-200 bg-stone-50/50 p-4 space-y-3">
                <div className="border-b border-stone-200 pb-2.5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-stone-900 text-sm">{court.nama}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                      Venue #{court.id}
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-500 block mt-0.5">{court.spek}</span>
                </div>

                {/* 16 Baris Slot */}
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
                        className={`p-2.5 rounded-xl border text-xs transition-all ${
                          isTerisi
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-950 hover:bg-emerald-100 cursor-pointer shadow-xs'
                            : isLocked10
                            ? 'bg-amber-50 border-amber-300 text-amber-950 hover:bg-amber-100 cursor-pointer shadow-xs'
                            : 'bg-white border-stone-200/80 text-stone-500'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-[11px]">{slotJam}</span>
                          {isTerisi ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-600 text-white flex items-center gap-1">
                              <span>✓ Terisi</span>
                            </span>
                          ) : isLocked10 ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-white flex items-center gap-1 animate-pulse">
                              <Clock className="w-2.5 h-2.5" />
                              <span>Hold 10 Mnt</span>
                            </span>
                          ) : (
                            <span className="text-[10px] text-stone-400 font-medium">
                              Kosong (Tersedia)
                            </span>
                          )}
                        </div>

                        {/* Nama Tim / Pemesan Jika Terisi atau Locked */}
                        {b && (
                          <div className="mt-1 pt-1 border-t border-black/5 flex items-center justify-between text-[11px]">
                            <span className="font-bold truncate max-w-[170px]">
                              ⚽ {b.namaPenyewa}
                            </span>
                            <span className="text-[10px] text-stone-500 font-mono">
                              #{b.id} ({b.tipePembayaran.toUpperCase()})
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

        {/* Section 1: Antrean Verifikasi Booking Pelanggan */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-xs space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div>
              <h2 className="text-lg font-black text-stone-900">
                Antrean & Data Booking Masuk
              </h2>
              <p className="text-xs text-stone-500">
                Seluruh transaksi online yang dibuat pelanggan via Checkout Website FutsalHub
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Cari ID / Nama / No HP..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 outline-none w-48 sm:w-56"
                />
              </div>

              {/* Refresh */}
              <button
                type="button"
                onClick={loadBookings}
                className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
                title="Muat ulang data"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              {/* Reset Transaksi ke 0 */}
              <button
                type="button"
                onClick={() => {
                  if (confirm('Apakah Anda ingin mengosongkan seluruh antrean transaksi dan mengembalikan seluruh jadwal lapangan menjadi TERSEDIA?')) {
                    clearAllBookings();
                    loadBookings();
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold transition-all cursor-pointer"
                title="Kosongkan seluruh transaksi & jadikan seluruh jadwal tersedia"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset 0 Transaksi</span>
              </button>
            </div>
          </div>

          {/* Filter Status Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold">
            {['semua', 'menunggu', 'belum_bayar', 'confirmed', 'dp', 'batal', 'ditolak'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setFilterStatus(st)}
                className={`px-3.5 py-1.5 rounded-xl capitalize cursor-pointer transition-all ${
                  filterStatus === st
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {st === 'menunggu' ? 'Menunggu Verifikasi' : 
                 st === 'belum_bayar' ? 'Belum Bayar' : 
                 st === 'dp' ? 'DP Belum Lunas' :
                 st === 'batal' ? 'Batal / Kadaluarsa' : st}
              </button>
            ))}
          </div>

          {/* Tabel / List Antrean */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 font-bold uppercase tracking-wider border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">ID Booking</th>
                  <th className="py-3 px-4">Penyewa & Kontak</th>
                  <th className="py-3 px-4">Lapangan & Slot Jam</th>
                  <th className="py-3 px-4">Pembayaran</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi Kasir</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-stone-400">
                      Tidak ada data booking yang sesuai dengan filter.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                        {b.id}
                        <span className="block text-[10px] font-normal text-stone-400">
                          {b.createdAt ? new Date(b.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 space-y-0.5">
                        <span className="font-bold text-stone-900 block">{b.namaPenyewa}</span>
                        <a
                          href={`https://wa.me/${b.noHp.replace(/^0/, '62')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-emerald-700 hover:underline flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{b.noHp}</span>
                        </a>
                      </td>

                      <td className="py-3.5 px-4 space-y-0.5">
                        <span className="font-bold text-stone-800 block">
                          {formatCourtLabel(b)}
                        </span>
                        <span className="text-[11px] text-stone-500 block">
                          {b.tanggalLabel} • {b.slots.map((s) => s.jam).join(', ')} ({b.slots.length} Jam)
                        </span>
                      </td>

                      {/* KOLOM PEMBAYARAN AKURAT: TIDAK ADA STATUS LUNAS PALSU UNTUK BATAL/DITOLAK */}
                      <td className="py-3.5 px-4 space-y-0.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {b.status === 'dibatalkan' ? (
                            <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-stone-100 text-stone-500 border border-stone-200">
                              BATAL (Tidak Ada Pembayaran)
                            </span>
                          ) : b.status === 'kadaluarsa' ? (
                            <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-stone-100 text-stone-500 border border-stone-200">
                              KADALUARSA (Batas 10 Mnt Habis)
                            </span>
                          ) : b.status === 'ditolak' ? (
                            b.refundStatus === 'selesai_refund' ? (
                              <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                                REFUND SELESAI ({formatRupiah(b.refundNominal || b.nominalDibayar)})
                              </span>
                            ) : (
                              <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-red-50 text-red-700 border border-red-200">
                                DITOLAK (Tanpa Pembayaran)
                              </span>
                            )
                          ) : b.status === 'menunggu_pembayaran' ? (
                            <>
                              <span className="font-bold text-amber-700">{formatRupiah(b.nominalDibayar)}</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                                BELUM DIBAYAR (Batas 10 Mnt)
                              </span>
                            </>
                          ) : b.status === 'menunggu_verifikasi' ? (
                            <>
                              <span className="font-bold text-stone-900">{formatRupiah(b.nominalDibayar)}</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-yellow-100 text-yellow-800 border border-yellow-300">
                                KLAIM {b.tipePembayaran === 'lunas' ? 'LUNAS' : 'DP 50%'} (CEK MUTASI)
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="font-bold text-stone-900">{formatRupiah(b.nominalDibayar)}</span>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                                b.tipePembayaran === 'lunas' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-blue-100 text-blue-800 border border-blue-300'
                              }`}>
                                {b.tipePembayaran === 'lunas' ? 'LUNAS TERKONFIRMASI' : 'DP 50% MASUK'}
                              </span>
                            </>
                          )}
                        </div>

                        <span className="text-[10px] text-stone-400 uppercase font-mono block">
                          Metode: {b.metodePembayaran}
                        </span>

                        {b.tipePembayaran === 'dp' && b.sisaPelunasan > 0 && b.status === 'confirmed' && (
                          <span className="text-[10px] text-amber-700 font-bold block">
                            Sisa Kasir: {formatRupiah(b.sisaPelunasan)}
                          </span>
                        )}
                      </td>

                      {/* KOLOM STATUS */}
                      <td className="py-3.5 px-4">
                        {b.status === 'menunggu_pembayaran' ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-300 animate-pulse">
                            Menunggu Pembayaran (10 Mnt)
                          </span>
                        ) : b.status === 'menunggu_verifikasi' ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-yellow-50 text-yellow-800 border border-yellow-300">
                            Perlu Verifikasi Kasir
                          </span>
                        ) : b.status === 'confirmed' ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            Terkonfirmasi
                          </span>
                        ) : b.status === 'selesai' ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-stone-100 text-stone-800 border border-stone-200">
                            Lunas Kasir
                          </span>
                        ) : b.status === 'dibatalkan' ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-stone-100 text-stone-500 border border-stone-200">
                            Dibatalkan
                          </span>
                        ) : b.status === 'kadaluarsa' ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-stone-100 text-stone-500 border border-stone-200">
                            Kadaluarsa
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-50 text-red-800 border border-red-200">
                            {b.refundStatus === 'selesai_refund' ? 'Ditolak & Refund' : 'Ditolak'}
                          </span>
                        )}
                      </td>

                      {/* KOLOM AKSI KASIR */}
                      <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                        {/* Tombol Lihat Detail */}
                        <button
                          type="button"
                          onClick={() => setSelectedBookingForDetail(b)}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] transition-all cursor-pointer inline-flex items-center gap-1 border border-emerald-200"
                          title="Lihat Detail Lengkap Pemesanan"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Detail</span>
                        </button>

                        {b.status === 'menunggu_pembayaran' && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleKonfirmasi(b)}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-all cursor-pointer inline-flex items-center gap-1 shadow-xs"
                              title="Pelanggan bayar langsung tunai/transfer di meja kasir"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Bayar di Kasir</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleTolakClick(b)}
                              className="px-2 py-1.5 rounded-lg bg-stone-100 hover:bg-red-50 text-stone-600 hover:text-red-700 font-bold text-[11px] transition-all cursor-pointer inline-flex items-center gap-1 border border-stone-200"
                              title="Batalkan pesanan ini"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Batal</span>
                            </button>
                          </>
                        )}

                        {b.status === 'menunggu_verifikasi' && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleKonfirmasi(b)}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-all cursor-pointer inline-flex items-center gap-1 shadow-xs"
                              title="Setujui dan kunci jadwal"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Setujui</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleTolakClick(b)}
                              className="px-2 py-1.5 rounded-lg bg-stone-100 hover:bg-red-50 text-stone-600 hover:text-red-700 font-bold text-[11px] transition-all cursor-pointer inline-flex items-center gap-1 border border-stone-200"
                              title="Tolak pesanan & proses refund jika dana masuk"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Tolak / Refund</span>
                            </button>
                          </>
                        )}

                        {b.status === 'confirmed' && b.tipePembayaran === 'dp' && b.sisaPelunasan > 0 && (
                          <button
                            type="button"
                            onClick={() => handlePelunasanKasir(b)}
                            className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] transition-all cursor-pointer inline-flex items-center gap-1 shadow-xs"
                            title="Terima pelunasan sisa DP di meja kasir"
                          >
                            <DollarSign className="w-3.5 h-3.5" />
                            <span>Pelunasan Kasir</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleCetakStruk(b)}
                          className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer inline-block"
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

        {/* Section 2: Form Walk-in Pemesanan Langsung di Meja Kasir */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-stone-100">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-stone-900">
                Input Walk-in Booking (Pemesanan di Tempat)
              </h2>
              <p className="text-xs text-stone-500">
                Gunakan saat ada tim yang datang langsung ke venue untuk sewa lapangan
              </p>
            </div>
          </div>

          <form onSubmit={handleWalkInSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-[11px] font-bold text-stone-500 uppercase block mb-1">
                Nama Tim / Pemesan
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Spartan FC"
                value={walkInNama}
                onChange={(e) => setWalkInNama(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold text-stone-900 outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-stone-500 uppercase block mb-1">
                Nomor WhatsApp
              </label>
              <input
                type="tel"
                placeholder="0812xxxx"
                value={walkInHp}
                onChange={(e) => setWalkInHp(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold text-stone-900 outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-stone-500 uppercase block mb-1">
                Pilih Lapangan
              </label>
              <select
                value={walkInLapangan}
                onChange={(e) => setWalkInLapangan(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold text-stone-900 outline-none cursor-pointer"
              >
                <option value="Lapangan 1">Lapangan 1</option>
                <option value="Lapangan 2">Lapangan 2</option>
                <option value="Lapangan 3">Lapangan 3</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-stone-500 uppercase block mb-1">
                Jam Main (08:00 - 00:00)
              </label>
              <select
                value={walkInJam}
                onChange={(e) => setWalkInJam(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold text-stone-900 outline-none cursor-pointer"
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

            <div>
              <label className="text-[11px] font-bold text-stone-500 uppercase block mb-1">
                Tipe Pembayaran
              </label>
              <select
                value={walkInTipeBayar}
                onChange={(e) => setWalkInTipeBayar(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold text-stone-900 outline-none cursor-pointer"
              >
                <option value="lunas">Lunas (100%)</option>
                <option value="dp">DP (50% Uang Muka)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-stone-500 uppercase block mb-1">
                Metode Bayar di Tempat
              </label>
              <select
                value={walkInMetode}
                onChange={(e) => setWalkInMetode(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold text-stone-900 outline-none cursor-pointer"
              >
                <option value="qris">QRIS Meja Kasir</option>
                <option value="bca">Transfer Bank Kasir</option>
              </select>
            </div>

            <div className="sm:col-span-2 flex items-end">
              <button
                type="submit"
                className="w-full py-2.5 px-5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs tracking-wide shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Simpan Booking & Kunci Jadwal</span>
              </button>
            </div>
          </form>
        </div>

      </main>

      {/* MODAL REFUND KASIR (PENGEMBALIAN DANA PELANGGAN RESMI) */}
      {refundBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-stone-900">
                    Proses Refund & Tolak Pesanan #{refundBooking.id}
                  </h3>
                  <span className="text-[10px] text-stone-500">
                    Pengembalian Dana ke Penyewa
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRefundBooking(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-stone-500">Nama Pemesan:</span>
                <strong className="text-stone-900">{refundBooking.namaPenyewa}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Nomor WhatsApp:</span>
                <strong className="text-emerald-700">{refundBooking.noHp}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Metode Bayar:</span>
                <strong className="uppercase">{refundBooking.metodePembayaran} ({refundBooking.kodeBayar})</strong>
              </div>
              <div className="flex justify-between border-t border-stone-200 pt-1 font-bold">
                <span className="text-stone-600">Total Telah Diterima:</span>
                <span className="text-emerald-700">{formatRupiah(refundBooking.nominalDibayar)}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-stone-600 uppercase block mb-1">
                  Nominal Pengembalian Dana (Rupiah):
                </label>
                <input
                  type="number"
                  value={refundNominalInput}
                  onChange={(e) => setRefundNominalInput(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold text-stone-900 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-600 uppercase block mb-1">
                  Alasan Penolakan & Catatan Refund untuk Pelanggan:
                </label>
                <textarea
                  rows={3}
                  value={refundCatatanInput}
                  onChange={(e) => setRefundCatatanInput(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 outline-none focus:border-emerald-500"
                  placeholder="Contoh: Jadwal bertabrakan / perbaikan teknis. Dana telah ditransfer balik 100% via BCA/GoPay."
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={handleTolakTanpaRefund}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 text-xs font-semibold cursor-pointer"
                title="Pilih jika uang memang belum pernah ditransfer oleh pemesan"
              >
                Tolak Tanpa Refund
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setRefundBooking(null)}
                  className="px-3 py-2 text-xs font-semibold text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmRefund}
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Selesaikan Refund & Tolak</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: LIHAT DETAIL LENGKAP BOOKING OLEH ADMIN */}
      {selectedBookingForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto space-y-6 p-6 sm:p-8">
            
            {/* Header Modal Detail */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-stone-900">
                    Detail Verifikasi Booking #{selectedBookingForDetail.id}
                  </h3>
                  <span className="text-[11px] text-stone-400">
                    Dibuat: {selectedBookingForDetail.createdAt ? new Date(selectedBookingForDetail.createdAt).toLocaleString('id-ID') : '-'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBookingForDetail(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status Booking Badge */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Status Reservasi:</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                selectedBookingForDetail.status === 'confirmed' 
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                  : selectedBookingForDetail.status === 'selesai'
                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                  : selectedBookingForDetail.status === 'ditolak'
                  ? 'bg-red-100 text-red-800 border border-red-300'
                  : selectedBookingForDetail.status === 'dibatalkan'
                  ? 'bg-stone-100 text-stone-600 border border-stone-300'
                  : selectedBookingForDetail.status === 'kadaluarsa'
                  ? 'bg-stone-100 text-stone-600 border border-stone-300'
                  : selectedBookingForDetail.status === 'menunggu_pembayaran'
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-yellow-100 text-yellow-800 border border-yellow-300'
              }`}>
                {selectedBookingForDetail.status === 'confirmed' 
                  ? 'Terkonfirmasi (Siap Main)'
                  : selectedBookingForDetail.status === 'selesai'
                  ? 'Lunas Kasir (Selesai)'
                  : selectedBookingForDetail.status === 'ditolak'
                  ? (selectedBookingForDetail.refundStatus === 'selesai_refund' ? 'Ditolak & Refund Selesai' : 'Ditolak')
                  : selectedBookingForDetail.status === 'dibatalkan'
                  ? 'Dibatalkan Pelanggan'
                  : selectedBookingForDetail.status === 'kadaluarsa'
                  ? 'Kadaluarsa (Batas 10 Mnt Habis)'
                  : selectedBookingForDetail.status === 'menunggu_pembayaran'
                  ? 'Menunggu Pembayaran Pelanggan (Batas 10 Mnt)'
                  : 'Menunggu Verifikasi Kasir'}
              </span>
            </div>

            {/* Rincian Refund jika ada */}
            {selectedBookingForDetail.refundStatus === 'selesai_refund' && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                <div className="flex items-center justify-between font-bold">
                  <span>Dana Telah Dikembalikan (Refund):</span>
                  <span>{formatRupiah(selectedBookingForDetail.refundNominal || selectedBookingForDetail.nominalDibayar)}</span>
                </div>
                <p className="text-[11px] text-emerald-800">
                  Catatan Admin: <em>{selectedBookingForDetail.refundCatatan}</em>
                </p>
              </div>
            )}

            {/* Konten Grid Data Lengkap */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              {/* Kolom 1: Data Penyewa */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2.5">
                <span className="font-black text-stone-900 uppercase tracking-wider block text-[11px]">
                  Informasi Penyewa:
                </span>
                <div className="space-y-1 text-stone-600">
                  <div className="flex justify-between">
                    <span className="text-stone-400">Nama Pemesan:</span>
                    <strong className="text-stone-900">{selectedBookingForDetail.namaPenyewa}</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-stone-400">WhatsApp:</span>
                    <a
                      href={`https://wa.me/${selectedBookingForDetail.noHp.replace(/^0/, '62')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-emerald-700 hover:underline flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{selectedBookingForDetail.noHp}</span>
                    </a>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Email:</span>
                    <span className="text-stone-800 font-semibold">{selectedBookingForDetail.email}</span>
                  </div>
                </div>
              </div>

              {/* Kolom 2: Informasi Venue & Jadwal */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2.5">
                <span className="font-black text-stone-900 uppercase tracking-wider block text-[11px]">
                  Jadwal Lapangan:
                </span>
                <div className="space-y-1 text-stone-600">
                  <div className="flex justify-between">
                    <span className="text-stone-400">Venue:</span>
                    <strong className="text-emerald-800 font-bold">{formatCourtLabel(selectedBookingForDetail)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Tanggal Main:</span>
                    <strong className="text-stone-900">{selectedBookingForDetail.tanggalLabel} ({selectedBookingForDetail.tanggal})</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Durasi:</span>
                    <strong className="text-stone-900">{selectedBookingForDetail.slots.length} Jam Bermain</strong>
                  </div>
                  <div className="pt-1 border-t border-stone-200">
                    <span className="text-[11px] text-stone-500 font-semibold">Slot Jam Terpilih:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedBookingForDetail.slots.map((s) => (
                        <span key={s.jam} className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          {s.jam} ({formatRupiah(s.harga)})
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Rincian Finansial & Pembayaran */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 text-xs">
              <span className="font-black text-stone-900 uppercase tracking-wider block text-[11px]">
                Rincian Pembayaran & Finansial:
              </span>
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal Sewa Lapangan:</span>
                  <span className="font-semibold">{formatRupiah(selectedBookingForDetail.subtotal)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Biaya Layanan Sistem:</span>
                  <span className="font-semibold">{formatRupiah(selectedBookingForDetail.biayaLayanan)}</span>
                </div>
                <div className="flex justify-between text-stone-900 font-bold pt-1 border-t border-stone-200">
                  <span>Total Tagihan:</span>
                  <span className="text-emerald-700 text-sm">{formatRupiah(selectedBookingForDetail.totalAkhir)}</span>
                </div>
                <div className="flex justify-between text-stone-600 pt-1">
                  <span>Skema Pembayaran:</span>
                  <span className="font-bold text-stone-900 uppercase">
                    {selectedBookingForDetail.tipePembayaran === 'lunas' ? 'LUNAS (100%)' : 'UANG MUKA (DP 50%)'}
                  </span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Metode Pembayaran:</span>
                  <span className="font-bold text-stone-900 uppercase font-mono">
                    {selectedBookingForDetail.metodePembayaran} ({selectedBookingForDetail.kodeBayar})
                  </span>
                </div>
                <div className="flex justify-between text-emerald-800 font-bold pt-1 border-t border-stone-200">
                  <span>Nominal Diterima:</span>
                  <span>{formatRupiah(selectedBookingForDetail.nominalDibayar)}</span>
                </div>
                {selectedBookingForDetail.sisaPelunasan > 0 && selectedBookingForDetail.status !== 'selesai' && (
                  <div className="flex justify-between text-amber-700 font-black">
                    <span>Sisa Pelunasan Meja Kasir:</span>
                    <span>{formatRupiah(selectedBookingForDetail.sisaPelunasan)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Aksi Verifikasi Kasir */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => {
                  handleCetakStruk(selectedBookingForDetail);
                }}
                className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition-all cursor-pointer inline-flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Struk Resmi / PDF</span>
              </button>

              <div className="flex items-center gap-2">
                {(selectedBookingForDetail.status === 'menunggu_verifikasi' || selectedBookingForDetail.status === 'menunggu_pembayaran') && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleTolakClick(selectedBookingForDetail)}
                      className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-red-50 text-stone-600 hover:text-red-700 font-bold text-xs transition-all cursor-pointer border border-stone-200"
                    >
                      Tolak / Refund
                    </button>
                    <button
                      type="button"
                      onClick={() => handleKonfirmasi(selectedBookingForDetail)}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all cursor-pointer shadow-md inline-flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{selectedBookingForDetail.status === 'menunggu_pembayaran' ? 'Konfirmasi Bayar Kasir' : 'Setujui & Konfirmasi'}</span>
                    </button>
                  </>
                )}

                {selectedBookingForDetail.status === 'confirmed' && selectedBookingForDetail.tipePembayaran === 'dp' && selectedBookingForDetail.sisaPelunasan > 0 && (
                  <button
                    type="button"
                    onClick={() => handlePelunasanKasir(selectedBookingForDetail)}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all cursor-pointer shadow-md inline-flex items-center gap-1.5"
                  >
                    <DollarSign className="w-4 h-4" />
                    <span>Terima Pelunasan Kasir</span>
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 2: CETAK STRUK RESMI / PDF */}
      {selectedBookingForPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto p-6 sm:p-8 space-y-6">
            
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Pratinjau Struk Bukti Booking
              </span>
              <button
                type="button"
                onClick={() => setSelectedBookingForPrint(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AREA CETAK RESMI (SESUAI DOKUMEN CETAK STRUK) */}
            <div id="printable-area" className="p-6 bg-white border border-stone-300 rounded-2xl text-stone-900 font-mono text-xs space-y-4 shadow-xs">
              
              {/* Header Struk */}
              <div className="text-center space-y-1 border-b-2 border-dashed border-stone-300 pb-4">
                <h2 className="text-lg font-black tracking-tight text-stone-900">
                  FUTSALHUB ARENA RESMI
                </h2>
                <p className="text-[10px] text-stone-600">
                  Kawasan Olahraga Terpadu, Tangerang Selatan
                </p>
                <p className="text-[10px] text-stone-600">
                  Hotline WhatsApp: 0896-1725-1030
                </p>
              </div>

              {/* Info Transaksi */}
              <div className="space-y-1 text-[11px] border-b border-stone-200 pb-3">
                <div className="flex justify-between">
                  <span>No. Booking:</span>
                  <span className="font-bold">{selectedBookingForPrint.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Waktu Cetak:</span>
                  <span>{new Date().toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Kasir/Operator:</span>
                  <span>{currentUser.nama}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pemesan:</span>
                  <span className="font-bold">{selectedBookingForPrint.namaPenyewa}</span>
                </div>
                <div className="flex justify-between">
                  <span>WhatsApp:</span>
                  <span>{selectedBookingForPrint.noHp}</span>
                </div>
              </div>

              {/* Rincian Sewa */}
              <div className="space-y-1 text-[11px] border-b border-stone-200 pb-3">
                <div className="flex justify-between">
                  <span>Venue:</span>
                  <span className="font-bold">{formatCourtLabel(selectedBookingForPrint)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tanggal Main:</span>
                  <span className="font-bold">{selectedBookingForPrint.tanggalLabel}</span>
                </div>
                <div className="pt-1">
                  <span className="block text-[10px] text-stone-500">Slot Jam:</span>
                  {selectedBookingForPrint.slots.map((s) => (
                    <div key={s.jam} className="flex justify-between pl-2">
                      <span>• {s.jam}</span>
                      <span>{formatRupiah(s.harga)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rincian Angka Finansial */}
              <div className="space-y-1.5 text-[11px] border-b-2 border-dashed border-stone-300 pb-3">
                <div className="flex justify-between">
                  <span>Subtotal Sewa:</span>
                  <span>{formatRupiah(selectedBookingForPrint.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Biaya Layanan:</span>
                  <span>{formatRupiah(selectedBookingForPrint.biayaLayanan)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-stone-900 pt-1">
                  <span>TOTAL TAGIHAN:</span>
                  <span>{formatRupiah(selectedBookingForPrint.totalAkhir)}</span>
                </div>
                <div className="flex justify-between text-stone-700">
                  <span>Metode & Ref:</span>
                  <span className="uppercase">{selectedBookingForPrint.metodePembayaran}</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-800">
                  <span>DIBAYAR ({selectedBookingForPrint.tipePembayaran.toUpperCase()}):</span>
                  <span>{formatRupiah(selectedBookingForPrint.nominalDibayar)}</span>
                </div>
                {selectedBookingForPrint.sisaPelunasan > 0 && (
                  <div className="flex justify-between font-bold text-amber-800">
                    <span>SISA PELUNASAN KASIR:</span>
                    <span>{formatRupiah(selectedBookingForPrint.sisaPelunasan)}</span>
                  </div>
                )}
              </div>

              {/* Footer Struk */}
              <div className="text-center space-y-1 pt-1 text-[10px] text-stone-500">
                <p className="font-bold text-stone-800">
                  *** TERIMA KASIH TELAH BERMAIN DI FUTSALHUB ***
                </p>
                <p>Harap hadir 15 menit sebelum jam bermain dimulai.</p>
                <p className="font-mono text-[9px] text-stone-400">Kode Unik: {selectedBookingForPrint.kodeBayar}</p>
              </div>

            </div>

            {/* Tombol Cetak / PDF */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedBookingForPrint(null)}
                className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-semibold cursor-pointer"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs tracking-wide shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Struk Sekarang (atau Simpan PDF)</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
