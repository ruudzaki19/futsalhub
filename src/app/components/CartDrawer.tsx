// src/app/components/CartDrawer.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  ChevronLeft,
  Copy,
  QrCode,
  AlertCircle,
  CreditCard,
  Wallet
} from 'lucide-react';
import { 
  getCartItems, 
  removeFromCart, 
  removeMultipleFromCart,
  clearCart, 
  formatRupiah, 
  CartItem,
  createBooking,
  BookingRecord,
  PaymentMethod
} from '../../data/bookingStore';
import { getStoredUser, UserSession } from '../../data/authStore';
import PaymentInstructionModal from './PaymentInstructionModal';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedCheckout?: () => void;
}

export default function CartDrawer({ isOpen, onClose, onProceedCheckout }: CartDrawerProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [viewStep, setViewStep] = useState<'cart' | 'checkout'>('cart');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Checkout Form State
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [namaPenyewa, setNamaPenyewa] = useState('');
  const [noHp, setNoHp] = useState('');
  const [email, setEmail] = useState('');
  const [metodeBayar, setMetodeBayar] = useState<PaymentMethod>('qris');
  const [tipeBayar, setTipeBayar] = useState<'lunas' | 'dp'>('lunas');
  const [latestBooking, setLatestBooking] = useState<BookingRecord | null>(null);

  useEffect(() => {
    if (isOpen) {
      const items = getCartItems();
      setCartItems(items);
      setSelectedIds(items.map((i) => i.id));
      setViewStep('cart');
      setShowLoginPrompt(false);
      const user = getStoredUser();
      if (user) {
        setCurrentUser(user);
        setNamaPenyewa(user.nama || '');
        setNoHp(user.noHp || '');
        setEmail(user.email || '');
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const handleCartChange = () => {
      const items = getCartItems();
      setCartItems(items);
      setSelectedIds((prev) => prev.filter((id) => items.some((i) => i.id === id)));
    };
    window.addEventListener('futsalhub_cart_changed', handleCartChange);
    return () => window.removeEventListener('futsalhub_cart_changed', handleCartChange);
  }, []);

  // Items terpilih
  const activeItems = useMemo(() => {
    return cartItems.filter((i) => selectedIds.includes(i.id));
  }, [cartItems, selectedIds]);

  const isAllSelected = cartItems.length > 0 && selectedIds.length === cartItems.length;

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(cartItems.map((i) => i.id));
    }
  };

  const handleToggleItem = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleRemoveOne = (id: string) => {
    removeFromCart(id);
    setSelectedIds((prev) => prev.filter((item) => item !== id));
  };

  const handleRemoveSelected = () => {
    if (selectedIds.length === 0) return;
    removeMultipleFromCart(selectedIds);
    setSelectedIds([]);
  };

  const subtotal = useMemo(() => {
    return activeItems.reduce((sum, item) => sum + item.totalHarga, 0);
  }, [activeItems]);

  const totalJam = useMemo(() => {
    return activeItems.reduce((sum, item) => sum + item.totalJam, 0);
  }, [activeItems]);

  const biayaLayanan = metodeBayar === 'qris' ? 0 : 4000;
  const totalAkhir = subtotal + biayaLayanan;
  const nominalDibayar = tipeBayar === 'lunas' ? totalAkhir : Math.round(subtotal * 0.5) + biayaLayanan;
  const sisaPelunasan = totalAkhir - nominalDibayar;

  // Handler Langsung Pesan
  const handleProceedToCheckout = () => {
    if (activeItems.length === 0) {
      return;
    }

    const user = getStoredUser();
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }

    setCurrentUser(user);
    setNamaPenyewa(user.nama || '');
    setNoHp(user.noHp || '');
    setEmail(user.email || '');
    setViewStep('checkout');
  };

  // Submit Checkout
  const handleBayarSekarang = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaPenyewa || !noHp) {
      return;
    }

    const user = getStoredUser();
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }

    const firstItem = activeItems[0];
    const allSlots = activeItems.flatMap((i) => i.slots);
    const bookingId = `FH-${Math.floor(1000 + Math.random() * 9000)}`;

    const uniqueCourts = Array.from(new Set(activeItems.map((i) => i.lapanganNama)));
    const totalJamCount = allSlots.length;
    const formattedCourtTitle = uniqueCourts.length === 1 
      ? `${uniqueCourts[0]} (${totalJamCount} Jam)`
      : `${uniqueCourts.join(' & ')} (${totalJamCount} Jam)`;

    const kodeBayar = metodeBayar === 'qris'
      ? `QRIS-FH-${bookingId}`
      : metodeBayar === 'bca'
      ? `8801 ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`
      : metodeBayar === 'mandiri'
      ? `8802 ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`
      : metodeBayar === 'bni'
      ? `8804 ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`
      : metodeBayar === 'bri'
      ? `8803 ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`
      : `${metodeBayar.toUpperCase()}-089617251030`;

    const newBooking: BookingRecord = {
      id: bookingId,
      namaPenyewa,
      noHp,
      email: email || user.email,
      lapanganId: firstItem.lapanganId,
      lapanganNama: formattedCourtTitle,
      tanggal: firstItem.tanggal,
      tanggalLabel: firstItem.tanggalLabel,
      slots: allSlots,
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

    // Hapus item yang dipesan dari keranjang
    removeMultipleFromCart(activeItems.map((i) => i.id));
    setViewStep('cart');
    onClose();
    setShowPaymentModal(true);
  };

  if (!isMounted) return null;

  return (
    <>
      {isOpen && createPortal(
        <div className="fixed inset-0 z-[9999] overflow-y-auto flex min-h-screen items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative bg-white dark:bg-[#1A1D23] w-full max-w-2xl rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col max-h-[85vh] my-auto">
            
            {/* Header Pop-up Tengah */}
            {viewStep === 'cart' ? (
              <div className="p-5 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-stone-900 dark:text-white uppercase tracking-wider">
                      Keranjang Sewa Lapangan
                    </h3>
                    <span className="text-[11px] text-stone-500 dark:text-stone-400">
                      {cartItems.length} Jadwal di Keranjang
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex-shrink-0 px-6 py-4 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between bg-white dark:bg-[#1A1D23]">
                <button
                  type="button"
                  onClick={() => setViewStep('cart')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Kembali ke Keranjang</span>
                </button>

                <h4 className="text-sm font-black text-stone-900 dark:text-white uppercase tracking-wider">
                  Konfirmasi Checkout
                </h4>

                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

        {/* Modal Prompt Login jika belum masuk */}
        {showLoginPrompt ? (
          <div className="p-8 flex-1 flex flex-col justify-center items-center text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Lock className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-black text-stone-900 dark:text-white">
                Silakan Masuk Terlebih Dahulu
              </h4>
              <p className="text-xs text-stone-500 dark:text-stone-400 max-w-xs">
                Anda perlu masuk ke akun FutsalHub untuk melanjutkan proses reservasi lapangan.
              </p>
            </div>
            <div className="w-full max-w-xs space-y-2 pt-2">
              <Link
                href="/login"
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm transition-all block text-center"
              >
                Masuk / Login Sekarang
              </Link>
              <div className="text-center text-xs text-stone-500">
                Belum punya akun?{' '}
                <Link
                  href="/register"
                  onClick={onClose}
                  className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
                >
                  Daftar akun baru
                </Link>
              </div>
              <button
                type="button"
                onClick={() => setShowLoginPrompt(false)}
                className="w-full py-2 text-xs font-semibold text-stone-500 hover:text-stone-800 cursor-pointer"
              >
                Kembali ke Keranjang
              </button>
            </div>
          </div>
        ) : viewStep === 'cart' ? (
          /* STEP 1: KERANJANG DENGAN PILIH SEMUA & POP-UP TENGAH */
          <>
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              {cartItems.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center mx-auto text-stone-400">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm font-bold text-stone-700 dark:text-stone-300 block">
                      Keranjang masih kosong
                    </span>
                    <p className="text-xs text-stone-400 max-w-xs mx-auto">
                      Silakan pilih lapangan dan jam main Anda di menu Jadwal Lapangan.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Bar Kontrol: Pilih Semua & Hapus Pilihan */}
                  <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/80 flex items-center justify-between text-xs">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-800 dark:text-stone-200">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={handleToggleSelectAll}
                        className="w-4 h-4 rounded accent-emerald-600 cursor-pointer"
                      />
                      <span>Pilih Semua ({cartItems.length} Item)</span>
                    </label>

                    {selectedIds.length > 0 && (
                      <button
                        type="button"
                        onClick={handleRemoveSelected}
                        className="text-[11px] font-semibold text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus Terpilih ({selectedIds.length})</span>
                      </button>
                    )}
                  </div>

                  {/* Daftar Item Keranjang */}
                  <div className="space-y-3">
                    {cartItems.map((item) => {
                      const isChecked = selectedIds.includes(item.id);

                      return (
                        <div
                          key={item.id}
                          className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                            isChecked
                              ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-500/80 shadow-xs'
                              : 'bg-white dark:bg-stone-800/40 border-stone-200 dark:border-stone-700 opacity-70'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleItem(item.id)}
                            className="w-4 h-4 mt-1 rounded accent-emerald-600 cursor-pointer"
                          />

                          <div className="flex-1 space-y-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <span className="text-xs font-bold text-stone-900 dark:text-white block">
                                  {item.lapanganNama} - FutsalHub Arena
                                </span>
                                <span className="text-[11px] text-stone-500 dark:text-stone-400 block font-medium">
                                  {item.tanggalLabel}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveOne(item.id)}
                                className="p-1 text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                                title="Hapus jadwal"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700 flex items-center justify-between text-xs">
                              <span className="font-bold text-stone-800 dark:text-stone-200">
                                {item.rangeLabel}
                              </span>
                              <span className="font-black text-emerald-700 dark:text-emerald-400">
                                {formatRupiah(item.totalHarga)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Footer Aksi */}
            {cartItems.length > 0 && (
              <div className="p-5 border-t border-stone-100 dark:border-stone-800 space-y-3 bg-stone-50/70 dark:bg-stone-900/40">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500 font-medium">
                    Total Terpilih ({selectedIds.length} Pesanan • {totalJam} Jam):
                  </span>
                  <span className="text-lg font-black text-emerald-700 dark:text-emerald-400">
                    {formatRupiah(subtotal)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={onClose}
                    className="py-3 px-3 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs text-center transition-all cursor-pointer"
                  >
                    Tambah Jadwal Lain
                  </button>

                  <button
                    type="button"
                    onClick={handleProceedToCheckout}
                    disabled={activeItems.length === 0}
                    className="py-3 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>Langsung Pesan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : viewStep === 'checkout' ? (
          <>
            {/* Form & Konten yang Bisa Di-scroll dengan Sempurna (Identik Gambar 2) */}
            <form id="checkout-cart-form" onSubmit={handleBayarSekarang} className="flex-1 overflow-y-auto p-6 sm:p-7 space-y-6 text-xs">
              
              {/* Box Rincian Lapangan Terpilih */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-stone-900 dark:text-white">
                    Venue Terpilih:
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-700 text-white font-bold text-[10px]">
                    {activeItems.length === 1 ? activeItems[0].lapanganNama : `${activeItems.length} Jadwal Dipilih`}
                  </span>
                </div>
                <div className="space-y-1.5 pt-1 text-stone-600 dark:text-stone-300">
                  {activeItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center border-t border-emerald-200/40 dark:border-emerald-800/20 pt-1">
                      <div>
                        <strong className="text-stone-900 dark:text-white">{item.lapanganNama}</strong>
                        <span className="text-[11px] text-stone-500 block">{item.tanggalLabel} • {item.rangeLabel}</span>
                      </div>
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">
                        {formatRupiah(item.totalHarga)}
                      </span>
                    </div>
                  ))}
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
                      value={namaPenyewa}
                      onChange={(e) => setNamaPenyewa(e.target.value)}
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
                        value={noHp.replace(/^\+62/, '')}
                        onChange={(e) => setNoHp(e.target.value)}
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                    name="metodeBayarCart"
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

            {/* Footer Modal (Tetap Terlihat di Bawah - Sesuai Gambar 2) */}
            <div className="flex-shrink-0 px-6 py-4 bg-stone-50 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[11px] text-stone-500 dark:text-stone-400 block font-semibold">
                  Total Tagihan Sekarang ({totalJam} Jam):
                </span>
                <span className="text-xl sm:text-2xl font-black text-emerald-700 dark:text-emerald-400">
                  {formatRupiah(nominalDibayar)}
                </span>
                <span className="text-[10px] text-stone-400 block">
                  {tipeBayar === 'lunas' ? 'Lunas 100%' : 'DP 50% (Sisa di Kasir Venue)'}
                </span>
              </div>

              <button
                type="submit"
                form="checkout-cart-form"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Bayar Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : null}

      </div>
    </div>,
    document.body
  )}

  {/* MODAL INSTRUKSI PEMBAYARAN RESMI TERPADU */}
  <PaymentInstructionModal
    isOpen={showPaymentModal}
    booking={latestBooking}
    onClose={() => {
      setShowPaymentModal(false);
      setLatestBooking(null);
    }}
  />
  </>
  );
}
