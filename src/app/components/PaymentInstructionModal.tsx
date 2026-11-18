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
import Badge from './ui/Badge';
import Button from './ui/Button';

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
    updateBookingStatus(booking.id, 'menunggu_verifikasi');
    if (onPaymentConfirmed) onPaymentConfirmed();
    onClose();
    router.push('/profile#riwayat');
  };

  const handleBayarNanti = () => {
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
    <div className="fixed inset-0 z-[9999] overflow-y-auto flex min-h-screen items-center justify-center p-3 sm:p-5 bg-brand-navy/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative bg-white dark:bg-brand-navy w-full max-w-lg max-h-[88vh] rounded-2xl shadow-hard-navy-lg border-[1.5px] border-brand-line dark:border-white/10 flex flex-col overflow-hidden my-auto">
        
        {/* Header Modal */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-brand-line dark:border-white/10 flex items-center justify-between bg-white dark:bg-brand-navy">
          <div className="flex items-center gap-2.5">
            <span className={`w-3 h-3 rounded-full ${isExpired ? 'bg-red-500' : 'bg-brand-lime animate-ping'}`} />
            <div>
              <span className="text-[10px] font-bold text-brand-dim uppercase tracking-wider block font-bebas text-xs">
                Instruksi Pembayaran Resmi
              </span>
              <h3 className="font-bebas text-lg text-brand-ink dark:text-white uppercase">
                Booking #{booking.id} • {booking.lapanganNama}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-brand-dim hover:text-brand-ink dark:hover:text-white transition-colors cursor-pointer"
            title="Tutup Jendela"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Konten Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-center">
          
          {/* Banner Batas Waktu Pembayaran 10 Menit */}
          {isExpired ? (
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border-[1.5px] border-red-300 dark:border-red-800 text-red-800 dark:text-red-300 text-xs flex items-center gap-3 text-left">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-600" />
              <div>
                <strong className="block font-bold">Waktu Pembayaran Telah Habis!</strong>
                <span>Batas 10 menit terlampaui. Slot jadwal lapangan ini otomatis dibuka kembali untuk pemesan lain.</span>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border-[1.5px] border-amber-300 dark:border-amber-700 flex items-center justify-between px-4">
              <div className="flex items-center gap-2 text-left">
                <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
                <div>
                  <span className="text-[10px] text-amber-800 dark:text-amber-300 font-bold block uppercase tracking-wider">
                    Selesaikan Pembayaran Dalam:
                  </span>
                  <span className="text-[11px] text-stone-600 dark:text-stone-300">
                    Slot terkunci khusus untuk Anda selama 10 menit
                  </span>
                </div>
              </div>
              <div className="px-3 py-1 rounded-lg bg-brand-navy text-brand-lime font-mono font-bold text-sm tracking-wider shadow-xs border border-white/10">
                {timerFormatted}
              </div>
            </div>
          )}

          {/* Card Total Nominal & Skema */}
          <div className="p-4 sm:p-5 rounded-xl bg-brand-bg dark:bg-brand-navy/60 border-[1.5px] border-brand-line dark:border-white/10 space-y-1.5">
            <span className="text-xs text-brand-dim dark:text-stone-300 block font-medium">
              Total yang Perlu Ditransfer Sekarang:
            </span>
            <div className="font-bebas text-4xl text-brand-blue dark:text-brand-lime tracking-tight leading-none">
              {formatRupiah(booking.nominalDibayar)}
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-brand-navy text-white text-[11px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-lime" />
              <span>Skema: {booking.tipePembayaran === 'lunas' ? 'Pelunasan 100%' : 'Uang Muka (DP 50%)'}</span>
            </div>
            {booking.sisaPelunasan > 0 && (
              <p className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold pt-1">
                Sisa pelunasan sebesar {formatRupiah(booking.sisaPelunasan)} dibayar langsung di kasir venue saat bermain.
              </p>
            )}
          </div>

          {/* Card Rekening / QRIS */}
          {isQris ? (
            <div className="space-y-3">
              <div className="inline-block p-4 rounded-2xl bg-white border-[1.5px] border-brand-navy shadow-hard-navy">
                <div className="w-48 h-48 bg-stone-50 rounded-xl flex flex-col items-center justify-center p-3 text-center border border-dashed border-stone-300 relative">
                  <QrCode className="w-24 h-24 text-brand-navy" />
                  <span className="font-bebas text-sm text-brand-navy mt-2 tracking-wider uppercase">
                    QRIS INSTANT FUTSALHUB
                  </span>
                  <span className="text-[9px] text-stone-500 font-mono">
                    NMID: ID102008961725
                  </span>
                </div>
              </div>
              <p className="text-xs text-brand-dim dark:text-stone-300 max-w-sm mx-auto leading-relaxed">
                Buka aplikasi BCA Mobile, Mandiri Livin, GoPay, OVO, DANA, atau ShopeePay Anda, lalu scan kode QR di atas.
              </p>
            </div>
          ) : isVirtualAccount ? (
            <div className="space-y-3">
              <div className="p-4 sm:p-5 rounded-xl bg-brand-bg dark:bg-brand-navy/60 border-[1.5px] border-brand-line dark:border-white/10 space-y-2 text-left">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-brand-dim uppercase tracking-wider text-[10px]">
                    {getBankName()}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-brand-lime">
                    Verifikasi Otomatis
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-brand-navy/80 border-[1.5px] border-brand-line dark:border-white/10">
                  <span className="text-xl sm:text-2xl font-mono font-bold tracking-wider text-brand-ink dark:text-white">
                    {booking.kodeBayar}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="px-3 py-1.5 rounded-lg bg-brand-navy text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 hover:bg-brand-ink"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-brand-lime" />
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

                <div className="text-[11px] text-brand-dim dark:text-stone-400 pt-1">
                  Atas Nama: <strong className="text-brand-ink dark:text-white">FutsalHub Arena Management</strong>
                </div>
              </div>

              <p className="text-xs text-brand-dim dark:text-stone-400">
                Transfer tepat hingga digit terakhir agar otomatis diverifikasi sistem kasir.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-4 sm:p-5 rounded-xl bg-brand-bg dark:bg-brand-navy/60 border-[1.5px] border-brand-line dark:border-white/10 space-y-2 text-left">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-brand-dim uppercase tracking-wider text-[10px]">
                    Transfer E-Wallet ({booking.metodePembayaran.toUpperCase()})
                  </span>
                  <span className="text-[11px] font-bold text-brand-blue dark:text-brand-lime">
                    Instan
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-brand-navy/80 border-[1.5px] border-brand-line dark:border-white/10">
                  <span className="text-xl sm:text-2xl font-mono font-bold tracking-wider text-brand-ink dark:text-white">
                    {booking.kodeBayar}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="px-3 py-1.5 rounded-lg bg-brand-navy text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 hover:bg-brand-ink"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-brand-lime" />
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

                <div className="text-[11px] text-brand-dim dark:text-stone-400 pt-1">
                  Atas Nama Akun: <strong className="text-brand-ink dark:text-white">FutsalHub Arena Management</strong>
                </div>
              </div>
            </div>
          )}

          {/* Rincian Singkat Jadwal */}
          <div className="p-3.5 rounded-xl bg-brand-bg dark:bg-brand-navy/60 border-[1.5px] border-brand-line dark:border-white/10 text-xs text-left space-y-1 text-brand-dim dark:text-stone-300">
            <div className="flex justify-between">
              <span>Tanggal Main:</span>
              <strong className="text-brand-ink dark:text-white">{booking.tanggal} ({booking.tanggalLabel})</strong>
            </div>
            <div className="flex justify-between">
              <span>Jam Bermain:</span>
              <strong className="text-brand-blue dark:text-brand-lime">{booking.slots.map((s) => s.jam).join(', ')}</strong>
            </div>
          </div>

        </div>

        {/* Footer Tombol Aksi */}
        <div className="flex-shrink-0 p-5 bg-brand-bg dark:bg-brand-navy/80 border-t border-brand-line dark:border-white/10 space-y-2.5">
          {isExpired ? (
            <Button
              type="button"
              variant="dark"
              size="lg"
              onClick={onClose}
              className="w-full font-bebas text-lg tracking-wider uppercase"
            >
              Waktu Habis — Tutup & Pilih Jadwal Lain
            </Button>
          ) : (
            <>
              <Button
                type="button"
                variant="primary"
                size="lg"
                onClick={handleSudahBayar}
                className="w-full font-bebas text-xl tracking-wider uppercase shadow-hard-navy"
              >
                <CheckCircle2 className="w-5 h-5 mr-1" />
                <span>Saya Sudah Membayar (Kunci Jadwal Permanen)</span>
              </Button>

              <div className="flex items-center justify-between gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleBayarNanti}
                  className="flex-1 py-2 px-3 rounded-xl bg-white dark:bg-brand-navy/60 hover:bg-stone-100 text-brand-ink dark:text-white border-[1.5px] border-brand-line dark:border-white/10 font-bold text-xs transition-colors cursor-pointer text-center"
                >
                  ⏱ Bayar Nanti (Batas 10 Mnt di Profil)
                </button>

                <button
                  type="button"
                  onClick={handleBatalBooking}
                  className="py-2 px-3 text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors cursor-pointer"
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
