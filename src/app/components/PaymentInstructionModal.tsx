// src/app/components/PaymentInstructionModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { 
  X, 
  Copy, 
  QrCode, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ShieldCheck,
  Check,
  AlertTriangle
} from 'lucide-react';
import { 
  BookingRecord, 
  formatRupiah, 
  updateBookingStatus, 
  cancelBooking,
  checkAndExpireBookings
} from '../../data/bookingStore';

interface PaymentInstructionModalProps {
  isOpen: boolean;
  booking: BookingRecord | null;
  onClose: () => void;
  onPaymentConfirmed?: () => void;
}

export default function PaymentInstructionModal({
  isOpen,
  booking,
  onClose,
  onPaymentConfirmed,
}: PaymentInstructionModalProps) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState<number>(600); // 10 menit = 600 detik
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Hitung countdown timer 10 menit real-time
  useEffect(() => {
    if (!isOpen || !booking) return;

    const calculateRemaining = () => {
      const now = Date.now();
      let targetTime = 0;
      if (booking.expiresAt) {
        targetTime = new Date(booking.expiresAt).getTime();
      } else if (booking.createdAt) {
        targetTime = new Date(booking.createdAt).getTime() + 10 * 60 * 1000;
      } else {
        targetTime = now + 10 * 60 * 1000;
      }

      const diff = Math.floor((targetTime - now) / 1000);
      if (diff <= 0) {
        setSecondsLeft(0);
        setIsExpired(true);
        checkAndExpireBookings();
      } else {
        setSecondsLeft(diff);
        setIsExpired(false);
      }
    };

    calculateRemaining();
    const timer = setInterval(calculateRemaining, 1000);
    return () => clearInterval(timer);
  }, [isOpen, booking]);

  if (!isOpen || !booking || !isMounted) return null;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timerFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const handleCopyCode = () => {
    if (!booking.kodeBayar) return;
    navigator.clipboard.writeText(booking.kodeBayar);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSudahBayar = () => {
    if (isExpired) return;
    // Ubah status ke menunggu_verifikasi agar kasir memeriksa pembayaran
    // dan slot resmi terkunci permanen di jadwal lapangan
    updateBookingStatus(booking.id, 'menunggu_verifikasi');
    if (onPaymentConfirmed) onPaymentConfirmed();
    onClose();
    router.push('/profile#riwayat');
  };

  const handleBayarNanti = () => {
    // Tetap 'menunggu_pembayaran' dengan batas waktu 10 menit
    updateBookingStatus(booking.id, 'menunggu_pembayaran');
    onClose();
  };

  const handleBatalBooking = () => {
    if (confirm('Batalkan pesanan ini? Slot jadwal lapangan akan langsung dibuka kembali untuk penyewa lain.')) {
      cancelBooking(booking.id);
      onClose();
    }
  };

  const isQris = booking.metodePembayaran === 'qris';
  const isVirtualAccount = ['bca', 'mandiri', 'bni', 'bri'].includes(booking.metodePembayaran);

  const getBankName = () => {
    switch (booking.metodePembayaran) {
      case 'bca': return 'BCA Virtual Account';
      case 'mandiri': return 'Mandiri Virtual Account';
      case 'bni': return 'BNI Virtual Account';
      case 'bri': return 'BRI Virtual Account (BRIVA)';
      case 'gopay': return 'GoPay QR / Nomor Akun';
      case 'dana': return 'DANA Dompet Digital';
      case 'ovo': return 'OVO Dompet Digital';
      case 'shopeepay': return 'ShopeePay';
      default: return 'QRIS Standar Indonesia';
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] overflow-y-auto flex min-h-screen items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative bg-white dark:bg-[#1A1D23] w-full max-w-lg max-h-[88vh] rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 flex flex-col overflow-hidden my-auto">
        
        {/* Header Modal */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between bg-white dark:bg-[#1A1D23]">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isExpired ? 'bg-red-500' : 'bg-amber-500 animate-pulse'}`} />
            <div>
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                Instruksi Pembayaran Resmi
              </span>
              <h3 className="text-sm font-black text-stone-900 dark:text-white">
                Booking #{booking.id} • {booking.lapanganNama}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors cursor-pointer"
            title="Tutup Jendela"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Konten Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-center">
          
          {/* Banner Batas Waktu Pembayaran 10 Menit (Shopee Style) */}
          {isExpired ? (
            <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-300 text-xs flex items-center gap-3 text-left">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-600" />
              <div>
                <strong className="block font-bold">Waktu Pembayaran Telah Habis!</strong>
                <span>Batas 10 menit terlampaui. Slot jadwal lapangan ini otomatis dibuka kembali untuk pemesan lain.</span>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/80 flex items-center justify-between px-4">
              <div className="flex items-center gap-2 text-left">
                <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
                <div>
                  <span className="text-[10px] text-amber-800 dark:text-amber-300 font-bold block uppercase tracking-wider">
                    Selesaikan Pembayaran Dalam:
                  </span>
                  <span className="text-[11px] text-stone-600 dark:text-stone-400">
                    Slot terkunci khusus untuk Anda selama 10 menit
                  </span>
                </div>
              </div>
              <div className="px-3 py-1 rounded-xl bg-amber-500 text-white font-mono font-black text-sm tracking-widest shadow-xs">
                {timerFormatted}
              </div>
            </div>
          )}

          {/* Card Total Nominal & Skema */}
          <div className="p-4 sm:p-5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/80 space-y-1.5">
            <span className="text-xs text-stone-500 dark:text-stone-400 block font-medium">
              Total yang Perlu Ditransfer Sekarang:
            </span>
            <div className="text-3xl font-black text-emerald-700 dark:text-emerald-400 tracking-tight">
              {formatRupiah(booking.nominalDibayar)}
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/40 text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Skema: {booking.tipePembayaran === 'lunas' ? 'Pelunasan 100%' : 'Uang Muka (DP 50%)'}</span>
            </div>
            {booking.sisaPelunasan > 0 && (
              <p className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold pt-1">
                Sisa pelunasan sebesar {formatRupiah(booking.sisaPelunasan)} dibayar langsung di meja kasir venue saat bermain.
              </p>
            )}
          </div>

          {/* Card Rekening / QRIS */}
          {isQris ? (
            <div className="space-y-3">
              <div className="inline-block p-4 rounded-3xl bg-white border-2 border-stone-900 shadow-md">
                <div className="w-48 h-48 bg-stone-50 rounded-2xl flex flex-col items-center justify-center p-3 text-center border border-dashed border-stone-300 relative group">
                  <QrCode className="w-24 h-24 text-stone-900" />
                  <span className="text-[10px] font-black text-stone-900 mt-2 tracking-wider">
                    QRIS INSTANT FUTSALHUB
                  </span>
                  <span className="text-[9px] text-stone-500 font-mono">
                    NMID: ID102008961725
                  </span>
                </div>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto leading-relaxed">
                Buka aplikasi BCA Mobile, Mandiri Livin, GoPay, OVO, DANA, atau ShopeePay Anda, lalu scan kode QR di atas.
              </p>
            </div>
          ) : isVirtualAccount ? (
            <div className="space-y-3">
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/40 space-y-2 text-left">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-500 uppercase tracking-wider text-[10px]">
                    {getBankName()}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                    Verifikasi Otomatis
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                  <span className="text-xl sm:text-2xl font-mono font-black tracking-wider text-stone-900 dark:text-white">
                    {booking.kodeBayar}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-stone-700 dark:hover:bg-stone-600 text-stone-800 dark:text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin VA</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="text-[11px] text-stone-600 dark:text-stone-400 pt-1">
                  Atas Nama: <strong className="text-stone-900 dark:text-white">FutsalHub Arena Management</strong>
                </div>
              </div>

              <p className="text-xs text-stone-500 dark:text-stone-400">
                Transfer tepat hingga digit terakhir agar otomatis diverifikasi sistem kasir.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/40 space-y-2 text-left">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-500 uppercase tracking-wider text-[10px]">
                    Transfer E-Wallet ({booking.metodePembayaran.toUpperCase()})
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                    Instan
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                  <span className="text-xl sm:text-2xl font-mono font-black tracking-wider text-stone-900 dark:text-white">
                    {booking.kodeBayar}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-stone-700 dark:hover:bg-stone-600 text-stone-800 dark:text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin No HP</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="text-[11px] text-stone-600 dark:text-stone-400 pt-1">
                  Atas Nama Akun: <strong className="text-stone-900 dark:text-white">FutsalHub Arena Management</strong>
                </div>
              </div>
            </div>
          )}

          {/* Rincian Singkat Jadwal */}
          <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-700/60 text-xs text-left space-y-1 text-stone-600 dark:text-stone-300">
            <div className="flex justify-between">
              <span>Tanggal Main:</span>
              <strong className="text-stone-900 dark:text-white">{booking.tanggal} ({booking.tanggalLabel})</strong>
            </div>
            <div className="flex justify-between">
              <span>Jam Bermain:</span>
              <strong className="text-emerald-700 dark:text-emerald-400">{booking.slots.map((s) => s.jam).join(', ')}</strong>
            </div>
          </div>

        </div>

        {/* Footer Tombol Aksi */}
        <div className="flex-shrink-0 p-5 bg-stone-50 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 space-y-2.5">
          
          {isExpired ? (
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3.5 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs tracking-wide shadow-md transition-all cursor-pointer"
            >
              Waktu Habis — Tutup & Pilih Jadwal Lain
            </button>
          ) : (
            <>
              {/* Tombol Utama: Sudah Bayar */}
              <button
                type="button"
                onClick={handleSudahBayar}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs tracking-wide shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Saya Sudah Membayar (Kunci Jadwal Permanen)</span>
              </button>

              {/* Opsi Bayar Nanti (Batas 10 Mnt) & Batalkan */}
              <div className="flex items-center justify-between gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleBayarNanti}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 font-bold text-xs transition-colors cursor-pointer text-center"
                >
                  ⏱ Bayar Nanti (Batas 10 Mnt di Profil)
                </button>

                <button
                  type="button"
                  onClick={handleBatalBooking}
                  className="py-2.5 px-3 text-xs font-semibold text-stone-400 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                >
                  Batalkan Pesanan
                </button>
              </div>
            </>
          )}

        </div>

      </div>
    </div>,
    document.body
  );
}
