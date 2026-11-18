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
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
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
    kategori: 'Lantai Vinyl',
    hargaSiang: 150000,
    hargaMalam: 170000,
    imageUrl: '/images/lapangan-1.jpg',
    spek: 'Lantai Vinyl Standar Turnamen (Ukuran 28 x 16 m)',
  },
  {
    id: 2,
    nama: 'Lapangan 2',
    lokasi: 'Kota Tangerang Selatan',
    rating: 4.95,
    kategori: 'Lantai Vinyl',
    hargaSiang: 150000,
    hargaMalam: 170000,
    imageUrl: '/images/lapangan-2.jpg',
    spek: 'Lantai Vinyl Standar Turnamen (Ukuran 28 x 16 m)',
  },
  {
    id: 3,
    nama: 'Lapangan 3',
    lokasi: 'Kota Tangerang Selatan',
    rating: 4.98,
    kategori: 'Lantai Vinyl',
    hargaSiang: 150000,
    hargaMalam: 170000,
    imageUrl: '/images/lapangan-3.jpg',
    spek: 'Lantai Vinyl Standar Turnamen (Ukuran 28 x 16 m)',
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

  // SOLUSI SEWA BANYAK JAM (1, 2, 3, 4 Jam Beruntun)
  const handleSlotClick = (startIndex: number) => {
    const neededCount = durasiBermain;
    const requestedSlots: typeof JAM_OPERASIONAL = [];

    if (startIndex + neededCount > JAM_OPERASIONAL.length) {
      return;
    }

    for (let i = 0; i < neededCount; i++) {
      const slot = JAM_OPERASIONAL[startIndex + i];
      if (bookedSlots.includes(slot.jam) || cartSlots.includes(slot.jam)) {
        return;
      }
      requestedSlots.push(slot);
    }

    const alreadySelected = requestedSlots.every((r) => 
      selectedSlots.some((s) => s.jam === r.jam)
    );

    if (alreadySelected) {
      const jamsToRemove = requestedSlots.map((r) => r.jam);
      setSelectedSlots(selectedSlots.filter((s) => !jamsToRemove.includes(s.jam)));
    } else {
      const newItems: SelectedSlot[] = requestedSlots.map((r) => ({ jam: r.jam, harga: r.harga }));
      setSelectedSlots(newItems);
    }
  };

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
    setSelectedSlots([]);
  };

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
    <div className="min-h-screen bg-brand-bg dark:bg-brand-ink text-brand-ink dark:text-stone-100 font-sora selection:bg-brand-lime selection:text-brand-navy flex flex-col justify-between transition-colors">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8 flex-1 space-y-8 w-full">
        
        {/* Navigasi Atas & Status Badge */}
        <div className="flex items-center justify-between">
          <Link
            href="/jadwal"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-dim hover:text-brand-blue dark:hover:text-brand-lime transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Kembali ke Daftar Lapangan</span>
          </Link>

          <Badge variant="lime" size="md">
            <span>{currentCourt.nama} • {currentCourt.kategori}</span>
          </Badge>
        </div>

        {/* Banner Lapangan Aktif */}
        <div className="rounded-2xl bg-white dark:bg-brand-navy/30 border-[1.5px] border-brand-line dark:border-white/10 overflow-hidden shadow-sm grid md:grid-cols-12 gap-6 items-center">
          
          <div className="md:col-span-4 relative aspect-[16/10] md:h-full min-h-[200px] w-full overflow-hidden bg-brand-navy">
            <Image
              src={currentCourt.imageUrl}
              alt={currentCourt.nama}
              fill
              className="object-cover"
            />
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <Badge variant="navy">Venue #{currentCourt.id}</Badge>
              <Badge variant="lime">Aktif</Badge>
            </div>
          </div>

          <div className="md:col-span-8 p-6 space-y-3">
            <div className="flex items-center gap-2">
              <h1 className="font-bebas text-3xl sm:text-4xl text-brand-ink dark:text-white uppercase tracking-tight leading-none">
                {currentCourt.nama} — FUTSALHUB ARENA
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-brand-dim dark:text-stone-300">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-brand-lime fill-brand-lime" />
                <span className="font-bold text-brand-ink dark:text-white">{currentCourt.rating.toFixed(2)}</span>
              </div>
              <span>•</span>
              <span>{currentCourt.lokasi}</span>
              <span>•</span>
              <span className="text-brand-blue dark:text-brand-lime font-semibold">{currentCourt.spek}</span>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs pt-1 border-t border-brand-line dark:border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-blue" />
                <span>Tarif Siang (08:00 - 15:00): <strong className="font-bebas text-base text-brand-blue dark:text-brand-lime">{formatRupiah(currentCourt.hargaSiang)}</strong>/jam</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-navy dark:bg-brand-lime" />
                <span>Tarif Malam (15:00 - 00:00): <strong className="font-bebas text-base text-brand-navy dark:text-white">{formatRupiah(currentCourt.hargaMalam)}</strong>/jam</span>
              </div>
            </div>
          </div>

        </div>

        {/* Section: Kontrol Jadwal & Ketersediaan Jam */}
        <div className="bg-white dark:bg-brand-navy/30 border-[1.5px] border-brand-line dark:border-white/10 rounded-2xl p-6 sm:p-8 space-y-8 shadow-sm">
          
          {/* Header & Filter Tanggal */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-line dark:border-white/10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-navy text-brand-lime text-xs font-bebas tracking-wider uppercase mb-2">
                Jadwal 16 Jam Slot
              </div>
              <h2 className="font-bebas text-3xl text-brand-ink dark:text-white uppercase tracking-tight">
                KETERSEDIAAN JADWAL (08:00 - 00:00 WIB)
              </h2>
              <p className="font-sora text-xs sm:text-sm text-brand-dim dark:text-stone-400">
                Pilih tanggal dan tentukan jam bermain tim. Klik slot untuk memasukkannya ke Jadwal Dipilih.
              </p>
            </div>

            {/* Pemilih Tanggal Kalender */}
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-brand-bg dark:bg-brand-navy/60 border-[1.5px] border-brand-line dark:border-white/10 text-xs self-start sm:self-auto shadow-sm">
              <CalendarIcon className="w-4 h-4 text-brand-blue dark:text-brand-lime" />
              <input
                type="date"
                value={selectedDate}
                min={todayStr}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent font-bold text-brand-ink dark:text-white outline-none cursor-pointer"
              />
            </div>
          </div>

          {/* MULTI-HOUR SELECTION */}
          <div className="p-4 sm:p-5 rounded-xl bg-brand-bg dark:bg-brand-navy/60 border-[1.5px] border-brand-line dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-brand-ink dark:text-white">
                <Zap className="w-4 h-4 text-brand-blue dark:text-brand-lime" />
                <span className="uppercase tracking-wider font-bebas text-sm">Pilih Durasi Bermain Sekaligus:</span>
              </div>
              <p className="text-[11px] text-brand-dim dark:text-stone-400">
                Tentukan 1 jam, 2 jam, atau pilih custom durasi, lalu klik jam mulai pertandingan.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
              <button
                type="button"
                onClick={() => setDurasiBermain(1)}
                className={`px-4 py-2 rounded-xl text-xs font-bebas tracking-wider uppercase transition-all cursor-pointer border-[1.5px] ${
                  durasiBermain === 1
                    ? 'bg-brand-navy text-brand-lime border-brand-navy shadow-hard-lime dark:bg-brand-lime dark:text-brand-navy'
                    : 'bg-white dark:bg-brand-navy/50 text-brand-ink dark:text-stone-300 border-brand-line dark:border-white/10 hover:border-brand-navy'
                }`}
              >
                1 Jam
              </button>

              <button
                type="button"
                onClick={() => setDurasiBermain(2)}
                className={`px-4 py-2 rounded-xl text-xs font-bebas tracking-wider uppercase transition-all cursor-pointer border-[1.5px] ${
                  durasiBermain === 2
                    ? 'bg-brand-navy text-brand-lime border-brand-navy shadow-hard-lime dark:bg-brand-lime dark:text-brand-navy'
                    : 'bg-white dark:bg-brand-navy/50 text-brand-ink dark:text-stone-300 border-brand-line dark:border-white/10 hover:border-brand-navy'
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
                  className={`appearance-none px-4 py-2 pr-8 rounded-xl text-xs font-bebas tracking-wider uppercase transition-all cursor-pointer border-[1.5px] ${
                    durasiBermain >= 3
                      ? 'bg-brand-navy text-brand-lime border-brand-navy shadow-hard-lime dark:bg-brand-lime dark:text-brand-navy'
                      : 'bg-white dark:bg-brand-navy/50 text-brand-ink dark:text-stone-300 border-brand-line dark:border-white/10 hover:border-brand-navy'
                  }`}
                >
                  <option value="custom" disabled={durasiBermain >= 3} className="bg-white dark:bg-brand-navy text-brand-ink dark:text-white font-sora">
                    {durasiBermain >= 3 ? `Custom: ${durasiBermain} Jam` : 'Custom (3-16 Jam)'}
                  </option>
                  {Array.from({ length: 14 }, (_, i) => i + 3).map((num) => (
                    <option key={num} value={num} className="bg-white dark:bg-brand-navy text-brand-ink dark:text-white font-sora">
                      {num} Jam {num === 16 ? '(Maksimal)' : ''}
                    </option>
                  ))}
                </select>
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-xs">
                  ▼
                </div>
              </div>
            </div>
          </div>

          {/* Legenda Status Slot */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-md bg-white dark:bg-brand-navy/50 border-[1.5px] border-brand-line dark:border-white/20" />
              <span className="text-brand-dim dark:text-stone-300 font-medium">Tersedia</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-md bg-brand-navy border-[1.5px] border-brand-lime" />
              <span className="text-brand-dim dark:text-stone-300 font-bold text-brand-blue dark:text-brand-lime">Dipilih (Aktif)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-md bg-yellow-100 border-[1.5px] border-yellow-400" />
              <span className="text-yellow-800 dark:text-yellow-400 font-semibold">Di Keranjang</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-md bg-amber-500 border-[1.5px] border-amber-600 animate-pulse" />
              <span className="text-amber-700 dark:text-amber-400 font-semibold">Terkunci 10 Mnt</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-md bg-stone-200 dark:bg-stone-800 border-[1.5px] border-stone-300 dark:border-stone-700 opacity-60" />
              <span className="text-stone-400 font-medium">Terisi</span>
            </div>
          </div>

          {/* Grid 16 Slot Waktu (08:00 sampai 00:00) */}
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
                  className={`p-3.5 rounded-xl border-[1.5px] text-left transition-all relative ${
                    isPermanentlyBooked
                      ? 'bg-stone-100 dark:bg-stone-800/40 border-stone-200 dark:border-stone-800 text-stone-400 dark:text-stone-500 cursor-not-allowed opacity-60'
                      : isLocked10Min
                      ? 'bg-amber-500/10 dark:bg-amber-950/40 border-amber-400 text-amber-900 dark:text-amber-200 cursor-not-allowed shadow-xs'
                      : isInCart
                      ? 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-400 text-stone-600 dark:text-stone-300 cursor-not-allowed'
                      : isSelected
                      ? 'bg-brand-navy text-white border-brand-lime shadow-hard-lime ring-2 ring-brand-lime/30'
                      : 'bg-white dark:bg-brand-navy/40 border-brand-line dark:border-white/10 hover:border-brand-navy dark:hover:border-brand-lime hover:shadow-hard-navy cursor-pointer'
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
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200 flex items-center gap-1 border border-amber-400 animate-pulse">
                        <Clock className="w-2.5 h-2.5" />
                        Terkunci 10m
                      </span>
                    ) : isInCart ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-100 dark:bg-yellow-900/60 text-yellow-800 dark:text-yellow-300 flex items-center gap-1">
                        <ShoppingBag className="w-2.5 h-2.5" />
                        Di Keranjang
                      </span>
                    ) : isSelected ? (
                      <span className="w-4 h-4 rounded-full bg-brand-lime text-brand-navy flex items-center justify-center text-[10px] font-bold">
                        ✓
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-brand-blue dark:text-brand-lime">
                        Tersedia
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline justify-between text-[11px]">
                    <span className="capitalize text-brand-dim dark:text-stone-400">
                      {isLocked10Min ? (
                        <span className="text-amber-700 dark:text-amber-400 font-medium">Sedang dipesan</span>
                      ) : (
                        `Tarif ${item.tipe}`
                      )}
                    </span>
                    <span className={`font-mono font-bold ${isDisabled && !isLocked10Min ? 'text-stone-400' : isLocked10Min ? 'text-amber-800 dark:text-amber-300' : isSelected ? 'text-brand-lime' : 'text-brand-ink dark:text-white'}`}>
                      {formatRupiah(item.harga)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

        </div>

      </main>

      {/* Floating Bottom Bar */}
      {selectedSlots.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-2xl animate-in slide-in-from-bottom duration-200">
          <div className="p-4 sm:p-5 rounded-2xl bg-brand-navy text-white backdrop-blur-md shadow-hard-navy-lg border-[1.5px] border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-lime animate-ping" />
                <span className="text-xs text-stone-300 font-bold">
                  {currentCourt.nama} • {selectedDate}
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="font-bebas text-2xl text-brand-lime">
                  {rangeLabel}
                </span>
                <span className="font-mono text-xs text-stone-300 font-semibold">
                  ({formatRupiah(subtotal)})
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddToCart}
                className="bg-white/10 hover:bg-white/20 text-white border-white/30 font-bebas text-base uppercase tracking-wider"
              >
                <ShoppingBag className="w-4 h-4 mr-1 text-brand-lime" />
                <span>+ Keranjang</span>
              </Button>

              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleDirectCheckout}
                className="font-bebas text-base uppercase tracking-wider shadow-hard-navy"
              >
                <span>Langsung Pesan</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PROMPT LOGIN */}
      {showLoginPrompt && isMounted && createPortal(
        <div className="fixed inset-0 z-[9999] overflow-y-auto flex min-h-screen items-center justify-center p-4 bg-brand-navy/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative bg-white dark:bg-brand-navy w-full max-w-md rounded-2xl p-6 sm:p-7 shadow-hard-navy-lg border-[1.5px] border-brand-line dark:border-white/10 space-y-5 text-center my-auto">
            <div className="w-14 h-14 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 text-amber-600 flex items-center justify-center mx-auto">
              <Lock className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-bebas text-2xl text-brand-ink dark:text-white uppercase tracking-tight">
                Silakan Masuk Terlebih Dahulu
              </h3>
              <p className="font-sora text-xs text-brand-dim dark:text-stone-300 leading-relaxed">
                Anda perlu masuk ke akun FutsalHub untuk melanjutkan booking lapangan agar jadwal resmi terdaftar atas nama tim Anda.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-brand-bg dark:bg-brand-navy/50 border-[1.5px] border-brand-line dark:border-white/10 text-left space-y-1">
              <span className="text-[10px] font-bold text-brand-dim block uppercase tracking-wider">
                Jadwal yang tersimpan:
              </span>
              <span className="text-xs font-bold text-brand-ink dark:text-white">
                {currentCourt.nama} • {rangeLabel} ({formatRupiah(subtotal)})
              </span>
            </div>

            <div className="space-y-2.5 pt-1">
              <Link
                href="/login"
                className="w-full inline-block"
              >
                <Button variant="primary" size="lg" className="w-full font-bebas text-lg tracking-wider uppercase shadow-hard-navy">
                  <span>Masuk / Login Sekarang</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <div className="text-center text-xs text-brand-dim dark:text-stone-400">
                Belum punya akun?{' '}
                <Link
                  href="/register"
                  className="font-bold text-brand-blue dark:text-brand-lime hover:underline"
                >
                  Daftar akun baru
                </Link>
              </div>
              <button
                type="button"
                onClick={() => setShowLoginPrompt(false)}
                className="w-full py-2 text-xs font-semibold text-brand-dim dark:text-stone-400 hover:text-brand-ink dark:hover:text-white cursor-pointer"
              >
                Batal
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL CHECKOUT TENGAH */}
      {showCheckoutModal && isMounted && createPortal(
        <div className="fixed inset-0 z-[9999] overflow-y-auto flex min-h-screen items-center justify-center p-3 sm:p-5 bg-brand-navy/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative bg-white dark:bg-brand-navy w-full max-w-2xl max-h-[88vh] rounded-2xl shadow-hard-navy-lg border-[1.5px] border-brand-line dark:border-white/10 overflow-hidden flex flex-col my-auto">
            
            {/* Header Modal */}
            <div className="flex-shrink-0 px-6 py-4 border-b border-brand-line dark:border-white/10 flex items-center justify-between bg-white dark:bg-brand-navy">
              <button
                type="button"
                onClick={() => setShowCheckoutModal(false)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-dim hover:text-brand-ink dark:hover:text-white cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Kembali ke Jadwal</span>
              </button>

              <h4 className="font-bebas text-xl text-brand-ink dark:text-white uppercase tracking-wider">
                Konfirmasi Checkout
              </h4>

              <button
                type="button"
                onClick={() => setShowCheckoutModal(false)}
                className="p-1.5 rounded-lg text-brand-dim hover:text-brand-ink dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Konten Scrollable */}
            <form id="checkout-form" onSubmit={handleBayarSubmit} className="flex-1 overflow-y-auto p-6 sm:p-7 space-y-6">
              
              {/* Box Rincian Lapangan */}
              <div className="p-4 rounded-xl bg-brand-bg dark:bg-brand-navy/60 border-[1.5px] border-brand-line dark:border-white/10 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-brand-ink dark:text-white uppercase tracking-wider text-[11px]">
                    Venue Terpilih:
                  </span>
                  <Badge variant="navy">{currentCourt.nama}</Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-brand-dim dark:text-stone-300 pt-1">
                  <div>Tanggal Main: <strong className="text-brand-ink dark:text-white">{selectedDate}</strong></div>
                  <div>Jam Bermain: <strong className="text-brand-blue dark:text-brand-lime">{rangeLabel}</strong></div>
                </div>
              </div>

              {/* Data Penyewa */}
              <div className="space-y-4">
                <h4 className="font-bebas text-lg text-brand-ink dark:text-white uppercase tracking-wider">
                  Data Identitas Pemesan
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[11px] font-bold text-brand-dim uppercase block">
                      Nama Lengkap Pemesan / Tim
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Nama Lengkap"
                      value={penyewaNama}
                      onChange={(e) => setPenyewaNama(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-brand-navy/50 border-[1.5px] border-brand-line dark:border-white/10 text-xs font-semibold text-brand-ink dark:text-white focus:outline-none focus:border-brand-blue"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-brand-dim uppercase block">
                      Nomor WhatsApp
                    </label>
                    <div className="flex items-center rounded-xl bg-white dark:bg-brand-navy/50 border-[1.5px] border-brand-line dark:border-white/10 px-3 py-1">
                      <span className="text-xs font-bold text-brand-dim mr-2">
                        +62
                      </span>
                      <input
                        type="tel"
                        required
                        placeholder="812345678"
                        value={penyewaPhone.replace(/^\+62/, '')}
                        onChange={(e) => setPenyewaPhone(e.target.value)}
                        className="w-full bg-transparent text-xs font-semibold text-brand-ink dark:text-white outline-none py-1.5"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-brand-dim uppercase block">
                      Alamat Email
                    </label>
                    <input
                      type="email"
                      placeholder="email@domain.com"
                      value={penyewaEmail}
                      onChange={(e) => setPenyewaEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-brand-navy/50 border-[1.5px] border-brand-line dark:border-white/10 text-xs font-semibold text-brand-ink dark:text-white focus:outline-none focus:border-brand-blue"
                    />
                  </div>
                </div>
              </div>

              {/* Skema Bayar Lunas vs DP */}
              <div className="space-y-3 pt-2 border-t border-brand-line dark:border-white/10">
                <h4 className="font-bebas text-lg text-brand-ink dark:text-white uppercase tracking-wider">
                  Pilihan Skema Pembayaran
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setTipeBayar('lunas')}
                    className={`p-3.5 rounded-xl border-[1.5px] text-left cursor-pointer transition-all ${
                      tipeBayar === 'lunas'
                        ? 'border-brand-blue bg-brand-blue/10 text-brand-ink dark:text-white ring-2 ring-brand-blue/20'
                        : 'border-brand-line dark:border-white/10 bg-white dark:bg-brand-navy/50 text-brand-dim'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bebas text-base uppercase">Bayar Lunas</span>
                      <span className="text-[10px] font-bold text-white px-1.5 py-0.5 rounded bg-brand-navy dark:bg-brand-blue">100%</span>
                    </div>
                    <span className="text-[11px] text-brand-dim block">Selesai sekali bayar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTipeBayar('dp')}
                    className={`p-3.5 rounded-xl border-[1.5px] text-left cursor-pointer transition-all ${
                      tipeBayar === 'dp'
                        ? 'border-brand-blue bg-brand-blue/10 text-brand-ink dark:text-white ring-2 ring-brand-blue/20'
                        : 'border-brand-line dark:border-white/10 bg-white dark:bg-brand-navy/50 text-brand-dim'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bebas text-base uppercase">Bayar DP</span>
                      <span className="text-[10px] font-bold text-amber-900 px-1.5 py-0.5 rounded bg-amber-400">50% Dimuka</span>
                    </div>
                    <span className="text-[11px] text-brand-dim block">Sisa pelunasan di kasir venue</span>
                  </button>
                </div>
              </div>

              {/* Metode Pembayaran */}
              <div className="space-y-3 pt-2 border-t border-brand-line dark:border-white/10">
                <h4 className="font-bebas text-lg text-brand-ink dark:text-white uppercase tracking-wider">
                  Pilih Metode Pembayaran
                </h4>

                {/* QRIS */}
                <label className={`flex items-center justify-between p-3.5 rounded-xl border-[1.5px] cursor-pointer transition-all ${
                  metodeBayar === 'qris'
                    ? 'border-brand-blue bg-brand-blue/10 ring-2 ring-brand-blue/20'
                    : 'border-brand-line dark:border-white/10 bg-white dark:bg-brand-navy/50'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-8 rounded-lg bg-red-600 text-white font-black text-xs flex items-center justify-center tracking-tighter shadow-xs">
                      QRIS
                    </div>
                    <div>
                      <span className="text-xs font-bold text-brand-ink dark:text-white block">
                        QRIS Instant (BCA, Livin, GoPay, OVO, DANA, ShopeePay)
                      </span>
                      <span className="text-[10px] text-emerald-600 dark:text-brand-lime font-bold">Bebas Biaya Admin • Verifikasi Otomatis</span>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="metode"
                    checked={metodeBayar === 'qris'}
                    onChange={() => setMetodeBayar('qris')}
                    className="w-4 h-4 accent-brand-blue"
                  />
                </label>

                {/* Transfer Virtual Account */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-brand-dim uppercase tracking-wider block">
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
                        className={`p-2.5 rounded-xl border-[1.5px] text-left cursor-pointer transition-all ${
                          metodeBayar === bank.id
                            ? 'border-brand-blue bg-brand-blue/10 font-bold ring-1 ring-brand-blue/30'
                            : 'border-brand-line dark:border-white/10 bg-white dark:bg-brand-navy/50 text-brand-dim'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${bank.color}`} />
                          <span className="text-xs text-brand-ink dark:text-white">{bank.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* E-Wallet Langsung */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-brand-dim uppercase tracking-wider block">
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
                        className={`p-2.5 rounded-xl border-[1.5px] text-left cursor-pointer transition-all ${
                          metodeBayar === ew.id
                            ? 'border-brand-blue bg-brand-blue/10 font-bold ring-1 ring-brand-blue/30'
                            : 'border-brand-line dark:border-white/10 bg-white dark:bg-brand-navy/50 text-brand-dim'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${ew.color}`} />
                          <span className="text-xs text-brand-ink dark:text-white">{ew.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </form>

            {/* Footer Modal */}
            <div className="flex-shrink-0 px-6 py-4 bg-brand-bg dark:bg-brand-navy/80 border-t border-brand-line dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[11px] text-brand-dim block font-semibold">
                  Total Tagihan Sekarang ({selectedSlots.length} Jam):
                </span>
                <span className="font-bebas text-3xl text-brand-blue dark:text-brand-lime leading-none block">
                  {formatRupiah(tipeBayar === 'lunas' ? subtotal : Math.round(subtotal * 0.5))}
                </span>
                <span className="text-[10px] text-brand-dim block">
                  {tipeBayar === 'lunas' ? 'Lunas 100%' : 'DP 50% (Sisa di Kasir Venue)'}
                </span>
              </div>

              <Button
                type="submit"
                form="checkout-form"
                variant="primary"
                size="lg"
                className="w-full sm:w-auto font-bebas text-xl tracking-wider uppercase shadow-hard-navy"
              >
                <span>Bayar Sekarang</span>
                <ArrowRight className="w-5 h-5 ml-1" />
              </Button>
            </div>

          </div>
        </div>,
        document.body
      )}

      {/* POPUP INSTRUKSI PEMBAYARAN */}
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
