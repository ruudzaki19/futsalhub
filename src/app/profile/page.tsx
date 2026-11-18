// src/app/profile/page.tsx
'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Camera, 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Save, 
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  Printer,
  X,
  FileText,
  CreditCard,
  Trash2
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { getStoredUser, setStoredUser, UserSession } from '../../data/authStore';
import { 
  getAllBookings, 
  formatRupiah, 
  BookingRecord,
  cancelBooking,
  checkAndExpireBookings,
  hideBookingForUser,
  clearUserBookingHistory
} from '../../data/bookingStore';
import PaymentInstructionModal from '../components/PaymentInstructionModal';

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [session, setSession] = useState<UserSession | null>(null);
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [noHp, setNoHp] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  // Data Riwayat Booking Pelanggan
  const [allBookings, setAllBookings] = useState<BookingRecord[]>([]);
  const [selectedReceipt, setSelectedReceipt] = useState<BookingRecord | null>(null);
  const [payModalBooking, setPayModalBooking] = useState<BookingRecord | null>(null);

  useEffect(() => {
    const user = getStoredUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setSession(user);
    setNama(user.nama);
    setEmail(user.email);
    setNoHp(user.noHp);
    setAvatarPreview(user.avatarUrl);

    setAllBookings(getAllBookings());
  }, [router]);

  useEffect(() => {
    const handleUpdate = () => setAllBookings(getAllBookings());
    window.addEventListener('futsalhub_bookings_changed', handleUpdate);

    const interval = setInterval(() => {
      checkAndExpireBookings();
      setAllBookings(getAllBookings());
    }, 2000);

    return () => {
      window.removeEventListener('futsalhub_bookings_changed', handleUpdate);
      clearInterval(interval);
    };
  }, []);

  const myBookings = useMemo(() => {
    if (!session) return [];
    return allBookings.filter((b) => {
      if (b.hiddenFromUser) return false;
      const matchEmail = b.email && session.email && b.email.toLowerCase() === session.email.toLowerCase();
      const matchHp = b.noHp && session.noHp && (b.noHp.includes(session.noHp) || session.noHp.includes(b.noHp));
      const matchNama = b.namaPenyewa && session.nama && (
        b.namaPenyewa.toLowerCase().includes(session.nama.toLowerCase()) ||
        session.nama.toLowerCase().includes(b.namaPenyewa.toLowerCase())
      );
      return matchEmail || matchHp || matchNama;
    });
  }, [allBookings, session]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setAvatarPreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;

    setIsSaving(true);
    setTimeout(() => {
      const updated: UserSession = {
        ...session,
        nama,
        email,
        noHp,
        avatarUrl: avatarPreview,
      };

      setStoredUser(updated);
      setSession(updated);
      setIsSaving(false);
      setSaveSuccessMsg(true);
      setTimeout(() => setSaveSuccessMsg(false), 3000);
    }, 400);
  };

  if (!session) return null;

  return (
    <div className="min-h-screen bg-brand-bg dark:bg-brand-ink text-brand-ink dark:text-stone-100 font-sora selection:bg-brand-lime selection:text-brand-navy flex flex-col justify-between transition-colors">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-10 w-full flex-1">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-bold text-brand-dim hover:text-brand-blue dark:hover:text-brand-lime transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        {/* SECTION 1: RIWAYAT & STATUS BOOKING */}
        <div id="riwayat" className="bg-white dark:bg-brand-navy/30 border-[1.5px] border-brand-line dark:border-white/10 rounded-2xl p-6 sm:p-10 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-line dark:border-white/10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-navy text-brand-lime text-xs font-bebas tracking-wider uppercase mb-2">
                <Calendar className="w-3.5 h-3.5" />
                Status Reservasi Real-Time
              </div>
              <h2 className="font-bebas text-3xl sm:text-4xl text-brand-ink dark:text-white uppercase tracking-tight leading-none">
                RIWAYAT & STATUS BOOKING ANDA
              </h2>
              <p className="font-sora text-xs text-brand-dim dark:text-stone-400 mt-1">
                Pantau verifikasi jadwal tim Anda secara langsung. Status akan otomatis berubah setelah kasir arena memverifikasinya.
              </p>
            </div>

            <div className="flex items-center gap-2.5 self-start sm:self-auto">
              <Badge variant="navy">Total: {myBookings.length} Pesanan</Badge>

              {myBookings.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Apakah Anda ingin menghapus semua riwayat booking dari tampilan akun Anda? (Jadwal lapangan & data admin kasir tetap tersimpan aman).')) {
                      clearUserBookingHistory(session.email || session.noHp || session.nama);
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-rose-600 text-xs font-bold border border-rose-200 transition-all cursor-pointer font-bebas tracking-wider uppercase"
                  title="Hapus riwayat booking dari akun saya"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus Riwayat</span>
                </button>
              )}
            </div>
          </div>

          {/* List Kartu Booking */}
          {myBookings.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-brand-bg dark:bg-brand-navy/60 text-brand-dim flex items-center justify-center mx-auto border border-brand-line dark:border-white/10">
                <Calendar className="w-6 h-6" />
              </div>
              <p className="text-xs text-brand-dim dark:text-stone-400">
                Anda belum memiliki pesanan jadwal lapangan.
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => router.push('/jadwal')}
                className="font-bebas text-base uppercase tracking-wider shadow-hard-navy"
              >
                Pilih Lapangan & Booking Sekarang
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {myBookings.map((b) => (
                <div
                  key={b.id}
                  className="p-5 sm:p-6 rounded-xl bg-brand-bg dark:bg-brand-navy/50 border-[1.5px] border-brand-line dark:border-white/10 space-y-4 transition-all hover:border-brand-navy dark:hover:border-brand-lime"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-brand-line dark:border-white/10">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-sm text-brand-ink dark:text-white">
                        #{b.id}
                      </span>
                      <Badge variant="navy">{b.lapanganNama}</Badge>
                    </div>

                    {/* STATUS VERIFIKASI */}
                    <div>
                      {b.status === 'confirmed' ? (
                        <Badge variant="success">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Terkonfirmasi Kasir</span>
                        </Badge>
                      ) : b.status === 'selesai' ? (
                        <Badge variant="blue">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Lunas & Selesai Main</span>
                        </Badge>
                      ) : b.status === 'ditolak' ? (
                        <Badge variant="danger">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>{b.refundStatus === 'selesai_refund' ? 'Ditolak (Refund Selesai)' : 'Pesanan Ditolak'}</span>
                        </Badge>
                      ) : b.status === 'dibatalkan' ? (
                        <Badge variant="neutral">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Dibatalkan</span>
                        </Badge>
                      ) : b.status === 'kadaluarsa' ? (
                        <Badge variant="neutral">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Kadaluarsa (10 Mnt Habis)</span>
                        </Badge>
                      ) : b.status === 'menunggu_pembayaran' ? (
                        <Badge variant="warning">
                          <Clock className="w-3.5 h-3.5 animate-pulse" />
                          <span>Menunggu Pembayaran</span>
                        </Badge>
                      ) : (
                        <Badge variant="blue">
                          <Clock className="w-3.5 h-3.5 animate-spin" />
                          <span>Menunggu Konfirmasi</span>
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Rincian Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-brand-dim block text-[11px]">Tanggal & Waktu Main:</span>
                      <strong className="text-brand-ink dark:text-white">
                        {b.tanggalLabel}
                      </strong>
                      <div className="text-brand-dim dark:text-stone-400 mt-0.5">
                        {b.slots.map((s) => s.jam).join(', ')} ({b.slots.length} Jam)
                      </div>
                    </div>

                    <div>
                      <span className="text-brand-dim block text-[11px]">Skema & Metode Bayar:</span>
                      <strong className="text-brand-ink dark:text-white uppercase font-mono">
                        {b.metodePembayaran} • {b.tipePembayaran === 'lunas' ? 'Lunas (100%)' : 'DP 50%'}
                      </strong>
                      <div className="text-brand-dim dark:text-stone-400 mt-0.5">
                        Total Tagihan: <strong className="text-brand-blue dark:text-brand-lime font-mono">{formatRupiah(b.nominalDibayar)}</strong>
                      </div>
                      {b.sisaPelunasan > 0 && b.status !== 'selesai' && (
                        <span className="text-[11px] text-amber-700 dark:text-amber-400 font-bold block">
                          Sisa Kasir: {formatRupiah(b.sisaPelunasan)}
                        </span>
                      )}
                    </div>

                    <div className="sm:text-right flex sm:flex-col justify-between sm:justify-center items-start sm:items-end gap-2">
                      <div className="flex items-center gap-2">
                        {b.status === 'menunggu_pembayaran' ? (
                          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto sm:justify-end">
                            <Button
                              type="button"
                              variant="primary"
                              size="sm"
                              onClick={() => setPayModalBooking(b)}
                              className="font-bebas text-base uppercase tracking-wider shadow-hard-navy"
                            >
                              <CreditCard className="w-3.5 h-3.5 mr-1" />
                              <span>Bayar Sekarang</span>
                            </Button>
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm('Apakah Anda ingin membatalkan booking ini?')) {
                                  cancelBooking(b.id);
                                }
                              }}
                              className="px-3 py-1.5 rounded-lg text-brand-dim hover:text-rose-600 text-xs font-semibold cursor-pointer"
                            >
                              Batal
                            </button>
                          </div>
                        ) : (
                          <Button
                            type="button"
                            variant="dark"
                            size="sm"
                            onClick={() => setSelectedReceipt(b)}
                            className="font-bebas text-base uppercase tracking-wider"
                          >
                            <Printer className="w-3.5 h-3.5 mr-1" />
                            <span>Lihat E-Receipt</span>
                          </Button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Hapus pesanan #${b.id} dari riwayat akun Anda?`)) {
                              hideBookingForUser(b.id);
                            }
                          }}
                          className="p-2 rounded-lg text-brand-dim hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Hapus dari riwayat akun saya"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Keterangan Status */}
                  <div className="p-3 rounded-lg bg-white dark:bg-brand-navy/60 border border-brand-line dark:border-white/10 text-[11px] text-brand-dim dark:text-stone-300">
                    {b.status === 'confirmed' ? (
                      <span className="text-emerald-700 dark:text-brand-lime font-semibold">
                        ✓ Jadwal sudah disetujui kasir. Tunjukkan kode booking <strong>#{b.id}</strong> di resepsionis venue saat tiba.
                      </span>
                    ) : b.status === 'menunggu_pembayaran' ? (
                      <span className="text-amber-800 dark:text-amber-300 font-semibold flex items-center justify-between flex-wrap gap-2">
                        <span>⏱ Jadwal terkunci 10 menit. Selesaikan pembayaran sebelum batas waktu habis.</span>
                        <button
                          type="button"
                          onClick={() => setPayModalBooking(b)}
                          className="underline text-brand-blue dark:text-brand-lime font-bold cursor-pointer"
                        >
                          Buka Instruksi Bayar →
                        </button>
                      </span>
                    ) : b.status === 'menunggu_verifikasi' ? (
                      <span className="text-brand-blue dark:text-brand-lime font-semibold">
                        ⏳ Staf kasir sedang memeriksa mutasi pembayaran Anda. Status otomatis berubah menjadi "Terkonfirmasi" setelah selesai.
                      </span>
                    ) : b.status === 'selesai' ? (
                      <span className="text-brand-dim font-semibold">
                        ✓ Sesi bermain telah selesai. Terima kasih telah bertanding di FutsalHub Arena!
                      </span>
                    ) : b.status === 'kadaluarsa' ? (
                      <span className="text-brand-dim font-semibold">
                        ✕ Batas waktu pembayaran 10 menit telah habis. Slot telah dibuka kembali.
                      </span>
                    ) : b.status === 'ditolak' ? (
                      <div className="space-y-1">
                        <span className="text-rose-600 font-bold block">
                          ✕ Pesanan ditolak oleh Admin Kasir.
                        </span>
                        {b.refundStatus === 'selesai_refund' ? (
                          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800 font-medium">
                            💰 <strong>Refund Berhasil:</strong> Nominal {formatRupiah(b.refundNominal || b.nominalDibayar)} telah ditransfer via {b.metodePembayaran.toUpperCase()}.
                          </div>
                        ) : (
                          <span className="text-brand-dim">
                            Tidak ada pembayaran yang didebit.
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-brand-dim font-semibold">
                        ✕ Jadwal ini telah dibatalkan.
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 2: PENGATURAN AKUN */}
        <div className="bg-white dark:bg-brand-navy/30 border-[1.5px] border-brand-line dark:border-white/10 rounded-2xl p-6 sm:p-10 shadow-sm space-y-8">
          <div className="border-b border-brand-line dark:border-white/10 pb-6">
            <h2 className="font-bebas text-3xl sm:text-4xl text-brand-ink dark:text-white uppercase tracking-tight leading-none">
              PENGATURAN PROFIL AKUN
            </h2>
            <p className="font-sora text-xs text-brand-dim dark:text-stone-400 mt-1">
              Kelola informasi identitas, kontak kapten tim, dan kredensial akun Anda.
            </p>
          </div>

          {saveSuccessMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border-[1.5px] border-emerald-300 text-xs text-emerald-800 dark:text-emerald-300 font-bold">
              ✓ Profil dan foto berhasil diperbarui!
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-8">
            {/* Foto Profil */}
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-brand-line dark:border-white/10">
              <div className="relative group">
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-[1.5px] border-brand-navy bg-brand-bg dark:bg-brand-navy shadow-hard-navy">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Foto Profil"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-brand-dim m-auto mt-6" />
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-1 right-1 p-1.5 bg-brand-navy text-brand-lime rounded-lg shadow hover:bg-brand-ink transition-colors cursor-pointer"
                  title="Ganti Foto Profil"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              <div className="space-y-1 text-center sm:text-left">
                <h3 className="font-bebas text-lg text-brand-ink dark:text-white uppercase">Foto Profil Akun</h3>
                <p className="text-xs text-brand-dim dark:text-stone-400 max-w-xs">
                  Format berkas JPG, PNG, atau WebP. Foto akan muncul di navigasi atas.
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-1 text-xs font-bold text-brand-blue dark:text-brand-lime hover:underline cursor-pointer"
                >
                  Pilih Berkas Dari Komputer
                </button>
              </div>
            </div>

            {/* Input Data Diri */}
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold text-brand-ink dark:text-stone-200 uppercase tracking-wider block">
                  Nama Lengkap / Tim
                </label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-brand-dim absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-brand-navy/50 border-[1.5px] border-brand-line dark:border-white/10 rounded-xl text-xs font-semibold text-brand-ink dark:text-white outline-none focus:border-brand-blue"
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold text-brand-ink dark:text-stone-200 uppercase tracking-wider block">
                  Hak Akses / Peran
                </label>
                <div className="relative flex items-center">
                  <Shield className="w-4 h-4 text-brand-dim absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={session.role.toUpperCase()}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 bg-brand-bg dark:bg-brand-navy/20 border-[1.5px] border-brand-line dark:border-white/10 rounded-xl text-xs font-bold text-brand-dim cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold text-brand-ink dark:text-stone-200 uppercase tracking-wider block">
                  Alamat Email
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-brand-dim absolute left-3.5 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-brand-navy/50 border-[1.5px] border-brand-line dark:border-white/10 rounded-xl text-xs font-semibold text-brand-ink dark:text-white outline-none focus:border-brand-blue"
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold text-brand-ink dark:text-stone-200 uppercase tracking-wider block">
                  Nomor WhatsApp
                </label>
                <div className="relative flex items-center">
                  <Phone className="w-4 h-4 text-brand-dim absolute left-3.5 pointer-events-none" />
                  <input
                    type="tel"
                    value={noHp}
                    onChange={(e) => setNoHp(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-brand-navy/50 border-[1.5px] border-brand-line dark:border-white/10 rounded-xl text-xs font-semibold text-brand-ink dark:text-white outline-none focus:border-brand-blue"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                type="submit"
                disabled={isSaving}
                variant="primary"
                size="md"
                className="font-bebas text-lg tracking-wider uppercase shadow-hard-navy"
              >
                {isSaving ? (
                  <span className="w-4 h-4 border-2 border-brand-navy/30 border-t-brand-navy rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-1" />
                    <span>Simpan Perubahan Akun</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>

      {/* MODAL E-RECEIPT */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-brand-navy/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white dark:bg-brand-navy w-full max-w-lg rounded-2xl shadow-hard-navy-lg border-[1.5px] border-brand-line dark:border-white/10 overflow-hidden my-auto p-6 sm:p-8 space-y-6 text-brand-ink dark:text-white">
            
            <div className="flex items-center justify-between border-b border-brand-line dark:border-white/10 pb-3">
              <span className="font-bebas text-lg tracking-wider uppercase">
                Bukti E-Receipt Resmi FutsalHub
              </span>
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="p-1 rounded-lg text-brand-dim hover:text-brand-ink dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Box Struk */}
            <div className="p-6 bg-white border-[1.5px] border-brand-line rounded-xl font-mono text-xs space-y-4 shadow-sm text-stone-900">
              <div className="text-center space-y-1 border-b-2 border-dashed border-stone-300 pb-4">
                <h3 className="font-bebas text-xl tracking-tight text-brand-navy">
                  FUTSALHUB ARENA — TANGERANG SELATAN
                </h3>
                <p className="text-[10px] text-stone-500 font-sora">
                  E-Receipt Tanda Bukti Pemesanan Lapangan Resmi Standar FIFA
                </p>
              </div>

              <div className="space-y-1 text-[11px] border-b border-stone-200 pb-3">
                <div className="flex justify-between">
                  <span>ID Booking:</span>
                  <span className="font-bold">#{selectedReceipt.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className={`font-bold uppercase ${selectedReceipt.status === 'confirmed' ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {selectedReceipt.status === 'confirmed' ? 'TERKONFIRMASI ADMIN' : 'MENUNGGU VERIFIKASI'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Nama Pemesan:</span>
                  <span className="font-bold">{selectedReceipt.namaPenyewa}</span>
                </div>
                <div className="flex justify-between">
                  <span>Kontak:</span>
                  <span>{selectedReceipt.noHp}</span>
                </div>
              </div>

              <div className="space-y-1 text-[11px] border-b border-stone-200 pb-3">
                <div className="flex justify-between">
                  <span>Venue:</span>
                  <span className="font-bold">{selectedReceipt.lapanganNama}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tanggal Main:</span>
                  <span className="font-bold">{selectedReceipt.tanggalLabel}</span>
                </div>
                <div className="pt-1">
                  <span className="text-stone-500 block text-[10px]">Slot Jam:</span>
                  {selectedReceipt.slots.map((s) => (
                    <div key={s.jam} className="flex justify-between pl-2">
                      <span>• {s.jam}</span>
                      <span>{formatRupiah(s.harga)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1 text-[11px] border-b-2 border-dashed border-stone-300 pb-3">
                <div className="flex justify-between font-bold text-sm text-stone-900">
                  <span>TOTAL BIAYA:</span>
                  <span>{formatRupiah(selectedReceipt.totalAkhir)}</span>
                </div>
                <div className="flex justify-between text-brand-blue font-bold">
                  <span>DIBAYAR ({selectedReceipt.tipePembayaran.toUpperCase()}):</span>
                  <span>{formatRupiah(selectedReceipt.nominalDibayar)}</span>
                </div>
                {selectedReceipt.sisaPelunasan > 0 && (
                  <div className="flex justify-between text-amber-800 font-bold">
                    <span>SISA DI KASIR:</span>
                    <span>{formatRupiah(selectedReceipt.sisaPelunasan)}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-500 pt-1">
                  <span>Metode:</span>
                  <span className="uppercase">{selectedReceipt.metodePembayaran} ({selectedReceipt.kodeBayar})</span>
                </div>
              </div>

              <div className="text-center space-y-1 pt-1 text-[10px] text-stone-500 font-sora">
                <p className="font-bold text-stone-800">
                  Tunjukkan E-Receipt ini di meja resepsionis saat kedatangan.
                </p>
                <p>Terima kasih atas kunjungan Anda!</p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-1">
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-2.5 rounded-xl border border-brand-line text-brand-dim hover:text-brand-ink text-xs font-semibold cursor-pointer"
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
                <span>Cetak / Simpan PDF</span>
              </Button>
            </div>

          </div>
        </div>
      )}

      {/* POPUP INSTRUKSI PEMBAYARAN */}
      <PaymentInstructionModal
        isOpen={!!payModalBooking}
        booking={payModalBooking}
        onClose={() => setPayModalBooking(null)}
        onPaymentConfirmed={() => {
          setAllBookings(getAllBookings());
          setPayModalBooking(null);
        }}
      />

      <Footer />
    </div>
  );
}
