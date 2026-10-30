// src/app/jadwal/[id]/page.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  Calendar as CalendarIcon, 
  Clock, 
  Check, 
  Star, 
  ShoppingBag, 
  ArrowRight, 
  Trash2, 
  X, 
  AlertCircle, 
  Lock, 
  CheckCircle2, 
  Copy, 
  QrCode,
  Sparkles,
  Zap
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import PaymentInstructionModal from '../../components/PaymentInstructionModal';
import { 
  getBookedSlotsForDate, 
  getCartSlotsForDate,
  getSlotLiveDetailsForCourt,
  checkAndExpireBookings,
  addToCart, 
  createBooking, 
  formatRupiah, 
  SelectedSlot, 
  CartItem, 
  BookingRecord,
  PaymentMethod
} from '../../../data/bookingStore';
import { getStoredUser, UserSession } from '../../../data/authStore';

// Data 3 Lapangan
const DAFTAR_LAPANGAN = [
  {
    id: 1,
    nama: 'Lapangan 1',
    lokasi: 'Kota Tangerang Selatan',
    rating: 5.0,
    kategori: 'Futsal',
    hargaSiang: 150000,
    hargaMalam: 170000,
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1000&auto=format&fit=crop&q=80',
    spek: 'Vinyl Interlock Standard Turnamen Resmi (Ukuran 28 x 16 m)',
  },
  {
    id: 2,
    nama: 'Lapangan 2',
    lokasi: 'Kota Tangerang Selatan',
    rating: 4.95,
    kategori: 'Futsal',
    hargaSiang: 150000,
    hargaMalam: 170000,
    imageUrl: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=1000&auto=format&fit=crop&q=80',
    spek: 'Vinyl Interlock Peredam Kejut Maksimal (Ukuran 28 x 16 m)',
  },
  {
    id: 3,
    nama: 'Lapangan 3',
    lokasi: 'Kota Tangerang Selatan',
    rating: 4.98,
    kategori: 'Futsal',
    hargaSiang: 150000,
    hargaMalam: 170000,
    imageUrl: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=1000&auto=format&fit=crop&q=80',
    spek: 'Vinyl Interlock Grip Optimal & Sirkulasi Indoor Sejuk (Ukuran 28 x 16 m)',
  },
];

// 16 Slot Operasional (08:00 sampai 00:00)
const JAM_OPERASIONAL = [
  { index: 0, jam: '08:00 - 09:00', tipe: 'siang', harga: 150000 },
  { index: 1, jam: '09:00 - 10:00', tipe: 'siang', harga: 150000 },
  { index: 2, jam: '10:00 - 11:00', tipe: 'siang', harga: 150000 },
  { index: 3, jam: '11:00 - 12:00', tipe: 'siang', harga: 150000 },
  { index: 4, jam: '12:00 - 13:00', tipe: 'siang', harga: 150000 },
  { index: 5, jam: '13:00 - 14:00', tipe: 'siang', harga: 150000 },
  { index: 6, jam: '14:00 - 15:00', tipe: 'siang', harga: 150000 },
  { index: 7, jam: '15:00 - 16:00', tipe: 'siang', harga: 150000 },
  { index: 8, jam: '16:00 - 17:00', tipe: 'siang', harga: 150000 },
  { index: 9, jam: '17:00 - 18:00', tipe: 'malam', harga: 170000 },
  { index: 10, jam: '18:00 - 19:00', tipe: 'malam', harga: 170000 },
  { index: 11, jam: '19:00 - 20:00', tipe: 'malam', harga: 170000 },
  { index: 12, jam: '20:00 - 21:00', tipe: 'malam', harga: 170000 },
  { index: 13, jam: '21:00 - 22:00', tipe: 'malam', harga: 170000 },
  { index: 14, jam: '22:00 - 23:00', tipe: 'malam', harga: 170000 },
  { index: 15, jam: '23:00 - 00:00', tipe: 'malam', harga: 170000 },
];

