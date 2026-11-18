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
import Badge from './ui/Badge';
import Button from './ui/Button';

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

    removeMultipleFromCart(activeItems.map((i) => i.id));
    setViewStep('cart');
    onClose();
    setShowPaymentModal(true);
  };

  if (!isMounted) return null;

  return (
    <>
      {isOpen && createPortal(
        <div className="fixed inset-0 z-[9999] overflow-y-auto flex min-h-screen items-center justify-center p-3 sm:p-5 bg-brand-navy/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative bg-white dark:bg-brand-navy w-full max-w-2xl rounded-2xl shadow-hard-navy-lg border-[1.5px] border-brand-line dark:border-white/10 overflow-hidden flex flex-col max-h-[88vh] my-auto">
            
            {/* Header Pop-up */}
            {viewStep === 'cart' ? (
              <div className="p-5 border-b border-brand-line dark:border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-brand-navy dark:bg-brand-lime text-brand-lime dark:text-brand-navy flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bebas text-xl text-brand-ink dark:text-white uppercase tracking-wider leading-none">
                      Keranjang Sewa Lapangan
                    </h3>
                    <span className="text-[11px] text-brand-dim dark:text-stone-400">
                      {cartItems.length} Jadwal di Keranjang
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-brand-dim hover:text-brand-ink dark:hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex-shrink-0 px-6 py-4 border-b border-brand-line dark:border-white/10 flex items-center justify-between bg-white dark:bg-brand-navy">
                <button
                  type="button"
                  onClick={() => setViewStep('cart')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-dim hover:text-brand-ink dark:hover:text-white cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Kembali ke Keranjang</span>
                </button>

                <h4 className="font-bebas text-xl text-brand-ink dark:text-white uppercase tracking-wider">
                  Konfirmasi Checkout
                </h4>

                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-brand-dim hover:text-brand-ink dark:hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Konten Langkah 1: List Keranjang */}
            {viewStep === 'cart' ? (
              <>
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {cartItems.length === 0 ? (
                    <div className="py-16 text-center space-y-3">
                      <div className="w-14 h-14 rounded-2xl bg-brand-bg dark:bg-brand-navy/60 border border-brand-line dark:border-white/10 text-brand-dim flex items-center justify-center mx-auto">
                        <ShoppingBag className="w-7 h-7" />
                      </div>
                      <h4 className="font-bebas text-2xl text-brand-ink dark:text-white uppercase">
                        Keranjang Sewa Kosong
                      </h4>
                      <p className="text-xs text-brand-dim dark:text-stone-400 max-w-xs mx-auto">
                        Belum ada jadwal yang dimasukkan. Pilih lapangan dan jam bermain Anda di kalender jadwal.
                      </p>
                      <div className="pt-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={onClose}
                          className="font-bebas text-base uppercase tracking-wider shadow-hard-navy"
                        >
                          Lihat Kalender Slot
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Bar Aksi Select All */}
                      <div className="flex items-center justify-between px-2 pb-2 border-b border-brand-line dark:border-white/10 text-xs">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={isAllSelected}
                            onChange={handleToggleSelectAll}
                            className="w-4 h-4 rounded accent-brand-blue"
                          />
                          <span className="font-bold text-brand-ink dark:text-white">
                            Pilih Semua ({selectedIds.length}/{cartItems.length})
                          </span>
                        </label>

                        {selectedIds.length > 0 && (
                          <button
                            type="button"
                            onClick={handleRemoveSelected}
                            className="text-rose-600 hover:text-rose-700 text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Hapus ({selectedIds.length})</span>
                          </button>
                        )}
                      </div>

                      {/* List Item */}
                      <div className="space-y-3">
                        {cartItems.map((item) => {
                          const isSelected = selectedIds.includes(item.id);
                          return (
                            <div
                              key={item.id}
                              className={`p-4 rounded-xl border-[1.5px] transition-all flex items-start gap-3.5 ${
                                isSelected
                                  ? 'border-brand-navy dark:border-brand-lime bg-brand-bg dark:bg-brand-navy/40 shadow-xs'
                                  : 'border-brand-line dark:border-white/10 bg-white dark:bg-brand-navy/20 opacity-70'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleToggleItem(item.id)}
                                className="w-4 h-4 rounded accent-brand-blue mt-1 cursor-pointer"
                              />

                              <div className="flex-1 space-y-1 text-left">
                                <div className="flex items-center justify-between">
                                  <Badge variant="navy">Venue #{item.lapanganId}</Badge>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveOne(item.id)}
                                    className="text-brand-dim hover:text-rose-600 p-1 cursor-pointer"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>

                                <h4 className="font-bebas text-xl text-brand-ink dark:text-white uppercase leading-tight">
                                  {item.lapanganNama}
                                </h4>

                                <div className="text-xs text-brand-dim dark:text-stone-300">
                                  <span>{item.tanggalLabel}</span> • <span className="font-bold text-brand-blue dark:text-brand-lime">{item.rangeLabel}</span>
                                </div>

                                <div className="pt-2 flex items-baseline justify-between border-t border-brand-line dark:border-white/10 mt-2">
                                  <span className="text-[11px] text-brand-dim">
                                    {item.totalJam} Jam Bermain
                                  </span>
                                  <span className="font-bebas text-2xl text-brand-blue dark:text-brand-lime">
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

                {/* Footer Keranjang */}
                {cartItems.length > 0 && (
                  <div className="p-5 bg-brand-bg dark:bg-brand-navy/80 border-t border-brand-line dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <span className="text-[11px] text-brand-dim block font-semibold">
                        Total {selectedIds.length} Jadwal Dipilih ({totalJam} Jam):
                      </span>
                      <span className="font-bebas text-3xl text-brand-blue dark:text-brand-lime leading-none block">
                        {formatRupiah(subtotal)}
                      </span>
                    </div>

                    <Button
                      type="button"
                      variant="primary"
                      size="lg"
                      disabled={selectedIds.length === 0}
                      onClick={handleProceedToCheckout}
                      className="w-full sm:w-auto font-bebas text-xl tracking-wider uppercase shadow-hard-navy"
                    >
                      <span>Lanjut Checkout</span>
                      <ArrowRight className="w-5 h-5 ml-1" />
                    </Button>
                  </div>
                )}
              </>
            ) : (
              /* Konten Langkah 2: Form Checkout */
              <>
                <form id="drawer-checkout-form" onSubmit={handleBayarSekarang} className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Rincian Ringkas */}
                  <div className="p-4 rounded-xl bg-brand-bg dark:bg-brand-navy/60 border-[1.5px] border-brand-line dark:border-white/10 space-y-2 text-xs">
                    <span className="font-bold text-brand-dim uppercase tracking-wider text-[10px] block">
                      Ringkasan Booking ({activeItems.length} Pesanan):
                    </span>
                    <div className="space-y-1.5">
                      {activeItems.map((item) => (
                        <div key={item.id} className="flex justify-between text-brand-ink dark:text-stone-300">
                          <span>{item.lapanganNama} • {item.rangeLabel}</span>
                          <span className="font-bold">{formatRupiah(item.totalHarga)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Form Identitas */}
                  <div className="space-y-4">
                    <h4 className="font-bebas text-lg text-brand-ink dark:text-white uppercase tracking-wider">
                      Data Identitas Pemesan
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2 space-y-1">
                        <label className="text-[11px] font-bold text-brand-dim uppercase block">
                          Nama Pemesan / Tim
                        </label>
                        <input
                          type="text"
                          required
                          value={namaPenyewa}
                          onChange={(e) => setNamaPenyewa(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-brand-navy/50 border-[1.5px] border-brand-line dark:border-white/10 text-xs font-semibold text-brand-ink dark:text-white focus:outline-none focus:border-brand-blue"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-brand-dim uppercase block">
                          Nomor WhatsApp
                        </label>
                        <input
                          type="tel"
                          required
                          value={noHp}
                          onChange={(e) => setNoHp(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-brand-navy/50 border-[1.5px] border-brand-line dark:border-white/10 text-xs font-semibold text-brand-ink dark:text-white focus:outline-none focus:border-brand-blue"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-brand-dim uppercase block">
                          Alamat Email
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-brand-navy/50 border-[1.5px] border-brand-line dark:border-white/10 text-xs font-semibold text-brand-ink dark:text-white focus:outline-none focus:border-brand-blue"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Skema Bayar */}
                  <div className="space-y-3 pt-2 border-t border-brand-line dark:border-white/10">
                    <h4 className="font-bebas text-lg text-brand-ink dark:text-white uppercase tracking-wider">
                      Skema Pembayaran
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
                          <span className="font-bebas text-base uppercase">Lunas</span>
                          <span className="text-[10px] font-bold text-white px-1.5 py-0.5 rounded bg-brand-navy dark:bg-brand-blue">100%</span>
                        </div>
                        <span className="text-[11px] text-brand-dim block">Sekali bayar</span>
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
                          <span className="font-bebas text-base uppercase">DP 50%</span>
                          <span className="text-[10px] font-bold text-amber-900 px-1.5 py-0.5 rounded bg-amber-400">Dimuka</span>
                        </div>
                        <span className="text-[11px] text-brand-dim block">Sisa di kasir</span>
                      </button>
                    </div>
                  </div>

                  {/* Metode Bayar */}
                  <div className="space-y-3 pt-2 border-t border-brand-line dark:border-white/10">
                    <h4 className="font-bebas text-lg text-brand-ink dark:text-white uppercase tracking-wider">
                      Metode Pembayaran
                    </h4>

                    <label className={`flex items-center justify-between p-3.5 rounded-xl border-[1.5px] cursor-pointer transition-all ${
                      metodeBayar === 'qris'
                        ? 'border-brand-blue bg-brand-blue/10 ring-2 ring-brand-blue/20'
                        : 'border-brand-line dark:border-white/10 bg-white dark:bg-brand-navy/50'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-8 rounded-lg bg-red-600 text-white font-black text-xs flex items-center justify-center tracking-tighter">
                          QRIS
                        </div>
                        <div>
                          <span className="text-xs font-bold text-brand-ink dark:text-white block">
                            QRIS Instant
                          </span>
                          <span className="text-[10px] text-emerald-600 dark:text-brand-lime font-bold">Bebas Biaya Admin • Auto Verifikasi</span>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="drawer_metode"
                        checked={metodeBayar === 'qris'}
                        onChange={() => setMetodeBayar('qris')}
                        className="w-4 h-4 accent-brand-blue"
                      />
                    </label>

                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'bca', label: 'BCA VA' },
                        { id: 'mandiri', label: 'Mandiri VA' },
                        { id: 'gopay', label: 'GoPay' },
                        { id: 'dana', label: 'DANA' },
                      ].map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setMetodeBayar(m.id as any)}
                          className={`p-2.5 rounded-xl border-[1.5px] text-left cursor-pointer transition-all ${
                            metodeBayar === m.id
                              ? 'border-brand-blue bg-brand-blue/10 font-bold ring-1 ring-brand-blue/30'
                              : 'border-brand-line dark:border-white/10 bg-white dark:bg-brand-navy/50 text-brand-dim'
                          }`}
                        >
                          <span className="text-xs text-brand-ink dark:text-white">{m.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </form>

                {/* Footer Drawer Checkout */}
                <div className="flex-shrink-0 px-6 py-4 bg-brand-bg dark:bg-brand-navy/80 border-t border-brand-line dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] text-brand-dim block font-semibold">
                      Total Dibayar Sekarang ({activeItems.length} Pesanan):
                    </span>
                    <span className="font-bebas text-3xl text-brand-blue dark:text-brand-lime leading-none block">
                      {formatRupiah(nominalDibayar)}
                    </span>
                  </div>

                  <Button
                    type="submit"
                    form="drawer-checkout-form"
                    variant="primary"
                    size="lg"
                    className="w-full sm:w-auto font-bebas text-xl tracking-wider uppercase shadow-hard-navy"
                  >
                    <span>Bayar Sekarang</span>
                    <ArrowRight className="w-5 h-5 ml-1" />
                  </Button>
                </div>
              </>
            )}

          </div>
        </div>,
        document.body
      )}

      {/* POPUP INSTRUKSI PEMBAYARAN */}
      <PaymentInstructionModal
        isOpen={showPaymentModal}
        booking={latestBooking}
        onClose={() => setShowPaymentModal(false)}
      />

      {/* MODAL PROMPT LOGIN */}
      {showLoginPrompt && isMounted && createPortal(
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-brand-navy/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-brand-navy w-full max-w-sm rounded-2xl p-6 text-center space-y-4 shadow-hard-navy-lg border-[1.5px] border-brand-line dark:border-white/10">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-300">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bebas text-2xl text-brand-ink dark:text-white uppercase">
                Masuk Terlebih Dahulu
              </h4>
              <p className="text-xs text-brand-dim dark:text-stone-300 mt-1">
                Silakan masuk akun untuk menyelesaikan pemesanan jadwal di keranjang.
              </p>
            </div>
            <div className="space-y-2 pt-1">
              <Link href="/login" className="w-full inline-block">
                <Button variant="primary" size="md" className="w-full font-bebas text-lg tracking-wider uppercase shadow-hard-navy">
                  Masuk Sekarang
                </Button>
              </Link>
              <button
                type="button"
                onClick={() => setShowLoginPrompt(false)}
                className="w-full py-1.5 text-xs text-brand-dim hover:text-brand-ink dark:hover:text-white cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