export default function CourtSchedulePage() {
  const router = useRouter();
  const params = useParams();
  const rawId = params?.id ? Number(params.id) : 1;
  const courtId = rawId === 2 ? 2 : rawId === 3 ? 3 : 1;

  const currentCourt = useMemo(() => {
    return DAFTAR_LAPANGAN.find((l) => l.id === courtId) || DAFTAR_LAPANGAN[0];
  }, [courtId]);

  const [isMounted, setIsMounted] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);

  // Tanggal & Durasi
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-30');
  const [durasiBermain, setDurasiBermain] = useState<number>(1); // 1 jam, 2 jam, 3 jam, 4 jam

  // Slot yang sedang aktif dipilih dalam sesi ini
  const [selectedSlots, setSelectedSlots] = useState<SelectedSlot[]>([]);

  // Modals
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showPaymentSuccessModal, setShowPaymentSuccessModal] = useState(false);
  const [latestBooking, setLatestBooking] = useState<BookingRecord | null>(null);

  // Form Checkout
  const [penyewaNama, setPenyewaNama] = useState('');
  const [penyewaPhone, setPenyewaPhone] = useState('');
  const [penyewaEmail, setPenyewaEmail] = useState('');
  const [metodeBayar, setMetodeBayar] = useState<PaymentMethod>('qris');
  const [tipeBayar, setTipeBayar] = useState<'lunas' | 'dp'>('lunas');

  useEffect(() => {
    setIsMounted(true);
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
    const user = getStoredUser();
    if (user) {
      setCurrentUser(user);
      setPenyewaNama(user.nama || '');
      setPenyewaPhone(user.noHp || '');
      setPenyewaEmail(user.email || '');
    }
  }, []);

  // Slot terisi dari data booking & auto-check expiration
  const [refreshKey, setRefreshKey] = useState(0);
  useEffect(() => {
    const handleUpdate = () => setRefreshKey((prev) => prev + 1);
    window.addEventListener('futsalhub_bookings_changed', handleUpdate);
    window.addEventListener('futsalhub_cart_changed', handleUpdate);

    // Periksa status kadaluarsa 10 menit setiap 3 detik secara real-time
    const interval = setInterval(() => {
      checkAndExpireBookings();
    }, 3000);

    return () => {
      window.removeEventListener('futsalhub_bookings_changed', handleUpdate);
      window.removeEventListener('futsalhub_cart_changed', handleUpdate);
      clearInterval(interval);
    };
  }, []);

  const bookedSlots = useMemo(() => {
    if (!isMounted) return [];
    return getBookedSlotsForDate(currentCourt.id, selectedDate);
  }, [currentCourt.id, selectedDate, refreshKey, isMounted]);

  const liveSlotDetails = useMemo(() => {
    if (!isMounted) return {};
    return getSlotLiveDetailsForCourt(currentCourt.id, selectedDate);
  }, [currentCourt.id, selectedDate, refreshKey, isMounted]);

  const cartSlots = useMemo(() => {
    if (!isMounted) return [];
    return getCartSlotsForDate(currentCourt.id, selectedDate);
  }, [currentCourt.id, selectedDate, refreshKey, isMounted]);

  // SOLUSI CERDAS SEWA BANYAK JAM (1, 2, 3, 4 Jam Beruntun)
  const handleSlotClick = (startIndex: number) => {
    const neededCount = durasiBermain;
    const requestedSlots: typeof JAM_OPERASIONAL = [];

    // Cek apakah slot berurutan melebihi jam tutup
    if (startIndex + neededCount > JAM_OPERASIONAL.length) {
      return;
    }

    // Periksa apakah ada slot yang bentrok / sudah terisi / sudah di keranjang
    for (let i = 0; i < neededCount; i++) {
      const slot = JAM_OPERASIONAL[startIndex + i];
      if (bookedSlots.includes(slot.jam) || cartSlots.includes(slot.jam)) {
        return;
      }
      requestedSlots.push(slot);
    }

    // Cek apakah slot yang sama sudah dipilih
    const alreadySelected = requestedSlots.every((r) => 
      selectedSlots.some((s) => s.jam === r.jam)
    );

    if (alreadySelected) {
      // Unselect
      const jamsToRemove = requestedSlots.map((r) => r.jam);
      setSelectedSlots(selectedSlots.filter((s) => !jamsToRemove.includes(s.jam)));
    } else {
      // Select slot beruntun
      const newItems: SelectedSlot[] = requestedSlots.map((r) => ({ jam: r.jam, harga: r.harga }));
      setSelectedSlots(newItems);
    }
  };

  // Ringkasan Label Range Jam
  const rangeLabel = useMemo(() => {
    if (selectedSlots.length === 0) return '';
    const sorted = [...selectedSlots].sort((a, b) => a.jam.localeCompare(b.jam));
    const start = sorted[0].jam.split(' - ')[0];
    const end = sorted[sorted.length - 1].jam.split(' - ')[1];
    return `${start} - ${end} (${selectedSlots.length} Jam Bermain)`;
  }, [selectedSlots]);

  const subtotal = useMemo(() => {
    return selectedSlots.reduce((acc, curr) => acc + curr.harga, 0);
  }, [selectedSlots]);

  // Tambahkan ke Keranjang: langsung hilangkan floating bottom bar (+ keranjang)
  const handleAddToCart = () => {
    if (selectedSlots.length === 0) return;

    const dateObj = new Date(selectedDate);
    const dateLabel = dateObj.toLocaleDateString('id-ID', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    const newCartItem: CartItem = {
      id: `CART-${currentCourt.id}-${selectedDate}-${selectedSlots[0].jam.replace(/\s+/g, '')}`,
      lapanganId: currentCourt.id,
      lapanganNama: currentCourt.nama,
      tanggal: selectedDate,
      tanggalLabel: dateLabel,
      slots: selectedSlots,
      rangeLabel: rangeLabel || `${selectedSlots.length} Jam`,
      totalJam: selectedSlots.length,
      totalHarga: subtotal,
    };

    addToCart(newCartItem);
    // Kosongkan slot terpilih agar bottom bar segera hilang
    setSelectedSlots([]);
  };

  // Lanjut ke Checkout Langsung
  const handleDirectCheckout = () => {
    if (selectedSlots.length === 0) return;

    const user = getStoredUser();
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }

    setCurrentUser(user);
    setPenyewaNama(user.nama || '');
    setPenyewaPhone(user.noHp || '');
    setPenyewaEmail(user.email || '');
    setShowCheckoutModal(true);
  };

  // Submit Checkout & Pembayaran
  const handleBayarSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!penyewaNama || !penyewaPhone) return;

    const user = getStoredUser();
    if (!user) {
      setShowCheckoutModal(false);
      setShowLoginPrompt(true);
      return;
    }

    const biayaLayanan = metodeBayar === 'qris' ? 0 : 4000;
    const totalAkhir = subtotal + biayaLayanan;
    const nominalDibayar = tipeBayar === 'lunas' ? totalAkhir : Math.round(subtotal * 0.5) + biayaLayanan;
    const sisaPelunasan = totalAkhir - nominalDibayar;

    const dateObj = new Date(selectedDate);
    const dateLabel = dateObj.toLocaleDateString('id-ID', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    const bookingId = `FH-${Math.floor(1000 + Math.random() * 9000)}`;
    let kodeBayar = `QRIS-FH-${bookingId}`;
    if (metodeBayar === 'bca') kodeBayar = '80012 089617251030';
    else if (metodeBayar === 'mandiri') kodeBayar = '88019 089617251030';
    else if (metodeBayar === 'bni') kodeBayar = '8214 089617251030';
    else if (metodeBayar === 'bri') kodeBayar = '8881 089617251030';
    else if (['gopay', 'dana', 'ovo', 'shopeepay'].includes(metodeBayar)) {
      kodeBayar = '0896-1725-1030';
    }

    const newBooking: BookingRecord = {
      id: bookingId,
      namaPenyewa: penyewaNama,
      noHp: penyewaPhone,
      email: penyewaEmail || user.email,
      lapanganId: currentCourt.id,
      lapanganNama: `${currentCourt.nama} (${rangeLabel})`,
      tanggal: selectedDate,
      tanggalLabel: dateLabel,
      slots: selectedSlots,
      subtotal,
      biayaLayanan,
      totalAkhir,
      tipePembayaran: tipeBayar,
      nominalDibayar,
      sisaPelunasan,
      metodePembayaran: metodeBayar,
      kodeBayar,
      status: 'menunggu_pembayaran',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      refundStatus: 'none',
    };

    createBooking(newBooking);
    setLatestBooking(newBooking);
    setShowCheckoutModal(false);
    setShowPaymentSuccessModal(true);
  };

  const todayStr = useMemo(() => {
    if (!isMounted) return '2026-10-30';
    return new Date().toISOString().split('T')[0];
  }, [isMounted]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#121417] text-stone-900 dark:text-[#F3F4F6] font-sans selection:bg-emerald-200 dark:selection:bg-emerald-900 flex flex-col justify-between transition-colors">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8 flex-1 space-y-8 w-full">
        
        {/* Tombol Kembali ke Pilih Lapangan */}
        <div className="flex items-center justify-between">
          <Link
            href="/jadwal"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 dark:text-stone-300 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Kembali ke Daftar Lapangan</span>
          </Link>

          {/* Indikator Lapangan Aktif (Sesuai Permintaan: Teks Statis Lapangan yang Dipilih) */}
          <div className="px-4 py-1.5 rounded-full bg-emerald-700 text-white font-black text-xs shadow-xs tracking-wide">
            {currentCourt.nama}
          </div>
        </div>

        {/* Banner Lapangan Aktif (Tema Hijau) */}
        <div className="rounded-3xl bg-white dark:bg-[#1A1D23] border border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs grid md:grid-cols-12 gap-6 items-center">
          
          <div className="md:col-span-4 relative h-48 sm:h-56 w-full overflow-hidden bg-stone-900">
            <Image
              src={currentCourt.imageUrl}
              alt={currentCourt.nama}
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute top-3 left-3">
              <span className="px-2.5 py-1 rounded-md bg-emerald-700 text-white text-[11px] font-bold shadow-sm">
                Venue Aktif
              </span>
            </div>
          </div>

          <div className="md:col-span-8 p-6 space-y-2.5">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-stone-900 dark:text-white">
                {currentCourt.nama} - FutsalHub Arena
              </h1>
            </div>

            <div className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-400">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="font-bold text-stone-800 dark:text-stone-200">{currentCourt.rating.toFixed(2)}</span>
              <span>•</span>
              <span>{currentCourt.lokasi}</span>
              <span>•</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{currentCourt.spek}</span>
            </div>

            <div className="flex items-center gap-4 text-xs pt-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Tarif Siang (08:00 - 17:00): <strong>{formatRupiah(currentCourt.hargaSiang)}/jam</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-700" />
                <span>Tarif Malam (17:00 - 00:00): <strong>{formatRupiah(currentCourt.hargaMalam)}/jam</strong></span>
              </div>
            </div>
          </div>

        </div>

        {/* Section: Kontrol Jadwal & Ketersediaan Jam (Sesuai Gambar 5 dengan Tema Hijau) */}
        <div className="bg-white dark:bg-[#1A1D23] border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 space-y-8 shadow-xs">
          
          {/* Header & Filter Tanggal (Hanya input kalender, tombol Hari Ini & Besok dihilangkan sesuai permintaan) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100 dark:border-stone-800">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/40 text-xs font-bold text-emerald-800 dark:text-emerald-300 mb-2">
                Ketersediaan: {currentCourt.nama}
              </div>
              <h2 className="text-xl font-black text-stone-900 dark:text-white">
                Ketersediaan Jadwal Jam (08:00 - 00:00)
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
                Pilih tanggal dan tentukan jam bermain Anda. Klik slot untuk memasukkannya ke Jadwal Dipilih.
              </p>
            </div>

            {/* Pemilih Tanggal Langsung dari Kalender */}
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs self-start sm:self-auto">
              <CalendarIcon className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              <input
                type="date"
                value={selectedDate}
                min={todayStr}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent font-bold text-stone-900 dark:text-stone-100 outline-none cursor-pointer"
              />
            </div>
          </div>

          {/* FITUR KHUSUS: MULTI-HOUR SELECTION (SOLUSI SEWA LEBIH DARI 1 JAM) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                <Zap className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                <span>Pilih Durasi Bermain (Satu Kali Klik):</span>
              </div>
              <p className="text-[11px] text-stone-600 dark:text-stone-400">
                Pilih 1 jam, 2 jam, atau pilih custom bebas hingga 16 jam, lalu klik jam mulai Anda.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
              <button
                type="button"
                onClick={() => setDurasiBermain(1)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  durasiBermain === 1
                    ? 'bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-500/40'
                    : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:border-emerald-500'
                }`}
              >
                1 Jam
              </button>

              <button
                type="button"
                onClick={() => setDurasiBermain(2)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  durasiBermain === 2
                    ? 'bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-500/40'
                    : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:border-emerald-500'
                }`}
              >
                2 Jam
              </button>

              <div className="relative">
                <select
                  value={durasiBermain >= 3 ? durasiBermain : 'custom'}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (!isNaN(val) && val >= 3 && val <= 16) {
                      setDurasiBermain(val);
                    }
                  }}
                  className={`appearance-none px-3.5 py-2 pr-7 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    durasiBermain >= 3
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm ring-2 ring-emerald-500/40'
                      : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:border-emerald-500'
                  }`}
                >
                  <option value="custom" disabled={durasiBermain >= 3} className="bg-white dark:bg-[#1A1D23] text-stone-900 dark:text-white">
                    {durasiBermain >= 3 ? `Custom: ${durasiBermain} Jam` : 'Pilihan Custom (3-16 Jam)'}
                  </option>
                  {Array.from({ length: 14 }, (_, i) => i + 3).map((num) => (
                    <option key={num} value={num} className="bg-white dark:bg-[#1A1D23] text-stone-900 dark:text-white font-medium">
                      {num} Jam {num === 16 ? '(Maksimal Operasional)' : ''}
                    </option>
                  ))}
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                  <span className={`text-[10px] ${durasiBermain >= 3 ? 'text-white' : 'text-stone-400'}`}>▼</span>
                </div>
              </div>
            </div>
          </div>

          {/* Legenda Status Slot (Tema Hijau & Amber Hold 10 Menit) */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-md bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-600" />
              <span className="text-stone-600 dark:text-stone-400">⚪ Tersedia (Bisa Dipilih)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-md bg-emerald-600 border border-emerald-600" />
              <span className="text-stone-600 dark:text-stone-400">🟢 Jadwal Dipilih (Aktif)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-md bg-yellow-100 dark:bg-yellow-900/60 border border-yellow-300 dark:border-yellow-700" />
              <span className="text-yellow-800 dark:text-yellow-300 font-semibold">🟡 Di Keranjang Anda</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-md bg-amber-500 border border-amber-500 animate-pulse" />
              <span className="text-amber-700 dark:text-amber-400 font-semibold">🟠 Sedang Dipesan (Terkunci 10 Mnt)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-md bg-stone-200 dark:bg-stone-700 border border-stone-300 dark:border-stone-600 opacity-60" />
              <span className="text-stone-600 dark:text-stone-400">🔘 Terisi / Terkonfirmasi</span>
            </div>
          </div>

          {/* Grid 16 Slot Waktu (08:00 sampai 00:00 - Sesuai Gambar 5) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
            {JAM_OPERASIONAL.map((item, idx) => {
              const slotDetail = liveSlotDetails[item.jam];
              const isPermanentlyBooked = slotDetail?.status === 'terisi';
              const isLocked10Min = slotDetail?.status === 'locked_10min';
              const isBooked = isPermanentlyBooked || isLocked10Min || bookedSlots.includes(item.jam);
              const isInCart = cartSlots.includes(item.jam);
              const isSelected = selectedSlots.some((s) => s.jam === item.jam);
              const isDisabled = isBooked || isInCart;

              return (
                <button
                  key={item.jam}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => handleSlotClick(idx)}
                  className={`p-3.5 rounded-2xl border text-left transition-all relative ${
                    isPermanentlyBooked
                      ? 'bg-stone-100 dark:bg-stone-800/40 border-stone-200 dark:border-stone-800 text-stone-400 dark:text-stone-500 cursor-not-allowed opacity-60'
                      : isLocked10Min
                      ? 'bg-amber-500/10 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800/80 text-amber-900 dark:text-amber-200 cursor-not-allowed shadow-xs'
                      : isInCart
                      ? 'bg-yellow-50/80 dark:bg-yellow-950/30 border-yellow-300 dark:border-yellow-800/60 text-stone-600 dark:text-stone-400 cursor-not-allowed'
                      : isSelected
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-600 text-stone-900 dark:text-white shadow-xs ring-2 ring-emerald-500/30'
                      : 'bg-white dark:bg-stone-800/60 border-stone-200 dark:border-stone-700/80 hover:border-emerald-600 dark:hover:border-emerald-500 hover:shadow-xs cursor-pointer'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold tracking-tight">
                      {item.jam}
                    </span>
                    {isPermanentlyBooked ? (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-stone-200 dark:bg-stone-700 text-stone-500">
                        Terisi
                      </span>
                    ) : isLocked10Min ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200 flex items-center gap-1 border border-amber-300 dark:border-amber-700 animate-pulse">
                        <Clock className="w-2.5 h-2.5" />
                        Terkunci 10 Mnt
                      </span>
                    ) : isInCart ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-100 dark:bg-yellow-900/60 text-yellow-800 dark:text-yellow-300 flex items-center gap-1">
                        <ShoppingBag className="w-2.5 h-2.5" />
                        Di Keranjang
                      </span>
                    ) : isSelected ? (
                      <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
                        ✓
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                        Tersedia
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline justify-between text-[11px]">
                    <span className="capitalize text-stone-500 dark:text-stone-400">
                      {isLocked10Min ? (
                        <span className="text-amber-700 dark:text-amber-400 font-medium">Sedang dipesan</span>
                      ) : (
                        `Tarif ${item.tipe}`
                      )}
                    </span>
                    <span className={`font-bold ${isDisabled && !isLocked10Min ? 'text-stone-400' : isLocked10Min ? 'text-amber-800 dark:text-amber-300' : 'text-stone-800 dark:text-stone-200'}`}>
                      {formatRupiah(item.harga)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

        </div>

      </main>

      {/* Pop-up Bar Melayang di Bawah Layar */}
      {selectedSlots.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-2xl animate-in slide-in-from-bottom duration-200">
          <div className="p-4 sm:p-5 rounded-3xl bg-stone-900/95 dark:bg-stone-900/95 text-white backdrop-blur-md shadow-2xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-stone-300 font-bold">
                  {currentCourt.nama} • {selectedDate}
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-base sm:text-lg font-black text-emerald-400">
                  {rangeLabel}
                </span>
                <span className="text-xs text-stone-300 font-semibold">
                  ({formatRupiah(subtotal)})
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleAddToCart}
                className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold border border-stone-700 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
                <span>+ Keranjang</span>
              </button>

              <button
                type="button"
                onClick={handleDirectCheckout}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>Langsung Pesan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PROMPT LOGIN (JIKA BELUM MASUK) */}
      {showLoginPrompt && isMounted && createPortal(
        <div className="fixed inset-0 z-[9999] overflow-y-auto flex min-h-screen items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative bg-white dark:bg-[#1A1D23] w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl border border-stone-200 dark:border-stone-800 space-y-5 text-center my-auto">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center mx-auto text-amber-600 dark:text-amber-400">
              <Lock className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-stone-900 dark:text-white">
                Silakan Masuk Terlebih Dahulu
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                Anda perlu masuk ke akun FutsalHub untuk melanjutkan proses booking lapangan agar jadwal resmi terdaftar atas nama tim Anda.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-left space-y-1">
              <span className="text-[11px] font-bold text-stone-500 block uppercase tracking-wider">
                Jadwal yang tersimpan:
              </span>
              <span className="text-xs font-bold text-stone-900 dark:text-white">
                {currentCourt.nama} • {rangeLabel} ({formatRupiah(subtotal)})
              </span>
            </div>

            <div className="space-y-2.5 pt-1">
              <Link
                href="/login"
                className="w-full py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs tracking-wide shadow-sm transition-all block"
              >
                Masuk / Login Sekarang
              </Link>
              <div className="text-center text-xs text-stone-500">
                Belum punya akun?{' '}
                <Link
                  href="/register"
                  className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
                >
                  Daftar akun baru
                </Link>
              </div>
              <button
                type="button"
                onClick={() => setShowLoginPrompt(false)}
                className="w-full py-2.5 text-xs font-semibold text-stone-500 hover:text-stone-800 cursor-pointer"
              >
                Batal
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL CHECKOUT TENGAH PAGE: DIJAMIN PAS & KELIHATAN SEMUANYA */}
      {showCheckoutModal && isMounted && createPortal(
        <div className="fixed inset-0 z-[9999] overflow-y-auto flex min-h-screen items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative bg-white dark:bg-[#1A1D23] w-full max-w-2xl max-h-[85vh] rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col my-auto">
            
            {/* Header Modal (Tetap Terlihat di Atas) */}
            <div className="flex-shrink-0 px-6 py-4 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between bg-white dark:bg-[#1A1D23]">
              <button
                type="button"
                onClick={() => setShowCheckoutModal(false)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Kembali ke Jadwal</span>
              </button>

              <h4 className="text-sm font-black text-stone-900 dark:text-white uppercase tracking-wider">
                Konfirmasi Checkout
              </h4>

              <button
                type="button"
                onClick={() => setShowCheckoutModal(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form & Konten yang Bisa Di-scroll dengan Sempurna */}
            <form id="checkout-form" onSubmit={handleBayarSubmit} className="flex-1 overflow-y-auto p-6 sm:p-7 space-y-6">
              
              {/* Box Rincian Lapangan Terpilih */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-stone-900 dark:text-white">
                    Venue Terpilih:
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-700 text-white font-bold text-[10px]">
                    {currentCourt.nama}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-600 dark:text-stone-300 pt-1">
                  <div>Tanggal Main: <strong className="text-stone-900 dark:text-white">{selectedDate}</strong></div>
                  <div>Jam Bermain: <strong className="text-emerald-700 dark:text-emerald-400">{rangeLabel}</strong></div>
                </div>
              </div>

              {/* Data Penyewa */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-700">
                    <span className="text-[10px]">▶</span>
                  </div>
                  <h4 className="text-xs font-bold text-stone-900 dark:text-white uppercase tracking-wider">
                    Data Identitas Pemesan
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-bold text-stone-500 uppercase block mb-1">
                      Nama Lengkap Pemesan / Tim
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Nama Lengkap"
                      value={penyewaNama}
                      onChange={(e) => setPenyewaNama(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-900 dark:text-white focus:outline-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-stone-500 uppercase block mb-1">
                      Nomor WhatsApp
                    </label>
                    <div className="flex items-center rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 px-3 py-1 focus-within:border-emerald-500">
                      <span className="text-xs font-bold text-stone-600 dark:text-stone-300 mr-2">
                        +62
                      </span>
                      <input
                        type="tel"
                        required
                        placeholder="812345678"
                        value={penyewaPhone.replace(/^\+62/, '')}
                        onChange={(e) => setPenyewaPhone(e.target.value)}
                        className="w-full bg-transparent text-xs font-semibold text-stone-900 dark:text-white outline-none py-1.5"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-stone-500 uppercase block mb-1">
                      Alamat Email
                    </label>
                    <input
                      type="email"
                      placeholder="email@domain.com"
                      value={penyewaEmail}
                      onChange={(e) => setPenyewaEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-900 dark:text-white focus:outline-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Skema Bayar Lunas vs DP */}
              <div className="space-y-3 pt-2 border-t border-stone-100 dark:border-stone-800">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-700">
                    <span className="text-[10px]">▶</span>
                  </div>
                  <h4 className="text-xs font-bold text-stone-900 dark:text-white uppercase tracking-wider">
                    Pilihan Skema Pembayaran
                  </h4>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setTipeBayar('lunas')}
                    className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                      tipeBayar === 'lunas'
                        ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/40 text-stone-900 dark:text-white ring-2 ring-emerald-500/20'
                        : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold">Bayar Lunas</span>
                      <span className="text-[10px] font-black text-emerald-600 px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60">100%</span>
                    </div>
                    <span className="text-[11px] text-stone-500 block">Selesai sekali bayar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTipeBayar('dp')}
                    className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                      tipeBayar === 'dp'
                        ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/40 text-stone-900 dark:text-white ring-2 ring-emerald-500/20'
                        : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold">Bayar DP</span>
                      <span className="text-[10px] font-black text-amber-600 px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/60">50% Dimuka</span>
                    </div>
                    <span className="text-[11px] text-stone-500 block">Sisa pelunasan di kasir venue</span>
                  </button>
                </div>
              </div>

              {/* Metode Pembayaran Lengkap */}
              <div className="space-y-3 pt-2 border-t border-stone-100 dark:border-stone-800">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-700">
                    <span className="text-[10px]">▶</span>
                  </div>
                  <h4 className="text-xs font-bold text-stone-900 dark:text-white uppercase tracking-wider">
                    Pilih Metode Pembayaran
                  </h4>
                </div>

                {/* QRIS */}
                <label className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  metodeBayar === 'qris'
                    ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20'
                    : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900/40'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-7 rounded-lg bg-red-600 text-white font-black text-[10px] flex items-center justify-center tracking-tighter shadow-xs">
                      QRIS
                    </div>
                    <div>
                      <span className="text-xs font-bold text-stone-900 dark:text-white block">
                        QRIS Instant (BCA Mobile, Livin, GoPay, OVO, DANA, ShopeePay)
                      </span>
                      <span className="text-[10px] text-emerald-600 font-bold">Bebas Biaya Admin • Verifikasi Otomatis</span>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="metode"
                    checked={metodeBayar === 'qris'}
                    onChange={() => setMetodeBayar('qris')}
                    className="w-4 h-4 accent-emerald-600"
                  />
                </label>

                {/* Transfer Virtual Account */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider block">
                    Transfer Virtual Account Bank:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'bca', label: 'BCA Virtual Account', color: 'bg-blue-700' },
                      { id: 'mandiri', label: 'Mandiri Livin VA', color: 'bg-indigo-700' },
                      { id: 'bni', label: 'BNI Virtual Account', color: 'bg-orange-700' },
                      { id: 'bri', label: 'BRI Virtual Account (BRIVA)', color: 'bg-blue-800' },
                    ].map((bank) => (
                      <button
                        key={bank.id}
                        type="button"
                        onClick={() => setMetodeBayar(bank.id as any)}
                        className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                          metodeBayar === bank.id
                            ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/40 font-bold ring-1 ring-emerald-500/30'
                            : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800/80 text-stone-600'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${bank.color}`} />
                          <span className="text-xs text-stone-800 dark:text-stone-200">{bank.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* E-Wallet Langsung */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider block">
                    E-Wallet Langsung:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'gopay', label: 'GoPay', color: 'bg-emerald-500' },
                      { id: 'dana', label: 'DANA', color: 'bg-blue-500' },
                      { id: 'ovo', label: 'OVO', color: 'bg-purple-600' },
                      { id: 'shopeepay', label: 'ShopeePay', color: 'bg-orange-500' },
                    ].map((ew) => (
                      <button
                        key={ew.id}
                        type="button"
                        onClick={() => setMetodeBayar(ew.id as any)}
                        className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                          metodeBayar === ew.id
                            ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/40 font-bold ring-1 ring-emerald-500/30'
                            : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800/80 text-stone-600'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${ew.color}`} />
                          <span className="text-xs text-stone-800 dark:text-stone-200">{ew.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </form>

            {/* Footer Modal (Tetap Terlihat di Bawah - Tidak Terpotong) */}
            <div className="flex-shrink-0 px-6 py-4 bg-stone-50 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[11px] text-stone-500 dark:text-stone-400 block font-semibold">
                  Total Tagihan Sekarang ({selectedSlots.length} Jam):
                </span>
                <span className="text-xl sm:text-2xl font-black text-emerald-700 dark:text-emerald-400">
                  {formatRupiah(tipeBayar === 'lunas' ? subtotal : Math.round(subtotal * 0.5))}
                </span>
                <span className="text-[10px] text-stone-400 block">
                  {tipeBayar === 'lunas' ? 'Lunas 100%' : 'DP 50% (Sisa di Kasir Venue)'}
                </span>
              </div>

              <button
                type="submit"
                form="checkout-form"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Bayar Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

      {/* POPUP INSTRUKSI PEMBAYARAN RESMI (DESAIN TERPADU UNTUK SEMUA LAPANGAN) */}
      <PaymentInstructionModal
        isOpen={showPaymentSuccessModal}
        booking={latestBooking}
        onClose={() => {
          setShowPaymentSuccessModal(false);
          setSelectedSlots([]);
        }}
        onPaymentConfirmed={() => {
          setSelectedSlots([]);
        }}
      />

      <Footer />
    </div>
  );
}

